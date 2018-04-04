require('./spec_helper');
const t              = require('track-spec');
const TrackComponent = require('../lib/index.js');

t.describe('Builder', () => {
  let mock = null;

  t.beforeEach(() => {
    process.browser = true;
    global.addEventListener = t.spy(global.addEventListener);

    mock = new (class extends TrackComponent {
      /**
       * Definitions of component.
       */
      static definer() {
        name('mock');
        views('mock_a');
        views('mock_b');
        event('scroll', 'onScroll');
      }

      /**
       * Scroll event handler.
       */
      onScroll() { }
    })();
  });

  t.afterEach(() => {
    process.browser = false;
  });

  t.describe('#name', () => {
    t.it('Set #_name', () => {
      t.expect(mock._name).equals('mock');
    });
  });

  t.describe('#views', () => {
    t.it('Append #_viewNames', () => {
      t.expect(mock._viewNames.length).equals(2);
      t.expect(mock._viewNames[0]).equals('mock_a');
      t.expect(mock._viewNames[1]).equals('mock_b');
    });
  });

  t.describe('#event', () => {
    t.it('Assign event', () => {
      t.expect(global.addEventListener.callCount).equals(1);
      t.expect(global.addEventListener.args[0]).equals('scroll');
    });
  });

  t.describe('Inheritance', () => {
    let inheritedMock = null;

    t.beforeEach(() => {
      inheritedMock = new (class extends mock.constructor {
        /**
         * Definitions of model.
         */
        static definer() {
          name('inherited');
          views('mock_c');
        }
      });
    });

    t.it('Set #_name', () => {
      t.expect(inheritedMock._name).equals('inherited');
    });

    t.it('Evaluate ancestors dsl', () => {
      t.expect(inheritedMock._viewNames.length).equals(3);
      t.expect(inheritedMock._viewNames[0]).equals('mock_a');
      t.expect(inheritedMock._viewNames[1]).equals('mock_b');
      t.expect(inheritedMock._viewNames[2]).equals('mock_c');
    });
  });
});
