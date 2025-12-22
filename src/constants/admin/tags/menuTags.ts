export interface MenuTag {
  value: string;
  label: string;
  backgroundColor: string;
  textColor: string;
  cssClass: string;
}

export const MENU_TAGS: MenuTag[] = [
  {
    value: 'NEW',
    label: 'NEW',
    backgroundColor: '#FEC738',
    textColor: '#1F1F1F',
    cssClass: 'tagNew',
  },
  {
    value: 'BEST',
    label: 'BEST',
    backgroundColor: '#02B6D1',
    textColor: '#FFFFFF',
    cssClass: 'tagBest',
  },
  {
    value: '시그니처',
    label: '시그니처',
    backgroundColor: '#FF4B4B',
    textColor: '#FFFFFF',
    cssClass: 'tagSignature',
  },
  {
    value: '한정',
    label: '한정',
    backgroundColor: '#7000FF',
    textColor: '#FFFFFF',
    cssClass: 'tagLimited',
  },
  {
    value: '레이디',
    label: '레이디',
    backgroundColor: '#FF7575',
    textColor: '#FFFFFF',
    cssClass: 'tagLady',
  },
];

export const NONE_TAG: MenuTag = {
  value: 'none',
  label: 'none',
  backgroundColor: '#F3F3F3',
  textColor: '#1F1F1F',
  cssClass: 'tagNone',
};

export const ALL_TAGS = [...MENU_TAGS, NONE_TAG];

export const getTagByValue = (value: string): MenuTag | undefined => {
  return ALL_TAGS.find(tag => tag.value === value);
};

export const getTagClass = (value: string): string => {
  const tag = getTagByValue(value);
  return tag?.cssClass || '';
};
