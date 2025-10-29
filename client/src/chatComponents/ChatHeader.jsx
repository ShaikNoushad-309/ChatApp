// components/ChatHeader.jsx
import React from 'react';

const ChatHeader = ({ contact, onBack, isMobile }) => {
    return (
        <div className="bg-white px-4 py-3 border-b border-gray-200 flex items-center justify-between shadow-sm">
            {/* Contact Info */}
            <div className="flex items-center">
                {isMobile && (
                    <button
                        onClick={onBack}
                        className="mr-3 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        ←
                    </button>
                )}
                <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold mr-3">
                    {contact?.avatar}
                </div>
                <div>
                    <h2 className="font-semibold text-gray-800">{contact?.name}</h2>
                    <p className="text-xs text-gray-500">{contact?.status || 'online'}</p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
                <button className="text-gray-600 hover:text-green-600 transition-colors">
                    📞
                </button>
                <button className="text-gray-600 hover:text-green-600 transition-colors">
                    📹
                </button>
                <button className="text-gray-600 hover:text-green-600 transition-colors">
                    ⓘ
                </button>
            </div>
        </div>
    );
};

export default ChatHeader;