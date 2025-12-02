// AppState.jsx
import React, { useEffect, useState } from "react";
import AppContext from "./AppContext";
import axios from "axios";
import { ToastContainer, toast, Bounce } from "react-toastify";

const AppState = (props) => {
  const url = "https://shopglob.onrender.com/api";

  const [products, setProducts] = useState([]);
  const [token, setToken] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);  // 👈 Add this

  const [filterData, setFilterData] = useState([]);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState({ items: [] });
  const [userAddress, setUserAddress] = useState("");
  const [userOrder, setUserOrder] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);  // 👈 Start loading
        const api = await axios.get(`${url}/product/all`, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        setProducts(api.data.products);
        setFilterData(api.data.products);
        userProfile();
        getAddress();
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products", { theme: "dark" });
      } finally {
        setLoading(false);  // 👈 Stop loading
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

  // ... rest of your existing code (register, login, logout, etc.)

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
    const api = await axios.get(`${url}/user/profile`, {
      headers: { "Content-Type": "application/json", Auth: token },
      withCredentials: true,
    });
    setUser(api.data.user);
  };

  // USER CART
  const userCart = async () => {
    const api = await axios.get(`${url}/cart/user`, {
      headers: { "Content-Type": "application/json", Auth: token },
      withCredentials: true,
    });
    setCart(api.data.cart);
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
        data: { productId }
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
    const api = await axios.get(`${url}/address/get`, {
      headers: { "Content-Type": "application/json", Auth: token },
      withCredentials: true,
    });
    setUserAddress(api.data.userAddress);
  };

  // GET USER ORDERS
  const user_Order = async () => {
    const api = await axios.get(`${url}/payment/userorder`, {
      headers: { "Content-Type": "application/json", Auth: token },
      withCredentials: true,
    });
    setUserOrder(api.data);
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
        loading,  // 👈 Add this
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppState;