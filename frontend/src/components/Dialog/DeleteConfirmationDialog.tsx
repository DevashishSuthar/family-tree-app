import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Dialog } from '../Dialog';
import { Button } from '../Button';

interface DeleteConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  message?: string;
  isLoading?: boolean;
}

export const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title = 'Confirm Delete',
  message = 'Are you sure you want to delete this item?',
  isLoading = false,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      actions={
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} isLoading={isLoading}>
            Delete
          </Button>
        </div>
      }
    >
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full
          bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400">
          <AlertTriangle className="h-5 w-5" />
        </span>
        <p className="text-sm text-slate-600 dark:text-slate-300">{message}</p>
      </div>
    </Dialog>
  );
};
