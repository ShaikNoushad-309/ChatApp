// components/Demo.js
import React, { useState } from 'react';

const Demo = () => {
    const [activeContact, setActiveContact] = useState('JS');

    const contacts = [
        { id: 'JS', name: 'John Smith', lastMsg: 'See how easy it is to chat!', active: true },
        { id: 'SD', name: 'Sarah Davis', lastMsg: 'Try sending a message!', active: false },
        { id: 'MJ', name: 'Mike Johnson', lastMsg: "Let's catch up soon!", active: false },
        { id: 'EP', name: 'Emma Parker', lastMsg: 'Did you see the new features?', active: false }
    ];

    const messages = [
        { type: 'received', text: 'Welcome to ChatApp! This is what your conversations will look like.', time: '2:30 PM' },
        { type: 'sent', text: 'Looks great! How do I get started?', time: '2:31 PM' },
        { type: 'received', text: 'Just click the login button above to create your account and start connecting with friends!', time: '2:32 PM' },
        { type: 'received', text: "You'll be able to send messages, share files, and even make voice calls!", time: '2:33 PM' }
    ];

    return (
        <section className="bg-white py-20">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-4xl font-bold text-center mb-12 relative">
                    See How It Works
                    <span className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 w-24 h-1 bg-blue-600 rounded"></span>
                </h2>

                {/* Demo Chat Interface */}
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                        {/* Chat Sidebar */}
                        <div className="w-full md:w-1/3 bg-gray-50 border-r border-gray-200">
                            {contacts.map((contact) => (
                                <div
                                    key={contact.id}
                                    className={`flex items-center p-4 border-b border-gray-200 cursor-pointer transition-colors duration-200 ${
                                        activeContact === contact.id
                                            ? 'bg-blue-50 border-l-4 border-l-blue-600'
                                            : 'hover:bg-blue-50'
                                    }`}
                                    onClick={() => setActiveContact(contact.id)}
                                >
                                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                                        {contact.id}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-gray-900 truncate">{contact.name}</div>
                                        <div className="text-sm text-gray-500 truncate">{contact.lastMsg}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Chat Main Area */}
                        <div className="w-full md:w-2/3 flex flex-col">
                            {/* Chat Header */}
                            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center shadow-sm">
                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                                    JS
                                </div>
                                <span className="font-semibold text-gray-900">John Smith</span>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 bg-gray-50 p-6 max-h-96 overflow-y-auto">
                                {messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`mb-6 max-w-[70%] ${
                                            message.type === 'sent' ? 'ml-auto' : ''
                                        }`}
                                    >
                                        <div
                                            className={`p-3 rounded-2xl ${
                                                message.type === 'sent'
                                                    ? 'bg-blue-600 text-white rounded-tr-md'
                                                    : 'bg-white text-gray-900 rounded-tl-md shadow-sm'
                                            }`}
                                        >
                                            {message.text}
                                        </div>
                                        <span className="text-xs text-gray-500 block text-right mt-1">
                      {message.time}
                    </span>
                                    </div>
                                ))}
                            </div>

                            {/* Input Area */}
                            <div className="bg-white border-t border-gray-200 px-6 py-4 flex">
                                <input
                                    type="text"
                                    placeholder="Sign up to send messages..."
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled
                                />
                                <button
                                    className="ml-3 bg-blue-600 text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-8">
                    <p className="font-semibold text-blue-600">🔒 Sign up to unlock all features</p>
                </div>
            </div>
        </section>
    );
};

export default Demo;