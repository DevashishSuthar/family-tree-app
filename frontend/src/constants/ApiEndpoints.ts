export const FAMILY_ENDPOINTS = {
  createFamily: '/families',
  getAllFamilies: '/families',
  getMembersOfFamily: (familyRef: string) => `/families/${familyRef}/members`,
  getFamily: (familyRef: string) => `/families/${familyRef}`,
  deleteFamily: (familyRef: string) => `/families/${familyRef}`,
} as const;

export const MEMBER_ENDPOINTS = {
  createMember: '/members',
} as const;