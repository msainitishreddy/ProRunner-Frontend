import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Cart.css";

const Cart = () => {
  const [cartDetails, setCartDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMerged, setIsMerged] = useState(false);
  const navigate = useNavigate();

  const fetchCart = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");
    const sessionId = localStorage.getItem("sessionId");

    if(token && userId){
      try {
        const response = await fetch(`http://localhost:8080/api/cart/user/${userId}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCartDetails(data.data);
        } else {
          console.error("Failed to fetch cart details");
        }
      } catch (error) {
          console.error("Error fetching cart details:", error);
      }
    } else if(sessionId){
      try{
        const response = await fetch(`http://localhost:8080/api/cart/session/${sessionId}`,{
          method: "GET"
        });
        if(response.ok){
          const data = await response.json();
          setCartDetails(data.data);
        } else {
          console.error("Failed to fetch cart details for a guest user...");
        }
      } catch(error){
        console.error("Error while fetching cart details for a guest user: ", error);
      }
    } else{
      navigate("/login");
    }
  },[navigate]);

  const mergeCarts = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");
    const sessionId = localStorage.getItem("sessionId");

    if(token && userId && sessionId){
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:8080/api/cart/merge?guestSessionId=${sessionId}&userId=${userId}`, {
          method: "POST",
          headers: {
            "Authorization" : `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log("Merge Response Data:", data);

        if(response.ok){
          await fetchCart();
          localStorage.removeItem("sessionId");
          setIsMerged(true);
        } else {
          setError(data.message || "Failed to merge carts");
        }
      } catch (error) {
        setError("An error occurred while merging the carts.");
        console.error("Error while merging the carts: ", error);
      } finally {
        setLoading(false);
      }
    }else {
      console.error("Missing sessionId, userId, or token for cart merge");
    }
  },[fetchCart]);

  const handleQuantityChange = async(productId, increment) => {
    const token = localStorage.getItem("authToken");
    const sessionId = localStorage.getItem("sessionId");
    const userId = localStorage.getItem("userId");

    const url = token
        ? `http://localhost:8080/api/cart/quantity/${productId}?increment=${increment}&userId=${userId}`
        : `http://localhost:8080/api/cart/quantity/${productId}?increment=${increment}&sessionId=${sessionId}`;

    console.log(`Updating quantity for product ${productId}, increment: ${increment}`);
    
    try {
      const response = await fetch (url,{
        method: "PATCH",
        headers : {
          "Authorization": token ? `Bearer ${token}` : "",
        },
      });

      if(response.ok){
        await fetchCart();
      } else {
        console.error("Failed to update the quantity");
      }
    } catch (error){
      console.error("Error updating the quantity: ",error);
    }
  }

  const handleRemoveProduct = async(productId) => {
    const token = localStorage.getItem("authToken");
    const sessionId = localStorage.getItem("sessionId");
    const userId = localStorage.getItem("userId");

    const url = token
      ? `http://localhost:8080/api/cart/remove/${productId}?userId=${userId}`
      : `http://localhost:8080/api/cart/remove/${productId}?sessionId=${sessionId}`;

    try {
      const response = await fetch(url,{
        method: "DELETE",
        headers: {
          "Authorization" : token ? `Bearer ${token}` : "",
        },
      });

      if(response.ok){
        await fetchCart();
      } else {
        console.error("Error while removing the product from the cart...",response.statusText);
        alert("Failed to remove product from cart.");
      }
    } catch (error){
      console.error("Error removing the product from the cart ", error);
      alert("An error occurred while removing the product.");
    }
  }

  useEffect(()=>{
    fetchCart();
  },[fetchCart]);

  // Merge guest and user carts if the user logs in and the guest cart is present
  useEffect(()=>{
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");
    const sessionId = localStorage.getItem("sessionId");

    if (!isMerged && token && userId && sessionId) {
      mergeCarts();
    }
  }, [isMerged, mergeCarts]);

  console.log("Cart Details State:", cartDetails);

  return (
    <div className="cartContainer">
      <h1>Your Cart</h1>
      {cartDetails ? (
        <div>
          <h2 className="cartItemsHeader">Products in your cart</h2>
          <div className="layout-main">
            <div className="cartProductList">
              {cartDetails.cartProducts && cartDetails.cartProducts.length > 0 ? (
                cartDetails.cartProducts.map((product) => (
                  <div key={product.id} className="cartItem">
                    <div className="outerDiv-one">
                      <img
                        src={product.imageUrl || "https://via.placeholder.com/150"}
                        alt={product.productName}
                        className="cartItemImage"
                      />
                      <div className="cartItemDetails">
                        <h3 className="cartItemTitle-1">{product.productName}</h3>
                        <p className="cartItemTitle">Price: ${product.unitPrice}</p>
                        <p className="cartItemTitle">Quantity: {product.quantity}</p>
                        <p className="cartItemTitle">Subtotal: ${product.subTotal}</p>
                      </div>
                    </div>
                    <div className="outerDiv">
                      <div className="updateDivContainer" >
                        <button
                          className="updateButton"
                          onClick={(e)=> handleQuantityChange(product.productId, true)}>
                            +
                        </button>
                        <button
                          className="updateButton"
                          onClick={() => handleQuantityChange(product.productId, false)}>
                            -
                        </button>
                      </div>
                      <div>
                        <button
                          className="removeButton"
                          onClick={()=>(handleRemoveProduct(product.productId))}>
                            Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>Your cart is empty.</p>
              )}
            </div>
            <div className="cartSummary">
              <h3 className="cartSummaryText">Total Price: ${cartDetails.totalPrice}</h3>
              <button className="checkoutButton"> Proceed to Checkout </button>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading cart...</p>
      )}
    </div>
  );
};

export default Cart;
