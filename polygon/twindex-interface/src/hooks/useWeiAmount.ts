import { toWei } from 'utils/math-helpers'
import { Unit } from 'web3-utils'

export function useWeiAmount(amount: any, unit: Unit = 'ether') {
  return toWei(amount, unit)
}
