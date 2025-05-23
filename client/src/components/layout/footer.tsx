import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 font-poppins">TestBook</h3>
            <p className="text-neutral-400 mb-4">India's leading exam preparation platform for competitive exams.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-400 hover:text-white">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-neutral-400 hover:text-white">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-neutral-400 hover:text-white">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-neutral-400 hover:text-white">
                <i className="fab fa-youtube"></i>
              </a>
              <a href="#" className="text-neutral-400 hover:text-white">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-lg">Courses</h4>
            <ul className="space-y-2">
              <li><Link href="/courses?category=banking-insurance" className="text-neutral-400 hover:text-white">Banking & Insurance</Link></li>
              <li><Link href="/courses?category=ssc-railways" className="text-neutral-400 hover:text-white">SSC & Railways</Link></li>
              <li><Link href="/courses?category=jee-neet" className="text-neutral-400 hover:text-white">JEE & NEET</Link></li>
              <li><Link href="/courses?category=gate-ese" className="text-neutral-400 hover:text-white">GATE & ESE</Link></li>
              <li><Link href="/courses?category=defence" className="text-neutral-400 hover:text-white">Defence Exams</Link></li>
              <li><Link href="/courses?category=state" className="text-neutral-400 hover:text-white">State Exams</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-lg">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-neutral-400 hover:text-white">About Us</Link></li>
              <li><Link href="/contact" className="text-neutral-400 hover:text-white">Contact Us</Link></li>
              <li><Link href="/faq" className="text-neutral-400 hover:text-white">FAQ</Link></li>
              <li><Link href="/careers" className="text-neutral-400 hover:text-white">Careers</Link></li>
              <li><Link href="/blog" className="text-neutral-400 hover:text-white">Blog</Link></li>
              <li><Link href="/testbook-pass" className="text-neutral-400 hover:text-white">TestBook Pass</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-lg">Contact</h4>
            <ul className="space-y-2 text-neutral-400">
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt mt-1 mr-3"></i>
                <span>TestBook Edutech Pvt. Ltd., New Delhi, India</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-envelope mr-3"></i>
                <span>support@testbook.com</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone-alt mr-3"></i>
                <span>+91 9876543210</span>
              </li>
            </ul>
            <div className="mt-4">
              <h5 className="font-medium mb-2">Download Our App</h5>
              <div className="flex space-x-3">
                <a href="#" className="bg-neutral-800 hover:bg-neutral-700 p-2 rounded">
                  <i className="fab fa-google-play mr-1"></i>
                  Google Play
                </a>
                <a href="#" className="bg-neutral-800 hover:bg-neutral-700 p-2 rounded">
                  <i className="fab fa-apple mr-1"></i>
                  App Store
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-neutral-800 pt-6 mt-8 text-neutral-400 text-sm flex flex-col md:flex-row justify-between">
          <div>
            &copy; {new Date().getFullYear()} TestBook. All rights reserved.
          </div>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/terms" className="hover:text-white">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/refund" className="hover:text-white">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
