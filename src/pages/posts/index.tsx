import { GetStaticProps } from 'next'
import { getPrismicClient } from '../../services/prismic'
import Prismic from '@prismicio/client'
import { RichText } from 'prismic-dom'
import styles from './styles.module.scss'

interface post {
  slug: string,
  title: string,
  excerpt: string,
  updateAt: string
}

interface PostsProps {
  posts: post[]
}


export default function Posts({ posts }: PostsProps) {

  return(
    <main className={styles.container}>
      <div className={styles.posts}>
        {
          posts.map(post => (
            <a href="#" key={post.slug}>
              <time>{post.updateAt}</time>
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
            </a>
          ))
        } 
      </div>
    </main>
  )
}


export const getStaticProps: GetStaticProps = async() => {
  const prismic = getPrismicClient()

  const response = await prismic.query<any>([
    Prismic.Predicates.at('document.type', 'posts')
  ])

  const posts = response.results.map(post => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      excerpt: post.data.content.find(content => content.type === 'paragraph')?.text ?? '',
      updateAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    }
  })


  return{
    props: {
      posts
    },
    //revalidate: 60 * 60 // 1 hours
  }
  
}