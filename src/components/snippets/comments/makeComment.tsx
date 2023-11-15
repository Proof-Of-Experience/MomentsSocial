import React, { memo, useState } from "react";

const MakeComment = memo(({ postId, userId }: any) => {
  const [commentFormData, setFormData] = useState<string>("");

  const makeComment = async (e: React.FormEvent) => {
    e.preventDefault();

    const { submitPost } = await import("deso-protocol");

    const params = {
      UpdaterPublicKeyBase58Check: userId,
      ParentStakeID: postId,
      BodyObj: {
        Body: commentFormData,
        ImageURLs: null,
        VideoURLs: null,
      },
    };

    const res = await submitPost(params);
    console.log(res);

    setFormData("");
  };


  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    setFormData(e.target.value);
  };

  return (
    <form className="flex flex-col mt-2" onSubmit={makeComment} method="POST">
      <textarea
        className="rounded-md p-2"
        value={commentFormData}
        onChange={handleInputChange}
      ></textarea>
      <button className="justify-end bg-gray-200 rounded-md mt-4" type="submit">
        comment
      </button>
    </form>
  );
});

export default MakeComment;
