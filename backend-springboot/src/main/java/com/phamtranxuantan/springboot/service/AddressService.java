package com.phamtranxuantan.springboot.service;

import java.util.List;

import com.phamtranxuantan.springboot.entity.Address;
import com.phamtranxuantan.springboot.payloads.AddressDTO;

public interface AddressService {
    AddressDTO createAddress(Long userId, AddressDTO addressDTO);

    List<AddressDTO> getAddresses();

    AddressDTO getAddress(Long addressId);

    AddressDTO updateAddress(Long userId, Long addressId, Address address);

    String deleteAddress(Long addressId);

    AddressDTO createAddressByEmail(Long userId, String email, AddressDTO addressDTO);

    List<AddressDTO> getAddressesByUserIdAndEmail(Long userId, String email);

    AddressDTO updateAddressByEmail(Long userId, Long addressId, String email, AddressDTO addressDTO);

    String deleteAddressByEmail(Long userId, Long addressId, String email);

    Long getUserIdByEmail(String email);

    String setDefaultAddressByEmail(Long userId, Long addressId, String email);

    AddressDTO getAddressByEmail(Long userId, Long addressId, String email);

    AddressDTO getDefaultAddressByEmail(Long userId, String email);
}
