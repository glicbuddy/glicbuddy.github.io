import config from '@/config'
import blobStream from 'blob-stream'
import { clsx } from 'clsx'
import PDFDocument from 'pdfkit/js/pdfkit.standalone.js'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const PRE_GLIC_PERIODS = {
  preCafeManha: 'Pré café manhã',
  preAlmoco: 'Pré almoço',
  preCafeTarde: 'Pré café tarde',
  preJantar: 'Pré jantar',
  preDormir: 'Pré dormir'
}

export function getPreGlicPeriodLabel(preGlicPeriod) {
  return PRE_GLIC_PERIODS?.[preGlicPeriod] ?? 'Nenhum'
}

export function isValidPreGlicPeriod(preGlicPeriod = '') {
  return PRE_GLIC_PERIODS?.[preGlicPeriod] ? true : false
}

export async function downloadGlicNotesPDF(notes = []) {
  const doc = new PDFDocument({ margin: 40, size: 'A4' })
  const stream = doc.pipe(blobStream())

  const initLineX = 25
  const endLineX = 575
  const rowHeight = 30
  const tableTop = doc.y
  const tableBottom = tableTop + 20
  const tHeadY = tableTop + rowHeight
  const tHead = {
    date: { title: 'Data', x: 25 },
    preCafeManha: { title: 'Pré Café Manhã', x: 120 },
    preAlmoco: { title: 'Pré Almoco', x: 220 },
    preCafeTarde: { title: 'Pré Café Tarde', x: 300 },
    preJantar: { title: 'Pré Jantar', x: 410 },
    preDormir: { title: 'Pré Dormir', x: 500 }
  }

  // PDF Title
  doc
    .fontSize(18)
    .fillColor('#000000')
    .text(`${config.appName} - Registros de Glicemia`, { align: 'center' })
    .moveDown(1.5)

  // Table Head
  doc
    .fontSize(11)
    .fillColor('#000000')
    .text(tHead.date.title, tHead.date.x, tHeadY)
    .text(tHead.preCafeManha.title, tHead.preCafeManha.x, tHeadY)
    .text(tHead.preAlmoco.title, tHead.preAlmoco.x, tHeadY)
    .text(tHead.preCafeTarde.title, tHead.preCafeTarde.x, tHeadY)
    .text(tHead.preJantar.title, tHead.preJantar.x, tHeadY)
    .text(tHead.preDormir.title, tHead.preDormir.x, tHeadY)
    .moveDown(1.5)
    .moveTo(initLineX, tableBottom)
    .lineTo(endLineX, tableBottom)
    .stroke()

  // Table Rows
  let currentRowY = tHeadY + rowHeight

  notes.forEach((note) => {
    doc
      .fontSize(11)
      .fillColor('#000000')
      .text(note.date, tHead.date.x, currentRowY)
      .fillColor(note.preCafeManhaColorHex ?? '#000000')
      .text(note.preCafeManhaGlic ?? '--', tHead.preCafeManha.x, currentRowY)
      .fillColor(note.preAlmocoColorHex ?? '#000000')
      .text(note.preAlmocoGlic ?? '--', tHead.preAlmoco.x, currentRowY)
      .fillColor(note.preCafeTardeColorHex ?? '#000000')
      .text(note.preCafeTardeGlic ?? '--', tHead.preCafeTarde.x, currentRowY)
      .fillColor(note.preJantarColorHex ?? '#000000')
      .text(note.preJantarGlic ?? '--', tHead.preJantar.x, currentRowY)
      .fillColor(note.preDormirColorHex ?? '#000000')
      .text(note.preDormirGlic ?? '--', tHead.preDormir.x, currentRowY)
      .moveDown(1.5)
      .moveTo(initLineX, currentRowY - 10)
      .lineTo(endLineX, currentRowY - 10)
      .strokeColor('#dddddd')
      .stroke()
      .strokeColor('#000000')

    currentRowY += rowHeight
  })

  doc.end()

  stream.on('finish', () => {
    const url = stream.toBlobURL('application/pdf')
    window.open(url, '_blank')
  })
}
