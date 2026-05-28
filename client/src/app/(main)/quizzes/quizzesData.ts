export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

export interface QuizInfo {
  id: number;
  title: string;
  category: string;
  questions: number;
  timeMin: number;
  difficulty: string;
  bestScore: number | null;
  attempts: number;
  icon: string;
}

export const quizzes: QuizInfo[] = [
  { id: 1, title: "Vocabulary: Daily Life", category: "Vocabulary", questions: 20, timeMin: 10, difficulty: "Beginner", bestScore: 95, attempts: 3, icon: "📝" },
  { id: 2, title: "Grammar: Tenses Master", category: "Grammar", questions: 15, timeMin: 12, difficulty: "Intermediate", bestScore: 80, attempts: 2, icon: "📐" },
  { id: 3, title: "Listening: Native Conversations", category: "Listening", questions: 10, timeMin: 15, difficulty: "Advanced", bestScore: null, attempts: 0, icon: "🎧" },
  { id: 4, title: "Reading Comprehension: News", category: "Reading", questions: 12, timeMin: 20, difficulty: "Intermediate", bestScore: 70, attempts: 1, icon: "📰" },
  { id: 5, title: "Idioms & Expressions", category: "Vocabulary", questions: 25, timeMin: 15, difficulty: "Advanced", bestScore: null, attempts: 0, icon: "💡" },
  { id: 6, title: "Spelling Bee Challenge", category: "Vocabulary", questions: 30, timeMin: 10, difficulty: "Beginner", bestScore: 88, attempts: 5, icon: "🐝" },
  { id: 7, title: "Prepositions Master", category: "Grammar", questions: 20, timeMin: 8, difficulty: "Beginner", bestScore: 100, attempts: 4, icon: "🔗" },
  { id: 8, title: "Business English", category: "Vocabulary", questions: 15, timeMin: 12, difficulty: "Advanced", bestScore: null, attempts: 0, icon: "💼" },
];

export const quizQuestionsDb: Record<number, QuizQuestion[]> = {
  1: [
    { question: "What is the term for the meal eaten in the middle of the day?", options: ["Breakfast", "Lunch", "Dinner", "Supper"], correct: 1 },
    { question: "Where do you go to buy fresh bread and pastries?", options: ["Butcher shop", "Pharmacy", "Bakery", "Library"], correct: 2 },
    { question: "Which household appliance is used to wash dishes automatically?", options: ["Washing machine", "Dishwasher", "Microwave", "Refrigerator"], correct: 1 },
    { question: "After a long day of work, I love to ___ and read a book.", options: ["stress", "unwind", "exercise", "commute"], correct: 1 }
  ],
  2: [
    { question: "Choose the correct word: She ___ to the store yesterday.", options: ["go", "goes", "went", "going"], correct: 2 },
    { question: "By the time we arrived, the movie ___ already.", options: ["started", "starts", "has started", "had started"], correct: 3 },
    { question: "I ___ English for five years now.", options: ["have been studying", "studied", "am studying", "will study"], correct: 0 },
    { question: "If I ___ rich, I would travel the world.", options: ["am", "was", "were", "be"], correct: 2 }
  ],
  3: [
    { question: "In native speech, 'What are you doing?' is often contracted phonetically to:", options: ["Whatcha doin'?", "What do you do?", "Where are you going?", "How ya doin'?"], correct: 0 },
    { question: "What does a native speaker mean when they say 'I'm down'?", options: ["I am feeling sad", "I agree or want to join", "I am physically falling", "I am going downstairs"], correct: 1 },
    { question: "When someone says 'Could you repeat that?', what are they asking for?", options: ["To say it again", "To write it down", "To translate it", "To speak louder"], correct: 0 }
  ],
  4: [
    { question: "Choose the best headline for an article about the rise of remote work:", options: ["The Decline of Global Technology", "How Office Life is Changing Forever", "The Importance of Commuting", "Why Everyone is Leaving the Country"], correct: 1 },
    { question: "In a news article, what does 'inflation' usually refer to?", options: ["The increase in general prices over time", "The growth of the population", "The expansion of the tech industry", "The weather pattern change"], correct: 0 },
    { question: "If an article mentions a 'breakthrough in clean energy', what does that imply?", options: ["A scientific failure", "A significant positive discovery", "A new oil drilling technique", "An energy shortage crisis"], correct: 1 }
  ],
  5: [
    { question: "What does 'bite the bullet' mean?", options: ["To eat something hard", "To face a difficult situation with courage", "To make a weapon", "To fail completely"], correct: 1 },
    { question: "If a plan is 'up in the air', it means it is:", options: ["Flying high", "Very successful", "Uncertain or undecided", "Canceled permanently"], correct: 2 },
    { question: "What does 'break a leg' mean in the performing arts?", options: ["Wish someone bad luck", "Wish someone good luck", "Tell someone to stop dancing", "Tell someone to go home"], correct: 1 }
  ],
  6: [
    { question: "Which spelling is correct?", options: ["Accomodate", "Accommadate", "Accommodate", "Acomodate"], correct: 2 },
    { question: "Find the correctly spelled word:", options: ["Necessary", "Necassary", "Neccessary", "Nessesary"], correct: 0 },
    { question: "Identify the correct spelling:", options: ["Receive", "Recieve", "Receve", "Receivee"], correct: 0 }
  ],
  7: [
    { question: "I am interested ___ learning new languages.", options: ["on", "at", "in", "with"], correct: 2 },
    { question: "She is very good ___ playing the piano.", options: ["at", "in", "on", "for"], correct: 0 },
    { question: "We will meet ___ noon on Monday.", options: ["in", "at", "on", "by"], correct: 1 }
  ],
  8: [
    { question: "What is the synonym of 'to postpone' a meeting in business terms?", options: ["To reschedule", "To cancel", "To put off / defer", "To kick off"], correct: 2 },
    { question: "What does 'ROI' stand for in finance and business?", options: ["Rate of Interest", "Return on Investment", "Risk of Inflation", "Revenue of Industry"], correct: 1 },
    { question: "A 'consensus' in a boardroom meeting means:", options: ["A disagreement among members", "A vote to end the meeting", "A general agreement or shared decision", "A financial audit report"], correct: 2 }
  ]
};
