interface UseSpacedRepetition {
  reviewScore: number;
  daysSinceEnroll: number;
}

const useSpacedRepetition = (point: number, enrollAt: String): UseSpacedRepetition => {
  const alpha = 0.3;
  const currentDate = new Date();
  const fixedEnrollAt = enrollAt ? enrollAt.replace(' ', 'T') : null;
  const enrollDate = fixedEnrollAt ? new Date(fixedEnrollAt) : new Date();
  const daysSinceEnroll = isNaN(enrollDate.getTime())
    ? 0
    : (currentDate.getTime() - enrollDate.getTime() ) / (1000 * 3600 * 24);


  const validPoint = point !== null && !isNaN(point) ? point : 0;

  return {
    reviewScore: validPoint - ( alpha * daysSinceEnroll ) ,
    daysSinceEnroll,
  };
};

export default useSpacedRepetition;
