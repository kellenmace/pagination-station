import Head from "next/head";

import InfiniteScrollList from "../components/InfiniteScrollList";

export default function InfiniteScroll() {
  return (
    <>
      <Head>
        <title>Infinite Scroll</title>
      </Head>

      <main style={{ margin: "4rem" }}>
        <h1>Infinite Scroll Example</h1>
        <InfiniteScrollList />
      </main>
    </>
  );
}
