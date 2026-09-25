'use client'

import { useTranslations } from 'hooks'
import { Introduction, Text } from 'ui'

export const metadata = {
  title: 'story_interlude.title',
  navigation_title: 'story_interlude.repair_nav_title',
  image: '/assets/images/chapter-7-outro.jpg',
  key: 'CH8STI8',
}

export default function StoryInterlude8({ lang }) {
  const t = useTranslations(lang)

  return (
    <Introduction lang={lang} imagePosition="object-center">
      <h1 className="text-3xl font-bold md:text-4xl">
        {t('story_interlude.repair_heading')}
      </h1>
      <Text className="mt-4 text-lg md:text-xl">
        {t('chapter_seven.intro_three.paragraph_one')}
      </Text>
      <Text className="mt-4 text-lg md:text-xl">
        {t('story_interlude.repair_result')}
      </Text>
      <Text className="mt-4 text-lg md:text-xl">
        {t('chapter_seven.outro_one.paragraph_one')}
      </Text>
      <Text className="mt-4 text-lg font-bold md:text-xl">
        {t('story_interlude.closing_bridge')}
      </Text>
    </Introduction>
  )
}
