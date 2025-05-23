import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Link } from "wouter";
import { useState } from "react";

export default function MockTestInterface() {
  const [selectedOption, setSelectedOption] = useState<string | undefined>(undefined);

  const handleOptionChange = (value: string) => {
    setSelectedOption(value);
  };

  return (
    <section className="py-12 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold text-white font-poppins mb-4">Experience Our Mock Test Interface</h2>
            <p className="text-blue-100 mb-6">Our user-friendly test interface simulates the real exam environment to help you prepare effectively.</p>
            
            <div className="bg-white p-4 rounded-lg shadow-lg mb-6">
              <div className="flex flex-wrap gap-2 mb-4">
                <div className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium flex items-center">
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  Answered: 16
                </div>
                <div className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-medium flex items-center">
                  <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                  Not Visited: 23
                </div>
                <div className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium flex items-center">
                  <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                  Marked: 5
                </div>
                <div className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium flex items-center">
                  <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
                  Visited: 6
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button size="sm" className="w-8 h-8 p-0 bg-green-500 hover:bg-green-600">1</Button>
                <Button size="sm" className="w-8 h-8 p-0 bg-green-500 hover:bg-green-600">2</Button>
                <Button size="sm" className="w-8 h-8 p-0 bg-yellow-400 hover:bg-yellow-500">3</Button>
                <Button size="sm" className="w-8 h-8 p-0 bg-green-500 hover:bg-green-600">4</Button>
                <Button size="sm" className="w-8 h-8 p-0 bg-purple-500 hover:bg-purple-600">5</Button>
                <Button size="sm" variant="outline" className="w-8 h-8 p-0 bg-neutral-200 text-neutral-600 hover:bg-neutral-300">6</Button>
                <Button size="sm" variant="outline" className="w-8 h-8 p-0 bg-neutral-200 text-neutral-600 hover:bg-neutral-300">7</Button>
                <Button size="sm" className="w-8 h-8 p-0 bg-green-500 hover:bg-green-600">8</Button>
                <Button size="sm" variant="outline" className="w-8 h-8 p-0 bg-neutral-200 text-neutral-600 hover:bg-neutral-300">9</Button>
                <Button size="sm" className="w-8 h-8 p-0 bg-green-500 hover:bg-green-600">10</Button>
              </div>
            </div>
            
            <Link href="/tests">
              <Button className="bg-[#FF6B00] hover:bg-[#D95C00] text-white">
                Try Free Mock Test <i className="fas fa-arrow-right ml-2"></i>
              </Button>
            </Link>
          </div>
          
          <div className="lg:w-1/2 bg-white p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-semibold">Question 8 of 50</h3>
                <div className="text-sm text-neutral-600">General Knowledge - Set 1</div>
              </div>
              <div className="bg-primary-light text-primary font-medium px-4 py-1 rounded-full flex items-center">
                <i className="fas fa-clock mr-2"></i>
                <span>Time Left: 28:45</span>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-neutral-800 mb-4">Who is the author of the book "The Immortals of Meluha"?</p>
              
              <RadioGroup value={selectedOption} onValueChange={handleOptionChange}>
                <div className="space-y-3">
                  <Label
                    htmlFor="option1"
                    className="flex items-center p-3 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50"
                  >
                    <RadioGroupItem value="option1" id="option1" className="mr-3" />
                    Amish Tripathi
                  </Label>
                  
                  <Label
                    htmlFor="option2"
                    className="flex items-center p-3 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50"
                  >
                    <RadioGroupItem value="option2" id="option2" className="mr-3" />
                    Chetan Bhagat
                  </Label>
                  
                  <Label
                    htmlFor="option3"
                    className="flex items-center p-3 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50"
                  >
                    <RadioGroupItem value="option3" id="option3" className="mr-3" />
                    Vikram Seth
                  </Label>
                  
                  <Label
                    htmlFor="option4"
                    className="flex items-center p-3 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50"
                  >
                    <RadioGroupItem value="option4" id="option4" className="mr-3" />
                    Arundhati Roy
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="flex justify-between border-t pt-4">
              <Button variant="outline">
                <i className="fas fa-chevron-left mr-2"></i> Previous
              </Button>
              
              <div className="flex space-x-2">
                <Button variant="outline" className="border-yellow-400 text-yellow-600 hover:bg-yellow-50">
                  <i className="fas fa-bookmark mr-1"></i> Mark for Review
                </Button>
                <Button variant="outline">
                  Clear Response
                </Button>
              </div>
              
              <Button>
                Save & Next <i className="fas fa-chevron-right ml-2"></i>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
