import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StarIcon } from "lucide-react";

type TestimonialProps = {
  name: string;
  role: string;
  content: string;
  avatarUrl: string;
  joinedTime: string;
  rating: number;
};

function Testimonial({ name, role, content, avatarUrl, joinedTime, rating }: TestimonialProps) {
  return (
    <Card className="bg-white shadow-sm hover:shadow-md transition">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-4">
            <h4 className="font-medium">{name}</h4>
            <p className="text-sm text-neutral-600">{role}</p>
          </div>
        </div>
        <div className="mb-4">
          <div className="flex text-yellow-400 mb-2">
            {Array(5).fill(0).map((_, idx) => (
              <StarIcon 
                key={idx} 
                className="h-4 w-4 fill-current" 
                fill={idx < rating ? 'currentColor' : 'none'} 
                strokeWidth={idx < rating ? 0 : 1.5}
              />
            ))}
          </div>
          <p className="text-neutral-600">{content}</p>
        </div>
        <div className="pt-4 border-t border-neutral-200 text-sm text-neutral-500">
          {joinedTime}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Testimonials() {
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "SBI PO, 2023 Batch",
      content: "The mock tests were exactly like the actual exam pattern. The detailed analysis helped me identify my weak areas. Cleared SBI PO in my first attempt!",
      avatarUrl: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      joinedTime: "Joined TestBook 6 months ago",
      rating: 5
    },
    {
      name: "Rahul Verma",
      role: "SSC CGL, 2022 Batch",
      content: "The faculty at TestBook is exceptional. Their tricks and shortcuts for solving complex problems quickly helped me secure a top rank in SSC CGL exam.",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      joinedTime: "Joined TestBook 1 year ago",
      rating: 4.5
    },
    {
      name: "Neha Patel",
      role: "IBPS Clerk, 2023 Batch",
      content: "TestBook's study material is comprehensive and well-structured. The current affairs section is regularly updated which helped me ace the GK section in the IBPS exam.",
      avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      joinedTime: "Joined TestBook 8 months ago",
      rating: 5
    }
  ];

  return (
    <section className="py-12 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-neutral-800 font-poppins mb-4">What Our Students Say</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">Join thousands of students who have achieved success with TestBook</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Testimonial key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}
