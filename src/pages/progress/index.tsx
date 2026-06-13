import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useComicContext } from '../../store/ComicContext';
import { Comic } from '../../types/comic';
import styles from './index.module.scss';

const ProgressPage: React.FC = () => {
  const { comics, markAllChaptersRead, isLoading, comics: allComics } = useComicContext();
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isLoading && allComics.length > 0) {
      setIsReady(true);
    }
  }, [isLoading, allComics]);

  const platforms = ['all', ...new Set(allComics.map(c => c.platform))];
  const platformLabels = {
    all: '全部',
    '腾讯动漫': '🀄 腾讯',
    '哔哩哔哩漫画': '📺 哔哩',
    '快看漫画': '⚡ 快看',
    '有妖气': '👻 有妖气',
    '漫番漫画': '📖 漫番',
    '咚漫': '🎵 咚漫',
    'Webtoon': '🌐 Webtoon',
    'Pocket Comics': '💎 Pocket'
  };

  const filteredComics = filterPlatform === 'all' 
    ? allComics 
    : allComics.filter(c => c.platform === filterPlatform);

  const groupedComics = new Map<string, Comic[]>();
  filteredComics.forEach(comic => {
    const existing = groupedComics.get(comic.platform) || [];
    groupedComics.set(comic.platform, [...existing, comic]);
  });

  const handleComicClick = (comic: Comic) => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${comic.id}`
    });
  };

  const handleMarkRead = (comic: Comic) => {
    markAllChaptersRead(comic.id);
    Taro.showToast({ title: '已标记全部已读', icon: 'success' });
  };

  if (!isReady) {
    return (
      <View className={styles.container}>
        <View className={styles.header}>
          <Text className={styles.title}>阅读进度</Text>
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
        <Text className={styles.title}>阅读进度</Text>
        <Text className={styles.subtitle}>管理你的追更阅读清单</Text>
      </View>

      <ScrollView scrollX className={styles.filterBar}>
        {platforms.map(platform => (
          <Button
            key={platform}
            className={`${styles.filterBtn} ${filterPlatform === platform ? styles.active : ''}`}
            onClick={() => setFilterPlatform(platform)}
          >
            {platformLabels[platform as keyof typeof platformLabels] || platform}
          </Button>
        ))}
      </ScrollView>

      <ScrollView scrollY>
        {groupedComics.size > 0 ? (
          Array.from(groupedComics.entries()).map(([platform, platformComics]) => (
            <View key={platform} className={styles.platformGroup}>
              <Text className={styles.platformTitle}>
                <Text className={styles.platformIcon}>
                  {platformLabels[platform as keyof typeof platformLabels]?.split(' ')[0]}
                </Text>
                {platform}
              </Text>
              
              <View className={styles.comicList}>
                {platformComics.map(comic => {
                  const progress = Math.round((comic.currentChapter / comic.latestChapter) * 100);
                  return (
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
                        <View className={styles.progressBar}>
                          <View 
                            className={styles.progressFill}
                            style={{ width: `${progress}%` }}
                          />
                        </View>
                        <Text className={styles.progressText}>
                          {comic.currentChapter} / {comic.latestChapter} 话 ({progress}%)
                        </Text>
                      </View>
                      <Button 
                        className={styles.actionBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkRead(comic);
                        }}
                      >
                        <Text className={styles.btnText}>已读</Text>
                      </Button>
                    </View>
                  );
                })}
              </View>
            </View>
          ))
        ) : (
          <View className={styles.empty}>
            <Text className={styles.emptyIcon}>📚</Text>
            <Text className={styles.emptyText}>暂无追更作品</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default ProgressPage;
