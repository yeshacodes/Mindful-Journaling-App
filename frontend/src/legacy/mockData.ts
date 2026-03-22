export interface JournalEntry {
  id: string;
  date: Date;
  mood: number; // 1-5
  tags: string[];
  prompt: string;
  content: string;
}

export const mockPrompts = [
  "What's one thing that brought you peace today?",
  "Describe a moment when you felt truly present.",
  "What are you grateful for right now?",
  "What's weighing on your mind?",
  "What small win can you celebrate today?",
  "How did you show kindness to yourself today?",
  "What emotion are you sitting with right now?",
  "What would make tomorrow feel lighter?",
  "Who or what made you smile today?",
  "What's one thing you learned about yourself recently?",
];

export const initialEntries: JournalEntry[] = [
  {
    id: "1",
    date: new Date(2026, 1, 9, 10, 30),
    mood: 4,
    tags: ["gratitude", "morning"],
    prompt: "What's one thing that brought you peace today?",
    content: "Sitting with my coffee this morning, watching the sunrise. No distractions, just the warmth of the cup and the quiet. It reminded me how much I need these small moments.",
  },
  {
    id: "2",
    date: new Date(2026, 1, 8, 20, 15),
    mood: 3,
    tags: ["reflection", "evening"],
    prompt: "What's weighing on your mind?",
    content: "Work has been overwhelming lately. I keep thinking about the deadline next week. Need to remember to take it one step at a time.",
  },
  {
    id: "3",
    date: new Date(2026, 1, 7, 14, 0),
    mood: 5,
    tags: ["joy", "connection"],
    prompt: "Who or what made you smile today?",
    content: "Called my best friend today and we laughed for an hour straight. I hadn't realized how much I needed that connection. Sometimes the simplest things matter most.",
  },
  {
    id: "4",
    date: new Date(2026, 1, 6, 9, 0),
    mood: 3,
    tags: ["mindfulness"],
    prompt: "Describe a moment when you felt truly present.",
    content: "During my walk this morning, I noticed the trees and how the light filtered through the branches. For a few minutes, my mind was quiet.",
  },
  {
    id: "5",
    date: new Date(2026, 1, 5, 18, 30),
    mood: 4,
    tags: ["self-care", "achievement"],
    prompt: "What small win can you celebrate today?",
    content: "I finally finished that book I've been reading for weeks. It felt good to complete something, even something small.",
  },
];
