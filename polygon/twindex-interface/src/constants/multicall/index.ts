import { ChainId } from '@uniswap/sdk'
import MULTICALL_ABI from './abi.json'

const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441',
  [ChainId.ROPSTEN]: '',
  [ChainId.KOVAN]: '',
  [ChainId.RINKEBY]: '0x198A609936593Ac5009F1D3fdF27FA9b92316035',
  [ChainId.GÖRLI]: '',
  [ChainId.BSC]: '0x41263cba59eb80dc200f3e2544eda4ed6a90e76c',
  [ChainId.POLYGON]: ''
}

export { MULTICALL_ABI, MULTICALL_NETWORKS }
