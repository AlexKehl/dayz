import { AsyncReturnType, Fn } from '@/types'

export const asyncTimeout =
  (time: number) =>
  <T>(someObj: T): Promise<T> => {
    return new Promise((resolve) => {
      return setTimeout(() => resolve(someObj), time)
    })
  }

export const withTryCatch =
  <T extends Fn, U extends Error>(fn: T) =>
  async (
    ...args: Parameters<T>
  ): Promise<[U, null] | [null, AsyncReturnType<T>]> => {
    try {
      const res = await fn(...args)
      return [null, res]
    } catch (e: any) {
      return [e, null]
    }
  }

export interface RetryOpts {
  pred?: (args: any) => boolean
  retryAmount?: number
  delay?: number
  defaultValue?: any
}

export const withRetry =
  ({ pred, defaultValue, retryAmount = 5, delay = 0 }: RetryOpts = {}) =>
  <T extends Fn>(fn: T) =>
  async (...args: Parameters<T>): Promise<AsyncReturnType<T>> => {
    const [err, res] = await withTryCatch(fn)(...args)
    await asyncTimeout(delay)(null)
    if (err) {
      if (retryAmount === 0) {
        return defaultValue
          ? Promise.resolve(defaultValue)
          : Promise.reject(err)
      }
      return withRetry({ pred, retryAmount: retryAmount - 1, defaultValue })(
        fn
      )(...args)
    }
    if (pred && !pred(res!)) {
      if (retryAmount > 0) {
        return withRetry({ pred, retryAmount: retryAmount - 1, defaultValue })(
          fn
        )(...args)
      }

      return defaultValue
        ? Promise.resolve(defaultValue)
        : Promise.reject(
            new Error(
              `Fn (${
                fn.name
              }) failed after few retries. Predicate does not match for ${JSON.stringify(
                res
              )}`
            )
          )
    }
    return res!
  }
