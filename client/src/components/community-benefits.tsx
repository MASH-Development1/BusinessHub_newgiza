import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Gift, Percent, ShoppingBag, Coffee, Utensils, Car, Heart, Star, MapPin, Clock, Expand } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface CommunityBenefit {
  id: number;
  title: string;
  description: string;
  discountPercentage?: string;
  businessName: string;
  location?: string;
  imageUrl?: string;
  imageUrls?: string[];
  validUntil?: string;
  category?: string;
  isActive: boolean;
  showOnHomepage: boolean;
}

export default function CommunityBenefitsSection() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  
  const { data: benefits = [], isLoading } = useQuery({
    queryKey: ["/api/community-benefits"],
  });

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsImageModalOpen(true);
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-orange-500 mb-4">
              Loading Community Benefits...
            </h2>
          </div>
        </div>
      </section>
    );
  }

  if (benefits.length === 0) {
    return (
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-orange-500 mb-4">
              Community Benefits
            </h2>
            <p className="text-xl text-white max-w-3xl mx-auto">
              No community benefits are currently available. Check back soon for exclusive offers!
            </p>
          </div>
        </div>
      </section>
    );
  }

  const getCategoryIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'dining': return <Utensils className="h-8 w-8" />;
      case 'beverages': return <Coffee className="h-8 w-8" />;
      case 'shopping': return <ShoppingBag className="h-8 w-8" />;
      case 'automotive': return <Car className="h-8 w-8" />;
      case 'healthcare': return <Heart className="h-8 w-8" />;
      case 'fitness': return <Gift className="h-8 w-8" />;
      default: return <Star className="h-8 w-8" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'dining': return "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300";
      case 'beverages': return "bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300";
      case 'shopping': return "bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-300";
      case 'automotive': return "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300";
      case 'healthcare': return "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300";
      case 'fitness': return "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300";
      default: return "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300";
    }
  };

  const mockBenefits = [
    {
      icon: <Utensils className="h-8 w-8" />,
      title: "Cilantro - 25% Off",
      description: "Enjoy 25% discount on all menu items at Cilantro NewGiza branch",
      validUntil: "Valid until March 2025",
      category: "Dining",
      location: "NewGiza Mall, Ground Floor",
      imageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop",
      color: "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300"
    },
    {
      icon: <Coffee className="h-8 w-8" />,
      title: "Costa Coffee - Buy 2 Get 1 Free",
      description: "Get one free drink when you buy two at Costa Coffee NewGiza",
      validUntil: "Daily offer for residents",
      category: "Beverages",
      location: "NewGiza Mall & Community Center",
      imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop",
      color: "bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300"
    },
    {
      icon: <ShoppingBag className="h-8 w-8" />,
      title: "NewGiza Mall - 15% Off",
      description: "Special resident discount at all participating stores",
      validUntil: "Weekends & holidays",
      category: "Shopping",
      location: "NewGiza Mall - All Floors",
      imageUrl: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=300&fit=crop",
      color: "bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-300"
    },
    {
      icon: <Car className="h-8 w-8" />,
      title: "Auto Care Center - Free Wash",
      description: "Monthly complimentary exterior car wash service",
      validUntil: "First Saturday each month",
      category: "Automotive",
      location: "NewGiza Service Center",
      imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "NewGiza Medical - 10% Off",
      description: "Healthcare discount for all residents and family members",
      validUntil: "Year-round benefit",
      category: "Healthcare",
      location: "NewGiza Medical Center",
      imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
      color: "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
    },
    {
      icon: <Gift className="h-8 w-8" />,
      title: "Fitness Club - 50% Off Membership",
      description: "Half-price annual membership at NewGiza Fitness Club",
      validUntil: "New member special",
      category: "Fitness",
      location: "NewGiza Sports Complex",
      imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      color: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
    }
  ];

  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
            <Percent className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Exclusive Community <span className="text-blue-400">Benefits</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Special offers and discounts exclusively for NewGiza residents
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <Badge variant="secondary" className="px-4 py-2">
              <Star className="h-4 w-4 mr-2" />
              Residents Only
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              Updated Monthly
            </Badge>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {benefits.map((benefit: CommunityBenefit, index: number) => (
            <Card key={benefit.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-gray-700 bg-gray-800">
              {/* Discount Image */}
              <div className="relative h-48 overflow-hidden cursor-pointer" onClick={() => handleImageClick(benefit.imageUrl || benefit.imageUrls?.[0] || "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop")}>
                <img 
                  src={benefit.imageUrl || benefit.imageUrls?.[0] || "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop"} 
                  alt={benefit.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <Expand className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="bg-white/90 text-gray-900">
                    {benefit.category || "Special Offer"}
                  </Badge>
                </div>
                <div className="absolute bottom-4 right-4">
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${getCategoryColor(benefit.category || "")} bg-opacity-90`}>
                    {getCategoryIcon(benefit.category || "")}
                  </div>
                </div>
              </div>
              
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-white group-hover:text-blue-400 transition-colors">
                  {benefit.title}
                </CardTitle>
                <p className="text-gray-300 text-sm">
                  {benefit.description}
                </p>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  {benefit.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <MapPin className="h-4 w-4" />
                      {benefit.location}
                    </div>
                  )}
                  {benefit.validUntil && (
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Clock className="h-4 w-4" />
                      {benefit.validUntil}
                    </div>
                  )}
                  <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Claim Discount
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Offer */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
          <CardContent className="p-8 text-center">
            <Gift className="h-12 w-12 mx-auto mb-4 opacity-90" />
            <h3 className="text-2xl font-bold mb-4">
              New Resident Welcome Package
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Get exclusive access to all community benefits plus a special welcome gift package worth 500 EGP when you join the NGBH professional community
            </p>
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
              Join Community & Get Benefits
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Community Benefit Image</DialogTitle>
            </DialogHeader>
            <div className="flex justify-center">
              <img 
                src={selectedImage} 
                alt="Community Benefit" 
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
}