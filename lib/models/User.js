import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        minLength: [4, 'Minimum 4 letters required'],
        max: 8,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
    },
    gender: {
        type: String,
    },
    nationality: {
        type: String,
    },
    photo: {
        type: String,
    },
    skills: {
        type: [String],
    },
});

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET || 'Mandani2216');
    return token;
};

userSchema.methods.passwordVerify = async function (password) {
    const hashedPassword = this;
    const verifyPassword = await bcrypt.compare(password, hashedPassword.password);
    return verifyPassword;
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;

