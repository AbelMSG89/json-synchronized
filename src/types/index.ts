export interface VsCodeApi {
    postMessage(message: any): void
    setState(state: any): void
    getState(): any
}

export type JSONData = { [key: string]: any }

export interface TableRow {
    id: string
    type: 'group' | 'field' | 'add-controls'
    key: string
    path: string[]
    depth: number
    isGroupOpen?: boolean
    hasGroupMissingValues?: boolean
    groupMissingIndices?: Set<number>
    cellData?: CellData[]
    fileCount?: number
    handleAdd?: (key: string, value: any) => boolean
}

export interface CellData {
    value: string
    isEmpty: boolean
    hasError: boolean
}

export enum EditMode {
    NONE = "none",
    FIELD = "field",
    GROUP = "group",
}

export interface TableProps {
    data: JSONData
    handleEdit: (
        command: string,
        path: string[],
        fileIndex: number,
        newValue: string
    ) => void
    openGroups: Set<string>
    toggleGroup: (groupId: string) => void
}

export interface AddNewKeyProps {
    parentPath: string[]
    depth: number
    fileCount: number
    handleAdd: (key: string, value: any) => boolean
}

export interface VSCodeMessage {
    command: string
    key?: string[]
    fileIndex?: number
    newValue?: string
    oldPath?: string[]
    newKey?: string
}
