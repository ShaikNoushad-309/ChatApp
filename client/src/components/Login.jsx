import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import connectImg from '../assets/connect.png';
import { FaArrowLeftLong } from "react-icons/fa6";
import {useForm} from 'react-hook-form';
import axios from "axios";
import useStore from "../store/AppStore.js";
import {toast} from "react-toastify";
import useUserActions from "../store/useUserActions.js";

const LoginPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const backendUrl = useStore(state => state.backendUrl);
    const setIsLoggedIn = useStore(state => state.setIsLoggedIn);
    const {getUserData} = useUserActions();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        // confirmPassword: ''
    });

    const {
        register,
        handleSubmit,
        reset,
       formState: { errors,isSubmitting,isValid }
    } = useForm();

    // const handleChange = (e) => {
    //     setFormData({
    //         ...formData,
    //         [e.target.name]: e.target.value
    //     });
    // };

    const onSubmit = async (data) => {
        console.log('Form submitted:', data);
        const newFormData = {...formData,...data};
        setFormData(newFormData);
        console.log('New Form data submitted:', newFormData);
        if(isLogin){
            console.log('Login');
            const {data} = await axios.post(`${backendUrl}/api/auth/login`,newFormData);
            console.log(data);
            if(data.success){
               await getUserData();
                setIsLoggedIn(true);
                navigate('/');
            }else{
                toast.error(data.message);
            }
        }else{
            try {
                console.log('Signup');
                const {data} = await axios.post(`${backendUrl}/api/auth/register`,newFormData);
                console.log(data);
                if(data.success){
                    await getUserData();
                    setIsLoggedIn(true);
                    navigate('/');
                }
            }catch (err) {
                console.log("Error in signup:",err.message);
            }
        }
        

         reset();
        // Add your authentication logic here
    };

    return (
        <div className="w-screen h-auto lg:h-screen flex flex-col lg:flex-row gap-3 lg:gap-0  bg-gray-50">

            {/* Left Section - Visual */}
            <div className="flex w-full lg:w-1/2 h-1/3 lg:h-full  flex-col justify-center items-center bg-gradient-to-br from-blue-500 to-purple-600 p-8 relative">
                <Link
                    to="/"
                    className="absolute top-3 left-3 lg:top-6 lg:left-5 z-10 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                    <FaArrowLeftLong />
                </Link>
                <div className="text-center text-white mb-8 lg:mb-0">
                    <h1 className="text-4xl lg:text-5xl font-bold mb-4">Welcome to ChatApp</h1>
                    <p className="text-xl lg:text-2xl opacity-90">Connect with friends instantly</p>
                </div>

                <img
                    src={connectImg}
                    alt="People connecting through chat"
                    className="hidden rounded-lg lg:flex w-full max-w-md lg:max-w-2xl object-contain mt-4 lg:mt-8"
                />
            </div>

            {/* Right Section - Form */}
            <div className="w-full lg:w-1/2 h-2/3 lg:h-full flex items-center justify-center bg-white p-4 lg:p-8">
                <div className="w-full max-w-md">
                    {/* Toggle Switch */}
                    <div className="flex justify-center mb-8">
                        <div className="bg-gray-100 rounded-full p-1 flex">
                            <button
                                onClick={() => setIsLogin(true)}
                                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                                    isLogin
                                        ? 'bg-blue-600 text-white shadow-lg'
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                            >
                                Login
                            </button>
                            <button
                                onClick={() => setIsLogin(false)}
                                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                                    !isLogin
                                        ? 'bg-blue-600 text-white shadow-lg'
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate >
                        {!isLogin &&   <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                // value={formData.username}
                                // onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                placeholder="Enter your username"
                                {...register('username',{  required:{value:true,message:'Username is required'},
                                    minLength: { value: 7, message: "Username must be at least 7 characters long"},
                                    maxLength: { value: 20, message: "Username must be at most 20 characters long" }
                                })}
                            />
                            {errors.username && <span className="text-red-700 text-lg">{errors.username.message}</span>}
                        </div>}

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                    placeholder="Enter your email"
                                    {...register('email',{
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, // Removed backticks
                                            message: "Invalid email address"
                                        },
                                        required:{value:true,message:'email is required'},
                                        minLength: { value: 7, message: "email must be at least 7 characters long"},
                                    })}
                                />
                                {errors.email && <span className="text-red-700 text-lg">{errors.email.message}</span>}
                            </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                placeholder="Enter your password"
                                {...register('password',{  required:{value:true,message:'password is required'},
                                    minLength: { value: 10, message: "password must be at least 10 characters long"},
                                    maxLength: { value: 20, message: "password must be at most 20 characters long" }
                                })}
                            />
                            {errors.password && <span className="text-red-700 text-lg">{errors.password.message}</span>}
                        </div>

                        {/*{!isLogin && (*/}
                        {/*    <div>*/}
                        {/*        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">*/}
                        {/*            Confirm Password*/}
                        {/*        </label>*/}
                        {/*        <input*/}
                        {/*            type="password"*/}
                        {/*            id="confirmPassword"*/}
                        {/*            name="confirmPassword"*/}
                        {/*            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"*/}
                        {/*            placeholder="Confirm your password"*/}
                        {/*            {...register('confirmPassword',{  required:{value:true,message:'confirmPassword is required'},*/}
                        {/*                minLength: { value: 10, message: "confirmPassword must be at least 10 characters long"},*/}
                        {/*                maxLength: { value: 20, message: "confirmPassword must be at most 20 characters long" }*/}
                        {/*            })}*/}
                        {/*        />*/}
                        {/*        {errors.confirmPassword && <span className="text-red-700 text-lg">{errors.confirmPassword.message}</span>}*/}
                        {/*    </div>*/}
                        {/*)}*/}

                        {isLogin && (
                            <div className="flex items-center justify-between">
                                <label className="flex items-center">
                                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                                </label>
                                <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
                                    Forgot password?
                                </a>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            {isLogin ? 'Login to Your Account' : 'Create Account'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;