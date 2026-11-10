import { FinIcon, FinLogo } from '@finspace-loyalty/ui';
import type { Brand } from '@/lib/brand';

/*
 * The logo (Figma `Logo sizes`, "Company Name"): Sampath's own logo (Small; White in Dark), else the placeholder the
 * side nav uses (DESIGN.md §9.83, §10 #111): the `image` icon in the brand colour and "Fintech loyalty".
 */
export function AppLogo({ brand }: { brand: Brand }) {
  if (brand === 'sampath') return <FinLogo brand="sampath" />;
  return (
    <span className="flex min-w-0 items-center gap-l">
      <span className="flex size-40 flex-none items-center justify-center">
        <FinIcon name="image" size={36} color="brand" />
      </span>
      <span className="truncate font-title-medium text-primary">Fintech loyalty</span>
    </span>
  );
}
