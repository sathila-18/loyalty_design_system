import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FinFileUpload } from './FinFileUpload';
import { formatFileSize } from './fileSize';

const png = (name = 'logo.png', bytes = 1024) => new File([new Uint8Array(bytes)], name, { type: 'image/png' });
const input = (container: HTMLElement) => container.querySelector<HTMLInputElement>('input[type="file"]')!;

describe('FinFileUpload', () => {
  it('is a group named by its title, with Upload described by the text', () => {
    render(<FinFileUpload heading="Upload badge icon" description="(JPEG, PNG)" />);
    const group = screen.getByRole('group', { name: /Upload badge icon/ });
    expect(group).toHaveAttribute('data-state', 'enabled');
    expect(screen.getByRole('heading', { name: 'Upload badge icon', level: 3 })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Upload' })).toHaveAccessibleDescription(/Upload badge icon\s*\(JPEG, PNG\)/);
  });

  it('opens the file picker with Upload and hands over a file that passes', async () => {
    const onFileSelect = vi.fn();
    const { container } = render(<FinFileUpload heading="Upload" accept=".png,.jpg" maxSize={5 * 1024 * 1024} onFileSelect={onFileSelect} />);
    const click = vi.spyOn(input(container), 'click');
    await userEvent.click(screen.getByRole('button', { name: 'Upload' }));
    expect(click).toHaveBeenCalledOnce();
    await userEvent.upload(input(container), png());
    expect(onFileSelect).toHaveBeenCalledWith(expect.objectContaining({ name: 'logo.png' }));
  });

  it('refuses a file of another type or over the size, saying why', () => {
    const onFileSelect = vi.fn();
    const onFileReject = vi.fn();
    const { container } = render(<FinFileUpload heading="Upload" accept="image/png,image/jpeg" maxSize={5 * 1024 * 1024} onFileSelect={onFileSelect} onFileReject={onFileReject} />);
    fireEvent.change(input(container), { target: { files: [new File(['x'], 'notes.pdf', { type: 'application/pdf' })] } });
    expect(onFileReject).toHaveBeenLastCalledWith('This file type isn’t accepted', expect.any(File));
    fireEvent.change(input(container), { target: { files: [png('big.png', 6 * 1024 * 1024)] } });
    expect(onFileReject).toHaveBeenLastCalledWith('This file is larger than 5 MB', expect.any(File));
    expect(onFileSelect).not.toHaveBeenCalled();
  });

  it('takes a dropped file and shows the drag look while one is over it', () => {
    const onFileSelect = vi.fn();
    render(<FinFileUpload heading="Upload" onFileSelect={onFileSelect} />);
    const group = screen.getByRole('group');
    const dataTransfer = { files: [png()], dropEffect: 'none' };
    fireEvent.dragOver(group, { dataTransfer });
    expect(group).toHaveAttribute('data-dragging');
    fireEvent.drop(group, { dataTransfer });
    expect(group).not.toHaveAttribute('data-dragging');
    expect(onFileSelect).toHaveBeenCalledOnce();
  });

  it('shows each state: uploading with progress and Cancel, complete with Delete, error with Upload', async () => {
    const onCancel = vi.fn();
    const onDelete = vi.fn();
    const { rerender } = render(<FinFileUpload heading="Upload badge icon" state="uploading" progress={40} onCancel={onCancel} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '40');
    expect(screen.getByRole('heading', { name: 'Uploading…' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalledOnce();

    rerender(<FinFileUpload heading="Upload badge icon" state="complete" fileName="logo.png" onDelete={onDelete} />);
    expect(screen.getByRole('heading', { name: 'logo.png' })).toBeInTheDocument();
    expect(screen.queryByRole('progressbar')).toBeNull();
    const del = screen.getByRole('button', { name: 'Delete' });
    expect(del).toHaveAttribute('data-content-tone', 'error');
    await userEvent.click(del);
    expect(onDelete).toHaveBeenCalledOnce();

    rerender(<FinFileUpload heading="Upload badge icon" state="error" errorMessage="This file is larger than 5 MB" />);
    expect(screen.getByRole('heading', { name: 'This file is larger than 5 MB' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Upload' })).toBeInTheDocument();
  });

  it('takes nothing while uploading or disabled', () => {
    const onFileSelect = vi.fn();
    const { rerender } = render(<FinFileUpload heading="Upload" state="uploading" onFileSelect={onFileSelect} />);
    fireEvent.drop(screen.getByRole('group'), { dataTransfer: { files: [png()] } });
    rerender(<FinFileUpload heading="Upload" disabled onFileSelect={onFileSelect} />);
    fireEvent.drop(screen.getByRole('group'), { dataTransfer: { files: [png()] } });
    expect(screen.queryByRole('button')).toBeNull();
    expect(onFileSelect).not.toHaveBeenCalled();
  });

  it('formats file sizes', () => {
    expect(formatFileSize(5 * 1024 * 1024)).toBe('5 MB');
    expect(formatFileSize(1.5 * 1024 * 1024)).toBe('1.5 MB');
    expect(formatFileSize(500 * 1024)).toBe('500 KB');
    expect(formatFileSize(120)).toBe('120 bytes');
  });
});
