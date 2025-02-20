import { Schema, model } from 'mongoose';

const studentSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    teacherId: {
        type: Schema.Types.ObjectId,
        ref: 'Teacher' // Reference to the Teacher model
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    rollno: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
}, {
    timestamps: true,
});

export default model('Student', studentSchema); // Named 'Student' to match import