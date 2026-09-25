'use client'

import { useTranslations } from 'hooks'
import { Introduction, Text } from 'ui'

export const metadata = {
  title: 'story_interlude.title',
  navigation_title: 'story_interlude.investigation_nav_title',
  image: '/assets/images/chapter-6-intro-2.jpg',
  key: 'CH8STI5',
}

export default function StoryInterlude5({ lang }) {
  const t = useTranslations(lang)

  return (
    <Introduction lang={lang} imagePosition="object-center">
      <h1 className="text-3xl font-bold md:text-4xl">
        {t('story_interlude.investigation_heading')}
      </h1>
      <Text className="mt-4 text-lg md:text-xl">
        {t('chapter_six.intro_two.paragraph_six')}
      </Text>
      <Text className="mt-4 text-lg md:text-xl">
        {t('story_interlude.investigation_funding')}
      </Text>
    </Introduction>
  )
}
