const INITIAL_AVATAR_API_URL = 'https://ui-avatars.com/api';
const DEFAULT_INITIAL = 'VicaSpace';

/**
 * Build User Avatar URL based on initial of username
 * @param name Name
 * @returns Initial Avatar URL
 */
export const buildUserAvatarURL = (name?: string) => {
  const avatarUrl = `${INITIAL_AVATAR_API_URL}/?name=${
    name ?? DEFAULT_INITIAL
  }`;
  return avatarUrl;
};
