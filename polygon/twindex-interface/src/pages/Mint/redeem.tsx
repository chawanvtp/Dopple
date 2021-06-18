import React, { useEffect, useState } from 'react'
import { ButtonConfirmed, ButtonLight } from '../../components/Button'
import { SwapPoolTabs } from '../../components/NavigationTabs'
import { BottomGrouping, Wrapper } from '../../components/swap/styleds'
import { useActiveWeb3React } from '../../hooks'
import './redeem.css'
import 'react-input-range/lib/css/index.css'
import { DFI_PROTOCOL_CONTRACT_ADDRESSES, useDfiContract } from 'components/SearchModal/MintFunction'
import { stockTokens } from './stockTokens'
import { BigNumber } from '@ethersproject/bignumber'
// import { MaxUint256 } from '@ethersproject/constants'
import { AutoRow } from 'components/Row'
import Loader from 'components/Loader'
// import { useDarkModeManager } from 'state/user/hooks'
// import { useWeiAmount } from 'hooks/useWeiAmount'
import { toWei, weiToFixed } from 'utils/math-helpers'
import { StockAllowance, StockToken, StockTokenWithPrice, TLoan } from './types'
import { ERC20_ABI } from 'constants/abis/erc20'
import mkrMulticall from 'utils/mkrMulticall'
import { Contract } from 'ethers'
import { getProviderOrSigner } from 'utils'
import { MaxUint256 } from '@ethersproject/constants'
import { bignumber } from 'mathjs'
import PRICE_FEED_ABI from '../../constants/abis/SyntheticStock/priceFeed.json'
import { faTimes, faWallet } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useDarkModeManager } from 'state/user/hooks'

interface RedeemProps {
  hideSmallAsset: Boolean
}

