import React, { useEffect, useState } from "react";
import AppContext from "./AppContext";
import axios from "axios";
import { toast, Bounce } from "react-toastify";

const AppState = (props) => {
  // 🔑 Base API URL
  const url = "https://shopglob.onrender.com/api";

  const [products, setProducts] = useState([]);
  const [filterData, setFilterData] = useState([]);

  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [user, setUser] = useState(null);
  const [cart, setCart] = useState({ items: [] });
  const [userAddress, setUserAddress] = useState("");
  const [userOrder, setUserOrder] = useState([]);

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load token from storage
  useEffect(() => {
    const lsToken = localStorage.getItem("token");
    if (lsToken) {
      setToken(lsToken);
      setIsAuthenticated(true);
    }
  }, []);

  // --------------------- Fetch products (public) ---------------------
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const api = await axios.get(`${url}/product/all`, {
          headers: { "Content-Type": "application/json" },
          timeout: 60000,
        });

        setProducts(api.data.products);
        setFilterData(api.data.products);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(
          err.response?.data?.message ||
            "Failed to load products. Please try again."
        );
        toast.error(
          "Products taking longer than usual. Server might be waking up...",
          {
            position: "top-center",
            autoClose: 5000,
            theme: "dark",
            transition: Bounce,
          }
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // --------------------- Fetch user data (requires token) ---------------------
  useEffect(() => {
    if (!token) return;
    userProfile();
    getAddress();
    user_Order();
    userCart();
  }, [token]);

  // Retry loading
  const retryFetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const api = await axios.get(`${url}/product/all`, {
        headers: { "Content-Type": "application/json" },
        timeout: 60000,
      });
      setProducts(api.data.products);
      setFilterData(api.data.products);
      toast.success("Products loaded successfully!", { theme: "dark" });
    } catch {
      setError("Failed to load products");
      toast.error("Still having trouble. Please check your connection.", {
        theme: "dark",
      });
    } finally {
      setLoading(false);
    }
  };

  // --------------------- Auth ---------------------
  const register = async (name, email, password) => {
    const api = await axios.post(
      `${url}/user/register`,
      { name, email, password },
      { headers: { "Content-Type": "application/json" }, withCredentials: true }
    );
    toast.success(api.data.message, {
      position: "top-right",
      autoClose: 1500,
      theme: "dark",
      transition: Bounce,
    });
    return api.data;
  };

  const login = async (email, password) => {
    const api = await axios.post(
      `${url}/user/login`,
      { email, password },
      { headers: { "Content-Type": "application/json" }, withCredentials: true }
    );

    toast.success(api.data.message, {
      position: "top-right",
      autoClose: 1500,
      theme: "dark",
      transition: Bounce,
    });

    setToken(api.data.token);
    setIsAuthenticated(true);
    localStorage.setItem("token", api.data.token);
    return api.data;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setToken(null);
    localStorage.removeItem("token");
    toast.success("Logout Successfully...", {
      position: "top-right",
      autoClose: 1500,
      theme: "dark",
      transition: Bounce,
    });
  };

  // --------------------- User profile ---------------------
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

  // --------------------- Cart handlers ---------------------
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

  const addToCart = async (productId, title, price, qty, imgSrc) => {
    const api = await axios.post(
      `${url}/cart/add`,
      { productId, title, price, qty, imgSrc },
      {
        headers: { "Content-Type": "application/json", Auth: token },
        withCredentials: true,
      }
    );
    setCart(api.data.cart);
    toast.success(api.data.message, {
      position: "top-right",
      autoClose: 1500,
      theme: "dark",
      transition: Bounce,
    });
  };

  const decreaseQty = async (productId, qty) => {
    try {
      const api = await axios.post(
        `${url}/cart/decrease-qty`,
        { productId, qty },
        { headers: { Auth: token } }
      );
      setCart(api.data.cart);
      toast.success(api.data.message, { theme: "dark", transition: Bounce });
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred", {
        theme: "dark",
      });
    }
  };

  const increaseQty = async (productId, qty) => {
    try {
      const api = await axios.post(
        `${url}/cart/increase-qty`,
        { productId, qty },
        { headers: { Auth: token } }
      );
      setCart(api.data.cart);
      toast.success(api.data.message, { theme: "dark", transition: Bounce });
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred", {
        theme: "dark",
      });
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const api = await axios.delete(`${url}/cart/remove/${productId}`, {
        headers: { Auth: token },
        data: { productId },
      });
      setCart(api.data.cart);
      toast.success(api.data.message, { theme: "dark", transition: Bounce });
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred", {
        theme: "dark",
      });
    }
  };

  const clearCart = async () => {
    try {
      const api = await axios.delete(`${url}/cart/clear`, {
        headers: { Auth: token },
      });
      setCart(api.data.cart);
      toast.success(api.data.message, { theme: "dark", transition: Bounce });
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred", {
        theme: "dark",
      });
    }
  };

  // --------------------- Address ---------------------
  const shippingAddress = async (
    fullName,
    address,
    city,
    state,
    country,
    pincode,
    phoneNumber
  ) => {
    try {
      const api = await axios.post(
        `${url}/address/add`,
        { fullName, address, city, state, country, pincode, phoneNumber },
        { headers: { Auth: token } }
      );
      toast.success(api.data.message, { theme: "dark", transition: Bounce });
      return api.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred", {
        theme: "dark",
      });
      return {
        success: false,
        message:
          error.response?.data?.message || "An error occurred",
      };
    }
  };

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

  // --------------------- Orders ---------------------
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
        filterData,
        setFilterData,
        register,
        login,
        logout,
        url,
        isAuthenticated,
        setIsAuthenticated,
        user,
        addToCart,
        cart,
        decreaseQty,
        increaseQty,
        removeFromCart,
        clearCart,
        shippingAddress,
        userAddress,
        userOrder,
        loading,
        error,
        retryFetchProducts,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppState;