import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import MainLayout from "@/layouts/main-layout";
import { LoadingSpinner } from "@/components/core/loader";
import { ApiDataType, apiService } from "@/utils/request";
import Comment from "@/components/snippets/comments";
import SocialShare from "@/components/snippets/social-share";
import { getVideoShareUrl } from "@/utils";
import video from "@/components/skeletons/video";
import MakeComment from "@/components/snippets/comments/makeComment";
import { selectAuthUser } from "@/slices/authSlice";
import { useSelector } from "react-redux";

const VideoDetailsPage = () => {
  const router = useRouter();
  const authUser = useSelector(selectAuthUser);

  const { PostHashHex, Tag }: any = router.query;
  const tagParam: any = router.query.tag;
  const [hasLoaded, setHasLoaded] = useState<boolean>(true);
  const [videoData, setVideoData] = useState<any>([]);
  const [videoTotalPages, setVideoTotalPages] = useState<number>(Infinity);
  const [isRelatedVideosLoading, setIsRelatedVideosLoading] =
    useState<boolean>(false);
  const [relatedVideos, setRelatedVideos] = useState<any>([]);

  useEffect(() => {
    if (!router.isReady) return;
    fetchSingleProfile();
    fetchRelatedVideos();
  }, [router.isReady]);

  const fetchSingleProfile = async () => {
    const { getSinglePost } = await import("deso-protocol");
    const params = {
      PostHashHex,
    };

    const singlePost: any = await getSinglePost(params);

    setVideoData(singlePost?.PostFound);

    setHasLoaded(false);
  };

  const fetchRelatedVideos = async () => {
    setIsRelatedVideosLoading(true); // Set to loading state

    try {
      let apiUrl = `/api/posts?limit=10&moment=false`;
      if (tagParam) {
        const tagWithHash = tagParam.startsWith("#")
          ? tagParam
          : `#${tagParam}`;
        apiUrl += `&hashtag=${encodeURIComponent(tagWithHash)}`;
      }

      const apiData: ApiDataType = {
        method: "get",
        url: apiUrl,
        customUrl: process.env.NEXT_PUBLIC_MOMENTS_UTIL_URL,
      };

      await apiService(apiData, (res: any, err: any) => {
        if (err) return err.response;

        if (res?.totalPages && videoTotalPages !== res.totalPages) {
          setVideoTotalPages(res.totalPages);
        }

        if (res?.posts.length > 0) {
          // Filter out duplicates
          const uniquePosts = res.posts.filter((post: any) => {
            return post.PostHashHex !== videoData?.PostHashHex;
          });
          setRelatedVideos(uniquePosts);
        }

        setIsRelatedVideosLoading(false);
      });
    } catch (error: any) {
      console.error("error", error.response);
    } finally {
      setIsRelatedVideosLoading(false);
    }
  };

  const renderRelatedVidoes = () => {
    return relatedVideos.map((item: any, index: any) => (
      <div
        key={`video-${index}`}
        className="overflow-hidden flex grid grid-cols-3 items-center mt-2"
      >
        <div className="col-span-1">
          <iframe
            className="w-36 h-36"
            src={item.VideoURL}
            title="YouTube video player"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <div
          className="col-span-2"
          onClick={(e: any) => {
            router.push({
              pathname: `/video/${item?.PostHashHex}`,
            });
          }}
        >
          <p className="line-clamp-2 cursor-pointer">{item.Body}</p>
          <p>@{item.Username}</p>
        </div>
      </div>
    ));
  };

  return (
    <MainLayout title="Video Details">
      <div>
        {hasLoaded ? (
          <div className="min-h-[calc(100vh_-_72px)] grid grid-cols-3 p-5 gap-5 bg-[#ddd]">
            <LoadingSpinner isLoading={hasLoaded} />
          </div>
        ) : (
          <div className="min-h-[calc(100vh_-_72px)] grid grid-cols-3 p-5 gap-5 bg-[#ddd]">
            <div className="col-span-2">
              <div className="">
                <h1 className="text-4xl font-bold mb-4">
                  {videoData?.ProfileEntryResponse?.Username}
                </h1>
                <iframe
                  width="100%"
                  height="500"
                  src={
                    videoData.VideoURLs[0] ??
                    "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                  }
                  allowFullScreen
                ></iframe>

                <p className="mt-4 max-h-[74px] overflow-y-auto">
                  {videoData.Body}
                </p>

                <div>
                  {videoData.Comments !== null &&
                    videoData.Comments.map(
                      (comment: any, commentIndex: number) => (
                        <Comment comment={comment} key={commentIndex} />
                      )
                    )}
                </div>
                <SocialShare
                  url={getVideoShareUrl(videoData?.PostHashHex)}
                  title={videoData?.Body}
                ></SocialShare>

                {authUser && (
                  <MakeComment
                    postId={videoData.PostHashHex}
                    userId={authUser?.PublicKeyBase58Check}
                  ></MakeComment>
                )}

                <div>
                  {videoData.Comments !== null &&
                    videoData.Comments.map(
                      (comment: any, commentIndex: number) => (
                        <Comment comment={comment} key={commentIndex} />
                      )
                    )}
                </div>
              </div>

              <div className="mt-4 flex space-x-2">
                <div className="likes-count flex space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
                    />
                  </svg>
                  <div>{videoData.LikeCount}</div>
                </div>

                <div className="comments-count flex space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                    />
                  </svg>

                  <div>{videoData.CommentCount}</div>
                </div>

                <div className="reposted-count flex space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7.5 7.5h-.75A2.25 2.25 0 004.5 9.75v7.5a2.25 2.25 0 002.25 2.25h7.5a2.25 2.25 0 002.25-2.25v-7.5a2.25 2.25 0 00-2.25-2.25h-.75m0-3l-3-3m0 0l-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 012.25 2.25v7.5a2.25 2.25 0 01-2.25 2.25h-7.5a2.25 2.25 0 01-2.25-2.25v-.75"
                    />
                  </svg>

                  <div>{videoData.RepostCount}</div>
                </div>
              </div>
            </div>
            <div className="col-span-1 mt-12">
              {relatedVideos.length > 0 && !isRelatedVideosLoading ? (
                <div className="flex flex-col">
                  <p className="text-2xl">More videos</p>
                  {renderRelatedVidoes()}
                </div>
              ) : (
                <LoadingSpinner isLoading={isRelatedVideosLoading} />
              )}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default VideoDetailsPage;
