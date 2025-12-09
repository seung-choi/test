export const getTagImage = (tagName: string) => {
  return `/assets/image/tag/tag_${tagName}.svg`;
};

export const getTagAltText = (tagName: string) => {
  const tagAltMap: { [key: string]: string } = {
    'vip': 'VIP',
    'comp': '컴프',
    'delay': '지연',
    'group': '그룹',
    'self01': '셀프01',
    'marshal': '마샬',
    'education': '교육',
    'add_9_holes': '9홀추가',
    'green_check': '그린체크',
    'topdressing': '톱드레싱',
    'two_persons': '2인',
    'three_persons': '3인',
    'five_persons': '5인',
    'last_team_l1': '막팀L1',
    'last_team_l2': '막팀L2',
    'last_team_l3': '막팀L3',
    'first_team_f1': '첫팀F1',
    'first_team_f2': '첫팀F2',
    'first_team_f3': '첫팀F3'
  };
  return tagAltMap[tagName] || tagName;
};
