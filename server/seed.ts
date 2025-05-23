import { connectToMongoDB } from './mongodb';
import {
  User,
  ExamCategory,
  Course,
  TestSeries,
  MockTest,
  Question,
  StudyMaterial
} from '@shared/models';
import { hashPassword } from './auth';

/**
 * Seeds the database with initial data
 */
export async function seedDatabase() {
  try {
    console.log('Seeding database...');

    // Connect to MongoDB
    const db = await connectToMongoDB();

    // Check if data already exists
    const categoryCount = await ExamCategory.countDocuments();
    if (categoryCount > 0) {
      console.log('Database already seeded, skipping...');
      return;
    }

    // Create sample user
    const hashedPassword = await hashPassword('password123');
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@testbook.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin'
    });

    console.log('Created admin user');

    // Create exam categories
    const categories = await ExamCategory.insertMany([
      {
        name: 'Banking & Insurance',
        description: 'Prepare for banking and insurance exams like SBI PO, IBPS, RBI, LIC and more',
        slug: 'banking-insurance',
        icon: 'bank',
        totalTests: 150,
        totalCourses: 25
      },
      {
        name: 'SSC & Railways',
        description: 'Prepare for government exams like SSC CGL, CHSL, Railways and more',
        slug: 'ssc-railways',
        icon: 'train',
        totalTests: 200,
        totalCourses: 30
      },
      {
        name: 'JEE & NEET',
        description: 'Prepare for engineering and medical entrance exams',
        slug: 'jee-neet',
        icon: 'graduation-cap',
        totalTests: 120,
        totalCourses: 20
      }
    ]);

    console.log('Created exam categories');

    // Create courses
    const courses = await Course.insertMany([
      {
        title: 'Complete Banking & Finance Course',
        description: 'Comprehensive preparation for all banking exams with 500+ practice questions',
        categoryId: categories[0]._id,
        instructor: 'Rahul Sharma',
        price: 3999,
        discountedPrice: 2999,
        duration: 4800, // in minutes
        totalLessons: 120,
        totalQuizzes: 30,
        level: 'Intermediate',
        thumbnail: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?q=80&w=2670&auto=format&fit=crop',
        rating: 4.8,
        enrollments: 2450
      },
      {
        title: 'SSC CGL Complete Preparation',
        description: 'Master the SSC CGL exam with our comprehensive course and practice tests',
        categoryId: categories[1]._id,
        instructor: 'Priya Singh',
        price: 4999,
        discountedPrice: 3499,
        duration: 6000, // in minutes
        totalLessons: 150,
        totalQuizzes: 40,
        level: 'Advanced',
        thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2670&auto=format&fit=crop',
        rating: 4.9,
        enrollments: 3200
      },
      {
        title: 'JEE Mains & Advanced Physics',
        description: 'Master the Physics concepts for JEE Mains and Advanced with our expert faculty',
        categoryId: categories[2]._id,
        instructor: 'Dr. Amit Kumar',
        price: 5999,
        discountedPrice: 4499,
        duration: 7200, // in minutes
        totalLessons: 180,
        totalQuizzes: 45,
        level: 'Advanced',
        thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2670&auto=format&fit=crop',
        rating: 4.7,
        enrollments: 1850
      }
    ]);

    console.log('Created courses');

    // Create test series
    const testSeries = await TestSeries.insertMany([
      {
        title: 'SBI PO Prelims',
        description: '20 full-length mock tests for SBI PO Prelims with detailed solutions',
        categoryId: categories[0]._id,
        price: 999,
        discountedPrice: 699,
        totalTests: 20,
        validityDays: 90,
        thumbnail: 'https://images.unsplash.com/photo-1606326608690-4e0281b1e588?q=80&w=2670&auto=format&fit=crop',
        rating: 4.6,
        purchases: 1800
      },
      {
        title: 'SSC CGL Tier I',
        description: '25 full-length mock tests for SSC CGL Tier I with detailed solutions',
        categoryId: categories[1]._id,
        price: 1299,
        discountedPrice: 899,
        totalTests: 25,
        validityDays: 120,
        thumbnail: 'https://images.unsplash.com/photo-1606326608606-aa0b62d82724?q=80&w=2670&auto=format&fit=crop',
        rating: 4.8,
        purchases: 2200
      },
      {
        title: 'JEE Mains Physics',
        description: '15 subject tests for JEE Mains Physics with detailed solutions',
        categoryId: categories[2]._id,
        price: 799,
        discountedPrice: 599,
        totalTests: 15,
        validityDays: 180,
        thumbnail: 'https://images.unsplash.com/photo-1636633762833-5d1658f1e29b?q=80&w=2664&auto=format&fit=crop',
        rating: 4.7,
        purchases: 1350
      }
    ]);

    console.log('Created test series');

    // Create mock tests
    const mockTests = await MockTest.insertMany([
      {
        title: 'SBI PO Prelims Mock Test 1',
        description: 'Full-length mock test for SBI PO Prelims 2023 based on latest pattern',
        seriesId: testSeries[0]._id,
        duration: 60, // in minutes
        totalQuestions: 100,
        maxMarks: 100,
        passingPercentage: 60,
        difficulty: 'Medium',
        attempts: 850
      },
      {
        title: 'SSC CGL Tier I Mock Test 1',
        description: 'Full-length mock test for SSC CGL Tier I 2023 based on latest pattern',
        seriesId: testSeries[1]._id,
        duration: 60, // in minutes
        totalQuestions: 100,
        maxMarks: 200,
        passingPercentage: 60,
        difficulty: 'Hard',
        attempts: 1200
      },
      {
        title: 'JEE Mains Physics Test 1',
        description: 'Subject test for JEE Mains Physics covering Mechanics and Thermodynamics',
        seriesId: testSeries[2]._id,
        duration: 180, // in minutes
        totalQuestions: 30,
        maxMarks: 120,
        passingPercentage: 50,
        difficulty: 'Hard',
        attempts: 780
      }
    ]);

    console.log('Created mock tests');

    // Create questions
    await Question.insertMany([
      {
        testId: mockTests[0]._id,
        questionText: 'A train passes a station platform in 36 seconds and a man standing on the platform in 20 seconds. If the speed of the train is 54 km/hr, what is the length of the platform?',
        options: [
          '120 meters',
          '240 meters',
          '300 meters',
          '360 meters'
        ],
        correctOption: 1,
        explanation: 'Let the length of the platform be x meters. Length of the train = 54 × 5/18 × 20 = 300 meters. According to the question, (x + 300)/54 × 18/5 = 36. Solving, we get x = 240 meters.',
        marks: 2,
        negativeMarks: 0.5,
        subject: 'Quantitative Aptitude',
        difficulty: 'Medium'
      },
      {
        testId: mockTests[0]._id,
        questionText: 'A person crosses a 600 m long street in 5 minutes. What is his speed in km per hour?',
        options: [
          '3.6 km/hr',
          '7.2 km/hr',
          '8.4 km/hr',
          '10 km/hr'
        ],
        correctOption: 1,
        explanation: 'Speed = Distance/Time = 600/5 = 120 m/min = 120 × 60/1000 = 7.2 km/hr',
        marks: 2,
        negativeMarks: 0.5,
        subject: 'Quantitative Aptitude',
        difficulty: 'Easy'
      },
      {
        testId: mockTests[1]._id,
        questionText: 'How many times in a day, the hands of a clock are at right angles?',
        options: [
          '22',
          '24',
          '44',
          '48'
        ],
        correctOption: 2,
        explanation: 'The hands of a clock are at right angles 22 times in 12 hours. So in 24 hours, they are at right angles 44 times.',
        marks: 2,
        negativeMarks: 0.5,
        subject: 'Quantitative Aptitude',
        difficulty: 'Medium'
      }
    ]);

    console.log('Created questions');

    // Create study materials
    await StudyMaterial.insertMany([
      {
        title: 'Banking Awareness PDF',
        description: 'Comprehensive PDF covering all important banking awareness topics for bank exams',
        categoryId: categories[0]._id,
        fileUrl: 'https://example.com/files/banking-awareness.pdf',
        fileType: 'PDF',
        pages: 120,
        thumbnail: 'https://images.unsplash.com/photo-1551260627-fd1b6daa6224?q=80&w=2670&auto=format&fit=crop',
        downloads: 3500
      },
      {
        title: 'SSC CGL English Grammar Notes',
        description: 'Complete English grammar notes for SSC CGL and other government exams',
        categoryId: categories[1]._id,
        fileUrl: 'https://example.com/files/english-grammar.pdf',
        fileType: 'PDF',
        pages: 85,
        thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=2673&auto=format&fit=crop',
        downloads: 4200
      },
      {
        title: 'JEE Physics Formula Sheet',
        description: 'Comprehensive formula sheet for JEE Physics covering all important topics',
        categoryId: categories[2]._id,
        fileUrl: 'https://example.com/files/physics-formulas.pdf',
        fileType: 'PDF',
        pages: 50,
        thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2670&auto=format&fit=crop',
        downloads: 5800
      }
    ]);

    console.log('Created study materials');

    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}