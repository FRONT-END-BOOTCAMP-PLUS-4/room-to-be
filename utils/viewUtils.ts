export const getHiddenWalls = (
  angle: number,
  isTopView: boolean,
): Array<'front' | 'right' | 'back' | 'left'> => {
  if (isTopView) return ['front', 'right', 'back', 'left'];
  const hideWallsByAngle: Record<
    number,
    Array<'front' | 'right' | 'back' | 'left'>
  > = {
    45: ['front', 'right'],
    135: ['right', 'back'],
    225: ['back', 'left'],
    315: ['left', 'front'],
  };
  return hideWallsByAngle[angle] ?? [];
};

export const getVisibleWalls = (
  angle: number,
  isTopView: boolean,
): Array<'front' | 'right' | 'back' | 'left'> => {
  const allWalls: Array<'front' | 'right' | 'back' | 'left'> = [
    'front',
    'right',
    'back',
    'left',
  ];

  if (isTopView) return [];

  const hiddenWalls = getHiddenWalls(angle, false);

  return allWalls.filter((wall) => !hiddenWalls.includes(wall));
};
