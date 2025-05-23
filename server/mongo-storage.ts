import session from 'express-session';
import mongoose from 'mongoose';
import { 
  User, 
  Course, 
  ExamCategory, 
  TestSeries, 
  MockTest, 
  Question, 
  UserProgress, 
  StudyMaterial,
  InsertUser,
  InsertCourse,
  InsertExamCategory,
  InsertTestSeries,
  InsertMockTest,
  InsertQuestion,
  InsertUserProgress,
  InsertStudyMaterial,
  UserDocument,
  CourseDocument,
  ExamCategoryDocument,
  TestSeriesDocument,
  MockTestDocument,
  QuestionDocument,
  UserProgressDocument,
  StudyMaterialDocument
} from '@shared/models';
import MongoStore from 'connect-mongo';

export interface IStorage {
  // User methods
  getUser(id: string): Promise<UserDocument | undefined>;
  getUserByUsername(username: string): Promise<UserDocument | undefined>;
  getUserByEmail(email: string): Promise<UserDocument | undefined>;
  createUser(user: InsertUser): Promise<UserDocument>;

  // Course methods
  getCourses(): Promise<CourseDocument[]>;
  getCourse(id: string): Promise<CourseDocument | undefined>;
  getCoursesByCategory(categoryId: string): Promise<CourseDocument[]>;
  createCourse(course: InsertCourse): Promise<CourseDocument>;

  // Exam Category methods
  getExamCategories(): Promise<ExamCategoryDocument[]>;
  getExamCategory(id: string): Promise<ExamCategoryDocument | undefined>;
  getExamCategoryBySlug(slug: string): Promise<ExamCategoryDocument | undefined>;
  createExamCategory(category: InsertExamCategory): Promise<ExamCategoryDocument>;

  // Test Series methods
  getTestSeries(): Promise<TestSeriesDocument[]>;
  getTestSeriesByCategory(categoryId: string): Promise<TestSeriesDocument[]>;
  createTestSeries(testSeries: InsertTestSeries): Promise<TestSeriesDocument>;

  // Mock Test methods
  getMockTests(): Promise<MockTestDocument[]>;
  getMockTest(id: string): Promise<MockTestDocument | undefined>;
  getMockTestsBySeriesId(seriesId: string): Promise<MockTestDocument[]>;
  createMockTest(mockTest: InsertMockTest): Promise<MockTestDocument>;

  // Question methods
  getQuestions(testId: string): Promise<QuestionDocument[]>;
  createQuestion(question: InsertQuestion): Promise<QuestionDocument>;

  // User Progress methods
  getUserProgressByUserId(userId: string): Promise<UserProgressDocument[]>;
  getUserCourseProgress(userId: string, courseId: string): Promise<UserProgressDocument | undefined>;
  getUserTestProgress(userId: string, testId: string): Promise<UserProgressDocument | undefined>;
  createOrUpdateUserProgress(progress: InsertUserProgress): Promise<UserProgressDocument>;

  // Study Materials methods
  getStudyMaterials(): Promise<StudyMaterialDocument[]>;
  getStudyMaterialsByCategory(categoryId: string): Promise<StudyMaterialDocument[]>;
  createStudyMaterial(material: InsertStudyMaterial): Promise<StudyMaterialDocument>;

  // Session store
  sessionStore: session.Store;
}

