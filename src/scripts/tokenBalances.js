import provider from '../constants/Providers';
import ERC20ABI from '../constants/data/json/ERC20ABI.json';

const ethers = require('ethers');
let wallet;

/**
 * processAllTokenBalances takes a privateKey and a dataset, it will loop through the tokens in the wallet 
 * and based on whether it is an erc20 token or ether, it will delegate the call to look up its balance 
 * to the respective function. An array called allBalances will hold the token symbol and the amount of 
 * tokens the user has.
 * 
 * A second variable is being generated - tokenSymbolString. This is a string of all the symbol the user 
 * holds delimtied with a  ',' unless it is the last token being added. This is used to query the api and 
 * pass in all token for a single request.
 */
const processAllTokenBalances = async (privateKey, dataSet) => {
  let allBalances = [];
  let tokenApiRequestString = '';
  wallet = new ethers.Wallet(privateKey);
  wallet.provider = provider;
  for (let i = 0; i < dataSet.length; i++) {
    let tokenObj = {};
    tokenObj.symbol = dataSet[i].symbol;
    if (dataSet[i].contractAddress === '') {
      await this.getEthereumBalance(wallet.address)
        .then((response) => {
          tokenObj.amount = response;
          allBalances.push(tokenObj);
          tokenApiRequestString += `${dataSet[i].symbol}`;  
          if (i < dataSet.length - 1) tokenApiRequestString += ',';
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      let contractAddress = dataSet[i].contractAddress;
      await this.getERC20Balance(contractAddress)
        .then((response) => {
          tokenObj.amount = response;
          allBalances.push(tokenObj);
          tokenApiRequestString += `${dataSet[i].symbol}`;  
          if (i < dataSet.length - 1) tokenApiRequestString += ','; 
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
  return { 'tokenSymbolString' : tokenApiRequestString, 'tokenBalances' : allBalances };
};

getEthereumBalance = async () => {
  const balance = await provider.getBalance(wallet.address);
  const parsedEtherBalance = String(ethers.utils.formatEther(balance));
  return parsedEtherBalance;
};

getERC20Balance = async (contractAdd) => {
  const contract = new ethers.Contract(contractAdd, ERC20ABI, provider);
  const tokenBalance = await contract.balanceOf(wallet.address);
  const parsedTokenBalance = String(tokenBalance);
  return parsedTokenBalance;
};

export default processAllTokenBalances;
