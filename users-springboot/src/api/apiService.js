import axiosInstance from "./axoisConfig";

function callApi(endpoint, method = "GET", body, params) {
    const token = localStorage.getItem("authToken");
    const queryString = params ? new URLSearchParams(params).toString() : "";
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    const config = {
        method,
        url,
        headers: {
            ...(token && { "Authorization": `Bearer ${token}` }),
            "Content-Type": body instanceof FormData ? "multipart/form-data" : "application/json"
        },
        // headers: {
        //     "Authorization": token ? `Bearer ${token}` : undefined,
        //     "Content-Type": body instanceof FormData ? "multipart/form-data" : "application/json"
        // },
        data: body instanceof FormData ? body : body ? JSON.stringify(body) : null,
    };

    console.log("callApi url: ", url);
    console.log("callApi token: ", token);
    console.log("callApi body: ", body);

    return axiosInstance(config)
        .then((response) => {
            // Kiểm tra xem response có chứa data không
            if (response && response.data) {
                return response.data; // Trả về dữ liệu nếu có
            } else {
                console.error("Không nhận được dữ liệu trả về từ API");
                throw new Error("Không có dữ liệu trả về từ API");
            }
        })
        .catch((error) => {
            // Xử lý lỗi chi tiết
            console.error("API call error:", error);

            if (error.response) {
                // Lỗi từ server, kiểm tra mã trạng thái và log phản hồi
                console.error("Server error status:", error.response.status);
                console.error("Server error data:", error.response.data);
            } else if (error.request) {
                // Lỗi khi không nhận được phản hồi từ server (có thể do kết nối)
                console.error("No response received:", error.request);
            } else {
                // Lỗi nội bộ khi xử lý request
                console.error("Error message:", error.message);
            }
            // Ném lỗi lên trên để xử lý ở nơi gọi API
            throw error; 
        });
}

export function GET_ALL(endpoint, params) {
    return callApi(endpoint, "GET", null, params);
}

export function GET_ID(endpoint, id) {
    return callApi(endpoint + "/" + id, "GET");
}
export function GET_ID_ADDRESS(endpoint) {
    return callApi(endpoint, "GET");
}

export function POST_ADD(endpoint, data) {
    return callApi(endpoint, "POST", data);
}

export function PUT_EDIT(endpoint, data) {
    return callApi(endpoint, "PUT", data);
}

export function PUT_IMAGE(endpoint, formData) {
    return callApi(endpoint, "PUT", formData);
}

export function DELETE_ID(endpoint) {
    return callApi(endpoint, "DELETE");
}


export function LOGIN(body) {
    const API_URL_LOGIN = "http://localhost:8080/api/login";
    return axiosInstance.post(API_URL_LOGIN, body, {
        headers: {
            accept: "*/*",
            "Content-Type": "application/json",
        },
    })
    .then((response) => response)
    .catch((error) => {
        console.log(error);
        throw error;
    });
}

export function REGISTER(body) {
    const API_URL_REGISTER = "http://localhost:8080/api/register";
    return axiosInstance.post(API_URL_REGISTER, body, {
        headers: {
            accept: "*/*",
            "Content-Type": "application/json",
        },
    })
    .then((response) => response)
    .catch((error) => {
        console.log(error);
        throw error;
    });
}

export function LOGIN_GOOGLE() {
    const API_URL_GOOGLE_LOGIN = "http://localhost:8080/api/public/oauth2/google";
    return axiosInstance.get(API_URL_GOOGLE_LOGIN, {
        headers: {
            accept: "*/*",
            "Content-Type": "application/json",
        },
    })
    .then((response) => response.data)
    .catch((error) => {
        console.log(error);
        throw error;
    });
}