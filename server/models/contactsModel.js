// import mongoose from 'mongoose';
//
// import React from 'react';
//
//  const contactsSchema = new mongoose.Schema({
//      currUserMail: {type: String, required: true},
//      activeContacts:[{
//          contactMail: {type: String, required: true},
//          contactUsername: {type: String, required: true},
//      }],
//      requestsReceived:{type:[{
//          contactMail: {type: String, required: true},
//          contactUsername: {type: String, required: true},
//      }],default:[]},
//      requestsSent:[{
//          contactMail: {type: String, required: true},
//          contactUsername: {type: String, required: true},
//      }],
//  });
//
//  const contactsModel = mongoose.model('contacts', contactsSchema);
//
//
//
// export default contactsModel;

// import mongoose from 'mongoose';
//
// const contactsSchema = new mongoose.Schema({
//     currUserMail: {type: String, required: true},
//     activeContacts:{type:[{
//         contactMail: {type: String, default:''},
//         contactUsername: {type: String,default:''},
//             lastMessage: {type:String,default:''},
//             time: {type:Date,default:new Date()},
//             unread: {type:Number,default:0},
//             status:{type:String,default:'offline'},
//             active: {type:Boolean,default:true},
//         }],default:[]},
//     requestsReceived:{type:[{
//             contactMail: {type: String, required: true},
//             contactUsername: {type: String, required: true},
//         }],default:[]},
//     requestsSent:{type:[{
//         contactMail: {type: String, required: true},
//         contactUsername: {type: String, required: true},
//         }],default:[]},
// });
//
// const contactsModel = mongoose.model('contacts', contactsSchema);
//
//
//
// export default contactsModel;

import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    addedAt: {
        type: Date,
        default: Date.now
    }
});

// Ensure a user can't add the same contact twice
contactSchema.index({ owner: 1, recipient: 1 }, { unique: true });

const contactsModel =  mongoose.model('Contact', contactSchema);

export default contactsModel;