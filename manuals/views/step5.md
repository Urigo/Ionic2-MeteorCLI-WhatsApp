[{]: <region> (header)
# Step 5: Folder Structure
[}]: #
[{]: <region> (body)
As you have probably noticed, our tutorial app has a strict modular structure at this point; There are no pure JavaScript files that are being bundled together and auto-executed, so Meteor's file loading conventions don't have any effect. Furthermore, every `.ts` file is being compiled into a separate CommonJS module, which we can then import whenever we desire.

## TypeScript

TypeScript is a rather new language that has been growing in [popularity](https://www.google.com/trends/explore#q=%2Fm%2F0n50hxv) since it's creation 3 years ago. TypeScript has one of the fullest implementations of ES2015 features on the market: including some experimental features, pseudo type-checking and a rich toolset developed by Microsoft and the TypeScript community. It has support already in all major IDEs including Visual Studio, WebStorm, Sublime, Atom, etc.

One of the biggest issues in JavaScript is making code less bug-prone and more suitable for big projects. In the OOP world, well-known solutions include modularity and strict type-checking. While OOP is available in JavaScript in some way, it turned out to be very hard to create good type-checking. One always needs to impose a certain number of rules to follow to make a JavaScript compiler more effective. For many years, we’ve seen around a number of solutions including the Closure Compiler and GWT from Google, a bunch of C#-to-JavaScript compilers and others.

This was, for sure, one of the problems the TypeScript team were striving to solve: to create a language that would inherit the flexibility of JavaScript while, at the same time, having effective and optional type-checking with minimum effort required from the user.

### Interfaces

TypeScript's type-checking is based on the "shapes" that types have. That's where interfaces kicks in; Interfaces are TypeScript's means to describe these type "shapes", which is sometimes called "duck typing". More on that you can read [here](http://www.typescriptlang.org/docs/handbook/interfaces.html).

### TypeScript Configuration and IDEs

As you already know from the [bootstrapping step](./step1.md), TypeScript is generally configured by a special JSON file called [_tsconfig.json_](https://github.com/Microsoft/typescript/wiki/tsconfig.json).

As mentioned, the TypeScript language today has development plugins in many [popular IDEs](https://github.com/Microsoft/TypeScript/wiki/TypeScript-Editor-Support), including Visual Studio, WebStorm, Sublime, Atom etc. These plugins work in the same style as it's become de facto today — compile, using TypeScript shell command, `.ts` and `tsconfig.json` files update automatically as you change them.
With that, if you've configured your project right with declaration files in place you'll get a bunch of invaluable features such as better code completion and instantaneous highlighting of compilation errors.

If you use one of the mentioned IDEs, you've likely noticed that a bunch of the code lines
are now marked in red, indicating the TypeScript plugins don't work right quite yet.

That's because most of the plugins recognize _tsconfig.json_ as well if it's placed in the root folder,
but so far our _tsconfig.json_ contains only a "files" property, which is certainly not enough for
a general compilation. At the same time, Angular2-Meteor's TypeScript compiler, defaults most of the
compilation options internally to fit our needs. To fix plugins, let's set up our _tsconfig.json_
properly with the options that will make plugins understand our needs and the structure of our app.

```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "isolatedModules": false,
    "moduleResolution": "node",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "removeComments": false,
    "noImplicitAny": false,
    "sourceMap": true
  },
  "exclude": [
    "node_modules"
  ],
  "compileOnSave": false
}
```

**CompilerOptions:**

- `target` - Specify ECMAScript target version
- `module` - Specify module code generation
- `isolatedModules` - Unconditionally emit imports for unresolved files
- `moduleResolution` - Determine how modules get resolved
- `experimentalDecorators` - Enables experimental support for ES7 decorators.
- `emitDecoratorMetadata` - Emit design-type metadata for decorated declarations in source
- `removeComments` - Remove all comments except copy-right header comments beginning with
- `noImplicitAny` - Raise error on expressions and declarations with an implied 'any' type
- `sourceMap` - Generates corresponding '.map' file

Now, let's go to any of the `.ts` files and check if all that annoying redness has disappeared.

> Note: you may need to reload you IDE to pick up the latest changes to the config.

Please note, since the Meteor environment is quite specific, some of the `tsconfig.json` options won't make sense in Meteor. You can read about the exceptions [here](https://github.com/barbatus/typescript#compiler-options).
TypeScript compiler of this package supports some additional options that might be useful in the Meteor environment.
They can be included in the "meteorCompilerOptions" section of _tsconfig.json_ and described [here](https://github.com/barbatus/ts-compilers#typescript-config).

## Meteor Folder Structure

Even though it is recommended that you write your application to use ES2015 modules and the `imports/` directory, Meteor 1.3 continues to support eager loading of files, using these default load order rules, to provide backwards compatibility with applications written for Meteor 1.2 and earlier. You may combine both eager loading and lazy loading using `import` in a single app. Any import statements are evaluated in the order they are listed in a file when that file is loaded and evaluated using these rules.

There are several load order rules. They are **applied sequentially** to all applicable files in the application, in the priority given below:

- HTML template files are always loaded before everything else
- Files beginning with main. are loaded last
- Files inside any lib/ directory are loaded next
- Files with deeper paths are loaded next
- Files are then loaded in alphabetical order of the entire path

```
nav.html
main.html
client/lib/methods.js
client/lib/styles.js
lib/feature/styles.js
lib/collections.js
client/feature-y.js
feature-x.js
client/main.js
```

For example, the files above are arranged in the correct load order. `main.html` is loaded second because HTML templates are always loaded first, even if it begins with main., since rule 1 has priority over rule 2. However, it will be loaded after `nav.html` because rule 2 has priority over rule 5.

`client/lib/styles.js` and `lib/feature/styles.js` have identical load order up to rule 4; however, since `client` comes before `lib` alphabetically, it will be loaded first.

> You can also use [Meteor.startup](http://docs.meteor.com/#/full/meteor_startup) to control when run code is run on both the server and the client.

By default, any JavaScript files in your Meteor application folder are bundled and loaded on both the client and the server. However, the names of the files and directories inside your project can affect their load order, where they are loaded, and some other characteristics. Here is a list of file and directory names that are treated specially by Meteor:

- **imports**

    Any directory named `imports/` is not loaded anywhere and files must be imported using `import`.

- **node_modules**

    Any directory named `node_modules/` is not loaded anywhere. node.js packages installed into `node_modules` directories must be imported using `import` or by using `Npm.depends` in `package.js`.

- **client**

    Any directory named `client/` is not loaded on the server. Similar to wrapping your code in `if (Meteor.isClient) { ... }`. All files loaded on the client are automatically concatenated and minified when in production mode. In development mode, JavaScript and CSS files are not minified, to make debugging easier. CSS files are still combined into a single file for consistency between production and development, because changing the CSS file's URL affects how URLs in it are processed.

    > HTML files in a Meteor application are treated quite a bit differently from a server-side framework.  Meteor scans all the HTML files in your directory for three top-level elements: `<head>`, `<body>`, and `<template>`.  The head and body sections are separately concatenated into a single head and body, which are transmitted to the client on initial page load.

- **server**

    Any directory named `server/` is not loaded on the client. Similar to wrapping your code in `if (Meteor.isServer) { ... }`, except the client never even receives the code. Any sensitive code that you don't want served to the client, such as code containing passwords or authentication mechanisms, should be kept in the `server/` directory.

    Meteor gathers all your JavaScript files, excluding anything under the `client`, `public`, and `private` subdirectories, and loads them into a Node.js server instance. In Meteor, your server code runs in a single thread per request, not in the asynchronous callback style typical of Node.

- **public**

    All files inside a top-level directory called `public/` are served as-is to the client. When referencing these assets, do not include `public/` in the URL, write the URL as if they were all in the top level. For example, reference `public/bg.png` as `<img src='/bg.png' />`. This is the best place for `favicon.ico`, `robots.txt`, and similar files.

- **private**

    All files inside a top-level directory called `private/` are only accessible from server code and can be loaded via the [`Assets`](http://docs.meteor.com/#/full/assets_getText) API. This can be used for private data files and any files that are in your project directory that you don't want to be accessible from the outside.

- **client/compatibility**

    This folder is for compatibility with JavaScript libraries that rely on variables declared with var at the top level being exported as globals. Files in this  directory are executed without being wrapped in a new variable scope. These files are executed before other client-side JavaScript files.

    > It is recommended to use npm for 3rd party JavaScript libraries and use `import` to control when files are loaded.

- **tests**

    Any directory named `tests/` is not loaded anywhere. Use this for any test code you want to run using a test runner outside of [Meteor's built-in test tools](testing.html).

The following directories are also not loaded as part of your app code:

- Files/directories whose names start with a dot, like `.meteor` and `.git`
- `packages/`: Used for local packages
- `cordova-build-override/`: Used for [advanced mobile build customizations](mobile.html#advanced-build)
- `programs`: For legacy reasons
[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Previous Step](step4.md) | [Next Step >](step6.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #