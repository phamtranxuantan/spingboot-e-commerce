package com.phamtranxuantan.example05.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.phamtranxuantan.example05.entity.Product;

@Repository
public interface ProductRepo extends JpaRepository<Product, Long> {
  Page<Product> findByProductNameLike(String keyword, Pageable pageDetails);

  Page<Product> findByCategoryCategoryId(Long categoryId, Pageable pageable);

  @Query("SELECT p FROM Product p WHERE p.price BETWEEN :minPrice AND :maxPrice")
  Page<Product> findProductsByPriceRange(@Param("minPrice") double minPrice, @Param("maxPrice") double maxPrice, Pageable pageable);
}