import React, { useState, useEffect } from "react"
import ReactDOM from "react-dom/client"
//import './App.css';  // Assume you have some basic CSS

interface VsCodeApi {
  postMessage(message: any): void
  setState(state: any): void
  getState(): any
}

declare function acquireVsCodeApi(): VsCodeApi

const vscode = acquireVsCodeApi() // This function fetches the VS Code API

const App = ({ initialData }) => {
  console.log("app")
  const [jsonData, setJsonData] = useState(initialData)

  const handleBlur = (key, fileIndex, newValue) => {
    vscode.postMessage({
      command: "edit",
      key: key,
      fileIndex: fileIndex,
      newValue: newValue,
    })
  }

  const renderCell = (item, key, index) => {
    return (
      <td
        contentEditable
        onBlur={(e) =>
          handleBlur(`${key}-${index}`, index, (e.target as any).innerText)
        }
        dangerouslySetInnerHTML={{ __html: item[key] ?? "" }}
      />
    )
  }

  const generateTableRows = (data) => {
    return data.map((item, index) => (
      <tr key={index}>
        {Object.keys(item).map((key) => renderCell(item, key, index))}
      </tr>
    ))
  }

  return (
    <table>
      <thead>
        <tr>
          {Object.keys(initialData[0]).map((key) => (
            <th key={key}>{key}</th>
          ))}
        </tr>
      </thead>
      <tbody>{generateTableRows(jsonData)}</tbody>
    </table>
  )
}

export default App

const container = document.getElementById("root")
const root = ReactDOM.createRoot(container)
root.render(<App initialData={"test"} />)
console.log("React logs")
