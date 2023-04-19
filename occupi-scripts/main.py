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

if platform.system() == 'Windows':
    print("The PyBluez library is not compatible with Windows. Using default values for RSSI.")

# Bluetooth device detection
while True:
    nearby_devices = bluetooth.discover_devices()
    print("Discovering devices...")
    for bAddr in nearby_devices:
        # Get current timestamp
        now = datetime.now().isoformat()

        # Get RSSI value and calculate distance using Friis transmission equation
        address = bAddr

        # Check the operating system and use the appropriate method to retrieve the RSSI value.
        if platform.system() == 'Windows':
            rssi_dbm = float(50)
            distance = 10 ** ((tx_power - rssi_dbm - rssi_0) / (10 * n))
            # Friis Equation

        else:
            # Use the lookup_name and read_rssi functions to retrieve the RSSI value.
            name = bluetooth.lookup_name(address, timeout=5)
            rssi = bluetooth.read_rssi(address)
            print(f"Device name: {name}")
            print(f"RSSI value: {rssi} dBm")
            rssi_dbm = float(rssi)
            distance = 10 ** ((tx_power - rssi_dbm - rssi_0) / (10 * n))

        # Check if device already exists in the API database
        query = f"{endpoint}?mac={address}"
        response = session.get(query)
        devices = json.loads(response.content)
        device_exists = False
        for device in devices:
            if device['mac'] == bAddr:
                device_exists = True
                break

        if not device_exists:
            # Insert device into API database
            data = {'mac': bAddr, 'time_stamp': now, 'distance': distance, 'counter': 0}
            headers = {'Content-Type': 'application/json'}
            response = session.post(endpoint, data=json.dumps(data), headers=headers)
            if response.status_code == 200:
                print("Device added: ", bAddr, "Distance:", distance, "meters")
        elif device_exists:
            print("Device ", bAddr, "is already in the API database! Updating counter & time...")
            id = device['id']
            last_seen = device['time_stamp']
            last_seen_time = datetime.fromisoformat(last_seen)
            counter = device['counter']
            elapsed_time = datetime.fromisoformat(now) - last_seen_time
            counter += 1
            # Make request to server to update device counter
            data = {'id': id, 'mac': bAddr, 'distance': distance, 'counter': counter, 'time_stamp': now}
            headers = {'Content-Type': 'application/json'}
            response = requests.put(endpoint, data=json.dumps(data), headers=headers)
            if response.status_code == 200:
                print("Device counter & time updated: ", bAddr, counter)

            if elapsed_time.total_seconds() > INTERVAL:
                # Make request to server to delete device
                headers = {'Content-Type': 'application/json'}
                data = {'mac': bAddr}
                response = requests.delete(endpoint, data=json.dumps(data), headers=headers)
                if response.status_code == 204:
                    print("Device removed: ", bAddr)

    print("Sleeping!")
    time.sleep(10)
