export const isBoolean = (data: unknown): data is boolean => {
    return typeof data === 'boolean' || data instanceof Boolean
}

export const isNumber = (data: unknown): data is number => {
    return typeof data === 'number' || data instanceof Number
}

export const isBigInt = (data: unknown): data is bigint => {
    return typeof data === 'bigint' || data instanceof BigInt
}

export const isDate = (data: unknown): data is Date => {
    return !!data && data instanceof Date
}

export const isString = (data: unknown): data is string => {
    return typeof data === 'string' || data instanceof String
}

export const isArray = (data: unknown): data is unknown[] => {
    return Array.isArray(data)
}

export const isObject = (data: unknown): data is object => {
    return typeof data === 'object' && data !== null
}

export const isNull = (data: unknown): data is null => {
    return data === null
}

export const isUndefined = (data: unknown): data is undefined => {
    return data === undefined
}

// trunk-ignore(eslint/@typescript-eslint/no-unsafe-function-type)
export const isFunction = (data: unknown): data is Function => {
    return !!data && data instanceof Object && typeof data === 'function'
}
