import { BigNumber } from '@ethersproject/bignumber'

export interface TStakingData {
  name: string
  add_lp_url: string
  address: string
  lp_address: string
  icon: string
  pool_id: number
  weight: number
}

export interface TStakingAllowance {
  stakingData: TStakingData
  allowance: BigNumber
}

export interface TStakingBalance {
  stakingData: TStakingData
  balance: BigNumber
}

export interface TStakingDepositBalance {
  stakingData: TStakingData
  balance: BigNumber
}

export interface TStakingReward {
  stakingData: TStakingData
  reward: BigNumber
}
