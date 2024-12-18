import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useRef,
} from 'react';
import {
  View,
  Text,
  Button,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
  useWindowDimensions,
  Easing,
  ScrollView,
  Pressable,
} from 'react-native';

import {px as $px} from '../utils/index';

const BottomModal = (props, ref) => {
  const window = useWindowDimensions();
  const px = num => $px(num, window);

  const [modalVisible, setModalVisible] = useState(false);
  const [slideAnimation] = useState(new Animated.Value(px(810)));
  const [title, setTitle] = useState('标题');
  const contentRef = useRef(null);

  useEffect(() => {
    console.log(contentRef.current);
  }, []);

  const showModal = currentTitle => {
    setTitle(currentTitle);
    setModalVisible(true);
    Animated.timing(slideAnimation, {
      toValue: 0,
      duration: 250,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  };

  const hideModal = () => {
    Animated.timing(slideAnimation, {
      toValue: px(810),
      duration: 250,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };
  useImperativeHandle(ref, () => ({
    showModal,
    hideModal,
  }));

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    popup: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      height: px(810),
      backgroundColor: 'white',
      borderTopLeftRadius: px(44),
      borderTopRightRadius: px(44),
    },
  });

  return (
    <Modal transparent={true} visible={modalVisible} onRequestClose={hideModal}>
      <TouchableWithoutFeedback onPress={hideModal}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      <Animated.View
        style={[
          styles.popup,
          {paddingTop: px(40), transform: [{translateY: slideAnimation}]},
        ]}>
        <View
          style={{
            alignItems: 'center',
            position: 'relative',
          }}>
          <Text style={{fontSize: px(36)}}>{title}</Text>
          <Pressable
            onPress={hideModal}
            hitSlop={px(12)}
            style={{
              position: 'absolute',
              right: px(36),

              top: '50%',
              transform: [{translateY: '-50%'}],
            }}>
            <Text
              style={{
                fontSize: px(52),
              }}>
              x
            </Text>
          </Pressable>
        </View>
      </Animated.View>
    </Modal>
  );
};

export default forwardRef(BottomModal);
