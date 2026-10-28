/** Focus areas, their lessons and the lessons' questions (DESIGN.md §8.6, Gamification → Focus areas). */

/** One answer option of a question. */
export interface AnswerOption {
  id: number;
  text: string;
}

/** A question in a lesson: 2 to 4 options, exactly one correct. */
export interface Question {
  id: number;
  text: string;
  tiers: string[];
  options: AnswerOption[];
  /** The correct option's `id`. */
  correct: number;
  explanation: string;
  /** Points per correct answer. */
  points: number;
}

/** A lesson in a focus area. */
export interface Lesson {
  id: number;
  /** Its place in the focus area, from 1. */
  order: number;
  topic: string;
  description: string;
  exampleTopic: string;
  exampleDescription: string;
  trigger: string | null;
  tiers: string[];
  published: boolean;
  questions: Question[];
}

/** A focus area: a topic members learn about, in lessons. */
export interface FocusArea {
  id: number;
  /** Its place in the list, from 1. */
  order: number;
  name: string;
  description: string;
  badge: string | null;
  published: boolean;
  lessons: Lesson[];
}

/** Fake options for the forms' selects and lists. */
export const TIERS = ['Basic', 'Silver', 'Gold'];
export const BADGES = ['Budget builder', 'Smart spender', 'Safe saver', 'Credit champion', 'Security star'];
export const TRIGGERS = ['Award the badge', 'Award points', 'Unlock the next lesson', 'Send a notification'];

/** "01", "02"…: Order and No. as the screens show them. */
export const padded = (n: number) => String(n).padStart(2, '0');

/** "5 lessons", "1 lesson". */
export const count = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/** The next free id in a list. */
export const nextId = (items: { id: number }[]) => items.reduce((max, item) => Math.max(max, item.id), 0) + 1;

/**
 * Puts `item` at `order` (from 1) in a list kept in order: the others from that place move down one, and the orders
 * are renumbered 1, 2, 3… The item replaces the one with its `id` when it's already in the list (Edit).
 */
export function placeAt<T extends { id: number; order: number }>(items: T[], item: T, order: number): T[] {
  const others = items.filter((i) => i.id !== item.id).sort((a, b) => a.order - b.order);
  others.splice(Math.min(Math.max(order, 1), others.length + 1) - 1, 0, item);
  return others.map((i, index) => ({ ...i, order: index + 1 }));
}

/** Takes an item out and renumbers the rest 1, 2, 3… */
export function removeFrom<T extends { id: number; order: number }>(items: T[], id: number): T[] {
  return items
    .filter((i) => i.id !== id)
    .sort((a, b) => a.order - b.order)
    .map((i, index) => ({ ...i, order: index + 1 }));
}
