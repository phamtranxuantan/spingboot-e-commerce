import { GET_ID } from '../../api/apiService';

export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const UPDATE_CART_QUANTITY = 'UPDATE_CART_QUANTITY';
export const SET_CART = 'SET_CART';

export const addToCart = (product) => ({
    type: ADD_TO_CART,
    payload: product,
});

export const removeFromCart = (productId) => ({
    type: REMOVE_FROM_CART,
    payload: productId,
});

export const updateCartQuantity = (productId, quantity) => ({
    type: UPDATE_CART_QUANTITY,
    payload: { productId, quantity },
});

export const setCart = (cart) => ({
    type: SET_CART,
    payload: cart,
});

export const fetchCartData = (userEmail, cartId) => {
    return async (dispatch) => {
        try {
            const response = await GET_ID(`users/${encodeURIComponent(userEmail)}/carts`, cartId);
            dispatch(setCart(response)); // Dispatch action setCart to update cart from server
        } catch (error) {
            console.error("There was an error fetching the cart data!", error);
        }
    };
};
