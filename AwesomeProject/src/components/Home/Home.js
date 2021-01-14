import React from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';

const DATA = [
  {
    id: '1',
    title: ' Tic Tac Toe ',
    routeName: 'TicTacToe',
  },
];

const Item = ({item, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.itemContainer}>
      <Text style={styles.itemTitle}>{item.title}</Text>
    </TouchableOpacity>
  );
};

function Home({navigation}) {
  const renderItem = ({item}) => {
    return (
      <Item onPress={() => navigation.navigate(item.routeName)} item={item} />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.textH2}> Game Arena XOVD</Text>

        <Text style={styles.textNormal}> Play any of the game below :) </Text>
      </View>
      <View style={styles.body}>
        <FlatList data={DATA} renderItem={renderItem} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flex: 1,
    padding: 10,
  },
  textH2: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 36,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    elevation: 3,
  },
  textNormal: {
    textAlign: 'center',
    fontSize: 13,
    marginVertical: 10,
  },
  body: {
    flex: 5,
    margin: 10,
    padding: 10,
  },
  itemContainer: {
    backgroundColor: '#efefef',
    height: 48,
    borderRadius: 10,
    marginTop: 20,
  },
  itemTitle: {
    textAlign: 'center',
    textAlignVertical: 'center',
    flex: 1,
    fontWeight: 'bold',
    fontSize: 18,
    color: '#2f2f2f',
  },
});

export default Home;
