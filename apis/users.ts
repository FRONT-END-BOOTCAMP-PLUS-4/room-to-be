export interface GetUserProfileDto {
  userId: string;
}

export interface GetUserProfileResult {
  name: string;
  image: string | null;
}

export async function getUserProfile({
  userId,
}: GetUserProfileDto): Promise<GetUserProfileResult> {
  const res = await fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId }),
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error || 'Failed to fetch user profile');
  }

  return await res.json();
}
