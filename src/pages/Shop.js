import React, { useState, useEffect, useCallback } from "react";
import ProductCard from "../components/ProductCard";
import _ from 'lodash';

const Shop = () => {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [gender, setGender] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [applyFilter, setApplyFilter] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [showFilter, setShowFilter] = useState(false);
  const [sortBy, setSortBy] = useState("Sort By");

  const shopStyle = {
    padding: screenWidth > 768 ? "0" : "20px",
    marginTop: "3.5rem"
  };

  const headingStyle = {
    fontSize: screenWidth <=768 ? "1.5rem": "2rem",
    fontWeight: "bold",
    marginBottom: "10px",
    marginTop: screenWidth > 768 ? "80px" : "20px",
    marginLeft: "20px",
    textAlign: screenWidth <= 768 ? "center" : "left",
  };

  const mainContainerStyle = {
    display: "flex",
    flexDirection: screenWidth > 768 ? "row" : "column",
    gap: "2px",
    flexWrap: "wrap",
    alignItems: "flex-start",
  };

  const productListStyle = {
    flex: "1",
    display : "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    justifyContent : "center",
    gap: screenWidth > 768 ? "20px" : "10px" ,
    padding: screenWidth <= 768 ?"10px" : "0",
    justifyItems: screenWidth <= 340 ? "center" : "stretch",
    marginBottom: "20px"
  }

  const filterFormStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "20px",
    flexWrap: "wrap",
    justifyContent: "center",
    maxWidth: "800px",
    margin: "0 auto"
  };
  
  const responsiveFilterFormStyle = {
    ...filterFormStyle,
    flexDirection: screenWidth <= 768 ? "column" : "row",
    gap: screenWidth <= 768 ? "15px" : "10px",
    padding: screenWidth <= 768 ? "0 10px" : "0",
    fontSize: screenWidth <= 325 ? "14px" : "16px",
  };

  const filterButtonStyle = {
    position: "fixed",
    bottom: "0",
    left:"0",
    backgroundColor: "#333",
    color: "whitesmoke",
    padding: "10px",
    zIndex: 1000,
    width: "100%",
    textAlign: "center",
    display: screenWidth <= 768 ? "block" : "none",
  };

  const filterStyleSmall = {
    position: "fixed",
    bottom: "50px",
    left: "0",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px 10px 0 0",
    zIndex: "1001",
    display: showFilter ? "block" : "none",
  };

  const filterStyleLarge = {
    position: "sticky",
    left: "0",
    bottom: "0",
    top: "76px",
    width: "240px",
    paddingLeft: "20px",
    paddingTop: "40px",
    backgroundColor: "#fff",
    borderTop: "1px solid #333",
    borderRight: "1px solid #333",
    height: "calc(100vh-76px)",
    zIndex: "1000",
    overflowY: "auto",
    borderRadius: "0.5rem",
  }

  const horizontalScrollStyle = {
    display: "flex",
    overflowX: "auto",
    padding: "0 16px 0 16px",
    fontWeight: "500",
    width: "100%",
    backgroundColor: "white"
  };

  const directFilterButtonStyle = {
    backgroundColor: "whilesmoke",
    border: "none",
    padding: "12px",
    margin: "5px",
    borderRadius: "8px",
    textAlign: "center",
    cursor: "pointer",
    flex: "1 0 22.5%",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  };

  const sortAndHideStyle = {
    position: "sticky",
    top: "76px",
    backgroundColor: "white",
    display: "flex",
    justifyContent: "flex-end",
    padding: "10px 20px",
    boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
    zIndex: "1000",
    marginLeft: "260px",
    alignItems: "center",
    border: "0.5px solid #fff"
  };

  const sortSelectStyle = {
    backgroundColor: "#f4f4f4",
    padding: "8px 15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
    marginRight: "20px",
    height: "38x",
    width: "150px",
  };

  const hideFilterButtonStyle = {
    backgroundColor: "#f4f4f4",
    padding: "8px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    textTransform: "capitalize",
    marginLeft: "20px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);
    sortProducts(value);
  };

  const sortProducts = (sortOption) => {
    let sortedProducts = [...products];
    switch (sortOption) {
      case "newest":
        sortedProducts = sortedProducts.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "price-desc":
        sortedProducts = sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case "price-asc":
        sortedProducts = sortedProducts.sort((a, b) => a.price - b.price);
        break;
      default:
        break;
    }
    setProducts(sortedProducts);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "gender") setGender(value);
    if (name === "category") setCategory(value);
    if (name === "minPrice") setMinPrice(value);
    if (name === "maxPrice") setMaxPrice(value);
  };

  const filterProducts = useCallback(async() => {
    setLoading(true);

    const validatedMinPrice = minPrice !== "" && !isNaN(minPrice) ? minPrice : null;
    const validatedMaxPrice = maxPrice !== "" && !isNaN(maxPrice) ? maxPrice : null;

    const queryParams = new URLSearchParams();

    if (gender) queryParams.append("gender", gender);
    if (category) queryParams.append("category", category);
    if (minPrice) queryParams.append("minPrice", validatedMinPrice);
    if (maxPrice) queryParams.append("maxPrice", validatedMaxPrice);

    try {
      const response = await fetch(`http://localhost:8080/api/products?${queryParams.toString()}`);
      const data = await response.json();
      if(response.ok){
        setProducts(data.data.content);
      } else {
        setError("Failed to load products.");
      }
    } catch(error){
      setError("An error occurred while loading the products.");
    } finally {
      setLoading(false);
    }
  },[gender, category, minPrice, maxPrice]);


  useEffect(() => {
    const fetchProducts = async () => {
      if(products.length>0){
        return;
      }
      try{
        const response = await fetch("http://localhost:8080/api/products");
        const data =  await response.json();

        if(response.ok){
          setProducts(data.data.content);
        }else{
          setError("Failed to load products.");
        }
      } catch (error){
        setError("An error occurred while loading the product.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [products.length]);

  useEffect(() => {
    const handleResize = _.debounce(() => {
      setScreenWidth(window.innerWidth);
    },300);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (applyFilter) {
      filterProducts();
      setApplyFilter(false);
    }
  }, [applyFilter, filterProducts]);

  const resetFilters = () => {
    setGender("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setApplyFilter(true);
  };

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  const directFilterChange = (category) => {
    setCategory(category);
    setApplyFilter(true);
  };

  if(loading){
    return <p>loading products...</p>
  }

  if(error){
    return <p>{error}</p>
  }

  return (
    <div style={shopStyle}>
      <h2 style={headingStyle}>Shop Our Products</h2>

      {/* Direct Filter Buttons (for small screens) */}
      {screenWidth <= 768 && (
        <div style={horizontalScrollStyle}>
          <div style={directFilterButtonStyle} onClick={() => directFilterChange("")}>All</div>
          <div style={directFilterButtonStyle} onClick={() => directFilterChange("Shoes")}>Shoes</div>
          <div style={directFilterButtonStyle} onClick={() => directFilterChange("T-Shirts")}>T-Shirts</div>
          <div style={directFilterButtonStyle} onClick={() => directFilterChange("Accessories")}>Tracks</div>
          <div style={directFilterButtonStyle} onClick={() => directFilterChange("Shorts")}>Shorts</div>
          <div style={directFilterButtonStyle} onClick={() => directFilterChange("Accessories")}>Accessories</div>

        </div>
      )}

      {/* Filter Button */}
      <button style={filterButtonStyle} onClick={toggleFilter}>Filter</button>
      {/* Filter Panel for Small Screens */}
      {screenWidth <= 768 && showFilter && (
        <div>
          <div style={filterStyleSmall}>
            <h3>Filter</h3>
            <div style={responsiveFilterFormStyle}>
              <select name="gender" value={gender} onChange={handleFilterChange}>
                <option value="">Select Gender</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Unisex">Unisex</option>
              </select>
              <select name="category" value={category} onChange={handleFilterChange}>
                <option value="">Select Category</option>
                <option value="Shoes">Shoes</option>
                <option value="Clothing">Clothing</option>
                <option value="Accessories">Accessories</option>
                <option value="Tshirts">T-Shirts</option>
                <option value="Tracks">Tracks</option>
                <option value="Shorts">Shorts</option>
              </select>
              <input
                type="number"
                name="minPrice"
                value={minPrice}
                placeholder="Min Price"
                onChange={handleFilterChange}
              />
              <input
                type="number"
                name="maxPrice"
                value={maxPrice}
                placeholder="Max Price"
                onChange={handleFilterChange}
              />

              <button onClick={() => setApplyFilter(true)}>Apply</button>
              <button onClick={resetFilters} style={{marginLeft: "10px"}}>Reset</button>
            </div>
          </div>
          <div className="product-list" style={productListStyle}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product}/>
            ))}
          </div>
        </div>
      )}

      {/* Sorting and Hide Filter - Fixed Position */}
      {screenWidth > 768 && (
        <div style={sortAndHideStyle}>
          <button style={hideFilterButtonStyle} onClick={toggleFilter}>
            {showFilter ? "Hide Filters" : "Show Filters"}
          </button>
          <span>
            <select style={sortSelectStyle} value={sortBy} onChange={handleSortChange}>
              <option value="Sort By">Sort By</option>
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-desc">Price: High - Low</option>
              <option value="price-asc">Price: Low - High</option>
            </select>
          </span>
        </div>
      )}

      {/* Filter Panel for Large Screens */}
      {screenWidth > 768 && (
        <div style={mainContainerStyle}>
          <div style={filterStyleLarge}>
            <h3>Filter</h3>
            <div style={filterFormStyle}>
              <div style={directFilterButtonStyle} onClick={() => directFilterChange("Shoes")}>Shoes</div>
              <div style={directFilterButtonStyle} onClick={() => directFilterChange("T-Shirts")}>T-Shirts</div>
              <div style={directFilterButtonStyle} onClick={() => directFilterChange("Tracks")}>Tracks</div>
              <div style={directFilterButtonStyle} onClick={() => directFilterChange("Shorts")}>Shorts</div>
              <div style={directFilterButtonStyle} onClick={() => directFilterChange("Accessories")}>Accessories</div>

              <select name="gender" value={gender} onChange={handleFilterChange}>
                <option value="">Select Gender</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Unisex">Unisex</option>
              </select>
              <input
                type="number"
                name="minPrice"
                value={minPrice}
                placeholder="Min Price"
                onChange={handleFilterChange}
              />
              <input
                type="number"
                name="maxPrice"
                value={maxPrice}
                placeholder="Max Price"
                onChange={handleFilterChange}
              />

              <button onClick={() => setApplyFilter(true)}>Apply</button>
              <button onClick={resetFilters}>Reset</button>
            </div>
          </div>
          <div className="product-list" style={productListStyle}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product}/>
            ))}
          </div>
        </div>
      )}
      {screenWidth <=768 && (
        <div className="product-list" style={productListStyle}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product}/>
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;
