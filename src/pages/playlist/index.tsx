import PlaylistCreatePopup from '@/components/snippets/playlist-create-popup';
import RelatedVideoList from '@/components/snippets/video-details/relatedVideoList';
import { VideoLayoutProvider } from '@/contexts/VideosContext';
import MainLayout from '@/layouts/main-layout';
import { selectAuthUser } from '@/slices/authSlice';
import { cn, toCapitalize } from '@/utils';
import { useGlobalState } from '@/utils/hooks';
import { Bars3CenterLeftIcon, PlusIcon, SquaresPlusIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const Playlist = () => {
	const {
		// setPlaylists,
		playlists,
		// loadingPlaylist,
		setShouldLoadPlaylist,
	} = useGlobalState();
	// const playlists: any[] = []; // TODO:: Remove this line

	const authUser = useSelector(selectAuthUser);

	const [showPlaylistCreatePopup, setShowPlaylistCreatePopup] = useState<boolean>(false);

	useEffect(() => {
		setShouldLoadPlaylist(true);
		setActivePlaylist(playlists?.length > 0 ? playlists[0] : null);
	}, [playlists?.length]);

	const [activePlaylist, setActivePlaylist] = useState<any>();

	const handleChangePlaylist = (item: any) => {
		setActivePlaylist(item);
	};
	console.log('page palylists----', playlists);
	// console.log('activePlaylist----', activePlaylist);

	return (
		<MainLayout
			title="Playlist"
			mainWrapClass="p-7"
		>
			<VideoLayoutProvider>
				<div className="min-h-[calc(100vh_-_72px)] grid grid-cols-3 gap-7">
					{playlists?.length > 0 ? (
						<>
							<div className="col-span-1">
								<div
									className={cn(
										'h-[calc(100vh_-_128px)] py-7',
										'rounded-2xl bg-[#00A1D4]/5'
									)}
								>
									<h2 className="text-[#1C1B1F] leading-trim capitalize font-inter text-lg font-semibold mb-5 px-7 flex items-center justify-between">
										<span className="pb-3">Playlists</span>
										<span
											className="flex items-center justify-center p-3 -mr-3 -mt-3 rounded-lg hover:bg-[#00A1D4]/10 cursor-pointer"
											onClick={() => setShowPlaylistCreatePopup(true)}
										>
											<SquaresPlusIcon className="group-hover:text-white transition-all h-6 w-6" />
										</span>
									</h2>
									<div className="px-5 h-[calc(100vh_-_230px)] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 flex flex-col gap-2.5">
										{playlists.map((item: any, index: any) => (
											<div
												key={`playlist-${index}`}
												onClick={() => handleChangePlaylist(item)}
												className={cn(
													'w-full hover:text-[#00A1D4] transition-all flex items-center justify-start py-3 px-3',
													item?._id === activePlaylist?._id
														? 'text-[#00A1D4] font-medium bg-[#00A1D4]/10 rounded-lg'
														: 'text-slate-800 cursor-pointer'
												)}
											>
												<Bars3CenterLeftIcon className="h-5 w-5" />
												<span className="flex-1 line-clamp-1 ml-3">
													{toCapitalize(item?.name)}
												</span>
											</div>
										))}
									</div>
								</div>
							</div>
							<div className="col-span-2">
								{activePlaylist && (
									<div className="">
										<h2 className="text-[#1C1B1F] leading-trim capitalize font-inter text-lg font-semibold pb-5 mb-5 border-b border-b-[#D7D7D7]">
											{activePlaylist?.name}
										</h2>
										{activePlaylist?.postIds?.length > 0 ? (
											<div className="flex flex-col gap-y-5">
												<RelatedVideoList
													videos={activePlaylist?.postIds}
													playlistId={activePlaylist?._id}
												/>
											</div>
										) : (
											<div className="flex flex-col items-center justify-center h-60 my-10">
												<SquaresPlusIcon className="group-hover:text-white transition-all h-6 w-6" />
												<p className="text-base">No Video found</p>
											</div>
										)}
									</div>
								)}
							</div>
						</>
					) : (
						<div className="col-span-3">
							<div className="flex flex-col items-center justify-center h-80">
								<SquaresPlusIcon className="group-hover:text-white transition-all h-10 w-10" />
								<p className="text-lg mt-5">No playlist found</p>
								<button
									className="flex items-center justify-center bg-[#00A1D4] text-white rounded-full w-[250px] py-2 text-base font-semibold mt-5"
									onClick={() => setShowPlaylistCreatePopup(true)}
								>
									<PlusIcon className="h-6 w-6 mr-2 text-white" />
									<span className="">Create New Playlist</span>
								</button>
							</div>
						</div>
					)}
				</div>
				{showPlaylistCreatePopup && (
					<PlaylistCreatePopup
						open={showPlaylistCreatePopup}
						onClose={() => setShowPlaylistCreatePopup(false)}
						userId={authUser?.api_user?._id}
					/>
				)}
			</VideoLayoutProvider>
		</MainLayout>
	);
};

export default Playlist;
