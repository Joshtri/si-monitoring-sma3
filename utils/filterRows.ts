export function filterRowsBySearch<T extends Record<string, any>>(
    rows: T[],
    query: string
): T[] {
    if (!query) return rows;

    const q = query.toLowerCase();

    return rows.filter((row) =>
        Object.values(row).some((val) => {
            if (typeof val === "string" || typeof val === "number") {
                return val.toString().toLowerCase().includes(q);
            }
            return false;
        })
    );
}
