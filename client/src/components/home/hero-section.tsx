import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-primary via-primary/90 to-secondary/90 text-white hero-pattern section-padding overflow-hidden">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:w-1/2 space-y-6">
            <div>
              <span className="inline-flex items-center rounded-full bg-secondary/20 px-4 py-1 text-sm font-medium text-secondary-foreground backdrop-blur-sm mb-4">
                #1 Online Test Preparation Platform
              </span>
            </div>
            <h1 className="font-bold leading-tight">
              Prepare for Your <span className="text-secondary">Dream Exams</span> with Confidence
            </h1>
            <p className="text-lg text-white/80 max-w-xl">
              Access high-quality courses, mock tests, and study materials to ace your competitive exams with TestBook.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 pt-4">
              <Link href="/courses">
                <Button className="btn-secondary h-12 px-8 text-base font-medium">
                  Explore Courses
                </Button>
              </Link>
              <Link href="/tests">
                <Button className="bg-white text-primary hover:bg-white/90 h-12 px-8 text-base font-medium">
                  Take Free Mock Test
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-4 pt-2">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-white bg-secondary/30 flex items-center justify-center overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=48&h=48" alt="Student" className="w-full h-full object-cover" />
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-white bg-secondary/30 flex items-center justify-center overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?ixlib=rb-4.0.3&auto=format&fit=crop&w=48&h=48" alt="Student" className="w-full h-full object-cover" />
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-white bg-secondary/30 flex items-center justify-center overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=48&h=48" alt="Student" className="w-full h-full object-cover" />
                </div>
                <span className="w-10 h-10 rounded-full bg-secondary/80 border-2 border-white flex items-center justify-center text-xs font-medium">200k+</span>
              </div>
              <span className="text-white/90">Join 200,000+ successful students</span>
            </div>
          </div>
          <div className="md:w-1/2 relative">
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-secondary/30 rounded-full filter blur-3xl opacity-50"></div>
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-primary/30 rounded-full filter blur-3xl opacity-50"></div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                alt="Student studying for exam" 
                className="rounded-2xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.3)] w-full h-auto object-cover"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-secondary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 6V18M18 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-foreground">500+ Tests</p>
                    <p className="text-sm text-muted-foreground">Updated regularly</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
