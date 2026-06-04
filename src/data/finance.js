// Finance template: vendor invoices — accounts-payable migration & cleanup

function row(...vals) {
  return Object.fromEntries(vals.map((v, i) => [i, v === null ? { v: '' } : { v }]))
}

// Invoices sheet columns:
//  A0 InvoiceID  B1 VendorRaw  C2 GLCode  D3 InvoiceDate  E4 Amount  F5 TaxRate
//  G6 GLName(T1)  H7 CleanVendor(T3)  I8 SafePO(T3)  J9 PONumber(src)
//  K10 VendorLoc(src)  L11 City(T4)  M12 State(T4)  N13 PayRef(T5)  O14 ReviewStatus(T6)
const invoiceRows = {
  0: row('InvoiceID','VendorRaw','GLCode','InvoiceDate','Amount','TaxRate','GLName','CleanVendor','SafePO','PONumber','VendorLoc','City','State','PayRef','ReviewStatus'),
  1: row('INV-001','  acme corp  ',4500,44927,1250.00,0.08,'','','','PO-9001','Chicago, IL','','','',''),
  2: row('INV-002','GLOBEX INC',6200,44958,8400.50,0.00,'','','','','Boston, MA','','','',''),
  3: row('INV-003','  initech',7000,44986,3200.00,0.08,'','','','PO-9003','Austin, TX','','','',''),
  4: row('INV-004','umbrella LLC  ',5100,45017,540.75,0.00,'','','','','Denver, CO','','','',''),
  5: row('INV-005','STARK industries',8300,45047,12500.00,0.08,'','','','PO-9005','Seattle, WA','','','',''),
  6: row('INV-006','  wayne enterprises  ',4500,45078,875.25,0.08,'','','','PO-9006','Miami, FL','','','',''),
  7: row('INV-007','HOOLI corp',6200,45108,6300.00,0.00,'','','','','Portland, OR','','','',''),
  8: row('INV-008','  cyberdyne',7000,45139,4100.00,0.08,'','','','PO-9008','Phoenix, AZ','','','',''),
}

const glRefRows = {
  0: row('GLCode','GLName'),
  1: row(4500,'Office Supplies'),
  2: row(5100,'Travel & Entertainment'),
  3: row(6200,'Professional Services'),
  4: row(7000,'Software Licenses'),
  5: row(8300,'Facilities'),
}

