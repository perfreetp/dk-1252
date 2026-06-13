import { ComicStatus, PaymentType, Priority } from '../types/comic';

export const getStatusLabel = (status: ComicStatus): string => {
  const labels = {
    active: '连载中',
    hiatus: '休刊',
    finished: '已完结',
    discontinued: '已断更'
  };
  return labels[status];
};

export const getStatusColor = (status: ComicStatus): string => {
  const colors = {
    active: '#00B894',
    hiatus: '#FDCB6E',
    finished: '#74B9FF',
    discontinued: '#E17055'
  };
  return colors[status];
};

export const getPaymentLabel = (payment: PaymentType): string => {
  const labels = {
    paid: '付费',
    free: '免费',
    payPerChapter: '按话付费'
  };
  return labels[payment];
};

export const getPaymentColor = (payment: PaymentType): string => {
  const colors = {
    paid: '#00B894',
    free: '#74B9FF',
    payPerChapter: '#FDCB6E'
  };
  return colors[payment];
};

export const getPriorityLabel = (priority: Priority): string => {
  const labels = {
    high: '高',
    medium: '中',
    low: '低'
  };
  return labels[priority];
};

export const getPriorityColor = (priority: Priority): string => {
  const colors = {
    high: '#FF6B9D',
    medium: '#FFB84C',
    low: '#B2BEC3'
  };
  return colors[priority];
};

export const getWeekDayLabel = (day: number): string => {
  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return days[day];
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / 86400000);

  if (days === 0) return '今天';
  if (days === 1) return '昨天';
  if (days < 7) return `${days}天前`;
  return `${date.getMonth() + 1}月${date.getDate()}日`;
};

export const generateComicShareText = (comics: any[]): string => {
  const activeComics = comics.filter(c => c.status === 'active');
  const text = `我的漫画追更清单 📚\n\n正在追更：${activeComics.length}部\n`;
  
  activeComics.slice(0, 5).forEach(comic => {
    text += `\n📖 ${comic.title}\n`;
    text += `   平台：${comic.platform}\n`;
    text += `   进度：第${comic.currentChapter}话 / 第${comic.latestChapter}话\n`;
  });

  if (activeComics.length > 5) {
    text += `\n...等${activeComics.length}部作品`;
  }

  text += '\n\n快来和我一起追更吧！✨';
  return text;
};

export const calculateWeeklyStats = (comics: any[]) => {
  const thisWeek = new Date();
  thisWeek.setDate(thisWeek.getDate() - thisWeek.getDay());
  thisWeek.setHours(0, 0, 0, 0);

  const weeklyComics = comics.filter(comic => {
    const created = new Date(comic.createdAt);
    return created >= thisWeek;
  });

  return {
    newComics: weeklyComics.length,
    updatedComics: comics.filter(c => c.hasNewChapter).length,
    readComics: comics.filter(c => {
      if (!c.lastReadAt) return false;
      return new Date(c.lastReadAt) >= thisWeek;
    }).length
  };
};
