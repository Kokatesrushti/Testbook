import mongoose from 'mongoose';
import { z } from 'zod';

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, default: 'user' },
});

// Exam Category Schema
const examCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  icon: { type: String, required: true },
  totalTests: { type: Number, default: 0 },
  totalCourses: { type: Number, default: 0 },
});

// Course Schema
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'ExamCategory', required: true },
  instructor: { type: String, required: true },
  price: { type: Number, required: true },
  discountedPrice: { type: Number },
  duration: { type: Number, required: true }, // in minutes
  totalLessons: { type: Number, required: true },
  totalQuizzes: { type: Number, required: true },
  level: { type: String, required: true },
  thumbnail: { type: String, required: true },
  rating: { type: Number, default: 0 },
  enrollments: { type: Number, default: 0 },
});

// Test Series Schema
const testSeriesSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'ExamCategory', required: true },
  price: { type: Number, required: true },
  discountedPrice: { type: Number },
  totalTests: { type: Number, required: true },
  validityDays: { type: Number, required: true },
  thumbnail: { type: String, required: true },
  rating: { type: Number, default: 0 },
  purchases: { type: Number, default: 0 },
});

// Mock Test Schema
const mockTestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  seriesId: { type: mongoose.Schema.Types.ObjectId, ref: 'TestSeries', required: true },
  duration: { type: Number, required: true }, // in minutes
  totalQuestions: { type: Number, required: true },
  maxMarks: { type: Number, required: true },
  passingPercentage: { type: Number, required: true },
  difficulty: { type: String, required: true },
  attempts: { type: Number, default: 0 },
});

// Question Schema
const questionSchema = new mongoose.Schema({
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'MockTest', required: true },
  questionText: { type: String, required: true },
  options: { type: [String], required: true },
  correctOption: { type: Number, required: true },
  explanation: { type: String, required: true },
  marks: { type: Number, required: true },
  negativeMarks: { type: Number, default: 0 },
  subject: { type: String, required: true },
  difficulty: { type: String, required: true },
});

// User Progress Schema
const userProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
  itemType: { type: String, required: true }, // 'course' or 'test'
  progress: { type: Number, default: 0 }, // percentage
  score: { type: Number }, // for tests
  completed: { type: Boolean, default: false },
  startedAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
});

// Study Material Schema
const studyMaterialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'ExamCategory', required: true },
  fileUrl: { type: String, required: true },
  fileType: { type: String, required: true },
  pages: { type: Number },
  thumbnail: { type: String, required: true },
  downloads: { type: Number, default: 0 },
});

// Create models
export const User = mongoose.model('User', userSchema);
export const ExamCategory = mongoose.model('ExamCategory', examCategorySchema);
export const Course = mongoose.model('Course', courseSchema);
export const TestSeries = mongoose.model('TestSeries', testSeriesSchema);
export const MockTest = mongoose.model('MockTest', mockTestSchema);
export const Question = mongoose.model('Question', questionSchema);
export const UserProgress = mongoose.model('UserProgress', userProgressSchema);
export const StudyMaterial = mongoose.model('StudyMaterial', studyMaterialSchema);

// Zod Schemas for validation
export const insertUserSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string(),
  role: z.string().optional(),
});

export const insertExamCategorySchema = z.object({
  name: z.string(),
  description: z.string(),
  slug: z.string(),
  icon: z.string(),
  totalTests: z.number().optional(),
  totalCourses: z.number().optional(),
});

export const insertCourseSchema = z.object({
  title: z.string(),
  description: z.string(),
  categoryId: z.string(),
  instructor: z.string(),
  price: z.number(),
  discountedPrice: z.number().optional(),
  duration: z.number(),
  totalLessons: z.number(),
  totalQuizzes: z.number(),
  level: z.string(),
  thumbnail: z.string(),
  rating: z.number().optional(),
  enrollments: z.number().optional(),
});

