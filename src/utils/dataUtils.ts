import { JSONData, CellData, VSCodeMessage } from "../types";

declare function acquireVsCodeApi(): any;
const vscode = acquireVsCodeApi();

export const sendVSCodeMessage = (message: VSCodeMessage) => {
  vscode.postMessage(message);
};

export const getFileNames = (data: JSONData): string[] => {
  return Object.keys(data);
};

export const getDataArray = (data: JSONData): JSONData[] => {
  return Object.values(data);
};

export const processValue = (
  value: any,
  fileNames: string[],
  joinedPath: string,
  index: number,
): CellData => {
  // throw error if value isn't a string
  if (!(typeof value === "string") && !(value === undefined)) {
    const pathDisplay = joinedPath ? `${joinedPath.replace(/-/g, ".")}.` : "";

    sendVSCodeMessage({
      command: "invalidData",
      newValue: `${fileNames[index]}: ${pathDisplay}: ${
        value instanceof Array ? "Array" : typeof value
      }`,
    });
    return { value: "", hasError: true, isEmpty: true };
  }

  const safeContent = (value ?? "").toString();
  const isEmpty = (value ?? "").trim() === "";

  return {
    value: safeContent,
    isEmpty,
    hasError: false,
  };
};

export const isNested = (dataArray: JSONData[], key: string): boolean => {
  return dataArray.some(
    (obj) =>
      typeof obj[key] === "object" &&
      obj[key] !== null &&
      !Array.isArray(obj[key]),
  );
};

export const getAllKeys = (dataArray: JSONData[]): Set<string> => {
  const allKeys = new Set<string>();
  dataArray.forEach((obj) => {
    Object.keys(obj).forEach((key) => allKeys.add(key));
  });
  return allKeys;
};

export const getGroupColorLevel = (depth: number): number => {
  return (depth % 3) + 1;
};

export const getLevelClass = (depth: number): string => {
  return `json-table__key--level-${Math.min(depth + 1, 5)}`;
};

export const getAddControlsLevelClass = (depth: number): string => {
  return `json-table__add-controls--level-${Math.min(depth + 1, 5)}`;
};

export const extractLanguageFromFileName = (fileName: string): string => {
  // Extract language code from file names like 'en', 'es', 'fr', 'en-US', 'pt-BR', etc.
  // Handle file names like 'en/comments', 'en-US/messages', etc.
  // Support both Windows (\) and Unix (/) path separators
  const parts = fileName.split(/[/\\]/);
  const langPart = parts[0];

  // Remove any suffixes and get the language code
  return langPart.toLowerCase();
};

export const detectDefaultLanguage = (fileNames: string[]): string => {
  // Common default language patterns
  const defaultPatterns = ["en", "english", "default", "base"];

  for (const pattern of defaultPatterns) {
    const found = fileNames.find((name) =>
      extractLanguageFromFileName(name).startsWith(pattern),
    );
    if (found) {
      return extractLanguageFromFileName(found);
    }
  }

  // If no common pattern found, return the first file's language
  return fileNames.length > 0
    ? extractLanguageFromFileName(fileNames[0])
    : "en";
};

export const getOtherLanguages = (
  fileNames: string[],
  excludeLanguage: string,
): string[] => {
  return fileNames
    .map((name) => extractLanguageFromFileName(name))
    .filter((lang) => lang !== excludeLanguage);
};

export const hasContentToTranslate = (cellData: CellData[]): boolean => {
  return cellData.some(
    (cell) => !cell.isEmpty && !cell.hasError && cell.value.trim().length > 0,
  );
};
