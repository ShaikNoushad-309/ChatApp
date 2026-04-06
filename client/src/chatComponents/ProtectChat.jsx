import React, {useEffect, useState} from 'react';
import useStore from "../store/AppStore.js";
import {useNavigate} from "react-router-dom";
import useUserActions from "../store/useUserActions.js";

const ProtectChat = ({children}) => {

    // let isLoggedIn;
    // setTimeout(()=>{
    //     isLoggedIn = useStore((state) => state.isLoggedIn);
    // },1000);


    const [isChecking, setIsChecking] = useState(false);
    const {getAuthState} =useUserActions();

   const isLoggedIn = useStore((state) => state.isLoggedIn);
   const userData = useStore((state)=> state.userData);
   const updateActiveChat = useStore((state)=> state.updateActiveChat);
   const userContacts = useStore((state)=> state.userContacts);
   const activeChat = useStore((state)=> state.activeChat);

    const navigate = useNavigate();

    useEffect(() => {
        console.log("UserData in chatApp Protection comp: ", userData);
        console.log("isLoggedIn in chatApp Protection comp: ", isLoggedIn);

       const verifyAuth = async ()=>{
           // setIsChecking(true);
           try{
               await getAuthState();
           }catch(err){
               console.error("Auth check failed in chat component: ", err);
           }
           // finally {
           //     setIsChecking(false);
           // }
       }

       // Only verify auth if we're not already logged in.
        if(!isLoggedIn) {
            console.log("isLoggedIn is false in chat component, so verifying auth...");
            verifyAuth().then(()=>{
                console.log("Auth check successful in chat component");
            });
        }
        // else{
        //     setIsChecking(false);
        // }

        // if(!isChecking && !isLoggedIn) {
        //     navigate('/login'); //  left here, need to figure out the reason for redirection
        // }

        // if(isLoggedIn || userData.username){
        //     navigate('/chatapp');
        // }

        console.log("In ProtectChat: ");
        updateActiveChat(userContacts?userContacts[0]:{});

        if(!isLoggedIn && !userData.username){
            navigate('/login');
        }

    }, [isLoggedIn,navigate,userData.username,isChecking]);


    // useEffect(() => {
    //         if(!isChecking && !isLoggedIn) {
    //             navigate('/login'); //  left here, need to figure out the reason for redirection
    //         }
    //
    // }, [isChecking, isLoggedIn, navigate]);

   // if(isChecking) {
   //     return <div>Loading...</div>;
   // }

    return isLoggedIn ?  children :null;
};

export default ProtectChat;