import { useQuery } from "@tanstack/react-query";
import { profile } from "../api/apiCalls";

export const useProfile = (userId) => {
    return useQuery({
        queryKey: ["profile", userId],
        queryFn: () => profile(userId),
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
    });
};
