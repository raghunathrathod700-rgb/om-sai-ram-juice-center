package com.omsairam.juice.seed;

import com.omsairam.juice.config.Props;
import com.omsairam.juice.model.AppUser;
import com.omsairam.juice.model.Category;
import com.omsairam.juice.model.Product;
import com.omsairam.juice.model.Role;
import com.omsairam.juice.repo.CategoryRepository;
import com.omsairam.juice.repo.ProductRepository;
import com.omsairam.juice.repo.UserRepository;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * On the very first start: fills the empty database with the website's starting menu
 * (SAMPLE / DEMO prices - change them in the admin panel) and creates the first admin account.
 */
@Component
public class DataSeeder implements ApplicationRunner {
    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final CategoryRepository categories;
    private final ProductRepository products;
    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final Props.Admin admin;

    public DataSeeder(CategoryRepository categories, ProductRepository products, UserRepository users,
                      PasswordEncoder encoder, Props.Admin admin) {
        this.categories = categories;
        this.products = products;
        this.users = users;
        this.encoder = encoder;
        this.admin = admin;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        seedCatalog();
        seedAdmin();
    }

    private void seedCatalog() {
        if (categories.count() > 0 || products.count() > 0) {
            return;
        }
        String[][] cats = {
            {"fresh-juices", "Fresh Juices", "bi-cup-straw"},
            {"traditional-drinks", "Traditional Drinks", "bi-cup-hot"},
            {"shakes", "Shakes", "bi-cup"},
            {"faluda", "Faluda", "bi-egg-fried"},
            {"ice-cream", "Ice Cream", "bi-snow2"},
            {"special-items", "Special Items", "bi-stars"},
        };
        Map<String, Category> byId = new HashMap<>();
        int order = 1;
        for (String[] c : cats) {
            Category category = new Category();
            category.setId(c[0]);
            category.setName(c[1]);
            category.setIcon(c[2]);
            category.setSortOrder(order++);
            byId.put(c[0], categories.save(category));
        }

        // category, name, price, brand, description, imageType, colour, featured
        Object[][] rows = {
        {"fresh-juices", "Pineapple Juice", "20", null, "Sweet and tangy fresh pineapple juice, made fresh to order with no added preservatives.", "juice", "#FFD60A", false},
        {"fresh-juices", "Mango Juice", "20", null, "Rich and creamy mango juice made from ripe, seasonal mangoes. A summer favourite!", "juice", "#FFB700", true},
        {"fresh-juices", "Sugarcane Juice", "20", null, "Freshly extracted sugarcane juice with a hint of lemon and ginger — naturally refreshing.", "juice", "#B7D94C", false},
        {"fresh-juices", "Lemon Water", "20", null, "Chilled lemon water (nimbu pani) with a perfect balance of sweet, salty and tangy.", "juice", "#E8FF6B", false},
        {"fresh-juices", "Apple Juice", "20", null, "Freshly pressed apple juice, crisp and naturally sweet with no added sugar.", "juice", "#E63946", false},
        {"fresh-juices", "Orange Juice", "20", null, "Vitamin C rich, freshly squeezed orange juice served chilled.", "juice", "#FF8C00", true},
        {"fresh-juices", "Watermelon Juice", "20", null, "Cooling watermelon juice — the perfect thirst quencher on a hot Sirpur afternoon.", "juice", "#FF4D6D", false},
        {"traditional-drinks", "Plain Lassi", "35", null, "Thick and creamy traditional plain lassi churned from fresh curd.", "lassi", "#FFF3B0", false},
        {"traditional-drinks", "Sweet Lassi", "35", null, "Classic sweet lassi topped with a dollop of fresh cream.", "lassi", "#FFE066", false},
        {"traditional-drinks", "Mango Lassi", "35", null, "Seasonal mango pulp blended with fresh curd for a rich, fruity lassi.", "lassi", "#FFB700", true},
        {"traditional-drinks", "Chaas (Buttermilk)", "25", null, "Light and spiced buttermilk, great for digestion and a hot day cooler.", "lassi", "#EAF6DA", false},
        {"shakes", "Badam Shake", "45", null, "Rich almond (badam) milkshake garnished with chopped dry fruits.", "shake", "#E9C46A", false},
        {"shakes", "Chocolate Shake", "85", null, "Thick chocolate milkshake made with real cocoa and chocolate ice cream.", "shake", "#6F4518", false},
        {"shakes", "Strawberry Shake", "85", null, "Fruity and creamy strawberry milkshake blended with fresh strawberry crush.", "shake", "#FF6B8A", false},
        {"shakes", "Banana Shake", "70", null, "Wholesome banana milkshake — thick, filling and naturally sweet.", "shake", "#FFE066", false},
        {"shakes", "Chocolate Coffee", "50", null, "Chilled chocolate-laced cold coffee — a smooth, energising treat.", "shake", "#4B2E1E", false},
        {"faluda", "Royal Faluda", "70", null, "A royal treat of rose syrup, vermicelli, basil seeds, jelly, dry fruits and ice cream.", "faluda", "#FF70A6", true},
        {"faluda", "Icecream Faluda", "70", null, "Classic faluda topped with a generous scoop of creamy ice cream, basil seeds and sev.", "faluda", "#F4A261", false},
        {"ice-cream", "Vanilla", "50", "Amul", "Classic and creamy vanilla ice cream scoop.", "icecream", "#FEFAE0", false},
        {"ice-cream", "Chocolate", "55", "Amul", "Rich chocolate ice cream made with real cocoa.", "icecream", "#6F4518", false},
        {"ice-cream", "Strawberry", "55", "Vadilal", "Fruity strawberry ice cream with real fruit chunks.", "icecream", "#FF6B8A", false},
        {"ice-cream", "Butterscotch", "60", "Creambell", "Crunchy caramelised butterscotch chips folded into creamy ice cream.", "icecream", "#E9C46A", false},
        {"ice-cream", "Mango", "60", "Vadilal", "Seasonal mango ice cream bursting with Alphonso mango flavour.", "icecream", "#FFB700", false},
        {"ice-cream", "Black Currant", "55", "Khusboo", "Tangy-sweet black currant flavoured ice cream.", "icecream", "#5E2A8C", false},
        {"ice-cream", "Chocolate Brownie", "70", "Creambell", "Chocolate ice cream loaded with chunks of fudgy brownie.", "icecream", "#4A2C1A", false},
        {"ice-cream", "Kesar Pista", "65", "Vadilal", "Traditional saffron and pistachio flavoured premium ice cream.", "icecream", "#B5C98E", false},
        {"ice-cream", "Rajbhog", "65", "Vadilal", "Royal blend of dry fruits, saffron and rabri flavours.", "icecream", "#FFD166", false},
        {"ice-cream", "Choco Chip", "60", "Amul", "Vanilla ice cream loaded with crunchy chocolate chips.", "icecream", "#2B2D42", false},
        {"special-items", "Juice + Ice Cream Combo", "130", null, "Special combo of any fresh juice with a scoop of your favourite ice cream.", "combo", "#2A9D8F", false},
        {"special-items", "Summer Special Mango Delight", "140", null, "Mango juice, mango ice cream and faluda sev — a mango lover’s dream.", "combo", "#FFB700", false},
        };
        int sort = 1;
        for (Object[] r : rows) {
            Product p = new Product();
            p.setCategory(byId.get((String) r[0]));
            p.setName((String) r[1]);
            p.setPrice(new BigDecimal((String) r[2]));
            p.setBrand((String) r[3]);
            p.setDescription((String) r[4]);
            p.setImageType((String) r[5]);
            p.setColor((String) r[6]);
            p.setFeatured((Boolean) r[7]);
            p.setAvailable(true);
            p.setSortOrder(sort++);
            products.save(p);
        }
        log.info("Seeded {} categories and {} products", cats.length, rows.length);
    }

    private void seedAdmin() {
        if (users.existsByRole(Role.ADMIN)) {
            return;
        }
        String email = admin.email() == null ? "" : admin.email().trim().toLowerCase();
        String password = admin.password() == null ? "" : admin.password();
        if (email.isEmpty() || password.length() < 8) {
            log.warn("No admin account exists yet. Set ADMIN_EMAIL and ADMIN_PASSWORD (min. 8 characters) and restart.");
            return;
        }
        AppUser user = users.findByEmailIgnoreCase(email).orElseGet(() -> {
            AppUser u = new AppUser();
            u.setFullName(admin.name());
            u.setEmail(email);
            u.setMobile(admin.mobile());
            u.setAddress("Shop");
            u.setPasswordHash(encoder.encode(password));
            return u;
        });
        user.setRole(Role.ADMIN);
        users.save(user);
        log.info("Admin account ready: {}", email);
    }
}
