// Data Analyst template: customer transactions — messy data, dedup with COUNTIF

function row(...vals) {
  return Object.fromEntries(vals.map((v, i) => [i, v === null ? { v: '' } : { v }]))
}

// Transactions sheet columns:
//  A0 TxnID  B1 CustomerID  C2 CustomerRaw  D3 SegmentCode  E4 TxnDate  F5 Amount  G6 DiscountPct
//  H7 Segment(T1)  I8 CleanCustomer(T3)  J9 SafeChannel(T3)  K10 Channel(src)
//  L11 CustomerCity(src, messy)  M12 City(T4)  N13 State(T4)  O14 TxnKey(T5)  P15 DupFlag(T6)
const txnRows = {
  0:  row('TxnID','CustomerID','CustomerRaw','SegmentCode','TxnDate','Amount','DiscountPct','Segment','CleanCustomer','SafeChannel','Channel','CustomerCity','City','State','TxnKey','DupFlag'),
  1:  row('T-1','C-100','  acme retail  ','PREM',45100,4200.00,0.10,'','','','Online','New York, NY','','','',''),
  2:  row('T-2','C-101','GLOBEX TRADING','STD',45103,1850.50,0.05,'','','','','los angeles,CA','','','',''),
  3:  row('T-3','C-100','  initech systems','BUS',45106,9300.00,0.15,'','','','Partner','Chicago , IL','','','',''),
  4:  row('T-4','C-102','umbrella health  ','ENT',45109,15400.00,0.20,'','','','Direct','  Houston, TX','','','',''),
  5:  row('T-5','C-103','STARK labs','PREM',45112,6700.00,0.10,'','','','','San Diego, CA','','','',''),
  6:  row('T-6','C-101','  wayne holdings','STD',45115,2200.00,0.05,'','','','Online','Dallas,TX','','','',''),
  7:  row('T-7','C-104','HOOLI media','BUS',45118,8800.00,0.15,'','','','Partner','San Jose , CA','','','',''),
  8:  row('T-8','C-100','  cyberdyne robotics  ','ENT',45121,21000.00,0.20,'','','','','Detroit, MI','','','',''),
  9:  row('T-9','C-105','soylent foods','PREM',45124,3400.00,0.10,'','','','Direct','Phoenix,AZ','','','',''),
  10: row('T-10','C-102','VANDELAY exports','STD',45127,1950.00,0.05,'','','','Online','Boston, MA','','','',''),
}

const segRefRows = {
  0: row('SegmentCode','SegmentName'),
  1: row('PREM','Premium'),
  2: row('STD','Standard'),
  3: row('BUS','Business'),
  4: row('ENT','Enterprise'),
}

