import { z } from 'zod';

export const createFamilySchema = z.object({
  familyName: z.string().min(1, 'Family name is required'),
  familyHeadPersonName: z.string().min(1, 'Family head person name is required'),
  gender: z.enum(['MALE', 'FEMALE'], 'Please select a gender'),
});

export type CreateFamilyFormData = z.infer<typeof createFamilySchema>;