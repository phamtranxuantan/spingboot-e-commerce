import { ADD_TO_CART, REMOVE_FROM_CART, UPDATE_CART_QUANTITY, SET_CART } from '../actions/cartActions';

const initialState = {
    products: JSON.parse(localStorage.getItem('cartProducts')) || [],
    totalPrice: 0,
};

const calculateTotalPrice = (products) => {
    return products.reduce((total, product) => total + product.specialPrice * product.quantity, 0);
};

const cartReducer = (state = initialState, action) => {
    let updatedProducts;
    switch (action.type) {
        case ADD_TO_CART:
            updatedProducts = [...state.products, action.payload];
            localStorage.setItem('cartProducts', JSON.stringify(updatedProducts));
            return {
                ...state,
                products: updatedProducts,
                totalPrice: calculateTotalPrice(updatedProducts),
            };
        case REMOVE_FROM_CART:
            updatedProducts = state.products.filter(product => product.productId !== action.payload);
            localStorage.setItem('cartProducts', JSON.stringify(updatedProducts));
            return {
                ...state,
                products: updatedProducts,
                totalPrice: calculateTotalPrice(updatedProducts),
            };
        case UPDATE_CART_QUANTITY:
            updatedProducts = state.products.map(product =>
                product.productId === action.payload.productId
                    ? { ...product, quantity: action.payload.quantity }
                    : product
            );
            localStorage.setItem('cartProducts', JSON.stringify(updatedProducts));
            return {
                ...state,
                products: updatedProducts,
                totalPrice: calculateTotalPrice(updatedProducts),
            };
        case SET_CART:
            const products = Array.isArray(action.payload.products) ? action.payload.products : [];
            localStorage.setItem('cartProducts', JSON.stringify(products));
            return {
                ...state,
                products: products,
                totalPrice: action.payload.totalPrice || calculateTotalPrice(products),
            };
        default:
            return state;
    }
};

export default cartReducer;
