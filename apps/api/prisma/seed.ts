// Demo data from the design (the placeholders in apps/web/src/components/(main)/*/data.ts), for
// local development:
//
//   SEED_ORG=<organization slug> yarn workspace api db:seed
//
// SEED_ORG can be left out when there's only one organization. Run it again whenever: the demo
// people are upserted, and the Payments and iOS app projects (with their sprints, work items,
// activity, attachments and dashboard preferences) and the demo people's time off are replaced.
// Payments gets Sprints 21–27: three closed (with finished items for velocity), Sprint 24
// active, and three planned, the last one empty. The organization's own members join both
// projects, so the signed-in person sees them.

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';
import type {
  Priority,
  SprintState,
  TimeOffType,
  WorkItemStatus,
  WorkItemType,
} from '../src/generated/prisma/enums';

try {
  process.loadEnvFile();
} catch {
  // No .env file; rely on the environment.
}

const schema = process.env.DATABASE_SCHEMA ?? 'app';
const prisma = new PrismaClient({
  adapter: new PrismaPg(
    { connectionString: process.env.DATABASE_URL, options: `-c search_path=${schema}` },
    { schema },
  ),
});

/** A calendar day, as @db.Date columns store it. */
const day = (iso: string) => new Date(`${iso}T00:00:00Z`);
const at = (iso: string) => new Date(iso);

// -----------------------------------------------------------------------------------------------
// People. They can't sign in: they have no account, only a user row and a membership.
// -----------------------------------------------------------------------------------------------

const PEOPLE = {
  mira: { name: 'Mira Okafor', title: 'Engineering lead', estimates: true },
  jonas: { name: 'Jonas Lehmann', title: 'Backend engineer', estimates: true },
  aiko: { name: 'Aiko Ramos', title: 'Backend engineer', estimates: true },
  dev: { name: 'Dev Patel', title: 'Frontend engineer', estimates: true },
  sara: { name: 'Sara Kowalski', title: 'Mobile engineer', estimates: true },
  lena: { name: 'Lena Fischer', title: 'Product designer', estimates: false },
  tom: { name: 'Tom Becker', title: 'QA engineer', estimates: false },
} as const;

type Person = keyof typeof PEOPLE;

const userId = (person: Person) => `seed_${person}`;
const emailOf = (person: Person) =>
  `${PEOPLE[person].name.toLowerCase().replace(/\s+/g, '.')}@example.com`;

// -----------------------------------------------------------------------------------------------
// Projects
// -----------------------------------------------------------------------------------------------

const PAYMENTS = {
  key: 'PAY',
  name: 'Payments',
  description:
    'Checkout, payouts and the ledger. Anything that touches money goes here; customer-facing copy changes go to Growth.',
  methodology: 'scrum',
} as const;

const IOS = { key: 'IOS', name: 'iOS app', description: null, methodology: 'kanban' } as const;

const HOLIDAYS = [{ date: '2026-10-30', name: 'Company holiday' }];

