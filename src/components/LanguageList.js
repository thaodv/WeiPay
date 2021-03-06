import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import RadioGroup from 'react-native-radio-buttons-group';
import { CardSection } from './common/CardSection';
import { Card } from './common/Card';
import { selectWalletLanguage } from '../actions/ActionCreator';

/**
 * React Component
 * a radio list of all languages from which
 * the user select from.
 * 
 */
class LanguageList extends Component {

  state = {
    data: this.props.language
  };

  /**
   * Updates this.state.data everytime a new language from 
   * the list is selected.
   */
  onPress = data => this.setState({ data });

  /**
  * Executes the action "selectWalletLanguage" to update the selected language in the
  * state variable
  * updates this.state.data to the selected language
  * @param {String} data 
  */
  renderSelect(data) {
    let selectedlanguage = this.state.data.find(e => e.selected == true);
    selectedlanguage = selectedlanguage ? selectedlanguage.value : this.state.data[0].label;
    this.props.selectWalletLanguage(selectedlanguage);
    this.setState({ data });
  }

  /**
   * Returns a Scrollable radio list of languages that the user can select from
   */
  render() {
    return (
      <ScrollView contentContainerstyle={styles.container} >
        <CardSection>
          <RadioGroup radioButtons={this.state.data} onPress={this.renderSelect.bind(this)} />
        </CardSection>
      </ScrollView>
    );
  }
}
/**
 * Styles used within the component
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    marginBottom: 100,
  }
});

/**
 * extracts the current language that the state is pointing to
 * and returns an object containing this information
 * @param {Object} state 
 */
const mapStateToProps = state => {
  return {
    language: state.language
  }
}

export default connect(mapStateToProps, { selectWalletLanguage })(LanguageList);
