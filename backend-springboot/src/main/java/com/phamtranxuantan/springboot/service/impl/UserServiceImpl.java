package com.phamtranxuantan.springboot.service.impl;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.phamtranxuantan.springboot.config.AppConstants;
import com.phamtranxuantan.springboot.entity.Address;
import com.phamtranxuantan.springboot.entity.Cart;
import com.phamtranxuantan.springboot.entity.Role;
import com.phamtranxuantan.springboot.entity.User;
import com.phamtranxuantan.springboot.exceptions.APIException;
import com.phamtranxuantan.springboot.exceptions.ResourceNotFoundException;
import com.phamtranxuantan.springboot.payloads.AddressDTO;
import com.phamtranxuantan.springboot.payloads.CartDTO;
import com.phamtranxuantan.springboot.payloads.ProductDTO;
import com.phamtranxuantan.springboot.payloads.UserDTO;
import com.phamtranxuantan.springboot.payloads.UserResponse;
import com.phamtranxuantan.springboot.repository.AddressRepo;
import com.phamtranxuantan.springboot.repository.RoleRepo;
import com.phamtranxuantan.springboot.repository.UserRepo;
import com.phamtranxuantan.springboot.service.CartService;
import com.phamtranxuantan.springboot.service.FileService;
import com.phamtranxuantan.springboot.service.UserService;

import jakarta.transaction.Transactional;

@Transactional
@Service
public class UserServiceImpl implements UserService {
  @Autowired
  private UserRepo userRepo;
  @Autowired
  private RoleRepo roleRepo;
  @Autowired
  private AddressRepo addressRepo;
  @Autowired
  private CartService cartService;
  @Autowired
  private PasswordEncoder passwordEncoder;
  @Autowired
  private ModelMapper modelMapper;
  @Autowired
  private FileService fileService;
  @Value("${project.imageUsers}")
  private String path;

  @Override
  public UserDTO registerUser(UserDTO userDTO) {
    try {
      User user = modelMapper.map(userDTO, User.class);
      Cart cart = new Cart();
      cart.setUser(user);
      user.setCart(cart);
      Role role = roleRepo.findById(AppConstants.USER_ID).get();
      user.getRoles().add(role);
      String name = userDTO.getAddress().getName();
      String phone = userDTO.getAddress().getPhone();
      String province = userDTO.getAddress().getProvince();
      String district = userDTO.getAddress().getDistrict();
      String ward = userDTO.getAddress().getWard();
      String addressDetail = userDTO.getAddress().getAddressDetail();
      boolean isDefault = userDTO.getAddress().isDefault();
      Address address = addressRepo.findByProvinceDistrictWardAddressDetail(name, phone, province, district, ward,
          addressDetail, isDefault);
      if (address == null) {
        address = new Address(name, phone, province, district, ward, addressDetail, isDefault);
        address = addressRepo.save(address);
      }
      user.setAddresses(List.of(address));
      User registeredUser = userRepo.save(user);
      cart.setUser(registeredUser);
      userDTO = modelMapper.map(registeredUser, UserDTO.class);
      userDTO.setAddress(modelMapper.map(user.getAddresses().stream().findFirst().get(), AddressDTO.class));
      return userDTO;
    } catch (DataIntegrityViolationException e) {
      throw new APIException("User already exists with emailId: " + userDTO.getEmail());
    }
  }

  @Override
  public UserDTO getUserByEmail(String email) {
    User user = userRepo.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    UserDTO userDTO = modelMapper.map(user, UserDTO.class);
    if (user.getAddresses() != null && !user.getAddresses().isEmpty()) {
      userDTO.setAddress(modelMapper.map(user.getAddresses().stream().findFirst().get(), AddressDTO.class));
    }
    if (user.getCart() != null) {
      CartDTO cart = modelMapper.map(user.getCart(), CartDTO.class);
      List<ProductDTO> products = user.getCart().getCartItems().stream()
          .map(item -> modelMapper.map(item.getProduct(), ProductDTO.class)).collect(Collectors.toList());
      cart.setProducts(products);
      userDTO.setCart(cart);
    }
    return userDTO;
  }

