import mongoose from 'mongoose';

// Define the Job schema
const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    requirements: { 
        type: [mongoose.Schema.Types.Mixed], // This allows both strings and numbers
        required: true,
        validate: {
            validator: function(value) {
                return value.every(req => typeof req === 'string' || typeof req === 'number');
            },
            message: 'Requirements must be an array of strings or numbers.'
        }
    },
    salary: { 
        type: mongoose.Schema.Types.Mixed, // This allows both strings and numbers
        required: true,
        validate: {
            validator: function(value) {
                return !isNaN(value) || typeof value === 'string'; // Salary can be a number or a string
            },
            message: 'Salary must be a number or a valid string.'
        }
    },
    location: { type: String, required: true },
    jobType: { type: String, required: true },
    experienceLevel: { 
        type: mongoose.Schema.Types.Mixed, // This allows both strings and numbers
        required: true,
        validate: {
            validator: function(value) {
                return !isNaN(value) || typeof value === 'string'; // Experience level can be a number or a string
            },
            message: 'Experience level must be a number or a valid string.'
        }
    },
    position: { type: String, required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

// Create the model and export it
const Job = mongoose.model('Job', jobSchema);

export { Job };
