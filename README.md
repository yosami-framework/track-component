# TrackComponent
Component for track.
This component is based on the Component of Mithril.js.

## Installation

### npm

```shell
npm install track-component
```

## Usage

#### Write Component

`app/components/hoge.js`

```javascript
const TrackComponent = require('track-component');

class HogeComponent extends TrackComponent {
  static definer() {
    name('hoge'); // Define model name. **Required**
  }
}
```

#### Write view

`app/views/hoge.js`

```javascript
function(component) {
  return m('div', [
    m('h1', 'Hello!'),
  ]);
}
```

### Use multiple views.

hoge_component.js

```javascript
class HogeComponent extends TrackComponent {
  static definer() {
    name('hoge');        // Define model name. **Required**
    views('outer_hoge'); // Append view.
    views('inner_hoge'); // Append view.
  }
}
```

`app/views/outer_hoge.js`

```javascript
function(component, pipe, _yield) {
  return m('div', [
    m('h1', `Hello ${pipe.name}!`),
    _yield,
  ]);
}
```

`views/inner_hoge.js`

```javascript
function(component, pipe) {
  pipe.name = 'hoge'
  return m('p', 'yes!');
}
```

### Use ViewModel

#### Write ViewModel
`view_models/hoge.js`

```javascript
const TrackModel = require('track-view-model');

class Hoge extends TrackModel {
  static definer() {
    name('hoge'); // Define model name. **Required**
    accessor('piyo'); // Define `hoge.piyo` and `hoge.piyo=`
  }
}
```

#### Set value in component.

`app/components/hoge.js`
```javascript
class HogeComponent extends TrackComponent {
  static definer() {
    name('hoge');
    views('hoge');
  }

  oninit() {
    this.vm.piyo = 'PIYO!!!!!PIYO!!!!!';
    return super.oninit();
  }
}
```

#### Get value in view

`app/views/hoge.js`

```javascript
// @note Binding instance of view model.
function(component) {
  return m('div', [
    m('h1', this.piyo),
  ]);
}
```

### Assign global(window) event

```javascript
const TrackComponent = require('track-component');

class HogeComponent extends TrackComponent {
  static definer() {
    name('hoge');                // Define model name. **Required**
    event('scroll', 'onScroll'); // Add event listener for global(window).
  }

  onScroll(e) {
    console.log(e);
  }
}
```

### Mithril lifecycle method

```javascript
const TrackComponent = require('track-component');

class HogeComponent extends TrackComponent {
  static definer() {
    name('hoge'); // Define model name. **Required**
  }

  oninit() {
    super.oninit(); // Must call when Override lifecycle methods of Mithril.
  }
}
```

#### onattrschanged

This is track-component lifecycle method.

The `onattrschanged()` hooks is called after change component attributes.

```javascript
onattrschanged(newly, older) {
  // call
}
```
