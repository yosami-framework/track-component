require('./spec_helper');
const t       = require('track-spec');
const Builder = require('../lib/builder.js');

t.describe('Builder', () => {
  let mock               = null;
  let mockViewClass      = null;
  let mockViewModelClass = null;

  t.beforeEach(() => {
    process.browser = true;

    global.addEventListener = t.spy(global.addEventListener);

    mock = new (class HogeHoge {
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
       * Constructor
       */
      constructor() {
        this._viewNames = [];
      }

      /**
       * Return type.
       */
      get type() {
        return 'component';
      }

      /**
       * Return mock class.
       */
      get mockViewClass() {
        return mockViewClass;
      }

      /**
       * Return mock class.
       */
      get mockViewModelClass() {
        return mockViewModelClass;
      }
    })();

    mock._bindGlobalEvent = t.spy();

    Builder.build(mock);
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
    t.it('Call ._bindGlobalEvent', () => {
      t.expect(mock._bindGlobalEvent.callCount).equals(1);
      t.expect(mock._bindGlobalEvent.args[0]).equals('scroll');
      t.expect(mock._bindGlobalEvent.args[1]).equals('onScroll');
    });
  });
});
