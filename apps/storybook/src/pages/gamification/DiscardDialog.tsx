import { FinDialog } from '@finspace-loyalty/ui';

/**
 * Cancel, Esc or a scrim click on a side sheet with changes asks first (decided 28 Oct 2026, as Add reward): Keep
 * editing, or Discard (the destructive Primary).
 */
export function DiscardDialog({ open, editing, item, onKeep, onDiscard }: { open: boolean; editing: boolean; item: string; onKeep: () => void; onDiscard: () => void }) {
  return (
    <FinDialog
      open={open}
      onClose={onKeep}
      title={editing ? 'Discard your changes?' : `Discard this ${item}?`}
      secondaryButton={{ label: 'Keep editing', onClick: onKeep }}
      primaryButton={{ label: 'Discard', tone: 'destructive', onClick: onDiscard }}
    >
      {editing ? `Your changes to this ${item} will be lost.` : 'What you’ve entered will be lost.'}
    </FinDialog>
  );
}
