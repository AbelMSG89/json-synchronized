import React from "react";
import { TranslateIcon } from "./Icons";
import { sendVSCodeMessage } from "../utils/dataUtils";

interface TranslationButtonProps {
  path: string[];
  sourceText: string;
  sourceLanguage: string;
  targetLanguages: string[];
  isVisible: boolean;
}

export const TranslationButton: React.FC<TranslationButtonProps> = ({
  path,
  sourceText,
  sourceLanguage,
  targetLanguages,
  isVisible,
}) => {
  if (!isVisible || !sourceText.trim() || targetLanguages.length === 0) {
    return null;
  }

  const handleTranslate = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    sendVSCodeMessage({
      command: "translate",
      key: path,
      text: sourceText,
      sourceLanguage: sourceLanguage,
      targetLanguages: targetLanguages,
    });
  };

  return (
    <button
      className="json-table__translate-btn"
      onClick={handleTranslate}
      title={`Translate to ${targetLanguages.join(", ")}`}
    >
      <TranslateIcon size={10} />
    </button>
  );
};
