// import { ChainId, TokenAmount } from '@uniswap/sdk'
import { ChainId } from '@uniswap/sdk'

import React, { useState } from 'react'
import { Text } from 'rebass'
import { NavLink } from 'react-router-dom'
import { darken } from 'polished'
// import { useTranslation } from 'react-i18next'

import styled from 'styled-components'

import Logo from '../../assets/svg/logo-navbar.svg'
import LogoDark from '../../assets/svg/logo-navbar-dark.svg'
import { useActiveWeb3React } from '../../hooks'
import { useDarkModeManager } from '../../state/user/hooks'
// import { useETHBalances } from '../../state/wallet/hooks'
import { ExternalLink } from '../../theme'
import { YellowCard } from '../Card'
import Settings from '../Settings'
import { RowFixed } from '../Row'
import Web3Status from '../Web3Status'
import Modal from '../Modal'
import UniBalanceContent from './UniBalanceContent'
import Row from 'react-bootstrap/esm/Row'
import APP_CONFIG from 'config'
import { useEffect } from 'react'

const HeaderFrame = styled.div`
  display: grid;
  grid-template-columns: 1fr 120px;
  align-items: center;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  width: 100%;
  top: 0;
  position: relative;
  padding: 1rem 1rem;
  z-index: 2;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: 1fr;
    padding: 0.5rem 1rem;
    width: calc(100%);
    position: relative;
  `};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
        padding: 0.5rem 1rem;
  `}
  ${({ theme }) => theme.mediaWidth.upToLarge`
        padding: 1.5rem 1rem;
        padding-right: 3rem !important;
  `}
`

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: row;
    justify-content: space-between;
    justify-self: center;
    width: 100%;
    max-width: 960px;
    padding: 0.5rem;
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    z-index: 99;
    height: 72px;
    border-radius: 12px 12px 0 0;
    background-color: ${({ theme }) => theme.bg1};
  `};
`

const HeaderElement = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
   flex-direction: row-reverse;
    align-items: center;
    position: absolute;
    left: 1rem;
  `};
  ${({ theme }) => theme.mediaWidth.upToSmall`
   flex-direction: row-reverse;
    align-items: center;
    position: absolute;
    left: -3.5em;
  `};
`

const HeaderElementWrap = styled.div`
  display: flex;
  align-items: center;
`

const HeaderRow = styled(RowFixed)`
  ${({ theme }) => theme.mediaWidth.upToMedium`
   width: 100%;
  `};
`

const HeaderLinks = styled(Row)`
  justify-content: center;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem 0 1rem 0rem;
    justify-content: flex-end;
`};
`

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  /* background-color: ${({ theme, active }) => (!active ? theme.bg1 : theme.bg3)}; */
  border-radius: 12px;
  white-space: nowrap;
  width: 100%;
  cursor: pointer;
  :focus {
    border: 1px solid blue;
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
      width: 50%;
      margin-left: 0.75rem;
  `};
  background-color: ${({ theme }) => theme.primary5};
  color: ${({ theme }) => theme.primary1};
  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.05, theme.primary1)};
    background-color: ${({ theme }) => darken(0.05, theme.primary1)};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.1, theme.primary1)};
    background-color: ${({ theme }) => darken(0.1, theme.primary1)};
  }
  &:disabled {
    background-color: ${({ theme }) => theme.primary1};
    color: ${({ theme }) => 'white'};
    cursor: auto;
    box-shadow: none;
    border: 1px solid transparent;
    outline: none;
  }
`

const HideSmall = styled.span`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`

const NetworkCard = styled(YellowCard)`
  border-radius: 12px;
  padding: 8px 12px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: 0;
    margin-right: 0.5rem;
    width: initial;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-shrink: 1;
  `};
`

const BalanceText = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`

const Title = styled.a`
  display: flex;
  align-items: center;
  pointer-events: auto;
  justify-self: flex-start;
  margin-right: 12px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-self: center;
  `};
  :hover {
    cursor: pointer;
  }
`

const TwinDex = styled.div`
  transition: transform 0.3s ease;
  :hover {
    transform: rotate(-5deg);
  }
`

const activeClassName = 'ACTIVE'

