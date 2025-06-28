import React from "react";
import ReactDOM from "react-dom/client";
import { Table } from "./components/Table";
import { useJSONData } from "./hooks/useJSONSynchronizer";
import { sendVSCodeMessage } from "./utils/dataUtils";
import css from "./styles.css";

const App = () => {
  const { jsonData, openGroups, toggleGroup } = useJSONData();

  const handleEdit = (
    command: string,
    path: string[],
    fileIndex: number,
    newValue: string,
  ) => {
    sendVSCodeMessage({
      command,
      key: path,
      fileIndex: fileIndex,
      newValue: newValue,
    });
  };

  return (
    <div className="json-table-container">
      <Table
        data={jsonData}
        handleEdit={handleEdit}
        openGroups={openGroups}
        toggleGroup={toggleGroup}
      />
    </div>
  );
};

export default App;

const style = document.createElement("style");
style.textContent = css;
document.head.appendChild(style);
const container = document.getElementById("root");
const root = ReactDOM.createRoot(container!);
root.render(React.createElement(App));
