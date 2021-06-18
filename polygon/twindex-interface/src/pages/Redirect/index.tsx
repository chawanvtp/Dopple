/* eslint-disable @typescript-eslint/no-use-before-define */
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import APP_CONFIG from 'config'
import React, { useState } from 'react'
import { useDarkModeManager } from 'state/user/hooks'
import Banner from '../../assets/svg/banner.svg'
import DarkBanner from '../../assets/svg/dark-banner.svg'
import Logo from '../../assets/svg/landing-logo.svg'
import './style.css'

const landingPageBodyMessage = `lets you trade real-world assets and derivatives, 
like stocks and commodities, directly on the Polygon Smart Chain. 
Securely transpose any digitally verifiable asset onto the blockchain.`

function redirectTo(path: string) {
  return (window.location.href = `/#/${path}`)
}

export default function Landing() {
  const [isDark] = useDarkModeManager()
  const [isTrigger, setTrigger] = useState(false)

  return (
    <>
      {landingPageOverlay(isTrigger, setTrigger)}
      <div className={`container w-100`}>
        <div className="row">
          <div className={`col-md-6 col-sm-12 pr-4 ${isDark ? `text-white` : `text-black`}`}>
            <img src={Logo} alt="logo" style={{ marginLeft: `-2rem` }} />

            <h1 className="mt-0 mb-4">REDIRECT</h1>
            <h4 className="d-inline">NEXT GENERATION</h4>
            <h6 className="d-inline ml-2">ASSET TOKENIZATION TWINDEX</h6>

            <p style={{ fontSize: `1.5rem` }} className="mt-3">
              {landingPageBodyMessage}
            </p>
            <button
              type="button"
              className="launch-app-button mt-4 w-100"
              onClick={() => (APP_CONFIG.MAINTAINANCE ? setTrigger(!isTrigger) : redirectTo('mint'))}
            >
              {isTrigger ? (
                `Coming Soon`
              ) : (
                <>
                  Launch App
                  <FontAwesomeIcon icon={faArrowRight} style={{ marginLeft: `1rem`, paddingTop: `0.1rem` }} />
                </>
              )}
            </button>
          </div>

          <div className="col-md-6 col-sm-12 d-none d-sm-block" style={{ paddingLeft: `7rem` }}>
            <img src={isDark ? DarkBanner : Banner} alt="logo" />
          </div>
        </div>
      </div>
    </>
  )
}

const landingPageOverlay = (isTrigger: boolean, onClickFunc: Function) => {
  return isTrigger ? <div className="landing-Overlay" onClick={() => onClickFunc(false)}></div> : ``
}
