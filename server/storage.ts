import { 
  users, type User, type InsertUser,
  courses, type Course, type InsertCourse, 
  examCategories, type ExamCategory, type InsertExamCategory,
  testSeries, type TestSeries, type InsertTestSeries,
  mockTests, type MockTest, type InsertMockTest,
  questions, type Question, type InsertQuestion,
  userProgress, type UserProgress, type InsertUserProgress,
  studyMaterials, type StudyMaterial, type InsertStudyMaterial
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Course methods
  getCourses(): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  getCoursesByCategory(categoryId: number): Promise<Course[]>;
  createCourse(course: InsertCourse): Promise<Course>;

  // Exam Category methods
  getExamCategories(): Promise<ExamCategory[]>;
  getExamCategory(id: number): Promise<ExamCategory | undefined>;
  getExamCategoryBySlug(slug: string): Promise<ExamCategory | undefined>;
  createExamCategory(category: InsertExamCategory): Promise<ExamCategory>;

  // Test Series methods
  getTestSeries(): Promise<TestSeries[]>;
  getTestSeriesByCategory(categoryId: number): Promise<TestSeries[]>;
  createTestSeries(testSeries: InsertTestSeries): Promise<TestSeries>;

  // Mock Test methods
  getMockTests(): Promise<MockTest[]>;
  getMockTest(id: number): Promise<MockTest | undefined>;
  getMockTestsBySeriesId(seriesId: number): Promise<MockTest[]>;
  createMockTest(mockTest: InsertMockTest): Promise<MockTest>;

  // Question methods
  getQuestions(testId: number): Promise<Question[]>;
  createQuestion(question: InsertQuestion): Promise<Question>;

  // User Progress methods
  getUserProgressByUserId(userId: number): Promise<UserProgress[]>;
  getUserCourseProgress(userId: number, courseId: number): Promise<UserProgress | undefined>;
  getUserTestProgress(userId: number, testId: number): Promise<UserProgress | undefined>;
  createOrUpdateUserProgress(progress: InsertUserProgress): Promise<UserProgress>;

  // Study Materials methods
  getStudyMaterials(): Promise<StudyMaterial[]>;
  getStudyMaterialsByCategory(categoryId: number): Promise<StudyMaterial[]>;
  createStudyMaterial(material: InsertStudyMaterial): Promise<StudyMaterial>;

  // Session store
  sessionStore: session.SessionStore;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24 hours
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Course methods
  async getCourses(): Promise<Course[]> {
    return db.select().from(courses);
  }

  async getCourse(id: number): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course;
  }

  async getCoursesByCategory(categoryId: number): Promise<Course[]> {
    return db.select().from(courses).where(eq(courses.categoryId, categoryId));
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const [newCourse] = await db.insert(courses).values(course).returning();
    return newCourse;
  }

  // Exam Category methods
  async getExamCategories(): Promise<ExamCategory[]> {
    return db.select().from(examCategories);
  }

  async getExamCategory(id: number): Promise<ExamCategory | undefined> {
    const [category] = await db.select().from(examCategories).where(eq(examCategories.id, id));
    return category;
  }

  async getExamCategoryBySlug(slug: string): Promise<ExamCategory | undefined> {
    const [category] = await db.select().from(examCategories).where(eq(examCategories.slug, slug));
    return category;
  }

  async createExamCategory(category: InsertExamCategory): Promise<ExamCategory> {
    const [newCategory] = await db.insert(examCategories).values(category).returning();
    return newCategory;
  }

  // Test Series methods
  async getTestSeries(): Promise<TestSeries[]> {
    return db.select().from(testSeries);
  }

  async getTestSeriesByCategory(categoryId: number): Promise<TestSeries[]> {
    return db.select().from(testSeries).where(eq(testSeries.categoryId, categoryId));
  }

  async createTestSeries(series: InsertTestSeries): Promise<TestSeries> {
    const [newSeries] = await db.insert(testSeries).values(series).returning();
    return newSeries;
  }

  // Mock Test methods
  async getMockTests(): Promise<MockTest[]> {
    return db.select().from(mockTests);
  }

  async getMockTest(id: number): Promise<MockTest | undefined> {
    const [test] = await db.select().from(mockTests).where(eq(mockTests.id, id));
    return test;
  }

  async getMockTestsBySeriesId(seriesId: number): Promise<MockTest[]> {
    return db.select().from(mockTests).where(eq(mockTests.seriesId, seriesId));
  }

  async createMockTest(mockTest: InsertMockTest): Promise<MockTest> {
    const [newTest] = await db.insert(mockTests).values(mockTest).returning();
    return newTest;
  }

  // Question methods
  async getQuestions(testId: number): Promise<Question[]> {
    return db.select().from(questions).where(eq(questions.testId, testId));
  }

  async createQuestion(question: InsertQuestion): Promise<Question> {
    const [newQuestion] = await db.insert(questions).values(question).returning();
    return newQuestion;
  }

  // User Progress methods
  async getUserProgressByUserId(userId: number): Promise<UserProgress[]> {
    return db.select().from(userProgress).where(eq(userProgress.userId, userId));
  }

  async getUserCourseProgress(userId: number, courseId: number): Promise<UserProgress | undefined> {
    const [progress] = await db.select().from(userProgress)
      .where(eq(userProgress.userId, userId))
      .where(eq(userProgress.courseId, courseId));
    return progress;
  }

  async getUserTestProgress(userId: number, testId: number): Promise<UserProgress | undefined> {
    const [progress] = await db.select().from(userProgress)
      .where(eq(userProgress.userId, userId))
      .where(eq(userProgress.testId, testId));
    return progress;
  }

  async createOrUpdateUserProgress(progress: InsertUserProgress): Promise<UserProgress> {
    // Check if progress exists
    let existingProgress;
    
    if (progress.courseId) {
      existingProgress = await this.getUserCourseProgress(progress.userId, progress.courseId);
    } else if (progress.testId) {
      existingProgress = await this.getUserTestProgress(progress.userId, progress.testId!);
    }

    if (existingProgress) {
      // Update existing progress
      const [updatedProgress] = await db.update(userProgress)
        .set({
          ...progress,
          updatedAt: new Date(),
        })
        .where(eq(userProgress.id, existingProgress.id))
        .returning();
      return updatedProgress;
    } else {
      // Create new progress
      const [newProgress] = await db.insert(userProgress)
        .values(progress)
        .returning();
      return newProgress;
    }
  }

  // Study Materials methods
  async getStudyMaterials(): Promise<StudyMaterial[]> {
    return db.select().from(studyMaterials);
  }

  async getStudyMaterialsByCategory(categoryId: number): Promise<StudyMaterial[]> {
    return db.select().from(studyMaterials).where(eq(studyMaterials.categoryId, categoryId));
  }

  async createStudyMaterial(material: InsertStudyMaterial): Promise<StudyMaterial> {
    const [newMaterial] = await db.insert(studyMaterials).values(material).returning();
    return newMaterial;
  }
}

