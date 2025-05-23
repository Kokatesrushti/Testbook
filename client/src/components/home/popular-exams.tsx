import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ExamCategory } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

type ExamCategoryCardProps = {
  category: ExamCategory;
};

function ExamCategoryCard({ category }: ExamCategoryCardProps) {
  return (
    <Link href={`/courses?category=${category.slug}`}>
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6 text-center cursor-pointer group">
        <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-primary-light rounded-full text-primary group-hover:bg-primary group-hover:text-white transition">
          <i className={`fas ${category.icon} text-2xl`}></i>
        </div>
        <h3 className="font-semibold mb-2">{category.name}</h3>
        <p className="text-sm text-neutral-600 mb-4">{category.description}</p>
        <div className="text-primary font-medium text-sm flex justify-center items-center">
          View Courses <i className="fas fa-arrow-right ml-1 group-hover:ml-2 transition-all"></i>
        </div>
      </div>
    </Link>
  );
}

function ExamCategorySkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 text-center">
      <Skeleton className="w-16 h-16 mx-auto mb-4 rounded-full" />
      <Skeleton className="h-6 w-32 mx-auto mb-2" />
      <Skeleton className="h-4 w-48 mx-auto mb-4" />
      <Skeleton className="h-5 w-28 mx-auto" />
    </div>
  );
}

export default function PopularExams() {
  const { data: categories, isLoading } = useQuery<ExamCategory[]>({
    queryKey: ['/api/exam-categories'],
  });

  return (
    <section className="py-12 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-neutral-800 font-poppins mb-4">Popular Exam Categories</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">Choose from our extensive range of exam preparation courses and test series</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array(8).fill(0).map((_, index) => (
              <ExamCategorySkeleton key={index} />
            ))
          ) : (
            categories?.map((category) => (
              <ExamCategoryCard key={category.id} category={category} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
