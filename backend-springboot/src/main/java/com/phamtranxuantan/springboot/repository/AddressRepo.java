package com.phamtranxuantan.springboot.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.phamtranxuantan.springboot.entity.Address;

@Repository
public interface AddressRepo extends JpaRepository<Address, Long> {
    @Query("SELECT a FROM Address a WHERE a.name = :name AND a.phone = :phone AND a.province = :province AND a.district = :district AND a.ward = :ward AND a.addressDetail = :addressDetail AND a.isDefault = :isDefault")
    Address findByProvinceDistrictWardAddressDetail(@Param("name") String name, @Param("phone") String phone, @Param("province") String province,
            @Param("district") String district, @Param("ward") String ward,
            @Param("addressDetail") String addressDetail, @Param("isDefault") boolean isDefault);
}