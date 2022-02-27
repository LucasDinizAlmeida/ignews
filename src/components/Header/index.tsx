import Link from 'next/link'
import { useRouter } from 'next/router'
import { SignInButton } from '../SignInButton'
import styles from './styles.module.scss'
import { ActiveLink } from '../ActiveLink'


export function Header() {

  const { asPath } = useRouter()

  return(
    <header className={styles.Component} >
      <div className={styles.Content}>
        <img src="/aqui/images/logo.svg" alt="ignews" />
        <nav>
          <ActiveLink
            href='/'
            activeClassName={styles.isActive}
          >
            <a>
              Home
            </a>
          </ActiveLink>
   
          <ActiveLink 
            href='/posts'
            activeClassName={styles.isActive}
          >
            <a>
              Posts
            </a>
          </ActiveLink>
        
        </nav>

        <SignInButton />
      </div>
    </header>
  )
}