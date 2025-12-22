import { InfoCardData, OrderCounts } from "@/types";

export const getOrderCounts = (cards: InfoCardData[]): OrderCounts => {
  return {
    all: cards.length,
    order: cards.filter(card => card.status === 'order').length,
    accept: cards.filter(card => card.status === 'accept').length,
    complete: cards.filter(card => card.status === 'complete').length,
    cancel: cards.filter(card => card.status === 'cancel').length,
  };
};