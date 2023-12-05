import React, { memo } from 'react';
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
} from 'react-share';

const SocialShare = memo(({ url, title }: any) => {
	return (
		<div className="flex items-center justify-center gap-3 flex-wrap">
			<FacebookShareButton
				url={url}
				quote={title}
				// className=""
			>
				<FacebookIcon
					size={56}
					round
				></FacebookIcon>
			</FacebookShareButton>
			<LinkedinShareButton url={url}>
				<LinkedinIcon
					size={56}
					round
				></LinkedinIcon>
			</LinkedinShareButton>
			<EmailShareButton url={url}>
				<EmailIcon
					size={56}
					round
				></EmailIcon>
			</EmailShareButton>
			<RedditShareButton url={url}>
				<RedditIcon
					size={56}
					round
				></RedditIcon>
			</RedditShareButton>
			<TwitterShareButton url={url}>
				<TwitterIcon
					size={56}
					round
				></TwitterIcon>
			</TwitterShareButton>
			<TelegramShareButton url={url}>
				<TelegramIcon
					size={56}
					round
				></TelegramIcon>
			</TelegramShareButton>
			<WhatsappShareButton url={url}>
				<WhatsappIcon
					size={56}
					round
				></WhatsappIcon>
			</WhatsappShareButton>
		</div>
	);
});
export default SocialShare;
