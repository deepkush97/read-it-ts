import axios from "axios";
import classNames from "classnames";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { ChangeEvent, createRef, Fragment, useEffect, useState } from "react";
import useSWR from "swr";
import PostCard from "../../components/PostCard";
import SideBar from "../../components/SideBar";
import { useAuthState } from "../../context/auth";
import { Sub } from "../../types";
export default function SubPage() {
  const [ownSub, setOwnSub] = useState(false);

  const { authenticated, user } = useAuthState();

  const router = useRouter();
  const fileInputRef = createRef<HTMLInputElement>();

  const openFileInput = (type: string) => {
    if (!ownSub) return;
    fileInputRef.current.name = type;
    fileInputRef.current.click();
  };
  const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", fileInputRef.current.name);

    try {
      await axios.post<Sub>(`/subs/${sub.name}/image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      revalidate();
    } catch (error) {
      console.log(error);
    }
  };

  const subName = router.query.sub;
  const { data: sub, error, revalidate } = useSWR<Sub>(
    subName ? `/subs/${subName}` : null
  );
  useEffect(() => {
    if (!sub) return;
    setOwnSub(authenticated && user.username === sub.username);
  }, [sub]);
  if (error) router.push("/");
  let postMarkup;
  if (!sub) {
    postMarkup = <p className="text-lg text-center">Loading...</p>;
  } else if (sub.posts.length === 0) {
    postMarkup = <p className="text-lg text-center">No post submitted yet</p>;
  } else {
    postMarkup = sub.posts.map((post) => (
      <PostCard key={post.identifier} post={post} />
    ));
  }

  return (
    <div>
      <Head>
        <title>{sub?.title}</title>
      </Head>
      {sub && (
        <Fragment>
          <input
            type="file"
            hidden={true}
            ref={fileInputRef}
            onChange={uploadImage}
          />
          {/* Sub info and images */}
          <div>
            <div
              className={classNames("bg-blue-500", {
                "cursor-pointer": ownSub,
              })}
              onClick={() => openFileInput("banner")}
            >
              {sub.bannerUrl ? (
                <div
                  className="h-20 bg-blue-500"
                  style={{
                    backgroundImage: `url(${sub.bannerUrl})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
              ) : (
                <div className="h-20 bg-blue-500"></div>
              )}
            </div>
            <div className="h-20 bg-white">
              <div className="container relative flex">
                <div className="absolute" style={{ top: -15 }}>
                  <Image
                    src={sub.imageUrl}
                    alt="SubLogo"
                    className={classNames("rounded-full", {
                      "cursor-pointer": ownSub,
                    })}
                    width={70}
                    height={70}
                    onClick={() => openFileInput("image")}
                  />
                </div>
                <div className="pt-1 pl-24">
                  <div className="flex items-center">
                    <h1 className="mb-1 text-3xl font-bold">{sub.title}</h1>
                  </div>
                  <p className="text-sm font-bold text-gray-500">
                    /r/{sub.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Post and sidebar */}
          <div className="container flex pt-5">
            <div className="w-160">{postMarkup}</div>
            <SideBar sub={sub} />
          </div>
        </Fragment>
      )}
    </div>
  );
}
