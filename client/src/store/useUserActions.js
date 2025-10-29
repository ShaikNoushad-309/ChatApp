import axios from "axios";
import {toast} from "react-toastify";
import useStore from "./AppStore.js";

const useUserActions = ()=> {

    const backendUrl = useStore(state => state.backendUrl);
    const setUserData = useStore(state => state.setUserData);
    const setIsLogged = useStore(state => state.setIsLoggedIn);

    axios.defaults.withCredentials = true;

    const getUserData = async () => {
        try {
            // const {data} = await axios.get(`${backendUrl}/api/users/getuser`);
            const {data} = await axios.get(`${backendUrl}/api/users/getuser`);
            console.log("Response from getUserData: ", data);
            const {currentUser} = data;
            console.log("Data from Response from getUserData: ", currentUser);
            data.success ? setUserData(currentUser) : toast.error("Error while fetching user data");
            // return response.userData;
        } catch (err) {
            toast.error("Error while fetching user data: ", err.message);
        }
    }

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

    return {
        getUserData,
        getAuthState,
    }

}

export default useUserActions;