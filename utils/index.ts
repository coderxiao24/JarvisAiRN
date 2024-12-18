// 导出变量
import {Dimensions} from 'react-native';
import EventSource from 'react-native-sse';

export function px(
  pxValue,
  window = Dimensions.get('window'),
  DESIGN_WIDTH = 750,
) {
  const width = window.width;
  const scale = width / DESIGN_WIDTH; // 计算比例
  return pxValue * scale;
  return;
}

// 清理SSE连接和监听器的函数
const handleDisconnect = eventSource => {
  if (eventSource) {
    eventSource.removeAllEventListeners();
    eventSource.close();
    eventSource = null;
  }
};

export function chat({messages, onMessage, onEnd, onErr, onOpen}) {
  const newMessage = {role: 'assistant', content: ''};

  let eventSource = new EventSource('http://123.57.91.8:1126/chat', {
    headers: {'Content-Type': 'application/json'},
    method: 'POST',
    body: JSON.stringify({
      messages,
    }),
  });

  eventSource.addEventListener('open', e => {
    onOpen();
  });

  eventSource.addEventListener('message', event => {
    if (event.data.length !== 0) {
      if (event.data === '[DONE]') {
        onEnd({...newMessage});
        handleDisconnect(eventSource);
        return;
      }

      let data;
      try {
        data = JSON.parse(event.data);
      } catch (error) {
        handleDisconnect(eventSource);
        onErr('parse错了' + event.data);
        return;
      }

      if (data.choices[0].finish_reason === 'stop') {
        handleDisconnect(eventSource);
        onEnd({...newMessage});
        return;
      }

      const value = data.choices[0].delta.content;
      if (value) {
        newMessage.content += value;
        onMessage({...newMessage});
      }
    }
  });

  eventSource.addEventListener('error', event => {
    handleDisconnect(eventSource);
    onErr(event);
  });
  eventSource.addEventListener('close', event => {
    handleDisconnect(eventSource);
    onErr(event);
  });
}
