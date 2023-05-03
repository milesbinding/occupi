package com.prototype.occupi.utils;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 The CorsConfig class is a Spring configuration class that configures Cross-Origin Resource Sharing (CORS) for
 the REST API. It defines a bean of type WebMvcConfigurer that adds a mapping for all endpoints to allow cross-origin
 requests from any origin, with the HTTP methods GET, POST, DELETE, and PATCH, and with any headers.
 */
@Configuration
public class CorsConfig {

    /**
     No-args constructor for CorsConfig.
     */
    public CorsConfig(){

    }

    /**
     * Creates a WebMvcConfigurer object that configures CORS for all endpoints.
     *
     * @return a WebMvcConfigurer object that configures CORS for all endpoints
     */
    @Bean // Indicates that this method returns a bean to be managed by Spring
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // Adds a mapping for all endpoints
                        .allowedOrigins("*") // Allows requests from any origin
                        .allowedMethods("GET", "POST", "DELETE","PATCH") // Allows the specified HTTP methods
                        .allowedHeaders("*"); // Allows any request headers
            }
        };
    }
}
