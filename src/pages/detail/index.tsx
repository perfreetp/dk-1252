import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, ScrollView, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useComicContext } from '../../store/ComicContext';
import ChapterItem from '../../components/ChapterItem';
import { Comic } from '../../types/comic';
import { getStatusLabel, getStatusColor, getWeekDayLabel } from '../../utils/helpers';
import styles from './index.module.scss';

const DetailPage: React.FC = () => {
  const { 
    comics, 
    markChapterRead, 
    markAllChaptersRead, 
    addNote, 
    deleteNote, 
    isLoading,
    comics: allComics
  } = useComicContext();
  
  const [comic, setComic] = useState<Comic | null>(null);
  const [activeTab, setActiveTab] = useState<'chapters' | 'notes'>('chapters');
  const [showAddNote, setShowAddNote] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [noteType, setNoteType] = useState<'plot' | 'character' | 'general'>('general');
  const [expandedSpoilers, setExpandedSpoilers] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isLoading) {
      const pages = Taro.getCurrentPages();
      const currentPage = pages[pages.length - 1];
      const id = (currentPage as any).options?.id;
      
      if (id) {
        const found = allComics.find(c => c.id === id);
        if (found) {
          setComic(found);
        }
      }
    }
  }, [isLoading, allComics]);

  useEffect(() => {
    if (comic) {
      setComic(comic);
    }
  }, [comic?.chapters, comic?.notes, comic?.currentChapter]);

  const handleMarkAllRead = () => {
    if (comic) {
      markAllChaptersRead(comic.id);
      Taro.showToast({ title: '已标记全部已读', icon: 'success' });
    }
  };

  const handleMarkRead = (chapterNumber: number) => {
    if (comic) {
      markChapterRead(comic.id, chapterNumber);
      const updatedComic = allComics.find(c => c.id === comic.id);
      if (updatedComic) {
        setComic(updatedComic);
      }
    }
  };

  const handleAddNote = () => {
    if (comic && noteContent.trim()) {
      addNote(comic.id, {
        content: noteContent.trim(),
        type: noteType,
        chapter: comic.currentChapter
      });
      setNoteContent('');
      setShowAddNote(false);
      Taro.showToast({ title: '备注已添加', icon: 'success' });
    }
  };

  const handleDeleteNote = (noteId: string) => {
    if (comic) {
      deleteNote(comic.id, noteId);
      const updatedComic = allComics.find(c => c.id === comic.id);
      if (updatedComic) {
        setComic(updatedComic);
      }
    }
  };

  const handleShare = () => {
    if (comic) {
      const text = `正在追《${comic.title}》！\n进度：第${comic.currentChapter}话 / 第${comic.latestChapter}话\n平台：${comic.platform}`;
      Taro.setClipboardData({
        data: text,
        success: () => {
          Taro.showToast({ title: '已复制分享内容', icon: 'success' });
        }
      });
    }
  };

  const toggleSpoiler = (chapterId: string) => {
    setExpandedSpoilers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(chapterId)) {
        newSet.delete(chapterId);
      } else {
        newSet.add(chapterId);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <View className={styles.container}>
        <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '200rpx' }}>
          <Text style={{ fontSize: '28rpx', color: '#636E72' }}>正在加载...</Text>
        </View>
      </View>
    );
  }

  if (!comic) {
    return (
      <View className={styles.container}>
        <View className={styles.section}>
          <Text style={{ fontSize: '28rpx', color: '#2D3436' }}>未找到该作品</Text>
          <Button 
            onClick={() => Taro.navigateBack()}
            style={{ marginTop: '32rpx', background: '#FF6B9D', color: '#fff', borderRadius: '48rpx' }}
          >
            返回上一页
          </Button>
        </View>
      </View>
    );
  }

  const progressPercent = Math.round((comic.currentChapter / comic.latestChapter) * 100);
  const unreadChapters = comic.chapters.filter(ch => !ch.isRead);

  const renderChapterItem = (chapter: any, showSpoiler: boolean) => {
    if (showSpoiler && chapter.hasSpoiler && !comic.isHidden) {
      const isExpanded = expandedSpoilers.has(chapter.id);
      
      if (!isExpanded) {
        return (
          <View 
            key={chapter.id}
            style={{
              background: '#FFF3E0',
              borderRadius: '12rpx',
              padding: '24rpx',
              marginBottom: '16rpx',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: '28rpx', fontWeight: '600', color: '#2D3436' }}>
                {chapter.title}
              </Text>
              <Text style={{ fontSize: '24rpx', color: '#E17055', marginTop: '8rpx' }}>
                ⚠️ 包含剧透内容
              </Text>
            </View>
            <Button 
              size='mini'
              style={{ background: '#E17055', color: '#fff', borderRadius: '32rpx' }}
              onClick={() => toggleSpoiler(chapter.id)}
            >
              点击查看
            </Button>
          </View>
        );
      } else {
        return (
          <ChapterItem
            key={chapter.id}
            chapter={chapter}
            onMarkRead={() => handleMarkRead(chapter.number)}
            showSpoiler={true}
          />
        );
      }
    }
    
    return (
      <ChapterItem
        key={chapter.id}
        chapter={chapter}
        onMarkRead={() => handleMarkRead(chapter.number)}
        showSpoiler={showSpoiler}
      />
    );
  };

  return (
    <View className={styles.container}>
      <ScrollView scrollY>
        <View className={styles.header}>
          <Image 
            className={styles.coverBg}
            src={comic.cover}
            mode='aspectFill'
          />
          <Image 
            className={styles.cover}
            src={comic.cover}
            mode='aspectFill'
          />
        </View>

        <View className={styles.infoSection}>
          <View className={styles.infoCard}>
            <Text className={styles.title}>{comic.title}</Text>
            <Text className={styles.author}>作者：{comic.author}</Text>
            
            <View className={styles.metaRow}>
              <View className={styles.metaItem}>
                <Text className={styles.metaText}>{comic.platform}</Text>
              </View>
              <View 
                className={styles.metaItem}
                style={{ backgroundColor: getStatusColor(comic.status) }}
              >
                <Text className={styles.metaText} style={{ color: '#fff' }}>
                  {getStatusLabel(comic.status)}
                </Text>
              </View>
              {comic.status === 'active' && (
                <View className={styles.metaItem}>
                  <Text className={styles.metaText}>
                    {getWeekDayLabel(comic.updateDay)}更新
                  </Text>
                </View>
              )}
            </View>

            <View className={styles.progressSection}>
              <Text className={styles.progressTitle}>阅读进度</Text>
              <View className={styles.progressBar}>
                <View 
                  className={styles.progressFill}
                  style={{ width: `${progressPercent}%` }}
                />
              </View>
              <Text className={styles.progressText}>
                {comic.currentChapter} / {comic.latestChapter} 话 ({progressPercent}%)
              </Text>
            </View>

            <View className={styles.actionBar}>
              <Button 
                className={`${styles.actionBtn} ${styles.secondary}`}
                onClick={handleShare}
              >
                分享
              </Button>
              <Button 
                className={`${styles.actionBtn} ${styles.primary}`}
                onClick={handleMarkAllRead}
              >
                全部已读
              </Button>
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.tabBar}>
            <Button 
              className={`${styles.tab} ${activeTab === 'chapters' ? styles.active : ''}`}
              onClick={() => setActiveTab('chapters')}
            >
              章节列表
            </Button>
            <Button 
              className={`${styles.tab} ${activeTab === 'notes' ? styles.active : ''}`}
              onClick={() => setActiveTab('notes')}
            >
              备注 ({comic.notes.length})
            </Button>
          </View>

          {activeTab === 'chapters' ? (
            <View className={styles.chapterList}>
              {unreadChapters.length > 0 && (
                <View>
                  <Text style={{ fontSize: '24rpx', color: '#FF6B9D', marginBottom: '16rpx', display: 'block' }}>
                    未读章节 ({unreadChapters.length})
                  </Text>
                  {unreadChapters.slice(0, 10).map(chapter => 
                    renderChapterItem(chapter, !comic.isHidden)
                  )}
                </View>
              )}
              <View style={{ marginTop: unreadChapters.length > 0 ? '32rpx' : '0' }}>
                <Text style={{ fontSize: '24rpx', color: '#636E72', marginBottom: '16rpx', display: 'block' }}>
                  已读章节 ({comic.chapters.filter(ch => ch.isRead).length})
                </Text>
                {comic.chapters
                  .filter(ch => ch.isRead)
                  .slice(0, 20)
                  .map(chapter => 
                    renderChapterItem(chapter, !comic.isHidden)
                  )}
              </View>
            </View>
          ) : (
            <View>
              {showAddNote && (
                <View className={styles.noteItem}>
                  <View style={{ display: 'flex', gap: '16rpx', marginBottom: '16rpx' }}>
                    {(['general', 'plot', 'character'] as const).map(type => (
                      <Button
                        key={type}
                        size='mini'
                        type={noteType === type ? 'primary' : 'default'}
                        onClick={() => setNoteType(type)}
                      >
                        {type === 'general' ? '一般' : type === 'plot' ? '剧情' : '角色'}
                      </Button>
                    ))}
                  </View>
                  <Input
                    style={{ background: '#f5f6f7', borderRadius: '12rpx', padding: '16rpx', marginBottom: '16rpx' }}
                    placeholder='输入备注内容...'
                    value={noteContent}
                    onInput={(e) => setNoteContent(e.detail.value)}
                    multiline
                  />
                  <View style={{ display: 'flex', gap: '16rpx' }}>
                    <Button size='mini' onClick={() => setShowAddNote(false)}>取消</Button>
                    <Button size='mini' type='primary' onClick={handleAddNote}>保存</Button>
                  </View>
                </View>
              )}

              {comic.notes.map(note => (
                <View key={note.id} className={styles.noteItem}>
                  <View className={styles.noteHeader}>
                    <Text className={styles.noteType}>
                      {note.type === 'plot' ? '📖 剧情' : note.type === 'character' ? '👤 角色' : '📝 备注'}
                    </Text>
                    <View style={{ display: 'flex', alignItems: 'center', gap: '16rpx' }}>
                      {note.chapter && (
                        <Text className={styles.noteChapter}>第{note.chapter}话</Text>
                      )}
                      <Button 
                        className={styles.deleteBtn}
                        onClick={() => handleDeleteNote(note.id)}
                      >
                        删除
                      </Button>
                    </View>
                  </View>
                  <Text className={styles.noteContent}>{note.content}</Text>
                  <Text className={styles.noteDate}>{note.createdAt}</Text>
                </View>
              ))}

              <Button 
                className={styles.addNoteBtn}
                onClick={() => setShowAddNote(true)}
              >
                + 添加备注
              </Button>
            </View>
          )}
        </View>
      </ScrollView>

      <View className={styles.bottomBar}>
        <Button 
          className={`${styles.bottomBtn} ${styles.secondary}`}
          onClick={() => Taro.navigateBack()}
        >
          返回
        </Button>
        <Button 
          className={`${styles.bottomBtn} ${styles.primary}`}
          onClick={handleMarkAllRead}
        >
          一键已读
        </Button>
      </View>
    </View>
  );
};

export default DetailPage;
