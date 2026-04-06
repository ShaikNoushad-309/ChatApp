import MessagesModel from '../Models/messagesModel.js';

// left here!

export const getMessages = async (req, res) => {
    const {userId} = req.user;
    const {contactId} = req.params;

    try{
        const msg_data = await MessagesModel.findOne({
            owner: userId,
            recipient: contactId
        });

        console.log("User Id: ", userId);
        console.log("Contact Id: ", contactId);
        console.log("Msg data in getMessages: ", msg_data);
        if(!msg_data){
            return res.json({success:true,message:"No messages found",messages:[]});
        }

        const {messages} = msg_data;
        console.log("Messages in getMessages: ", messages);
        res.json({success:true,messages:messages});
    }catch(err){
        console.log("Error in getMessages: ", err);
       return res.json({success:false,message:`Error while fetching messages: ${err.message}`});
    }
}

export const addMessage = async (req,res) =>{
    const {userId} = req.user;
    const {messageObj} = req.body;
    const {contactId} = req.params;

    console.log("Got POST request in addMessage()");
    console.log("userId in addMessage: ", userId);
    console.log("contactId in addMessage: ", contactId);
    console.log("message in addMessage: ", messageObj);

    try{
        const msg_model = await MessagesModel.findOne({
            owner: userId,
            recipient: contactId
        });

        console.log('Message model: ',msg_model);

        console.log("Messages of current conversation: ",msg_model.messages);

        // if(type === 'sent'){
        //     msg_model.messages.sent = [...msg_model.messages.sent,messageObj];
        // }else{
        //     msg_model.messages.received = [...msg_model.messages.received,messageObj];
        // }

        msg_model.messages = [...msg_model.messages,messageObj];

        await msg_model.save();
        console.log("Messages after adding new msg: ",msg_model.messages);
       res.json({success:true,message:"Message added successfully"});
    }catch(err){   // Stopped here!
        console.log("Error in addMessage: ", err);
        return res.json({success:false,message:`Error while adding message: ${err.message}`});
    }
}

export const getConversationId = async (req,res) =>{
    try {
        const { owner, recipient } = req.body;

        const conversation = await MessagesModel.findOne({
            owner,
            recipient
        });

        if (conversation) {
            res.json({
                success: true,
                conversationId: conversation._id
            });
        } else {
            res.json({
                success: false,
                message: 'Conversation not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

// messages:{
//     sent:[{
//         message: {type: String, required: true,default:''},
//         time: {type:Date,default:new Date()},
//     }],
//         received:[{
//         message: {type: String, required: true,default:''},
//         time: {type:Date,default:new Date()},
//     }]
// }