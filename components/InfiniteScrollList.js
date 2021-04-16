import { useQuery, gql } from "@apollo/client";
import Link from "next/link";
import InfiniteScroll from "react-infinite-scroll-component";

const GET_POSTS = gql`
  query getPosts($first: Int!, $after: String) {
    posts(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          databaseId
          title
          slug
        }
      }
    }
  }
`;

const BATCH_SIZE = 10;

export default function InfiniteScrollList() {
  const { data, loading, error, fetchMore } = useQuery(GET_POSTS, {
    variables: { first: BATCH_SIZE, after: null },
    notifyOnNetworkStatusChange: true,
  });

  function fetchMorePosts() {
    fetchMore({ variables: { after: data.posts.pageInfo.endCursor } });
  }

  if (error) {
    return <p>Sorry, an error has occurred. Please reload the page.</p>;
  }

  if (!data && loading) {
    return <p>Loading...</p>;
  }

  if (!data?.posts.edges.length) {
    return <p>No posts have been published.</p>;
  }

  const posts = data.posts.edges.map((edge) => edge.node);
  const haveMorePosts = Boolean(data.posts?.pageInfo?.hasNextPage);

  return (
    <ul style={{ padding: "0" }}>
      <InfiniteScroll
        dataLength={posts.length}
        next={fetchMorePosts}
        hasMore={haveMorePosts}
        loader={<p>Loading...</p>}
        endMessage={<p>✅ All posts loaded.</p>}
      >
        {posts.map((post) => {
          const { databaseId, title, slug } = post;
          return (
            <li
              key={databaseId}
              style={{
                border: "2px solid #ededed",
                borderRadius: "10px",
                padding: "2rem",
                listStyle: "none",
                marginBottom: "1rem",
              }}
            >
              <Link href={`/blog/${slug}`}>
                <a>{title}</a>
              </Link>
            </li>
          );
        })}
      </InfiniteScroll>
    </ul>
  );
}
