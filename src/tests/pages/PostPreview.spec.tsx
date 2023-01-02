import { render, screen } from "@testing-library/react";
import { useSession, getSession } from "next-auth/react";
import { useRouter } from 'next/router';
import { mocked } from "jest-mock";
import Post, { getStaticProps } from "../../pages/posts/preview/[slug]";
import { getPrismicClient } from "../../services/prismic";


const post =
{
  slug: 'my-new-post',
  title: 'My New Post',
  content: '<p>Post excerpt</p>',
  updateAt: '10 de Abril'
}

jest.mock("next-auth/react")
jest.mock('next/router')
jest.mock('../../services/prismic')


describe('Posts preview page', () => {
  it('renders correctly', () => {
    const useSessionMocked = mocked(useSession)
    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: 'unauthenticated'
    })

    render(<Post post={post} />)

    expect(screen.getByText('My New Post')).toBeInTheDocument()
    expect(screen.getByText('Post excerpt')).toBeInTheDocument()
    expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument()
  })

  it(' redirects user to full post when user is subscription', async () => {
    const useSessionMocked = mocked(useSession)
    const useRouterMocked = mocked(useRouter)
    const pushMocked = jest.fn()
    useSessionMocked.mockReturnValueOnce({
      data: {
        user: {
          email: 'john.doe@example.com',
          image: 'image-fake',
          name: 'John Doe',
        },
        activeSubscription: 'fake-active-subscription',
        expires: 'fake-expires',
      },
      status: 'authenticated'
    } as any)

    useRouterMocked.mockReturnValueOnce({
      push: pushMocked
    } as any)

    render(<Post post={post} />)

    expect(pushMocked).toHaveBeenCalledWith('/posts/my-new-post')
  })

  it('loads initial data', async () => {
    const getSessionMocked = mocked(getSession)
    getSessionMocked.mockReturnValueOnce({
      activeSubscription: 'fake-active-subscription'
    } as any)

    const getPrismicClientMocked = mocked(getPrismicClient)
    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [
            { type: 'heading', text: 'My new post' }
          ],
          content: [
            { type: 'paragraph', text: 'Post content' }
          ]
        },
        last_publication_date: '04-01-2021'
      })
    } as any)

    const response = await getStaticProps({
      params: { slug: 'my-new-post' }
    } as any)


    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'my-new-post',
            title: 'My new post',
            content: '<p>Post content</p>',
            updateAt: '01 de abril de 2021'
          }
        }
      })
    )
  })
})