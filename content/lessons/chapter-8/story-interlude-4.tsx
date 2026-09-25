'use client'

import { useTranslations } from 'hooks'
import { Introduction, Text } from 'ui'

export const metadata = {
  title: 'story_interlude.title',
  navigation_title: 'story_interlude.verification_nav_title',
  image: '/assets/images/chapter-5-outro.jpg',
  key: 'CH8STI4',
}

export default function StoryInterlude4({ lang }) {
  const t = useTranslations(lang)

  return (
    <Introduction lang={lang} imagePosition="object-center">
      <h1 className="text-3xl font-bold md:text-4xl">
        {t('story_interlude.verification_heading')}
      </h1>
      <Text className="mt-4 text-lg md:text-xl">
        {t('chapter_five.intro_three.paragraph_four')}
      </Text>
      <Text className="mt-4 text-lg md:text-xl">
        {t('story_interlude.verification_result')}
      </Text>
      <Text className="mt-4 text-lg font-bold md:text-xl">
        {t('chapter_five.outro_one.paragraph_one')}
      </Text>
    </Introduction>
  )
}
