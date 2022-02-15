import { FaGithub } from 'react-icons/fa'
import { FiX } from 'react-icons/fi'
import styles from './styles.module.scss'

export function SignInButton() {

  const isUserLoggedIn = true

  return isUserLoggedIn? (
    <button className={styles.signInButton}>
      <FaGithub color='#84d361'/>
      Lucas Diniz Almeida
      <FiX color='#737380' />
    </button>
  ) : (
    <button className={styles.signInButton}>
      <FaGithub color='#eba417'/>
      Sign in with GitHub
    </button>
  )
}