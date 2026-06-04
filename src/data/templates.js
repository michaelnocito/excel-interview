import { ENTRY_TRACK } from './entry'
import { MID_TRACK } from './mid'
import { FINANCE_TRACK } from './finance'
import { JR_ANALYST_TRACK } from './jrAnalyst'
import { ANALYST_TRACK } from './analyst'

// Ordered list shown in the interviewer's template picker.
export const TEMPLATES = [
  ENTRY_TRACK,
  MID_TRACK,
  FINANCE_TRACK,
  JR_ANALYST_TRACK,
  ANALYST_TRACK,
]

export const TEMPLATE_MAP = Object.fromEntries(TEMPLATES.map(t => [t.id, t]))
