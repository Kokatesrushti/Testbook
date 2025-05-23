import { Link } from "wouter";
import { Course } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice, formatRating, formatCount } from "@/lib/utils";
import { Star, Clock, BookOpen, Signal } from "lucide-react";

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="h-full bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden border border-neutral-200">
      <div className="relative">
        <img 
          src={course.imageUrl} 
          alt={course.title} 
          className="w-full h-48 object-cover" 
        />
        {course.isBestseller && (
          <Badge className="absolute top-3 left-3 bg-[#FF6B00] text-white">
            Bestseller
          </Badge>
        )}
        {course.isNew && (
          <Badge className="absolute top-3 left-3 bg-green-500 text-white">
            New
          </Badge>
        )}
      </div>
      <CardContent className="p-5">
        <div className="flex items-center text-sm text-neutral-600 mb-2">
          <Star className="h-4 w-4 text-yellow-400 mr-1 fill-yellow-400" />
          <span className="font-medium">{formatRating(course.rating)}</span>
          <span className="mx-1">({formatCount(course.ratingCount)} ratings)</span>
          <span className="mx-2">•</span>
          <span>{formatCount(course.enrolledCount)} students</span>
        </div>
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{course.title}</h3>
        <p className="text-sm text-neutral-600 mb-4 line-clamp-2">{course.description}</p>
        <div className="flex items-center text-xs text-neutral-600 mb-4 flex-wrap gap-y-2">
          <div className="flex items-center mr-4">
            <BookOpen className="h-3 w-3 mr-1" />
            <span>{course.lessonsCount} Lessons</span>
          </div>
          <div className="flex items-center mr-4">
            <Clock className="h-3 w-3 mr-1" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center">
            <Signal className="h-3 w-3 mr-1" />
            <span>{course.level}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold">{formatPrice(course.discountPrice)}</span>
            {course.discountPrice && course.price > course.discountPrice && (
              <span className="text-neutral-500 line-through ml-2">{formatPrice(course.price)}</span>
            )}
          </div>
          <Link href={`/course/${course.id}`}>
            <Button size="sm">Enroll Now</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
