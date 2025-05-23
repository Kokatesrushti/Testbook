import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import TestCard from "@/components/tests/test-card";
import { TestSeries, ExamCategory } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  Tag, 
  Check, 
  Loader2 
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TestsPage() {
  const [location] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [testType, setTestType] = useState<string>("");
  const [sortBy, setSortBy] = useState("popular");

  // Extract params from URL
  const urlParams = new URLSearchParams(location.split("?")[1]);
  const categoryParam = urlParams.get("category");
  const typeParam = urlParams.get("type");

  // Set selected filters from URL params
  useState(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    if (typeParam) {
      setTestType(typeParam);
    }
  });

  // Fetch all test series
  const { data: testSeries, isLoading: isTestSeriesLoading } = useQuery<TestSeries[]>({
    queryKey: ['/api/test-series'],
  });

  // Fetch all categories
  const { data: categories, isLoading: isCategoriesLoading } = useQuery<ExamCategory[]>({
    queryKey: ['/api/exam-categories'],
  });

  // Mock test types - in a real app, this would come from the API
  const testTypes = [
    { id: "mock", name: "Mock Tests" },
    { id: "subject", name: "Subject Tests" },
    { id: "previous-year", name: "Previous Year Papers" }
  ];

  // Filter test series based on search term and filters
  const filteredTestSeries = testSeries?.filter((series) => {
    const matchesSearch = series.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          series.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? 
                          categories?.find(cat => cat.slug === selectedCategory)?.id === series.categoryId : true;
    // For test type, we would need to add this field to the schema and API
    // This is a mock implementation
    const matchesType = testType ? 
                       (series.tag?.toLowerCase().includes(testType) || Math.random() > 0.5) : true;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  // Sort filtered test series
  const sortedTestSeries = filteredTestSeries?.slice().sort((a, b) => {
    switch (sortBy) {
      case "popular":
        // Sort by a popularity metric (using tag as a proxy here)
        return (a.tag === "Popular" ? 1 : 0) - (b.tag === "Popular" ? 1 : 0);
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "price-low":
        return (a.discountPrice || a.price) - (b.discountPrice || b.price);
      case "price-high":
        return (b.discountPrice || b.price) - (a.discountPrice || a.price);
      default:
        return 0;
    }
  });

  // Get category name from slug
  const getCategoryName = (slug: string) => {
    return categories?.find(cat => cat.slug === slug)?.name || "";
  };

  // Get test type name from id
  const getTestTypeName = (id: string) => {
    return testTypes.find(type => type.id === id)?.name || "";
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory("");
    setTestType("");
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
              {testType ? getTestTypeName(testType) : selectedCategory ? getCategoryName(selectedCategory) + " Tests" : "All Test Series"}
            </h1>
            <p className="text-neutral-600">
              Practice with our extensive collection of mock tests to boost your exam preparation
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              <Input
                placeholder="Search test series..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" /> Filters
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filter Test Series</SheetTitle>
                    <SheetDescription>
                      Narrow down test series based on your preferences
                    </SheetDescription>
                  </SheetHeader>
                  <div className="py-6">
                    <div className="mb-6">
                      <h3 className="text-sm font-medium mb-3">Exam Categories</h3>
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
                      <h3 className="text-sm font-medium mb-3">Test Type</h3>
                      <RadioGroup value={testType} onValueChange={setTestType}>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <RadioGroupItem value="" id="all-types" />
                            <Label htmlFor="all-types" className="ml-2">All Types</Label>
                          </div>
                          {testTypes.map((type) => (
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
          </div>

          {/* Test Types Tabs */}
          <div className="mb-8">
            <Tabs 
              value={testType || "all"}
              onValueChange={(value) => setTestType(value === "all" ? "" : value)}
              className="w-full"
            >
              <TabsList className="w-full justify-start mb-2 overflow-x-auto">
                <TabsTrigger value="all">All Test Types</TabsTrigger>
                {testTypes.map((type) => (
                  <TabsTrigger key={type.id} value={type.id}>
                    {type.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Applied Filters */}
          {(selectedCategory || testType) && (
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
              {testType && (
                <Badge variant="outline" className="flex items-center gap-1">
                  {getTestTypeName(testType)}
                  <button 
                    className="ml-1" 
                    onClick={() => setTestType("")}
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

          {/* Test Series Listing */}
          {isTestSeriesLoading || isCategoriesLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : sortedTestSeries && sortedTestSeries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedTestSeries.map((testSeries) => (
                <TestCard key={testSeries.id} testSeries={testSeries} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-neutral-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-neutral-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No test series found</h3>
              <p className="text-neutral-600 mb-4">
                We couldn't find any test series matching your criteria.
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
