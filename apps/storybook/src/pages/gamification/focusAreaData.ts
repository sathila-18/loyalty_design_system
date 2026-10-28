import type { FocusArea, Lesson, Question } from './focusAreaModel';

/** Fake data for the Focus areas stories: Figma's rows first (`413:39213`, `420:42435`, `420:45368`), then more. */

/** Figma's five questions for "What is an instalment plan" (`420:45368`), with their options and points. */
const INSTALMENT_QUESTIONS: Question[] = [
  {
    id: 1,
    text: 'How many payments in a standard plan?',
    tiers: ['Basic', 'Silver', 'Gold'],
    options: [
      { id: 1, text: 'Two payments' },
      { id: 2, text: 'Four payments' },
      { id: 3, text: 'Six payments' },
      { id: 4, text: 'Twelve payments' },
    ],
    correct: 2,
    explanation: 'Standard plans are four payments. Flexed plans can go further.',
    points: 5,
  },
  {
    id: 2,
    text: 'When is the first payment taken?',
    tiers: ['Basic', 'Silver', 'Gold'],
    options: [
      { id: 1, text: 'At checkout' },
      { id: 2, text: 'After two weeks' },
      { id: 3, text: 'After a month' },
    ],
    correct: 1,
    explanation: 'The first payment is taken when you buy; the rest follow every two weeks.',
    points: 10,
  },
  {
    id: 3,
    text: 'What is a late fee?',
    tiers: ['Basic', 'Silver'],
    options: [
      { id: 1, text: 'A charge for paying after the due date' },
      { id: 2, text: 'Interest on the whole purchase' },
      { id: 3, text: 'A fee for paying early' },
      { id: 4, text: 'A yearly account fee' },
    ],
    correct: 1,
    explanation: 'A late fee is charged when a payment is missed on its due date.',
    points: 10,
  },
  {
    id: 4,
    text: 'Can you repay early?',
    tiers: ['Silver', 'Gold'],
    options: [
      { id: 1, text: 'Yes, at no extra cost' },
      { id: 2, text: 'Only with a fee' },
      { id: 3, text: 'No' },
    ],
    correct: 1,
    explanation: 'You can settle the remaining payments at any time without a fee.',
    points: 10,
  },
  {
    id: 5,
    text: 'Where do you see your payment schedule?',
    tiers: ['Basic', 'Silver', 'Gold'],
    options: [
      { id: 1, text: 'In the app, under Plans' },
      { id: 2, text: 'On your card statement only' },
    ],
    correct: 1,
    explanation: 'Every plan and its dates are listed in the app under Plans.',
    points: 10,
  },
];

/** Placeholder questions for the other lessons: `n` of them, varied. */
function questionsFor(topic: string, n: number): Question[] {
  return Array.from({ length: n }, (_, i) => ({
    id: i + 1,
    text: `${topic}: question ${i + 1}`,
    tiers: ['Basic', 'Silver', 'Gold'].slice(0, 1 + (i % 3)),
    options: [
      { id: 1, text: 'The first answer' },
      { id: 2, text: 'The second answer' },
      ...(i % 2 === 0 ? [{ id: 3, text: 'The third answer' }] : []),
    ],
    correct: 1 + (i % 2),
    explanation: `Why the answer is right, for ${topic.toLowerCase()}.`,
    points: i === 0 ? 5 : 10,
  }));
}

/** Figma's ten lessons for "Using BNPL responsibly" (`420:42435`), with their question counts and statuses. */
const BNPL_LESSONS: [string, number, boolean][] = [
  ['What is an instalment plan', 5, false],
  ['Reading your repayment schedule', 4, true],
  ['What happens if you miss a payment', 3, true],
  ['Choosing the right plan length', 0, false],
  ['Managing several plans at once', 6, true],
  ['Updating your payment method', 4, true],
  ['How to pause a payment', 3, true],
  ['Early settlement options', 5, false],
  ['Understanding late fees', 2, true],
  ['Contacting support', 1, true],
];

function lesson(id: number, topic: string, questions: number, published: boolean): Lesson {
  return {
    id,
    order: id,
    topic,
    description: `${topic}, explained in plain words with an everyday example.`,
    exampleTopic: topic,
    exampleDescription: `A short example that shows ${topic.toLowerCase()}.`,
    trigger: 'Award points',
    tiers: ['Basic', 'Silver', 'Gold'],
    published,
    questions: id === 1 && topic === 'What is an instalment plan' ? INSTALMENT_QUESTIONS : questionsFor(topic, questions),
  };
}

/** Lessons for a focus area other than BNPL: `n` of them. */
function lessonsFor(name: string, n: number): Lesson[] {
  return Array.from({ length: n }, (_, i) => lesson(i + 1, `${name}: lesson ${i + 1}`, (i * 3) % 6, i % 4 !== 3));
}

/** Figma's ten focus areas (`413:39213`): lesson counts and statuses as the screen has them. */
const FIGMA: [string, number, boolean][] = [
  ['Using BNPL responsibly', 10, false],
  ['Budgeting basics', 4, true],
  ['Avoiding late fees', 3, true],
  ['Digital security', 5, true],
  ['Credit score basics', 6, true],
  ['Emergency fund planning', 4, false],
  ['Retirement savings', 7, true],
  ['Home buying basics', 6, false],
  ['Investing for beginners', 5, false],
  ['Student loan repayment', 4, true],
];

const MORE = [
  'Understanding interest rates',
  'Saving for a holiday',
  'Paying off credit card debt',
  'Spotting scam messages and fake websites before you share any personal or card details',
  'Insurance explained',
  'Making the most of reward points',
  'Planning for school fees',
  'Starting a small business',
  'Sending money abroad',
  'Tax basics',
];

/** Up to 20 focus areas: Figma's ten, then more (a long name, none with no lessons). */
export const ALL_FOCUS_AREAS: FocusArea[] = [...FIGMA.map(([name, lessons, published]) => ({ name, lessons, published })), ...MORE.map((name, i) => ({ name, lessons: i === 3 ? 0 : 2 + (i % 5), published: i % 3 !== 2 }))].map(
  ({ name, lessons, published }, i): FocusArea => ({
    id: i + 1,
    order: i + 1,
    name,
    description: `Learn about ${name.toLowerCase()}.`,
    badge: i % 3 === 1 ? null : 'Budget builder',
    published,
    lessons: i === 0 ? BNPL_LESSONS.map(([topic, questions, live], j) => lesson(j + 1, topic, questions, live)) : lessonsFor(name, lessons),
  }),
);

/** Figma's ten. */
export const FIGMA_FOCUS_AREAS = ALL_FOCUS_AREAS.slice(0, 10);
