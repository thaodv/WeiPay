const ethers = require('ethers');

const executeEtherTransaction = async (provider, to, privateKey, value) => {
  const initializedWallet = new ethers.Wallet(privateKey, provider);
  console.log({ initializedWallet });
  const amountString = value.toString();
  const amount = ethers.utils.parseEther(amountString);
  const sendPromise = initializedWallet.send(to, amount);
  return sendPromise.then((transactionHash) => {
    console.log(transactionHash);
    return transactionHash;
  });
};

export default executeEtherTransaction;
