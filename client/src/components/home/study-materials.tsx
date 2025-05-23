import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { StudyMaterial } from "@shared/schema";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type StudyMaterialCardProps = {
  material: StudyMaterial;
};

function StudyMaterialCard({ material }: StudyMaterialCardProps) {
  return (
    <div className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
      <img 
        src={material.thumbnailUrl || 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8'} 
        alt={material.title} 
        className="w-full h-48 object-cover"
      />
      <div className="p-5 bg-white">
        <h3 className="font-semibold text-lg mb-2">{material.title}</h3>
        <p className="text-sm text-neutral-600 mb-4">{material.description}</p>
        <Link href={material.fileUrl}>
          <a className="text-primary font-medium flex items-center hover:underline">
            {material.type === 'Video' ? 'Watch Video' : material.type === 'PDF' ? 'Download PDF' : 'View Material'} 
            <ArrowRight className="ml-1 h-4 w-4" />
          </a>
        </Link>
      </div>
    </div>
  );
}

function StudyMaterialSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden shadow-sm">
      <Skeleton className="w-full h-48" />
      <div className="p-5 bg-white">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-4" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
}

export default function StudyMaterials() {
  const { data: materials, isLoading } = useQuery<StudyMaterial[]>({
    queryKey: ['/api/study-materials'],
  });

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-neutral-800 font-poppins mb-4">Free Study Materials</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">Access free study materials to enhance your exam preparation</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoading ? (
            Array(3).fill(0).map((_, index) => (
              <StudyMaterialSkeleton key={index} />
            ))
          ) : (
            materials?.slice(0, 3).map((material) => (
              <StudyMaterialCard key={material.id} material={material} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
