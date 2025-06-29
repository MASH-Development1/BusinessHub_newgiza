import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, MapPin, Clock, Percent } from "lucide-react";
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

export default function CommunityBenefitsSection({ showHomepageOnly = false }: { showHomepageOnly?: boolean }) {
  const { data: benefits = [], isLoading } = useQuery({
    queryKey: showHomepageOnly ? ["/api/community-benefits"] : ["/api/community-benefits/all"],
  });

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

  return (
    <section className="py-16 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full mb-6">
            <Gift className="h-8 w-8 text-black" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Community <span className="text-orange-500">Benefits</span>
          </h2>
          <p className="text-xl text-white max-w-3xl mx-auto">
            Exclusive offers and discounts just for NewGiza residents
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit: CommunityBenefit) => (
            <Card key={benefit.id} className="bg-gray-900 border-gray-700 hover:border-orange-500 transition-all duration-300 overflow-hidden">
              {/* Image Section with Flexible Grid for Multiple Photos */}
              <div className="relative h-48 bg-gray-800">
                {(() => {
                  let images = [];
                  
                  // Handle imageUrls array (new format with multiple images)
                  if (benefit.imageUrls && Array.isArray(benefit.imageUrls) && benefit.imageUrls.length > 0) {
                    images = benefit.imageUrls;
                  }
                  // Handle single imageUrl (legacy format)
                  else if (benefit.imageUrl) {
                    images = [benefit.imageUrl];
                  }
                  
                  if (images.length === 0) {
                    return (
                      <div className="flex items-center justify-center h-full">
                        <Gift className="h-12 w-12 text-orange-500" />
                      </div>
                    );
                  }
                  
                  if (images.length === 1) {
                    return (
                      <img 
                        src={images[0]} 
                        alt={benefit.title}
                        className="w-full h-full object-cover"
                      />
                    );
                  }
                  
                  if (images.length === 2) {
                    return (
                      <div className="grid grid-cols-2 gap-1 h-full">
                        {images.map((img, idx) => (
                          <img 
                            key={idx}
                            src={img} 
                            alt={`${benefit.title} ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        ))}
                      </div>
                    );
                  }
                  
                  if (images.length === 3) {
                    return (
                      <div className="grid grid-cols-2 gap-1 h-full">
                        <img 
                          src={images[0]} 
                          alt={`${benefit.title} 1`}
                          className="w-full h-full object-cover row-span-2"
                        />
                        <img 
                          src={images[1]} 
                          alt={`${benefit.title} 2`}
                          className="w-full h-full object-cover"
                        />
                        <img 
                          src={images[2]} 
                          alt={`${benefit.title} 3`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    );
                  }
                  
                  if (images.length === 4) {
                    return (
                      <div className="grid grid-cols-2 gap-1 h-full">
                        {images.map((img, idx) => (
                          <img 
                            key={idx}
                            src={img} 
                            alt={`${benefit.title} ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        ))}
                      </div>
                    );
                  }
                  
                  // 5 images - special layout
                  if (images.length === 5) {
                    return (
                      <div className="grid grid-cols-3 gap-1 h-full">
                        <img 
                          src={images[0]} 
                          alt={`${benefit.title} 1`}
                          className="w-full h-full object-cover col-span-2"
                        />
                        <div className="grid grid-rows-2 gap-1">
                          <img 
                            src={images[1]} 
                            alt={`${benefit.title} 2`}
                            className="w-full h-full object-cover"
                          />
                          <img 
                            src={images[2]} 
                            alt={`${benefit.title} 3`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <img 
                          src={images[3]} 
                          alt={`${benefit.title} 4`}
                          className="w-full h-full object-cover"
                        />
                        <img 
                          src={images[4]} 
                          alt={`${benefit.title} 5`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    );
                  }
                  
                  // More than 5 images
                  return (
                    <div className="grid grid-cols-3 gap-1 h-full">
                      <img 
                        src={images[0]} 
                        alt={`${benefit.title} 1`}
                        className="w-full h-full object-cover col-span-2"
                      />
                      <div className="grid grid-rows-2 gap-1">
                        <img 
                          src={images[1]} 
                          alt={`${benefit.title} 2`}
                          className="w-full h-full object-cover"
                        />
                        <img 
                          src={images[2]} 
                          alt={`${benefit.title} 3`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <img 
                        src={images[3]} 
                        alt={`${benefit.title} 4`}
                        className="w-full h-full object-cover"
                      />
                      <div className="relative">
                        <img 
                          src={images[4]} 
                          alt={`${benefit.title} 5`}
                          className="w-full h-full object-cover"
                        />
                        {images.length > 5 && (
                          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                            <span className="text-white text-lg font-bold">+{images.length - 5}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
                {benefit.discountPercentage && (
                  <div className="absolute top-4 right-4 bg-orange-500 text-black px-3 py-1 rounded-full font-bold text-sm">
                    {benefit.discountPercentage}
                  </div>
                )}
              </div>

              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-white text-lg">{benefit.title}</CardTitle>
                  {benefit.category && (
                    <Badge variant="outline" className="text-orange-500 border-orange-500">
                      {benefit.category}
                    </Badge>
                  )}
                </div>
                <p className="text-gray-300 text-sm font-medium">{benefit.businessName}</p>
              </CardHeader>

              <CardContent className="pt-0">
                <p className="text-gray-400 text-sm mb-4">{benefit.description}</p>
                
                <div className="space-y-2">
                  {benefit.location && (
                    <div className="flex items-center text-gray-400 text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-orange-500" />
                      {benefit.location}
                    </div>
                  )}
                  {benefit.validUntil && (
                    <div className="flex items-center text-gray-400 text-sm">
                      <Clock className="h-4 w-4 mr-2 text-orange-500" />
                      Valid until: {benefit.validUntil}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Button */}
        <div className="text-center mt-12">
          <p className="text-white">
            More benefits coming soon! Stay tuned for exclusive resident offers.
          </p>
        </div>
      </div>
    </section>
  );
}