export const insertTestSeriesSchema = z.object({
  title: z.string(),
  description: z.string(),
  categoryId: z.string(),
  price: z.number(),
  discountedPrice: z.number().optional(),
  totalTests: z.number(),
  validityDays: z.number(),
  thumbnail: z.string(),
  rating: z.number().optional(),
  purchases: z.number().optional(),
});

export const insertMockTestSchema = z.object({
  title: z.string(),
  description: z.string(),
  seriesId: z.string(),
  duration: z.number(),
  totalQuestions: z.number(),
  maxMarks: z.number(),
  passingPercentage: z.number(),
  difficulty: z.string(),
  attempts: z.number().optional(),
});

export const insertQuestionSchema = z.object({
  testId: z.string(),
  questionText: z.string(),
  options: z.array(z.string()),
  correctOption: z.number(),
  explanation: z.string(),
  marks: z.number(),
  negativeMarks: z.number().optional(),
  subject: z.string(),
  difficulty: z.string(),
});

export const insertUserProgressSchema = z.object({
  userId: z.string(),
  itemId: z.string(),
  itemType: z.string(),
  progress: z.number().optional(),
  score: z.number().optional(),
  completed: z.boolean().optional(),
  startedAt: z.date().optional(),
  completedAt: z.date().optional(),
});

export const insertStudyMaterialSchema = z.object({
  title: z.string(),
  description: z.string(),
  categoryId: z.string(),
  fileUrl: z.string(),
  fileType: z.string(),
  pages: z.number().optional(),
  thumbnail: z.string(),
  downloads: z.number().optional(),
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertExamCategory = z.infer<typeof insertExamCategorySchema>;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type InsertTestSeries = z.infer<typeof insertTestSeriesSchema>;
export type InsertMockTest = z.infer<typeof insertMockTestSchema>;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type InsertStudyMaterial = z.infer<typeof insertStudyMaterialSchema>;

// Document Types
export type UserDocument = mongoose.Document & {
  username: string;
  email: string;
  password: string;
  name: string;
  role: string;
};

export type ExamCategoryDocument = mongoose.Document & {
  name: string;
  description: string;
  slug: string;
  icon: string;
  totalTests: number;
  totalCourses: number;
};

export type CourseDocument = mongoose.Document & {
  title: string;
  description: string;
  categoryId: mongoose.Types.ObjectId;
  instructor: string;
  price: number;
  discountedPrice?: number;
  duration: number;
  totalLessons: number;
  totalQuizzes: number;
  level: string;
  thumbnail: string;
  rating: number;
  enrollments: number;
};

export type TestSeriesDocument = mongoose.Document & {
  title: string;
  description: string;
  categoryId: mongoose.Types.ObjectId;
  price: number;
  discountedPrice?: number;
  totalTests: number;
  validityDays: number;
  thumbnail: string;
  rating: number;
  purchases: number;
};

export type MockTestDocument = mongoose.Document & {
  title: string;
  description: string;
  seriesId: mongoose.Types.ObjectId;
  duration: number;
  totalQuestions: number;
  maxMarks: number;
  passingPercentage: number;
  difficulty: string;
  attempts: number;
};

export type QuestionDocument = mongoose.Document & {
  testId: mongoose.Types.ObjectId;
  questionText: string;
  options: string[];
  correctOption: number;
  explanation: string;
  marks: number;
  negativeMarks: number;
  subject: string;
  difficulty: string;
};

export type UserProgressDocument = mongoose.Document & {
  userId: mongoose.Types.ObjectId;
  itemId: mongoose.Types.ObjectId;
  itemType: string;
  progress: number;
  score?: number;
  completed: boolean;
  startedAt: Date;
  completedAt?: Date;
};

export type StudyMaterialDocument = mongoose.Document & {
  title: string;
  description: string;
  categoryId: mongoose.Types.ObjectId;
  fileUrl: string;
  fileType: string;
  pages?: number;
  thumbnail: string;
  downloads: number;
};