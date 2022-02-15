import { SignInButton } from '../SignInButton'
import styles from './styles.module.scss'


export function Header() {

  return(
    <header className={styles.Component} >
      <div className={styles.Content}>
        <img src="/aqui/images/logo.svg" alt="ignews" />
        <nav>
          <a className={styles.isActive}>Home</a>
          <a>Posts</a>
        </nav>

        <SignInButton />
      </div>
    </header>
  )
}