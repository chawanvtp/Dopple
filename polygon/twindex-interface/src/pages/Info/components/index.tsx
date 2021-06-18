

import React from 'react'
import '../info.css'
import { useDarkModeManager } from 'state/user/hooks'
import { SecondaryInfoCardProps, ToggleInfoProps, TWIN_API_DATA } from '../types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faCopy, faExternalLinkAlt, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { makeStyles, Theme } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import { ORACLE_CONTRACTS, TOKEN_CONTRACTS, OTHER_CONTRACTS } from '../constants'
import { CopyToClipboard } from 'react-copy-to-clipboard'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

export const SecondaryInfoCard = (props: SecondaryInfoCardProps) => {
  const apiData = props.api_data
  const [isDark] = useDarkModeManager()
  return apiData ? (<>
    <div className="col-12 col-md-4">
      <div className={`secondary-info-card ${isDark ? 'dark' : 'light'}`}>
        <div className="header col-12 mb-2 text-center text-truncate">
          {props.header}
        </div>
        <div className="col-12 body text-truncate">
          {props.body}
        </div>
      </div>
    </div>
  </>)
    : (<></>)
}

export const TvlCard = (props: TWIN_API_DATA) => {
  const [isDark] = useDarkModeManager()
  return props ? (<>
    <div className="col-12 mb-3">
      <div className={`tvl-card ${isDark ? 'dark' : 'light'}`}>
        <div className="header col-12 mb-2 text-center text-truncate">
          {`Total Value Locked`} <FontAwesomeIcon style={{ fontSize: `14px` }} icon={faInfoCircle} />
        </div>
        <div className="col-12 body text-truncate">
          {`$` + numberWithCommas(props?.sum_tvl.toFixed(0))}
        </div>
      </div>
    </div>
  </>)
    : (<></>)
}

export const TokenInfoElement = () => {
  return (<>
    {TOKEN_CONTRACTS.map(token => (
      <div className="container token-info-element pt-3 pb-3">
        {/* <div className="col-12"> */}
        <div className="">
          <div className="d-inline mr-3 name">{token.name}</div><img src={token.image_url} alt={token.image_url} />
        </div>
        <div className="mt-2">
          <div className="address d-inline text-truncate" id={`${token.address}`}>
            <CopyToClipboard text={token.address}
              onCopy={e => console.info(e)}>
              <span className="copy-to-clipboard">{token.address}</span>
            </CopyToClipboard>
          </div>
          <CopyToClipboard text={token.address}
              onCopy={e => console.info(e)}>
              <span className="ml-1 copy-to-clipboard"><FontAwesomeIcon icon={faCopy} /></span>
            </CopyToClipboard>

          <FontAwesomeIcon icon={faExternalLinkAlt} style={{ fontSize: `0.75rem` }} className="float-right" onClick={() => window.location.href = `https://bscscan.com/address/${token.address}`} />
        </div>
      </div>))}
  </>)
}

export const OracleInfoElement = () => {
  return (<>
    {ORACLE_CONTRACTS.map(token => (
      <div className="container token-info-element pt-3 pb-3">
        {/* <div className="col-12"> */}
        <div className="">
          <div className="d-inline mr-3 name">{token.name}</div>
        </div>
        <div className="mt-2">
          <div className="address d-inline text-truncate">{token.address}</div>
          <FontAwesomeIcon icon={faExternalLinkAlt} style={{ fontSize: `0.75rem` }} onClick={() => window.location.href = `https://bscscan.com/address/${token.address}`} />
        </div>
      </div>))}
  </>)
}

export const OtherInfoElement = () => {
  return (<>
    {OTHER_CONTRACTS.map(token => (
      <div className="container token-info-element pt-3 pb-3">
        {/* <div className="col-12"> */}
        <div className="">
          <div className="d-inline mr-3 name">{token.name}</div>
        </div>
        <div className="mt-2">
          <div className="address d-inline text-truncate">{token.address}</div>
          <FontAwesomeIcon icon={faExternalLinkAlt} style={{ fontSize: `0.75rem` }} onClick={() => window.location.href = `https://bscscan.com/address/${token.address}`} />
        </div>
      </div>))}
  </>)
}

export function ToggleInfo(props: ToggleInfoProps) {
  const classes = useStyles();
  const [isDark] = useDarkModeManager()
  return props ? (
    <div className={classes.root + ` mt-3 toggle-info`}>
      <Accordion className={isDark ? `dark` : `light`}>
        <AccordionSummary
          expandIcon={<FontAwesomeIcon icon={faChevronDown} className={isDark ? `dark` : `light`} />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          {props.header}
        </AccordionSummary>
        <AccordionDetails className="d-block">
          {props.body}
        </AccordionDetails>
      </Accordion>
    </div>
  ) : (<></>);
}

function numberWithCommas(x: any) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
