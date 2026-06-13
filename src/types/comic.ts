// 漫画作品类型定义
export interface Comic {
  id: string;
  title: string;
  cover: string;
  platform: string;
  author: string;
  currentChapter: number;
  latestChapter: number;
  updateDay: number; // 0-6，周几更新
  updateTime: string; // 更新时间（如 "00:00"）
  status: ComicStatus;
  paymentType: PaymentType;
  priority: Priority;
  hasNewChapter: boolean;
  isHidden: boolean; // 隐藏剧透笔记
  notes: Note[];
  chapters: Chapter[];
  createdAt: string;
  lastReadAt: string;
}

export type ComicStatus = 'active' | 'hiatus' | 'finished' | 'discontinued';
export type PaymentType = 'paid' | 'free' | 'payPerChapter';
export type Priority = 'high' | 'medium' | 'low';

// 章节类型
export interface Chapter {
  id: string;
  number: number;
  title: string;
  isRead: boolean;
  readAt?: string;
  isPaid: boolean;
  hasSpoiler: boolean; // 是否包含剧透
  spoilerContent?: string; // 剧透内容
}

// 备注类型
export interface Note {
  id: string;
  content: string;
  type: 'plot' | 'character' | 'spoiler' | 'general';
  chapter?: number;
  createdAt: string;
}

// 更新提醒设置
export interface RemindSettings {
  enabled: boolean;
  platforms: string[];
  beforeChapters: number; // 更新前几章提醒
}

// 统计信息
export interface Statistics {
  totalComics: number;
  activeComics: number;
  hiatusComics: number;
  finishedComics: number;
  discontinuedComics: number;
  weeklyUpdates: number;
  weeklyReads: number;
  highPriorityCount: number;
}

// 筛选条件
export interface FilterOptions {
  status?: ComicStatus;
  paymentType?: PaymentType;
  priority?: Priority;
  platform?: string;
  hasNewChapter?: boolean;
  searchKeyword?: string;
}
