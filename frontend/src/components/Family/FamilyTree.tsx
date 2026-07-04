import React, { useMemo, useRef, useState } from 'react';
import { Plus, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { Avatar } from '../Avatar';
import type { Member } from '../../services/MemberService';
import { VITE_REACT_APP_BASE_URL } from '../../configs/Env';

interface MemberWithChildren extends Member {
  children: MemberWithChildren[];
}

const buildTree = (members: Member[], parentId: string | null = null): MemberWithChildren[] => {
  return members
    .filter((member) => (member.parentMemberRef?._id ?? null) === parentId)
    .map((member) => ({ ...member, children: buildTree(members, member._id) }));
};

const resolvePhotoUrl = (profilePhoto?: string) =>
  profilePhoto ? `${VITE_REACT_APP_BASE_URL}/${profilePhoto}` : undefined;

interface FamilyTreeProps {
  members: Member[];
  searchQuery: string;
  onAddChild: (member: Member) => void;
}

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 1.75;

export const FamilyTree: React.FC<FamilyTreeProps> = ({ members, searchQuery, onAddChild }) => {
  const tree = useMemo(() => buildTree(members), [members]);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragState = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    dragState.current = {
      startX: event.clientX,
      startY: event.clientY,
      originX: pan.x,
      originY: pan.y,
    };
    setIsDragging(true);
    (event.target as HTMLElement).setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current) return;
    const dx = event.clientX - dragState.current.startX;
    const dy = event.clientY - dragState.current.startY;
    setPan({ x: dragState.current.originX + dx, y: dragState.current.originY + dy });
  };

  const handlePointerUp = () => {
    dragState.current = null;
    setIsDragging(false);
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const matchesSearch = (name: string) =>
    searchQuery.trim().length > 0 && name.toLowerCase().includes(searchQuery.trim().toLowerCase());

  const renderNode = (member: MemberWithChildren) => {
    const highlighted = matchesSearch(member.name);
    return (
      <div className="tree-node" key={member._id}>
        <button
          onClick={() => onAddChild(member)}
          title="Click to add a child member"
          className={`group flex w-44 flex-col items-center gap-2 rounded-xl border bg-white px-3 py-3
            text-center shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg
            dark:bg-slate-900
            ${
              highlighted
                ? 'border-amber-400 ring-2 ring-amber-300/60 dark:border-amber-500'
                : 'border-slate-200 dark:border-slate-700'
            }`}
        >
          <Avatar name={member.name} src={resolvePhotoUrl(member.profilePhoto)} gender={member.gender} size={48} />
          <span className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100 max-w-full">
            {member.name}
          </span>
          <span className="flex items-center gap-1 text-xs font-medium text-brand-600 opacity-0
            transition-opacity group-hover:opacity-100 dark:text-brand-400">
            <Plus className="h-3 w-3" /> Add child
          </span>
        </button>

        {member.children.length > 0 && (
          <div className="tree-children">
            <div className="tree-row gap-6">
              {member.children.map((child) => renderNode(child))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative">
      <div className="absolute right-3 top-3 z-10 flex gap-1 rounded-lg border border-slate-200 bg-white/90
        p-1 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/90">
        <button
          onClick={() => setZoom((z) => Math.max(MIN_ZOOM, +(z - 0.15).toFixed(2)))}
          className="rounded p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Zoom out"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <button
          onClick={() => setZoom((z) => Math.min(MAX_ZOOM, +(z + 0.15).toFixed(2)))}
          className="rounded p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Zoom in"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <button
          onClick={resetView}
          className="rounded p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset view"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>

      <div
        className={`overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/60 dark:border-slate-800
          dark:bg-slate-900/40 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{ height: 480, touchAction: 'none' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <div
          className="flex h-full w-full items-start justify-center"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'top center',
            transition: isDragging ? 'none' : 'transform 0.15s ease-out',
            padding: '3rem 2rem',
          }}
        >
          <div className="tree-row gap-8">{tree.map((rootMember) => renderNode(rootMember))}</div>
        </div>
      </div>
      <p className="mt-2 text-center text-xs text-slate-400 dark:text-slate-500">
        Drag to pan · Use the controls to zoom · Click any member to add their child
      </p>
    </div>
  );
};
