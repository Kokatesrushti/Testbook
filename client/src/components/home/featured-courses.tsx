import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Course } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import CourseCard from "@/components/courses/course-card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

export default function FeaturedCourses() {
  const { data: courses, isLoading } = useQuery<Course[]>({
    queryKey: ['/api/courses'],
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-neutral-800 font-poppins">Featured Courses</h2>
          <div className="flex space-x-2">
            <Button 
              variant="outline"
              size="icon"
              onClick={scrollLeft}
              className="rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              size="icon" 
              onClick={scrollRight}
              className="rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div 
          ref={scrollRef} 
          className="flex overflow-x-auto space-x-6 pb-4 hide-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {isLoading ? (
            Array(3).fill(0).map((_, index) => (
              <div key={index} className="flex-none w-full md:w-1/2 lg:w-1/3">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-neutral-200">
                  <Skeleton className="w-full h-48" />
                  <div className="p-5">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-4 w-3/4 mb-4" />
                    <div className="flex justify-between">
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            courses?.map((course) => (
              <div key={course.id} className="flex-none w-full md:w-1/2 lg:w-1/3">
                <CourseCard course={course} />
              </div>
            ))
          )}
        </div>
        
        <div className="mt-10 text-center">
          <Link href="/courses">
            <Button variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-white">
              View All Courses <i className="fas fa-arrow-right ml-2"></i>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
