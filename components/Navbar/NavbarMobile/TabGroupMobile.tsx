import clsx from 'clsx'
import { syncedCourseProgressAtom } from 'state/progress/atoms'
import { useAtomValue } from 'jotai'
import { Fragment, useState } from 'react'
import ChapterAccordion from '../NavbarDesktop/ChapterAccordion'
import { isChapterVisible } from 'config/chapters'
import StoryInterludeAccordion from '../StoryInterludeAccordion'

export default function TabGroup({ isOpen, clicked, params }) {
  const courseProgress = useAtomValue(syncedCourseProgressAtom)
  const [currentChapter, setCurrentChapter] = useState(0)

  return (
    <div className="flex h-full flex-col items-stretch font-nunito">
      <ul
        className={clsx(
          'grid w-full items-start py-4',
          'duration-800 transform transition ease-in-out',
          {
            '-translate-x-[110%]': !isOpen,
            'translate-x-0': isOpen,
          }
        )}
      >
        <div className="flex h-[calc(100dvh-70px)] flex-col text-white">
          {courseProgress &&
            courseProgress.chapters
              .filter((chapter) => isChapterVisible(chapter.id))
              .map((chapter) => (
                <Fragment key={chapter.id}>
                  <ChapterAccordion
                    id={chapter.id}
                    currentChapter={currentChapter}
                    setCurrentChapter={setCurrentChapter}
                    completed={chapter.completed}
                    hasDifficulty={chapter.hasDifficulty}
                  />
                  {chapter.id === 3 && (
                    <StoryInterludeAccordion
                      currentChapter={currentChapter}
                      setCurrentChapter={setCurrentChapter}
                    />
                  )}
                </Fragment>
              ))}
        </div>
      </ul>
    </div>
  )
}
