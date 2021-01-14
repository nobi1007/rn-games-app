import React, {useState} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {players} from './constants';
import GameBoard from './GameBoard';
import backIcon from '../../image/back-button.png';
import settingsIcon from '../../image/settings.png';

const gameStack = [];
let compRow = [
  [0, 0, 0],
  [0, 0, 0],
];
let compCol = [
  [0, 0, 0],
  [0, 0, 0],
];
let compDiags = [
  [0, 0],
  [0, 0],
];

const Item = ({item, onPress}) => {
  const inavildUndoCondition = item.title === 'UNDO' && gameStack.length === 0;
  const customStyle = inavildUndoCondition ? {backgroundColor: '#f5f5f5'} : {};
  return (
    <TouchableOpacity
      style={[styles.customToolsButton, customStyle]}
      disabled={inavildUndoCondition}
      onPress={onPress}>
      <Text style={styles.customToolsButtonText}>{item.title}</Text>
    </TouchableOpacity>
  );
};

function TicTacToe({navigation}) {
  const [currentPlayer, setCurrentPlayer] = useState(players.player1);
  const [nextMoveText, setNextMoveText] = useState(players.player1.name);
  const [gameBoardMatrix, setGameBoardMatrix] = useState([
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ]);
  const [gameStatus, setGameStatus] = useState('Please start the game!');

  const toolButtonsData = [
    {
      id: 1,
      title: 'RESET',
      onPressHandler: function () {
        gameStack.splice(0, gameStack.length);
        compRow = [
          [0, 0, 0],
          [0, 0, 0],
        ];
        compCol = [
          [0, 0, 0],
          [0, 0, 0],
        ];
        compDiags = [
          [0, 0],
          [0, 0],
        ];
        setCurrentPlayer(players.player1);
        setNextMoveText(players.player1.name);
        setGameBoardMatrix([
          ['', '', ''],
          ['', '', ''],
          ['', '', ''],
        ]);
        setGameStatus('Please start the game!');
      },
    },
    {
      id: 2,
      title: 'UNDO',
      onPressHandler: function () {
        if (gameStack.length > 0) {
          const [lastPlayer, rowIndex, colIndex] = gameStack.pop();

          compRow[lastPlayer.index][rowIndex] -= 1;
          compCol[lastPlayer.index][colIndex] -= 1;
          const diag1 = rowIndex - colIndex;
          const diag2 = rowIndex + colIndex;

          if (diag1 === 0) {
            compDiags[lastPlayer.index][0] -= 1;
          }
          if (diag2 === 2) {
            compDiags[lastPlayer.index][1] -= 1;
          }

          let updatedGameBoard = [[], [], []];

          gameBoardMatrix.forEach((row, inx) => {
            updatedGameBoard[inx] = [...row];
          });
          updatedGameBoard[rowIndex][colIndex] = '';

          let currentGameStatus = getGameStatus();

          if (typeof currentGameStatus === 'object') {
            const {winPlayer, winDirection, winIndex} = currentGameStatus;
            currentGameStatus = `${winPlayer.name} wins.`;
          }
          setCurrentPlayer(lastPlayer);
          setNextMoveText(lastPlayer.name);
          setGameStatus(currentGameStatus);
          setGameBoardMatrix(updatedGameBoard);
        }
      },
    },
  ];

  const invertPlayer = (currentPlayer, gameStatus) => {
    if (
      gameStatus.split(' ').indexOf('wins.') !== -1 ||
      gameStack.length >= 9
    ) {
      setNextMoveText('No one, as game is over.');
    } else if (currentPlayer.index === 0) {
      setCurrentPlayer(players.player2);
      setNextMoveText(players.player2.name);
    } else if (currentPlayer.index === 1) {
      setCurrentPlayer(players.player1);
      setNextMoveText(players.player1.name);
    }
  };

  function getGameStatus() {
    let winDirection = -1; // 100 -> row, 110 -> col, 111 -> diag
    let winIndex = -1;
    let winPlayer = null;

    if (gameStack.length > 3) {
      for (let player = 0; player < 2; player++) {
        const rowWise = compRow[player].indexOf(3);
        const colWise = compCol[player].indexOf(3);
        const diagWise = compDiags[player].indexOf(3);

        if (rowWise !== -1 || colWise !== -1 || diagWise !== -1) {
          winPlayer = player === 0 ? players.player1 : players.player2;
          if (rowWise !== -1) {
            winDirection = 100;
            winIndex = rowWise;
            break;
          }
          if (colWise !== -1) {
            winDirection = 110;
            winIndex = colWise;
            break;
          }
          if (diagWise !== -1) {
            winDirection = 111;
            winIndex = diagWise;
            break;
          }
        }
      }

      if (winIndex === -1) {
        if (gameStack.length >= 9) {
          return 'Drawn';
        }
        return 'In Progress ... ';
      } else {
        return {winPlayer, winDirection, winIndex};
      }
    } else {
      if (gameStack.length === 0) {
        return 'Please start the game!';
      }
      return 'In Progress ... ';
    }
  }

  const handleBoxClick = (R, C) => {
    if (
      gameBoardMatrix[R][C] === '' &&
      gameStatus.split(' ').indexOf('wins.') === -1 &&
      gameStack.length < 9
    ) {
      gameStack.push([currentPlayer, R, C]);
      compRow[currentPlayer.index][R] += 1;
      compCol[currentPlayer.index][C] += 1;
      const diag1 = R - C;
      const diag2 = R + C;

      if (diag1 === 0) {
        compDiags[currentPlayer.index][0] += 1;
      }
      if (diag2 === 2) {
        compDiags[currentPlayer.index][1] += 1;
      }

      let currentGameStatus = getGameStatus();

      if (typeof currentGameStatus === 'object') {
        const {winPlayer, winDirection, winIndex} = currentGameStatus;
        currentGameStatus = `${winPlayer.name} wins.`;
      }

      setGameStatus(currentGameStatus);

      let updatedGameBoard = [[], [], []];
      gameBoardMatrix.forEach((row, inx) => {
        updatedGameBoard[inx] = [...row];
      });

      updatedGameBoard[R][C] = currentPlayer.marker;
      setGameBoardMatrix(updatedGameBoard);
      invertPlayer(currentPlayer, currentGameStatus);
    } else if (gameStatus.split(' ').indexOf('wins.') !== -1) {
      alert('Game is Over. Please RESET to start a new game.');
    } else if (gameStack.length >= 9) {
      alert('Game is Over. Please RESET to start a new game.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Image source={backIcon} style={{width: 36, height: 36}} />
        </TouchableOpacity>
        <Text style={styles.textH2}>- Tic Tac Toe -</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Image source={settingsIcon} style={{width: 36, height: 36}} />
        </TouchableOpacity>
      </View>
      <View style={styles.body}>
        <View style={styles.btnGrp}>
          {toolButtonsData.map((data, inx) => {
            return <Item key={inx} item={data} onPress={data.onPressHandler} />;
          })}
        </View>
        <GameBoard
          handleCellClick={handleBoxClick}
          gameBoardMatrix={gameBoardMatrix}
        />
        <View style={styles.gameFooter}>
          <View style={styles.statsRow}>
            <Text style={styles.textStatsKey}>{`Move of: `}</Text>
            <Text style={styles.textStatsVal}>{nextMoveText}</Text>
          </View>
          <View style={styles.statsRow}>
            <Text style={styles.textStatsKey}>{`Game Status: `}</Text>
            <Text style={styles.textStatsVal}>{gameStatus}</Text>
          </View>
        </View>
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
    paddingVertical: 10,
    marginHorizontal: 10,
    display: 'flex',
    flexDirection: 'row',
  },
  backButton: {
    width: 36,
    height: 36,
  },
  settingsButton: {
    width: 36,
    height: 36,
  },
  textH2: {
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 38,
    flex: 1,
  },
  body: {
    margin: 10,
    flex: 10,
  },
  btnGrp: {
    display: 'flex',
    flexDirection: 'row-reverse',
    justifyContent: 'space-evenly',
  },
  customToolsButton: {
    backgroundColor: '#eee',
    height: 40,
    width: 90,
    marginVertical: 10,
    borderRadius: 10,
  },
  customToolsButtonText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    flex: 1,
    fontWeight: 'bold',
    fontSize: 14,
    color: '#2f2f2f',
  },
  gameFooter: {
    flex: 3,
  },
  statsRow: {
    marginVertical: 5,
    flexDirection: 'row',
    padding: 5,
  },
  textStatsKey: {
    fontSize: 16,
    flex: 2,
  },
  textStatsVal: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 7,
  },
});

export default TicTacToe;
