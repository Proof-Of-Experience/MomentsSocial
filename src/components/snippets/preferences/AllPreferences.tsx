import {
	fetchHashtags,
	fetchUserHashtags,
	setPreferenceUpdateTime,
	updateUserHashtags,
} from '@/services/tag/tag';
import { useRouter } from 'next/router';
import React, { memo, useEffect, useState } from 'react';
// @ts-ignore
import { ValueType } from 'react-select';
import { capitalizeFirstLetter } from '@/utils';
import { userLogin } from '@/services/user/user';
import { setAuthUser } from '@/slices/authSlice';
import { useDispatch } from 'react-redux';

interface ProfilePreferencesProps {
	userId: string | null;
}
type HashTagOption = ValueType<{ value: string; label: string }>;
type HashtagEntity = { _id: string; name: string };

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
enum ButtonText {
	DEFAULT = 'Save Preferences',
	SAVING = 'Saving Preferences',
	SUCESSFULLY_SAVED = 'Successfully Saved Preferences',
	FAILED_TO_SAVE = 'Could Not Saved Preferences',
}

const AllPreferences = ({ userId }: ProfilePreferencesProps) => {
	const router = useRouter();
	const dispatch = useDispatch();

	const [selectedOptions, setSelectedOptions] = useState<HashTagOption[]>([]);
	const [availableOptions, setAvailableOptions] = useState<HashTagOption[]>([]);
	const [savingId, setSavingId] = useState<string>('');

	const [fetchingAllHashtags, setFetchingAllHastags] = useState<boolean>(false);
	const [fetchingUserHashtags, setFetchingUserHastags] = useState<boolean>(false);
	const [updatingUserHashtags, setUpdatingUserHashtags] = useState<boolean>(false);

	useEffect(() => {
		if (!router.isReady) {
			return;
		}
		// First we get all the user's selected hashtags
		fetchData(userId);
	}, [router.isReady, userId]);

	const fetchData = async (userId: string | null) => {
		setFetchingAllHastags(true);

		const hashtagsRes = await fetchHashtags();

		const mappedHashtags = await hashtagsRes.map((entity: HashtagEntity) =>
			toHashtagOption(entity)
		);

		// setExistingHashtags(mappedHashtags);

		setFetchingAllHastags(false);

		if (userId) {
			setFetchingUserHastags(true);
			const userHashtags = await fetchUserHashtags(userId);

			const mappedUserHashtags = userHashtags as HashtagEntity[];
			updateUserPreferenceState(mappedUserHashtags);

			setFetchingUserHastags(false);
		}

		filterAndSetAvailableHashtags(mappedHashtags);
	};

	const toHashtagOption = (entity: HashtagEntity): HashTagOption => {
		return { value: entity._id, label: entity.name };
	};

	const updateUserPreferenceState = (preferences: HashtagEntity[]) => {
		const userExistingPreference: HashTagOption[] = [];

		if (preferences && preferences.length > 0) {
			preferences.forEach((entity: HashtagEntity) => {
				userExistingPreference.push(toHashtagOption(entity));
			});
		}

		setSelectedOptions(userExistingPreference);
	};

	const filterAndSetAvailableHashtags = (tags: ValueType[]) => {
		let filteredHashTags: HashTagOption[] = [];

		if (selectedOptions.length === 0) {
			filteredHashTags = tags;
		} else {
			filteredHashTags = tags.filter(
				(tag) => !selectedOptions.map((selected) => selected.value).includes(tag.value)
			);
		}
		setAvailableOptions(filteredHashTags);
	};

	const handleSavePreferences = async (option: HashTagOption, index: number) => {
		let _userId = userId ?? '';

		if (!userId) {
			try {
				const user = await userLogin();

				dispatch(setAuthUser(user));

				_userId = user.publicKeyBase58Check;
			} catch (err: any) {
				return;
			}
		}

		selectedOptions.push(option);

		const map = new Set<string>();

		selectedOptions.forEach((option: HashTagOption) => {
			if (!map.has(option.value)) {
				map.add(option.value);
			}
		});

		const selectedValues = Array.from(map);

		setUpdatingUserHashtags(true);

		updateUserHashtags(_userId, { preferences: selectedValues })
			.then((res) => {
				updateUserPreferenceState(res.preferences);
				setPreferenceUpdateTime(_userId);
				setSavingId(option.value);

				setTimeout(() => {
					availableOptions.splice(index, 1);
				}, 1500);
			})
			.catch(() => {
				// setSavePreferenceButtonText(ButtonText.FAILED_TO_SAVE);
			})
			.finally(() => {
				setUpdatingUserHashtags(false);
				setTimeout(() => {
					// setSavePreferenceButtonText(ButtonText.DEFAULT);
					setSavingId('');
				}, 2000);
			});
	};
	return (
		<div className="flex flex-col text-lg text-gray-700">
			{!fetchingAllHashtags && !fetchingUserHashtags ? (
				<div>
					{availableOptions.map((option: HashTagOption, index: number) => (
						<button
							key={`tag-${index}-${option.value}`}
							className={
								'border-b-[1px] border-[#00A1D4] text-[#00A1D4] px-3 py-2 leading-trim font-inter text-base'
							}
							title={option.label}
							type="button"
							disabled={updatingUserHashtags}
							onClick={() => handleSavePreferences(option, index)}
						>
							{savingId === option.value ? 'saved' : ''}{' '}
							{'#' + capitalizeFirstLetter(option.label)}
						</button>
					))}
				</div>
			) : (
				<>Loading data...</>
			)}
		</div>
	);
};

export default memo(AllPreferences);
