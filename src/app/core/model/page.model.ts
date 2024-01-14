export class Page<T> {
  content!: T[];
  totalElements!: number;
  totalPages!: number;
  last!: boolean;
  size!: number;
}
