import type { ApiUser } from "@/core/api/users";
import type { User } from "./AuthContext";

/** Merge the backend user (source of truth for identity) with local-only profile fields. */
export function toSessionUser(apiUser: ApiUser, previous?: User | null): User {
    const [firstName = "", ...rest] = apiUser.name.trim().split(/\s+/);
    const keepImage = previous?.avatarType === "image" && !!previous.avatar;
    return {
        ...previous,
        id: apiUser.id,
        role: apiUser.role,
        email: apiUser.email,
        phone: apiUser.phone,
        firstName,
        lastName: rest.join(" "),
        avatar: keepImage ? previous.avatar : (apiUser.avatarEmoji ?? previous?.avatar ?? null),
        avatarType: keepImage ? "image" : "emoji",
    };
}
