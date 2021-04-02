import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Head from "next/head";
import { useEffect, useState } from "react";
import useSWR from "swr";
import PostCard from "../components/PostCard";
import { Post } from "../types";
dayjs.extend(relativeTime);
export default function Home() {
  const { data: posts } = useSWR("/posts");
  return (
    <div className="pt-12 ">
      <Head>
        <title>Read-It | Front page of the internet</title>
      </Head>
      <div className="container flex pt-4">
        {/* Post feed */}
        <div className="w-160">
          {posts?.map((post) => (
            <PostCard key={post.identifier} post={post} />
          ))}
        </div>
        {/* Sidebar */}
      </div>
    </div>
  );
}

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   try {
//     const res = await axios.get("/posts");
//     return { props: { posts: res.data } };
//   } catch (error) {
//     return { props: { error: "Something went wrong" } };
//   }
// };
