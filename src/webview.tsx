import React, { useState, useEffect, useReducer } from "react"
import ReactDOM from "react-dom/client"
import css from "./styles.css"

interface VsCodeApi {
  postMessage(message: any): void
  setState(state: any): void
  getState(): any
}

declare function acquireVsCodeApi(): VsCodeApi

declare const fileNames: string[]

const vscode = acquireVsCodeApi() // This function fetches the VS Code API

const App = () => {
  const [jsonData, setJsonData] = useState([])

  const handleEdit = (
    uniqueRowId: string,
    fileIndex: number,
    newValue: string
  ) => {
    vscode.postMessage({
      command: "edit",
      key: uniqueRowId,
      fileIndex: fileIndex,
      newValue: newValue,
    })
  }

  useEffect(() => {
    // Handle messages from the extension
    const messageHandler = (event: MessageEvent) => {
      const message = event.data // The JSON data our extension sent
      switch (message.type) {
        case "json":
          console.log(message.data)
          setJsonData(message.data)
          break
      }
    }

    window.addEventListener("message", messageHandler)

    // Request the latest data from the extension
    // vscode.postMessage({ command: 'requestData' });

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener("message", messageHandler)
    }
  }, [])

  return (
    <div>
      <Table
        fileNames={fileNames}
        dataArray={jsonData}
        handleEdit={handleEdit}
      />
    </div>
  )
}

export default App

const style = document.createElement("style")
style.textContent = css
document.head.appendChild(style)
const container = document.getElementById("root")
const root = ReactDOM.createRoot(container)
root.render(React.createElement(App))

const Table = ({
  fileNames,
  dataArray,
  handleEdit,
}: {
  fileNames: string[]
  dataArray: Array<Record<string, any>>
  handleEdit: (uniqueRowId: string, fileIndex: number, newValue: string) => void
}) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Key</th>
          {fileNames.map((name, index) => (
            <th key={index}>{name}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {generateTableRows(dataArray, 0, "root", fileNames, handleEdit)}
      </tbody>
    </table>
  )
}

function generateTableRows(
  dataArray: Array<Record<string, any>>,
  depth: number,
  parentId: string,
  fileNames: string[],
  handleEdit: (
    uniqueRowId: string,
    fileIndex: number,
    newValue: string
  ) => void,
  hasMissingValue?: (filesMissingValue: Set<number>) => void
): React.ReactNode {
  const allKeys = new Set<string>()
  /**
   * column index of the files that are missing values
   */
  const missingValues: Set<number> = new Set()

  dataArray.forEach((obj) => {
    Object.keys(obj).forEach((key) => allKeys.add(key))
  })

  const rows: React.ReactNode[] = []

  allKeys.forEach((key) => {
    const uniqueRowId = `${parentId}-${key}`
    const isNested = dataArray.some(
      (obj) =>
        typeof obj[key] === "object" &&
        obj[key] !== null &&
        !Array.isArray(obj[key])
    )

    const nestIndentation = depth * 20

    if (isNested) {
      const nestedDataArray = dataArray.map((obj) => obj[key] || {})

      let isMissing: Set<number>

      const tableRows = generateTableRows(
        nestedDataArray,
        depth + 1,
        uniqueRowId,
        fileNames,
        handleEdit,
        (isMis: Set<number>) => (isMissing = isMis)
      )

      isMissing.forEach((m) => {
        missingValues.add(m)
      })

      rows.push(
        <React.Fragment key={uniqueRowId}>
          <tr
            id={`${uniqueRowId}-header`}
            onClick={() => toggleVisibility(uniqueRowId)}
          >
            <td style={{ paddingLeft: nestIndentation, cursor: "pointer" }}>
              {key}
            </td>
            {fileNames.map((_, index) => {
              if (isMissing.has(index)) {
                return <td key={index} className="missing-value"></td>
              }

              return <td key={index}></td>
            })}
          </tr>
          <tr id={uniqueRowId} className="collapse" style={{ display: "none" }}>
            <td colSpan={fileNames.length + 1} style={{ padding: 0 }}>
              <table
                style={{
                  borderSpacing: 0,
                  width: "100%",
                  borderCollapse: "collapse",
                  tableLayout: "fixed",
                }}
              >
                <tbody>{tableRows}</tbody>
              </table>
            </td>
          </tr>
        </React.Fragment>
      )
    } else {
      const rowCells = dataArray.map((obj, index) => {
        const value = obj[key]
        const safeContent = (value ?? "").toString()
        const cellClass = (value ?? "").trim() === "" ? "missing-value" : ""

        if (cellClass) {
          missingValues.add(index) // flag this row as having a missing value
        }

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
                handleEdit(uniqueRowId, index, newValue)
              }
            }}
            onKeyDown={(e) => {
              console.log(e.key)
              if(e.key === "Enter"){
                ;(e.target as HTMLInputElement).blur(); 
              }
            }}
          >
            {safeContent}
          </td>
        )
      })

      rows.push(
        <tr key={uniqueRowId}>
          <td style={{ paddingLeft: nestIndentation }}>{key}</td>
          {rowCells}
        </tr>
      )
    }
  })

  hasMissingValue?.(missingValues)

  return rows
}

function toggleVisibility(id: string) {
  const element = document.getElementById(id)
  if (element) {
    element.style.display =
      element.style.display === "none" ? "table-row" : "none"
  }
}
