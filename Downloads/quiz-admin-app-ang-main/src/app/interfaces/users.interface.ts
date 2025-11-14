// src/interfaces/users.interface.ts

// Общий интерфейс для ответов
export interface Answer {
  questionId: number;
  answerId: number;
  questionText?: string;
  answerText?: string;
  isCorrect?: boolean;
  points?: number;
}

// Общий интерфейс для информации о браузере
export interface BrowserInfo {
  screen: {
    width: number;
    height: number;
  };
  language: string;
  platform: string;
  referrer: string;
  timezone: string;
  ipAddress: string;
  userAgent: string;
  cookiesEnabled: boolean;
}

// Интерфейс для квиза
export interface Quiz {
  id: number;
  title: string;
  description: string;
  firstPage: string;
  finalPage: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  previewImage: string;
  rating: number;
  categoryId: number | null;
}

// Интерфейс для сессии пользователя
export interface UserSession {
  id: number;
  quizId: number | null;
  userId: string | null;
  sessionId: string;
  currentQuestionIndex: number;
  correctAnswersCount: number;
  totalPoints: number;
  answers: Answer[];
  browserInfo: BrowserInfo | null;
  createdAt: string;
  updatedAt: string | null;
  quiz?: Quiz;
}

// Интерфейс для результатов пользователя
export interface UserResult {
  id: number;
  quizId: number | null;
  userId: string | null;
  sessionId: string | null;
  score: number;
  answers: Answer[];
  createdAt: string;
  quiz?: Quiz;
}

// Интерфейс для пользователя
export interface User {
  id: string;
  uuid: string;
  name: string;
  email: string;
  createdAt: string;
  sessions: UserSession[];
  results: UserResult[];
  // Поля, специфичные для объединённой записи
  sessionId?: string | null;
  quizId?: number | null;
  score?: number | null;
  totalPoints?: number;
  answers?: Answer[];
  browserInfo: BrowserInfo | null;
}