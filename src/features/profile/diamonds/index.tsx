import { LoadingSpinner } from '@/components/core/loader';
import { Placeholder } from '@/components/core/placeholder';
import { selectAuthUser } from '@/slices/authSlice';
import { CheckBadgeIcon } from '@heroicons/react/20/solid';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const Diamonds = ({ username }: any) => {
	const authUser = useSelector(selectAuthUser);
	const [isLoaded, setisLoaded] = useState<boolean>(true);
	const [diamonds, setDiamonds] = useState<any>([]);
	const [diamondInfo, setDiamondInfo] = useState<any>({});

	const fetchDiamonds = async () => {
		const { getDiamondsForUser } = await import('deso-protocol');

		const diamondParams = {
			PublicKeyBase58Check: authUser?.Profile?.PublicKeyBase58Check,
			FetchYouDiamonded: false,
		};

		const response = await getDiamondsForUser(diamondParams);
		setDiamonds(response?.DiamondSenderSummaryResponses);
		setDiamondInfo(response);
		setisLoaded(false);
	};

	useEffect(() => {
		if (username) {
			fetchDiamonds();
		}
	}, [username, authUser?.Profile]);

	interface Props {
		number: number;
	}

	const DiamondList: React.FC<Props> = ({ number }) => {
		const svgElements = [];

		for (let i = 0; i < number; i++) {
			svgElements.push(
				<svg
					key={i}
					xmlns="http://www.w3.org/2000/svg"
					version="1.0"
					width="25"
					height="25"
					viewBox="0 0 225.000000 225.000000"
					preserveAspectRatio="xMidYMid meet"
				>
					<g
						transform="translate(0.000000,225.000000) scale(0.100000,-0.100000)"
						fill="#000000"
						stroke="none"
					>
						<path d="M354 1778 l-212 -213 483 -650 c266 -357 487 -649 491 -647 5 2 230 294 501 650 l491 647 -211 213 -212 212 -560 0 -560 0 -211 -212z m526 -13 c-74 -74 -137 -131 -141 -127 -4 4 -23 59 -44 122 -21 63 -40 121 -43 128 -3 9 37 12 179 12 l184 0 -135 -135z m675 4 c-25 -73 -46 -133 -48 -135 -2 -2 -63 57 -137 131 l-135 135 182 0 182 0 -44 -131z m-165 -156 c0 -2 -120 -3 -267 -3 l-268 0 135 135 135 135 132 -132 c73 -73 133 -134 133 -135z m-780 118 l38 -121 -166 0 -167 0 125 125 c68 68 126 123 128 121 2 -3 21 -59 42 -125z m1159 -119 c-89 -1 -164 -1 -166 1 -2 3 15 59 38 127 l42 122 124 -124 123 -123 -161 -3z m-968 -464 c138 -421 178 -548 174 -548 -4 0 -670 900 -673 910 -2 6 69 10 187 10 l190 0 122 -372z m667 364 c-1 -5 -81 -239 -177 -520 -95 -282 -175 -511 -176 -510 -5 6 -335 1018 -335 1028 0 6 125 10 346 10 190 0 344 -4 342 -8z" />
					</g>
				</svg>
			);
		}

		return <div className="flex justify-center">{svgElements}</div>;
	};

	const _renderHolders = () => {
		return (
			<>
				<div className="flex justify-between items-center mb-4 pb-2 border-b">
					<h3 className="font-semibold text-xl">Total</h3>
					<h3 className="font-semibold text-xl">{diamondInfo?.TotalDiamonds}</h3>
				</div>

				<table className="table-auto w-full">
					<thead>
						<tr>
							<th className="border-b border-black py-2 text-left">Username</th>
							<th className="border-b border-black py-2 text-center">
								Most Diamonds
							</th>
							<th className="border-b border-black py-2 text-right">
								Total Diamonds
							</th>
						</tr>
					</thead>
					<tbody>
						{diamonds.map((diamond: any, index: number) => (
							<tr key={index}>
								<td className="border-b py-3">
									<div className="flex items-center">
										<img
											src={`${process.env.NEXT_PUBLIC_BASE_URL}/api/v0/get-single-profile-picture/${diamond.SenderPublicKeyBase58Check}?fallback=https://diamondapp.com/assets/img/default-profile-pic.png`}
											alt="avatar"
											className="rounded-full h-10 w-10 mr-2"
										/>
										<span className="flex w-[150px] truncate">
											{diamond.ProfileEntryResponse?.Username
												? diamond.ProfileEntryResponse?.Username
												: diamond.SenderPublicKeyBase58Check}
											{diamond.ProfileEntryResponse?.IsVerified && (
												<CheckBadgeIcon className="ml-1 w-5 h-5 text-blue-500" />
											)}
										</span>
									</div>
								</td>
								<td className="border-b py-3 text-center">
									<DiamondList number={diamond.HighestDiamondLevel} />
								</td>
								<td className="border-b py-3 text-right">
									{diamond.TotalDiamonds}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</>
		);
	};

	return (
		<div>
			{isLoaded ? (
				<LoadingSpinner isLoading={isLoaded} />
			) : diamonds.length > 0 ? (
				_renderHolders()
			) : (
				<Placeholder text={`${username} has not received any diamonds yet.`} />
			)}
		</div>
	);
};

export default Diamonds;
