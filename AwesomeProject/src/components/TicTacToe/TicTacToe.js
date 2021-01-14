import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import GameBoard from './GameBoard';
import SettingsComp from './SettingsComp';
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

const animationDuration = 200;

const TicTacToe = ({navigation}) => {
  const [player1, setPlayer1] = useState({
    index: 0,
    name: 'Player 1',
    marker: 'X',
  });
  const [player2, setPlayer2] = useState({
    index: 1,
    name: 'Player 2',
    marker: 'O',
  });

  const [currentPlayer, setCurrentPlayer] = useState(player1);

  const [gameBoardMatrix, setGameBoardMatrix] = useState([
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ]);
  const [gameStatus, setGameStatus] = useState('Please start the game!');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const updatePlayers = (p1, p2) => {
    let dummyPlayer1 = {...player1};
    let dummyPlayer2 = {...player2};
    if (p1.length > 0) {
      dummyPlayer1.name = p1;
      setPlayer1(dummyPlayer1);
    }
    if (p2.length > 0) {
      dummyPlayer2.name = p2;
      setPlayer2(dummyPlayer2);
    }
    const dummyCurrentPlayer = {...currentPlayer};
    setCurrentPlayer(dummyCurrentPlayer);
    closeSettingsComp();
  };

  const rotateSettingButtonAnim = useRef(new Animated.Value(0)).current;

  const rotateRight = () => {
    Animated.timing(rotateSettingButtonAnim, {
      toValue: 0,
      duration: animationDuration,
      useNativeDriver: true,
    }).start();
  };

  const rotateLeft = () => {
    Animated.timing(rotateSettingButtonAnim, {
      toValue: 1,
      duration: animationDuration,
      useNativeDriver: true,
    }).start();
  };

  const toolButtonsData = [
    {
      id: 1,
      title: 'RESET',
      onPressHandler: initializeGameState,
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
          setGameStatus(currentGameStatus);
          setGameBoardMatrix(updatedGameBoard);
        }
      },
    },
  ];

  function openSettingsComp() {
    rotateLeft();
    setIsSettingsOpen(true);
  }

  function closeSettingsComp() {
    rotateRight();
    setIsSettingsOpen(false);
  }

  function initializeGameState() {
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
    setCurrentPlayer(player1);

    setGameBoardMatrix([
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ]);
    setGameStatus('Please start the game!');
  }

  const handleBackButtonClick = () => {
    initializeGameState();
    navigation.goBack();
  };

  const invertPlayer = (playerToInvert, currentGameStatus) => {
    if (
      currentGameStatus.split(' ').indexOf('wins.') !== -1 ||
      gameStack.length >= 9
    ) {
    } else if (playerToInvert.index === 0) {
      setCurrentPlayer(player2);
    } else if (playerToInvert.index === 1) {
      setCurrentPlayer(player1);
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
          winPlayer = player === 0 ? player1 : player2;
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <View style={styles.backButton}>
          <TouchableOpacity onPress={handleBackButtonClick}>
            <Image source={backIcon} style={styles.headerIconStyle} />
          </TouchableOpacity>
        </View>
        <Text style={styles.textH2}>{` Tic Tac Toe `}</Text>
        <Animated.View
          style={[
            styles.settingsButton,
            {
              transform: [
                {
                  rotate: rotateSettingButtonAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '90deg'],
                  }),
                },
              ],
            },
          ]}>
          <TouchableOpacity onPress={openSettingsComp}>
            <Image source={settingsIcon} style={styles.headerIconStyle} />
          </TouchableOpacity>
        </Animated.View>
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
            <Text style={styles.textStatsVal}>
              {gameStatus.split(' ').indexOf('win.') !== -1 ||
              gameStack.length >= 9
                ? 'No one, as game is over.'
                : currentPlayer.name}
            </Text>
          </View>
          <View style={styles.statsRow}>
            <Text style={styles.textStatsKey}>{`Game Status: `}</Text>
            <Text style={styles.textStatsVal}>{gameStatus}</Text>
          </View>
        </View>
      </View>
      {isSettingsOpen && (
        <SettingsComp
          open={isSettingsOpen}
          onClose={closeSettingsComp}
          players={{player1: player1, player2: player2}}
          updatePlayersInfo={updatePlayers}
        />
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    flex: 1,
    backgroundColor: '#fff',
    // position: 'absolute',
  },
  header: {
    flex: 1,
    display: 'flex',
    marginHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: '9.5%',
    height: '55%',
  },
  settingsButton: {
    width: '9.5%',
    height: '55%',
  },
  headerIconStyle: {
    resizeMode: 'contain',
    height: '100%',
    width: '100%',
  },
  textH2: {
    textAlign: 'center',
    fontSize: 38,
    flex: 1,
    color: '#444',
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
