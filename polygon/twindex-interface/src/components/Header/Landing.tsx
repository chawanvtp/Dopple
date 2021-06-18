import React, { useState } from 'react'
// import { Text } from 'rebass'
import { NavLink } from 'react-router-dom'
import { darken } from 'polished'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import Logo from '../../assets/svg/logo-navbar.svg'
import LogoDark from '../../assets/svg/logo-navbar-dark.svg'
// import { useActiveWeb3React } from '../../hooks'
import { useDarkModeManager } from '../../state/user/hooks'
// import { useETHBalances } from '../../state/wallet/hooks'
import { ExternalLink } from '../../theme'
import Settings from '../Settings'
// import Menu from '../Menu'
import Row, { RowFixed } from '../Row'
// import Web3Status from '../Web3Status'
import Modal from '../Modal'
import UniBalanceContent from './UniBalanceContent'
import APP_CONFIG from 'config'

const HeaderFrame = styled.div`
  display: grid;
  grid-template-columns: 1fr 120px;
  align-items: center;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  width: 100%;
  bottom: 0;
  position: relative;
  padding: 1rem 1rem;
  z-index: 2;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: 1fr;
    padding: 1rem 1rem;
    width: calc(100%);
    position: relative;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
        padding: 0.5rem 1rem;
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
    padding: 1rem;
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
  `};
`

const HeaderElementWrap = styled.div`
  display: flex;
  align-items: center;
`

const HeaderRow = styled(RowFixed)`
  ${({ theme }) => theme.mediaWidth.upToMedium`
   width: 100%;
   display: none;
  `};
`

const HeaderLinks = styled(Row)`
  justify-content: center;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem 0 1rem 1rem;
    justify-content: flex-end;
    margin-left: 1rem;
`};
`

// const AccountElement = styled.div<{ active: boolean }>`
//   display: flex;
//   flex-direction: row;
//   align-items: center;
//   /* background-color: ${({ theme, active }) => (!active ? theme.bg1 : theme.bg3)}; */
//   border-radius: 12px;
//   white-space: nowrap;
//   width: 100%;
//   cursor: pointer;

//   :focus {
//     border: 1px solid blue;
//   }
//   ${({ theme }) => theme.mediaWidth.upToSmall`
//     width: 48%;
//   `};
//   background-color: ${({ theme }) => theme.primary5};
//   color: ${({ theme }) => theme.primary1};
//   &:focus {
//     box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.05, theme.primary1)};
//     background-color: ${({ theme }) => darken(0.05, theme.primary1)};
//   }
//   &:active {
//     box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.1, theme.primary1)};
//     background-color: ${({ theme }) => darken(0.1, theme.primary1)};
//   }
//   &:disabled {
//     background-color: ${({ theme }) => theme.primary1};
//     color: ${({ theme }) => 'white'};
//     cursor: auto;
//     box-shadow: none;
//     border: 1px solid transparent;
//     outline: none;
//   }
// `

// const BalanceText = styled(Text)`
//   color: white;
//   &:focus {
//     box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.05, theme.primary1)};
//     background-color: ${({ theme }) => darken(0.05, theme.primary1)};
//   }
//   /* &:hover {
//     background-color: ${({ theme }) => darken(0.05, theme.primary1)};
//   } */
//   &:active {
//     box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.1, theme.primary1)};
//     background-color: ${({ theme }) => darken(0.1, theme.primary1)};
//   }
//   &:disabled {
//     background-color: ${({ theme }) => theme.primary1};
//     color: ${({ theme }) => theme.text3};
//     cursor: auto;
//     box-shadow: none;
//     border: 1px solid transparent;
//     outline: none;
//   }
//   ${({ theme }) => theme.mediaWidth.upToExtraSmall`
//     display: none;
//   `};
// `

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
  margin: 0 12px;
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
`

const StyledExternalLink = styled(ExternalLink).attrs({
  activeClassName
})<{ isActive?: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text2};
  font-size: 1rem;
  width: fit-content;
  margin: 0 12px;
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
`}
`

export default function HeaderLanding() {
  // const { account } = useActiveWeb3React()
  const { t } = useTranslation()

  // const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const [isDark] = useDarkModeManager()

  const [showUniBalanceModal, setShowUniBalanceModal] = useState(false)

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
      </HeaderRow>

      <HeaderControls>
        <HeaderElement>
          <HeaderLinks className={APP_CONFIG.MAINTAINANCE ? `d-none` : ``}>
            {APP_CONFIG.MINT ? (
              <StyledNavLink id={`swap-nav-link`} to={'/mint'}>
                {t('Mint')}
              </StyledNavLink>
            ) : (
              ``
            )}
            {APP_CONFIG.SWAP ? (
              <StyledNavLink id={`swap-nav-link`} to={'/swap'}>
                {t('swap')}
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
                {t('pool')}
              </StyledNavLink>
            ) : (
              ``
            )}
            <StyledExternalLink id={`stake-nav-link`} href={'https://dopple.finance/Stake'}>
              {t('Farm')}
            </StyledExternalLink>
            <StyledExternalLink id={`stake-nav-link`} href={'https://dopple.finance/Stake'}>
              {'Trade'}
            </StyledExternalLink>

            <div style={{ marginRight: `1.25rem` }} />
          </HeaderLinks>
        </HeaderElement>
        <HeaderElementWrap>
          <Settings />
          {/* <Menu /> */}
        </HeaderElementWrap>
      </HeaderControls>
    </HeaderFrame>
  )
}
