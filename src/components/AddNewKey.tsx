import React, { useState, useEffect, useRef } from "react";
import { AddNewKeyProps, EditMode } from "../types";
import {
  getAddControlsLevelClass,
  getGroupColorLevel,
  sendVSCodeMessage,
} from "../utils/dataUtils";
import { PlusIcon, CloseIcon, CheckIcon } from "./Icons";

export const AddNewKey: React.FC<AddNewKeyProps> = ({
  parentPath,
  depth,
  fileCount,
  handleAdd,
}) => {
  const [editMode, setEditMode] = useState<EditMode>(EditMode.NONE);
  const [hasError, setHasError] = useState(false);
  const contentEditableRef = useRef<HTMLInputElement>(null);

  const addControlsLevelClass = getAddControlsLevelClass(depth);
  const groupColorLevel = getGroupColorLevel(depth);

  useEffect(() => {
    if (editMode !== EditMode.NONE && contentEditableRef.current) {
      contentEditableRef.current.focus();
    }
  }, [editMode]);

  const submit = () => {
    const value = contentEditableRef.current?.value || "";

    if (value.trim() === "") {
      setHasError(true);
      const message =
        editMode === EditMode.GROUP
          ? "Group name cannot be empty"
          : "Field name cannot be empty";
      sendVSCodeMessage({
        command: "showWarning",
        newValue: message,
      });
      return;
    }

    if (handleAdd(value, editMode === EditMode.GROUP ? {} : "")) {
      setEditMode(EditMode.NONE);
      if (contentEditableRef.current) {
        contentEditableRef.current.value = "";
      }
    } else {
      setHasError(true);
    }
  };

  const cancel = () => {
    setHasError(false);
    setEditMode(EditMode.NONE);
    if (contentEditableRef.current) {
      contentEditableRef.current.value = "";
    }
  };

  const getPlaceholderText = () => {
    if (editMode === EditMode.FIELD) {
      return "Add a field name";
    } else if (editMode === EditMode.GROUP) {
      return "Add a group name";
    }
    return "";
  };

  if (editMode === EditMode.NONE) {
    return (
      <tr className="json-table__row">
        <td className="json-table__cell">
          <div className={`json-table__add-controls ${addControlsLevelClass}`}>
            <button
              className={`json-table__btn json-table__btn--group-level-${groupColorLevel}`}
              onClick={() => setEditMode(EditMode.GROUP)}
            >
              <PlusIcon size={12} />
              Group
            </button>
            <button
              className="json-table__btn"
              onClick={() => setEditMode(EditMode.FIELD)}
            >
              <PlusIcon size={12} />
              Field
            </button>
          </div>

          <div
            className={`json-table__add-controls--responsive ${addControlsLevelClass}`}
          >
            <button
              className={`json-table__btn json-table__btn--group-level-${groupColorLevel}`}
              title="Add Group"
              onClick={() => setEditMode(EditMode.GROUP)}
            >
              <PlusIcon size={12} />
            </button>
            <button
              className="json-table__btn"
              title="Add Field"
              onClick={() => setEditMode(EditMode.FIELD)}
            >
              <PlusIcon size={12} />
            </button>
          </div>
        </td>
        {[...Array(fileCount)].map((_, i) => (
          <td key={i} className="json-table__cell"></td>
        ))}
      </tr>
    );
  }

  return (
    <tr className="json-table__row">
      <td className="json-table__cell" style={{ padding: "0" }}>
        <div className="json-table__edit-container">
          <input
            type="text"
            placeholder={getPlaceholderText()}
            className={
              hasError
                ? "json-table__edit-input json-table__edit-input--error"
                : "json-table__edit-input"
            }
            ref={contentEditableRef}
            onInput={() => setHasError(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                submit();
              }
              if (e.key === "Escape") {
                cancel();
              }
            }}
          />
          <div className="json-table__edit-actions">
            <button
              className="json-table__btn json-table__btn--danger"
              onClick={cancel}
            >
              <CloseIcon size={12} />
            </button>
            <button
              className="json-table__btn json-table__btn--success"
              onClick={submit}
            >
              <CheckIcon size={12} />
            </button>
          </div>
        </div>
      </td>
      {[...Array(fileCount)].map((_, i) => (
        <td key={i} className="json-table__cell"></td>
      ))}
    </tr>
  );
};
