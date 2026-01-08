import { useQuery } from '@tanstack/react-query';
import { getClubInfo } from '@/api/monitoring';
import { ApiCourseType, ApiHoleType } from '@/types/club.type';

export interface CourseWithHoles {
  courseId: number;
  courseNm: string;
  courseCol: string | null;
  holes: ApiHoleType[];
}

const getLastThreeHoles = (holeList: ApiHoleType[]): ApiHoleType[] => {
  const sorted = [...holeList].sort((a, b) => a.holeNo - b.holeNo);
  return sorted.slice(-3);
};

const transformCourseData = (courseList: ApiCourseType[]): CourseWithHoles[] => {
  return courseList.map((course) => ({
    courseId: course.courseId,
    courseNm: course.courseNm,
    courseCol: course.courseCol,
    holes: getLastThreeHoles(course.holeList),
  }));
};

export const useClubInfo = (options?: {
  refetchInterval?: number;
  enabled?: boolean;
}) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['clubInfo'],
    queryFn: getClubInfo,
    refetchInterval: options?.refetchInterval,
    enabled: options?.enabled ?? true,
    retry: 2,
    staleTime: 60000,
  });

  const courses: CourseWithHoles[] = data?.courseList
    ? transformCourseData(data.courseList)
    : [];

  return {
    clubInfo: data,
    courses,
    isLoading,
    error,
    refetch,
  };
};
