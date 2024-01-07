import { selectAuthUser } from '@/slices/authSlice';
import { ApiDataType, apiService } from '@/utils/request';
import { useRouter } from 'next/router';
import {
	// Dispatch,
	// SetStateAction,
	createContext,
	useState,
	ReactNode,
	useEffect,
} from 'react';
import { useSelector } from 'react-redux';

export interface IGlobalStateContextProps {
	setPlaylists: (data: any[]) => void;
	playlists: any[];
	playlistsAll: any[];
	loadingPlaylist: boolean;
	shouldLoadPlaylist: boolean;
	setShouldLoadPlaylist: (data: boolean) => void;
}

export const GlobalStateContext = createContext<IGlobalStateContextProps | undefined>(undefined);

interface IGlobalProviderProps {
	children: ReactNode;
}

export const GlobalStateProvider = ({ children }: IGlobalProviderProps) => {
	const authUser = useSelector(selectAuthUser);
	const userId = authUser?.api_user?._id;
	const router = useRouter();
	const isVideoRoute = router?.route === '/video/[PostHashHex]' || '/moment/[PostHashHex]';
	const videoHash = isVideoRoute ? router?.query?.PostHashHex : null;

	const [playlistsAll, setPlaylistsAll] = useState<any[]>([]);
	const [playlists, setPlaylists] = useState<any[]>([]);
	const [loadingPlaylist, setLoadingPlaylist] = useState<boolean>(false);
	const [shouldLoadPlaylist, setShouldLoadPlaylist] = useState<boolean>(false);

	useEffect(() => {
		if (userId && videoHash) getPlaylists();
	}, [userId, videoHash]);

	useEffect(() => {
		if (shouldLoadPlaylist) getPlaylists();
	}, [shouldLoadPlaylist]);

	// console.log('shouldLoadPlaylist----', shouldLoadPlaylist);
	// console.log('playlistAll', playlistsAll);
	// console.log('playlist', playlists);

	const getPlaylists = async () => {
		const apiData: ApiDataType = {
			method: 'get',
			url: `/api/playlists/users/${userId}`,
			customUrl: process.env.NEXT_PUBLIC_MOMENTS_UTIL_URL,
		};

		try {
			await apiService(apiData, (res: any, err: any) => {
				if (err) return err.response;

				if (res.length > 0) {
					// console.log('getPlaylists res', res);
					setPlaylistsAll(res);
					const mappedPlaylists = res.map((playlist: any) => {
						const playlistPostIds = playlist?.postIds;
						const hasPost = playlistPostIds?.some(
							(post: any) => post?.PostHashHex === videoHash
						);
						return {
							...playlist,
							checked: hasPost,
						};
					});
					// console.log('mappedPlaylists', mappedPlaylists);
					setPlaylists(videoHash ? mappedPlaylists : res);
					if (shouldLoadPlaylist) setShouldLoadPlaylist(false);
				}
			});
		} catch (error: any) {
			console.error('error', error.response);
		} finally {
			setLoadingPlaylist(false);
		}
	};

	return (
		<GlobalStateContext.Provider
			value={{
				setPlaylists,
				playlists,
				playlistsAll,
				loadingPlaylist,
				shouldLoadPlaylist,
				setShouldLoadPlaylist,
			}}
		>
			{children}
		</GlobalStateContext.Provider>
	);
};
