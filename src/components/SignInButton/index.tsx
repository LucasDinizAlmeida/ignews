
import { useSession, signIn, signOut } from 'next-auth/react';
import { FaGithub } from 'react-icons/fa'
import { FiX } from 'react-icons/fi'
import styles from './styles.module.scss'


export function SignInButton() {

  const { data: session } = useSession();


  return session? (
    <button 
      className={styles.signInButton}
      type='button'
      onClick={() => signOut()}
    >
      <FaGithub color='#84d361'/>
      {session.user.name}
      <FiX color='#737380' />
    </button>
  ) : (
    <button 
      className={styles.signInButton}
      type='button'
      onClick={() => signIn('github')}
    >
      <FaGithub color='#eba417'/>
      Sign in with GitHub
    </button>
  )
}