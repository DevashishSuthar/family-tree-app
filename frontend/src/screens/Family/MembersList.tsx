import React, { useCallback, useMemo, useState } from 'react';
import { Link, useParams } from '@tanstack/react-router';
import { ArrowLeft, Plus, Users } from 'lucide-react';

import { useGetMembersOfFamily, type Member } from '../../services/MemberService';
import { FamilyTree } from '../../components/Family/FamilyTree';
import { CreateMemberDialog } from '../../components/Family/CreateMemberDialog';
import { SearchInput } from '../../components/SearchInput';
import { Button } from '../../components/Button';

export const MembersList: React.FC = () => {
  const { familyId } = useParams({ from: '/families/$familyId/members' });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [search, setSearch] = useState('');

  const { data: members = [], isLoading } = useGetMembersOfFamily(familyId);

  const matchCount = useMemo(() => {
    if (!search.trim()) return null;
    const query = search.trim().toLowerCase();
    return members.filter((member) => member.name.toLowerCase().includes(query)).length;
  }, [members, search]);

  const openAddDialog = useCallback((member: Member | null) => {
    setSelectedMember(member);
    setIsCreateDialogOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setIsCreateDialogOpen(false);
    setSelectedMember(null);
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Link
        to="/families"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500
          hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Families
      </Link>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
            Family Tree
          </h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
            <Users className="h-4 w-4" />
            {members.length} {members.length === 1 ? 'member' : 'members'}
          </p>
        </div>
        <Button variant="primary" onClick={() => openAddDialog(null)}>
          <Plus className="h-4 w-4" />
          Add Member
        </Button>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search members by name…"
          className="max-w-sm"
        />
        {matchCount !== null && (
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {matchCount} match{matchCount === 1 ? '' : 'es'}
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="flex h-96 items-center justify-center rounded-2xl border border-slate-200
          bg-white text-slate-400 dark:border-slate-800 dark:bg-slate-900">
          Loading family tree…
        </div>
      ) : members.length === 0 ? (
        <div className="flex h-96 flex-col items-center justify-center gap-3 rounded-2xl border
          border-dashed border-slate-300 bg-white text-center dark:border-slate-700 dark:bg-slate-900">
          <Users className="h-8 w-8 text-slate-300 dark:text-slate-600" />
          <p className="text-slate-500 dark:text-slate-400">No members yet for this family.</p>
          <Button variant="outline" size="sm" onClick={() => openAddDialog(null)}>
            <Plus className="h-4 w-4" />
            Add the first member
          </Button>
        </div>
      ) : (
        <FamilyTree members={members} searchQuery={search} onAddChild={openAddDialog} />
      )}

      <CreateMemberDialog
        open={isCreateDialogOpen}
        onClose={closeDialog}
        familyId={familyId}
        parentMemberId={selectedMember?._id}
        parentMemberName={selectedMember?.name}
      />
    </div>
  );
};