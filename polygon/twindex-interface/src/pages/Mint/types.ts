import { BigNumber } from '@ethersproject/bignumber'

export interface TLoan {
    collateral: BigNumber
    collateralToken: BigNumber
    currentMargin: BigNumber
    endTimestamp: BigNumber
    interestDepositRemaining: BigNumber
    interestOwedPerDay: BigNumber
    loanId: string
    loanToken: string
    maintenanceMargin: BigNumber
    maxLiquidatable: BigNumber
    maxLoanTerm: BigNumber
    maxSeizable: BigNumber
    principal: BigNumber
    startMargin: BigNumber
    startRate: BigNumber
    approval: boolean
}

export interface TRedeem {
    loanId: string
    depositAmount: BigNumber
}

export interface StockAllowance {
    stockToken: StockToken
    allowance: boolean
}

export interface StockToken {
    address: string
    chainId: number
    decimals: number
    dlAddress: string
    logoURI: string
    name: string
    symbol: string
}

export interface StockTokenWithPrice {
    address: string
    chainId: number
    decimals: number
    dlAddress: string
    logoURI: string
    name: string
    symbol: string
    price: Number
}