export interface IBaseRepository<T> {
  save(entity: T): Promise<void>;

  findById(id: string): Promise<T | null>;

  delete(id: string): Promise<void>;

  exists(id: string): Promise<boolean>;
}
