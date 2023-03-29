import bluetooth
from datetime import datetime
import mysql.connector
import hashlib
import secrets
import configparser
import math
import time
import os

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
    config['MYSQL'] = {'host': 'localhost', 'user': 'root', 'password': 'password', 'database': 'database', 'port': '3306'}
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
cursor.execute("CREATE TABLE IF NOT EXISTS occupancy (id INT AUTO_INCREMENT PRIMARY KEY, encrypted_mac VARCHAR(255) UNIQUE, salt VARCHAR(255), time_stamp DATETIME, distance VARCHAR(255))")

# Bluetooth device detection
while True:
    nearby_devices = bluetooth.discover_devices()

    for bdaddr in nearby_devices:
        # Get current timestamp
        now = datetime.now()
        current_time = now.strftime("%Y-%m-%d %H:%M:%S")

        # Get RSSI value and calculate distance using Friis transmission equation
        rssi = -50 #placeholder
        rssi_dbm = float(rssi)
        distance = 10 ** ((tx_power - rssi_dbm - rssi_0) / (10 * n))

        # Generate salt
        salt = secrets.token_hex(16)

        # Encrypt MAC address with salt
        encrypted_mac = hashlib.sha256((bdaddr + salt).encode()).hexdigest()

        # Insert encrypted MAC address, salt, timestamp, and distance into MySQL database using parameterized query
        cursor = mydb.cursor()
        query = "INSERT INTO occupancy (encrypted_mac, salt, time_stamp, distance) VALUES (%s, %s, %s, %s)"
        values = (encrypted_mac, salt, current_time, distance)
        cursor.execute(query, values)
        mydb.commit()

        print("Device detected: ", bdaddr, "Distance:", distance, "meters")

    # Check database for devices that have not been seen for 5 minutes and remove them
    cursor = mydb.cursor()
    query = "SELECT encrypted_mac, time_stamp FROM occupancy"
    cursor.execute(query)
    results = cursor.fetchall()
    for result in results:
        mac = result[0]
        last_seen = result[1]
        last_seen_time = datetime.strptime(str(last_seen), "%Y-%m-%d %H:%M:%S")
        elapsed_time = datetime.now() - last_seen_time
        if elapsed_time.total_seconds() > 300:
            query = "DELETE FROM occupancy WHERE encrypted_mac = %s"
            values = (mac,)
            cursor.execute(query, values)
            mydb.commit()
            print("Device removed: ", mac)

    time.sleep(10)

mydb.close()
