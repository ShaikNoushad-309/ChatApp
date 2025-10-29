// components/Footer.js
import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-4xl mx-auto px-4 text-center">
                <div className="text-2xl font-bold text-blue-400 mb-4">💬 ChatApp</div>
                <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                    Connecting people across the globe with secure, real-time messaging.
                </p>

                <div className="flex justify-center space-x-8 mb-8 flex-wrap">
                    <a href="#privacy" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                        Privacy Policy
                    </a>
                    <a href="#terms" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                        Terms of Service
                    </a>
                    <a href="#support" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                        Support
                    </a>
                    <a href="#careers" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                        Careers
                    </a>
                </div>

                <div className="border-t border-gray-800 pt-8">
                    <p className="text-gray-400 text-sm">
                        &copy; 2023 ChatApp. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;