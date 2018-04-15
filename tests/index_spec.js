require('./spec_helper');
const t              = require('track-spec');
const MockViewModel  = require('./fixtures/view_models/components/mock');
const TrackComponent = require('../lib/index.js');

t.describe('TrackComponent', () => {
  let mockComponent = null;
  let mockVnode     = null;

  t.beforeEach(() => {
    process.browser = true;
    global.addEventListener = t.spy(global.addEventListener);
    global.removeEventListener = t.spy(global.removeEventListener);

    mockVnode = {state: {}, attrs: {pipe: {}}};
    mockComponent = new (class extends TrackComponent {
      /**
       * Definitions of model.
       */
      static definer() {
        name('mock');
        event('scroll', 'onScroll');
      }

      /**
       * Scroll event handler.
       */
      onScroll() { }
    })(mockVnode);
  });

  t.afterEach(() => {
    process.browser = false;
  });

  t.describe('#attrs', () => {
    const subject = (() => mockComponent.attrs);

    t.it('Return attrs', () => {
      t.expect(subject()).equals(mockVnode.attrs);
    });
  });

  t.describe('#type', () => {
    const subject = (() => mockComponent.type);

    t.it('Return type', () => {
      subject();
      t.expect(subject()).equals('component');
    });
  });

  t.describe('#name', () => {
    const subject = (() => mockComponent.name);

    t.it('Return name', () => {
      subject();
      t.expect(subject()).equals('mock');
    });
  });

  t.describe('#vm', () => {
    const subject = (() => mockComponent.vm);

    t.it('Return ViewModel', () => {
      t.expect(subject() instanceof MockViewModel).equals(true);
    });
  });

  t.describe('#views', () => {
    const subject = (() => mockComponent.views);

    t.it('Return Views', () => {
      t.expect(subject().length).equals(1);
      t.expect(subject()[0] instanceof Function).equals(true);
    });

    t.context('When definer includes `views`', () => {
      t.beforeEach(() => {
        mockComponent = new (class extends TrackComponent {
          /**
           * Definitions of model.
           */
          static definer() {
            name('mock');
            views('mock_mock');
          }
        })(mockVnode);
      });

      t.it('Return Views', () => {
        t.expect(subject().length).equals(1);
      });
    });

    t.context('When definer includes two `views`', () => {
      t.beforeEach(() => {
        mockComponent = new (class extends TrackComponent {
          /**
           * Definitions of model.
           */
          static definer() {
            name('mock');
            views('mock');
            views('mock_mock');
          }
        })(mockVnode);
      });

      t.it('Return Views', () => {
        t.expect(subject().length).equals(2);
      });
    });

    t.context('When viewmodel is not defined', () => {
      t.beforeEach(() => {
        mockComponent = new (class extends TrackComponent {
          /**
           * Definitions of model.
           */
          static definer() {
            name('mock_without_vm');
            views('mock');
          }
        })(mockVnode);
      });

      t.it('Return Views', () => {
        t.expect(subject().length).equals(1);
      });
    });
  });

  t.describe('#vnode', () => {
    const subject = (() => mockComponent.vnode);

    t.it('Return vnode', () => {
      t.expect(subject()).equals(mockVnode);
    });
  });

  t.describe('#oninit', () => {
    const subject = (() => mockComponent.oninit());

    t.beforeEach(() => {
      mockComponent._watchAttrs = t.spy();
    });

    t.it('Call #_watchAttrs', () => {
      subject();
      t.expect(mockComponent._watchAttrs.callCount).equals(1);
    });
  });

  t.describe('#oncreate', () => {
    t.it('Defined', () => {
      t.expect(mockComponent.oncreate instanceof Function).equals(true);
    });
  });

  t.describe('#onupdate', () => {
    const subject = (() => mockComponent.onupdate(newVnode));
    let newVnode = null;

    t.beforeEach(() => {
      newVnode = {};
      mockComponent._watchAttrs = t.spy();
    });

    t.it('Update vnode', () => {
      t.expect(mockComponent.vnode).equals(mockVnode);
      subject();
      t.expect(mockComponent.vnode).equals(newVnode);
    });

    t.it('Call #_watchAttrs', () => {
      subject();
      t.expect(mockComponent._watchAttrs.callCount).equals(1);
    });
  });

  t.describe('#onbeforeremove', () => {
    t.beforeEach(() => {
      mockComponent._unbindGlobalEvents = t.spy();
    });

    t.it('Call #_unbindGlobalEvents', () => {
      mockComponent.onbeforeremove();
      t.expect(mockComponent._unbindGlobalEvents.callCount).equals(1);
    });
  });

  t.describe('#onremove', () => {
    t.it('Defined', () => {
      t.expect(mockComponent.onremove instanceof Function).equals(true);
    });
  });

  t.describe('#onbeforeupdate', () => {
    const subject = (() => mockComponent.onbeforeupdate());

    t.it('Return true', () => {
      t.expect(subject()).equals(true);
    });
  });

  t.describe('#view', () => {
    const subject = (() => mockComponent.view());

    t.beforeEach(() => {
      mockComponent = new (class extends TrackComponent {
        /**
         * Definitions of model.
         */
        static definer() {
          name('mock');
          views('mock');
          views('mock_mock');
        }
      })(mockVnode);
    });

    t.it('Render view', () => {
      t.expect(subject().tag).deepEquals('div');
      t.expect(subject().text).deepEquals('mock');
    });

    t.it('Pipe data', () => {
      subject();
      t.expect(mockComponent.pipedData).equals('WATER!!!');
    });
  });

  t.describe('#_bindGlobalEvent', () => {
    const subject = (() => mockComponent._bindGlobalEvent('hoge', 'onHoge'));

    t.beforeEach(() => {
      mockComponent.onHoge = t.spy();
      global.addEventListener = t.spy(global.addEventListener);
    });

    t.it('Call global.addEventListener', () => {
      subject();
      t.expect(global.addEventListener.callCount).equals(1);
      t.expect(global.addEventListener.args[0]).equals('hoge');

      global.addEventListener.args[1]();
      t.expect(mockComponent.onHoge.callCount).equals(1);
    });
  });

  t.describe('#_createElement', () => {
    const subject = (() => mockComponent._createElement(tag));
    let tag = null;

    t.beforeEach(() => {
      tag = {view: (() => 'mock')};
    });

    t.it('Return vnode', () => {
      t.expect(subject().tag).equals(tag);
    });

    t.it('Set pipe', () => {
      t.expect(subject().attrs.pipe).equals(mockVnode.attrs.pipe);
    });

    t.context('When tag is not component', () => {
      t.beforeEach(() => {
        tag = 'div';
      });

      t.it('Not set pipe', () => {
        t.expect(subject().attrs).equals(undefined);
      });
    });
  });

  t.describe('#_unbindGlobalEvents', () => {
    const subject = (() => mockComponent._unbindGlobalEvents());

    t.it('Call global.removeEventListener', () => {
      subject();
      t.expect(global.removeEventListener.callCount).equals(1);
      t.expect(global.removeEventListener.args[0]).equals('scroll');
    });
  });

  t.describe('#_watchAttrs', () => {
    const subject = (() => mockComponent._watchAttrs());

    t.beforeEach(() => {
      mockComponent.oninit();
      mockComponent.onattrschanged = t.spy();
    });

    t.context('When change params', () => {
      t.beforeEach(() => {
        mockComponent.vnode.attrs = {a: '1'};
        mockComponent.vnode.state._attrs = {a: '0'};
      });

      t.it('Call onattrschanged', () => {
        subject();
        t.expect(mockComponent.onattrschanged.callCount).equals(1);
      });

      t.context('When `onattrschanged` is undefined', () => {
        t.beforeEach(() => {
          mockComponent.onattrschanged = undefined;
        });

        t.it('Not raise error', () => {
          let error = null;
          try {
            subject();
          } catch (e) {
            error = e;
          }
          t.expect(error).equals(null);
        });
      });
    });

    t.context('When not change params', () => {
      t.beforeEach(() => {
        mockComponent.vnode.attrs = {a: '1'};
        mockComponent.vnode.state._attrs = {a: '1'};
      });

      t.it('Call onattrschanged', () => {
        subject();
        t.expect(mockComponent.onattrschanged.callCount).equals(0);
      });
    });
  });
});
