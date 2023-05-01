import configparser
import os
import platform
import time
from datetime import datetime
import requests
import json
import bluetooth

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
    if platform.system() == 'Windows':
        nearby_devices = bluetooth.discover_devices(lookup_names=True)
    else:
        service = DiscoveryService()
        nearby_devices = service.discover(2)

    print("Discovering devices...")
    for bAddr, name in nearby_devices:
        # Get current timestamp
        now = datetime.now().isoformat()

        # Check the operating system and use the appropriate method to retrieve the RSSI value.
        if platform.system() == 'Windows':
            rssi_dbm = float(50)
            distance = 10 ** ((tx_power - rssi_dbm - rssi_0) / (10 * n))
            # Friis Equation

        else:
            # Use the lookup_name and read_rssi functions to retrieve the RSSI value.
            rssi = bluetooth.read_rssi(bAddr)
            rssi_dbm = float(rssi)
            distance = 10 ** ((tx_power - rssi_dbm - rssi_0) / (10 * n))

        # Check if device already exists in the API database
        query = f"{endpoint}?mac={bAddr}"
        response = session.get(query)
        devices = json.loads(response.content)
        device_exists = False
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
