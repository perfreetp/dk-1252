import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import { Comic } from '../../types/comic';
import { getWeekDayLabel } from '../../utils/helpers';
import styles from './index.module.scss';

interface CalendarGridProps {
  comics: Comic[];
  onComicClick?: (comic: Comic) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ comics, onComicClick }) => {
  const weekDays = [0, 1, 2, 3, 4, 5, 6];

  return (
    <View className={styles.container}>
      <View className={styles.weekHeader}>
        {weekDays.map(day => (
          <View key={day} className={styles.weekDay}>
            <Text className={styles.weekText}>{getWeekDayLabel(day)}</Text>
          </View>
        ))}
      </View>

      <ScrollView scrollX className={styles.gridScroll}>
        <View className={styles.grid}>
          {weekDays.map(day => {
            const dayComics = comics.filter(c => c.updateDay === day && c.status === 'active');
            return (
              <View key={day} className={styles.column}>
                {dayComics.length > 0 ? (
                  dayComics.map(comic => (
                    <View 
                      key={comic.id} 
                      className={styles.comicItem}
                      onClick={() => onComicClick?.(comic)}
                    >
                      <Text className={styles.comicTitle}>{comic.title}</Text>
                      {comic.hasNewChapter && (
                        <View className={styles.newDot} />
                      )}
                    </View>
                  ))
                ) : (
                  <View className={styles.empty}>
                    <Text className={styles.emptyText}>-</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default CalendarGrid;
