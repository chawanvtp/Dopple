import React from 'react'
import { Currency } from '@uniswap/sdk'
import { useDarkModeManager } from 'state/user/hooks'

interface TechnicalAnalysisProps {
  currency?: Currency | null
  onCurrencySelect: (currency: Currency) => void
}

export default function TechnicalAnalysis({ currency, onCurrencySelect }: TechnicalAnalysisProps) {
  const [isDark] = useDarkModeManager()
  const symbolList = [
    {
      currency: 'BNB',
      symbol: 'KRAKEN:BNBUSD'
    },
    {
      currency: 'USDC',
      symbol: 'KRAKEN:USDCUSD'
    },
    {
      currency: 'USDT',
      symbol: 'KRAKEN:USDTUSD'
    },
    {
      currency: 'UNI',
      symbol: 'BINANCE:UNIUSDT'
    },
    {
      currency: 'DAI',
      symbol: 'KRAKEN:DAIUSDT'
    },
    {
      currency: 'WBTC',
      symbol: 'COINBASE:WBTCUSD'
    },
    {
      currency: 'KP3R',
      symbol: 'POLONIEX:KP3RUSDT'
    },
    {
      currency: 'YFI',
      symbol: 'BINANCE:YFIUSDT'
    },
    {
      currency: 'AAVE',
      symbol: 'BINANCE:AAVEUSDT'
    },
    {
      currency: 'LINK',
      symbol: 'BINANCE:LINKUSD'
    }
  ]

  // var chartStyle = {minHeight:'unset'};
  let currentSymbol = '0'

  if (!currency) {
    localStorage.removeItem('currency')
  }

  if (document.getElementById('chart') && currency && onCurrencySelect) {
    currentSymbol = symbolList.find(sb => sb.currency === currency?.symbol)?.symbol ?? '0'
    console.log(currency?.symbol)

    // chartStyle = {minHeight:'450px'};`

    if (localStorage.getItem('currency') == null || localStorage.getItem('currency') !== currentSymbol) {
      localStorage.setItem('currency', currentSymbol)
      const script = document.createElement('script')
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js'
      script.async = true
      script.innerHTML = JSON.stringify({
        interval: '15m',
        width: 425,
        isTransparent: true,
        height: 450,
        symbol: currentSymbol,
        showIntervalTabs: true,
        locale: 'en',
        colorTheme: isDark ? 'light' : 'dark'
      })
      const chart = document.getElementById('chart')

      if (chart!.childNodes.length === 1) chart!.removeChild(chart!.childNodes[0])

      if (currentSymbol !== '0') chart!.appendChild(script)
    }
  }

  return <div id="chart"></div>
}
