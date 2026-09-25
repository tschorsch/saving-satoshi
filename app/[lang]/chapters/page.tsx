import Topbar from 'components/Topbar'
import Footer from 'components/Footer'
import Disclaimer from 'components/Disclaimer'
import StoryInterludeOverview from 'components/StoryInterludeOverview'
import { chapters } from 'content'
import defaultMetadata from 'config/metadata'
import { isChapterVisible } from 'config/chapters'
import { Fragment } from 'react'

export const metadata = {
  ...defaultMetadata,
  title: 'Chapters - Saving Satoshi',
}

export default async function ChaptersPage({ params }) {
  const sortedChapters = Object.values(chapters)
    .filter((chapter) => isChapterVisible(chapter.metadata.position + 1))
    .sort((a, b) => a.metadata.position - b.metadata.position)

  return (
    <div className="w-full bg-[#2A3B61] pt-[70px]">
      <Topbar />

      <div className="lg:px-0">
        <Disclaimer />
        <section>
          {sortedChapters.map(({ default: Chapter, metadata }) => (
            <Fragment key={metadata.slug}>
              <Chapter lang={params.lang} />
              {metadata.slug === 'chapter-3' && (
                <StoryInterludeOverview lang={params.lang} />
              )}
            </Fragment>
          ))}
        </section>
      </div>

      <Footer className="bg-black/25" />
    </div>
  )
}
