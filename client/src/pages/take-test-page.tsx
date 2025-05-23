import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import MockTest from "@/components/tests/mock-test";
import { MockTest as MockTestType } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/use-auth";
import { formatPrice } from "@/lib/utils";
import { AlertTriangle, CheckCircle, ChevronLeft, Loader2 } from "lucide-react";

export default function TakeTestPage() {
  const params = useParams<{ id: string }>();
  const testId = parseInt(params.id);
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);

  // Redirect to auth page if not logged in
  useEffect(() => {
    if (!user) {
      setLocation("/auth");
    }
  }, [user, setLocation]);

  // Fetch test details
  const { data: test, isLoading } = useQuery<MockTestType>({
    queryKey: [`/api/mock-tests/${testId}`],
    enabled: !!user,
  });

  // Handle test completion
  const handleTestComplete = (results: any) => {
    setTestCompleted(true);
    setTestResults(results);
    window.scrollTo(0, 0);
  };

  // Return to the test series page
  const handleBackToTests = () => {
    setLocation(`/test/${test?.seriesId}`);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <p>Redirecting to login page...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
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

  if (!test) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-8">
          <div className="container px-4 mx-auto text-center">
            <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4">Test Not Found</h1>
            <p className="mb-6">The test you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => setLocation("/tests")}>Browse Tests</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (testCompleted && testResults) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-8 bg-neutral-50">
          <div className="container px-4 mx-auto">
            <div className="mb-6">
              <Button variant="outline" onClick={handleBackToTests} className="mb-4">
                <ChevronLeft className="mr-2 h-4 w-4" /> Back to Tests
              </Button>
              <h1 className="text-3xl font-bold">Test Results</h1>
              <p className="text-neutral-600">{test.title}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-white shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Your Score</h3>
                  <div className="text-5xl font-bold text-primary mb-2">{testResults.percentage}%</div>
                  <div className="flex items-center text-sm text-neutral-600">
                    <span>{testResults.score}</span>
                    <span className="mx-1">out of</span>
                    <span>{testResults.totalMarks}</span>
                    <span className="mx-1">marks</span>
                  </div>
                  <Progress value={testResults.percentage} className="h-2 mt-4" />
                  
                  <div className="mt-6 text-center">
                    {testResults.percentage >= (test.passingScore || 60) ? (
                      <div className="flex flex-col items-center">
                        <div className="bg-green-100 text-green-800 p-2 rounded-full mb-2">
                          <CheckCircle className="h-6 w-6" />
                        </div>
                        <p className="font-medium text-green-800">Passed</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="bg-red-100 text-red-800 p-2 rounded-full mb-2">
                          <AlertTriangle className="h-6 w-6" />
                        </div>
                        <p className="font-medium text-red-800">Failed</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Performance Summary</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <span>Correct Answers</span>
                        <span className="text-green-600">{testResults.score / (testResults.totalMarks / testResults.correctAnswers.length)}</span>
                      </div>
                      <Progress value={(testResults.score / testResults.totalMarks) * 100} className="h-2" indicatorClassName="bg-green-500" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <span>Incorrect Answers</span>
                        <span className="text-red-600">{testResults.correctAnswers.length - (testResults.score / (testResults.totalMarks / testResults.correctAnswers.length))}</span>
                      </div>
                      <Progress value={100 - (testResults.score / testResults.totalMarks) * 100} className="h-2" indicatorClassName="bg-red-500" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <span>Accuracy</span>
                        <span>{Math.round((testResults.score / (testResults.totalMarks / testResults.correctAnswers.length)) / testResults.correctAnswers.length * 100)}%</span>
                      </div>
                      <Progress value={(testResults.score / (testResults.totalMarks / testResults.correctAnswers.length)) / testResults.correctAnswers.length * 100} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Next Steps</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>Review your answers to understand where you made mistakes</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>Revisit the sections where your performance was low</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>Practice more mock tests to improve your speed and accuracy</span>
                    </li>
                  </ul>
                  <div className="mt-6">
                    <Button className="w-full" onClick={() => setTestStarted(true)}>Retake Test</Button>
                    <Button variant="outline" className="w-full mt-2" onClick={handleBackToTests}>Back to Test Series</Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white shadow-sm mb-8">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Detailed Analysis</h3>
                <p className="text-neutral-600 mb-4">
                  Below is a detailed analysis of your performance. Review the correct answers to improve your understanding.
                </p>
                
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-neutral-200">
                    <thead className="bg-neutral-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Question</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Your Answer</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Correct Answer</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Result</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-neutral-200">
                      {[...Array(testResults.correctAnswers.length)].map((_, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">Question {index + 1}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">Option {String.fromCharCode(65 + (testResults.correctAnswers[index] === index ? testResults.correctAnswers[index] : (testResults.correctAnswers[index] + 1) % 4))}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">Option {String.fromCharCode(65 + testResults.correctAnswers[index])}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {testResults.correctAnswers[index] === index ? (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Correct</span>
                            ) : (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Incorrect</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!testStarted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-8 bg-neutral-50">
          <div className="container px-4 mx-auto">
            <Button variant="outline" onClick={handleBackToTests} className="mb-4">
              <ChevronLeft className="mr-2 h-4 w-4" /> Back to Tests
            </Button>

            <Card className="max-w-3xl mx-auto bg-white shadow-sm">
              <CardContent className="p-8">
                <h1 className="text-2xl font-bold mb-2">{test.title}</h1>
                <p className="text-neutral-600 mb-6">{test.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="flex items-center">
                    <div className="bg-primary-light p-3 rounded-full mr-3">
                      <Loader2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">Duration</div>
                      <div className="text-neutral-600">{test.duration} minutes</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-primary-light p-3 rounded-full mr-3">
                      <AlertTriangle className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">Questions</div>
                      <div className="text-neutral-600">{test.totalQuestions} questions</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-primary-light p-3 rounded-full mr-3">
                      <CheckCircle className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">Passing Score</div>
                      <div className="text-neutral-600">{test.passingScore}%</div>
                    </div>
                  </div>
                </div>

                <div className="bg-neutral-50 p-4 rounded-lg mb-8">
                  <h3 className="font-semibold mb-3">Important Instructions:</h3>
                  <ul className="space-y-2 text-neutral-600">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>The test has a time limit of {test.duration} minutes.</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>You can mark questions for review and come back to them later.</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>There is negative marking for incorrect answers.</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Do not refresh the page during the test as it will reset your progress.</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Click "Submit Test" when you're done, or the test will auto-submit when the time is up.</span>
                    </li>
                  </ul>
                </div>

                <div className="flex justify-center">
                  <Button size="lg" className="px-8" onClick={() => setTestStarted(true)}>
                    Start Test
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-6 bg-neutral-50">
        <MockTest testId={testId} onFinish={handleTestComplete} />
      </main>
      <Footer />
    </div>
  );
}
