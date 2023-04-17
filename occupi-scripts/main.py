import configparser
import os
import platform
import time
from datetime import datetime
import requests
import json
import bluetooth

# Define time interval to check for device presence
INTERVAL = 5 * 60  # 5 minutes in seconds

# Constants for Friis transmission equation
freq = 2400  # MHz
tx_power = 0  # dBm
rssi_0 = -53  # dBm
n = 2  # path loss exponent

# Read API endpoint from config.ini file or create it with default values if it doesn't exist
config = configparser.ConfigParser()
if os.path.isfile('config.ini'):
    config.read('config.ini')
else:
    config['API'] = {'endpoint': 'http://localhost:8080/devices'}
    with open('config.ini', 'w') as configfile:
        config.write(configfile)

# Read API endpoint and authentication details from config.ini file
config = configparser.ConfigParser()
config.read('config.ini')
endpoint = config['API']['endpoint']

# Set up HTTP session
session = requests.Session()

# Bluetooth device detection
while True:
    nearby_devices = bluetooth.discover_devices()
    print("Discovering devices...")
    for bAddr in nearby_devices:
        # Get current timestamp
        now = datetime.now()
        current_time = now.strftime("%Y-%m-%d %H:%M:%S")

        # Get RSSI value and calculate distance using Friis transmission equation
        address = bAddr

        # Check the operating system and use the appropriate method to retrieve the RSSI value.
        if platform.system() == 'Windows':
            print("The PyBluez library is not compatible with Windows. Using default values for RSSI.")
            rssi_dbm = float(50)
            distance = 10 ** ((tx_power - rssi_dbm - rssi_0) / (10 * n)) 
            #Friis Equation

        else:
            # Use the lookup_name and read_rssi functions to retrieve the RSSI value.
            name = bluetooth.lookup_name(address, timeout=5)
            rssi = bluetooth.read_rssi(address)
            print(f"Device name: {name}")
            print(f"RSSI value: {rssi} dBm")
            rssi_dbm = float(rssi)
            distance = 10 ** ((tx_power - rssi_dbm - rssi_0) / (10 * n))

        # Check if device already exists in the API database
        query = f"{endpoint}?mac={bAddr}"
        response = session.get(query)
        device = json.loads(response.content)
        
        if not device:
            # Insert device into API database
            data = {'mac': bAddr, 'time_stamp': current_time, 'distance': distance, 'counter': 0}
            headers = {'Content-Type': 'application/json'}
            response = session.post(endpoint, data=json.dumps(data), headers=headers)
            if response.status_code == 200:
                print("Device added: ", bAddr, "Distance:", distance, "meters")

        else:
            print("Device ", bAddr, "is already in the API database!")

    # Make request to server to get device information
    response = requests.get(endpoint)
    devices = json.loads(response.text)

    # Check database for devices that have not been seen for 5 minutes and remove them
    for device in devices:
        mac = device['mac']
        last_seen = device['time_stamp']
        last_seen_time = datetime.strptime(str(last_seen), "%Y-%m-%d %H:%M:%S")
        counter = device['counter']
        elapsed_time = now - last_seen_time
        if elapsed_time.total_seconds() > INTERVAL:
            # Make request to server to delete device
            delete_url = endpoint + str(mac) + "/"
            response = requests.delete(delete_url, headers=headers)
            if response.status_code == 204:
                print("Device removed: ", mac)
        else:
            counter += 1
            # Make request to server to update device counter
            update_url = endpoint + str(mac) + "/"
            data = {'counter': counter, 'time_stamp': current_time}
            response = requests.patch(update_url, data=json.dumps(data), headers=headers)
            if response.status_code == 200:
                print("Device counter updated: ", mac, counter)

    print("Sleeping!")
    time.sleep(10)