package com.prototype.occupi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**

 The OccupiApplication class is the entry point for the Occupi application, which is a Spring Boot application
 that provides a REST API for managing devices. It uses Spring Boot's autoconfiguration to configure the
 application and starts the embedded Tomcat web server to serve HTTP requests. The main method of this class
 starts the Spring Boot application by calling the static run method of the SpringApplication class and
 passing my custom OccupiApplication class and command-line arguments as arguments.
 */
@SpringBootApplication
public class OccupiApplication {


	/**
	 No-args constructor for OccupiApplication.
	 */
	public OccupiApplication(){

	}

	/**
	 No-args constructor for the main Spring Boot Application.
	 @param args accepts OccupiApplication as an argument to run the Spring Boot Application.
	 */
	public static void main(String[] args) {
		SpringApplication.run(OccupiApplication.class, args);
	}
}
