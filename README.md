# Occupi - Estimating Occupancy with Raspberry Pi

This project aims to measure the occupancy of a room using a Raspberry Pi, Bluetooth, and Python. The collected data is extracted and stored in a Spring Boot + Maven API written in Java, which can be accessed via a React Native JavaScript mobile front-end.

## Requirements

- Raspberry Pi or Windows 10-11-based system with Bluetooth capability (USB dongles are supported).
- [Python 3.11](https://www.python.org/downloads/) (preinstalled on Raspberry Pi OS)
- [Java 17](https://jdk.java.net/archive/)
- [Node.js](https://nodejs.org/en) (for running the front-end mobile app on a computer).
- [Expo CLI](https://expo.dev/tools)
- MySQL 5+ Database

## Dependencies
- [Windows 10 SDK](https://developer.microsoft.com/en-us/windows/downloads/windows-sdk/) (if using Windows 10 or 11-based system).

## Python Packages
These packages will need to be installed using `pip install <package name>`. Ensure Python is present on your system's PATH.
- `bluetooth`, a part of [PyBluez](https://pybluez.readthedocs.io/en/latest/). Used for accessing Bluetooth system resources. Install using `pip install pybluez`.
- `requests`, a simple HTTP request library.

The following packages are built-in to Python, and such do not require installation with `pip`.

- `configparser` 
- `platform`
- `datetime`
- `tkinter`
- `struct`
- `json`
- `time`
- `os`

## Installation

1. Clone the repository to your local machine.
2. Install Python 3 and the required packages, ensuring it is in your system `PATH`.
3. Install JDK 17, and ensure it is in your system `PATH`.
4. Install Node.js, and open the Node.js command prompt (not the normal terminal) on Windows. For Linux, just use `npm` in your terminal of choice.
5. Install Expo CLI using `npm install --global expo-cli`.
6. Change the working directory to `occupi-frontend` using `cd`, and run `npm install` to install the mobile app environment. It will handle installing all the dependencies in `node_modules`.

## Usage

1. Run the Spring Boot API by running the .jar (`java -jar <app_name>-<app_version>-SNAPSHOT.jar`) release or building the API yourself in an IDE of your choice, using the `pom.xml` file. Running the API in an IDE such as Eclipse or IntelliJ IDEA will allow you to change the database URL and password in `application.properties`, so this method is preferred.
However, note that distance calculation is unavailable in Windows, and in Linux it requires you to pair with the device through the GUI.
2. Run the Python script `main.py` on the Raspberry Pi to start collecting occupancy data. You can use Thonny (comes preinstalled on Raspberry Pi OS), any Python IDE of your choice on a Windows system, or just run the script in a terminal by using `python main.py`.
3. Start the React Native app by entering `$env:NODE_OPTIONS = "--openssl-legacy-provider"` and `npx expo start --web` into the Node.js terminal. Open your browser and  navigate to `http://localhost:19006` to view the app.

## Acknowledgments

- This project was inspired by my time working as a placement student at [Tyrrell Systems Ltd](https://tyrrellsystems.com/).
- The MySQL database was provided by MMU's Mudfoot servers.
- The backend code makes use of PyBluez's `bluetooth`  library which can be found at https://github.com/pybluez/pybluez.
- The Spring Boot API was developed with the use of the Spring Initializr which can be found at https://start.spring.io/.
- The React Native app was built with the help of Expo CLI, which can be found here: https://expo.dev/tools.
- Thank you to Dr. Tooska Dargahi for guidance and support during the course of the project, as well as allowing me to come to her at very short notice to propose this project...!
- Thanks to my partner Jade Segler, along with my family and friends for unwavering support throughout the duration of my degree.

## License

This project is licensed under the GNU General Public License as published by the Free Software Foundation.

## Contact

If you have any questions or comments about this project, or if I have not provided enough information on how to build the project, please feel free to contact me at mileslive@live.co.uk.