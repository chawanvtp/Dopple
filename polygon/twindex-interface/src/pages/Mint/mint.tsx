import React, { useEffect, useState } from 'react'
import { ArrowDown } from 'react-feather'
import { ButtonConfirmed, ButtonLight } from '../../components/Button'
import { AutoColumn } from '../../components/Column'
import { SwapPoolTabs } from '../../components/NavigationTabs'
import { ArrowWrapper, BottomGrouping, Wrapper } from '../../components/swap/styleds'
import { useActiveWeb3React } from '../../hooks'
import './style.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import InputRange from 'react-input-range'
import 'react-input-range/lib/css/index.css'
import { faCaretDown, faExclamationTriangle, faInfoCircle, faTimes } from '@fortawesome/free-solid-svg-icons'
import {
  DOLLY_CONTRACT_ADDRESSES,
  useDollyContract,
  useLoanLogicStandardContractWithDl
} from 'components/SearchModal/MintFunction'
import dollyIcon from '../../assets/svg/dolly-icon.svg'
import { DOLLY, dollyToken, emptyStockToken, stockTokens } from './stockTokens'
import { StockToken, StockTokenWithPrice } from './types'
import { BigNumber } from '@ethersproject/bignumber'
import isZero from 'utils/isZero'
import { MaxUint256 } from '@ethersproject/constants'
import { AutoRow } from 'components/Row'
import Loader from 'components/Loader'
import { useDarkModeManager } from 'state/user/hooks'
import { useWeiAmount } from 'hooks/useWeiAmount'
import { bignumber } from 'mathjs'
import { toWei, weiToFixed } from 'utils/math-helpers'
import mkrMulticall from 'utils/mkrMulticall'
import PRICE_FEED_ABI from '../../constants/abis/SyntheticStock/priceFeed.json'
import { ERC20_ABI } from 'constants/abis/erc20'
import { Contract } from 'ethers'
import { getProviderOrSigner } from 'utils'

const CautionMessage = `At least 150% of collateral required. Your position will be liquidated, if the collateral price lower than 120% of the stock token minted.`

// the position drops below minimum collateral ratio, any user may immediately liquidate the position.

