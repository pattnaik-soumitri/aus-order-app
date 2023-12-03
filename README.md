# AUS Orders App

**🌍 Live URL:** https://aus-order-form.web.app

## Project Setup

```sh
git pull
npm install
```

### Run locally / Start dev server

```sh
npm run dev
```

**🏚️ Local URL:** http://loclhost:5173/

**Note:** <kbd>Ctrl + C</kbd> to stop dev server

### Deploy

```sh
npm run build-deploy
```

#### Testing App using Emulator:

##### Initialize firebase using firebase-CLI
```sh
firebase init
```
###### Firebase emulator settings choices after init
choose the following settings after you run init:
1. Firestore
2. Emulators

Then for the emulator settings choose:
1. Authentication
2. Firestore


##### Start all Emulators (Firestore, Auth), run dev
```sh
firestore emulators:start
```
```sh
npm run dev
```

##### Store data using export (before stopping emulators)
```sh
firebase emulators:export ./data/
```

##### Restore data using import (before starting emulators)
```sh
firebase emulators:start --import=./data
```
or if you want to start emulator with overwritten data

```sh
firebase emulators:start --force ./data
```
