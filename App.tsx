import React, {useEffect} from 'react';

import {SafeAreaView, useWindowDimensions, StatusBar} from 'react-native';
import AiLife from './views/AiLife';
import TestMicValue from './components/TestMicValue';
import AnimatedTest from './components/AnimatedTest.tsx';
import ModalTest from './components/ModalTest.tsx';
import Ctest from './components/Ctest.tsx';
import SseRequest from './components/SseRequest.tsx';
function App(): React.JSX.Element {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <AiLife />
      {/* <TestMicValue /> */}
      {/* <AnimatedTest /> */}
      {/* <ModalTest /> */}
      {/* <Ctest /> */}
      {/* <SseRequest /> */}
    </SafeAreaView>
  );
}

export default App;
