import mongoose from "mongoose";
import bcrypt from "bcryptjs";



const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        required: [true, 'Le nom est obligatoire']
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        trim: true,
    },

    email: {
        type     : String,
        trim     : true,
        required : [true, 'L’email est obligatoire'],
        unique   : true, // index unique
        lowercase: true
        
    },
    
    // createdAt, updatedAt => Member since <createdAt>
},
{ timestamps: true });

userSchema.pre('save',function(next){
    if (!this.isModified('password')) {
        return next();
    }
    const salt =  bcrypt.genSaltSync(10);
    const hasedPassword = bcrypt.hashSync(this.password, salt);
    this.password =hasedPassword

    next();
})

const User = mongoose.model("User", userSchema);

export default User;