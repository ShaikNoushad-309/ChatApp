// import React from 'react';
// import { Link,useLocation,useNavigate} from "react-router-dom";
// import useStore from "../store/AppStore.js";
// import axios from "axios";
// import {toast} from "react-toastify";
//
// const Navbar = () => {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const isLoggedIn = useStore((state) => state.isLoggedIn);
//     const userData = useStore((state)=> state.userData);
//     const backendUrl = useStore((state)=> state.backendUrl);
//     const setIsLoggedIn = useStore((state)=> state.setIsLoggedIn);
//
//     const handleScrollToSection = (sectionId) => {
//         // If we are not in home page, navigate to home page first
//         if (location.pathname !== '/') {
//             navigate('/');
//             // Wait for navigation to complete
//             setTimeout(() => {
//                 scrollToSection(sectionId);
//             }, 100);
//         } else {
//         // already in hom page,just need to scroll
//         scrollToSection(sectionId);
//     }
//     };
//
//     const scrollToSection = (sectionId) => {
//         const element = document.getElementById(sectionId);
//         if(element) {
//             element.scrollIntoView({ behavior: 'smooth' ,
//             block: 'start'});
//         }
//     };
//
//     const logOut = async () => {
//         const {data} = await axios.post(`${backendUrl}/api/auth/logout`);
//
//         if(data.success) {
//             setIsLoggedIn(false);
//             toast.success("Logged out successfully");
//         }else{
//             toast.error(data.message);
//         }
//     }
//
//     return (
//         <nav className="bg-white shadow-md sticky top-0 z-50 px-8 py-6">
//             <div className="max-w-7xl mx-auto flex justify-between items-center">
//                 <div className="flex items-center">
//                     <span className="text-2xl font-bold text-blue-600 flex items-center gap-2">
//                         <img src="https://cdn-icons-png.flaticon.com/128/724/724715.png" alt="chat" className="h-7 w-7"/>
//                         ChatApp</span>
//                 </div>
//
//                 <div className="flex items-center space-x-8">
//                     <button  className="cursor-pointer font-medium hover:text-blue-600 transition-colors duration-300 relative py-2"
//                      onClick={()=>{handleScrollToSection("features")}} >
//                         Features
//                         <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 hover:w-full"></span>
//                     </button>
//                     <button onClick={()=>{handleScrollToSection("about")}}
//                        className="cursor-pointer font-medium hover:text-blue-600 transition-colors duration-300 relative py-2">
//                         About
//                         <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 hover:w-full"></span>
//                     </button>
//                     {!isLoggedIn ? <Link to="/login" className="border-2 border-blue-600 text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300">
//                         Login
//                     </Link> :
//                         // <button className="h-8 w-7 rounded-full text-white bg-blue-700 cursor-pointer">{userData && userData.username.toString().toUpperCase()[0]}</button>
//                         <div className="group w-10 rounded-full text-white flex relative cursor-pointer justify-center items-center text-lg h-10 bg-slate-900">{userData.username.toString().toUpperCase()[0]}
//                             <ul className="absolute hidden group-hover:flex flex-col  items-center text-xl bg-zinc-200   top-full w-32   rounded-lg  text-black">
//                                 <li onClick={logOut} className="item3 w-full py-2 px-2 h-[50%] hover:bg-zinc-400 rounded-md">Logout</li>
//                             </ul>
//                         </div>
//                     }
//
//                     <Link to="/login" className={!isLoggedIn ? "bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition-all duration-300"
//                       :"hidden" } >
//                         Sign Up
//                     </Link>
//                 </div>
//             </div>
//         </nav>
//
//     );
// };
//
// export default Navbar;

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import useStore from "../store/AppStore.js";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isLoggedIn = useStore((state) => state.isLoggedIn);
    const userData = useStore((state) => state.userData);
    const backendUrl = useStore((state) => state.backendUrl);
    const setIsLoggedIn = useStore((state) => state.setIsLoggedIn);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleScrollToSection = (sectionId) => {
        // Close mobile menu if open
        setIsMenuOpen(false);

        // If we are not in home page, navigate to home page first
        if (location.pathname !== '/') {
            navigate('/');
            // Wait for navigation to complete
            setTimeout(() => {
                scrollToSection(sectionId);
            }, 100);
        } else {
            // already in home page,just need to scroll
            scrollToSection(sectionId);
        }
    };

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const logOut = async () => {
        setIsMenuOpen(false);
        const { data } = await axios.post(`${backendUrl}/api/auth/logout`);

        if (data.success) {
            setIsLoggedIn(false);
            toast.success("Logged out successfully");
        } else {
            toast.error(data.message);
        }
    }

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50 px-4 sm:px-6 md:px-8 py-4 md:py-6">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Logo */}
                <div className="flex items-center">
                    <span className="text-xl md:text-2xl font-bold text-blue-600 flex items-center gap-2">
                        <img
                            src="https://cdn-icons-png.flaticon.com/128/724/724715.png"
                            alt="chat"
                            className="h-6 w-6 md:h-7 md:w-7"
                        />
                        <span className="hidden sm:block">ChatApp</span>
                    </span>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
                    <button
                        className="cursor-pointer font-medium hover:text-blue-600 transition-colors duration-300 relative py-2"
                        onClick={() => { handleScrollToSection("features") }}
                    >
                        Features
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 hover:w-full"></span>
                    </button>
                    <button
                        onClick={() => { handleScrollToSection("about") }}
                        className="cursor-pointer font-medium hover:text-blue-600 transition-colors duration-300 relative py-2"
                    >
                        About
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 hover:w-full"></span>
                    </button>

                    {!isLoggedIn ? (
                        <>
                            <Link
                                to="/login"
                                className="border-2 border-blue-600 text-blue-600 px-4 md:px-6 py-1.5 md:py-2 rounded-full font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300 text-sm md:text-base whitespace-nowrap"
                            >
                                Login
                            </Link>
                            <Link
                                to="/login"
                                className="bg-blue-600 text-white px-4 md:px-6 py-1.5 md:py-2 rounded-full font-semibold hover:bg-blue-700 transition-all duration-300 text-sm md:text-base whitespace-nowrap"
                            >
                                Sign Up
                            </Link>
                        </>
                    ) : (
                        <div className="group relative cursor-pointer">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full text-white flex justify-center items-center text-base md:text-lg bg-slate-900">
                                {userData && userData.username.toString().toUpperCase()[0]}
                            </div>
                            <ul className="absolute hidden group-hover:flex flex-col items-center text-base md:text-lg bg-zinc-200 top-full w-32 rounded-lg text-black right-0">
                                <li
                                    onClick={logOut}
                                    className="w-full py-2 px-2 hover:bg-zinc-400 rounded-md text-center"
                                >
                                    Logout
                                </li>
                            </ul>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="flex md:hidden items-center space-x-4">
                    {!isLoggedIn ? (
                        <>
                            <Link
                                to="/login"
                                className="bg-blue-600 text-white px-4 py-1.5 rounded-full font-semibold hover:bg-blue-700 transition-all duration-300 text-sm whitespace-nowrap"
                            >
                                Sign Up
                            </Link>
                        </>
                    ) : (
                        <div className="group relative cursor-pointer">
                            <div className="w-8 h-8 rounded-full text-white flex justify-center items-center text-base bg-slate-900">
                                {userData && userData.username.toString().toUpperCase()[0]}
                            </div>
                            <ul className="absolute hidden group-hover:flex flex-col items-center text-base bg-zinc-200 top-full w-32 rounded-lg text-black right-0">
                                <li
                                    onClick={logOut}
                                    className="w-full py-2 px-2 hover:bg-zinc-400 rounded-md text-center"
                                >
                                    Logout
                                </li>
                            </ul>
                        </div>
                    )}

                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="cursor-pointer text-gray-700 focus:outline-none"
                    >
                        {isMenuOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        )}
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                {isMenuOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                        onClick={() => setIsMenuOpen(false)}
                    ></div>
                )}

                {/* Mobile Menu */}
                <div className={`md:hidden fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="flex justify-between items-center p-6 border-b">
                        <span className="text-xl font-bold text-blue-600">Menu</span>
                        <button
                            onClick={() => setIsMenuOpen(false)}
                            className="cursor-pointer text-gray-700 focus:outline-none"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        <button
                            className="cursor-pointer font-medium hover:text-blue-600 transition-colors duration-300 text-lg w-full text-left py-3 border-b"
                            onClick={() => { handleScrollToSection("features") }}
                        >
                            Features
                        </button>
                        <button
                            className="cursor-pointer font-medium hover:text-blue-600 transition-colors duration-300 text-lg w-full text-left py-3 border-b"
                            onClick={() => { handleScrollToSection("about") }}
                        >
                            About
                        </button>

                        {!isLoggedIn && (
                            <Link
                                to="/login"
                                onClick={() => setIsMenuOpen(false)}
                                className="block border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300 text-center"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;