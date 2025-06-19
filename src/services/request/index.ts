import axios, { AxiosError, AxiosRequestConfig } from 'axios'

import { isFunction } from '@/lib/utils'

const axiosInstance = axios.create({})

const statusHandlers = {
  '401': (error: AxiosError) => {},
}

axiosInstance.interceptors.response.use(
  (response) => {
    const { data } = response

    if (data.error) {
      return Promise.reject({ message: data.message, rawRes: data })
    }

    return data.data
  },
  (error: AxiosError) => {
    if (error.response) {
      const { status } = error.response
      if (
        isFunction(
          statusHandlers[status.toString() as keyof typeof statusHandlers]
        )
      ) {
        statusHandlers[status.toString() as keyof typeof statusHandlers](error)
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  }
)

// 创建类型安全的请求函数
export async function request<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await axiosInstance(config)
  return response as T
}
