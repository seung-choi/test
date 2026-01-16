export interface LoginFormAPI {
  username: string;
  password: string;
}

export interface LoginResponseAPI {
  groupId: number;
  groupNm: string;
  groupType: string;
  userId: string;
  userNm: string;
  initSt: string;
  clubId: string;
  clubLogo: string;
}
