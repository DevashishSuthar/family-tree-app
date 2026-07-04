import React, { useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import type { ColumnDef } from '@tanstack/react-table';
import { Plus, Users, Trees, Venus, Mars } from 'lucide-react';

import { useGetAllFamilies, useDeleteFamily, type Family } from '../../services/FamilyService';
import { DataTable } from '../../components/DataTable';
import { Button } from '../../components/Button';
import { StatCard } from '../../components/StatCard';
import { DonutChart } from '../../components/DonutChart';
import { SearchInput } from '../../components/SearchInput';
import { CreateFamilyDialog } from '../../components/Family/CreateFamilyDialog';
import { DeleteConfirmationDialog } from '../../components/Dialog/DeleteConfirmationDialog';

export const FamilyList: React.FC = () => {
  const navigate = useNavigate();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState<Family | null>(null);
  const [search, setSearch] = useState('');

  const { data: families = [], isLoading } = useGetAllFamilies();
  const deleteFamily = useDeleteFamily();

  const filteredFamilies = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return families;
    return families.filter(
      (family) =>
        family.familyName.toLowerCase().includes(query) ||
        family.familyHeadPersonName.toLowerCase().includes(query)
    );
  }, [families, search]);

  const stats = useMemo(() => {
    const totalMembers = families.reduce((sum, family) => sum + family.totalMembers, 0);
    const maleHeads = families.filter((family) => family.gender === 'MALE').length;
    const femaleHeads = families.filter((family) => family.gender === 'FEMALE').length;
    return { totalMembers, maleHeads, femaleHeads };
  }, [families]);  

  const handleViewMembers = (familyId: string) => {
    navigate({ to: '/families/$familyId/members', params: { familyId } });
  };

  const handleDeleteClick = (family: Family) => {
    setSelectedFamily(family);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedFamily) {
      await deleteFamily.mutateAsync(selectedFamily._id);
      setIsDeleteDialogOpen(false);
      setSelectedFamily(null);
    }
  };

  const columns: ColumnDef<Family>[] = [
    {
      accessorKey: '_id',
      header: 'ID',
      cell: ({ row }) => (
        <button
          onClick={() => handleViewMembers(row.original._id)}
          className="text-blue-600 hover:text-blue-800 underline"
        >
          {row.original._id}
        </button>
      ),
    },
    {
      accessorKey: 'familyName',
      header: 'Family Name',
    },
    {
      accessorKey: 'familyHeadPersonName',
      header: 'Head of Family',
    },
    {
      accessorKey: 'gender',
      header: 'Gender',
      cell: ({ row }) => (
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
            row.original.gender === 'MALE'
              ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-400'
              : 'bg-pink-50 text-pink-700 dark:bg-pink-950/50 dark:text-pink-400'
          }`}
        >
          {row.original.gender === 'MALE' ? <Mars className="h-3 w-3" /> : <Venus className="h-3 w-3" />}
          {row.original.gender}
        </span>
      ),
    },
    {
      accessorKey: 'totalMembers',
      header: 'Total Members',
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleViewMembers(row.original._id)}>
            View Tree
          </Button>
          <Button variant="danger" size="sm" onClick={() => handleDeleteClick(row.original)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
            Families
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Browse every registered family and explore their member trees.
          </p>
        </div>
        <Button variant="primary" onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          Create Family
        </Button>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Families" value={families.length} icon={Trees} accent="brand" />
        <StatCard label="Total Members" value={stats.totalMembers} icon={Users} accent="sky" />
        <div className="flex items-center rounded-2xl border border-slate-200 bg-white p-4
          shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <DonutChart
            segments={[
              { label: 'Male heads', value: stats.maleHeads, colorClassName: 'stroke-sky-500' },
              { label: 'Female heads', value: stats.femaleHeads, colorClassName: 'stroke-pink-500' },
            ]}
          />
        </div>
      </div>

      <div className="mb-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by family name or head of family…"
          className="max-w-sm"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm
        dark:border-slate-800 dark:bg-slate-900">
        <DataTable
          data={filteredFamilies}
          columns={columns}
          isLoading={isLoading}
          emptyMessage={search ? 'No families match your search' : 'No families yet — create the first one'}
        />
      </div>

      <CreateFamilyDialog open={isCreateDialogOpen} onClose={() => setIsCreateDialogOpen(false)} />

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Family"
        message={`Are you sure you want to delete "${selectedFamily?.familyName}"? This cannot be undone.`}
        isLoading={deleteFamily.isPending}
      />
    </div>
  );
//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-6xl mx-auto">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-3xl font-bold text-gray-900">Families</h1>
//           <Button variant="primary" onClick={() => setIsCreateDialogOpen(true)}>
//             Create Family
//           </Button>
//         </div>

//         <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//           <DataTable data={families} columns={columns} isLoading={isLoading} />
//         </div>

//         <CreateFamilyDialog
//           open={isCreateDialogOpen}
//           onClose={() => setIsCreateDialogOpen(false)}
//         />

//         <DeleteConfirmationDialog
//           open={isDeleteDialogOpen}
//           onClose={() => setIsDeleteDialogOpen(false)}
//           onConfirm={handleConfirmDelete}
//           title="Delete Family"
//           message={`Are you sure you want to delete "${selectedFamily?.familyName}"?`}
//           isLoading={deleteFamily.isPending}
//         />
//       </div>
//     </div>
//   );
};
