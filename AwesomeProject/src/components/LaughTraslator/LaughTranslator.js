import React, {useState} from 'react';
import {Text, TextInput, View, StyleSheet} from 'react-native';

const LaughTraslator = () => {
  const [text, setText] = useState('');
  return (
    <View style={style.main}>
      <View style={style.row}>
        <Text style={style.keyColumn}>Input : </Text>
        <TextInput
          style={[style.valColumn, style.textInput]}
          placeholder={`Type here to translate`}
          onChangeText={(text) => setText(text)}
          defaultValue={text}
        />
      </View>
      <View style={style.row}>
        <Text style={style.keyColumn} onPress={() => alert('output pressed')}>
          Output :{' '}
        </Text>
        <Text style={style.valColumn}>
          {text
            .split(' ')
            .map((word) => word && `😂`)
            .join(' ')}
        </Text>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  main: {
    padding: 10,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    height: 40,
    marginTop: 5,
    marginBottom: 5,
    alignContent: 'center',
  },
  keyColumn: {
    textAlignVertical: 'center',
    padding: 10,
    fontWeight: 'bold',
    borderColor: 'transparent',
    borderWidth: 1,
  },
  textInput: {
    backgroundColor: '#e3e3e3',
    padding: 10,
    flex: 1,
  },
  valColumn: {
    textAlignVertical: 'center',
  },
});

export default LaughTraslator;
