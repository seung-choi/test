export interface HoleData {
  id: string;
  holeNo: number;
  distance?: number;
  par?: number;
}

export interface CourseData {
  lakeCourse: HoleData[];
  hillCourse: HoleData[];
}