# Pizza App Shared Family Migration

This app now supports dynamic family ids and stores Pizza Movie Night state separately from the shared family profile.

## Collections

- `families/{familyId}`: shared family/account profile, compatible with The Pizza Scale.
- `pizzaMovieNightFamilies/{familyId}`: Pizza App state for that family, including movie list, wheel, rankings, and app members.
- Realtime Database `families/{familyId}/gameArena`: Pizza Arena multiplayer state.

## Existing Ingram Family Data

The legacy Pizza App document remains:

- `families/pizza-movie-night`

On first load after this update, the app copies the legacy app fields into:

- `pizzaMovieNightFamilies/pizza-movie-night`

The original `families/pizza-movie-night` document is not deleted or overwritten wholesale.

## Shared Firebase Plan

Long term, both The Pizza Scale and Pizza Movie Night should use the same Firebase Auth project and the same `families` records. Pizza Movie Night can then load whichever family the signed-in user belongs to and use `pizzaMovieNightFamilies/{familyId}` for app-specific state.

Before switching the Firebase config to The Pizza Scale project, export/import or otherwise migrate Pizza Movie Night Auth users so existing accounts are preserved.
