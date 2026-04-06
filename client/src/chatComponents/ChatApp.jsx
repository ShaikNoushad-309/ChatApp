// components/ChatApp.jsx
import React, {useState, useEffect} from 'react';
import ContactList from './ContactList.jsx';
import ChatHeader from './ChatHeader.jsx';
import MessagesContainer from './MessagesContainer.jsx';
import MessageInput from './MessageInput.jsx';
import { IoHome } from "react-icons/io5";
import { Link } from "react-router-dom";
import useStore from "../store/AppStore.js";
import useUserActions from "../store/useUserActions.js";
import io from "socket.io-client";
import {ToastContainer, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { IoSearchSharp } from "react-icons/io5";
import { CiMenuKebab } from "react-icons/ci";

let cachedHandlers = new Map();

const createDebouncedHandler = (handler, delay = 2000) => {
    let timeoutId = null;
    let lastArgs = null;
    let lastCallTime = 0;

    return (...args) => {
        const now = Date.now();
        const timeSinceLastCall = now - lastCallTime;
        lastArgs = args;

        // Clear existing timeout
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        // Execute immediately if enough time has passed
        if (timeSinceLastCall >= delay) {
            lastCallTime = now;
            handler(...args);
        } else {
            // Schedule execution
            timeoutId = setTimeout(() => {
                lastCallTime = Date.now();
                handler(...lastArgs);
            }, delay - timeSinceLastCall);
        }
    };
};

export const getDebouncedHandler = (eventName, handler, delay) => {
    const key = `${eventName}_${delay}`;

    if (!cachedHandlers.has(key)) {
        cachedHandlers.set(key, createDebouncedHandler(handler, delay));
    }

    return cachedHandlers.get(key);
};


const ChatApp = () => {
    // const [isTyping, setIsTyping] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [showChat, setShowChat] = useState(false);

    const {getUserMessages} = useUserActions();

    const userData = useStore((state)=> state.userData);
    const userContacts = useStore((state)=> state.userContacts);
    const updateUserContacts = useStore((state)=> state.updateUserContacts);
    const msgHistory = useStore((state)=> state.msgHistory);
    const updateMsgHistory = useStore((state)=> state.updateMsgHistory);
    const activeChat = useStore((state)=> state.activeChat);
    const updateActiveChat = useStore((state)=> state.updateActiveChat);
    const backendUrl = useStore((state)=> state.backendUrl);
    let socketInstance = null;
    const getSocket = () => {

        if (!socketInstance) {
            socketInstance = io(backendUrl);
        }
        return socketInstance;
    };

    // Use it like this
    const webSocket = getSocket();
    // Handle responsive behavior
    useEffect(() => {
        const checkScreenSize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (!mobile) {
                setShowChat(true);
            }
        };
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    useEffect(() => {
        console.log("Initial chat app,rendering....");

        console.log("Active chat in chat component: ", activeChat);
        console.log("Updating activeChat to:",userContacts[0]);
        updateActiveChat(userContacts[0]);
        getUserMessages(userContacts[0]);
    }, []);


    function connectSocket(){
        console.log("Connecting to server.....");
        webSocket.connect();
    }

    useEffect(() => {
        connectSocket();
        // ========== ALL EVENT LISTENERS IN ONE PLACE ==========
        // Connection event
        webSocket.on('connect', () => {
            console.log("Connected to server✅");
            webSocket.emit("newUser", {username: userData.username, email: userData.email,currUserId:userData._id});

            if (activeChat.recipient) {
                try {
                    webSocket.emit("joinRoom", {
                        owner: userData._id,
                        recipient: activeChat.recipient
                    });
                    console.log("Requested to join room successfully");
                } catch (e) {
                    console.log("Error joining room:", e);
                }
            }
        });

        // Room created
        webSocket.on('createdRoom', (data) => {
            console.log("Room created using data: ", data);
        });

        webSocket.on('newMsg', (data) => {
            console.log("New Message received: ",data);
            const {owner} = data;
            if(owner === activeChat.owner) { //  Got sent msg return from server
                // Use functional update to get the latest state

                const currentHistory = useStore.getState().msgHistory;
                updateMsgHistory([...currentHistory, data.messageObj]);

                console.log("Updated msgsArray with sender's message");
            } else {   //  Got second person's(contact) msg from server
                // Get current state first, then pass new array
                const currentHistory = useStore.getState().msgHistory;
                const newHistory = [
                    ...currentHistory,
                    {
                        message: data.messageObj.message,
                        time: data.messageObj.time,
                        msgType: "received"
                    }
                ];
                updateMsgHistory(newHistory);
                console.log("Updated msgsArray with received message");
            }
        });

        // Debounced handlers
        const handler1 = getDebouncedHandler('UserDisplayed', (username) => {
            if(userData && username === userData.username) return;
            alert(username + " joined the chat app");
        }, 2000);

        const handler2 = getDebouncedHandler('improperConn', () => {
            console.log("Both users are not properly connected");
            alert("Both users are not properly connected");

        }, 2000);

        const handler3 = getDebouncedHandler('AUserDisconnected', (user) => {
            console.log("A User Disconnected named: ", user);
            alert(`${user ? user : "someone"} left the chat app`);
        }, 6000);

        // Disconnect event
        webSocket.on("disconnect", () => {
            console.log("Disconnected from server❌");
        });

        // Attach ALL event listeners
        webSocket.on('UserDisplayed', handler1);
        webSocket.on('improperConn', handler2);
        webSocket.on('AUserDisconnected', handler3);

        // ========== CLEANUP ==========
        return () => {
            console.log("Cleaning up socket listeners");

            // Remove ALL listeners
            webSocket.off('connect');
            webSocket.off('createdRoom');
            webSocket.off('newMsg');
            webSocket.off('UserDisplayed');
            webSocket.off('improperConn');
            webSocket.off('AUserDisconnected');
            webSocket.off('disconnect');

            // Cancel debounced handlers
            if (handler1?.cancel) handler1.cancel();
            if (handler2?.cancel) handler2.cancel();
            if (handler3?.cancel) handler3.cancel();

            // Clear toasts
            toast.dismiss();
        };

    },[activeChat,userData]);


    const handleContactClick = async (contact) => {

        console.log("Clicked contact: ", contact);
        console.log("Active chat in chat component: ", activeChat);
        if (isMobile) {
            setShowChat(true);
        }

        //  Need to write socket logic here
        console.log("Writing socket logic in Hanldle ContactClick.........")

        if(contact.recipient === activeChat.recipient) return;
        updateActiveChat(contact);
        console.log("Updated active chat: ", activeChat);
        await getUserMessages(contact);

        updateUserContacts(prev =>
            prev.map(c =>
                c.id === contact.id ? { ...c, unread: 0, active: true } : { ...c, active: false }
            )
        );

    }

    const handleBackToContacts = () => {
        setShowChat(false);
    };

    const handleSendMessage = (content) => {

        const newMessage = {
            message:content,
            time:new Date().toISOString(),
            msgType: 'sent'
        };

        console.log("Curr msg object:",newMessage);
        webSocket.emit("newMsgToSend",{
            owner:activeChat.owner,
            recipient:activeChat.recipient,
            messageObj:newMessage
        });
        console.log("Sent message to server");

    };

    const handleSearch = (query) => {
        // Implement search functionality
        console.log('Searching for:', query);
    };


    return (
        <div className="h-screen bg-gray-100 flex flex-col">
            <ToastContainer position="top-right"
                            autoClose={3000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                            theme="light" />

            {/* App Header */}
            <div className="bg-indigo-500 text-white px-4 py-3 flex items-center justify-between shadow-lg">
                <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold mr-3">
                        {userData.username.toString().toUpperCase()[0]}
                    </div>
                    <div>
                        <h1 className="font-semibold">{userData.username}</h1>
                        <p className="text-xs text-green-200">Online</p>
                    </div>
                </div>
                <div className="flex items-center space-x-4 cursor-pointer">
                    <Link to="/" ><IoHome className="text-white h-5 w-5 " /></Link>
                    <button className="text-white hover:text-gray-200 transition-colors cursor-pointer">
                        <IoSearchSharp className="h-5 w-5" />
                    </button>
                    <button className="text-white hover:text-gray-200 transition-colors cursor-pointer">
                        <CiMenuKebab className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Contact List - Show on mobile when chat is not active */}
                {(!isMobile || !showChat) && (
                    <ContactList
                        contacts={userContacts}
                        activeChat={activeChat}
                        onContactClick={handleContactClick}
                        onSearch={handleSearch}
                    />
                )}

                {/* Chat Area - Show on mobile when chat is active */}
                {(!isMobile || showChat) && activeChat && (
                    <div className="flex-1 flex flex-col bg-white md:bg-gray-50">
                        <ChatHeader
                            onBack={handleBackToContacts}
                            isMobile={isMobile}
                        />
                        <MessagesContainer
                            messages={msgHistory}
                        />
                        <MessageInput
                            onSendMessage={handleSendMessage}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatApp;




// import { useRef, useState, useEffect, useCallback } from 'react';
// import ContactList from './ContactList.jsx';
// import ChatHeader from './ChatHeader.jsx';
// import MessagesContainer from './MessagesContainer.jsx';
// import MessageInput from './MessageInput.jsx';
// import { IoHome } from "react-icons/io5";
// import { Link } from "react-router-dom";
// import useStore from "../store/AppStore.js";
// import useUserActions from "../store/useUserActions.js";
// import io from "socket.io-client";
// import {ToastContainer, toast} from "react-toastify";
// import 'react-toastify/dist/ReactToastify.css';
// import { IoSearchSharp } from "react-icons/io5";
// import { CiMenuKebab } from "react-icons/ci";
//
// // Add imports at top
// let cachedHandlers = new Map();
//
// const createDebouncedHandler = (handler, delay = 2000) => {
//     let timeoutId = null;
//     let lastArgs = null;
//     let lastCallTime = 0;
//
//     return (...args) => {
//         const now = Date.now();
//         const timeSinceLastCall = now - lastCallTime;
//         lastArgs = args;
//
//         // Clear existing timeout
//         if (timeoutId) {
//             clearTimeout(timeoutId);
//         }
//
//         // Execute immediately if enough time has passed
//         if (timeSinceLastCall >= delay) {
//             lastCallTime = now;
//             handler(...args);
//         } else {
//             // Schedule execution
//             timeoutId = setTimeout(() => {
//                 lastCallTime = Date.now();
//                 handler(...lastArgs);
//             }, delay - timeSinceLastCall);
//         }
//     };
// };
//
// export const getDebouncedHandler = (eventName, handler, delay) => {
//     const key = `${eventName}_${delay}`;
//
//     if (!cachedHandlers.has(key)) {
//         cachedHandlers.set(key, createDebouncedHandler(handler, delay));
//     }
//
//     return cachedHandlers.get(key);
// };
//
// const ChatApp = () => {
//     // Existing state and hooks...
//
//     const [isMobile, setIsMobile] = useState(false);
//     const [showChat, setShowChat] = useState(false);
//
//     const {getUserMessages} = useUserActions();
//
//     const userData = useStore((state)=> state.userData);
//     const userContacts = useStore((state)=> state.userContacts);
//     const updateUserContacts = useStore((state)=> state.updateUserContacts);
//     const msgHistory = useStore((state)=> state.msgHistory);
//     const updateMsgHistory = useStore((state)=> state.updateMsgHistory);
//     const activeChat = useStore((state)=> state.activeChat);
//     const updateActiveChat = useStore((state)=> state.updateActiveChat);
//     const backendUrl = useStore((state)=> state.backendUrl);
//     // const updateMessageStatusInStore = useStore((state)=> state.updateMessageStatusInStore);
//
//     let socketInstance = null;
//     const getSocket = () => {
//
//         if (!socketInstance) {
//             socketInstance = io(backendUrl);
//         }
//         return socketInstance;
//     };
//
//     // Use it like this
//     const webSocket = getSocket();
//
//     // Add new ref for Intersection Observer
//     const messageObserversRef = useRef(new Map());
//     const observerCallbackRef = useRef(null);
//
//     function connectSocket(){
//         console.log("Connecting to server.....");
//         webSocket.connect();
//     }
//
//         useEffect(() => {
//         const checkScreenSize = () => {
//             const mobile = window.innerWidth < 768;
//             setIsMobile(mobile);
//             if (!mobile) {
//                 setShowChat(true);
//             }
//         };
//         checkScreenSize();
//         window.addEventListener('resize', checkScreenSize);
//         return () => window.removeEventListener('resize', checkScreenSize);
//     }, []);
//
//     useEffect(() => {
//         console.log("Initial chat app,rendering....");
//
//         console.log("Active chat in chat component: ", activeChat);
//         console.log("Updating activeChat to:",userContacts[0]);
//         updateActiveChat(userContacts[0]);
//         getUserMessages(userContacts[0]);
//     }, []);
//
//
//     // Modified useEffect for socket events
//     useEffect(() => {
//         connectSocket();
//
//
//         // Add this at the start of your socket useEffect
//         console.log('Socket setup with userData:', {
//             id: userData._id,
//             username: userData.username
//         });
//         console.log('Active chat:', activeChat);
//
//         // Create observer callback
//         // observerCallbackRef.current = (entries) => {
//         //     entries.forEach(entry => {
//         //         if (entry.isIntersecting) {
//         //             const { conversationId, messageIndex } = entry.target.dataset;
//         //             if (conversationId && messageIndex) {
//         //                 // Mark message as read
//         //                 webSocket.emit('message-read', {
//         //                     conversationId,
//         //                     messageIndex,
//         //                     recipientId: userData._id
//         //                 });
//         //
//         //                 // Stop observing this message
//         //                 const observer = messageObserversRef.current.get(conversationId);
//         //                 if (observer) {
//         //                     observer.unobserve(entry.target);
//         //                 }
//         //             }
//         //         }
//         //     });
//         // };
//
//         // ========== ALL EVENT LISTENERS IN ONE PLACE ==========
//         // Connection event
//         webSocket.on('connect', () => {
//             console.log("Connected to server✅");
//
//             // Emit newUser event (for both toast and status tracking)
//             webSocket.emit("newUser", {
//                 username: userData.username,
//                 email: userData.email,
//                 currUserId: userData._id
//             });
//
//             // Join room if active chat exists
//             if (activeChat && activeChat.recipient) {
//                 try {
//                     webSocket.emit("joinRoom", {
//                         owner: userData._id,
//                         recipient: activeChat.recipient
//                     });
//                     console.log("Requested to join room");
//                 } catch (e) {
//                     console.log("Error joining room:", e);
//                 }
//             }
//         });
//
//         // Room joined confirmation
//         webSocket.on('room-joined', (data) => {
//             console.log("Successfully joined room:", data.roomId);
//         });
//
//         // NEW:   Message status updates
//         // webSocket.on('message-status-updated', (data) => {
//         //     console.log('Message status updated:', data);
//         //     updateMessageStatusInStore(data);
//         // });
//
//         // NEW: All messages read
//         //     webSocket.on('all-messages-read', (data) => {
//         //         console.log('All messages read by recipient:', data);
//         //         updateAllMessagesStatusInStore(data.recipientId, 'read');
//         //     });
//
//         webSocket.on('newMsg', (data) => {
//             console.log("=== NEW MSG DEBUG ===");
//             console.log("Received data:", data);
//             console.log("Owner in data:", data.owner);
//             console.log("My user ID:", userData._id);
//             console.log("Are they equal?", data.owner === userData._id);
//             console.log("Message type in data:", data.messageObj.msgType);
//             console.log("=== END DEBUG ===");
//             console.log("New Message received: ", data);
//
//             const { owner, conversationId, messageIndex, isOwnMessage } = data;
//
//             // Get current history
//             const currentHistory = useStore.getState().msgHistory;
//
//             if(owner === userData._id) { // Got sent msg return from server (our own message)
//                 // Keep original message with status
//                 const messageWithStatus = {
//                     ...data.messageObj,
//                     conversationId,
//                     messageIndex,
//                     owner: owner
//                 };
//
//                 updateMsgHistory([...currentHistory, messageWithStatus]);
//                 console.log("Updated msgsArray with sender's message (our own)");
//
//             } else { // Got second person's(contact) msg from server
//                 // Create received message with status
//                 const receivedMessage = {
//                     message: data.messageObj.message,
//                     time: data.messageObj.time,
//                     msgType: "received", // This is correct for received messages
//                     status: data.messageObj.status || 'read',
//                     conversationId,
//                     messageIndex,
//                     owner: owner,
//                     deliveredAt: data.messageObj.deliveredAt,
//                     readAt: data.messageObj.readAt
//                 };
//
//                 const newHistory = [...currentHistory, receivedMessage];
//                 updateMsgHistory(newHistory);
//                 console.log("Updated msgsArray with received message");
//
//                 // Mark as delivered when received (only for received messages)
//                 // if (data.messageObj.status === 'sent') {
//                 //     webSocket.emit('message-delivered', {
//                 //         conversationId,
//                 //         messageIndex,
//                 //         recipientId: userData._id
//                 //     });
//                 // }
//             }
//         });
//
//         // Keep existing toast event listeners...
//         // ========== TOAST EVENT LISTENERS ==========
//
//         // Debounced handlers
//         const handler1 = getDebouncedHandler('UserDisplayed', (username) => {
//             if(userData && username === userData.username) return;
//             alert(username + " joined the chat app");
//         }, 2000);
//
//         const handler2 = getDebouncedHandler('improperConn', () => {
//             console.log("Both users are not properly connected");
//             alert("Both users are not properly connected");
//
//         }, 2000);
//
//         const handler3 = getDebouncedHandler('AUserDisconnected', (user) => {
//             console.log("A User Disconnected named: ", user);
//             alert(`${user ? user : "someone"} left the chat app`);
//         }, 6000);
//
//         // Add heartbeat for connection stability
//         const heartbeatInterval = setInterval(() => {
//             if (webSocket.connected) {
//                 webSocket.emit('heartbeat', { userId: userData._id });
//             }
//         }, 15000);
//
//         return () => {
//             clearInterval(heartbeatInterval);
//             console.log("Cleaning up socket listeners and observers");
//
//             // Clean up all observers
//             messageObserversRef.current.forEach((observer, conversationId) => {
//                 observer.disconnect();
//             });
//             messageObserversRef.current.clear();
//
//             // Remove ALL listeners (existing + new)
//             webSocket.off('connect');
//             webSocket.off('createdRoom');
//             webSocket.off('newMsg');
//             webSocket.off('UserDisplayed');
//             webSocket.off('improperConn');
//             webSocket.off('AUserDisconnected');
//             webSocket.off('disconnect');
//             webSocket.off('message-status-updated'); // NEW
//             webSocket.off('all-messages-read'); // NEW
//
//             // Cancel debounced handlers...
//             // Clear toasts...
//
//             // Cancel debounced handlers
//             if (handler1?.cancel) handler1.cancel();
//             if (handler2?.cancel) handler2.cancel();
//             if (handler3?.cancel) handler3.cancel();
//
// //             // Clear toasts
//             toast.dismiss();
//         };
//     }, [activeChat, userData]);
//
//     // NEW: Function to update message status in store
//     const updateMessageStatusInStore = useCallback((data) => {
//         const { conversationId, messageIndex, status, timestamp } = data;
//         const currentHistory = useStore.getState().msgHistory;
//
//         const updatedHistory = currentHistory.map((msg, index) => {
//             if (msg.conversationId === conversationId &&
//                 msg.messageIndex === parseInt(messageIndex)) {
//                 return {
//                     ...msg,
//                     status,
//                     ...(status === 'delivered' && { deliveredAt: timestamp }),
//                     ...(status === 'read' && { readAt: timestamp })
//                 };
//             }
//             return msg;
//         });
//
//         updateMsgHistory(updatedHistory);
//     }, []);
//
//     // NEW: Function to update all messages status in store
//     const updateAllMessagesStatusInStore = useCallback((senderId, status) => {
//         const currentHistory = useStore.getState().msgHistory;
//
//         const updatedHistory = currentHistory.map(msg => {
//             if (msg.owner === senderId && msg.msgType === 'sent' && msg.status !== 'read') {
//                 return {
//                     ...msg,
//                     status,
//                     ...(status === 'read' && { readAt: new Date() })
//                 };
//             }
//             return msg;
//         });
//
//         updateMsgHistory(updatedHistory);
//     }, []);
//
//     // NEW: Setup observer for a conversation
//     const setupMessageObserver = useCallback((conversationId) => {
//         // Disconnect existing observer for this conversation
//         const existingObserver = messageObserversRef.current.get(conversationId);
//         if (existingObserver) {
//             existingObserver.disconnect();
//         }
//
//         // Create new observer
//         const observer = new IntersectionObserver(
//             observerCallbackRef.current,
//             { threshold: 0.5 }
//         );
//
//         messageObserversRef.current.set(conversationId, observer);
//
//         // Observe all unread messages
//         setTimeout(() => {
//             document.querySelectorAll(`[data-conversation-id="${conversationId}"]`).forEach(element => {
//                 const messageIndex = element.dataset.messageIndex;
//                 const msgStatus = element.dataset.status;
//
//                 // Only observe if message is not read and is received
//                 if (msgStatus !== 'read' && element.dataset.msgType === 'received') {
//                     observer.observe(element);
//                 }
//             });
//         }, 100);
//     }, []);
//
//     // Modified handleContactClick
//     const handleContactClick = async (contact) => {
//         console.log("Clicked contact: ", contact);
//
//         if (isMobile) {
//             setShowChat(true);
//         }
//
//         if (contact.recipient === activeChat?.recipient) return;
//
//         // Update active chat first
//         updateActiveChat(contact);
//
//         // Join room for this contact
//         webSocket.emit("joinRoom", {
//             owner: userData._id,
//             recipient: contact.recipient
//         });
//
//         // Mark all messages from this contact as read
//         webSocket.emit('mark-all-as-read', {
//             senderId: contact.recipient,
//             recipientId: userData._id
//         });
//
//         // Fetch messages
//         await getUserMessages(contact);
//
//         // Update UI
//         updateUserContacts(prev =>
//             prev.map(c =>
//                 c.id === contact.id ? { ...c, unread: 0, active: true } : { ...c, active: false }
//             )
//         );
//     };
//
//     // NEW: Helper function to get conversation ID
//     const getConversationIdForMessages = async (contact) => {
//         // You'll need to implement this based on how you fetch messages
//         // It should return the conversation ID for the active chat
//         try {
//             const response = await fetch(`${backendUrl}/api/messages/conversation-id`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     owner: userData._id,
//                     recipient: contact.recipient
//                 })
//             });
//             const data = await response.json();
//             return data.conversationId;
//         } catch (error) {
//             console.error('Error getting conversation ID:', error);
//             return null;
//         }
//     };
//
//     const handleSendMessage = (content) => {
//         if (!content.trim()) return;
//
//         const newMessage = {
//             message: content,
//             time: new Date().toISOString(),
//             msgType: 'sent',
//             status: 'sending'
//         };
//
//         console.log("Sending message:", newMessage);
//
//         webSocket.emit("newMsgToSend", {
//             owner: userData._id, // Use current user's ID, not activeChat.owner
//             // owner: activeChat.owner, // Use current user's ID, not activeChat.owner
//             recipient: activeChat.recipient,
//             messageObj: newMessage
//         });
//
//         // Optimistic update
//         const currentHistory = useStore.getState().msgHistory;
//         updateMsgHistory([...currentHistory, {
//             ...newMessage,
//             conversationId: 'temp',
//             messageIndex: currentHistory.length
//         }]);
//     };
//
//     const handleBackToContacts = () => {
//         setShowChat(false);
//     };
//
//     // Return JSX (unchanged)...
//     return (
//         <div className="h-screen bg-gray-100 flex flex-col">
//             <ToastContainer position="top-right"
//                             autoClose={3000}
//                             hideProgressBar={false}
//                             newestOnTop={false}
//                             closeOnClick
//                             rtl={false}
//                             pauseOnFocusLoss
//                             draggable
//                             pauseOnHover
//                             theme="light" />
//
//             {/* App Header */}
//             <div className="bg-indigo-500 text-white px-4 py-3 flex items-center justify-between shadow-lg">
//                 <div className="flex items-center">
//                     <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold mr-3">
//                         {userData.username.toString().toUpperCase()[0]}
//                     </div>
//                     <div>
//                         <h1 className="font-semibold">{userData.username}</h1>
//                         <p className="text-xs text-green-200">Online</p>
//                     </div>
//                 </div>
//                 <div className="flex items-center space-x-4 cursor-pointer">
//                     <Link to="/" ><IoHome className="text-white h-5 w-5 " /></Link>
//                     <button className="text-white hover:text-gray-200 transition-colors cursor-pointer">
//                         <IoSearchSharp className="h-5 w-5" />
//                     </button>
//                     <button className="text-white hover:text-gray-200 transition-colors cursor-pointer">
//                         <CiMenuKebab className="h-5 w-5" />
//                     </button>
//                 </div>
//             </div>
//
//             {/* Main Content */}
//             <div className="flex-1 flex overflow-hidden">
//                 {/* Contact List - Show on mobile when chat is not active */}
//                 {(!isMobile || !showChat) && (
//                     <ContactList
//                         contacts={userContacts}
//                         activeChat={activeChat}
//                         onContactClick={handleContactClick}
//                     />
//                 )}
//
//                 {/* Chat Area - Show on mobile when chat is active */}
//                 {(!isMobile || showChat) && activeChat && (
//                     <div className="flex-1 flex flex-col bg-white md:bg-gray-50">
//                         <ChatHeader
//                             onBack={handleBackToContacts}
//                             isMobile={isMobile}
//                         />
//                         <MessagesContainer
//                             messages={msgHistory}
//                         />
//                         <MessageInput
//                             onSendMessage={handleSendMessage}
//                         />
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
//
// };
//
// export default ChatApp;