/** Two-week sprints in the order they run. Work items point at them by `id`. */
const SPRINTS: {
  id: string;
  name: string;
  goal?: string;
  start: string;
  end: string;
  state: SprintState;
  startedAt?: string;
  closedAt?: string;
}[] = [
  {
    id: 's21',
    name: 'Sprint 21',
    goal: 'Strong customer authentication behind a flag for EU cards.',
    start: '2026-09-07',
    end: '2026-09-20',
    state: 'closed',
    startedAt: '2026-09-07T08:00:00Z',
    closedAt: '2026-09-20T16:00:00Z',
  },
  {
    id: 's22',
    name: 'Sprint 22',
    goal: 'Roll SCA out to every EU merchant and start on 3-D Secure.',
    start: '2026-09-21',
    end: '2026-10-04',
    state: 'closed',
    startedAt: '2026-09-21T08:00:00Z',
    closedAt: '2026-10-02T16:30:00Z',
  },
  {
    id: 's23',
    name: 'Sprint 23',
    goal: '3-D Secure challenge flow and the saved cards groundwork.',
    start: '2026-10-05',
    end: '2026-10-18',
    state: 'closed',
    startedAt: '2026-10-05T08:00:00Z',
    closedAt: '2026-10-18T16:00:00Z',
  },
  {
    id: 's24',
    name: 'Sprint 24',
    goal: 'Ship saved cards and Apple Pay to 10% of web checkout.',
    start: '2026-10-19',
    end: '2026-11-01',
    state: 'active',
    startedAt: '2026-10-19T08:00:00Z',
  },
  {
    id: 's25',
    name: 'Sprint 25',
    goal: 'Payout retries and the new receipt email.',
    start: '2026-11-02',
    end: '2026-11-15',
    state: 'planned',
  },
  {
    id: 's26',
    name: 'Sprint 26',
    goal: 'Refunds groundwork and checkout reliability.',
    start: '2026-11-16',
    end: '2026-11-29',
    state: 'planned',
  },
  { id: 's27', name: 'Sprint 27', start: '2026-11-30', end: '2026-12-13', state: 'planned' },
];

const TIME_OFF: { person: Person; type: TimeOffType; start: string; end: string }[] = [
  { person: 'dev', type: 'vacation', start: '2026-10-08', end: '2026-10-09' },
  { person: 'mira', type: 'sick', start: '2026-10-13', end: '2026-10-13' },
  { person: 'jonas', type: 'vacation', start: '2026-10-22', end: '2026-10-23' },
  { person: 'aiko', type: 'vacation', start: '2026-10-26', end: '2026-10-29' },
  { person: 'sara', type: 'sick', start: '2026-10-28', end: '2026-10-28' },
  { person: 'lena', type: 'vacation', start: '2026-10-19', end: '2026-10-20' },
  { person: 'tom', type: 'half', start: '2026-10-21', end: '2026-10-21' },
  { person: 'sara', type: 'vacation', start: '2026-11-03', end: '2026-11-06' },
  { person: 'jonas', type: 'half', start: '2026-11-12', end: '2026-11-12' },
];

// -----------------------------------------------------------------------------------------------
// Work items. Keys are numbers in the database, so the timeline's PAY-E12 and PAY-F41 become
// PAY-1412 and PAY-1441. PAY-F71 and PAY-F82 would clash with stories, so they're 1473 and 1483.
// -----------------------------------------------------------------------------------------------

interface Item {
  number: number;
  title: string;
  type: WorkItemType;
  status: WorkItemStatus;
  priority?: Priority;
  points?: number;
  assignee?: Person;
  /** A sprint id from SPRINTS; left out for the backlog. */
  sprint?: string;
  tags?: string[];
  parent?: number;
  atRisk?: boolean;
  start?: string;
  target?: string;
  completedAt?: string;
}

/** An epic or feature on the timeline. Warning is "at risk", still in progress. */
const plan = (
  number: number,
  type: 'epic' | 'feature',
  title: string,
  tone: 'success' | 'info' | 'review' | 'warning' | 'neutral',
  start: string,
  target: string,
  extra: Partial<Item> = {},
): Item => ({
  number,
  type,
  title,
  status: {
    success: 'done',
    info: 'in_progress',
    review: 'in_review',
    warning: 'in_progress',
    neutral: 'todo',
  }[tone] as WorkItemStatus,
  atRisk: tone === 'warning',
  start,
  target,
  completedAt: tone === 'success' ? `${target}T16:00:00Z` : undefined,
  ...extra,
});

