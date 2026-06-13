import { Comic } from '../types/comic';

export const mockComics: Comic[] = [
  {
    id: '1',
    title: '海贼王',
    cover: 'https://picsum.photos/id/292/200/300',
    platform: '腾讯动漫',
    author: '尾田荣一郎',
    currentChapter: 1089,
    latestChapter: 1089,
    updateDay: 5,
    updateTime: '12:00',
    status: 'active',
    paymentType: 'payPerChapter',
    priority: 'high',
    hasNewChapter: false,
    isHidden: false,
    notes: [
      {
        id: 'n1',
        content: '路飞觉醒尼卡形态，对战五老星',
        type: 'plot',
        chapter: 1070,
        createdAt: '2024-01-15'
      },
      {
        id: 'n2',
        content: '红发香克斯与黑胡子即将决战',
        type: 'spoiler',
        chapter: 1085,
        createdAt: '2024-01-20'
      }
    ],
    chapters: Array.from({ length: 50 }, (_, i) => ({
      id: `ch-${1089 - i}`,
      number: 1089 - i,
      title: `第${1089 - i}话`,
      isRead: i < 30,
      readAt: i < 30 ? new Date(Date.now() - i * 86400000).toISOString() : undefined,
      isPaid: i % 3 === 0,
      hasSpoiler: i === 5
    })),
    createdAt: '2023-06-01',
    lastReadAt: '2024-01-25'
  },
  {
    id: '2',
    title: '咒术回战',
    cover: 'https://picsum.photos/id/326/200/300',
    platform: '哔哩哔哩漫画',
    author: '芥见下々',
    currentChapter: 236,
    latestChapter: 236,
    updateDay: 4,
    updateTime: '00:00',
    status: 'active',
    paymentType: 'paid',
    priority: 'high',
    hasNewChapter: true,
    isHidden: false,
    notes: [
      {
        id: 'n3',
        content: '乙骨忧太展现真正实力',
        type: 'plot',
        chapter: 230,
        createdAt: '2024-01-10'
      }
    ],
    chapters: Array.from({ length: 50 }, (_, i) => ({
      id: `ch2-${236 - i}`,
      number: 236 - i,
      title: `第${236 - i}话`,
      isRead: i < 10,
      readAt: i < 10 ? new Date(Date.now() - i * 86400000).toISOString() : undefined,
      isPaid: true,
      hasSpoiler: false
    })),
    createdAt: '2023-06-15',
    lastReadAt: '2024-01-24'
  },
  {
    id: '3',
    title: '电锯人',
    cover: 'https://picsum.photos/id/431/200/300',
    platform: '快看漫画',
    author: '藤本树',
    currentChapter: 166,
    latestChapter: 166,
    updateDay: 6,
    updateTime: '00:00',
    status: 'active',
    paymentType: 'free',
    priority: 'medium',
    hasNewChapter: false,
    isHidden: false,
    notes: [],
    chapters: Array.from({ length: 50 }, (_, i) => ({
      id: `ch3-${166 - i}`,
      number: 166 - i,
      title: `第${166 - i}话`,
      isRead: i < 40,
      readAt: i < 40 ? new Date(Date.now() - i * 86400000).toISOString() : undefined,
      isPaid: false,
      hasSpoiler: false
    })),
    createdAt: '2023-07-01',
    lastReadAt: '2024-01-23'
  },
  {
    id: '4',
    title: '进击的巨人',
    cover: 'https://picsum.photos/id/570/200/300',
    platform: '腾讯动漫',
    author: '谏山创',
    currentChapter: 139,
    latestChapter: 139,
    updateDay: 1,
    updateTime: '12:00',
    status: 'finished',
    paymentType: 'payPerChapter',
    priority: 'low',
    hasNewChapter: false,
    isHidden: false,
    notes: [
      {
        id: 'n4',
        content: '艾伦选择牺牲自己终结巨人之力',
        type: 'plot',
        chapter: 139,
        createdAt: '2023-04-10'
      }
    ],
    chapters: Array.from({ length: 50 }, (_, i) => ({
      id: `ch4-${139 - i}`,
      number: 139 - i,
      title: `第${139 - i}话`,
      isRead: true,
      readAt: new Date(Date.now() - i * 86400000).toISOString(),
      isPaid: false,
      hasSpoiler: false
    })),
    createdAt: '2023-05-01',
    lastReadAt: '2023-04-15'
  },
  {
    id: '5',
    title: '东京食尸鬼',
    cover: 'https://picsum.photos/id/580/200/300',
    platform: '哔哩哔哩漫画',
    author: '石田スイ',
    currentChapter: 179,
    latestChapter: 179,
    updateDay: 2,
    updateTime: '00:00',
    status: 'discontinued',
    paymentType: 'paid',
    priority: 'medium',
    hasNewChapter: false,
    isHidden: true,
    notes: [
      {
        id: 'n5',
        content: '金木最终选择接受自己是人和食尸鬼的结合',
        type: 'spoiler',
        chapter: 179,
        createdAt: '2023-09-20'
      }
    ],
    chapters: Array.from({ length: 50 }, (_, i) => ({
      id: `ch5-${179 - i}`,
      number: 179 - i,
      title: `第${179 - i}话`,
      isRead: i < 45,
      readAt: i < 45 ? new Date(Date.now() - i * 86400000).toISOString() : undefined,
      isPaid: i % 2 === 0,
      hasSpoiler: false
    })),
    createdAt: '2023-06-10',
    lastReadAt: '2024-01-15'
  },
  {
    id: '6',
    title: '约定的梦幻岛',
    cover: 'https://picsum.photos/id/401/200/300',
    platform: '快看漫画',
    author: '白井カイウ',
    currentChapter: 181,
    latestChapter: 181,
    updateDay: 3,
    updateTime: '00:00',
    status: 'finished',
    paymentType: 'free',
    priority: 'low',
    hasNewChapter: false,
    isHidden: false,
    notes: [],
    chapters: Array.from({ length: 50 }, (_, i) => ({
      id: `ch6-${181 - i}`,
      number: 181 - i,
      title: `第${181 - i}话`,
      isRead: true,
      readAt: new Date(Date.now() - i * 86400000).toISOString(),
      isPaid: false,
      hasSpoiler: false
    })),
    createdAt: '2023-05-20',
    lastReadAt: '2023-01-10'
  },
  {
    id: '7',
    title: '链锯人',
    cover: 'https://picsum.photos/id/835/200/300',
    platform: '腾讯动漫',
    author: '藤本树',
    currentChapter: 166,
    latestChapter: 166,
    updateDay: 6,
    updateTime: '00:00',
    status: 'active',
    paymentType: 'free',
    priority: 'high',
    hasNewChapter: true,
    isHidden: false,
    notes: [],
    chapters: Array.from({ length: 50 }, (_, i) => ({
      id: `ch7-${166 - i}`,
      number: 166 - i,
      title: `第${166 - i}话`,
      isRead: i < 5,
      readAt: i < 5 ? new Date(Date.now() - i * 86400000).toISOString() : undefined,
      isPaid: false,
      hasSpoiler: false
    })),
    createdAt: '2023-12-01',
    lastReadAt: '2024-01-26'
  },
  {
    id: '8',
    title: '蓝色监狱',
    cover: 'https://picsum.photos/id/625/200/300',
    platform: '哔哩哔哩漫画',
    author: '路易斯・.vo',
    currentChapter: 242,
    latestChapter: 243,
    updateDay: 0,
    updateTime: '00:00',
    status: 'active',
    paymentType: 'payPerChapter',
    priority: 'medium',
    hasNewChapter: true,
    isHidden: false,
    notes: [],
    chapters: Array.from({ length: 50 }, (_, i) => ({
      id: `ch8-${243 - i}`,
      number: 243 - i,
      title: `第${243 - i}话`,
      isRead: i < 20,
      readAt: i < 20 ? new Date(Date.now() - i * 86400000).toISOString() : undefined,
      isPaid: i % 4 === 0,
      hasSpoiler: false
    })),
    createdAt: '2023-08-15',
    lastReadAt: '2024-01-22'
  }
];

export const platforms = [
  '腾讯动漫',
  '哔哩哔哩漫画',
  '快看漫画',
  '有妖气',
  '漫番漫画',
  '咚漫',
  'Webtoon',
  'Pocket Comics'
];

export const weekDays = [
  { value: 0, label: '周日' },
  { value: 1, label: '周一' },
  { value: 2, label: '周二' },
  { value: 3, label: '周三' },
  { value: 4, label: '周四' },
  { value: 5, label: '周五' },
  { value: 6, label: '周六' }
];
