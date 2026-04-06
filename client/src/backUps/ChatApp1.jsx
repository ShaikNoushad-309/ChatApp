// components/ChatApp.jsx
import React, {useState, useEffect, useRef} from 'react';
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



// /// components/MessagesContainer.jsx
import React, { useEffect, useRef } from 'react';
import Message from './Message.jsx';
import useStore from "../store/AppStore.js";
import { Bounce, ToastContainer } from "react-toastify";

const MessagesContainer = ({ messages }) => {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const msgHistory = useStore((state) => state.msgHistory);

    // Debug logging - only in development
    if (process.env.NODE_ENV === 'development') {
        console.log("Messages in Messages Container: ");
        console.table(msgHistory);
        console.log("Time of curr msg: ", msgHistory[msgHistory.length - 1]?.time);
        console.log("Type of curr msg: ", typeof(msgHistory[msgHistory.length - 1]?.time));
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages, msgHistory]);

    return (
        <div className="flex-1 overflow-y-auto p-2 sm:p-3 md:p-4 bg-gray-50">
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
                className="text-xs sm:text-sm !w-auto max-w-[90vw]"
                toastClassName="text-xs sm:text-sm"
            />

            {/* No Messages State */}
            {msgHistory.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center min-h-[150px] sm:min-h-[200px] md:min-h-[300px] px-2">
                    <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 text-center">
                        No Messages Yet
                    </h2>
                    <p className="text-gray-500 text-xs sm:text-sm md:text-base mt-1 sm:mt-2 text-center">
                        Start a conversation by sending your first message
                    </p>
                </div>
            )}

            {/* Messages List - Improved container for small screens */}
            <div className="space-y-2 sm:space-y-3 md:space-y-4 max-w-full">
                {msgHistory && msgHistory.map((msgObj, index) => (
                    msgObj && (
                        <div key={index} className="w-full max-w-full">
                            <Message
                                message={msgObj.message}
                                type={msgObj.msgType}
                                time={msgObj.time}
                            />
                        </div>
                    )
                ))}
            </div>

            {/* Scroll anchor */}
            <div ref={messagesEndRef} className="h-2 sm:h-3 md:h-4" />
        </div>
    );
};

export default MessagesContainer;