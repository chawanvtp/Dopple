import { ChainId, JSBI, Percent, Token, WETH } from '@uniswap/sdk'
import { AbstractConnector } from '@web3-react/abstract-connector'

import { injected, injectedTrustWallet, walletconnect, walletlink, bsc } from '../connectors'

// ADDRESS: Router Address
export const ROUTER_ADDRESS = '0x0BcfB3368a77036A6771F33038BbFb368c47e6Fb'
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[]
}

export const DAI = new Token(ChainId.BSC, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'Dai Stablecoin')
export const USDC_BSC = new Token(ChainId.BSC, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USDC')
export const USDT = new Token(ChainId.BSC, '0xdAC17F958D2ee523a2206206994597C13D831ec7', 6, 'USDT', 'Tether USD')
export const COMP = new Token(ChainId.BSC, '0xc00e94Cb662C3520282E6f5717214004A7f26888', 18, 'COMP', 'Compound')
export const MKR = new Token(ChainId.BSC, '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2', 18, 'MKR', 'Maker')
export const AMPL = new Token(ChainId.BSC, '0xD46bA6D942050d489DBd938a2C909A5d5039A161', 9, 'AMPL', 'Ampleforth')
export const WBTC = new Token(ChainId.BSC, '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', 18, 'WBTC', 'Wrapped BTC')
export const BUSD = new Token(ChainId.BSC, '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', 18, 'BUSD', 'BUSD')
export const DOP_BSC = new Token(ChainId.BSC, '0x844fa82f1e54824655470970f7004dd90546bb28', 18, 'DOP', 'Wrapped BTC')
export const DOLLY_BSC = new Token(ChainId.BSC, '0xfF54da7CAF3BC3D34664891fC8f3c9B6DeA6c7A5', 18, 'DOLLY', 'Dolly')
export const BNB = new Token(ChainId.BSC, '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c', 18, 'BNB', 'BNB')

export const DOP = new Token(ChainId.POLYGON, '0x6eb7d1bde3981e1863e7dc473cc863bbe11356ab', 18, 'mDOP', 'mDopple')
export const TWIN = new Token(ChainId.POLYGON, '0xb7d9502a18ddc51a0eb52a9bd23da6e09daba321', 18, 'mDOP', 'mDopple')
export const DOLLY = new Token(ChainId.POLYGON, '0x37924e552e0471002a4aff038717df0468284676', 18, 'mDOLLY', 'mDolly')
export const USDC = new Token(ChainId.POLYGON, '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', 6, 'USDC', 'USDC')
export const WMATIC = new Token(ChainId.POLYGON, '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270', 6, 'WMATIC', 'Wrapped Matic')

// Block time here is slightly higher (~1s) than average in order to avoid ongoing proposals past the displayed time
export const AVERAGE_BLOCK_TIME_IN_SECS = 14
export const PROPOSAL_LENGTH_IN_BLOCKS = 40_320
export const PROPOSAL_LENGTH_IN_SECS = AVERAGE_BLOCK_TIME_IN_SECS * PROPOSAL_LENGTH_IN_BLOCKS

export const GOVERNANCE_ADDRESS = '0x5e4be8Bc9637f0EAA1A755019e06A68ce081D58F'

export const TIMELOCK_ADDRESS = '0x1a9C8182C09F50C8318d769245beA52c32BE35BC'

const UNI_ADDRESS = '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984'
const DOPPLE_ADDRESS = `0x844fa82f1e54824655470970f7004dd90546bb28`
export const UNI: { [chainId in ChainId]: Token } = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, UNI_ADDRESS, 18, 'UNI', 'Uniswap'),
  [ChainId.RINKEBY]: new Token(ChainId.RINKEBY, UNI_ADDRESS, 18, 'UNI', 'Uniswap'),
  [ChainId.ROPSTEN]: new Token(ChainId.ROPSTEN, UNI_ADDRESS, 18, 'UNI', 'Uniswap'),
  [ChainId.GÖRLI]: new Token(ChainId.GÖRLI, UNI_ADDRESS, 18, 'UNI', 'Uniswap'),
  [ChainId.KOVAN]: new Token(ChainId.KOVAN, UNI_ADDRESS, 18, 'UNI', 'Uniswap'),
  [ChainId.BSC]: new Token(ChainId.BSC, DOPPLE_ADDRESS, 18, 'DOP', 'Dopple'),
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, DOPPLE_ADDRESS, 18, 'DOP', 'Dopple')
}

