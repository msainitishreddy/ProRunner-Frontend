import axios from "axios";

const API_URL = "http://localhost:8080/api/cart";

export const addProductToCart = (productId, quantity) => {
    return axios.post(`${API_URL}/add`, {
        productId,
        quantity
    });
};

export const getCart = (cartId) => {
    if (!cartId) {
        throw new Error("Cart ID is required");
    }
    return axios.get(`${API_URL}/${cartId}`);
};

export const removeProductFromCart = (cartId, productId) => {
    return axios.delete(`${API_URL}/${cartId}/remove/${productId}`);
};

export const updateCartQuantity = (cartId, productId, increment) => {
    return axios.patch(`${API_URL}/${cartId}/quantity/${productId}`, {
        increment}
    );
};

export const clearCart = (cartId) => {
    return axios.delete(`${API_URL}/${cartId}/clear`);
};