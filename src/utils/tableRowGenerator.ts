import { JSONData, TableRow } from "../types";
import {
  getAllKeys,
  isNested,
  processValue,
  sendVSCodeMessage,
} from "../utils/dataUtils";

export const generateTableRows = (
  dataArray: Array<JSONData>,
  depth: number,
  parentPath: string[],
  fileNames: string[],
  handleEdit: (
    command: string,
    path: string[],
    fileIndex: number,
    newValue: string,
  ) => void,
  openGroups: Set<string>,
  toggleGroup: (groupId: string) => void,
  hasMissingValue?: (filesMissingValue: Set<number>) => void,
): TableRow[] => {
  const allKeys = getAllKeys(dataArray);
  const missingValues: Set<number> = new Set();
  const rows: TableRow[] = [];

  allKeys.forEach((key) => {
    const currentPath = [...parentPath, key];
    const joinedPath = currentPath.join("-");
    const isNestedKey = isNested(dataArray, key);

    if (isNestedKey) {
      const nestedDataArray = dataArray.map((obj) => obj[key] || {});
      let nestedMissingValues: Set<number> = new Set();

      // Add group header row
      const isGroupOpen = openGroups.has(joinedPath);

      // Get nested rows first to check for missing values
      const nestedRows = generateTableRows(
        nestedDataArray,
        depth + 1,
        currentPath,
        fileNames,
        handleEdit,
        openGroups,
        toggleGroup,
        (missing: Set<number>) => {
          nestedMissingValues = missing;
        },
      );

      nestedMissingValues.forEach((m) => missingValues.add(m));

      // Add the group header
      rows.push({
        id: `${joinedPath}-header`,
        type: "group",
        key,
        path: currentPath,
        depth,
        isGroupOpen,
        hasGroupMissingValues: nestedMissingValues.size > 0,
        groupMissingIndices: nestedMissingValues,
        fileCount: fileNames.length,
      });

      // Add nested rows if group is open
      if (isGroupOpen) {
        rows.push(...nestedRows);
      }
    } else {
      // Regular field row
      const cellData = dataArray.map((obj, index) => {
        const value = obj[key];
        const processedValue = processValue(
          value,
          fileNames,
          joinedPath,
          index,
        );

        if (processedValue.isEmpty) {
          missingValues.add(index);
        }

        return processedValue;
      });

      rows.push({
        id: joinedPath,
        type: "field",
        key,
        path: currentPath,
        depth,
        cellData,
        fileCount: fileNames.length,
      });
    }
  });

  // Add the "add new key" controls
  const handleAdd = (key: string, value: any) => {
    if (allKeys.has(key)) {
      sendVSCodeMessage({
        command: "showWarning",
        newValue: "Key already exists",
      });
      return false;
    }

    sendVSCodeMessage({
      command: "add",
      key: [...parentPath, key],
      newValue: value,
    });
    return true;
  };

  rows.push({
    id: parentPath.join("-") + "-addKey",
    type: "add-controls",
    key: "",
    path: parentPath,
    depth,
    fileCount: fileNames.length,
    handleAdd,
  });

  hasMissingValue?.(missingValues);

  return rows;
};
