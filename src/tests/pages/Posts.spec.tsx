import { render, screen } from "@testing-library/react";
import { mocked } from "jest-mock";
import Posts, { getStaticProps } from "../../pages/posts";
import { getPrismicClient } from "../../services/prismic";


const posts = [
  {
    slug: 'my-new-post',
    title: 'My New Post',
    excerpt: 'Post excerpt',
    updateAt: '10 de Abril'
  }
]

jest.mock('../../services/prismic')


describe('Posts page', () => {
  it('renders correctly', () => {
    render(<Posts posts={posts} />)

    expect(screen.getByText('My New Post'))
  })

  it('loads initial data', async () => {
    const getPrismaClientMocked = mocked(getPrismicClient)
    getPrismaClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: 'my-new-post',
            data: {
              title: [
                { type: 'heading', text: 'My new Post' }
              ],
              content: [
                { type: 'paragraph', text: 'Post excerpt' }
              ]
            },
            last_publication_date: '04-01-2021'
          }
        ]
      })
    } as any)

    const response = await getStaticProps({})

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [
            {
              slug: 'my-new-post',
              title: 'My new Post',
              excerpt: 'Post excerpt',
              updateAt: '01 de abril de 2021'
            }
          ]
        }
      })
    )
  })
})