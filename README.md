# material-ui-filter
[![Build Status][travis-image]][travis-url]
[![Dependency Status][daviddm-image]][daviddm-url]
[![License][license-image]][license-url]
[![Code Coverage][coverage-image]][coverage-url]
[![Code Style][code-style-image]][code-style-url]

This project was bootstrapped with [nwb](https://github.com/insin/nwb)

Material UI filter is a filter drawer that lets you filter any Array.
You can sort the array and add as many filters as you please.

Just try out the [DEMO](https://tarikhuber.github.io/material-ui-filter/).
You can find the full code of the demo in the 'demo' folder above.

(Demo data generated with: http://www.json-generator.com/).

## Table of Contents

- [Features](#features)
- [Implementation](#implementation)
- [Contributors](#contributors)
- [License](#license)

## Features

Material UI filter allows you to filter and sort arrays. The filter currently supports
- strings
- dates
- booleans

## Implementation

We will use code snippets from the demo project to explain how to implement the filter:

The first step is to install the filter:

```
npm install material-ui-filter
```

Then you have to import the filter:
```js
import { FilterDrawer, filterSelectors, filterActions } from 'material-ui-filter'
```

After that you have to add the filter component to the rest of your components in the render function.

The filter takes a few props:
- name:   Name of the filter
- fields: An array of the properties you want to filter/ sort by.
          The array should consist of objects with at least a name property.
          Additionally you can add a label and a datatype for each property.
          The standard datatype is string. Other possible datatypes are bool and date.
- locale, DateTimeFormat, okLabel, cancelLabel: Will be forwarded to the DatePicker.

```js
const filterFields = [
  { name: 'name', label: 'Name' },
  { name: 'email', label: 'Email' },
  { name: 'registered', label: 'Registered', type: 'date' },
  { name: 'isActive', label: 'Is Active', type: 'bool' },
];
```

```js
<FilterDrawer
  name={'demo'}
  fields={filterFields}

  //localising the DatePicker
  locale={'de-DE'}
  DateTimeFormat={global.Intl.DateTimeFormat}
  okLabel="OK"
  cancelLabel="Abbrechen"
/>
```


In your mapStateToProps function you have to set the filter props and filter the array.

The getFilteredList function takes the following parameters:
- filter name
- filters
- array
- A function to get the array values (eg. If your array value is in an Object.)

```js
const { hasFilters } = filterSelectors.selectFilterProps('demo', filters);
const list = filterSelectors.getFilteredList('demo', filters, source /*, fieldValue => fieldValue.val*/);
```


And last but not least you have to add the reducer to your combineReducers function to make it work with your store.

```js
import { filterReducer } from '../../src'

const reducers = combineReducers({
  //your other reducers
  filters: filterReducer
})

export default reducers
```

For more information feel free to play around with the [DEMO](https://tarikhuber.github.io/material-ui-filter/).


## Contributors

Tarik Huber (https://github.com/TarikHuber)

Maximilian Pichler (https://github.com/MaximilianPichler)

## License

MIT @TarikHuber & @MaximilianPichler

[travis-image]: https://travis-ci.org/TarikHuber/material-ui-filter.svg?branch=master
[travis-url]: https://travis-ci.org/TarikHuber/material-ui-filter
[daviddm-image]: https://img.shields.io/david/TarikHuber/material-ui-filter.svg?style=flat-square
[daviddm-url]: https://david-dm.org/TarikHuber/material-ui-filter
[coverage-image]: https://img.shields.io/codecov/c/github/TarikHuber/material-ui-filter.svg?style=flat-square
[coverage-url]: https://codecov.io/gh/TarikHuber/material-ui-filter
[license-image]: https://img.shields.io/npm/l/express.svg
[license-url]: https://github.com/TarikHuber/material-ui-filter/master/LICENSE
[code-style-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[code-style-url]: http://standardjs.com/
