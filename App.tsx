import React from 'react';
import {Alert, SafeAreaView, Text, View} from 'react-native';
import {Button, Input} from 'react-native-elements';

interface StateType {
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
      eur: '',
      usd: '',
    };
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
              marginTop: 80,
              color: '#2089DC',
              fontWeight: 'bold',
              fontSize: 30,
              textDecorationLine: 'underline',
            }}>
            CurrencyConverter
          </Text>
          <View style={{width: 200, marginTop: 100}}>
            <Input
              value={this.state.eur}
              placeholder="69"
              keyboardType="number-pad"
              onChangeText={(t) => this.setState({eur: t})}
              rightIcon={
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    marginRight: 10,
                    color: '#86939E',
                  }}>
                  € EUR
                </Text>
              }
            />
            <Input
              value={this.state.usd}
              placeholder="420"
              keyboardType="number-pad"
              onChangeText={(t) => this.setState({usd: t})}
              rightIcon={
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    marginRight: 10,
                    color: '#86939E',
                  }}>
                  $ USD
                </Text>
              }
            />
          </View>
          <View style={{flexDirection: 'row'}}>
            <Button
              onPress={() =>
                this.convert(
                  ConversionType.USD,
                  ConversionType.EUR,
                  this.state.eur,
                )
              }
              style={{marginTop: 20, marginRight: 5}}
              title="EUR to USD"
            />
            <Button
              onPress={() =>
                this.convert(
                  ConversionType.EUR,
                  ConversionType.USD,
                  this.state.usd,
                )
              }
              style={{marginTop: 20, marginLeft: 5}}
              title="USD to EUR"
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  async convert(from: ConversionType, to: ConversionType, amount: string) {
    const useAmount = parseFloat(amount);
    if (amount.length <= 0)
      return Alert.alert(
        'Error',
        `Please provide a value in the ${from.toUpperCase()} field to convert.`,
      );
    if (!useAmount) return Alert.alert('Error', 'Please input a valid number.');
    const res = await fetch(
      `http://currencies.apps.grandtrunk.net/getlatest/${from}/${to}`,
    );
    const json = await res.json();
    return from == ConversionType.EUR
      ? this.setState({eur: (json * useAmount).toFixed(2)})
      : this.setState({usd: (json * useAmount).toFixed(2)});
  }
}

export default App;
