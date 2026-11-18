package com.omsairam.juice.repo;

import com.omsairam.juice.model.Category;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, String> {
    List<Category> findAllByOrderBySortOrderAscNameAsc();
}
