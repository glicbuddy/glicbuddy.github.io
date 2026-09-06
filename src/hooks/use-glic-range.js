import config from '@/config'
import { useStorage } from '@/hooks'
import { toUnsigned } from '@/lib/number'

export const useGlicRange = () => {
  const [glicRange, setGlicRange] = useStorage('glic.range', config.glicRange)

  const updateRange = (min = 0, max = 0) => {
    const minValue = toUnsigned(min)
    const maxValue = toUnsigned(max)
    if (minValue === 0 || maxValue === 0) {
      throw new Error('Os valores não podem ser zero.')
    }
    if (minValue < 0 || maxValue < 0) {
      throw new Error('Os valores não podem ser negativos.')
    }
    if (minValue === maxValue) {
      throw new Error('O valor mínimo não pode ser igual ao máximo.')
    }
    if (minValue > maxValue) {
      throw new Error('O valor mínimo não pode ser maior que o máximo.')
    }
    if (minValue > 999 || maxValue > 999) {
      throw new Error('Os valores não podem ser maiores que 999.')
    }
    setGlicRange({ min: minValue, max: maxValue })
  }

  return [glicRange, updateRange]
}
