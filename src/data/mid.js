// Mid track: 12 employees, more edge cases, VLOOKUP returns col 3 (manager)

function row(...vals) {
  return Object.fromEntries(vals.map((v, i) => [i, v === null ? { v: '' } : { v }]))
}

// Extra complexity vs entry:
//  - 3-column DeptRef (DeptCode | DeptName | Manager); T1 pulls Manager (col_index=3)
//  - Trickier names: O'Brien, hyphenated, mixed-length whitespace
//  - More blank emails (5/12)
//  - T3 also requires UPPER for DeptCode → col K (NormalizedCode)

const employeeRows = {
  0:  row('EmpID','RawName','DeptCode','StartDate','AnnualSalary','RatingPct','Manager','CleanName','SafeEmail','Email','NormalizedCode'),
  1:  row(2001,'  michael o\'brien  ','hr',43466,62000,0.81,'','','','mobrien@meridian.com',''),
  2:  row(2002,'PATRICIA CHEN-DAVIS','fin',44593,88000,0.94,'','','','',''),
  3:  row(2003,'  robert  lee','mkt',43831,57000,0.72,'','','','rlee@meridian.com',''),
  4:  row(2004,'mary-jane SMITH  ','it',45197,91000,0.88,'','','','mjsmith@meridian.com',''),
  5:  row(2005,'DAVID GARCIA','ops',44197,69000,0.77,'','','','',''),
  6:  row(2006,'  jennifer WU','hr',44927,71000,0.85,'','','','jwu@meridian.com',''),
  7:  row(2007,'THOMAS   BROWN','fin',43196,95000,0.91,'','','','',''),
  8:  row(2008,'  linda MARTINEZ','mkt',45562,58000,0.68,'','','','lmartinez@meridian.com',''),
  9:  row(2009,'KEVIN PATEL','it',44380,83000,0.86,'','','','kpatel@meridian.com',''),
  10: row(2010,'  angela THOMPSON  ','ops',45927,64000,0.79,'','','','',''),
  11: row(2011,'BRIAN NGUYEN','hr',43562,60000,0.83,'','','','bnguyen@meridian.com',''),
  12: row(2012,'  carol  JACKSON','fin',44743,77000,0.90,'','','','',''),
}

const deptRefRows = {
  0: row('DeptCode','DeptName','Manager'),
  1: row('HR','Human Resources','Diana Park'),
  2: row('FIN','Finance','Alan Cooper'),
  3: row('MKT','Marketing','Rosa Reyes'),
  4: row('IT','Information Technology','Sam Okafor'),
  5: row('OPS','Operations','Nina Volkov'),
}

