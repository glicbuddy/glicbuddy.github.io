import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
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
