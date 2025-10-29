import jwt from 'jsonwebtoken';
import UserModel from "../models/userModel.js";

export const register = async (req,res)=> {
    const {username, email,password} = req.body;
    console.log("Got POST request in register");
    console.log("username in register: ", username);
    console.log("email in register: ", email);
    console.log("password in register: ", password);
    if (!username || !password || !email) {
        return res.status(400).json({success: false, message: "Please provide all the required fields"});
    }
    try {
    const existingUser = await UserModel.findOne({"email":email});
    if (existingUser) {
       return  res.json({success: true, message: "User already exists"});
    }
    const newUser = await new UserModel({username, password, email});
    await newUser.save();

    const token = jwt.sign({id: newUser._id}, process.env.SECRET_KEY, {expiresIn: "7h"});
    res.cookie("token", token, {httpOnly: true,
        maxAge:7 * 24 * 60 * 60 * 1000});

   return  res.json({success: true, message: "User registered successfully"});
}catch(err) {
        console.log("Error in register: ", err);
        res.json({success: false, message: `Error while registering:${err.message}`});
    }
}

export const login = async (req,res)=> {
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(400).json({success: false, message: "Please provide all the required fields"});
    }
    try{
        const existingUser = await UserModel.findOne({"email":email});

        // const existingUser = await UserModel.findOne(
        //     {"userCredentials.email":email},
        //     {"userCredentials":1, "_id":1});

        if(!existingUser){
            return res.status(400).json({success: false, message: "User does not exist"});
        }
        console.log("Existing user in DB: ", existingUser);
        const userPswd = existingUser.password;
        if(userPswd !== password){
            return res.status(400).json({success: false, message: "Invalid password"});
        }
        const token = jwt.sign({id: existingUser._id}, process.env.SECRET_KEY, {expiresIn: "7h"});
        res.cookie("token", token, {httpOnly: true,
            maxAge:7 * 24 * 60 * 60 * 1000});
        return res.json({success: true, message: "User logged in successfully"});
    }catch (err){
        return res.status(400).json({success: false, message: `Error while logging in: ${err.message}`});
    }
}

export const logout = async (req,res)=> {
try{
    res.clearCookie("token");
    return res.json({success: true, message: "User logged out successfully"});
}catch (err){
    return res.status(400).json({success: false, message: `Error while logging out: ${err.message}`});
}
}
export const isAuthenticated = async (req,res)=>{
    try{
        return res.json({success:true,message:"User is authenticated"});
    }catch (err){
        return  res.json({success:false,message:`Error while verifying email: ${err.message}`})
    }
}
