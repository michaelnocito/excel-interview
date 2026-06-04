// Entry track: 8 employees, guided instructions, standard VLOOKUP col index

function row(...vals) {
  return Object.fromEntries(vals.map((v, i) => [i, v === null ? { v: '' } : { v }]))
}

// Employees sheet columns:
//  A0 EmpID  B1 RawName  C2 DeptCode  D3 StartDate  E4 AnnualSalary  F5 RatingPct
//  G6 Department(T1)  H7 CleanName(T3)  I8 SafeEmail(T3)  J9 Email(src)
//  K10 CityState(src)  L11 City(T4)  M12 State(T4)  N13 AccountKey(T5)  O14 MigrationStatus(T6)
const employeeRows = {
  0: row('EmpID','RawName','DeptCode','StartDate','AnnualSalary','RatingPct','Department','CleanName','SafeEmail','Email','CityState','City','State','AccountKey','MigrationStatus'),
  1: row(1001,'  john smith  ','HR',43845,58000,0.87,'','','','jsmith@meridian.com','Boston, MA','','','',''),
  2: row(1002,'JANE DOE','FIN',44277,72000,0.92,'','','','','Denver, CO','','','',''),
  3: row(1003,'  bob johnson','MKT',43654,61000,0.78,'','','','bjohnson@meridian.com','Austin, TX','','','',''),
  4: row(1004,'sarah WILLIAMS  ','HR',44866,55000,0.95,'','','','','Seattle, WA','','','',''),
  5: row(1005,'MIKE Chen','IT',45031,85000,0.83,'','','','mchen@meridian.com','Chicago, IL','','','',''),
  6: row(1006,'  lisa PARK  ','OPS',44075,67000,0.74,'','','','lpark@meridian.com','Miami, FL','','','',''),
  7: row(1007,'JAMES WILSON','FIN',44361,79000,0.89,'','','','','Portland, OR','','','',''),
  8: row(1008,'  amy RODRIGUEZ','MKT',45350,63000,0.91,'','','','arodriguez@meridian.com','Phoenix, AZ','','','',''),
}

const deptRefRows = {
  0: row('DeptCode','DeptName'),
  1: row('HR','Human Resources'),
  2: row('FIN','Finance'),
  3: row('MKT','Marketing'),
  4: row('IT','Information Technology'),
  5: row('OPS','Operations'),
}

