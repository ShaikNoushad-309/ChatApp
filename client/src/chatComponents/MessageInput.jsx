// // components/MessageInput.jsx
// import React, {useEffect, useState,useRef} from 'react';
// import useStore from "../store/AppStore.js";
// import io from "socket.io-client";
// import {getDebouncedHandler} from "./ChatApp.jsx";
//
// const MessageInput = ({ onSendMessage,typingRef }) => {
//     const [message, setMessage] = useState('');
//     const backendUrl = useStore(state => state.backendUrl);
//     const userData = useStore((state)=> state.userData);
//     const activeChat = useStore((state)=> state.activeChat);
//     // const typingTimeoutRef = useRef(null);
//     const isOtherTyping = useStore((state)=> state.isOtherTyping);
//     const upDateIsOtherTyping = useStore((state)=> state.upDateIsOtherTyping);
//
//     let socketInstance = useStore((state)=> state.socketInstance);
//     const getSocket = () => {
//
//         if (!socketInstance) {
//             // updateSocketInstance(io(backendUrl));
//             socketInstance = io(backendUrl);
//         }
//         return socketInstance;
//     };
//
//     // Use it like this
//     const webSocket = getSocket();
//
//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (message.trim()) {
//             onSendMessage(message.trim());
//             setMessage('');
//         }
//     };
//
//
//
//     const handleKeyPress = (e) => {
//         if (e.key === 'Enter' && !e.shiftKey) {
//             e.preventDefault();
//             handleSubmit(e);
//         }
//     };
//
// // Handle typing with debounce
//     const handleTyping = (e) => {
//         console.log("Called handleTyping: ", e.target.value + "");
//         const value = e.target.value;
//         setMessage(value);
//
//         // Emit typing started
//         if (value.length === 1) {
//             console.log("Emitting typing started");
//             webSocket.emit('typing', {
//                 owner: userData._id,
//                 recipient: activeChat.recipient,
//                 isTyping: true
//             });
//         }
//
//         // Clear previous timeout
//         if (typingRef.current) {
//             clearTimeout(typingRef.current);
//         }
//
//         // Emit typing stopped after pause
//         typingRef.current = setTimeout(() => {
//             if (message.length > 0) {
//                 webSocket.emit('typing', {
//                     owner: userData._id,
//                     recipient: activeChat.recipient,
//                     isTyping: false
//                 });
//             }
//         }, 1000);
//
//         // If input is cleared, immediately stop typing
//         if (value.length === 0) {
//             webSocket.emit('typing', {
//                 owner: userData._id,
//                 recipient: activeChat.recipient,
//                 isTyping: false
//             });
//         }
//     };
//
//     useEffect(()=>{
//         // Listen for typing events
//         webSocket.on('user-typing', (data) => {
//             console.log("User Typing event received from socket server");
//             if (data.owner === activeChat.recipient) {
//                 upDateIsOtherTyping(data.isTyping);
//
//                 // Auto-hide typing indicator after 2 seconds
//                 if (data.isTyping) {
//                     setTimeout(() => {
//                         upDateIsOtherTyping(false);
//                     }, 2000);
//                 }
//             }
//         });
//     },[]);
//
//     return (
//         <div className="bg-white px-4 py-3 border-t border-gray-200">
//             <form onSubmit={handleSubmit} className="flex items-center space-x-2">
//                 {/* Attachment Button */}
//                 <button
//                     type="button"
//                     className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-green-600 transition-colors"
//                 >
//                     📎
//                 </button>
//
//                 {/* Message Input */}
//                 <textarea
//                     value={message}
//                     // onChange={(e) => setMessage(e.target.value)}
//                     onChange={handleTyping}
//                     onKeyDown={handleKeyPress}
//                     placeholder="Type a message"
//                     className="flex-1 bg-gray-100 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none max-h-32"
//                     rows="1"
//                 />
//
//                 {/* Emoji Button */}
//                 <button
//                     type="button"
//                     className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-green-600 transition-colors"
//                 >
//                     😊
//                 </button>
//
//                 {/* Send Button */}
//                 <button
//                     type="submit"
//                     className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                     disabled={!message.trim()}
//                 >
//                     ➤
//                 </button>
//             </form>
//         </div>
//     );
// };
//
// export default MessageInput;

// components/MessageInput.jsx
import React, {useEffect, useState,useRef,useCallback} from 'react';
import useStore from "../store/AppStore.js";
import io from "socket.io-client";
import {getDebouncedHandler} from "./ChatApp.jsx";
import { IoMdAdd } from "react-icons/io";

const MessageInput = ({ onSendMessage }) => {
    const [message, setMessage] = useState('');
    const backendUrl = useStore(state => state.backendUrl);
    const userData = useStore((state) => state.userData);
    const activeChat = useStore((state) => state.activeChat);
    // const typingTimeoutRef = useRef(null);

    // const isOtherTyping = useStore((state) => state.isOtherTyping);
    // const upDateIsOtherTyping = useStore((state)=> state.upDateIsOtherTyping);

    const typingTimeoutRef = useRef(null);
    const lastTypingEmitRef = useRef(false);

    // let socketInstance = useStore((state) => state.socketInstance);
    // const getSocket = () => {
    //
    //     if (!socketInstance) {
    //         // updateSocketInstance(io(backendUrl));
    //         socketInstance = io(backendUrl);
    //     }
    //     return socketInstance;
    // };
    //
    // // Use it like this
    // const webSocket = getSocket();

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

// Handle typing with debounce
//     const handleTyping = (e) => {
//         console.log("Called handleTyping: ", e.target.value + "");
//         const value = e.target.value;
//         setMessage(value);
//
//         // Emit typing started
//         if (value.length === 1) {
//             console.log("Emitting typing started");
//             webSocket.emit('typing', {
//                 owner: userData._id,
//                 recipient: activeChat.recipient,
//                 isTyping: true
//             });
//         }
//
//         // Clear previous timeout
//         if (typingRef.current) {
//             clearTimeout(typingRef.current);
//         }
//
//         // Emit typing stopped after pause
//             if (message.length > 0) {
//                 webSocket.emit('typing', {
//                     owner: userData._id,
//                     recipient: activeChat.recipient,
//                     isTyping: false
//                 });
//             }
//
//         // If input is cleared, immediately stop typing
//         if (value.length === 0) {
//             webSocket.emit('typing', {
//                 owner: userData._id,
//                 recipient: activeChat.recipient,
//                 isTyping: false
//             });
//         }
//     };

        const handleTyping = (e) => {
        console.log("Called handleTyping: ", e.target.value + "");
        const value = e.target.value;
        setMessage(value);
}

    return (
        <div className="bg-white px-4 py-3 border-t border-gray-200">
            <form onSubmit={handleSubmit} className="flex items-center space-x-2">
                {/* Attachment Button */}
                <button
                    type="button"
                    className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-green-600 transition-colors"
                >
                    <IoMdAdd className="h-5 w-5 cursor-pointer" />
                </button>

                {/* Message Input */}
                <textarea
                    value={message}
                    // onChange={(e) => setMessage(e.target.value)}
                    onChange={handleTyping}
                    // onChange={handleTypingFunc}
                    onKeyDown={handleKeyPress}
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