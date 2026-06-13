# Kitliva i18n migration guide

## Structure

Translations live in:

```txt
src/i18n/locales/en.json
src/i18n/locales/fi.json
```

The provider and hook live in:

```txt
src/i18n/index.tsx
```

Use translations in components like this:

```tsx
import { useI18n } from "@/i18n";

const { t } = useI18n();

<Text>{t("explore.title")}</Text>
```

## Current scope

The first completed localization pass covers:

- i18n provider
- English and Finnish locale files
- phone language detection with English fallback
- saved user language with AsyncStorage
- Explore/Search screen
- AI Search texts
- Search filters bottom sheet
- Profile account links
- Settings language switcher

## Naming convention

Use feature-based keys:

```txt
common.*
explore.*
profile.*
settings.*
language.*
sell.*
auth.*
listing.*
chat.*
notifications.*
safety.*
```

Avoid vague keys like:

```txt
text1
button2
labelHeader
```

## Migration steps for each screen

1. Open one screen/component.
2. List all visible user-facing strings.
3. Add English keys to `en.json`.
4. Add matching Finnish keys to `fi.json`.
5. Import `useI18n`.
6. Replace hardcoded strings with `t("key.path")`.
7. Test both English and Finnish in Settings.
8. Run `npm run typecheck`.

## Parameterized strings

Use placeholders:

```json
{
  "results": "{count} results"
}
```

Use in code:

```tsx
<Text>{t("explore.results.count", { count })}</Text>
```

## Important rule

New user-facing text should not be added directly inside components. Add it to both locale files first.
