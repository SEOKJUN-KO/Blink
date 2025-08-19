export interface IDefaultPresenter<I> {
    present(response: I): void
}