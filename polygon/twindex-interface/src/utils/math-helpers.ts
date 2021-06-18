import { bignumber } from 'mathjs'
import { Unit } from 'web3-utils'

export const weiToBigInt = (amount: any) => {
  if (amount) {
    return `${amount.split('.')[0]}.${amount.split('.')[1] ? amount.split('.')[1].slice(0, 18) : '0'}`
  }
  return '0'
}

// export const roundToSmaller = (amount: any, decimals: number): string => {
//   const bn = bignumber(amount)
//   const [integer, decimal] = bn.toFixed(128).split('.')
//   let decimalAssign = decimal
//   if (decimal && decimal.length) {
//     decimalAssign = decimal.substr(0, decimals)
//   } else {
//     decimalAssign = '0'.repeat(decimals)
//   }

//   if (decimal.length < decimals) {
//     decimalAssign = decimal + '0'.repeat(decimals - decimal.length)
//   }

//   if (decimalAssign !== '') {
//     return `${integer}.${decimalAssign}`
//   }
//   return `${integer}`
// }

export const roundToSmaller = (amount: any, decimals: number): string => {
  const bn = bignumber(amount)
  const [integer, decimalz] = bn.toFixed(128).split('.')
  let decimal = decimalz
  if (decimal && decimal.length) {
    decimal = decimal.substr(0, decimals)
  } else {
    decimal = '0'.repeat(decimals)
  }

  if (decimal.length < decimals) {
    decimal = decimal + '0'.repeat(decimals - decimal.length)
  }

  if (decimal !== '') {
    return `${integer}.${decimal}`
  }
  return `${integer}`
};

export const fromWei = (amount: any, unit: Unit = 'ether') => {
  let decimals = 0
  switch (unit) {
    case 'ether':
      decimals = 18
      break
    default:
      throw new Error('Unsupported unit (custom fromWei helper)')
  }

  return roundToSmaller(bignumber(amount || '0').div(10 ** decimals), decimals)
}

export const toWei = (amount: any, unit: Unit = 'ether') => {
  let decimals = 0
  switch (unit) {
    case 'ether':
      decimals = 18
      break
    default:
      throw new Error('Unsupported unit (custom fromWei helper)')
  }

  return roundToSmaller(bignumber(amount || '0').mul(10 ** decimals), 0)
}

export const weiToFixed = (amount: any, decimals = 0): string => {
  return roundToSmaller(bignumber(fromWei(amount, 'ether')), decimals)
}

export const weiTo18 = (amount: any): string => weiToFixed(amount, 18)

export const weiTo8 = (amount: any): string => weiToFixed(amount, 8)

export const weiTo4 = (amount: any): string => weiToFixed(amount, 4)

export const weiTo2 = (amount: any): string => weiToFixed(amount, 2)
