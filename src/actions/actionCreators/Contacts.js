import {
  RESET_TEMP_CONTACT_STATE,
  SET_ACTIVE_CONTACT_TAB,
  UPDATE_WALLET_CONTACTS,
  SET_TEMP_CONTACT_NAME,
  INITIALIZE_WALLET_CONTACTS,
  SET_CONTACT_ETHEREUM_ADDRESS,
} from '../actionTypes/ContactTypes';

import {
  SET_TEMPORARY_QR_ADDRESS,
} from '../actionTypes/AppConfigTypes';

export function resetTempContactState() {
    return (dispatch) => {
      dispatch({ type: RESET_TEMP_CONTACT_STATE, payload: '' });
    };
  }

export function setContactTabState(tabText) {
    return (dispatch) => {
      dispatch({ type: SET_ACTIVE_CONTACT_TAB, payload: tabText });
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

  export function updateTempWalletContacts(oldContacts) {
    return (dispatch) => {
      dispatch({ type: UPDATE_WALLET_CONTACTS, payload: oldContacts });
    }
  }

  export function saveWalletContacts(updatedContacts) {
    return (dispatch) => {
      dispatch({ type: INITIALIZE_WALLET_CONTACTS, payload: updatedContacts });
    }
  }
