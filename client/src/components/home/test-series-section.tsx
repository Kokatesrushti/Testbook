import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { TestSeries } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import TestCard from "@/components/tests/test-card";

export default function TestSeriesSection() {
  const { data: testSeries, isLoading } = useQuery<TestSeries[]>({
    queryKey: ['/api/test-series'],
  });

  return (
    <section className="py-12 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-neutral-800 font-poppins mb-4">Popular Test Series</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">Practice with our extensive collection of mock tests to boost your exam preparation</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array(3).fill(0).map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-neutral-200">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <Skeleton className="w-12 h-12 rounded-lg" />
                      <div className="ml-4">
                        <Skeleton className="h-5 w-32 mb-1" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                  <div className="space-y-3 mb-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <div className="border-t border-neutral-200 pt-4">
                    <div className="flex justify-between">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            testSeries?.map((series) => (
              <TestCard key={series.id} testSeries={series} />
            ))
          )}
        </div>
        
        <div className="mt-10 text-center">
          <Link href="/tests">
            <Button variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-white">
              Explore All Test Series <i className="fas fa-arrow-right ml-2"></i>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
