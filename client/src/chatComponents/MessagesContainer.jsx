// components/MessagesContainer.jsx
import React, { useEffect, useRef } from 'react';
import Message from './Message.jsx';

const MessagesContainer = ({ messages, isTyping }) => {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    return (
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {/* Messages */}
            {messages.map((message) => (
                <Message key={message.id} message={message} />
            ))}

            {/* Typing Indicator */}
            {isTyping && (
                <div className="flex justify-start mb-3">
                    <div className="bg-white rounded-2xl rounded-bl-none px-4 py-2 shadow-sm">
                        <div className="flex items-center space-x-1">
                            <span className="text-xs text-gray-500 italic">Typing</span>
                            <div className="flex space-x-1">
                                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div ref={messagesEndRef} />
        </div>
    );
};

export default MessagesContainer;