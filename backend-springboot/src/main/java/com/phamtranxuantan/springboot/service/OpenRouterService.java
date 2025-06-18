package com.phamtranxuantan.springboot.service;

import com.phamtranxuantan.springboot.config.OpenRouterConfig;
import com.phamtranxuantan.springboot.payloads.ProductDTO;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Map;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class OpenRouterService {

    private final OpenRouterConfig config;
    private final ProductService productService;

    @Autowired
    public OpenRouterService(OpenRouterConfig config, ProductService productService) {
        this.config = config;
        this.productService = productService;
    }
    //AI xử lý phản hồi -> chatbot 
    public String askAI(String message) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(config.getApiKeyChatBot());

        String payload = """
                {
                  "model": "deepseek/deepseek-r1:free",
                  "messages": [
                    {
                      "role": "user",
                      "content": "%s"
                    }
                  ]
                }
                """.formatted(message);

        HttpEntity<String> request = new HttpEntity<>(payload, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(config.getApiUrl(), request, String.class);
        try {
            JSONObject json = new JSONObject(response.getBody());
            return json
                    .getJSONArray("choices")
                    .getJSONObject(0)
                    .getJSONObject("message")
                    .getString("content");
        } catch (Exception e) {
            return "Lỗi xử lý phản hồi AI: " + e.getMessage();
        }
    }
    //AI xử lý ảnh -> description
    public String getImageDescription(String imageUrl) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(config.getApiKeyAIimage());

        String body = """
                {
                  "model": "meta-llama/llama-4-scout:free",
                  "messages": [{
                    "role": "user",
                    "content": [
                      {"type": "text", "text": "Viết mô tả chi tiết sản phẩm trong ảnh này."},
                      {"type": "image_url", "image_url": {"url": "%s"}}
                    ]
                  }]
                }
                """.formatted(imageUrl);

        HttpEntity<String> request = new HttpEntity<>(body, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(config.getApiUrl(), request, String.class);
        try {
            JSONObject json = new JSONObject(response.getBody());
            return json
                    .getJSONArray("choices")
                    .getJSONObject(0)
                    .getJSONObject("message")
                    .getString("content");
        } catch (Exception e) {
            return "Lỗi xử lý phản hồi AI: " + e.getMessage();
        }
    }

    public String generateSmartReply(String userMessage) {
        try {
            StringBuilder context = new StringBuilder();
            context.append("""
                    Bạn là trợ lý bán hàng thân thiện của cửa hàng bán thiết bị điện tử Alistyle.
                    Dưới đây là một số thông tin bạn có thể dùng để tư vấn khách hàng:
                    """);
            // Lấy danh sách sản phẩm theo danh mục
            Map<String, List<ProductDTO>> productsByCategory = productService.getProductsGroupedByCategoryChatBot();

            // Thêm thông tin danh mục và sản phẩm vào ngữ cảnh
            context.append("Các danh mục và sản phẩm hiện có:\n");
            for (String category : productsByCategory.keySet()) {
                context.append("- ").append(category).append(":\n");
                for (ProductDTO product : productsByCategory.get(category)) {
                    context.append("    • ").append(product.getProductName())
                            .append(" - ").append(String.format("%,.0fđ", product.getPrice()))
                            .append(" - Hình ảnh: ").append(product.getImageProduct())
                            .append("\n");
                }
            }
            List<ProductDTO> products = productService.getAllProductsChatBot(); // inject nếu chưa có

            for (int i = 0; i < Math.min(products.size(), 5); i++) {
                ProductDTO product = products.get(i);
                context.append(String.format("\n- %s: %,.0fđ - Hình ảnh: %s", product.getProductName(),
                        product.getPrice(), product.getImageProduct()));
            }

            context.append("\n\nNếu người dùng cần thêm sản phẩm, bạn có thể gợi ý tiếp.");
            context.append(
                    "\nLuôn giữ thái độ thân thiện, tích cực và gần gũi như một nhân viên bán hàng chuyên nghiệp 😊.");
            context.append("\n\nHãy trả lời người dùng một cách thân thiện, tự nhiên và chuyên nghiệp.");

            String fullPrompt = String.format("""
                    %s

                    Người dùng: %s
                    Trợ lý:
                    """, context, userMessage);

            return askAI(fullPrompt);
        } catch (Exception e) {
            return "Xin lỗi, hệ thống đang gặp sự cố. Vui lòng thử lại sau.";
        }
    }

    public String generateGeneralReply(String userMessage) {
        try {
            StringBuilder context = new StringBuilder();
            context.append("""
                    Bạn là trợ lý bán hàng thân thiện của cửa hàng bán thiết bị điện tử Alistyle.
                    Tuy nhiên hiện tại bạn chưa thể truy cập vào kho sản phẩm của cửa hàng.
                    """);
            context.append(
                    """
                            Bạn có thể gợi ý các xu hướng thương mại điện tử, các thiết bị điện tử phổ biến hoặc khuyến khích người dùng đăng nhập để xem các sản phẩm cụ thể trong cửa hàng.
                            """);
            context.append("""
                    Luôn giữ thái độ thân thiện, tích cực và gần gũi như một nhân viên bán hàng chuyên nghiệp 😊.
                    """);

            String fullPrompt = String.format("""
                    %s

                    Người dùng: %s
                    Trợ lý:
                    """, context, userMessage);

            return askAI(fullPrompt);
        } catch (Exception e) {
            return "Xin lỗi, hệ thống đang gặp sự cố. Vui lòng thử lại sau.";
        }
    }
}
