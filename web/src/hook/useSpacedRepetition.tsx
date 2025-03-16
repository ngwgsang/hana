interface UseSpacedRepetition {
  reviewScore: number;
  daysSinceEnroll: number;
}

const useSpacedRepetition = (point: number, enrollAt: Date): UseSpacedRepetition => {
  const alpha = 0.3;
  const currentDate = new Date();
  const enrollDate = enrollAt ? new Date(enrollAt) : new Date();

  // Kiểm tra nếu ngày không hợp lệ
  const daysSinceEnroll = isNaN(enrollDate.getTime())
    ? 0
    : (currentDate.getTime() - enrollDate.getTime()) / (1000 * 60 * 60 * 24);

  const validPoint = point !== null && !isNaN(point) ? point : 0;

  return {
    reviewScore: validPoint - alpha * daysSinceEnroll,
    daysSinceEnroll,
  };
};

export default useSpacedRepetition;
