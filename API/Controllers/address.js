// File: API/Controllers/address.js
import { Address } from "../Models/Address.js";
import { User } from "../Models/User.js";

// export const addAddress = async (req, res) => {
//     let { fullName, address, city, state, country, pincode, phoneNumber } = req.body;
//     const userId = req.user

//     let userAddress = new Address({
//         userId,
//         fullName, address, city, state, country, pincode, phoneNumber});

//         await userAddress.save();
//         res.json({ message: "Address added successfully", userAddress, success: true });
//     };

export const addAddress = async (req, res) => {
  try {
    // Destructure the required fields from the request body
    const { fullName, address, city, state, country, pincode, phoneNumber } =
      req.body;

    // Get the user ID from the authenticated request
    const userId = req.user;

    // Create a new Address document
    const userAddress = new Address({
      userId,
      fullName,
      address,
      city,
      state,
      country,
      pincode,
      phoneNumber,
    });

    // Attempt to save the document to the database
    await userAddress.save();

    // Send a success response with a 201 (Created) status code
    res.status(201).json({
      message: "Address added successfully",
      userAddress,
      success: true,
    });
  } catch (error) {
    // Log the full error to the console for debugging purposes
    console.error("Error adding address:", error);

    // Check if the error is a Mongoose validation error (e.g., a required field is missing)
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation failed. Please check your input.",
        details: error.message, // Provides specific details about which field failed
        success: false,
      });
    }

    // For all other types of errors, send a generic 500 (Internal Server Error) response
    res.status(500).json({
      message: "An internal server error occurred. Please try again later.",
      success: false,
    });
  }
};

export const getUserAddress = async (req, res) => {
  const userId = req.user;
  let address = await Address.find({ userId }).sort({ createdAt: -1 });

  if (!address) {
    return res.json({ message: "No addresses found" });
  }
  res.json({ message: "User address", userAddress: address[0] });
};
