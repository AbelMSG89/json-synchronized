import { JSONData, TableRow, CellData, VSCodeMessage } from '../types'

declare function acquireVsCodeApi(): any
const vscode = acquireVsCodeApi()

export const sendVSCodeMessage = (message: VSCodeMessage) => {
    vscode.postMessage(message)
}

export const getFileNames = (data: JSONData): string[] => {
    return Object.keys(data)
}

export const getDataArray = (data: JSONData): JSONData[] => {
    return Object.values(data)
}

export const processValue = (value: any, fileNames: string[], joinedPath: string, index: number): CellData => {
    // throw error if value isn't a string
    if (!(typeof value === "string") && !(value === undefined)) {
        const pathDisplay = joinedPath ? `${joinedPath.replace(/-/g, '.')}.` : ""

        sendVSCodeMessage({
            command: "invalidData",
            newValue: `${fileNames[index]}: ${pathDisplay}: ${value instanceof Array ? "Array" : typeof value
                }`,
        })
        return { value: "", hasError: true, isEmpty: true }
    }

    const safeContent = (value ?? "").toString()
    const isEmpty = (value ?? "").trim() === ""

    return {
        value: safeContent,
        isEmpty,
        hasError: false
    }
}

export const isNested = (dataArray: JSONData[], key: string): boolean => {
    return dataArray.some(
        (obj) =>
            typeof obj[key] === "object" &&
            obj[key] !== null &&
            !Array.isArray(obj[key])
    )
}

export const getAllKeys = (dataArray: JSONData[]): Set<string> => {
    const allKeys = new Set<string>()
    dataArray.forEach((obj) => {
        Object.keys(obj).forEach((key) => allKeys.add(key))
    })
    return allKeys
}

export const getGroupColorLevel = (depth: number): number => {
    return ((depth % 3) + 1) // Cycle through 3 colors: 1, 2, 3, 1, 2, 3...
}

export const getLevelClass = (depth: number): string => {
    return `json-table__key--level-${Math.min(depth + 1, 5)}`
}

export const getAddControlsLevelClass = (depth: number): string => {
    return `json-table__add-controls--level-${Math.min(depth + 1, 5)}`
}
