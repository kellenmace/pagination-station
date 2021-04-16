import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Pagination Station</h1>
        <div className={styles.card}>
          <Link href="/load-more">
            <a>Load More example →</a>
          </Link>
        </div>
        <div className={styles.card}>
          <Link href="/infinite-scroll" className={styles.card}>
            <a>Infinite Scroll example →</a>
          </Link>
        </div>
        <div className={styles.card}>
          <Link href="/blog/hello-world" className={styles.card}>
            <a>First blog post →</a>
          </Link>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by WordPress, WPGraphQL and Next.js
        </a>
      </footer>
    </div>
  );
}
