export interface Quiz {
  id: number;
  title: string;
  description?: string;
  firstPage?: string;
  finalPage?: string;
  previewImage?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  rating?: number;
  questions: {
    id?: number; // Сделали id необязательным для новых вопросов
    text: string;
    image?: string;
    order?: number;
    answers: {
      id?: number; // Сделали id необязательным для новых ответов
      text: string;
      isCorrect: boolean;
      points: number;
    }[];
  }[];
  categoryId?: number;
  img?: string;
  text?: string;
  extraText?: string;
}