import React, { Component } from 'react';
import {
  ListView, View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, SafeAreaView,
} from 'react-native';
import { FormInput } from 'react-native-elements';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import RNPickerSelect from 'react-native-picker-select';
import RF from 'react-native-responsive-fontsize';
import * as actions from '../../../../../actions/ActionCreator';
import LinearButton from '../../../../../components/LinearGradient/LinearButton';
import ClearButton from '../../../../../components/LinearGradient/ClearButton';
import BoxShadowCard from '../../../../../components/ShadowCards/BoxShadowCard';
import {
  setContactTempName, setContactTabState, setContactEthereumAddress, updateTempWalletContacts, saveWalletContacts,
} from '../../../../../actions/actionCreators/Contacts';
import Contact from '../../../../../scripts/classes/Contact';

class AddContact extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => { return r1 !== r2 ;} });
    //const current = this.props.currentContact;
    let contactName = this.props.tempContactName;
    let contactAddress = this.props.tempContactAddress;
    let tokens = [];
    this.inputRefs = this.props.tokens.map((token) => {
      const tokenName = {};
      tokenName.value = token.name;
      tokenName.label = token.name;
      tokenName.img = token.logo.src;
      tokens.push(tokenName);
    });
    this.state = {
      disabled: true,
      clear: false,
      contactName,
      contactAddress,
      tokenImages: {},
      tokenName: '',
      tokenIMG: '',
      tokens,
      contactAddressInput: '',
    };
  }

  /**
   * Method used to add all the information inputted for the new contact into the global
   * state variable.
   * Also clears up the input fields.
   */
  renderAddContact() {
    this.props.completeContact(this.state.contactName, this.state.contactAddress, this.state.tokenImages);
    this.setState({ contactName: '' });
    const newcontactAddress = {};
    this.props.tokens.map((token) => { return newcontactAddress[token.title] = '' ;});
    this.setState({ contactAddress: newcontactAddress });
  }

  navigate = () => {
    this.props.saveAddContactInputs(this.state.contactName, this.state.contactAddress, this.state.tokenImages);
    this.props.qrScannerInvoker('Contacts');
    this.props.qrScannerCoinInvoker(this.state.tokenName);
    this.props.contactsActiveTab('addcontact');
    const navigateToQrScanner = NavigationActions.navigate({
      routeName: 'QCodeScanner',
    });
    this.props.navigation.dispatch(navigateToQrScanner);
  };

  /**
   * Checks if the contactAddress state is empty or not.
   * Returns a boolean (true if contactAddress is empty, false if full)
   * @param {Object} o
   */
  isEmptyObject(o) {
    return Object.keys(o).every((x) => {
      return o[x] === '' || o[x] === null;
    });
  }

  _toggleModal = () => { return this.setState({ isModalVisible: !this.state.isModalVisible }); };


  /**
   * Adding a contact will consist of saving the temp name, temp address, temp token list
   * You instantiate a new Contact object, and pass the list of contacts to the reducer
   */
  addContact = () => {
    const currentContactName =  this.props.tempContactName;
    const currentContactAddress = this.props.tempContactAddress;
    const currentTokenList = this.props.tempContactTokens;
    const oldContactList = this.props.contacts;
    const newContact = new Contact(currentContactName, currentContactAddress, currentTokenList);
    oldContactList.push(newContact);

    const validContactName = this.checkContactName(oldContactList, currentContactName);
    if (validContactName) {
      this.props.saveWalletContacts(oldContactList);
    } else {
      console.log('contact name has been added already');
    }

    //old
    //this.props.completeContact(currentContactName, currentContactAddress, 'notgood');
    this.setState({ contactName: '' });
    this.setState({ contactAddress: {} });
    this.setState({ tokenName: 'null' });
    this.setState({ tokenImages: {} });
  }

  /**
   * Checking if the contact exists, if it does you will return false;
   */
  checkContactName(contactList, proposedName) {
    let track = 0;
    let isValid = true;
    contactList.forEach(contact => {
      if(proposedName == contact.name) {
        track++;   
      }
    });
    if(track > 1) {
      return false
    } 
    return true;
  }

  clear() {
    this.setState({ contactName: '' });
    this.setState({ contactAddress: {} });
    this.setState({ tokenName: 'null' });
  }

  /**
   * Tokens already are saved globally, this just resets the picker value
   */
  addAnotherCoinAddress() {
    //old
    this.setState({ tokenName: 'null' });
    this.setState({ contactAddressInput: '' });
  }

  /**
   * By default, tempContactTokens = []
   * If you have added multiple tokens, you can push your new token as well
   * If you have not added any, you just push a new token to an empty array.
   *
   * Null is returned sometimes - bug - hack fix is loop through and remove null
   *
   * Duplicate values can also be entered based on app refreshes and user flow, workout is always ensure
   * a unique array is being passed to the action creator/reducer
   */
  selectedToken = async (token) => {
    let arrayWithoutNullValues = [];
    let previouslySavedTokens = this.props.tempContactTokens;
    for (let i = 0; i < previouslySavedTokens.length; i++) {
      if (previouslySavedTokens[i] !== null) {
        arrayWithoutNullValues.push(previouslySavedTokens[i]);
      }
    }
    arrayWithoutNullValues.push(token);
    let unique = [...new Set(arrayWithoutNullValues)];
    this.props.updateTempWalletContacts(unique);
    //old
    await this.setState({
      tokenName: token,
    });
  }

  renderName(name) {
    this.props.setContactTempName(name);
    this.setState({contactName: name}) //old
  }

  renderAddress(address) {
    this.props.setContactEthereumAddress(address); //need to check validity and malicious
    //old
    const copy = Object.assign({}, this.state.contactAddress);
    const copyIMG = Object.assign({}, this.state.tokenImages);
    copy[this.state.tokenName] = address;
    copyIMG[this.state.tokenName] = this.state.tokenIMG;
    this.setState({ contactAddressInput: address });
    this.setState({ contactAddress: copy });
    this.setState({ tokenImages: copyIMG });
  }

  render() {
    return (
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.mainContainer}>
          <View style={styles.contentContainer} >
            <BoxShadowCard >
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardText}>
                  Add contact with QR code or Public Address
                </Text>
              </View>
              <View style={styles.topFormInput}>
                <FormInput
                  placeholder={"Contact's Name"}
                  onChangeText={(name) => { this.renderName(name) } }
                  inputStyle={styles.inputContactName}
                  placeholderTextColor={'#b3b3b3'}
                  value={this.props.tempContactName}
                />
              </View>
              <View style={styles.inputAddressContainer}>
                <FormInput
                  placeholder={'Ethereum Address'}
                  onChangeText={ (address) => { return this.renderAddress(address)}}
                  inputStyle={styles.inputAddressText}
                  placeholderTextColor={'#b3b3b3'}
                  value={ this.props.tempContactAddress }
                />
              </View>
              <View style={styles.barcodeContainer}>
                <TouchableOpacity onPress={() => { return this.navigate(); }}>
                  <Image
                    source={require('../../../../../assets/icons/barcode.png')}
                    style={styles.barcodeImg}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.pickerContainer}>
                <RNPickerSelect
                  placeholder={{
                    label: 'Select Token',
                    value: null,
                  }}
                  items={this.state.tokens}
                  onValueChange={(value) => {
                    this.selectedToken(value);
                  }}
                  style={ pickerStyle }
                  value={ this.state.tokenName }
                  ref={(el) => {
                    this.inputRefs.picker = el;
                  }}
                />
              </View>
              <TouchableOpacity
                style={styles.addAnotherText}
                onPress={this.addAnotherCoinAddress.bind(this)}
                disabled={!this.state.tokenName}>
                  <Text style={styles.anotherText}> +  Add Coin </Text>
              </TouchableOpacity>
            </BoxShadowCard>
          </View>
          <View style={styles.btnContainer}>
            <View style={styles.btnFlex}>
              <ClearButton
                buttonText='Clear'
                onClickFunction={this.clear.bind(this)}
                customStyles={styles.clearButton}
              />
            </View>
            <View style={styles.btnFlex}>
              <LinearButton
                buttonText='Add Contact'
                onClickFunction={this.addContact}
                customStyles={styles.addButton}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

