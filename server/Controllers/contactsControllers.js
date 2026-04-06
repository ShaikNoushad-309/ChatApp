import UserModel from "../models/userModel.js";
import ContactsModel from "../models/contactsModel.js";
import MessagesModel from "../models/messagesModel.js";


export const getContacts = async (req,res) => {
    console.log("Got GET request in getContacts()");
    const {userId} = req.user;
    if(!userId){
        return res.json({success: false, message: "User Id  not found"});
    }
    try{
        // const contacts = await ContactsModel.find({owner:req.user.userId})
        //     .populate('recipient', 'username email avatar')
        //     .sort({name:1});

        const contacts = await ContactsModel.find({
            owner: userId
        });

        if(!contacts){
            return res.json({success: true, message: "No contacts found",contacts:[]});
        }
        // console.log("Contacts in getContacts()",contacts);

        res.json({success: true, message: "Contacts fetched successfully", contacts: contacts});
    }catch (err) {
        console.log("Error in getContacts: ", err);
        return res.json({success: false, message: `Error while fetching contacts: ${err.message}`});
    }
}

export const addContact = async (req,res) => {

    console.log("Got POST request in addContact()");

    try {
        // Took userId from req.user
        const {email,username} = req.body;

        // Find user by email
        const curr_contact = await UserModel.findOne({email,username}); // contact to be added
        if(!curr_contact){
         return  res.json({success: false, message: "User not found,might not have registered yet."});
        }
        console.log("Curr contact(to be added) in addContact :",curr_contact);
        console.log("User in addContact() :",req.user.userId);
        console.log("curr contact in addContact() :",curr_contact._id);
        // Check if user is trying to add themselves
        if(curr_contact._id.toString() === req.user.userId.toString()){
              return  res.json({success: false, message: "You cannot add yourself as a contact"});
        }

        // Check if contact already exists
        const existingContact = await ContactsModel.findOne({
            owner: req.user.userId,
            recipient:curr_contact._id
        });
        console.log("Existing contact in addContact: ",existingContact);

        if(existingContact){
            return  res.json({success: false, message: "Contact already exists"});
        }

        // Create a new contact

        const newContact = await new ContactsModel({
            owner:req.user.userId,
            recipient:curr_contact._id,
            name:curr_contact.username,
            email:curr_contact.email
        });
        await newContact.save();

   //      ====  Successfully created a new contact and saved to DB ======
   //      ==== Now we need to create the messages DB =========
   //      ==== where owner's id is userId and recipient's id is  curr_contact._id

        const newMessageRecord = await new MessagesModel({
            owner:req.user.userId,
            recipient:curr_contact._id,
            messages:[]
        });
        await newMessageRecord.save();


   res.json({success: true, message: "Contact added successfully"});
    }catch (err) {
        res.json({success: false, message: `Error while adding contact: ${err.message}`});
    }
}

export const deleteContact = async (req,res) => {
    console.log("Got DELETE request in deleteContact()");
    const {ownerId,recipientId} = req.params;

    //  No need to do this as we will display delete button to only existing contacts
    // const curr_contact = await ContactsModel.findOne({owner:req.user.userId,email:email,name:username});
    // console.log("Curr contact in deleteContact: ",curr_contact);
    // if(!curr_contact){
    //     return  res.json({success: false, message: "Contact not found1"});
    // }

    const deletedContact = await ContactsModel.deleteOne({
        owner:ownerId,
        recipient:recipientId,
    });
    console.log("Deleted contact in del_contact(): ",deletedContact);
    if(!deletedContact){
        return  res.json({success: false, message: "Contact not found2"});
    }
    res.json({success: true, message: "Contact deleted successfully"});
}

