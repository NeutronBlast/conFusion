// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/dist/zone-testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

declare const require: {
  context(path: string, deep?: boolean, filter?: RegExp): {
    keys(): string[];
    <T>(id: string): T;
  };
};

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
// Then we find all the tests.

/* To run a test just for a specific component do this
  const context = require.context('./', true, /menu\.component\.spec\.ts$/);

  To run all the tests do this

  const context = require.context('./', true, /\.spec\.ts$/);

*/
const context = require.context('./', true, /menu\.component\.spec\.ts$/);
// And load the modules.
context.keys().map(context);
