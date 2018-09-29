import {
  SET_ACTIVE_CONTACT_TAB,
  UPDATE_WALLET_CONTACTS,
  SET_TEMP_CONTACT_NAME,
  INITIALIZE_WALLET_CONTACTS,
  SET_CONTACT_ETHEREUM_ADDRESS,
  INITIALIZE_CONTACT_TOKENS,
} from '../actionTypes/ContactTypes';

import {
  SET_TEMPORARY_QR_ADDRESS,
} from '../actionTypes/AppConfigTypes';

export function setContactTabState(tabText) {
    return (dispatch) => {
      dispatch({ type:   SET_ACTIVE_CONTACT_TAB, payload: tabText });
    };
  }

  export function setContactTempName(name) {
    return (dispatch) => {
      dispatch({ type: SET_TEMP_CONTACT_NAME, payload: name });
    };
  }

  export function setContactEthereumAddress(address) {
    return (dispatch) => {
      dispatch({ type: SET_CONTACT_ETHEREUM_ADDRESS, payload: address });
    };
  }