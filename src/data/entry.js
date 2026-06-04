// Entry track: 8 employees, guided instructions, standard VLOOKUP col index

function row(...vals) {
  return Object.fromEntries(vals.map((v, i) => [i, v === null ? { v: '' } : { v }]))
}

// Employees sheet: A=EmpID B=RawName C=DeptCode D=StartDate E=AnnualSalary
//                  F=RatingPct G=Department(blank,T1) H=CleanName(blank,T3)
//                  I=SafeEmail(blank,T3) J=Email(original)
const employeeRows = {
  0: row('EmpID','RawName','DeptCode','StartDate','AnnualSalary','RatingPct','Department','CleanName','SafeEmail','Email'),
  1: row(1001,'  john smith  ','HR',43845,58000,0.87,'','','','jsmith@meridian.com'),
  2: row(1002,'JANE DOE','FIN',44277,72000,0.92,'','','',''),
  3: row(1003,'  bob johnson','MKT',43654,61000,0.78,'','','','bjohnson@meridian.com'),
  4: row(1004,'sarah WILLIAMS  ','HR',44866,55000,0.95,'','','',''),
  5: row(1005,'MIKE Chen','IT',45031,85000,0.83,'','','','mchen@meridian.com'),
  6: row(1006,'  lisa PARK  ','OPS',44075,67000,0.74,'','','','lpark@meridian.com'),
  7: row(1007,'JAMES WILSON','FIN',44361,79000,0.89,'','','',''),
  8: row(1008,'  amy RODRIGUEZ','MKT',45350,63000,0.91,'','','','arodriguez@meridian.com'),
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
        columnCount: 12,
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
  },
}
