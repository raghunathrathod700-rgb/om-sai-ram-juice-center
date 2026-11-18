package com.omsairam.juice.web;

import com.omsairam.juice.dto.Dtos.CategoryDto;
import com.omsairam.juice.dto.Dtos.CategoryRequest;
import com.omsairam.juice.dto.Dtos.OrderDto;
import com.omsairam.juice.dto.Dtos.ProductDto;
import com.omsairam.juice.dto.Dtos.ProductRequest;
import com.omsairam.juice.dto.Dtos.StatsDto;
import com.omsairam.juice.dto.Dtos.StatusRequest;
import com.omsairam.juice.service.CatalogService;
import com.omsairam.juice.service.OrderService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/** Everything under /api/admin needs a logged-in ADMIN (enforced in SecurityConfig). */
@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final CatalogService catalog;
    private final OrderService orders;

    public AdminController(CatalogService catalog, OrderService orders) {
        this.catalog = catalog;
        this.orders = orders;
    }

    /* ------------------------------ dashboard + orders ------------------------------ */
    @GetMapping("/stats")
    public StatsDto stats() {
        return orders.stats();
    }

    @GetMapping("/orders")
    public List<OrderDto> orders(@RequestParam(required = false) String status) {
        return orders.adminList(status);
    }

    @PutMapping("/orders/{id}/status")
    public OrderDto updateStatus(@PathVariable String id, @Valid @RequestBody StatusRequest req) {
        return orders.updateStatus(id, req.status());
    }

    @PutMapping("/orders/{id}/payment")
    public OrderDto updatePayment(@PathVariable String id, @Valid @RequestBody StatusRequest req) {
        return orders.updatePaymentStatus(id, req.status());
    }

    /* ------------------------------ products ------------------------------ */
    @PostMapping("/products")
    @ResponseStatus(HttpStatus.CREATED)
    public ProductDto createProduct(@Valid @RequestBody ProductRequest req) {
        return catalog.createProduct(req);
    }

    @PutMapping("/products/{id}")
    public ProductDto updateProduct(@PathVariable Long id, @Valid @RequestBody ProductRequest req) {
        return catalog.updateProduct(id, req);
    }

    @DeleteMapping("/products/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProduct(@PathVariable Long id) {
        catalog.deleteProduct(id);
    }

    @PostMapping(value = "/products/{id}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ProductDto uploadImage(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        return catalog.setImage(id, file);
    }

    @DeleteMapping("/products/{id}/image")
    public ProductDto removeImage(@PathVariable Long id) {
        return catalog.removeImage(id);
    }

    /* ------------------------------ categories ------------------------------ */
    @PostMapping("/categories")
    @ResponseStatus(HttpStatus.CREATED)
    public CategoryDto createCategory(@Valid @RequestBody CategoryRequest req) {
        return catalog.createCategory(req);
    }

    @PutMapping("/categories/{id}")
    public CategoryDto updateCategory(@PathVariable String id, @Valid @RequestBody CategoryRequest req) {
        return catalog.updateCategory(id, req);
    }

    @DeleteMapping("/categories/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCategory(@PathVariable String id) {
        catalog.deleteCategory(id);
    }
}
