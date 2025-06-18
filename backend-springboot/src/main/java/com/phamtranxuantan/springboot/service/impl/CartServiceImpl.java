package com.phamtranxuantan.springboot.service.impl;

import java.util.List;
import java.util.stream.Collectors;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.phamtranxuantan.springboot.entity.Cart;
import com.phamtranxuantan.springboot.entity.CartItem;
import com.phamtranxuantan.springboot.entity.Product;
import com.phamtranxuantan.springboot.exceptions.APIException;
import com.phamtranxuantan.springboot.exceptions.ResourceNotFoundException;
import com.phamtranxuantan.springboot.payloads.CartDTO;
import com.phamtranxuantan.springboot.payloads.CartItemDTO;
import com.phamtranxuantan.springboot.payloads.ProductDTO;
import com.phamtranxuantan.springboot.repository.CartItemRepo;
import com.phamtranxuantan.springboot.repository.CartRepo;
import com.phamtranxuantan.springboot.repository.ProductRepo;
import com.phamtranxuantan.springboot.service.CartService;

import jakarta.transaction.Transactional;

@Transactional
@Service
public class CartServiceImpl implements CartService {
  @Autowired
  private CartRepo cartRepo;
  @Autowired
  private ProductRepo productRepo;
  @Autowired
  private CartItemRepo cartItemRepo;
  @Autowired
  private ModelMapper modelMapper;

