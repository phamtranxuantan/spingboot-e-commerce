package com.phamtranxuantan.springboot.service;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

import com.phamtranxuantan.springboot.entity.Product;
import com.phamtranxuantan.springboot.payloads.ProductDTO;
import com.phamtranxuantan.springboot.payloads.ProductResponse;

public interface ProductService {
  ProductDTO addProduct(Long categoryId, Product product);

  ProductResponse getAllProducts(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

  ProductResponse searchByCategory(Long categoryId, Integer pageNumber, Integer pageSize, String sortBy,
      String sortOrder);

  //ProductDTO updateProduct(Long productId, Product product);
ProductDTO updateProduct(Long productId, ProductDTO productDTO);
  ProductDTO updateProductImage(Long productId, MultipartFile image) throws IOException;

  InputStream getProductImage(String fileName) throws FileNotFoundException;

  ProductResponse searchProductByKeyword(String keyword, Long categoryId, Integer pageNumber, Integer pageSize,
      String sortBy,
      String sortOrder);

  String deleteProduct(Long productId);

  ProductDTO getProductById(Long productId);

  ProductResponse getProductsByPriceRange(double minPrice, double maxPrice, Integer pageNumber, Integer pageSize,
      String sortBy, String sortOrder);

  // Những phương thức xử dụng cho ChatBot AI
  List<ProductDTO> getAllProductsChatBot();
  Map<String, List<ProductDTO>> getProductsGroupedByCategoryChatBot();
  
}