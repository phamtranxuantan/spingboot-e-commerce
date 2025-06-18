package com.phamtranxuantan.springboot.service;

import com.phamtranxuantan.springboot.entity.Category;
import com.phamtranxuantan.springboot.payloads.CategoryDTO;
import com.phamtranxuantan.springboot.payloads.CategoryResponse;

public interface CategoryService {

  CategoryDTO createCategory(Category category);

  CategoryDTO getCategoryById(Long categoryId);

  CategoryResponse getCategories(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

  CategoryDTO updateCategory(Category category, Long categoryId);

  String deleteCategory(Long categoryId);
}