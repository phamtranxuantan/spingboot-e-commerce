package com.phamtranxuantan.springboot.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.phamtranxuantan.springboot.entity.Category;

@Repository
public interface CategoryRepo extends JpaRepository<Category, Long> {
  Category findByCategoryName(String categoryName);
}