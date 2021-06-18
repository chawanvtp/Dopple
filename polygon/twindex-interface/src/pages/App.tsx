import React from 'react'
// import HeaderLanding from 'components/Header/Landing'
import { Suspense } from 'react'
import { Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import GoogleAnalyticsReporter from '../components/analytics/GoogleAnalyticsReporter'

import Header from '../components/Header'
import Polling from '../components/Header/Polling'
import URLWarning from '../components/Header/URLWarning'
import Popups from '../components/Popups'
import Web3ReactManager from '../components/Web3ReactManager'

import DarkModeQueryParamReader from '../theme/DarkModeQueryParamReader'
import AddLiquidity from './AddLiquidity'
import {
  RedirectDuplicateTokenIds,
  RedirectOldAddLiquidityPathStructure,
  RedirectToAddLiquidity
} from './AddLiquidity/redirects'
import Landing from './Landing'
import MintPage from './Mint'
import FarmPage from './Farm'
import InfoPage from './Info'

import Pool from './Pool'
import PoolFinder from './PoolFinder'
import RemoveLiquidity from './RemoveLiquidity'
import { RedirectOldRemoveLiquidityPathStructure } from './RemoveLiquidity/redirects'
import Swap from './Swap'
import { OpenClaimAddressModalAndRedirectToSwap, RedirectPathToSwapOnly, RedirectToSwap } from './Swap/redirects'
import 'bootstrap/dist/css/bootstrap.min.css'
import APP_CONFIG from 'config'
// import APP_CONFIG from 'config'
// import FooterLanding from 'components/Footer/Landing'
// import APP_CONFIG from 'config'

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  /* overflow-x: hidden; */
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
      height: auto;
  `}
`

// const HeaderWrapper = styled.div`
//   ${({ theme }) => theme.flexRowNoWrap}
//   width: 100%;
//   justify-content: space-between;
// `

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  flex: 1;
  overflow-y: hidden;
  overflow-x: hidden;
  z-index: 10;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 4px;
    padding-top: 0rem;
  `};

  z-index: 1;
`

const Marginer = styled.div`
  margin-top: 5rem;
`

export default function App() {
  // const [headerPosition, setHeaderPosition] = useState('left')
  // const location = useLocation()
  // const history = useHistory()
  // useEffect(() => {
  //   if (location.pathname === '/') {
  //     setHeaderPosition('left')
  //   } else {
  //     if (APP_CONFIG.MAINTAINANCE) {
  //       history.push('/')
  //     }
  //     setHeaderPosition('right')
  //   }
  // }, [location, history])
  return (
    <Suspense fallback={null}>
      <Route component={GoogleAnalyticsReporter} />
      <Route component={DarkModeQueryParamReader} />
      <AppWrapper>
        <URLWarning />
        {/* <HeaderWrapper>{headerPosition === 'right' ? <Header /> : <HeaderLanding />}</HeaderWrapper> */}
        {APP_CONFIG.MAINTAINANCE ? `` : <Header />}
        <BodyWrapper>
          <Popups />
          <Polling />
          <Web3ReactManager>
            <Switch>
              <Route exact strict path="/" component={Landing} />

              {/* {!APP_CONFIG.MAINTAINANCE ? ( */}
              {/* <> */}
              {APP_CONFIG.MINT ? <Route exact strict path="/mint" component={MintPage} /> : ``}
              <Route exact strict path="/swap" component={Swap} />
              <Route exact strict path="/info" component={InfoPage} />
              <Route exact strict path="/farm" component={FarmPage} />
              <Route exact strict path="/claim" component={OpenClaimAddressModalAndRedirectToSwap} />
              <Route exact strict path="/swap/:outputCurrency" component={RedirectToSwap} />
              <Route exact strict path="/send" component={RedirectPathToSwapOnly} />
              <Route exact strict path="/find" component={PoolFinder} />
              <Route exact strict path="/pool" component={Pool} />
              <Route exact strict path="/create" component={RedirectToAddLiquidity} />
              <Route exact path="/add" component={AddLiquidity} />
              <Route exact path="/add/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
              <Route exact path="/add/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
              <Route exact path="/create" component={AddLiquidity} />
              <Route exact path="/create/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
              <Route exact path="/create/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
              <Route exact strict path="/remove/:tokens" component={RedirectOldRemoveLiquidityPathStructure} />
              <Route exact strict path="/remove/:currencyIdA/:currencyIdB" component={RemoveLiquidity} />
              <Route component={RedirectPathToSwapOnly} />
              {/* </> */}
              {/* ) : (
                ``
              )} */}

              {/* <Route exact strict path="/pony/:currencyIdA/:currencyIdB" component={Manage} /> */}
              {/* <Route exact strict path="/vote/:id" component={VotePage} /> */}
              {/* <Route exact strict path="/pony" component={Earn} /> */}
              {/* <Route exact strict path="/vote" component={Vote} /> */}
            </Switch>
          </Web3ReactManager>
          <Marginer />
          {/* <HeaderWrapper>{window.location.hash === '#/' ? <FooterLanding /> : ``}</HeaderWrapper> */}
        </BodyWrapper>
      </AppWrapper>
    </Suspense>
  )
}
