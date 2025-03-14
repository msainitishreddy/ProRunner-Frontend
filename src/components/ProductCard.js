import React, { useState } from "react";
import {FaRegHeart} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ProductCard = ({product}) => {
    
    const imgSrc = product.imageUrl || "https://via.placeholder.com/200";
    const [error,setError] = useState("");
    const [cartDetails, setCartDetails] = useState(null);
    const navigate = useNavigate();
    
    const handleAddToCart = async (productId, quantity) => {
        const token = localStorage.getItem("authToken");
        const sessionId = localStorage.getItem("sessionId");
        const userId = localStorage.getItem("userId");


        let url = `http://localhost:8080/api/cart/add?productId=${productId}&quantity=${quantity}`;
        let headers = {
            "Content-Type": "application/json",
        };

        if (userId) {
            headers["Authorization"] = `Bearer ${token}`;
            url += `&userId=${userId}`;
        } else if (sessionId) {
            url += `&sessionId=${sessionId}`
        } else {
            setError("Error: user must be logged in or have sessionId");
            return;
        }


        try {
            const response = await fetch(url, {
                method: "POST",
                headers: headers,
            });
            
            if (response.ok) {
                const updatedCart = await response.json();
                setCartDetails(updatedCart.data);
                alert("Product added to cart successfully...");
            } else {
                setError("Error while adding product to the cart.");
            }

        } catch (error) {
            setError("Error while adding product to cart...");
            console.error("Error: ", error);
        }
        navigate("/cart");
    };

    const handleAddToWishlist = async (productId) => {
        const token = localStorage.getItem("authToken");
        const userId = localStorage.getItem("userId");

        if (!userId) {
            setError("Error: User is not logged in");
            alert("Please login");
            return;
        }
        
        let url = `http://localhost:8080/api/wishlist/add?userId=${userId}&productId=${productId}`;
        let headers = {
            "Authorization" : `Bearer ${token}`,
            "Content-Type" : "application/json",
        };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: headers,
            });

            if(response.ok){
                alert("Product added to wishlist successfully...");
            } else {
                setError("Error while adding the product to the wishlist...");
            }
        } catch (error) {
            setError("Error when adding the product to the Wishlist");
            console.error("Error: ", error);
        }
    }



    const cardStyle = {
        backgroundColor: "white",
        padding: "20px",
        border: "2px solid black",
        borderRadius: "10px",
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "350px",
        minWidth: "225px"
    };

    const imgStyle = {
        width: "100%",
        height: "200px",
        borderRadius: "10px",
        objectFit: "contain",
        marginBottom: "10px"
    };

    const nameStyle = {
        fontSize: "1.2rem",
        fontWeight: "bold",
        margin: "10px 0",
    };

    const priceStyle = {
        fontSize: "1.1rem",
        color: "#333",
        marginBottom: "10px"
    };

    const buttonStyle = {
        backgroundColor: "#333",
        color: "white",
        border: "none",
        padding: "10px 20px",
        borderRadius: "5px",
        cursor: "pointer",
        marginTop: "auto",
        fontSize: "1rem",
        width: "60%"
    };

    const HeartIconStyle = {
        border: "none",
        fontSize: "2rem",
        padding: "5px 5px 5px 0"
    };

    return(
        <div style={cardStyle}>
            <img src={imgSrc} alt={product.name} style={imgStyle} loading="lazy"/>
            <h3 style={nameStyle}>{product.name}</h3>
            <p style={priceStyle}>${product.price}</p>
            <div style={{display: "flex", flexWrap: "wrap", justifyContent:"space-evenly", alignItems: "center"}}>
                <FaRegHeart style={HeartIconStyle} onClick={() => handleAddToWishlist(product.id)}/>
                <button style={buttonStyle} onClick={()=> handleAddToCart(product.id,1)}>
                    Add to Cart
                </button>
            </div>
            {error && <p style={{color:"red"}}>{error}</p>}
        </div>
    );
};


export default ProductCard;
