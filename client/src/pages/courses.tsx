import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Clock, Trophy } from "lucide-react";

export default function Courses() {
  return (
    <div className="page-section">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Coming Soon Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/20 rounded-full mb-6">
            <BookOpen className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Courses & <span className="text-primary">Announcements</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Expand your skills and stay informed with community courses and important announcements. 
            Learning opportunities coming soon!
          </p>
          
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-6 py-3 rounded-full text-lg font-semibold">
            <Clock className="h-5 w-5" />
            Coming Soon
          </div>
        </div>

        {/* Features Preview */}
        <Card className="bg-card border-border">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-center mb-8">What's Coming</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Skill Development</h3>
                <p className="text-sm text-muted-foreground">
                  Professional courses taught by community experts
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Certifications</h3>
                <p className="text-sm text-muted-foreground">
                  Earn recognized certificates to boost your career
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Community Updates</h3>
                <p className="text-sm text-muted-foreground">
                  Stay informed with important announcements and events
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stay Tuned Section */}
        <div className="text-center mt-12">
          <h3 className="text-2xl font-bold mb-4">Stay Tuned!</h3>
          <p className="text-muted-foreground mb-6">
            We're developing courses and announcement systems to keep our community connected and growing.
          </p>
          <Button size="lg" className="text-lg px-8">
            Notify Me When Ready
          </Button>
        </div>
      </div>
    </div>
  );
}