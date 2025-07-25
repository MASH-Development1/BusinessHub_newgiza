import { Id } from "../../../convex/_generated/dataModel";

// Type definitions for the frontend (matching the old REST API types)
export interface Job {
  id: string;
  title: string;
  company: string;
  posterEmail: string;
  posterRole: string;
  description: string;
  requirements: string | null;
  skills: string | null;
  industry: string | null;
  experienceLevel: string | null;
  jobType: string | null;
  location: string | null;
  salaryRange: string | null;
  contactEmail: string;
  contactPhone: string;
  isActive: boolean;
  isApproved: boolean;
  status: string;
  postedBy: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Internship {
  id: string;
  title: string;
  company: string;
  posterEmail: string;
  posterRole: string;
  description: string;
  requirements: string | null;
  skills: string | null;
  department: string | null;
  duration: string;
  isPaid: boolean;
  stipend: string | null;
  location: string | null;
  positions: number | null;
  contactEmail: string;
  contactPhone: string | null;
  startDate: string | null;
  applicationDeadline: string | null;
  isActive: boolean;
  isApproved: boolean;
  status: string;
  postedBy: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  type: string;
  instructor: string | null;
  duration: string | null;
  price: string | null;
  startDate: string | null;
  endDate: string | null;
  maxAttendees: number | null;
  currentAttendees: number | null;
  location: string | null;
  isOnline: boolean;
  registrationUrl: string | null;
  skills: string | null;
  isActive: boolean;
  isApproved: boolean;
  isFeatured: boolean;
  postedBy: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  id: string;
  userId: number | null;
  name: string;
  title: string;
  company: string | null;
  bio: string | null;
  skills: string | null;
  industry: string | null;
  experienceLevel: string | null;
  contact: string | null;
  phone: string | null;
  linkedinUrl: string | null;
  howCanYouSupport: string | null;
  portfolioUrl: string | null;
  cvFileName: string | null;
  cvFilePath: string | null;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CvShowcase {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  title: string;
  section: string;
  bio: string | null;
  skills: string | null;
  experience: string | null;
  education: string | null;
  yearsOfExperience: string | null;
  cvFileName: string | null;
  cvFilePath: string | null;
  linkedinUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityBenefit {
  id: string;
  title: string;
  description: string;
  discountPercentage: string | null;
  businessName: string;
  location: string | null;
  imageUrl: string | null;
  validUntil: string | null;
  category: string | null;
  isActive: boolean;
  showOnHomepage: boolean;
  createdAt: string;
  updatedAt: string;
  imageUrls: string[] | null;
}

export interface Application {
  id: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  coverLetter: string | null;
  cvFileName: string | null;
  cvFilePath: string | null;
  cvStorageId?: string | null;
  jobId: number | null;
  internshipId: number | null;
  status: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EmailWhitelist {
  id: string;
  email: string;
  name: string | null;
  unit: string | null;
  phone: string | null;
  isActive: boolean;
  addedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AccessRequest {
  id: string;
  fullName: string;
  email: string;
  unitNumber: string;
  mobile: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Type adapter functions to convert Convex types to frontend types
export function adaptJob(convexJob: any): Job {
  return {
    id: convexJob._id,
    title: convexJob.title,
    company: convexJob.company,
    posterEmail: convexJob.poster_email,
    posterRole: convexJob.poster_role,
    description: convexJob.description,
    requirements: convexJob.requirements,
    skills: convexJob.skills,
    industry: convexJob.industry,
    experienceLevel: convexJob.experience_level,
    jobType: convexJob.job_type,
    location: convexJob.location,
    salaryRange: convexJob.salary_range,
    contactEmail: convexJob.contact_email,
    contactPhone: convexJob.contact_phone,
    isActive: convexJob.is_active,
    isApproved: convexJob.is_approved,
    status: convexJob.status,
    postedBy: convexJob.posted_by,
    createdAt: convexJob.created_at,
    updatedAt: convexJob.updated_at,
  };
}

export function adaptInternship(convexInternship: any): Internship {
  return {
    id: convexInternship._id,
    title: convexInternship.title,
    company: convexInternship.company,
    posterEmail: convexInternship.poster_email,
    posterRole: convexInternship.poster_role,
    description: convexInternship.description,
    requirements: convexInternship.requirements,
    skills: convexInternship.skills,
    department: convexInternship.department,
    duration: convexInternship.duration,
    isPaid: convexInternship.is_paid,
    stipend: convexInternship.stipend,
    location: convexInternship.location,
    positions: convexInternship.positions,
    contactEmail: convexInternship.contact_email,
    contactPhone: convexInternship.contact_phone,
    startDate: convexInternship.start_date,
    applicationDeadline: convexInternship.application_deadline,
    isActive: convexInternship.is_active,
    isApproved: convexInternship.is_approved,
    status: convexInternship.status,
    postedBy: convexInternship.posted_by,
    createdAt: convexInternship.created_at,
    updatedAt: convexInternship.updated_at,
  };
}

export function adaptCourse(convexCourse: any): Course {
  return {
    id: convexCourse._id,
    title: convexCourse.title,
    description: convexCourse.description,
    type: convexCourse.type,
    instructor: convexCourse.instructor,
    duration: convexCourse.duration,
    price: convexCourse.price,
    startDate: convexCourse.start_date,
    endDate: convexCourse.end_date,
    maxAttendees: convexCourse.max_attendees,
    currentAttendees: convexCourse.current_attendees,
    location: convexCourse.location,
    isOnline: convexCourse.is_online,
    registrationUrl: convexCourse.registration_url,
    skills: convexCourse.skills,
    isActive: convexCourse.is_active,
    isApproved: convexCourse.is_approved,
    isFeatured: convexCourse.is_featured,
    postedBy: convexCourse.posted_by,
    createdAt: convexCourse.created_at,
    updatedAt: convexCourse.updated_at,
  };
}

export function adaptProfile(convexProfile: any): Profile {
  return {
    id: convexProfile._id,
    userId: convexProfile.user_id,
    name: convexProfile.name,
    title: convexProfile.title,
    company: convexProfile.company,
    bio: convexProfile.bio,
    skills: convexProfile.skills,
    industry: convexProfile.industry,
    experienceLevel: convexProfile.experience_level,
    contact: convexProfile.contact,
    phone: convexProfile.phone,
    linkedinUrl: convexProfile.linkedin_url,
    howCanYouSupport: convexProfile.how_can_you_support,
    portfolioUrl: convexProfile.portfolio_url,
    cvFileName: convexProfile.cv_file_name,
    cvFilePath: convexProfile.cv_file_path,
    isVisible: convexProfile.is_visible,
    createdAt: convexProfile.created_at,
    updatedAt: convexProfile.updated_at,
  };
}

export function adaptCvShowcase(convexCv: any): CvShowcase {
  return {
    id: convexCv._id,
    name: convexCv.name,
    email: convexCv.email,
    phone: convexCv.phone,
    title: convexCv.title,
    section: convexCv.section,
    bio: convexCv.bio,
    skills: convexCv.skills,
    experience: convexCv.experience,
    education: convexCv.education,
    yearsOfExperience: convexCv.years_of_experience,
    cvFileName: convexCv.cv_file_name,
    cvFilePath: convexCv.cv_file_path,
    linkedinUrl: convexCv.linkedin_url,
    createdAt: convexCv.created_at,
    updatedAt: convexCv.updated_at,
  };
}

export function adaptCommunityBenefit(convexBenefit: any): CommunityBenefit {
  return {
    id: convexBenefit._id,
    title: convexBenefit.title,
    description: convexBenefit.description,
    discountPercentage: convexBenefit.discount_percentage,
    businessName: convexBenefit.business_name,
    location: convexBenefit.location,
    imageUrl: convexBenefit.image_url,
    validUntil: convexBenefit.valid_until,
    category: convexBenefit.category,
    isActive: convexBenefit.is_active,
    showOnHomepage: convexBenefit.show_on_homepage,
    createdAt: convexBenefit.created_at,
    updatedAt: convexBenefit.updated_at,
    imageUrls: convexBenefit.image_urls,
  };
}

export function adaptApplication(convexApplication: any): Application {
  return {
    id: convexApplication._id,
    applicantName: convexApplication.applicant_name,
    applicantEmail: convexApplication.applicant_email,
    applicantPhone: convexApplication.applicant_phone,
    coverLetter: convexApplication.cover_letter,
    cvFileName: convexApplication.cv_file_name,
    cvFilePath: convexApplication.cv_file_path,
    cvStorageId: convexApplication.cv_storage_id,
    jobId: convexApplication.job_id,
    internshipId: convexApplication.internship_id,
    status: convexApplication.status,
    notes: convexApplication.notes,
    createdAt: convexApplication.created_at,
    updatedAt: convexApplication.updated_at,
  };
}

export function adaptUser(convexUser: any): User {
  return {
    id: convexUser._id,
    email: convexUser.email,
    name: convexUser.name,
    role: convexUser.role,
    lastLoginAt: convexUser.last_login_at,
    createdAt: convexUser.created_at,
    updatedAt: convexUser.updated_at,
  };
}

export function adaptEmailWhitelist(convexWhitelist: any): EmailWhitelist {
  return {
    id: convexWhitelist._id,
    email: convexWhitelist.email,
    name: convexWhitelist.name,
    unit: convexWhitelist.unit,
    phone: convexWhitelist.phone,
    isActive: convexWhitelist.is_active,
    addedBy: convexWhitelist.added_by,
    createdAt: convexWhitelist.created_at,
    updatedAt: convexWhitelist.updated_at,
  };
}

export function adaptAccessRequest(convexRequest: any): AccessRequest {
  return {
    id: convexRequest._id,
    fullName: convexRequest.full_name,
    email: convexRequest.email,
    unitNumber: convexRequest.unit_number,
    mobile: convexRequest.mobile,
    status: convexRequest.status,
    createdAt: convexRequest.created_at,
    updatedAt: convexRequest.updated_at,
  };
}

// Helper function to convert Convex ID to number
export function convexIdToNumber(convexId: Id<any>): number {
  return parseInt(convexId);
}

// Helper function to convert number to Convex ID (for mutations)
export function numberToConvexId(id: number): Id<any> {
  return id.toString() as Id<any>;
}
