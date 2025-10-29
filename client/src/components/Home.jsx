// components/Home.jsx
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import About from './About';
// import Features from './Features.jsx';
import Navbar from './Navbar.jsx';
import Hero from './Hero.jsx';
import Demo from './Demo.jsx';
import Features from "./Features.jsx";
import Footer from "./Footer.jsx";

const Home = () => {
    const location = useLocation();

    useEffect(() => {
        // Handle direct URL with hash (e.g., /#about)
        if (location.hash) {
            const sectionId = location.hash.replace('#', '');
            setTimeout(() => {
                scrollToSection(sectionId);
            }, 500); // Longer delay to ensure page is loaded
        }
    }, [location]);

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    return (
        <div className="home">
            <Navbar/>
            <Hero/>
            <Demo/>
            <Features/>
            <Footer/>
        </div>
    );
};

export default Home;