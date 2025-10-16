type PlayerType = {
  playerId: number;
  playerNm: string;
  playerGen: "F" | "M" | "X"; // 여성 | 남성 | 없음
  playerTel: string | null;
  playerOrd: number;
  playerSt: string;
  playerErp: string | null;
  sumScore: number | null;
};

export default PlayerType;
