import { metadata as chapterEightMetadata } from 'content/chapters/chapter-8'
import Chapter8Lessons from 'content/lessons/chapter-8'
import { describe, expect, it } from 'vitest'

const interludeLessons = Array.from(
  { length: 8 },
  (_, index) => `story-interlude-${index + 1}`
)

describe('chapter 4–7 story interlude', () => {
  it('registers all story screens independently of the chapter 8 intro', () => {
    for (const lessonId of interludeLessons) {
      expect(Chapter8Lessons[lessonId]).toBeDefined()
    }

    expect(chapterEightMetadata.intros[0]).toBe('intro-1')
    expect(
      interludeLessons.some((lessonId) =>
        chapterEightMetadata.intros.includes(lessonId)
      )
    ).toBe(false)
  })

  it('does not register any interlude screen as a challenge', () => {
    expect(
      interludeLessons.some((lessonId) =>
        chapterEightMetadata.challenges.includes(lessonId)
      )
    ).toBe(false)
  })
})
