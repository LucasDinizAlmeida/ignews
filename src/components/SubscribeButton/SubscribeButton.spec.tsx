import { fireEvent, render, screen } from '@testing-library/react';
import { mocked } from 'jest-mock';
import { useRouter } from 'next/router';
import { signIn, useSession } from 'next-auth/react';
import { SubscribeButton } from '.';

jest.mock('next-auth/react')
jest.mock('next/router')


describe('SubscribeButton component', () => {
  it('renders correctly', () => {
    const useSessionMocked = mocked(useSession)
    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: 'unauthenticated'
    })

    render(
      <SubscribeButton />
    )

    expect(screen.getByText('Subscribe now')).toBeInTheDocument()
  })

  it('redirects user to sign in when not authenticated', () => {
    const signInMocked = mocked(signIn)
    const useSessionMocked = mocked(useSession)
    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: 'unauthenticated'
    })

    render(
      <SubscribeButton />
    )

    const subscribeButton = screen.getByText('Subscribe now')

    fireEvent.click(subscribeButton)

    expect(signInMocked).toHaveBeenCalled()

  })

  it('redirects to posts when already has a subscription', () => {
    const useSessionMocked = mocked(useSession)
    useSessionMocked.mockReturnValueOnce({
      data: {
        user: {
          email: 'john.doe@example.com',
          image: 'fake-image',
          name: 'John Doe'
        },
        activeSubscription: 'fake-active-subscription',
        expires: 'fake-expires'
      },
      status: 'authenticated'
    })

    const pushMock = jest.fn()

    const useRouterMocked = mocked(useRouter)
    useRouterMocked.mockReturnValueOnce({
      push: pushMock
    } as any)

    render(
      <SubscribeButton />
    )

    const subscribeButton = screen.getByText('Subscribe now')
    fireEvent.click(subscribeButton)

    expect(pushMock).toHaveBeenCalled()
  })
})