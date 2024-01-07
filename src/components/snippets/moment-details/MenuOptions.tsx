import React from 'react';
import { Bars3CenterLeftIcon, SquaresPlusIcon } from '@heroicons/react/24/outline';
// import { Menu, Transition } from '@headlessui/react';

interface IMenuOptionsProps {
	onClickDescription?: () => void;
	onClickSavePlaylist?: () => void;
}

const MenuOptions = (props: IMenuOptionsProps) => {
	const { onClickSavePlaylist, onClickDescription } = props;

	return (
		<div className="absolute bottom-[100%] right-0 z-20 mt-[10px] w-56 origin-top-right divide-y bg-white divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none py-3">
			<div className="">
				<button
					onClick={() => {
						if (onClickDescription) onClickDescription();
					}}
					className={`hover:bg-gray-200 group flex w-full items-center px-3 py-2 text-sm`}
				>
					<Bars3CenterLeftIcon className="mr-3 w-6 h-6" />
					<span className="">Description</span>
				</button>
			</div>
			<div>
				<button
					onClick={() => {
						if (onClickSavePlaylist) {
							onClickSavePlaylist();
						}
					}}
					className={`hover:bg-gray-200 group flex w-full items-center px-3 py-2 text-sm`}
				>
					<SquaresPlusIcon className="mr-3 w-6 h-6" />
					<span className="">Add to Playlist</span>
				</button>
			</div>
		</div>
	);
};

export default MenuOptions;
