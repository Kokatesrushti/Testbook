import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { useAuth } from "@/hooks/use-auth";
import { Course, MockTest, UserProgress, TestSeries } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Loader2, BookOpen, FileText, Clock, LineChart, Award, Trophy, BookMarked, Calendar, ArrowRight, CheckCircle, ChevronRight, BarChart3 } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch user progress data
  const { data: progress, isLoading: isProgressLoading } = useQuery<UserProgress[]>({
    queryKey: ['/api/user-progress'],
    enabled: !!user,
  });

  // Fetch enrolled courses
  const { data: courses, isLoading: isCoursesLoading } = useQuery<Course[]>({
    queryKey: ['/api/courses'],
    enabled: !!user,
  });

  // Fetch mock tests
  const { data: tests, isLoading: isTestsLoading } = useQuery<MockTest[]>({
    queryKey: ['/api/mock-tests'],
    enabled: !!user,
  });

  // Fetch test series
  const { data: testSeries, isLoading: isSeriesLoading } = useQuery<TestSeries[]>({
    queryKey: ['/api/test-series'],
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <p>Please log in to view your dashboard</p>
            <Button className="mt-4" onClick={() => setLocation("/auth")}>
              Go to Login
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isProgressLoading || isCoursesLoading || isTestsLoading || isSeriesLoading) {
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

  // Filter courses user is enrolled in
  const enrolledCourses = courses?.filter(course => 
    progress?.some(p => p.courseId === course.id)
  ) || [];

  // Get user's test progress
  const testProgress = progress?.filter(p => p.testId !== null) || [];

  // Get completed tests
  const completedTests = testProgress.filter(p => p.status === "completed");

  // Get course progress
  const courseProgress = progress?.filter(p => p.courseId !== null) || [];

  // Calculate average score from test results
  const averageScore = completedTests.length > 0 
    ? completedTests.reduce((sum, p) => sum + (p.score || 0), 0) / completedTests.length 
    : 0;

  // Recent activity - combine and sort by updatedAt
  const recentActivity = [...testProgress, ...courseProgress]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-8 bg-neutral-50">
        <div className="container px-4 mx-auto">
          {/* Dashboard Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-neutral-600">
              Welcome back, {user.fullName}! Track your progress and continue learning.
            </p>
          </div>

          {/* Dashboard Tabs */}
          <Tabs 
            defaultValue="overview" 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="space-y-6"
          >
            <TabsList className="bg-white border p-1">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="courses">My Courses</TabsTrigger>
              <TabsTrigger value="tests">My Tests</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-neutral-500">Enrolled Courses</p>
                        <h3 className="text-2xl font-bold mt-1">{enrolledCourses.length}</h3>
                      </div>
                      <div className="bg-primary-light p-3 rounded-full">
                        <BookOpen className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-neutral-500">Tests Completed</p>
                        <h3 className="text-2xl font-bold mt-1">{completedTests.length}</h3>
                      </div>
                      <div className="bg-primary-light p-3 rounded-full">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-neutral-500">Study Time</p>
                        <h3 className="text-2xl font-bold mt-1">{(enrolledCourses.length * 3 + completedTests.length * 1.5).toFixed(1)} hrs</h3>
                      </div>
                      <div className="bg-primary-light p-3 rounded-full">
                        <Clock className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-neutral-500">Avg. Test Score</p>
                        <h3 className="text-2xl font-bold mt-1">{averageScore.toFixed(1)}%</h3>
                      </div>
                      <div className="bg-primary-light p-3 rounded-full">
                        <LineChart className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Continue Learning and Recent Tests */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Continue Learning</CardTitle>
                    <CardDescription>
                      Pick up where you left off
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {enrolledCourses.length > 0 ? (
                      <div className="space-y-6">
                        {enrolledCourses.slice(0, 3).map((course) => {
                          const currentProgress = courseProgress.find(p => p.courseId === course.id);
                          const progress = currentProgress?.progress || 0;
                          
                          return (
                            <div key={course.id} className="flex flex-col sm:flex-row gap-4 items-center">
                              <div className="w-full sm:w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
                                <img 
                                  src={course.imageUrl} 
                                  alt={course.title} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-grow">
                                <h4 className="font-medium mb-1">{course.title}</h4>
                                <div className="text-sm text-neutral-600 mb-2">
                                  {progress}% complete • Last accessed {formatDate(currentProgress?.updatedAt || new Date())}
                                </div>
                                <Progress value={progress} className="h-2 mb-2" />
                                <Button 
                                  variant="link" 
                                  className="p-0 h-auto text-primary"
                                  onClick={() => setLocation(`/course/${course.id}`)}
                                >
                                  Continue Learning <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <BookOpen className="h-12 w-12 mx-auto text-neutral-300 mb-4" />
                        <h3 className="text-lg font-medium mb-2">No courses enrolled</h3>
                        <p className="text-neutral-600 mb-4">
                          You haven't enrolled in any courses yet.
                        </p>
                        <Button onClick={() => setLocation("/courses")}>
                          Browse Courses
                        </Button>
                      </div>
                    )}
                  </CardContent>
                  {enrolledCourses.length > 0 && (
                    <CardFooter className="border-t pt-6">
                      <Button variant="outline" className="w-full" onClick={() => setActiveTab("courses")}>
                        View All Courses
                      </Button>
                    </CardFooter>
                  )}
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>
                      Your latest learning activity
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {recentActivity.length > 0 ? (
                      <div className="space-y-4">
                        {recentActivity.map((activity, index) => {
                          const isCourse = activity.courseId !== null;
                          const relatedCourse = isCourse 
                            ? courses?.find(c => c.id === activity.courseId) 
                            : undefined;
                          const relatedTest = !isCourse 
                            ? tests?.find(t => t.id === activity.testId) 
                            : undefined;
                          const title = relatedCourse?.title || relatedTest?.title || "Activity";
                          
                          return (
                            <div key={index} className="flex items-start">
                              <div className={`p-2 rounded-full mr-3 ${isCourse ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                                {isCourse ? (
                                  <BookOpen className="h-4 w-4" />
                                ) : (
                                  <FileText className="h-4 w-4" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium">{title}</p>
                                <p className="text-sm text-neutral-600">
                                  {isCourse 
                                    ? `Progress: ${activity.progress}%` 
                                    : activity.status === "completed" 
                                      ? `Completed with score: ${activity.score}%` 
                                      : "Started the test"}
                                </p>
                                <p className="text-xs text-neutral-500">
                                  {formatDate(activity.updatedAt)}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 mx-auto text-neutral-300 mb-4" />
                        <h3 className="text-lg font-medium mb-2">No recent activity</h3>
                        <p className="text-neutral-600">
                          Start learning to track your progress
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Achievements and Upcoming Tests */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Achievements</CardTitle>
                    <CardDescription>
                      Track your learning milestones
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {completedTests.length > 0 || enrolledCourses.length > 0 ? (
                      <div className="space-y-4">
                        {completedTests.length > 0 && (
                          <div className="flex items-start">
                            <div className="bg-yellow-100 text-yellow-600 p-2 rounded-full mr-3">
                              <Trophy className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-medium">Test Master</p>
                              <p className="text-sm text-neutral-600">
                                Completed {completedTests.length} test{completedTests.length !== 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                        )}

                        {enrolledCourses.length > 0 && (
                          <div className="flex items-start">
                            <div className="bg-purple-100 text-purple-600 p-2 rounded-full mr-3">
                              <BookMarked className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-medium">Course Explorer</p>
                              <p className="text-sm text-neutral-600">
                                Enrolled in {enrolledCourses.length} course{enrolledCourses.length !== 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                        )}

                        {averageScore > 70 && (
                          <div className="flex items-start">
                            <div className="bg-green-100 text-green-600 p-2 rounded-full mr-3">
                              <Award className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-medium">High Scorer</p>
                              <p className="text-sm text-neutral-600">
                                Achieved average score above 70%
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Award className="h-12 w-12 mx-auto text-neutral-300 mb-4" />
                        <h3 className="text-lg font-medium mb-2">No achievements yet</h3>
                        <p className="text-neutral-600 mb-4">
                          Complete courses and tests to earn achievements
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Recommended for You</CardTitle>
                    <CardDescription>
                      Based on your learning activity
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {courses?.slice(0, 2).map((course) => (
                        <Card key={course.id} className="overflow-hidden">
                          <div className="h-32 w-full">
                            <img 
                              src={course.imageUrl} 
                              alt={course.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <CardContent className="p-4">
                            <h4 className="font-medium mb-1 line-clamp-1">{course.title}</h4>
                            <p className="text-sm text-neutral-600 mb-2 line-clamp-2">{course.description}</p>
                            <Button 
                              variant="ghost" 
                              className="p-0 h-auto text-primary text-sm"
                              onClick={() => setLocation(`/course/${course.id}`)}
                            >
                              View Course <ArrowRight className="h-3 w-3 ml-1" />
                            </Button>
                          </CardContent>
                        </Card>
                      ))}

                      {testSeries?.slice(0, 2).map((series) => (
                        <Card key={series.id} className="border-primary-light border-l-4">
                          <CardContent className="p-4">
                            <h4 className="font-medium mb-1">{series.title}</h4>
                            <p className="text-sm text-neutral-600 mb-2 line-clamp-2">{series.description}</p>
                            <div className="flex justify-between items-center">
                              <Badge variant="outline">{series.testsCount} Tests</Badge>
                              <Button 
                                variant="ghost" 
                                className="p-0 h-auto text-primary text-sm"
                                onClick={() => setLocation(`/test/${series.id}`)}
                              >
                                View Details <ArrowRight className="h-3 w-3 ml-1" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Courses Tab */}
            <TabsContent value="courses" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>My Enrolled Courses</CardTitle>
                  <CardDescription>
                    Track your progress in all enrolled courses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {enrolledCourses.length > 0 ? (
                    <div className="space-y-6">
                      {enrolledCourses.map((course) => {
                        const currentProgress = courseProgress.find(p => p.courseId === course.id);
                        const progress = currentProgress?.progress || 0;
                        
                        return (
                          <div key={course.id} className="border rounded-lg overflow-hidden">
                            <div className="p-4 flex flex-col md:flex-row gap-4">
                              <div className="md:w-48 h-32 rounded-md overflow-hidden flex-shrink-0">
                                <img 
                                  src={course.imageUrl} 
                                  alt={course.title} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-grow">
                                <h3 className="text-lg font-semibold mb-1">{course.title}</h3>
                                <p className="text-sm text-neutral-600 mb-2">{course.description}</p>
                                
                                <div className="flex flex-wrap gap-3 text-sm mb-3">
                                  <Badge variant="outline" className="flex items-center">
                                    <BookOpen className="mr-1 h-4 w-4" /> {course.lessonsCount} Lessons
                                  </Badge>
                                  <Badge variant="outline" className="flex items-center">
                                    <Clock className="mr-1 h-4 w-4" /> {course.duration}
                                  </Badge>
                                  <Badge variant="outline" className="flex items-center">
                                    <Award className="mr-1 h-4 w-4" /> {course.level}
                                  </Badge>
                                </div>
                                
                                <div className="mb-2">
                                  <div className="flex justify-between text-sm mb-1">
                                    <span>Progress</span>
                                    <span>{progress}%</span>
                                  </div>
                                  <Progress value={progress} className="h-2" />
                                </div>
                                
                                <div className="flex justify-end mt-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="mr-2"
                                    onClick={() => setLocation(`/course/${course.id}`)}
                                  >
                                    View Details
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => setLocation(`/course/${course.id}`)}
                                  >
                                    Continue Learning
                                  </Button>
                                </div>
                              </div>
                            </div>
                            
                            {progress > 0 && (
                              <div className="bg-neutral-50 px-4 py-2 border-t">
                                <div className="text-sm">
                                  <span className="text-neutral-600">Last accessed: </span>
                                  <span>{formatDate(currentProgress?.updatedAt || new Date())}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <BookOpen className="h-16 w-16 mx-auto text-neutral-300 mb-4" />
                      <h3 className="text-xl font-medium mb-2">No courses enrolled</h3>
                      <p className="text-neutral-600 mb-6">
                        You haven't enrolled in any courses yet. Browse our catalog to get started.
                      </p>
                      <Button onClick={() => setLocation("/courses")}>
                        Browse Courses
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommended Courses</CardTitle>
                  <CardDescription>
                    Courses that might interest you
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {courses?.filter(course => !enrolledCourses.includes(course))
                      .slice(0, 3)
                      .map((course) => (
                        <Card key={course.id} className="overflow-hidden">
                          <div className="aspect-video w-full">
                            <img 
                              src={course.imageUrl} 
                              alt={course.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <CardContent className="p-4">
                            <h4 className="font-medium mb-1 line-clamp-1">{course.title}</h4>
                            <p className="text-sm text-neutral-600 mb-2 line-clamp-2">{course.description}</p>
                            <div className="flex justify-between items-center">
                              <Badge variant="outline">{course.level}</Badge>
                              <Button 
                                variant="ghost" 
                                className="p-0 h-auto text-primary text-sm"
                                onClick={() => setLocation(`/course/${course.id}`)}
                              >
                                View Details <ArrowRight className="h-3 w-3 ml-1" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    }
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-6">
                  <Button variant="outline" className="w-full" onClick={() => setLocation("/courses")}>
                    Browse All Courses
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Tests Tab */}
            <TabsContent value="tests" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>My Test Results</CardTitle>
                  <CardDescription>
                    View your performance in past tests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {completedTests.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 font-medium">Test Name</th>
                            <th className="text-center py-3 px-4 font-medium">Score</th>
                            <th className="text-center py-3 px-4 font-medium">Status</th>
                            <th className="text-center py-3 px-4 font-medium">Date</th>
                            <th className="text-right py-3 px-4 font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {completedTests.map((testProg) => {
                            const test = tests?.find(t => t.id === testProg.testId);
                            return (
                              <tr key={testProg.id} className="border-b">
                                <td className="py-3 px-4">
                                  <div className="font-medium">{test?.title || "Unknown Test"}</div>
                                  <div className="text-sm text-neutral-600">{test?.description}</div>
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <Badge className={`${(testProg.score || 0) >= (test?.passingScore || 60) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {testProg.score}%
                                  </Badge>
                                </td>
                                <td className="py-3 px-4 text-center">
                                  {(testProg.score || 0) >= (test?.passingScore || 60) ? (
                                    <Badge variant="outline" className="border-green-500 text-green-600">
                                      <CheckCircle className="mr-1 h-3 w-3" /> Passed
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline" className="border-red-500 text-red-600">
                                      Failed
                                    </Badge>
                                  )}
                                </td>
                                <td className="py-3 px-4 text-center text-sm text-neutral-600">
                                  {formatDate(testProg.completedAt || testProg.updatedAt)}
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => setLocation(`/take-test/${testProg.testId}`)}
                                  >
                                    Retake
                                  </Button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="h-16 w-16 mx-auto text-neutral-300 mb-4" />
                      <h3 className="text-xl font-medium mb-2">No test results yet</h3>
                      <p className="text-neutral-600 mb-6">
                        You haven't completed any tests yet. Take some tests to see your results here.
                      </p>
                      <Button onClick={() => setLocation("/tests")}>
                        Browse Test Series
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Available Tests</CardTitle>
                  <CardDescription>
                    Tests you can take to practice for your exams
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tests?.slice(0, 6).map((test) => {
                      const progress = testProgress.find(p => p.testId === test.id);
                      const completed = progress?.status === "completed";
                      
                      return (
                        <Card key={test.id} className={`border-l-4 ${completed ? 'border-green-500' : 'border-primary'}`}>
                          <CardContent className="p-4">
                            <h4 className="font-medium mb-1">{test.title}</h4>
                            <div className="mb-3 flex flex-wrap gap-2">
                              <Badge variant="outline" className="text-xs">
                                {test.duration} mins
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {test.totalQuestions} questions
                              </Badge>
                              {completed && (
                                <Badge className="bg-green-100 text-green-800 text-xs">
                                  Score: {progress.score}%
                                </Badge>
                              )}
                            </div>
                            <Button 
                              size="sm" 
                              className="w-full"
                              onClick={() => setLocation(`/take-test/${test.id}`)}
                            >
                              {completed ? 'Retake Test' : 'Start Test'}
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-6">
                  <Button variant="outline" className="w-full" onClick={() => setLocation("/tests")}>
                    View All Tests
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Performance Tab */}
            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Overall Progress</CardTitle>
                    <CardDescription>
                      Your learning journey so far
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between mb-2">
                          <h4 className="font-medium">Courses</h4>
                          <span className="text-sm text-neutral-600">
                            {enrolledCourses.length} enrolled
                          </span>
                        </div>
                        <Progress 
                          value={
                            enrolledCourses.length > 0 
                              ? courseProgress.reduce((sum, p) => sum + (p.progress || 0), 0) / enrolledCourses.length 
                              : 0
                          } 
                          className="h-2" 
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <h4 className="font-medium">Tests</h4>
                          <span className="text-sm text-neutral-600">
                            {completedTests.length} completed
                          </span>
                        </div>
                        <Progress 
                          value={
                            tests 
                              ? (completedTests.length / tests.length) * 100 
                              : 0
                          } 
                          className="h-2" 
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <h4 className="font-medium">Test Score</h4>
                          <span className="text-sm text-neutral-600">
                            {averageScore.toFixed(1)}% average
                          </span>
                        </div>
                        <Progress 
                          value={averageScore} 
                          className="h-2" 
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Performance Analysis</CardTitle>
                    <CardDescription>
                      Trends and patterns in your test results
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {completedTests.length > 0 ? (
                      <div className="h-64 flex items-center justify-center">
                        <div className="text-center">
                          <BarChart3 className="h-16 w-16 mx-auto text-primary mb-4" />
                          <h3 className="text-lg font-medium mb-2">Performance Data</h3>
                          <p className="text-neutral-600">
                            Your test performance visualization would appear here
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <BarChart3 className="h-16 w-16 mx-auto text-neutral-300 mb-4" />
                        <h3 className="text-xl font-medium mb-2">No performance data yet</h3>
                        <p className="text-neutral-600 mb-6">
                          Complete tests to see your performance analysis
                        </p>
                        <Button onClick={() => setLocation("/tests")}>
                          Take a Test
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Subject-wise Performance</CardTitle>
                  <CardDescription>
                    Your strengths and areas for improvement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {completedTests.length > 0 ? (
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-medium mb-4">Quantitative Aptitude</h4>
                        <div className="flex items-center">
                          <Progress value={75} className="h-2 flex-grow mr-4" />
                          <span className="font-medium w-12 text-right">75%</span>
                        </div>
                        <p className="text-sm text-neutral-600 mt-2">Strong performance. Keep practicing complex problems.</p>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="font-medium mb-4">Reasoning & Logical Ability</h4>
                        <div className="flex items-center">
                          <Progress value={83} className="h-2 flex-grow mr-4" />
                          <span className="font-medium w-12 text-right">83%</span>
                        </div>
                        <p className="text-sm text-neutral-600 mt-2">Excellent. Your strongest subject area.</p>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="font-medium mb-4">General Knowledge</h4>
                        <div className="flex items-center">
                          <Progress value={62} className="h-2 flex-grow mr-4" />
                          <span className="font-medium w-12 text-right">62%</span>
                        </div>
                        <p className="text-sm text-neutral-600 mt-2">Area for improvement. Spend more time on current affairs.</p>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="font-medium mb-4">English Language</h4>
                        <div className="flex items-center">
                          <Progress value={70} className="h-2 flex-grow mr-4" />
                          <span className="font-medium w-12 text-right">70%</span>
                        </div>
                        <p className="text-sm text-neutral-600 mt-2">Good. Focus more on grammar and vocabulary.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <LineChart className="h-16 w-16 mx-auto text-neutral-300 mb-4" />
                      <h3 className="text-lg font-medium mb-2">No subject data available</h3>
                      <p className="text-neutral-600">
                        Complete more tests to see your subject-wise performance
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
