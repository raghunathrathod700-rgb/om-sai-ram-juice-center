package com.omsairam.juice.service;

import com.omsairam.juice.config.Props;
import com.omsairam.juice.web.ApiException;
import org.springframework.stereotype.Service;

/**
 * Server-side check of the delivery radius.
 * Only enforceable when the shop's GPS position is configured (shop.latitude / shop.longitude);
 * otherwise the site runs the demo address check in the browser and the server cannot verify distance.
 */
@Service
public class DeliveryService {
    private final Props.Shop shop;

    public DeliveryService(Props.Shop shop) {
        this.shop = shop;
    }

    public void verify(Double latitude, Double longitude) {
        if (shop.latitude() == null || shop.longitude() == null) {
            return; // demo mode
        }
        if (latitude == null || longitude == null) {
            throw ApiException.badRequest("Please allow location access so we can confirm you are within "
                    + shop.radiusMeters() + " meters of the shop.");
        }
        double distance = haversineMeters(shop.latitude(), shop.longitude(), latitude, longitude);
        if (distance > shop.radiusMeters()) {
            throw ApiException.badRequest("Sorry, delivery is available only within " + shop.radiusMeters() + " meters.");
        }
    }

    static double haversineMeters(double lat1, double lng1, double lat2, double lng2) {
        double r = 6_371_000;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLng = Math.toRadians(lng2 - lng1);
        double h = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
        return 2 * r * Math.asin(Math.sqrt(h));
    }
}
