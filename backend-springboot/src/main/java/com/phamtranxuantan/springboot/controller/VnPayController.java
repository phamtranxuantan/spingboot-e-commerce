package com.phamtranxuantan.springboot.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.phamtranxuantan.springboot.config.VnPayConfig;
import com.phamtranxuantan.springboot.payloads.VnPayDTO;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.servlet.http.HttpServletRequest;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;

/**
 *
 * @author CTT VNPAY
 */
@RestController
@RequestMapping("/api")
@SecurityRequirement(name = "E-Commerce Application")
public class VnPayController {

    @GetMapping("/public/paymentVnpay")
    public ResponseEntity<?> createPayment(
            HttpServletRequest req,
            @RequestParam String orderId,  // Lấy orderId từ query parameter
            @RequestParam long totalPrice // Lấy tổng tiền từ query parameter
    ) {
        try {
            // **Kiểm tra tổng tiền hợp lệ**
            if (totalPrice <= 0) {
                // Log lỗi nếu tổng tiền <= 0
                System.err.println("Tổng tiền không hợp lệ: " + totalPrice);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Tổng tiền phải lớn hơn 0.");
            }

            System.out.println("Thông tin thanh toán: orderId=" + orderId + ", totalPrice=" + totalPrice);

            // **Lấy địa chỉ IP**
            //String vnp_IpAddr = VnPayConfig.getIpAddress(req);
            String vnp_IpAddr = req.getRemoteAddr().equals("0:0:0:0:0:0:0:1") ? "127.0.0.1" : req.getRemoteAddr();
            // **Bước 2: Thiết lập các tham số thanh toán**
            Map<String, String> vnp_Params = new HashMap<>();
            vnp_Params.put("vnp_Version", VnPayConfig.vnp_Version);
            vnp_Params.put("vnp_Command", VnPayConfig.vnp_Command);
            vnp_Params.put("vnp_TmnCode", VnPayConfig.vnp_TmnCode);
            vnp_Params.put("vnp_Amount", String.valueOf(totalPrice * 100)); // Tổng tiền tính bằng đồng
            vnp_Params.put("vnp_CurrCode", "VND");
            vnp_Params.put("vnp_TxnRef", orderId); // Mã đơn hàng
            vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang " + orderId);
            vnp_Params.put("vnp_OrderType", VnPayConfig.orderType);
            vnp_Params.put("vnp_Locale", "vn"); // Ngôn ngữ
            vnp_Params.put("vnp_ReturnUrl", VnPayConfig.vnp_ReturnUrl); // URL callback
            vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

            // **Thêm ngày giờ giao dịch**
            Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
            SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
            String vnp_CreateDate = formatter.format(cld.getTime());
            vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

            // // **Thêm ngày giờ hết hạn**
            // cld.add(Calendar.MINUTE, 15);
            // String vnp_ExpireDate = formatter.format(cld.getTime());
            // vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

            System.out.println("Tham số thanh toán VNPAY: " + vnp_Params);

            // **Bước 3: Sắp xếp các trường và tạo chuỗi hash**
            List fieldNames = new ArrayList(vnp_Params.keySet());
            Collections.sort(fieldNames);
            StringBuilder hashData = new StringBuilder();
            StringBuilder query = new StringBuilder();
            Iterator itr = fieldNames.iterator();
            while (itr.hasNext()) {
                String fieldName = (String) itr.next();
                String fieldValue = (String) vnp_Params.get(fieldName);
                if ((fieldValue != null) && (fieldValue.length() > 0)) {
                    //Build hash data
                    hashData.append(fieldName);
                    hashData.append('=');
                    hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                    //Build query
                    query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                    query.append('=');
                    query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                    if (itr.hasNext()) {
                        query.append('&'); 
                        hashData.append('&');
                    }
                }
            }
            String queryUrl = query.toString();
            String vnp_SecureHash = VnPayConfig.hmacSHA512(VnPayConfig.secretKey, hashData.toString());
            queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
            String paymentUrl = VnPayConfig.vnp_PayUrl + "?" + queryUrl;
            

            // **Trả về DTO**
            VnPayDTO payDTO = new VnPayDTO();
            payDTO.setStatus("OK");
            payDTO.setMessage("Successfully");
            payDTO.setURL(paymentUrl);

            return ResponseEntity.status(HttpStatus.OK).body(payDTO);

        } catch (NumberFormatException e) {
            // Log lỗi khi parse dữ liệu
            System.err.println("Lỗi định dạng số trong request: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Dữ liệu không hợp lệ: " + e.getMessage());
        } catch (NullPointerException e) {
            // Log lỗi khi dữ liệu thiếu
            System.err.println("Thiếu dữ liệu trong request: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Thiếu dữ liệu trong request: " + e.getMessage());
        } catch (Exception e) {
            // Log lỗi chung
            System.err.println("Lỗi khi tạo thanh toán: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi tạo thanh toán: " + e.getMessage());
        }
    }

}