export class MongoStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    // Initialize MongoDB session store
    this.sessionStore = MongoStore.create({
      mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/testbook',
      ttl: 24 * 60 * 60 // 1 day
    });
  }

  // User methods
  async getUser(id: string): Promise<UserDocument | undefined> {
    if (!mongoose.Types.ObjectId.isValid(id)) return undefined;
    const user = await User.findById(id);
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<UserDocument | undefined> {
    const user = await User.findOne({ username });
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<UserDocument | undefined> {
    const user = await User.findOne({ email });
    return user || undefined;
  }

  async createUser(userData: InsertUser): Promise<UserDocument> {
    const user = new User(userData);
    await user.save();
    return user;
  }

  // Course methods
  async getCourses(): Promise<CourseDocument[]> {
    return await Course.find();
  }

  async getCourse(id: string): Promise<CourseDocument | undefined> {
    if (!mongoose.Types.ObjectId.isValid(id)) return undefined;
    const course = await Course.findById(id);
    return course || undefined;
  }

  async getCoursesByCategory(categoryId: string): Promise<CourseDocument[]> {
    if (!mongoose.Types.ObjectId.isValid(categoryId)) return [];
    return await Course.find({ categoryId });
  }

  async createCourse(courseData: InsertCourse): Promise<CourseDocument> {
    const course = new Course(courseData);
    await course.save();
    return course;
  }

  // Exam Category methods
  async getExamCategories(): Promise<ExamCategoryDocument[]> {
    return await ExamCategory.find();
  }

  async getExamCategory(id: string): Promise<ExamCategoryDocument | undefined> {
    if (!mongoose.Types.ObjectId.isValid(id)) return undefined;
    const category = await ExamCategory.findById(id);
    return category || undefined;
  }

  async getExamCategoryBySlug(slug: string): Promise<ExamCategoryDocument | undefined> {
    const category = await ExamCategory.findOne({ slug });
    return category || undefined;
  }

  async createExamCategory(categoryData: InsertExamCategory): Promise<ExamCategoryDocument> {
    const category = new ExamCategory(categoryData);
    await category.save();
    return category;
  }

  // Test Series methods
  async getTestSeries(): Promise<TestSeriesDocument[]> {
    return await TestSeries.find();
  }

  async getTestSeriesByCategory(categoryId: string): Promise<TestSeriesDocument[]> {
    if (!mongoose.Types.ObjectId.isValid(categoryId)) return [];
    return await TestSeries.find({ categoryId });
  }

  async createTestSeries(seriesData: InsertTestSeries): Promise<TestSeriesDocument> {
    const series = new TestSeries(seriesData);
    await series.save();
    return series;
  }

  // Mock Test methods
  async getMockTests(): Promise<MockTestDocument[]> {
    return await MockTest.find();
  }

  async getMockTest(id: string): Promise<MockTestDocument | undefined> {
    if (!mongoose.Types.ObjectId.isValid(id)) return undefined;
    const test = await MockTest.findById(id);
    return test || undefined;
  }

  async getMockTestsBySeriesId(seriesId: string): Promise<MockTestDocument[]> {
    if (!mongoose.Types.ObjectId.isValid(seriesId)) return [];
    return await MockTest.find({ seriesId });
  }

  async createMockTest(testData: InsertMockTest): Promise<MockTestDocument> {
    const test = new MockTest(testData);
    await test.save();
    return test;
  }

  // Question methods
  async getQuestions(testId: string): Promise<QuestionDocument[]> {
    if (!mongoose.Types.ObjectId.isValid(testId)) return [];
    return await Question.find({ testId });
  }

  async createQuestion(questionData: InsertQuestion): Promise<QuestionDocument> {
    const question = new Question(questionData);
    await question.save();
    return question;
  }

  // User Progress methods
  async getUserProgressByUserId(userId: string): Promise<UserProgressDocument[]> {
    if (!mongoose.Types.ObjectId.isValid(userId)) return [];
    return await UserProgress.find({ userId });
  }

  async getUserCourseProgress(userId: string, courseId: string): Promise<UserProgressDocument | undefined> {
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(courseId)) return undefined;
    const progress = await UserProgress.findOne({ 
      userId, 
      itemId: courseId, 
      itemType: 'course' 
    });
    return progress || undefined;
  }

  async getUserTestProgress(userId: string, testId: string): Promise<UserProgressDocument | undefined> {
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(testId)) return undefined;
    const progress = await UserProgress.findOne({ 
      userId, 
      itemId: testId, 
      itemType: 'test' 
    });
    return progress || undefined;
  }

  async createOrUpdateUserProgress(progressData: InsertUserProgress): Promise<UserProgressDocument> {
    const { userId, itemId, itemType } = progressData;
    
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(itemId)) {
      throw new Error('Invalid user ID or item ID');
    }
    
    const existingProgress = await UserProgress.findOne({ 
      userId, 
      itemId, 
      itemType 
    });
    
    if (existingProgress) {
      // Update existing progress
      Object.assign(existingProgress, progressData);
      await existingProgress.save();
      return existingProgress;
    } else {
      // Create new progress
      const progress = new UserProgress(progressData);
      await progress.save();
      return progress;
    }
  }

  // Study Materials methods
  async getStudyMaterials(): Promise<StudyMaterialDocument[]> {
    return await StudyMaterial.find();
  }

  async getStudyMaterialsByCategory(categoryId: string): Promise<StudyMaterialDocument[]> {
    if (!mongoose.Types.ObjectId.isValid(categoryId)) return [];
    return await StudyMaterial.find({ categoryId });
  }

  async createStudyMaterial(materialData: InsertStudyMaterial): Promise<StudyMaterialDocument> {
    const material = new StudyMaterial(materialData);
    await material.save();
    return material;
  }
}

// Initialize storage
export const storage = new MongoStorage();