// components/Hero.js
import React from 'react';
import { Link } from "react-router-dom";

// const bg_url = "data:image/svg+xml,<svg xmlns=\\"
// http://www.w3.org/2000/svg\\" viewBox=\\"0 0 1000 100\\" fill=\\"%23ffffff\\"><polygon points=\\"1000,100 1000,0 0,100\\"></polygon></svg>"

const Hero = () => {
    return (
        <section id="about" className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-32 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-purple-600 to-indigo-700"></div>

            <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
                <h1 className="text-5xl md:text-6xl font-bold mb-6 max-w-4xl mx-auto leading-tight">
                    Connect with Friends Instantly
                </h1>
                <p className="text-xl max-w-2xl mx-auto mb-10 text-blue-100 leading-relaxed">
                    Real-time messaging made simple and secure. Join millions of users worldwide who trust ChatApp for their daily conversations.
                </p>
                <Link to="/chatapp" className="cursor-pointer bg-white text-blue-600 px-10 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                    Start Chatting Now
                </Link>
            </div>
        </section>
    );
};

export default Hero;