import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Course, ExamCategory, UserProgress } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { formatPrice, formatRating, formatCount } from "@/lib/utils";
import { 
  Book, 
  Clock, 
  Users, 
  Calendar, 
  Star, 
  Award, 
  CheckCircle, 
  PlayCircle, 
  FileText, 
  BarChart4, 
  BookOpen, 
  Signal, 
  Loader2 
} from "lucide-react";

export default function CourseDetailPage() {
  const params = useParams<{ id: string }>();
  const courseId = parseInt(params.id);
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  // Fetch course details
  const { data: course, isLoading: isCourseLoading } = useQuery<Course>({
    queryKey: [`/api/courses/${courseId}`],
  });

  // Fetch category
  const { data: category, isLoading: isCategoryLoading } = useQuery<ExamCategory>({
    queryKey: [`/api/exam-categories/${course?.categoryId}`],
    enabled: !!course?.categoryId,
  });

  // Fetch user progress
  const { data: userProgress, isLoading: isProgressLoading } = useQuery<UserProgress>({
    queryKey: [`/api/user-progress?userId=${user?.id}&courseId=${courseId}`],
    enabled: !!user && !!courseId,
  });

  // Enroll mutation
  const enrollMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/user-progress", {
        courseId,
        progress: 0,
        status: "in_progress"
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/user-progress?userId=${user?.id}&courseId=${courseId}`] });
      toast({
        title: "Successfully enrolled",
        description: "You have been enrolled in the course.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Enrollment failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle enroll button click
  const handleEnroll = () => {
    if (!user) {
      setLocation("/auth");
      return;
    }
    enrollMutation.mutate();
  };

  if (isCourseLoading || isCategoryLoading) {
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

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-8">
          <div className="container px-4 mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Course Not Found</h1>
            <p className="mb-6">The course you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => setLocation("/courses")}>Browse Courses</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isEnrolled = !!userProgress;
  const courseProgress = userProgress?.progress || 0;

  // Mock curriculum data (would come from API in real app)
  const curriculum = [
    {
      title: "Introduction",
      lessons: [
        { title: "Course Overview", duration: "5:00", isPreview: true },
        { title: "How to Use This Course", duration: "8:30", isPreview: true },
        { title: "Exam Pattern and Syllabus", duration: "12:45", isPreview: false }
      ]
    },
    {
      title: "Fundamental Concepts",
      lessons: [
        { title: "Basic Terminology", duration: "15:20", isPreview: false },
        { title: "Important Formulas", duration: "20:10", isPreview: false },
        { title: "Solving Techniques", duration: "25:45", isPreview: false },
        { title: "Common Mistakes to Avoid", duration: "18:30", isPreview: false }
      ]
    },
    {
      title: "Advanced Topics",
      lessons: [
        { title: "Complex Problem Solving", duration: "30:15", isPreview: false },
        { title: "Speed Techniques", duration: "22:40", isPreview: false },
        { title: "Practice Questions", duration: "45:00", isPreview: false }
      ]
    },
    {
      title: "Mock Tests & Final Revision",
      lessons: [
        { title: "Subject Test 1", duration: "60:00", isPreview: false },
        { title: "Subject Test 2", duration: "60:00", isPreview: false },
        { title: "Complete Revision Guide", duration: "35:20", isPreview: false },
        { title: "Final Tips and Strategies", duration: "28:15", isPreview: false }
      ]
    }
  ];

  // Calculate total lessons and duration
  const totalLessons = curriculum.reduce((acc, section) => acc + section.lessons.length, 0);
  const totalDuration = curriculum.reduce((acc, section) => {
    return acc + section.lessons.reduce((lessonAcc, lesson) => {
      const [minutes, seconds] = lesson.duration.split(':').map(Number);
      return lessonAcc + minutes + seconds / 60;
    }, 0);
  }, 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Course Header */}
        <div className="bg-primary text-white py-12">
          <div className="container px-4 mx-auto">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-2/3">
                <div className="flex items-center text-blue-100 text-sm mb-4">
                  <span>{category?.name}</span>
                  <span className="mx-2">•</span>
                  <span className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    {formatRating(course.rating)}
                    <span className="ml-1">({formatCount(course.ratingCount)} ratings)</span>
                  </span>
                  <span className="mx-2">•</span>
                  <span>{formatCount(course.enrolledCount)} students</span>
                </div>

                <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
                <p className="text-blue-100 mb-6">{course.description}</p>

                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    <span>{course.lessonsCount} lessons</span>
                  </div>
                  <div className="flex items-center">
                    <Signal className="h-5 w-5 mr-2" />
                    <span>{course.level}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    <span>Last updated {new Date(course.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {isEnrolled && (
                  <div className="bg-blue-800 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Your Progress</span>
                      <span>{courseProgress}% Complete</span>
                    </div>
                    <Progress value={courseProgress} className="h-2" />
                  </div>
                )}

                <div className="flex gap-3">
                  {isEnrolled ? (
                    <Button size="lg" className="bg-green-600 hover:bg-green-700">
                      <PlayCircle className="mr-2 h-5 w-5" /> Continue Learning
                    </Button>
                  ) : (
                    <Button 
                      size="lg"
                      onClick={handleEnroll}
                      disabled={enrollMutation.isPending}
                    >
                      {enrollMutation.isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                      Enroll Now
                    </Button>
                  )}
                </div>
              </div>

              <div className="md:w-1/3">
                <Card>
                  <CardContent className="p-6">
                    <div className="relative aspect-video rounded-lg overflow-hidden mb-6">
                      <img 
                        src={course.imageUrl} 
                        alt={course.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                        <Button className="bg-white bg-opacity-20 text-white border border-white hover:bg-opacity-30">
                          <PlayCircle className="h-6 w-6" />
                        </Button>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-3xl font-bold">{formatPrice(course.discountPrice)}</div>
                        {course.discountPrice && course.price > course.discountPrice && (
                          <div className="flex items-center">
                            <span className="text-neutral-500 line-through mr-2">{formatPrice(course.price)}</span>
                            <Badge className="bg-green-100 text-green-800">
                              {Math.round((1 - course.discountPrice / course.price) * 100)}% OFF
                            </Badge>
                          </div>
                        )}
                      </div>

                      {!isEnrolled && (
                        <Button 
                          className="w-full mb-4" 
                          size="lg"
                          onClick={handleEnroll}
                          disabled={enrollMutation.isPending}
                        >
                          {enrollMutation.isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                          Enroll Now
                        </Button>
                      )}
                    </div>

                    <div className="space-y-4 text-sm">
                      <div className="flex items-start">
                        <BookOpen className="h-5 w-5 mr-3 text-neutral-600" />
                        <div>
                          <div className="font-medium">Total Lessons</div>
                          <div className="text-neutral-600">{course.lessonsCount} lessons</div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Clock className="h-5 w-5 mr-3 text-neutral-600" />
                        <div>
                          <div className="font-medium">Duration</div>
                          <div className="text-neutral-600">{course.duration}</div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Signal className="h-5 w-5 mr-3 text-neutral-600" />
                        <div>
                          <div className="font-medium">Level</div>
                          <div className="text-neutral-600">{course.level}</div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Award className="h-5 w-5 mr-3 text-neutral-600" />
                        <div>
                          <div className="font-medium">Certificate</div>
                          <div className="text-neutral-600">Yes, on completion</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="container px-4 mx-auto py-12">
          <Tabs defaultValue="curriculum">
            <TabsList className="mb-8">
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="instructor">Instructor</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="curriculum">
              <div className="bg-white rounded-lg border p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-bold">Course Content</h2>
                    <p className="text-neutral-600">{totalLessons} lessons • Approximately {Math.floor(totalDuration)} hours</p>
                  </div>
                  <Button variant="link">Expand All Sections</Button>
                </div>

                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-4">
                    {curriculum.map((section, sIndex) => (
                      <Card key={sIndex}>
                        <CardHeader className="py-4 px-6">
                          <CardTitle className="text-lg flex justify-between">
                            <span>{section.title}</span>
                            <span className="text-neutral-600 text-sm font-normal">
                              {section.lessons.length} lessons
                            </span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                          <div className="divide-y">
                            {section.lessons.map((lesson, lIndex) => (
                              <div 
                                key={lIndex} 
                                className="flex justify-between items-center py-3 px-6 hover:bg-neutral-50"
                              >
                                <div className="flex items-center">
                                  <PlayCircle className="h-5 w-5 mr-3 text-primary" />
                                  <div>
                                    <div className="font-medium">{lesson.title}</div>
                                    {lesson.isPreview && (
                                      <Badge variant="outline" className="text-xs">Preview</Badge>
                                    )}
                                  </div>
                                </div>
                                <div className="text-neutral-600">{lesson.duration}</div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="overview">
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-xl font-bold mb-4">Course Overview</h2>
                <div className="prose max-w-none">
                  <p>This comprehensive course is designed to help you prepare for {category?.name} exams. You'll learn from expert instructors with years of experience in this field.</p>
                  
                  <h3 className="text-lg font-semibold mt-6 mb-2">What You'll Learn</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                      <span>Master fundamental concepts required for the exam</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                      <span>Effective problem-solving techniques</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                      <span>Time management strategies for the exam</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                      <span>Practice with exam-pattern based questions</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                      <span>Detailed explanations for all questions</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                      <span>Regular updates with latest exam patterns</span>
                    </li>
                  </ul>
                  
                  <h3 className="text-lg font-semibold mt-6 mb-2">Course Requirements</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                      <span>Basic understanding of the subject</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                      <span>Dedication and regular practice</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                      <span>Pen and paper for practice exercises</span>
                    </li>
                  </ul>
                  
                  <h3 className="text-lg font-semibold mt-6 mb-2">Who This Course is For</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                      <span>Students preparing for {category?.name} exams</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                      <span>Anyone looking to strengthen their knowledge in this field</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                      <span>Professionals seeking career advancement</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="instructor">
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-xl font-bold mb-6">Meet Your Instructor</h2>
                
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/4">
                    <div className="aspect-square rounded-full overflow-hidden bg-neutral-200 mb-4">
                      <img 
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&h=256" 
                        alt={course.instructor} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-lg font-semibold">{course.instructor}</h3>
                    <p className="text-neutral-600">Expert in {category?.name}</p>
                    
                    <div className="flex items-center mt-2 mb-4">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="ml-1">4.9 Instructor Rating</span>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Award className="h-4 w-4 mr-2 text-neutral-600" />
                        <span>15+ years experience</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-neutral-600" />
                        <span>50,000+ students</span>
                      </div>
                      <div className="flex items-center">
                        <Book className="h-4 w-4 mr-2 text-neutral-600" />
                        <span>12 courses</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:w-3/4">
                    <div className="prose max-w-none">
                      <p>
                        Professor {course.instructor} is a highly experienced educator specializing in {category?.name}. 
                        With over 15 years of teaching experience, they have helped thousands of students 
                        successfully clear competitive exams and achieve their career goals.
                      </p>
                      
                      <p className="mt-4">
                        They are known for their ability to explain complex concepts in a simple, 
                        easy-to-understand manner. Their teaching methodology focuses on building 
                        a strong foundation and developing problem-solving skills rather than rote learning.
                      </p>
                      
                      <p className="mt-4">
                        Apart from teaching, they have authored several books on the subject and 
                        regularly contributes to educational journals. They are passionate about 
                        education and constantly update their teaching materials to reflect the 
                        latest exam patterns and industry requirements.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews">
              <div className="bg-white rounded-lg border p-6">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-1/3">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-primary mb-2">{formatRating(course.rating)}</div>
                      <div className="flex justify-center mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className="h-5 w-5 text-yellow-400" 
                            fill={star <= (course.rating || 0) / 10 ? "currentColor" : "none"} 
                          />
                        ))}
                      </div>
                      <p className="text-neutral-600">Course Rating</p>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center">
                          <div className="w-12">{rating} stars</div>
                          <Progress 
                            value={rating === 5 ? 78 : rating === 4 ? 17 : rating === 3 ? 4 : rating === 2 ? 1 : 0} 
                            className="h-2 mx-3 flex-grow" 
                          />
                          <div className="w-8 text-right text-neutral-600">
                            {rating === 5 ? '78%' : rating === 4 ? '17%' : rating === 3 ? '4%' : rating === 2 ? '1%' : '0%'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="md:w-2/3">
                    <h3 className="font-semibold text-lg mb-4">Student Reviews</h3>
                    
                    <div className="space-y-6">
                      <div className="border-b pb-6">
                        <div className="flex justify-between mb-2">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-neutral-200 mr-3 overflow-hidden">
                              <img 
                                src="https://images.unsplash.com/photo-1580894732444-8ecded7900cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" 
                                alt="Student" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-medium">Priya Sharma</div>
                              <div className="text-sm text-neutral-600">2 months ago</div>
                            </div>
                          </div>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                className="h-4 w-4 text-yellow-400" 
                                fill="currentColor"
                              />
                            ))}
                          </div>
                        </div>
                        <p>
                          This course helped me clear my exam in the first attempt! The concepts are explained 
                          in a very clear and concise manner. The practice questions were extremely helpful.
                        </p>
                      </div>
                      
                      <div className="border-b pb-6">
                        <div className="flex justify-between mb-2">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-neutral-200 mr-3 overflow-hidden">
                              <img 
                                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" 
                                alt="Student" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-medium">Rahul Verma</div>
                              <div className="text-sm text-neutral-600">3 months ago</div>
                            </div>
                          </div>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                className="h-4 w-4 text-yellow-400" 
                                fill={star <= 4 ? "currentColor" : "none"}
                              />
                            ))}
                          </div>
                        </div>
                        <p>
                          Great course overall. The instructor explains everything in great detail. Would have 
                          liked more practice questions, but the content is top-notch.
                        </p>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-neutral-200 mr-3 overflow-hidden">
                              <img 
                                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" 
                                alt="Student" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-medium">Neha Patel</div>
                              <div className="text-sm text-neutral-600">1 month ago</div>
                            </div>
                          </div>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                className="h-4 w-4 text-yellow-400" 
                                fill="currentColor"
                              />
                            ))}
                          </div>
                        </div>
                        <p>
                          The best course I've taken on this platform! The instructor's teaching style is excellent, 
                          and the course content is very comprehensive. Highly recommended for anyone preparing for 
                          this exam.
                        </p>
                      </div>
                    </div>
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
