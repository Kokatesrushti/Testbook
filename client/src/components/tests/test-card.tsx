import { Link } from "wouter";
import { TestSeries } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { CheckCircle, FileText, ArrowRight } from "lucide-react";

interface TestCardProps {
  testSeries: TestSeries;
}

export default function TestCard({ testSeries }: TestCardProps) {
  const getBadgeColor = (tag: string | null) => {
    if (!tag) return "bg-neutral-100 text-neutral-800";
    
    switch(tag.toLowerCase()) {
      case 'popular':
        return "bg-green-100 text-green-800";
      case 'new':
        return "bg-blue-100 text-blue-800";
      case 'trending':
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-neutral-100 text-neutral-800";
    }
  };

  return (
    <Card className="h-full bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden border border-neutral-200 group">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition">
              <FileText className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-lg">{testSeries.title}</h3>
              <p className="text-sm text-neutral-600">{testSeries.testsCount} Mock Tests</p>
            </div>
          </div>
          {testSeries.tag && (
            <Badge className={getBadgeColor(testSeries.tag)}>
              {testSeries.tag}
            </Badge>
          )}
        </div>
        
        <div className="space-y-3 mb-4">
          {testSeries.features?.map((feature, index) => (
            <div key={index} className="flex items-center text-sm">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
          <div>
            <span className="text-lg font-bold">{formatPrice(testSeries.discountPrice)}</span>
            {testSeries.discountPrice && testSeries.price > testSeries.discountPrice && (
              <span className="text-neutral-500 line-through ml-2">{formatPrice(testSeries.price)}</span>
            )}
          </div>
          <Link href={`/test/${testSeries.id}`}>
            <span className="text-primary font-medium text-sm flex items-center group-hover:underline">
              View Details <ArrowRight className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
