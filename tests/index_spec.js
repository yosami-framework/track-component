require('./spec_helper');
const t              = require('track-spec');
const TrackI18n      = require('track-i18n');
const MockViewModel  = require('./fixtures/view_models/components/mock');
const TrackComponent = require('../lib/index.js');

t.describe('TrackComponent', () => {
  let mockComponent = null;
  let mockVnode     = null;

  t.beforeEach(() => {
    process.browser = true;
    global.addEventListener = t.spy(global.addEventListener);
    global.removeEventListener = t.spy(global.removeEventListener);

    mockVnode = {state: {}, attrs: {pipe: {hoge: true}}};
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

  t.describe('#i18n', () => {
    const subject = (() => mockComponent.i18n);

    t.it('Return i18n', () => {
      t.expect(subject()).equals(TrackI18n);
    });

    t.context('When pipe has i18n', () => {
      t.beforeEach(() => {
        mockComponent.attrs.pipe.i18n = 'MockI18n';
      });

      t.it('Return i18n', () => {
        t.expect(subject()).equals('MockI18n');
      });
    });
  });

  t.describe('#pipe', () => {
    const subject = (() => mockComponent.pipe);

    t.it('Return pipe', () => {
      t.expect(subject()).equals(mockVnode.attrs.pipe);
    });

    t.context('When attrs does not have pipe', () => {
      t.beforeEach(() => {
        mockComponent.attrs.pipe = undefined;
      });

      t.it('Return pipe', () => {
        t.expect(subject()).deepEquals({});
      });
    });
  });

  t.describe('#type', () => {
    const subject = (() => mockComponent.type);

    t.it('Return type', () => {
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

    t.context('When pipe has i18n', () => {
      t.beforeEach(() => {
        mockComponent.pipe.i18n = 'MockI18n';
      });

      t.it('Pass i18n', () => {
        t.expect(subject().__i18n).equals('MockI18n');
      });
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
    const subject = (() => mockComponent._createElement(selector, attributes));
    let selector   = null;
    let attributes = null;

    t.beforeEach(() => {
      selector = {view: (() => 'mock')};
      attributes = undefined;
    });

    t.it('Return vnode', () => {
      t.expect(subject().tag).equals(selector);
    });

    t.it('Set pipe', () => {
      t.expect(subject().attrs.pipe).equals(mockVnode.attrs.pipe);
    });

    t.context('When selector is not component', () => {
      t.beforeEach(() => {
        selector = 'div';
      });

      t.it('Not set pipe', () => {
        t.expect(subject().attrs).equals(undefined);
      });
    });

    t.context('When selector is a', () => {
      t.beforeEach(() => {
        selector = 'a';
        attributes = {
          href: '/hogehoge',
        };
      });

      t.it('Set oncreate', () => {
        t.expect(typeof subject().attrs.oncreate).equals('function');
      });

      t.context('When select is not a', () => {
        t.beforeEach(() => {
          selector = 'div';
        });

        t.it('Not set oncreate', () => {
          t.expect(typeof subject().attrs.oncreate).equals('undefined');
        });
      });

      t.context('When href is not path', () => {
        t.beforeEach(() => {
          attributes.href = 'http://localhost:3000/hogehoge';
        });

        t.it('Not set oncreate', () => {
          t.expect(typeof subject().attrs.oncreate).equals('undefined');
        });
      });

      t.context('When attributes is undefined', () => {
        t.beforeEach(() => {
          attributes = undefined;
        });

        t.it('Not set oncreate', () => {
          t.expect(typeof subject().attrs).equals('undefined');
        });
      });

      t.context('When attributes has `data-disable-spa`', () => {
        t.beforeEach(() => {
          attributes['data-disable-spa'] = true;
        });

        t.it('Not set oncreate', () => {
          t.expect(typeof subject().attrs.oncreate).equals('undefined');
        });
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
