import Link from "next/link";
import Head from "next/head";
import parse from "html-react-parser";
import { gql } from "@apollo/client";

import { client } from "../../services/apollo";

export default function Post({ post }) {
  const { title, content, previousPost, nextPost } = post;

  return (
    <>
      <Head>
        <title>{parse(title)} | Pagination Station</title>
      </Head>
      <main>
        <article>
          <header>
            <h1>{title}</h1>
          </header>
          <div>{parse(content)}</div>
          <footer style={{ display: "flex" }}>
            {previousPost ? (
              <div style={{ border: "2px solid #ddd", padding: "1rem" }}>
                <Link href={`/blog/${previousPost.slug}`}>
                  <a>👈 {previousPost.title}</a>
                </Link>
              </div>
            ) : null}
            {nextPost ? (
              <div
                style={{
                  border: "2px solid #ddd",
                  padding: "1rem",
                  marginLeft: "1rem",
                }}
              >
                <Link href={`/blog/${nextPost.slug}`}>
                  <a>{nextPost.title} 👉</a>
                </Link>
              </div>
            ) : null}
          </footer>
        </article>
      </main>
    </>
  );
}

export async function getStaticPaths() {
  const slugs = await getPostSlugs();
  const paths = slugs.map((slug) => {
    return { params: { slug } };
  });

  return {
    paths,
    fallback: false,
  };
}

async function getPostSlugs() {
  const { data } = await client.query({
    query: gql`
      query getPosts {
        posts(first: 100) {
          nodes {
            slug
          }
        }
      }
    `,
  });

  return data.posts.nodes.map((node) => node.slug);
}

const GET_POST = gql`
  query getPost($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      databaseId
      title
      content
      slug
      previousPost {
        title
        slug
      }
      nextPost {
        title
        slug
      }
    }
  }
`;

export async function getStaticProps(context) {
  const { data } = await client.query({
    query: GET_POST,
    variables: {
      slug: context.params.slug,
    },
  });

  return {
    props: {
      post: data.post,
    },
  };
}
