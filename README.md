# Frifim

> Simplified financial management. Take a look: https://frifim.com/

## Setting up for core development

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) template.

### Installing dependencies

With Node 12 installed and `yarn` globally available, clone the project and inside its directory run:

```sh
yarn
```

### Hosting Firebase instance

Ideally you'll use your own Firebase for that, it's free.
So start taking a look on [how to setup Firebase for web](https://firebase.google.com/docs/web/setup).

From your project, once you have created your Firestore Database and
your Firebase Web App, you'll have your own `firebaseConfig` data in hands.
Create a `.env.local` file using `.env` as example. Like doing this:

```sh
cp .env .env.local
```

So then open your `.env.local` and put your Firebase config data there. This file won't be versioned,
it's ignored by git, so you won't need to share your own data while contributing.

### Hosting local web app

Runs the app in the development mode:

```sh
yarn start
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits. You will also see any lint errors in the console.

During your first queries, a few console errors may show up, requiring the creation of
indexes on the database. Just follow the link provided by the warning (and wait a few
minutes).

### Fixture data

This part is optional.

When you are logged in on your own Frifim instance, open the browser console
and call once `persistFixtures()` and wait for a messaging saying that a commit
was sent. Refresh the page and you'll see that a few data was registered for
you as a demonstration.

### Contributing

Open [an issue](https://github.com/Mazuh/frifim/issues) describing how you're
planning to contribute, even plain ideas or clueless bug reports are very 
good contributions. Then we can check the doable viability (cause Firebase
is nice and free but limited), before any hard work.

In case you need a more private conversation, [reach me](https://github.com/Mazuh)
by social media (like Twitter or LinkedIn).

## What does Frifim mean?

In a short answer: **fr**ee **i**ndependent **fi**nancial **m**anagement.

More importantly, it's a funny word available to be registered as a domain.

This "free" stands for the freedom of free source projects, but I'll also try
my best to keep it at no costs for end users, even when significant expenses appear.

## License

© [Mazuh](https://github.com/Mazuh),
released under the [MIT License](https://github.com/Mazuh/frifim/blob/main/LICENSE).
