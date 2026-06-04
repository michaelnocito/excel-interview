// Junior Data Analyst template: product sales — gentle, mostly clean data

function row(...vals) {
  return Object.fromEntries(vals.map((v, i) => [i, v === null ? { v: '' } : { v }]))
}

// Sales sheet columns:
//  A0 OrderID  B1 ProductRaw  C2 CategoryCode  D3 OrderDate  E4 Revenue  F5 MarginPct
//  G6 Category(T1)  H7 CleanProduct(T3)  I8 SafeRep(T3)  J9 SalesRep(src)
//  K10 StoreLoc(src)  L11 City(T4)  M12 State(T4)  N13 SKU(T5)  O14 RevenueTier(T6)
const salesRows = {
  0: row('OrderID','ProductRaw','CategoryCode','OrderDate','Revenue','MarginPct','Category','CleanProduct','SafeRep','SalesRep','StoreLoc','City','State','SKU','RevenueTier'),
  1: row(5001,'  wireless mouse  ','ELEC',45200,250,0.35,'','','','K. Lee','Denver, CO','','','',''),
  2: row(5002,'COFFEE MAKER','HOME',45205,1200,0.28,'','','','','Austin, TX','','','',''),
  3: row(5003,'  board game','TOYS',45210,45,0.50,'','','','M. Ortiz','Boston, MA','','','',''),
  4: row(5004,'novel','BOOK',45212,18,0.40,'','','','S. Patel','Seattle, WA','','','',''),
  5: row(5005,'yoga MAT  ','SPRT',45215,980,0.45,'','','','','Miami, FL','','','',''),
  6: row(5006,'  usb cable','ELEC',45218,1500,0.55,'','','','J. Kim','Chicago, IL','','','',''),
  7: row(5007,'BLENDER','HOME',45221,320,0.30,'','','','R. Diaz','Portland, OR','','','',''),
  8: row(5008,'  puzzle','TOYS',45224,60,0.48,'','','','T. Howe','Phoenix, AZ','','','',''),
}

const catRefRows = {
  0: row('CategoryCode','CategoryName'),
  1: row('ELEC','Electronics'),
  2: row('HOME','Home & Kitchen'),
  3: row('TOYS','Toys & Games'),
  4: row('BOOK','Books'),
  5: row('SPRT','Sports'),
}

