// // components/Message.jsx
// import React from 'react';
//
// const Message = ({message,type,time}) => {
//     const isSent = type === 'sent';
//     const date = new Date(time);
//
//     return (
//         <div className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-3`}>
//             <div
//                 className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
//                     isSent
//                         ? 'bg-green-100 rounded-br-none'
//                         : 'bg-white rounded-bl-none shadow-sm'
//                 }`}
//             >
//                 <p className="text-gray-800 text-sm mb-1">{message}</p>
//                 <div className="flex items-center justify-end space-x-1">
//                     <span className="text-xs text-gray-500">{date.toLocaleTimeString()}</span>
//                     {/*{isSent && message.status && (*/}
//                     {/*    <span className="text-xs text-gray-500">{message.status}</span>*/}
//                     {/*)}*/}
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// export default Message;

// // components/Message.jsx
// import React from 'react';
//
// const Message = ({message, type, time}) => {
//     const isSent = type === 'sent';
//     const date = new Date(time);     //  left here!!!!!!!!!!!!!!!
//
//     return (
//         <div className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-2 sm:mb-3 md:mb-4 w-full`}>
//             <div
//                 className={`max-w-[85%] xs:max-w-[80%] sm:max-w-xs md:max-w-sm lg:max-w-md px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl ${
//                     isSent
//                         ? 'bg-green-100 rounded-br-none'
//                         : 'bg-white rounded-bl-none shadow-sm'
//                 }`}
//             >
//                 <p className="text-gray-800 text-xs sm:text-sm mb-1 break-words whitespace-pre-wrap overflow-wrap-anywhere">
//                     {message}
//                 </p>
//                 <div className="flex items-center justify-end space-x-1">
//                     <span className="text-[10px] xs:text-xs text-gray-500">
//                         {date.toLocaleTimeString([], {
//                             hour: '2-digit',
//                             minute: '2-digit',
//                             hour12: true
//                         })}
//                     </span>
//                     {/*{isSent && message.status && (*/}
//                     {/*    <span className="text-xs text-gray-500">{message.status}</span>*/}
//                     {/*)}*/}
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// export default Message;

const Message = ({message, type, time,seen}) => {
    const isSent = type === 'sent';
    const date = new Date(time);

    return (
        <div className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-2 sm:mb-3 md:mb-4 w-full`}>
            <div
                className={`max-w-[90%] sm:max-w-xs md:max-w-sm lg:max-w-md px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl ${
                    isSent
                        ? 'bg-green-100 rounded-br-none'
                        : 'bg-white rounded-bl-none shadow-sm'
                }`}
            >
                <p className="text-gray-800 text-xs sm:text-sm mb-1 break-words whitespace-pre-wrap overflow-wrap-anywhere">
                    {message}
                </p>

                {/*<div className="flex items-center justify-end space-x-1">*/}
                {/*    <span className="text-[10px] xs:text-xs text-gray-500">*/}
                {/*        {date.toLocaleTimeString([], {*/}
                {/*            hour: '2-digit',*/}
                {/*            minute: '2-digit',*/}
                {/*            hour12: true*/}
                {/*        })}*/}
                {/*    </span>*/}
                {/*</div>*/}

                <div className="flex items-center justify-end space-x-1">
                    <span className="text-[10px] text-gray-500">
                    {date.toLocaleTimeString([], {
                     hour: '2-digit',
                     minute: '2-digit',
                     hour12: true
                    })}
                    </span>

                    {type === "sent" && (
                        <span className="text-[10px] text-blue-600">
                            {seen ? "✓✓" : "✓✓"}
                        </span>
                    )}
                </div>


            </div>
        </div>
    );
};

export default Message;


// const Message = ({ message, type, time, status, deliveredAt, readAt }) => {
//     const isSent = type === 'sent';
//     const date = new Date(time);
//
//     // Get status icon based on status
//     const getStatusIcon = () => {
//         switch (status) {
//             case 'sending':
//                 // return <span className="text-gray-400 animate-pulse">🔄</span>;
//                 return <span className="text-gray-500">✓</span>;
//             // case 'sent':
//             //     return <span className="text-gray-500">✓</span>;
//             case 'delivered':
//                 return <span className="text-gray-600">✓✓</span>;
//             case 'read':
//                 return <span className="text-blue-800">✓✓</span>;
//             default:
//                 return null;
//         }
//     };
//
//     // Format time for status
//     const formatStatusTime = (timestamp) => {
//         if (!timestamp) return '';
//         const date = new Date(timestamp);
//         return date.toLocaleTimeString([], {
//             hour: '2-digit',
//             minute: '2-digit',
//             hour12: true
//         });
//     };
//
//     return (
//         <div
//             className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-2 sm:mb-3 md:mb-4 w-full`}
//             data-conversation-id={message?.conversationId || ''}
//             data-message-index={message?.messageIndex || ''}
//             data-status={status}
//             data-msg-type={type}
//         >
//             <div
//                 className={`max-w-[90%] sm:max-w-xs md:max-w-sm lg:max-w-md px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl ${
//                     isSent
//                         ? 'bg-green-100 rounded-br-none'
//                         : 'bg-white rounded-bl-none shadow-sm'
//                 }`}
//             >
//                 <p className="text-gray-800 text-xs sm:text-sm mb-1 break-words whitespace-pre-wrap overflow-wrap-anywhere">
//                     {message}
//                 </p>
//                 <div className="flex items-center justify-end space-x-1">
//                     {isSent && (
//                         <div className="flex items-center space-x-1">
//                             <span className="text-[9px] xs:text-[10px]">
//                                 {getStatusIcon()}
//                             </span>
//                             {(status === 'delivered' || status === 'read') && (
//                                 <span className="text-[8px] xs:text-[9px] text-gray-500">
//                                     {formatStatusTime(status === 'delivered' ? deliveredAt : readAt)}
//                                 </span>
//                             )}
//                         </div>
//                     )}
//                     <span className="text-[10px] xs:text-xs text-gray-500">
//                         {date.toLocaleTimeString([], {
//                             hour: '2-digit',
//                             minute: '2-digit',
//                             hour12: true
//                         })}
//                     </span>
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// export default Message;