export const COMMON_CONTRACT_NAMES: { [address: string]: string } = {
  [UNI_ADDRESS]: 'UNI',
  [GOVERNANCE_ADDRESS]: 'Governance',
  [TIMELOCK_ADDRESS]: 'Timelock'
}

// TODO: specify merkle distributor for bsc
export const MERKLE_DISTRIBUTOR_ADDRESS: { [chainId in ChainId]?: string } = {
  [ChainId.BSC]: '0x090D4613473dEE047c3f2706764f49E0821D256e'
}

// export const WBNB = new Token(ChainId.BSC, '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', 18, 'WBNB', 'Wrapped BNB')

const WETH_ONLY: ChainTokenList = {
  [ChainId.MAINNET]: [WETH[ChainId.MAINNET]],
  [ChainId.ROPSTEN]: [WETH[ChainId.ROPSTEN]],
  [ChainId.RINKEBY]: [WETH[ChainId.RINKEBY]],
  [ChainId.GÖRLI]: [WETH[ChainId.GÖRLI]],
  [ChainId.KOVAN]: [WETH[ChainId.KOVAN]],
  [ChainId.BSC]: [WETH[ChainId.BSC]],
  [ChainId.POLYGON]: [WETH[ChainId.POLYGON]]
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.BSC]: [...WETH_ONLY[ChainId.BSC], USDC, DOP, DOLLY],
  [ChainId.POLYGON]: [DAI, WETH[ChainId.POLYGON], USDC, DOP, DOLLY, WMATIC]
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.BSC]: {
    [AMPL.address]: [DAI, WETH[ChainId.BSC], USDC, DOP, DOLLY]
  },
  [ChainId.POLYGON]: {
    [AMPL.address]: [DAI, WETH[ChainId.POLYGON], USDC, DOP, DOLLY, WMATIC]
  }
}

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.BSC]: [USDC, DOP, DOLLY],
  [ChainId.POLYGON]: [USDC, DOP, DOLLY]
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.BSC]: [...WETH_ONLY[ChainId.BSC], DAI, USDC, DOP, DOLLY],
  [ChainId.POLYGON]: [...WETH_ONLY[ChainId.BSC], DAI, USDC, DOP, DOLLY, WMATIC]
}

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.BSC]: [
    [
      new Token(ChainId.BSC, '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643', 8, 'DAI', 'Compound Dai'),
      new Token(ChainId.BSC, '0x39AA39c021dfbaE8faC545936693aC917d5E7563', 8, 'USDC', 'Compound USD Coin')
    ],
    [USDC, DOP],
    [DOP, WMATIC]
  ]
}

export interface WalletInfo {
  connector?: AbstractConnector
  name: string
  iconName: string
  description: string
  href: string | null
  color: string
  primary?: true
  mobile?: true
  mobileOnly?: true
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  INJECTED: {
    connector: injected,
    name: 'Injected',
    iconName: 'arrow-right.svg',
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true,
    mobileOnly: true
  },
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    iconName: 'metamask.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D'
  },
  BSC: {
    connector: bsc,
    name: 'Binance Smart Chain',
    iconName: 'bscwallet.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D'
  },
  TRUST_WALLET: {
    connector: injectedTrustWallet,
    name: 'Trust Wallet',
    iconName: 'trustwallet.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D'
  },
  WALLET_CONNECT: {
    connector: walletconnect,
    name: 'WalletConnect',
    iconName: 'walletConnectIcon.svg',
    description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    href: null,
    color: '#4196FC',
    mobile: true
  },
  WALLET_LINK: {
    connector: walletlink,
    name: 'Coinbase Wallet',
    iconName: 'coinbaseWalletIcon.svg',
    description: 'Use Coinbase Wallet app on mobile device',
    href: null,
    color: '#315CF5'
  }
}

export const NetworkContextName = 'NETWORK'

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20

export const BIG_INT_ZERO = JSBI.BigInt(0)

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))
export const BIPS_BASE = JSBI.BigInt(10000)
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE) // 15%

// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)) // .01 ETH
