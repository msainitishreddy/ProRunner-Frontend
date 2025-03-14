import axios from "axios";

const API_URL = "http://localhost:8080/api/wishlist";

export const addProductToWishlist = (productId) => {
    return axios.post(`${API_URL}/add/${userId}/${productId}`, {
        productId,
    });
};

export const getOrCreateWishlist = (userId) => {
    if (!userId) {
        throw new Error("User ID is required");
    }
    return axios.getOrCreateWishlist(`${API_URL}/user`);
};
