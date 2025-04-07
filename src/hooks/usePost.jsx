import { useQuery } from "@tanstack/react-query"
import { fetchPost } from "../api/apiCalls"

export const usePost = (id) => {
    const { data: post, isLoading, error } = useQuery({
        queryKey: ['post', String(id)],
        queryFn: () => fetchPost(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    })
    return { post, isLoading, error }
}