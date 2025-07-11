import { Button } from "@/components/ui/button";
import { useStats } from "@/lib/convexApi";
import { Link } from "wouter";
import HubWithinLogo from "@/components/nghb-logo";
import CommunityBenefitsSection from "@/components/community-benefits-new";
import { Briefcase, GraduationCap, Users, BookOpen, TrendingUp, Star, FileText } from "lucide-react";

export default function Home() {
  const { data: stats = {} } = useStats();

  const features = [
    {
      icon: Briefcase,
      title: "Career Opportunities",
      description: "Discover exclusive job openings within the NewGiza community and beyond.",
      href: "/careers",
    },
    {
      icon: GraduationCap,
      title: "Internship Programs", 
      description: "Launch your career with meaningful internship opportunities tailored for students.",
      href: "/internships",
    },
    {
      icon: BookOpen,
      title: "Learning & Development",
      description: "Stay updated with courses, webinars, and professional development workshops.",
      href: "/courses",
    },
    {
      icon: Users,
      title: "Expert Directory",
      description: "Connect with professionals and find expertise across various industries.",
      href: "/directory",
    },
  ];

  return (
    <div className="page-section">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-nghb-dark via-nghb-surface to-nghb-dark opacity-90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            {/* Large NGHB Logo */}
            <div className="flex justify-center mb-8">
              <HubWithinLogo size="large" />
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Hub <span className="text-primary">Within</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto">
              Where Growth Begins, From Within.
            </p>
            <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
              Connect, collaborate, and grow with your NewGiza community. Discover career opportunities, 
              share expertise, and build meaningful professional relationships.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Empowering Professional Growth</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to advance your career and connect with like-minded professionals in NewGiza.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Link key={index} href={feature.href}>
                <div className="job-card group cursor-pointer">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-muted py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <Link href="/careers">
              <div className="cursor-pointer hover:bg-primary/10 rounded-lg p-4 transition-colors">
                <div className="text-4xl font-bold text-primary mb-2">
                  {stats?.totalJobs || 0}
                </div>
                <div className="text-muted-foreground">Job Opportunities</div>
              </div>
            </Link>
            <Link href="/internships">
              <div className="cursor-pointer hover:bg-primary/10 rounded-lg p-4 transition-colors">
                <div className="text-4xl font-bold text-primary mb-2">
                  {stats?.totalInternships || 0}
                </div>
                <div className="text-muted-foreground">Internships</div>
              </div>
            </Link>
            <Link href="/courses">
              <div className="cursor-pointer hover:bg-primary/10 rounded-lg p-4 transition-colors">
                <div className="text-4xl font-bold text-primary mb-2">
                  {stats?.totalCourses || 0}
                </div>
                <div className="text-muted-foreground">Learning Resources</div>
              </div>
            </Link>
            <Link href="/cv-showcase">
              <div className="cursor-pointer hover:bg-primary/10 rounded-lg p-4 transition-colors">
                <div className="text-4xl font-bold text-primary mb-2">
                  {stats?.totalCvs || 0}
                </div>
                <div className="text-muted-foreground">CV Showcase</div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Community Benefits Section */}
      <CommunityBenefitsSection showHomepageOnly={true} />

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 rounded-xl p-8">
            <h3 className="text-3xl font-bold mb-4">Ready to Begin Your Journey?</h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join the NewGiza Business Hub community today and unlock opportunities for professional growth, 
              meaningful connections, and career advancement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/directory">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  <Star className="mr-2 h-5 w-5" />
                  Join Professional Community
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}