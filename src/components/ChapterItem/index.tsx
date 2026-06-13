import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import { Chapter } from '../../types/comic';
import styles from './index.module.scss';

interface ChapterItemProps {
  chapter: Chapter;
  onMarkRead?: () => void;
  showSpoiler?: boolean;
}

const ChapterItem: React.FC<ChapterItemProps> = ({ chapter, onMarkRead, showSpoiler = false }) => {
  return (
    <View className={`${styles.item} ${chapter.isRead ? styles.read : ''}`}>
      <View className={styles.info}>
        <Text className={styles.title}>{chapter.title}</Text>
        <View className={styles.tags}>
          {chapter.isPaid && (
            <View className={styles.paidTag}>
              <Text className={styles.tagText}>付费</Text>
            </View>
          )}
          {chapter.hasSpoiler && !showSpoiler && (
            <View className={styles.spoilerTag}>
              <Text className={styles.tagText}>⚠️ 剧透</Text>
            </View>
          )}
        </View>
      </View>

      <View className={styles.actions}>
        {chapter.isRead ? (
          <View className={styles.readBadge}>
            <Text className={styles.readText}>已读</Text>
          </View>
        ) : (
          <Button className={styles.readBtn} onClick={onMarkRead}>
            <Text className={styles.btnText}>标记已读</Text>
          </Button>
        )}
      </View>
    </View>
  );
};

export default ChapterItem;
