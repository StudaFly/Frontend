/** Success envelope used by every backend endpoint. */
export interface ApiResponse<T> {
    data: T;
    message: string;
}
