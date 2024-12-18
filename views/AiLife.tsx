import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  useWindowDimensions,
  TextInput,
  Image,
  Pressable,
  Button,
  Animated,
  TouchableHighlight,
  Easing,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {px as $px, chat} from '../utils/index';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
const audioRecorderPlayer = new AudioRecorderPlayer();
import RNFetchBlob from 'rn-fetch-blob';

import {fetchEventSource} from '@microsoft/fetch-event-source';
import BottomModal from '../components/BottomModal';

import marked from 'marked';
import RenderHtml from 'react-native-render-html';
export default function AiLife() {
  const window = useWindowDimensions();
  const px = num => $px(num, window);

  const chatContainerRef = useRef(null);
  const BottomModalRef = useRef(null);

  const [text, setText] = useState('');

  const [actionBtns, setActionBtns] = useState([
    {
      name: '生活指令',
      icon: require(`../assets/lifeIns.png`),
      clickHandle(name) {
        if (BottomModalRef.current) {
          BottomModalRef.current.showModal(name);
        }
      },
    },
    {
      name: '图片生成',
      icon: require(`../assets/photo.png`),
      clickHandle(name) {
        if (BottomModalRef.current) {
          BottomModalRef.current.showModal(name);
        }
      },
    },
    {
      name: '中英翻译',
      icon: require(`../assets/translate.png`),
      clickHandle(name) {
        if (BottomModalRef.current) {
          BottomModalRef.current.showModal(name);
        }
      },
    },
    {
      name: '文本创意',
      icon: require(`../assets/textCreativity.png`),
      clickHandle(name) {
        if (BottomModalRef.current) {
          BottomModalRef.current.showModal(name);
        }
      },
    },
  ]);

  const [moreVisible, setMoreVisible] = useState(false);
  const [inputFocus, setInputFocus] = useState(false);

  const [moreBtns, setMoreBtns] = useState([
    {
      name: '拍照',
      icon: require(`../assets/camera.png`),
      clickHandle(name) {
        if (BottomModalRef.current) {
          BottomModalRef.current.showModal(name);
        }
      },
    },
    {
      name: '照片',
      icon: require(`../assets/picture.png`),
      clickHandle(name) {
        if (BottomModalRef.current) {
          BottomModalRef.current.showModal(name);
        }
      },
    },
    {
      name: '文件',
      icon: require(`../assets/files.png`),
      clickHandle(name) {
        if (BottomModalRef.current) {
          BottomModalRef.current.showModal(name);
        }
      },
    },
    {
      name: '通话',
      icon: require(`../assets/call.png`),
      clickHandle(name) {
        if (BottomModalRef.current) {
          BottomModalRef.current.showModal(name);
        }
      },
    },
  ]);

  const [messages, setMessages] = useState([]);

  const send = () => {
    const content = text;
    setText('');

    const value = messages
      .concat({
        content,
        role: 'user',
      })
      .filter(v => v.type !== 'audio');
    setMessages(value);
    toChat(value);
  };

  const toChat = value => {
    const aiMsg = {role: 'assistant', content: ''};
    console.log('入参', JSON.parse(JSON.stringify(value)));
    chat({
      messages: JSON.parse(JSON.stringify(value)),
      onMessage(newMessage) {
        setMessages([...value.slice(0, value.length - 1), newMessage]);
      },
      onEnd(newMessage) {
        console.log('结束', newMessage);
      },
      onErr(err) {
        console.log('错误', err);
      },
      onOpen() {
        value = value.concat(aiMsg);
        setMessages(value);
      },
    });
  };
  const [modalVisible, setModalVisible] = useState(false);
  useEffect(() => {
    console.log('初始化');

    chatContainerRef.current.scrollToEnd({animated: true});
    audioRecorderPlayer.addRecordBackListener(e => {
      console.log('正在录制', e);
    });
    return () => {
      audioRecorderPlayer.removeRecordBackListener();
    };
  }, []);

  useEffect(() => {
    chatContainerRef.current.scrollToEnd({animated: true});
  }, [messages]);

  const placeholderContainerHeight = useRef(new Animated.Value(px(30))).current;
  const rotation = useRef(new Animated.Value(0)).current;

  const [recording, setRecording] = useState(false);
  const [audioInfo, setAudioInfo] = useState({});

  // 开始录制
  const startRecording = async () => {
    setRecording(true);
    setModalVisible(true);
    try {
      const recordingPath = `${
        RNFetchBlob.fs.dirs.DocumentDir
      }/${Date.now()}_sound.mp4`;
      const path = await audioRecorderPlayer.startRecorder(recordingPath);

      setAudioInfo({...audioInfo, path, startTime: Date.now()});
      console.log('Started recording at:', path);
    } catch (err) {
      console.error(err);
    }
  };

  // 结束录制
  const stopRecording = async () => {
    setRecording(false);
    setModalVisible(false);
    try {
      const result = await audioRecorderPlayer.stopRecorder();

      let duration = ((Date.now() - audioInfo.startTime) / 1000).toFixed();

      const minutes = Math.floor(duration / 60);
      const seconds = Math.floor(duration % 60);
      duration = `${minutes ? minutes + "'" : ''}${seconds}"`;

      setMessages(messages => {
        return messages.concat([
          {
            type: 'audio',
            content: result,
            role: 'user',
            duration,
          },
          {
            type: 'audio',
            role: 'assistant',
            content: '我现在还不会处理语音哦~',
          },
        ]);
      });
      setAudioInfo({});
      console.log('Stopped recording at:', result);
    } catch (err) {
      console.error(err);
    }
  };

  // 开始播放
  const onStartPlay = async url => {
    console.log('onStartPlay');
    const msg = await audioRecorderPlayer.startPlayer(url);
    console.log(msg);
  };

  // 旋转插值器
  const interpolateRotation = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', `${180 + 45}deg`],
  });

  const styles = StyleSheet.create({
    chatContainer: {
      paddingHorizontal: px(50),
    },
    aiMessageContainer: {
      paddingHorizontal: px(40),
      paddingVertical: px(25),
      backgroundColor: 'rgb(235,235,235)',
      marginTop: px(60),
      borderTopLeftRadius: px(32.77),
      borderTopRightRadius: px(32.77),
      borderBottomRightRadius: px(32.77),
      alignSelf: 'flex-start',
      maxWidth: '90%',
    },
    userMessageContainer: {
      paddingHorizontal: px(40),
      paddingVertical: px(25),
      backgroundColor: 'rgb(0,137,255)',
      marginTop: px(60),
      borderTopLeftRadius: px(32.77),
      borderTopRightRadius: px(32.77),
      borderBottomLeftRadius: px(32.77),
      alignSelf: 'flex-end',
      maxWidth: '90%',
    },
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    popup: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: px(300),
      backgroundColor: 'white',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: px(44),
    },
  });

  return (
    <View style={{flex: 1}}>
      {/* 聊天 */}

      <ScrollView style={[styles.chatContainer]} ref={chatContainerRef}>
        {messages.length ? (
          messages.map((v, i) => {
            return (
              <View
                key={i}
                style={
                  v.role === 'assistant'
                    ? styles.aiMessageContainer
                    : styles.userMessageContainer
                }>
                {v.type === 'audio' && v.role === 'user' ? (
                  <Pressable
                    // 语音按钮
                    onPress={() => onStartPlay(v.content)}
                    hitSlop={px(12)}
                    style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text
                      style={{
                        color:
                          v.role === 'assistant' ? 'rgb(56,56,56)' : '#fff',
                        fontWeight: 400,
                        lineHeight: px(42),
                        fontSize: px(32),
                      }}>
                      {v.duration}
                    </Text>
                    <Image
                      style={{width: px(44), height: px(44)}}
                      source={require('../assets/audio.png')}
                    />
                  </Pressable>
                ) : (
                  <RenderHtml
                    source={{html: marked.parse(v.content)}}
                    tagsStyles={{
                      p: {
                        margin: 0,
                        padding: 0,
                        color:
                          v.role === 'assistant' ? 'rgb(56,56,56)' : '#fff',
                        fontWeight: 400,
                        lineHeight: px(42),
                        fontSize: px(32),
                      },
                      table: {
                        borderWidth: 1,
                        borderColor: '#000', // 黑色边框
                        borderStyle: 'solid',
                      },
                      td: {
                        borderWidth: 1,
                        borderColor: '#000', // 黑色边框
                        borderStyle: 'solid',
                        padding: 5, // 给单元格一点内边距
                      },
                      th: {
                        borderWidth: 1,
                        borderColor: '#000', // 黑色边框
                        borderStyle: 'solid',
                        padding: 5, // 给表头一点内边距
                        backgroundColor: '#f2f2f2', // 浅灰色背景
                      },
                      code: {
                        backgroundColor: '#1E1E1E', // VSCode 深色主题背景色
                        color: '#D4D4D4', // 主要文本颜色
                        fontSize: 14,
                        fontFamily: 'monospace', // 使用等宽字体
                        padding: 8,
                        borderRadius: 4,
                        borderWidth: 1,
                        borderColor: '#4d4d4c', // 边框颜色
                        overflow: 'scroll', // 如果内容超出则滚动
                      },
                      // 如果需要为 <pre> 标签也设置样式
                      pre: {
                        backgroundColor: '#1E1E1E',
                        padding: 10,
                        borderRadius: 4,
                        borderWidth: 1,
                        borderColor: '#4d4d4c',
                        overflow: 'scroll',
                      },
                    }}
                  />
                )}
              </View>
            );
          })
        ) : (
          <View style={styles.aiMessageContainer}>
            <RenderHtml
              source={{
                html: marked.parse(
                  '你好，我是托尼的贾维斯，有什么问题吗小蜘蛛？',
                ),
              }}
              tagsStyles={{
                p: {
                  margin: 0,
                  padding: 0,
                  color: 'rgb(56,56,56)',
                  fontWeight: 400,
                  lineHeight: px(42),
                  fontSize: px(32),
                },
              }}
            />
          </View>
        )}

        {/* <Text> {recording ? '松开以发送' : '按住说话'}</Text>

        <Text>{audioInfo}</Text>
        <Button title="播放" onPress={onStartPlay} /> */}
      </ScrollView>

      {/* 操作区 */}
      <View>
        <View style={{position: 'relative'}}>
          {/* 操作按钮 */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View
              style={{
                paddingHorizontal: px(22),
                flexDirection: 'row',
                marginVertical: px(30),
              }}>
              {actionBtns.map((v, i) => (
                <Pressable
                  key={i}
                  style={({pressed}) => ({
                    width: px(176),
                    height: px(64),
                    boxShadow: `0 ${px(2)} ${px(4)} rgba(0, 0, 0, 0.25)`,
                    borderRadius: px(16),
                    marginRight: i === actionBtns.length - 1 ? 0 : px(20),
                    backgroundColor: pressed ? '#f5f5f5' : '#fff',
                    transform: [{scale: pressed ? 0.95 : 1}],
                  })}
                  onPress={() => {
                    v.clickHandle(v.name);
                  }}>
                  <View
                    style={{
                      height: '100%',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-evenly',
                    }}>
                    <Image
                      style={{width: px(28), height: px(28)}}
                      source={v.icon}
                    />
                    <Text style={{fontSize: px(30)}}>{v.name}</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </ScrollView>

          {/* 输入框区域 */}
          <View style={{paddingHorizontal: px(20)}}>
            <View
              style={{
                height: px(96),
                borderRadius: px(48),
                boxShadow: `0 0 ${px(6)} rgba(0, 0, 0, 0.2)`,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: px(20),
              }}>
              <Animated.View
                style={{
                  transform: [{rotate: interpolateRotation}],
                  marginRight: px(10),
                }}>
                <Pressable
                  // 更多按钮
                  hitSlop={px(10)}
                  onPress={() => {
                    const changeVisible = () => setMoreVisible(!moreVisible);

                    const closeAnimation = () => {
                      const rotationAnimation = Animated.timing(rotation, {
                        toValue: 0,
                        duration: 300,
                        easing: Easing.out(Easing.exp),
                        useNativeDriver: true,
                      });

                      const heightAnimation = Animated.timing(
                        placeholderContainerHeight,
                        {
                          toValue: px(30),
                          duration: 300,
                          easing: Easing.out(Easing.exp),
                          useNativeDriver: false,
                        },
                      );

                      Animated.parallel([
                        rotationAnimation,
                        heightAnimation,
                      ]).start(() => {
                        changeVisible();
                      });
                    };

                    const openAnimation = () => {
                      const rotationAnimation = Animated.timing(rotation, {
                        toValue: 1,
                        duration: 300,
                        easing: Easing.out(Easing.exp),
                        useNativeDriver: true,
                      });

                      const heightAnimation = Animated.timing(
                        placeholderContainerHeight,
                        {
                          toValue: px(200),
                          duration: 300,
                          easing: Easing.out(Easing.exp),
                          useNativeDriver: false,
                        },
                      );

                      changeVisible();
                      Animated.parallel([
                        rotationAnimation,
                        heightAnimation,
                      ]).start();
                    };
                    if (moreVisible) closeAnimation();
                    else openAnimation();
                  }}>
                  <Image
                    style={{width: px(44), height: px(44)}}
                    source={require('../assets/more.png')}
                  />
                </Pressable>
              </Animated.View>
              <TextInput
                style={{
                  flex: 1,
                  fontSize: px(30),
                }}
                onChangeText={setText}
                value={text}
                onSubmitEditing={send}
                onBlur={() => setInputFocus(false)}
                onFocus={() => setInputFocus(true)}
                placeholder="Created by xkx with React Native."
              />
              {!moreVisible && !inputFocus && (
                <Pressable
                  // 语音按钮
                  onPressIn={startRecording}
                  onPressOut={stopRecording}
                  hitSlop={px(12)}>
                  <Image
                    style={{width: px(44), height: px(44), marginRight: px(24)}}
                    source={require('../assets/voice.png')}
                  />
                </Pressable>
              )}
              <Pressable
                // 发送按钮
                onPress={send}
                hitSlop={px(12)}>
                <Image
                  style={{width: px(50), height: px(50)}}
                  source={require('../assets/send.png')}
                />
              </Pressable>
            </View>
          </View>

          {/* '更多'容器 */}
          {moreVisible && (
            <View
              style={{
                position: 'absolute',
                bottom: px(-200),
                width: '100%',
                height: px(200),
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                paddingTop: px(30),
                paddingBottom: px(45),
                zIndex: 999999,
              }}>
              {moreBtns.map((v, i) => (
                <Pressable
                  key={i}
                  style={({pressed}) => ({
                    width: px(162),
                    borderRadius: px(16),
                    backgroundColor: pressed ? '#e5e5e5' : '#F2F2F2',
                    transform: [{scale: pressed ? 0.95 : 1}],
                  })}
                  onPress={() => {
                    v.clickHandle(v.name);
                  }}>
                  <View
                    style={{
                      height: '100%',
                      alignItems: 'center',
                      justifyContent: 'space-evenly',
                    }}>
                    <Image
                      style={{width: px(54), height: px(54)}}
                      source={v.icon}
                    />
                    <Text style={{fontSize: px(24), color: '#555'}}>
                      {v.name}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          )}
        </View>
        {/* (更多)占位容器 */}
        <Animated.View
          style={{height: placeholderContainerHeight}}></Animated.View>
      </View>

      <BottomModal ref={BottomModalRef} />

      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
        <Animated.View style={[styles.popup]}>
          <Text>正在录音</Text>
        </Animated.View>
      </Modal>
    </View>
  );
}
