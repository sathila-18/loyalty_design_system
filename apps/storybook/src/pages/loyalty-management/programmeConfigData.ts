import type { ProgrammeConfig } from './ProgrammeConfiguration';

/** Fake data for the Programme configuration stories and the shared states (Pages/Common states). */

/** Figma's three rows (`312:15165`). */
export const FIGMA_CONFIGS: ProgrammeConfig[] = [
  { id: 1, segment: 'Staff', loyalty: true, expiryMonths: 36, cashConversion: true, pointsPerUnit: 80, minConversion: 100, maxConversion: 20000 },
  { id: 2, segment: 'VIP', loyalty: true, expiryMonths: 24, cashConversion: true, pointsPerUnit: 90, minConversion: 100, maxConversion: 15000 },
  { id: 3, segment: 'Regular', loyalty: true, expiryMonths: 24, cashConversion: true, pointsPerUnit: 100, minConversion: 200, maxConversion: 10000 },
];

/** More segments than one page holds, with edge cases: long names, switched-off rules, large numbers. */
export const MANY_CONFIGS: ProgrammeConfig[] = [
  ...FIGMA_CONFIGS,
  { id: 4, segment: 'Corporate', loyalty: true, expiryMonths: 12, cashConversion: false, pointsPerUnit: 120, minConversion: 500, maxConversion: 50000 },
  { id: 5, segment: 'Senior citizens', loyalty: true, expiryMonths: 48, cashConversion: true, pointsPerUnit: 75, minConversion: 100, maxConversion: 10000 },
  { id: 6, segment: 'Students', loyalty: true, expiryMonths: 12, cashConversion: false, pointsPerUnit: 150, minConversion: 50, maxConversion: 2500 },
  { id: 7, segment: 'Premier banking customers (Colombo and Kandy branches)', loyalty: true, expiryMonths: 60, cashConversion: true, pointsPerUnit: 60, minConversion: 1000, maxConversion: 1250000 },
  { id: 8, segment: 'Dormant accounts', loyalty: false, expiryMonths: 6, cashConversion: false, pointsPerUnit: 200, minConversion: 0, maxConversion: 0 },
  { id: 9, segment: 'Credit card holders', loyalty: true, expiryMonths: 24, cashConversion: true, pointsPerUnit: 100, minConversion: 250, maxConversion: 30000 },
  { id: 10, segment: 'New joiners', loyalty: true, expiryMonths: 12, cashConversion: false, pointsPerUnit: 110, minConversion: 100, maxConversion: 5000 },
  { id: 11, segment: 'SME', loyalty: true, expiryMonths: 24, cashConversion: true, pointsPerUnit: 95, minConversion: 500, maxConversion: 75000 },
  { id: 12, segment: 'Pensioners', loyalty: false, expiryMonths: 36, cashConversion: true, pointsPerUnit: 85, minConversion: 100, maxConversion: 8000 },
];

/** More segments, so the table can have up to 60 rows (six pages of 10). */
const MORE_SEGMENTS = [
  'Gold card members',
  'Platinum card members',
  'Salary account holders',
  'Fixed deposit holders',
  'Home loan customers',
  'Vehicle loan customers',
  'Online banking only',
  'Mobile wallet users',
  'Merchants',
  'Agriculture sector',
  'Tourism sector',
  'Healthcare professionals',
  'Teachers',
  'Government employees',
  'Armed forces',
  'University staff',
  'Northern province customers',
  'Eastern province customers',
  'Southern province customers',
  'Central province customers',
  'Western province customers',
  'Uva province customers',
  'Sabaragamuwa province customers',
  'North Central province customers',
  'North Western province customers',
  'Joint account holders',
  'Minors (savings)',
  'Foreign currency account holders',
  'NRFC account holders',
  'Business current accounts',
  'Startups',
  'Exporters',
  'Importers',
  'Insurance policy holders',
  'Leasing customers',
  'Pawning customers',
  'Microfinance members',
  'Co-operative society members',
  'Religious institutions',
  'Non-profit organisations',
  'Corporate payroll partners',
  'Airline partner members',
  'Supermarket partner members',
  'Fuel card holders',
  'Travel card holders',
  'Student loan customers',
  'Credit card holders with supplementary cards issued before 2020',
  'Legacy segment (migrated)',
];

/** Up to 60 configurations: Figma's three first, then the edge cases above, then the rest with varied values. */
export const ALL_CONFIGS: ProgrammeConfig[] = [
  ...MANY_CONFIGS,
  ...MORE_SEGMENTS.map((segment, i) => ({
    id: MANY_CONFIGS.length + i + 1,
    segment,
    loyalty: i % 7 !== 3,
    expiryMonths: [6, 12, 24, 36, 48, 60][i % 6]!,
    cashConversion: i % 3 !== 1,
    pointsPerUnit: 60 + ((i * 5) % 150),
    minConversion: [50, 100, 200, 250, 500, 1000][i % 6]!,
    maxConversion: [2500, 5000, 10000, 20000, 50000, 250000][(i + 2) % 6]!,
  })),
];

/** Every customer segment: the ones without a configuration are offered when adding. */
export const SEGMENTS = [
  ...ALL_CONFIGS.map((c) => c.segment),
  'Overseas Sri Lankans',
  'Youth savers',
  'Women in business',
  'Priority banking customers with joint accounts across several branches',
];
