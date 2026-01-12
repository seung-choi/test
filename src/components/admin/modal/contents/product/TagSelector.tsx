import React from 'react';
import styles from '@/styles/components/admin/modal/ProductModal.module.scss';
import { MENU_TAGS, getTagClass } from '@/constants/admin/tags/menuTags';

interface TagSelectorProps {
  selectedTags: string[];
  onToggle: (tag: string) => void;
  maxTags?: number;
}

const TagSelector: React.FC<TagSelectorProps> = ({ selectedTags, onToggle, maxTags = 2 }) => {
  const getTagClassName = (tag: string) => {
    if (selectedTags.includes(tag)) {
      return styles[getTagClass(tag)];
    }
    return styles.tagInactive;
  };

  return (
    <div className={styles.tagList}>
      {MENU_TAGS.map((tag) => (
        <button
          key={tag.value}
          className={`${styles.tag} ${getTagClassName(tag.value)}`}
          onClick={() => onToggle(tag.value)}
        >
          {tag.label}
        </button>
      ))}
    </div>
  );
};

export default TagSelector;
