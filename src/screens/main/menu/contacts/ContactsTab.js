import React, { Component } from 'react';
import { View, Text, StyleSheet, ListView, Dimensions } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import _ from 'lodash';
import { selectContact, selectedContactTrigger } from '../../../../actions/actionCreators/Contacts';
import AddFirstContact from './add/AddFirstContact';
import SelectedContact from './SelectedContact';
import RF from 'react-native-responsive-fontsize';
import BoxShadowCard from '../../../../components/ShadowCards/BoxShadowCard';

/**
 * Screen that displays all the contacts that have been added to
 * the wallet
 */
class ContactsTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: true,
      selectedContact: false,
      contact: null,
    };
  }


  /**
   * LifeCycle method (executes before the screen has been rendered)
   * Sets the "contacts" data reterived from the global state variable as the
   * data source for the list view
   */
  componentWillMount() {
    let data = this.props.contacts;  //replace here
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
    this.dataSource = ds.cloneWithRows(data);
  }

  /**
   * LifeCycle method (executes only when the state has been changed)
   * Re-sets the "contacts" data reterived from the global state variable as the
   * data source for the list view
   */
  componentWillReceiveProps(nextProps) {
    let data = nextProps.contacts;   //here
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
    this.dataSource = ds.cloneWithRows(data);
  }

  /**
   * Method is used to create an interactable item for the listView specific to
   * the name property of the "user" object
   *
   * @param {Object} user
   */
  renderRow = () => {
    return (
      this.props.contacts.map(contact =>
        <View style={styles.mainListItemContainer} key={contact.name}>
          <BoxShadowCard>
            <ListItem
              chevronColor="#000000"
              key={contact.name}
              title={
                <View style={styles.listItemContainer}>
                  <Text style={styles.contactNameText}>
                    {contact.name}
                  </Text>
                </View>
                }
                containerStyle = {styles.containerStyle}
                onPress={
                  () => {                  
                    console.log('in this click');
                    this.props.selectContact(contact);   
                    this.setState({selectedContact: true });                                   
                  }}
             />
            </BoxShadowCard>
        </View>,
      )
    );
  }

  /**
   * Returns a list of contacts if and only if the length of the contact list reterived from the global state
   * variable is greater than 0.
   */
  render() {
    const show = this.props.contacts.length === 0 ?
        <AddFirstContact setAddContactTab={this.props.setAddContactTab}/>
      : this.state.selectedContact === true ?
        <SelectedContact contact={this.props.selectedContact} setSelectedContactFalse={this.props.setSelectedContactFalse} navigation={this.props.navigation}/>
      :
        <View style={styles.list}>
          {this.renderRow()}
        </View>;
      return show;
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    paddingTop: '2.5%',
    backgroundColor: '#fafbfe',
  },
  mainListItemContainer: {
    marginTop: '3%',
    height: Dimensions.get('window').height * 0.1,
    width: Dimensions.get('window').width * 0.85,
  },
  listItemContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginLeft: '5%',
  },
  contactNameText: {
    fontSize: RF(2.4),
    fontFamily: 'Cairo-Regular',
    alignItems: 'flex-start',
    flex: 1,
    width: '90%',
    letterSpacing: 0.5,
    top: '1%',
  },
  containerStyle: {
    borderWidth: 0,
    borderBottomWidth: 0,
  },
  contentContainer: {
    marginTop: 25,
  },
  form: {
    width: 340,
  },
  btnContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  listItem: {
    marginTop: '2.5%',
    marginLeft: '0.25%',
  },
  list: {
    marginTop: '4%',
    flex: 1,
    marginLeft: '9%',
  },
});

/**
 * Method reterives the list contacts that is stored in the global
 * state variable and is returns an object with that information
 * @param {Object} param0
 */
// function mapStateToProps({ contacts }) {
//   return { contacts: contacts.contacts }
// }

function mapStateToProps({ Wallet }) {
  const { contacts, selectedContact, selectedContactTrigger } = Wallet;
  return { contacts, selectedContact, selectedContactTrigger };
}

export default connect(mapStateToProps, {
  selectContact,
  selectedContactTrigger,
})(ContactsTab);
