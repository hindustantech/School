import { Schema, model } from "mongoose";

const Tachem = new Schema({
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
   
})

export default model('T', Tachem) 