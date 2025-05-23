import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  role: text("role").default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
});

// Exam Categories
export const examCategories = pgTable("exam_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  slug: text("slug").notNull().unique(),
});

export const insertExamCategorySchema = createInsertSchema(examCategories).pick({
  name: true,
  description: true,
  icon: true,
  slug: true,
});

// Courses
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  categoryId: integer("category_id").notNull(),
  instructor: text("instructor").notNull(),
  duration: text("duration").notNull(),
  level: text("level").notNull(),
  lessonsCount: integer("lessons_count").notNull(),
  price: integer("price").notNull(),
  discountPrice: integer("discount_price"),
  imageUrl: text("image_url").notNull(),
  rating: integer("rating"),
  ratingCount: integer("rating_count").default(0),
  enrolledCount: integer("enrolled_count").default(0),
  isBestseller: boolean("is_bestseller").default(false),
  isNew: boolean("is_new").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  createdAt: true,
});

// Test Series
export const testSeries = pgTable("test_series", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  categoryId: integer("category_id").notNull(),
  testsCount: integer("tests_count").notNull(),
  price: integer("price").notNull(),
  discountPrice: integer("discount_price"),
  features: text("features").array(),
  tag: text("tag"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTestSeriesSchema = createInsertSchema(testSeries).omit({
  id: true,
  createdAt: true,
});

// Mock Tests
export const mockTests = pgTable("mock_tests", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  seriesId: integer("series_id"),
  duration: integer("duration").notNull(), // in minutes
  totalQuestions: integer("total_questions").notNull(),
  passingScore: integer("passing_score"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMockTestSchema = createInsertSchema(mockTests).omit({
  id: true,
  createdAt: true,
});

// Questions
export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  testId: integer("test_id").notNull(),
  questionText: text("question_text").notNull(),
  options: jsonb("options").notNull(), // Array of options
  correctOptionIndex: integer("correct_option_index").notNull(),
  explanation: text("explanation"),
  marks: integer("marks").default(1),
  negativeMarks: integer("negative_marks").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertQuestionSchema = createInsertSchema(questions).omit({
  id: true,
  createdAt: true,
});

// User Progress
export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  courseId: integer("course_id"),
  testId: integer("test_id"),
  progress: integer("progress").default(0), // Percentage for courses
  score: integer("score"), // For tests
  status: text("status").default("not_started"), // not_started, in_progress, completed
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Study Materials
export const studyMaterials = pgTable("study_materials", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // ebook, video, notes, etc.
  categoryId: integer("category_id").notNull(),
  fileUrl: text("file_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  isFree: boolean("is_free").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertStudyMaterialSchema = createInsertSchema(studyMaterials).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertExamCategory = z.infer<typeof insertExamCategorySchema>;
export type ExamCategory = typeof examCategories.$inferSelect;

export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof courses.$inferSelect;

export type InsertTestSeries = z.infer<typeof insertTestSeriesSchema>;
export type TestSeries = typeof testSeries.$inferSelect;

export type InsertMockTest = z.infer<typeof insertMockTestSchema>;
export type MockTest = typeof mockTests.$inferSelect;

export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type Question = typeof questions.$inferSelect;

export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserProgress = typeof userProgress.$inferSelect;

export type InsertStudyMaterial = z.infer<typeof insertStudyMaterialSchema>;
export type StudyMaterial = typeof studyMaterials.$inferSelect;
