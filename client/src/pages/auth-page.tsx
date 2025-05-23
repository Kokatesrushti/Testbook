import { useEffect } from "react";
import { useLocation } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import AuthForm from "@/components/auth/auth-form";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { user, isLoading } = useAuth();

  // Redirect to home if user is already logged in
  useEffect(() => {
    if (user && !isLoading) {
      setLocation("/");
    }
  }, [user, isLoading, setLocation]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12 bg-neutral-50">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row gap-8 items-stretch max-w-6xl mx-auto">
            {/* Auth Form */}
            <div className="md:w-1/2">
              <Card className="shadow-md">
                <CardContent className="p-6">
                  <AuthForm />
                </CardContent>
              </Card>
            </div>

            {/* Hero Section */}
            <div className="md:w-1/2 bg-gradient-to-br from-primary to-blue-700 rounded-xl p-8 text-white flex flex-col justify-center">
              <div className="mb-6">
                <h1 className="text-3xl font-bold mb-4">Prepare for Success</h1>
                <p className="text-blue-100 mb-6">
                  Join TestBook and get access to high-quality study materials, mock tests, and expert guidance to ace your competitive exams.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Comprehensive courses for all competitive exams</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>1000+ practice tests with detailed explanations</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Performance analytics to track your progress</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Learn from expert educators with proven success</span>
                  </li>
                </ul>
              </div>

              <div className="mt-auto">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-blue-600 flex items-center justify-center overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=48&h=48" alt="Student" className="w-full h-full object-cover" />
                    </div>
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-blue-600 flex items-center justify-center overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?ixlib=rb-4.0.3&auto=format&fit=crop&w=48&h=48" alt="Student" className="w-full h-full object-cover" />
                    </div>
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-blue-600 flex items-center justify-center overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=48&h=48" alt="Student" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <p className="text-sm">Join 200,000+ successful students today!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
