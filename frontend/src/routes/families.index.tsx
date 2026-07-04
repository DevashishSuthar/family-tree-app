import { createFileRoute } from '@tanstack/react-router';
import { FamilyList } from '../screens/Family/FamilyList';

export const Route = createFileRoute('/families/')({
  component: FamilyList,
});
