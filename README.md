<br />
<p align="center">
  <a href="https://github.com/chakra-ui/chakra-ui/tree/master/logo">
    <img src="/logo.png" alt="observer-js" />
  </a>
</p>

<h1 align="center">Create subjects and add observers as callback. ⚡️</h1>

[![Travis CI](https://img.shields.io/travis/atayahmet/observer-js?style=flat-square)](https://img.shields.io/travis/atayahmet/observer-js?style=flat-square) [![Travis CI](https://img.shields.io/npm/v/@atayahmet/observer-js?style=flat-square)](https://img.shields.io/npm/v/@atayahmet/observer-js?style=flat-square) ![npm](https://img.shields.io/npm/dw/@atayahmet/observer-js?style=flat-square) ![GitHub](https://img.shields.io/github/license/atayahmet/observer-js?style=flat-square) ![GitHub issues](https://img.shields.io/github/issues/atayahmet/observer-js?style=flat-square)

Simple and light-weight observable pub/sub library. You can create multiple subject and observers and manage these objects using features.

>**Note:** All subscriptions work asynchronously.

## Installation

Use the package manager [yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com) to install `react-slidify`.

```sh
$ npm i @atayahmet/observer-js --save
```

```sh
$ yarn add @atayahmet/observer-js
```

## Usage
```js
import Subject from '@atayahmet/observer-js';
```

**Create new subject:**

```js
const subject = new Subject;

// start subscribe
subject.subscribe((data) => console.log('Test subscribe 1!', data));
subject.subscribe((data) => console.log('Test subscribe 2!', data));
subject.subscribe((data) => console.log('Test subscribe 3!', data));
subject.subscribe((data) => console.log('Test subscribe 4!', data));

// run all observers.
subject.notify('Hello World!');
```

**Unsubscribe an observer:**

```js
const subject = new Subject;
const sub$ = subject.subscribe((data) => console.log('Remove subscription!', data));

sub$.unsubscribe();
subject.notify();
```

**Cancel all observers one time:**

```js
subject.subscribe(() => console.log('Test subscribe 1!'));
subject.subscribe(() => console.log('Test subscribe 2!'));

// cancelled.
subject.cancel();

// this will not notify to all observers one time
subject.notify();
```