export default function Redeem({ hideSmallAsset }: RedeemProps) {
  const { account, chainId, library } = useActiveWeb3React()
  const dfiContract = useDfiContract(DFI_PROTOCOL_CONTRACT_ADDRESSES)
  const [userStocks, setUserStocks] = useState<Array<TLoan>>([])
  const [userStocksGetLimit, setUserStocksGetLimit] = useState(1)
  const [userStocksAllowance, setUserStocksAllowance] = useState<Array<StockAllowance>>([])
  const [approvingToken, setApprovingToken] = useState('')
  const [priceList, setPriceList] = useState<StockTokenWithPrice[]>([])
  const [stockBalance, setStockBalance] = useState<Array<any>>()
  const [priceListLoad, setPriceListLoad] = useState(-1)
  const [displayStockModal, setDisplayStockModal] = useState(false)
  const [isDark] = useDarkModeManager()

  const calls = stockTokens.map(st => {
    return {
      address: st.address,
      name: 'allowance',
      params: [account ?? undefined, dfiContract!.address]
    }
  })

  // ----- GET dlToken(s) ALLOWANCE -----
  function getTokensAllowance() {
    mkrMulticall(chainId, ERC20_ABI, calls).then(result => {
      const StocksAllowance = stockTokens.map((st, index) => {
        return {
          stockToken: st,
          allowance: !(result[index][0] as BigNumber).isZero()
        } as StockAllowance
      })
      setUserStocksAllowance(StocksAllowance)
      // setUserStocksAllowanceGetLimit(userStocksAllowanceGetLimit - 1)
    })
  }

  // ----- GET TokenValueInDolly "queryRate" -----
  const callsPrice = stockTokens.map(st => {
    return {
      address: '0xd4f061a6a276f8B0Ae83D210D838B45fCC7532B2',
      name: 'queryRate',
      params: [st.address, '0xff54da7caf3bc3d34664891fc8f3c9b6dea6c7a5']
    }
  })

  async function getTokenValueInDolly() {
    mkrMulticall(chainId, PRICE_FEED_ABI, callsPrice).then(result => {
      const results: StockTokenWithPrice[] = []
      stockTokens.map((stock, index: number) => {
        results.push({
          ...stock,
          price: parseFloat(weiToFixed(bignumber(result[index].rate.toString()), 6))
        })
        return stock
      })
      if (priceListLoad < 0 && priceList.length <= 0) {
        setPriceListLoad(1)
        setPriceList(results)
      }
      return results
    })
  }

  // -----  GET ALL USER LOAN(s) -----
  async function getLoanList() {
    if (!dfiContract || userStocks.length > 0) return
    const userStocksResult = (await dfiContract.getUserLoans(account, 0, 1000, 0, false, false)) as Array<TLoan>
    setUserStocks(userStocksResult)
    setUserStocksGetLimit(userStocksGetLimit - 1)
  }

  function approveSuccess(token: StockToken) {
    let newUserStocksAllowace = [...userStocksAllowance]
    newUserStocksAllowace.forEach((stockAllowance, index) => {
      if (stockAllowance.stockToken.address === token.address) {
        newUserStocksAllowace[index].allowance = true
      }
    })
    setUserStocksAllowance(newUserStocksAllowace)
  }

  async function approveBtnClicked(token: StockToken) {
    if (!library || !account || !token) return
    try {
      setApprovingToken(token.address)
      const tokenContract = new Contract(token?.address, ERC20_ABI, getProviderOrSigner(library, account))
      const approveTransaction = await tokenContract?.approve(dfiContract?.address, MaxUint256)
      await approveTransaction.wait()
      if (approveTransaction) {
        approveSuccess(token)
      }
      setApprovingToken('')
    } catch (error) {
      setApprovingToken('')
      console.error('approveBtnClicked ERROR: ', error)
    }
  }

  function redeemSuccess(stockData: TLoan) {
    const redeemSuccessIndex = userStocks.findIndex(userStock => userStock === stockData)
    const newUserStocks = [...userStocks]
    newUserStocks.splice(redeemSuccessIndex, 1)
    setUserStocks(newUserStocks)
    setUserStocksGetLimit(userStocksGetLimit + 1)
  }

  async function redeemBtnClicked(stockData: TLoan, depositAmount: string) {
    if (!library || !account || !stockData) return
    console.error(depositAmount.toString())
    try {
      const redeemTransaction = await dfiContract?.closeWithDeposit(stockData.loanId, account, depositAmount.toString())
      await redeemTransaction.wait()
      redeemSuccess(stockData)
    } catch (error) {
      console.error('redeemBtnClicked ERROR: ', error)
    }
  }

  function createRowElement(TLoanList: TLoan[]) {
    if (TLoanList.length <= 0) return null
    return TLoanList.map((stockData, index) => {
      const tokenData = stockTokens.find(st => st.address === stockData.loanToken)
      const approval = userStocksAllowance.find(
        stockAllowance => stockAllowance.stockToken.address === stockData.loanToken
      )?.allowance
      const approving = approvingToken === tokenData?.address
      const depositAmount = weiToFixed(stockData.principal.toString(), 4)
      const closeDepositAmount = toWei(weiToFixed(stockData.principal.toString(), 4))
      const tokenPrice = priceList.find(st => st.address === stockData.loanToken)?.price
      const collateral = weiToFixed(stockData.collateral.toString(), 1)
      const stock = stockBalance?.find(res => res.address === tokenData?.address)
      return !tokenData || !tokenPrice || (hideSmallAsset && parseFloat(collateral) < 1) ? (
        ``
      ) : (
        <div key={`redeem-stock-row-${index}`} className="redeem-stock-row row">
          <div className="col-4 col-md-3">
            <div className="token-logo-wrapper">
              <img src={tokenData.logoURI} alt={`${tokenData.symbol}`} className="token-logo d-inline" />
            </div>
            <div className={`token-balance`}><FontAwesomeIcon icon={faWallet} className="mr-1" /> {stock?.balance || '-'}</div>
          </div>
          <div className="col-4 col-md-3">
            <div className="deposit-amount">
              {depositAmount}
              <div className="deposit-amount-in-dollar">{`$${(Number(tokenPrice) * parseFloat(depositAmount)).toFixed(
                2
              )}`}</div>
            </div>
            <div className="liq-price">{`liq at $${(Number(collateral) / 1.2).toFixed(1)}`}</div>
          </div>
          <div className="col-4 col-md-3">
            <div className="collateral-amount">{`~ ${collateral} $`}</div>
          </div>
          {/* <td>
            <div className="deposit-amount">{`~${collateral} $`}</div>
            <div className="deposit-amount-in-dollar d-none">{`~ $${depositAmount}`}</div>
          </td> */}
          <div className="col-12 col-md-3">
            <BottomGrouping className="text-center p-1 pt-3 pb-3 mt-0">
              {!account ? (
                <ButtonLight>Connect Wallet</ButtonLight>
              ) : !approval ? (
                <ButtonConfirmed
                  onClick={() => approveBtnClicked(tokenData)}
                  disabled={approval}
                  width="100%"
                  altDisabledStyle={!approval} // show solid button while waiting
                  confirmed={approval}
                >
                  {/* {approval ? 'Approved' : 'Approve ' + selectedStock.symbol} */}
                  {!approval && approving ? (
                    <AutoRow gap="6px" justify="center">
                      Approving <Loader stroke="white" />
                    </AutoRow>
                  ) : approval ? (
                    'Approved'
                  ) : (
                    'Approve'
                  )}
                </ButtonConfirmed>
              ) : approval ? (
                <>
                  <ButtonConfirmed
                    onClick={() => redeemBtnClicked(stockData, closeDepositAmount)}
                    disabled={false}
                    width="100%"
                    altDisabledStyle={!approval} // show solid button while waiting
                    confirmed={!approval}
                  >
                    {`Redeem`}
                  </ButtonConfirmed>
                </>
              ) : (
                ``
              )}
            </BottomGrouping>
          </div>
        </div>
      )
    })
  }

  function createBalance() {
    return stockBalance && stockBalance.length > 0 ?
      stockBalance.map((balance, index) => <>
        <div key={`stock-balance-in-wallet-${index}`}>
          {balance && balance.balance ? `` : ``}
        </div>
      </>) : ``
  }

  async function getStockBalance() {
    try {
      const balanceList: any[] = []
      priceList?.forEach(async token => {
        if (!library || !account) return
        const tokenContract = new Contract(token?.address, ERC20_ABI, getProviderOrSigner(library, account))
        const tokenBalance = await tokenContract?.balanceOf(account)
        const balance = weiToFixed(tokenBalance.toString(), 4)
        balanceList.push({ name: token?.name, symbol: token?.symbol, address: token?.address, price: token?.price, balance })
        if ((!stockBalance || stockBalance.length <= 0) && balanceList.length >= priceList.length) {
          setStockBalance(balanceList)
        }
      })
    } catch (error) {
      console.error('getDollyBalance ERROR: ', error)
    }
  }

  useEffect(() => {
    if (priceListLoad < 0) {
      getTokenValueInDolly()
    }
    if (userStocksGetLimit) getLoanList()
    if (userStocksAllowance.length < stockTokens.length) getTokensAllowance()
    if (!stockBalance && priceList) getStockBalance()
  }, [priceList, stockBalance])

  return (
    <>
      <div
        className={displayStockModal ? `select-stock-modal-wrapper-bg` : `d-none`}
        onClick={() => setDisplayStockModal(false)}
      >
        <div className={`select-stock-modal-wrapper ${isDark ? `dark` : ``}`} onClick={e => e.stopPropagation()}>
          <div className="container">
            <div className="row header-row mt-3 mb-3">
              <div className="col-10"> Select a Stock</div>
              <div className="col-2 text-right clickable">
                {' '}
                <FontAwesomeIcon icon={faTimes} onClick={() => setDisplayStockModal(false)} />
              </div>
            </div>
            {stockTokens.map(stock => {
              return (
                <div className={`row p-3 clickable ${isDark ? `text-light` : `text-dark`}`} key={`${stock.address}`}>
                  <img src={stock.logoURI} alt={`${stock.symbol}`} className="d-inline token-icon" />
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <SwapPoolTabs active={'swap'} />
      <Wrapper id="swap-page" className="redeem-wrapper container">
        {stockBalance && stockBalance.length > 0 ? createBalance() : ``}
        <div className="redeem-stock-row border-0 p-0 m-0 row"
        >
          <div className="col-4 col-sm-3">Name</div>
          <div className="col-4 col-sm-3">Amount</div>
          <div className="col-4 col-sm-3">Collateral</div>
          <div className="col-4 col-sm-3"></div>
        </div>
        {userStocks.length > 0 && userStocksAllowance && !userStocksGetLimit ? createRowElement(userStocks) : ``}
      </Wrapper>
    </>
  )
}
