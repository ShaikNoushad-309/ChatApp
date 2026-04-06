// // components/ContactList.jsx
// import React from 'react';
//
// const ContactList = ({ contacts, activeChat, onContactClick, onSearch }) => {
//     return (
//         <div className="w-full md:w-1/3 bg-white border-r border-gray-200 flex flex-col h-full">
//             {/* Search Bar */}
//             <div className="p-4 border-b border-gray-200">
//                 <div className="relative">
//                     <input
//                         type="text"
//                         placeholder="Search or start new chat"
//                         className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
//                         onChange={(e) => onSearch(e.target.value)}
//                     />
//                     <div className="absolute left-3 top-2.5 text-gray-500">
//                         🔍
//                     </div>
//                 </div>
//             </div>
//             <div className="p-4 border-b border-gray-200 flex justify-evenly">
//                 <button className="cursor-pointer bg-green-200 py-1 px-2 rounded-sm">add contact</button>
//                 <button className="cursor-pointer bg-green-200 py-1 px-2 rounded-sm">received request</button>
//                 <button className="cursor-pointer bg-green-200 py-1 px-2 rounded-sm">sent requests</button>
//             </div>
//
//             {/* Contacts List */}
//             <div className="flex-1 overflow-y-auto">
//                 {contacts.map((contact) => (
//                     // console.log("Contact in Contact List: ", contact.recipient)
//                     <div
//                         key={contact._id}
//                         className={`flex items-center p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
//                             activeChat?.recipient === contact.recipient ? 'bg-green-50' : ''
//                         }`}
//                         onClick={() => onContactClick(contact)}
//                     >
//                         {/* Avatar */}
//                         <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold mr-3 flex-shrink-0">
//                             {contact.name.charAt(0).toUpperCase() || ''}
//                         </div>
//
//                         {/* Contact Info */}
//                         <div className="flex-1 min-w-0">
//                             <div className="flex justify-between items-center mb-1">
//                                 <h3 className="font-semibold text-gray-800 truncate">
//                                     {contact.name}
//                                 </h3>
//                                 <span className="text-sm text-gray-500 whitespace-nowrap">
//                   {new Date(contact.time).getHours() + ":" + new Date(contact.time).getMinutes()}
//                 </span>
//                             </div>
//                             <p className="text-sm text-gray-600 truncate">
//                                 {contact.lastMessage}
//                             </p>
//                         </div>
//
//                         {/* Unread Badge */}
//                         {/*{contact.unread > 0 && (*/}
//                         {/*    <div className="ml-2 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">*/}
//                         {/*        {contact.unread}*/}
//                         {/*    </div>*/}
//                         {/*)}*/}
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };
//
// export default ContactList;



// components/ContactList.jsx
import React,{useState} from 'react';
import {useForm} from "react-hook-form";
import useStore from "../store/AppStore.js";
import axios from "axios";
import {Bounce, toast, ToastContainer} from "react-toastify";
import { MdDelete } from "react-icons/md";

const ContactList = ({ contacts, activeChat, onContactClick, onSearch }) => {

    const [isAddContactOpen, setIsAddContactOpen] = useState(false);
    const [newContactUsername, setNewContactUsername] = useState('');
    const [newContactEmail, setNewContactEmail] = useState('');
    const [addContactStatus, setAddContactStatus] = useState(null); // { type: 'success'|'error'|'info', message: string }
    const backendUrl = useStore(state => state.backendUrl);
    const userContacts = useStore(state => state.userContacts);
    const updateUserContacts = useStore(state => state.updateUserContacts);  // left here !!!!!!!!!!
    const userData = useStore((state)=> state.userData);

    const getUserContacts = async () => {
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

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors,isSubmitting,isValid }
    } = useForm();


    // function to add a new contact
    const onSubmit = async (form) => {
        console.log("Form submitting: ",form);
        const {contactName,contactMail} = form;

        // const newFormData = {...contactForm,username:contactName,email:contactMail};
        // setContactForm(newFormData);

        const newFormData = {username:contactName,email:contactMail};

        console.log('New Form data submitted:', newFormData);

        const {data} = await axios.post(`${backendUrl}/api/contacts/addcontact `,newFormData);
        console.log("Response from server: ",data);
        if(!data.success){
            // toast.error(data.message);
                setAddContactStatus({ type: 'error', message: data.message });
            setTimeout(() => setAddContactStatus(null), 2000);
        }else{
            // toast.success(data.message);
            setAddContactStatus({ type: 'success', message: data.message });
            setTimeout(() => setAddContactStatus(null), 2000);
            // getting user contacts
            await getUserContacts();

            // try{
            //     const {data} = await axios.get(`${backendUrl}/api/contacts/`);
            //     const {contacts} = data;
            //     console.log("Response from getContacts: ");
            //     console.table(contacts);
            //     updateUserContacts(contacts);
            //     // console.log("User contact1: ", contacts[0].name.charAt(0).toUpperCase());
            // }catch (err){
            //     toast.error("Error while fetching user contacts: ", err.message);
            // }
        }
        reset();
    }

    const deleteContact = async (ownerId,recipientId,eve) => {
        eve.stopPropagation();
        console.log("Owner of this contact:",ownerId);
        console.log("Contact Id to be deleted: ",recipientId);
        console.log(eve.target.tagName);


        // ==========  left here !!!!!!!!!!!! ===========
        const {data} = await axios.delete(`${backendUrl}/api/contacts/del_contact/${ownerId}/${recipientId}`);
        if(!data.success){
            toast.error(data.message);
            return;
        }

        await getUserContacts();
        toast.info("Contact Deleted Successfully");
        console.log("Contact Deleted Successfully");
    }

    return (
        <div className="w-full md:w-1/3 bg-white border-r border-gray-200 flex flex-col h-full">

            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />

            {/* Search Bar */}
            {/*<div className="p-4 border-b border-gray-200">*/}
            {/*    <div className="relative">*/}
            {/*        <input*/}
            {/*            type="text"*/}
            {/*            placeholder="Search or start new chat"*/}
            {/*            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"*/}
            {/*            onChange={(e) => onSearch(e.target.value)}*/}
            {/*        />*/}
            {/*        <div className="absolute left-3 top-2.5 text-gray-500">*/}
            {/*            🔍*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/* Add Contact Section */}
            <div className="border-b border-gray-200">
                <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setIsAddContactOpen(!isAddContactOpen)}>
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800">Add New Contact</h3>
                            <p className="text-sm text-gray-500">Connect with friends and colleagues</p>
                        </div>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-gray-500 transition-transform ${isAddContactOpen ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </div>

                {/* Add Contact Form (Collapsible) */}
                {isAddContactOpen && (
                    <div className="px-4 pb-4 pt-2 border-t border-gray-100 bg-gray-50">
                        {/* Guidance Note */}
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 mr-2 text-blue-500 mt-0.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <p className="text-sm text-blue-700">
                                    <span className="font-medium">Note:</span> Please enter the username and email of a <span className="font-medium">registered user</span>. You can only connect with people who already have an account.
                                </p>
                            </div>
                        </div>

                        <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Enter their username"
                                    // value={newContactUsername}
                                    // onChange={(e) => setNewContactUsername(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                                    {...register('contactName',{  required:{value:true,message:'Contact name is required'},
                                        minLength: { value: 3, message: "Contact name must be at least 3 characters long"},
                                        maxLength: { value: 30, message: "Contact name must be at most 30 characters long" }
                                    })}
                                />
                                {errors.contactName && <span className="text-red-700 text-sm">{errors.contactName.message}</span>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter their registered email"
                                    // value={newContactEmail}
                                    // onChange={(e) => setNewContactEmail(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                                    {...register('contactMail',{
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, // Removed backticks
                                            message: "Invalid email address"
                                        },
                                        required:{value:true,message:'email is required'},
                                        minLength: { value: 7, message: "email must be at least 7 characters long"},
                                    })}
                                />
                                {errors.contactMail && <span className="text-red-700 text-sm">{errors.contactMail.message}</span>}
                                <p className="text-xs text-gray-500 mt-1">Must match their registered account email</p>
                            </div>
                            <div className="flex space-x-2 pt-2">
                                <button
                                    onClick={() => setIsAddContactOpen(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                                >
                                    Cancel
                                </button>
                                <button type="submit"
                                    // onClick={handleAddContact}
                                    // disabled={!contactForm.username.trim() || !contactForm.email.trim()}
                                    className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors
                                         bg-green-500 text-white hover:bg-green-600
                                    `}
                                >
                                    Send Request
                                </button>
                            </div>
                        </form>

                        {/* Validation/Success Messages */}
                        {addContactStatus && (
                            <div className={`mt-3 p-3 rounded-lg text-sm ${
                                addContactStatus.type === 'success'
                                    ? 'bg-green-100 text-green-800 border border-green-200'
                                    : addContactStatus.type === 'error'
                                        ? 'bg-red-100 text-red-800 border border-red-200'
                                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                            }`}>
                                {addContactStatus.type === "success" ? `✅ ${addContactStatus.message}`: `❌ ${addContactStatus.message}`}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Contacts List */}
            <div className="flex-1 overflow-y-auto">
                {contacts.map((contact) => (
                    <div
                        key={contact._id}
                        className={`flex items-center p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                            activeChat?.recipient === contact.recipient ? 'bg-green-50' : ''
                        }`}
                        onClick={() => onContactClick(contact)}
                    >
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold mr-3 flex-shrink-0">
                            {contact.name.charAt(0).toUpperCase() || ''}
                        </div>

                        {/* Contact Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-1">
                                <h3 className="font-semibold text-gray-800 truncate">
                                    {contact.name}
                                </h3>
            {/*                    <span className="text-sm text-gray-500 whitespace-nowrap">*/}
            {/*  {new Date(contact.time).getHours() + ":" + new Date(contact.time).getMinutes()}*/}
            {/*</span>*/}
                                <span className="text-sm text-gray-500 whitespace-nowrap" onClick={(eve)=>(deleteContact(contact.owner,contact.recipient,eve))}>
                                    <MdDelete className="h-6  w-6 cursor-pointer text-green-600" title="Delete Contact"  />
                                </span>

                            </div>
                            <p className="text-sm text-gray-600 truncate">
                                {/*/!*{contact.lastMessage}*!/ last*/}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ContactList;