export const ENTRY_TRACK = {
  id: 'entry',
  label: 'Entry Level',

  workbookData: {
    id: 'wb-entry',
    name: 'Meridian Corp — Employee Records',
    sheetOrder: ['employees', 'deptref'],
    sheets: {
      employees: {
        id: 'employees',
        name: 'Employees',
        rowCount: 20,
        columnCount: 16,
        cellData: employeeRows,
      },
      deptref: {
        id: 'deptref',
        name: 'DeptRef',
        rowCount: 10,
        columnCount: 3,
        cellData: deptRefRows,
      },
    },
  },

  tasks: [
    {
      id: 't1',
      label: 'Task 1 — VLOOKUP',
      minutes: 8,
      targetSheet: 'Employees',
      instructions: [
        'Column G (Department) is blank for all employees.',
        'Write a VLOOKUP formula in G2 that pulls each employee\'s department name from the DeptRef sheet.',
        'Column C has the department code. DeptRef has codes in column A and names in column B.',
        'Fill G2 through G9.',
      ],
      timeLabel: '8 minutes',
    },
    {
      id: 't2',
      label: 'Task 2 — Format',
      minutes: 6,
      targetSheet: 'Employees',
      instructions: [
        'Three columns need proper formatting so they display correctly in the new system:',
        '• Column D (StartDate) — format as a date (e.g. 1/15/2020)',
        '• Column E (AnnualSalary) — format as currency (e.g. $58,000)',
        '• Column F (RatingPct) — format as a percentage (e.g. 87%)',
        'Apply the formatting to rows 2 through 9.',
      ],
      timeLabel: '6 minutes',
    },
    {
      id: 't3',
      label: 'Task 3 — Scrub',
      minutes: 8,
      targetSheet: 'Employees',
      instructions: [
        'The RawName column (B) has extra spaces and inconsistent capitalization.',
        '• In column H (CleanName): write a formula that trims the spaces and applies proper capitalization — e.g. "John Smith".',
        '• In column I (SafeEmail): write a formula that shows the email from column J. If column J is blank, show "N/A" instead.',
        'Fill H2:H9 and I2:I9.',
      ],
      timeLabel: '8 minutes',
    },
    {
      id: 't4',
      label: 'Task 4 — Split',
      minutes: 8,
      targetSheet: 'Employees',
      instructions: [
        'The legacy system stored location as a single "City, State" field in column K. The new system needs them separated.',
        '• In column L (City): pull out just the city name — e.g. "Boston".',
        '• In column M (State): pull out just the 2-letter state code — e.g. "MA".',
        'You can use Text to Columns or a formula — both are fine.',
        'Fill L2:M9.',
      ],
      timeLabel: '8 minutes',
    },
    {
      id: 't5',
      label: 'Task 5 — Combine',
      minutes: 6,
      targetSheet: 'Employees',
      instructions: [
        'The new system needs a single Account Key for each record, formatted as DEPTCODE-EMPID (e.g. HR-1001).',
        '• In column N (AccountKey): write a formula that joins the DeptCode (column C) and EmpID (column A) with a dash between them.',
        'Fill N2:N9.',
      ],
      timeLabel: '6 minutes',
    },
    {
      id: 't6',
      label: 'Task 6 — Flag',
      minutes: 8,
      targetSheet: 'Employees',
      instructions: [
        'Records missing an email address can\'t be migrated yet — they must be held for review.',
        '• In column O (MigrationStatus): write a formula that shows "HOLD" when the Email (column J) is blank, and "READY" when it has an email.',
        'Fill O2:O9.',
      ],
      timeLabel: '8 minutes',
    },
  ],

  answerKey: {
    t1: [
      { row: 1, col: 6, expected: 'Human Resources', requireFormula: 'VLOOKUP' },
      { row: 2, col: 6, expected: 'Finance',          requireFormula: 'VLOOKUP' },
      { row: 3, col: 6, expected: 'Marketing',        requireFormula: 'VLOOKUP' },
      { row: 4, col: 6, expected: 'Human Resources',  requireFormula: 'VLOOKUP' },
      { row: 5, col: 6, expected: 'Information Technology', requireFormula: 'VLOOKUP' },
      { row: 6, col: 6, expected: 'Operations',       requireFormula: 'VLOOKUP' },
      { row: 7, col: 6, expected: 'Finance',           requireFormula: 'VLOOKUP' },
      { row: 8, col: 6, expected: 'Marketing',         requireFormula: 'VLOOKUP' },
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
      { row: 1, col: 7, expected: 'John Smith',    requireFormula: ['TRIM','PROPER'] },
      { row: 2, col: 7, expected: 'Jane Doe',      requireFormula: ['TRIM','PROPER'] },
      { row: 3, col: 7, expected: 'Bob Johnson',   requireFormula: ['TRIM','PROPER'] },
      { row: 4, col: 7, expected: 'Sarah Williams',requireFormula: ['TRIM','PROPER'] },
      { row: 5, col: 7, expected: 'Mike Chen',     requireFormula: ['TRIM','PROPER'] },
      { row: 6, col: 7, expected: 'Lisa Park',     requireFormula: ['TRIM','PROPER'] },
      { row: 7, col: 7, expected: 'James Wilson',  requireFormula: ['TRIM','PROPER'] },
      { row: 8, col: 7, expected: 'Amy Rodriguez', requireFormula: ['TRIM','PROPER'] },
      { row: 1, col: 8, expected: 'jsmith@meridian.com',     requireFormula: ['IF'] },
      { row: 2, col: 8, expected: 'N/A',                     requireFormula: ['IF'] },
      { row: 3, col: 8, expected: 'bjohnson@meridian.com',   requireFormula: ['IF'] },
      { row: 4, col: 8, expected: 'N/A',                     requireFormula: ['IF'] },
      { row: 5, col: 8, expected: 'mchen@meridian.com',      requireFormula: ['IF'] },
      { row: 6, col: 8, expected: 'lpark@meridian.com',      requireFormula: ['IF'] },
      { row: 7, col: 8, expected: 'N/A',                     requireFormula: ['IF'] },
      { row: 8, col: 8, expected: 'arodriguez@meridian.com', requireFormula: ['IF'] },
    ],
    // Split — value only (Text-to-Columns or formula both valid; Carl eyeballs method)
    t4: [
      { row: 1, col: 11, expected: 'Boston' },   { row: 1, col: 12, expected: 'MA' },
      { row: 2, col: 11, expected: 'Denver' },   { row: 2, col: 12, expected: 'CO' },
      { row: 3, col: 11, expected: 'Austin' },   { row: 3, col: 12, expected: 'TX' },
      { row: 4, col: 11, expected: 'Seattle' },  { row: 4, col: 12, expected: 'WA' },
      { row: 5, col: 11, expected: 'Chicago' },  { row: 5, col: 12, expected: 'IL' },
      { row: 6, col: 11, expected: 'Miami' },    { row: 6, col: 12, expected: 'FL' },
      { row: 7, col: 11, expected: 'Portland' }, { row: 7, col: 12, expected: 'OR' },
      { row: 8, col: 11, expected: 'Phoenix' },  { row: 8, col: 12, expected: 'AZ' },
    ],
    // Combine — must be a formula (hand-typing the key isn't the skill)
    t5: [
      { row: 1, col: 13, expected: 'HR-1001',  requireFormula: true },
      { row: 2, col: 13, expected: 'FIN-1002', requireFormula: true },
      { row: 3, col: 13, expected: 'MKT-1003', requireFormula: true },
      { row: 4, col: 13, expected: 'HR-1004',  requireFormula: true },
      { row: 5, col: 13, expected: 'IT-1005',  requireFormula: true },
      { row: 6, col: 13, expected: 'OPS-1006', requireFormula: true },
      { row: 7, col: 13, expected: 'FIN-1007', requireFormula: true },
      { row: 8, col: 13, expected: 'MKT-1008', requireFormula: true },
    ],
    // Flag — must use IF logic
    t6: [
      { row: 1, col: 14, expected: 'READY', requireFormula: ['IF'] },
      { row: 2, col: 14, expected: 'HOLD',  requireFormula: ['IF'] },
      { row: 3, col: 14, expected: 'READY', requireFormula: ['IF'] },
      { row: 4, col: 14, expected: 'HOLD',  requireFormula: ['IF'] },
      { row: 5, col: 14, expected: 'READY', requireFormula: ['IF'] },
      { row: 6, col: 14, expected: 'READY', requireFormula: ['IF'] },
      { row: 7, col: 14, expected: 'HOLD',  requireFormula: ['IF'] },
      { row: 8, col: 14, expected: 'READY', requireFormula: ['IF'] },
    ],
  },
}
