// components/ContactList.jsx
import React from 'react';

const ContactList = ({ contacts, activeChat, onContactClick, onSearch }) => {
    return (
        <div className="w-full md:w-1/3 bg-white border-r border-gray-200 flex flex-col h-full">
            {/* Search Bar */}
            <div className="p-4 border-b border-gray-200">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search or start new chat"
                        className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                        onChange={(e) => onSearch(e.target.value)}
                    />
                    <div className="absolute left-3 top-2.5 text-gray-500">
                        🔍
                    </div>
                </div>
            </div>
            <div className="p-4 border-b border-gray-200 flex justify-evenly">
                <button>add contact</button>
                <button>received request</button>
                <button>sent requests</button>
            </div>

            {/* Contacts List */}
            <div className="flex-1 overflow-y-auto">
                {contacts.map((contact) => (
                    <div
                        key={contact.id}
                        className={`flex items-center p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                            activeChat?.id === contact.id ? 'bg-green-50' : ''
                        }`}
                        onClick={() => onContactClick(contact)}
                    >
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold mr-3 flex-shrink-0">
                            {contact.avatar}
                        </div>

                        {/* Contact Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-1">
                                <h3 className="font-semibold text-gray-800 truncate">
                                    {contact.name}
                                </h3>
                                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {contact.time}
                </span>
                            </div>
                            <p className="text-sm text-gray-600 truncate">
                                {contact.lastMessage}
                            </p>
                        </div>

                        {/* Unread Badge */}
                        {/*{contact.unread > 0 && (*/}
                        {/*    <div className="ml-2 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">*/}
                        {/*        {contact.unread}*/}
                        {/*    </div>*/}
                        {/*)}*/}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ContactList;