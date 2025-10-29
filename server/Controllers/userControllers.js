import UserModel from "../models/userModel.js";


export const getUserDetails = async (req,res) => {
    try {
        const {userId} = req.user;
        console.log("User Id in getUserDetails(): ", userId);
        if (!userId) {
            return res.json({success: false, message: "User not found"});
        }
        const existingUser = await UserModel.findById(userId);

        return res.json({success: true, message: "User details fetched successfully", currentUser: existingUser});
    }catch (err) {
        console.log("Error in getUserDetails: ", err);
        return res.json({success: false, message: `Error while fetching user details: ${err.message}`});
    }
}