/**
 * Styles used in addContact file
 */
const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: '#fafbfe',
  },
  mainContainer: {
    alignItems: 'center',
    flex: 0.9,
    justifyContent: 'center',
  },
  contentContainer: {
    marginTop: '7.5%',
    flex: 2.3,
    width: '82%',
  },
  cardTextContainer: {
    flex: 0.4,
    paddingLeft: '10%',
    paddingRight: '10%',
    paddingTop: '10%',
  },
  cardText: {
    fontFamily: 'WorkSans-Light',
    color: '#000000',
    lineHeight: RF(3.9),
    letterSpacing: 0.4,
    fontSize: RF(2.5),
    flexWrap: 'wrap',
  },
  topFormInput: {
    flex: 0.3,
    paddingLeft: '3%',
    paddingRight: '3%',
    justifyContent: 'center',
  },
  inputContactName: {
    fontSize: RF(2.5),
    flexWrap: 'wrap',
    color: '#12c1a2',
    letterSpacing: 0.4,
    fontFamily: 'WorkSans-Light',
    borderBottomWidth: 0.0001,
  },
  coinInfoContainerMid: {
    flex: 0.3,
    flexDirection: 'row',
  },
  barcodeContainer: {
    flex: 0.4,
    marginLeft: '9%',
    marginBottom: '2%',
    marginTop: '5%',
    justifyContent: 'center',
  },
  barcodeImg: {
    height: 45,
    width: 45,
  },
  pickerContainer: {
    justifyContent: 'center',
    flex: 0.3,
  },
  addInputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1,
  },
  inputAddressContainer: {
    flex: 0.3,
    paddingLeft: '3%',
    paddingRight: '3%',
    justifyContent: 'center',
  },
  inputAddressText: {
    width: '100%',
    flexWrap: 'wrap',
    color: '#12c1a2',
    fontFamily: 'WorkSans-Light',
    fontSize: RF(2.5),
  },
  addAnotherText: {
    flex: 0.3,
    justifyContent: 'center',
    paddingTop: '2.5%',
  },
  clearButton: {
    marginLeft: '0%',
    marginRight: '1.75%',
    height: Dimensions.get('window').height * 0.082,
  },
  addButton: {
    marginLeft: '0%',
    marginRight: '1.75%',
    height: Dimensions.get('window').height * 0.082,
  },
  anotherText: {
    marginLeft: '9%',
    color: '#27c997',
    fontFamily: 'WorkSans-Regular',
    fontSize: RF(2.5),
  },
  btnFlex: {
    flex: 1,
  },
  btnContainer: {
    flex: 0.1,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'flex-end',
    width: '82%',
    marginBottom: '2.5%',
    marginTop: '2.5%',
  },
  modal: {
    height: '40%',
    borderRadius: 4,
  },
});

