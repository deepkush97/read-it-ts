import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import useSWR from "swr";
import SideBar from "../../../components/SideBar";
import { Post, Sub } from "../../../types";
export default function PostSubmitPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const subName = router.query.sub;
  const { data: sub, error, revalidate } = useSWR<Sub>(
    subName ? `/subs/${subName}` : null
  );
  if (error) router.push("/");
  const submitPost = async (event: FormEvent) => {
    event.preventDefault();
    if (title.trim() === "") return;
    try {
      const { data: post } = await axios.post<Post>("/posts", {
        title: title.trim(),
        body,
        sub: sub.name,
      });
      router.push(`/r/${sub.name}/${post.identifier}/${post.slug}`);
    } catch (error) {}
  };
  return (
    <div className="container flex pt-5">
      <Head>
        <title>Submit to read-it</title>
      </Head>
      <div className="w-160">
        <div className="p-4 bg-white rounded">
          Submit a post to /r/{subName}
          <form onSubmit={submitPost}>
            <div className="relative mb-2">
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-600"
                placeholder="Title"
                maxLength={300}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div
                className="absolute mb-2 text-sm text-gray-500 select-none"
                style={{ top: 11, right: 10 }}
              >
                {title.trim().length}/300
              </div>
            </div>
            <textarea
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-600"
              onChange={(e) => setBody(e.target.value)}
              value={body}
              placeholder="Text (optional)"
              rows={4}
            ></textarea>
            <div className="flex justify-end">
              <button
                className="px-3 py-1 blue button"
                disabled={title.trim().length <= 0}
                type="submit"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
      {sub && <SideBar sub={sub} />}
    </div>
  );
}
