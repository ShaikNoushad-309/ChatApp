import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const userAuth = async (req,res,next) =>{
    console.log("In userAuth middleware");
    dotenv.config();
    const {token} = req.cookies;
    if(!token){
        return res.json({success:false,message:"Please login to access this page"});
    }
    console.log("Cookies: ",req.cookies);
    try{
        console.log("Token in try{} before decoding: ",token);
        console.log(process.env.SECRET_KEY);
        console.log("Temp1");
        const decodedToken = await jwt.verify(token,process.env.SECRET_KEY);
        console.log("Temp2");
        console.log("Token in try{} after decoding: ",decodedToken);
        if(decodedToken.id ){
            console.log("Decoded Token: ",decodedToken);
            console.log("Decoded Token Id: ",decodedToken.id);
            req.user = {userId:decodedToken.id};
        }else{
            return res.json({success:false,message:"User id not found in token"});
        }
        next();
    }catch (err){
        return res.json({success:false,message:`Error while verifying token: ${err.message}`});
    }
}

export default userAuth;