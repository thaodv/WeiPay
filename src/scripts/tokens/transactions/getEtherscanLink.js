const getEtherscanLink = (network, hash) => {
  console.log({ network, hash });
  let url;
  switch (network) {
    case 'mainnet':
      url = `https://etherscan.io/tx/${hash}`;
      break;
    case 'ropsten':
      url = `https://ropsten.etherscan.io/tx/${hash}`;
      break;
    case 'rinkeby':
      url = `https://rinkeby.etherscan.io/tx/${hash}`;
      break;
    case 'kovan':
      url = `https://kovan.etherscan.io/tx/${hash}`;
      break;
    default:
      console.log('else');
  }
  console.log({ url });
  return url;
};

export default getEtherscanLink;