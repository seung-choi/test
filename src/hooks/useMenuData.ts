import { useSetRecoilState } from "recoil";
import { useQuery } from "@tanstack/react-query";
import { getMenuHis } from "@/api/main";
import { menuState } from "@/lib/recoil";
import { useEffect } from "react";

// 메뉴 데이터를 로드하고 recoil에 저장하는 훅
export const useMenuData = () => {
  const setMenuCodes = useSetRecoilState(menuState);

  const {
    data: menu,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["menu"],
    queryFn: () => getMenuHis(),
    enabled: false, // 기본적으로 비활성화, 필요할 때만 실행
  });

  // 메뉴 데이터가 로드되면 recoil에 저장
  useEffect(() => {
    if (menu) {
      setMenuCodes(menu);
    }
  }, [menu, setMenuCodes]);

  // 에러 발생 시 빈 배열로 설정
  useEffect(() => {
    if (error) {
      setMenuCodes([]);
    }
  }, [error, setMenuCodes]);

  return {
    menu,
    isLoading,
    error,
    refetch: () => {
      // 수동으로 메뉴 데이터를 다시 로드
      return getMenuHis().then((data) => {
        setMenuCodes(data);
        return data;
      });
    },
  };
};
