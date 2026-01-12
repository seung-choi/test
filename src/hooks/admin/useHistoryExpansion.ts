import { useState } from 'react';

export const useHistoryExpansion = () => {
  const [expandedHistoryIds, setExpandedHistoryIds] = useState<Set<string>>(new Set());

  const toggleExpansion = (historyId: string) => {
    const newExpanded = new Set(expandedHistoryIds);
    if (newExpanded.has(historyId)) {
      newExpanded.delete(historyId);
    } else {
      newExpanded.add(historyId);
    }
    setExpandedHistoryIds(newExpanded);
  };

  const isExpanded = (historyId: string) => expandedHistoryIds.has(historyId);

  return {
    toggleExpansion,
    isExpanded,
  };
};
