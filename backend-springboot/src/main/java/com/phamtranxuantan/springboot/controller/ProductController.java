package com.phamtranxuantan.springboot.controller;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.phamtranxuantan.springboot.config.AppConstants;
import com.phamtranxuantan.springboot.entity.Product;
import com.phamtranxuantan.springboot.payloads.ProductDTO;
import com.phamtranxuantan.springboot.payloads.ProductResponse;
import com.phamtranxuantan.springboot.service.ProductService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
@SecurityRequirement(name = "E-Commerce Application")
@CrossOrigin(origins = "*")
public class ProductController {
    @Autowired
    private ProductService productService;

    @PostMapping("/admin/categories/{categoryId}/products")
    public ResponseEntity<ProductDTO> addProduct(@Valid @RequestBody Product product, @PathVariable Long categoryId) {
        ProductDTO savedProduct = productService.addProduct(categoryId, product);
        return new ResponseEntity<ProductDTO>(savedProduct, HttpStatus.CREATED);
    }

    @GetMapping("/public/products/{productId}")
    public ResponseEntity<ProductDTO> getOneCategory(@PathVariable Long productId) {
        ProductDTO ProductDTO = productService.getProductById(productId);
        return new ResponseEntity<>(ProductDTO, HttpStatus.OK);
    }

    @GetMapping("/public/products")
    public ResponseEntity<ProductResponse> getAllProducts(
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,

            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_PRODUCTS_BY, required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder) {
        ProductResponse productResponse = productService.getAllProducts(pageNumber == 0 ? pageNumber : pageNumber - 1,
pageSize, "id".equals(sortBy) ? "productId" : sortBy, sortOrder);
        return new ResponseEntity<ProductResponse>(productResponse, HttpStatus.OK);
    }

    @GetMapping("/public/categories/{categoryId}/products")
    public ResponseEntity<ProductResponse> getProductsByCategory(@PathVariable Long categoryId,
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_PRODUCTS_BY, required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder) {
        ProductResponse productResponse = productService.searchByCategory(categoryId,
                pageNumber == 0 ? pageNumber : pageNumber - 1, pageSize, "id".equals(sortBy) ? "productId" : sortBy,
                sortOrder);
        return new ResponseEntity<ProductResponse>(productResponse, HttpStatus.OK);
    }

    @GetMapping("/public/products/keyword/{keyword}")
    public ResponseEntity<ProductResponse> getProductsByKeyword(@PathVariable String keyword,
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_PRODUCTS_BY, required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder,
            @RequestParam(name = "categoryId", defaultValue = "0", required = false) Long categoryId) {
        ProductResponse productResponse = productService.searchProductByKeyword(keyword, categoryId,
                pageNumber == 0 ? pageNumber : pageNumber - 1, pageSize, "id".equals(sortBy) ? "productId" : sortBy,
                sortOrder);
        return new ResponseEntity<ProductResponse>(productResponse, HttpStatus.OK);
    }

    @GetMapping("/public/products/KeywordPriceRange/minPrice/{minPrice}/maxPrice/{maxPrice}")
    public ResponseEntity<ProductResponse> getProductsByPriceRange(
            @PathVariable double minPrice,
            @PathVariable double maxPrice,
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_PRODUCTS_BY, required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder) {
        ProductResponse products = productService.getProductsByPriceRange(minPrice, maxPrice, pageNumber == 0 ? pageNumber : pageNumber - 1, pageSize, "id".equals(sortBy) ? "productId" : sortBy, sortOrder);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/public/products/imageProduct/{fileName}")
    public ResponseEntity<InputStreamResource> getImage(@PathVariable String fileName) throws FileNotFoundException {
        InputStream imageStream = productService.getProductImage(fileName);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);
        headers.setContentDispositionFormData("inline", fileName);
        return new ResponseEntity<>(new InputStreamResource(imageStream), headers, HttpStatus.OK);
    }
    @PutMapping("/admin/products/{productId}")
    public ResponseEntity<ProductDTO> updateProduct(
            @PathVariable Long productId,
            @RequestBody ProductDTO productDTO) {
        ProductDTO updatedProduct = productService.updateProduct(productId, productDTO);
        return new ResponseEntity<>(updatedProduct, HttpStatus.OK);
    }
    // @PutMapping("/admin/products/{productId}")
    // public ResponseEntity<ProductDTO> updateProduct(@RequestBody Product product,
    //         @PathVariable Long productId) {
    //     ProductDTO updatedProduct = productService.updateProduct(productId, product);
    // return new ResponseEntity<ProductDTO>(updatedProduct, HttpStatus.OK);
    // }

    @PutMapping("/admin/products/{productId}/imageProduct")
    public ResponseEntity<ProductDTO> updateProductImage(@PathVariable Long productId,
            @RequestParam("imageProduct") MultipartFile image) throws IOException {
        ProductDTO updatedProduct = productService.updateProductImage(productId, image);
        return new ResponseEntity<ProductDTO>(updatedProduct, HttpStatus.OK);
    }

    @DeleteMapping("/admin/products/{productId}")
    public ResponseEntity<String> deleteProductByCategory(@PathVariable Long productId) {
        String status = productService.deleteProduct(productId);
        return new ResponseEntity<String>(status, HttpStatus.OK);
    }
}