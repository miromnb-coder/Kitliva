# AI Listing Assistant v1 Pixel Spec

## Goal

AI Listing Assistant v1 helps sellers create clearer and more trustworthy listings without changing anything automatically. The seller must review and apply every suggestion manually.

## Placement

### Details step

Place the AI card above the Details fields.

- Card background: `colors.surface`
- Border: `colors.border`
- Radius: 18px
- Padding: 14px
- Icon circle: 36x36px, `colors.softGreen`
- Icon: `sparkles-outline`, `colors.primary`
- Title: `AI Listing Assistant`
- Text: `Get help writing a clearer listing.`
- Button: `Improve`

### Pricing step

Place the same AI card above the Pricing fields.

- Text: `Get a careful starting price suggestion.`
- Button: `Suggest`

## Bottom sheet

Use the reusable component:

`src/components/sheets/KitlivaBottomSheet.tsx`

No custom bottom sheet implementation.

- Snap point: 78%
- Backdrop opacity: 0.28
- Title: `AI Listing Assistant`
- Subtitle: `Review every suggestion before applying it. AI will not publish or change anything automatically.`

## Sheet content

### Loading state

- Card with `ActivityIndicator`
- Text: `Creating suggestions...`

### Mock notice

Shown when AI suggestions are generated locally or the Edge Function has no AI key.

- Background: `colors.softGreen`
- Border: `colors.successBorder`
- Text: `Mock suggestions are shown until the Edge Function has an AI key configured.`

### Suggestion rows

Each suggestion is shown in a bordered card row.

Rows:

1. Suggested title
2. Category
3. Condition
4. Suggested description
5. Price guidance

Each row has an explicit apply action:

- `Apply`
- `Replace`
- `Use mid`

## Safety rules

- AI never publishes a listing.
- AI never changes the form automatically.
- AI should not invent details.
- AI suggestions must be reviewed before publishing.
- Pricing should be described as guidance, not guaranteed market value.

## V1 scope

Included:

- Text-based assistant
- Details suggestions
- Pricing suggestion
- Missing details
- Safety notes
- Mock fallback
- Supabase Edge Function

Not included:

- Image recognition
- Market data comparison
- Automatic category from image
- Draft saving
- AI moderation
- Payments
