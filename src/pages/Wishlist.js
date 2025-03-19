import React, {useCallback, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
    const [wishlistDetails, setWishlistDetails] = useState(null);
    const [loading, setLoading] =  useState(true);
    const [error, setError] = useState(null);
    const [removeError, setRemoveError] = useState(null);
    const navigate = useNavigate();

    const fetchWishlist = useCallback( async () => {
        const token = localStorage.getItem("authToken");
        const userId = localStorage.getItem("userId");

        if(token && userId){
            try{
                const response = await fetch(`http://localhost:8080/api/wishlist/user?userId=${userId}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });
                if(response.ok) {
                    const data = await response.json();
                    console.log("Wishlist response data: ", data);
                    setWishlistDetails(data.data);
                } else {
                    setError("Failed to fetch wishlist details");
                }
            } catch (error) {
                setError("Error fetching Wishlist details: "+ error.message);
            } finally {
                setLoading(false);
            }
        } else {
            navigate("/shop");
        }
    }, [navigate]);

    const handleRemoveProduct = async(productId) => {
        const token = localStorage.getItem("authToken");
        const userId = localStorage.getItem("userId");

        const url = `http://localhost:8080/api/wishlist/remove?userId=${userId}&productId=${productId}`

        try {
            const response = await fetch(url, {
                method: "DELETE",
                headers: {"Authorization" : `Bearer ${token}`,
                },
            });
            
            if(response.ok){
                setWishlistDetails((prevDetails) => ({
                    ...prevDetails,
                    items: prevDetails.items.filter((product) => product.productId !== productId)
                }));
            } else {
                console.error("Error occurred while removing the product...", response.statusText);
                alert("Failed to remove product from wishlist");
            }
        } catch (error){
            console.error("Error while removing the product from the wishlist ", error);
            alert("An error occurred while rmeoving the product.");
        }
    };

    useEffect (()=>{
        fetchWishlist();
    },[fetchWishlist]);
    
    console.log("Wishlist Details state: ", wishlistDetails);

    const styles = {
        productGrid: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "20px",
            padding: "20px",
        },
        productCard: {
            backgroundColor: "#fff",
            border: "1px solid black",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
            textAlign: "center",
            padding: "10px",
            transition: "transform 0.2s ease",
        },
        productImage: {
            width: "100%",
            height: "200px",
            objectFit: "contain",
            borderRadius: "8px",
        },
        productInfo: {
            marginTop: "10px",
        },
        productTitle: {
            fontSize: "1rem",
            fontWeight: "bold",
            margin: "10px 0",
        },
        productDetails: {
            fontSize: "1rem",
            color: "#555",
            margin: "5px 0",
        },
        productPrice: {
            fontSize: "0.8rem",
            color: "#333",
            fontWeight: "bold",
            marginTop: "10px",
        },
        removeButton: {
            backgroundColor: "#333",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "auto",
            fontSize: "1rem",
            width: "80%"
        }
    };


    return(
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <div>
                    <h2>Products in your wishlist</h2>
                    {wishlistDetails?.items?.length > 0 ? (
                        <div style={styles.productGrid}>
                            {wishlistDetails.items.map((product) => (
                                <div key={product.id} product = {product} style={styles.productCard}>
                                    <img
                                        src={product.imageUrl || "https://via.placeholder.com/150"}
                                        alt={product.productName}
                                        style={styles.productImage}
                                    />
                                    <div style={styles.productInfo}>
                                        <h3 style={styles.productTitle}>{product.productName}</h3>
                                        <p style={styles.productDetails}>Size: {product.size}</p>
                                        <p style={styles.productDetails}>Color: {product.color}</p>
                                        <p style={styles.productPrice}>Price: ${product.unitPrice}</p>
                                    </div>
                                    <button 
                                    style={styles.removeButton}
                                    onClick={()=>handleRemoveProduct(product.productId)}>
                                        Remove
                                    </button>
                                    {removeError && <p style={{ color: "red" }}>{removeError}</p>}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>Your wishlist is empty. <a href="/shop">Explore products</a> to add your favorites!</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default Wishlist;
