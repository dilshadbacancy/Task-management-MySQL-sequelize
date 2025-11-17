export function getMetaData(value: any, query: any): Record<string, any> | null {
    const meta = {
        count: value.count,
        limit: query.limit,
        page: query.page,
        totalPages: Math.ceil(value.count / query.limit),
    }
    return meta;
}