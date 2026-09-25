'use client'

import { useTranslations } from 'hooks'
import { Introduction, Text } from 'ui'

export const metadata = {
  title: 'story_interlude.title',
  navigation_title: 'story_interlude.issuance_nav_title',
  image: '/assets/images/chapter-5-intro-2.jpg',
  key: 'CH8STI3',
}

export default function StoryInterlude3({ lang }) {
  const t = useTranslations(lang)

  return (
    <Introduction lang={lang} imagePosition="object-center">
      <h1 className="text-3xl font-bold md:text-4xl">
        {t('story_interlude.issuance_heading')}
      </h1>
      <Text className="mt-4 text-lg md:text-xl">
        {t('chapter_five.intro_two.paragraph_three')}
      </Text>
    </Introduction>
  )
}
