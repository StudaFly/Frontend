import { useQuery } from "@tanstack/react-query";
import { orgApi, type StudentListItem } from "@/core/api/org";

const countryNames = new Intl.DisplayNames(["fr"], { type: "region" });

export function countryName(code: string | null | undefined): string {
    if (!code) return "—";
    try {
        return countryNames.of(code) ?? code;
    } catch {
        return code;
    }
}

export const useOrg = () =>
    useQuery({ queryKey: ["org"], queryFn: () => orgApi.get().then((r) => r.data.data) });

export const useMembers = () =>
    useQuery({ queryKey: ["org", "members"], queryFn: () => orgApi.members().then((r) => r.data.data) });

export const useZones = () =>
    useQuery({ queryKey: ["org", "zones"], queryFn: () => orgApi.zones().then((r) => r.data.data), staleTime: Infinity });

/** Every student visible to the current staff member (the API already scopes the list). */
export const useAllStudents = () =>
    useQuery({
        queryKey: ["org", "students", "all"],
        queryFn: async () => {
            const all: StudentListItem[] = [];
            for (let page = 1; ; page++) {
                const { data } = await orgApi.students({ page, perPage: 100 });
                all.push(...data.data);
                if (all.length >= data.total || data.data.length === 0) return all;
            }
        },
    });
