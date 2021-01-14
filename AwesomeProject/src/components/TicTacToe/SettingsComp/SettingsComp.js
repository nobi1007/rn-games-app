import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';

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

const SettingsComp = ({open, onClose}) => {
  const [animationType, setAnimationType] = useState(slideInAnimation);

  const hideModal = () => {
    setAnimationType(slideOutAnimation);
    let timer = setTimeout(() => {
      onClose();
      clearTimeout(timer);
    }, animationDuration - 100);
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
                <Text>All settings starts here</Text>
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
  },
});

export default SettingsComp;
