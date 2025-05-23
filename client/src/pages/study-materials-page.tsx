import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { StudyMaterial, ExamCategory } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Bookmark, BookOpen, FileText, Video, Download, Loader2, Filter } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";

export default function StudyMaterialsPage() {
  const [location] = useLocation();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [materialType, setMaterialType] = useState<string>("");

  // Extract parameters from URL
  const urlParams = new URLSearchParams(location.split("?")[1]);
  const categoryParam = urlParams.get("category");
  const typeParam = urlParams.get("type");

  // Set selected filters from URL params
  useState(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    if (typeParam) {
      setMaterialType(typeParam);
    }
  });

  // Fetch study materials
  const { data: materials, isLoading: isMaterialsLoading } = useQuery<StudyMaterial[]>({
    queryKey: ['/api/study-materials'],
  });

  // Fetch categories
  const { data: categories, isLoading: isCategoriesLoading } = useQuery<ExamCategory[]>({
    queryKey: ['/api/exam-categories'],
  });

  // Material types - in a real app, this would come from the API
  const materialTypes = [
    { id: "PDF", name: "PDF Documents" },
    { id: "Video", name: "Video Lectures" },
    { id: "Notes", name: "Study Notes" }
  ];

  // Filter materials based on search and filters
  const filteredMaterials = materials?.filter((material) => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          material.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? 
                          categories?.find(cat => cat.slug === selectedCategory)?.id === material.categoryId : true;
    const matchesType = materialType ? material.type === materialType : true;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  // Get category name from slug
  const getCategoryName = (slug: string) => {
    return categories?.find(cat => cat.slug === slug)?.name || "";
  };

  // Get material type icon
  const getMaterialTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <FileText className="h-5 w-5" />;
      case 'video':
        return <Video className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory("");
    setMaterialType("");
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-8 bg-neutral-50">
        <div className="container px-4 mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {materialType ? 
                `${materialTypes.find(t => t.id === materialType)?.name}` : 
                selectedCategory ? 
                  `${getCategoryName(selectedCategory)} Study Materials` : 
                  "Free Study Materials"}
            </h1>
            <p className="text-neutral-600">
              Access free study materials to enhance your exam preparation
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              <Input
                placeholder="Search study materials..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" /> Filters
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Study Materials</SheetTitle>
                  <SheetDescription>
                    Narrow down materials based on your preferences
                  </SheetDescription>
                </SheetHeader>
                <div className="py-6">
                  <div className="mb-6">
                    <h3 className="text-sm font-medium mb-3">Categories</h3>
                    <RadioGroup value={selectedCategory} onValueChange={setSelectedCategory}>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <RadioGroupItem value="" id="all-categories" />
                          <Label htmlFor="all-categories" className="ml-2">All Categories</Label>
                        </div>
                        {categories?.map((category) => (
                          <div key={category.id} className="flex items-center">
                            <RadioGroupItem value={category.slug} id={`category-${category.id}`} />
                            <Label htmlFor={`category-${category.id}`} className="ml-2">{category.name}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  <Separator className="my-4" />

                  <div className="mb-6">
                    <h3 className="text-sm font-medium mb-3">Material Type</h3>
                    <RadioGroup value={materialType} onValueChange={setMaterialType}>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <RadioGroupItem value="" id="all-types" />
                          <Label htmlFor="all-types" className="ml-2">All Types</Label>
                        </div>
                        {materialTypes.map((type) => (
                          <div key={type.id} className="flex items-center">
                            <RadioGroupItem value={type.id} id={`type-${type.id}`} />
                            <Label htmlFor={`type-${type.id}`} className="ml-2">{type.name}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <Button className="w-full" onClick={clearFilters} variant="outline">
                      Clear Filters
                    </Button>
                    <Button className="w-full">Apply Filters</Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Material Type Tabs */}
          <div className="mb-8">
            <Tabs 
              value={materialType || "all"}
              onValueChange={(value) => setMaterialType(value === "all" ? "" : value)}
              className="w-full"
            >
              <TabsList className="w-full justify-start mb-2 overflow-x-auto">
                <TabsTrigger value="all">All Materials</TabsTrigger>
                {materialTypes.map((type) => (
                  <TabsTrigger key={type.id} value={type.id}>
                    {type.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Applied Filters */}
          {(selectedCategory || materialType) && (
            <div className="flex gap-2 mb-6 flex-wrap">
              <div className="text-sm text-neutral-600 py-1">Filters:</div>
              {selectedCategory && (
                <Badge variant="outline" className="flex items-center gap-1">
                  {getCategoryName(selectedCategory)}
                  <button 
                    className="ml-1" 
                    onClick={() => setSelectedCategory("")}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {materialType && (
                <Badge variant="outline" className="flex items-center gap-1">
                  {materialTypes.find(t => t.id === materialType)?.name}
                  <button 
                    className="ml-1" 
                    onClick={() => setMaterialType("")}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs h-7" 
                onClick={clearFilters}
              >
                Clear All
              </Button>
            </div>
          )}

          {/* Study Materials Grid */}
          {isMaterialsLoading || isCategoriesLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredMaterials && filteredMaterials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMaterials.map((material) => {
                const category = categories?.find(c => c.id === material.categoryId);
                
                return (
                  <Card key={material.id} className="overflow-hidden h-full flex flex-col">
                    <div className="relative aspect-video">
                      <img 
                        src={material.thumbnailUrl || 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8'} 
                        alt={material.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className={`${material.isFree ? 'bg-green-100 text-green-800' : 'bg-primary'}`}>
                          {material.isFree ? 'Free' : 'Premium'}
                        </Badge>
                      </div>
                      {material.type && (
                        <div className="absolute bottom-2 left-2">
                          <Badge variant="outline" className="bg-white">
                            {getMaterialTypeIcon(material.type)}
                            <span className="ml-1">{material.type}</span>
                          </Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-5 flex-grow">
                      <div className="mb-1">
                        <Badge variant="outline" className="text-xs">{category?.name}</Badge>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{material.title}</h3>
                      <p className="text-sm text-neutral-600 mb-4">{material.description}</p>
                    </CardContent>
                    <CardFooter className="p-5 pt-0 mt-auto">
                      <div className="w-full flex justify-between items-center">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => {
                            if (!user && !material.isFree) {
                              setLocation("/auth");
                            }
                          }}
                        >
                          <Bookmark className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                        <Button 
                          className={`${material.type === 'Video' ? 'bg-red-600 hover:bg-red-700' : ''}`}
                          onClick={() => {
                            if (!user && !material.isFree) {
                              setLocation("/auth");
                              return;
                            }
                            window.open(material.fileUrl, '_blank');
                          }}
                        >
                          {material.type === 'Video' ? (
                            <>
                              <Video className="h-4 w-4 mr-2" />
                              Watch Now
                            </>
                          ) : (
                            <>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </>
                          )}
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-neutral-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-neutral-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No study materials found</h3>
              <p className="text-neutral-600 mb-4">
                We couldn't find any study materials matching your criteria.
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          )}
          
          {/* Recommended Materials */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Recommended for You</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-blue-100 to-blue-50 border-blue-200">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <FileText className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Current Affairs PDF</h3>
                  <p className="text-neutral-600 mb-4">Monthly compilation of important current affairs for all competitive exams.</p>
                  <Button>Download Now</Button>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-100 to-green-50 border-green-200">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <Video className="h-12 w-12 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Free Video Lectures</h3>
                  <p className="text-neutral-600 mb-4">Concept videos and topic discussions by expert educators.</p>
                  <Button className="bg-green-600 hover:bg-green-700">Watch Videos</Button>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-100 to-purple-50 border-purple-200">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <BookOpen className="h-12 w-12 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Study Notes</h3>
                  <p className="text-neutral-600 mb-4">Comprehensive notes for quick revision and last-minute preparation.</p>
                  <Button className="bg-purple-600 hover:bg-purple-700">Access Notes</Button>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="mt-16 bg-primary rounded-xl p-8 text-white">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">Unlock Premium Study Materials</h2>
              <p className="text-blue-100 mb-6">
                Get access to our complete collection of premium study materials, including mock tests, 
                video lectures, and comprehensive notes.
              </p>
              <Button className="bg-white text-primary hover:bg-blue-50" size="lg" onClick={() => setLocation("/auth")}>
                Sign Up Now
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
