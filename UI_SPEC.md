# Restaurant POS UI System (Material 3 + Jetpack Compose)

## Delivered App Flow

1. Dynamic Splash Screen (shimmer)
2. Intro Slider
3. Staff Login (Waiter / Cook)
4. Dashboard
   - Product Categories
   - Products
   - Tables
   - Add/Update order table-wise
5. Kitchen queue for cook

## Role-based Session Rules

- Only **staff users** can access ordering flow.
- **Waiter role**: table selection + add/update order.
- **Cook role**: kitchen queue and status handling.
- Session state controls default landing tab and role badges.

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

## Spacing / Radius / Buttons

- Spacing: 8dp / 16dp / 24dp / 20dp screen padding
- Radius: Button 12dp, Card 16dp, Bottom Sheet 24dp, Input 12dp
- Primary button height: 52dp

## References Used

- API reference: `https://github.com/jaivin92/bmsapi`
- Web app reference: `https://github.com/jaivin92/foodrestorant/tree/development`
