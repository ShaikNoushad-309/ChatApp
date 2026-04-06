
// // components/MessagesContainer.jsx
// import React, { useEffect, useRef } from 'react';
// import Message from './Message.jsx';
// import useStore from "../store/AppStore.js";
// import {Bounce, ToastContainer} from "react-toastify";
//
// const MessagesContainer = ({ messages, isOtherUserTyping }) => {
//     const messagesEndRef = useRef(null);
//
//     const scrollToBottom = () => {
//         messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     };
//
//     const msgHistory = useStore((state)=> state.msgHistory);
//     console.log("Messages in Messages Container: ");
//     console.table(msgHistory);
//     console.log("Time of curr msg: ", msgHistory[msgHistory.length-1]?.time);
//     console.log("Type of curr msg: ", typeof(msgHistory[msgHistory.length-1]?.time));
//
//     useEffect(() => {
//         scrollToBottom();
//     }, [messages]);
//
//     return (
//         <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
//
//             <ToastContainer
//                 position="top-right"
//                 autoClose={2000}
//                 hideProgressBar={false}
//                 newestOnTop={false}
//                 closeOnClick={false}
//                 rtl={false}
//                 pauseOnFocusLoss
//                 draggable
//                 pauseOnHover
//                 theme="light"
//                 transition={Bounce}
//             />
//
//             {/* Messages */}
//             {msgHistory.length === 0 && <h2 className="text-center text-xl font-semibold text-gray-800">No Messages Yet</h2>}
//             {msgHistory && msgHistory.map((msgObj,index) => (
//                 msgObj && <Message key={index}
//                                    message={msgObj.message}
//                                    type={msgObj.msgType}
//                                    time={msgObj.time}
//                 />
//             ))}
//
//
//             <div ref={messagesEndRef} />
//         </div>
//     );
// };
//
// export default MessagesContainer;

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

//  ======= Zaid sends even msgs to mohammed ========
//  ======= mohammed sends odd msgs to zaid ========

/// components/MessagesContainer.jsx
// import React, { useEffect, useRef } from 'react';
// import Message from './Message.jsx';
// import useStore from "../store/AppStore.js";
// import { Bounce, ToastContainer } from "react-toastify";
//
// const MessagesContainer = ({ messages }) => {
//     const messagesEndRef = useRef(null);
//     const containerRef = useRef(null);
//     const chatAppRef = useRef(null);
//
//     const scrollToBottom = () => {
//         messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     };
//
//     const msgHistory = useStore((state) => state.msgHistory);
//     const activeChat = useStore((state) => state.activeChat);
//     const userData = useStore((state) => state.userData);
//
//
//     // Debug logging - only in development
//     if (process.env.NODE_ENV === 'development') {
//         console.log("Messages in Messages Container: ");
//         console.table(msgHistory);
//         console.log("Time of curr msg: ", msgHistory[msgHistory.length - 1]?.time);
//         console.log("Type of curr msg: ", typeof(msgHistory[msgHistory.length - 1]?.time));
//     }
//
//     useEffect(() => {
//         scrollToBottom();
//     }, [messages, msgHistory]);
//
//     // NEW: Check if messages are in viewport when chat is opened
//     useEffect(() => {
//         if (activeChat && msgHistory.length > 0) {
//             // Trigger observation setup in parent component
//             // This assumes ChatApp passes down a setupObserver function
//             const event = new CustomEvent('chat-opened', {
//                 detail: { recipientId: activeChat.recipient }
//             });
//             window.dispatchEvent(event);
//         }
//     }, [activeChat, msgHistory]);
//
//     return (
//         <div className="flex-1 overflow-y-auto p-2 sm:p-3 md:p-4 bg-gray-50"   ref={containerRef} >
//             <ToastContainer
//                 position="top-right"
//                 autoClose={2000}
//                 hideProgressBar={false}
//                 newestOnTop={false}
//                 closeOnClick={false}
//                 rtl={false}
//                 pauseOnFocusLoss
//                 draggable
//                 pauseOnHover
//                 theme="light"
//                 transition={Bounce}
//                 className="text-xs sm:text-sm !w-auto max-w-[90vw]"
//                 toastClassName="text-xs sm:text-sm"
//             />
//
//             {/* No Messages State */}
//             {msgHistory.length === 0 && (
//                 <div className="h-full flex flex-col items-center justify-center min-h-[150px] sm:min-h-[200px] md:min-h-[300px] px-2">
//                     <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 text-center">
//                         No Messages Yet
//                     </h2>
//                     <p className="text-gray-500 text-xs sm:text-sm md:text-base mt-1 sm:mt-2 text-center">
//                         Start a conversation by sending your first message
//                     </p>
//                 </div>
//             )}
//
//             {/* Messages List - Improved container for small screens */}
//             <div className="space-y-2 sm:space-y-3 md:space-y-4 max-w-full">
//                 {msgHistory && msgHistory.map((msgObj, index) => (
//                     msgObj && (
//                         <div key={`${msgObj.conversationId || 'no-id'}-${index}`} className="w-full max-w-full">
//                             <Message
//                                 message={msgObj.message}
//                                 type={msgObj.msgType}
//                                 time={msgObj.time}
//                                 status={msgObj.status}
//                                 deliveredAt={msgObj.deliveredAt}
//                                 readAt={msgObj.readAt}
//                             />
//                         </div>
//                     )
//                 ))}
//             </div>
//
//             {/* Scroll anchor */}
//             <div ref={messagesEndRef} className="h-2 sm:h-3 md:h-4" />
//         </div>
//     );
// };
//
// export default MessagesContainer;