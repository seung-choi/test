import HoleType from "@/types/Hole.type";

type CourseType = {
    courseId: number;
    courseNm: string;
    courseCol: string;
    courseCnt: number;
    coursePar: number;
    courseErp: string | null;
    holeList: HoleType[];
}

export default CourseType;

