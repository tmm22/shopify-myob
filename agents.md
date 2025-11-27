# Agents

This document describes the AI assistance used in developing this project.

## Development Assistant

**Agent:** Droid (Claude) by Factory.ai

**Role:** Software Engineering Assistant

**Contributions:**
- Initial code debugging and troubleshooting
- Implementation of Shopify JSON API data fetching
- MYOB form auto-fill functionality with React-compatible input handling
- Australian state name to abbreviation mapping
- MutationObserver for dialog detection
- Code review and quality improvements

## Code Review Process

The codebase underwent multiple rounds of AI-assisted code review:

1. **First Review (v3.0):**
   - Removed unused variables
   - Renamed storage key for clarity
   - Added error handling for JSON parsing
   - Extracted timing constants to configuration
   - Added DEBUG flag with conditional logging
   - Fixed alert formatting
   - Added button hover effects
   - Added @updateURL and @downloadURL metadata

2. **Second Review:**
   - Added validation for required address properties
   - Added null safety for name splitting
   - Added fallback empty strings for all address fields
   - Fixed inconsistent logging in setInput function

## AI-Assisted Features

| Feature | Description |
|---------|-------------|
| React Input Handling | Native value setter approach to work with React controlled inputs |
| Combobox Selection | Simulated keyboard events (ArrowDown + Enter) for dropdown selection |
| Sequential Field Filling | Timed delays to prevent React state overwrites |
| State Abbreviation | Automatic conversion of Australian state names to abbreviations |

## Collaboration Model

- Human: Requirements, testing, feedback, final verification
- AI: Implementation, debugging, code review, documentation
