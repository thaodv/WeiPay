import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
  SafeAreaView,
  TouchableWithoutFeedback,
  Dimensions,
  Keyboard,
  Linking,
} from 'react-native';
import { connect } from 'react-redux';
import Hyperlink from 'react-native-hyperlink'
import { FormInput } from 'react-native-elements';
import { NavigationActions } from 'react-navigation';
import RF from 'react-native-responsive-fontsize';
import Toast from 'react-native-simple-toast';
import * as actions from '../../../../store/actions/ActionCreator';
import * as configActions from '../../../../store/actions/creators/AppConfig';
import LinearButton from '../../../../components/linearGradient/LinearButton';
import ClearButton from '../../../../components/linearGradient/ClearButton';
import BoxShadowCard from '../../../../components/shadowCards/BoxShadowCard';
import getNetworkProvider from '../../../../../constants/Providers';
import MaliciousAddresses from '../../../../../constants/data/json/addresses_darklist.json';
import executeEtherTransaction from '../../../../../scripts/tokens/transactions/transactionsEther';
import executeERC20Transaction from '../../../../../scripts/tokens/transactions/transactionsERC20';
import getEtherscanLink from '../../../../../scripts/tokens/transactions/getEtherscanLink';

const ethers = require('ethers');
const img = require('../../../../../assets/icons/barcode.png');

const utils = ethers.utils;

