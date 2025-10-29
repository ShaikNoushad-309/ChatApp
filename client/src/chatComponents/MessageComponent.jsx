// components/Message.jsx
import React from 'react';

const Message = ({ message }) => {
    const isSent = message.type === 'sent';

    return (
        <div className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-3`}>
            <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    isSent
                        ? 'bg-green-100 rounded-br-none'
                        : 'bg-white rounded-bl-none shadow-sm'
                }`}
            >
                <p className="text-gray-800 text-sm mb-1">{message.content}</p>
                <div className="flex items-center justify-end space-x-1">
                    <span className="text-xs text-gray-500">{message.time}</span>
                    {isSent && message.status && (
                        <span className="text-xs text-gray-500">{message.status}</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Message;