# TrackComponent
Component for track.
This component is based on the Component of Mithril.js.

## Installation

### npm

```shell
npm install track-component
```

## Usage

```javascript
const TrackComponent = require('track-component');

class HogeComponent extends TrackComponent {
  static definer() {
    name('hoge');                // Define model name. **Required**
    views('hoge');               // Append view (`views/hoge`)
    event('scroll', 'onScroll'); // Add event listener for global(window).
  }

  oninit() {
    super.oninit(); // Must call when Override lifecycle methods of Mithril.
  }

  onScroll(e) {
    console.log(e);
  }
}
```

### Use multiple views.

hoge_component.js

```javascript
const TrackComponent = require('track-component');

class HogeComponent extends TrackComponent {
  static definer() {
    name('hoge');        // Define model name. **Required**
    views('outer_hoge'); // Append view.
    views('inner_hoge'); // Append view.
  }
}
```

`views/outer_hoge.js`

```javascript
class OuterHoge extends TrackView {
  render(_yield) {
    m('div', [
      m('h1', 'Hello!'),
      _yield,
    ]);
  }
}
```

`views/inner_hoge.js`

```javascript
class InnerHoge extends TrackView {
  render() {
    m('p', 'Hoge!');
  }
}
```
