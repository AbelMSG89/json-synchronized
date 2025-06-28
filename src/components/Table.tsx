import React from "react";
import { TableProps, TableRow } from "../types";
import {
  getFileNames,
  getDataArray,
  getLevelClass,
  getGroupColorLevel,
  sendVSCodeMessage,
  detectDefaultLanguage,
  extractLanguageFromFileName,
  getOtherLanguages,
  hasContentToTranslate,
} from "../utils/dataUtils";
import { generateTableRows } from "../utils/tableRowGenerator";
import { useKeyEditing } from "../hooks/useJSONSynchronizer";
import { AddNewKey } from "./AddNewKey";
import { TranslationButton } from "./TranslationButton";
import { EditIcon, DeleteIcon, CloseIcon, CheckIcon } from "./Icons";

export const Table: React.FC<TableProps> = ({
  data,
  handleEdit,
  openGroups,
  toggleGroup,
}) => {
  const fileNames = getFileNames(data);
  const dataArray = getDataArray(data);
  const tableRows = generateTableRows(
    dataArray,
    0,
    [],
    fileNames,
    handleEdit,
    openGroups,
    toggleGroup,
  );
  const {
    editingKey,
    editingError,
    startEditKey,
    finishEditKey,
    cancelEditKey,
    setEditError,
  } = useKeyEditing();

  const handleRemove = (e: React.MouseEvent, path: string[]) => {
    e.stopPropagation();
    e.preventDefault();
    sendVSCodeMessage({
      command: "remove",
      key: path,
    });
  };

  const handleKeyEdit = (oldPath: string[], newKey: string) => {
    sendVSCodeMessage({
      command: "renameKey",
      oldPath: oldPath,
      newKey: newKey,
    });
  };

  const startEdit = (e: React.MouseEvent, rowId: string) => {
    e.stopPropagation();
    startEditKey(rowId);
  };

  const finishEdit = (path: string[], newKey: string) => {
    if (newKey.trim() === "") {
      const rowId = path.join("-");
      console.log(
        "Setting error for rowId:",
        rowId,
        "Current editingError:",
        editingError,
      );
      setEditError(rowId);
      sendVSCodeMessage({
        command: "showWarning",
        newValue: "Field name cannot be empty",
      });
      return;
    }

    handleKeyEdit(path, newKey.trim());
    finishEditKey();
  };

  const renderTableRow = (row: TableRow) => {
    const levelClass = getLevelClass(row.depth);
    const groupColorLevel = getGroupColorLevel(row.depth);

    if (row.type === "group") {
      return (
        <tr
          key={row.id}
          id={row.id}
          className="json-table__row"
          onClick={() => {
            toggleGroup(row.path.join("-"));
          }}
        >
          <td className="json-table__cell">
            <div
              className={`json-table__key json-table__key--nested ${levelClass} json-table__key--group-level-${groupColorLevel}`}
            >
              {editingKey === row.id ? (
                <div className="json-table__edit-container">
                  <input
                    type="text"
                    defaultValue={row.key}
                    className={(() => {
                      const hasError = editingError === row.id;
                      const className = hasError
                        ? "json-table__edit-input json-table__edit-input--error"
                        : "json-table__edit-input";
                      console.log(
                        "Group Input className for",
                        row.id,
                        ":",
                        className,
                        "editingError:",
                        editingError,
                      );
                      return className;
                    })()}
                    autoFocus
                    onInput={() => {
                      if (editingError === row.id) {
                        setEditError(null);
                      }
                    }}
                    onBlur={(e) => finishEdit(row.path, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        finishEdit(row.path, e.currentTarget.value);
                      }
                      if (e.key === "Escape") {
                        cancelEditKey();
                      }
                      e.stopPropagation();
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="json-table__edit-actions">
                    <button
                      className="json-table__btn json-table__btn--danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        cancelEditKey();
                      }}
                    >
                      <CloseIcon size={12} />
                    </button>
                    <button
                      className="json-table__btn json-table__btn--success"
                      onClick={(e) => {
                        e.stopPropagation();
                        const input = e.currentTarget.parentElement
                          ?.previousElementSibling as HTMLInputElement;
                        finishEdit(row.path, input.value);
                      }}
                    >
                      <CheckIcon size={12} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <span className="json-table__key-text">{row.key}</span>
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
            let cellClass = "json-table__cell";
            if (
              row.hasGroupMissingValues &&
              row.groupMissingIndices?.has(index)
            ) {
              if (row.isGroupOpen) {
                cellClass += " json-table__cell--missing-group";
              } else {
                cellClass += " json-table__cell--missing-group-closed";
              }
            }
            return <td key={index} className={cellClass}></td>;
          })}
        </tr>
      );
    }

    if (row.type === "field") {
      // Translation logic
      const defaultLanguage = detectDefaultLanguage(fileNames);
      const hasTranslatableContent = row.cellData
        ? hasContentToTranslate(row.cellData)
        : false;

      const rowCells = row.cellData?.map((cellData, index) => {
        if (cellData.hasError) {
          return null;
        }

        const cellClass = cellData.isEmpty
          ? "json-table__cell json-table__cell--missing"
          : "json-table__cell";

        const currentFileName = fileNames[index];
        const currentLanguage = extractLanguageFromFileName(currentFileName);
        const isDefaultLanguage = currentLanguage === defaultLanguage;
        const otherLanguages = getOtherLanguages(fileNames, currentLanguage);

        // Show translate button only if:
        // 1. This cell has content to translate
        // 2. There are other languages to translate to
        // 3. This is not an empty cell
        const showTranslateButton =
          !cellData.isEmpty &&
          !cellData.hasError &&
          cellData.value.trim().length > 0 &&
          otherLanguages.length > 0;

        return (
          <td key={index} className={cellClass}>
            <div className="json-table__cell-content">
              <div
                className="json-table__cell-text"
                contentEditable
                suppressContentEditableWarning
                onFocus={(e) => {
                  e.currentTarget.setAttribute(
                    "data-original",
                    e.currentTarget.innerText,
                  );
                }}
                onBlur={(e) => {
                  const originalValue =
                    e.currentTarget.getAttribute("data-original") || "";
                  const newValue = e.currentTarget.innerText;
                  if (newValue !== originalValue) {
                    handleEdit("edit", row.path, index, newValue);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    (e.target as HTMLInputElement).blur();
                  }
                }}
              >
                {cellData.value}
              </div>
              {showTranslateButton && (
                <TranslationButton
                  path={row.path}
                  sourceText={cellData.value}
                  sourceLanguage={currentLanguage}
                  targetLanguages={otherLanguages}
                  isVisible={true}
                />
              )}
            </div>
          </td>
        );
      });

      return (
        <tr key={row.id} className="json-table__row">
          <td className="json-table__cell">
            <div className={`json-table__key ${levelClass}`}>
              {editingKey === row.id ? (
                <div className="json-table__edit-container">
                  <input
                    type="text"
                    defaultValue={row.key}
                    className={(() => {
                      const hasError = editingError === row.id;
                      const className = hasError
                        ? "json-table__edit-input json-table__edit-input--error"
                        : "json-table__edit-input";
                      console.log(
                        "Field Input className for",
                        row.id,
                        ":",
                        className,
                        "editingError:",
                        editingError,
                      );
                      return className;
                    })()}
                    autoFocus
                    onInput={() => {
                      if (editingError === row.id) {
                        setEditError(null);
                      }
                    }}
                    onBlur={(e) => finishEdit(row.path, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        finishEdit(row.path, e.currentTarget.value);
                      }
                      if (e.key === "Escape") {
                        cancelEditKey();
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
                        const input = e.currentTarget.parentElement
                          ?.previousElementSibling as HTMLInputElement;
                        finishEdit(row.path, input.value);
                      }}
                    >
                      <CheckIcon size={12} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <span className="json-table__key-text">{row.key}</span>
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
      );
    }

    if (row.type === "add-controls" && row.handleAdd) {
      return (
        <AddNewKey
          key={row.id}
          parentPath={row.path}
          fileCount={row.fileCount || 0}
          depth={row.depth}
          handleAdd={row.handleAdd}
        />
      );
    }

    return null;
  };

  return (
    <div className="json-table-container">
      <table className="json-table">
        <thead>
          <tr className="json-table__row">
            <th className="json-table__header">Key</th>
            {fileNames.map((name, index) => (
              <th key={index} className="json-table__header">
                {name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{tableRows.map(renderTableRow)}</tbody>
      </table>
    </div>
  );
};
