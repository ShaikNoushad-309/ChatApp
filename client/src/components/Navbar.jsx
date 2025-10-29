import React from 'react';
import { Link,useLocation,useNavigate} from "react-router-dom";
import useStore from "../store/AppStore.js";
import axios from "axios";
import {toast} from "react-toastify";

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isLoggedIn = useStore((state) => state.isLoggedIn);
    const userData = useStore((state)=> state.userData);
    const backendUrl = useStore((state)=> state.backendUrl);
    const setIsLoggedIn = useStore((state)=> state.setIsLoggedIn);

    const handleScrollToSection = (sectionId) => {
        // If we are not in home page, navigate to home page first
        if (location.pathname !== '/') {
            navigate('/');
            // Wait for navigation to complete
            setTimeout(() => {
                scrollToSection(sectionId);
            }, 100);
        } else {
        // already in hom page,just need to scroll
        scrollToSection(sectionId);
    }
    };

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if(element) {
            element.scrollIntoView({ behavior: 'smooth' ,
            block: 'start'});
        }
    };

    const logOut = async () => {
        const {data} = await axios.post(`${backendUrl}/api/auth/logout`);

        if(data.success) {
            setIsLoggedIn(false);
            toast.success("Logged out successfully");
        }else{
            toast.error(data.message);
        }
    }

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50 px-8 py-6">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center">
                    <span className="text-2xl font-bold text-blue-600 flex items-center gap-2">
                        <img src="https://cdn-icons-png.flaticon.com/128/724/724715.png" alt="chat" className="h-7 w-7"/>
                        ChatApp</span>
                </div>

                <div className="flex items-center space-x-8">
                    <button  className="cursor-pointer font-medium hover:text-blue-600 transition-colors duration-300 relative py-2"
                     onClick={()=>{handleScrollToSection("features")}} >
                        Features
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 hover:w-full"></span>
                    </button>
                    <button onClick={()=>{handleScrollToSection("about")}}
                       className="cursor-pointer font-medium hover:text-blue-600 transition-colors duration-300 relative py-2">
                        About
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 hover:w-full"></span>
                    </button>
                    {!isLoggedIn ? <Link to="/login" className="border-2 border-blue-600 text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300">
                        Login
                    </Link> :
                        // <button className="h-8 w-7 rounded-full text-white bg-blue-700 cursor-pointer">{userData && userData.username.toString().toUpperCase()[0]}</button>
                        <div className="group w-10 rounded-full text-white flex relative cursor-pointer justify-center items-center text-lg h-10 bg-slate-900">{userData.username.toString().toUpperCase()[0]}
                            <ul className="absolute hidden group-hover:flex flex-col  items-center text-xl bg-zinc-200   top-full w-32   rounded-lg  text-black">
                                <li onClick={logOut} className="item3 w-full py-2 px-2 h-[50%] hover:bg-zinc-400 rounded-md">Logout</li>
                            </ul>
                        </div>
                    }

                    <Link to="/login" className={!isLoggedIn ? "bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition-all duration-300"
                      :"hidden" } >
                        Sign Up
                    </Link>
                </div>
            </div>
        </nav>

    );
};

export default Navbar;