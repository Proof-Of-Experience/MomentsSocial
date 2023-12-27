import React from 'react';
import { Modal } from '@/components/core/modal';
import { Checkbox } from '@/components/core/checkbox';
import { useGlobalState } from '@/utils/hooks';

interface IPlaylistPopupProps {
	open: boolean;
	onClose: () => void;
	videoData: any;
	type: 'VIDEO' | 'MOMENT';
}
const PlaylistPopup = (props: IPlaylistPopupProps) => {
	const {
		open,
		onClose,

		// videoData,
		// type
	} = props;
	const { playlistsAll } = useGlobalState();

	const handleClickSaveToPlaylist = () => {
		console.log('handleClickSaveToPlaylist');
	};

	return (
		<Modal
			title={'Save on playlist'}
			open={open}
			onClose={onClose}
			titleClassName="text-center"
		>
			<div className="mt-12">
				{playlistsAll.length > 0 ? (
					<div className="">No playlist found</div>
				) : (
					<div className="">
						{playlistsAll.map((item: any, index: any) => (
							<Checkbox
								key={`playlist-${index}`}
								label="Test Playlist One"
								className="mb-8"
							/>
						))}
					</div>
				)}
				<div className="">
					<button
						className="bg-[#00A1D4] text-white rounded-full w-full py-2 text-base font-semibold"
						onClick={handleClickSaveToPlaylist}
					>
						Save
					</button>
				</div>
			</div>
		</Modal>
	);
};

export default PlaylistPopup;
