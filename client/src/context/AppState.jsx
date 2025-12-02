// AppState.jsx
import React, { useEffect, useState } from "react";
import AppContext from "./AppContext";
import axios from "axios";
import { ToastContainer, toast, Bounce } from "react-toastify";

const AppState = (props) => {  
  // 🔑 API URL
  const url = "https://shopglob.onrender.com/api";

  const [products, setProducts] = useState([]);
  const [token, setToken] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [filterData, setFilterData] = useState([]);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState({ items: [] });
  const [userAddress, setUserAddress] = useState("");
  const [userOrder, setUserOrder] = useState([]);

  // ✅ NEW: Loading and Error States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true); // ✅ Start loading
        setError(null);   // ✅ Clear previous errors

        const api = await axios.get(`${url}/product/all`, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
          timeout: 60000, // ✅ 60 second timeout
        });

        setProducts(api.data.products);
        setFilterData(api.data.products);
        
        userProfile();
        getAddress();

      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.response?.data?.message || "Failed to load products. Please try again.");
        
        toast.error("Products taking longer than usual. Server might be waking up...", {
          position: "top-center",
          autoClose: 5000,
          theme: "dark",
          transition: Bounce
        });

      } finally {
        setLoading(false); // ✅ Stop loading
      }
    };

    fetchProduct();
    user_Order();
    userCart();
  }, [token]);

  useEffect(() => {
    const lstoken = localStorage.getItem("token");
    if (lstoken) {
      setToken(lstoken);
      setIsAuthenticated(true);
    }
  }, []);

  // ✅ NEW: Retry function
  const retryFetchProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const api = await axios.get(`${url}/product/all`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
        timeout: 60000,
      });
      
      setProducts(api.data.products);
      setFilterData(api.data.products);
      toast.success("Products loaded successfully!", { theme: "dark" });
      
    } catch (err) {
      setError("Failed to load products");
      toast.error("Still having trouble. Please check your connection.", { theme: "dark" });
    } finally {
      setLoading(false);
    }
  };

  // REGISTER USER
  const register = async (name, email, password) => {
    const api = await axios.post(`${url}/user/register`,
      { name, email, password },
      { headers: { "Content-Type": "application/json" }, withCredentials: true }
    );

    toast.success(api.data.message, { position: "top-right", autoClose: 1500, theme: "dark", transition: Bounce });
    return api.data;
  };

  // LOGIN USER
  const login = async (email, password) => {
    const api = await axios.post(`${url}/user/login`,
      { email, password },
      { headers: { "Content-Type": "application/json" }, withCredentials: true }
    );

    toast.success(api.data.message, { position: "top-right", autoClose: 1500, theme: "dark", transition: Bounce });

    setToken(api.data.token);
    setIsAuthenticated(true);
    localStorage.setItem("token", api.data.token);

    return api.data;
  };

  // LOGOUT
  const logout = () => {
    setIsAuthenticated(false);
    setToken(null);
    localStorage.removeItem("token");
    toast.success("Logout Successfully...", { position: "top-right", autoClose: 1500, theme: "dark", transition: Bounce });
  };

  // USER PROFILE
  const userProfile = async () => {
    try {
      const api = await axios.get(`${url}/user/profile`, {
        headers: { "Content-Type": "application/json", Auth: token },
        withCredentials: true,
      });
      setUser(api.data.user);
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  // USER CART
  const userCart = async () => {
    try {
      const api = await axios.get(`${url}/cart/user`, {
        headers: { "Content-Type": "application/json", Auth: token },
        withCredentials: true,
      });
      setCart(api.data.cart);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  // ADD TO CART
  const addToCart = async (productId, title, price, qty, imgSrc) => {
    const api = await axios.post(`${url}/cart/add`,
      { productId, title, price, qty, imgSrc },
      { headers: { "Content-Type": "application/json", Auth: token }, withCredentials: true }
    );

    setCart(api.data.cart);

    toast.success(api.data.message, { position: "top-right", autoClose: 1500, theme: "dark", transition: Bounce });
  };

  // DECREASE
  const decreaseQty = async (productId, qty) => {
    try {
      const api = await axios.post(`${url}/cart/decrease-qty`,
        { productId, qty },
        { headers: { Auth: token } }
      );
      setCart(api.data.cart);
      toast.success(api.data.message, { theme: "dark", transition: Bounce });
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred", { theme: "dark" });
    }
  };

  // INCREASE
  const increaseQty = async (productId, qty) => {
    try {
      const api = await axios.post(`${url}/cart/increase-qty`,
        { productId, qty },
        { headers: { Auth: token } }
      );
      setCart(api.data.cart);
      toast.success(api.data.message, { theme: "dark", transition: Bounce });
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred", { theme: "dark" });
    }
  };

  // REMOVE
  const removeFromCart = async (productId) => {
    try {
      const api = await axios.delete(`${url}/cart/remove/${productId}`, {
        headers: { Auth: token },
        data:{productId}
      });
      setCart(api.data.cart);
      toast.success(api.data.message, { theme: "dark", transition: Bounce });
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred", { theme: "dark" });
    }
  };

  // CLEAR CART
  const clearCart = async () => {
    try {
      const api = await axios.delete(`${url}/cart/clear`, {
        headers: { Auth: token },
      });
      setCart(api.data.cart);
      toast.success(api.data.message, { theme: "dark", transition: Bounce });
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred", { theme: "dark" });
    }
  };

  // ADD SHIPPING ADDRESS
  const shippingAddress = async (fullName, address, city, state, country, pincode, phoneNumber) => {
    try {
      const api = await axios.post(`${url}/address/add`, 
        { fullName, address, city, state, country, pincode, phoneNumber },
        { headers: { Auth: token } }
      );
      toast.success(api.data.message, { theme: "dark", transition: Bounce });
      return api.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred", { theme: "dark" });
      return { success: false, message: error.response?.data?.message || "An error occurred" };
    }
  };

  // GET ADDRESS
  const getAddress = async () => {
    try {
      const api = await axios.get(`${url}/address/get`, {
        headers: { "Content-Type": "application/json", Auth: token },
        withCredentials: true,
      });
      setUserAddress(api.data.userAddress);
    } catch (err) {
      console.error("Error fetching address:", err);
    }
  };

  // GET USER ORDERS
  const user_Order = async () => {
    try {
      const api = await axios.get(`${url}/payment/userorder`, {
        headers: { "Content-Type": "application/json", Auth: token },
        withCredentials: true,
      });
      setUserOrder(api.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  return (
    <AppContext.Provider
      value={{
        products,
        register,
        login,
        url,
        isAuthenticated,
        setIsAuthenticated,
        filterData,
        setFilterData,
        logout,
        user,
        addToCart,
        cart,
        decreaseQty,
        removeFromCart,
        clearCart,
        shippingAddress,
        userAddress,
        increaseQty,
        userOrder,
        loading,           // ✅ NEW
        error,             // ✅ NEW
        retryFetchProducts // ✅ NEW
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppState;