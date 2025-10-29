// import mongoose from 'mongoose';
//
// const userSchema = new mongoose.Schema({
//   userCredentials:{
//     username: {type: String, required: true},
//     password: {type:String,required: true},
//     email: {type: String, required: true,unique: true}
//   },
//   contactsObject:{
//     contacts: [String],
//     receivedContactRequests: [String],
//     sentContactRequests : [String]
//   },
//   // avatar: String,
//   // friends: [String],
//   messages: [String],
// });
//
// const UserModel = mongoose.model('user', userSchema);
//
// export default UserModel;

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    password: {type:String,required: true},
    email: {type: String, required: true,unique: true},
  // avatar: String,
  // friends: [String],
  // messages: [String],
});

const UserModel = mongoose.model('user', userSchema);

export default UserModel;