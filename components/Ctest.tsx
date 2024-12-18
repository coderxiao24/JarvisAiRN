import React, {useRef} from 'react';
import {View, StyleSheet, PanResponder, Text} from 'react-native';

const SWIPE_THRESHOLD = 50; // 定义上划的最小距离阈值

// 测试手势事件的组件
const App = () => {
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // 只有当触碰发生在 box 内部时才开始监听手势
        return true; // 允许所有触摸事件被此组件处理
      },
      onPanResponderGrant: () => {
        console.log('Gesture started inside the box');
      },
      onPanResponderMove: (evt, gestureState) => {
        // evt.nativeEvent 页面坐标
        const {locationX, locationY} = evt.nativeEvent;
        // console.log('Current finger position:', locationX, locationY);

        // 检查是否是上划
        if (gestureState.dy < -SWIPE_THRESHOLD) {
          console.log('上划!');
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        console.log('Gesture ended');

        // 在手指离开屏幕时再次检查是否是上划
        if (gestureState.dy < -SWIPE_THRESHOLD) {
          console.log('结束时候上划!');
        }
      },
    }),
  ).current;

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Move your finger in this box!</Text>
      <View
        style={styles.box}
        {...panResponder.panHandlers} // 将 PanResponder 的处理器传递给 View
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 14,
    lineHeight: 24,
    fontWeight: 'bold',
  },
  box: {
    height: 150,
    width: 150,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
});

export default App;
