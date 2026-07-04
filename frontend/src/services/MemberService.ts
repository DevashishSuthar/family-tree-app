import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { toast } from 'sonner';
import axiosInstance from '../configs/Axios';
import { FAMILY_ENDPOINTS, MEMBER_ENDPOINTS } from '../constants/ApiEndpoints';

export interface Member {
  _id: string;
  name: string;
  gender: 'MALE' | 'FEMALE';
  familyRef: string;
  parentMemberRef?: {
    _id: string;
    name: string;
  };
  profilePhoto?: string;
}

export interface CreateMemberPayload {
  name: string;
  gender: 'MALE' | 'FEMALE';
  familyRef: string;
  parentMemberRef?: string;
  /** A single selected image file, taken from a file-input FileList. */
  profilePhoto?: File;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Query hooks
export const useGetMembersOfFamily = (familyId: string) => {
  return useQuery({
    queryKey: ['members', familyId],
    queryFn: async () => {
      const response = await axiosInstance.get<ApiResponse<{ members: Member[] }>>(
        FAMILY_ENDPOINTS.getMembersOfFamily(familyId)
      );
      return response.data.data.members;
    },
    enabled: !!familyId,
  });
};

// Mutation hooks
export const useCreateMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateMemberPayload) => {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('gender', data.gender);
      formData.append('familyRef', data.familyRef);
      if (data.parentMemberRef) {
        formData.append('parentMemberRef', data.parentMemberRef);
      }
      if (data.profilePhoto) {
        formData.append('img', data.profilePhoto);
      }

      const response = await axiosInstance.post<ApiResponse<{ member: Member }>>(
        MEMBER_ENDPOINTS.createMember,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['members', variables.familyRef] });
      queryClient.invalidateQueries({ queryKey: ['families'] });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message || 'Failed to create member';
      toast.error(message);
    },
  });
};
