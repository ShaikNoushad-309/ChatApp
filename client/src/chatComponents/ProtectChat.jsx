import React, {useEffect} from 'react';
import useStore from "../store/AppStore.js";
import {useNavigate} from "react-router-dom";

const ProtectChat = ({children}) => {
    const isLoggedIn = useStore((state) => state.isLoggedIn);
    const navigate = useNavigate();

    useEffect(() => {
        if(!isLoggedIn) {
            navigate('/login');
        }
    }, []);


    return (
       children
    );
};

export default ProtectChat;