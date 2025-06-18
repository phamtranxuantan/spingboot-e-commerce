package com.phamtranxuantan.springboot.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.phamtranxuantan.springboot.entity.Address;
import com.phamtranxuantan.springboot.payloads.AddressDTO;
import com.phamtranxuantan.springboot.service.AddressService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
@SecurityRequirement(name = "E-Commerce Application")
public class AddressController {
    @Autowired
    private AddressService addressService;

    @PostMapping("/admin/users/{userId}/addresses")
    public ResponseEntity<AddressDTO> createAddressForUser(
            @PathVariable Long userId,
            @Valid @RequestBody AddressDTO addressDTO) {

        AddressDTO savedAddressDTO = addressService.createAddress(userId, addressDTO);
        return new ResponseEntity<>(savedAddressDTO, HttpStatus.CREATED);
    }

    @GetMapping("/admin/addresses")
    public ResponseEntity<List<AddressDTO>> getAddresses() {
        List<AddressDTO> addressDTOS = addressService.getAddresses();
        return new ResponseEntity<List<AddressDTO>>(addressDTOS, HttpStatus.FOUND);
    }

    @GetMapping("/admin/addresses/{addressId}")
    public ResponseEntity<AddressDTO> getAddress(@PathVariable Long addressId) {
        AddressDTO addressDTO = addressService.getAddress(addressId);
        return new ResponseEntity<AddressDTO>(addressDTO, HttpStatus.FOUND);
    }

    @PutMapping("/admin/users/{userId}/addresses/{addressId}")
    public ResponseEntity<AddressDTO> updateUserAddress(
            @PathVariable Long userId,
            @PathVariable Long addressId,
            @Valid @RequestBody Address address) {

        AddressDTO updatedAddressDTO = addressService.updateAddress(userId, addressId, address);
        return new ResponseEntity<>(updatedAddressDTO, HttpStatus.OK);
    }

    @DeleteMapping("/admin/addresses/{addressId}")
    public ResponseEntity<String> deleteAddress(@PathVariable Long addressId) {
        String status = addressService.deleteAddress(addressId);
        return new ResponseEntity<String>(status, HttpStatus.OK);
    }

    // api /public/users
    @PostMapping("/public/users/addresses")
    public ResponseEntity<AddressDTO> createAddressForUserByEmail(
            @RequestParam String email,
            @Valid @RequestBody AddressDTO addressDTO) {

        Long userId = addressService.getUserIdByEmail(email);
        AddressDTO savedAddressDTO = addressService.createAddressByEmail(userId, email, addressDTO);
        return new ResponseEntity<>(savedAddressDTO, HttpStatus.CREATED);
    }

    @GetMapping("/public/users/addresses")
    public ResponseEntity<List<AddressDTO>> getAddressesByUserIdAndEmail(
            @RequestParam String email) {

        Long userId = addressService.getUserIdByEmail(email);
        List<AddressDTO> addressDTOS = addressService.getAddressesByUserIdAndEmail(userId, email);
        return new ResponseEntity<>(addressDTOS, HttpStatus.OK);
    }

    @GetMapping("/public/users/addresses/{addressId}")
    public ResponseEntity<AddressDTO> getAddressByEmail(
            @PathVariable Long addressId,
            @RequestParam String email) {

        Long userId = addressService.getUserIdByEmail(email);
        AddressDTO addressDTO = addressService.getAddressByEmail(userId, addressId, email);
        return new ResponseEntity<>(addressDTO, HttpStatus.OK);
    }

    @PutMapping("/public/users/addresses/{addressId}")
    public ResponseEntity<AddressDTO> updateUserAddressByEmail(
            @PathVariable Long addressId,
            @RequestParam String email,
            @Valid @RequestBody AddressDTO addressDTO) {

        Long userId = addressService.getUserIdByEmail(email);
        AddressDTO updatedAddressDTO = addressService.updateAddressByEmail(userId, addressId, email, addressDTO);
        return new ResponseEntity<>(updatedAddressDTO, HttpStatus.OK);
    }

    @DeleteMapping("/public/users/addresses/{addressId}")
    public ResponseEntity<String> deleteAddressByEmail(
            @PathVariable Long addressId,
            @RequestParam String email) {

        Long userId = addressService.getUserIdByEmail(email);
        String status = addressService.deleteAddressByEmail(userId, addressId, email);
        return new ResponseEntity<>(status, HttpStatus.OK);
    }

    @PutMapping("/public/users/addresses/{addressId}/default")
    public ResponseEntity<String> setDefaultAddressByEmail(
            @PathVariable Long addressId,
            @RequestParam String email) {

        Long userId = addressService.getUserIdByEmail(email);
        String status = addressService.setDefaultAddressByEmail(userId, addressId, email);
        return new ResponseEntity<>(status, HttpStatus.OK);
    }

    @GetMapping("/public/users/addresses/default")
    public ResponseEntity<AddressDTO> getDefaultAddressByEmail(@RequestParam String email) {
        Long userId = addressService.getUserIdByEmail(email);
        AddressDTO defaultAddress = addressService.getDefaultAddressByEmail(userId, email);
        return new ResponseEntity<>(defaultAddress, HttpStatus.OK);
    }

}