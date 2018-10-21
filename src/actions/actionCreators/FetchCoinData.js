import axios from 'axios';

import {
  apiMultipleCurrencyBaseUrl, apiMulitpleResponseUrl,
} from '../../constants/Api';

import * as types from '../actionTypes/FetchCoinDataTypes';

/**
 * Pass in Array of symbol and amount of tokens
 * @param {} symbol
 */
export function fetchCoinData(tokensString) {
  return (dispatch) => {
    dispatch({ type: types.FETCHING_COIN_DATA });
    return axios.get(`${apiMultipleCurrencyBaseUrl}${tokensString}${apiMulitpleResponseUrl}`)
      .then((res) => {
        dispatch({ type: types.FETCHING_COIN_DATA_SUCCESS, payload: res.data });
      })
      .catch((err) => {
        dispatch({ type: types.FETCHING_COIN_DATA_FAIL, payload: err.data });
      });
  };
}

export function setWalletTokenBalances(usersTokensWithBalances) {
  return (dispatch) => {
    dispatch({ type: types.SET_WALLET_TOKENS_BALANCES, payload: usersTokensWithBalances });
  };
}

/**
 * Loop through the amount of tokens the user has
 * Loop through all the conversions
 * Create a total balance object that has all 5 currencies
 * @param {} tokenBalances
 * @param {*} tokenConversionMatrix
 */
export function calculateWalletBalance(tokenBalances, tokenConversionMatrix) {
  return (dispatch) => {
    const tokenKeys = Object.keys(tokenConversionMatrix);
    let walletBalanceObject = {
      USD: 0,
      CAD: 0,
      EUR: 0,
      BTC: 0,
      ETH: 0,
    };
    let individualTokens = [];
    for (let i = 0; i < tokenBalances.length; i++) {
      const currentTokenKey = tokenKeys[i];
      let tokenPriceObject = {
        USD: 0,
        CAD: 0,
        EUR: 0,
        BTC: 0,
        ETH: 0,
      };
      walletBalanceObject.USD += tokenBalances[i].amount * tokenConversionMatrix[currentTokenKey].USD;
      walletBalanceObject.CAD += tokenBalances[i].amount * tokenConversionMatrix[currentTokenKey].CAD;
      walletBalanceObject.EUR += tokenBalances[i].amount * tokenConversionMatrix[currentTokenKey].EUR;
      walletBalanceObject.BTC += tokenBalances[i].amount * tokenConversionMatrix[currentTokenKey].BTC;
      walletBalanceObject.ETH += tokenBalances[i].amount * tokenConversionMatrix[currentTokenKey].ETH;
      tokenPriceObject.USD = tokenBalances[i].amount * tokenConversionMatrix[currentTokenKey].USD;
      tokenPriceObject.CAD = tokenBalances[i].amount * tokenConversionMatrix[currentTokenKey].CAD;
      tokenPriceObject.EUR = tokenBalances[i].amount * tokenConversionMatrix[currentTokenKey].EUR;
      tokenPriceObject.BTC = tokenBalances[i].amount * tokenConversionMatrix[currentTokenKey].BTC;
      tokenPriceObject.ETH = tokenBalances[i].amount * tokenConversionMatrix[currentTokenKey].ETH;
      individualTokens.push(tokenPriceObject);
    }
    dispatch({ type: types.CALCULATE_WALLET_BALANCE, payload: { walletBalanceObject, individualTokens } });
  };
}
