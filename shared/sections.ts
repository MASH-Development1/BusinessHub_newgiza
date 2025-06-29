// Professional sections configuration used across the platform
// This ensures consistency between CV upload, CV showcase, directory, and other features

export const PROFESSIONAL_SECTIONS = [
  { name: "Technology/IT", label: "Technology", description: "IT & Software" },
  { name: "Marketing", label: "Marketing", description: "Brand & Digital" },
  { name: "Finance", label: "Finance", description: "Accounting & Analysis" },
  { name: "HR", label: "HR", description: "Human Resources" },
  { name: "Sales", label: "Sales", description: "Business Development" },
  { name: "Procurement", label: "Procurement", description: "Supply Chain" },
  { name: "Engineering", label: "Engineering", description: "Technical Design" },
  { name: "Real Estate", label: "Real Estate", description: "Property & Development" },
  { name: "Healthcare", label: "Healthcare", description: "Medical & Wellness" },
  { name: "Education", label: "Education", description: "Teaching & Training" },
  { name: "Legal", label: "Legal", description: "Law & Compliance" },
  { name: "Operations", label: "Operations", description: "Management & Process" },
  { name: "Consulting", label: "Consulting", description: "Advisory Services" },
  { name: "Architecture", label: "Architecture", description: "Design & Planning" },
  { name: "Media & Design", label: "Media & Design", description: "Creative & Content" },
];

// For CV showcase filters (includes "All" option)
export const CV_SHOWCASE_SECTIONS = [
  { name: "All", value: "", description: "View all professionals" },
  ...PROFESSIONAL_SECTIONS.map(section => ({
    name: section.label,
    value: section.name,
    description: section.description
  }))
];