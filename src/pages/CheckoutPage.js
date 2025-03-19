import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CheckoutPage.css";

const CheckoutPage = () => {
    const [cartDetails, setCartDetails] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    // Fetch Cart Details
    useEffect(() => {
        const fetchCartDetails = async () => {
            const userId = localStorage.getItem("userId");
            const token = localStorage.getItem("authToken");

            try {
                const response = await fetch(`http://localhost:8080/api/cart/user/${userId}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setCartDetails(data?.data || {});
                } else {
                    setError("Failed to fetch cart details.");
                }
            } catch (error) {
                setError("Error fetching cart details.");
                console.error("Error fetching cart details:", error);
            }
        };

        fetchCartDetails();
    }, []);

    // Fetch User Addresses
    useEffect(() => {
        const fetchAddresses = async () => {
            const userId = localStorage.getItem("userId");
            const token = localStorage.getItem("authToken");

            try {
                const response = await fetch(`http://localhost:8080/api/users/${userId}/addresses`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    setError(errorData.message || "Failed to fetch addresses.");
                    return;
                } 
                const data = await response.json();
                setAddresses(data.data || []);
            } catch (error) {
                setError("Error fetching addresses.");
                console.error("Error fetching addresses:", error);
            }
        };

        fetchAddresses();
    }, []);

    // Handle Address Selection
    const handleAddressSelect = (addressId) => {
        setSelectedAddress(addressId);
    };

    // Redirect to Address Management Page
    const handleManageAddress = () => {
        navigate('/addresses');
    };

    // Place Order
    const handlePlaceOrder = async () => {
        const token = localStorage.getItem("authToken");
        const userId = localStorage.getItem("userId");
        const cartId = localStorage.getItem("cartId");

        if (!cartId) {
            alert("Cart ID is missing. Please try refreshing the page or adding items to your cart.");
            return;
        }
        if (!selectedAddress) {
            alert("Please select a delivery address.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`http://localhost:8080/api/orders/${cartId}?userId=${userId}&addressId=${selectedAddress}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (response.ok) {
                alert("Order placed successfully!");
                navigate("/order-confirmation");
            } else {
                const data = await response.json();
                setError(data.message || "Failed to place order.");
            }
        } catch (error) {
            setError("An error occurred while placing the order.");
            console.error("Order placement error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="checkoutContainer">
            <h1>Checkout</h1>

            {/* Display Cart Products */}
            <div className="cartProductsSection">
                <h2>Your Products</h2>
                {cartDetails.cartProducts && cartDetails.cartProducts.length > 0 ? (
                    cartDetails.cartProducts.map((product) => (
                        <div key={product.id} className="productItem">
                            <img
                                src={product.imageUrl || "https://via.placeholder.com/150"}
                                alt={product.productName}
                                className="productImage"
                            />
                            <div className="productDetails">
                                <p>{product.productName}</p>
                                <p>Price: ${product.unitPrice}</p>
                                <p>Quantity: {product.quantity}</p>
                                <p>Subtotal: ${product.subTotal}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Your cart is empty.</p>
                )}

                {/* Display Total Price */}
                {cartDetails.totalPrice && (
                    <div className="totalPriceSection">
                        <h3>Total Price: ${cartDetails.totalPrice.toFixed(2)}</h3>
                    </div>
                )}
            </div>

            {/* Display Addresses */}
            <div className="addressSection">
                <h2>Select a Delivery Address</h2>
                {addresses.length > 0 ? (
                    <div className="addressList">
                        {addresses.map((address) => (
                            <div
                                key={address.id}
                                className={`addressItem ${selectedAddress === address.id ? "selected" : ""}`}
                                onClick={() => handleAddressSelect(address.id)}
                            >
                                <p>{address.street}, {address.city}, {address.state} - {address.zipCode}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        <p>No addresses found. Please add one from your profile.</p>
                        <button className="manageAddressButton" onClick={handleManageAddress}>
                            Manage Addresses
                        </button>
                    </>
                )}
            </div>

            {/* Place Order Button */}
            <button
                className="placeOrderButton"
                onClick={handlePlaceOrder}
                disabled={loading || !selectedAddress}
            >
                Place Order
            </button>

            {loading && <p>Processing your order...</p>}
            {error && <p className="error">{error}</p>}

            {/* Manage Addresses Button */}
            <div className="manageAddressSection">
                <button className="manageAddressButton" onClick={handleManageAddress}>
                    Manage Addresses
                </button>
            </div>
        </div>
    );
};

export default CheckoutPage;
