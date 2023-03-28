import bluetooth
import datetime
import mysql.connector

# MySQL database configuration
mydb = mysql.connector.connect(
    host="localhost",
    user="username",
    password="password",
    database="database_name"
)

# Bluetooth device detection
nearby_devices = bluetooth.discover_devices()

for bdaddr in nearby_devices:
    # Get current timestamp
    current_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # Insert MAC address and timestamp into MySQL database
    cursor = mydb.cursor()
    query = "INSERT INTO occupancy (mac_address, timestamp) VALUES (%s, %s)"
    values = (bdaddr, current_time)
    cursor.execute(query, values)
    mydb.commit()

    print("Device detected: ", bdaddr)

mydb.close()
