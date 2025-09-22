import React, { useEffect, useState } from "react";
import AppContext from "./AppContext";
import axios from "axios";
import { ToastContainer, toast, Bounce } from "react-toastify";

const AppState = (props) => {  
  // const url = "http://localhost:3000/api";


  const url = "https://shopglob.onrender.com/api";

  const [products, setProducts] = useState([]);
  const [token, setToken] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [filterData, setFilterData] = useState([]);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState({ items: [] });
  const [userAddress, setUserAddress] = useState("");
  const [userOrder, setUserOrder] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      //fetching data from backend
      const api = await axios.get(`${url}/product/all`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      // console.log(api.data.products);
      setProducts(api.data.products);
      setFilterData(api.data.products);
      userProfile();
      getAddress();
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

  // REGISTER USER
  const register = async (name, email, password) => {
    //fetching data from backend
    const api = await axios.post(
      `${url}/user/register`,
      { name, email, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    // alert(api.data.message);
    // console.log("user register", api);

    toast.success(api.data.message, {
      position: "top-right",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });

    return api.data;
  };

  // LOGIN USER
  const login = async (email, password) => {
    //fetching data from backend
    const api = await axios.post(
      `${url}/user/login`,
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    // alert(api.data.message);
    // console.log("user register", api);

    toast.success(api.data.message, {
      position: "top-right",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });

    // console.log("user login",api.data)
    setToken(api.data.token);
    setIsAuthenticated(true);
    // api.data.token or simply===== token
    localStorage.setItem("token", api.data.token);

    return api.data;
  };

  // Logout user
  const logout = () => {
    setIsAuthenticated(false);
    setToken(null);
    localStorage.removeItem("token");
    toast.success("Logout Successfully...", {
      position: "top-right",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });
  };

  // User Profile
  const userProfile = async () => {
    //fetching data from backend
    const api = await axios.get(`${url}/user/profile`, {
      headers: {
        "Content-Type": "application/json",
        Auth: token,
      },
      withCredentials: true,
    });
    // console.log("User Profile",api.data);
    setUser(api.data.user);
  };

  // User Cart
  const userCart = async () => {
    //fetching data from backend
    const api = await axios.get(`${url}/cart/user`, {
      headers: {
        "Content-Type": "application/json",
        Auth: token,
      },
      withCredentials: true,
    });
    // console.log("User Cart", api.data.cart)
    setCart(api.data.cart);
  };

  // add to Cart
  const addToCart = async (productId, title, price, qty, imgSrc) => {
    //fetching data from backend
    const api = await axios.post(
      `${url}/cart/add`,
      { productId, title, price, qty, imgSrc },
      {
        headers: {
          "Content-Type": "application/json",
          Auth: token,
        },
        withCredentials: true,
      }
    );
    // Directly set the cart from the API response
    setCart(api.data.cart); // <-- The key change is here

    // console.log("My Cart", api);
    toast.success(api.data.message, {
      position: "top-right",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });
  };

  // decrease Qty
  const decreaseQty = async (productId, qty) => {
    try {
      const api = await axios.post(
        `${url}/cart/decrease-qty`,
        { productId, qty },
        {
          headers: { Auth: token },
        }
      );
      setCart(api.data.cart);
      toast.success(api.data.message, { theme: "dark", transition: Bounce });
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred", {
        theme: "dark",
      });
    }
  };

  // INCREASE QUANTITY
  const increaseQty = async (productId, qty) => {
    try {
      const api = await axios.post(
        `${url}/cart/increase-qty`,
        { productId, qty },
        {
          headers: { Auth: token },
        }
      );
      setCart(api.data.cart);
      toast.success(api.data.message, { theme: "dark", transition: Bounce });
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred", {
        theme: "dark",
      });
    }
  };

  // REMOVE FROM CART
  const removeFromCart = async (productId) => {
    try {
      const api = await axios.delete(`${url}/cart/remove/${productId}`, {
        headers: { Auth: token },
        data:{productId}
      });
      setCart(api.data.cart);
      console.log("Remove item from Cart",api)
      toast.success(api.data.message, { theme: "dark", transition: Bounce });
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred", {
        theme: "dark",
      });
    }
  };


    // Clear CART
  const clearCart = async () => {
    try {
      const api = await axios.delete(`${url}/cart/clear`, {
        headers: { Auth: token },
      });
      setCart(api.data.cart);
      console.log("Remove item from Cart",api)
      toast.success(api.data.message, { theme: "dark", transition: Bounce });
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred", {
        theme: "dark",
      });
    }
  };




  // Add Shipping Address
  const shippingAddress = async (fullName, address, city, state, country, pincode, phoneNumber) => {
    try {
      const api = await axios.post(`${url}/address/add`, { fullName, address, city, state, country, pincode, phoneNumber }, {
        headers: { Auth: token },
      });
      toast.success(api.data.message, { theme: "dark", transition: Bounce });
      // Return the successful response data INSIDE the try block
      return api.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred", {
        theme: "dark",
      });
      // Return a consistent error object INSIDE the catch block
      return { success: false, message: error.response?.data?.message || "An error occurred" };
    }
  };


// get user latest address
 const getAddress = async () => {
      //fetching data from backend
      const api = await axios.get(`${url}/address/get`, {
        headers: {
          "Content-Type": "application/json",
          Auth: token,
        },
        withCredentials: true,
      });
      // console.log("User Address ",api.data.userAddress);
      setUserAddress(api.data.userAddress);
    };


    // get user latest order
 const user_Order = async () => {
      //fetching data from backend
      const api = await axios.get(`${url}/payment/userorder`, {
        headers: {
          "Content-Type": "application/json",
          Auth: token,
        },
        withCredentials: true,
      });
      console.log("User Order ",api.data);
      setUserOrder(api.data);
    };


console.log("userOrder",userOrder)

  // Note: The `register` function can remain as it was, as it doesn't interact with the logged-in state.

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
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppState;
