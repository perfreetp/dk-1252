import React from 'react';
import { View, Text, Image, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useComicContext } from '../../store/ComicContext';
import { Comic } from '../../types/comic';
import styles from './index.module.scss';

const CalendarPage: React.FC = () => {
  const { comics, statistics } = useComicContext();
  const today = new Date().getDay();

  const todayComics = comics.filter(
    c => c.updateDay === today && c.status === 'active'
  );

  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

  const handleComicClick = (comic: Comic) => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${comic.id}`
    });
  };

  const getDayComics = (day: number) => {
    return comics.filter(c => c.updateDay === day && c.status === 'active');
  };

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.title}>更新日历</Text>
        <Text className={styles.subtitle}>查看每周漫画更新安排</Text>
      </View>

      <View className={styles.calendarCard}>
        <View className={styles.todaySection}>
          <Text className={styles.sectionTitle}>
            今日更新
            <Text className={styles.todayBadge}>今天</Text>
          </Text>
          {todayComics.length > 0 ? (
            <View className={styles.todayComics}>
              {todayComics.map(comic => (
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
                  {comic.hasNewChapter && (
                    <Text className={styles.newTag}>NEW</Text>
                  )}
                </View>
              ))}
            </View>
          ) : (
            <View className={styles.noComics}>
              <Text>今天没有漫画更新哦～</Text>
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
              const dayComics = getDayComics(index);
              return (
                <View 
                  key={index}
                  style={{
                    width: '220rpx',
                    background: index === today ? '#FFF5F8' : '#fff',
                    borderRadius: '16rpx',
                    padding: '24rpx',
                    minHeight: '300rpx'
                  }}
                >
                  <Text style={{
                    fontSize: '28rpx',
                    fontWeight: index === today ? 'bold' : '600',
                    color: index === today ? '#FF6B9D' : '#2D3436',
                    marginBottom: '16rpx',
                    display: 'block',
                    textAlign: 'center'
                  }}>
                    {day}
                  </Text>
                  {dayComics.length > 0 ? (
                    dayComics.map(comic => (
                      <View 
                        key={comic.id}
                        onClick={() => handleComicClick(comic)}
                        style={{
                          background: '#f0f0f0',
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
                      休息日
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
