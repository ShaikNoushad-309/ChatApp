import UserModel from "../models/userModel.js";
import contactsModel from "../models/contactsModel.js";


export const getContacts = async (req,res) => {
    try{
        const contacts = await contactsModel.find({owner:req.user.id})
            .populate('recipient', 'username email avatar')
            .sort({name:1});

        res.json({success: true, message: "Contacts fetched successfully", contacts: contacts});
    }catch (err) {
        console.log("Error in getContacts: ", err);
        return res.json({success: false, message: `Error while fetching contacts: ${err.message}`});
    }
}

export const addContact = async (req,res) => {
    try {
        const {email, username} = req.body;

        // Find user by email
        const contacts_user = UserModel.findOne({email});
        if(!contacts_user){  //  Left here and stopped!
         return  res.json({success: false, message: "User not found"});
        }

        // Check if user is trying to add themselves
        if(contacts_user._id.toString() === req.user.id){
              return  res.json({success: false, message: "You cannot add yourself as a contact"});
        }

        // Check if contact already exists
        const existingContact = contactsModel.findOne({
            owner: req.user.id,
            recipient:contacts_user._id
        });

        if(existingContact){
            return  res.json({success: false, message: "Contact already exists"});
        }

        // Create a new contact

        const newContact = new contactsModel({
            owner:req.user.id,
            recipient:contacts_user._id,
            name:contacts_user.username,
            email:contacts_user.email,
        })



    }catch (err) {
        res.json({success: false, message: `Error while adding contact: ${err.message}`});
    }

}

export const deleteContact = async (req,res) => {
    const {email,username} = req.body;
}

