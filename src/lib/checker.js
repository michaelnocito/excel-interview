// Checks displayed cell values against the answer key.
// Returns { cellResults, taskScore, formulaFlags } per task.

const PATTERN_CHECKS = {
  date:     v => /\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/.test(String(v)),
  currency: v => String(v).includes('$'),
  percent:  v => String(v).includes('%'),
}

function getCell(univerAPI, sheetName, row, col) {
  try {
    const wb = univerAPI.getActiveWorkbook()
    const ws = wb.getSheetByName(sheetName)
    if (!ws) return { display: '', formula: '' }
    const range = ws.getRange(row, col, 1, 1)
    const display = (range.getDisplayValues?.() ?? [['']])[0][0]
    const formula = (range.getFormulas?.() ?? [['']])[0][0]
    return { display: String(display ?? ''), formula: String(formula ?? '') }
  } catch {
    return { display: '', formula: '' }
  }
}

function checkFormula(formula, required) {
  if (!required) return true
  const f = formula.toUpperCase()
  if (Array.isArray(required)) return required.every(r => f.includes(r.toUpperCase()))
  return f.includes(required.toUpperCase())
}

export function gradeTask(univerAPI, sheetName, answerCells) {
  return answerCells.map(spec => {
    const { display, formula } = getCell(univerAPI, sheetName, spec.row, spec.col)

    let valuePass = false
    if (spec.expectedPattern) {
      valuePass = PATTERN_CHECKS[spec.expectedPattern]?.(display) ?? false
    } else {
      valuePass = display.trim() === String(spec.expected).trim()
    }

    const formulaUsed = formula.startsWith('=')
    const formulaPass = checkFormula(formula, spec.requireFormula)

    return {
      row: spec.row,
      col: spec.col,
      expected: spec.expected ?? spec.expectedPattern,
      actual: display,
      formula,
      valuePass,
      formulaUsed,
      formulaPass,
      // yellow = right answer, wrong method; green = both pass
      status: valuePass && formulaPass ? 'correct' : valuePass && !formulaPass ? 'hardcoded' : 'incorrect',
    }
  })
}

export function summarizeTask(cellResults) {
  const total = cellResults.length
  const correct = cellResults.filter(r => r.status === 'correct').length
  const hardcoded = cellResults.filter(r => r.status === 'hardcoded').length
  const incorrect = cellResults.filter(r => r.status === 'incorrect').length
  return { total, correct, hardcoded, incorrect, score: correct / total }
}
