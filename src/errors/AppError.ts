class AppError {
  public readonly message: string | Array<{ field: string; message: string }>
  public readonly statusCode: number

  constructor(
    message: string | Array<{ field: string; message: string }>,
    statusCode = 400
  ) {
    this.message = message
    this.statusCode = statusCode
  }
}

export { AppError }
