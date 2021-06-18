import dopTwinIcon from '../../assets/images/staking/dop-twin.svg'
import dopTslaIcon from '../../assets/images/staking/dop-tsla.svg'
import dopAaplIcon from '../../assets/images/staking/dop-aapl.svg'
import dopAmzaIcon from '../../assets/images/staking/dop-amza.svg'
import dopGooglIcon from '../../assets/images/staking/dop-googl.svg'
import dollyTslaIcon from '../../assets/images/staking/dolly-tsla.svg'
import dollyAaplIcon from '../../assets/images/staking/dolly-aapl.svg'
import dollyAmzaIcon from '../../assets/images/staking/dolly-amza.svg'
import dollyGooglIcon from '../../assets/images/staking/dolly-googl.svg'
import twinIcon from '../../assets/images/staking/twin.svg'
import { TStakingData } from './types'
import { ChainId } from '@uniswap/sdk'

export const STAKING_LIST = [
  {
    name: 'TWIN',
    add_lp_url:
      'https://twindex.com/#/swap?outputCurrency=0x3806aae953a3a873D02595f76C7698a57d4C7A57',
    address: '',
    lp_address: '0x3806aae953a3a873D02595f76C7698a57d4C7A57',
    icon: twinIcon,
    pool_id: 9,
    weight: 10
  } as TStakingData,
  {
    name: 'DOP-TWIN',
    add_lp_url:
      'https://twindex.com/#/add/0x3806aae953a3a873D02595f76C7698a57d4C7A57/0x844FA82f1E54824655470970F7004Dd90546bB28',
    address: '',
    lp_address: '0x65A95C2BC5c12E8e30e24D322ff386249c29a072',
    icon: dopTwinIcon,
    pool_id: 0,
    weight: 20
  } as TStakingData,
  {
    name: 'DOP-dTSLA',
    add_lp_url:
      'https://twindex.com/#/add/0x17aCe02e5C8814BF2EE9eAAFF7902D52c15Fb0f4/0x844FA82f1E54824655470970F7004Dd90546bB28',
    address: '',
    lp_address: '0xb611aCe852f60F0ec039f851644a5bC5270AbF7b',
    icon: dopTslaIcon,
    pool_id: 1,
    weight: 10
  } as TStakingData,
  {
    name: 'DOP-dAAPL',
    add_lp_url:
      'https://twindex.com/#/add/0xC10b2Ce6A2BCfdFDC8100Ba1602C1689997299D3/0x844FA82f1E54824655470970F7004Dd90546bB28',
    address: '',
    lp_address: '0x2D4980c63962d4B9156a8974AEA7C7fd3121913A',
    icon: dopAaplIcon,
    pool_id: 2,
    weight: 10
  } as TStakingData,
  {
    name: 'DOP-dAMZN',
    add_lp_url:
      'https://twindex.com/#/add/0x1085B90544ff5C421D528aAF79Cc65aFc920aC79/0x844FA82f1E54824655470970F7004Dd90546bB28',
    address: '',
    lp_address: '0x4a1135768C6ce4b2a2F20DAc80DE661949161627',
    icon: dopAmzaIcon,
    pool_id: 3,
    weight: 10
  } as TStakingData,
  {
    name: 'DOP-dGOOGL',
    add_lp_url:
      'https://twindex.com/#/add/0x9C169647471C1C6a72773CfFc50F6Ba285684803/0x844FA82f1E54824655470970F7004Dd90546bB28',
    address: '',
    lp_address: '0x7A00B2BB049176C9C74E5d7bF617F84dB4763aec',
    icon: dopGooglIcon,
    pool_id: 8,
    weight: 10
  } as TStakingData,
  {
    name: 'DOLLY-dTSLA',
    add_lp_url:
      'https://twindex.com/#/add/0x17aCe02e5C8814BF2EE9eAAFF7902D52c15Fb0f4/0xff54da7caf3bc3d34664891fc8f3c9b6dea6c7a5',
    address: '',
    lp_address: '0xbde3b88c4D5926d5236447D1b12a866f1a38B2B7',
    icon: dollyTslaIcon,
    pool_id: 4,
    weight: 5
  } as TStakingData,
  {
    name: 'DOLLY-dAAPL',
    add_lp_url:
      'https://twindex.com/#/add/0xC10b2Ce6A2BCfdFDC8100Ba1602C1689997299D3/0xff54da7caf3bc3d34664891fc8f3c9b6dea6c7a5',
    address: '',
    lp_address: '0xb91d34BCdF77E13f70AfF4d86129d13389dE0802',
    icon: dollyAaplIcon,
    pool_id: 6,
    weight: 5
  } as TStakingData,
  {
    name: 'DOLLY-dAMZN',
    add_lp_url:
      'https://twindex.com/#/add/0x1085B90544ff5C421D528aAF79Cc65aFc920aC79/0xff54da7caf3bc3d34664891fc8f3c9b6dea6c7a5',
    address: '',
    lp_address: '0x15C53425bd0b9bfEd3d4cCf27F4c4f1f7bBC838B',
    icon: dollyAmzaIcon,
    pool_id: 5,
    weight: 5
  } as TStakingData,
  {
    name: 'DOLLY-dGOOGL',
    add_lp_url:
      'https://twindex.com/#/add/0x9C169647471C1C6a72773CfFc50F6Ba285684803/0xff54da7caf3bc3d34664891fc8f3c9b6dea6c7a5',
    address: '',
    lp_address: '0xC38150a12D3C686f13D6e3A791d6301ed274B862',
    icon: dollyGooglIcon,
    pool_id: 7,
    weight: 5
  } as TStakingData
]

export const TWINDEX_TOKEN_ADDRESSES: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '',
  [ChainId.RINKEBY]: '',
  [ChainId.ROPSTEN]: '',
  [ChainId.GÖRLI]: '',
  [ChainId.KOVAN]: '',
  [ChainId.BSC]: '0x3806aae953a3a873D02595f76C7698a57d4C7A57',
  [ChainId.TESTNET]: '0x3806aae953a3a873D02595f76C7698a57d4C7A57',
  [ChainId.POLYGON]: ''
}

export const FAIRLAUNCH_ADDRESSES: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '',
  [ChainId.RINKEBY]: '',
  [ChainId.ROPSTEN]: '',
  [ChainId.GÖRLI]: '',
  [ChainId.KOVAN]: '',
  [ChainId.BSC]: '0xe6bE78800f25fFaE4D1db7CA6d3485629bD200Ed',
  [ChainId.TESTNET]: '0xDa0a175960007b0919DBF11a38e6EC52896bddbE',
  [ChainId.POLYGON]: '0x'
}
