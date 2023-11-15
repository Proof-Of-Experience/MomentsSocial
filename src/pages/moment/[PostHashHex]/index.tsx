import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import MainLayout from "@/layouts/main-layout";
import { LoadingSpinner } from "@/components/core/loader";
import { debounce, getMomentShareUrl, mergeVideoData } from "@/utils";
import EmojiReaction from "@/components/snippets/emoji-reaction";
import { selectAuthUser } from "@/slices/authSlice";
import { useSelector } from "react-redux";
import { makeReaction } from "@/services/reaction/reaction";
import Comment from "@/components/snippets/comments";
import SocialShare from "@/components/snippets/social-share";
import { ApiDataType, apiService } from "@/utils/request";
import MakeComment from "@/components/snippets/comments/makeComment";

const MomentDetailsPage = () => {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const router = useRouter();

  const { PostHashHex, Tag }: any = router.query;
  const authUser = useSelector(selectAuthUser);

  const [hasLoaded, setHasLoaded] = useState<boolean>(true);
  const [videoData, setVideoData] = useState<any>([]);
  const wheelDivRef = useRef<HTMLDivElement>(null);
  let [currentPage, setCurrentPage] = useState<number>(1);

  const react = async () => {
    console.log("reacting");
    if (!videoData) {
      console.log("no videodata");
      return;
    }

    if (!authUser) {
      console.log("uautneticated");
      return;
    }

    let cv = videoData[activeVideoIndex];
    if (!cv) {
      console.log("no cv");
      return;
    }
    // const result = await makeReaction(
    //   "LIKE",
    //   cv.PostHashHex,
    //   authUser.PublicKeyBase58Check
    // );
    // console.log("result", result);

    const { createPostAssociation } = await import("deso-protocol");

    const params = {
      TransactorPublicKeyBase58Check: authUser.PublicKeyBase58Check,
      PostHashHex: cv.PostHashHex,
      // AppPublicKeyBase58Check:
      // "BC1YLgTKfwSeHuNWtuqQmwduJM2QZ7ZQ9C7HFuLpyXuunUN7zTEr5WL",
      AssociationType: "REACTION",
      AssociationValue: "LIKE",
      MinFeeRateNanosPerKB: 1000,
    };

    const result = await createPostAssociation(params);
    console.log("result", result);

    return;

    const { countPostAssociations } = await import("deso-protocol");
    const reactionParams = {
      AssociationType: "REACTION",
      AssociationValues: [
        "LIKE",
        "DISLIKE",
        "LOVE",
        "LAUGH",
        "ASTONISHED",
        "SAD",
        "ANGRY",
      ],
      PostHashHex: cv.PostHashHex,
    };

    const countResult = await countPostAssociations(reactionParams);
    console.log("count result", countResult);
  };

  useEffect(() => {
    if (!router.isReady) return;
    fetchSingleProfile();
    if (Tag) {
      fetchFeedData();
    } else {
      fetchStatelessPostData();
    }
  }, [router.isReady]);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      const videoIndex = videoData.findIndex(
        (video: any) => video.PostHashHex === PostHashHex
      );
      if (videoIndex !== -1) {
        setActiveVideoIndex(videoIndex);
      }
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, []);

  useEffect(() => {
    const wheelDiv = wheelDivRef.current;

    const handleWheel = debounce((event: globalThis.WheelEvent) => {
      if (videoData.length <= 1) {
        return;
      }

      event.preventDefault();

      const delta = event.deltaY > 0 ? 1 : -1;
      const newIndex =
        (activeVideoIndex + delta + videoData.length) % videoData.length;

      setActiveVideoIndex(newIndex);
      const videoId = videoData?.length > 0 && videoData[newIndex].PostHashHex;

      if (newIndex + 5 >= videoData.length) {
        setCurrentPage(currentPage++);
        fetchMoments(currentPage);
      }

      router.push(`/moment/${videoId}${Tag ? `?Tag=${Tag}` : ""}`, undefined, {
        shallow: true,
      });
    }, 100); // delay handler

    if (wheelDiv) {
      wheelDiv.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (wheelDiv) {
        wheelDiv.removeEventListener("wheel", handleWheel);
      }
    };
  }, [videoData, activeVideoIndex]);

  const fetchSingleProfile = async () => {
    const { getSinglePost } = await import("deso-protocol");
    const params = {
      PostHashHex,
    };

    const singlePost: any = await getSinglePost(params);
    setVideoData((prevVideoData: any) =>
      mergeVideoData(prevVideoData, [singlePost?.PostFound])
    );

    setHasLoaded(false);
  };

  const fetchMoments = async (page: number = 1) => {
    let apiUrl = `/api/posts?page=${page}&limit=5&moment=true`;

    if (Tag) {
      const tagWithHash = Tag.startsWith("#") ? Tag : `#${Tag}`;
      apiUrl += `&hashtag=${encodeURIComponent(tagWithHash)}`;
    }

    const apiData: ApiDataType = {
      method: "get",
      url: apiUrl,
      customUrl: process.env.NEXT_PUBLIC_MOMENTS_UTIL_URL,
    };

    try {
      await apiService(apiData, (res: any, err: any) => {
        if (err) return err.response;

        let data: any = [];

        res.posts.forEach((post: any) => {
          if (post.PostHashHex !== videoData?.PostHashHex) {
            post.VideoURLs = [post.VideoURL];
            data.push(post);
          }
        });
        data = mergeVideoData(data, videoData);
        setVideoData(data);
      });
    } catch (error: any) {
      console.error("error", error.response);
    } finally {
      setCurrentPage(currentPage++);
    }
  };

  const fetchStatelessPostData = async () => {
    const { getPostsStateless } = await import("deso-protocol");
    const formData = {
      NumToFetch: 100,
      OrderBy: "VideoURLs",
    };
    const postData = await getPostsStateless(formData);

    if (postData?.PostsFound && postData?.PostsFound.length > 0) {
      const filteredData: any = postData?.PostsFound.filter(
        (item: any) =>
          item.VideoURLs && item.VideoURLs.some((videoURL: any) => videoURL)
      );
      setVideoData((prevVideoData: any) =>
        mergeVideoData(prevVideoData, filteredData)
      );
    }
  };

  const videoComments = (comments: any) => {
    if (!comments) {
      return [];
    }

    return comments;
  };

  const fetchFeedData = async () => {
    const { getHotFeed } = await import("deso-protocol");

    const data = {
      Tag: `#${Tag}`,
    };
    const feedData = await getHotFeed(data);

    if (feedData?.HotFeedPage && feedData?.HotFeedPage.length > 0) {
      const filteredData: any = feedData?.HotFeedPage.filter(
        (item: any) =>
          item.VideoURLs && item.VideoURLs.some((videoURL: any) => videoURL)
      );
      setVideoData((prevVideoData: any) =>
        mergeVideoData(prevVideoData, filteredData)
      );
    }
  };

  return (
    <MainLayout>
      <div
        className="h-[calc(100vh_-_72px)] flex flex-col items-center justify-center bg-[#ddd]"
        ref={wheelDivRef}
      >
        {hasLoaded ? (
          <LoadingSpinner isLoading={hasLoaded} />
        ) : (
          videoData.length > 0 &&
          videoData.map((video: any, index: number) => (
            <div
              key={index}
              className={`${activeVideoIndex !== index ? "hidden" : ""}`}
              style={{ marginLeft: "30%", marginRight: "30%", width: "40%" }}
            >
              <div>
                <h1 className="text-4xl font-semibold mb-4">
                  {video?.ProfileEntryResponse?.Username}
                </h1>
                <iframe
                  width="100%"
                  height="500"
                  src={
                    video.VideoURLs[0] ??
                    "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                  }
                  allowFullScreen
                ></iframe>
                <div className="px-2 pb-3 mt-2">
                  <EmojiReaction
                    onReactionClick={() => {}}
                    postHashHex={video?.PostHashHex}
                  />
                </div>
                <p className="mt-4 max-h-[74px] overflow-y-auto">
                  {video.Body}
                </p>
              </div>

              <SocialShare
                url={getMomentShareUrl(video?.PostHashHex)}
                title={video?.Body}
              ></SocialShare>

              {authUser && (
                <MakeComment
                  postId={video.PostHashHex}
                  userId={authUser?.PublicKeyBase58Check}
                ></MakeComment>
              )}

              <div>
                {videoComments(video.Comments).map(
                  (comment: any, commentIndex: number) => (
                    <Comment comment={comment} key={commentIndex} />
                  )
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </MainLayout>
  );
};

export default MomentDetailsPage;
