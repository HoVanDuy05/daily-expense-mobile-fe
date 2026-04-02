/**
 * Định nghĩa chuẩn các Route của ứng dụng.
 * Sử dụng để tránh việc truyền string trực tiếp vào router.push() ở khắp nơi.
 */
export const ROUTES = {
  TABS: {
    NAME: '(tabs)',
    INBOX: '/(tabs)',
    TIMELINE: '/(tabs)/timeline',
    CONTACTS: '/(tabs)/contacts',
    PROFILE: '/(tabs)/profile',
  },
  CHAT: {
    NAME: 'chat/[id]',
    DETAILS: (id: string) => `/chat/${id}` as const,
  },
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  }
} as const;
