import React, { Component } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import TabNavigator from '../../../../components/customPageNavs/CustomTabNavigator';
import BackWithMenuNav from '../../../../components/customPageNavs/BackWithMenuNav';
import Coins from './Coins';
import Tokens from './Tokens';
import NewToken from './NewToken';

class Index extends Component {

  constructor(props){
    super(props);
    var active = 0;
    let refreshRoute = null;
    try {
      refreshRoute = this.props.navigation.state.params.tab;
      console.log({refreshRoute});
    } catch (err) {
      console.log({err});
    }

    if (refreshRoute !== null) {
      this.state = {
        setActiveTab: refreshRoute,
      }
    } else {
      console.log('do we hit else?');
      try {
        active = this.props.navigation.state.params.activeTab;
      } catch (error) {
        active = 0;
      }
      this.state = {
        setActiveTab: active,
        index: 0,
        routes: [
          { key: 'first', title: 'First' },
          { key: 'second', title: 'Second' },
        ],
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
          <BackWithMenuNav
              showMenu={false}
              showBack={true}
              navigation={this.props.navigation}
              backPage={'mainStack'}
          />
          
          <TabView
            navigationState={this.state}
            renderScene={SceneMap({
              first: Coins,
              second: Tokens,
            })}
            onIndexChange={index => this.setState({ index })}
            initialLayout={{ width: Dimensions.get('window').width }}
          />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  // App container
  container: {
    flex: 1, // Take up all screen
    backgroundColor: '#fafbfe', // Background color
    paddingTop: getStatusBarHeight(),
  },
  // Tab content container
  content: {
    flex: 1, // Take up all available space
    backgroundColor: '#fafbfe', // Darker background for content area
  },
});

export default Index;


// <TabNavigator tabs={3} activeTab={ this.state.setActiveTab }>
//               {/* First tab */}
//               <View title="Tokens" style={styles.content}>
//                 <Coins navigation={this.props.navigation} />
//               </View>
//               {/* Second tab */}
//               <View title="Search" style={styles.content}>
//                   <Tokens navigation={this.props.navigation} />
//               </View>
//               {/* Third tab */}
//               <View title="New Token" style={styles.content}>
//                   <NewToken
//                     navigation={this.props.navigation}
//                   />
//               </View>
//           </TabNavigator>