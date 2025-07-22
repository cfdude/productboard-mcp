- Always use claude-code for bash commands

# Critical Manifest & CI Lessons (From PR #8 Hell)

## The Problem We Solved

The most brutal issue was manifest formatting: CI expected single-line arrays `["item1", "item2"]` but Prettier kept reformatting to multiline arrays, causing infinite lint failures.

## Prevention Checklist - ALWAYS DO THIS FIRST:

1. **Check CI Formatting Expectations**

   ```bash
   # Before making ANY changes, run this to see what CI expects
   npm run generate-manifest
   git diff generated/manifest.json

   # If you see differences, the CI expects a different format than what's generated
   ```

2. **Understand the Pre-commit Pipeline**
   - Scripts run in this order: lint-staged → prettier → tests → git commit
   - Prettier can UNDO your fixes if not properly configured
   - Check `.prettierignore` - generated files should usually be excluded

3. **Generated Files Strategy**

   ```bash
   # ALWAYS check if generated files are in .prettierignore
   cat .prettierignore | grep generated

   # If not, ADD THEM before making changes:
   echo "generated/" >> .prettierignore
   echo "generated/manifest.json" >> .prettierignore
   ```

4. **Manifest Generation Fix Pattern**
   - The regex in `generate-manifest.ts` converts multiline arrays to single-line
   - But Prettier can reformat them back if not ignored
   - Solution: Update generation script AND exclude from Prettier

## Emergency Debugging Commands

```bash
# See exactly what CI is comparing
npm run generate-manifest
git diff generated/manifest.json

# Check current pre-commit hooks
cat package.json | jq '.["lint-staged"]'

# Run exact CI commands locally
npm run lint
npm test
npm run generate-manifest
```

## Key Insight: The Three-Layer Problem

1. **Generation Layer**: Script generates correct format
2. **Formatting Layer**: Prettier reformats it (if not ignored)
3. **CI Layer**: Compares result against its own generation

All three must align or you get infinite loops.

## Future Manifest Changes

- NEVER modify manifest.json directly
- ALWAYS use `npm run generate-manifest`
- ALWAYS check `.prettierignore` first
- ALWAYS test the full pipeline before committing