export default function Mint() {
  const { account, chainId, library } = useActiveWeb3React()
  const [isDark] = useDarkModeManager()
  const [collateralInput, setCollateralInput] = useState('')
  const collateral = useWeiAmount(collateralInput)
  const [collateralRatio, setCollateralRatio] = useState<number>(200)
  const [output, setOutput] = useState(0)
  // const [outputBN, setOutputBN] = useState(BigNumber.from(0))
  const [displayStockModal, setDisplayStockModal] = useState(false)
  const [selectedStock, setSelectedStock] = useState<StockToken>(emptyStockToken)
  const [approval, setApproval] = useState(false)
  const [approvalSubmitted, setApprovalSubmitted] = useState(false)
  const [priceList, setPriceList] = useState<Array<StockTokenWithPrice>>()
  const [myDollyBalance, setMyDollyBalance] = useState(-1.0)
  const [stockBalance, setStockBalance] = useState<Array<any>>()
  // const loanLogicStandardContract = useLoanLogicStandardContract(LOAN_LOGIC_STANDARD_CONTRACT_ADDRESSES)
  const dollyContract = useDollyContract(DOLLY_CONTRACT_ADDRESSES)

  const selectedDlTokenContract = useLoanLogicStandardContractWithDl(selectedStock.dlAddress)
  // ----- GET TokenValueInDolly "queryRate" -----
  const calls = stockTokens.map(st => {
    return {
      address: '0xd4f061a6a276f8B0Ae83D210D838B45fCC7532B2',
      name: 'queryRate',
      params: [st.address, '0xff54da7caf3bc3d34664891fc8f3c9b6dea6c7a5']
    }
  })

  function fetchPriceList() {
    mkrMulticall(chainId, PRICE_FEED_ABI, calls).then(result => {
      const results: StockTokenWithPrice[] = []
      stockTokens.map((stock, index: number) => {
        results.push({
          ...stock,
          price: parseFloat(weiToFixed(bignumber(result[index].rate.toString()), 6))
        })
        return stock
      })
      if (priceList?.length !== results.length) {
        setPriceList(results)
      }
      return results
    })
  }

  function getTokenValueInDolly(newOutput: number, tokenAddress: string, setInput = true, newCollateralRatio?: number) {
    mkrMulticall(chainId, PRICE_FEED_ABI, calls).then(result => {
      const results: StockTokenWithPrice[] = []
      stockTokens.map((stock, index: number) => {
        results.push({
          ...stock,
          price: parseFloat(weiToFixed(bignumber(result[index].rate.toString()), 6))
        })
        return stock
      })
      if (!newOutput || !tokenAddress) return
      const tokenPrice = results?.find(stockWithPrice => stockWithPrice.address === tokenAddress)
      const newPrice = (tokenPrice?.price as number) * newOutput * (newCollateralRatio ? newCollateralRatio / 100 : collateralRatio / 100)
      if (newCollateralRatio) setCollateralRatio(newCollateralRatio)
      if (setInput) setCollateralInput(newPrice.toString())
      if (priceList?.length !== results.length) {
        setPriceList(results)
      }
      return results
    })
  }

  function getTokenReceiveByDolly(newInput: number, tokenAddress: string) {
    mkrMulticall(chainId, PRICE_FEED_ABI, calls).then(result => {
      const results: StockTokenWithPrice[] = []
      stockTokens.map((stock, index: number) => {
        results.push({
          ...stock,
          price: parseFloat(weiToFixed(bignumber(result[index].rate.toString()), 6))
        })
        return stock
      })
      if (!newInput || !tokenAddress) return
      const stockToken = results?.find(stockWithPrice => stockWithPrice.address === tokenAddress)
      if (!stockToken || !stockToken.price) return
      const newOutput = (newInput / Number(stockToken?.price)) / (collateralRatio / 100)
      if (newOutput) setOutput(newOutput)
      console.error('getTokenReceiveByDolly RATIO: ', (collateralRatio / 100))
      console.error('getTokenReceiveByDolly newOutput: ', newOutput)
      // const newPrice = (tokenPrice?.price as number) * newInput * (newCollateralRatio ? newCollateralRatio / 100 : collateralRatio / 100)
      // if (newCollateralRatio) setCollateralRatio(newCollateralRatio)
      // if (setInput) setCollateralInput(newPrice.toString())
      // if (priceList?.length !== results.length) {
      //   setPriceList(results)
      // }
      return results
    })
  }

  async function checkAllowance(tokenID: string) {
    if (!account) return
    const result: BigNumber = await dollyContract?.allowance(account, tokenID)
    const hex = result.toHexString()
    return isZero(hex) ? setApproval(false) : setApproval(true)
  }

  async function getDollyBalance() {
    try {
      const dollyBalance = await dollyContract?.balanceOf(account)
      const balance = weiToFixed(dollyBalance.toString(), 4)
      setMyDollyBalance(parseFloat(balance))
    } catch (error) {
      console.error('getDollyBalance ERROR: ', error)
    }
    getStockBalance()
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

  async function handleSelectedStock(stockToken: StockToken) {
    setSelectedStock(stockToken)
    getTokenReceiveByDolly(parseFloat(collateralInput), stockToken.address)
    await checkAllowance(stockToken.dlAddress)
    setApprovalSubmitted(false)
    return setDisplayStockModal(false)
  }

  async function handleApproveClicked() {
    if (!account) return
    setApprovalSubmitted(true)
    try {
      const approveTransaction = await dollyContract?.approve(selectedStock.dlAddress, MaxUint256)
      await approveTransaction.wait()
      setApproval(true)
    } catch (error) {
      setApprovalSubmitted(false)
      setApproval(false)
    }
  }

  async function handleMintClicked() {
    if (!account || !chainId) return
    const outputToSubmit = toWei(output)
    console.error('outputToSubmit: ', outputToSubmit)
    try {
      const confirmBorrow = await selectedDlTokenContract?.borrow(
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        outputToSubmit,
        6825600,
        collateral,
        `${DOLLY.ADDRESS}`,
        account,
        account,
        '0x'
      )
      console.error('confirmBorrow => ', confirmBorrow)
    } catch (error) {
      console.error('confirmBorrow ERROR => ', error)
      // if (myDollyBalance !== 10000000.0 && parseFloat(collateral) > myDollyBalance) return alert("Insufficient Balance")
      // if (error.data.message && error.data.message === "execution reverted: 28-b") return alert("Insufficient Balance")
      if (parseFloat(collateral) < 100) {
        return alert('Something went wrong, please try again !!')
      }
    }
  }

  async function getAmountStockResult(collateral: number) {
    if (!account) return
    try {
      const amountStockToReceive = (await selectedDlTokenContract?.getBorrowAmountForDeposit(
        BigNumber.from(toWei(((collateral * 1.5) / (collateralRatio / 100)).toString())),
        6825600,
        dollyToken.address
      )) as BigNumber
      const amountToReceive = parseFloat(weiToFixed(bignumber(amountStockToReceive.toString()), 8))
      setOutput(amountToReceive)
    } catch (error) {
      return 0
    }
    return 0
  }

  function handleCollateralRationChange(prevRatio: number, ratio: number) {
    if (!account) return
    setCollateralRatio(ratio)
    getTokenValueInDolly(output, selectedStock.address, true, ratio)
    setCollateralInput((Number(collateralInput) * (ratio / prevRatio)).toString())
  }

  function handleCollateralRationTypeChange(prevRatio: number, ratio: number) {
    if (!account || ratio > 200) return
    setCollateralRatio(ratio)
    console.error('output: ', output)
    getTokenValueInDolly(output, selectedStock.address, true, ratio)
    setCollateralInput((Number(collateralInput) * (ratio / prevRatio)).toString())
  }

  function handleColleralType(collateral: number) {
    if (!account) return
    setCollateralInput(String(collateral))
    getAmountStockResult(collateral)
    getTokenValueInDolly(output, selectedStock.address, false)
    if (myDollyBalance < 0) {
      getDollyBalance()
    }
  }

  function handleOutputType(output: number) {
    getTokenValueInDolly(output, selectedStock.address)
    setOutput(Number(output))
    if (myDollyBalance < 0) {
      getDollyBalance()
    }
  }

  const warningMessage = `Collateral ratio must be higher than minimum of 150%`

  function createWarning() {
    return (<div className="warning-dialog-wrapper container pl-1 mt-4">
      <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
      {warningMessage}
    </div>)
  }

  function maxDollyBtnClicked() {
    if (myDollyBalance < 0) return
    setCollateralInput((myDollyBalance).toString())
    getTokenReceiveByDolly(myDollyBalance, selectedStock.address)
  }

  function getSelectedStockBalance(token: StockToken) {
    if (!stockBalance || stockBalance.length <= 0) return 0
    const a = stockBalance.find(balance => balance.address === token?.address)
    return a
  }

  useEffect(() => {
    if (myDollyBalance < 0) getDollyBalance()
    if (!priceList) fetchPriceList()
    getSelectedStockBalance(selectedStock)
    if (!stockBalance && priceList) getStockBalance()
  }, [priceList, myDollyBalance, selectedStock])
  const selectedMint = stockBalance ? stockBalance.find(balance => balance.address === selectedStock.address) : 0
  return (
    <>
      <SwapPoolTabs active={'swap'} />
      <Wrapper id="swap-page">
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
                const tokenWithPrice = priceList?.find(token => token.address === stock.address)
                const tokenWithBalance = stockBalance?.find(token => token.address === stock.address)
                // console.error('price: ',price)
                return (
                  <div className={`row p-3 clickable ${isDark ? `text-light` : `text-dark`}`} key={`${stock.address}`} onClick={() => handleSelectedStock(stock)}>
                    <img src={stock.logoURI} alt="dollyIcon" className="d-inline token-icon col-2 mr-0" />
                    <div className="stock-modal-item-name col-7 pl-0">{`d${stock.name}`}
                    <div className="stock-modal-item-amount d-inline">{`${tokenWithBalance ? parseFloat(tokenWithBalance.balance).toFixed(4) : ``}`}</div>
                    </div>
                    <div className="stock-modal-item-name col-3">{tokenWithPrice && (tokenWithPrice.price).toFixed(2)}</div>
                    {/* <div className="stock-modal-item-name text-black">{stockTokens}</div> */}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <AutoColumn gap={'md'}>
          <div className="container">
            <div className={`row ${isDark ? `input-panel-wrapper dark` : `input-panel-wrapper`}`}>
              <div className="col-4 header">Collateral</div>
              <div className="col-8 header-2 text-truncate text-right pl-0">{`Balance: ${myDollyBalance}`}</div>
              <input
                type="number"
                className="col-5 border-0 collateral-input"
                placeholder={`0.0000`}
                value={collateralInput}
                onChange={e => {
                  handleColleralType(Number(e.target.value))
                }}
              />
              <div className="col-7 text-right pr-3 collateral-input-currency">
                {myDollyBalance < 0 ? `` : <button type="button" onClick={maxDollyBtnClicked} className="max-dolly-btn">MAX</button>}
                <img src={dollyIcon} alt="dollyIcon" className="d-inline" />
                <div className="collateral-base-text d-inline">DOLLY</div>
              </div>
            </div>
          </div>

          <AutoColumn justify="space-between" className="text-center">
            <ArrowWrapper clickable>
              <ArrowDown size="16" />
            </ArrowWrapper>
          </AutoColumn>

          <div className="container">
            <div className={`row ${isDark ? `input-panel-wrapper dark` : `input-panel-wrapper`}`}>
              <div className="col-6 header">Minted</div>
              <div className="col-6 header-2 text-right">{selectedMint ? `Balance
              : ${parseFloat(selectedMint.balance).toFixed(4)}` : ``}</div>
              <input
                type="number"
                className="col-5 border-0 minted-output"
                placeholder={`0.0000`}
                value={output}
                onChange={e => handleOutputType(Number(e.target.value))}
              />
              {selectedStock === emptyStockToken ? (
                <div className="col-7">
                  <div
                    className="select-btn float-right mr-1 d-inline"
                    onClick={() => {
                      fetchPriceList()
                      setDisplayStockModal(!displayStockModal)
                    }}
                  >
                    Select an asset <FontAwesomeIcon icon={faCaretDown} className="d-inline ml-2" />{' '}
                  </div>
                </div>
              ) : (
                <div className="col-7 text-right mint-select">
                  <div className="select-btn d-inline" onClick={() => setDisplayStockModal(!displayStockModal)}>
                    {priceList ? '$ ' + priceList.find(e => e.address === selectedStock.address)?.price : ``}
                  </div>
                  <img
                    src={selectedStock.logoURI}
                    alt="dollyIcon"
                    className="d-inline token-icon"
                    onClick={() => setDisplayStockModal(!displayStockModal)}
                  />
                  <div className="select-btn d-inline" onClick={() => setDisplayStockModal(!displayStockModal)}>
                    {`d${selectedStock.name}`}
                  </div>
                  <FontAwesomeIcon
                    icon={faCaretDown}
                    className="d-inline"
                    onClick={() => setDisplayStockModal(!displayStockModal)}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="container">
            <div className={`row ${isDark ? `input-panel-wrapper dark` : `input-panel-wrapper`}`} style={collateralRatio < 150 ? { borderColor: `red` } : { fontWeight: `bold` }}>
              <div className="col-12 header">Collateral Ratio {collateralRatio < 150 ? `` : ``}</div>
              <input
                type="number"
                className="col-7 border-0 collateral-input"
                placeholder={`0.0000`}
                min="1"
                max="400"
                value={collateralRatio}
                onChange={e => {
                  if ((e.target.value).length <= 0) return
                  handleCollateralRationTypeChange(collateralRatio, (e.target.value) as unknown as number)
                }}
              />
              <div className="col-5 text-right pr-3">
                <div className="collateral-base-text d-inline">%</div>
              </div>
            </div>
          </div>

          <div className={`${isDark ? `dark` : ``} p-2 input-range-wrapper ${collateralRatio < 150 ? `red` : ``}`}>
            {/* Header Guage */}
            <div style={{ position: `relative` }} className="">
              {/* <div style={{ width: `35%` }} className="guage-header-item-wrapper">
                <div className="guage-header-item" onClick={() => handleCollateralRationChange(collateralRatio, 150)}>
                  Min 150% <FontAwesomeIcon icon={faInfoCircle} />
                </div>
              </div> */}
              <div style={{ width: `60%` }} className="guage-header-item-wrapper text-center">
                <div className="guage-header-item" onClick={() => handleCollateralRationChange(collateralRatio, 200)}>
                  Safe 200% <FontAwesomeIcon icon={faInfoCircle} />
                </div>
              </div>
            </div>
            {/* Guage */}
            <div style={{ position: `relative` }} className="">
              {/* <div style={{ width: `${25.25}%` }} className="guage-item" /> */}
              <div style={{ width: `${50.15}%` }} className="guage-item" />
            </div>
            <InputRange
              maxValue={400}
              minValue={0}
              formatLabel={e => `${e}%`}
              value={collateralRatio}
              onChange={value => {
                handleCollateralRationChange(collateralRatio, value as number)
              }}
            />
            {collateralRatio < 150 ? createWarning() : ``}
          </div>

          <div className={`container ${collateralRatio < 150 ? `` : `mt-3`}`}>
            <div className={`row ${isDark ? `warning-wrapper dark` : `warning-wrapper`}`}>
              <div className="col-12 header"><FontAwesomeIcon icon={faInfoCircle} /> Caution</div>
              <div className="col-12 mt-1 body">{CautionMessage}</div>
            </div>
          </div>

        </AutoColumn>
        <BottomGrouping className="text-center mt-4">
          {!account ? (
            <ButtonLight>Connect Wallet</ButtonLight>
          ) : !approval && selectedStock !== emptyStockToken ? (
            <ButtonConfirmed
              onClick={handleApproveClicked}
              disabled={approval}
              width="100%"
              altDisabledStyle={!approval} // show solid button while waiting
              confirmed={approval}
            >
              {/* {approval ? 'Approved' : 'Approve ' + selectedStock.symbol} */}
              {approvalSubmitted && !approval ? (
                <AutoRow gap="6px" justify="center">
                  Approving <Loader stroke="white" />
                </AutoRow>
              ) : approvalSubmitted && approval ? (
                'Approved'
              ) : (
                'Approve ' + selectedStock.symbol
              )}
            </ButtonConfirmed>
          ) : approval ? (
            <>
              <ButtonConfirmed
                onClick={handleMintClicked}
                disabled={false}
                width="100%"
                altDisabledStyle={!approval} // show solid button while waiting
                confirmed={!approval}
              >
                {`Mint`}
              </ButtonConfirmed>
            </>
          ) : selectedStock === emptyStockToken || bignumber(collateral).toNumber() <= 0 ? (
            <ButtonConfirmed
              onClick={handleMintClicked}
              disabled={true}
              width="100%"
              altDisabledStyle={approval} // show solid button while waiting
              confirmed={approval}
            >
              {`Enter an amount`}
            </ButtonConfirmed>
          ) : approval &&
            bignumber(collateral).toNumber() > 0 &&
            myDollyBalance < parseFloat(collateral) &&
            myDollyBalance !== 10000000.0 ? (
            <>
              <ButtonConfirmed
                onClick={handleMintClicked}
                disabled={true}
                width="100%"
                altDisabledStyle={!approval} // show solid button while waiting
                confirmed={!approval}
              >
                {`Insufficient Balance`}
              </ButtonConfirmed>
            </>
          ) : (
            ``
          )}

          {/* myDollyBalance < parseFloat(collateral) ? (
            <>
            <ButtonConfirmed
              onClick={handleMintClicked}
              disabled={true}
              width="100%"
              altDisabledStyle={!approval} // show solid button while waiting
              confirmed={!approval}
            >
              {`Insufficient Balance`}
            </ButtonConfirmed>
          </> */}
        </BottomGrouping>
      </Wrapper>
    </>
  )
}
