import React, {useEffect} from 'react';
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import Home from './components/Home.jsx';
import Login from './components/Login.jsx';
import ChatApp from './chatComponents/ChatApp.jsx';
import useUserActions from "./store/useUserActions.js";

const App = () => {
    const {getAuthState} =useUserActions();

    useEffect( ()  => {
        getAuthState();
    }, []);

    return (
       <Router>
           <Routes>
               <Route path="/" element={<Home/>} />
               <Route path="/login" element={<Login/>}/>
               {/*<Route path="/chatapp" element={*/}
               {/*    <ProtectChat>*/}
               {/*        <ChatApp/>*/}
               {/*    </ProtectChat>*/}
               {/*} />*/}

               <Route path="/chatapp" element={<ChatApp/>} />
           </Routes>
       </Router>
    );
};

export default App;