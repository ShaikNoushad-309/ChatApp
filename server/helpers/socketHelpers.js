// import MessagesModel from "../models/messagesModel.js";
//
//
// export const markMessageAsDelivered = async (conversationId, messageIndex) =>{
//     await MessagesModel.findOneAndUpdate(
//         { _id: conversationId },
//         {
//             $set: {
//                 [`messages.${messageIndex}.status`]: 'delivered',
//                 [`messages.${messageIndex}.deliveredAt`]: new Date()
//             }
//         }
//     );
// }
//
// export const markMessageAsRead = async (conversationId, messageIndex)=> {
//     await MessagesModel.findOneAndUpdate(
//         { _id: conversationId },
//         {
//             $set: {
//                 [`messages.${messageIndex}.status`]: 'read',
//                 [`messages.${messageIndex}.readAt`]: new Date()
//             }
//         }
//     );
// }
//
// export const markMessagesAsDelivered = async (recipientId) => {
//     // Find all conversations where recipient hasn't seen messages
//     const conversations = await MessagesModel.find({
//         recipient: recipientId,
//         'messages.status': 'sent'
//     });
//
//     // Update each conversation
//     for (const conversation of conversations) {
//         const updateOps = {};
//         conversation.messages.forEach((msg, index) => {
//             if (msg.status === 'sent') {
//                 updateOps[`messages.${index}.status`] = 'delivered';
//                 updateOps[`messages.${index}.deliveredAt`] = new Date();
//             }
//         });
//
//         if (Object.keys(updateOps).length > 0) {
//             await MessagesModel.updateOne(
//                 { _id: conversation._id },
//                 { $set: updateOps }
//             );
//         }
//     }
// }
//
// export const markAllMessagesAsRead = async (senderId, recipientId) => {
//     // Find conversation between sender and recipient
//     const conversation = await MessagesModel.findOne({
//         owner: senderId,
//         recipient: recipientId
//     });
//
//     if (conversation) {
//         const updateOps = {};
//         conversation.messages.forEach((msg, index) => {
//             if (msg.status !== 'read') {
//                 updateOps[`messages.${index}.status`] = 'read';
//                 updateOps[`messages.${index}.readAt`] = new Date();
//             }
//         });
//
//         if (Object.keys(updateOps).length > 0) {
//             await MessagesModel.updateOne(
//                 { _id: conversation._id },
//                 { $set: updateOps }
//             );
//         }
//     }
// }

// messageStatusHelpers.js
import MessagesModel from '../models/MessagesModel.js';

export async function markMessageAsDelivered(conversationId, messageIndex) {
    try {
        await MessagesModel.findOneAndUpdate(
            { _id: conversationId },
            {
                $set: {
                    [`messages.${messageIndex}.status`]: 'delivered',
                    [`messages.${messageIndex}.deliveredAt`]: new Date()
                }
            }
        );
        return { success: true, conversationId, messageIndex };
    } catch (error) {
        console.error('Error marking message as delivered:', error);
        return { success: false, error: error.message };
    }
}

export async function markMessageAsRead(conversationId, messageIndex) {
    try {
        await MessagesModel.findOneAndUpdate(
            { _id: conversationId },
            {
                $set: {
                    [`messages.${messageIndex}.status`]: 'read',
                    [`messages.${messageIndex}.readAt`]: new Date()
                }
            }
        );
        return { success: true, conversationId, messageIndex };
    } catch (error) {
        console.error('Error marking message as read:', error);
        return { success: false, error: error.message };
    }
}

export async function markMessagesAsDelivered(recipientId) {
    try {
        const conversations = await MessagesModel.find({
            recipient: recipientId,
            'messages.status': 'sent'
        });

        for (const conversation of conversations) {
            const updateOps = {};
            conversation.messages.forEach((msg, index) => {
                if (msg.status === 'sent') {
                    updateOps[`messages.${index}.status`] = 'delivered';
                    updateOps[`messages.${index}.deliveredAt`] = new Date();
                }
            });

            if (Object.keys(updateOps).length > 0) {
                await MessagesModel.updateOne(
                    { _id: conversation._id },
                    { $set: updateOps }
                );
            }
        }
        return { success: true };
    } catch (error) {
        console.error('Error marking messages as delivered:', error);
        return { success: false, error: error.message };
    }
}

export async function markAllMessagesAsRead(senderId, recipientId) {
    try {
        // Find conversation where sender sent messages to recipient
        const conversation = await MessagesModel.findOne({
            owner: senderId,
            recipient: recipientId
        });

        if (conversation) {
            const updateOps = {};
            conversation.messages.forEach((msg, index) => {
                if (msg.status !== 'read') {
                    updateOps[`messages.${index}.status`] = 'read';
                    updateOps[`messages.${index}.readAt`] = new Date();
                }
            });

            if (Object.keys(updateOps).length > 0) {
                await MessagesModel.updateOne(
                    { _id: conversation._id },
                    { $set: updateOps }
                );
            }
        }
        return { success: true, senderId, recipientId };
    } catch (error) {
        console.error('Error marking all messages as read:', error);
        return { success: false, error: error.message };
    }
}

export async function getConversationId(senderId, recipientId) {
    try {
        const conversation = await MessagesModel.findOne({
            owner: senderId,
            recipient: recipientId
        });
        return conversation ? conversation._id : null;
    } catch (error) {
        console.error('Error getting conversation ID:', error);
        return null;
    }
}