import React, { useState} from "react";
import { Link, useNavigate} from "react-router-dom";
import { FaEye, FaEyeSlash} from "react-icons/fa";

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false); // State to toggle password visibility
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false); // For confirm password

    const navigate = useNavigate(); // Hook for redirecting the user to login

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(password !== confirmPassword){
            alert("Password did not match.");
            return;
        }

        const userData ={
            username,
            email,
            password,
            name,
            phoneNumber,
        }
    

        try{
            const response = await fetch("http://localhost:8080/api/users/register", {
                method: "POST",
                headers: {
                    "Content-type" : "application/json",
                },
                body: JSON.stringify(userData),
            });

            if(response.ok){
                alert("Registration successful...!");
                setUsername("");
                setEmail("");
                setPassword("");
                setConfirmPassword("");
                setName("");
                setPhoneNumber("");

                navigate("/login");
            } else{
                const errorData = await response.text();
                setErrorMessage(errorData || "Registration failed. Please try again.")
            }
        } catch (error){
            alert("Error during registration...!");
            console.error("Error: ",error);
        }
    };



    // Inline styles using JavaScript objects
    const containerStyle = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        //height: "100vh", // Full viewport height
        backgroundColor: "#f4f4f4", // Optional: Background color for the page
        padding: "0 15px", // Prevent form from touching edges on mobile
        margin: "3.5rem 0", // Add margin to push form below the fixed header
    };

    const formStyle = {
        margin:"4rem 0",
        padding:"2rem",
        width: "100%",
        maxWidth: "600px", // Maximum width for larger screens
        border:"1px solid #ccc",
        borderRadius: "8px",
        display:"flex",
        flexDirection: "column",
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:"white",
        boxSizing: "border-box", // Include padding in width calculation
    };

    const fieldStyle = {
        width:"100%",
        margin:"0.5rem 0"
    };

    const inputStyle = {
        padding: "0.75rem",
        margin: "10px 0",
        width: "100%",
        boxSizing: "border-box",
        borderRadius:"5px",
        border:"1px solid #ccc"
    };

    const submitButtonStyle = {
        padding: "10px 20px",
        backgroundColor: "#333",
        color: "white",
        border: "none",
        cursor: "pointer",
        width: "100%",
        borderRadius:"5px"
    };

    const eyeIconStyle = {
        position: "absolute",
        right: "10px",
        top: "50%",
        transform: "translateY(-50%)",
        cursor: "pointer",
        fontSize: "1.5rem",
        opacity: 0.6,
        transition: "opacity 0.3s",
    };

    const redirectLinkStyle = {
        marginTop: "10px",
        textAlign: "center",
    };

    const loginLinkStyle = {
        color: "blue",
        textDecoration: "underline",
    };

    const responsiveFormStyle = {
        "@media (max-width: 768px)" : {
            width: "90%",
        },

        "@media (max-width: 480px)" : {
            width: "100%", 
            padding: "1rem",
        },
    };

    const combinedFormStyle = {
        ...formStyle,
        ...(window.innerWidth <= 768 ? responsiveFormStyle["@media (max-width: 768px)"] : {}),
        ...(window.innerWidth <= 480 ? responsiveFormStyle["@media (max-width: 480px)"] : {}),
    };

    return(
        <div style={containerStyle}>
            <div style={combinedFormStyle}>
                <h2>Register</h2>
                <form onSubmit={handleSubmit}>
                    
                    {/* Render error message if exists */}
                    {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

                    <div>
                        <label htmlFor="username" style={fieldStyle}>Username:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username"
                            style={inputStyle}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email" style={fieldStyle}>Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            style={inputStyle}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" style={fieldStyle}>Password:</label>
                        <div style={{ position: "relative" }}>
                            <input
                                type= {isPasswordVisible ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                style={inputStyle}
                                required
                            />
                            <span
                                style = {eyeIconStyle}
                                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                            >
                                {isPasswordVisible ? <FaEyeSlash/> : <FaEye/>}
                            </span>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" style={fieldStyle}>Confirm Password:</label>
                        <div style={{position: "relative"}}>
                            <input
                                type= {isConfirmPasswordVisible ? "text" : "password"}
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="confirm your password"
                                style={inputStyle}
                                required
                            />
                            <span
                                style = {eyeIconStyle}
                                onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                            >
                                {isConfirmPasswordVisible ? <FaEyeSlash/> : <FaEye/>}
                            </span>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="name" style={fieldStyle}>Name:</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            style={inputStyle}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="phoneNumber" style={fieldStyle}>Phone Number:</label>
                        <input
                            type="text"
                            id="phoneNumber"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="Enter your phone number"
                            style={inputStyle}
                            required
                        />
                    </div>

                    <button 
                        type="submit"
                        style={submitButtonStyle}
                    >
                    Register
                    </button>
                </form>
                <div style={redirectLinkStyle}>
                    <p>
                    Already have an account?{" "}
                    <Link to="/login" style={loginLinkStyle}>
                        Login here
                    </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
