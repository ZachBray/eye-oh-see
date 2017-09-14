export interface IUnitOfWork<T> {
    value: T;
    dispose(): void;
}