export const JR_ANALYST_TRACK = {
  id: 'jr-analyst',
  label: 'Junior Data Analyst',

  workbookData: {
    id: 'wb-jr-analyst',
    name: 'Product Sales — Q1 Orders',
    sheetOrder: ['sales', 'catref'],
    sheets: {
      sales:  { id: 'sales',  name: 'Sales',  rowCount: 20, columnCount: 16, cellData: salesRows },
      catref: { id: 'catref', name: 'CatRef', rowCount: 10, columnCount: 3,  cellData: catRefRows },
    },
  },

  tasks: [
    {
      id: 't1', label: 'Task 1 — VLOOKUP', minutes: 7, targetSheet: 'Sales',
      instructions: [
        'Column G (Category) is blank for all orders.',
        'Write a VLOOKUP formula in G2 that pulls the category name from the CatRef sheet.',
        'Column C has the category code. CatRef has codes in column A and names in column B.',
        'Fill G2 through G9.',
      ],
      timeLabel: '7 minutes',
    },
    {
      id: 't2', label: 'Task 2 — Format', minutes: 6, targetSheet: 'Sales',
      instructions: [
        'Three columns need proper formatting:',
        '• Column D (OrderDate) — format as a date',
        '• Column E (Revenue) — format as currency (e.g. $250)',
        '• Column F (MarginPct) — format as a percentage (e.g. 35%)',
        'Apply the formatting to rows 2 through 9.',
      ],
      timeLabel: '6 minutes',
    },
    {
      id: 't3', label: 'Task 3 — Scrub', minutes: 7, targetSheet: 'Sales',
      instructions: [
        'The ProductRaw column (B) has extra spaces and inconsistent capitalization.',
        '• In column H (CleanProduct): formula that trims spaces and applies proper capitalization.',
        '• In column I (SafeRep): formula that shows the sales rep from column J, or "UNASSIGNED" if column J is blank.',
        'Fill H2:H9 and I2:I9.',
      ],
      timeLabel: '7 minutes',
    },
    {
      id: 't4', label: 'Task 4 — Split', minutes: 7, targetSheet: 'Sales',
      instructions: [
        'The store location in column K is a single "City, State" field. Split it into two columns.',
        '• In column L (City): pull out just the city name.',
        '• In column M (State): pull out just the 2-letter state code.',
        'Text to Columns or a formula are both fine. Fill L2:M9.',
      ],
      timeLabel: '7 minutes',
    },
    {
      id: 't5', label: 'Task 5 — Combine', minutes: 6, targetSheet: 'Sales',
      instructions: [
        'Build a SKU for each order, formatted as CATEGORYCODE-ORDERID (e.g. ELEC-5001).',
        '• In column N (SKU): write a formula that joins the CategoryCode (column C) and OrderID (column A) with a dash.',
        'Fill N2:N9.',
      ],
      timeLabel: '6 minutes',
    },
    {
      id: 't6', label: 'Task 6 — Flag', minutes: 7, targetSheet: 'Sales',
      instructions: [
        'Flag the high-value orders for the sales report.',
        '• In column O (RevenueTier): write a formula that shows "TOP" when Revenue (column E) is 1000 or more, and "STANDARD" otherwise.',
        'Fill O2:O9.',
      ],
      timeLabel: '7 minutes',
    },
  ],

  answerKey: {
    t1: [
      { row: 1, col: 6, expected: 'Electronics',    requireFormula: 'VLOOKUP' },
      { row: 2, col: 6, expected: 'Home & Kitchen', requireFormula: 'VLOOKUP' },
      { row: 3, col: 6, expected: 'Toys & Games',   requireFormula: 'VLOOKUP' },
      { row: 4, col: 6, expected: 'Books',          requireFormula: 'VLOOKUP' },
      { row: 5, col: 6, expected: 'Sports',         requireFormula: 'VLOOKUP' },
      { row: 6, col: 6, expected: 'Electronics',    requireFormula: 'VLOOKUP' },
      { row: 7, col: 6, expected: 'Home & Kitchen', requireFormula: 'VLOOKUP' },
      { row: 8, col: 6, expected: 'Toys & Games',   requireFormula: 'VLOOKUP' },
    ],
    t2: [
      { row: 1, col: 3, expectedPattern: 'date' },
      { row: 1, col: 4, expectedPattern: 'currency' },
      { row: 1, col: 5, expectedPattern: 'percent' },
      { row: 6, col: 3, expectedPattern: 'date' },
      { row: 6, col: 4, expectedPattern: 'currency' },
      { row: 6, col: 5, expectedPattern: 'percent' },
    ],
    t3: [
      { row: 1, col: 7, expected: 'Wireless Mouse', requireFormula: ['TRIM','PROPER'] },
      { row: 2, col: 7, expected: 'Coffee Maker',   requireFormula: ['TRIM','PROPER'] },
      { row: 3, col: 7, expected: 'Board Game',     requireFormula: ['TRIM','PROPER'] },
      { row: 4, col: 7, expected: 'Novel',          requireFormula: ['TRIM','PROPER'] },
      { row: 5, col: 7, expected: 'Yoga Mat',       requireFormula: ['TRIM','PROPER'] },
      { row: 6, col: 7, expected: 'Usb Cable',      requireFormula: ['TRIM','PROPER'] },
      { row: 7, col: 7, expected: 'Blender',        requireFormula: ['TRIM','PROPER'] },
      { row: 8, col: 7, expected: 'Puzzle',         requireFormula: ['TRIM','PROPER'] },
      { row: 1, col: 8, expected: 'K. Lee',     requireFormula: ['IF'] },
      { row: 2, col: 8, expected: 'UNASSIGNED', requireFormula: ['IF'] },
      { row: 3, col: 8, expected: 'M. Ortiz',   requireFormula: ['IF'] },
      { row: 4, col: 8, expected: 'S. Patel',   requireFormula: ['IF'] },
      { row: 5, col: 8, expected: 'UNASSIGNED', requireFormula: ['IF'] },
      { row: 6, col: 8, expected: 'J. Kim',     requireFormula: ['IF'] },
      { row: 7, col: 8, expected: 'R. Diaz',    requireFormula: ['IF'] },
      { row: 8, col: 8, expected: 'T. Howe',    requireFormula: ['IF'] },
    ],
    t4: [
      { row: 1, col: 11, expected: 'Denver' },   { row: 1, col: 12, expected: 'CO' },
      { row: 2, col: 11, expected: 'Austin' },   { row: 2, col: 12, expected: 'TX' },
      { row: 3, col: 11, expected: 'Boston' },   { row: 3, col: 12, expected: 'MA' },
      { row: 4, col: 11, expected: 'Seattle' },  { row: 4, col: 12, expected: 'WA' },
      { row: 5, col: 11, expected: 'Miami' },    { row: 5, col: 12, expected: 'FL' },
      { row: 6, col: 11, expected: 'Chicago' },  { row: 6, col: 12, expected: 'IL' },
      { row: 7, col: 11, expected: 'Portland' }, { row: 7, col: 12, expected: 'OR' },
      { row: 8, col: 11, expected: 'Phoenix' },  { row: 8, col: 12, expected: 'AZ' },
    ],
    t5: [
      { row: 1, col: 13, expected: 'ELEC-5001', requireFormula: true },
      { row: 2, col: 13, expected: 'HOME-5002', requireFormula: true },
      { row: 3, col: 13, expected: 'TOYS-5003', requireFormula: true },
      { row: 4, col: 13, expected: 'BOOK-5004', requireFormula: true },
      { row: 5, col: 13, expected: 'SPRT-5005', requireFormula: true },
      { row: 6, col: 13, expected: 'ELEC-5006', requireFormula: true },
      { row: 7, col: 13, expected: 'HOME-5007', requireFormula: true },
      { row: 8, col: 13, expected: 'TOYS-5008', requireFormula: true },
    ],
    t6: [
      { row: 1, col: 14, expected: 'STANDARD', requireFormula: ['IF'] },
      { row: 2, col: 14, expected: 'TOP',      requireFormula: ['IF'] },
      { row: 3, col: 14, expected: 'STANDARD', requireFormula: ['IF'] },
      { row: 4, col: 14, expected: 'STANDARD', requireFormula: ['IF'] },
      { row: 5, col: 14, expected: 'STANDARD', requireFormula: ['IF'] },
      { row: 6, col: 14, expected: 'TOP',      requireFormula: ['IF'] },
      { row: 7, col: 14, expected: 'STANDARD', requireFormula: ['IF'] },
      { row: 8, col: 14, expected: 'STANDARD', requireFormula: ['IF'] },
    ],
  },
}
