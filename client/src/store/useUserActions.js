import axios from "axios";
import {toast} from "react-toastify";
import useStore from "./AppStore.js";

const useUserActions = ()=> {

    const backendUrl = useStore(state => state.backendUrl);
    const setUserData = useStore(state => state.setUserData);
    const setIsLogged = useStore(state => state.setIsLoggedIn);
    const userContacts = useStore(state => state.userContacts);
    const updateUserContacts = useStore(state => state.updateUserContacts);
    const updateMsgHistory = useStore(state => state.updateMsgHistory);

    axios.defaults.withCredentials = true;

    const getUserData = async () => {
        // getting user data
        try {
            // const {data} = await axios.get(`${backendUrl}/api/users/getuser`);
            const {data} = await axios.get(`${backendUrl}/api/users/getuser`);
            // console.log("Response from getUserData: ", data);
            const {currentUser} = data;
            console.log("Current User from getUserData response: ", currentUser);
            data.success ? setUserData(currentUser) : toast.error("Error while fetching user data");
            // return response.userData;
        } catch (err) {
            toast.error("Error while fetching user auth data: ", err.message);
        }

        // getting user contacts
        try{
            const {data} = await axios.get(`${backendUrl}/api/contacts/`);
            const {contacts} = data;
            console.log("Response from getContacts: ");
            console.table(contacts);
            updateUserContacts(contacts);
            // console.log("User contact1: ", contacts[0].name.charAt(0).toUpperCase());
        }catch (err){
            toast.error("Error while fetching user contacts: ", err.message);
        }
    }

    // const getUserData = async () => {
    //     // getting user data
    //     try {
    //
    //         // Parallel requests for better performance
    //         const [userResponse, contactsResponse] = Promise.all([
    //             axios.get(`${backendUrl}/api/users/getuser`),
    //             axios.get(`${backendUrl}/api/contacts/`)
    //         ]);
    //
    //         if (userResponse.data.success) {
    //             setUserData(userResponse.data.currentUser);
    //         } else {
    //             toast.error("Error while fetching user data");
    //             return false;
    //         }
    //
    //         if (contactsResponse.data.success) {
    //             updateUserContacts(contactsResponse.data.contacts);
    //         } else {
    //             toast.error("Error while fetching user contacts");
    //             return false;
    //         }
    //     }catch (err){
    //         toast.error("Error while fetching user data: ", err.message);
    //         return false;
    //     } // Stopped here!
    // }

    const getAuthState = async () => {
        try {
            const {data} = await axios.get(`${backendUrl}/api/auth/is-auth`);
            console.log("Response from is-auth route from backend: ", data);
            if (data.success) {
                setIsLogged(true);
                await getUserData();
            }
            // return response.userData;
        } catch (err) {
            toast.error("Error while fetching user authentication data: ", err.message);
        }
    }

    const getUserMessages = async (contact) => {

        console.log("Contact in getUserMessages: ", contact);
        console.log("Recipient in getUserMessages: ", contact?.recipient);
        try{
            const {data} = await axios.get(`${backendUrl}/api/messages/${contact.recipient}`);

            if(!data.success){
                updateMsgHistory([]);
                console.log("Messages from backend: ", []);
                return;
            }
            const {messages} = await data;
             // if(!messages){
             //     updateMsgHistory([]);
             //     console.log("Messages from backend: ", messages);
             //     return;
             // }

            updateMsgHistory(messages);

            console.log("Messages from backend: ");
            console.table(messages);
        }catch (err){
            console.error("Error while fetching messages from backend: ", err);
        }
    }

    return {
        getUserData,
        getAuthState,
        getUserMessages,
    }

}

export default useUserActions;