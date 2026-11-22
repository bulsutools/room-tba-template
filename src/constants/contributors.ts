// Campus editors credited manually. GitHub developers load from /api/github/contributors.

import type { ContributorInfo } from "@lib/types";

/** Optional display overrides keyed by GitHub login. */
export const githubProfileOverrides: Record<
  string,
  { name?: string; href?: string }
> = {};

/** Design credits for people who did not appear in GitHub commit history. */
export const designers: ContributorInfo[] = [];

export const contributors: ContributorInfo[] = [];
