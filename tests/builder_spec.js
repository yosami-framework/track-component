const t              = require('track-spec');
const TrackView      = require('track-view');
const TrackViewModel = require('track-view-model');
const Builder        = require('../lib/builder.js');

t.describe('Builder', () => {
  let mock               = null;
  let mockViewClass      = null;
  let mockViewModelClass = null;

  t.beforeEach(() => {
    mockViewClass = (class extends TrackView {
      // mock
    });

    mockViewModelClass = (class extends TrackViewModel {
      /**
       * Definitions of viewmodel.
       */
      static definer() {
        name('mock_viewmodel');
      }
    });

    mock = new (class HogeHoge {
      /**
       * Definitions of component.
       */
      static definer() {
        name('mock_component');
        views(this.mockViewClass);
        views(this.mockViewClass);
        viewmodel(this.mockViewModelClass);
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

    Builder.build(mock);
  });

  t.describe('#name', () => {
    t.it('Set #_name', () => {
      t.expect(mock._name).equals('mock_component');
    });
  });

  t.describe('#views', () => {
    t.it('Append #_views', () => {
      t.expect(mock._views.length).equals(2);
      t.expect(mock._views[0] instanceof mockViewClass).equals(true);
      t.expect(mock._views[0]._component).equals(mock);
    });
  });

  t.describe('#viewmodel', () => {
    t.it('Set #_vm', () => {
      t.expect(mock._vm instanceof mockViewModelClass).equals(true);
    });
  });
});
