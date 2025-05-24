"use client"

import useSWR from "swr"

export default function useServerAction(key, serverAction, params = null) {
  const fetcher = async () => {
    if (typeof serverAction !== "function") {
      throw new Error("Server action is required")
    }
    const res = await serverAction(params)
    // if your action returns an object with an .error property, throw it
    if (res && res.error) {
      console.error("ServerAction error:", res.error)
      throw new Error(res.error)
    }
    return res
  }

  const {
    data,
    error,
    isValidating: isLoading,
    mutate
  } = useSWR(key, fetcher, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  })

  return { data, error, isLoading, mutate }
}
