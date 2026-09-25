'use client'

import Image from 'next/image'
import { useAtomValue } from 'jotai'
import { useTranslations } from 'hooks'
import useEnvironment from 'hooks/useEnvironment'
import { Button } from 'shared'
import Icon from 'shared/Icon'
import { useModalFunctions } from 'state/ModalFunctions'
import {
  isLoadingProgressAtom,
  syncedCourseProgressAtom,
} from 'state/progress/atoms'
import { accountAtom, isAuthLoadingAtom, Modal } from 'state/state'

const images = [
  '/assets/images/chapter-4-cover.jpg',
  '/assets/images/chapter-5-cover.jpg',
  '/assets/images/chapter-6-cover.jpg',
  '/assets/images/chapter-7-cover.jpg',
]

export default function StoryInterludeOverview({ lang }: { lang: string }) {
  const t = useTranslations(lang)
  const { isDevelopment } = useEnvironment()
  const account = useAtomValue(accountAtom)
  const isAuthLoading = useAtomValue(isAuthLoadingAtom)
  const isProgressLoading = useAtomValue(isLoadingProgressAtom)
  const courseProgress = useAtomValue(syncedCourseProgressAtom)
  const { open } = useModalFunctions()
  const chapterThreeCompleted =
    courseProgress.chapters.find((chapter) => chapter.id === 3)?.completed ??
    false
  const isLoading = !isDevelopment && (isAuthLoading || isProgressLoading)
  const canStart = isDevelopment || (!!account && chapterThreeCompleted)

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
          {isLoading ? (
            <div className="mt-8 flex font-nunito text-lg text-white">
              <Icon
                icon="lock"
                className="my-auto mr-2 h-3 w-3 justify-center"
              />
              {t('shared.loading')}...
            </div>
          ) : canStart ? (
            <Button
              href={`/${lang}/chapters/chapter-8/story-interlude-1${
                isDevelopment ? '?dev=true' : ''
              }`}
              classes="mt-8 w-full"
            >
              {t('story_interlude.start')}
            </Button>
          ) : (
            <div className="mt-8 flex font-nunito text-lg text-white">
              <Icon
                icon="lock"
                className="my-auto mr-2 h-3 w-3 justify-center"
              />
              <span>
                {t('story_interlude.complete_chapter_three_to_unlock')}
              </span>
              {!account && (
                <button
                  onClick={() => open(Modal.SignIn)}
                  className="ml-1 underline"
                >
                  {t('modal_signin.login')}
                </button>
              )}
            </div>
          )}
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
