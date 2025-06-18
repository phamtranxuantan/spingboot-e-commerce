package com.phamtranxuantan.springboot.service.impl;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.hibernate.validator.internal.util.stereotypes.Lazy;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.phamtranxuantan.springboot.entity.Cart;
import com.phamtranxuantan.springboot.entity.Category;
import com.phamtranxuantan.springboot.entity.Product;
import com.phamtranxuantan.springboot.exceptions.APIException;
import com.phamtranxuantan.springboot.exceptions.ResourceNotFoundException;
import com.phamtranxuantan.springboot.payloads.CartDTO;
import com.phamtranxuantan.springboot.payloads.ProductDTO;
import com.phamtranxuantan.springboot.payloads.ProductResponse;
import com.phamtranxuantan.springboot.repository.CartRepo;
import com.phamtranxuantan.springboot.repository.CategoryRepo;
import com.phamtranxuantan.springboot.repository.ProductRepo;
import com.phamtranxuantan.springboot.service.CartService;
import com.phamtranxuantan.springboot.service.FileService;
import com.phamtranxuantan.springboot.service.ProductService;

import jakarta.transaction.Transactional;

@Transactional
@Service
public class ProductServiceImpl implements ProductService {
  @Autowired
  private ProductRepo productRepo;
  @Autowired
  private CategoryRepo categoryRepo;
  @Autowired
  private CartRepo cartRepo;
  @Autowired
  @Lazy
  private CartService cartService;
  @Autowired
  @Lazy
  private FileService fileService;
  @Autowired
  private ModelMapper modelMapper;
  @Value("${project.imageProducts}")
  private String path;

  @Override
  public ProductDTO addProduct(Long categoryId, Product product) {
    Category category = categoryRepo.findById(categoryId)
        .orElseThrow(() -> new ResourceNotFoundException("Category", "categoryId", categoryId));
    boolean isProductNotPresent = true;
    List<Product> products = category.getProducts();
    for (int i = 0; i < products.size(); i++) {
      if (products.get(i).getProductName().equals(product.getProductName())
          && products.get(i).getDescription().equals(product.getDescription())) {
        isProductNotPresent = false;
        break;
      }
    }
    if (isProductNotPresent) {
      if (product.getImageProduct() == null || product.getImageProduct().isEmpty()) {
        throw new APIException("Product image must be provided!");
    }
      product.setCategory(category);
      double specialPrice = product.getPrice() - ((product.getDiscount() * 0.01) * product.getPrice());
      product.setSpecialPrice(specialPrice);
      Product savedProduct = productRepo.save(product);
      return modelMapper.map(savedProduct, ProductDTO.class);
    } else

    {
      throw new APIException("Product already exists !!!");
    }
  }

