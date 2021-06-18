// export function useJrepo_getRequiredCollateral(
//   borrowToken: Asset,
//   collateralToken: Asset,
//   withdrawAmount: string,
//   newPrincipal: string,
//   isTorqueLoan: boolean
// ) {
//   return useCacheCallWithValue(
//     'dfiProtocol',
//     'getRequiredCollateral',
//     '0',
//     getTokenContract(borrowToken).address,
//     getTokenContract(collateralToken).address,
//     withdrawAmount,
//     newPrincipal,
//     isTorqueLoan
//   )
// }

import { Contract } from 'ethers'
import { getAddress } from 'ethers/lib/utils'
import { AddressZero } from '@ethersproject/constants'
import { useActiveWeb3React } from 'hooks'
import { useMemo } from 'react'
import { getProviderOrSigner } from 'utils'
import DFI_PROTOCOL_TOKEN_ABI from '../../constants/abis/SyntheticStock/dfiProtocols.json'
import PRICE_FEED_ABI from '../../constants/abis/SyntheticStock/priceFeed.json'
import LOAN_LOGIC_STANDARD_ABI from '../../constants/abis/SyntheticStock/loanLogicStandard.json'
import DOLLY_ABI from '../../constants/abis/SyntheticStock/dollyContract.json'
import STOCK_TOKEN_ABI from '../../constants/abis/SyntheticStock/stockToken.json'

export let ChainId: any
;(function(ChainId) {
  ChainId[(ChainId['BSC_MAINNET'] = 56)] = 'BSC_MAINNET'
  ChainId[(ChainId['BSC_TESTNET'] = 97)] = 'BSC_TESTNET'
  ChainId[(ChainId['HARDHAT'] = 31337)] = 'HARDHAT'
})(ChainId || (ChainId = {}))

export const DFI_PROTOCOL_CONTRACT_ADDRESSES = {
  [ChainId.BSC_MAINNET]: '0x37f5a7D8bBB1cc0307985D00DE520fE30630790c',
  [ChainId.BSC_TESTNET]: '0x5F34fAD6C86F9955FF2FfACc92985C71eed8DFCC',
  [ChainId.HARDHAT]: ''
}

export const PRICE_FEED_CONTRACT_ADDRESSES = {
  [ChainId.BSC_MAINNET]: '0xd4f061a6a276f8B0Ae83D210D838B45fCC7532B2',
  [ChainId.BSC_TESTNET]: '0x19F6BFf7F7E6534E7434063df539d21a7F77ba74',
  [ChainId.HARDHAT]: ''
}

export const LOAN_LOGIC_STANDARD_CONTRACT_ADDRESSES = {
  [ChainId.BSC_MAINNET]: '0x6e0C17f56d0d97f83d400A66C508307Bce6f8E38',
  [ChainId.BSC_TESTNET]: '0x73CFC2637217855C332674d59e9cbb32b3A33293',
  [ChainId.HARDHAT]: ''
}

export const DOLLY_CONTRACT_ADDRESSES = {
  [ChainId.BSC_MAINNET]: '0xfF54da7CAF3BC3D34664891fC8f3c9B6DeA6c7A5',
  [ChainId.BSC_TESTNET]: '0xA977b72BB3063D2e013C28aC048b87160f55efFB',
  [ChainId.HARDHAT]: ''
}

// DL Token list
// export const APPLE_DL_CONTRACT_ADDRESSES = {
//   [ChainId.BSC_MAINNET]: '',
//   [ChainId.BSC_TESTNET]: '0x50c897f63a040213f26902DF8C9194012e05B8B5',
//   [ChainId.HARDHAT]: ''
// }

// export const AMAZON_DL_CONTRACT_ADDRESSES = {
//   [ChainId.BSC_MAINNET]: '',
//   [ChainId.BSC_TESTNET]: '0xE37E3A854E68202a0aC23412ba9cfB9b600b54aE',
//   [ChainId.HARDHAT]: ''
// }

export function isAddress(value: any) {
  try {
    return getAddress(value)
  } catch (_a) {
    return false
  }
}

export function getContract(address: any, ABI: any, library: any, account: any) {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return new Contract(address, ABI, getProviderOrSigner(library, account))
}

export function useContract(
  address: string,
  ABI: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  withSignerIfPossible = true
) {
  const { library, account } = useActiveWeb3React()
  const temp = useMemo(() => {
    if (!address || !ABI || !library) return null
    try {
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, ABI, library, withSignerIfPossible, account])
  return temp
}

export function useDfiContract(t: any, withSignerIfPossible?: any) {
  const { chainId } = useActiveWeb3React()
  const tokenAddress = chainId ? t[chainId] : undefined
  return useContract(tokenAddress, DFI_PROTOCOL_TOKEN_ABI, withSignerIfPossible)
}

export function usePriceFeedContract(t: any, withSignerIfPossible?: any) {
  const { chainId } = useActiveWeb3React()
  const tokenAddress = chainId ? t[chainId] : undefined
  return useContract(tokenAddress, PRICE_FEED_ABI, withSignerIfPossible)
}

export function useLoanLogicStandardContract(t: any, withSignerIfPossible?: any) {
  const { chainId } = useActiveWeb3React()
  const tokenAddress = chainId ? t[chainId] : undefined
  return useContract(tokenAddress, LOAN_LOGIC_STANDARD_ABI, withSignerIfPossible)
}

export function useLoanLogicStandardContractWithDl(token: string, withSignerIfPossible?: any) {
  return useContract(token, LOAN_LOGIC_STANDARD_ABI, withSignerIfPossible)
}

export function useTokenContract(tokenAddress: string, withSignerIfPossible?: any) {
  return useContract(tokenAddress, STOCK_TOKEN_ABI, withSignerIfPossible)
}

export function useDollyContract(t: any, withSignerIfPossible?: any) {
  const { chainId } = useActiveWeb3React()
  return useContract(DOLLY_CONTRACT_ADDRESSES[chainId || ChainId.BSC_MAINNET], DOLLY_ABI, withSignerIfPossible)
}
