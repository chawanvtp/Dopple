import React, { useEffect, useState } from 'react'
import './farm.css'
import { useDarkModeManager } from 'state/user/hooks'
import { TStakingData } from './types'
import { STAKING_LIST } from './constants'
import {
  useStakingAllowance,
  useStakingBalance,
  useStakingDepositBalance,
  useStakingReward,
  useTwindexBalanceOf,
  useGetTwindexLockedAmount
} from './hooks'
import { BigNumber } from '@ethersproject/bignumber'
import { weiToFixed } from 'utils/math-helpers'
import { useActiveWeb3React } from 'hooks'
import { useContract } from 'components/SearchModal/MintFunction'
import TWINDEX_LP_ABI from 'constants/abis/staking/twindex_lp.json'
import FAIRLAUNCH_ABI from 'constants/abis/staking/fairlaunch.json'
import { MaxUint256 } from '@ethersproject/constants'
import { useWeiAmount } from 'hooks/useWeiAmount'
// import { ChainId } from '@uniswap/sdk'
import Modal from 'components/Modal'

// import { useContract } from 'components/SearchModal/MintFunction'
// import { useActiveWeb3React } from 'hooks'
import LogoEarnedIcon from '../../assets/images/logo-earned.svg'

function numberWithCommas(x: string) {
  const y = Number.parseFloat(x).toFixed(2)
  return y?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

function numberWithCommasFixedZero(x: string) {
  const y = Number.parseFloat(x).toFixed(0)
  return y?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export default function FarmPage() {
  const [isDark] = useDarkModeManager()

  const { allowanceResult, update: updateAllowance } = useStakingAllowance()
  const { balanceResult, update: updateBalance } = useStakingBalance()
  const { depositBalanceResult, update: updateDepositBalance } = useStakingDepositBalance()
  const { stakingRewardResult, totalUnclaimReward, update: updateStakingReward } = useStakingReward()
  const [apiData, setApiData] = useState<any | null>(null)
  const { balance: twindexBalance, update: updateTwindexBalanceOf } = useTwindexBalanceOf()
  const { lockedAmount: twindexLockedAmount, update: updateTwindexLockedAmount } = useGetTwindexLockedAmount()

  const updateAllData = () => {
    updateAllowance()
    updateBalance()
    updateDepositBalance()
    updateStakingReward()
    updateTwindexBalanceOf()
    updateTwindexLockedAmount()
  }

  useEffect(() => {
    const fetchData = () => {
      return fetch('https://api.twindex.com/')
        .then(response => response.json())
        .then(data => {
          // console.log('api_data', data)
          setApiData(data)
        })
    }
    fetchData()

    // Interval loop
    setInterval(updateAllData, 10000)
    setInterval(fetchData, 60000)
  }, [])

  return (
    <>
      <div className={`${isDark ? 'dark' : 'light'} container farm px-0`}>
        <RewardCard
          totalUnclaimReward={totalUnclaimReward}
          twinPrice={apiData ? apiData.twin_price : 0}
          balance={twindexBalance}
          lockedAmount={twindexLockedAmount}
          apiData={apiData}
        />
        <div className="staking-container w-100">
          <h4 className="mb-4">Farming Twindex</h4>
          <div className="staking-title row mb-4 text-center">
            <div className="col-5">LP Tokens Name</div>
            <div className="col-2">APR</div>
            <div className="col-3">TVL</div>
            <div className="col-2">Earned</div>
          </div>
          <div className="staking-list">
            {STAKING_LIST.map((sl, i) => (
              <div key={sl.name}>
                <StakingItem
                  stakingDataItem={sl}
                  allowance={allowanceResult.length ? allowanceResult[i].allowance : BigNumber.from(0)}
                  balance={balanceResult.length ? balanceResult[i].balance : BigNumber.from(0)}
                  depositBalance={depositBalanceResult.length ? depositBalanceResult[i].balance : BigNumber.from(0)}
                  stakingReward={stakingRewardResult.length ? stakingRewardResult[i].reward : BigNumber.from(0)}
                  updateAllData={updateAllData}
                  apiData={apiData && apiData.lp_data[sl.lp_address]}
                  twinPrice={apiData && apiData.twin_price}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

interface RewardCardProps {
  totalUnclaimReward: number
  twinPrice: number
  balance: BigNumber
  lockedAmount: BigNumber
  apiData: any
}

const RewardCard = (props: RewardCardProps) => {
  return (
    <>
      <div className="container farm mt-4">
        <div className="row">
          <div className="reward-panel reward-earn col-12 col-sm-6">
            <div className="text">
              <div className="title">Twindex earned</div>
              <div className="body">{numberWithCommas(props.totalUnclaimReward.toString())}</div>
              <div className="sub">
                {props.twinPrice || props.twinPrice === 0
                  ? '≈ $' + numberWithCommas((props.totalUnclaimReward * props.twinPrice).toString())
                  : 'loading...'}
              </div>
              <div className="title d-none">{props.apiData ? props.apiData.sum_tvl : ``}</div>
            </div>
            <div className="logo">
              <img src={LogoEarnedIcon} alt="" />
            </div>
          </div>
          <div className="col-12 col-sm-6">
            <div className="row pl-sm-4 mt-4 mt-sm-0">
              <div className="reward-panel twindex-balance col-12 mb-4">
                <div className="header">Your Twindex wallet balance</div>
                <div className="body">
                  <div className="title">{numberWithCommas(weiToFixed(props.balance.toString(), 2))}</div>
                  <div className="sub">
                    {props.twinPrice || props.twinPrice === 0
                      ? '≈ $' +
                      numberWithCommas(
                        (parseFloat(weiToFixed(props.balance.toString(), 2)) * props.twinPrice).toString()
                      )
                      : 'loading...'}
                  </div>
                </div>
              </div>
              <div className="reward-panel locked-amount col-12">
                <div className="title">
                  <span>Locked amount : </span>
                  <span className="text-green">{numberWithCommas(weiToFixed(props.lockedAmount.toString(), 2))}</span>
                </div>
                <div className="sub">80% of your rewards are locked and available after 30 days.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

interface ApiData {
  apr: number
  alloc_point: number
  tvl: number
}

interface StakingItemProps {
  stakingDataItem: TStakingData
  allowance: BigNumber
  balance: BigNumber
  depositBalance: BigNumber
  stakingReward: BigNumber
  updateAllData: () => void
  apiData: ApiData
  twinPrice: String
}

const StakingItem = (props: StakingItemProps) => {
  const [toggleShow, setToggleShow] = useState(false)
  // const [weight, setWeight] = useState('0')
  const [depositInput, setDepositInput] = useState('')
  const [withdrawInput, setWithdrawInput] = useState('')
  const depositWei = useWeiAmount(depositInput)
  const withdrawWei = useWeiAmount(withdrawInput)
  const [isDark] = useDarkModeManager()

  const [loading, setLoading] = useState(false)
  // console.log('props.apiData', props.apiData)

  const { account } = useActiveWeb3React()
  const fairlaunchAddress = '0xe6bE78800f25fFaE4D1db7CA6d3485629bD200Ed'
  const lpContract = useContract(props.stakingDataItem.lp_address, TWINDEX_LP_ABI)
  const fairlaunchContract = useContract(fairlaunchAddress, FAIRLAUNCH_ABI)

  const approve = async () => {
    const transaction = await lpContract?.approve(fairlaunchAddress, MaxUint256)
    await transaction.wait()
    props.updateAllData()
  }
  const deposit = async () => {
    const transaction = await fairlaunchContract?.deposit(account, props.stakingDataItem.pool_id, depositWei)
    await transaction.wait()
    props.updateAllData()
  }
  const withdraw = async () => {
    const transaction = await fairlaunchContract?.withdraw(account, props.stakingDataItem.pool_id, withdrawWei)
    await transaction.wait()
    props.updateAllData()
  }
  const claimReward = async () => {
    const transaction = await fairlaunchContract?.harvest(props.stakingDataItem.pool_id)
    await transaction.wait()
    props.updateAllData()
  }
  const disableDeposit = !(
    depositInput &&
    BigNumber.from(depositWei).gt(0) &&
    props.balance.gte(BigNumber.from(depositWei)) &&
    !props.allowance.isZero()
  )
  const disableWithdraw = !(
    withdrawInput &&
    BigNumber.from(withdrawWei).gt(0) &&
    props.depositBalance.gte(BigNumber.from(withdrawWei))
  )
  const disableClaim = props.stakingReward.isZero()

  // console.log('props.allowance', props.allowance)

  async function loadDataFromAPI() {
    // setWeight('0')
  }

  useEffect(() => {
    loadDataFromAPI()
  }, [])

  const handleApproveBtn = async () => {
    setLoading(true)
    await approve().finally(() => {
      setLoading(false)
    })
  }

  const handleDepositBtn = async () => {
    setLoading(true)
    await deposit().finally(() => {
      setLoading(false)
    })
    setDepositInput('')
  }

  const handleWithdrawBtn = async () => {
    setLoading(true)
    await withdraw().finally(() => {
      setLoading(false)
    })
    setWithdrawInput('')
  }

  const handleClaimBtn = async () => {
    setLoading(true)
    await claimReward().finally(() => {
      setLoading(false)
    })
  }

  const handleMaxDepositBtn = () => {
    setDepositInput(weiToFixed(props.balance.toString(), 18))
  }

  const handleMaxWithdrawBtn = () => {
    setWithdrawInput(weiToFixed(props.depositBalance.toString(), 18))
  }

  const wrappedOnDismiss = () => {
    console.log('')
  }

  return (
    <>
      <div className={`staking-item ${toggleShow ? 'active' : ''} mb-4`}>
        <Modal isOpen={loading} onDismiss={wrappedOnDismiss} maxHeight={90}>
          <div className={`modal-loading ${isDark ? 'text-white' : 'text-black'}`}>
            <div className="text-center">
              <div className="spinner-border text-primary mx-auto mb-4" role="status"></div>
              <div className="ml-3">Waiting for Transaction...</div>
            </div>
          </div>
        </Modal>
        <div className="staking-header row" onClick={() => setToggleShow(!toggleShow)}>
          <div className="tokens-group col-5 d-flex">
            <div className="d-flex align-items-center">
              <div className="img-logo">
                <img src={props.stakingDataItem.icon} alt="" />
              </div>
              <div className={`title-group`}>
                <div className="text-title">{props.stakingDataItem.name} LPs</div>
                <a target="_blank" rel="noreferrer" href={props.stakingDataItem.add_lp_url}>
                  {props.stakingDataItem.lp_address === `0x3806aae953a3a873D02595f76C7698a57d4C7A57` ?
                    < div className="text-sub">Buy {props.stakingDataItem.name}</div>
                    : <div className="text-sub">Add {props.stakingDataItem.name} LP</div>
                  }
                </a>
              </div>
            </div>
            <div className="weight-badge">{props.apiData && props.apiData.alloc_point}X</div>
          </div>
          <div className="apr-group col-2">
            <div>
              <div className="title">
                APR : {props.apiData && numberWithCommasFixedZero(props.apiData.apr.toString())}%
              </div>
              <div className="sub">
                ≈ {props.apiData && numberWithCommas((props.apiData.apr / 365).toFixed(2))}% daily
              </div>
            </div>
          </div>
          <div className="tvl-group col-3">
            ${props.apiData && numberWithCommasFixedZero(props.apiData.tvl.toString())}
          </div>
          <div className="earned-group col-2">
            {props.stakingReward.isZero() ? '0.00' : numberWithCommas(weiToFixed(props.stakingReward.toString(), 2))}
          </div>
        </div>
        <hr className="staking-divider" />
        <div className="staking-body d-block">
          <div className="row">
            <div className="col-12 col-sm-9 d-block">
              <div className="row">
                <div className="col-12 px-4 px-sm-3 col-sm-6 mt-2 mt-sm-0 ">
                  <div className="w-100">
                    Balance:{' '}
                    <span className="text-balance">
                      {props.balance.isZero() ? '0' : weiToFixed(props.balance.toString(), 2)}
                    </span>
                  </div>
                  <div className="w-100">
                    <input
                      type="number"
                      placeholder="0.00"
                      className="staking-input"
                      value={depositInput}
                      onChange={e => setDepositInput(e.target.value)}
                    />
                    <button onClick={handleMaxDepositBtn} className="btn-max">
                      Max
                    </button>
                  </div>
                  <div className="d-flex gap-1">
                    <button
                      onClick={handleApproveBtn}
                      className={`btn-staking-confirm mb-sm-0 mb-4 ${!props.allowance.isZero() ? 'd-none' : ''}`}
                    >
                      Approve
                    </button>
                    <button
                      onClick={handleDepositBtn}
                      className={`btn-staking-confirm mb-sm-0 mb-4 ${disableDeposit ? 'disabled' : ''}`}
                      disabled={disableDeposit}
                    >
                      Deposit
                    </button>
                  </div>
                </div>
                <div className="col-12 px-4 px-sm-3 col-sm-6">
                  <div className="w-100">
                    Deposited:{' '}
                    <span className="text-balance">
                      {props.depositBalance.isZero() ? '0' : weiToFixed(props.depositBalance.toString(), 2)}
                    </span>
                  </div>
                  <div className="w-100">
                    <input
                      type="number"
                      placeholder="0.00"
                      className="staking-input"
                      value={withdrawInput}
                      onChange={e => setWithdrawInput(e.target.value)}
                    />
                    <button onClick={handleMaxWithdrawBtn} className="btn-max ">
                      Max
                    </button>
                  </div>
                  <div className="w-100">
                    <button
                      onClick={handleWithdrawBtn}
                      disabled={disableWithdraw}
                      className={`btn-staking-confirm btn-block ${disableWithdraw ? 'disabled' : ''}`}
                    >
                      Withdraw
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 px-4 px-sm-3 col-sm-3">
              <div className="staking-reward">
                <div className="title">
                  {props.stakingReward.isZero()
                    ? '0.00'
                    : numberWithCommas(weiToFixed(props.stakingReward.toString(), 2))}
                </div>
                <div className="sub">
                  (≈ $
                  {props.stakingReward.isZero()
                    ? '0.00'
                    : numberWithCommas(
                      (
                        parseFloat(weiToFixed(props?.stakingReward?.toString(), 2)) *
                        parseFloat(props?.twinPrice?.toString())
                      ).toFixed(2)
                    )}
                  )
                </div>
                <button
                  onClick={handleClaimBtn}
                  disabled={disableClaim}
                  className={`btn-claim mb-4 mb-sm-0 ${disableClaim ? 'disabled' : ''}`}
                >
                  Claim
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
