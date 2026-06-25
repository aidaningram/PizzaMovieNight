# Pizza Movie Night

A phone-friendly web app for a five-person family movie wheel. Everyone creates or signs into their own account, enters the family password, lands on a personal welcome page, and can move between the home page, current wheel, add-to-wheel page, and shared Movie List.

## What it uses

- GitHub Pages for the static app.
- Firebase Authentication with email/password accounts.
- Cloud Firestore for the shared wheel, future Movie List, members, and history.
- A local demo mode only if Firebase config is replaced with placeholders.

Firebase's Spark plan currently includes no-cost Authentication services, Cloud Firestore limits, and Firebase Hosting limits. This app can be hosted on GitHub Pages while still using Firebase Auth and Firestore.

## Try it locally

Open `index.html` in a browser, or run a simple local web server from this folder. The family password is `dogcatpig3`.

## Firebase setup

1. Create or open the `pizzamovienight` Firebase project.
2. In Authentication, enable Email/Password sign-in.
3. In Firestore Database, create a database.
4. Publish the rules from `firebase.rules`.
5. The web app config is already in `firebase-config.js`.
6. After GitHub Pages gives you the final URL, add its domain in Firebase Authentication under Settings > Authorized domains. Add a domain like `YOUR-GITHUB-USERNAME.github.io`, not the full `https://...` URL.

## GitHub Pages setup

1. Push these files to a GitHub repository.
2. In the repository settings, open Pages.
3. Choose the branch and root folder.
4. Visit the Pages URL on each phone and use Add to Home Screen.

## Family flow

1. Create an account with name, email, account password, and the family password.
2. Later, sign in with email, account password, and the family password.
3. Use Home to go to the current wheel or the Movie List.
4. If the wheel is empty, use Add movies to build the next wheel from the Movie List or a custom title.
5. Spin the wheel on movie night.
6. Confirm the picked movie to remove it from the wheel and add it to history.
