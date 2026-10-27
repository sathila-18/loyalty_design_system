import { useEffect, useRef, useState } from 'react';

/**
 * How a page's fake API behaves (Pages/Common states, DESIGN.md §8.6). Every list page takes it; leave it out and
 * everything works at once, as in the page's own stories.
 */
export interface PageApi {
  /** Loading the list: `ready` (default, at once), `loading` (never finishes) or `fail` (fails; Try again loads it). */
  load?: 'ready' | 'loading' | 'fail';
  /** Saving in the add or edit sheet: `ok` (default) or `fail` (the first Save fails; the next one works). */
  save?: 'ok' | 'fail';
  /** Removing: `ok` (default) or `fail` (the first Remove fails; Try again works). */
  remove?: 'ok' | 'fail';
  /** The connection (default on). Off shows the network or server error and stops changes until it's back. */
  online?: boolean;
}

export type PageLoadStatus = 'loading' | 'error' | 'ready';

/** A snackbar on a page: a success, or an error that can offer Try again. */
export interface PageNotice {
  id: number;
  text: string;
  tone: 'success' | 'error';
  action?: { label: string; onClick: () => void };
}

/** How long Try again takes to load the list. */
export const RETRY_MS = 1200;

/** The list's load: its status, and Try again (loading, then the rows). */
export function usePageLoad(load: PageApi['load'] = 'ready') {
  const [status, setStatus] = useState<PageLoadStatus>(load === 'ready' ? 'ready' : load === 'loading' ? 'loading' : 'error');
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const retry = () => {
    setStatus('loading');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus('ready'), RETRY_MS);
  };
  return { status, retry };
}

/** A call to the fake API: with `fail`, the first call fails (returns false) and the next ones work. */
export function useFlakyCall(mode: 'ok' | 'fail' = 'ok') {
  const failed = useRef(false);
  return () => {
    if (mode === 'fail' && !failed.current) {
      failed.current = true;
      return false;
    }
    return true;
  };
}

/** Calls `onBack` when the connection comes back (online turns from off to on). */
export function useBackOnline(online: boolean, onBack: () => void) {
  const was = useRef(online);
  const callback = useRef(onBack);
  useEffect(() => {
    callback.current = onBack;
  });
  useEffect(() => {
    if (online && !was.current) callback.current();
    was.current = online;
  }, [online]);
}

/** The page's snackbars: the list, `notify` to add one and `dismiss` to take one away. */
export function usePageNotices() {
  const [notices, setNotices] = useState<PageNotice[]>([]);
  const notify = (notice: Omit<PageNotice, 'id'>) =>
    setNotices((current) => [...current, { ...notice, id: Math.max(0, ...current.map((n) => n.id)) + 1 }]);
  const dismiss = (id: number) => setNotices((current) => current.filter((n) => n.id !== id));
  return { notices, notify, dismiss };
}
