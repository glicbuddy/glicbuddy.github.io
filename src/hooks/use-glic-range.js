import config from '@/config'
import { useStorage } from '@/hooks'
import { toUnsigned } from '@/lib/number'

export const useGlicRange = () => {
  const [glicRange, setGlicRange] = useStorage('glic.range', config.glicRange)

  const updateRange = (min = 0, max = 0) => {
    const minValue = toUnsigned(min)
    const maxValue = toUnsigned(max)
    if (minValue === 0 || maxValue === 0) {
      throw new Error('Não pode ser valor igual a zero.')
    }
    if (minValue < 0 || maxValue < 0) {
      throw new Error('Não pode ser valores negativos.')
    }
    if (minValue === maxValue) {
      throw new Error('Não pode ser valores iguais.')
    }
    if (minValue > maxValue) {
      throw new Error('Não pode ser valor mínimo maior que o máximo.')
    }
    if (minValue > 999 || maxValue > 999) {
      throw new Error('Não pode ser valores maiores que 999.')
    }
    setGlicRange({ min: minValue, max: maxValue })
  }

  return [glicRange, updateRange]
}
