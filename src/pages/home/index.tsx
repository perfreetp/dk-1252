import React, { useState } from 'react';
import { View, Text, Input, ScrollView, Button } from '@tarojs/components';
import { useComicContext } from '../../store/ComicContext';
import ComicCard from '../../components/ComicCard';
import AddComicModal from '../../components/AddComicModal';
import { Comic } from '../../types/comic';
import styles from './index.module.scss';

const HomePage: React.FC = () => {
  const { 
    filteredComics, 
    filterOptions, 
    setFilterOptions, 
    addComic, 
    updateComic, 
    statistics 
  } = useComicContext();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (value: string) => {
    setSearchValue(value);
    setFilterOptions({ ...filterOptions, searchKeyword: value });
  };

  const handleFilter = (type: string) => {
    if (filterOptions.priority === type) {
      setFilterOptions({ ...filterOptions, priority: undefined });
    } else {
      setFilterOptions({ ...filterOptions, priority: type as any });
    }
  };

  const handleComicClick = (comic: Comic) => {
    wx.navigateTo({
      url: `/pages/detail/index?id=${comic.id}`
    });
  };

  const handleTogglePriority = (comic: Comic) => {
    const priorities = ['high', 'medium', 'low'];
    const currentIndex = priorities.indexOf(comic.priority);
    const nextPriority = priorities[(currentIndex + 1) % 3];
    updateComic(comic.id, { priority: nextPriority });
  };

  const filterButtons = [
    { key: 'high', label: '高优先级' },
    { key: 'medium', label: '中优先级' },
    { key: 'low', label: '低优先级' }
  ];

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.title}>漫画追更</Text>
        <Text className={styles.subtitle}>追踪你的追更列表</Text>
      </View>

      <View className={styles.searchBar}>
        <Text className={styles.searchIcon}>🔍</Text>
        <Input
          className={styles.searchInput}
          placeholder='搜索漫画或作者'
          value={searchValue}
          onInput={(e) => handleSearch(e.detail.value)}
        />
      </View>

      <ScrollView scrollX className={styles.filterBar}>
        {filterButtons.map(btn => (
          <Button
            key={btn.key}
            className={`${styles.filterBtn} ${filterOptions.priority === btn.key ? styles.active : ''}`}
            onClick={() => handleFilter(btn.key)}
          >
            {btn.label}
          </Button>
        ))}
      </ScrollView>

      <View className={styles.statsBar}>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{statistics.totalComics}</Text>
          <Text className={styles.statLabel}>总作品</Text>
        </View>
        <View className={styles.statDivider} />
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{statistics.activeComics}</Text>
          <Text className={styles.statLabel}>连载中</Text>
        </View>
        <View className={styles.statDivider} />
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{statistics.highPriorityCount}</Text>
          <Text className={styles.statLabel}>高优先级</Text>
        </View>
        <View className={styles.statDivider} />
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{statistics.weeklyUpdates}</Text>
          <Text className={styles.statLabel}>待读更新</Text>
        </View>
      </View>

      <ScrollView scrollY className={styles.comicList}>
        {filteredComics.length > 0 ? (
          filteredComics.map(comic => (
            <ComicCard
              key={comic.id}
              comic={comic}
              onClick={() => handleComicClick(comic)}
              onTogglePriority={() => handleTogglePriority(comic)}
            />
          ))
        ) : (
          <View className={styles.empty}>
            <Text className={styles.emptyIcon}>📚</Text>
            <Text className={styles.emptyText}>还没有追更作品</Text>
            <Text className={styles.emptySubtext}>点击下方按钮添加你的第一部漫画</Text>
          </View>
        )}
      </ScrollView>

      <Button className={styles.addBtn} onClick={() => setShowAddModal(true)}>
        <Text className={styles.addIcon}>+</Text>
      </Button>

      <AddComicModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={addComic}
      />
    </View>
  );
};

export default HomePage;
