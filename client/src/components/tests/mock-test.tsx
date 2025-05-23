import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Question, MockTest as MockTestType } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatTimeRemaining } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CheckCircle, AlertCircle, BookmarkIcon, ArrowLeft, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";

interface MockTestProps {
  testId: number;
  onFinish: (result: any) => void;
}

type QuestionStatus = "not_visited" | "visited" | "answered" | "marked";

type UserAnswer = {
  questionIndex: number;
  selectedOption: number | null;
  status: QuestionStatus;
};

export default function MockTest({ testId, onFinish }: MockTestProps) {
  const { user } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch test details
  const { data: test, isLoading: isTestLoading } = useQuery<MockTestType>({
    queryKey: [`/api/mock-tests/${testId}`],
  });

  // Fetch questions
  const { data: questions, isLoading: isQuestionsLoading } = useQuery<Omit<Question, "correctOptionIndex">[]>({
    queryKey: [`/api/questions/${testId}`],
    enabled: !!user,
  });

  // Initialize user answers
  useEffect(() => {
    if (questions && questions.length > 0) {
      const initialUserAnswers = questions.map((_, index) => ({
        questionIndex: index,
        selectedOption: null,
        status: index === 0 ? "visited" : "not_visited",
      }));
      setUserAnswers(initialUserAnswers);
    }
  }, [questions]);

  // Set timer
  useEffect(() => {
    if (test?.duration) {
      setTimeRemaining(test.duration * 60); // Convert minutes to seconds
    }
  }, [test]);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining <= 0) {
      if (timeRemaining === 0) {
        handleSubmitTest();
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  // Submit test mutation
  const submitTestMutation = useMutation({
    mutationFn: async (answers: (number | null)[]) => {
      const res = await apiRequest("POST", `/api/submit-test/${testId}`, { answers });
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/user-progress"] });
      onFinish(data);
    },
    onError: (error: Error) => {
      toast({
        title: "Error submitting test",
        description: error.message,
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  if (isTestLoading || isQuestionsLoading || !questions || !test) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  // Update answer
  const handleSelectOption = (optionIndex: number) => {
    setUserAnswers((prev) => 
      prev.map((ua) => 
        ua.questionIndex === currentQuestionIndex 
          ? { ...ua, selectedOption: optionIndex, status: "answered" } 
          : ua
      )
    );
  };

  // Navigate to next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      
      // Update next question status if not already visited
      setUserAnswers((prev) =>
        prev.map((ua) =>
          ua.questionIndex === currentQuestionIndex + 1 && ua.status === "not_visited"
            ? { ...ua, status: "visited" }
            : ua
        )
      );
    }
  };

  // Navigate to previous question
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Mark question for review
  const handleMarkForReview = () => {
    setUserAnswers((prev) =>
      prev.map((ua) =>
        ua.questionIndex === currentQuestionIndex
          ? { ...ua, status: "marked" }
          : ua
      )
    );
  };

  // Clear response
  const handleClearResponse = () => {
    setUserAnswers((prev) =>
      prev.map((ua) =>
        ua.questionIndex === currentQuestionIndex
          ? { ...ua, selectedOption: null, status: ua.status === "answered" ? "visited" : ua.status }
          : ua
      )
    );
  };

  // Navigate to specific question
  const handleQuestionClick = (index: number) => {
    setCurrentQuestionIndex(index);
    
    // Update status if not visited before
    setUserAnswers((prev) =>
      prev.map((ua) =>
        ua.questionIndex === index && ua.status === "not_visited"
          ? { ...ua, status: "visited" }
          : ua
      )
    );
  };

  // Submit test
  const handleSubmitTest = () => {
    setIsSubmitting(true);
    const answers = userAnswers.map((ua) => ua.selectedOption);
    submitTestMutation.mutate(answers);
  };

  // Get background color based on question status
  const getQuestionButtonStyle = (status: QuestionStatus) => {
    switch (status) {
      case "answered":
        return "bg-green-500 text-white hover:bg-green-600";
      case "marked":
        return "bg-yellow-400 text-white hover:bg-yellow-500";
      case "visited":
        return "bg-purple-500 text-white hover:bg-purple-600";
      case "not_visited":
        return "bg-neutral-200 text-neutral-600 hover:bg-neutral-300";
    }
  };

  // Count questions by status
  const statusCounts = {
    answered: userAnswers.filter((ua) => ua.status === "answered").length,
    not_visited: userAnswers.filter((ua) => ua.status === "not_visited").length,
    marked: userAnswers.filter((ua) => ua.status === "marked").length,
    visited: userAnswers.filter((ua) => ua.status === "visited" && ua.status !== "answered").length,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Question Panel */}
        <div className="lg:w-3/4">
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </h2>
                  <p className="text-neutral-600 text-sm">{test.title}</p>
                </div>
                <Badge variant="outline" className="bg-primary-light text-primary px-4 py-2 text-md flex items-center mt-2 md:mt-0">
                  <Clock className="mr-2 h-4 w-4" />
                  Time Left: {formatTimeRemaining(timeRemaining)}
                </Badge>
              </div>

              <div className="mb-8">
                <p className="text-lg mb-6">{currentQuestion.questionText}</p>

                <RadioGroup 
                  value={userAnswers[currentQuestionIndex]?.selectedOption?.toString() || ""} 
                  onValueChange={(value) => handleSelectOption(parseInt(value))}
                >
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, idx) => (
                      <Label
                        key={idx}
                        htmlFor={`option-${idx}`}
                        className="flex items-center p-3 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50"
                      >
                        <RadioGroupItem 
                          value={idx.toString()} 
                          id={`option-${idx}`} 
                          className="mr-3" 
                        />
                        {option}
                      </Label>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-4 border-t border-neutral-200 pt-4">
                <Button 
                  variant="outline" 
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                </Button>

                <div className="flex flex-wrap gap-2 justify-center">
                  <Button 
                    variant="outline" 
                    className="border-yellow-400 text-yellow-600 hover:bg-yellow-50"
                    onClick={handleMarkForReview}
                  >
                    <BookmarkIcon className="mr-2 h-4 w-4" /> Mark for Review
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={handleClearResponse}
                    disabled={userAnswers[currentQuestionIndex]?.selectedOption === null}
                  >
                    Clear Response
                  </Button>
                </div>

                {currentQuestionIndex < questions.length - 1 ? (
                  <Button onClick={handleNextQuestion}>
                    Save & Next <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button 
                    onClick={handleSubmitTest}
                    disabled={isSubmitting}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Submit Test
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Progress indicator */}
          <Progress value={(currentQuestionIndex + 1) / questions.length * 100} className="h-2 mb-2" />
          <p className="text-sm text-right text-neutral-600">
            {currentQuestionIndex + 1} of {questions.length} questions
          </p>
        </div>

        {/* Question Navigator */}
        <div className="lg:w-1/4">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Question Navigator</h3>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-green-100 text-green-700 px-3 py-1 font-medium flex items-center">
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  Answered: {statusCounts.answered}
                </Badge>
                
                <Badge className="bg-red-100 text-red-700 px-3 py-1 font-medium flex items-center">
                  <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                  Not Visited: {statusCounts.not_visited}
                </Badge>
                
                <Badge className="bg-yellow-100 text-yellow-700 px-3 py-1 font-medium flex items-center">
                  <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                  Marked: {statusCounts.marked}
                </Badge>
                
                <Badge className="bg-purple-100 text-purple-700 px-3 py-1 font-medium flex items-center">
                  <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
                  Visited: {statusCounts.visited}
                </Badge>
              </div>
              
              <div className="flex flex-wrap gap-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                {userAnswers.map((ua, idx) => (
                  <Button
                    key={idx}
                    size="sm"
                    className={`w-10 h-10 p-0 ${getQuestionButtonStyle(ua.status)}`}
                    onClick={() => handleQuestionClick(idx)}
                    variant={currentQuestionIndex === idx ? "default" : "outline"}
                  >
                    {idx + 1}
                  </Button>
                ))}
              </div>

              <Button 
                className="w-full mt-6 bg-green-600 hover:bg-green-700"
                onClick={handleSubmitTest}
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Test
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
