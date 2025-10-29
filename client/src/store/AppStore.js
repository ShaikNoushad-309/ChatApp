import {create} from "zustand";

const useStore = create((set) => ({
        backendUrl: "http://localhost:3002",
        isLoggedIn: false,
        userData: {
            username: "",
            email: "",
            password: "",
        },
        setIsLoggedIn: (bool) => {
            set(() => ({
                isLoggedIn: bool,
            }))
        },
        setUserData: (currUser) => {
            set((state) => ({
                userData: currUser ? currUser : state.userData,
            }))
        },
        // increasePopulation: () => set((state) => ({
        //     bears: state.bears + 1
        // })),

    }));

export default useStore;