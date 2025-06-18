import { AuthProvider, email } from "react-admin";
import axios from "axios";

interface LoginParams {
    username: string;
    password: string;
}
interface CheckParamsErr {
    status: number;
}
export const authProvider = {
    // called when the user attempts to log in
    login: async ({ username, password }: LoginParams) => {
        try {
            const response = await axios.post("http://localhost:8080/api/login", {
                email:username,
                password:password,
            },{
                headers: {
                    "Content-Type": "application/json",
                },
            withCredentials: true,
        });
            const token = response.data["jwt-token"];
            const email = response.data.email; 
            localStorage.setItem("adminEmail", email);
            localStorage.setItem("jwt-token", token);
            localStorage.setItem("username", token);
            const userResponse = await axios.get(`http://localhost:8080/api/public/users/email/${username}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const cartId=userResponse.data.cart.cartId;
            localStorage.setItem("cartId",cartId);
            return Promise.resolve();
        } catch (error) {
            return Promise.reject(new Error("Sai tên đăng nhập hoặc mật khẩu"));
        }
    },
    // called when the user clicks on the logout button
    logout: () => {
        localStorage.removeItem("jwt-token");
        localStorage.removeItem("username");
        localStorage.removeItem("adminEmail");
        localStorage.removeItem("cartId");
        localStorage.removeItem("globalEmailCart");
        localStorage.removeItem("globalCartId");
        return Promise.resolve();
    },
    // called when the API returns an error
    checkError: ({ status }: { status: number }) => {
        if (status === 401 || status === 403) {
            localStorage.removeItem("jwt-token");
            localStorage.removeItem("username");
            localStorage.removeItem("adminEmail");
            localStorage.removeItem("cartId");
            localStorage.removeItem("globalEmailCart");
            localStorage.removeItem("globalCartId");
            return Promise.reject();
        }
        return Promise.resolve();
    },
    // called when the user navigates to a new location, to check for authentication
    checkAuth:
    () => {
        return localStorage.getItem("jwt-token")? Promise.resolve(): Promise.reject();
    },
    // called when the user navigates to a new location, to check for permissions / roles
    getPermissions: () => Promise.resolve(),
};