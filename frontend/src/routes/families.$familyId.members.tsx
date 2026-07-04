import { createFileRoute } from '@tanstack/react-router';
import { MembersList } from '../screens/Family/MembersList';

export const Route = createFileRoute('/families/$familyId/members')({
  component: MembersList,
});