const EPICS: Item[] = [
  plan(1409, 'epic', 'EU compliance (PSD2)', 'success', '2026-08-18', '2026-10-30', {
    assignee: 'jonas',
  }),
  plan(1431, 'feature', 'Strong customer authentication', 'success', '2026-08-18', '2026-10-02', {
    parent: 1409,
  }),
  plan(1432, 'feature', '3-D Secure for EU cards', 'success', '2026-09-14', '2026-10-30', {
    parent: 1409,
  }),

  plan(1412, 'epic', 'Checkout v2', 'info', '2026-10-01', '2026-11-28', { assignee: 'mira' }),
  plan(1441, 'feature', 'Saved cards', 'info', '2026-10-01', '2026-11-05', { parent: 1412 }),
  plan(1442, 'feature', 'Apple Pay & Google Pay', 'review', '2026-10-12', '2026-11-13', {
    parent: 1412,
  }),
  plan(1443, 'feature', 'One-page checkout', 'neutral', '2026-11-07', '2026-11-28', {
    parent: 1412,
  }),

  plan(1413, 'epic', 'Ledger reconciliation', 'warning', '2026-10-14', '2026-12-19', {
    assignee: 'sara',
  }),
  plan(1451, 'feature', 'Daily settlement matching', 'warning', '2026-10-14', '2026-11-20', {
    parent: 1413,
  }),
  plan(1452, 'feature', 'Mismatch alerts', 'neutral', '2026-11-16', '2026-12-19', { parent: 1413 }),

  plan(1414, 'epic', 'Payouts automation', 'neutral', '2026-11-16', '2027-01-22', {
    assignee: 'aiko',
  }),
  plan(1461, 'feature', 'Scheduled payouts', 'neutral', '2026-11-16', '2026-12-18', {
    parent: 1414,
  }),
  plan(1462, 'feature', 'Automatic payout retries', 'neutral', '2026-12-14', '2027-01-22', {
    parent: 1414,
  }),

  plan(1415, 'epic', 'Refunds & disputes', 'neutral', '2026-12-07', '2027-02-26', {
    assignee: 'dev',
  }),
  plan(1473, 'feature', 'Partial refunds', 'neutral', '2026-12-07', '2027-01-15', { parent: 1415 }),
  plan(1472, 'feature', 'Dispute evidence upload', 'neutral', '2027-01-11', '2027-02-26', {
    parent: 1415,
  }),

  plan(1416, 'epic', 'Mobile wallet', 'neutral', '2027-01-18', '2027-03-31'),
  plan(1481, 'feature', 'Wallet balance', 'neutral', '2027-01-18', '2027-02-19', { parent: 1416 }),
  plan(1483, 'feature', 'Top up from a card', 'neutral', '2027-02-15', '2027-03-31', {
    parent: 1416,
  }),
];

