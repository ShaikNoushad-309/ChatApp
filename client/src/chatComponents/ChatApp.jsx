// components/ChatApp.jsx
import React, { useState, useEffect } from 'react';
import ContactList from './ContactList.jsx';
import ChatHeader from './ChatHeader.jsx';
import MessagesContainer from './MessagesContainer.jsx';
import MessageInput from './MessageInput.jsx';
import { IoHome } from "react-icons/io5";
import { Link } from "react-router-dom";
import useStore from "../store/AppStore.js";

const ChatApp = () => {
    const [contacts, setContacts] = useState([
        {
            id: 1,
            name: 'John Doe',
            avatar: 'JD',
            lastMessage: 'Hey, how are you doing?',
            time: '10:30 AM',
            unread: 2,
            status: 'online',
            active: true,
        },
        {
            id: 2,
            name: 'Alice Smith',
            avatar: 'AS',
            lastMessage: 'Can we schedule a meeting?',
            time: 'Yesterday',
            unread: 0,
            status: 'online',
            active: false,
        },
        {
            id: 3,
            name: 'Bob Taylor',
            avatar: 'BT',
            lastMessage: 'I sent you the documents',
            time: 'Monday',
            unread: 1,
            status: 'offline',
            active: false,
        },
    ]);

    const [messages, setMessages] = useState([
        { id: 1, content: "Hey there! How are you doing?", time: "10:25 AM", type: "received" },
        { id: 2, content: "I'm good, thanks! Just working on a new project.", time: "10:26 AM", type: "sent", status: "✓✓" },
        { id: 3, content: "That sounds interesting. What kind of project?", time: "10:28 AM", type: "received" },
        { id: 4, content: "It's a real-time chat application. Pretty cool stuff!", time: "10:29 AM", type: "sent", status: "✓✓" },
        { id: 5, content: "Awesome! Can't wait to see it in action.", time: "10:30 AM", type: "received" },
    ]);

    const [activeChat, setActiveChat] = useState(contacts[0]);
    const [isTyping, setIsTyping] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const userData = useStore((state)=> state.userData);


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

    const handleContactClick = (contact) => {
        setActiveChat(contact);
        if (isMobile) {
            setShowChat(true);
        }

        // Mark as read
        setContacts(prev =>
            prev.map(c =>
                c.id === contact.id ? { ...c, unread: 0, active: true } : { ...c, active: false }
            )
        );
    };

    const handleBackToContacts = () => {
        setShowChat(false);
    };

    const handleSendMessage = (content) => {
        const newMessage = {
            id: messages.length + 1,
            content,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'sent',
            status: '✓✓',
        };

        setMessages(prev => [...prev, newMessage]);

        // Simulate typing and response
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            const response = {
                id: messages.length + 2,
                content: "Thanks for your message! This is an automated response.",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                type: 'received',
            };
            setMessages(prev => [...prev, response]);
        }, 2000);
    };

    const handleSearch = (query) => {
        // Implement search functionality
        console.log('Searching for:', query);
    };

    return (
        <div className="h-screen bg-gray-100 flex flex-col">
            {/* App Header */}
            <div className="bg-indigo-500 text-white px-4 py-3 flex items-center justify-between shadow-lg">
                <div className="flex items-center">
                    {isMobile && showChat && (
                        <button
                            onClick={handleBackToContacts}
                            className="mr-3 text-white hover:text-gray-200 transition-colors"
                        >
                            ←
                        </button>
                    )}
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold mr-3">
                        {userData.username.toString().toUpperCase()[0]}
                    </div>
                    <div>
                        <h1 className="font-semibold">{userData.username}</h1>
                        <p className="text-xs text-green-200">Online</p>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <Link to="/" ><IoHome className="text-black" /></Link>
                    <button className="text-white hover:text-gray-200 transition-colors">
                        🔍
                    </button>
                    <button className="text-white hover:text-gray-200 transition-colors">
                        ⋮
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Contact List - Show on mobile when chat is not active */}
                {(!isMobile || !showChat) && (
                    <ContactList
                        contacts={contacts}
                        activeChat={activeChat}
                        onContactClick={handleContactClick}
                        onSearch={handleSearch}
                    />
                )}

                {/* Chat Area - Show on mobile when chat is active */}
                {(!isMobile || showChat) && activeChat && (
                    <div className="flex-1 flex flex-col bg-white md:bg-gray-50">
                        <ChatHeader
                            contact={activeChat}
                            onBack={handleBackToContacts}
                            isMobile={isMobile}
                        />
                        <MessagesContainer
                            messages={messages}
                            isTyping={isTyping}
                        />
                        <MessageInput onSendMessage={handleSendMessage} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatApp;