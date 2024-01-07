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
	const { setPlaylists, playlists, loadingPlaylist, setShouldLoadPlaylist } = useGlobalState();
	const [showPlaylistCreateForm, setShowPlaylistCreateForm] = useState<boolean>(false);
	const [playlistName, setPlaylistName] = useState<string>('');
	const [loadingCreate, setLoadingCreate] = useState<boolean>(false);
	const [errorMsg, setErrorMsg] = useState<string>('');
	// console.log('playlists------', playlists);

	const handleClickUpdateToPlaylist = async (isChecked: boolean, playlistItem: any) => {
		// console.log('handleClickUpdateToPlaylist----', isChecked, playlistItem);
		const newPlaylists = playlists.map((item: any) => {
			if (item?._id === playlistItem?._id) {
				return {
					...item,
					checked: isChecked,
				};
			}
			return item;
		});
		setPlaylists(newPlaylists);

		const apiData: ApiDataType = {
			method: 'post',
			url: `/api/playlists/${isChecked ? 'add-multiple' : 'remove-multiple'}`,
			data: {
				playlistIds: [playlistItem?._id],
				postIds: [videoData?.PostHashHex],
			},
			customUrl: process.env.NEXT_PUBLIC_MOMENTS_UTIL_URL,
		};

		await apiService(apiData, (res: any, err: any) => {
			if (res) {
				// console.log('handleClickUpdateToPlaylist res: ', res?.data);
				return res?.data;
			}
			if (err) {
				console.error('handleClickUpdateToPlaylist error: ', err?.response?.message);
				toast.error(err?.response?.message || 'Something went wrong, failed to update.');
				setShouldLoadPlaylist(true);
			}
		});
	};

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
				postIds: [videoData?.PostHashHex],
			},
			customUrl: process.env.NEXT_PUBLIC_MOMENTS_UTIL_URL,
		};

		await apiService(apiData, (res: any, err: any) => {
			if (res) {
				// console.log('handleCreatePlaylist res: ', res);
				setShowPlaylistCreateForm(false);
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
		setShowPlaylistCreateForm(false);
	};

	// console.log('playlists----', playlists);

	return (
		<Modal
			title={'Save on playlist'}
			open={open}
			onClose={onClosePopup}
			titleClassName="text-center"
			bodyClassName="px-0"
			width="sm"
		>
			<div className="">
				<div className="relative max-h-[320px] px-6 my-6 overflow-y-scroll flex flex-col items-center justify-start">
					{loadingPlaylist && (
						<div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-lg font-semibold bg-white/10 z-10">
							Loading...
						</div>
					)}
					{playlists?.length > 0 ? (
						<>
							{playlists.map((item: any, index: any) => (
								<div
									className="mb-3.5 last:mb-0 w-full"
									key={`playlist-${index}`}
								>
									<Checkbox
										id={item?._id}
										label={item?.name}
										className="w-full"
										inputClassName=""
										labelClassName="flex-1 line-clamp-1"
										checked={item?.checked}
										onChange={(e: any) => {
											handleClickUpdateToPlaylist(e?.target?.checked, item);
										}}
									/>
								</div>
							))}
						</>
					) : (
						<div className="flex flex-col items-center justify-center">
							<SquaresPlusIcon className="group-hover:text-white transition-all h-6 w-6" />
							<p className="text-base">No playlist found</p>
						</div>
					)}
				</div>
				<div className="px-6">
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
									autoFocus
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
