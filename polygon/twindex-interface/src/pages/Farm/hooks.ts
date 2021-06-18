import { BigNumber } from '@ethersproject/bignumber'
import { useContract } from 'components/SearchModal/MintFunction'
import ERC20_ABI from 'constants/abis/erc20.json'
import TWINDEX_TOKEN_ABI from 'constants/abis/twindex-token-abi.json'
import FAIRLAUNCH_ABI from 'constants/abis/staking/fairlaunch.json'
import { useActiveWeb3React } from 'hooks'
import { useCallback, useEffect, useState } from 'react'
import { weiToFixed } from 'utils/math-helpers'
import mkrMulticall from 'utils/mkrMulticall'
import { FAIRLAUNCH_ADDRESSES, STAKING_LIST, TWINDEX_TOKEN_ADDRESSES } from './constants'
import { TStakingAllowance, TStakingBalance, TStakingDepositBalance, TStakingReward } from './types'

const useStakingAllowance = (): { allowanceResult: Array<TStakingAllowance>; update: () => void } => {
  const { account, chainId } = useActiveWeb3React()
  const [allowanceResult, setAllowanceResult] = useState<Array<TStakingAllowance>>([])

  const update = useCallback(() => {
    if (account && chainId && allowanceResult.length === 0) {
      const fairlaunchAddress = FAIRLAUNCH_ADDRESSES[chainId]
      const calls = STAKING_LIST.map(sl => {
        return {
          address: sl.lp_address,
          name: 'allowance',
          params: [account, fairlaunchAddress]
        }
      })
      mkrMulticall(chainId, ERC20_ABI, calls).then(result => {
        const resultMapping = STAKING_LIST.map((sl, i) => {
          return {
            stakingData: sl,
            allowance: result[i][0]
          } as TStakingAllowance
        })
        setAllowanceResult(resultMapping)
      })
    }
  }, [account, chainId, allowanceResult])

  useEffect(() => {
    update()
  }, [update])

  return { allowanceResult, update }
}

const useStakingBalance = (): { balanceResult: Array<TStakingBalance>; update: () => void } => {
  const { account, chainId } = useActiveWeb3React()
  const [balanceResult, setBalanceResult] = useState<Array<TStakingBalance>>([])

  const update = useCallback(() => {
    if (account && chainId && balanceResult.length === 0) {
      const calls = STAKING_LIST.map(sl => {
        return {
          address: sl.lp_address,
          name: 'balanceOf',
          params: [account]
        }
      })
      mkrMulticall(chainId, ERC20_ABI, calls).then(result => {
        const resultMapping = STAKING_LIST.map((sl, i) => {
          return {
            stakingData: sl,
            balance: result[i][0]
          } as TStakingBalance
        })
        setBalanceResult(resultMapping)
      })
    }
  }, [account, chainId, balanceResult])

  useEffect(() => {
    update()
  }, [update])

  return { balanceResult, update }
}

const useStakingDepositBalance = (): { depositBalanceResult: Array<TStakingDepositBalance>; update: () => void } => {
  const { account, chainId } = useActiveWeb3React()
  const [depositBalanceResult, setDepositBalanceResult] = useState<Array<TStakingDepositBalance>>([])

  const update = useCallback(() => {
    if (account && chainId && depositBalanceResult.length === 0) {
      const fairlaunchAddress = FAIRLAUNCH_ADDRESSES[chainId]
      const calls = STAKING_LIST.map(sl => {
        return {
          address: fairlaunchAddress,
          name: 'userInfo',
          params: [sl.pool_id, account]
        }
      })
      mkrMulticall(chainId, FAIRLAUNCH_ABI, calls).then(result => {
        const resultMapping = STAKING_LIST.map((sl, i) => {
          return {
            stakingData: sl,
            balance: result[i].amount
          } as TStakingDepositBalance
        })
        setDepositBalanceResult(resultMapping)
      })
    }
  }, [account, chainId, depositBalanceResult])

  useEffect(() => {
    update()
  }, [update])

  return { depositBalanceResult, update }
}

const useStakingReward = (): {
  stakingRewardResult: Array<TStakingReward>
  totalUnclaimReward: number
  update: () => void
} => {
  const { account, chainId } = useActiveWeb3React()
  const [stakingRewardResult, setStakingRewardResult] = useState<Array<TStakingReward>>([])
  const [totalUnclaimReward, setTotalUnclaimReward] = useState(0)

  const update = useCallback(() => {
    if (account && chainId && stakingRewardResult.length === 0) {
      const fairluanchAddress = FAIRLAUNCH_ADDRESSES[chainId]
      const calls = STAKING_LIST.map(sl => {
        return {
          address: fairluanchAddress,
          name: 'pendingTwin',
          params: [sl.pool_id, account]
        }
      })

      mkrMulticall(chainId, FAIRLAUNCH_ABI, calls).then(result => {
        let sumOfUnClaimReward = BigNumber.from(0)
        const resultMapping = STAKING_LIST.map((sl, i) => {
          sumOfUnClaimReward = sumOfUnClaimReward.add(result[i][0])
          return {
            stakingData: sl,
            reward: result[i][0]
          } as TStakingReward
        })
        setTotalUnclaimReward(parseFloat(weiToFixed(sumOfUnClaimReward.toString(), 2)))
        setStakingRewardResult(resultMapping)
      })
    }
  }, [account, chainId, stakingRewardResult])

  useEffect(() => {
    update()
  }, [update])

  return { stakingRewardResult, totalUnclaimReward, update }
}

const useTwindexBalanceOf = (): { balance: BigNumber; update: () => void } => {
  const { account, chainId } = useActiveWeb3React()
  const [balance, setBalance] = useState(BigNumber.from(0))

  const tokenContract = useContract(TWINDEX_TOKEN_ADDRESSES[chainId ? chainId : 56], TWINDEX_TOKEN_ABI)

  const update = useCallback(async () => {
    if (account && tokenContract) {
      const result = await tokenContract.balanceOf(account)
      setBalance(result)
    }
  }, [account, balance])

  useEffect(() => {
    update()
  }, [update])

  return { balance, update }
}

const useGetTwindexLockedAmount = (): { lockedAmount: BigNumber; update: () => void } => {
  const { account, chainId } = useActiveWeb3React()
  const [lockedAmount, setLockedAmount] = useState(BigNumber.from(0))

  const tokenContract = useContract(TWINDEX_TOKEN_ADDRESSES[chainId ? chainId : 56], TWINDEX_TOKEN_ABI)

  const update = useCallback(async () => {
    if (account && tokenContract) {
      const result = await tokenContract.lockOf(account)
      setLockedAmount(result)
    }
  }, [account, lockedAmount])

  useEffect(() => {
    update()
  }, [update])

  return { lockedAmount, update }
}

export {
  useStakingAllowance,
  useStakingBalance,
  useStakingDepositBalance,
  useStakingReward,
  useTwindexBalanceOf,
  useGetTwindexLockedAmount
}
