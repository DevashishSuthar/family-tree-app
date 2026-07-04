import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFamilySchema, type CreateFamilyFormData } from '../../validators/Family';
import { useCreateFamily } from '../../services/FamilyService';
import { Dialog } from '../Dialog';
import { Input } from '../Input';
import { Select } from '../Select';
import { Button } from '../Button';

interface CreateFamilyDialogProps {
  open: boolean;
  onClose: () => void;
}

export const CreateFamilyDialog: React.FC<CreateFamilyDialogProps> = ({ open, onClose }) => {
  const createFamily = useCreateFamily();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateFamilyFormData>({
    resolver: zodResolver(createFamilySchema),
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: CreateFamilyFormData) => {
    await createFamily.mutateAsync(data);
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Create Family"
      actions={
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" isLoading={createFamily.isPending} onClick={handleSubmit(onSubmit)}>
            Create
          </Button>
        </div>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Family Name"
          placeholder="Enter family name"
          {...register('familyName')}
          error={errors.familyName?.message}
        />

        <Input
          label="Family Head Person Name"
          placeholder="Enter family head name"
          {...register('familyHeadPersonName')}
          error={errors.familyHeadPersonName?.message}
        />

        <Select
          label="Gender"
          options={[
            { value: 'MALE', label: 'Male' },
            { value: 'FEMALE', label: 'Female' },
          ]}
          {...register('gender')}
          error={errors.gender?.message}
        />
      </form>
    </Dialog>
  );
};
