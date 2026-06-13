import { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';

const STORAGE_KEY = 'comic_tracker_data';

interface StorageData {
  comics: any[];
  remindSettings: any;
  lastUpdate: string;
}

export const useStorage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [storageData, setStorageData] = useState<StorageData | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      const data = Taro.getStorageSync(STORAGE_KEY);
      if (data) {
        setStorageData(JSON.parse(data));
      }
      setIsLoaded(true);
    } catch (error) {
      console.error('[Storage] Load error:', error);
      setIsLoaded(true);
    }
  };

  const saveData = (data: StorageData) => {
    try {
      const jsonData = JSON.stringify({
        ...data,
        lastUpdate: new Date().toISOString()
      });
      Taro.setStorageSync(STORAGE_KEY, jsonData);
      setStorageData(data);
    } catch (error) {
      console.error('[Storage] Save error:', error);
    }
  };

  const clearData = () => {
    try {
      Taro.removeStorageSync(STORAGE_KEY);
      setStorageData(null);
    } catch (error) {
      console.error('[Storage] Clear error:', error);
    }
  };

  return {
    isLoaded,
    storageData,
    saveData,
    clearData
  };
};
