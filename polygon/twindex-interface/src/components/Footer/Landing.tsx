import React from 'react'
import { useDarkModeManager } from 'state/user/hooks'
import bscLogo from '../../assets/svg/bsc-icon.svg'
// import telegramLogo from '../../assets/svg/telegram-icon.svg'
// import telegramDarkLogo from '../../assets/svg/telegram-dark-icon.svg'
import twitterLogo from '../../assets/svg/twitter-icon.svg'

export default function FooterLanding() {
  const [isDark] = useDarkModeManager()
  return (
    <>
      <div
        className={`d-none d-md-flex justify-content-between w-100 container p-0 pb-4`}
        style={{ position: `fixed`, bottom: 0 }}
      >
        <div className="d-flex align-items-center">
          <img src={bscLogo} alt="bscLogo" style={{ height: `2rem`, width: `auto` }} />
          <div
            className={`sm:text-base text-sm ml-2 ${isDark ? `text-white` : `text-black`}`}
            style={{ fontWeight: 500 }}
          >
            Polygon Smart Chain
          </div>
        </div>
        <div className="d-flex align-items-center justify-content-between">
          {/* <div className="d-flex align-items-center">
            <img
              src={isDark ? telegramDarkLogo : telegramLogo}
              alt="telegramLogo"
              style={{ height: `23px`, width: `auto` }}
            />
            <div className={`sm-text-base text-sm font-weight-bold ml-2 ${isDark ? `text-white` : `text-black`}`}>
              Contract
            </div>
          </div> */}
          <div
            className="d-flex align-items-center ml-5"
            style={{ cursor: `pointer` }}
            onClick={() => (window.location.href = `http://twitter.com/twindexcom`)}
          >
            <img src={twitterLogo} alt="twitterLogo" style={{ height: `20px`, width: `auto` }} />
            <div className={`sm-text-base text-sm font-weight-bold ml-2 ${isDark ? `text-white` : `text-black`}`}>
              Twitter
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
