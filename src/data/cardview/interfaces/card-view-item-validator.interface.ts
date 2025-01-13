
export interface CardViewItemValidator {
  message: string;
  isValid(value: any): boolean;
}
