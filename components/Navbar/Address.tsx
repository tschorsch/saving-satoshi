import React from 'react'
import { usePathname } from 'next/navigation'
import { chapters, lessons } from 'content'
import { useLang, useTranslations } from 'hooks'

export default function Address() {
  const lang = useLang()
  const t = useTranslations(lang)

  const pathName = usePathname() || ''
  const pathData = pathName.split('/').filter((p) => p)
  const isLessonRoute = pathData.length === 4

  const lessonId = isLessonRoute ? pathData.pop() : undefined
  const chapterId = pathData.pop()

  if (!chapterId || !(chapterId in chapters)) {
    return null
  }

  if (!lessonId || !(lessonId in lessons[chapterId])) {
    return null
  }

  const chapter = chapters[chapterId].metadata
  const chapterLessons = lessons[chapterId]
  const lesson = chapterLessons[lessonId]?.metadata

  const challengeTitles = chapter.challenges.map((lessonId: string) => {
    const { title } = lessons[chapterId][lessonId].metadata

    return { groupId: lessonId.split('-')[0], title }
  })

  const challengeName = lessonId?.split('-')[0]
  const challengeTitle = challengeTitles.find(
    ({ groupId }) => groupId === challengeName
  )?.title
  const isStoryInterlude = lessonId.startsWith('story-interlude')
  const sectionTitle = challengeTitle
    ? t(challengeTitle)
    : lessonId.startsWith('outro')
    ? t('navbar.outro')
    : lessonId.startsWith('intro')
    ? t('navbar.intro')
    : t(lesson?.title)

  // One time code, to be removed after Tabconf
  const isTabconf = lessonId === 'tabconf-clue-1'

  return (
    <div className="flex flex-col justify-center overflow-x-hidden px-5 text-sm font-medium">
      {pathName && (
        <>
          {chapter && !isTabconf && (
            <span className="truncate px-0.5 align-sub text-lg leading-tight text-white/50">
              {isStoryInterlude ? (
                <span>{sectionTitle}</span>
              ) : (
                <>
                  <span>
                    {t('navbar.chapter')} {chapter.position + 1}
                  </span>
                  <span>, </span>
                  <span>{sectionTitle}</span>
                </>
              )}
            </span>
          )}
          {isTabconf && (
            <span className="truncate px-0.5 align-sub text-lg leading-tight text-white/50">
              {'Tabconf Challenge'}
            </span>
          )}
          <span className="truncate px-0.5 align-super text-2xl leading-tight text-white">
            {t(lesson ? lesson.navigation_title : 'navbar.intro')}
          </span>
        </>
      )}
    </div>
  )
}
