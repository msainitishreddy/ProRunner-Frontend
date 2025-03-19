import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {

    const [isMobileMenuVisible, setIsMobileMenuVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("authToken"));

    const navigate = useNavigate();


    const handleMenuToggle = () => {
        setIsMobileMenuVisible(!isMobileMenuVisible);
    };

    const updateWindowDimensions = () => {
        setIsMobile(window.innerWidth <= 768);
    };

    useEffect(() => {
        window.addEventListener('resize', updateWindowDimensions);
        //return () => window.removeEventListener('resize', updateWindowDimensions);
        const handleAuthChange = () => {
            setIsLoggedIn(!!localStorage.getItem("authToken"));
        };

        // Listen for both custom and storage events
        window.addEventListener("authStatusChange", handleAuthChange);

        return () => {
            window.removeEventListener('resize', updateWindowDimensions);
            window.removeEventListener("authStatusChange", handleAuthChange);
        };

    }, []);

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userId");
        setIsLoggedIn(false);
        navigate("/");
        window.dispatchEvent(new Event("authStatusChange"));
    }

    const handleWishlistClick = (e) => {
        if (!localStorage.getItem("authToken")) {
            e.preventDefault();
            alert("Please login to add products to your wishlist.");
            navigate("/login");
        }
    };
    
    const headerStyle = {
        height: "3.5rem",
        backgroundColor: "#333",
        color: "white",
        padding: "10px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        width: "100%"
    };

    const logoStyle = {
        fontSize: '1.5rem',
        fontWeight: 'bold',
    };

    const navStyle = {
        display: isMobile ? (isMobileMenuVisible ? "block" : "none") : 'flex',
        listStyle: 'none',
        margin: 0,
        padding: 0,
        flexDirection: isMobile ? "column" : "row",
        alignItems: "center",
        position: isMobileMenuVisible && isMobile ? "absolute" : "static",
        top: isMobileMenuVisible && isMobile ? "3.5rem" : "auto",
        backgroundColor: isMobileMenuVisible && isMobile ? "#333" : "transparent",
        width: isMobileMenuVisible && isMobile ? "100%" : "auto",
    };

    const navItemStyle = {
        marginRight: isMobile ? "0" : '20px',
        listStyle: "none",
        marginBottom: isMobile ? "10px" : "0",
    };

    const navLinkStyle = {
        color: 'white',
        textDecoration: 'none',
        padding: '10px',
        fontSize: '1.2rem',
    };

    const mobileMenuStyle = {
        display: isMobileMenuVisible ? "block" : "none",
        position: "absolute",
        top: "3.5rem",
        left: 0,
        right: 0,
        backgroundColor: "#333",
        zIndex: 999,
        padding: "1rem",
        listStyle: "none",
        margin: 0,
        textAlign: "center",
    };

    const mobileMenuButtonStyle = {
        display: isMobile ? "block" : "none",
        backgroundColor: "#333",
        color: "white",
        marginRight: "10px",
        padding: "10px",
        border: "none",
        cursor: "pointer",
        fontSize: "2rem",
        position: "absolute",
        right: "20px",
    };


    return(
        <header style={headerStyle}>
            <Link to="/" style={logoStyle}>
                <img src={"/images/logo.jpg"} alt="ProRunner Logo" style={{ width: "150px", height: "auto" }} />
            </Link>

            <nav style={navStyle}>
                <ul style={{ display: "flex", margin: 0, padding: 0 }}>
                    <li style={navItemStyle}>
                        <Link to="/" style={navLinkStyle}>Home</Link>
                    </li>
                    <li style={navItemStyle}>
                        <Link to="/shop" style={navLinkStyle}>Shop</Link>
                    </li>
                    <li style={navItemStyle}>
                        <Link to="/wishlist" onClick={handleWishlistClick} style={navLinkStyle}>Wishlist</Link>
                    </li>
                    <li style={navItemStyle}>
                        <Link to="/cart" style={navLinkStyle}>Cart</Link>
                    </li>
                    {isLoggedIn ? (
                        <li style={navItemStyle}>
                            <Link to="/" onClick={handleLogout} style={navLinkStyle}>Logout</Link>
                        </li>
                    ) : (
                        <>
                            <li style={navItemStyle}>
                                <Link to="/login" style={navLinkStyle}>Login</Link>
                            </li>
                            <li style={navItemStyle}>
                                <Link to="/register" style={navLinkStyle}>Register</Link>
                            </li>
                        </>
                    )}
                </ul>
            </nav>

            {/* Mobile menu */}
            <button style={mobileMenuButtonStyle} onClick={handleMenuToggle}>
                ☰
            </button>
            
            <div style={mobileMenuStyle}>
                <ul style={{padding:0, margin: 0}}>
                    <li style={navItemStyle}>
                        <Link to="/" style={navLinkStyle}>Home</Link>
                    </li>
                    <li style={navItemStyle}>
                        <Link to="/shop" style={navLinkStyle}>Shop</Link>
                    </li>
                    <li style={navItemStyle}>
                        <Link to="/cart" style={navLinkStyle}>Cart</Link>
                    </li>
                    <li style={navItemStyle}>
                        <Link to="/wishlist" onClick={handleWishlistClick} style={navLinkStyle}>Wishlist</Link>
                    </li>
                    {isLoggedIn ? (
                        <li style={navItemStyle}>
                            <Link to="/" onClick={handleLogout} style={navLinkStyle}>Logout</Link>
                        </li>
                    ) : (
                        <>
                            <li style={navItemStyle}>
                                <Link to="/login" style={navLinkStyle}>Login</Link>
                            </li>
                            <li style={navItemStyle}>
                                <Link to="/register" style={navLinkStyle}>Register</Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </header>
    );
};

export default Header;