/** Sprints and backlog in rank order: within a group, earlier items come first. */
const ITEMS: Item[] = [
  // Sprint 21 (closed): everything finished, for velocity and sprint history.
  {
    number: 1417,
    title: 'SCA exemption rules for low-value payments',
    type: 'story',
    status: 'done',
    priority: 'high',
    points: 8,
    assignee: 'jonas',
    sprint: 's21',
    tags: ['compliance'],
    parent: 1431,
    completedAt: '2026-09-16T14:20:00Z',
  },
  {
    number: 1418,
    title: 'Challenge screen for card authentication',
    type: 'story',
    status: 'done',
    priority: 'high',
    points: 5,
    assignee: 'dev',
    sprint: 's21',
    tags: ['compliance', 'web'],
    parent: 1431,
    completedAt: '2026-09-18T10:05:00Z',
  },
  {
    number: 1419,
    title: 'Feature flag for SCA per merchant',
    type: 'task',
    status: 'done',
    priority: 'medium',
    points: 2,
    assignee: 'aiko',
    sprint: 's21',
    tags: ['compliance'],
    parent: 1431,
    completedAt: '2026-09-09T16:40:00Z',
  },
  {
    number: 1420,
    title: 'Authentication timeout leaves order pending',
    type: 'bug',
    status: 'done',
    priority: 'high',
    points: 3,
    assignee: 'jonas',
    sprint: 's21',
    tags: ['checkout'],
    parent: 1431,
    completedAt: '2026-09-19T11:30:00Z',
  },
  {
    number: 1421,
    title: 'Ledger entries for authorisation holds',
    type: 'task',
    status: 'done',
    priority: 'medium',
    points: 5,
    assignee: 'sara',
    sprint: 's21',
    tags: ['ledger'],
    completedAt: '2026-09-17T15:00:00Z',
  },
  // Sprint 22 (closed)
  {
    number: 1422,
    title: 'Roll out SCA to all EU merchants',
    type: 'task',
    status: 'done',
    priority: 'highest',
    points: 3,
    assignee: 'mira',
    sprint: 's22',
    tags: ['compliance'],
    parent: 1431,
    completedAt: '2026-10-01T09:00:00Z',
  },
  {
    number: 1423,
    title: 'SCA audit log for regulators',
    type: 'story',
    status: 'done',
    priority: 'high',
    points: 5,
    assignee: 'aiko',
    sprint: 's22',
    tags: ['compliance', 'security'],
    parent: 1431,
    completedAt: '2026-09-29T13:45:00Z',
  },
  {
    number: 1424,
    title: 'Pick a 3-D Secure provider',
    type: 'task',
    status: 'done',
    priority: 'high',
    points: 2,
    assignee: 'mira',
    sprint: 's22',
    tags: ['compliance'],
    parent: 1432,
    completedAt: '2026-09-24T12:00:00Z',
  },
  {
    number: 1425,
    title: 'Challenge iframe cut off on small screens',
    type: 'bug',
    status: 'done',
    priority: 'medium',
    points: 2,
    assignee: 'dev',
    sprint: 's22',
    tags: ['web'],
    parent: 1431,
    completedAt: '2026-09-25T17:10:00Z',
  },
  {
    number: 1426,
    title: 'Card fingerprinting for fraud scoring',
    type: 'story',
    status: 'done',
    priority: 'medium',
    points: 8,
    assignee: 'jonas',
    sprint: 's22',
    tags: ['security'],
    completedAt: '2026-10-02T15:20:00Z',
  },
  // Sprint 23 (closed)
  {
    number: 1427,
    title: '3-D Secure challenge flow on web',
    type: 'story',
    status: 'done',
    priority: 'high',
    points: 8,
    assignee: 'dev',
    sprint: 's23',
    tags: ['compliance', 'web'],
    parent: 1432,
    completedAt: '2026-10-15T16:00:00Z',
  },
  {
    number: 1428,
    title: 'Store card tokens with the vault',
    type: 'story',
    status: 'done',
    priority: 'high',
    points: 5,
    assignee: 'jonas',
    sprint: 's23',
    tags: ['checkout', 'security'],
    parent: 1441,
    completedAt: '2026-10-13T11:25:00Z',
  },
  {
    number: 1429,
    title: 'Saved cards list in account settings',
    type: 'story',
    status: 'done',
    priority: 'medium',
    points: 5,
    assignee: 'sara',
    sprint: 's23',
    tags: ['checkout', 'web'],
    parent: 1441,
    completedAt: '2026-10-16T14:50:00Z',
  },
  {
    number: 1430,
    title: 'Frictionless flow skipped for exempt cards',
    type: 'bug',
    status: 'done',
    priority: 'high',
    points: 3,
    assignee: 'aiko',
    sprint: 's23',
    tags: ['compliance'],
    parent: 1432,
    completedAt: '2026-10-09T10:15:00Z',
  },
  {
    number: 1433,
    title: 'Daily settlement file import',
    type: 'task',
    status: 'done',
    priority: 'medium',
    points: 5,
    assignee: 'sara',
    sprint: 's23',
    tags: ['ledger'],
    parent: 1451,
    completedAt: '2026-10-17T15:40:00Z',
  },
  // Sprint 24
  {
    number: 1482,
    title: 'Checkout fails on saved cards',
    type: 'bug',
    status: 'in_progress',
    priority: 'highest',
    points: 5,
    assignee: 'mira',
    sprint: 's24',
    tags: ['checkout', 'web'],
    parent: 1441,
    target: '2026-10-26',
  },
  {
    number: 1477,
    title: 'Add Apple Pay to checkout',
    type: 'story',
    status: 'in_review',
    priority: 'high',
    points: 8,
    assignee: 'jonas',
    sprint: 's24',
    tags: ['checkout', 'ios'],
    parent: 1442,
  },
  {
    number: 1486,
    title: 'Show refund status in order history',
    type: 'story',
    status: 'in_progress',
    priority: 'medium',
    points: 3,
    assignee: 'sara',
    sprint: 's24',
    tags: ['orders'],
  },
  {
    number: 1479,
    title: 'Currency rounding off by one cent',
    type: 'bug',
    status: 'blocked',
    priority: 'highest',
    points: 3,
    assignee: 'jonas',
    sprint: 's24',
    tags: ['ledger'],
    parent: 1451,
    target: '2026-10-27',
  },
  {
    number: 1471,
    title: '3-D Secure for EU cards',
    type: 'story',
    status: 'done',
    priority: 'high',
    points: 8,
    assignee: 'mira',
    sprint: 's24',
    tags: ['compliance'],
    parent: 1432,
    target: '2026-10-28',
    completedAt: '2026-10-23T15:00:00Z',
  },
  {
    number: 1468,
    title: 'Rotate webhook signing secret',
    type: 'task',
    status: 'done',
    priority: 'medium',
    points: 1,
    assignee: 'sara',
    sprint: 's24',
    tags: ['security'],
    completedAt: '2026-10-21T11:00:00Z',
  },
  // Sprint 25
  {
    number: 1490,
    title: 'Retry failed payouts automatically',
    type: 'task',
    status: 'todo',
    priority: 'high',
    points: 5,
    assignee: 'aiko',
    sprint: 's25',
    tags: ['payouts'],
    parent: 1462,
    target: '2026-10-30',
  },
  {
    number: 1488,
    title: 'Update receipt email template',
    type: 'task',
    status: 'todo',
    priority: 'medium',
    points: 2,
    assignee: 'dev',
    sprint: 's25',
    tags: ['email'],
    target: '2026-11-01',
  },
  // Sprint 26
  {
    number: 1497,
    title: 'Partial refunds for split payments',
    type: 'story',
    status: 'todo',
    priority: 'high',
    points: 8,
    sprint: 's26',
    parent: 1473,
  },
  {
    number: 1498,
    title: 'Webhook retries send duplicate events',
    type: 'bug',
    status: 'todo',
    priority: 'high',
    points: 3,
    sprint: 's26',
    assignee: 'dev',
  },
  {
    number: 1506,
    title: 'Retry button on failed checkout',
    type: 'story',
    status: 'todo',
    priority: 'medium',
    points: 3,
    sprint: 's26',
  },
  {
    number: 1507,
    title: 'Payout report totals ignore refunds',
    type: 'bug',
    status: 'todo',
    priority: 'medium',
    points: 2,
    sprint: 's26',
  },
  // Sprint 27 is planned but still empty.
  // Backlog
  {
    number: 1492,
    title: 'Saved payment methods on mobile',
    type: 'story',
    status: 'todo',
    priority: 'low',
    points: 5,
    tags: ['mobile'],
  },
  {
    number: 1495,
    title: 'Export transactions to CSV',
    type: 'story',
    status: 'todo',
    priority: 'medium',
    points: 5,
  },
  {
    number: 1503,
    title: 'Dark mode for emailed receipts',
    type: 'story',
    status: 'todo',
    priority: 'low',
    points: 2,
  },
  {
    number: 1501,
    title: 'Tidy up onboarding copy',
    type: 'task',
    status: 'todo',
    priority: 'low',
    points: 1,
  },
  {
    number: 1505,
    title: 'Show fees before payout confirmation',
    type: 'story',
    status: 'todo',
    priority: 'medium',
    points: 3,
  },
  {
    number: 1499,
    title: 'Card expiry reminder emails',
    type: 'story',
    status: 'todo',
    priority: 'low',
    points: 3,
    assignee: 'sara',
  },
  {
    number: 1494,
    title: 'Upgrade the PDF invoice library',
    type: 'task',
    status: 'todo',
    priority: 'lowest',
    points: 2,
  },
  {
    number: 1509,
    title: 'Multi-currency wallets',
    type: 'story',
    status: 'todo',
    priority: 'low',
    points: 13,
    parent: 1416,
  },
  {
    number: 1504,
    title: 'Log declined 3-D Secure attempts',
    type: 'task',
    status: 'todo',
    priority: 'medium',
    points: 2,
    assignee: 'aiko',
  },
  {
    number: 1508,
    title: 'Remove legacy Stripe v2 client',
    type: 'task',
    status: 'todo',
    priority: 'lowest',
    points: 5,
  },
];

