import { Schema, model } from "mongoose";

const TeacherSachem = new Schema({
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
    }
    ,
    refreshToken: {
        type: String
    }
})

export default model('Teacher', TeacherSachem) 