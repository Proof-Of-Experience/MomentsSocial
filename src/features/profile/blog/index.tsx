import { LoadingSpinner } from '@/components/core/loader';
import { Placeholder } from '@/components/core/placeholder';
import React, { useEffect, useState } from 'react';

interface OpsData {
	insert: string;
	attributes?: {
		link?: string;
		bold?: boolean;
		italic?: boolean;
	};
}

interface JSONData {
	ops: OpsData[];
}

const parseAndRenderJSON = (jsonData: string) => {
	try {
		const data: JSONData = JSON.parse(jsonData);
		if (data.ops && Array.isArray(data.ops)) {
			return data.ops.map((op, index) => {
				if (op.insert.includes('\n')) {
					const lines = op.insert.split('\n');
					return (
						<React.Fragment key={index}>
							{lines.map((line, lineIndex) => (
								<React.Fragment key={lineIndex}>
									{line}
									<br />
								</React.Fragment>
							))}
						</React.Fragment>
					);
				} else if (op.attributes) {
					const { link, bold, italic } = op.attributes;
					if (link) {
						return (
							<a
								key={index}
								href={link}
								className="text-blue-500"
							>
								{op.insert}
							</a>
						);
					} else if (bold) {
						return <strong key={index}>{op.insert}</strong>;
					} else if (italic) {
						return <em key={index}>{op.insert}</em>;
					}
				}
				return <span key={index}>{op.insert}</span>;
			});
		}
	} catch (error) {
		console.error('Error parsing JSON:', error);
	}
	return null;
};

const ProfileBlog = ({ username, publicKey, userDetails }: any) => {
	const [isLoaded, setisLoaded] = useState<boolean>(true);
	const [blogs, setBlogs] = useState<any>([]);

	const fetchPublicPost = async () => {
		const { getPostsForUser } = await import('deso-protocol');
		const data = {
			MediaRequired: false,
			NumToFetch: 1000,
			ReaderPublicKeyBase58Check: publicKey,
			Username: username,
		};
		const publicData = await getPostsForUser(data);
		setisLoaded(false);

		if (publicData?.Posts) {
			const modifiedPosts: any = publicData?.Posts.filter(
				(item: any) => item.PostExtraData?.Title
			);
			setBlogs(modifiedPosts);
		}
	};

	useEffect(() => {
		if (username && publicKey) {
			fetchPublicPost();
		}
	}, [username, publicKey]);

	const _renderHolders = () => {
		return (
			<div className="">
				{blogs.map((blog: any) => {
					const jsonData = blog.PostExtraData?.BlogDeltaRtfFormat;
					const renderedContent = parseAndRenderJSON(jsonData);
					return (
						<div
							key={blog.PostHashHex}
							className="mb-12 border border-b rounded-lg p-5"
						>
							<div className="mb-5 flex items-center">
								<a
									// href={`/user/${value?.PostEntryResponse?.ProfileEntryResponse?.Username}`}
									className="flex items-center font-semibold"
								>
									<img
										alt="..."
										src={userDetails?.Avatar}
										className=" shadow-xl rounded-full h-[40px] w-[40px] border-none"
									/>
									<span className="ml-2 text-blue-500">{username}</span>
								</a>
							</div>

							<img
								src={blog.PostExtraData?.CoverImage}
								alt=""
								className="max-w-[600px]"
							/>
							<h3 className="text-2xl font-semibold mt-4">
								{blog.PostExtraData?.Title}
							</h3>
							<p>{blog.PostExtraData?.Description}</p>
							<div>{renderedContent}</div>
						</div>
					);
				})}
			</div>
		);
	};

	return (
		<div>
			{isLoaded ? (
				<LoadingSpinner isLoading={isLoaded} />
			) : blogs.length > 0 ? (
				_renderHolders()
			) : (
				<Placeholder text={`No blog found from ${username}`} />
			)}
		</div>
	);
};

export default ProfileBlog;
