export interface Job {
    id: string;
    title: string;
    description: string;
    mini_description: string;
    post_date: Date;
    img_url: string;
    apply_link: string;
    role: string;
    department: string;
    remote: string;
    company_name: string;
    location: string;
    job_type: string;
    salary: number;
    experience: string;
    qualification: string;
    skills_required: string[];
    benefits: string[];
    responsibilities: string[];
    requirements: string[];
    deadline: Date;
    views?: number; // Number of times the job has been viewed
    last_viewed?: Date; // Last time the job was viewed
}