/** The dashboard's recent activity. "Logged 3h on PAY-1486" has no model yet, so it's left out. */
const ACTIVITY = [
  {
    item: 1477,
    actor: 'jonas',
    action: 'status_changed',
    data: { from: 'in_progress', to: 'in_review' },
    at: '2026-10-26T13:56:00Z',
  },
  {
    item: 1482,
    actor: 'mira',
    action: 'commented',
    comment: 'Repro’d on Safari 18 only.',
    at: '2026-10-26T13:38:00Z',
  },
  {
    item: 1479,
    actor: 'jonas',
    action: 'status_changed',
    data: { from: 'in_progress', to: 'blocked' },
    at: '2026-10-26T12:00:00Z',
  },
  { item: 1498, actor: 'dev', action: 'created', data: {}, at: '2026-10-25T17:40:00Z' },
] as const;

/**
 * Files on work items. Only the rows are seeded, not the objects in storage, so download links
 * for these 404 until a file is uploaded at the same key.
 */
const ATTACHMENTS: {
  item: number;
  uploadedBy: Person;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  at: string;
}[] = [
  {
    item: 1482,
    uploadedBy: 'mira',
    fileName: 'safari-18-checkout-error.png',
    mimeType: 'image/png',
    sizeBytes: 248_316,
    at: '2026-10-26T13:37:00Z',
  },
  {
    item: 1482,
    uploadedBy: 'tom',
    fileName: 'har-checkout-saved-card.har',
    mimeType: 'application/json',
    sizeBytes: 1_204_882,
    at: '2026-10-26T14:10:00Z',
  },
  {
    item: 1477,
    uploadedBy: 'lena',
    fileName: 'apple-pay-button-specs.pdf',
    mimeType: 'application/pdf',
    sizeBytes: 812_450,
    at: '2026-10-20T09:15:00Z',
  },
  {
    item: 1477,
    uploadedBy: 'jonas',
    fileName: 'apple-pay-sheet.mov',
    mimeType: 'video/quicktime',
    sizeBytes: 2_980_114,
    at: '2026-10-26T13:50:00Z',
  },
  {
    item: 1479,
    uploadedBy: 'jonas',
    fileName: 'rounding-mismatches-oct.csv',
    mimeType: 'text/csv',
    sizeBytes: 18_904,
    at: '2026-10-26T11:52:00Z',
  },
  {
    item: 1486,
    uploadedBy: 'lena',
    fileName: 'order-history-refund-states.png',
    mimeType: 'image/png',
    sizeBytes: 391_027,
    at: '2026-10-21T10:30:00Z',
  },
  {
    item: 1471,
    uploadedBy: 'mira',
    fileName: 'psd2-sca-test-report.pdf',
    mimeType: 'application/pdf',
    sizeBytes: 547_300,
    at: '2026-10-23T14:45:00Z',
  },
  {
    item: 1488,
    uploadedBy: 'lena',
    fileName: 'receipt-email-v2.html',
    mimeType: 'text/html',
    sizeBytes: 12_480,
    at: '2026-10-29T16:05:00Z',
  },
];