const StyledNavLink = styled(NavLink).attrs({
  activeClassName
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text2};
  font-size: 1rem;
  width: fit-content;
  margin: 0 0.5rem;
  font-weight: 500;

  &.${activeClassName} {
    border-radius: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.text1};
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
      margin: 0 0.45rem;
      font-size: 0.65rem;
`}
`

const StyledExternalLink = styled(ExternalLink).attrs({
  activeClassName
}) <{ isActive?: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text2};
  font-size: 1rem;
  width: fit-content;
  margin: 0 0.5rem;
  font-weight: 500;

  &.${activeClassName} {
    border-radius: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.text1};
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
      display: block;
      margin: 0 0.45rem;
      font-size: 0.65rem;
`}
`

const NETWORK_LABELS: { [chainId in ChainId]?: string } = {
  [ChainId.RINKEBY]: 'Rinkeby',
  [ChainId.ROPSTEN]: 'Ropsten',
  [ChainId.GÖRLI]: 'Görli',
  [ChainId.KOVAN]: 'Kovan',
  [ChainId.BSC]: 'BSC',
  [ChainId.POLYGON]: 'Polygon'
}

export default function Header() {
  const { account, chainId } = useActiveWeb3React()
  // const { t } = useTranslation()
  const [apiData, setApiData] = useState<any | null>(null)
  // const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const [isDark] = useDarkModeManager()
  const [showUniBalanceModal, setShowUniBalanceModal] = useState(false)



  useEffect(() => {
    const fetchData = () => {
      return fetch('https://api.twindex.com/')
        .then(response => response.json())
        .then(data => {
          setApiData(data)
        })
    }
    fetchData()

    // Interval loop
    setInterval(fetchData, 60000)
  }, [])

  return (
    <HeaderFrame className="container">
      <Modal isOpen={showUniBalanceModal} onDismiss={() => setShowUniBalanceModal(false)}>
        <UniBalanceContent setShowUniBalanceModal={setShowUniBalanceModal} />
      </Modal>

      <HeaderRow>
        <Title href=".">
          <TwinDex>
            <img src={isDark ? LogoDark : Logo} alt="logo" />
          </TwinDex>
        </Title>
        <div className="d-none d-md-block">
          <HeaderLinks>
            <StyledNavLink
              id={`pool-nav-link`}
              to={'/pool'}
              isActive={(match, { pathname }) =>
                Boolean(match) ||
                pathname.startsWith('/add') ||
                pathname.startsWith('/remove') ||
                pathname.startsWith('/create') ||
                pathname.startsWith('/find')
              }
            ></StyledNavLink>
            {APP_CONFIG.SWAP ? (
              <StyledNavLink id={`swap-nav-link`} to={'/swap'}>
                {'Swap'}
              </StyledNavLink>
            ) : (
              ``
            )}
            {APP_CONFIG.POOL ? (
              <StyledNavLink
                id={`pool-nav-link`}
                to={'/pool'}
                isActive={(match, { pathname }) =>
                  Boolean(match) ||
                  pathname.startsWith('/add') ||
                  pathname.startsWith('/remove') ||
                  pathname.startsWith('/create') ||
                  pathname.startsWith('/find')
                }
              >
                {'Pool'}
              </StyledNavLink>
            ) : (
              ``
            )}
            {APP_CONFIG.FARM ? (
              <StyledNavLink id={`farm-nav-link`} to={'/farm'}>
                {'Farm'}
              </StyledNavLink>
            ) : (
              ``
            )}
            {APP_CONFIG.MINT ? (
              <StyledNavLink id={`swap-nav-link`} to={'/mint'}>
                {'Mint'}
              </StyledNavLink>
            ) : (
              ``
            )}
            <StyledExternalLink id={`stake-nav-link`} href={'https://swap.arken.finance/#/'}>
              {'Trade'}
            </StyledExternalLink>
            {APP_CONFIG.INFO ?
              <StyledNavLink id={`farm-nav-link`} to={'/info'}>
                {'Info'}
              </StyledNavLink>
              : (
                ``
              )
            }
          </HeaderLinks>
        </div>
      </HeaderRow>
      <HeaderControls>
        <HeaderElement>
          <HideSmall>
            {chainId && NETWORK_LABELS[chainId] && (
              <NetworkCard title={NETWORK_LABELS[chainId]}>{NETWORK_LABELS[chainId]}</NetworkCard>
            )}
          </HideSmall>

          <AccountElement active={!!account} style={{ pointerEvents: 'auto' }} className="">
            {account && apiData && apiData.twin_price ? (
              <BalanceText style={{ flexShrink: 0 }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
                {/* {userEthBalance?.toSignificant(4)}  */}
                TWIN {parseFloat(apiData.twin_price).toFixed(2)}
              </BalanceText>
            ) : null}
            {/* <div style={{ marginRight: `3rem` }}> */}
            <Web3Status />
            {/* </div> */}
          </AccountElement>
        </HeaderElement>
        <HeaderElementWrap>
          <Settings />
          <div className="d-block d-md-none" style={{ position: 'absolute', right: '2rem' }}>
            <HeaderLinks>
              <StyledNavLink
                id={`pool-nav-link`}
                to={'/pool'}
                isActive={(match, { pathname }) =>
                  Boolean(match) ||
                  pathname.startsWith('/add') ||
                  pathname.startsWith('/remove') ||
                  pathname.startsWith('/create') ||
                  pathname.startsWith('/find')
                }
              ></StyledNavLink>
              {APP_CONFIG.SWAP ? (
                <StyledNavLink id={`swap-nav-link`} to={'/swap'}>
                  {'Swap'}
                </StyledNavLink>
              ) : (
                ``
              )}
              {APP_CONFIG.POOL ? (
                <StyledNavLink
                  id={`pool-nav-link`}
                  to={'/pool'}
                  isActive={(match, { pathname }) =>
                    Boolean(match) ||
                    pathname.startsWith('/add') ||
                    pathname.startsWith('/remove') ||
                    pathname.startsWith('/create') ||
                    pathname.startsWith('/find')
                  }
                >
                  {'Pool'}
                </StyledNavLink>
              ) : (
                ``
              )}
              {APP_CONFIG.FARM ? (
                <StyledNavLink id={`farm-nav-link`} to={'/farm'}>
                  {'Farm'}
                </StyledNavLink>
              ) : (
                ``
              )}
              {APP_CONFIG.TRADE ? (
                <StyledExternalLink
                  id={`stake-nav-link`}
                  href={
                    'https://swap.arken.finance/#/tokens/0x844fa82f1e54824655470970f7004dd90546bb28_0xe9e7cea3dedca5984780bafc599bd69add087d56'
                  }
                >
                  {'Trade'}
                </StyledExternalLink>
              ) : (
                ``
              )}
              {APP_CONFIG.MINT ? (
                <StyledNavLink id={`swap-nav-link`} to={'/mint'}>
                  {'Mint'}
                </StyledNavLink>
              ) : (
                ``
              )}
              {APP_CONFIG.INFO ? (<StyledNavLink id={`farm-nav-link`} to={'/info'}>
                {'Info'}
              </StyledNavLink>
              ) : (
                ``
              )}
            </HeaderLinks>
          </div>
          {/* <Menu /> */}
        </HeaderElementWrap>
      </HeaderControls>
    </HeaderFrame>
  )
}
