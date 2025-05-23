import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import HeroSection from "@/components/home/hero-section";
import StatsCounter from "@/components/home/stats-counter";
import PopularExams from "@/components/home/popular-exams";
import FeaturedCourses from "@/components/home/featured-courses";
import TestSeriesSection from "@/components/home/test-series-section";
import StudyMaterials from "@/components/home/study-materials";
import MockTestInterface from "@/components/home/mock-test-interface";
import Testimonials from "@/components/home/testimonials";
import CTASection from "@/components/home/cta-section";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <StatsCounter />
        <PopularExams />
        <FeaturedCourses />
        <TestSeriesSection />
        <StudyMaterials />
        <MockTestInterface />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
