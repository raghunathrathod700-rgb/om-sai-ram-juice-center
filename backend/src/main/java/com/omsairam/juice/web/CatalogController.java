package com.omsairam.juice.web;

import com.omsairam.juice.dto.Dtos.CategoryDto;
import com.omsairam.juice.dto.Dtos.ProductDto;
import com.omsairam.juice.service.CatalogService;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Public, read-only menu. */
@RestController
@RequestMapping("/api")
public class CatalogController {
    private final CatalogService catalog;

    public CatalogController(CatalogService catalog) {
        this.catalog = catalog;
    }

    @GetMapping("/health")
    public Map<String, Object> health() {
        return Map.of("ok", true);
    }

    @GetMapping("/categories")
    public List<CategoryDto> categories() {
        return catalog.listCategories();
    }

    @GetMapping("/products")
    public List<ProductDto> products() {
        return catalog.listProducts();
    }

    @GetMapping("/products/{id}")
    public ProductDto product(@PathVariable Long id) {
        return catalog.getProduct(id);
    }
}
