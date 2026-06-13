import React from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import { Comic } from '../../types/comic';
import { getStatusLabel, getStatusColor, getPaymentLabel, getPaymentColor, getPriorityLabel, getPriorityColor, getWeekDayLabel } from '../../utils/helpers';
import styles from './index.module.scss';

interface ComicCardProps {
  comic: Comic;
  onClick?: () => void;
  onTogglePriority?: () => void;
  showPriority?: boolean;
}

const ComicCard: React.FC<ComicCardProps> = ({ comic, onClick, onTogglePriority, showPriority = true }) => {
  return (
    <View className={styles.card} onClick={onClick}>
      <Image 
        className={styles.cover}
        src={comic.cover}
        mode='aspectFill'
      />
      <View className={styles.content}>
        <View className={styles.header}>
          <Text className={styles.title}>{comic.title}</Text>
          {comic.hasNewChapter && (
            <View className={styles.newBadge}>
              <Text className={styles.newText}>NEW</Text>
            </View>
          )}
        </View>
        
        <Text className={styles.author}>{comic.author}</Text>
        
        <View className={styles.platform}>
          <Text className={styles.platformText}>{comic.platform}</Text>
        </View>

        <View className={styles.progress}>
          <Text className={styles.progressText}>
            第{comic.currentChapter}话 / 第{comic.latestChapter}话
          </Text>
        </View>

        <View className={styles.tags}>
          <View 
            className={styles.statusTag}
            style={{ backgroundColor: getStatusColor(comic.status) }}
          >
            <Text className={styles.tagText}>{getStatusLabel(comic.status)}</Text>
          </View>
          
          <View 
            className={styles.paymentTag}
            style={{ backgroundColor: getPaymentColor(comic.paymentType) }}
          >
            <Text className={styles.tagText}>{getPaymentLabel(comic.paymentType)}</Text>
          </View>

          {comic.status === 'active' && (
            <View className={styles.updateTag}>
              <Text className={styles.updateText}>{getWeekDayLabel(comic.updateDay)}更新</Text>
            </View>
          )}
        </View>

        {showPriority && (
          <View className={styles.footer}>
            <Button 
              className={styles.priorityButton}
              onClick={(e) => {
                e.stopPropagation();
                onTogglePriority?.();
              }}
            >
              <View 
                className={styles.priorityDot}
                style={{ backgroundColor: getPriorityColor(comic.priority) }}
              />
              <Text className={styles.priorityText}>
                {getPriorityLabel(comic.priority)}优先级
              </Text>
            </Button>
          </View>
        )}
      </View>
    </View>
  );
};

export default ComicCard;
