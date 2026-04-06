const Message = ({message, type, time}) => {
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
                <div className="flex items-center justify-end space-x-1">
                    <span className="text-[10px] xs:text-xs text-gray-500">
                        {date.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                        })}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Message;