// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrl: 'The base url for the application to fetch data',
  environment: 'this holds the name of the environment file being used in both production and environment.',
  logging: 'If this is 0 we will log to the file, if this is 1 log to fb(this should not be defined in production)',
  main: '',
  games: 'games',
  profile: 'profile',
  addgame: 'add-game',
  game: 'game/:gameId',
  register: 'register',
  editGame: 'edit-game/:gameId',
  token: 'token',
  data: 'data',
  allFieldsRequired: 'Please fill all the fields!',
  passwordDontMatch: 'Password and confirm doesn\'t match!',
  gotogames: '/games',
  gotoPlatforms: '/platforms',
  platform: 'platform',
  editGameForm: 'editGameForm',
  gameId: 'gameId',
  tableLight: 'table-light',
  tableSecondary: 'table-secondary',
  platformName: 'Platform name',
  releasedYear: 'Released year',
  addPlatform: 'Add platform',
  cancel: 'Cancel',
  addNewPlatform: 'Add New Platform',
  editPlatform: 'Edit Platform',
  edit: 'Edit',
  thousand: 1000,
  exp: 'exp',
  gameTitle: 'Game title',
  publisher: 'Publisher',
  editGameText: 'Edit Game',
  name: 'Name',
  username: 'Username',
  password: 'Password',
  confirmPassword: 'Confirm Password',
  comproLink: 'https://compro.miu.edu',
  footerImage: 'assets/images/compro-web-logo-442x112.webp',
  footerText: 'Maharishi International University. All Rights Reserved.',
  copyRight: '169',
  miuCompro: 'MIU Compro',
  true: true,
  false: false,
  emptyArray: [],
  zero: 0,
  defaultCount: 5,
  addGameText: 'Add Game',
  addNewGame: 'Add New Game',
  myModal: 'my-modal',
  welcome: 'Welcome',
  logOut: 'Log Out',
  logIn: 'Log In',
  videoGameImage: 'assets/images/videogames.jpg',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
