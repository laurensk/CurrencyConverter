import React from 'react';
import {Alert, SafeAreaView, Switch, Text, View} from 'react-native';
import {Button, Input} from 'react-native-elements';

interface StateType {
  automatic: boolean;
  eur: string;
  usd: string;
}

enum ConversionType {
  EUR = 'usd',
  USD = 'eur',
}

class App extends React.Component<any, StateType> {
  constructor(props: any) {
    super(props);
    this.state = {
      automatic: false,
      eur: '',
      usd: '',
    };
  }

  async convert(from: ConversionType, to: ConversionType, amount: string) {
    if (!this.state.automatic) {
      if (amount.length <= 0) return this.noValueError(from);
      if (!parseFloat(amount)) return this.noNumberError();
    }

    const course = await (await fetch(`http://currencies.apps.grandtrunk.net/getlatest/${from}/${to}`)).json();
    const result = (course * parseFloat(amount)).toFixed(2);

    return from == ConversionType.EUR
      ? this.setState({eur: result == 'NaN' ? '0' : result})
      : this.setState({usd: result == 'NaN' ? '0' : result});
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <Text
            style={{
              marginTop: 70,
              color: '#2089DC',
              fontWeight: 'bold',
              fontSize: 30,
              textDecorationLine: 'underline',
            }}>
            CurrencyConverter
          </Text>
          <View style={{width: 200, marginTop: 80}}>
            {this.renderInput(this.state.eur, '€ EUR', '69', (t: string) => {
              this.setState({
                eur: t,
              });
              if (this.state.automatic) this.convert(ConversionType.USD, ConversionType.EUR, t);
            })}
            {this.renderInput(this.state.usd, '$ USD', '420', (t: string) => {
              this.setState({
                usd: t,
              });
              if (this.state.automatic) this.convert(ConversionType.EUR, ConversionType.USD, t);
            })}
          </View>
          {!this.state.automatic && (
            <View style={{flexDirection: 'row'}}>
              {this.renderButton(ConversionType.USD, ConversionType.EUR, this.state.eur, 'EUR to USD')}
              {this.renderButton(ConversionType.EUR, ConversionType.USD, this.state.eur, 'USD to EUR')}
            </View>
          )}
          {this.renderAutomatic()}
        </View>
      </SafeAreaView>
    );
  }

  renderInput(value: string, text: string, placeholder: string, updateAction: Function) {
    return (
      <Input
        value={value}
        placeholder={placeholder}
        keyboardType="number-pad"
        onChangeText={(t) => updateAction(t)}
        rightIcon={
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              marginRight: 10,
              color: '#86939E',
            }}>
            {text}
          </Text>
        }
      />
    );
  }

  renderButton(from: ConversionType, to: ConversionType, amount: string, title: string) {
    return (
      <Button onPress={() => this.convert(from, to, amount)} style={{marginTop: 20, marginRight: 5}} title={title} />
    );
  }

  renderAutomatic() {
    return (
      <View style={{paddingTop: 30, alignItems: 'center'}}>
        <Text style={{color: '#2089DC', fontWeight: 'bold'}}>Automatic mode</Text>
        <Switch
          style={{marginTop: 10}}
          value={this.state.automatic}
          trackColor={{true: '#2089DC', false: 'grey'}}
          onValueChange={(v) => this.setState({automatic: v})}></Switch>
      </View>
    );
  }

  noValueError(from: ConversionType) {
    return Alert.alert('Error', `Please provide a value in the ${from.toUpperCase()} field to convert.`);
  }

  noNumberError() {
    return Alert.alert('Error', 'Please input a valid number.');
  }
}

export default App;
