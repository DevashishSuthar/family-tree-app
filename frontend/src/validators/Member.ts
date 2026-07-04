import { z } from 'zod';
import { ALLOWED_IMAGE_EXTENSIONS } from '../constants/FileExtensions';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

const getExtension = (fileName: string) => fileName.split('.').pop()?.toLowerCase() ?? '';

export const createMemberSchema = z.object({
  name: z.string().min(1, 'Member name is required'),
  gender: z.enum(['MALE', 'FEMALE'], 'Please select a gender'),
  parentMemberRef: z.string().optional(),
  // Native <input type="file"> registered via react-hook-form yields a FileList.
  profilePhoto: z
    .instanceof(FileList)
    .optional()
    .refine(
      (files) => !files?.length || ALLOWED_IMAGE_EXTENSIONS.includes(getExtension(files[0].name)),
      'Please upload a valid image file (jpg, jpeg, png, gif or webp)'
    )
    .refine(
      (files) => !files?.length || files[0].size <= MAX_FILE_SIZE_BYTES,
      'Image must be smaller than 5MB'
    ),
});

export type CreateMemberFormData = z.infer<typeof createMemberSchema>;