  @Override
  public ProductResponse getAllProducts(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
    Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc")
        ? Sort.by(sortBy).ascending()
        : Sort.by(sortBy).descending();
    Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);
    Page<Product> pageProducts = productRepo.findAll(pageDetails);
    List<Product> products = pageProducts.getContent();
    List<ProductDTO> productDTOs = products.stream().map(product -> modelMapper.map(product, ProductDTO.class))
        .collect(Collectors.toList());
    ProductResponse productResponse = new ProductResponse();
    productResponse.setContent(productDTOs);
    productResponse.setPageNumber(pageProducts.getNumber());
    productResponse.setPageSize(pageProducts.getSize());
    productResponse.setTotalElements(pageProducts.getTotalElements());
    productResponse.setTotalPages(pageProducts.getTotalPages());
    productResponse.setLastPage(pageProducts.isLast());
    return productResponse;
  }

  @Override
  public ProductDTO getProductById(Long productId) {
    Optional<Product> productOptional = productRepo.findById(productId);
    if (productOptional.isPresent()) {
      Product product = productOptional.get();
      return modelMapper.map(product, ProductDTO.class);
    } else {
      throw new ResourceNotFoundException("Product", "productId", productId);
    }
  }

  @Override
  public ProductResponse searchByCategory(Long categoryId, Integer pageNumber, Integer pageSize, String sortBy,
      String sortOrder) {
    Category category = categoryRepo.findById(categoryId)
        .orElseThrow(() -> new ResourceNotFoundException("Category", "categoryId",
            categoryId));
    Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending()
        : Sort.by(sortBy).descending();

    Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);

    // Page<Product> pageProducts = productRepo.findAll(pageDetails);
    Page<Product> pageProducts = productRepo.findByCategoryCategoryId(categoryId, pageDetails);

    List<Product> products = pageProducts.getContent();

    // if (products.isEmpty()) {
    // throw new APIException(category.getCategoryName() + "category doesn't contain
    // any products !!!");
    // }
    if (products.size() == 0) {
      throw new APIException(category.getCategoryName() + "category doesn't contain any products !!!");
    }
    List<ProductDTO> productDTOs = products.stream().map(p -> modelMapper.map(p, ProductDTO.class))
        .collect(Collectors.toList());

    ProductResponse productResponse = new ProductResponse();

    productResponse.setContent(productDTOs);
    productResponse.setPageNumber(pageProducts.getNumber());
    productResponse.setPageSize(pageProducts.getSize());
    productResponse.setTotalElements(pageProducts.getTotalElements());
    productResponse.setTotalPages(pageProducts.getTotalPages());
    productResponse.setLastPage(pageProducts.isLast());

    return productResponse;
  }

  @Override
  public ProductResponse searchProductByKeyword(String keyword, Long categoryId, Integer pageNumber, Integer pageSize,
      String sortBy, String sortOrder) {
    Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending()
        : Sort.by(sortBy).descending();
    Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);
    Page<Product> pageProducts = productRepo.findByProductNameLike("%" + keyword + "%", pageDetails);
    List<Product> products = pageProducts.getContent();
    if (products.isEmpty()) {
      throw new APIException("Products not found with keyword: " + keyword);
    }
    if (categoryId != 0 && categoryId != null) {
      products = products.stream()
          .filter(product -> {
            if (product.getCategory() != null && product.getCategory().getCategoryId() != null) {
              Long productCategoryId = product.getCategory().getCategoryId();
              return productCategoryId == categoryId;
            }
            return false;
          })
          .collect(Collectors.toList());
    }
    List<ProductDTO> productDTOs = products.stream().map(p -> modelMapper.map(p, ProductDTO.class))
        .collect(Collectors.toList());
    ProductResponse productResponse = new ProductResponse();
    productResponse.setContent(productDTOs);
    productResponse.setPageNumber(pageProducts.getNumber());
    productResponse.setPageSize(pageProducts.getSize());
    productResponse.setTotalElements(pageProducts.getTotalElements());
    productResponse.setTotalPages(pageProducts.getTotalPages());
    productResponse.setLastPage(pageProducts.isLast());
    return productResponse;
  }
