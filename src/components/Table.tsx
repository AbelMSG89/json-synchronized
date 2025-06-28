import React from 'react'
import { TableProps, TableRow } from '../types'
import {
    getFileNames,
    getDataArray,
    getLevelClass,
    getGroupColorLevel,
    sendVSCodeMessage
} from '../utils/dataUtils'
import { generateTableRows } from '../utils/tableRowGenerator'
import { useKeyEditing } from '../hooks/useJSONSynchronizer'
import { AddNewKey } from './AddNewKey'
import { EditIcon, DeleteIcon, CloseIcon, CheckIcon } from './Icons'

export const Table: React.FC<TableProps> = ({
    data,
    handleEdit,
    openGroups,
    toggleGroup,
}) => {
    const fileNames = getFileNames(data)
    const dataArray = getDataArray(data)
    const tableRows = generateTableRows(dataArray, 0, [], fileNames, handleEdit, openGroups, toggleGroup)
    const { editingKey, startEditKey, finishEditKey, cancelEditKey } = useKeyEditing()

    const handleRemove = (e: React.MouseEvent, path: string[]) => {
        e.stopPropagation()
        e.preventDefault()
        sendVSCodeMessage({
            command: "remove",
            key: path,
        })
    }

    const handleKeyEdit = (oldPath: string[], newKey: string) => {
        sendVSCodeMessage({
            command: "renameKey",
            oldPath: oldPath,
            newKey: newKey,
        })
    }

    const startEdit = (e: React.MouseEvent, rowId: string) => {
        e.stopPropagation()
        startEditKey(rowId)
    }

    const finishEdit = (path: string[], newKey: string) => {
        if (newKey.trim() !== "") {
            handleKeyEdit(path, newKey.trim())
        }
        finishEditKey()
    }

    const renderTableRow = (row: TableRow) => {
        const levelClass = getLevelClass(row.depth)
        const groupColorLevel = getGroupColorLevel(row.depth)

        if (row.type === 'group') {
            return (
                <tr
                    key={row.id}
                    id={row.id}
                    className="json-table__row"
                    onClick={() => {
                        toggleGroup(row.path.join("-"))
                    }}
                >
                    <td className="json-table__cell">
                        <div className={`json-table__key json-table__key--nested ${levelClass} json-table__key--group-level-${groupColorLevel}`}>
                            {editingKey === row.id ? (
                                <div className="json-table__edit-container">
                                    <input
                                        type="text"
                                        defaultValue={row.key}
                                        className="json-table__edit-input"
                                        autoFocus
                                        onBlur={(e) => finishEdit(row.path, e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                finishEdit(row.path, e.currentTarget.value)
                                            }
                                            if (e.key === "Escape") {
                                                cancelEditKey()
                                            }
                                            e.stopPropagation()
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    <div className="json-table__edit-actions">
                                        <button
                                            className="json-table__btn json-table__btn--danger"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                cancelEditKey()
                                            }}
                                        >
                                            <CloseIcon size={12} />
                                        </button>
                                        <button
                                            className="json-table__btn json-table__btn--success"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                const input = e.currentTarget.parentElement?.previousElementSibling as HTMLInputElement
                                                finishEdit(row.path, input.value)
                                            }}
                                        >
                                            <CheckIcon size={12} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <span className="json-table__key-text">
                                        {row.key}
                                    </span>
                                    <div>
                                        <button
                                            className="json-table__edit-btn"
                                            onClick={(e) => startEdit(e, row.id)}
                                        >
                                            <EditIcon size={10} />
                                        </button>
                                        <button
                                            className="json-table__remove-btn"
                                            onClick={(e) => handleRemove(e, row.path)}
                                        >
                                            <DeleteIcon size={10} />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </td>
                    {Array.from({ length: row.fileCount || 0 }, (_, index) => {
                        let cellClass = "json-table__cell"
                        if (row.hasGroupMissingValues && row.groupMissingIndices?.has(index)) {
                            if (row.isGroupOpen) {
                                cellClass += " json-table__cell--missing-group"
                            } else {
                                cellClass += " json-table__cell--missing-group-closed"
                            }
                        }
                        return <td key={index} className={cellClass}></td>
                    })}
                </tr>
            )
        }

        if (row.type === 'field') {
            const rowCells = row.cellData?.map((cellData, index) => {
                if (cellData.hasError) {
                    return null
                }

                const cellClass = cellData.isEmpty
                    ? "json-table__cell json-table__cell--missing"
                    : "json-table__cell"

                return (
                    <td
                        key={index}
                        className={cellClass}
                        contentEditable
                        suppressContentEditableWarning
                        onFocus={(e) => {
                            e.currentTarget.setAttribute(
                                "data-original",
                                e.currentTarget.innerText
                            )
                        }}
                        onBlur={(e) => {
                            const originalValue =
                                e.currentTarget.getAttribute("data-original") || ""
                            const newValue = e.currentTarget.innerText
                            if (newValue !== originalValue) {
                                handleEdit("edit", row.path, index, newValue)
                            }
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                ; (e.target as HTMLInputElement).blur()
                            }
                        }}
                    >
                        {cellData.value}
                    </td>
                )
            })

            return (
                <tr key={row.id} className="json-table__row">
                    <td className="json-table__cell">
                        <div className={`json-table__key ${levelClass}`}>
                            {editingKey === row.id ? (
                                <div className="json-table__edit-container">
                                    <input
                                        type="text"
                                        defaultValue={row.key}
                                        className="json-table__edit-input"
                                        autoFocus
                                        onBlur={(e) => finishEdit(row.path, e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                finishEdit(row.path, e.currentTarget.value)
                                            }
                                            if (e.key === "Escape") {
                                                cancelEditKey()
                                            }
                                        }}
                                    />
                                    <div className="json-table__edit-actions">
                                        <button
                                            className="json-table__btn json-table__btn--danger"
                                            onClick={cancelEditKey}
                                        >
                                            <CloseIcon size={12} />
                                        </button>
                                        <button
                                            className="json-table__btn json-table__btn--success"
                                            onClick={(e) => {
                                                const input = e.currentTarget.parentElement?.previousElementSibling as HTMLInputElement
                                                finishEdit(row.path, input.value)
                                            }}
                                        >
                                            <CheckIcon size={12} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <span className="json-table__key-text">
                                        {row.key}
                                    </span>
                                    <div>
                                        <button
                                            className="json-table__edit-btn"
                                            onClick={(e) => startEdit(e, row.id)}
                                        >
                                            <EditIcon size={10} />
                                        </button>
                                        <button
                                            className="json-table__remove-btn"
                                            onClick={(e) => handleRemove(e, row.path)}
                                        >
                                            <DeleteIcon size={10} />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </td>
                    {rowCells}
                </tr>
            )
        }

        if (row.type === 'add-controls' && row.handleAdd) {
            return (
                <AddNewKey
                    key={row.id}
                    parentPath={row.path}
                    fileCount={row.fileCount || 0}
                    depth={row.depth}
                    handleAdd={row.handleAdd}
                />
            )
        }

        return null
    }

    return (
        <div className="json-table-container">
            <table className="json-table">
                <thead>
                    <tr className="json-table__row">
                        <th className="json-table__header">Key</th>
                        {fileNames.map((name, index) => (
                            <th key={index} className="json-table__header">{name}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {tableRows.map(renderTableRow)}
                </tbody>
            </table>
        </div>
    )
}
