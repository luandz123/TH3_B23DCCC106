export interface DifficultyLevel {
  value: string;
  label: string;
}

export const DIFFICULTY_LEVELS: DifficultyLevel[] = [
  { value: '0', label: 'Dễ' },
  { value: '1', label: 'Trung bình' },
  { value: '2', label: 'Khó' }
];