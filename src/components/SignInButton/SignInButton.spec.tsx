import { render, screen } from '@testing-library/react';
import { SignInButton } from '.';
import { useSession } from 'next-auth/react';
import { mocked } from 'jest-mock';

jest.mock('next-auth/react')

describe('SignInButton component', () => {
  it('renders correctly when user is not authenticated', () => {
    const useSessionMocked = mocked(useSession)
    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: 'unauthenticated'
    })

    const { debug } = render(
      <SignInButton />
    )

    debug()

    expect(screen.getByText('Sign in with GitHub')).toBeInTheDocument()
  })

  it('renders correctly when user is authenticated', () => {
    const useSessionMocked = mocked(useSession)
    useSessionMocked.mockReturnValueOnce({
      data: {
        user: {
          email: 'john.doe@example.com',
          image: 'image-fake',
          name: 'John Doe'
        },
        expires: 'fake-expires'
      },
      status: 'authenticated'
    })

    render(
      <SignInButton />
    )

    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })
})