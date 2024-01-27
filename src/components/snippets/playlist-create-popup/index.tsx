import React, { useState } from 'react';
import { Modal } from '@/components/core/modal';
import { useGlobalState } from '@/utils/hooks';
import { cn } from '@/utils';
import { ApiDataType, apiService } from '@/utils/request';
import { toast } from 'react-toastify';
import { PrimaryButton } from '@/components/core/button';

interface IPlaylistCreatePopupProps {
	open: boolean;
	onClose: () => void;
	// videoData: any;
	userId: string;
	// type: 'VIDEO' | 'MOMENT';
}
const PlaylistCreatePopup = (props: IPlaylistCreatePopupProps) => {
	const {
		open,
		onClose,
		userId,
		// videoData,
		// type
	} = props;
	const {
		// setPlaylists, playlists,
		// loadingPlaylist,
		setShouldLoadPlaylist,
	} = useGlobalState();
	const [playlistName, setPlaylistName] = useState<string>('');
	const [loadingCreate, setLoadingCreate] = useState<boolean>(false);
	const [errorMsg, setErrorMsg] = useState<string>('');
	// console.log('playlists------', playlists);

	const handleCreatePlaylist = async (event: any) => {
		event?.preventDefault();
		if (!userId) return toast.error('Please login to create playlist');

		if (!playlistName) return setErrorMsg('Enter Playlist Name');

		setLoadingCreate(true);

		const apiData: ApiDataType = {
			method: 'post',
			url: `/api/playlists/`,
			data: {
				name: playlistName,
				userId,
				postIds: [],
				// postIds: [videoData?.PostHashHex],
			},
			customUrl: process.env.NEXT_PUBLIC_MOMENTS_UTIL_URL,
		};

		await apiService(apiData, (res: any, err: any) => {
			if (res) {
				// console.log('handleCreatePlaylist res: ', res);
				// setShowPlaylistCreateForm(false);
				setPlaylistName('');
				setErrorMsg('');
				setShouldLoadPlaylist(true);
			}
			if (err) {
				toast.error(err?.response?.message || 'Something went wrong, failed to create.');
				console.error('handleCreatePlaylist error: ', err);
			}
		});
		setLoadingCreate(false);
	};

	const onClosePopup = () => {
		onClose();
		setPlaylistName('');
		setErrorMsg('');
	};

	// console.log('playlists----', playlists);

	return (
		<Modal
			title={'Create new playlist'}
			open={open}
			onClose={onClosePopup}
			titleClassName="text-center"
			bodyClassName="px-0"
			width="sm"
		>
			<div className="px-5 mt-5">
				<form onSubmit={handleCreatePlaylist}>
					<div className="flex flex-col items-end justify-start gap-y-4">
						<input
							type="text"
							value={playlistName}
							onChange={(e) => setPlaylistName(e?.target?.value)}
							placeholder={'Enter Playlist Name'}
							className={cn(
								`w-full border py-1.5 px-4 text-md rounded-full focus:outline-none`,
								errorMsg ? 'border-red-600' : 'border-[#5798fb]'
							)}
							autoFocus
						/>
						<PrimaryButton
							type="submit"
							className="bg-[#00A1D4] text-white rounded-full w-[118px] py-2 text-base font-semibold flex items-center"
							text={'Save'}
							loader={loadingCreate}
							disabled={loadingCreate}
						/>
					</div>
					{errorMsg && (
						<p className="text-[11px] text-left ml-4 mt-1 text-red-600">{errorMsg}</p>
					)}
				</form>
			</div>
		</Modal>
	);
};

export default PlaylistCreatePopup;
