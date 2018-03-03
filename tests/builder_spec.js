require('./spec_helper');
const t             = require('track-spec');
const MockView      = require('./fixtures/views/mock');
const MockViewModel = require('./fixtures/view_models/mock');
const Builder       = require('../lib/builder.js');

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
        name('mock_component');
        viewmodel('mock');
        views('mock');
        views('mock');
        event('scroll', 'onScroll');
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

    mock._assignGlobalEvent = t.spy();

    Builder.build(mock);
  });

  t.afterEach(() => {
    process.browser = false;
  });

  t.describe('#name', () => {
    t.it('Set #_name', () => {
      t.expect(mock._name).equals('mock_component');
    });
  });

  t.describe('#views', () => {
    t.it('Append #_views', () => {
      t.expect(mock._views.length).equals(2);
      t.expect(mock._views[0] instanceof MockView).equals(true);
      t.expect(mock._views[0]._component).equals(mock);
    });
  });

  t.describe('#viewmodel', () => {
    t.it('Set #_vm', () => {
      t.expect(mock._vmclass).equals(MockViewModel);
    });
  });

  t.describe('#event', () => {
    t.it('Call ._assignGlobalEvent', () => {
      t.expect(mock._assignGlobalEvent.callCount).equals(1);
      t.expect(mock._assignGlobalEvent.args[0]).equals('scroll');
      t.expect(mock._assignGlobalEvent.args[1]).equals('onScroll');
    });
  });
});
