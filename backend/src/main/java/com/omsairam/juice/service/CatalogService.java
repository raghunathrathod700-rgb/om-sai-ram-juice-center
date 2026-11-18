package com.omsairam.juice.service;

import com.omsairam.juice.dto.Dtos.CategoryDto;
import com.omsairam.juice.dto.Dtos.CategoryRequest;
import com.omsairam.juice.dto.Dtos.ProductDto;
import com.omsairam.juice.dto.Dtos.ProductRequest;
import com.omsairam.juice.model.Category;
import com.omsairam.juice.model.Product;
import com.omsairam.juice.repo.CategoryRepository;
import com.omsairam.juice.repo.ProductRepository;
import com.omsairam.juice.web.ApiException;
import java.text.Normalizer;
import java.util.List;
import java.util.Locale;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

/** Products and categories: public reads and admin changes (price, new items, photos...). */
@Service
public class CatalogService {
    private final ProductRepository products;
    private final CategoryRepository categories;
    private final FileStorageService files;

    public CatalogService(ProductRepository products, CategoryRepository categories, FileStorageService files) {
        this.products = products;
        this.categories = categories;
        this.files = files;
    }

    /* ------------------------------ mapping ------------------------------ */
    public static ProductDto toDto(Product p) {
        String imageUrl = p.getImageFile() == null ? null : "/uploads/products/" + p.getImageFile();
        return new ProductDto(
                p.getId(),
                p.getName(),
                p.getCategory().getId(),
                p.getCategory().getName(),
                p.getPrice(),
                p.getDescription(),
                p.getImageType(),
                p.getColor(),
                p.getBrand(),
                p.getRating(),
                p.isAvailable(),
                p.isFeatured(),
                imageUrl);
    }

    private static CategoryDto toDto(Category c) {
        return new CategoryDto(c.getId(), c.getName(), c.getIcon());
    }

    /* ------------------------------ public reads ------------------------------ */
    @Transactional(readOnly = true)
    public List<CategoryDto> listCategories() {
        return categories.findAllByOrderBySortOrderAscNameAsc().stream().map(CatalogService::toDto).toList();
    }

    @Transactional(readOnly = true)
    public List<ProductDto> listProducts() {
        return products.findAllByOrderBySortOrderAscIdAsc().stream().map(CatalogService::toDto).toList();
    }

    @Transactional(readOnly = true)
    public ProductDto getProduct(Long id) {
        return toDto(find(id));
    }

    /* ------------------------------ admin: products ------------------------------ */
    @Transactional
    public ProductDto createProduct(ProductRequest req) {
        Product p = new Product();
        p.setSortOrder((int) products.count() + 1);
        apply(p, req);
        return toDto(products.save(p));
    }

    @Transactional
    public ProductDto updateProduct(Long id, ProductRequest req) {
        Product p = find(id);
        apply(p, req);
        return toDto(products.save(p));
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product p = find(id);
        String image = p.getImageFile();
        products.delete(p);
        files.delete(image); // old orders keep their own copy of name and price
    }

    @Transactional
    public ProductDto setImage(Long id, MultipartFile file) {
        Product p = find(id);
        String old = p.getImageFile();
        p.setImageFile(files.save(file));
        products.save(p);
        files.delete(old);
        return toDto(p);
    }

    @Transactional
    public ProductDto removeImage(Long id) {
        Product p = find(id);
        String old = p.getImageFile();
        p.setImageFile(null);
        products.save(p);
        files.delete(old);
        return toDto(p);
    }

    private void apply(Product p, ProductRequest req) {
        Category category = categories.findById(req.category()).orElseThrow(() -> ApiException.badRequest("Unknown category."));
        p.setName(req.name().trim());
        p.setCategory(category);
        p.setPrice(req.price().setScale(2, java.math.RoundingMode.HALF_UP));
        p.setDescription(req.description() == null ? "" : req.description().trim());
        p.setImageType(req.imageType() == null ? "juice" : req.imageType());
        p.setColor(req.color() == null ? "#FF9800" : req.color().toUpperCase(Locale.ROOT));
        p.setBrand(req.brand() == null || req.brand().isBlank() ? null : req.brand().trim());
        p.setRating(req.rating() == null ? null : req.rating().doubleValue());
        p.setAvailable(req.available() == null || req.available());
        p.setFeatured(req.featured() != null && req.featured());
    }

    private Product find(Long id) {
        return products.findById(id).orElseThrow(() -> ApiException.notFound("Product not found."));
    }

    /* ------------------------------ admin: categories ------------------------------ */
    @Transactional
    public CategoryDto createCategory(CategoryRequest req) {
        String slug = slugify(req.name());
        if (slug.isEmpty()) {
            throw ApiException.badRequest("Please use letters or numbers in the category name.");
        }
        if (categories.existsById(slug)) {
            throw ApiException.conflict("This category already exists.");
        }
        Category c = new Category();
        c.setId(slug);
        c.setName(req.name().trim());
        c.setIcon(req.icon() == null || req.icon().isBlank() ? "bi-cup-straw" : req.icon().trim());
        c.setSortOrder((int) categories.count() + 1);
        return toDto(categories.save(c));
    }

    @Transactional
    public CategoryDto updateCategory(String id, CategoryRequest req) {
        Category c = categories.findById(id).orElseThrow(() -> ApiException.notFound("Category not found."));
        c.setName(req.name().trim());
        if (req.icon() != null && !req.icon().isBlank()) {
            c.setIcon(req.icon().trim());
        }
        return toDto(categories.save(c));
    }

    @Transactional
    public void deleteCategory(String id) {
        Category c = categories.findById(id).orElseThrow(() -> ApiException.notFound("Category not found."));
        if (products.countByCategoryId(id) > 0) {
            throw ApiException.conflict("Move or delete the products in this category first.");
        }
        categories.delete(c);
    }

    static String slugify(String text) {
        String ascii = Normalizer.normalize(text, Normalizer.Form.NFD).replaceAll("\\p{M}", "");
        return ascii.toLowerCase(Locale.ROOT).trim().replaceAll("[^a-z0-9]+", "-").replaceAll("(^-|-$)", "");
    }
}
