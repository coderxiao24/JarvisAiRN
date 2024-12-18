import React, {useRef} from 'react';
import {View, Text, Button, Animated, StyleSheet} from 'react-native';

const HeightAnimationExample = () => {
  const heightAnim = useRef(new Animated.Value(0)).current;
  const [visible, setVisible] = React.useState(false);

  const toggleBox = () => {
    if (visible) {
      // 隐藏
      Animated.timing(heightAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false, // 使用 'false'，因为 height 不支持原生驱动
      }).start(() => setVisible(false)); // 动画结束后更新状态
    } else {
      // 显示
      setVisible(true);
      heightAnim.setValue(0); // 重置高度
      Animated.timing(heightAnim, {
        toValue: 100, // 设置想要的高度
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  return (
    <View style={styles.container}>
      <Button title={visible ? 'Hide Box' : 'Show Box'} onPress={toggleBox} />
      <Animated.View style={[styles.box, {height: heightAnim}]}>
        {visible && <Text style={styles.text}>Hello, I am a box!</Text>}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    backgroundColor: 'skyblue',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', // 确保内容不超出边框
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
});

export default HeightAnimationExample;
