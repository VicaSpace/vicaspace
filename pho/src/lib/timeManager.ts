import { useAppSelector } from '@/states/hooks';

export const currentTime = () => {
  const { serverTime, clientTime } = useAppSelector((state) => state.timeSlice);

  console.log(serverTime, clientTime);
  return Date.now();
};
