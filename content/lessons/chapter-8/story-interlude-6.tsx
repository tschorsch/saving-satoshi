'use client'

import { useTranslations } from 'hooks'
import { Introduction, Text } from 'ui'

export const metadata = {
  title: 'story_interlude.title',
  navigation_title: 'story_interlude.infiltration_nav_title',
  image: '/assets/images/chapter-7-intro-1.jpg',
  key: 'CH8STI6',
}

export default function StoryInterlude6({ lang }) {
  const t = useTranslations(lang)

  return (
    <Introduction lang={lang} imagePosition="object-center">
      <h1 className="text-3xl font-bold md:text-4xl">
        {t('story_interlude.infiltration_heading')}
      </h1>
      <Text className="mt-4 text-lg md:text-xl">
        {t('chapter_seven.paragraph_one')}
      </Text>
      <Text className="mt-4 text-lg md:text-xl">
        {t('chapter_seven.intro_one.paragraph_three')}
      </Text>
      <Text className="mt-4 text-lg md:text-xl">
        {t('chapter_seven.intro_one.paragraph_four')}
      </Text>
      <Text className="mt-4 text-lg md:text-xl">
        {t('chapter_seven.intro_one.paragraph_five')}
      </Text>
    </Introduction>
  )
}
