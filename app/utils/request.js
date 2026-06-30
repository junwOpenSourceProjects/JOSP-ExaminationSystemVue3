import axios from 'axios'

export const request = axios.create({
  baseURL: useRuntimeConfig().public.baseURL || 'http://localhost:8081',
  timeout: 30000
})

request.interceptors.response.use(
  (response) => (response.data?.data !== undefined ? response.data.data : response.data),
  (error) => Promise.reject(error)
)

export default request
