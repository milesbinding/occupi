import configparser
import os
import platform
import time
from datetime import datetime

import bluetooth
import mysql.connector

# Define time interval to check for device presence
INTERVAL = 5 * 60  # 5 minutes in seconds

# Constants for Friis transmission equation
freq = 2400  # MHz
tx_power = 0  # dBm
rssi_0 = -53  # dBm
n = 2  # path loss exponent

# Read MySQL database configuration from config.ini file or create it with default values if it doesn't exist
config = configparser.ConfigParser()
if os.path.isfile('config.ini'):
    config.read('config.ini')
else:
    config['MYSQL'] = {'host': 'localhost', 'user': 'root', 'password': 'password', 'database': 'database',
                       'port': '3306'}
    with open('config.ini', 'w') as configfile:
        config.write(configfile)

# Read MySQL database configuration from config.ini file
config = configparser.ConfigParser()
config.read('config.ini')
host = config['MYSQL']['host']
user = config['MYSQL']['user']
port = config['MYSQL']['port']
password = config['MYSQL']['password']
database = config['MYSQL']['database']

# Connect to MySQL database
mydb = mysql.connector.connect(
    host=host,
    user=user,
    password=password,
    database=database,
    port=port
)
cursor = mydb.cursor()
cursor.execute("CREATE DATABASE IF NOT EXISTS bindingm")
cursor.execute("USE bindingm")
cursor.execute(
    "CREATE TABLE IF NOT EXISTS occupancy (id INT AUTO_INCREMENT PRIMARY KEY, mac VARCHAR(255) UNIQUE, time_stamp DATETIME, distance VARCHAR(255), counter INT)")
print("Creating occupancy table.")
# Bluetooth device detection
while True:
    nearby_devices = bluetooth.discover_devices()
    print("Discovering devices...")
    for bAddr in nearby_devices:
        # Get current timestamp
        now = datetime.now()
        current_time = now.strftime("%Y-%m-%d %H:%M:%S")

        # Get RSSI value and calculate distance using Friis transmission equation
        # Replace <device_address> with the Bluetooth address of the device you want to read the RSSI value from.
        address = bAddr

        # Check the operating system and use the appropriate method to retrieve the RSSI value.
        if platform.system() == 'Windows':
            raise NotImplementedError("The PyBluez library is not compatible with Windows.")
            continue
        else:
            # Use the lookup_name and read_rssi functions to retrieve the RSSI value.
            name = bluetooth.lookup_name(address, timeout=5)
            rssi = bluetooth.read_rssi(address)
            print(f"Device name: {name}")
            print(f"RSSI value: {rssi} dBm")

        rssi_dbm = float(rssi)
        distance = 10 ** ((tx_power - rssi_dbm - rssi_0) / (10 * n))

        # Check if device already exists in the database
        query = "SELECT mac FROM occupancy WHERE mac = %s"
        values = (bAddr,)
        cursor.execute(query, values)
        result = cursor.fetchone()

        if result is None:
            # Insert MAC address, timestamp, and distance into MySQL database using parameterized query
            query = "INSERT INTO occupancy (mac, time_stamp, distance, counter) VALUES (%s, %s, %s, %s)"
            values = (bAddr, current_time, distance, 0)
            cursor.execute(query, values)
            mydb.commit()
            print("Device added: ", bAddr, "Distance:", distance, "meters")
        else:
            print("Device ", bAddr, "is already in the database!")

    # Check database for devices that have not been seen for 5 minutes and remove them
    cursor = mydb.cursor()
    query = "SELECT mac, time_stamp, counter FROM occupancy"
    cursor.execute(query)
    results = cursor.fetchall()
    for result in results:
        mac = result[0]
        last_seen = result[1]
        last_seen_time = datetime.strptime(str(last_seen), "%Y-%m-%d %H:%M:%S")
        counter = result[2]
        elapsed_time = now - last_seen_time
        if elapsed_time.total_seconds() > INTERVAL:
            query = "DELETE FROM occupancy WHERE mac = %s"
            values = (mac,)
            cursor.execute(query, values)
            mydb.commit()
            print("Device removed: ", mac)
        else:
            counter += 1
            query = "UPDATE occupancy SET counter = %s WHERE mac = %s"
            values = (counter, mac)
            cursor.execute(query, values)
            mydb.commit()
            print("Device counter updated: ", mac, counter)

    time.sleep(10)
    print("Sleeping!")
