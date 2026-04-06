import mongoose from 'mongoose';
import emitter from "events";

// const msgSchema = new mongoose.Schema({
//     owner:{
//         type: mongoose.Schema.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     recipient:{
//         type: mongoose.Schema.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     messages:{
//         sent:[{
//             message: {type: String, required: true,default:''},
//             time: {type:Date,default:new Date()},
//         }],
//         received:[{
//             message: {type: String, required: true,default:''},
//             time: {type:Date,default:new Date()},
//         }]
//     }
// });

const msgSchema = new mongoose.Schema({
    owner:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    recipient:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    messages:[{
        message: {type: String, required: true,default:''},
        time: {type:Date,default:new Date()},
        msgType: String,
        seen: { type: Boolean, default: false }
    }]
});

// const MessagesModel = mongoose.models.messages || mongoose.model('Message', msgSchema);

// try{

emitter.setMaxListeners(20);
    // const MessagesModel = mongoose.models.messages || mongoose.model('Message', msgSchema);

let MessagesModel;

try {
    MessagesModel = mongoose.model('Message');
} catch {
    MessagesModel = mongoose.model('Message', msgSchema);
}

export default MessagesModel;


// const msgSchema = new mongoose.Schema({
//     owner:{
//         type: mongoose.Schema.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     recipient:{
//         type: mongoose.Schema.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     messages:[{
//         message: {type: String, required: true,default:''},
//         time: {type:Date,default:new Date()},
//         msgType: String,
//         timestamp: { type: Date, default: Date.now },
//         status: {
//             type: String,
//             enum: ['sent', 'delivered', 'read'],
//             default: 'sent'
//         },
//         deliveredAt: Date,
//         readAt: Date
//     }]
// });
//
// emitter.setMaxListeners(20);
//
// let MessagesModel;
//
// try {
//     MessagesModel = mongoose.model('Message');
// } catch {
//     MessagesModel = mongoose.model('Message', msgSchema);
// }
//
// export default MessagesModel;
