// Types for what packages/ui/test imports from eslint.config.js (the focus-ring check shared with the lint rule).
import type { Linter } from 'eslint';

export function outlineConflict(text: string): boolean;

declare const config: Linter.Config[];
export default config;
