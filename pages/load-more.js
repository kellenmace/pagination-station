import Head from "next/head";

import LoadMoreList from "../components/LoadMoreList";

export default function LoadMore() {
  return (
    <>
      <Head>
        <title>Load More</title>
      </Head>

      <main style={{ margin: "4rem" }}>
        <h1>Load More Example</h1>
        <LoadMoreList />
      </main>
    </>
  );
}