export const MID_TRACK = {
  id: 'mid',
  label: 'Mid Level',

  workbookData: {
    id: 'wb-mid',
    name: 'Meridian Corp — Employee Records (Mid)',
    sheetOrder: ['employees', 'deptref'],
    sheets: {
      employees: {
        id: 'employees',
        name: 'Employees',
        rowCount: 25,
        columnCount: 13,
        cellData: employeeRows,
      },
      deptref: {
        id: 'deptref',
        name: 'DeptRef',
        rowCount: 8,
        columnCount: 3,
        cellData: deptRefRows,
      },
    },
  },

  tasks: [
    {
      id: 't1',
      label: 'Task 1 — VLOOKUP',
      minutes: 10,
      targetSheet: 'Employees',
      instructions: [
        'Column G (Manager) is blank for all employees.',
        'Write a VLOOKUP formula in G2 that pulls each employee\'s department manager from the DeptRef sheet.',
        'Column C has the department code (lowercase). DeptRef has codes in column A and manager names in column C.',
        'Hint: the DeptRef codes are uppercase — you\'ll need to handle the case difference.',
        'Fill G2 through G13.',
      ],
      timeLabel: '10 minutes',
    },
    {
      id: 't2',
      label: 'Task 2 — Format',
      minutes: 6,
      targetSheet: 'Employees',
      instructions: [
        'Three columns need proper formatting:',
        '• Column D (StartDate) — format as a date (e.g. 3/22/2021)',
        '• Column E (AnnualSalary) — format as currency (e.g. $88,000)',
        '• Column F (RatingPct) — format as a percentage (e.g. 94%)',
        'Apply the formatting to rows 2 through 13.',
      ],
      timeLabel: '6 minutes',
    },
    {
      id: 't3',
      label: 'Task 3 — Scrub',
      minutes: 10,
      targetSheet: 'Employees',
      instructions: [
        'The RawName column (B) has extra/inconsistent spaces and wrong capitalization. Column C (DeptCode) is all lowercase and needs to be uppercase.',
        '• In column H (CleanName): formula to trim spaces and properly capitalize the name.',
        '• In column I (SafeEmail): formula that shows the email from column J, or "N/A" if blank.',
        '• In column K (NormalizedCode): formula to convert the DeptCode in column C to uppercase.',
        'Fill H2:H13, I2:I13, and K2:K13.',
      ],
      timeLabel: '10 minutes',
    },
  ],

  answerKey: {
    t1: [
      { row: 1,  col: 6, expected: 'Diana Park',  requireFormula: 'VLOOKUP' },
      { row: 2,  col: 6, expected: 'Alan Cooper',  requireFormula: 'VLOOKUP' },
      { row: 3,  col: 6, expected: 'Rosa Reyes',   requireFormula: 'VLOOKUP' },
      { row: 4,  col: 6, expected: 'Sam Okafor',   requireFormula: 'VLOOKUP' },
      { row: 5,  col: 6, expected: 'Nina Volkov',  requireFormula: 'VLOOKUP' },
      { row: 6,  col: 6, expected: 'Diana Park',   requireFormula: 'VLOOKUP' },
      { row: 7,  col: 6, expected: 'Alan Cooper',  requireFormula: 'VLOOKUP' },
      { row: 8,  col: 6, expected: 'Rosa Reyes',   requireFormula: 'VLOOKUP' },
      { row: 9,  col: 6, expected: 'Sam Okafor',   requireFormula: 'VLOOKUP' },
      { row: 10, col: 6, expected: 'Nina Volkov',  requireFormula: 'VLOOKUP' },
      { row: 11, col: 6, expected: 'Diana Park',   requireFormula: 'VLOOKUP' },
      { row: 12, col: 6, expected: 'Alan Cooper',  requireFormula: 'VLOOKUP' },
    ],
    t2: [
      { row: 1,  col: 3, expectedPattern: 'date' },
      { row: 1,  col: 4, expectedPattern: 'currency' },
      { row: 1,  col: 5, expectedPattern: 'percent' },
      { row: 6,  col: 3, expectedPattern: 'date' },
      { row: 6,  col: 4, expectedPattern: 'currency' },
      { row: 6,  col: 5, expectedPattern: 'percent' },
      { row: 12, col: 3, expectedPattern: 'date' },
      { row: 12, col: 4, expectedPattern: 'currency' },
      { row: 12, col: 5, expectedPattern: 'percent' },
    ],
    t3: [
      { row: 1,  col: 7, expected: "Michael O'Brien",    requireFormula: ['TRIM','PROPER'] },
      { row: 2,  col: 7, expected: 'Patricia Chen-Davis', requireFormula: ['TRIM','PROPER'] },
      { row: 3,  col: 7, expected: 'Robert Lee',          requireFormula: ['TRIM','PROPER'] },
      { row: 4,  col: 7, expected: 'Mary-Jane Smith',     requireFormula: ['TRIM','PROPER'] },
      { row: 5,  col: 7, expected: 'David Garcia',        requireFormula: ['TRIM','PROPER'] },
      { row: 6,  col: 7, expected: 'Jennifer Wu',         requireFormula: ['TRIM','PROPER'] },
      { row: 7,  col: 7, expected: 'Thomas Brown',        requireFormula: ['TRIM','PROPER'] },
      { row: 8,  col: 7, expected: 'Linda Martinez',      requireFormula: ['TRIM','PROPER'] },
      { row: 9,  col: 7, expected: 'Kevin Patel',         requireFormula: ['TRIM','PROPER'] },
      { row: 10, col: 7, expected: 'Angela Thompson',     requireFormula: ['TRIM','PROPER'] },
      { row: 11, col: 7, expected: 'Brian Nguyen',        requireFormula: ['TRIM','PROPER'] },
      { row: 12, col: 7, expected: 'Carol Jackson',       requireFormula: ['TRIM','PROPER'] },
      { row: 1,  col: 8, expected: 'mobrien@meridian.com',   requireFormula: ['IF'] },
      { row: 2,  col: 8, expected: 'N/A',                    requireFormula: ['IF'] },
      { row: 3,  col: 8, expected: 'rlee@meridian.com',      requireFormula: ['IF'] },
      { row: 4,  col: 8, expected: 'mjsmith@meridian.com',   requireFormula: ['IF'] },
      { row: 5,  col: 8, expected: 'N/A',                    requireFormula: ['IF'] },
      { row: 10, col: 8, expected: 'N/A',                    requireFormula: ['IF'] },
      { row: 1,  col: 10, expected: 'HR',  requireFormula: ['UPPER'] },
      { row: 2,  col: 10, expected: 'FIN', requireFormula: ['UPPER'] },
      { row: 3,  col: 10, expected: 'MKT', requireFormula: ['UPPER'] },
      { row: 4,  col: 10, expected: 'IT',  requireFormula: ['UPPER'] },
      { row: 5,  col: 10, expected: 'OPS', requireFormula: ['UPPER'] },
    ],
  },
}
