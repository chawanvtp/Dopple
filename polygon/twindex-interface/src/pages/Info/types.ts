export interface TWIN_API_DATA {
  dop_price: number
  lp_data: [LP_DATA]
  sum_tvl: number
  total_liquidity: number
  total_trading_volume: number
  twin_price: number
}

export interface LP_DATA {
  alloc_point: number
  apr: number
  lp_token_address: string
  tvl: number
}

export interface InfoCardProps {
  api_data: TWIN_API_DATA
}

export interface SecondaryInfoCardProps {
  api_data: TWIN_API_DATA
  header: string
  body: string
}

export interface TvlCardProps {
  api_data: TWIN_API_DATA
}

export interface ToggleInfoProps {
  api_data: TWIN_API_DATA
  header: string
  body: any
}