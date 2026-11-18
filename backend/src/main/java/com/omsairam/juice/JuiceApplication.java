package com.omsairam.juice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class JuiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(JuiceApplication.class, args);
    }
}
