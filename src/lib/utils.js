import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const PRE_INSU_PERIODS = {
  preCafeManha: 'Pré café manhã',
  preAlmoco: 'Pré almoço',
  preCafeTarde: 'Pré café tarde',
  preJantar: 'Pré jantar',
  preDormir: 'Pré dormir'
}

export function getPreInsuPeriodLabel(preInsuPeriod) {
  return PRE_INSU_PERIODS?.[preInsuPeriod] ?? 'Nenhum'
}

export function isValidPreInsuPeriod(preInsuPeriod) {
  return PRE_INSU_PERIODS?.[preInsuPeriod] ? true : false
}
