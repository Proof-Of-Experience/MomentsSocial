import React, { useState } from 'react';
import { Modal } from '@/components/core/modal';
import { Checkbox } from '@/components/core/checkbox';
import { useGlobalState } from '@/utils/hooks';
import { PlusIcon, SquaresPlusIcon } from '@heroicons/react/24/outline';
import { cn } from '@/utils';
import { ApiDataType, apiService } from '@/utils/request';
import { toast } from 'react-toastify';
import { PrimaryButton } from '@/components/core/button';

interface IPlaylistPopupProps {
	open: boolean;
	onClose: () => void;
	videoData: any;
	userId: string;
	type: 'VIDEO' | 'MOMENT';
}
const PlaylistPopup = (props: IPlaylistPopupProps) => {
	const {
		open,
		onClose,
		userId,
		videoData,
		// type
	} = props;
	const { playlistsAll } = useGlobalState();
	const [showPlaylistCreateForm, setShowPlaylistCreateForm] = useState<boolean>(false);
	const [playlistName, setPlaylistName] = useState<string>('');
	const [loadingCreate, setLoadingCreate] = useState<boolean>(false);
	const [errorMsg, setErrorMsg] = useState<string>('');

	const handleClickSaveToPlaylist = () => {
		console.log('handleClickSaveToPlaylist');
	};

	const handleCreatePlaylist = async (event: any) => {
		console.log('handleCreatePlaylist');
		event?.preventDefault();
		if (!userId) return toast.error('Please login to create playlist');

		if (!playlistName) return setErrorMsg('Enter Playlist Name');

		console.log('handleCreatePlaylist forData: ', {
			name: playlistName,
			userId,
			postIds: [videoData?.PostHashHex],
		});

		setLoadingCreate(true);

		const apiData: ApiDataType = {
			method: 'post',
			url: `/playlists/`,
			data: {
				name: playlistName,
				userId,
				postIds: [videoData?.PostHashHex],
			},
			customUrl: process.env.NEXT_PUBLIC_MOMENTS_UTIL_URL,
		};

		await apiService(apiData, (res: any, err: any) => {
			if (err) {
				toast.error(err?.response?.message);
			}
			if (res) {
				console.log('res playlist create', res);
				setShowPlaylistCreateForm(false);
				setPlaylistName('');
				setErrorMsg('');
			}
		});
		setLoadingCreate(false);
	};

	const onClosePopup = () => {
		onClose();
		setPlaylistName('');
		setErrorMsg('');
		setShowPlaylistCreateForm(false);
	};

	return (
		<Modal
			title={'Save on playlist'}
			open={open}
			onClose={onClosePopup}
			titleClassName="text-center"
		>
			<div className="mt-5">
				<div className="min-h-[200px] flex flex-col items-center justify-center">
					{playlistsAll.length > 0 ? (
						<div className="">
							{playlistsAll.map((item: any, index: any) => (
								<Checkbox
									key={`playlist-${index}`}
									label="Test Playlist One"
									className="mb-8"
								/>
							))}
						</div>
					) : (
						<div className="flex flex-col items-center justify-center">
							<SquaresPlusIcon className="group-hover:text-white transition-all h-6 w-6" />
							<p className="text-base">No playlist found</p>
						</div>
					)}
				</div>
				<div className="">
					{showPlaylistCreateForm ? (
						<form onSubmit={handleCreatePlaylist}>
							<div className="flex items-center justify-between gap-x-3">
								<input
									type="text"
									value={playlistName}
									onChange={(e) => setPlaylistName(e?.target?.value)}
									placeholder={'Enter Playlist Name'}
									className={cn(
										`w-full border py-1.5 px-4 text-md rounded-full focus:outline-none`,
										errorMsg ? 'border-red-600' : 'border-[#5798fb]'
									)}
								/>
								<PrimaryButton
									// type="submit"
									className="bg-[#00A1D4] text-white rounded-full w-40 py-2 text-base font-semibold flex items-center"
									text={'Save'}
									loader={loadingCreate}
									disabled={loadingCreate}
								/>
							</div>
							{errorMsg && (
								<p className="text-[11px] text-left ml-4 mt-1 text-red-600">
									{errorMsg}
								</p>
							)}
						</form>
					) : (
						<button
							className="flex items-center justify-center bg-[#00A1D4] text-white rounded-full w-full py-2 text-base font-semibold"
							// onClick={handleClickSaveToPlaylist}
							onClick={() => setShowPlaylistCreateForm(true)}
						>
							<PlusIcon className="h-6 w-6" />
							<span className="">Create New Playlist</span>
						</button>
					)}
				</div>
			</div>
		</Modal>
	);
};

export default PlaylistPopup;
