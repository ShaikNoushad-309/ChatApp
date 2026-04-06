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