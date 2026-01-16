import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { getShopInfo } from '@/api/shop';
import { ApiHoleType, CourseType, CourseWithHoles } from '@/types/api/shop.type';
import storage from '@/utils/storage';

const getLastThreeHoles = (holeList: ApiHoleType[]): ApiHoleType[] => {
  const sorted = [...holeList].sort((a, b) => a.holeNo - b.holeNo);
  return sorted.slice(-3);
};

const transformCourseData = (courseList: CourseType[]): CourseWithHoles[] => {
  return courseList.map((course) => ({
    courseId: course.courseId,
    courseNm: course.courseNm,
    courseCol: course.courseCol,
    holes: getLastThreeHoles(course.holeList),
  }));
};

export const useShopInfo = (options?: {
  refetchInterval?: number;
  enabled?: boolean;
}) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['shopInfo'],
    queryFn: getShopInfo,
    refetchInterval: options?.refetchInterval,
    enabled: options?.enabled ?? true,
    retry: 2,
    staleTime: 60000,
  });

  useEffect(() => {
    if (data?.shopErp !== undefined) {
      const isErpConnected = data.shopErp !== null;
      const clubNm = data.club.clubNm;
      storage.session.set({ isErpConnected });
      storage.session.set({ clubNm });
    }
  }, [data?.shopErp]);

  const courses: CourseWithHoles[] = data?.club?.courseList
    ? transformCourseData(data.club.courseList)
    : [];

  return {
    shopInfo: data,
    courses,
    isLoading,
    error,
    refetch,
  };
};
