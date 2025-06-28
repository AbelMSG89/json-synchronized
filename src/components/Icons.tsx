import React from "react";
import {
  Plus,
  X,
  Check,
  Edit3,
  Trash2,
  Folder,
  FolderOpen,
  FileText,
} from "lucide-react";

interface IconProps {
  size?: number;
  className?: string;
}

export const PlusIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <Plus size={size} className={className} />
);

export const CloseIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <X size={size} className={className} />
);

export const CheckIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <Check size={size} className={className} />
);

export const EditIcon: React.FC<IconProps> = ({ size = 12, className }) => (
  <Edit3 size={size} className={className} />
);

export const DeleteIcon: React.FC<IconProps> = ({ size = 12, className }) => (
  <Trash2 size={size} className={className} />
);

export const FolderIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <Folder size={size} className={className} />
);

export const FolderOpenIcon: React.FC<IconProps> = ({
  size = 16,
  className,
}) => <FolderOpen size={size} className={className} />;

export const FileIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <FileText size={size} className={className} />
);
