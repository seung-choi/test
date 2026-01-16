export interface UseToggleSelectionParams<T extends string, B extends string> {
  value: T | B;
  onChange: (value: T | B) => void;
  options: readonly T[];
  bothValue: B;
}
