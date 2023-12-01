import {
	fetchHashtags,
	fetchUserHashtags,
	setPreferenceUpdateTime,
	updateUserHashtags,
} from '@/services/tag/tag';
import { useRouter } from 'next/router';
import React, { memo, useEffect, useState } from 'react';
// @ts-ignore
import Select, { ValueType } from 'react-select';

interface ProfilePreferencesProps {
	userId: string;
}
type HashTagOption = ValueType<{ value: string; label: string }>;
type HashtagEntity = { _id: string; name: string };

enum ButtonText {
	DEFAULT = 'Save Preferences',
	SAVING = 'Saving Preferences',
	SUCESSFULLY_SAVED = 'Successfully Saved Preferences',
	FAILED_TO_SAVE = 'Could Not Saved Preferences',
}

const ProfilePreferences = memo(({ userId }: ProfilePreferencesProps) => {
	const router = useRouter();
	const [existingHashTags, setExistingHashtags] = useState<HashTagOption[]>([]);
	const [selectedOptions, setSelectedOptions] = useState<HashTagOption[]>([]);

	const [fetchingAllHashtags, setFetchingAllHastags] = useState<boolean>(false);
	const [fetchingUserHashtags, setFetchingUserHastags] = useState<boolean>(false);
	const [updatingUserHashtags, setUpdatingUserHashtags] = useState<boolean>(false);
	const [savePreferenceButtonText, setSavePreferenceButtonText] = useState<string>(
		ButtonText.DEFAULT
	);

	useEffect(() => {
		if (!router.isReady) return;

		// First we get all the user's selected hashtags
		setFetchingUserHastags(true);
		fetchUserHashtags(userId)
			.then((res) => {
				updateUserPreferenceState(res as HashtagEntity[]);
			})
			.finally(() => setFetchingUserHastags(false));

		// then we get all the hashtags in the db
		setFetchingAllHastags(true);
		fetchHashtags()
			.then((res) => {
				setExistingHashtags(res.map((entity: HashtagEntity) => toHashtagOption(entity)));
			})
			.finally(() => setFetchingAllHastags(false));
	}, [router.isReady]);

	const handleChange = (selectedOptions: HashTagOption) => {
		setSelectedOptions(selectedOptions);
	};

	const toHashtagOption = (entity: HashtagEntity): HashTagOption => {
		return { value: entity._id, label: entity.name };
	};

	const updateUserPreferenceState = (preferences: HashtagEntity[]) => {
		const userExistingPreference: HashTagOption[] = [];

		if(preferences && preferences.length > 0) {
			preferences.forEach((entity: HashtagEntity) => {
				userExistingPreference.push(toHashtagOption(entity));
			});
		}

		setSelectedOptions(userExistingPreference);
	};

	const handleSavePreferences = () => {
		if (!selectedOptions) {
			return;
		}
		const selectedValues = selectedOptions.map((option: HashTagOption) => option.value);

		setUpdatingUserHashtags(true);
		setSavePreferenceButtonText(ButtonText.SAVING);
		updateUserHashtags(userId, { preferences: selectedValues })
			.then((res) => {
				updateUserPreferenceState(res.preferences);
				setSavePreferenceButtonText(ButtonText.SUCESSFULLY_SAVED);
				setPreferenceUpdateTime(userId);
			})
			.catch(() => {
				setSavePreferenceButtonText(ButtonText.FAILED_TO_SAVE);
			})
			.finally(() => {
				setUpdatingUserHashtags(false);
				setTimeout(() => {
					setSavePreferenceButtonText(ButtonText.DEFAULT);
				}, 2000);
			});
	};

	return (
		<div className="flex flex-col text-lg text-gray-700">
			{!fetchingAllHashtags && !fetchingUserHashtags ? (
				<form>
					<label>Select your preferences:</label>
					<Select
						isMulti
						options={existingHashTags}
						value={selectedOptions}
						onChange={handleChange}
					/>

					<button
						type="button"
						disabled={updatingUserHashtags}
						className="mt-2 bg-blue-500 active:bg-blue-600 text-white font-semibold hover:shadow-md shadow text-sm px-4 py-3 rounded outline-none ease-linear transition-all duration-150"
						onClick={handleSavePreferences}
					>
						{savePreferenceButtonText}
					</button>
				</form>
			) : (
				<>Loading data ...</>
			)}
		</div>
	);
});

export default ProfilePreferences;
