import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import classNames from "classnames";
import SideBar from "../../../../components/SideBar";
import ActionButton from "../../../../components/ActionButton";
import { Post } from "../../../../types";
import axios from "axios";
import { useAuthState } from "../../../../context/auth";
dayjs.extend(relativeTime);

export default function PostPage() {
  const { authenticated } = useAuthState();
  const router = useRouter();
  const { identifier, slug, sub } = router.query;
  const { data: post, error } = useSWR<Post>(
    identifier && slug ? `/posts/${identifier}/${slug}` : null
  );
  if (error) router.push("/");

  const vote = async (value: number) => {
    if (!authenticated) router.push("/login");

    if (value === post.userVote) value = 0;

    try {
      const res = await axios.post("/misc/vote", {
        identifier,
        slug,
        value,
      });
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Head>
        <title>{post?.title}</title>
      </Head>
      <Link href={`/r/${sub}`}>
        <a>
          <div className="flex items-center w-full h-20 p-8 bg-blue-500">
            <div className="container flex">
              {post && (
                <div className="w-8 h-8 mr-2 overflow-hidden rounded-full">
                  <Image
                    src={post.sub.imageUrl}
                    width={(8 * 16) / 4}
                    height={(8 * 16) / 4}
                  />
                </div>
              )}
              <p className="text-xl font-semibold text-white">/r/{sub}</p>
            </div>
          </div>
        </a>
      </Link>
      <div className="container flex pt-5">
        {/* Post */}
        <div className="w-160">
          <div className="bg-white rounded">
            {post && (
              <div className="flex">
                <div className="w-10 py-3 text-center rounded-l">
                  {/* Up vote */}
                  <div
                    className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500"
                    onClick={() => vote(1)}
                  >
                    <i
                      className={classNames("icon-arrow-up", {
                        "text-red-500": post?.userVote === 1,
                      })}
                    ></i>
                  </div>
                  <p className="text-xs font-bold">{post?.voteScore}</p>
                  {/* Down vote */}
                  <div
                    className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-600"
                    onClick={() => vote(-1)}
                  >
                    <i
                      className={classNames("icon-arrow-down", {
                        "text-blue-600": post?.userVote === -1,
                      })}
                    ></i>
                  </div>
                </div>
                <div className="p-2">
                  <div className="flex items-center">
                    <p className="text-xs text-gray-500">
                      Posted by
                      <Link href={`/u/${post?.username}`}>
                        <a className="mx-1 hover:underline">
                          /u/{post?.username}
                        </a>
                      </Link>
                      <Link href={post?.url}>
                        <a className="mx-1 hover:underline">
                          {dayjs(post?.createdAt).fromNow()}
                        </a>
                      </Link>
                    </p>
                  </div>
                  <h1 className="my-1 text-lg font-medium">{post?.title}</h1>
                  {post?.body && <p className="my-3 text-sm">{post?.body}</p>}
                  <div className="flex">
                    <Link href={post?.url}>
                      <a>
                        <ActionButton>
                          <i className="mr-1 fas fa-comment-alt fa-xs"></i>
                          <span className="font-bold">
                            {post?.commentCount} Comments
                          </span>
                        </ActionButton>
                      </a>
                    </Link>
                    <ActionButton>
                      <i className="mr-1 fas fa-share fa-xs"></i>
                      <span className="font-bold">Share</span>
                    </ActionButton>
                    <ActionButton>
                      <i className="mr-1 fas fa-bookmark fa-xs"></i>
                      <span className="font-bold">Save</span>
                    </ActionButton>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Sidebar */}
        {post && <SideBar sub={post.sub} />}
      </div>
    </>
  );
}
