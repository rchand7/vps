import { Job } from "../models/job.model.js";

// Admin post job
export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
        const userId = req.id;

        // Check for missing fields
        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(400).json({
                message: "All fields are required.",
                success: false
            });
        }

        // Validate salary and experience
        if (isNaN(salary) || isNaN(experience)) {
            return res.status(400).json({
                message: "Salary and experience must be valid numbers.",
                success: false
            });
        }

        // Validate that the company exists (assuming companyId is a valid reference)
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(400).json({
                message: "Company not found.",
                success: false
            });
        }

        // Create new job document
        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(",").map(req => req.trim()), // Split and trim requirements
            salary,
            location,
            jobType,
            experienceLevel: experience,
            position,
            company: companyId,
            created_by: userId
        });

        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Something went wrong.",
            success: false
        });
    }
}

// Student: Get all jobs with pagination
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        };

        const jobs = await Job.find(query)
            .populate("company")
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        if (!jobs.length) {
            return res.status(404).json({
                message: "No jobs found.",
                success: false
            });
        }

        return res.status(200).json({
            jobs,
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Something went wrong.",
            success: false
        });
    }
}

// Student: Get job by ID
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate("applications");

        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        return res.status(200).json({
            job,
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Something went wrong.",
            success: false
        });
    }
}

// Admin: Get jobs created by admin
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId })
            .populate({
                path: 'company',
                options: { sort: { createdAt: -1 } }  // Sorting by createdAt in descending order
            });

        if (!jobs.length) {
            return res.status(404).json({
                message: "No jobs found for this admin.",
                success: false
            });
        }

        return res.status(200).json({
            jobs,
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Something went wrong.",
            success: false
        });
    }
}
