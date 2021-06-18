export function getHideSmallRedeemAssets() {
  const isHideSmallRedeemAssets = localStorage.getItem('hideSmallRedeemAssets')
    ? localStorage.getItem('hideSmallRedeemAssets') === 'true'
    : false
  return isHideSmallRedeemAssets
}

export function setHideSmallRedeemAssets() {
  localStorage.setItem('hideSmallRedeemAssets', `${!getHideSmallRedeemAssets()}`)
}
