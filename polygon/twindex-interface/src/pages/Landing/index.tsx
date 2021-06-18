/* eslint-disable @typescript-eslint/no-use-before-define */
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import APP_CONFIG from 'config'
import React, { useState } from 'react'
import { useDarkModeManager } from 'state/user/hooks'
import Banner from '../../assets/svg/banner.svg'
import DarkBanner from '../../assets/svg/dark-banner.svg'
// import Logo from '../../assets/svg/landing-logo.svg'
import DoppleLogo from '../../assets/svg/twindex-dop-light.svg'
import DoppleLogoDark from '../../assets/svg/twindex-dop-dark.svg'
import './style.css'
import FooterLanding from 'components/Footer/Landing'

const landingPageBodyMessage = `Twindex enables trading of synthetic assets pegged to real-world 
prices in the most accessible way on the Polygon Smart Chain.`
const landingPageBodyMessage2 = ``

function redirectTo(path: string) {
  return (window.location.href = `/#/${path}`)
}

export default function Landing() {
  const [isDark] = useDarkModeManager()
  const [isTrigger, setTrigger] = useState(false)

  return (
    <>
      <div className={`container w-100 mb-4`} style={{ height: `45rem` }}>
        <div className="row">
          <div className={`col-md-6 col-sm-12 px-4 pt-5 ${isDark ? `text-white` : `text-black`}`}>
            <div className="d-flex item-center">
              {/* <img src={Logo} alt="logo" style={{ marginRight: `1.5rem` }} />
              <div style={{ padding: `3rem 0` }}>
                <div style={{ width: `1px`, backgroundColor: `rgb(135,142,154)`, padding: `1rem 0`, height: `60px` }} />
              </div> */}
              <img src={isDark ? DoppleLogoDark : DoppleLogo} alt="logo" className="mb-3 mt-5" />
            </div>

            <h1 className="mt-3 mb-2">Synthetic Assets Trading</h1>
            <div className="d-inline mb-2" style={{ color: `#9ca3af`, marginLeft: '0.15rem' }}>
              On the Polygon Smart Chain
            </div>
            {/* <h6 className="d-inline ml-2">ASSET TOKENIZATION TWINDEX</h6> */}

            <p style={{ fontSize: `1rem` }} className="mt-4">
              {landingPageBodyMessage}
            </p>
            <p style={{ fontSize: `1rem` }} className="mt-3">
              {landingPageBodyMessage2}
            </p>
            <button
              type="button"
              className="launch-app-button mt-2 w-100"
              onClick={() => (APP_CONFIG.MAINTAINANCE ? setTrigger(!isTrigger) : redirectTo('redirect'))}
            >
              {isTrigger ? (
                `Under Maintainance   : (`
              ) : (
                <>
                  Launch App
                  <FontAwesomeIcon icon={faArrowRight} style={{ marginLeft: `1rem`, paddingTop: `0.1rem` }} />
                </>
              )}
            </button>
          </div>

          <div className="col-md-6 col-sm-12 d-none d-md-block" style={{ paddingLeft: `7rem` }}>
            <img src={isDark ? DarkBanner : Banner} alt="logo" style={{ marginTop: `10%` }} />
          </div>
        </div>
      </div>
      <FooterLanding />
    </>
  )
}
