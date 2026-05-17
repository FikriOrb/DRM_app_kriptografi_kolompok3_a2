import { Chapter, Comic, HistoryWithComic, UserProfile } from '../types';

interface ApiEnvelope<T> {
  ok: boolean;
  data?: T;
  error?: string;
}

const configuredBase = import.meta.env.VITE_API_BASE_URL as string | undefined;
const getBaseHost = () => {
  if (typeof window !== 'undefined') {
    return window.location.hostname;
  }
  return 'localhost';
};
export const API_BASE_URL = configuredBase || `http://${getBaseHost()}/manga_api/api.php`;

const userKey = 'manga-user';

export function getStoredUser(): UserProfile | null {
  const raw = localStorage.getItem(userKey);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as UserProfile;
  } catch {
    localStorage.removeItem(userKey);
    return null;
  }
}

export function setStoredUser(user: UserProfile | null) {
  if (user) {
    localStorage.setItem(userKey, JSON.stringify(user));
  } else {
    localStorage.removeItem(userKey);
  }
}

function withAction(action: string, params: Record<string, string | number | undefined> = {}) {
  const url = new URL(API_BASE_URL);
  url.searchParams.set('action', action);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });
  return url.toString();
}

export function fixImageUrl(url: string | undefined): string {
  if (!url) return '';
  let fixedUrl = url;
  if (fixedUrl.startsWith('http://localhost/backend/')) {
    fixedUrl = fixedUrl.replace('http://localhost/backend/', 'http://localhost/manga_api/');
  }
  
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    fixedUrl = fixedUrl.replace('http://localhost/', `http://${window.location.hostname}/`);
  }

  if (fixedUrl.startsWith('http://') || fixedUrl.startsWith('https://') || fixedUrl.startsWith('data:')) {
    return fixedUrl;
  }
  const baseUrl = API_BASE_URL.replace(/\/api\.php.*$/, '/');
  return `${baseUrl}${fixedUrl.startsWith('/') ? fixedUrl.substring(1) : fixedUrl}`;
}

function fixImageUrlsDeep(obj: any): any {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(fixImageUrlsDeep);
  const result: any = {};
  for (const key in obj) {
    if ((key === 'coverUrl' || key === 'streamUrl' || key === 'encryptedUrl') && typeof obj[key] === 'string') {
      result[key] = fixImageUrl(obj[key]);
    } else if (key === 'images' && Array.isArray(obj[key])) {
      result[key] = obj[key].map((url: any) => typeof url === 'string' ? fixImageUrl(url) : url);
    } else {
      result[key] = fixImageUrlsDeep(obj[key]);
    }
  }
  return result;
}

async function request<T>(action: string, options: RequestInit = {}, params: Record<string, string | number | undefined> = {}): Promise<T> {
  const user = getStoredUser();
  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (user?.uid) {
    headers.set('X-User-Id', user.uid);
  }

  const response = await fetch(withAction(action, params), {
    ...options,
    headers,
  });

  const contentType = response.headers.get('Content-Type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error(`Unexpected API response (${response.status})`);
  }

  const payload = (await response.json()) as ApiEnvelope<T>;
  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || `API request failed (${response.status})`);
  }

  return fixImageUrlsDeep(payload.data) as T;
}

export const api = {
  login(email: string, displayName: string) {
    return request<UserProfile>('login', {
      method: 'POST',
      body: JSON.stringify({ email, displayName }),
    });
  },

  profile() {
    return request<UserProfile>('profile');
  },

  comics() {
    return request<Comic[]>('comics');
  },

  searchComics(q: string, genres: string[]) {
    return request<Comic[]>('search', {}, { q, genres: genres.join(',') });
  },

  comic(id: string) {
    return request<Comic>('comic', {}, { id });
  },

  chapters(comicId: string) {
    return request<Chapter[]>('chapters', {}, { comic_id: comicId });
  },

  chapter(comicId: string, chapterId: string) {
    return request<Chapter>('chapter', {}, { comic_id: comicId, chapter_id: chapterId });
  },

  favorites() {
    return request<Comic[]>('favorites');
  },

  addFavorite(comicId: string) {
    return request<{ favorite: boolean }>('favorite', {
      method: 'POST',
      body: JSON.stringify({ comicId }),
    });
  },

  removeFavorite(comicId: string) {
    return request<{ favorite: boolean }>('favorite', { method: 'DELETE' }, { comic_id: comicId });
  },

  history() {
    return request<HistoryWithComic[]>('history');
  },

  saveHistory(comicId: string, chapterId: string) {
    return request<{ saved: boolean }>('history', {
      method: 'POST',
      body: JSON.stringify({ comicId, chapterId }),
    });
  },

  deleteHistory(id: string) {
    return request<{ deleted: boolean }>('history', { method: 'DELETE' }, { id });
  },
};
