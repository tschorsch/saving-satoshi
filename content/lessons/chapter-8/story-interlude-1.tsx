'use client'

import { useTranslations } from 'hooks'
import { Introduction, Text } from 'ui'

export const metadata = {
  title: 'story_interlude.title',
  navigation_title: 'story_interlude.opening_nav_title',
  image: '/assets/images/chapter-4-intro-1.jpg',
  key: 'CH8STI1',
}

export default function StoryInterlude1({ lang }) {
  const t = useTranslations(lang)

  return (
    <Introduction lang={lang} imagePosition="object-center">
      <h1 className="text-3xl font-bold md:text-4xl">
        {t('story_interlude.title')}
      </h1>
      <Text className="mt-4 text-lg md:text-xl">
        {t('story_interlude.workshop_notice')}
      </Text>
      <Text className="mt-4 text-lg md:text-xl">
        {t('chapter_four.intro_one.paragraph_three')}
      </Text>
      <Text className="mt-4 text-lg md:text-xl">
        {t('chapter_four.public_key_one.paragraph_one')}
      </Text>
      <Text className="mt-4 text-lg md:text-xl">
        {t('chapter_four.public_key_one.paragraph_two')}
      </Text>
      <Text className="mt-4 text-lg md:text-xl">
        {t('chapter_four.outro_one.paragraph_one')}
      </Text>
      <Text className="mt-2 text-lg md:text-xl">
        {t('chapter_four.outro_one.paragraph_two')}
      </Text>
    </Introduction>
  )
}
