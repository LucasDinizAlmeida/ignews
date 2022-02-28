import { GetStaticPaths, GetStaticProps } from "next"
import { useSession } from "next-auth/react"
import Head from "next/head"
import Link from "next/link"
import { RichText } from "prismic-dom"
import { useEffect } from "react"
import { getPrismicClient } from "../../../services/prismic"
import styles from '../post.module.scss'
import { useRouter } from 'next/router'

interface PostProps {
  post: {
    slug: string,
    title: string,
    content: string,
    updateAt: string
  }
}

export default function Post({ post }: PostProps) {

  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if(session?.activeSubscription) {
      router.push(`/posts/${post.slug}`)
    }

  },[session, router, post.slug])
  
  return(
    <>
      <Head>
        <title>{post.title} | igNews</title>
      </Head>
      <main className={styles.container}>
        <article className={styles.post}>
          <a key={post.slug}>
            <h1>{post.title}</h1>
            <time>{post.updateAt}</time>
            <div 
              dangerouslySetInnerHTML={{__html: post.content}}
              className={`${styles.postContent} ${styles.previewContent}`}
            />
          </a>
        </article>

        <div className={styles.continueReading}>
          Wanna continue reading?
          <Link href='/'>
            <a>Subscribe now 👍</a>
          </Link>
        </div> 
      </main>
    </>
    
  )
}

export const getStaticPaths: GetStaticPaths = () => {

  return {
    paths: [
      {
        params: { slug: 'axios---um-cliente-http-full-stack' }
      }
    ],
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async({ params }) => {


  const { slug } = params

  const prismic = getPrismicClient()

  const response = await prismic.getByUID<any>('posts', String(slug), {})

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content.splice(0, 3)),
    updateAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
    
  }

  return{
    props: {
      post
    }
  }
}