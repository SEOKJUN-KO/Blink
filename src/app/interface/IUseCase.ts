export interface IUseCase<I, O> {
  execute(req: I): Promise<O>;
}
