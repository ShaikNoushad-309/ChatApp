// components/Features.js
import React from 'react';

const Features = () => {
    const features = [
        {
            icon: '⚡',
            title: 'Real-time Messaging',
            description: 'Instant message delivery with typing indicators and read receipts. Never miss a conversation with our lightning-fast technology.'
        },
        {
            icon: '👥',
            title: 'Contact Management',
            description: 'Easily add, organize, and group your contacts. Create custom lists for family, friends, and colleagues.'
        },
        {
            icon: '🔒',
            title: 'Secure & Private',
            description: 'Your conversations are protected with end-to-end encryption. We never store or share your personal data.'
        }
    ];

    return (
        <section id="features" className="bg-gray-50 py-20">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-4xl font-bold text-center mb-16 relative">
                    Powerful Features
                    <span className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 w-20 h-1 bg-blue-600 rounded"></span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center"
                        >
                            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl mb-6 mx-auto">
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center justify-center gap-3">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;