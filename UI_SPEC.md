# Restaurant POS UI System (Material 3 + Jetpack Compose)

## Theme

- Primary: `#FF5A36`
- Secondary: `#1E293B`
- Background: `#F8FAFC`
- Surface/Card: `#FFFFFF`
- Success: `#22C55E`
- Error: `#EF4444`
- Warning: `#F59E0B`
- Text Primary: `#0F172A`
- Text Secondary: `#64748B`

## Typography

- Font family: **Inter** (fallback to SansSerif)
- App Title: `28sp`
- Screen Title: `24sp`
- Section Heading: `20sp`
- Button Text: `16sp`
- Normal Text: `14-16sp`
- Small Label: `12sp`

## Spacing

- Small gap: `8dp`
- Medium gap: `16dp`
- Large gap: `24dp`
- Screen padding: `20dp`

## Corner radius

- Button: `12dp`
- Card: `16dp`
- Bottom sheet: `24dp`
- Input box: `12dp`

## Components

Implemented in `app/src/main/java/com/foodrestorant/ui/` as reusable Compose widgets:

- App buttons (`PrimaryButton`, `SecondaryButton`, `IconLabelButton`)
- Cards (`AppCard`, `StatusChip`, `InfoRow`)
- Inputs (`AppTextField`, `SearchField`)
- Navigation (`RestaurantBottomNav`, `FabAction`)
- Loaders (`ShimmerPlaceholder`, `LoadingCard`)

## Screens

Implemented sample screens:

- Login
- Dashboard
- Table Selection
- Order Taking
- Kitchen Queue
- Bill Payment
- Order History

All screens use one-hand-friendly controls, large touch targets, card-first layout,
and Material 3 design conventions.
