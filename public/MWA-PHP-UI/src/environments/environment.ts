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
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
