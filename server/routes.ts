import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage as mongoStorage } from "./mongo-storage";
import { storage as memStorage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { insertUserProgressSchema } from "@shared/models";

// Add global variable for TypeScript
declare global {
  var useMongoStorage: boolean;
}

// Choose storage based on MongoDB connection status
const getStorage = () => {
  return global.useMongoStorage ? mongoStorage : memStorage;
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Get all exam categories
  app.get("/api/exam-categories", async (req, res, next) => {
    try {
      const categories = await getStorage().getExamCategories();
      res.json(categories);
    } catch (error) {
      next(error);
    }
  });

  // Get exam category by ID
  app.get("/api/exam-categories/:id", async (req, res, next) => {
    try {
      const id = req.params.id;
      const category = await getStorage().getExamCategory(id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      next(error);
    }
  });

  // Get exam category by slug
  app.get("/api/exam-categories/slug/:slug", async (req, res, next) => {
    try {
      const slug = req.params.slug;
      const category = await getStorage().getExamCategoryBySlug(slug);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      next(error);
    }
  });

  // Get all courses
  app.get("/api/courses", async (req, res, next) => {
    try {
      const courses = await getStorage().getCourses();
      res.json(courses);
    } catch (error) {
      next(error);
    }
  });

  // Get course by ID
  app.get("/api/courses/:id", async (req, res, next) => {
    try {
      const id = req.params.id;
      const course = await getStorage().getCourse(id);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.json(course);
    } catch (error) {
      next(error);
    }
  });

  // Get courses by category ID
  app.get("/api/courses/category/:categoryId", async (req, res, next) => {
    try {
      const categoryId = req.params.categoryId;
      const courses = await getStorage().getCoursesByCategory(categoryId);
      res.json(courses);
    } catch (error) {
      next(error);
    }
  });

  // Get all test series
  app.get("/api/test-series", async (req, res, next) => {
    try {
      const testSeries = await getStorage().getTestSeries();
      res.json(testSeries);
    } catch (error) {
      next(error);
    }
  });

  // Get test series by category ID
  app.get("/api/test-series/category/:categoryId", async (req, res, next) => {
    try {
      const categoryId = req.params.categoryId;
      const testSeries = await getStorage().getTestSeriesByCategory(categoryId);
      res.json(testSeries);
    } catch (error) {
      next(error);
    }
  });

  // Get all mock tests
  app.get("/api/mock-tests", async (req, res, next) => {
    try {
      const mockTests = await getStorage().getMockTests();
      res.json(mockTests);
    } catch (error) {
      next(error);
    }
  });

  // Get mock test by ID
  app.get("/api/mock-tests/:id", async (req, res, next) => {
    try {
      const id = req.params.id;
      const mockTest = await getStorage().getMockTest(id);
      if (!mockTest) {
        return res.status(404).json({ message: "Mock test not found" });
      }
      res.json(mockTest);
    } catch (error) {
      next(error);
    }
  });

  // Get mock tests by series ID
  app.get("/api/mock-tests/series/:seriesId", async (req, res, next) => {
    try {
      const seriesId = req.params.seriesId;
      const mockTests = await getStorage().getMockTestsBySeriesId(seriesId);
      res.json(mockTests);
    } catch (error) {
      next(error);
    }
  });

  // Get questions for a mock test
  app.get("/api/questions/:testId", async (req, res, next) => {
    try {
      // Check if user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const testId = req.params.testId;
      const questions = await getStorage().getQuestions(testId);
      
      // Remove correct answers from response
      const questionsWithoutAnswers = questions.map((question: any) => {
        const { correctOption, ...questionWithoutAnswer } = question;
        return questionWithoutAnswer;
      });
      
      res.json(questionsWithoutAnswers);
    } catch (error) {
      next(error);
    }
  });

  // Submit test answers
  app.post("/api/submit-test/:testId", async (req, res, next) => {
    try {
      // Check if user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const testId = req.params.testId;
      const userId = req.user!.id;
      const { answers } = req.body;

      // Get questions
      const questions = await getStorage().getQuestions(testId);
      
      // Calculate score
      let score = 0;
      let totalMarks = 0;
      
      questions.forEach((question: any, index: number) => {
        totalMarks += question.marks;
        if (answers[index] === question.correctOption) {
          score += question.marks;
        } else if (answers[index] !== null) {
          // Apply negative marking if applicable
          score -= question.negativeMarks;
        }
      });

      // Calculate percentage
      const scorePercentage = Math.round((score / totalMarks) * 100);
      
      // Update user progress
      const progress = await getStorage().createOrUpdateUserProgress({
        userId,
        itemId: testId,
        itemType: 'test',
        progress: 100,
        score: scorePercentage,
        completed: true,
        startedAt: new Date(),
        completedAt: new Date()
      });

      // Return results
      const results = {
        score,
        totalMarks,
        percentage: scorePercentage,
        correctAnswers: questions.map((q: any) => q.correctOption)
      };

      res.json(results);
    } catch (error) {
      next(error);
    }
  });

  // Get user progress
  app.get("/api/user-progress", async (req, res, next) => {
    try {
      // Check if user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const userId = req.user!.id;
      const progress = await getStorage().getUserProgressByUserId(userId);
      res.json(progress);
    } catch (error) {
      next(error);
    }
  });

  // Update user progress for a course
  app.post("/api/user-progress", async (req, res, next) => {
    try {
      // Check if user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const userId = req.user!.id;
      
      // Validate request body
      const validationResult = insertUserProgressSchema.safeParse({
        ...req.body,
        userId
      });
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid data",
          errors: validationResult.error.errors 
        });
      }
      
      const progress = await getStorage().createOrUpdateUserProgress(validationResult.data);
      res.json(progress);
    } catch (error) {
      next(error);
    }
  });

  // Get all study materials
  app.get("/api/study-materials", async (req, res, next) => {
    try {
      const materials = await getStorage().getStudyMaterials();
      res.json(materials);
    } catch (error) {
      next(error);
    }
  });

  // Get study materials by category ID
  app.get("/api/study-materials/category/:categoryId", async (req, res, next) => {
    try {
      const categoryId = req.params.categoryId;
      const materials = await getStorage().getStudyMaterialsByCategory(categoryId);
      res.json(materials);
    } catch (error) {
      next(error);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}