export const ANALYST_TRACK = {
  id: 'analyst',
  label: 'Data Analyst',

  workbookData: {
    id: 'wb-analyst',
    name: 'Customer Transactions — Cleanup & QA',
    sheetOrder: ['transactions', 'segref'],
    sheets: {
      transactions: { id: 'transactions', name: 'Transactions', rowCount: 25, columnCount: 17, cellData: txnRows },
      segref:       { id: 'segref',       name: 'SegRef',       rowCount: 8,  columnCount: 3,  cellData: segRefRows },
    },
  },

  tasks: [
    {
      id: 't1', label: 'Task 1 — Lookup', minutes: 9, targetSheet: 'Transactions',
      instructions: [
        'Column H (Segment) is blank for all transactions.',
        'Write a lookup formula in H2 that pulls the segment name from the SegRef sheet using the SegmentCode in column D.',
        'VLOOKUP or INDEX/MATCH — either is fine.',
        'Fill H2 through H11.',
      ],
      timeLabel: '9 minutes',
    },
    {
      id: 't2', label: 'Task 2 — Format', minutes: 6, targetSheet: 'Transactions',
      instructions: [
        'Three columns need proper formatting:',
        '• Column E (TxnDate) — format as a date',
        '• Column F (Amount) — format as currency (e.g. $4,200)',
        '• Column G (DiscountPct) — format as a percentage (e.g. 10%)',
        'Apply the formatting to rows 2 through 11.',
      ],
      timeLabel: '6 minutes',
    },
    {
      id: 't3', label: 'Task 3 — Scrub', minutes: 9, targetSheet: 'Transactions',
      instructions: [
        'The CustomerRaw column (C) has extra spaces and inconsistent capitalization.',
        '• In column I (CleanCustomer): formula that trims spaces and applies proper capitalization.',
        '• In column J (SafeChannel): formula that shows the channel from column K, or "DIRECT" if column K is blank.',
        'Fill I2:I11 and J2:J11.',
      ],
      timeLabel: '9 minutes',
    },
    {
      id: 't4', label: 'Task 4 — Split', minutes: 9, targetSheet: 'Transactions',
      instructions: [
        'The CustomerCity field in column L is messy — inconsistent spacing and missing spaces after some commas.',
        '• In column M (City): pull out just the city name, cleanly trimmed.',
        '• In column N (State): pull out just the 2-letter state code.',
        'Watch the rows where the comma has no space or extra spaces. Text to Columns or a formula are both fine. Fill M2:N11.',
      ],
      timeLabel: '9 minutes',
    },
    {
      id: 't5', label: 'Task 5 — Combine', minutes: 7, targetSheet: 'Transactions',
      instructions: [
        'Build a transaction key formatted as SEGMENTCODE-TXNID (e.g. PREM-T-1).',
        '• In column O (TxnKey): write a formula that joins the SegmentCode (column D) and TxnID (column A) with a dash.',
        'Fill O2:O11.',
      ],
      timeLabel: '7 minutes',
    },
    {
      id: 't6', label: 'Task 6 — Flag Duplicates', minutes: 9, targetSheet: 'Transactions',
      instructions: [
        'Some customers appear more than once. Flag every row whose CustomerID is duplicated.',
        '• In column P (DupFlag): write a formula using COUNTIF that shows "DUP" when the CustomerID (column B) appears more than once in the list, and "UNIQUE" when it appears only once.',
        'Fill P2:P11.',
      ],
      timeLabel: '9 minutes',
    },
  ],

  answerKey: {
    t1: [
      { row: 1,  col: 7, expected: 'Premium',    requireFormula: true },
      { row: 2,  col: 7, expected: 'Standard',   requireFormula: true },
      { row: 3,  col: 7, expected: 'Business',   requireFormula: true },
      { row: 4,  col: 7, expected: 'Enterprise', requireFormula: true },
      { row: 5,  col: 7, expected: 'Premium',    requireFormula: true },
      { row: 6,  col: 7, expected: 'Standard',   requireFormula: true },
      { row: 7,  col: 7, expected: 'Business',   requireFormula: true },
      { row: 8,  col: 7, expected: 'Enterprise', requireFormula: true },
      { row: 9,  col: 7, expected: 'Premium',    requireFormula: true },
      { row: 10, col: 7, expected: 'Standard',   requireFormula: true },
    ],
    t2: [
      { row: 1,  col: 4, expectedPattern: 'date' },
      { row: 1,  col: 5, expectedPattern: 'currency' },
      { row: 1,  col: 6, expectedPattern: 'percent' },
      { row: 5,  col: 4, expectedPattern: 'date' },
      { row: 5,  col: 5, expectedPattern: 'currency' },
      { row: 5,  col: 6, expectedPattern: 'percent' },
      { row: 10, col: 4, expectedPattern: 'date' },
      { row: 10, col: 5, expectedPattern: 'currency' },
      { row: 10, col: 6, expectedPattern: 'percent' },
    ],
    t3: [
      { row: 1,  col: 8, expected: 'Acme Retail',        requireFormula: ['TRIM','PROPER'] },
      { row: 2,  col: 8, expected: 'Globex Trading',     requireFormula: ['TRIM','PROPER'] },
      { row: 3,  col: 8, expected: 'Initech Systems',    requireFormula: ['TRIM','PROPER'] },
      { row: 4,  col: 8, expected: 'Umbrella Health',    requireFormula: ['TRIM','PROPER'] },
      { row: 5,  col: 8, expected: 'Stark Labs',         requireFormula: ['TRIM','PROPER'] },
      { row: 6,  col: 8, expected: 'Wayne Holdings',     requireFormula: ['TRIM','PROPER'] },
      { row: 7,  col: 8, expected: 'Hooli Media',        requireFormula: ['TRIM','PROPER'] },
      { row: 8,  col: 8, expected: 'Cyberdyne Robotics', requireFormula: ['TRIM','PROPER'] },
      { row: 9,  col: 8, expected: 'Soylent Foods',      requireFormula: ['TRIM','PROPER'] },
      { row: 10, col: 8, expected: 'Vandelay Exports',   requireFormula: ['TRIM','PROPER'] },
      { row: 1,  col: 9, expected: 'Online',  requireFormula: ['IF'] },
      { row: 2,  col: 9, expected: 'DIRECT',  requireFormula: ['IF'] },
      { row: 3,  col: 9, expected: 'Partner', requireFormula: ['IF'] },
      { row: 4,  col: 9, expected: 'Direct',  requireFormula: ['IF'] },
      { row: 5,  col: 9, expected: 'DIRECT',  requireFormula: ['IF'] },
      { row: 6,  col: 9, expected: 'Online',  requireFormula: ['IF'] },
      { row: 7,  col: 9, expected: 'Partner', requireFormula: ['IF'] },
      { row: 8,  col: 9, expected: 'DIRECT',  requireFormula: ['IF'] },
      { row: 9,  col: 9, expected: 'Direct',  requireFormula: ['IF'] },
      { row: 10, col: 9, expected: 'Online',  requireFormula: ['IF'] },
    ],
    t4: [
      { row: 1,  col: 12, expected: 'New York' },    { row: 1,  col: 13, expected: 'NY' },
      { row: 2,  col: 12, expected: 'los angeles' }, { row: 2,  col: 13, expected: 'CA' },
      { row: 3,  col: 12, expected: 'Chicago' },     { row: 3,  col: 13, expected: 'IL' },
      { row: 4,  col: 12, expected: 'Houston' },     { row: 4,  col: 13, expected: 'TX' },
      { row: 5,  col: 12, expected: 'San Diego' },   { row: 5,  col: 13, expected: 'CA' },
      { row: 6,  col: 12, expected: 'Dallas' },      { row: 6,  col: 13, expected: 'TX' },
      { row: 7,  col: 12, expected: 'San Jose' },    { row: 7,  col: 13, expected: 'CA' },
      { row: 8,  col: 12, expected: 'Detroit' },     { row: 8,  col: 13, expected: 'MI' },
      { row: 9,  col: 12, expected: 'Phoenix' },     { row: 9,  col: 13, expected: 'AZ' },
      { row: 10, col: 12, expected: 'Boston' },      { row: 10, col: 13, expected: 'MA' },
    ],
    t5: [
      { row: 1,  col: 14, expected: 'PREM-T-1',  requireFormula: true },
      { row: 2,  col: 14, expected: 'STD-T-2',   requireFormula: true },
      { row: 3,  col: 14, expected: 'BUS-T-3',   requireFormula: true },
      { row: 4,  col: 14, expected: 'ENT-T-4',   requireFormula: true },
      { row: 5,  col: 14, expected: 'PREM-T-5',  requireFormula: true },
      { row: 6,  col: 14, expected: 'STD-T-6',   requireFormula: true },
      { row: 7,  col: 14, expected: 'BUS-T-7',   requireFormula: true },
      { row: 8,  col: 14, expected: 'ENT-T-8',   requireFormula: true },
      { row: 9,  col: 14, expected: 'PREM-T-9',  requireFormula: true },
      { row: 10, col: 14, expected: 'STD-T-10',  requireFormula: true },
    ],
    t6: [
      { row: 1,  col: 15, expected: 'DUP',    requireFormula: ['COUNTIF'] },
      { row: 2,  col: 15, expected: 'DUP',    requireFormula: ['COUNTIF'] },
      { row: 3,  col: 15, expected: 'DUP',    requireFormula: ['COUNTIF'] },
      { row: 4,  col: 15, expected: 'DUP',    requireFormula: ['COUNTIF'] },
      { row: 5,  col: 15, expected: 'UNIQUE', requireFormula: ['COUNTIF'] },
      { row: 6,  col: 15, expected: 'DUP',    requireFormula: ['COUNTIF'] },
      { row: 7,  col: 15, expected: 'UNIQUE', requireFormula: ['COUNTIF'] },
      { row: 8,  col: 15, expected: 'DUP',    requireFormula: ['COUNTIF'] },
      { row: 9,  col: 15, expected: 'UNIQUE', requireFormula: ['COUNTIF'] },
      { row: 10, col: 15, expected: 'DUP',    requireFormula: ['COUNTIF'] },
    ],
  },
}
