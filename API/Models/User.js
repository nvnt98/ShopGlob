import mongoose from "mongoose";
const userScehma = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    createdAt: {type: Date, default: Date.now}
});

export const User = mongoose.model('User', userScehma);