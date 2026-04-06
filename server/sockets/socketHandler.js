import {io} from "../app.js";
import MessagesModel from "../models/messagesModel.js";
import mongoose from "mongoose";
import emitter from "events";

const getRoomId = (ownerId,recipientId)=>{
    return `room_${[ownerId,recipientId].sort().join('_')}`;
}

async function socketHandler(){
    emitter.setMaxListeners(20);
    io.on('connection', (socket) => {
        console.log('New Client connected with id:',socket.id);
        console.log("====================");

        socket.on('newUser', (data) => {
            console.log('Got New User: ', data);
            socket.broadcast.emit("UserDisplayed", data.username);
        });

        socket.on('joinRoom', (data) => {
            console.log('Got joinRoom request: ', data);
            const roomId = getRoomId(data.owner,data.recipient);
            socket.join(roomId);
            io.to(roomId).emit('createdRoom', data);
            console.log("Created a room with id:",roomId);
        });

        socket.on('newMsgToSend', async (data) => {
            console.log('Got newMsgToSend(msg from a client) request: ', data);
            let roomId = getRoomId(data.owner,data.recipient);


            // Now store msgObj to databases of both curr user and contact

            const CurrUsersMsgModel = await MessagesModel.findOne({
                owner: data.owner,
                recipient: data.recipient,
            });

            const CurrUsersContactMsgModel = await MessagesModel.findOne({
                owner: data.recipient,
                recipient: data.owner,
            });

            if(!CurrUsersMsgModel || !CurrUsersContactMsgModel){
                // Case: either user1 has added user2 as a contact but not vice versa
                // or user2 has added user1 as a contact but not vice versa

                // In that case we can't broadcast messages as there are no two users properly connected

                // roomId = getRoomId(data.owner,data.recipient);
                io.to(roomId).emit('improperConn');

                return console.log("No messages model found for this user");
            }

            io.to(roomId).emit('newMsg', data);
            console.log("Sent message to room:",roomId);

            if(data.owner === CurrUsersMsgModel.owner){
                try {
                    // Storing in Curr users DB Entry
                    CurrUsersMsgModel.messages = [...CurrUsersMsgModel.messages, data.messageObj];
                    await CurrUsersMsgModel.save();
                    // Storing in Curr users Contact! DB Entry
                    CurrUsersContactMsgModel.messages = [...CurrUsersContactMsgModel.messages, {
                        message: data.messageObj.message,
                        time: data.messageObj.time,
                        msgType: "received"
                    }];
                    await CurrUsersContactMsgModel.save();
                }catch (e){
                    console.log("Error in newMsgToSend socket event: ", e.message);
                }
            }else{
                try {
                    // Storing in Curr users Contact! DB Entry
                    CurrUsersContactMsgModel.messages = [...CurrUsersContactMsgModel.messages, data.messageObj];
                    await CurrUsersContactMsgModel.save();

                    // Storing in Curr users DB Entry
                    CurrUsersMsgModel.messages = [...CurrUsersMsgModel.messages, {
                        message: data.messageObj.message,
                        time: data.messageObj.time,
                        msgType: "received"
                    }];
                    await CurrUsersMsgModel.save();
                }catch (e){
                    console.log("Error in newMsgToSend socket event: ", e.message);
                }
            }
            //  And the messages need to be fetched initially and displayed at client side
        });
        socket.on('disconnect', () => {
            console.log('Client disconnected');
            socket.broadcast.emit("AUserDisconnected");
        });


    });


    // Add this to see what's happening
    console.log('Number of models:', Object.keys(mongoose.models).length);
    console.log('Existing models:', Object.keys(mongoose.models));

// Check connection status
    console.log('Mongoose connection state:', mongoose.connection.readyState);
    console.log('Number of connections:', mongoose.connections.length);
}

export default socketHandler;