class CoinSend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toAddress: this.props.gloablPublicAddress,
      value: null,
      inputValue: null,
      txnFee: null,
      maliciousComment: '',
      validAddress: new RegExp('0x[0-9a-fA-F]{40}'),
      valid: false,
      etherscanLink: null,
    };
  }

  componentDidMount() {
    console.log('hey');
  }

  navigate = () => {
    this.props.setQrInvoker("TokenFunctionality");
    const navigateToQRScanner = NavigationActions.navigate({
      routeName: 'QCodeScanner',
      params: { invoker: 'CoinSend' },
    });
    this.props.navigation.dispatch(navigateToQRScanner);
  };


  renderAddress(addressInput) {
    const trimmed = addressInput.trim();
    this.setState({ toAddress: trimmed });
    this.props.setGlobalAddress(trimmed);
    if (this.state.validAddress.exec(addressInput) == null) {
      this.setState({ valid: false });
    } else {
      this.setState({ valid: true });
    }
  }

  renderValue(valueInput) {
    if (!isNaN(valueInput)) {
      if (valueInput < 0) {
        Alert.alert(
          'Invalid Ether Amount',
          'Please enter an amount greater than 0.',
          [
            { text: 'OK', onPress: () => { return console.log('OK Pressed');} },
          ],
          { cancelable: false },
        );
      } else {
        this.setState({ value: valueInput });
      }
    } else {
      this.setState({ value: null });
    }
  }

  getTxnFee = async () => {
    const provider = await getNetworkProvider(this.props.network);
    let formattedFee;
    try {
      let gasPriceString = await provider.getGasPrice().then((gasPrice) => {
        gasPriceString = gasPrice.toString();
        const gasPriceEth = utils.formatEther(gasPrice);
        const txnFee = 21000 * gasPriceEth;
        formattedFee = txnFee.toFixed(8);
        return formattedFee;
      });
      await this.setState({ txnFee: formattedFee });
    } catch (error) {
      console.log(error);
    }
  }

  resetFields = () => {
    this.inputAddress.clearText();
    this.inputAmount.clearText();
    this.props.setGlobalAddress('');
    this.setState({ maliciousComment: '', inputValue: '0' });
  }

  checkMaliciousAddresses = (address) => {
    for (let i = 0; i < MaliciousAddresses.length; i++) {
      if (address === MaliciousAddresses[i].address) {
        this.setState({ maliciousComment:  MaliciousAddresses[i].comment });
        return { flag: true, 'address' : MaliciousAddresses[i].address, 'comment' : MaliciousAddresses[i].comment };
      }
    }
    return { flag: false };
  }

  processTX = async () => {
    this.getTxnFee();
    const validAddress = this.state.valid;
    const maliciousResponse = await this.checkMaliciousAddresses(this.state.toAddress);
    const { flag } = maliciousResponse;
    const isEtherTX = this.props.activeTokenData.address === '';
    if (validAddress && !flag) {
      const provider = await getNetworkProvider(this.props.network);
      let txResponse;
      if (isEtherTX) {
        console.log('trigger ether trans');
        txResponse = await executeEtherTransaction(
          provider,
          this.state.toAddress,
          this.props.wallet.privateKey,
          this.state.value,
        );
      } else {
        console.log('trigger erc20');
        txResponse = await executeERC20Transaction(
          provider,
          this.state.toAddress,
          this.props.wallet.privateKey,
          this.state.value,
          this.props.activeTokenData.address,
          this.props.activeTokenData.decimals,
        );
      }
      console.log({txResponse});
      
      if (Object.prototype.hasOwnProperty.call(txResponse, 'hash')) {
        const link = getEtherscanLink(this.props.network, txResponse.hash);
        this.setState({ etherscanLink: link });
        this.resetFields();
      }
    } else {
      console.log('bad');
    }
  }

  render() {
    const {
      valid, value, maliciousComment, inputValue, toAddress, etherscanLink,
    } = this.state;
    return (
      <SafeAreaView style={styles.safeAreaView}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={ styles.mainContainer }>
            <View style={styles.boxShadowContainer}>
              <View style={styles.contentContainer}>
                <BoxShadowCard>
                  <Text style={styles.cardText}>
                    Send Ether by scanning someone's QR code or public address.
                  </Text>
                  <View style= {styles.barcodeImageContainer}>
                    <TouchableOpacity
                      onPress= {() => { return this.navigate(); }} >
                      <Image
                        source={img}
                        style={styles.barcodeImage}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.inputContainer}>
                    {
                      maliciousComment !== ''
                        ? <Text style={styles.maliciousCommentText}>Malicious - {maliciousComment} </Text>
                        : null
                    }
                    <View style={styles.formInputContainer}>
                      <FormInput
                        placeholder={'Public Address'}
                        onChangeText={this.renderAddress.bind(this)}
                        ref={(ref) => { return this.inputAddress = ref; }}
                        inputStyle={[styles.formAddress, valid ? styles.colorValid : styles.colorError] }
                        // value={toAddress}
                        value='0xb9a7d8BcFa271733a057352cA743a79eC4714823'
                        selectionColor={'#12c1a2'}
                      />
                    </View>
                    <View style={styles.formInputContainer}>
                      <FormInput
                        placeholder={'Amount'}
                        onChangeText={this.renderValue.bind(this)}
                        ref={(ref) => { return this.inputAmount = ref; }}
                        inputStyle={styles.formAmount}
                        value={inputValue}
                        selectionColor={'#12c1a2'}
                      />
                    </View>
                    {
                      !valid || !value
                        ? null
                        : <Text style={styles.displayFeeText}> {this.state.txnFee} </Text>
                    }
                  </View>
                </BoxShadowCard>
              </View>
            </View>
            <View style={styles.btnContainer}>
            {
              etherscanLink === null
              ? <View style={styles.btnRow}>
              <View style={styles.btnFlex}>
                <ClearButton
                  onClickFunction={this.resetFields}
                  buttonText="Reset"
                  customStyles={styles.btnReset}
                />
              </View>
              <View style={styles.btnFlex}>
                <LinearButton
                  onClickFunction={this.processTX}
                  buttonText="Send"
                  customStyles={styles.btnSend}
                  buttonStateEnabled={!valid || !value}
                />
              </View>
            </View>
            : <View style={{ backgroundColor: '#12c1a2', justifyContent: 'center', alignItems:'stretch' }}>
              <BoxShadowCard style={{flex:0.9 }}>
                <TouchableOpacity
                  style={{ flex: 0.9, backgroundColor: 'white', justifyContent: 'center', alignItems:'center' }}
                  onPress={() => Linking.openURL(etherscanLink).catch(err => console.error('An error occurred', err)) }>  
                  <Text style={{color: '#12c1a2'}}> Show Etherscan TX </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flex: 0.9, backgroundColor: 'white', justifyContent: 'center', alignItems:'center' }}
                  onPress={() => this.setState({ etherscanLink: null })}>
                  <Text style={{color: '#12c1a2'}}> Dismiss Alert </Text>
                </TouchableOpacity>
                </BoxShadowCard>
              </View>
            }              
            </View>
          </View>
        </TouchableWithoutFeedback>
       </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: '#f4f7f9',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#f4f7f9',
    justifyContent: 'center',
    width: '100%',
  },
  boxShadowContainer: {
    alignItems: 'center',
    marginTop: '10%',
    flex: 3.75,
    width: '100%',
  },
  contentContainer: {
    width: '82%',
    flex: 1,
  },
  cardText: {
    paddingBottom: '5%',
    paddingTop: '10%',
    paddingLeft: '10%',
    paddingRight: '10%',
    fontFamily: 'WorkSans-Light',
    fontSize: RF(2.4),
    color: '#000000',
    letterSpacing: 0.4,
  },
  barcodeImageContainer: {
    paddingTop: '5%',
    paddingBottom: '5%',
    paddingLeft: '10%',
  },
  barcodeImage: {
    height: Dimensions.get('window').height * 0.1,
    width: Dimensions.get('window').width * 0.18,
  },
  maliciousCommentText: {
    color: 'red',
    fontSize: RF(2.1),
    marginLeft: '11%',
  },
  formInputContainer: {
    marginLeft: '4.5%',
  },
  formAddress: {
    width: '90%',
    fontSize: RF(2.2),
    color: '#12c1a2',
    flexWrap: 'wrap',
    fontFamily: 'WorkSans-Light',
    letterSpacing: 0.4,
    paddingBottom: '3%',
  },
  colorValid: {
    color: 'green',
  },
  colorError: {
    color: 'red',
  },
  formAmount: {
    width: '90%',
    fontSize: RF(2.2),
    color: 'black',
    flexWrap: 'wrap',
    fontFamily: 'WorkSans-Light',
    letterSpacing: 0.4,
  },
  displayFeeText: {
    width: '90%',
    marginLeft: '10.5%',
    fontSize: RF(1.6),
    letterSpacing: 0.3,
    fontFamily: 'WorkSans-Light',
    marginTop: '5%',
  },
  btnContainer: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    width: '82%',
    alignContent: 'center',
    marginLeft: '9%',
    marginRight: '9%',
  },
  btnRow: {
    flexDirection: 'row',
  },
  btnFlex: {
    flex: 1,
  },
  btnReset: {
    marginLeft: '0%',
    marginRight: '1.75%',
    height: Dimensions.get('window').height * 0.082,
  },
  btnSend: {
    marginLeft: '1.75%',
    height: Dimensions.get('window').height * 0.082,
  },
});

const mapStateToProps = ({
  Wallet, HotWallet, newWallet, contacts,
}) => {
  const { gloablPublicAddress, activeTokenData, network } = Wallet;
  const { wallet } = HotWallet.hotWallet;
  return {
    wallet,
    gloablPublicAddress,
    activeTokenData,
    txnFee: newWallet.txnFee,
    contactAddress: contacts.contactDataforCoinSend,
    network,
  };
};

export default connect(mapStateToProps, { ...actions, ...configActions })(CoinSend);
