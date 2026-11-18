package com.omsairam.juice.config;

import java.math.BigDecimal;
import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;

/** Typed access to application.properties (all values can come from environment variables). */
public final class Props {
    private Props() {}

    @ConfigurationProperties(prefix = "app.jwt")
    public record Jwt(String secret, @DefaultValue("72") long expiryHours) {}

    @ConfigurationProperties(prefix = "app.cors")
    public record Cors(@DefaultValue("http://localhost:5173") List<String> allowedOrigins) {}

    @ConfigurationProperties(prefix = "app.upload")
    public record Upload(@DefaultValue("./uploads") String dir) {}

    @ConfigurationProperties(prefix = "app.admin")
    public record Admin(
            String email,
            String password,
            @DefaultValue("Shop Admin") String name,
            @DefaultValue("0000000000") String mobile) {}

    @ConfigurationProperties(prefix = "razorpay")
    public record Razorpay(String keyId, String keySecret) {
        public boolean enabled() {
            return keyId != null && !keyId.isBlank() && keySecret != null && !keySecret.isBlank();
        }
    }

    @ConfigurationProperties(prefix = "shop")
    public record Shop(
            @DefaultValue("0") BigDecimal deliveryFee,
            @DefaultValue("500") int radiusMeters,
            Double latitude,
            Double longitude) {}
}
