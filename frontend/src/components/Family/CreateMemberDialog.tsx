import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImagePlus } from 'lucide-react';
import { createMemberSchema, type CreateMemberFormData } from '../../validators/Member';
import { useCreateMember } from '../../services/MemberService';
import { Dialog } from '../Dialog';
import { Input } from '../Input';
import { Select } from '../Select';
import { Button } from '../Button';

interface CreateMemberDialogProps {
  open: boolean;
  onClose: () => void;
  familyId: string;
  parentMemberId?: string;
  parentMemberName?: string;
}

export const CreateMemberDialog: React.FC<CreateMemberDialogProps> = ({
  open,
  onClose,
  familyId,
  parentMemberId,
  parentMemberName,
}) => {
  const createMember = useCreateMember();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<CreateMemberFormData>({
    resolver: zodResolver(createMemberSchema),
  });

  const profilePhotoFiles = watch('profilePhoto');

  useEffect(() => {
    const file = profilePhotoFiles?.[0];
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [profilePhotoFiles]);

  const handleClose = () => {
    reset();
    setPreviewUrl(null);
    onClose();
  };

  const onSubmit = async (data: CreateMemberFormData) => {
    await createMember.mutateAsync({
      name: data.name,
      gender: data.gender,
      familyRef: familyId,
      parentMemberRef: parentMemberId,
      profilePhoto: data.profilePhoto?.[0],
    });
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title={parentMemberId ? `Add Child of ${parentMemberName ?? 'Member'}` : 'Add Family Member'}
      actions={
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" isLoading={createMember.isPending} onClick={handleSubmit(onSubmit)}>
            Add Member
          </Button>
        </div>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col items-center gap-2">
          <label
            htmlFor="profilePhoto"
            className="flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden
              rounded-full border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400
              transition-colors hover:border-brand-400 hover:text-brand-500
              dark:border-slate-700 dark:bg-slate-800"
          >
            {previewUrl ? (
              <img src={previewUrl} alt="Selected preview" className="h-full w-full object-cover" />
            ) : (
              <ImagePlus className="h-7 w-7" />
            )}
          </label>
          <input
            id="profilePhoto"
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
            className="sr-only"
            {...register('profilePhoto')}
          />
          {errors.profilePhoto && (
            <span className="text-xs font-medium text-red-600 dark:text-red-400">
              {errors.profilePhoto.message}
            </span>
          )}
        </div>

        <Input
          label="Member Name"
          placeholder="Enter member name"
          {...register('name')}
          error={errors.name?.message}
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
