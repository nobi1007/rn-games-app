import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const EachRow = ({eachRowData, rowNum, handleCellClick}) => {
  return (
    <View style={styles.eachRow}>
      {eachRowData.map((data, inx) => {
        const extraStyle = {
          backgroundColor: data === 'X' || data === 'O' ? '#f4f4f4' : '#fff',
        };
        return (
          <View key={inx} style={styles.eachCell}>
            <Text
              style={[styles.eachCellText, extraStyle]}
              onPress={() => {
                handleCellClick(rowNum, inx);
              }}>
              {data}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const GameBoard = ({handleCellClick, gameBoardMatrix}) => {
  return (
    <View style={styles.gameBoard}>
      {gameBoardMatrix.map((data, inx) => {
        return (
          <EachRow
            key={inx}
            eachRowData={data}
            rowNum={inx}
            handleCellClick={handleCellClick}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  gameBoard: {
    backgroundColor: '#eee',
    borderWidth: 1,
    borderColor: '#ccc',
    flex: 6,
    marginVertical: 10,
  },
  eachRow: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },
  eachCell: {
    margin: 1,
    flex: 1,
    backgroundColor: '#fff',
  },
  eachCellText: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 36,
    color: '#444',
    fontFamily: 'monospace',
  },
});

export default GameBoard;