/**
 * Dashboard layouts on Payments, as the keys in apps/web/.../dashboard/widgets. People left out
 * get the defaults. Real members aren't seeded, so they start on the default layout too.
 */
const PREFERENCES: { person: Person; widgets: string[]; theme: 'light' | 'dark' }[] = [
  { person: 'mira', widgets: ['burndown', 'status', 'activity', 'next-items'], theme: 'dark' },
  { person: 'jonas', widgets: ['next-items', 'activity'], theme: 'dark' },
  { person: 'dev', widgets: ['next-items', 'status', 'burndown'], theme: 'light' },
  { person: 'tom', widgets: ['status', 'activity'], theme: 'light' },
];

// -----------------------------------------------------------------------------------------------

/** Fractional-index ranks in order (a0, a1, … aZ, az), as generateNKeysBetween would give. */
const DIGITS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const rankAt = (index: number) => `a${DIGITS[index]}`;

/** A Tiptap document with one paragraph. */
const doc = (text: string) => ({
  type: 'doc',
  content: [{ type: 'paragraph', content: [{ type: 'text', text }] }],
});

const findOrganization = async () => {
  const slug = process.env.SEED_ORG;
  if (slug) return prisma.organization.findUniqueOrThrow({ where: { slug } });
  const organizations = await prisma.organization.findMany({ select: { id: true, slug: true } });
  if (organizations.length === 1) return organizations[0];
  throw new Error(
    organizations.length === 0
      ? 'No organization yet: sign up in the app first, then seed.'
      : `Pick one with SEED_ORG: ${organizations.map((o) => o.slug).join(', ')}`,
  );
};

