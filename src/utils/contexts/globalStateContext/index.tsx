import { selectAuthUser } from '@/slices/authSlice';
import { ApiDataType, apiService } from '@/utils/request';
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
	playlists: any[];
	playlistsAll: any[];
	loadingPlaylist: boolean;
	getPlaylists: () => void;
}

export const GlobalStateContext = createContext<IGlobalStateContextProps | undefined>(undefined);

interface IGlobalProviderProps {
	children: ReactNode;
}

export const GlobalStateProvider = ({ children }: IGlobalProviderProps) => {
	const authUser = useSelector(selectAuthUser);
	const userId = authUser?.PublicKeyBase58Check;
	const [playlistsAll, setPlaylistsAll] = useState<any[]>([]);
	const [playlists, setPlaylists] = useState<any[]>([]);
	const [loadingPlaylist, setLoadingPlaylist] = useState<boolean>(false);

	useEffect(() => {
		getPlaylists();
	}, []);

	console.log('playlistAll', playlistsAll);
	console.log('playlist', playlists);

	const getPlaylists = async () => async () => {
		const apiData: ApiDataType = {
			method: 'get',
			url: `/playlists/users/${userId}`,
			customUrl: process.env.NEXT_PUBLIC_MOMENTS_UTIL_URL,
		};

		try {
			await apiService(apiData, (res: any, err: any) => {
				if (err) return err.response;

				if (res.length > 0) {
					setPlaylistsAll(res);
					setPlaylists(res);
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
				playlists,
				playlistsAll,
				getPlaylists,
				loadingPlaylist,
			}}
		>
			{children}
		</GlobalStateContext.Provider>
	);
};
