# Issue test matrix

Generated audit of GitHub issues vs the testing pyramid. This template ships without upstream issue history; regenerate on your fork:

```sh
gh issue list --repo YOUR_ORG/room-tba --state all --limit 500 \
  --json number,title,labels,state,body > /tmp/all-issues.json
bun run scripts/generate-issue-test-matrix.ts /tmp/all-issues.json
```

See docs/testing.md for the pyramid tiers.