const seedPeople = async (organizationId: string) => {
  for (const person of Object.keys(PEOPLE) as Person[]) {
    const { name } = PEOPLE[person];
    await prisma.user.upsert({
      where: { id: userId(person) },
      create: { id: userId(person), name, email: emailOf(person), emailVerified: true },
      update: { name },
    });
    await prisma.member.upsert({
      where: { organizationId_userId: { organizationId, userId: userId(person) } },
      create: {
        id: `${userId(person)}_${organizationId}`,
        organizationId,
        userId: userId(person),
        role: 'member',
        createdAt: new Date(),
      },
      update: {},
    });
  }

  await prisma.timeOff.deleteMany({
    where: { organizationId, userId: { in: Object.keys(PEOPLE).map((p) => userId(p as Person)) } },
  });
  await prisma.timeOff.createMany({
    data: TIME_OFF.map(({ person, type, start, end }) => ({
      organizationId,
      userId: userId(person),
      type,
      startDate: day(start),
      endDate: day(end),
    })),
  });
};

/** Everyone already in the organization (not the demo people): admins stay admins. */
const realMembers = async (organizationId: string) => {
  const members = await prisma.member.findMany({
    where: {
      organizationId,
      userId: { notIn: Object.keys(PEOPLE).map((p) => userId(p as Person)) },
    },
    select: { userId: true, role: true },
  });
  return members.map(({ userId, role }) => ({
    userId,
    role: role === 'member' ? ('member' as const) : ('admin' as const),
  }));
};

