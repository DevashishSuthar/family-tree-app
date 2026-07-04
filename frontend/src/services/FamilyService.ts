import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { toast } from 'sonner';
import axiosInstance from '../configs/Axios';
import { FAMILY_ENDPOINTS } from '../constants/ApiEndpoints';

export interface Family {
  _id: string;
  familyName: string;
  familyHeadPersonName: string;
  gender: 'MALE' | 'FEMALE';
  totalMembers: number;
}

export interface CreateFamilyPayload {
  familyName: string;
  familyHeadPersonName: string;
  gender: 'MALE' | 'FEMALE';
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Query hooks
export const useGetAllFamilies = () => {
  return useQuery({
    queryKey: ['families'],
    queryFn: async () => {
      const response = await axiosInstance.get<ApiResponse<{ families: Family[] }>>(
        FAMILY_ENDPOINTS.getAllFamilies
      );
      return response.data.data.families;
    },
  });
};

export const useGetFamily = (familyId: string) => {
  return useQuery({
    queryKey: ['family', familyId],
    queryFn: async () => {
      const response = await axiosInstance.get<ApiResponse<{ family: Family }>>(
        FAMILY_ENDPOINTS.getFamily(familyId)
      );
      return response.data.data.family;
    },
    enabled: !!familyId,
  });
};

// Mutation hooks
export const useCreateFamily = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateFamilyPayload) => {
      const response = await axiosInstance.post<ApiResponse<{ family: Family }>>(
        FAMILY_ENDPOINTS.createFamily,
        data
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['families'] });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message || 'Failed to create family';
      toast.error(message);
    },
  });
};

export const useDeleteFamily = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (familyId: string) => {
      const response = await axiosInstance.delete<ApiResponse<Record<string, never>>>(
        FAMILY_ENDPOINTS.deleteFamily(familyId)
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['families'] });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message || 'Failed to delete family';
      toast.error(message);
    },
  });
};
