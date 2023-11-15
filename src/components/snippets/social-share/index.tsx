import React, { memo } from "react";
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  RedditIcon,
  RedditShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";

const SocialShare = memo(({ url, title }: any) => {

  return (
    <div className="flex items-center text-lg font-semibold text-gray-700">
      <FacebookShareButton url={url} quote={title} >
        <FacebookIcon size={24} round></FacebookIcon>
      </FacebookShareButton>
      <LinkedinShareButton url={url} >
        <LinkedinIcon size={24} round></LinkedinIcon>
      </LinkedinShareButton>
      <EmailShareButton url={url}>
        <EmailIcon size={24} round></EmailIcon>
      </EmailShareButton>
      <RedditShareButton url={url}>
        <RedditIcon size={24} round></RedditIcon>
      </RedditShareButton>
      <TwitterShareButton url={url}>
        <TwitterIcon size={24} round></TwitterIcon>
      </TwitterShareButton>
      <TelegramShareButton url={url}>
        <TelegramIcon size={24} round></TelegramIcon>
      </TelegramShareButton>
      <WhatsappShareButton url={url}>
        <WhatsappIcon size={24} round></WhatsappIcon>
      </WhatsappShareButton>
    </div>
  );
})
export default SocialShare;
