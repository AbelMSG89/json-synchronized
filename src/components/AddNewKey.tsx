import React, { useState, useEffect, useRef } from 'react'
import { AddNewKeyProps, EditMode } from '../types'
import { getAddControlsLevelClass } from '../utils/dataUtils'
import { PlusIcon, CloseIcon, CheckIcon } from './Icons'

export const AddNewKey: React.FC<AddNewKeyProps> = ({
  parentPath,
  depth,
  fileCount,
  handleAdd
}) => {
  const [editMode, setEditMode] = useState<EditMode>(EditMode.NONE)
  const [hasError, setHasError] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 })
  const contentEditableRef = useRef<HTMLInputElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const addControlsLevelClass = getAddControlsLevelClass(depth)

  useEffect(() => {
    if (editMode !== EditMode.NONE && contentEditableRef.current) {
      contentEditableRef.current.focus()
    }
  }, [editMode])

  useEffect(() => {
    if (showPopup && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const viewportWidth = window.innerWidth
      const popupHeight = 100 // Approximate popup height
      const popupWidth = 130 // Approximate popup width
      const margin = 16 // Margin from edges
      
      let top = buttonRect.bottom + 12 // Add more space to avoid overlap
      let left = buttonRect.left
      
      // Check if popup would go below viewport
      if (top + popupHeight > viewportHeight) {
        top = buttonRect.top - popupHeight - 12 // Position above button
      }
      
      // Check if popup would go off screen to the right
      if (left + popupWidth > viewportWidth) {
        left = buttonRect.right - popupWidth // Align right edge of popup with right edge of button
      }
      
      // Ensure popup doesn't go off screen to the left
      if (left < margin) {
        left = margin
      }
      
      // Ensure popup doesn't go off screen at the top
      if (top < margin) {
        top = margin
      }
      
      setPopupPosition({ top, left })
    }
  }, [showPopup])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showPopup) {
        setShowPopup(false)
      }
    }

    if (showPopup) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [showPopup])

  const handlePopupSelect = (mode: EditMode) => {
    setShowPopup(false)
    setEditMode(mode)
  }

  const submit = () => {
    const value = contentEditableRef.current?.value || ""
    if (handleAdd(value, editMode === EditMode.GROUP ? {} : "")) {
      setEditMode(EditMode.NONE)
      if (contentEditableRef.current) {
        contentEditableRef.current.value = ""
      }
    } else {
      setHasError(true)
    }
  }

  const cancel = () => {
    setHasError(false)
    setEditMode(EditMode.NONE)
    if (contentEditableRef.current) {
      contentEditableRef.current.value = ""
    }
  }

  const getPlaceholderText = () => {
    if (editMode === EditMode.FIELD) {
      return "Add a field name"
    } else if (editMode === EditMode.GROUP) {
      return "Add a group name"
    }
    return ""
  }

  if (editMode === EditMode.NONE) {
    return (
      <tr className="json-table__row">
        <td className="json-table__cell">
          {/* Desktop version - two separate buttons */}
          <div className={`json-table__add-controls ${addControlsLevelClass}`}>
            <button 
              className="json-table__btn"
              onClick={() => setEditMode(EditMode.FIELD)}
            >
              <PlusIcon size={12} />
              Field
            </button>
            <button 
              className="json-table__btn"
              onClick={() => setEditMode(EditMode.GROUP)}
            >
              <PlusIcon size={12} />
              Group
            </button>
          </div>
          
          {/* Mobile/responsive version - single button with popup */}
          <div className={`json-table__add-controls--responsive ${addControlsLevelClass}`}>
            <button 
              ref={buttonRef}
              className="json-table__add-btn-single"
              onClick={() => setShowPopup(!showPopup)}
            >
              <PlusIcon size={16} />
            </button>
            
            {showPopup && (
              <>
                <div 
                  className="json-table__popup-overlay"
                  onClick={() => setShowPopup(false)}
                />
                <div 
                  className="json-table__popup"
                  style={{
                    top: `${popupPosition.top}px`,
                    left: `${popupPosition.left}px`
                  }}
                >
                  <button 
                    className="json-table__popup-item"
                    onClick={() => handlePopupSelect(EditMode.FIELD)}
                  >
                    <PlusIcon size={12} />
                    Field
                  </button>
                  <button 
                    className="json-table__popup-item"
                    onClick={() => handlePopupSelect(EditMode.GROUP)}
                  >
                    <PlusIcon size={12} />
                    Group
                  </button>
                </div>
              </>
            )}
          </div>
        </td>
        {[...Array(fileCount)].map((_, i) => (
          <td key={i} className="json-table__cell"></td>
        ))}
      </tr>
    )
  }

  return (
    <tr className="json-table__row">
      <td className="json-table__cell" style={{ padding: "0" }}>
        <div className="json-table__edit-container">
          <input
            type="text"
            placeholder={getPlaceholderText()}
            className={hasError ? "json-table__edit-input json-table__edit-input--error" : "json-table__edit-input"}
            ref={contentEditableRef}
            onInput={() => setHasError(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                submit()
              }
              if (e.key === "Escape") {
                cancel()
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
  )
}