const pickerStyle = {
  inputIOS: {
    fontSize: RF(2.6),
    fontFamily: 'WorkSans-Light',
    paddingLeft: '6%',
    paddingRight: '20%',
    paddingTop: 13,
    paddingHorizontal: 10,
    paddingBottom: 12,
    borderRadius: 4,
    color: 'black',
    marginLeft: '3.5%',
  },
  inputAndroid: {
    color: 'black',
    marginLeft: '5%',
  },
  underline: { borderTopWidth: 0 },
  icon: {
    position: 'absolute',
    backgroundColor: 'transparent',
    borderTopWidth: 5,
    borderTopColor: '#00000099',
    borderRightWidth: 5,
    borderRightColor: 'transparent',
    borderLeftWidth: 5,
    borderLeftColor: 'transparent',
    width: 0,
    height: 0,
    top: 20,
    right: 15,
  },
};
/**
 * Reterives the token list from the state variable
 * Returns an object containing the token list
 * @param {Object} state
 */

const mapStateToProps = ({ Wallet }) => {
  const {
    tempContactName, tokens, tempContactAddress, tempContactTokens, contacts,
  } = Wallet;
  return {
    tokens,
    tempContactName,
    tempContactAddress,
    tempContactTokens,
    contacts,
  };
};

export default connect(mapStateToProps, {
  actions,
  setContactTempName,
  setContactTabState,
  setContactEthereumAddress,
  updateTempWalletContacts,
  saveWalletContacts,
})(AddContact);
