import {
  FETCHING_COIN_DATA,
  FETCHING_COIN_DATA_SUCCESS,
  FETCHING_COIN_DATA_FAIL,
  FETCHING_ETH_PRICE_DATA,
  FETCHING_ETH_PRICE_DATA_SUCCESS,
  FETCHING_ETH_PRICE_DATA_FAIL,
  SET_WALLET_TOKENS_BALANCES,
  CALCULATE_WALLET_BALANCE,
} from '../../actions/actionTypes/FetchCoinDataTypes';

import {
  INITIALIZE_APP_TOKEN_SETUP,
  TEMP_WALLET_NAME,
  INITIALIZE_NEW_APP_WALLET,
  PACKAGE_TOKEN_DETAILS_FOR_TRANSACTION,
} from '../../actions/actionTypes/AppConfigTypes';

import {
  SET_ACTIVE_CONTACT_TAB,
  SET_TEMP_CONTACT_NAME,
  SET_CONTACT_ETHEREUM_ADDRESS,
  UPDATE_WALLET_CONTACTS,
  INITIALIZE_WALLET_CONTACTS,
  RESET_TEMP_CONTACT_STATE,
  SELECTED_CONTACT,
} from '../../actions/actionTypes/ContactTypes';


import tokenData from '../../constants/data/json/tokens.json';

const initialState = {
  wallets: [],
  tempWalletName: null,
  tokens: [],
  lookUpTokenList: tokenData,
  walletBalance: {},
  tokenBalances: {},
  walletTokens: [],
  isFetching: null,
  hasError: false,
  errorMessage: null,
  currencyOptions: ['USD', 'CAD', 'EUR', 'BTC', 'ETH'],
  apiTokenString: '',
  tokenConversions: [],
  contacts: [],
  tempContactName: null,
  tempContactTokens: [],
  tempContactAddress: null,
  selectedContactTab: 'contacts',
  selectedContact: null,
  tokenInfoForTransaction: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case INITIALIZE_APP_TOKEN_SETUP:
      return {
        ...state, tokens: action.payload,
      };
    case TEMP_WALLET_NAME:
      return {
        ...state, tempWalletName: action.payload,
      };
    case INITIALIZE_NEW_APP_WALLET:
      return {
        ...state, wallets: action.payload,
      };
    case FETCHING_COIN_DATA:
      return {
        ...state, isFetching: true, hasError: false, errorMessage: null,
      };
    case FETCHING_COIN_DATA_SUCCESS:
      return {
        ...state, isFetching: false, hasError: false, errorMessage: null, tokenConversions: action.payload,
      };
    case FETCHING_COIN_DATA_FAIL:
      return {
        ...state, isFetching: false, hasError: true, errorMessage: action.err,
      };
    case FETCHING_ETH_PRICE_DATA:
      return {
        ...state, isFetching: true, data: null, hasError: false, errorMessage: null,
      };
    case FETCHING_ETH_PRICE_DATA_SUCCESS:
      return {
        ...state, intialRelativeEthConversions: action.payload,
      };
    case FETCHING_ETH_PRICE_DATA_FAIL:
      return {
        ...state, isFetching: false, hasError: true, errorMessage: action.err,
      };
    case SET_WALLET_TOKENS_BALANCES:
      return {
        ...state, walletTokens: action.payload,
      };
    case CALCULATE_WALLET_BALANCE:
      const { walletBalanceObject, individualTokens } = action.payload;
      return {
        ...state, walletBalance: walletBalanceObject, tokenBalances: individualTokens,
      };
    case SET_ACTIVE_CONTACT_TAB:
      return {
        ...state, selectedContactTab: action.payload,
      };
    case SET_TEMP_CONTACT_NAME:
      return {
        ...state, tempContactName: action.payload,
      };
    case SET_CONTACT_ETHEREUM_ADDRESS:
      return {
        ...state, tempContactAddress: action.payload,
      };
    case UPDATE_WALLET_CONTACTS:
      return {
        ...state, tempContactTokens: action.payload,
      };
    case INITIALIZE_WALLET_CONTACTS:
      return {
        ...state, contacts: action.payload,
      };
    case RESET_TEMP_CONTACT_STATE:
      return {
        ...state, tempContactName: null, tempContactTokens: [], tempContactAddress: null,
      };
    case SELECTED_CONTACT:
      return {
        ...state, selectedContact: action.payload,
      };
    case PACKAGE_TOKEN_DETAILS_FOR_TRANSACTION:
      return {
        ...state, tokenInfoForTransaction: action.payload,
      }
    default:
      return state;
  }
}
