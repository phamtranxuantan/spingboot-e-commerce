package com.phamtranxuantan.springboot.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.phamtranxuantan.springboot.entity.Address;
import com.phamtranxuantan.springboot.entity.User;
import com.phamtranxuantan.springboot.exceptions.APIException;
import com.phamtranxuantan.springboot.exceptions.ResourceNotFoundException;
import com.phamtranxuantan.springboot.payloads.AddressDTO;
import com.phamtranxuantan.springboot.repository.AddressRepo;
import com.phamtranxuantan.springboot.repository.UserRepo;
import com.phamtranxuantan.springboot.service.AddressService;

import jakarta.transaction.Transactional;

@Transactional
@Service
public class AddressServiceImpl implements AddressService {
    @Autowired
    private AddressRepo addressRepo;
    @Autowired
    private UserRepo userRepo;
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public AddressDTO createAddress(Long userId, AddressDTO addressDTO) {
        String name = addressDTO.getName();
        String phone = addressDTO.getPhone();
        String province = addressDTO.getProvince();
        String district = addressDTO.getDistrict();
        String ward = addressDTO.getWard();
        String addressDetail = addressDTO.getAddressDetail();
        boolean isDefault = addressDTO.isDefault();
        Address addressFromDB = addressRepo.findByProvinceDistrictWardAddressDetail(name, phone, province, district,
                ward,
                addressDetail, isDefault);

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "userId", userId));

        if (addressFromDB != null) {
            // Address đã tồn tại, chỉ cần liên kết với user nếu chưa liên kết
            if (!user.getAddresses().contains(addressFromDB)) {
                user.getAddresses().add(addressFromDB);
                userRepo.save(user);
            }
            return modelMapper.map(addressFromDB, AddressDTO.class);
        }

        Address newAddress = modelMapper.map(addressDTO, Address.class);
        Address savedAddress = addressRepo.save(newAddress);
        user.getAddresses().add(savedAddress);
        userRepo.save(user);

        return modelMapper.map(savedAddress, AddressDTO.class);
    }

    // public AddressDTO createAddress(AddressDTO addressDTO) {
    // String province = addressDTO.getProvince();
    // String district = addressDTO.getDistrict();
    // String ward = addressDTO.getWard();
    // String addressDetail = addressDTO.getAddressDetail();
    // Address addressFromDB =
    // addressRepo.findByProvinceDistrictWardAddressDetail(province, district, ward,
    // addressDetail);
    // if (addressFromDB != null) {
    // throw new APIException("Address already exists with addressId:" +
    // addressFromDB.getAddressId());
    // }
    // Address address = modelMapper.map(addressDTO, Address.class);
    // Address savedAddress = addressRepo.save(address);
    // return modelMapper.map(savedAddress, AddressDTO.class);
    // }

    @Override
    public List<AddressDTO> getAddresses() {
        List<Address> addresses = addressRepo.findAll();
        List<AddressDTO> addressDTOS = addresses.stream().map(address -> modelMapper.map(address, AddressDTO.class))
                .collect(Collectors.toList());
        return addressDTOS;
    }

    @Override
    public AddressDTO getAddress(Long addressId) {
        Address address = addressRepo.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "addressId", addressId));
        return modelMapper.map(address, AddressDTO.class);
    }

    @Override
    public AddressDTO updateAddress(Long userId, Long addressId, Address addressRequest) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "userId", userId));

        Address existingAddress = addressRepo.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "addressId", addressId));

        Address targetAddress = addressRepo.findByProvinceDistrictWardAddressDetail(
                addressRequest.getName(), addressRequest.getPhone(),
                addressRequest.getProvince(), addressRequest.getDistrict(),
                addressRequest.getWard(), addressRequest.getAddressDetail(), addressRequest.isDefault());

        if (targetAddress != null) {
            // Address đã tồn tại -> Chuyển liên kết user sang address mới
            user.getAddresses().remove(existingAddress);
            if (!user.getAddresses().contains(targetAddress)) {
                user.getAddresses().add(targetAddress);
            }
            userRepo.save(user);
            return modelMapper.map(targetAddress, AddressDTO.class);
        } else {
            // Address chưa tồn tại -> cập nhật address hiện tại
            existingAddress.setName(addressRequest.getName());
            existingAddress.setPhone(addressRequest.getPhone());
            existingAddress.setProvince(addressRequest.getProvince());
            existingAddress.setDistrict(addressRequest.getDistrict());
            existingAddress.setWard(addressRequest.getWard());
            existingAddress.setAddressDetail(addressRequest.getAddressDetail());
            Address updatedAddress = addressRepo.save(existingAddress);
            return modelMapper.map(updatedAddress, AddressDTO.class);
        }
    }

    // public AddressDTO updateAddress(Long addressId, Address address) {
    // Address addressFromDB = addressRepo.findByProvinceDistrictWardAddressDetail(
    // address.getProvince(), address.getDistrict(), address.getWard(),
    // address.getAddressDetail());

    // if (addressFromDB == null) {
    // addressFromDB = addressRepo.findById(addressId)
    // .orElseThrow(() -> new ResourceNotFoundException("Address", "addressId",
    // addressId));
    // addressFromDB.setProvince(address.getProvince());
    // addressFromDB.setDistrict(address.getDistrict());
    // addressFromDB.setWard(address.getWard());
    // addressFromDB.setAddressDetail(address.getAddressDetail());
    // Address updatedAddress = addressRepo.save(addressFromDB);
    // return modelMapper.map(updatedAddress, AddressDTO.class);
    // } else {
    // List<User> users = userRepo.findByAddress(addressId);
    // final Address a = addressFromDB;
    // users.forEach(user -> user.getAddresses().add(a));
    // deleteAddress(addressId);
    // return modelMapper.map(addressFromDB, AddressDTO.class);
    // }
    // }

    @Override
    public String deleteAddress(Long addressId) {
        Address addressFromDB = addressRepo.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "addressId", addressId));
        List<User> users = userRepo.findByAddress(addressId);
        users.forEach(user -> {
            user.getAddresses().remove(addressFromDB);
            userRepo.save(user);
        });
        addressRepo.deleteById(addressId);
        return "Address deleted succesfully with addressId: " + addressId;
    }

    @Override
    public AddressDTO createAddressByEmail(Long userId, String email, AddressDTO addressDTO) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "userId", userId));

        if (!user.getEmail().equals(email)) {
            throw new APIException("Email does not match with userId: " + userId);
        }

        return createAddress(userId, addressDTO);
    }

    @Override
    public List<AddressDTO> getAddressesByUserIdAndEmail(Long userId, String email) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "userId", userId));

        if (!user.getEmail().equals(email)) {
            throw new APIException("Email does not match with userId: " + userId);
        }

        return user.getAddresses().stream()
                .map(address -> modelMapper.map(address, AddressDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public AddressDTO updateAddressByEmail(Long userId, Long addressId, String email, AddressDTO addressDTO) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "userId", userId));

        if (!user.getEmail().equals(email)) {
            throw new APIException("Email does not match with userId: " + userId);
        }

        Address existingAddress = addressRepo.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "addressId", addressId));

        Address targetAddress = addressRepo.findByProvinceDistrictWardAddressDetail(
                addressDTO.getName(), addressDTO.getPhone(),
                addressDTO.getProvince(), addressDTO.getDistrict(),
                addressDTO.getWard(), addressDTO.getAddressDetail(), addressDTO.isDefault());

        if (targetAddress != null) {
            // Address đã tồn tại -> Chuyển liên kết user sang address mới
            user.getAddresses().remove(existingAddress);
            if (!user.getAddresses().contains(targetAddress)) {
                user.getAddresses().add(targetAddress);
            }
            userRepo.save(user);
            return modelMapper.map(targetAddress, AddressDTO.class);
        } else {
            // Address chưa tồn tại -> cập nhật address hiện tại
            existingAddress.setName(addressDTO.getName());
            existingAddress.setPhone(addressDTO.getPhone());
            existingAddress.setProvince(addressDTO.getProvince());
            existingAddress.setDistrict(addressDTO.getDistrict());
            existingAddress.setWard(addressDTO.getWard());
            existingAddress.setAddressDetail(addressDTO.getAddressDetail());
            Address updatedAddress = addressRepo.save(existingAddress);
            return modelMapper.map(updatedAddress, AddressDTO.class);
        }
    }

    @Override
    public String deleteAddressByEmail(Long userId, Long addressId, String email) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "userId", userId));

        if (!user.getEmail().equals(email)) {
            throw new APIException("Email does not match with userId: " + userId);
        }

        Address address = addressRepo.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "addressId", addressId));

        if (user.getAddresses().contains(address)) {
            user.getAddresses().remove(address);
            userRepo.save(user);
            List<User> usersWithAddress = userRepo.findByAddress(addressId);
            if (usersWithAddress.isEmpty()) {
                addressRepo.delete(address);
            }
        } else {
            throw new ResourceNotFoundException("Address", "addressId", addressId);
        }

        return "Address unlinked and deleted successfully with addressId: " + addressId;
    }

    @Override
    public Long getUserIdByEmail(String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return user.getUserId();
    }

    @Override
    public String setDefaultAddressByEmail(Long userId, Long addressId, String email) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "userId", userId));

        if (!user.getEmail().equals(email)) {
            throw new APIException("Email does not match with userId: " + userId);
        }

        Address addressToSetDefault = addressRepo.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "addressId", addressId));

        user.getAddresses().forEach(address -> {
            if (address.isDefault()) {
                address.setDefault(false);
                addressRepo.save(address);
            }
        });

        addressToSetDefault.setDefault(true);
        addressRepo.save(addressToSetDefault);

        return "Address set as default successfully with addressId: " + addressId;
    }

    @Override
    public AddressDTO getAddressByEmail(Long userId, Long addressId, String email) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "userId", userId));

        if (!user.getEmail().equals(email)) {
            throw new APIException("Email does not match with userId: " + userId);
        }

        Address address = addressRepo.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "addressId", addressId));

        if (!user.getAddresses().contains(address)) {
            throw new ResourceNotFoundException("Address", "addressId", addressId);
        }

        return modelMapper.map(address, AddressDTO.class);
    }

    @Override
    public AddressDTO getDefaultAddressByEmail(Long userId, String email) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "userId", userId));

        if (!user.getEmail().equals(email)) {
            throw new APIException("Email does not match with userId: " + userId);
        }

        Address defaultAddress = user.getAddresses().stream()
                .filter(Address::isDefault)
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Address", "isDefault", "true"));

        return modelMapper.map(defaultAddress, AddressDTO.class);
    }
}