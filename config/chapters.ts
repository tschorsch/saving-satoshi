export const visibleChapterIds = new Set<number>([1, 2, 3, 8, 9, 10])

export const isChapterVisible = (chapterId: number) =>
  visibleChapterIds.has(chapterId)

export const getChapterOverviewLayoutPosition = (chapterId: number) =>
  chapterId >= 8 ? chapterId + 1 : chapterId
