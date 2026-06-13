import React, { createContext, useContext, useState, useEffect } from 'react';
import { Comic, FilterOptions, Statistics, RemindSettings, Note } from '../types/comic';
import { mockComics } from '../data/mockComics';

interface ComicContextType {
  comics: Comic[];
  filteredComics: Comic[];
  filterOptions: FilterOptions;
  statistics: Statistics;
  remindSettings: RemindSettings;
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
  const [comics, setComics] = useState<Comic[]>(mockComics);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({});
  const [remindSettings, setRemindSettings] = useState<RemindSettings>({
    enabled: true,
    platforms: [],
    beforeChapters: 1
  });

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
    setComics([newComic, ...comics]);
  };

  const updateComic = (id: string, updates: Partial<Comic>) => {
    setComics(comics.map(comic =>
      comic.id === id ? { ...comic, ...updates } : comic
    ));
  };

  const deleteComic = (id: string) => {
    setComics(comics.filter(comic => comic.id !== id));
  };

  const markChapterRead = (comicId: string, chapterNumber: number) => {
    setComics(comics.map(comic => {
      if (comic.id !== comicId) return comic;
      return {
        ...comic,
        currentChapter: Math.max(comic.currentChapter, chapterNumber),
        lastReadAt: new Date().toISOString(),
        chapters: comic.chapters.map(ch =>
          ch.number === chapterNumber ? { ...ch, isRead: true, readAt: new Date().toISOString() } : ch
        )
      };
    }));
  };

  const markAllChaptersRead = (comicId: string) => {
    setComics(comics.map(comic => {
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
    setComics(comics.map(comic => {
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
    setComics(comics.map(comic => {
      if (comic.id !== comicId) return comic;
      return {
        ...comic,
        notes: comic.notes.filter(note => note.id !== noteId)
      };
    }));
  };

  const toggleHidden = (comicId: string) => {
    setComics(comics.map(comic =>
      comic.id === comicId ? { ...comic, isHidden: !comic.isHidden } : comic
    ));
  };

  const getComicsByDay = (day: number) => {
    return comics.filter(comic => comic.updateDay === day && comic.status === 'active');
  };

  const getComicsByPlatform = () => {
    const platformMap = new Map<string, Comic[]>();
    comics.forEach(comic => {
      const existing = platformMap.get(comic.platform) || [];
      platformMap.set(comic.platform, [...existing, comic]);
    });
    return platformMap;
  };

  const refreshComics = () => {
    setComics([...comics]);
  };

  return (
    <ComicContext.Provider value={{
      comics,
      filteredComics,
      filterOptions,
      statistics,
      remindSettings,
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
      refreshComics
    }}>
      {children}
    </ComicContext.Provider>
  );
};
