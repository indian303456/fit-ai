
export interface FoodItem {
  name: string;
  portion: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface AnalysisResult {
  isFood: boolean;
  items: FoodItem[];
  total: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  healthRating: number;
  coachingTip: string;
  errorMessage?: string;
}

export interface DayPlan {
  day: string;
  meals: {
    type: string;
    description: string;
    calories: number;
  }[];
}

export interface DietPlan {
  goal: string;
  weeklyPlan: DayPlan[];
  generalAdvice: string;
}

export interface Exercise {
  name: string;
  sets: string;
  reps: string;
  notes: string;
}

export interface WorkoutSession {
  title: string;
  duration: string;
  exercises: Exercise[];
}

export interface WorkoutPlan {
  level: string;
  sessions: WorkoutSession[];
  weeklySchedule: string[];
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  imageData?: string;
  description?: string;
  result: AnalysisResult;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface UserBiometrics {
  age: string;
  height: string;
  weight: string;
}
