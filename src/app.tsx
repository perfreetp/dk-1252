import React, { useEffect } from 'react';
import { useDidShow, useDidHide } from '@tarojs/taro';
import { ComicProvider } from './store/ComicContext';
import './app.scss';

function App(props) {
  useEffect(() => {});

  useDidShow(() => {});

  useDidHide(() => {});

  return (
    <ComicProvider>
      {props.children}
    </ComicProvider>
  );
}

export default App;
