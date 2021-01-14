import React from 'react';
import {TextInput} from 'react-native';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';

import {Button} from 'react-native-elements';

import * as Animatable from 'react-native-animatable';
import {useState} from 'react/cjs/react.development';
const AnimatableTouchableWithoutFeedback = Animatable.createAnimatableComponent(
  TouchableWithoutFeedback,
);

const slideInAnimation = {
  0: {transform: [{translateX: '400%'}]},
  1: {transform: [{translateX: '0%'}]},
};

const slideOutAnimation = {
  0: {transform: [{translateX: '0%'}]},
  1: {transform: [{translateX: '400%'}]},
};

const animationDuration = 200;

const SettingsComp = ({players, open, onClose, updatePlayersInfo}) => {
  const [animationType, setAnimationType] = useState(slideInAnimation);
  const [p1, setP1] = useState(players.player1.name);
  const [p2, setP2] = useState(players.player2.name);

  const handleP1Change = (name) => {
    setP1(name);
  };
  const handleP2Change = (name) => {
    setP2(name);
  };

  const hideModal = () => {
    setAnimationType(slideOutAnimation);
    let timer = setTimeout(() => {
      onClose();
      clearTimeout(timer);
    }, animationDuration - 100);
  };

  const handleSettingsOnSave = () => {
    updatePlayersInfo(p1, p2);
  };

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={open}
      onRequestClose={hideModal}
      onDismiss={hideModal}>
      <TouchableWithoutFeedback onPress={hideModal} accessible={true}>
        <Animatable.View useNativeDriver style={styles.settingsContainer}>
          <AnimatableTouchableWithoutFeedback
            accessible={true}
            animation={animationType}
            duration={animationDuration}
            useNativeDriver
            onPress={(e) => {
              e.stopPropagation();
            }}>
            <View style={styles.settingsMain}>
              <View style={styles.settingsHeader}>
                <Text style={styles.settingsHeaderText}>Settings</Text>
              </View>
              <View style={styles.settingsBody}>
                <View style={styles.eachRow}>
                  <Text style={styles.eachRowKey}>{`Player 1:`}</Text>
                  <TextInput
                    placeholder={players.player1.name}
                    onChange={(e) => handleP1Change(e.nativeEvent.text)}
                    style={styles.eachRowVal}
                  />
                </View>
                <View style={styles.eachRow}>
                  <Text style={styles.eachRowKey}>{`Player 2:`}</Text>
                  <TextInput
                    placeholder={players.player2.name}
                    onChange={(e) => handleP2Change(e.nativeEvent.text)}
                    style={styles.eachRowVal}
                  />
                </View>
                <View style={styles.saveButton}>
                  <Button
                    title={'Save'}
                    type={'solid'}
                    raised
                    onPress={handleSettingsOnSave}
                  />
                </View>
              </View>
            </View>
          </AnimatableTouchableWithoutFeedback>
        </Animatable.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  settingsContainer: {
    zIndex: 10,
    flex: 1,
  },
  settingsMain: {
    marginTop: '20%',
    flex: 1,
    backgroundColor: '#f5f5f5',
    opacity: 0.9,
  },
  settingsHeader: {},
  settingsHeaderText: {
    paddingVertical: 7,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 22,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#ddd',
    color: '#444',
    fontWeight: 'bold',
  },
  settingsBody: {
    flex: 1,
    padding: 20,
  },
  eachRow: {
    display: 'flex',
    flexDirection: 'row',
    marginVertical: 5,
  },
  eachRowKey: {
    flex: 1,
    fontSize: 16,
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  eachRowVal: {
    flex: 3,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 12,
  },
  saveButton: {
    marginVertical: 20,
  },
});

export default SettingsComp;
