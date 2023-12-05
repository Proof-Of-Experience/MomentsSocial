import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import SocialShare from '../social-share';
import { Modal } from '@/components/core/modal';
import { getVideoShareUrl } from '@/utils';
import { toast } from 'react-toastify';

const SocialSharePopup = (props: any) => {
	const { open, onClose, videoData, videoUrl } = props;

	return (
		<Modal
			title={'Share on Social Media'}
			open={open}
			onClose={onClose}
			titleClassName="text-center"
		>
			<div className="mt-12">
				<SocialShare
					url={getVideoShareUrl(videoData?.PostHashHex)}
					title={videoData?.Body}
				></SocialShare>
			</div>
			<div className="mt-7">
				<p className="mb-3 text-base font-medium">Copy Video Link</p>
				<div className="bg-gray-100 px-4 rounded-lg flex items-center justify-between space-x-4">
					<p className="flex-1 py-2 overflow-x-scroll scrollbar-thin scrollbar-thumb-slate-300">
						{videoUrl}
					</p>
					<CopyToClipboard
						onCopy={() => toast.success('Copied to clipboard')}
						text={videoUrl}
					>
						<ClipboardDocumentIcon className="h-6 w-6 cursor-pointer hover:text-[#00A1D4] transition-all" />
					</CopyToClipboard>
				</div>
			</div>
		</Modal>
	);
};

export default SocialSharePopup;
