import React, { useEffect, useState } from 'react';
import { View, Text, Image, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useComicContext } from '../../store/ComicContext';
import { Comic } from '../../types/comic';
import styles from './index.module.scss';

const CalendarPage: React.FC = () => {
  const { 
    comics, 
    statistics, 
    isLoading, 
    getUnreadComics,
    comics: allComics
  } = useComicContext();
  
  const today = new Date().getDay();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isLoading && allComics.length > 0) {
      setIsReady(true);
    }
  }, [isLoading, allComics]);

  const todayUnreadComics = allComics.filter(c => 
    c.updateDay === today && 
    c.status === 'active' && 
    c.hasNewChapter
  );

  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

  const handleComicClick = (comic: Comic) => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${comic.id}`
    });
  };

  const getDayUnreadComics = (day: number) => {
    return allComics.filter(c => 
      c.updateDay === day && 
      c.status === 'active' && 
      c.hasNewChapter
    );
  };

  if (!isReady) {
    return (
      <View className={styles.container}>
        <View className={styles.header}>
          <Text className={styles.title}>更新日历</Text>
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
        <Text className={styles.title}>更新日历</Text>
        <Text className={styles.subtitle}>查看每周漫画更新安排</Text>
      </View>

      <View className={styles.calendarCard}>
        <View className={styles.todaySection}>
          <Text className={styles.sectionTitle}>
            今日待读
            <Text className={styles.todayBadge}>今天</Text>
          </Text>
          {todayUnreadComics.length > 0 ? (
            <View className={styles.todayComics}>
              {todayUnreadComics.map(comic => (
                <View 
                  key={comic.id} 
                  className={styles.comicItem}
                  onClick={() => handleComicClick(comic)}
                >
                  <Image 
                    className={styles.comicCover}
                    src={comic.cover}
                    mode='aspectFill'
                  />
                  <View className={styles.comicInfo}>
                    <Text className={styles.comicTitle}>{comic.title}</Text>
                    <Text className={styles.comicMeta}>
                      {comic.platform} · 第{comic.latestChapter}话
                    </Text>
                  </View>
                  <Text className={styles.newTag}>NEW</Text>
                </View>
              ))}
            </View>
          ) : (
            <View className={styles.noComics}>
              <Text>今天没有未读更新哦～</Text>
              <Text style={{ fontSize: '24rpx', color: '#B2BEC3', marginTop: '8rpx', display: 'block' }}>
                已读完所有今日更新
              </Text>
            </View>
          )}
        </View>
      </View>

      <View className={styles.calendarSection}>
        <View className={styles.weekNav}>
          <Button className={styles.navBtn}>◀ 上周</Button>
          <Text className={styles.weekDisplay}>本周更新日历</Text>
          <Button className={styles.navBtn}>下周 ▶</Button>
        </View>

        <ScrollView scrollX>
          <View style={{ display: 'flex', gap: '16rpx', padding: '0 16rpx' }}>
            {weekDays.map((day, index) => {
              const dayUnreadComics = getDayUnreadComics(index);
              const isToday = index === today;
              
              return (
                <View 
                  key={index}
                  style={{
                    width: '220rpx',
                    background: isToday ? '#FFF5F8' : '#fff',
                    borderRadius: '16rpx',
                    padding: '24rpx',
                    minHeight: '300rpx',
                    border: isToday ? '2rpx solid #FF6B9D' : 'none'
                  }}
                >
                  <Text style={{
                    fontSize: '28rpx',
                    fontWeight: isToday ? 'bold' : '600',
                    color: isToday ? '#FF6B9D' : '#2D3436',
                    marginBottom: '16rpx',
                    display: 'block',
                    textAlign: 'center'
                  }}>
                    {day}
                    {isToday && ' ⭐'}
                  </Text>
                  
                  {dayUnreadComics.length > 0 ? (
                    dayUnreadComics.map(comic => (
                      <View 
                        key={comic.id}
                        onClick={() => handleComicClick(comic)}
                        style={{
                          background: isToday ? '#FFE4EC' : '#f0f0f0',
                          borderRadius: '8rpx',
                          padding: '12rpx',
                          marginBottom: '8rpx',
                          position: 'relative'
                        }}
                      >
                        <Text style={{
                          fontSize: '22rpx',
                          color: '#2D3436',
                          display: 'block',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {comic.title}
                        </Text>
                        <Text style={{
                          fontSize: '20rpx',
                          color: '#636E72',
                          marginTop: '4rpx',
                          display: 'block'
                        }}>
                          第{comic.latestChapter}话
                        </Text>
                        {comic.hasNewChapter && (
                          <View style={{
                            position: 'absolute',
                            top: '8rpx',
                            right: '8rpx',
                            width: '12rpx',
                            height: '12rpx',
                            background: '#F53F3F',
                            borderRadius: '50%'
                          }} />
                        )}
                      </View>
                    ))
                  ) : (
                    <Text style={{
                      fontSize: '24rpx',
                      color: '#B2BEC3',
                      textAlign: 'center',
                      marginTop: '40rpx',
                      display: 'block'
                    }}>
                      {isToday ? '已读完' : '无更新'}
                    </Text>
                  )}
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>

      <View className={styles.statsCard}>
        <Text className={styles.sectionTitle}>本周统计</Text>
        <View className={styles.statsGrid}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{statistics.activeComics}</Text>
            <Text className={styles.statLabel}>连载中</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{statistics.weeklyUpdates}</Text>
            <Text className={styles.statLabel}>待读更新</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{statistics.weeklyReads}</Text>
            <Text className={styles.statLabel}>本周已读</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CalendarPage;
