import React, { useState } from 'react'
// import AppBody from 'pages/AppBody'
import Mint from './mint'
import Redeem from './redeem'
import styled from 'styled-components'
import { getHideSmallRedeemAssets, setHideSmallRedeemAssets } from './hook'
import { useDarkModeManager } from 'state/user/hooks'

const MintWrapper = styled.div`
  position: relative;
  max-width: 420px;
  width: 100%;
  background: ${({ theme }) => theme.bg1};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 30px;
  padding: 1rem;
  margin-top: 6rem;
  /* position: absolute;
    top: 60%;
    left: 50%;
    transform: translate(-50%, -50%); */
  color: ${({ theme }) => theme.text6};
`

const RedeemWrapper = styled.div`
  position: relative;
  width: auto;
  min-width: 85%;
  background: ${({ theme }) => theme.bg1};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 30px;
  padding: 1rem;
  margin-top: 6rem;
  /* position: absolute;
    top: 60%;
    left: 50%;
    transform: translate(-50%, -50%); */
  color: ${({ theme }) => theme.text6};
`

export function MintBody({ children }: { children: React.ReactNode }) {
  return <MintWrapper>{children}</MintWrapper>
}

export function RedeemBody({ children }: { children: React.ReactNode }) {
  return <RedeemWrapper>{children}</RedeemWrapper>
}

export default function MintPage() {
  const [activeTopic, setActiveTopic] = useState('Mint')
  const [hideSmallAsset, setHideSmallAsset] = useState(getHideSmallRedeemAssets())
  const [isDark] = useDarkModeManager()
  
  function hideSmallAssetButtonClicked(){
    setHideSmallAsset(!hideSmallAsset)
    setHideSmallRedeemAssets()
  }

  return (
    <>
      {activeTopic === 'Mint' ? (
        <MintBody>
          <div className="row text-center mint-page-header-wrapper">
            <div
              className={`col-6 toppic-header ${activeTopic === `Mint` ? `active` : ``}`}
              onClick={() => setActiveTopic('Mint')}
            >
              Mint
            </div>
            <div className={`col-6 toppic-header`} onClick={() => setActiveTopic('Redeem')}>
              Redeem
            </div>
          </div>
          {activeTopic === `Mint` ? <Mint /> : ``}
        </MintBody>
      ) : activeTopic === 'Redeem' ? (
        <>
          <div className="">
            <div className="text-right">
              <input
                type="checkbox"
                id="hideSmallAssetBtn"
                name="hideSmallAssetBtn"
                value="hideSmallAssetBtn"
                // onClick={() => setHideSmallAsset(!hideSmallAsset)}
                onClick={() => hideSmallAssetButtonClicked()}
                defaultChecked={hideSmallAsset}
                className="mr-2"
              />
              <label htmlFor="hideSmallAssetBtn" className={isDark ? `text-light` : `text-dark`}>
                {' '}
                Hide Small Assets
              </label>
            </div>
          </div>
          <RedeemWrapper>
            <div className="row text-center mint-page-header-wrapper">
              <div className={`col-6 toppic-header`} onClick={() => setActiveTopic('Mint')}>
                Mint
              </div>
              <div
                className={`col-6 toppic-header ${activeTopic === `Redeem` ? `active` : ``}`}
                onClick={() => setActiveTopic('Redeem')}
              >
                Redeem
              </div>
            </div>
            {activeTopic === `Redeem` ? <Redeem hideSmallAsset={hideSmallAsset} /> : ``}
          </RedeemWrapper>
        </>
      ) : (
        ``
      )}
    </>
  )
}
