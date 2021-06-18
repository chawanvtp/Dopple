import { AbiItem } from 'web3-utils'
import { Interface } from '@ethersproject/abi'
import { getWeb3NoAccount } from './web3'
// import { Contract } from 'ethers';
import MULTICALL_ABI from 'constants/multicall/mkrMulticallAbi.json'
// import { MULTICALL_NETWORKS } from 'constants/multicall';
// import { useActiveWeb3React } from 'hooks';
// const { chainId } = useActiveWeb3React()

interface Call {
  address: string // Address of the contract
  name: string // Function name on the contract (example: balanceOf)
  params?: any[] // Function params
}

const mkrMulticall = async (chainId: number | undefined, abi: any[], calls: Call[]) => {
  // const MULTICALL_NETWORKS_URL = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? '0xae11C5B5f29A6a25e955F0CB8ddCc416f522AF5C' : MULTICALL_NETWORKS[`56`]
  const web3 = getWeb3NoAccount()
  const multi = new web3.eth.Contract(
    (MULTICALL_ABI as unknown) as AbiItem,
    `0x8107467C23D14ed4B6a6ED98F31fdC002ba8d512`
  )

  const itf = new Interface(abi)
  const calldata = calls.map(call => [call.address.toLowerCase(), itf.encodeFunctionData(call.name, call.params)])

  const { returnData } = await multi.methods.aggregate(calldata).call()
  const res = returnData.map((call: any, i: number) => itf.decodeFunctionResult(calls[i].name, call))
  return res
}

export default mkrMulticall
