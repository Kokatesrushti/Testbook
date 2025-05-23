import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { TestSeries, MockTest, ExamCategory, UserProgress } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/use-auth";
import { formatPrice } from "@/lib/utils";
import { 
  Clock, 
  CheckCircle, 
  FileText, 
  Timer, 
  HelpCircle, 
  AlertTriangle, 
  Users,
  Loader2
} from "lucide-react";

export default function TestDetailPage() {
  const params = useParams<{ id: string }>();
  const seriesId = parseInt(params.id);
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  // Fetch test series details
  const { data: testSeries, isLoading: isSeriesLoading } = useQuery<TestSeries>({
    queryKey: [`/api/test-series/${seriesId}`],
  });

  // Fetch category
  const { data: category, isLoading: isCategoryLoading } = useQuery<ExamCategory>({
    queryKey: [`/api/exam-categories/${testSeries?.categoryId}`],
    enabled: !!testSeries?.categoryId,
  });

  // Fetch mock tests in this series
  const { data: mockTests, isLoading: isTestsLoading } = useQuery<MockTest[]>({
    queryKey: [`/api/mock-tests/series/${seriesId}`],
  });

  // Fetch user progress
  const { data: userProgress, isLoading: isProgressLoading } = useQuery<UserProgress[]>({
    queryKey: [`/api/user-progress?userId=${user?.id}`],
    enabled: !!user,
  });

  if (isSeriesLoading || isCategoryLoading || isTestsLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!testSeries) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-8">
          <div className="container px-4 mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Test Series Not Found</h1>
            <p className="mb-6">The test series you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => setLocation("/tests")}>Browse Test Series</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Get test progress if available
  const getTestProgress = (testId?: number) => {
    if (!testId || !userProgress) return null;
    return userProgress.find(p => p.testId === testId);
  };

  // Check if user has purchased the test series
  const hasPurchased = userProgress && userProgress.some(p => 
    mockTests?.some(test => test.id === p.testId)
  );

  // Handle start test button click
  const handleStartTest = (testId: number) => {
    if (!user) {
      setLocation("/auth");
      return;
    }
    
    // Navigate to take test page
    setLocation(`/take-test/${testId}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Test Series Header */}
        <div className="bg-primary text-white py-12">
          <div className="container px-4 mx-auto">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-2/3">
                <div className="mb-4">
                  <Badge className="bg-blue-700">{category?.name}</Badge>
                  {testSeries.tag && (
                    <Badge className="ml-2 bg-yellow-500">{testSeries.tag}</Badge>
                  )}
                </div>

                <h1 className="text-3xl font-bold mb-4">{testSeries.title}</h1>
                <p className="text-blue-100 mb-6">{testSeries.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    <span>{testSeries.testsCount} Tests</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    <span>Valid for 1 year</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    <span>1,500+ enrolled</span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {testSeries.features?.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {!hasPurchased && (
                  <Button size="lg" className="mt-4" onClick={() => setLocation(`/checkout/test-series/${seriesId}`)}>
                    Buy Now
                  </Button>
                )}
              </div>

              <div className="md:w-1/3">
                <Card className="bg-white text-black">
                  <CardContent className="p-6">
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-4">
                        <div className="text-3xl font-bold">{formatPrice(testSeries.discountPrice)}</div>
                        {testSeries.discountPrice && testSeries.price > testSeries.discountPrice && (
                          <div className="flex items-center">
                            <span className="text-neutral-500 line-through mr-2">{formatPrice(testSeries.price)}</span>
                            <Badge className="bg-green-100 text-green-800">
                              {Math.round((1 - testSeries.discountPrice / testSeries.price) * 100)}% OFF
                            </Badge>
                          </div>
                        )}
                      </div>

                      {!hasPurchased && (
                        <Button 
                          className="w-full mb-4" 
                          size="lg"
                          onClick={() => setLocation(`/checkout/test-series/${seriesId}`)}
                        >
                          Buy Now
                        </Button>
                      )}
                    </div>

                    <div className="space-y-4 text-sm border-t pt-4">
                      <h3 className="font-semibold">This package includes:</h3>
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-neutral-600" />
                        <span>{testSeries.testsCount} Full-length mock tests</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 mr-2 text-neutral-600" />
                        <span>Access for 1 year</span>
                      </div>
                      <div className="flex items-center">
                        <HelpCircle className="h-5 w-5 mr-2 text-neutral-600" />
                        <span>Detailed solutions & explanations</span>
                      </div>
                      <div className="flex items-center">
                        <AlertTriangle className="h-5 w-5 mr-2 text-neutral-600" />
                        <span>Comprehensive performance analysis</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Test Series Content */}
        <div className="container px-4 mx-auto py-12">
          <Tabs defaultValue="tests">
            <TabsList className="mb-8">
              <TabsTrigger value="tests">Available Tests</TabsTrigger>
              <TabsTrigger value="pattern">Exam Pattern</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>

            <TabsContent value="tests">
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-xl font-bold mb-4">Mock Tests</h2>
                
                {mockTests && mockTests.length > 0 ? (
                  <ScrollArea className="h-[600px] pr-4">
                    <div className="space-y-4">
                      {mockTests.map((test) => {
                        const progress = getTestProgress(test.id);
                        const isCompleted = progress?.status === "completed";
                        const score = progress?.score;
                        
                        return (
                          <Card key={test.id} className="overflow-hidden">
                            <div className="border-l-4 border-primary">
                              <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row justify-between gap-4">
                                  <div>
                                    <h3 className="font-semibold text-lg mb-1">{test.title}</h3>
                                    <p className="text-neutral-600 text-sm mb-3">{test.description}</p>
                                    
                                    <div className="flex flex-wrap gap-3 text-sm">
                                      <Badge variant="outline" className="flex items-center">
                                        <Clock className="mr-1 h-4 w-4" /> {test.duration} mins
                                      </Badge>
                                      <Badge variant="outline" className="flex items-center">
                                        <HelpCircle className="mr-1 h-4 w-4" /> {test.totalQuestions} questions
                                      </Badge>
                                      <Badge variant="outline" className="flex items-center">
                                        <AlertTriangle className="mr-1 h-4 w-4" /> Passing: {test.passingScore}%
                                      </Badge>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center">
                                    {isCompleted ? (
                                      <div className="text-center mr-6">
                                        <div className="text-2xl font-bold text-primary">{score}%</div>
                                        <div className="text-sm text-neutral-600">Your Score</div>
                                      </div>
                                    ) : null}
                                    
                                    <Button
                                      onClick={() => handleStartTest(test.id)}
                                      variant={isCompleted ? "outline" : "default"}
                                    >
                                      {isCompleted ? "Retake Test" : "Start Test"}
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto text-neutral-300 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No tests available</h3>
                    <p className="text-neutral-600">
                      There are no tests available in this series yet. Please check back later.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="pattern">
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-xl font-bold mb-6">Exam Pattern & Structure</h2>
                
                <div className="prose max-w-none">
                  <p>
                    The mock tests in this series follow the latest exam pattern for {category?.name} exams.
                    Here's a breakdown of the exam structure:
                  </p>
                  
                  <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Exam Duration</CardTitle>
                        <CardDescription>Time allocation for the exam</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <Timer className="h-5 w-5 mr-2 text-primary" />
                            <span>Total Duration: 60-180 minutes (varies by test)</span>
                          </li>
                          <li className="flex items-start">
                            <Timer className="h-5 w-5 mr-2 text-primary" />
                            <span>No sectional time limits</span>
                          </li>
                          <li className="flex items-start">
                            <Timer className="h-5 w-5 mr-2 text-primary" />
                            <span>Time remaining indicator during the test</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Question Types</CardTitle>
                        <CardDescription>Types of questions included</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <HelpCircle className="h-5 w-5 mr-2 text-primary" />
                            <span>Multiple Choice Questions (MCQs)</span>
                          </li>
                          <li className="flex items-start">
                            <HelpCircle className="h-5 w-5 mr-2 text-primary" />
                            <span>Numeric Answer Type (NAT) for some tests</span>
                          </li>
                          <li className="flex items-start">
                            <HelpCircle className="h-5 w-5 mr-2 text-primary" />
                            <span>Difficulty levels: Easy, Medium, Hard</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Marking Scheme</CardTitle>
                        <CardDescription>Scoring pattern for the exam</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 mr-2 text-primary" />
                            <span>Correct Answer: +1 to +4 marks (depends on difficulty)</span>
                          </li>
                          <li className="flex items-start">
                            <AlertTriangle className="h-5 w-5 mr-2 text-primary" />
                            <span>Incorrect Answer: -0.25 to -1 mark (negative marking)</span>
                          </li>
                          <li className="flex items-start">
                            <HelpCircle className="h-5 w-5 mr-2 text-primary" />
                            <span>Unattempted: No marks deducted</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Sections</CardTitle>
                        <CardDescription>Exam sections and subject areas</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <FileText className="h-5 w-5 mr-2 text-primary" />
                            <span>Quantitative Aptitude</span>
                          </li>
                          <li className="flex items-start">
                            <FileText className="h-5 w-5 mr-2 text-primary" />
                            <span>Reasoning & Logical Ability</span>
                          </li>
                          <li className="flex items-start">
                            <FileText className="h-5 w-5 mr-2 text-primary" />
                            <span>General Knowledge & Current Affairs</span>
                          </li>
                          <li className="flex items-start">
                            <FileText className="h-5 w-5 mr-2 text-primary" />
                            <span>English Language</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="faq">
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-xl font-bold mb-6">Frequently Asked Questions</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">How long will I have access to the test series?</h3>
                    <p className="text-neutral-600">
                      You will have access to the test series for 1 year from the date of purchase.
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Can I retake the tests multiple times?</h3>
                    <p className="text-neutral-600">
                      Yes, you can retake each test as many times as you want during your access period.
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Are the questions similar to the actual exam?</h3>
                    <p className="text-neutral-600">
                      Yes, our test questions are designed to closely match the pattern, difficulty level, 
                      and types of questions asked in the actual exam. They are prepared by experts who have 
                      extensive experience with {category?.name} exams.
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Will I get detailed solutions for the questions?</h3>
                    <p className="text-neutral-600">
                      Yes, after completing each test, you'll get access to detailed explanations and 
                      solutions for all questions, helping you understand the concepts better.
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">How will my performance be analyzed?</h3>
                    <p className="text-neutral-600">
                      After each test, you'll receive a comprehensive performance analysis including your 
                      score, percentile, section-wise performance, time spent on each question, and areas 
                      of improvement.
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Can I access the test series on mobile devices?</h3>
                    <p className="text-neutral-600">
                      Yes, our test platform is fully responsive and can be accessed on desktops, laptops, 
                      tablets, and mobile phones. However, for the best experience, we recommend using a 
                      desktop or laptop.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
