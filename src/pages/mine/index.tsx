import React, { useEffect, useState } from 'react';
import { View, Text, Button, Picker } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useComicContext } from '../../store/ComicContext';
import { generateComicShareText } from '../../utils/helpers';
import styles from './index.module.scss';

const MinePage: React.FC = () => {
  const { comics, statistics, remindSettings, setRemindSettings, isLoading, comics: allComics } = useComicContext();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isLoading && allComics.length >= 0) {
      setIsReady(true);
    }
  }, [isLoading, allComics]);

  const handleShare = () => {
    const shareText = generateComicShareText(allComics);
    Taro.setClipboardData({
      data: shareText,
      success: () => {
        Taro.showModal({
          title: '分享成功',
          content: '追更清单已复制到剪贴板，快去分享给好友吧！',
          showCancel: false
        });
      }
    });
  };

  const handleToggleRemind = () => {
    setRemindSettings({
      ...remindSettings,
      enabled: !remindSettings.enabled
    });
    Taro.showToast({
      title: remindSettings.enabled ? '已关闭提醒' : '已开启提醒',
      icon: 'success'
    });
  };

  if (!isReady) {
    return (
      <View className={styles.container}>
        <View className={styles.header}>
          <Text className={styles.title}>我的追更</Text>
          <Text className={styles.subtitle}>加载中...</Text>
        </View>
        <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '200rpx' }}>
          <Text style={{ fontSize: '28rpx', color: '#636E72' }}>正在加载数据...</Text>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.title}>我的追更</Text>
        <Text className={styles.subtitle}>管理你的追更设置和数据</Text>
      </View>

      <View className={styles.statsCard}>
        <Text className={styles.cardTitle}>追更统计</Text>
        <View className={styles.statsGrid}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{statistics.totalComics}</Text>
            <Text className={styles.statLabel}>总作品</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{statistics.activeComics}</Text>
            <Text className={styles.statLabel}>连载中</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{statistics.highPriorityCount}</Text>
            <Text className={styles.statLabel}>高优先级</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{statistics.weeklyReads}</Text>
            <Text className={styles.statLabel}>本周已读</Text>
          </View>
        </View>
      </View>

      <View className={styles.statsCard}>
        <Text className={styles.cardTitle}>作品状态分布</Text>
        <View style={{ display: 'flex', justifyContent: 'space-around', marginTop: '24rpx' }}>
          <View style={{ textAlign: 'center' }}>
            <Text style={{ fontSize: '48rpx', fontWeight: 'bold', color: '#00B894' }}>
              {statistics.activeComics}
            </Text>
            <Text style={{ fontSize: '24rpx', color: '#636E72', display: 'block', marginTop: '8rpx' }}>
              连载中
            </Text>
          </View>
          <View style={{ textAlign: 'center' }}>
            <Text style={{ fontSize: '48rpx', fontWeight: 'bold', color: '#FDCB6E' }}>
              {statistics.hiatusComics}
            </Text>
            <Text style={{ fontSize: '24rpx', color: '#636E72', display: 'block', marginTop: '8rpx' }}>
              休刊
            </Text>
          </View>
          <View style={{ textAlign: 'center' }}>
            <Text style={{ fontSize: '48rpx', fontWeight: 'bold', color: '#74B9FF' }}>
              {statistics.finishedComics}
            </Text>
            <Text style={{ fontSize: '24rpx', color: '#636E72', display: 'block', marginTop: '8rpx' }}>
              已完结
            </Text>
          </View>
          <View style={{ textAlign: 'center' }}>
            <Text style={{ fontSize: '48rpx', fontWeight: 'bold', color: '#E17055' }}>
              {statistics.discontinuedComics}
            </Text>
            <Text style={{ fontSize: '24rpx', color: '#636E72', display: 'block', marginTop: '8rpx' }}>
              已断更
            </Text>
          </View>
        </View>
      </View>

      <View className={styles.shareCard}>
        <Text className={styles.shareTitle}>分享追更清单</Text>
        <Text className={styles.shareDesc}>
          将你的追更列表分享给好友，一起交流讨论！
        </Text>
        <Button className={styles.shareBtn} onClick={handleShare}>
          复制分享文案
        </Button>
      </View>

      <View className={styles.settingsSection}>
        <Text className={styles.cardTitle}>提醒设置</Text>
        
        <View className={styles.settingItem}>
          <View className={styles.settingLeft}>
            <Text className={styles.settingLabel}>新章节提醒</Text>
            <Text className={styles.settingDesc}>有新章节更新时通知你</Text>
          </View>
          <View 
            className={`${styles.switch} ${remindSettings.enabled ? styles.active : ''}`}
            onClick={handleToggleRemind}
          >
            <View className={`${styles.switchDot} ${remindSettings.enabled ? styles.active : ''}`} />
          </View>
        </View>

        <View className={styles.settingItem}>
          <View className={styles.settingLeft}>
            <Text className={styles.settingLabel}>提前提醒</Text>
            <Text className={styles.settingDesc}>更新前提醒章节数</Text>
          </View>
          <Picker
            mode='selector'
            range={['1章', '2章', '3章', '5章']}
            onChange={(e) => {
              const values = [1, 2, 3, 5];
              setRemindSettings({
                ...remindSettings,
                beforeChapters: values[e.detail.value]
              });
            }}
          >
            <View className={styles.picker}>
              {remindSettings.beforeChapters}章
            </View>
          </Picker>
        </View>
      </View>

      <View className={styles.menuCard}>
        <Text className={styles.cardTitle}>其他设置</Text>
        
        <View className={styles.menuItem}>
          <View className={styles.menuLeft}>
            <Text className={styles.menuIcon}>🎨</Text>
            <Text className={styles.menuText}>外观设置</Text>
          </View>
          <Text className={styles.menuArrow}>›</Text>
        </View>

        <View className={styles.menuItem}>
          <View className={styles.menuLeft}>
            <Text className={styles.menuIcon}>🔔</Text>
            <Text className={styles.menuText}>通知偏好</Text>
          </View>
          <Text className={styles.menuArrow}>›</Text>
        </View>

        <View className={styles.menuItem}>
          <View className={styles.menuLeft}>
            <Text className={styles.menuIcon}>💾</Text>
            <Text className={styles.menuText}>数据备份</Text>
          </View>
          <Text className={styles.menuArrow}>›</Text>
        </View>

        <View className={styles.menuItem}>
          <View className={styles.menuLeft}>
            <Text className={styles.menuIcon}>ℹ️</Text>
            <Text className={styles.menuText}>关于我们</Text>
          </View>
          <Text className={styles.menuArrow}>›</Text>
        </View>
      </View>
    </View>
  );
};

export default MinePage;
