import Web3 from 'web3';
import { HttpProviderOptions } from 'web3-core-helpers';

const RPC_URL = process.env.REACT_APP_NETWORK_URL || '';
const httpProvider = new Web3.providers.HttpProvider(RPC_URL, {
    timeout: 10000,
} as HttpProviderOptions);
console.log('httpProvider', httpProvider)
const web3NoAccount = new Web3(httpProvider);

const getWeb3NoAccount = () => {
    return web3NoAccount;
};

export { getWeb3NoAccount };
export default web3NoAccount;
