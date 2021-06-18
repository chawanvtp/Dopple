import React, { useEffect, useState } from 'react'
import './info.css'
import { useDarkModeManager } from 'state/user/hooks'
import { TWIN_API_DATA } from './types'
import { SecondaryInfoCard, TvlCard, ToggleInfo, TokenInfoElement, OracleInfoElement, OtherInfoElement } from './components'

export default function InfoPage() {
  const [isDark] = useDarkModeManager()
  const [apiData, setApiData] = useState<TWIN_API_DATA | null>(null)

  const updateAllData = () => {
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
  return !apiData ? <></> : (
    <>
      <div className={`${isDark ? 'dark' : 'light'} container farm px-0`}>
        <div className="row">
          <SecondaryInfoCard api_data={apiData} header={`TWIN Price`} body={`$${numberWithCommas(apiData?.twin_price.toFixed(2))}`} />
          <SecondaryInfoCard api_data={apiData} header={`Total Trading Volume`} body={`-`} />
          <SecondaryInfoCard api_data={apiData} header={`Total Liquidity`} body={`$${numberWithCommas(apiData?.total_liquidity.toFixed(0))}`} />
          {/* <SecondaryInfoCard api_data={apiData} header={`Total Buyback`} body={`-`} /> */}
        </div>
        <div className="row mb-4">
          <TvlCard {...apiData} />
        </div>
        <ToggleInfo api_data={apiData} header="Token" body={<TokenInfoElement />} />
        <ToggleInfo api_data={apiData} header="Oracle" body={<OracleInfoElement />} />
        <ToggleInfo api_data={apiData} header="Other" body={<OtherInfoElement />} />
      </div>
    </>
  )
}

function numberWithCommas(x: any) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
