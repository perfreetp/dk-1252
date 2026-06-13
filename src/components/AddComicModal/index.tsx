import React, { useState } from 'react';
import { View, Text, Button, Input, Picker, ScrollView } from '@tarojs/components';
import { Comic, ComicStatus, PaymentType, Priority } from '../../types/comic';
import { platforms, weekDays } from '../../data/mockComics';
import styles from './index.module.scss';

interface AddComicModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (comic: Omit<Comic, 'id' | 'createdAt' | 'lastReadAt'>) => void;
}

const AddComicModal: React.FC<AddComicModalProps> = ({ visible, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [cover, setCover] = useState('');
  const [platform, setPlatform] = useState(platforms[0]);
  const [author, setAuthor] = useState('');
  const [currentChapter, setCurrentChapter] = useState('1');
  const [latestChapter, setLatestChapter] = useState('1');
  const [updateDay, setUpdateDay] = useState(5);
  const [status, setStatus] = useState<ComicStatus>('active');
  const [paymentType, setPaymentType] = useState<PaymentType>('free');
  const [priority, setPriority] = useState<Priority>('medium');

  const handleSubmit = () => {
    if (!title.trim()) {
      return;
    }

    const chapters = Array.from({ length: parseInt(latestChapter) }, (_, i) => ({
      id: `ch-${i + 1}`,
      number: i + 1,
      title: `第${i + 1}话`,
      isRead: i < parseInt(currentChapter),
      readAt: i < parseInt(currentChapter) ? new Date().toISOString() : undefined,
      isPaid: paymentType !== 'free',
      hasSpoiler: false
    }));

    onAdd({
      title: title.trim(),
      cover: cover.trim() || 'https://picsum.photos/id/292/200/300',
      platform,
      author: author.trim(),
      currentChapter: parseInt(currentChapter),
      latestChapter: parseInt(latestChapter),
      updateDay,
      updateTime: '00:00',
      status,
      paymentType,
      priority,
      hasNewChapter: parseInt(latestChapter) > parseInt(currentChapter),
      isHidden: false,
      notes: [],
      chapters
    });

    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTitle('');
    setCover('');
    setPlatform(platforms[0]);
    setAuthor('');
    setCurrentChapter('1');
    setLatestChapter('1');
    setUpdateDay(5);
    setStatus('active');
    setPaymentType('free');
    setPriority('medium');
  };

  if (!visible) return null;

  return (
    <View className={styles.modal}>
      <View className={styles.mask} onClick={onClose} />
      <View className={styles.container}>
        <View className={styles.header}>
          <Text className={styles.title}>添加漫画</Text>
          <Button className={styles.closeBtn} onClick={onClose}>×</Button>
        </View>

        <ScrollView scrollY className={styles.content}>
          <View className={styles.formItem}>
            <Text className={styles.label}>作品名称 *</Text>
            <Input 
              className={styles.input}
              placeholder='请输入作品名称'
              value={title}
              onInput={(e) => setTitle(e.detail.value)}
            />
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>作者</Text>
            <Input 
              className={styles.input}
              placeholder='请输入作者名称'
              value={author}
              onInput={(e) => setAuthor(e.detail.value)}
            />
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>平台</Text>
            <Picker 
              mode='selector'
              range={platforms}
              onChange={(e) => setPlatform(platforms[e.detail.value])}
            >
              <View className={styles.picker}>
                <Text>{platform}</Text>
              </View>
            </Picker>
          </View>

          <View className={styles.row}>
            <View className={styles.formItem}>
              <Text className={styles.label}>当前章节</Text>
              <Input 
                className={styles.input}
                type='number'
                placeholder='0'
                value={currentChapter}
                onInput={(e) => setCurrentChapter(e.detail.value)}
              />
            </View>

            <View className={styles.formItem}>
              <Text className={styles.label}>最新章节</Text>
              <Input 
                className={styles.input}
                type='number'
                placeholder='0'
                value={latestChapter}
                onInput={(e) => setLatestChapter(e.detail.value)}
              />
            </View>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>更新日</Text>
            <Picker 
              mode='selector'
              range={weekDays}
              rangeKey='label'
              onChange={(e) => setUpdateDay(weekDays[e.detail.value].value)}
            >
              <View className={styles.picker}>
                <Text>{weekDays.find(w => w.value === updateDay)?.label}</Text>
              </View>
            </Picker>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>更新状态</Text>
            <View className={styles.optionGroup}>
              {(['active', 'hiatus', 'finished', 'discontinued'] as ComicStatus[]).map(s => (
                <Button 
                  key={s}
                  className={`${styles.optionBtn} ${status === s ? styles.active : ''}`}
                  onClick={() => setStatus(s)}
                >
                  {s === 'active' ? '连载中' : s === 'hiatus' ? '休刊' : s === 'finished' ? '完结' : '断更'}
                </Button>
              ))}
            </View>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>付费类型</Text>
            <View className={styles.optionGroup}>
              {(['free', 'paid', 'payPerChapter'] as PaymentType[]).map(p => (
                <Button 
                  key={p}
                  className={`${styles.optionBtn} ${paymentType === p ? styles.active : ''}`}
                  onClick={() => setPaymentType(p)}
                >
                  {p === 'free' ? '免费' : p === 'paid' ? '付费' : '按话付费'}
                </Button>
              ))}
            </View>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>优先级</Text>
            <View className={styles.optionGroup}>
              {(['high', 'medium', 'low'] as Priority[]).map(p => (
                <Button 
                  key={p}
                  className={`${styles.optionBtn} ${priority === p ? styles.active : ''}`}
                  onClick={() => setPriority(p)}
                >
                  {p === 'high' ? '高' : p === 'medium' ? '中' : '低'}
                </Button>
              ))}
            </View>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>封面URL</Text>
            <Input 
              className={styles.input}
              placeholder='可不填，使用默认封面'
              value={cover}
              onInput={(e) => setCover(e.detail.value)}
            />
          </View>
        </ScrollView>

        <View className={styles.footer}>
          <Button className={styles.cancelBtn} onClick={onClose}>取消</Button>
          <Button className={styles.submitBtn} onClick={handleSubmit}>添加</Button>
        </View>
      </View>
    </View>
  );
};

export default AddComicModal;