export const FINANCE_TRACK = {
  id: 'finance',
  label: 'Finance',

  workbookData: {
    id: 'wb-finance',
    name: 'Accounts Payable — Vendor Invoices',
    sheetOrder: ['invoices', 'glref'],
    sheets: {
      invoices: { id: 'invoices', name: 'Invoices', rowCount: 20, columnCount: 16, cellData: invoiceRows },
      glref:    { id: 'glref',    name: 'GLRef',    rowCount: 10, columnCount: 3,  cellData: glRefRows },
    },
  },

  tasks: [
    {
      id: 't1', label: 'Task 1 — VLOOKUP', minutes: 8, targetSheet: 'Invoices',
      instructions: [
        'Column G (GLName) is blank for all invoices.',
        'Write a VLOOKUP formula in G2 that pulls each invoice\'s GL account name from the GLRef sheet.',
        'Column C has the GL code. GLRef has codes in column A and names in column B.',
        'Fill G2 through G9.',
      ],
      timeLabel: '8 minutes',
    },
    {
      id: 't2', label: 'Task 2 — Format', minutes: 6, targetSheet: 'Invoices',
      instructions: [
        'Three columns need proper formatting for the finance system:',
        '• Column D (InvoiceDate) — format as a date',
        '• Column E (Amount) — format as currency (e.g. $1,250)',
        '• Column F (TaxRate) — format as a percentage (e.g. 8%)',
        'Apply the formatting to rows 2 through 9.',
      ],
      timeLabel: '6 minutes',
    },
    {
      id: 't3', label: 'Task 3 — Scrub', minutes: 8, targetSheet: 'Invoices',
      instructions: [
        'The VendorRaw column (B) has extra spaces and inconsistent capitalization.',
        '• In column H (CleanVendor): formula that trims spaces and applies proper capitalization.',
        '• In column I (SafePO): formula that shows the PO number from column J, or "MISSING" if column J is blank.',
        'Fill H2:H9 and I2:I9.',
      ],
      timeLabel: '8 minutes',
    },
    {
      id: 't4', label: 'Task 4 — Split', minutes: 8, targetSheet: 'Invoices',
      instructions: [
        'The vendor location in column K is a single "City, State" field. The new system needs them separated.',
        '• In column L (City): pull out just the city name.',
        '• In column M (State): pull out just the 2-letter state code.',
        'Text to Columns or a formula are both fine. Fill L2:M9.',
      ],
      timeLabel: '8 minutes',
    },
    {
      id: 't5', label: 'Task 5 — Combine', minutes: 6, targetSheet: 'Invoices',
      instructions: [
        'Build a Payment Reference for each invoice, formatted as GLCODE-INVOICEID (e.g. 4500-INV-001).',
        '• In column N (PayRef): write a formula that joins the GLCode (column C) and InvoiceID (column A) with a dash.',
        'Fill N2:N9.',
      ],
      timeLabel: '6 minutes',
    },
    {
      id: 't6', label: 'Task 6 — Flag', minutes: 8, targetSheet: 'Invoices',
      instructions: [
        'Invoices without a PO number can\'t be paid — they must be flagged for follow-up.',
        '• In column O (ReviewStatus): write a formula that shows "NO PO" when the PONumber (column J) is blank, and "OK" otherwise.',
        'Fill O2:O9.',
      ],
      timeLabel: '8 minutes',
    },
  ],

  answerKey: {
    t1: [
      { row: 1, col: 6, expected: 'Office Supplies',        requireFormula: 'VLOOKUP' },
      { row: 2, col: 6, expected: 'Professional Services',  requireFormula: 'VLOOKUP' },
      { row: 3, col: 6, expected: 'Software Licenses',      requireFormula: 'VLOOKUP' },
      { row: 4, col: 6, expected: 'Travel & Entertainment', requireFormula: 'VLOOKUP' },
      { row: 5, col: 6, expected: 'Facilities',             requireFormula: 'VLOOKUP' },
      { row: 6, col: 6, expected: 'Office Supplies',        requireFormula: 'VLOOKUP' },
      { row: 7, col: 6, expected: 'Professional Services',  requireFormula: 'VLOOKUP' },
      { row: 8, col: 6, expected: 'Software Licenses',      requireFormula: 'VLOOKUP' },
    ],
    t2: [
      { row: 1, col: 3, expectedPattern: 'date' },
      { row: 1, col: 4, expectedPattern: 'currency' },
      { row: 1, col: 5, expectedPattern: 'percent' },
      { row: 5, col: 3, expectedPattern: 'date' },
      { row: 5, col: 4, expectedPattern: 'currency' },
      { row: 5, col: 5, expectedPattern: 'percent' },
    ],
    t3: [
      { row: 1, col: 7, expected: 'Acme Corp',         requireFormula: ['TRIM','PROPER'] },
      { row: 2, col: 7, expected: 'Globex Inc',        requireFormula: ['TRIM','PROPER'] },
      { row: 3, col: 7, expected: 'Initech',           requireFormula: ['TRIM','PROPER'] },
      { row: 4, col: 7, expected: 'Umbrella Llc',      requireFormula: ['TRIM','PROPER'] },
      { row: 5, col: 7, expected: 'Stark Industries',  requireFormula: ['TRIM','PROPER'] },
      { row: 6, col: 7, expected: 'Wayne Enterprises', requireFormula: ['TRIM','PROPER'] },
      { row: 7, col: 7, expected: 'Hooli Corp',        requireFormula: ['TRIM','PROPER'] },
      { row: 8, col: 7, expected: 'Cyberdyne',         requireFormula: ['TRIM','PROPER'] },
      { row: 1, col: 8, expected: 'PO-9001', requireFormula: ['IF'] },
      { row: 2, col: 8, expected: 'MISSING', requireFormula: ['IF'] },
      { row: 3, col: 8, expected: 'PO-9003', requireFormula: ['IF'] },
      { row: 4, col: 8, expected: 'MISSING', requireFormula: ['IF'] },
      { row: 5, col: 8, expected: 'PO-9005', requireFormula: ['IF'] },
      { row: 6, col: 8, expected: 'PO-9006', requireFormula: ['IF'] },
      { row: 7, col: 8, expected: 'MISSING', requireFormula: ['IF'] },
      { row: 8, col: 8, expected: 'PO-9008', requireFormula: ['IF'] },
    ],
    t4: [
      { row: 1, col: 11, expected: 'Chicago' },  { row: 1, col: 12, expected: 'IL' },
      { row: 2, col: 11, expected: 'Boston' },   { row: 2, col: 12, expected: 'MA' },
      { row: 3, col: 11, expected: 'Austin' },   { row: 3, col: 12, expected: 'TX' },
      { row: 4, col: 11, expected: 'Denver' },   { row: 4, col: 12, expected: 'CO' },
      { row: 5, col: 11, expected: 'Seattle' },  { row: 5, col: 12, expected: 'WA' },
      { row: 6, col: 11, expected: 'Miami' },    { row: 6, col: 12, expected: 'FL' },
      { row: 7, col: 11, expected: 'Portland' }, { row: 7, col: 12, expected: 'OR' },
      { row: 8, col: 11, expected: 'Phoenix' },  { row: 8, col: 12, expected: 'AZ' },
    ],
    t5: [
      { row: 1, col: 13, expected: '4500-INV-001', requireFormula: true },
      { row: 2, col: 13, expected: '6200-INV-002', requireFormula: true },
      { row: 3, col: 13, expected: '7000-INV-003', requireFormula: true },
      { row: 4, col: 13, expected: '5100-INV-004', requireFormula: true },
      { row: 5, col: 13, expected: '8300-INV-005', requireFormula: true },
      { row: 6, col: 13, expected: '4500-INV-006', requireFormula: true },
      { row: 7, col: 13, expected: '6200-INV-007', requireFormula: true },
      { row: 8, col: 13, expected: '7000-INV-008', requireFormula: true },
    ],
    t6: [
      { row: 1, col: 14, expected: 'OK',    requireFormula: ['IF'] },
      { row: 2, col: 14, expected: 'NO PO', requireFormula: ['IF'] },
      { row: 3, col: 14, expected: 'OK',    requireFormula: ['IF'] },
      { row: 4, col: 14, expected: 'NO PO', requireFormula: ['IF'] },
      { row: 5, col: 14, expected: 'OK',    requireFormula: ['IF'] },
      { row: 6, col: 14, expected: 'OK',    requireFormula: ['IF'] },
      { row: 7, col: 14, expected: 'NO PO', requireFormula: ['IF'] },
      { row: 8, col: 14, expected: 'OK',    requireFormula: ['IF'] },
    ],
  },
}
