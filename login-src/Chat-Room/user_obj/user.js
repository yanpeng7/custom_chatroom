
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// Create the User Schema
const UserSchema = new Schema({
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    }
});

//module.exports = User = mongoose.model('users', UserSchema);
export default mongoose.model('users', UserSchema);
//module.exports = User = mongoose.model('user', UserSchema)