import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Comic, FilterOptions, Statistics, RemindSettings, Note } from '../types/comic';
import { mockComics } from '../data/mockComics';
import Taro from '@tarojs/taro';

const STORAGE_KEY = 'comic_tracker_data';

interface ComicContextType {
  comics: Comic[];
  filteredComics: Comic[];
  filterOptions: FilterOptions;
  statistics: Statistics;
  remindSettings: RemindSettings;
  isLoading: boolean;
  setFilterOptions: (options: FilterOptions) => void;
  addComic: (comic: Omit<Comic, 'id' | 'createdAt' | 'lastReadAt'>) => void;
  updateComic: (id: string, updates: Partial<Comic>) => void;
  deleteComic: (id: string) => void;
  markChapterRead: (comicId: string, chapterNumber: number) => void;
  markAllChaptersRead: (comicId: string) => void;
  addNote: (comicId: string, note: Omit<Note, 'id' | 'createdAt'>) => void;
  deleteNote: (comicId: string, noteId: string) => void;
  toggleHidden: (comicId: string) => void;
  setRemindSettings: (settings: RemindSettings) => void;
  getComicsByDay: (day: number) => Comic[];
  getComicsByPlatform: () => Map<string, Comic[]>;
  getUnreadComics: () => Comic[];
  refreshComics: () => void;
}

const ComicContext = createContext<ComicContextType | undefined>(undefined);

export const useComicContext = () => {
  const context = useContext(ComicContext);
  if (!context) {
    throw new Error('useComicContext must be used within ComicProvider');
  }
  return context;
};

