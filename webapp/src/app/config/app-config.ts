export const APP_CONFIG = {
  firebase: {
    apiKey: 'AIzaSyBjzI3G26aKDYmayJj4IoFm-j98qZGHjVg',
    authDomain: 'career-yojna.firebaseapp.com',
    projectId: 'career-yojna',
    storageBucket: 'career-yojna.appspot.com',
    messagingSenderId: '272616213254',
    appId: '1:272616213254:web:a91be3f23da2be70ef2c87',
    measurementId: 'G-PCHPFX5G5T'
  },
  firestore: {
    collections: {
      jobs: 'Jobs',
      blogs: 'Blogs'
    }
  },
  adsense: {
    enabled: true,
    publisherId: 'ca-pub-4648282103445528',
    adUnits: {
      headerBanner: '0000000001',
      sidebarTop: '0000000002',
      contentMiddle: '0000000003',
      footerBanner: '0000000004'
    }
  }
} as const;

// export const APP_CONFIG = {
//   firebase: {
//     apiKey: 'REPLACE_WITH_FIREBASE_API_KEY',
//     authDomain: 'REPLACE_WITH_FIREBASE_AUTH_DOMAIN',
//     projectId: 'REPLACE_WITH_FIREBASE_PROJECT_ID',
//     storageBucket: 'REPLACE_WITH_FIREBASE_STORAGE_BUCKET',
//     messagingSenderId: 'REPLACE_WITH_FIREBASE_MESSAGING_SENDER_ID',
//     appId: 'REPLACE_WITH_FIREBASE_APP_ID',
//     measurementId: 'REPLACE_WITH_FIREBASE_MEASUREMENT_ID'
//   },
//   firestore: {
//     collections: {
//       jobs: 'Jobs',
//       blogs: 'Blogs'
//     }
//   },
//   adsense: {
//     enabled: false,
//     publisherId: 'ca-pub-xxxxxxxxxxxxxxxx',
//     adUnits: {
//       headerBanner: '0000000001',
//       sidebarTop: '0000000002',
//       contentMiddle: '0000000003',
//       footerBanner: '0000000004'
//     }
//   }
// } as const;