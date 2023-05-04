import configparser
import os
import struct
import time
from datetime import datetime
import requests
import json
import bluetooth
import tkinter as tk

# Constants for Friis transmission equation
freq = 2400  # MHz
tx_power = 0  # dBm
rssi_0 = -53  # dBm
n = 2  # path loss exponent
rssi = 0

# Read API endpoint from config.ini file or create it with default values if it doesn't exist
config = configparser.ConfigParser()
if os.path.isfile('config.ini'):
    config.read('config.ini')
else:
    config['API'] = {'endpoint': 'http://yuicasualgrounds.tplinkdns.com:8080/devices'}
    with open('config.ini', 'w') as configfile:
        config.write(configfile)

# Read API endpoint and authentication details from config.ini file
config = configparser.ConfigParser()
config.read('config.ini')
endpoint = config['API']['endpoint']

# Set up HTTP session
session = requests.Session()


def read_rssi(sock, address):
    """returns the RSSI value or -1 on failure"""
    # save current filter
    old_filter = sock.getsockopt(bluetooth.SOL_HCI, bluetooth.HCI_FILTER, 14)

    # Set up a filter to receive only RSSI-related events
    flt = bluetooth.hci_filter_new()
    bluetooth.hci_filter_all_events(flt)
    bluetooth.hci_filter_set_ptype(flt, bluetooth.HCI_EVENT_PKT)
    bluetooth.hci_filter_set_event(flt, bluetooth.EVT_LE_META_EVENT)
    sock.setsockopt(bluetooth.SOL_HCI, bluetooth.HCI_FILTER, flt)

    # Send the command to read RSSI value
    cmd_pkt = struct.pack("<BB", 0x02, 0x05) + \
              struct.pack("<6s", bytes.fromhex(address.replace(':', '')))
    bluetooth.hci_send_req(sock, bluetooth.OGF_LE_CTL, bluetooth.OCF_LE_READ_REMOTE_USED_FEATURES, cmd_pkt)

    pkt = sock.recv(255)

    # Extract the RSSI value from the response packet
    rssi = -1
    if pkt[0] == 0x3E:
        pkt_data = pkt[13:15]
        rssi = struct.unpack("b", pkt_data)[0]

    # restore old filter
    sock.setsockopt(bluetooth.SOL_HCI, bluetooth.HCI_FILTER, old_filter)

    return rssi


def on_pairing_code_entry(address):
    pairing_code = pairing_code_entry.get()

    # Create a socket object using the bluetooth module
    sock = bluetooth.BluetoothSocket(bluetooth.RFCOMM)

    # Create a connection to the local Bluetooth device
    port = 1
    sock.connect((address, port))
    sock.send(pairing_code)

    # Pass the socket object to the read_rssi() function
    global rssi
    rssi = read_rssi(sock, address)

    # Close the connection
    sock.close()

    pairing_code_window.destroy()


# Bluetooth device detection
while True:
    print("This is the Linux version of the script. RSSI reading enabled.")
    print("Discovering devices...")
    nearby_devices = bluetooth.discover_devices(lookup_names=True)
    print(nearby_devices)
    for bAddr, name in nearby_devices:
        # Get current timestamp
        now = datetime.now().isoformat()

        # Create a GUI window to enter the pairing code
        pairing_code_window = tk.Tk()
        pairing_code_window.title("Enter Pairing Code")
        pairing_code_label = tk.Label(pairing_code_window, text="Please enter the pairing code:")
        pairing_code_label.pack()
        pairing_code_entry = tk.Entry(pairing_code_window, show="*")
        pairing_code_entry.pack()
        pairing_code_button = tk.Button(pairing_code_window, text="OK", command=on_pairing_code_entry(bAddr))
        pairing_code_button.pack()

        pairing_code_window.mainloop()

        # Use the lookup_name and read_rssi functions to retrieve the RSSI value.
        rssi_dbm = float(rssi)
        distance = 10 ** ((tx_power - rssi_dbm - rssi_0) / (10 * n))

        # Check if device already exists in the API database
        query = f"{endpoint}?mac={bAddr}"
        response = session.get(query)
        devices = json.loads(response.content)
        device_exists = False
        if isinstance(devices, str):  # In the case the dictionary of devices is interpreted as an int indices
            devices = json.loads(devices)
        for device in devices:
            if device['mac'] == bAddr:
                device_exists = True
                break

        if not device_exists:
            # Insert device into API database
            data = {'name': name, 'mac': bAddr, 'first_time_stamp': now, 'current_time_stamp': now,
                    'distance': distance, 'counter': 1}
            headers = {'Content-Type': 'application/json'}
            response = session.post(endpoint, data=json.dumps(data), headers=headers)
            if response.status_code == 200:
                print("Device added: ", name, "Distance:", distance, "meters")
        else:
            print("Device ", name, "is already in the API database! Updating counter & time...")
            counter = device['counter']
            first_time_stamp = device['first_time_stamp']
            counter += 1
            # Make request to server to update device counter and time
            data = {'counter': counter, 'current_time_stamp': now, 'first_time_stamp': first_time_stamp}
            headers = {'Content-Type': 'application/json'}
            response = session.patch(endpoint + f"/{device['mac']}", data=json.dumps(data), headers=headers)
            if response.status_code == 200:
                print("Device counter & time updated: ", name, counter)

    print("Sleeping!")
    time.sleep(30)
