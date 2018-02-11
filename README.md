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
    name('hoge_component'); // Define model name. **Required**
  }
}
```
