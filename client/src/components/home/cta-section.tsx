import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function CTASection() {
  return (
    <section className="py-16 bg-gradient-to-r from-primary to-blue-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold font-poppins mb-6">Ready to Start Your Exam Preparation?</h2>
        <p className="text-blue-100 max-w-2xl mx-auto mb-8">Join TestBook today and get access to quality courses, mock tests, and study materials to achieve your goals.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/auth">
            <Button className="bg-white text-primary hover:bg-blue-50 px-6 py-3 rounded-lg w-full sm:w-auto">
              Sign Up Now
            </Button>
          </Link>
          <Link href="/study-materials">
            <Button variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary px-6 py-3 rounded-lg w-full sm:w-auto">
              Explore Free Resources
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
