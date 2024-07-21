import { BetResult } from '@/makeBet/types';

export const manageError = (errorText: string): BetResult => {
  return {
    success: false,
    message: `Произошла ошибка: ${errorText}`,
  };
};
