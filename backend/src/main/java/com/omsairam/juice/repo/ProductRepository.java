package com.omsairam.juice.repo;

import com.omsairam.juice.model.Product;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findAllByOrderBySortOrderAscIdAsc();

    long countByCategoryId(String categoryId);
}
