export function canAccessSocial(role?: string | null): boolean {
  return role === "admin";
}
