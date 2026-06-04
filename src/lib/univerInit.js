import { Univer, LocaleType, mergeLocales, UniverInstanceType } from '@univerjs/core'
import { defaultTheme } from '@univerjs/themes'
import { UniverRenderEnginePlugin } from '@univerjs/engine-render'
import { UniverFormulaEnginePlugin } from '@univerjs/engine-formula'
import { UniverUIPlugin } from '@univerjs/ui'
import { UniverDocsPlugin } from '@univerjs/docs'
import { UniverDocsUIPlugin } from '@univerjs/docs-ui'
import { UniverSheetsPlugin } from '@univerjs/sheets'
import { UniverSheetsUIPlugin } from '@univerjs/sheets-ui'
import { UniverSheetsFormulaPlugin } from '@univerjs/sheets-formula'
import { UniverSheetsFormulaUIPlugin } from '@univerjs/sheets-formula-ui'
import { UniverSheetsNumfmtPlugin } from '@univerjs/sheets-numfmt'
import { UniverSheetsNumfmtUIPlugin } from '@univerjs/sheets-numfmt-ui'

// Facade API: base FUniver from core, augmented by per-package side-effect imports
import { FUniver } from '@univerjs/core/facade'
import '@univerjs/engine-formula/facade'
import '@univerjs/ui/facade'
import '@univerjs/docs-ui/facade'
import '@univerjs/sheets/facade'
import '@univerjs/sheets-ui/facade'
import '@univerjs/sheets-formula/facade'
import '@univerjs/sheets-numfmt/facade'

import '@univerjs/design/lib/index.css'
import '@univerjs/ui/lib/index.css'
import '@univerjs/docs-ui/lib/index.css'
import '@univerjs/sheets-ui/lib/index.css'
import '@univerjs/sheets-formula-ui/lib/index.css'
import '@univerjs/sheets-numfmt-ui/lib/index.css'

import SheetsEnUS from '@univerjs/sheets/lib/locale/en-US'
import SheetsUIEnUS from '@univerjs/sheets-ui/lib/locale/en-US'
import UIEnUS from '@univerjs/ui/lib/locale/en-US'
import DocsUIEnUS from '@univerjs/docs-ui/lib/locale/en-US'
import SheetsFormulaUIEnUS from '@univerjs/sheets-formula-ui/lib/locale/en-US'
import SheetsNumfmtUIEnUS from '@univerjs/sheets-numfmt-ui/lib/locale/en-US'

// Locale files may be CJS default-wrapped — unwrap if needed
function unwrap(m) { return m?.default ?? m }

// containerId must be a string (DOM element ID), e.g. 'univer-container'
export function createUniverInstance(containerId, workbookData) {
  const univer = new Univer({
    theme: defaultTheme,
    locale: LocaleType.EN_US,
    locales: {
      [LocaleType.EN_US]: mergeLocales(
        unwrap(SheetsEnUS),
        unwrap(SheetsUIEnUS),
        unwrap(UIEnUS),
        unwrap(DocsUIEnUS),
        unwrap(SheetsFormulaUIEnUS),
        unwrap(SheetsNumfmtUIEnUS),
      ),
    },
  })

  univer.registerPlugin(UniverRenderEnginePlugin)
  univer.registerPlugin(UniverFormulaEnginePlugin)
  // Pass the container as a string ID — UniverUIPlugin does getElementById internally
  univer.registerPlugin(UniverUIPlugin, { container: containerId })
  univer.registerPlugin(UniverDocsPlugin)
  univer.registerPlugin(UniverDocsUIPlugin)
  univer.registerPlugin(UniverSheetsPlugin)
  univer.registerPlugin(UniverSheetsUIPlugin)
  univer.registerPlugin(UniverSheetsFormulaPlugin)
  univer.registerPlugin(UniverSheetsFormulaUIPlugin)
  univer.registerPlugin(UniverSheetsNumfmtPlugin)
  univer.registerPlugin(UniverSheetsNumfmtUIPlugin)

  univer.createUnit(UniverInstanceType.UNIVER_SHEET, workbookData)
  const univerAPI = FUniver.newAPI(univer)

  return { univer, univerAPI }
}
