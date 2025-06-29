import { useState, useEffect } from "react";
import { JSONData } from "../types";

export const useJSONData = () => {
  const [jsonData, setJsonData] = useState<JSONData>({});
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (groupId: string) => {
    const newOpenGroups = new Set(openGroups);
    if (newOpenGroups.has(groupId)) {
      newOpenGroups.delete(groupId);
    } else {
      newOpenGroups.add(groupId);
    }
    setOpenGroups(newOpenGroups);
  };

  useEffect(() => {
    const messageHandler = (event: MessageEvent) => {
      const message = event.data;
      switch (message.type) {
        case "json":
          setJsonData(message.data);
          break;
      }
    };

    window.addEventListener("message", messageHandler);

    return () => {
      window.removeEventListener("message", messageHandler);
    };
  }, []);

  return {
    jsonData,
    openGroups,
    toggleGroup,
  };
};

export const useKeyEditing = () => {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingError, setEditingError] = useState<string | null>(null);

  const startEditKey = (rowId: string) => {
    setEditingKey(rowId);
    setEditingError(null);
  };

  const finishEditKey = () => {
    setEditingKey(null);
    setEditingError(null);
  };

  const cancelEditKey = () => {
    setEditingKey(null);
    setEditingError(null);
  };

  const setEditError = (rowId: string | null) => {
    setEditingError(rowId);
  };

  return {
    editingKey,
    editingError,
    startEditKey,
    finishEditKey,
    cancelEditKey,
    setEditError,
  };
};
