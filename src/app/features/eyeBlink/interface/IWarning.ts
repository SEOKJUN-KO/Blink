export interface IWarning {
  triggerWarning(message: string): void;
  clearWarning(): void;
} 