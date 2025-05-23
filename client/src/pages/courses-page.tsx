import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import CourseCard from "@/components/courses/course-card";
import { Course, ExamCategory } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, Filter, SlidersHorizontal } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CoursesPage() {
  const [location] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [sortBy, setSortBy] = useState("popular");

  // Extract category from URL params
  const urlParams = new URLSearchParams(location.split("?")[1]);
  const categoryParam = urlParams.get("category");

  // Set selected category from URL params when component mounts
  useState(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  });

  // Fetch all courses
  const { data: courses, isLoading: isCoursesLoading } = useQuery<Course[]>({
    queryKey: ['/api/courses'],
  });

  // Fetch all categories
  const { data: categories, isLoading: isCategoriesLoading } = useQuery<ExamCategory[]>({
    queryKey: ['/api/exam-categories'],
  });

  // Filter courses based on search term and filters
  const filteredCourses = courses?.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? 
                          categories?.find(cat => cat.slug === selectedCategory)?.id === course.categoryId : true;
    const matchesLevel = selectedLevel ? course.level === selectedLevel : true;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  // Sort filtered courses
  const sortedCourses = filteredCourses?.slice().sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return (b.enrolledCount || 0) - (a.enrolledCount || 0);
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
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

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedLevel("");
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
              {selectedCategory ? getCategoryName(selectedCategory) + " Courses" : "All Courses"}
            </h1>
            <p className="text-neutral-600">
              Browse our comprehensive collection of exam preparation courses
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              <Input
                placeholder="Search courses..."
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
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">
                    <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filter Courses</SheetTitle>
                    <SheetDescription>
                      Narrow down courses based on your preferences
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
                      <h3 className="text-sm font-medium mb-3">Level</h3>
                      <RadioGroup value={selectedLevel} onValueChange={setSelectedLevel}>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <RadioGroupItem value="" id="all-levels" />
                            <Label htmlFor="all-levels" className="ml-2">All Levels</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="Beginner" id="level-beginner" />
                            <Label htmlFor="level-beginner" className="ml-2">Beginner</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="Intermediate" id="level-intermediate" />
                            <Label htmlFor="level-intermediate" className="ml-2">Intermediate</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="Advanced" id="level-advanced" />
                            <Label htmlFor="level-advanced" className="ml-2">Advanced</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="All Levels" id="level-all" />
                            <Label htmlFor="level-all" className="ml-2">All Levels</Label>
                          </div>
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

          {/* Category Tabs (Desktop) */}
          <div className="hidden md:block mb-8">
            <Tabs 
              value={selectedCategory || "all"}
              onValueChange={(value) => setSelectedCategory(value === "all" ? "" : value)}
              className="w-full"
            >
              <TabsList className="w-full justify-start mb-2 overflow-x-auto">
                <TabsTrigger value="all">All Categories</TabsTrigger>
                {categories?.map((category) => (
                  <TabsTrigger key={category.id} value={category.slug}>
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Course Listing */}
          {isCoursesLoading || isCategoriesLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : sortedCourses && sortedCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-neutral-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-neutral-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No courses found</h3>
              <p className="text-neutral-600 mb-4">
                We couldn't find any courses matching your criteria.
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
