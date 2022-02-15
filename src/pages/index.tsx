import Head from "next/head"
import styles from './home.module.scss'

export default function Home() {
  return (
    <>
      <Head>
        <title>Home | ignews</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>
            News about <br /> 
            the <span>React</span> world
          </h1>
          <p>
            Get acess to all the publications <br />
            <span>for $9.90 mounth</span>
          </p>
        </section>
        <img src='/aqui/images/avatar.svg' alt="girl coding" />
      </main>
    </>
    
  )
}
