// components/MessageInput.jsx
import React, { useState } from 'react';

const MessageInput = ({ onSendMessage }) => {
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim()) {
            onSendMessage(message.trim());
            setMessage('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <div className="bg-white px-4 py-3 border-t border-gray-200">
            <form onSubmit={handleSubmit} className="flex items-center space-x-2">
                {/* Attachment Button */}
                <button
                    type="button"
                    className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-green-600 transition-colors"
                >
                    📎
                </button>

                {/* Message Input */}
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message"
                    className="flex-1 bg-gray-100 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none max-h-32"
                    rows="1"
                />

                {/* Emoji Button */}
                <button
                    type="button"
                    className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-green-600 transition-colors"
                >
                    😊
                </button>

                {/* Send Button */}
                <button
                    type="submit"
                    className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!message.trim()}
                >
                    ➤
                </button>
            </form>
        </div>
    );
};

export default MessageInput;