import { query } from "./_generated/server";

// Query to get application statistics
export const getStats = query({
  handler: async (ctx) => {
    const jobs = await ctx.db.query("jobs").collect();
    const internships = await ctx.db.query("internships").collect();
    const courses = await ctx.db.query("courses").collect();
    const applications = await ctx.db.query("applications").collect();
    const profiles = await ctx.db.query("profiles").collect();
    const cvShowcase = await ctx.db.query("cv_showcase").collect();
    const communityBenefits = await ctx.db.query("community_benefits").collect();

    return {
      totalJobs: jobs.length,
      activeJobs: jobs.filter(job => job.is_active).length,
      totalInternships: internships.length,
      activeInternships: internships.filter(internship => internship.is_active).length,
      totalCourses: courses.length,
      activeCourses: courses.filter(course => course.is_active).length,
      totalApplications: applications.length,
      pendingApplications: applications.filter(app => app.status === "pending").length,
      approvedApplications: applications.filter(app => app.status === "approved").length,
      totalProfiles: profiles.length,
      visibleProfiles: profiles.filter(profile => profile.is_visible).length,
      totalCvShowcase: cvShowcase.length,
      totalCommunityBenefits: communityBenefits.length,
      activeCommunityBenefits: communityBenefits.filter(benefit => benefit.is_active).length,
    };
  },
}); 