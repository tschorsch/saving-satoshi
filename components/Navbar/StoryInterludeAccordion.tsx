import clsx from 'clsx'
import { lessons } from 'content'
import { useLang, useTranslations } from 'hooks'
import useEnvironment from 'hooks/useEnvironment'
import { useAtomValue } from 'jotai'
import React from 'react'
import DiagonalCross from 'shared/icons/DiagonalCross'
import LineDash from 'shared/icons/LineDash'
import { syncedCourseProgressAtom } from 'state/progress/atoms'
import ChapterLesson from './NavbarDesktop/ChapterLesson'

export const storyInterludeMenuId = -1

const interludeLessons = Array.from(
  { length: 8 },
  (_, index) => `story-interlude-${index + 1}`
)

export default function StoryInterludeAccordion({
  currentChapter,
  setCurrentChapter,
}: {
  currentChapter: number
  setCurrentChapter: React.Dispatch<React.SetStateAction<number>>
}) {
  const lang = useLang()
  const t = useTranslations(lang)
  const { isDevelopment } = useEnvironment()
  const courseProgress = useAtomValue(syncedCourseProgressAtom)
  const isOpen = currentChapter === storyInterludeMenuId
  const chapterThree = courseProgress.chapters.find(
    (chapter) => chapter.id === 3
  )
  const isUnlocked = chapterThree?.completed || isDevelopment

  const updateCurrentChapter = () => {
    setCurrentChapter(isOpen ? 0 : storyInterludeMenuId)
  }

  return currentChapter === 0 || isOpen ? (
    <div className="flex cursor-pointer flex-col gap-6 px-5">
      <div
        className={clsx(
          'flex items-center justify-between border-b border-b-white/30 py-6',
          isUnlocked ? 'opacity-100' : 'cursor-not-allowed opacity-50'
        )}
        onClick={isUnlocked ? updateCurrentChapter : undefined}
      >
        <p className="font-cbrush text-2xl">{t('story_interlude.title')}</p>
        <div className={clsx(isUnlocked ? 'block' : 'hidden')}>
          {!isOpen && <DiagonalCross />}
          {isOpen && <LineDash />}
        </div>
      </div>

      {isOpen && (
        <div className="flex flex-col pb-4">
          {interludeLessons.map((lessonId) => (
            <ChapterLesson
              key={lessonId}
              chapterId={8}
              id={lessonId}
              title={lessons['chapter-8'][lessonId].metadata.title}
              courseProgress={courseProgress}
            />
          ))}
        </div>
      )}
    </div>
  ) : null
}