@Override
public ProductDTO updateProduct(Long productId, ProductDTO productDTO) {
    Product productFromDB = productRepo.findById(productId)
        .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));

    // Cập nhật các trường
    productFromDB.setProductName(productDTO.getProductName());
    productFromDB.setImageProduct(productDTO.getImageProduct());
    productFromDB.setDescription(productDTO.getDescription());
    productFromDB.setQuantity(productDTO.getQuantity());
    productFromDB.setWeight(productDTO.getWeight());
    productFromDB.setPrice(productDTO.getPrice());
    productFromDB.setDiscount(productDTO.getDiscount());
    productFromDB.setSpecialPrice(productDTO.getSpecialPrice());

    // Cập nhật category nếu có categoryId mới
    if (productDTO.getCategoryId() != null) {
        Category newCategory = categoryRepo.findById(productDTO.getCategoryId())
            .orElseThrow(() -> new ResourceNotFoundException("Category", "categoryId", productDTO.getCategoryId()));
        productFromDB.setCategory(newCategory);
    }

    Product savedProduct = productRepo.save(productFromDB);

    // Cập nhật cart nếu cần (giữ nguyên logic cũ)
    List<Cart> carts = cartRepo.findCartsByProductId(productId);
    List<CartDTO> cartDTOs = carts.stream().map(cart -> {
      CartDTO cartDTO = modelMapper.map(cart, CartDTO.class);
      List<ProductDTO> products = cart.getCartItems().stream()
          .map(p -> modelMapper.map(p.getProduct(), ProductDTO.class)).collect(Collectors.toList());
      cartDTO.setProducts(products);
      return cartDTO;
    }).collect(Collectors.toList());
    cartDTOs.forEach(cart -> cartService.updateProductInCarts(cart.getCartId(), productId));

    return modelMapper.map(savedProduct, ProductDTO.class);
}
  // @Override
  // public ProductDTO updateProduct(Long productId, Product product) {
  //   Product productFromDB = productRepo.findById(productId)
  //       .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));
  //   if (productFromDB == null) {
  //     throw new APIException("Product not found with productId: " + productId);
  //   }
  //   //product.setImageProduct(productFromDB.getImageProduct());
  //   product.setProductId(productId);
  //   product.setCategory(productFromDB.getCategory());
  //   double specialPrice = product.getPrice() - ((product.getDiscount() * 0.01) * product.getPrice());
  //   product.setSpecialPrice(specialPrice);
  //   Product savedProduct = productRepo.save(product);
  //   List<Cart> carts = cartRepo.findCartsByProductId(productId);
  //   List<CartDTO> cartDTOs = carts.stream().map(cart -> {
  //     CartDTO cartDTO = modelMapper.map(cart, CartDTO.class);
  //     List<ProductDTO> products = cart.getCartItems().stream()
  //         .map(p -> modelMapper.map(p.getProduct(), ProductDTO.class)).collect(Collectors.toList());
  //     cartDTO.setProducts(products);
  //     return cartDTO;
  //   }).collect(Collectors.toList());
  //   cartDTOs.forEach(cart -> cartService.updateProductInCarts(cart.getCartId(), productId));
  //   return modelMapper.map(savedProduct, ProductDTO.class);
  // }

  @Override
  public ProductDTO updateProductImage(Long productId, MultipartFile image) throws IOException {
    Product productFromDB = productRepo.findById(productId)
        .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));

    // Đảm bảo rằng Product không phải là null, mặc dù trường hợp này có vẻ thừa
    if (productFromDB == null) {
      throw new APIException("Product not found with productId: " + productId);
    }

    // Tải hình ảnh lên và cập nhật sản phẩm
    String fileName = fileService.uploadImage(path, image);
    productFromDB.setImageProduct(fileName);
    Product updatedProduct = productRepo.save(productFromDB);
    return modelMapper.map(updatedProduct, ProductDTO.class);
  }

  @Override
  public String deleteProduct(Long productId) {
    Product product = productRepo.findById(productId)
        .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));
    List<Cart> carts = cartRepo.findCartsByProductId(productId);
    carts.forEach(cart -> cartService.deleteProductFromCart(cart.getCartId(), productId));
    productRepo.delete(product);
    return "Product with productId: " + productId + " deleted successfully !!!";
  }

  @Override
  public InputStream getProductImage(String fileName) throws FileNotFoundException {
    return fileService.getResource(path, fileName);
  }

  @Override
  public ProductResponse getProductsByPriceRange(double minPrice, double maxPrice, Integer pageNumber, Integer pageSize,
      String sortBy, String sortOrder) {
    Sort sort = sortOrder.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
        : Sort.by(sortBy).descending();
    Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);
    Page<Product> pageProducts = productRepo.findProductsByPriceRange(minPrice, maxPrice, pageable);
    List<ProductDTO> productDTOs = pageProducts.getContent().stream()
        .map(product -> modelMapper.map(product, ProductDTO.class))
        .collect(Collectors.toList());
    ProductResponse productResponse = new ProductResponse();
    productResponse.setContent(productDTOs);
    productResponse.setPageNumber(pageProducts.getNumber());
    productResponse.setPageSize(pageProducts.getSize());
    productResponse.setTotalElements(pageProducts.getTotalElements());
    productResponse.setTotalPages(pageProducts.getTotalPages());
    productResponse.setLastPage(pageProducts.isLast());
    return productResponse;
  }

  // lấy sản phẩm cho chatbot AI
  @Override
  public List<ProductDTO> getAllProductsChatBot() {
    List<Product> products = productRepo.findAll();
    return products.stream()
        .map(product -> modelMapper.map(product, ProductDTO.class))
        .collect(Collectors.toList());
  }

  @Override
  public Map<String, List<ProductDTO>> getProductsGroupedByCategoryChatBot() {
    List<Product> products = productRepo.findAll(); // Lấy tất cả sản phẩm từ cơ sở dữ liệu
    return products.stream()
        .collect(Collectors.groupingBy(
            product -> product.getCategory().getCategoryName(), // Nhóm theo tên danh mục
            Collectors.mapping(
                product -> modelMapper.map(product, ProductDTO.class), // Chuyển đổi sang DTO
                Collectors.toList())));
  }
}