  @Override
  public CartDTO addProductToCart(Long cartId, Long productId, Integer quantity) {
    Cart cart = cartRepo.findById(cartId)
        .orElseThrow(() -> new ResourceNotFoundException("Cart", "cartId", cartId));
    Product product = productRepo.findById(productId)
        .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));
    CartItem cartItem = cartItemRepo.findCartItemByProductIdAndCartId(cartId, productId);
    if (cartItem != null) {
      throw new APIException("Product" + product.getProductName() + "already exists in the cart");
    }
    if (product.getQuantity() == 0) {
      throw new APIException(product.getProductName() + " is not available");
    }
    if (product.getQuantity() < quantity) {
      throw new APIException(
          "Please, make an order of the" + product.getProductName() + "less than or equal to the quantity"
              + product.getQuantity() + ".");
    }
    CartItem newCartItem = new CartItem();
    newCartItem.setProduct(product);
    newCartItem.setCart(cart);
    newCartItem.setQuantity(quantity);
    newCartItem.setDiscount(product.getDiscount());
    newCartItem.setProductPrice(product.getSpecialPrice());
    cartItemRepo.save(newCartItem);
    product.setQuantity(product.getQuantity() - quantity);
    cart.setTotalPrice(cart.getTotalPrice() + (product.getSpecialPrice() * quantity));
    CartDTO cartDTO = modelMapper.map(cart, CartDTO.class);
    List<ProductDTO> productDTOs = cart.getCartItems().stream()
        .map(p -> modelMapper.map(p.getProduct(), ProductDTO.class)).collect(Collectors.toList());
    cartDTO.setProducts(productDTOs);
    return cartDTO;
  }

  @Override
  public List<CartDTO> getAllCarts() {
    List<Cart> carts = cartRepo.findAll();
    if (carts.size() == 0) {
      throw new APIException("No cart exists");
    }
    List<CartDTO> cartDTOs = carts.stream().map(cart -> {
      CartDTO cartDTO = modelMapper.map(cart, CartDTO.class);
      List<ProductDTO> products = cart.getCartItems().stream()
          .map(p -> modelMapper.map(p.getProduct(), ProductDTO.class)).collect(Collectors.toList());
      cartDTO.setProducts(products);
      return cartDTO;
    }).collect(Collectors.toList());
    return cartDTOs;
  }


  //chỉnh sửa phương thức getCart để lấy quantity của cartItem chứ không phải quantity của product
  // @Override
  // public CartDTO getCart(String emailId, Long cartId) {
  //   Cart cart = cartRepo.findCartByEmailAndCartId(emailId, cartId);
  //   if (cart == null) {
  //     throw new ResourceNotFoundException("Cart", "cartId", cartId);
  //   }

  //   CartDTO cartDTO = modelMapper.map(cart, CartDTO.class);
  //   cartDTO.setUserEmail(cart.getUser().getEmail());
  //   List<CartItemDTO> cartItems = cart.getCartItems().stream()
  //       .map(cartItem -> {
  //         CartItemDTO cartItemDTO = modelMapper.map(cartItem, CartItemDTO.class);
  //         cartItemDTO.setQuantity(cartItem.getQuantity());
  //         return cartItemDTO;
  //       })
  //       .collect(Collectors.toList());
  //   cartDTO.setCartItems(cartItems);
  //   return cartDTO;
  // }
  //phương thức mới để lấy quantity của cartItem chứ không phải quantity của product
  @Override
  public CartDTO getCart(String emailId, Long cartId) {
      Cart cart = cartRepo.findCartByEmailAndCartId(emailId, cartId);
      if (cart == null) {
          throw new ResourceNotFoundException("Cart", "cartId", cartId);
      }
      CartDTO cartDTO = modelMapper.map(cart, CartDTO.class);
      // Thêm dòng để lấy email của user
      cartDTO.setUserEmail(cart.getUser().getEmail());
      List<ProductDTO> products = cart.getCartItems().stream()
          .map(cartItem -> {
              ProductDTO productDTO = modelMapper.map(cartItem.getProduct(), ProductDTO.class);
              productDTO.setQuantity(cartItem.getQuantity()); // Lấy quantity từ cart_items
              return productDTO;
          })
          .collect(Collectors.toList());
      cartDTO.setProducts(products);
      return cartDTO;
  }
  //phương thức cũ 
  // @Override
  // public CartDTO getCart(String emailId, Long cartId) {
  //   Cart cart = cartRepo.findCartByEmailAndCartId(emailId, cartId);
  //   if (cart == null) {
  //     throw new ResourceNotFoundException("Cart", "cartId", cartId);
  //   }
  //   CartDTO cartDTO = modelMapper.map(cart, CartDTO.class);
  //   //thêm dòng 93  để lấy email của user
  //   cartDTO.setUserEmail(cart.getUser().getEmail());
  //   List<ProductDTO> products = cart.getCartItems().stream()
  //       .map(p -> modelMapper.map(p.getProduct(), ProductDTO.class))
  //       .collect(Collectors.toList());
  //   cartDTO.setProducts(products);
  //   return cartDTO;
  // }

  @Override
  public void updateProductInCarts(Long cartId, Long productId) {
    Cart cart = cartRepo.findById(cartId)
        .orElseThrow(() -> new ResourceNotFoundException("Cart", "cartId", cartId));
    Product product = productRepo.findById(productId)
        .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));
    CartItem cartItem = cartItemRepo.findCartItemByProductIdAndCartId(cartId, productId);
    if (cartItem == null) {
      throw new APIException("Product" + product.getProductName() + "not available in the cart!!!");
    }
    double cartPrice = cart.getTotalPrice() - (cartItem.getProductPrice() * cartItem.getQuantity());
    cartItem.setProductPrice(product.getSpecialPrice());
    cart.setTotalPrice(cartPrice + (cartItem.getProductPrice() * cartItem.getQuantity()));
    cartItem = cartItemRepo.save(cartItem);
  }
  //hàm mới
  @Override
  public CartDTO updateProductQuantityInCart(Long cartId, Long productId, Integer quantity) {
      Cart cart = cartRepo.findById(cartId)
          .orElseThrow(() -> new ResourceNotFoundException("Cart", "cartId", cartId));
      Product product = productRepo.findById(productId)
          .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));
      if (product.getQuantity() == 0) {
          throw new APIException(product.getProductName() + " is not available");
      }
      if (product.getQuantity() < quantity) {
          throw new APIException("Please, make an order of the " + product.getProductName()
              + " less than or equal to the quantity " + product.getQuantity() + ".");
      }
      CartItem cartItem = cartItemRepo.findCartItemByProductIdAndCartId(cartId, productId);
      if (cartItem == null) {
          throw new APIException("Product " + product.getProductName() + " not available in the cart!!!");
      }
      double cartPrice = cart.getTotalPrice() - (cartItem.getProductPrice() * cartItem.getQuantity());
      product.setQuantity(product.getQuantity() + cartItem.getQuantity() - quantity);
      cartItem.setProductPrice(product.getSpecialPrice());
      cartItem.setQuantity(quantity);
      cartItem.setDiscount(product.getDiscount());
      cart.setTotalPrice(cartPrice + (cartItem.getProductPrice() * quantity));
      cartItem = cartItemRepo.save(cartItem);
      CartDTO cartDTO = modelMapper.map(cart, CartDTO.class);
      List<ProductDTO> productDTOs = cart.getCartItems().stream()
          .map(p -> {
              ProductDTO productDTO = modelMapper.map(p.getProduct(), ProductDTO.class);
              productDTO.setQuantity(p.getQuantity()); // Lấy quantity từ cart_items
              return productDTO;
          })
          .collect(Collectors.toList());
      cartDTO.setProducts(productDTOs);
      return cartDTO;
  }
  //hàm cũ
  // @Override
  // public CartDTO updateProductQuantityInCart(Long cartId, Long productId, Integer quantity) {
  //   Cart cart = cartRepo.findById(cartId)
  //       .orElseThrow(() -> new ResourceNotFoundException("Cart", "cartId", cartId));
  //   Product product = productRepo.findById(productId)
  //       .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));
  //   if (product.getQuantity() == 0) {
  //     throw new APIException(product.getProductName() + "is not available");
  //   }
  //   if (product.getQuantity() < quantity) {
  //     throw new APIException("Please, make an order of the " + product.getProductName()
  //         + "less than or equal to the quantity" + product.getQuantity() + ".");
  //   }
  //   CartItem cartItem = cartItemRepo.findCartItemByProductIdAndCartId(cartId, productId);
  //   if (cartItem == null) {
  //     throw new APIException("Product" + product.getProductName() + "not available in the cart!!!");
  //   }
  //   double cartPrice = cart.getTotalPrice() - (cartItem.getProductPrice() * cartItem.getQuantity());
  //   product.setQuantity(product.getQuantity() + cartItem.getQuantity() - quantity);
  //   cartItem.setProductPrice(product.getSpecialPrice());
  //   cartItem.setQuantity(quantity);
  //   cartItem.setDiscount(product.getDiscount());
  //   cart.setTotalPrice(cartPrice + (cartItem.getProductPrice() - quantity));
  //   cartItem = cartItemRepo.save(cartItem);
  //   CartDTO cartDTO = modelMapper.map(cart, CartDTO.class);
  //   List<ProductDTO> productDTOs = cart.getCartItems().stream()
  //       .map(p -> modelMapper.map(p.getProduct(), ProductDTO.class)).collect(Collectors.toList());
  //   cartDTO.setProducts(productDTOs);
  //   return cartDTO;
  // }

  @Override
  public String deleteProductFromCart(Long cartId, Long productId) {
    Cart cart = cartRepo.findById(cartId)
        .orElseThrow(() -> new ResourceNotFoundException("Cart", "cartId", cartId));
    CartItem cartItem =

        cartItemRepo.findCartItemByProductIdAndCartId(cartId, productId);
    if (cartItem == null) {
      throw new ResourceNotFoundException("Product", "productId", productId);
    }
    cart.setTotalPrice(cart.getTotalPrice() - (cartItem.getProductPrice() * cartItem.getQuantity()));
    Product product = cartItem.getProduct();
    product.setQuantity(product.getQuantity() + cartItem.getQuantity());
    cartItemRepo.deleteCartItemByProductIdAndCartId(cartId, productId);
    return "Product" + cartItem.getProduct().getProductName() + "removed from the cart !!!";
  }
}