export const ComicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [comics, setComics] = useState<Comic[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({});
  const [remindSettings, setRemindSettingsState] = useState<RemindSettings>({
    enabled: true,
    platforms: [],
    beforeChapters: 1
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      setIsLoading(true);
      const stored = Taro.getStorageSync(STORAGE_KEY);
      
      if (stored) {
        const data = JSON.parse(stored);
        setComics(data.comics || mockComics);
        setRemindSettingsState(data.remindSettings || {
          enabled: true,
          platforms: [],
          beforeChapters: 1
        });
      } else {
        setComics(mockComics);
      }
    } catch (error) {
      console.error('[ComicContext] Load error:', error);
      setComics(mockComics);
    } finally {
      setIsLoading(false);
    }
  };

  const saveData = useCallback(() => {
    try {
      const data = {
        comics,
        remindSettings,
        lastUpdate: new Date().toISOString()
      };
      Taro.setStorageSync(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('[ComicContext] Save error:', error);
    }
  }, [comics, remindSettings]);

  useEffect(() => {
    if (!isLoading) {
      saveData();
    }
  }, [comics, remindSettings, isLoading, saveData]);

  const filteredComics = comics.filter(comic => {
    if (filterOptions.status && comic.status !== filterOptions.status) return false;
    if (filterOptions.paymentType && comic.paymentType !== filterOptions.paymentType) return false;
    if (filterOptions.priority && comic.priority !== filterOptions.priority) return false;
    if (filterOptions.platform && comic.platform !== filterOptions.platform) return false;
    if (filterOptions.hasNewChapter !== undefined && comic.hasNewChapter !== filterOptions.hasNewChapter) return false;
    if (filterOptions.searchKeyword) {
      const keyword = filterOptions.searchKeyword.toLowerCase();
      if (!comic.title.toLowerCase().includes(keyword) && !comic.author.toLowerCase().includes(keyword)) {
        return false;
      }
    }
    return true;
  });

  const statistics: Statistics = {
    totalComics: comics.length,
    activeComics: comics.filter(c => c.status === 'active').length,
    hiatusComics: comics.filter(c => c.status === 'hiatus').length,
    finishedComics: comics.filter(c => c.status === 'finished').length,
    discontinuedComics: comics.filter(c => c.status === 'discontinued').length,
    weeklyUpdates: comics.filter(c => c.status === 'active' && c.hasNewChapter).length,
    weeklyReads: comics.filter(c => {
      const lastWeek = new Date(Date.now() - 7 * 86400000);
      return c.lastReadAt && new Date(c.lastReadAt) > lastWeek;
    }).length,
    highPriorityCount: comics.filter(c => c.priority === 'high').length
  };

  const addComic = (comicData: Omit<Comic, 'id' | 'createdAt' | 'lastReadAt'>) => {
    const newComic: Comic = {
      ...comicData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      lastReadAt: new Date().toISOString()
    };
    setComics(prev => [newComic, ...prev]);
  };

  const updateComic = (id: string, updates: Partial<Comic>) => {
    setComics(prev => prev.map(comic =>
      comic.id === id ? { ...comic, ...updates } : comic
    ));
  };

  const deleteComic = (id: string) => {
    setComics(prev => prev.filter(comic => comic.id !== id));
  };

  const markChapterRead = (comicId: string, chapterNumber: number) => {
    setComics(prev => prev.map(comic => {
      if (comic.id !== comicId) return comic;
      
      const newCurrentChapter = Math.max(comic.currentChapter, chapterNumber);
      const hasNewChapter = comic.latestChapter > newCurrentChapter;
      
      return {
        ...comic,
        currentChapter: newCurrentChapter,
        lastReadAt: new Date().toISOString(),
        hasNewChapter,
        chapters: comic.chapters.map(ch =>
          ch.number === chapterNumber 
            ? { ...ch, isRead: true, readAt: new Date().toISOString() } 
            : ch
        )
      };
    }));
  };

  const markAllChaptersRead = (comicId: string) => {
    setComics(prev => prev.map(comic => {
      if (comic.id !== comicId) return comic;
      
      return {
        ...comic,
        currentChapter: comic.latestChapter,
        lastReadAt: new Date().toISOString(),
        hasNewChapter: false,
        chapters: comic.chapters.map(ch => ({
          ...ch,
          isRead: true,
          readAt: new Date().toISOString()
        }))
      };
    }));
  };

  const addNote = (comicId: string, note: Omit<Note, 'id' | 'createdAt'>) => {
    setComics(prev => prev.map(comic => {
      if (comic.id !== comicId) return comic;
      return {
        ...comic,
        notes: [
          ...comic.notes,
          {
            ...note,
            id: Date.now().toString(),
            createdAt: new Date().toISOString()
          }
        ]
      };
    }));
  };

  const deleteNote = (comicId: string, noteId: string) => {
    setComics(prev => prev.map(comic => {
      if (comic.id !== comicId) return comic;
      return {
        ...comic,
        notes: comic.notes.filter(note => note.id !== noteId)
      };
    }));
  };

  const toggleHidden = (comicId: string) => {
    setComics(prev => prev.map(comic =>
      comic.id === comicId ? { ...comic, isHidden: !comic.isHidden } : comic
    ));
  };

  const setRemindSettings = (settings: RemindSettings) => {
    setRemindSettingsState(settings);
  };

  const getComicsByDay = (day: number) => {
    return comics.filter(comic => comic.updateDay === day && comic.status === 'active' && comic.hasNewChapter);
  };

  const getComicsByPlatform = () => {
    const platformMap = new Map<string, Comic[]>();
    comics.forEach(comic => {
      const existing = platformMap.get(comic.platform) || [];
      platformMap.set(comic.platform, [...existing, comic]);
    });
    return platformMap;
  };

  const getUnreadComics = () => {
    const today = new Date().getDay();
    return comics.filter(comic => 
      comic.status === 'active' && 
      comic.updateDay === today && 
      comic.hasNewChapter
    );
  };

  const refreshComics = () => {
    loadData();
  };

  return (
    <ComicContext.Provider value={{
      comics,
      filteredComics,
      filterOptions,
      statistics,
      remindSettings,
      isLoading,
      setFilterOptions,
      addComic,
      updateComic,
      deleteComic,
      markChapterRead,
      markAllChaptersRead,
      addNote,
      deleteNote,
      toggleHidden,
      setRemindSettings,
      getComicsByDay,
      getComicsByPlatform,
      getUnreadComics,
      refreshComics
    }}>
      {children}
    </ComicContext.Provider>
  );
};
