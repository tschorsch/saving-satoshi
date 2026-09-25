import { describe, expect, it } from 'vitest'
import {
  getChapterOverviewLayoutPosition,
  isChapterVisible,
  visibleChapterIds,
} from 'config/chapters'

describe('chapter visibility config', () => {
  it('shows only the selected chapters', () => {
    expect(Array.from(visibleChapterIds)).toEqual([1, 2, 3, 8, 9, 10])
  })

  it.each([4, 5, 6, 7])('hides chapter %i', (chapterId) => {
    expect(isChapterVisible(chapterId)).toBe(false)
  })

  it('shifts the overview layout alternation after the interlude', () => {
    expect(getChapterOverviewLayoutPosition(3)).toBe(3)
    expect(getChapterOverviewLayoutPosition(8)).toBe(9)
    expect(getChapterOverviewLayoutPosition(9)).toBe(10)
    expect(getChapterOverviewLayoutPosition(10)).toBe(11)
  })
})
