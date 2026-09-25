'use client'

import { useTranslations } from 'hooks'
import { Introduction, Text } from 'ui'

export const metadata = {
  title: 'story_interlude.title',
  navigation_title: 'story_interlude.vanderpoole_nav_title',
  image: '/assets/images/chapter-5-intro-1.jpg',
  key: 'CH8STI2',
}

export default function StoryInterlude2({ lang }) {
  const t = useTranslations(lang)

  return (
    <Introduction lang={lang} imagePosition="object-[50%_27%]">
      <h1 className="text-3xl font-bold md:text-4xl">
        {t('story_interlude.vanderpoole_heading')}
      </h1>
      <Text className="mt-4 text-lg md:text-xl">
        {t('chapter_five.intro_one.paragraph_one')}
      </Text>
      <Text className="mt-4 text-lg md:text-xl">
        {t('chapter_five.intro_one.paragraph_two')}
      </Text>
      <Text className="mt-4 text-lg md:text-xl">
        {t('chapter_five.intro_one.paragraph_three')}
      </Text>
      <Text className="mt-4 text-lg md:text-xl">
        {t('chapter_five.intro_one.paragraph_four')}
      </Text>
    </Introduction>
  )
}
