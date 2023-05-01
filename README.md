# Occupi - Estimating Occupancy with Raspberry Pi

This project aims to measure the occupancy of a room using a Raspberry Pi, Bluetooth, and Python. The collected data is extracted and stored in a Spring Boot + Maven API written in Java, which can be accessed via a React Native JavaScript mobile front-end.

## Requirements

- Raspberry Pi or Windows 10-11-based system with Bluetooth capability
- [Python 3.11](https://www.python.org/downloads/) (preinstalled on Raspberry Pi OS)
- [Java 17](https://jdk.java.net/archive/)
- [Node.js](https://nodejs.org/en)
- MySQL 5+ Database

## Dependencies
- [Windows 10 SDK](https://developer.microsoft.com/en-us/windows/downloads/windows-sdk/)
## Installation

1. Clone the repository to your local machine.
2. Install Python 3 and the required packages.
3. Install Java 17. Personally, I like to use OpenJDK.
4. Install Node.js, Expo and the required dependencies.

## Usage

1. Run the Spring Boot API by running the .jar release or building the API yourself in an IDE of your choice, using the pom.xml file.
2. Run the Python script `main.py` on the Raspberry Pi to start collecting occupancy data. You can use Thonny (comes preinstalled on Raspberry Pi OS), or just run the script in a terminal by using `python main.py`.
3. Open the React Native app by navigating to `http://localhost:19006` to view the app and the data.

## Acknowledgments

- This project was inspired by my time working as a placement student at Tyrrell Systems Ltd.
- The backend code makes use of PyBluez's `bluetooth`  library which can be found at https://github.com/pybluez/pybluez.
- The Spring Boot API was developed with the use of the Spring Initializr which can be found at https://start.spring.io/.
- The React Native app was built with the help of Expo CLI, which can be found here: https://expo.dev/tools.

## License

This project is licensed under the GNU General Public License as published by the Free Software Foundation.

## Contact

If you have any questions or comments about this project, please feel free to contact me at mileslive@live.co.uk.