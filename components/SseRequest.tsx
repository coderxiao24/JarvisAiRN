import {useEffect, useState, useRef} from 'react';
import {
  Text,
  View,
  Alert,
  useWindowDimensions,
  ScrollView,
  Button,
} from 'react-native';
import EventSource from 'react-native-sse';
import marked from 'marked';
import RenderHtml from 'react-native-render-html';

export default function App() {
  const [text, setText] = useState<string>('');

  const {width} = useWindowDimensions();

  const eventSourceRef = useRef(null);

  useEffect(() => {
    return () => {
      handleDisconnect();
    };
  }, []);

  // 清理SSE连接和监听器的函数
  const handleDisconnect = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.removeAllEventListeners();
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  };
  const chat = () => {
    if (!eventSourceRef.current) {
      setText('');
      eventSourceRef.current = new EventSource('http://123.57.91.8:1126/chat', {
        headers: {'Content-Type': 'application/json'},
        method: 'POST',
        body: JSON.stringify({
          messages: [
            {
              content: '给我用markdown的语法的形式绘制一个随机的课程表',

              role: 'user',
            },
          ],
        }),
        // timeout: 0, //连接将在没有任何活动的情况下过期的时间（毫秒）。默认值：0（无超时）
        // timeoutBeforeConnection: 500, //在建立初始连接之前等待的时间（毫秒）。默认值：500
        pollingInterval: 0, //重新连接之间的时间（ms）。如果设置为0，则将禁用重新连接。默认值：5000
        lineEndingCharacter: null, //用于表示接收到的数据中的行尾的字符。常见值：LF（Unix/Linux）为'\n'，CRLF（Windows）为'\r\n'，CR（较旧的Mac）为'\r'。默认值：null（自动从事件中检测）
      });

      eventSourceRef.current.addEventListener('open', e => {
        console.log('sseOpen', e);
        setText('');
      });

      eventSourceRef.current.addEventListener('message', event => {
        console.log(event);
        if (event.data.length !== 0) {
          if (event.data === '[DONE]') {
            console.log('结束了');
            console.log(marked.parse(text));

            handleDisconnect();
            return;
          }

          let data;
          try {
            data = JSON.parse(event.data);
          } catch (error) {
            console.log('parse错了', event.data);
            handleDisconnect();
            return;
          }

          if (data.choices[0].finish_reason === 'stop') {
            console.log('结束了');
            handleDisconnect();
            return;
          }

          const value = data.choices[0].delta.content;
          if (value) {
            console.log('sse消息：', value);
            setText(text => {
              return text + value;
            });
          }
        }
      });

      eventSourceRef.current.addEventListener('error', event => {
        console.log('sse报错了', event);
        handleDisconnect();
      });
      eventSourceRef.current.addEventListener('close', event => {
        console.log('sse关闭了', event);
        handleDisconnect();
      });
    }
  };

  return (
    <View>
      <Button title="聊天" onPress={chat} />
      {/* <Text>{marked.parse(text)}</Text> */}
      <RenderHtml contentWidth={300} source={{html: marked.parse(text)}} />
    </View>
  );
}