export class MemStorage implements IStorage {
  // Data storage
  private usersData: Map<number, User>;
  private coursesData: Map<number, Course>;
  private examCategoriesData: Map<number, ExamCategory>;
  private testSeriesData: Map<number, TestSeries>;
  private mockTestsData: Map<number, MockTest>;
  private questionsData: Map<number, Question[]>;
  private userProgressData: Map<string, UserProgress>;
  private studyMaterialsData: Map<number, StudyMaterial>;
  
  // ID counters
  private userId: number;
  private courseId: number;
  private categoryId: number;
  private seriesId: number;
  private testId: number;
  private questionId: number;
  private progressId: number;
  private materialId: number;

  // Session store
  sessionStore: session.SessionStore;

  constructor() {
    this.usersData = new Map();
    this.coursesData = new Map();
    this.examCategoriesData = new Map();
    this.testSeriesData = new Map();
    this.mockTestsData = new Map();
    this.questionsData = new Map();
    this.userProgressData = new Map();
    this.studyMaterialsData = new Map();
    
    this.userId = 1;
    this.courseId = 1;
    this.categoryId = 1;
    this.seriesId = 1;
    this.testId = 1;
    this.questionId = 1;
    this.progressId = 1;
    this.materialId = 1;

    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24 hours
    });

    // Initialize with demo data
    this.initDemoData();
  }

  private initDemoData() {
    // Add exam categories
    const categories = [
      {
        name: "Banking & Insurance",
        description: "SBI, IBPS, RBI, LIC & more",
        icon: "fa-university",
        slug: "banking-insurance"
      },
      {
        name: "SSC & Railways",
        description: "SSC CGL, CHSL, RRB & more",
        icon: "fa-train",
        slug: "ssc-railways"
      },
      {
        name: "JEE & NEET",
        description: "Engineering & Medical entrances",
        icon: "fa-graduation-cap",
        slug: "jee-neet"
      },
      {
        name: "GATE & ESE",
        description: "Engineering services exams",
        icon: "fa-cogs",
        slug: "gate-ese"
      }
    ];

    categories.forEach(category => {
      this.createExamCategory(category);
    });
    
    // Add courses
    const courses = [
      {
        title: "Complete Banking & Finance Course",
        description: "Comprehensive preparation for all banking exams including SBI PO, IBPS PO, RBI Grade B and more.",
        categoryId: 1,
        instructor: "Dr. Rajesh Kumar",
        duration: "80 Hours",
        level: "All Levels",
        lessonsCount: 120,
        price: 9999,
        discountPrice: 3999,
        imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655",
        rating: 48,
        ratingCount: 2450,
        enrolledCount: 18200,
        isBestseller: true,
        isNew: false
      },
      {
        title: "SSC CGL Complete Package",
        description: "Master all subjects required for SSC CGL examination with expert guidance and practice tests.",
        categoryId: 2,
        instructor: "Prof. Meera Singh",
        duration: "90 Hours",
        level: "Beginner to Advanced",
        lessonsCount: 150,
        price: 11999,
        discountPrice: 4499,
        imageUrl: "https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0",
        rating: 47,
        ratingCount: 1890,
        enrolledCount: 12450,
        isBestseller: false,
        isNew: true
      },
      {
        title: "GATE Electrical Engineering",
        description: "Comprehensive course covering all topics for GATE EE with detailed solutions and mock tests.",
        categoryId: 4,
        instructor: "Prof. Sunil Sharma",
        duration: "110 Hours",
        level: "Advanced",
        lessonsCount: 180,
        price: 13999,
        discountPrice: 5999,
        imageUrl: "https://images.unsplash.com/photo-1581094794329-c8112a89af12",
        rating: 49,
        ratingCount: 950,
        enrolledCount: 8320,
        isBestseller: false,
        isNew: false
      }
    ];

    courses.forEach(course => {
      this.createCourse(course);
    });

    // Add test series
    const testSeries = [
      {
        title: "SBI PO Prelims",
        description: "20 Mock Tests for SBI PO Prelims exam preparation",
        categoryId: 1,
        testsCount: 20,
        price: 1499,
        discountPrice: 599,
        features: ["Bilingual tests (Hindi & English)", "Detailed performance analysis", "Exam pattern based questions"],
        tag: "Popular"
      },
      {
        title: "SSC CGL Tier 1",
        description: "30 Mock Tests for SSC CGL Tier 1 exam preparation",
        categoryId: 2,
        testsCount: 30,
        price: 1799,
        discountPrice: 699,
        features: ["Based on latest exam pattern", "Topic-wise analysis", "Detailed solutions"],
        tag: "New"
      },
      {
        title: "JEE Main",
        description: "25 Mock Tests for JEE Main exam preparation",
        categoryId: 3,
        testsCount: 25,
        price: 1999,
        discountPrice: 799,
        features: ["NTA exam pattern", "Previous years' questions", "Step-by-step solutions"],
        tag: "Trending"
      }
    ];

    testSeries.forEach(series => {
      this.createTestSeries(series);
    });

    // Add mock tests
    const mockTests = [
      {
        title: "SBI PO Prelims Mock Test 1",
        description: "First mock test for SBI PO Prelims",
        seriesId: 1,
        duration: 60,
        totalQuestions: 100,
        passingScore: 60,
        isActive: true
      },
      {
        title: "SSC CGL Tier 1 Mock Test 1",
        description: "First mock test for SSC CGL Tier 1",
        seriesId: 2,
        duration: 60,
        totalQuestions: 100,
        passingScore: 60,
        isActive: true
      }
    ];

    mockTests.forEach(test => {
      this.createMockTest(test);
    });

    // Add study materials
    const studyMaterials = [
      {
        title: "Banking Awareness PDF",
        description: "Complete banking awareness notes for all banking exams",
        type: "PDF",
        categoryId: 1,
        fileUrl: "/materials/banking-awareness.pdf",
        thumbnailUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8",
        isFree: true
      },
      {
        title: "Current Affairs May 2023",
        description: "Monthly compilation of current affairs for competitive exams",
        type: "PDF",
        categoryId: 1,
        fileUrl: "/materials/current-affairs-may-2023.pdf",
        thumbnailUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173",
        isFree: true
      },
      {
        title: "Fundamentals of Reasoning",
        description: "Video lectures on reasoning for all competitive exams",
        type: "Video",
        categoryId: 2,
        fileUrl: "/materials/reasoning-fundamentals.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1610484826967-09c5720778c7",
        isFree: true
      }
    ];

    studyMaterials.forEach(material => {
      this.createStudyMaterial(material);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.usersData.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersData.values()).find(
      (user) => user.username === username
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.usersData.values()).find(
      (user) => user.email === email
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      role: "user",
      createdAt: now
    };
    this.usersData.set(id, user);
    return user;
  }

  // Course methods
  async getCourses(): Promise<Course[]> {
    return Array.from(this.coursesData.values());
  }

  async getCourse(id: number): Promise<Course | undefined> {
    return this.coursesData.get(id);
  }

  async getCoursesByCategory(categoryId: number): Promise<Course[]> {
    return Array.from(this.coursesData.values()).filter(
      course => course.categoryId === categoryId
    );
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const id = this.courseId++;
    const now = new Date();
    const newCourse: Course = {
      ...course,
      id,
      createdAt: now
    };
    this.coursesData.set(id, newCourse);
    return newCourse;
  }

  // Exam Category methods
  async getExamCategories(): Promise<ExamCategory[]> {
    return Array.from(this.examCategoriesData.values());
  }

  async getExamCategory(id: number): Promise<ExamCategory | undefined> {
    return this.examCategoriesData.get(id);
  }

  async getExamCategoryBySlug(slug: string): Promise<ExamCategory | undefined> {
    return Array.from(this.examCategoriesData.values()).find(
      category => category.slug === slug
    );
  }

  async createExamCategory(category: InsertExamCategory): Promise<ExamCategory> {
    const id = this.categoryId++;
    const newCategory: ExamCategory = {
      ...category,
      id
    };
    this.examCategoriesData.set(id, newCategory);
    return newCategory;
  }

  // Test Series methods
  async getTestSeries(): Promise<TestSeries[]> {
    return Array.from(this.testSeriesData.values());
  }

  async getTestSeriesByCategory(categoryId: number): Promise<TestSeries[]> {
    return Array.from(this.testSeriesData.values()).filter(
      series => series.categoryId === categoryId
    );
  }

  async createTestSeries(series: InsertTestSeries): Promise<TestSeries> {
    const id = this.seriesId++;
    const now = new Date();
    const newSeries: TestSeries = {
      ...series,
      id,
      createdAt: now
    };
    this.testSeriesData.set(id, newSeries);
    return newSeries;
  }

  // Mock Test methods
  async getMockTests(): Promise<MockTest[]> {
    return Array.from(this.mockTestsData.values());
  }

  async getMockTest(id: number): Promise<MockTest | undefined> {
    return this.mockTestsData.get(id);
  }

  async getMockTestsBySeriesId(seriesId: number): Promise<MockTest[]> {
    return Array.from(this.mockTestsData.values()).filter(
      test => test.seriesId === seriesId
    );
  }

  async createMockTest(mockTest: InsertMockTest): Promise<MockTest> {
    const id = this.testId++;
    const now = new Date();
    const newTest: MockTest = {
      ...mockTest,
      id,
      createdAt: now
    };
    this.mockTestsData.set(id, newTest);
    return newTest;
  }

  // Question methods
  async getQuestions(testId: number): Promise<Question[]> {
    return this.questionsData.get(testId) || [];
  }

  async createQuestion(question: InsertQuestion): Promise<Question> {
    const id = this.questionId++;
    const now = new Date();
    const newQuestion: Question = {
      ...question,
      id,
      createdAt: now
    };
    
    const testQuestions = this.questionsData.get(question.testId) || [];
    testQuestions.push(newQuestion);
    this.questionsData.set(question.testId, testQuestions);
    
    return newQuestion;
  }

  // User Progress methods
  async getUserProgressByUserId(userId: number): Promise<UserProgress[]> {
    return Array.from(this.userProgressData.values()).filter(
      progress => progress.userId === userId
    );
  }

  async getUserCourseProgress(userId: number, courseId: number): Promise<UserProgress | undefined> {
    const key = `${userId}-course-${courseId}`;
    return this.userProgressData.get(key);
  }

  async getUserTestProgress(userId: number, testId: number): Promise<UserProgress | undefined> {
    const key = `${userId}-test-${testId}`;
    return this.userProgressData.get(key);
  }

  async createOrUpdateUserProgress(progress: InsertUserProgress): Promise<UserProgress> {
    const now = new Date();
    let key: string;
    
    if (progress.courseId) {
      key = `${progress.userId}-course-${progress.courseId}`;
    } else if (progress.testId) {
      key = `${progress.userId}-test-${progress.testId}`;
    } else {
      throw new Error("Either courseId or testId must be provided");
    }
    
    const existingProgress = this.userProgressData.get(key);
    
    if (existingProgress) {
      // Update existing progress
      const updatedProgress: UserProgress = {
        ...existingProgress,
        ...progress,
        updatedAt: now
      };
      this.userProgressData.set(key, updatedProgress);
      return updatedProgress;
    } else {
      // Create new progress
      const id = this.progressId++;
      const newProgress: UserProgress = {
        ...progress,
        id,
        createdAt: now,
        updatedAt: now
      };
      this.userProgressData.set(key, newProgress);
      return newProgress;
    }
  }

  // Study Materials methods
  async getStudyMaterials(): Promise<StudyMaterial[]> {
    return Array.from(this.studyMaterialsData.values());
  }

  async getStudyMaterialsByCategory(categoryId: number): Promise<StudyMaterial[]> {
    return Array.from(this.studyMaterialsData.values()).filter(
      material => material.categoryId === categoryId
    );
  }

  async createStudyMaterial(material: InsertStudyMaterial): Promise<StudyMaterial> {
    const id = this.materialId++;
    const now = new Date();
    const newMaterial: StudyMaterial = {
      ...material,
      id,
      createdAt: now
    };
    this.studyMaterialsData.set(id, newMaterial);
    return newMaterial;
  }
}

export const storage = new MemStorage();
