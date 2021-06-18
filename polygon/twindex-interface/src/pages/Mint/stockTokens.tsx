export const emptyStockToken = {
  chainId: 0,
  address: '',
  dlAddress: '',
  name: '',
  symbol: '',
  decimals: 0,
  logoURI: ''
}

export const DOLLY = {
  ADDRESS: `0xfF54da7CAF3BC3D34664891fC8f3c9B6DeA6c7A5`,
  DL_ADDRESS: `0xfF54da7CAF3BC3D34664891fC8f3c9B6DeA6c7A5`
}
export const TSLA = {
  ADDRESS: `0x17aCe02e5C8814BF2EE9eAAFF7902D52c15Fb0f4`,
  DL_ADDRESS: `0x066888951a12E0b7fBc20ECF273075C3b7EE3db2`
}
export const AAPL = {
  ADDRESS: `0xC10b2Ce6A2BCfdFDC8100Ba1602C1689997299D3`,
  DL_ADDRESS: `0x0fEC9c00e0f2192d040564d2387E3f6EAB39d1a3`
}
export const AMZN = {
  ADDRESS: `0x1085B90544ff5C421D528aAF79Cc65aFc920aC79`,
  DL_ADDRESS: `0xc53cBC3996030019a881F29a4163a6b618e8E8B0`
}
export const GOOGL = {
  ADDRESS: `0x9C169647471C1C6a72773CfFc50F6Ba285684803`,
  DL_ADDRESS: `0x5DAE0803ee28FE9dca874361b085d559c28d06BC`
}

export const DFI_PROTOCOL = {
  ADDRESS: `0x37f5a7D8bBB1cc0307985D00DE520fE30630790c`
}
export const PRICE_FEED = {
  ADDRESS: `0x9C169647471C1C6a72773CfFc50F6Ba285684803`
}
export const LOAN_TOKEN_LOGIC_STANDARD = {
  ADDRESS: `0x6e0C17f56d0d97f83d400A66C508307Bce6f8E38`
}

// export const _ADDRESS = ``

export const dollyToken = {
  chainId: 56,
  address: `${DOLLY.ADDRESS}`,
  name: 'DOLLY',
  symbol: 'DOLLY',
  decimals: 18,
  logoURI:
    'https://raw.githubusercontent.com/chawanvtp/Dopple/main/assets/tokens/0xA977b72BB3063D2e013C28aC048b87160f55efFB.png'
}

export const stockTokens = [
  {
    chainId: 56,
    address: TSLA.ADDRESS,
    dlAddress: TSLA.DL_ADDRESS,
    name: 'TSLA',
    symbol: 'TSLA',
    decimals: 18,
    logoURI:
      'https://raw.githubusercontent.com/chawanvtp/Dopple/main/assets/tokens/0x17aCe02e5C8814BF2EE9eAAFF7902D52c15Fb0f4.svg'
  },
  {
    chainId: 56,
    address: AAPL.ADDRESS,
    dlAddress: AAPL.DL_ADDRESS,
    name: 'AAPL',
    symbol: 'AAPL',
    decimals: 18,
    logoURI:
      'https://raw.githubusercontent.com/chawanvtp/Dopple/main/assets/tokens/0xC10b2Ce6A2BCfdFDC8100Ba1602C1689997299D3.svg'
  },
  {
    chainId: 56,
    address: AMZN.ADDRESS,
    dlAddress: AMZN.DL_ADDRESS,
    name: 'AMZN',
    symbol: 'AMZN',
    decimals: 18,
    logoURI:
      'https://raw.githubusercontent.com/chawanvtp/Dopple/main/assets/tokens/0x1085B90544ff5C421D528aAF79Cc65aFc920aC79.svg'
  },
  {
    chainId: 56,
    address: GOOGL.ADDRESS,
    dlAddress: GOOGL.DL_ADDRESS,
    name: 'GOOGL',
    symbol: 'GOOGL',
    decimals: 18,
    logoURI:
      'https://raw.githubusercontent.com/chawanvtp/Dopple/main/assets/tokens/0x9C169647471C1C6a72773CfFc50F6Ba285684803.svg'
  }
]