// import {io} from "../app.js";
// import MessagesModel from "../models/messagesModel.js";
// import mongoose from "mongoose";
// import emitter from "events";
//
// // Add imports at top
// import {
//     markMessageAsDelivered,
//     markMessageAsRead,
//     markMessagesAsDelivered,
//     markAllMessagesAsRead,
//     getConversationId
// } from '../helpers/socketHelpers.js';
//
// // Keep existing code, add these socket events after the existing ones:
//
// const getRoomId = (ownerId,recipientId)=>{
//     return `room_${[ownerId,recipientId].sort().join('_')}`;
// }
//
// let userSockets = new Map();
//
// async function socketHandler(){
//     emitter.setMaxListeners(20);
//     io.on('connection', (socket) => {
//         console.log('New Client connected with id:',socket.id);
//         console.log("====================");
//
//         // Store user socket connection
//         socket.on('user-connected', (data) => {
//             const {userId,username} = data;
//
//             console.log(`User ${userId} connected with socket ${socket.id}`);
//             userSockets.set(userId, socket.id);
//             // console.log('Got New User: ', data);
//             socket.broadcast.emit("UserDisplayed", username);
//
//             // Mark all undelivered messages as delivered
//             markMessagesAsDelivered(userId).then(result => {
//                 if (result.success) {
//                     console.log(`Marked all messages as delivered for user ${userId}`);
//                 }
//             });
//         });
//
//         // Existing socket events (keep all your existing code)...
//
//         socket.on('newMsgToSend', async (data) => {
//             console.log('Got newMsgToSend(msg from a client) request: ', data);
//             let roomId = getRoomId(data.owner,data.recipient);
//
//             // ADD STATUS TO NEW MESSAGE
//             const messageWithStatus = {
//                 ...data.messageObj,
//                 status: 'sent', // Initial status
//                 deliveredAt: null,
//                 readAt: null
//             };
//
//             // Now store msgObj to databases of both curr user and contact
//             const CurrUsersMsgModel = await MessagesModel.findOne({
//                 owner: data.owner,
//                 recipient: data.recipient,
//             });
//
//             const CurrUsersContactMsgModel = await MessagesModel.findOne({
//                 owner: data.recipient,
//                 recipient: data.owner,
//             });
//
//             if(!CurrUsersMsgModel || !CurrUsersContactMsgModel){
//                 io.to(roomId).emit('improperConn');
//                 return console.log("No messages model found for this user");
//             }
//
//             // Modified emit with status data
//             io.to(roomId).emit('newMsg', {
//                 ...data,
//                 messageObj: messageWithStatus,
//                 conversationId: CurrUsersMsgModel._id,
//                 messageIndex: CurrUsersMsgModel.messages.length // Index of new message
//             });
//             console.log("Sent message to room:",roomId);
//
//             if(data.owner === CurrUsersMsgModel.owner){
//                 try {
//                     // Storing in Curr users DB Entry with status
//                     CurrUsersMsgModel.messages = [...CurrUsersMsgModel.messages, messageWithStatus];
//                     await CurrUsersMsgModel.save();
//
//                     // Storing in Contact's DB Entry with status
//                     CurrUsersContactMsgModel.messages = [...CurrUsersContactMsgModel.messages, {
//                         message: data.messageObj.message,
//                         time: data.messageObj.time,
//                         msgType: "received",
//                         status: 'sent', // Initial status for recipient
//                         deliveredAt: null,
//                         readAt: null
//                     }];
//                     await CurrUsersContactMsgModel.save();
//
//                     // If recipient is online, mark as delivered immediately
//                     const recipientSocket = userSockets.get(data.recipient);
//                     if (recipientSocket) {
//                         const result = await markMessageAsDelivered(
//                             CurrUsersContactMsgModel._id,
//                             CurrUsersContactMsgModel.messages.length - 1
//                         );
//
//                         if (result.success) {
//                             // Notify sender that message was delivered
//                             const senderSocket = userSockets.get(data.owner);
//                             if (senderSocket) {
//                                 io.to(senderSocket).emit('message-status-updated', {
//                                     conversationId: CurrUsersMsgModel._id,
//                                     messageIndex: CurrUsersMsgModel.messages.length - 1,
//                                     status: 'delivered',
//                                     timestamp: new Date()
//                                 });
//                             }
//                         }
//                     }
//                 } catch (e) {
//                     console.log("Error in newMsgToSend socket event: ", e.message);
//                 }
//             } else {
//                 try {
//                     // Storing in Contact's DB Entry with status
//                     CurrUsersContactMsgModel.messages = [...CurrUsersContactMsgModel.messages, messageWithStatus];
//                     await CurrUsersContactMsgModel.save();
//
//                     // Storing in Curr users DB Entry with status
//                     CurrUsersMsgModel.messages = [...CurrUsersMsgModel.messages, {
//                         message: data.messageObj.message,
//                         time: data.messageObj.time,
//                         msgType: "received",
//                         status: 'sent',
//                         deliveredAt: null,
//                         readAt: null
//                     }];
//                     await CurrUsersMsgModel.save();
//
//                     // If recipient is online, mark as delivered immediately
//                     const recipientSocket = userSockets.get(data.owner);
//                     if (recipientSocket) {
//                         const result = await markMessageAsDelivered(
//                             CurrUsersMsgModel._id,
//                             CurrUsersMsgModel.messages.length - 1
//                         );
//
//                         if (result.success) {
//                             // Notify sender that message was delivered
//                             const senderSocket = userSockets.get(data.recipient);
//                             if (senderSocket) {
//                                 io.to(senderSocket).emit('message-status-updated', {
//                                     conversationId: CurrUsersContactMsgModel._id,
//                                     messageIndex: CurrUsersContactMsgModel.messages.length - 1,
//                                     status: 'delivered',
//                                     timestamp: new Date()
//                                 });
//                             }
//                         }
//                     }
//                 } catch (e) {
//                     console.log("Error in newMsgToSend socket event: ", e.message);
//                 }
//             }
//         });
//
//         // NEW SOCKET EVENTS FOR MESSAGE STATUS
//         socket.on('message-delivered', async (data) => {
//             console.log('Message delivered event:', data);
//             const { conversationId, messageIndex, recipientId } = data;
//
//             const result = await markMessageAsDelivered(conversationId, messageIndex);
//
//             if (result.success) {
//                 // Get sender ID from conversation
//                 const conversation = await MessagesModel.findById(conversationId);
//                 if (conversation) {
//                     const senderSocket = userSockets.get(conversation.owner);
//                     if (senderSocket) {
//                         io.to(senderSocket).emit('message-status-updated', {
//                             conversationId,
//                             messageIndex,
//                             status: 'delivered',
//                             timestamp: new Date()
//                         });
//                     }
//                 }
//             }
//         });
//
//         socket.on('message-read', async (data) => {
//             console.log('Message read event:', data);
//             const { conversationId, messageIndex, recipientId } = data;
//
//             const result = await markMessageAsRead(conversationId, messageIndex);
//
//             if (result.success) {
//                 // Get sender ID from conversation
//                 const conversation = await MessagesModel.findById(conversationId);
//                 if (conversation) {
//                     const senderSocket = userSockets.get(conversation.owner);
//                     if (senderSocket) {
//                         io.to(senderSocket).emit('message-status-updated', {
//                             conversationId,
//                             messageIndex,
//                             status: 'read',
//                             timestamp: new Date()
//                         });
//                     }
//                 }
//             }
//         });
//
//         socket.on('mark-all-as-read', async (data) => {
//             console.log('Mark all as read event:', data);
//             const { senderId, recipientId } = data;
//
//             const result = await markAllMessagesAsRead(senderId, recipientId);
//
//             if (result.success) {
//                 // Notify sender
//                 const senderSocket = userSockets.get(senderId);
//                 if (senderSocket) {
//                     io.to(senderSocket).emit('all-messages-read', {
//                         recipientId,
//                         timestamp: new Date()
//                     });
//                 }
//             }
//         });
//
//         socket.on('disconnect', () => {
//             console.log('Client disconnected');
//
//             // Remove user from socket map
//             for (const [userId, socketId] of userSockets.entries()) {
//                 if (socketId === socket.id) {
//                     userSockets.delete(userId);
//                     console.log(`Removed user ${userId} from socket map`);
//                     break;
//                 }
//             }
//
//             socket.broadcast.emit("AUserDisconnected");
//         });
//     });
// }
//
// export default socketHandler;


