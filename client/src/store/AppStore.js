import {create} from "zustand";
import io from "socket.io-client";

const useStore = create((set) => ({
        backendUrl: "http://localhost:3000",
        // backendUrl: process.env.BACKEND_URL,
        isLoggedIn: false,
        userData: {
            username: "",
            email: "",
            password: "",
        },
        userContacts: [{}],
        setIsLoggedIn: (bool) => {
            set(() => ({
                isLoggedIn: bool,
            }))
        },
        setUserData: (currUser) => {
            set((state) => ({
                userData: currUser ? currUser : state.userData,
            }))
        },
    updateUserContacts: (contacts) => {
        set((state) => ({
            userContacts: contacts ? [...contacts] : state.userContacts,
        }))
    },
    // msgHistory:{},
    msgHistory:[],

    // updateMsgHistory:(history)=> {
    //         set((state) => ({
    //            msgHistory:history ? {
    //                sent:history.sent,
    //                received:history.received
    //            }:state.msgHistory
    //         }))
    // },


    updateMsgHistory:(history)=> {
        set((state) => ({
            // msgHistory:history ? [...history]:state.msgHistory,
            msgHistory:history ?history:state.msgHistory,
        }))
    },

    // updateMsgHistory: (updater) => {
    //     set((state) => ({
    //         msgHistory: updater(state.msgHistory)
    //     }))
    // },

    activeChat:{
        name:"",
        status:"offline",
        lastMessage:"",
    },
    updateActiveChat:(chat)=> {
            set((state) => ({
               activeChat:chat ? chat : state.activeChat
            }))
    },

    // In your store file
    updateMessageStatusInStore: (data) => set((state) => {
        const { conversationId, messageIndex, status, timestamp } = data;
        const updatedHistory = state.msgHistory.map((msg, index) => {
            if (msg.conversationId === conversationId &&
                msg.messageIndex === parseInt(messageIndex)) {
                return {
                    ...msg,
                    status,
                    ...(status === 'delivered' && { deliveredAt: timestamp }),
                    ...(status === 'read' && { readAt: timestamp })
                };
            }
            return msg;
        });
        return { msgHistory: updatedHistory };
    }),

    updateAllMessagesStatusInStore: (senderId, status) => set((state) => {
        const updatedHistory = state.msgHistory.map(msg => {
            if (msg.owner === senderId && msg.msgType === 'sent' && msg.status !== 'read') {
                return {
                    ...msg,
                    status,
                    ...(status === 'read' && { readAt: new Date() })
                };
            }
            return msg;
        });
        return { msgHistory: updatedHistory };
    }),

    }));

export default useStore;