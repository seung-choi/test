export interface HoleData {
  id: string;
  holeNumber: string;
  distance?: number;
  par?: number;
}

export interface CourseData {
  lakeCourse: HoleData[];
  hillCourse: HoleData[];
}