  @Override
  public UserResponse getAllUsers(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
    Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending()
        : Sort.by(sortBy).descending();
    Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);
    Page<User> pageUsers = userRepo.findAll(pageDetails);
    List<User> users = pageUsers.getContent();
    if (users.size() == 0) {
      throw new APIException("No User exists !!!");
    }
    List<UserDTO> userDTOS = users.stream().map(user -> {
      UserDTO dto = modelMapper.map(user, UserDTO.class);
      if (user.getAddresses().size() != 0) {
        dto.setAddress(modelMapper.map(user.getAddresses().stream().findFirst().get(), AddressDTO.class));
      }
      return dto;
    }).collect(Collectors.toList());
    UserResponse userResponse = new UserResponse();
    userResponse.setContent(userDTOS);
    userResponse.setPageNumber(pageUsers.getNumber());
    userResponse.setPageSize(pageUsers.getSize());
    userResponse.setTotalElements(pageUsers.getTotalElements());
    userResponse.setTotalPages(pageUsers.getTotalPages());
    userResponse.setLastPage(pageUsers.isLast());
    return userResponse;
  }

  @Override
  public UserDTO getUserById(Long userId) {
    User user = userRepo.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User", "userId", userId));
    UserDTO userDTO = modelMapper.map(user, UserDTO.class);
    userDTO.setAddress(modelMapper.map(user.getAddresses().stream().findFirst().get(), AddressDTO.class));
    return userDTO;
  }

  @Override
  public UserDTO updateUser(Long userId, UserDTO userDTO) {
    User user = userRepo.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User", "userId", userId));
    String encodedPass = passwordEncoder.encode(userDTO.getPassword());
    user.setFirstName(userDTO.getFirstName());
    user.setLastName(userDTO.getLastName());
    // user.setMobileNumber(userDTO.getMobileNumber());
    // user.setEmail(userDTO.getEmail());
    user.setPassword(encodedPass);

    if (userDTO.getAddress() != null) {
      String name = userDTO.getAddress().getName();
      String phone = userDTO.getAddress().getPhone();
      String province = userDTO.getAddress().getProvince();
      String district = userDTO.getAddress().getDistrict();
      String ward = userDTO.getAddress().getWard();
      String addressDetail = userDTO.getAddress().getAddressDetail();
      boolean isDefault = userDTO.getAddress().isDefault();
      Address address = addressRepo.findByProvinceDistrictWardAddressDetail(name, phone, province, district, ward,
          addressDetail, isDefault);
      if (address == null) {
        address = new Address(name, phone, province, district, ward, addressDetail, isDefault);
        address = addressRepo.save(address);
      }
    }
    userDTO = modelMapper.map(user, UserDTO.class);
    userDTO.setAddress(modelMapper.map(user.getAddresses().stream().findFirst().get(), AddressDTO.class));
    // CartDTO cart modelMapper.map(user.getCart(), CartDTO.class);
    // List<ProductDTO> products user.getCart().getCartItems().stream()
    // .map(item -> modelMapper.map(item.getProduct(),
    // ProductDTO.class)).collect(Collectors.toList());
    // userDTO.setCart(cart);
    // userDTO.getCart().setProducts (products);
    return userDTO;
  }

  @Override
  public String deleteUser(Long userId) {
    User user = userRepo.findById(userId)
        .orElseThrow(() -> new ResourceNotFoundException("User", "userId", userId));
    // List<CartItem> cartItems user.getCart().getCartItems();
    // Long cartId = user.getCart().getCartId();
    // cartItems.forEach(item -> {
    // Long productId = item.getProduct().getProductId();
    // cartService.deleteProductFromCart (cartId, productId);
    // });
    userRepo.delete(user);
    return "User with userId + userId" + "deletedsuccessfully!!!";
  }

  @Override
  public UserDTO updateUserImage(Long userId, MultipartFile image) throws IOException {
    User user = userRepo.findById(userId)
        .orElseThrow(() -> new ResourceNotFoundException("User", "userId", userId));
    String fileName = fileService.uploadImage(path, image);
    user.setImageUser(fileName);
    User updatedUser = userRepo.save(user);
    return modelMapper.map(updatedUser, UserDTO.class);
  }

  @Override
  public InputStream getUserImage(String fileName) throws FileNotFoundException {
    return fileService.getResource(path, fileName);
  }

  @Override
  public UserDTO updateUserByEmail(String email, UserDTO userDTO) {
    User user = userRepo.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    // String encodedPass = passwordEncoder.encode(userDTO.getPassword());
    user.setFirstName(userDTO.getFirstName());
    user.setLastName(userDTO.getLastName());
    user.setMobileNumber(userDTO.getMobileNumber());
    // user.setEmail(userDTO.getEmail());
    // user.setPassword(encodedPass);

    if (userDTO.getAddress() != null) {
      String name = userDTO.getAddress().getName();
      String phone = userDTO.getAddress().getPhone();
      String province = userDTO.getAddress().getProvince();
      String district = userDTO.getAddress().getDistrict();
      String ward = userDTO.getAddress().getWard();
      String addressDetail = userDTO.getAddress().getAddressDetail();
      boolean isDefault = userDTO.getAddress().isDefault();
      Address address = addressRepo.findByProvinceDistrictWardAddressDetail(name, phone, province, district, ward,
          addressDetail, isDefault);
      if (address == null) {
        address = new Address(name, phone, province, district, ward, addressDetail, isDefault);
        address = addressRepo.save(address);
      }
    }
    userDTO = modelMapper.map(user, UserDTO.class);
    userDTO.setAddress(modelMapper.map(user.getAddresses().stream().findFirst().get(), AddressDTO.class));
    return userDTO;
  }

  @Override
  public UserDTO updateUserImageByEmail(String email, MultipartFile image) throws IOException {
    User user = userRepo.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

    // Kiểm tra và xóa ảnh cũ nếu có
    if (user.getImageUser() != null) {
      fileService.deleteImage(path, user.getImageUser());
    }

    String fileName = fileService.uploadImage(path, image);
    user.setImageUser(fileName);
    User updatedUser = userRepo.save(user);
    return modelMapper.map(updatedUser, UserDTO.class);
  }

  @Override
  public void changePassword(String email, String newPassword) {
    User user = userRepo.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    String encodedPass = passwordEncoder.encode(newPassword);
    user.setPassword(encodedPass);
    userRepo.save(user);
  }

}