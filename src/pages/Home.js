import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";

const Home = () => {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const homeStyle = {
        padding : '20px',
        marginTop: "3.5rem",
    };

    const headingStyle = {
        fontSize : '2rem',
        fontWeight : 'bold',
        marginBottom : '20px',
    }

    const productListStyle = {
        display : "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        justifyContent : "center",
        gap: "20px",
    }

    useEffect(()=>{
        const sessionId = localStorage.getItem("sessionId");

        if(!sessionId){
            const newSessionId = `session_${Math.random().toString(36).substring(2,9)}`;
            localStorage.setItem("sessionId",newSessionId);
            console.log("Generated sessionId: ",newSessionId);
        } else {
            console.log("Existing sessionId: ",sessionId);
        }
    },[]);

    useEffect (()=>{
        
        const fetchProducts = async () => {
            try{
                const response = await fetch("http://localhost:8080/api/products");
                const data = await response.json();

                if(response.ok){
                    setProducts(data.data.content);
                    console.log("Fetched products:", data.data.content);
                } else {
                    setError("Failed to load products.");
                } 
            } catch (error){
                setError("An error occurred while loading products.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading){
        return <p>Loading products...</p>
    }

    if (error){
        return <p>{error}</p>
    }

    const trendingProducts = products.slice(0,5);

    return(
        <div style={homeStyle}>
            <h2 style={headingStyle}>Featured Products</h2>
            <div className="product-list" style={productListStyle}>
                {trendingProducts.map((product)=>(
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};


export default Home;