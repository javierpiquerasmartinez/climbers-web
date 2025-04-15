import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../lib/axios';

type ClimbingStyle = {
  id: number;
  name: string;
};

type ClimbingLevel = {
  id: number;
  name: string;
};

type Language = {
  id: number;
  name: string;
  flag: string;
};

type Equipment = {
  id: number;
  name: string;
};

type ParamsResponse = {
  climbingStyles: ClimbingStyle[];
  climbingLevels: ClimbingLevel[];
  languages: Language[];
  equipment: Equipment[];
};

export function useParams() {
  return useQuery<ParamsResponse>({
    queryKey: ['params'], // Identifica esta query en la caché
    queryFn: async () => {
      const { data } = await axiosInstance.get('/api/params');
      return data;
    },
    staleTime: 1000 * 60 * 60 * 24 // 1 día
  })
}