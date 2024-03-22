
export function extractIdentityToken(locationSearch: string) {
    const query = new URLSearchParams(locationSearch)
    if (query && query.get("token")) {
        return query.get("token");
    }
    return null;
}
