'use client'

import Image from 'next/image'
import { useTranslations } from 'hooks'
import { Button } from 'shared'

const images = [
  '/assets/images/chapter-4-cover.jpg',
  '/assets/images/chapter-5-cover.jpg',
  '/assets/images/chapter-6-cover.jpg',
  '/assets/images/chapter-7-cover.jpg',
]

export default function StoryInterludeOverview({ lang }: { lang: string }) {
  const t = useTranslations(lang)

  return (
    <div
      id="story-interlude"
      className="grid grid-cols-1 border-y border-white/10 bg-black/10 lg:grid-cols-2"
    >
      <div className="order-2 flex items-center px-[18px] py-12 lg:order-1 lg:px-[50px] lg:py-[112px]">
        <div className="w-full">
          <h2 className="text-left text-3xl text-white md:text-5xl">
            {t('story_interlude.title')}
          </h2>
          <p className="mt-6 font-nunito text-lg text-white md:text-xl">
            {t('story_interlude.workshop_notice')}
          </p>
          <Button
            href={`/${lang}/chapters/chapter-8/story-interlude-1`}
            classes="mt-8 w-full"
          >
            {t('shared.start')}
          </Button>
        </div>
      </div>

      <div className="order-1 grid min-h-[375px] grid-cols-2 lg:order-2 lg:min-h-[600px]">
        {images.map((src, index) => (
          <div key={src} className="relative min-h-[187px] lg:min-h-[300px]">
            <Image
              src={src}
              alt={`${t('story_interlude.title')} ${index + 1}`}
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              quality={92}
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
