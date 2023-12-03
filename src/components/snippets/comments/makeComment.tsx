import React, { memo, useState } from 'react';
import { selectAuthUser } from '@/slices/authSlice';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const MakeComment = memo(({ postId, userId }: any) => {
	const authUser = useSelector(selectAuthUser);
	const [commentFormData, setFormData] = useState<string>('');

	const profilePhoto = authUser?.Profile?.PublicKeyBase58Check
		? `https://diamondapp.com/api/v0/get-single-profile-picture/${authUser?.Profile?.PublicKeyBase58Check}`
		: 'https://diamondapp.com/assets/img/default-profile-pic.png';

	// console.log('authUser---', authUser);

	const makeComment = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!authUser) {
			toast.dismiss();
			return toast.error('Please login to comment');
		}

		const { submitPost } = await import('deso-protocol');

		const params = {
			UpdaterPublicKeyBase58Check: userId,
			ParentStakeID: postId,
			BodyObj: {
				Body: commentFormData,
				ImageURLs: null,
				VideoURLs: null,
			},
		};

		const res = await submitPost(params);
		console.log(res);

		setFormData('');
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
	): void => {
		setFormData(e.target.value);
	};

	return (
		<form
			className="flex flex-col items-end justify-center gap-y-3"
			onSubmit={makeComment}
			method="POST"
		>
			{/* <textarea
				className="rounded-md p-2"
				value={commentFormData}
				onChange={handleInputChange}
			></textarea> */}
			<div className="w-full flex items-center justify-center gap-x-3">
				<img
					src={profilePhoto}
					alt="profile"
					className="rounded-full w-12 h-12 bg-slate-100 border border-slate-200"
				/>
				<input
					type="text"
					className="rounded-lg p-2 h-12 py-3.5 px-3 flex-grow bg-[#EDEEEF] outline-none border border-[#EDEEEF] focus:border-[#00A1D4] text-base font-normal placeholder:text-[#BDBDBD]"
					value={commentFormData}
					placeholder="Write comment..."
					onChange={handleInputChange}
				></input>
			</div>
			<button
				// className="justify-end bg-gray-200 rounded-md mt-4"
				className="h-11 py-3 px-6 rounded-2xl bg-[#ABABAB] text-white text-sm font-normal text-center hover:bg-[#00A1D4]"
				type="submit"
			>
				Comment
			</button>
		</form>
	);
});

export default MakeComment;
