import { InfoCardData, OrderCounts } from "@/types";

export const getOrderCounts = (cards: InfoCardData[]): OrderCounts => {
  return {
    all: cards.length,
    R: cards.filter(card => card.status === 'R').length,
    P: cards.filter(card => card.status === 'P').length,
    Y: cards.filter(card => card.status === 'Y').length,
    N: cards.filter(card => card.status === 'N').length,
  };
};