// import {io} from "../app.js";
// import MessagesModel from "../models/messagesModel.js";
// import mongoose from "mongoose";
// import emitter from "events";
//
// // Add imports at top
// import {
//     markMessageAsDelivered,
//     markMessageAsRead,
//     markMessagesAsDelivered,
//     markAllMessagesAsRead,
//     getConversationId
// } from '../helpers/socketHelpers.js';
//
// const getRoomId = (ownerId, recipientId) => {
//     return `room_${[ownerId, recipientId].sort().join('_')}`;
// }
//
// let userSockets = new Map(); // userId -> socket.id
//
// async function socketHandler() {
//     emitter.setMaxListeners(50); // Increased for multiple connections
//
//     io.on('connection', (socket) => {
//         console.log('New Client connected with id:', socket.id);
//         console.log("====================");
//
//         // ========== 1. USER CONNECTION HANDLING ==========
//         socket.on('newUser', (data) => {
//             console.log('Got New User: ', data);
//             const { username, email, currUserId } = data;
//
//             // Store socket connection for status tracking
//             userSockets.set(currUserId, socket.id);
//             console.log(`User ${currUserId} (${username}) connected with socket ${socket.id}`);
//
//             // Mark all undelivered messages as delivered
//             markMessagesAsDelivered(currUserId).then(result => {
//                 if (result.success) {
//                     console.log(`Marked all messages as delivered for user ${currUserId}`);
//                 }
//             });
//
//             // Broadcast to others (for toast)
//             socket.broadcast.emit("UserDisplayed", username);
//         });
//
//         // ========== 2. ROOM JOINING ==========
//         socket.on('joinRoom', (data) => {
//             console.log('Got joinRoom request: ', data);
//             const roomId = getRoomId(data.owner, data.recipient);
//
//             // Leave any previous rooms to avoid duplicates
//             const rooms = Array.from(socket.rooms);
//             rooms.forEach(room => {
//                 if (room !== socket.id && room.startsWith('room_')) {
//                     socket.leave(room);
//                 }
//             });
//
//             // Join the room
//             socket.join(roomId);
//             console.log(`Socket ${socket.id} joined room: ${roomId}`);
//
//             // Emit confirmation
//             socket.emit('room-joined', { roomId });
//             io.to(roomId).emit('createdRoom', data);
//             console.log("Created/Joined a room with id:", roomId);
//         });
//
//         // ========== 3. MESSAGE SENDING ==========
//         socket.on('newMsgToSend', async (data) => {
//             console.log('Got newMsgToSend(msg from a client) request: ', data);
//             const roomId = getRoomId(data.owner, data.recipient);
//
//             // Check if sender is in the room
//             const senderInRoom = Array.from(socket.rooms).includes(roomId);
//             if (!senderInRoom) {
//                 console.log(`Sender ${data.owner} not in room ${roomId}, joining now...`);
//                 socket.join(roomId);
//             }
//
//             // Create message with status
//             const messageWithStatus = {
//                 ...data.messageObj,
//                 status: 'delivered', // Initial status
//                 deliveredAt: null,
//                 readAt: null
//             };
//
//             // Find conversation documents
//             const CurrUsersMsgModel = await MessagesModel.findOne({
//                 owner: data.owner,
//                 recipient: data.recipient,
//             });
//
//             const CurrUsersContactMsgModel = await MessagesModel.findOne({
//                 owner: data.recipient,
//                 recipient: data.owner,
//             });
//
//             if (!CurrUsersMsgModel || !CurrUsersContactMsgModel) {
//                 socket.emit('improperConn');
//                 return console.log("No messages model found for this user");
//             }
//
//             try {
//                 let messageIndex;
//                 let conversationId;
//
//                 if (data.owner === CurrUsersMsgModel.owner) {
//                     // Store in sender's document
//                     CurrUsersMsgModel.messages = [...CurrUsersMsgModel.messages, messageWithStatus];
//                     await CurrUsersMsgModel.save();
//
//                     // Store in recipient's document
//                     CurrUsersContactMsgModel.messages = [...CurrUsersContactMsgModel.messages, {
//                         message: data.messageObj.message,
//                         time: data.messageObj.time,
//                         msgType: "received",
//                         status: 'delivered',
//                         deliveredAt: null,
//                         readAt: null
//                     }];
//                     await CurrUsersContactMsgModel.save();
//
//                     messageIndex = CurrUsersMsgModel.messages.length - 1;
//                     conversationId = CurrUsersMsgModel._id;
//                 } else {
//                     // Store in recipient's document
//                     CurrUsersContactMsgModel.messages = [...CurrUsersContactMsgModel.messages, messageWithStatus];
//                     await CurrUsersContactMsgModel.save();
//
//                     // Store in sender's document
//                     CurrUsersMsgModel.messages = [...CurrUsersMsgModel.messages, {
//                         message: data.messageObj.message,
//                         time: data.messageObj.time,
//                         msgType: "received",
//                         status: 'delivered',
//                         deliveredAt: null,
//                         readAt: null
//                     }];
//                     await CurrUsersMsgModel.save();
//
//                     messageIndex = CurrUsersContactMsgModel.messages.length - 1;
//                     conversationId = CurrUsersContactMsgModel._id;
//                 }
//
//                 console.log(`Message saved. Conversation: ${conversationId}, Index: ${messageIndex}`);
//
//                 // EMIT TO ROOM - CRITICAL FIX
//                 // Emit to sender with full data
//                 // socket.emit('newMsg', {
//                 //     ...data,
//                 //     messageObj: messageWithStatus,
//                 //     conversationId,
//                 //     messageIndex,
//                 //     isOwnMessage: true
//                 // });
//
//                 io.to(roomId).emit('newMsg', {
//                     ...data,
//                     messageObj: messageWithStatus,
//                     conversationId,
//                     messageIndex,
//                     isOwnMessage: true
//                 });
//
//                 // Emit to recipient (if in room)
//                 // socket.to(roomId).emit('newMsg', {
//                 //     ...data,
//                 //     messageObj: {
//                 //         ...messageWithStatus,
//                 //         msgType: "received"
//                 //     },
//                 //     conversationId,
//                 //     messageIndex,
//                 //     isOwnMessage: false
//                 // });
//
//                 console.log(`Emitted message to room: ${roomId}`);
//
//                 // If recipient is online, mark as delivered immediately
//                 // const recipientSocketId = userSockets.get(data.recipient);
//                 // if (recipientSocketId) {
//                 //     console.log(`Recipient ${data.recipient} is online, marking as delivered`);
//                 //
//                 //     // Find the correct conversation ID for recipient
//                 //     const recipientConversation = await MessagesModel.findOne({
//                 //         owner: data.recipient,
//                 //         recipient: data.owner,
//                 //     });
//                 //
//                 //     if (recipientConversation) {
//                 //         const recipientMessageIndex = recipientConversation.messages.length - 1;
//                 //
//                 //         const result = await markMessageAsDelivered(
//                 //             recipientConversation._id,
//                 //             recipientMessageIndex
//                 //         );
//                 //
//                 //         if (result.success) {
//                 //             // Notify sender that message was delivered
//                 //             const senderSocketId = userSockets.get(data.owner);
//                 //             if (senderSocketId) {
//                 //                 io.to(senderSocketId).emit('message-status-updated', {
//                 //                     conversationId,
//                 //                     messageIndex,
//                 //                     status: 'delivered',
//                 //                     timestamp: new Date()
//                 //                 });
//                 //             }
//                 //         }
//                 //     }
//                 // }
//
//             } catch (e) {
//                 console.log("Error in newMsgToSend socket event: ", e.message);
//                 socket.emit('message-error', { error: e.message });
//             }
//         });
//
//         // ========== 4. MESSAGE STATUS EVENTS ==========
//         // socket.on('message-delivered', async (data) => {
//         //     console.log('Message delivered event:', data);
//         //     const { conversationId, messageIndex, recipientId } = data;
//         //
//         //     const result = await markMessageAsDelivered(conversationId, messageIndex);
//         //
//         //     if (result.success) {
//         //         // Get sender ID from conversation
//         //         const conversation = await MessagesModel.findById(conversationId);
//         //         if (conversation) {
//         //             const senderSocketId = userSockets.get(conversation.owner);
//         //             if (senderSocketId) {
//         //                 io.to(senderSocketId).emit('message-status-updated', {
//         //                     conversationId,
//         //                     messageIndex,
//         //                     status: 'delivered',
//         //                     timestamp: new Date()
//         //                 });
//         //             }
//         //         }
//         //     }
//         // });
//
//         socket.on('message-read', async (data) => {
//             console.log('Message read event:', data);
//             const { conversationId, messageIndex, recipientId } = data;
//
//             const result = await markMessageAsRead(conversationId, messageIndex);
//
//             if (result.success) {
//                 // Get sender ID from conversation
//                 const conversation = await MessagesModel.findById(conversationId);
//                 if (conversation) {
//                     const senderSocketId = userSockets.get(conversation.owner);
//                     if (senderSocketId) {
//                         io.to(senderSocketId).emit('message-status-updated', {
//                             conversationId,
//                             messageIndex,
//                             status: 'read',
//                             timestamp: new Date()
//                         });
//                     }
//                 }
//             }
//         });
//
//         socket.on('mark-all-as-read', async (data) => {
//             console.log('Mark all as read event:', data);
//             const { senderId, recipientId } = data;
//
//             const result = await markAllMessagesAsRead(senderId, recipientId);
//
//             if (result.success) {
//                 // Notify sender
//                 const senderSocketId = userSockets.get(senderId);
//                 if (senderSocketId) {
//                     io.to(senderSocketId).emit('all-messages-read', {
//                         recipientId,
//                         timestamp: new Date()
//                     });
//                 }
//             }
//         });
//
//         // ========== 5. TYPING EVENTS (Keep existing) ==========
//         socket.on('typing', ({ owner, recipient, isTyping }) => {
//             console.log("Received typing event from user: ", owner, recipient, "isTyping:", isTyping);
//             const roomId = getRoomId(owner, recipient);
//             socket.to(roomId).emit('user-typing', {
//                 owner: owner,
//                 recipient: recipient,
//                 isTyping: isTyping,
//             });
//             console.log(`User ${recipient} ${isTyping ? 'started' : 'stopped'} typing in room ${roomId}`);
//         });
//
//         // ========== 6. DISCONNECTION HANDLING ==========
//         socket.on('disconnect', () => {
//             console.log('Client disconnected:', socket.id);
//
//             // Remove user from socket map
//             for (const [userId, socketId] of userSockets.entries()) {
//                 if (socketId === socket.id) {
//                     userSockets.delete(userId);
//                     console.log(`Removed user ${userId} from socket map`);
//                     break;
//                 }
//             }
//
//             // Emit disconnect notification
//             socket.broadcast.emit("AUserDisconnected");
//         });
//
//         // ========== 7. HEARTBEAT FOR CONNECTION STABILITY ==========
//         socket.on('heartbeat', (data) => {
//             // Keep connection alive
//             socket.emit('heartbeat-ack', { timestamp: Date.now() });
//         });
//
//     });
//
//     // Periodic cleanup of disconnected users
//     setInterval(() => {
//         console.log(`Active users: ${userSockets.size}`);
//     }, 30000);
// }
//
// export default socketHandler;