const seedPayments = async (organizationId: string) => {
  const project = await prisma.project.create({
    data: {
      organizationId,
      ...PAYMENTS,
      nextItemNumber: Math.max(...[...EPICS, ...ITEMS].map((i) => i.number)) + 1,
      members: {
        create: [
          ...(Object.keys(PEOPLE) as Person[]).map((person) => ({
            userId: userId(person),
            role: person === 'mira' ? ('admin' as const) : ('member' as const),
            title: PEOPLE[person].title,
            estimates: PEOPLE[person].estimates,
          })),
          ...(await realMembers(organizationId)),
        ],
      },
      holidays: { create: HOLIDAYS.map(({ date, name }) => ({ date: day(date), name })) },
    },
  });

  const sprintIds = new Map<string, string>();
  for (const sprint of SPRINTS) {
    const { id } = await prisma.sprint.create({
      data: {
        projectId: project.id,
        name: sprint.name,
        goal: sprint.goal,
        startDate: day(sprint.start),
        endDate: day(sprint.end),
        state: sprint.state,
        startedAt: sprint.startedAt && at(sprint.startedAt),
        closedAt: sprint.closedAt && at(sprint.closedAt),
      },
    });
    sprintIds.set(sprint.id, id);
  }

  // Parents first, so children can point at them. Ranks count up within each sprint or backlog.
  const itemIds = new Map<number, string>();
  const nextRank = new Map<string, number>();
  for (const item of [...EPICS, ...ITEMS]) {
    const group = item.sprint ?? 'backlog';
    const rank = nextRank.get(group) ?? 0;
    nextRank.set(group, rank + 1);
    const { id } = await prisma.workItem.create({
      data: {
        projectId: project.id,
        number: item.number,
        type: item.type,
        title: item.title,
        status: item.status,
        atRisk: item.atRisk ?? false,
        priority: item.priority ?? 'medium',
        points: item.points,
        tags: item.tags ?? [],
        startDate: item.start && day(item.start),
        targetDate: item.target && day(item.target),
        sprintId: item.sprint && sprintIds.get(item.sprint),
        rank: rankAt(rank),
        parentId: item.parent ? itemIds.get(item.parent) : null,
        assigneeId: item.assignee && userId(item.assignee),
        reporterId: userId('mira'),
        completedAt: item.completedAt && at(item.completedAt),
      },
    });
    itemIds.set(item.number, id);
  }

  for (const entry of ACTIVITY) {
    const workItemId = itemIds.get(entry.item);
    if (!workItemId) throw new Error(`Activity on PAY-${entry.item}, which isn't seeded`);
    const actorId = userId(entry.actor);
    const createdAt = at(entry.at);
    let data: object = 'data' in entry ? entry.data : {};
    if ('comment' in entry) {
      const comment = await prisma.comment.create({
        data: { workItemId, authorId: actorId, body: doc(entry.comment), createdAt },
      });
      data = { commentId: comment.id, quote: entry.comment };
    }
    await prisma.activity.create({
      data: { projectId: project.id, workItemId, actorId, action: entry.action, data, createdAt },
    });
  }

  await prisma.attachment.createMany({
    data: ATTACHMENTS.map((attachment) => {
      const workItemId = itemIds.get(attachment.item);
      if (!workItemId) throw new Error(`Attachment on PAY-${attachment.item}, which isn't seeded`);
      return {
        workItemId,
        uploadedById: userId(attachment.uploadedBy),
        fileName: attachment.fileName,
        storageKey: `seed/${organizationId}/PAY-${attachment.item}/${attachment.fileName}`,
        mimeType: attachment.mimeType,
        sizeBytes: attachment.sizeBytes,
        createdAt: at(attachment.at),
      };
    }),
  });

  await prisma.userPreference.createMany({
    data: PREFERENCES.map(({ person, widgets, theme }) => ({
      userId: userId(person),
      projectId: project.id,
      widgets,
      theme,
    })),
  });

  return project;
};

const seedIos = async (organizationId: string) =>
  prisma.project.create({
    data: {
      organizationId,
      ...IOS,
      members: {
        create: [
          { userId: userId('sara'), role: 'admin', title: PEOPLE.sara.title },
          { userId: userId('lena'), title: PEOPLE.lena.title, estimates: false },
          ...(await realMembers(organizationId)),
        ],
      },
    },
  });

const main = async () => {
  const organization = await findOrganization();
  console.log(`Seeding ${organization.slug}…`);

  await seedPeople(organization.id);
  // Deleting a project takes its sprints, work items, comments and activity with it.
  await prisma.project.deleteMany({
    where: { organizationId: organization.id, key: { in: [PAYMENTS.key, IOS.key] } },
  });
  const payments = await seedPayments(organization.id);
  const ios = await seedIos(organization.id);

  console.log(`Seeded ${payments.key} (${payments.id}) and ${ios.key} (${ios.id}).`);
};

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
