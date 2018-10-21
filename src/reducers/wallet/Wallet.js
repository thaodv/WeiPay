import * as appTypes from '../../actions/actionTypes/AppConfigTypes';
import * as coinTypes from '../../actions/actionTypes/FetchCoinDataTypes';

const initialState = {
  isInSetupScreens: true,
  wallets: [],
  tempWalletName: null,
  tokens: [],
  walletBalance: null,
  tokenBalances: {},
  walletTokens: [],
  isFetching: null,
  hasError: false,
  errorMessage: null,
  currencyOptions: ['USD', 'CAD', 'EUR', 'BTC', 'ETH'],
  apiTokenString: '',
  tokenConversions: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case appTypes.EXIT_SETUP_SCREEN:
      return {
        ...state, isInSetupScreens: action.payload,
      };
    case appTypes.INITIALIZE_APP_TOKEN_SETUP:
      return {
        ...state,
        tokens: action.payload,
      };
    case appTypes.TEMP_WALLET_NAME:
      return {
        ...state, tempWalletName: action.payload,
      };
    case appTypes.INITIALIZE_NEW_APP_WALLET:
      return {
        ...state, wallets: action.payload,
      };
    case coinTypes.FETCHING_COIN_DATA:
      return {
        ...state, isFetching: true, hasError: false, errorMessage: null,
      };
    case coinTypes.FETCHING_COIN_DATA_SUCCESS:
      return {
        ...state, isFetching: false, hasError: false, errorMessage: null, tokenConversions: action.payload,
      };
    case coinTypes.FETCHING_COIN_DATA_FAIL:
      return {
        ...state, isFetching: false, hasError: true, errorMessage: action.err,
      };
    case coinTypes.SET_WALLET_TOKENS_BALANCES:
      return {
        ...state, walletTokens: action.payload,
      };
    case coinTypes.CALCULATE_WALLET_BALANCE:
      const { walletBalanceObject, individualTokens } = action.payload;
      return { ...state, walletBalance: walletBalanceObject, tokenBalances: individualTokens };
    default:
      return state;
  }
}
