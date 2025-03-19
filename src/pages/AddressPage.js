import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/AddressPage.css";

const AddressPage = () => {
    const [addresses, setAddresses] = useState([]);
    const [newAddress, setNewAddress] = useState({
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('authToken');

    // Fetch Addresses
    useEffect(() => {
        const fetchAddresses = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:8080/api/users/${userId}/addresses`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log("Fetched Data:", data);
                    setAddresses(data.addresses || []);
                } else {
                    setError('Failed to fetch addresses');
                }
            } catch (error) {
                console.error('Error fetching addresses:', error);
                setError('Error fetching addresses');
            } finally {
                setLoading(false);
            }
        };

        if (userId && token) fetchAddresses();
        else navigate('/login');
    }, [userId, token, navigate]);

    // Add Address
    const handleAddAddress = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/api/users/${userId}/addresses`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(newAddress)
            });

            if (response.ok) {
                const data = await response.json();
                setAddresses([...addresses, data.data]);
                setNewAddress({
                    street: '',
                    city: '',
                    state: '',
                    postalCode: '',
                    country: ''
                });
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to add address');
            }
        } catch (error) {
            setError('Error adding address');
            console.error('Error adding address:', error);
        } finally {
            setLoading(false);
        }
    };

    // Delete Address
    const handleDeleteAddress = async (addressId) => {
        if (!window.confirm('Are you sure you want to delete this address?')) return;

        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/api/users/${userId}/addresses/${addressId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (response.ok) {
                setAddresses(addresses.filter(address => address.id !== addressId));
            } else {
                setError('Failed to delete address');
            }
        } catch (error) {
            setError('Error deleting address');
            console.error('Error deleting address:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="address-page">
            <h1>Your Addresses</h1>
            {loading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}

            <div className="address-list">
                {addresses.length > 0 ? (
                    addresses.map(address => (
                        <div key={address.id} className="address-card">
                            <p>{address.street}, {address.city}, {address.state}, {address.postalCode}, {address.country}</p>
                            <button onClick={() => handleDeleteAddress(address.id)}>Delete</button>
                        </div>
                    ))
                ) : (
                    <p>No addresses found. Please add one.</p>
                )}
            </div>

            <div className="add-address-form">
                <h2>Add New Address</h2>
                <input
                    type="text"
                    placeholder="Street"
                    value={newAddress.street}
                    onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="City"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="State"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Pincode"
                    value={newAddress.postalCode}
                    onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Country"
                    value={newAddress.country}
                    onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                />
                <button onClick={handleAddAddress} disabled={loading}>
                    {loading ? 'Adding...' : 'Add Address'}
                </button>
            </div>
        </div>
    );
};

export default AddressPage;
