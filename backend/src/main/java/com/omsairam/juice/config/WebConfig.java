package com.omsairam.juice.config;

import java.nio.file.Path;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/** Serves uploaded product photos from the upload folder at /uploads/**. */
@Configuration
public class WebConfig implements WebMvcConfigurer {
    private final Props.Upload upload;

    public WebConfig(Props.Upload upload) {
        this.upload = upload;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String location = Path.of(upload.dir()).toAbsolutePath().normalize().toUri().toString();
        if (!location.endsWith("/")) {
            location += "/";
        }
        registry.addResourceHandler("/uploads/**").addResourceLocations(location).setCachePeriod(3600);
    }
}
