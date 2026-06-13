import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface StatusTagProps {
  status: 'active' | 'hiatus' | 'finished' | 'discontinued';
}

const StatusTag: React.FC<StatusTagProps> = ({ status }) => {
  const getStatusConfig = () => {
    const configs = {
      active: { label: '连载中', color: '#00B894' },
      hiatus: { label: '休刊', color: '#FDCB6E' },
      finished: { label: '已完结', color: '#74B9FF' },
      discontinued: { label: '已断更', color: '#E17055' }
    };
    return configs[status];
  };

  const config = getStatusConfig();

  return (
    <View className={styles.tag} style={{ backgroundColor: config.color }}>
      <Text className={styles.text}>{config.label}</Text>
    </View>
  );
};

export default StatusTag;
