(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    var val = aliases[name];
    return (val && name !== val) ? expandAlias(val) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (bundle && typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = typeof window === 'undefined' ? this : window;
var process;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("Components/Hamburger.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _clarity = require("@mithril-icons/clarity");

var filledGreen = {
  fill: "green"
};

var Hamburger = function Hamburger() {
  return {
    view: function view(_ref) {
      var mdl = _ref.attrs.mdl;
      return m("figure.pointer is-center", {
        style: {
          transform: "scale(1.2)"
        }
      }, [mdl.state.isAuth() && m("label", "Welcome ".concat(mdl.user.name && mdl.user.name.split(" ")[0])), mdl.state.showNavModal() ? m(_clarity.WindowCloseLine, filledGreen) : m(_clarity.MenuLine, filledGreen)]);
    }
  };
};

var _default = Hamburger;
exports["default"] = _default;
});

;require.register("Components/Modal.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _animations = require("Styles/animations");

var Modal = {
  oncreate: _animations.SlideInLeft,
  onbeforeremove: _animations.SlideOutRight,
  view: function view(_ref) {
    var _ref$attrs = _ref.attrs,
        classList = _ref$attrs.classList,
        isActive = _ref$attrs.isActive,
        close = _ref$attrs.close,
        title = _ref$attrs.title,
        content = _ref$attrs.content,
        footer = _ref$attrs.footer;
    console.log("MODAL", classList, isActive, close, title, content, footer);
    return m("section.modal.".concat(classList), {
      "class": isActive ? "active" : "",
      id: "modal"
    }, [m("a.modal-overlay", {
      "aria-label": "Close",
      onclick: function onclick() {
        return close();
      }
    }), m(".modal-container", {
      role: "document"
    }, [m(".modal-header", [m("a.btn btn-clear float-right", {
      id: "modal-close",
      "aria-label": "Close",
      onclick: function onclick() {
        return close();
      }
    }), m(".modal-title h3", title)]), m(".modal-body", m(".content", content)), m(".modal-footer", footer)])]);
  }
};
var _default = Modal;
exports["default"] = _default;
});

;require.register("Components/Selector.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _storage = require("Utils/storage");

var _animations = require("Styles/animations");

var Selector = function Selector() {
  var state = {
    error: Stream(null)
  };

  var ResetState = function ResetState() {
    state.quantity = null;
    state.gender = "Gender";
  };

  var saveToStorage = function saveToStorage(mdl) {
    var onError = function onError(e) {
      console.log("Error saving", e.message);
      state.error(e.message);
    };

    var onSuccess = function onSuccess(s) {
      ResetState();
    };

    (0, _storage.saveStorageTask)(mdl)("sb-cart")(mdl.cart).fork(onError, onSuccess);
  };

  var addToCart = function addToCart(mdl) {
    return function (product) {
      return function (state) {
        mdl.addToCart.show(product);
        mdl.cart[product][state.gender] += parseInt(state.quantity);
        saveToStorage(mdl);
      };
    };
  };

  return {
    oninit: function oninit() {
      return ResetState();
    },
    view: function view(_ref) {
      var _ref$attrs = _ref.attrs,
          mdl = _ref$attrs.mdl,
          product = _ref$attrs.product;
      return m(".frow", m(".frow content-center gutters row-between pt-20 md-columns", [state.error() && m("code.warning", state.error()), m(".col-xs-1-3.col-md-1-4", m("h2.pb-10", "$".concat(mdl.state.prices[product]))), m(".col-xs-1-3.col-md-1-4", m("label", m("input", {
        type: "number",
        inputmode: "numeric",
        pattern: "[0-9]*",
        placeholder: "quantity",
        value: state.quantity,
        oninput: function oninput(e) {
          return state.quantity = e.target.value;
        }
      }))), m(".col-xs-1-3.col-md-1-4", m("label", m("select", {
        value: state.gender,
        onchange: function onchange(e) {
          return state.gender = e.target.value;
        }
      }, [m("option", {
        value: null
      }, "Gender"), m("option", {
        value: "Male"
      }, "Male"), m("option", {
        value: "Female"
      }, "Female"), m("option", {
        value: "Unisex"
      }, "Unisex")]))), mdl.addToCart.show() == product && m(".animated", {
        oncreate: _animations.AddToCartOut,
        id: "add-to-cart-img",
        style: {
          "background-image": "url(".concat(mdl.addToCart.id(), ")")
        }
      }), m(".col-xs-1", m("button.width-100", {
        disabled: state.quantity == undefined || state.gender == "Gender",
        onclick: function onclick() {
          return addToCart(mdl)(product)(state);
        }
      }, "Add To Bag"))]));
    }
  };
};

var _default = Selector;
exports["default"] = _default;
});

;require.register("Components/accordian.js", function(exports, require, module) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Accordian = function Accordian() {
  var Accordion = /*#__PURE__*/function () {
    function Accordion(el) {
      var _this = this;

      _classCallCheck(this, Accordion);

      // Store the <details> element
      this.el = el; // Store the <summary> element

      this.summary = el.querySelector("summary"); // Store the <div class="content"> element

      this.content = el.querySelector(".content"); // Store the animation object (so we can cancel it if needed)

      this.animation = null; // Store if the element is closing

      this.isClosing = false; // Store if the element is expanding

      this.isExpanding = false; // Detect user clicks on the summary element

      this.summary.addEventListener("click", function (e) {
        return _this.onClick(e);
      });
    }

    _createClass(Accordion, [{
      key: "onClick",
      value: function onClick(e) {
        // Stop default behaviour from the browser
        e.preventDefault(); // Add an overflow on the <details> to avoid content overflowing

        this.el.style.overflow = "hidden"; // Check if the element is being closed or is already closed

        if (this.isClosing || !this.el.open) {
          this.open(); // Check if the element is being openned or is already open
        } else if (this.isExpanding || this.el.open) {
          this.shrink();
        }
      }
    }, {
      key: "shrink",
      value: function shrink() {
        var _this2 = this;

        // Set the element as "being closed"
        this.isClosing = true; // Store the current height of the element

        var startHeight = "".concat(this.el.offsetHeight, "px"); // Calculate the height of the summary

        var endHeight = "".concat(this.summary.offsetHeight, "px"); // If there is already an animation running

        if (this.animation) {
          // Cancel the current animation
          this.animation.cancel();
        } // Start a WAAPI animation


        this.animation = this.el.animate({
          // Set the keyframes from the startHeight to endHeight
          height: [startHeight, endHeight]
        }, {
          duration: 400,
          easing: "ease-out"
        }); // When the animation is complete, call onAnimationFinish()

        this.animation.onfinish = function () {
          return _this2.onAnimationFinish(false);
        }; // If the animation is cancelled, isClosing variable is set to false


        this.animation.oncancel = function () {
          return _this2.isClosing = false;
        };
      }
    }, {
      key: "open",
      value: function open() {
        var _this3 = this;

        // Apply a fixed height on the element
        this.el.style.height = "".concat(this.el.offsetHeight, "px"); // Force the [open] attribute on the details element

        this.el.open = true; // Wait for the next frame to call the expand function

        window.requestAnimationFrame(function () {
          return _this3.expand();
        });
      }
    }, {
      key: "expand",
      value: function expand() {
        var _this4 = this;

        // Set the element as "being expanding"
        this.isExpanding = true; // Get the current fixed height of the element

        var startHeight = "".concat(this.el.offsetHeight, "px"); // Calculate the open height of the element (summary height + content height)

        var endHeight = "".concat(this.summary.offsetHeight + this.content.offsetHeight, "px"); // If there is already an animation running

        if (this.animation) {
          // Cancel the current animation
          this.animation.cancel();
        } // Start a WAAPI animation


        this.animation = this.el.animate({
          // Set the keyframes from the startHeight to endHeight
          height: [startHeight, endHeight]
        }, {
          duration: 400,
          easing: "ease-out"
        }); // When the animation is complete, call onAnimationFinish()

        this.animation.onfinish = function () {
          return _this4.onAnimationFinish(true);
        }; // If the animation is cancelled, isExpanding variable is set to false


        this.animation.oncancel = function () {
          return _this4.isExpanding = false;
        };
      }
    }, {
      key: "onAnimationFinish",
      value: function onAnimationFinish(open) {
        // Set the open attribute based on the parameter
        this.el.open = open; // Clear the stored animation

        this.animation = null; // Reset isClosing & isExpanding

        this.isClosing = false;
        this.isExpanding = false; // Remove the overflow hidden and the fixed height

        this.el.style.height = this.el.style.overflow = "";
      }
    }]);

    return Accordion;
  }();

  document.querySelectorAll("details").forEach(function (el) {
    new Accordion(el);
  });
};
});

;require.register("Components/authbox.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _navLink = _interopRequireDefault(require("Components/nav-link.js"));

var _index = require("Utils/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var AuthBox = function AuthBox() {
  return {
    view: function view(_ref) {
      var mdl = _ref.attrs.mdl;
      return mdl.state.isAuth() ? m(".grouped.is-center", ["admin", "mod"].includes(mdl.user.role) && m(_navLink["default"], {
        mdl: mdl,
        href: "/dashboard/".concat(mdl.user.name),
        link: "Dashboard",
        classList: "".concat((0, _index.isActiveRoute)("/dashboard/".concat(mdl.user.name)), " button dark")
      }), m(_navLink["default"], {
        mdl: mdl,
        href: "/account/".concat(mdl.user.name),
        role: "button",
        link: "Your Account",
        classList: "".concat((0, _index.isActiveRoute)("/account/".concat(mdl.user.name)), " button primary")
      }), m(_navLink["default"], {
        mdl: mdl,
        href: "/logout",
        role: "button",
        link: "Logout",
        classList: "button secondary"
      })) : m(".grouped.is-center", m(_navLink["default"], {
        mdl: mdl,
        role: "button",
        href: "/login",
        link: "Login",
        classList: "".concat((0, _index.isActiveRoute)("/login"), " button primary")
      }), m(_navLink["default"], {
        mdl: mdl,
        role: "button",
        href: "/register",
        link: "Register",
        classList: "".concat((0, _index.isActiveRoute)("/register"), " button secondary")
      }));
    }
  };
};

var _default = AuthBox;
exports["default"] = _default;
});

;require.register("Components/carousel.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var Indicators = {
  view: function view(_ref) {
    var _ref$attrs = _ref.attrs,
        ident = _ref$attrs.ident,
        state = _ref$attrs.state,
        children = _ref.children;
    return m(".frow row-between", children.map(function (src, idx) {
      return m(".clickable.carousel-indicator", {
        id: "".concat(ident, "-").concat(idx),
        onclick: function onclick(e) {
          state.prevIdx(state.currentIdx());
          state.currentIdx(idx);
          state.currentId(ident);
          state.currentEl(e.composedPath()[3].children[0].children[state.currentIdx()]);
        }
      }, m("img.carousel-slide", {
        "class": state.currentIdx() == idx ? "is-active" : "",
        src: src,
        id: "".concat(ident, "-").concat(idx)
      }));
    }));
  }
};

var Carousel = function Carousel() {
  var state = {
    currentIdx: Stream(0),
    currentId: Stream(""),
    currentEl: Stream(null),
    prevIdx: Stream(0),
    indicators: Stream([]),
    coords: Stream({
      x: null,
      y: null
    })
  };

  var distanceToNext = function distanceToNext(dom) {
    return state.currentIdx() - state.prevIdx() >= 0 ? Array.from(dom.children).slice(state.prevIdx(), state.currentIdx()).reduce(function (acc, c) {
      return acc + c.clientWidth;
    }, 0) : ~Array.from(dom.children).slice(state.currentIdx(), state.prevIdx()).reduce(function (acc, c) {
      return acc + c.clientWidth;
    }, 0) + 1;
  };

  var intersectionObserver = new IntersectionObserver(function (entries, _) {
    entries.forEach(function (entry) {
      var target = entry.target; // console.log("intersectionObserver", target)

      var indicatorId = target.getAttribute("id");
      var indicator = state.indicators()[indicatorId];

      if (entry.intersectionRatio >= 0.25) {
        // console.log(target, indicator)
        target.classList.add("is-active");
        indicator === null || indicator === void 0 ? void 0 : indicator.classList.add("is-active");
      } else {
        // console.log(target, indicator)
        target.classList.remove("is-active");
        indicator === null || indicator === void 0 ? void 0 : indicator.classList.remove("is-active");
      }
    });
  });
  var mutationObserver = new MutationObserver(function (entry) {
    console.log(entry);
  });
  return {
    view: function view(_ref2) {
      var children = _ref2.children,
          ident = _ref2.attrs.ident;
      return m(".carousel-container", {
        oncreate: function oncreate(_ref3) {
          var dom = _ref3.dom;
          state.indicators(dom.children[1].children);
          state.currentEl(dom.children[0].children[state.currentIdx()]);
          state.coords(dom.getBoundingClientRect());
          intersectionObserver.observe(dom);
          mutationObserver.observe(dom, {
            childList: true,
            subTree: true,
            characterDataOldValue: true // pass old data to callback

          });
        }
      }, m(".carousel-wrapper.width-100", {
        id: ident,
        ontouchend: function ontouchend(e) {
          e.preventDefault();
          state.prevIdx(state.currentIdx());
          setTimeout(function () {
            var el = document.elementFromPoint(state.coords().x, state.coords().y);
            var idx = el.getAttribute("id") && parseInt(el.getAttribute("id").split("-")[1]);
            state.currentIdx(idx);
            state.currentId("".concat(ident, "-").concat(idx));
            state.currentEl(el);
            m.redraw();
          }, 1000);
        },
        onupdate: function onupdate(_ref4) {
          var dom = _ref4.dom;
          state.currentEl(dom.children[state.currentIdx()]);
          state.currentEl() instanceof Element && intersectionObserver.observe(state.currentEl());
          if (dom.id == state.currentId()) dom.scrollTo({
            left: dom.scrollLeft + distanceToNext(dom),
            behavior: "smooth"
          });
        }
      }, children.map(function (src, idx) {
        return m("img.carousel-slide", {
          src: src,
          id: "".concat(ident, "-").concat(idx)
        });
      })), m(Indicators, {
        ident: ident,
        state: state
      }, children));
    }
  };
};

var _default = Carousel;
exports["default"] = _default;
});

;require.register("Components/default.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var Default = function Default(mdl) {
  return {
    view: function view(_ref) {
      var mdl = _ref.attrs.mdl;
      return m(".container", m(".", m("section", m("p", "sec1")), m("section", m("p", "sec2")), m("section", m("p", "sec3")), m("section", m("p", "sec1")), m("section", m("p", "sec2")), m("section", m("p", "sec3")), m("section", m("p", "sec2")), m("section", m("p", "sec3")), m("section", m("p", "sec1")), m("section", m("p", "sec2")), m("section", m("p", "sec3")), m("section", m("p", "sec1")), m("section", m("p", "sec2")), m("section", m("p", "sec3")), m("section", m("p", "sec1")), m("section", m("p", "sec2")), m("section", m("p", "sec3")), m("section", m("p", "sec2")), m("section", m("p", "sec3")), m("section", m("p", "sec1")), m("section", m("p", "sec2")), m("section", m("p", "sec3")), m("section", m("p", "sec1")), m("section", m("p", "sec2")), m("section", m("p", "sec3")), m("section", m("p", "sec1")), m("section", m("p", "sec2")), m("section", m("p", "sec3")), m("section", m("p", "sec2")), m("section", m("p", "sec3")), m("section", m("p", "sec1")), m("section", m("p", "sec2")), m("section", m("p", "sec3")), m("section", m("p", "sec1")), m("section", m("p", "sec2")), m("section", m("p", "sec3")), m("section", m("p", "sec1")), m("section", m("p", "sec2")), m("section", m("p", "sec3")), m("section", m("p", "sec2")), m("section", m("p", "sec3")), m("section", m("p", "sec1")), m("section", m("p", "sec2")), m("section", m("p", "sec3"))));
    }
  };
};

var _default = Default;
exports["default"] = _default;
});

;require.register("Components/grid.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var getOverFlow = function getOverFlow(mdl, overflow) {
  console.log(mdl.settings.screenSize, mdl.settings.screenSize == "phone" ? "none" : overflow);
  return mdl.settings.screenSize == "phone" ? "none" : overflow;
};

var Fig = {
  view: function view(_ref) {
    var children = _ref.children,
        id = _ref.attrs.id;
    return m("figure#".concat(id, "-slidy"), {
      "flex-direction": "column",
      "justify-content": "center",
      "scroll-snap-align": "start"
    }, children);
  }
};
var Grid = {
  onremove: function onremove() {},
  view: function view(_ref2) {
    var children = _ref2.children,
        _ref2$attrs = _ref2.attrs,
        id = _ref2$attrs.id,
        maxheight = _ref2$attrs.maxheight,
        height = _ref2$attrs.height,
        overflow = _ref2$attrs.overflow,
        mdl = _ref2$attrs.mdl;
    return m("frow-row", {
      style: _defineProperty({
        width: "80%",
        "scroll-snap-type": " mandatory",
        "scroll-snap-points-y": " repeat(3rem)"
      }, "scroll-snap-type", " x mandatory")
    }, children.map(function (child) {
      return m(Fig, {
        id: id
      }, child);
    }));
  }
};
var _default = Grid;
exports["default"] = _default;
});

;require.register("Components/loader.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _animations = require("Styles/animations");

var Loader = function Loader() {
  return {
    view: function view() {
      return m(".logoLoader", {
        onremove: _animations.FadeBack
      }, m("img.heartbeat", {
        src: "images/logo.webp"
      }));
    }
  };
};

var _default = Loader;
exports["default"] = _default;
});

;require.register("Components/nav-link.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.NavLink = void 0;

var _Utils = require("Utils");

var _excluded = ["mdl", "href", "link", "classList"];

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var showBorderStyle = function showBorderStyle(style) {
  style.border = "1px solid black";
  return style;
};

var hideBorderStyle = function hideBorderStyle(style) {
  style.border = "";
  return style;
};

var NavLink = function NavLink() {
  return {
    view: function view(_ref) {
      var _ref$attrs = _ref.attrs,
          mdl = _ref$attrs.mdl,
          href = _ref$attrs.href,
          link = _ref$attrs.link,
          classList = _ref$attrs.classList,
          rest = _objectWithoutProperties(_ref$attrs, _excluded);

      return m(m.route.Link, _objectSpread({
        onclick: function onclick(e) {
          return e.stopPropagation();
        },
        // style: {
        //   ...handlers(["onmouseover", "onmouseout"], (e) => {
        //     return e.type == "mouseover"
        //       ? showBorderStyle(e.target.style)
        //       : hideBorderStyle(e.target.style)
        //   }),
        // },
        href: href,
        "class": "nav-link ".concat(classList, " ").concat(mdl.state.navSelected() == link ? "is-active" : "")
      }, rest), link);
    }
  };
};

exports.NavLink = NavLink;
var _default = NavLink;
exports["default"] = _default;
});

;require.register("Components/paypal.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PayPal = void 0;

var _data = _interopRequireDefault(require("data.task"));

var _Utils = require("Utils");

var _Models = require("Models");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var makePaymentTask = function makePaymentTask(actions) {
  (0, _Utils.log)("makePaymentTask")(actions);
  return new _data["default"](function (rej, res) {
    return actions.order.capture().then(res, rej);
  });
};

var formatInvoice = function formatInvoice(_ref) {
  var user = _ref.user,
      cart = _ref.cart,
      prices = _ref.state.prices;
  return function (_ref2) {
    var orderID = _ref2.orderID,
        payerID = _ref2.payerID;
    return function (details) {
      (0, _Utils.log)("formatInvoice")(user);
      return {
        userId: user.objectId,
        orderID: orderID,
        payerID: payerID,
        purchaseTime: details.create_time,
        status: details.status,
        customer: details.payer,
        shippingDestination: details.purchase_units[0].shipping,
        cart: cart,
        prices: prices
      };
    };
  };
};

var setTempUser = function setTempUser(user) {
  return sessionStorage.setItem("baca-session-token", user["sessionToken"]);
};

var unSetTempUser = function unSetTempUser() {
  return sessionStorage.clear();
};

var updateCartTask = function updateCartTask(mdl) {
  return function (_) {
    (0, _Utils.log)("updateCartTask")();
    mdl.cart = (0, _Utils.jsonCopy)(_Models.newCart);
    return (0, _Utils.saveStorageTask)(mdl)("sb-cart")(mdl.cart);
  };
};

var saveUnregisteredInvoiceTask = function saveUnregisteredInvoiceTask(mdl) {
  return function (invoice) {
    return mdl.http.back4App.postTask(mdl)("login")({
      username: mdl.http.back4App.unregistered.email,
      password: btoa(mdl.http.back4App.unregistered.password)
    }).map(setTempUser).chain(function (_) {
      return saveInvoiceTask(mdl)(invoice);
    }).map(unSetTempUser);
  };
};

var addInvoiceTask = function addInvoiceTask(mdl) {
  return function (invoice) {
    (0, _Utils.log)("addInvoiceTask")(invoice);
    return mdl.state.isAuth() ? saveInvoiceTask(mdl)(invoice) : saveUnregisteredInvoiceTask(mdl)(invoice);
  };
};

var saveInvoiceTask = function saveInvoiceTask(mdl) {
  return function (invoice) {
    return mdl.http.back4App.postTask(mdl)("classes/Invoices")(invoice);
  };
};

var onSuccess = function onSuccess(mdl, state) {
  return function (_) {
    console.log("succc", state, _);
    setTimeout(function () {
      return state.isPaying = "success";
    });
  };
};

var onError = function onError(state) {
  return function (error) {
    (0, _Utils.log)("state")(state);
    state.error = error;
    setTimeout(function () {
      return state.isPaying = "failed";
    });
    console.log("error", error);
  };
};

var PayPal = function PayPal() {
  return {
    view: function view(_ref3) {
      var _ref3$attrs = _ref3.attrs,
          mdl = _ref3$attrs.mdl,
          state = _ref3$attrs.state;
      return m(".", {
        style: {
          maxHeight: "500px",
          overflowY: "auto",
          minWidth: "400px"
        },
        oncreate: function oncreate(_ref4) {
          var dom = _ref4.dom;
          return paypal.Buttons({
            createOrder: function createOrder(_, actions) {
              return actions.order.create({
                purchase_units: [{
                  amount: {
                    value: (0, _Utils.getTotal)(mdl, (0, _Utils.toProducts)(mdl.cart))
                  }
                }]
              });
            },
            onApprove: function onApprove(data, actions) {
              state.isPaying = "start";
              (0, _Utils.log)("onapprove")(JSON.stringify(state));
              return makePaymentTask(actions).map(formatInvoice(mdl)(data)).chain(addInvoiceTask(mdl)).chain(updateCartTask(mdl)).fork(onError(state), onSuccess(mdl, state));
            }
          }).render(dom);
        }
      });
    }
  };
};

exports.PayPal = PayPal;
});

;require.register("Components/report.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _clarity = require("@mithril-icons/clarity");

var _animations = require("Styles/animations");

var state = {
  date: "",
  time: "",
  location: "",
  subject: "",
  message: "",
  firstName: "",
  lastName: "",
  email: "",
  images: []
};

var resetState = function resetState() {
  state.date = "";
  state.time = "";
  state.location = "";
  state.subject = "";
  state.message = "";
  state.firstName = "";
  state.lastName = "";
  state.email = "";
  state.images = [];
};

var submitReport = function submitReport(mdl, showModal) {
  var onSuccess = function onSuccess(s) {
    return showModal(false);
  };

  var onError = function onError(e) {
    return console.log(e);
  };

  console.log(state); // save imgBB then
  // mdl.http.back4App
  //   .postTask(mdl)("Classes/Reports")(state)
  //   .fork(onError, onSuccess)
};

var ViolationReport = {
  onremove: resetState,
  view: function view(_ref) {
    var _ref$attrs = _ref.attrs,
        mdl = _ref$attrs.mdl,
        showModal = _ref$attrs.showModal;
    return m(".modal-container", m("form.modal.card", m("section.modal-content", m("form", m("formgroup.grouped", m("label", "Date", m("input", {
      type: "date",
      oninput: function oninput(e) {
        return state.date = e.target.value;
      }
    })), m("label", "Time", m("input", {
      type: "time",
      oninput: function oninput(e) {
        return state.time = e.target.value;
      }
    }))), m("formgroup", m("label", "Location", m("input", {
      oninput: function oninput(e) {
        return state.location = e.target.value;
      }
    })), m("label", "Violation", m("select", {
      onchange: function onchange(e) {
        return state.violation = e.target.value;
      }
    }, m("option", {
      value: ""
    }, "Select a violation"), m("option", {
      value: "Yard Parking"
    }, "Yard Parking"), m("option", {
      value: "Overgrown Lot"
    }, "Overgrown Lot"), m("option", {
      value: "Garbage / Trash / Rubbish"
    }, "Garbage / Trash / Rubbish"), m("option", {
      value: "Junked auto appliances / furniture"
    }, "Junked auto appliances / furniture"), m("option", {
      value: "new construction"
    }, "new construction"), m("option", {
      value: "Business in westview terrace"
    }, "Business in westview terrace"), m("option", {
      value: "Trailer being used as residance"
    }, "Trailer being used as residance"), m("option", {
      value: "Other"
    }, "Other"))), m("label", "Subject", m("input", {
      oninput: function oninput(e) {
        return state.subject = e.target.value;
      }
    })), m("label", "Message", m("textarea", {
      oninput: function oninput(e) {
        return state.message = e.target.value;
      }
    }))), m("formgroup.grouped", m("label", "First Name", m("input", {
      oninput: function oninput(e) {
        return state.firstName = e.target.value;
      }
    })), m("label", "Last Name", m("input", {
      oninput: function oninput(e) {
        return state.lastName = e.target.value;
      }
    }))), m("formgroup", m("label", "Email", m("input", {
      oninput: function oninput(e) {
        return state.email = e.target.value;
      }
    }))), m("formgroup", m("label", "Attachement", m("input", {
      oninput: function oninput(e) {
        return state.images = e.target.files;
      },
      type: "file",
      id: "files"
    }), state.images[0] && m("img", {
      src: URL.createObjectURL(state.images[0])
    }))))), m(".modal-footer.is-right grouped", m("button.button.primary", {
      onclick: function onclick(e) {
        e.preventDefault();
        submitReport(mdl);
      }
    }, "Submit Report"), m("button.button.secondary", {
      onclick: function onclick(e) {
        e.preventDefault();
        showModal(false);
      }
    }, "cancel"))));
  }
};
var _default = ViolationReport;
exports["default"] = _default;
});

;require.register("Components/table.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Table = exports.formatDataForTable = void 0;

var _ramda = require("ramda");

var toColCell = function toColCell(x) {
  return {
    col: x[0],
    val: x[1]
  };
};

var formatDataForTable = function formatDataForTable(data) {
  var cols = Array.from(new Set(data.flatMap(_ramda.keys)));
  var rows = (0, _ramda.compose)((0, _ramda.map)((0, _ramda.map)(toColCell)), (0, _ramda.map)(_ramda.toPairs))(data);
  return {
    cols: cols,
    rows: rows
  };
};

exports.formatDataForTable = formatDataForTable;

var Cell = function Cell() {
  return {
    view: function view(_ref) {
      var screenSize = _ref.attrs.mdl.settings.screenSize,
          children = _ref.children;
      return screenSize == "phone" ? m("tr", [m("td", {
        style: {
          width: "25%"
        }
      }, m("label", children[0].key)), children]) : m("td", {
        style: {
          width: "20%"
        }
      }, children);
    }
  };
};

var Row = function Row(_ref2) {
  var mdl = _ref2.attrs.mdl;
  return {
    view: function view(_ref3) {
      var row = _ref3.attrs.row;
      return [m("tr", row.map(function (cell) {
        return m(Cell, {
          mdl: mdl
        }, m("", {
          key: cell.col
        }, cell.val));
      }))];
    }
  };
};

var Table = function Table() {
  return {
    view: function view(_ref4) {
      var _ref4$attrs = _ref4.attrs,
          mdl = _ref4$attrs.mdl,
          cols = _ref4$attrs.cols,
          rows = _ref4$attrs.rows;
      return m("section.table", {
        style: {
          minWidth: "100%",
          overflow: "auto"
        }
      }, rows.any() ? m("table.dash-table", mdl.settings.screenSize != "phone" && m("thead.dash-nav", m("tr.mb-5", cols.map(function (col) {
        return m("th.primary", col.toUpperCase());
      }))), m("tbody", rows.map(function (row) {
        return m(Row, {
          mdl: mdl,
          row: row
        });
      }))) : m("h2", "No data"));
    }
  };
};

exports.Table = Table;
});

;require.register("Layouts/ProgressBar.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var ProgressBar = function ProgressBar() {
  return {
    view: function view(_ref) {
      var _ref$attrs$mdl$state$ = _ref.attrs.mdl.state.loadingProgress,
          value = _ref$attrs$mdl$state$.value,
          max = _ref$attrs$mdl$state$.max;
      return m(".progress-bar", m("progress.progress-bar", {
        id: "progressbar",
        value: value ? value() : 0,
        max: max ? max() : 0
      }));
    }
  };
};

var _default = ProgressBar;
exports["default"] = _default;
});

;require.register("Layouts/fab.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Hamburger = _interopRequireDefault(require("Components/Hamburger.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Fab = function Fab() {
  return {
    view: function view(_ref) {
      var mdl = _ref.attrs.mdl;
      console.log("FAB", mdl.state.fab());
      return m("button#fab", {
        style: {
          right: "-".concat(mdl.state.fab(), "px")
        },
        onclick: function onclick(e) {
          return mdl.state.showNavModal(!mdl.state.showNavModal());
        }
      }, m(_Hamburger["default"], {
        mdl: mdl
      }));
    }
  };
};

var _default = Fab;
exports["default"] = _default;
});

;require.register("Layouts/footer.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var Footer = function Footer() {
  return {
    view: function view(_ref) {
      var mdl = _ref.attrs.mdl;
      return m("footer.footer.grid.card", m("section.row", m(".col-6", m("h2", "Connect with Bonham Acres via"), m(".container.grouped", m("a.row.underline.nav-link", {
        target: "__blank",
        href: "https://www.facebook.com/groups/BonhamAcres?modal=false&should_open_composer=false&hoisted_section_header_type=notifications&show_migration_preparation_dialog=false&show_migration_onboarding_dialog=false"
      }, m("img", {
        style: {
          width: "50px",
          height: "50px"
        },
        src: "icons/facebook.png"
      })), m("a.row.underline.nav-link", {
        target: "__blank",
        href: "https://nextdoor.com/neighborhood/bonhamacres--houston--tx/"
      }, m("img", {
        style: {
          width: "50px",
          height: "50px"
        },
        src: "icons/nextdoor.png"
      })), m("a.row.underline.nav-link", {
        target: "__blank",
        href: "http://mailto:bonhamacrescivicassociation@gmail.com/"
      }, m("img", {
        style: {
          width: "50px",
          height: "50px"
        },
        src: "icons/gmail.png"
      }))), m("p", "bonhamacrescivicassociation at gmail dot com"), m("p", "P O Box 2886"), m("p", "Bellaire, TX 77401")), m(".col-6", m("h3", "Useful Links"), m("ul", m("a.row.underline.nav-link", {
        target: "__blank",
        href: "https://www.bonhamacres.org/city-ordinances"
      }, "City of Houston City Ordinances"), m("a.row.underline.nav-link", {
        target: "__blank",
        href: "https://09ee40f4-9ff7-4e3d-819c-429f2403854d.filesusr.com/ugd/537320_f8abdef644b04cde8dc36f671bb9868f.pdf"
      }, "COH trash facts"), m("a.row.underline.nav-link", {
        target: "__blank",
        href: "https://www.houstontx.gov/solidwaste/Recycle_Cal.pdf"
      }, "COH recycling calendar Schedule B"), m("a.row.underline.nav-link", {
        target: "__blank",
        href: "https://mycity.maps.arcgis.com/apps/webappviewer/index.html?id=63ed96f439fe404387c9f9e479dc4965"
      }, "COH trash service day"), m("a.row.underline.nav-link", {
        target: "__blank",
        href: "http://www.houstontx.gov/solidwaste/treewaste.html"
      }, "COH tree and junk waste program"), m("a.row.underline.nav-link", {
        target: "__blank",
        href: "http://www.centerpointenergy.com/en-us/residential/customer-service/electric-outage-center/report-streetlight-outages?sa=ho"
      }, "Streetlight outage repair"), m("a.row.underline.nav-link", {
        target: "__blank",
        href: "http://www.hcad.org/"
      }, "Harris County Appraisal District"), m("a.row.underline.nav-link", {
        target: "__blank",
        href: "http://www.hcfcd.org/"
      }, "Harris County Flood Control District"), m("a.row.underline.nav-link", {
        target: "__blank",
        href: "https://09ee40f4-9ff7-4e3d-819c-429f2403854d.filesusr.com/ugd/537320_2472d77b27c640bfa348613b3aa86c95.pdf"
      }, "Construction in a Floodplain")))));
    }
  };
};

var _default = Footer;
exports["default"] = _default;
});

;require.register("Layouts/hero.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _images = _interopRequireDefault(require("../images"));

var _animations = require("Styles/animations");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var state = {
  image: Stream(0),
  start: Stream(null)
};

var calcHeight = function calcHeight(_ref) {
  var screenSize = _ref.settings.screenSize;

  switch (screenSize) {
    case "desktop":
      return "540px";

    case "tablet":
      return "340px";

    case "wide":
      return "340px";

    case "phone":
      return "340px";
  }
};

var calcMargin = function calcMargin(_ref2) {
  var screenSize = _ref2.settings.screenSize;

  switch (screenSize) {
    case "desktop":
      return "150px";

    case "tablet":
      return "90px";

    case "wide":
      return "70px";

    case "phone":
      return "30px";
  }
};

var updateBackground = function updateBackground() {
  if (Date.now() - state.start() > 5000) {
    state.start(Date.now());
    state.image() == _images["default"].length - 1 ? state.image(0) : state.image(state.image() + 1);
    m.redraw();
  }

  requestAnimationFrame(updateBackground);
};

var Hero = function Hero() {
  return {
    onremove: function onremove() {
      state.images(0);
      state.start(null);
      cancelAnimationFrame(updateBackground);
    },
    oncreate: function oncreate(_ref3) {
      var mdl = _ref3.attrs.mdl;
      state.start(Date.now());
      updateBackground();
    },
    view: function view(_ref4) {
      var mdl = _ref4.attrs.mdl;
      return m(".hero", {
        style: {
          marginTop: calcMargin(mdl)
        }
      }, m("img.hero-img.fade", {
        src: _images["default"][state.image()],
        onload: function onload(e) {
          return e.target.classList.replace("fadeout", "fade");
        },
        // onupdate: FadeBack,
        style: {
          height: calcHeight(mdl)
        }
      }), m("header", m("hgroup", m("h1", "Bonham Acres"), m("h2", "We are Houstons best kept secret"))));
    }
  };
};

var _default = Hero;
exports["default"] = _default;
});

;require.register("Layouts/index.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.fetchAll = void 0;

var _hero = _interopRequireDefault(require("./hero.js"));

var _navbar = _interopRequireDefault(require("./navbar.js"));

var _subnavbar = _interopRequireDefault(require("./subnavbar.js"));

var _main = _interopRequireDefault(require("./main.js"));

var _footer = _interopRequireDefault(require("./footer.js"));

var _navModal = _interopRequireDefault(require("./nav-modal.js"));

var _animations = require("Styles/animations.js");

var _toolbar = _interopRequireDefault(require("./toolbar.js"));

var _loginUser = _interopRequireDefault(require("Pages/Auth/login-user.js"));

var _registerUser = _interopRequireDefault(require("Pages/Auth/register-user.js"));

var _data = _interopRequireDefault(require("data.task"));

var _ramda = require("ramda");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var showNavMenu = function showNavMenu(mdl) {
  return mdl.settings.screenSize !== "desktop" && mdl.state.showNavModal();
};

var vertAlign = function vertAlign(mdl) {
  return !mdl.Routes.find(function (r) {
    return mdl.state.navState() == r.id;
  }).children.any() ? "is-vertical-align" : "";
};

var toEventViewModel = function toEventViewModel(event) {
  var start = event.start.split("T");
  return {
    image: event.image,
    startDate: (0, _ramda.head)(start),
    startTime: (0, _ramda.tail)(start),
    title: event.title,
    allDay: event.allDay,
    objectId: event.objectId
  };
};

var fetchTask = function fetchTask(mdl) {
  return function (url) {
    return mdl.http.back4App.getTask(mdl)(url);
  };
};

var fetchAll = function fetchAll(_ref) {
  var mdl = _ref.attrs.mdl;

  var onError = function onError(e) {
    return console.error(e);
  };

  var onSuccess = function onSuccess(_ref2) {
    var events = _ref2.events,
        images = _ref2.images,
        blogs = _ref2.blogs;
    mdl.data.events = events;
    mdl.data.images = images;
    mdl.data.blogs = blogs;
  };

  _data["default"].of(function (events) {
    return function (images) {
      return function (blogs) {
        return {
          events: events,
          images: images,
          blogs: blogs
        };
      };
    };
  }).ap(fetchTask(mdl)("Classes/Events").map((0, _ramda.prop)("results")).map((0, _ramda.map)(toEventViewModel))).ap(fetchTask(mdl)("Classes/Gallery").map((0, _ramda.prop)("results"))).ap(fetchTask(mdl)("Classes/Blogs").map((0, _ramda.prop)("results"))).fork(onError, onSuccess);
};

exports.fetchAll = fetchAll;
var Layout = {
  oninit: fetchAll,
  view: function view(_ref3) {
    var children = _ref3.children,
        mdl = _ref3.attrs.mdl;
    return m("#layout", {
      "data-theme": "light",
      id: "layout",
      role: "main"
    }, m(_toolbar["default"], {
      mdl: mdl
    }), m(_hero["default"], {
      mdl: mdl
    }), mdl.settings.screenSize == "desktop" && m("nav.navigation", {
      "class": vertAlign(mdl)
    }, m(_navbar["default"], {
      mdl: mdl
    }), m(_subnavbar["default"], {
      mdl: mdl
    })), m(_main["default"], {
      mdl: mdl,
      children: children
    }), showNavMenu(mdl) && m(_navModal["default"], {
      oncreate: _animations.SlideInLeft,
      onbeforeremove: _animations.SlideOutRight,
      mdl: mdl
    }), mdl.state.showAuthModal() == "login" && m(_loginUser["default"], {
      mdl: mdl
    }), mdl.state.showAuthModal() == "register" && m(_registerUser["default"], {
      mdl: mdl
    }), m(_footer["default"], {
      mdl: mdl
    }));
  }
};
var _default = Layout;
exports["default"] = _default;
});

;require.register("Layouts/main.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var Main = function Main() {
  return {
    view: function view(_ref) {
      var _ref$attrs = _ref.attrs,
          mdl = _ref$attrs.mdl,
          children = _ref$attrs.children;
      return m("main", m("section#page-title.is-marginless.bg-primary.text-white.is-vertical-align.is-horizontal-align.is-center", m("h1.text-center.bold.p-t-25", mdl.state.route.name)), children);
    }
  };
};

var _default = Main;
exports["default"] = _default;
});

;require.register("Layouts/nav-modal.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _clarity = require("@mithril-icons/clarity");

var _navLink = _interopRequireDefault(require("Components/nav-link"));

var _authbox = _interopRequireDefault(require("Components/authbox"));

var _index = require("Utils/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var navItemstate = {
  onHover: function onHover() {}
};

var toggleRoutes = function toggleRoutes(mdl) {
  return function (id) {
    var keys = Object.keys(mdl.navState);
    keys.map(function (k) {
      return id !== k && mdl.navState[k](false);
    });
    mdl.navState[id](!mdl.navState[id]());
  };
};

var NavItem = function NavItem() {
  return {
    view: function view(_ref) {
      var _ref$attrs = _ref.attrs,
          mdl = _ref$attrs.mdl,
          href = _ref$attrs.href,
          link = _ref$attrs.link,
          classList = _ref$attrs.classList;
      return m(_navLink["default"], _objectSpread(_objectSpread({
        mdl: mdl
      }, navItemstate), {}, {
        href: href,
        link: link,
        classList: classList
      }));
    }
  };
};

var getChildRoutes = function getChildRoutes(mdl, routeIds) {
  return mdl.Routes.filter(function (r) {
    return routeIds.includes(r.id);
  });
};

var NavSection = function NavSection(_ref2) {
  var _ref2$attrs = _ref2.attrs,
      mdl = _ref2$attrs.mdl,
      route = _ref2$attrs.route,
      toggleRoutes = _ref2$attrs.toggleRoutes;
  var childRoutes = getChildRoutes(mdl, route.children);
  return {
    view: function view(_ref3) {
      var isSelected = _ref3.attrs.isSelected;
      return m("details.grid.col-12.text-primary.animated.pointer", {
        "class": "primary",
        onclick: function onclick(e) {
          return toggleRoutes(mdl)(route.id);
        }
      }, m("summary.nav-link", route.name), m("nav.row.bd-primary.fade.p-x-l-50", childRoutes.map(function (r) {
        return r.group.includes("external") ? m("a.col-12 icon nav-link", {
          target: "_blank",
          href: r.external
        }, r.name, m(_clarity.PopOutLine, {
          margin: "8px",
          width: "15px",
          height: "15px"
        })) : m(NavItem, {
          mdl: mdl,
          href: r.route,
          link: r.name,
          classList: "".concat((0, _index.isActiveRoute)(r.route), " col-12")
        });
      })));
    }
  };
};

var NavModal = function NavModal(_ref4) {
  var mdl = _ref4.attrs.mdl;

  var routes = function routes(mdl) {
    return mdl.Routes.filter(function (r) {
      return r.group.includes("navmenu");
    });
  };

  var _domOverlay;

  var _domModal;

  return {
    view: function view(_ref5) {
      var mdl = _ref5.attrs.mdl;
      return m("section.modal-container.animated#nav-modal", {
        oncreate: function oncreate(_ref6) {
          var dom = _ref6.dom;
          return _domOverlay = dom;
        },
        onclick: function onclick(e) {
          if ([_domModal, _domOverlay].includes(e.target)) mdl.state.showNavModal(false);
        }
      }, m("article.modal.card", {
        oncreate: function oncreate(_ref7) {
          var dom = _ref7.dom;
          return _domModal = dom;
        },
        id: "nav-modal"
      }, m("header.header", m(_authbox["default"], {
        mdl: mdl
      })), m("nav.modal-content.row.animated", routes(mdl).map(function (r) {
        return r.children.any() ? m(NavSection, {
          mdl: mdl,
          route: r,
          toggleRoutes: toggleRoutes,
          isSelected: mdl.navState[r.id]
        }) : m(NavItem, {
          mdl: mdl,
          href: r.route,
          link: r.name,
          classList: "".concat((0, _index.isActiveRoute)(r.route), " col-12")
        });
      }))));
    }
  };
};

var _default = NavModal;
exports["default"] = _default;
});

;require.register("Layouts/navbar.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _navLink = _interopRequireDefault(require("Components/nav-link.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var isActiveRoute = function isActiveRoute(a, b) {
  return a == b ? "active button outline" : "";
};

var routes = function routes(mdl) {
  return mdl.Routes.filter(function (r) {
    return r.group.includes("navmenu");
  });
};

var Navbar = {
  view: function view(_ref) {
    var mdl = _ref.attrs.mdl;
    return m("nav.nav#navbar.is-full-width", routes(mdl).map(function (r) {
      return m(_navLink["default"], {
        // onmouseover: (e) => {
        //   mdl.state.navState(r.route)
        // },
        onclick: function onclick(e) {
          if (r.children.any()) {
            mdl.state.navState(r.id);
            e.stopPropagation();
            e.preventDefault();
          }
        },
        mdl: mdl,
        role: "button",
        href: r.route,
        link: r.name,
        classList: "primary clear ".concat(isActiveRoute("/".concat(mdl.state.navState()), r.route))
      });
    }));
  }
};
var _default = Navbar;
exports["default"] = _default;
});

;require.register("Layouts/subnavbar.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _clarity = require("@mithril-icons/clarity");

var _navLink = _interopRequireDefault(require("Components/nav-link.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var isActiveRoute = function isActiveRoute(a, b) {
  return a == b ? "active" : "";
};

var SubNavbar = function SubNavbar() {
  var subroutes = function subroutes(mdl) {
    return mdl.Routes.filter(function (r) {
      return r.isNav && r.group.includes(mdl.state.navState());
    });
  };

  return {
    view: function view(_ref) {
      var mdl = _ref.attrs.mdl;
      return subroutes(mdl).any() && m("nav.nav#sub-navbar.is-full-width", subroutes(mdl).map(function (r) {
        return r.group.includes("external") ? m("a.clear.nav-link", {
          target: "_blank",
          href: r.external
        }, r.name, m(_clarity.PopOutLine, {
          margin: "8px",
          width: "15px",
          height: "15px"
        })) : m(_navLink["default"], {
          mdl: mdl,
          href: r.route,
          link: r.name,
          classList: "clear ".concat(isActiveRoute(mdl.state.subnavState(), r.route))
        });
      }));
    }
  };
};

var _default = SubNavbar;
exports["default"] = _default;
});

;require.register("Layouts/toolbar.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Hamburger = _interopRequireDefault(require("Components/Hamburger.js"));

var _authbox = _interopRequireDefault(require("Components/authbox.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Toolbar = function Toolbar() {
  return {
    view: function view(_ref) {
      var mdl = _ref.attrs.mdl;
      return m("nav#toolbar.sticky-nav.nav.is-horizontal-align", {
        style: {
          "background-color": mdl.state.showNavModal() ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0.9)"
        }
      }, m(".nav-left.is-left", m("figure.pointer.scale-2", m(m.route.Link, {
        selector: "img",
        "class": "width-auto",
        id: "nav-logo",
        href: "/",
        src: "images/logo.webp"
      }))), mdl.settings.screenSize == "desktop" ? m(".nav-right", m(_authbox["default"], {
        mdl: mdl
      })) : m(".nav-right is-right", {
        onclick: function onclick() {
          return mdl.state.showNavModal(!mdl.state.showNavModal());
        }
      }, m(_Hamburger["default"], {
        mdl: mdl
      })));
    }
  };
};

var _default = Toolbar;
exports["default"] = _default;
});

;require.register("Models/Main.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _index = _interopRequireDefault(require("../Routes/index.js"));

var _http = _interopRequireDefault(require("Utils/http"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var data = {
  events: [],
  images: [],
  blogs: [],
  account: {
    profile: {},
    dues: [],
    messages: []
  }
};
var state = {
  paginate: {
    page: Stream(1),
    total_pages: Stream(0),
    total_results: Stream(0)
  },
  query: Stream(""),
  isLoading: Stream(false),
  loadingProgress: {
    max: Stream(null),
    value: Stream(null)
  },
  dragging: {},
  isAuth: Stream(false),
  navSelected: Stream(""),
  showNavModal: Stream(false),
  navState: Stream("/home"),
  subnavState: Stream(""),
  image: Stream(0),
  fab: Stream(0),
  editBlog: Stream(false),
  showAuthModal: Stream(false),
  selectedPreviewEvent: Stream(null)
};
var user = {
  role: "user"
};
var settings = {};
var errors = {};
var Model = {
  http: _http["default"],
  Routes: _index["default"],
  state: state,
  user: user,
  data: data,
  errors: errors,
  settings: settings,
  paypal: {},
  toggleUserModal: function toggleUserModal(mdl) {
    return mdl.state.showUserModal(!mdl.state.showUserModal());
  },
  toggleAuthModal: function toggleAuthModal(mdl) {
    return mdl.state.showAuthModal(!mdl.state.showAuthModal());
  },
  toggleNavModal: function toggleNavModal(mdl) {
    return mdl.state.showNavModal(!mdl.state.showNavModal());
  }
};
var _default = Model;
exports["default"] = _default;
});

;require.register("Models/index.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Main = _interopRequireDefault(require("./Main"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = _Main["default"];
exports["default"] = _default;
});

;require.register("Pages/Account/index.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _profile = _interopRequireDefault(require("./profile"));

var _model = require("./model");

var _table = require("Components/table.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var nav = function nav() {
  return ["profile", "dues", "messages"];
};

var state = {
  tab: "profile",
  status: "loading"
};

var loadAll = function loadAll(mdl) {
  var onSuccess = function onSuccess(_ref) {
    var profile = _ref.profile,
        dues = _ref.dues,
        messages = _ref.messages;
    mdl.data.profile = profile;
    mdl.data.dues = dues;
    mdl.data.messages = messages;
    state.status = "success";
    console.log(state, mdl);
  };

  var onError = function onError(e) {
    state.status = "error";
    console.error("issues w fetching data", e);
  };

  (0, _model.loadAllTask)(mdl).fork(onError, onSuccess);
};

var Account = function Account() {
  return {
    //future add param to quick nav the state.tab to messages pane.
    oninit: function oninit(_ref2) {
      var mdl = _ref2.attrs.mdl;
      return loadAll(mdl);
    },
    view: function view(_ref3) {
      var mdl = _ref3.attrs.mdl;
      return m("section", state.status == "error" && m("ERROR"), state.status == "loading" && m("loading"), state.status == "success" && m("section", m("nav.tabs", nav(mdl.user.role).map(function (tab) {
        return m("a.tab.pointer", {
          "class": state.tab == tab ? "active" : "",
          onclick: function onclick() {
            return state.tab = tab;
          }
        }, tab.toUpperCase());
      })), m("section.container", state.tab == "profile" && m(_profile["default"], {
        mdl: mdl,
        data: mdl.data.profile
      }), state.tab == "dues" && m(_table.Table, _objectSpread({
        mdl: mdl
      }, (0, _table.formatDataForTable)(mdl.data.dues))), state.tab == "messages" && m(_table.Table, _objectSpread({
        mdl: mdl
      }, (0, _table.formatDataForTable)(mdl.data.messages))))));
    }
  };
};

var _default = Account;
exports["default"] = _default;
});

;require.register("Pages/Account/model.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadAllTask = void 0;

var _Utils = require("Utils");

var _ramda = require("ramda");

var _cjs = require("@mithril-icons/clarity/cjs");

var _clarity = require("@mithril-icons/clarity");

var _data = _interopRequireDefault(require("data.task"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var toProfileVM = function toProfileVM(_ref) {
  var emailVerified = _ref.emailVerified,
      email = _ref.email,
      name = _ref.name;
  return function (_ref2) {
    var avatar = _ref2.avatar,
        _ref2$address = _ref2.address,
        street = _ref2$address.street,
        city = _ref2$address.city,
        state = _ref2$address.state,
        zip = _ref2$address.zip;
    return {
      street: street,
      city: city,
      state: state,
      zip: zip,
      emailVerified: emailVerified,
      email: email,
      name: name,
      avatar: avatar
    };
  };
};

var getProfile = function getProfile(mdl) {
  return function (id) {
    return mdl.http.back4App.getTask(mdl)("classes/Accounts?".concat(id)).map((0, _ramda.prop)("results")).map(_ramda.head).map(toProfileVM(mdl.user));
  };
};

var toDuesVM = function toDuesVM(dues) {
  return dues;
};

var getDues = function getDues(mdl) {
  return function (id) {
    return mdl.http.back4App.getTask(mdl)("classes/Dues?".concat(id)).map((0, _ramda.prop)("results")).map((0, _ramda.map)(toDuesVM));
  };
};

var toMessagesVM = function toMessagesVM(dues) {
  return dues;
};

var getMessages = function getMessages(mdl) {
  return function (id) {
    return mdl.http.back4App.getTask(mdl)("classes/Messages?".concat(id)).map((0, _ramda.prop)("results")).map((0, _ramda.map)(toMessagesVM));
  };
};

var loadAllTask = function loadAllTask(mdl) {
  var id = encodeURI("where={\"userId\":\"".concat(mdl.user.objectId, "\"}"));
  return _data["default"].of(function (profile) {
    return function (dues) {
      return function (messages) {
        console.log(profile);
        return {
          profile: profile,
          dues: dues,
          messages: messages
        };
      };
    };
  }).ap(getProfile(mdl)(id)).ap(getDues(mdl)(id)).ap(getMessages(mdl)(id));
};

exports.loadAllTask = loadAllTask;
});

;require.register("Pages/Account/profile.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var Profile = function Profile() {
  return {
    view: function view(_ref) {
      var _ref$attrs = _ref.attrs,
          mdl = _ref$attrs.mdl,
          data = _ref$attrs.data;
      console.log(data);
      return m("form", m("figure", m("img.avatar", {
        src: data.avatar
      })), !data.emailVerified && m("label.warning", "email not verified"), m("label", "name", m("input", {
        value: data.name
      })), m("label", "email", m("input", {
        value: data.email
      })), m("label", "street", m("input", {
        value: data.street
      })), m("label", "city", m("input", {
        value: data.city
      })), m("label", "state", m("input", {
        value: data.state
      })), m("label", "zip", m("input", {
        value: data.zip
      })), m("button", "Update"));
    }
  };
};

var _default = Profile;
exports["default"] = _default;
});

;require.register("Pages/Auth/Validations.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateLoginTask = exports.validateUserRegistrationTask = void 0;

var _ramda = require("ramda");

var _data = require("data.validation");

var _Utils = require("Utils");

var ValidateRegistration = (0, _data.Success)((0, _ramda.curryN)(3, _ramda.identity));
var ValidateLogin = (0, _data.Success)((0, _ramda.curryN)(2, _ramda.identity));
var nameLense = (0, _ramda.lensProp)("name");
var passwordLense = (0, _ramda.lensProp)("password");
var passwordConfirmLense = (0, _ramda.lensProp)("confirmPassword");
var emailLense = (0, _ramda.lensProp)("email");
var emailConfirmLense = (0, _ramda.lensProp)("confirmEmail");
var NAME_REQUIRED_MSG = "A Name is required";
var PASSWORD_REQUIRED_MSG = "A Password is required";
var EMAIL_REQUIRED_MSG = "An Email is required";
var EMAILS_MUST_MATCH = "Emails do not match";
var INVALID_EMAIL_FORMAT = "Email must be a valid format";
var PASSWORDS_MUST_MATCH = "Passwords do not match";

var inputsMatch = function inputsMatch(input1) {
  return function (input2) {
    return input2 === input1;
  };
};

var validateName = function validateName(data) {
  return (0, _data.Success)(data).apLeft((0, _Utils.validate)(_Utils.isRequired, nameLense, NAME_REQUIRED_MSG, data));
};

var validateEmails = function validateEmails(data) {
  return (0, _data.Success)(data).apLeft((0, _Utils.validate)(_Utils.isRequired, emailLense, EMAIL_REQUIRED_MSG, data)).apLeft((0, _Utils.validate)(_Utils.isRequired, emailConfirmLense, EMAIL_REQUIRED_MSG, data)).apLeft((0, _Utils.validate)(inputsMatch(data.confirmEmail), emailLense, EMAILS_MUST_MATCH, data)).apLeft((0, _Utils.validate)(inputsMatch(data.email), emailConfirmLense, EMAILS_MUST_MATCH, data)).apLeft((0, _Utils.validate)(_Utils.emailFormat, emailConfirmLense, INVALID_EMAIL_FORMAT, data)).apLeft((0, _Utils.validate)(_Utils.emailFormat, emailLense, INVALID_EMAIL_FORMAT, data));
};

var validateEmail = function validateEmail(data) {
  return (0, _data.Success)(data).apLeft((0, _Utils.validate)(_Utils.isRequired, emailLense, EMAIL_REQUIRED_MSG, data)).apLeft((0, _Utils.validate)(_Utils.emailFormat, emailLense, INVALID_EMAIL_FORMAT, data));
};

var validatePasswords = function validatePasswords(data) {
  return (0, _data.Success)(data).apLeft((0, _Utils.validate)(_Utils.isRequired, passwordLense, PASSWORD_REQUIRED_MSG, data)).apLeft((0, _Utils.validate)(_Utils.isRequired, passwordConfirmLense, PASSWORD_REQUIRED_MSG, data)).apLeft((0, _Utils.validate)(inputsMatch(data.password), passwordConfirmLense, PASSWORDS_MUST_MATCH, data)).apLeft((0, _Utils.validate)(inputsMatch(data.confirmPassword), passwordLense, PASSWORDS_MUST_MATCH, data));
};

var validatePassword = function validatePassword(data) {
  return (0, _data.Success)(data).apLeft((0, _Utils.validate)(_Utils.isRequired, passwordLense, PASSWORD_REQUIRED_MSG, data));
};

var validateUserRegistrationTask = function validateUserRegistrationTask(data) {
  return ValidateRegistration.ap(validateName(data)).ap(validateEmails(data)).ap(validatePasswords(data)).failureMap(_ramda.mergeAll).toTask();
};

exports.validateUserRegistrationTask = validateUserRegistrationTask;

var validateLoginTask = function validateLoginTask(data) {
  return ValidateLogin.ap(validateEmail(data)).ap(validatePassword(data)).failureMap(_ramda.mergeAll).toTask();
};

exports.validateLoginTask = validateLoginTask;
});

;require.register("Pages/Auth/fns.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMessagesTask = exports.createDuesTask = exports.createAccountTask = exports.registerUserTask = exports.loginTask = exports.loginUserTask = void 0;

var _data = _interopRequireDefault(require("data.task"));

var _ramda = require("ramda");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var setUserAndSessionToken = function setUserAndSessionToken(mdl) {
  return function (user) {
    sessionStorage.setItem("baca-user", JSON.stringify(user.objectId));
    sessionStorage.setItem("baca-session-token", user["sessionToken"]);
    mdl.state.isAuth(true);
    mdl.user = user;
    return mdl;
  };
};

var loginUserTask = function loginUserTask(mdl) {
  return function (_ref) {
    var email = _ref.email,
        password = _ref.password;
    var login = encodeURI("username=".concat(email, "&password=").concat(btoa(password)));
    return mdl.http.back4App.getTask(mdl)("login?".concat(login)).map(setUserAndSessionToken(mdl));
  };
};

exports.loginUserTask = loginUserTask;

var getUserAccountTask = function getUserAccountTask(mdl) {
  return function (encodeId) {
    return mdl.http.back4App.getTask(mdl)("classes/Accounts?".concat(encodeId)).map((0, _ramda.prop)("results")).chain(function (account) {
      return account.any() ? _data["default"].of(account) : createAccountTask(mdl);
    }).map(_ramda.head);
  };
};

var getUserDuesTask = function getUserDuesTask(mdl) {
  return function (encodeId) {
    return mdl.http.back4App.getTask(mdl)("classes/Dues?".concat(encodeId)).map((0, _ramda.prop)("results"));
  };
}; // .chain((dues) => (dues.any() ? Task.of(dues) : createDuesTask(mdl)))


var getUserMessagesTask = function getUserMessagesTask(mdl) {
  return function (encodeId) {
    return mdl.http.back4App.getTask(mdl)("classes/Messages?".concat(encodeId)).map((0, _ramda.prop)("results"));
  };
}; // .chain((messages) =>
//   messages.any() ? Task.of(messages) : createMessagesTask(mdl)
// )


var getUserInfoTask = function getUserInfoTask(mdl) {
  var encodeId = encodeURI("where={\"userId\":\"".concat(mdl.user.objectId, "\"}"));
  return _data["default"].of(function (account) {
    return function (dues) {
      return function (messages) {
        mdl.data.account = account;
        mdl.data.dues = dues;
        mdl.data.messages = messages;
      };
    };
  }).ap(getUserAccountTask(mdl)(encodeId)).ap(getUserDuesTask(mdl)(encodeId)).ap(getUserMessagesTask(mdl)(encodeId));
};

var loginTask = function loginTask(mdl) {
  return function (_ref2) {
    var email = _ref2.email,
        password = _ref2.password;
    return loginUserTask(mdl)({
      email: email,
      password: password
    }).chain(function (_) {
      return getUserInfoTask(mdl);
    });
  };
};

exports.loginTask = loginTask;

var registerUserTask = function registerUserTask(mdl) {
  return function (_ref3) {
    var name = _ref3.name,
        email = _ref3.email,
        password = _ref3.password,
        role = _ref3.role;
    return mdl.http.back4App.postTask(mdl)("users")({
      username: email,
      name: name,
      email: email,
      password: btoa(password),
      role: role
    });
  };
};

exports.registerUserTask = registerUserTask;

var createAccountTask = function createAccountTask(mdl) {
  mdl.user.account = {
    address: {},
    avatar: "https://i.ibb.co/6W0zsZH/avatar.webp"
  };
  return mdl.http.back4App.postTask(mdl)("classes/Accounts")({
    userId: mdl.user.objectId,
    avatar: "https://i.ibb.co/6W0zsZH/avatar.webp",
    address: {
      street: "",
      city: "",
      state: "",
      zip: ""
    }
  }).map(function (_ref4) {
    var objectId = _ref4.objectId;
    mdl.user.account.objectId = objectId;
    return mdl;
  });
};

exports.createAccountTask = createAccountTask;

var createDuesTask = function createDuesTask(mdl) {
  mdl.user.dues = {};
  return mdl.http.back4App.postTask(mdl)("classes/Dues")({
    userId: mdl.user.objectId,
    address: {}
  }).map(function (_ref5) {
    var objectId = _ref5.objectId;
    mdl.user.dues.objectId = objectId;
    return mdl;
  });
};

exports.createDuesTask = createDuesTask;

var createMessagesTask = function createMessagesTask(mdl) {
  mdl.user.messages = {};
  return mdl.http.back4App.postTask(mdl)("classes/Messages")({
    userId: mdl.user.objectId
  }).map(function (_ref6) {
    var objectId = _ref6.objectId;
    mdl.user.messages.objectId = objectId;
    return mdl;
  });
};

exports.createMessagesTask = createMessagesTask;
});

;require.register("Pages/Auth/login-user.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.Login = void 0;

var _navLink = _interopRequireDefault(require("Components/nav-link"));

var _Utils = require("Utils");

var _Validations = require("./Validations.js");

var _fns = require("./fns.js");

var _clarity = require("@mithril-icons/clarity");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// import LogoLoader from "Components/LogoLoader"
var validateForm = function validateForm(mdl) {
  return function (data) {
    var onError = function onError(errs) {
      if (errs.code != 209) {
        state.errors = errs;
        state.errorMsg(errs.error);
        state.showErrorMsg(errs.error);
        console.log("failed - state", JSON.stringify(state));
      } else {
        state.errorMsg("There seems to be an issue with logging in. Have you registered or verified your email?");
        state.showErrorMsg(true);
        console.log("failed - other?", state);
      }
    };

    var onSuccess = function onSuccess(mdl) {
      return function (_) {
        state.errors = {};
        m.route.set("/");
      };
    };

    state.isSubmitted = true;
    (0, _Validations.validateLoginTask)(data.userModel).chain((0, _fns.loginTask)(mdl)).fork(onError, onSuccess(mdl));
  };
};

var userModel = {
  name: "",
  email: "",
  password: "",
  confirmEmail: "",
  confirmPassword: "",
  role: "user"
};
var dataModel = {
  userModel: userModel
};
var state = {
  isSubmitted: false,
  errors: {},
  httpError: undefined,
  data: (0, _Utils.jsonCopy)(dataModel),
  showErrorMsg: Stream(false),
  errorMsg: Stream("")
};

var resetState = function resetState() {
  state.data = (0, _Utils.jsonCopy)(dataModel);
  state.errors = {};
  state.httpError = undefined;
  state.isSubmitted = false;
  state.showErrorMsg(false);
  state.errorMsg("");
};

var Login = function Login() {
  return {
    onremove: function onremove() {
      return resetState();
    },
    view: function view(_ref) {
      var mdl = _ref.attrs.mdl;
      return mdl.state.isLoading() ? "" //m(LogoLoader, { mdl })
      : m("section.container", state.showErrorMsg() && m("code.warning", state.errorMsg()), m("article.card", m("form", {
        role: "form",
        id: "login-form",
        onsubmit: function onsubmit(e) {
          return e.preventDefault();
        }
      }, m("formgroup", {
        "class": mdl.settings.screenSize == "desktop" && "grouped"
      }, m("input", {
        "class": state.isSubmitted ? state.errors.email ? "error" : "success" : "",
        id: "reg-email",
        type: "email",
        placeholder: "Email",
        onkeyup: function onkeyup(e) {
          // state.isSubmitted && validateForm(mdl)(state.data)
          state.data.userModel.email = e.target.value;
        },
        value: state.data.userModel.email
      }), state.errors.email && m("code.warning", state.errors.email), m("input", {
        "class": state.isSubmitted ? state.errors.password ? "error" : "success" : "",
        id: "reg-pass",
        type: "password",
        placeholder: "Password",
        onkeyup: function onkeyup(e) {
          // state.isSubmitted && validateForm(mdl)(state.data)
          state.data.userModel.password = e.target.value;
        },
        value: state.data.userModel.password
      }), state.errors.password && m("code.warning", state.errors.password)), m("button.button.primary.is-center", {
        role: "button",
        form: "login-form",
        onclick: function onclick() {
          return validateForm(mdl)(state.data);
        },
        "class": mdl.state.isLoading() && "loading"
      }, "LOGIN"), state.httpError && m(".toast toast-error", state.httpError)), m(".auth-link", "Need to ", m("u", m(_navLink["default"], {
        mdl: mdl,
        href: "/register",
        link: "register",
        classList: ""
      })), " ?")));
    }
  };
};

exports.Login = Login;
var _default = Login;
exports["default"] = _default;
});

;require.register("Pages/Auth/register-user.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.Register = exports.validateForm = void 0;

var _navLink = _interopRequireDefault(require("Components/nav-link"));

var _Utils = require("Utils");

var _Validations = require("./Validations");

var _fns = require("./fns.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// import LogoLoader from "Components/LogoLoader"
var userModel = {
  name: "",
  email: "",
  password: "",
  confirmEmail: "",
  confirmPassword: "",
  role: "user"
};
var dataModel = {
  userModel: userModel
};
var state = {
  isSubmitted: false,
  errors: {},
  httpError: undefined,
  data: (0, _Utils.jsonCopy)(dataModel),
  showErrorMsg: Stream(false),
  errorMsg: Stream("")
};

var resetState = function resetState() {
  state.data.userModel = (0, _Utils.jsonCopy)(dataModel);
  state.errors = {};
  state.httpError = undefined;
  state.isSubmitted = false;
  state.showErrorMsg(false);
  state.errorMsg("");
};

var validateForm = function validateForm(mdl) {
  return function (data) {
    var onError = function onError(errs) {
      if (errs) {
        state.errors = errs;
        state.errorMsg(errs.error);
        state.showErrorMsg(errs.error);
        console.log("failed - state", JSON.stringify(state));
      } else {
        state.errorMsg("There seems to be an ssue with logging in. Have you registered?");
        state.showErrorMsg(true);
        console.log("failed - state", state);
      }
    };

    var onSuccess = function onSuccess(mdl) {
      state.errors = {}; // sessionStorage.setItem("baca-session-token", mdl.user["sessionToken"])
      // sessionStorage.setItem("baca-user", JSON.stringify(mdl.user.objectId))

      state.errorMsg("Successfully registered - please check the email you used to register with for the verification link. After you have verified you may login.");
      state.showErrorMsg(true);
    }; // return console.log(data)


    state.isSubmitted = true;
    (0, _Validations.validateUserRegistrationTask)(data).chain((0, _fns.registerUserTask)(mdl)) // .chain(createAccountTask)
    .fork(onError, onSuccess);
  };
};

exports.validateForm = validateForm;

var Register = function Register() {
  return {
    onremove: function onremove() {
      return resetState();
    },
    view: function view(_ref) {
      var mdl = _ref.attrs.mdl;
      return m("section.container", state.showErrorMsg() && m("code.warning", state.errorMsg()), m("form", {
        role: "form",
        id: "register-form",
        onsubmit: function onsubmit(e) {
          return e.preventDefault();
        }
      }, m("input", {
        "class": state.isSubmitted ? state.errors.name ? "error" : "success" : "",
        id: "reg-name",
        type: "text",
        placeholder: "Full Name",
        onkeyup: function onkeyup(e) {
          return state.data.userModel.name = e.target.value;
        },
        value: state.data.userModel.name
      }), state.errors.name && m("code.error", state.errors.name), m("form-group", {
        "class": mdl.settings.screenSize == "desktop" && "grouped"
      }, m("input", {
        "class": state.isSubmitted ? state.errors.email ? "error" : "success" : "",
        id: "reg-email",
        type: "email",
        placeholder: "Email",
        onkeyup: function onkeyup(e) {
          return state.data.userModel.email = e.target.value;
        },
        value: state.data.userModel.email
      }), state.errors.email && m("code.error", state.errors.email), m("input", {
        id: "confirmEmail",
        "class": state.isSubmitted ? state.errors.confirmEmail ? "error" : "success" : "",
        type: "email",
        placeholder: "Confirm Email",
        onkeyup: function onkeyup(e) {
          return state.data.userModel.confirmEmail = e.target.value;
        },
        value: state.data.userModel.confirmEmail
      })), state.errors.confirmEmail && m("code.error", state.errors.confirmEmail), m("form-group", {
        "class": mdl.settings.screenSize == "desktop" && "grouped"
      }, m("input", {
        "class": state.isSubmitted ? state.errors.password ? "error" : "success" : "",
        id: "reg-pass",
        type: "password",
        placeholder: "Password",
        onkeyup: function onkeyup(e) {
          return state.data.userModel.password = e.target.value;
        },
        value: state.data.userModel.password
      }), state.errors.password && m("code.error", state.errors.password), m("input", {
        "class": state.isSubmitted ? state.errors.confirmPassword ? "error" : "success" : "",
        id: "pass-confirm",
        type: "password",
        placeholder: "Confirm Password",
        onkeyup: function onkeyup(e) {
          return state.data.userModel.confirmPassword = e.target.value;
        },
        value: state.data.userModel.confirmPassword
      })), state.errors.confirmPassword && m("code.error", state.errors.confirmPassword), m("button.button.primary", {
        form: "register-form",
        onclick: function onclick() {
          return validateForm(mdl)(state.data.userModel);
        },
        "class": mdl.state.isLoading() && "loading"
      }, "Register")), m(".auth-link", "Need to ", m(_navLink["default"], {
        mdl: mdl,
        href: "/login",
        link: "Login",
        classList: ""
      }), " ?"), state.httpError && m(".toast toast-error", state.httpError));
    }
  };
};

exports.Register = Register;
var _default = Register;
exports["default"] = _default;
});

;require.register("Pages/Blog/blog-editor.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Utils = require("Utils");

var _data = _interopRequireDefault(require("data.task"));

var _jodit = require("jodit");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var state = {
  jodit: null,
  editor: "",
  title: "",
  author: "",
  text: "",
  img: "",
  thumb: "",
  file: null,
  showModal: Stream(false),
  images: [],
  modalState: Stream("upload"),
  showPreview: Stream(false),
  isEditing: Stream(false),
  showHelp: Stream(false),
  errors: {
    img: null
  }
};

var resetModalState = function resetModalState(state) {
  state.images = [];
  state.modalState("upload");
};

var resetEditorState = function resetEditorState(state) {
  state.title = "";
  state.author = "";
  state.text = "";
  state.img = "";
  state.thumb = "";
  state.file = null;
  state.jodit.value = null;
  state.showPreview(false);
  state.isEditing(false);
  state.showModal(false);
  state.showHelp(false);
};

var fetchBlogImages = function fetchBlogImages(_ref) {
  var _ref$attrs = _ref.attrs,
      mdl = _ref$attrs.mdl,
      state = _ref$attrs.state;

  var onError = function onError(e) {
    return console.log(e);
  };

  var onSuccess = function onSuccess(_ref2) {
    var results = _ref2.results;
    return state.images = results;
  };

  mdl.http.back4App.getTask(mdl)("Classes/Gallery").fork(onError, onSuccess);
};

var setupEditor = function setupEditor(_ref3) {
  var mdl = _ref3.attrs.mdl;

  var onError = function onError(e) {
    return console.log(e);
  };

  var onSuccess = function onSuccess(_ref4) {
    var title = _ref4.title,
        text = _ref4.text,
        img = _ref4.img,
        thumb = _ref4.thumb,
        objectId = _ref4.objectId;
    state.title = title;
    state.text = text;
    state.img = img;
    state.thumb = thumb;
    state.objectId = objectId;
    state.jodit.value = state.text;
  };

  var id = m.route.get().split(":")[1];

  if ((0, _Utils.exists)(id)) {
    state.isEditing(true);
    mdl.http.back4App.getTask(mdl)("Classes/Blogs/".concat(id)).fork(onError, onSuccess);
  }
};

var isInvalid = function isInvalid() {
  return !(0, _Utils.exists)(state.title) || !(0, _Utils.exists)(state.text);
};

var onSubmitError = function onSubmitError(e) {
  return state.errors.img = e;
};

var onImgSuccess = function onImgSuccess(_ref5) {
  var image = _ref5.image,
      thumb = _ref5.thumb;
  state.img = image;
  state.thumb = thumb;
  state.showModal(false);
};

var saveImgToGalleryTask = function saveImgToGalleryTask(mdl) {
  return function (_ref6) {
    var _ref6$data = _ref6.data,
        image = _ref6$data.image,
        thumb = _ref6$data.thumb;
    return mdl.http.back4App.postTask(mdl)("Classes/Gallery")({
      album: "blog",
      image: image.url,
      thumb: thumb.url
    }).chain(function (_) {
      return _data["default"].of({
        image: image.url,
        thumb: thumb.url
      });
    });
  };
};

var uploadImage = function uploadImage(mdl) {
  return function (file) {
    var image = new FormData();
    image.append("image", file);
    mdl.http.imgBB.postTask(mdl)(image).chain(saveImgToGalleryTask(mdl)).fork(onSubmitError, onImgSuccess);
  };
};

var handleImage = function handleImage(mdl) {
  return function (file) {
    return file ? uploadImage(mdl)(file) : state.showModal(false);
  };
};

var toBlogs = function toBlogs() {
  return m.route.set("/social/blog");
};

var onSubmitSuccess = function onSubmitSuccess() {
  return toBlogs();
};

var submitBlog = function submitBlog(mdl) {
  return function (_ref7) {
    var title = _ref7.title,
        img = _ref7.img,
        text = _ref7.text,
        thumb = _ref7.thumb;
    var dto = {
      title: title,
      img: img,
      text: text,
      author: mdl.user.name,
      thumb: thumb
    };
    var updateOrSubmitBlog = state.objectId ? mdl.http.back4App.putTask(mdl)("Classes/Blogs/".concat(state.objectId))(dto) : mdl.http.back4App.postTask(mdl)("Classes/Blogs")(dto);
    updateOrSubmitBlog.fork(onSubmitError, onSubmitSuccess);
  };
};

var assignImg = function assignImg(img, thumb) {
  if (state.img == img) {
    state.img = "";
    state.thumb = "";
  } else {
    state.img = img;
    state.thumb = thumb;
  }
};

var deleteBlog = function deleteBlog(mdl) {
  return mdl.http.back4App.deleteTask(mdl)("Classes/Blogs/".concat(state.objectId)).fork(toBlogs, toBlogs);
};

var Modal = function Modal() {
  return {
    onremove: function onremove() {
      return resetModalState(state);
    },
    oninit: fetchBlogImages,
    view: function view(_ref8) {
      var _ref8$attrs = _ref8.attrs,
          mdl = _ref8$attrs.mdl,
          state = _ref8$attrs.state;
      return m("section.modal-container", m("article.modal.card.grid", m("header.modal-header", m("nav", m(".tabs", m("a.pointer.".concat(state.modalState() == "upload" ? "active" : ""), {
        onclick: function onclick(e) {
          e.stopPropagation();
          state.modalState("upload");
        }
      }, "Upload New Image"), m("a.pointer.".concat(state.modalState() == "select" ? "active" : ""), {
        onclick: function onclick(e) {
          e.stopPropagation();
          state.modalState("select");
        }
      }, "Select From Database")))), m("section.modal-content", m("form.grid", state.modalState() == "upload" ? m("input", {
        type: "file",
        id: "file"
      }) : state.images.map(function (_ref9) {
        var image = _ref9.image,
            thumb = _ref9.thumb;
        return m("figure.col-6.button.".concat(thumb == state.thumb ? "primary" : "outline"), {
          onclick: function onclick(e) {
            e.preventDefault();
            e.stopPropagation();
            assignImg(image, thumb);
          }
        }, m("img", {
          src: thumb
        }));
      }))), m("section.modal-footer", m(".tabs grouped", m("button.button", {
        onclick: function onclick() {
          return state.showModal(false);
        }
      }, "Cancel"), m("button.button.primary", {
        onclick: function onclick(e) {
          e.preventDefault();
          handleImage(mdl)(state.file);
        },
        role: "button",
        disabled: !state.file && !(0, _Utils.exists)(state.img)
      }, state.modalState() == "select" ? "Use" : "Upload")))));
    }
  };
};

var BlogEditor = function BlogEditor() {
  var onInput = (0, _Utils.handlers)(["oninput"], function (e) {
    if (e.target.id == "file") {
      state[e.target.id] = e.target.files[0];
    } else {
      state[e.target.id] = e.target.value;
    }
  });
  return {
    onremove: function onremove() {
      return resetEditorState(state);
    },
    oninit: setupEditor,
    view: function view(_ref10) {
      var mdl = _ref10.attrs.mdl;
      // console.log(JSON.stringify(state))
      return m(".grid", m("form.container", _objectSpread({}, onInput), m("section", m("label", "Title", m("input", {
        id: "title",
        value: state.title
      }))), m("section", state.thumb && m("aside", m("img", {
        src: state.thumb
      })), m("button.primary", {
        onclick: function onclick(e) {
          e.preventDefault();
          state.showModal(!state.showModal());
        }
      }, state.thumb ? "Update Image" : "Add An Image")), state.showModal() && m(Modal, {
        state: state,
        mdl: mdl
      }), m("section", m("label", "Contents"), m("#jodit", {
        onupdate: function onupdate(e) {
          return state.text = state.jodit.value;
        },
        oncreate: function oncreate(_ref11) {
          var dom = _ref11.dom;
          state.jodit = new _jodit.Jodit(dom, {
            autofocus: true,
            uploader: {
              insertImageAsBase64URI: true
            },
            toolbarButtonSize: "large",
            defaultActionOnPaste: "insert_clear_html"
          });
        }
      })), m("nav.container.grouped.is-center", m(m.route.Link, {
        selector: "button.button.secondary",
        href: "/social/blog"
      }, "Cancel"), m("button.button.primary", {
        disabled: isInvalid(),
        onclick: function onclick(e) {
          e.preventDefault();
          submitBlog(mdl)(state);
        }
      }, state.objectId ? "Update" : "Submit"), state.isEditing() && m("button.button.error", {
        onclick: function onclick(e) {
          return deleteBlog(mdl);
        }
      }, "Delete"))));
    }
  };
};

var _default = BlogEditor;
exports["default"] = _default;
});

;require.register("Pages/Blog/blog-post.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _clarity = require("@mithril-icons/clarity");

var _Utils = require("Utils");

var _blog = require("./blog");

var _loader = _interopRequireDefault(require("Components/loader.js"));

var _ramda = require("ramda");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var state = {
  blog: null
};

var toBlogs = function toBlogs() {
  return m.route.set("/social/blog");
};

var deleteBlog = function deleteBlog(mdl) {
  return mdl.http.back4App.deleteTask(mdl)("Classes/Blogs/".concat(state.blog.objectId)).fork(toBlogs, toBlogs);
};

var fetchBlogPost = function fetchBlogPost(_ref) {
  var mdl = _ref.attrs.mdl;

  var onError = function onError(e) {
    return console.log(e);
  };

  var onSuccess = function onSuccess(_ref2) {
    var _ref3 = _slicedToArray(_ref2, 1),
        blog = _ref3[0];

    return state.blog = blog;
  };

  var id = m.route.get().split(":")[1]; // return console.log(id, m.route.params)

  mdl.http.back4App.getTask(mdl)("Classes/Blogs/".concat(id)).map(Array.of).map(_blog.toViewModel).fork(onError, onSuccess);
};

var BlogPost = {
  oninit: fetchBlogPost,
  view: function view(_ref4) {
    var mdl = _ref4.attrs.mdl;
    return mdl.state.isLoading() ? m(_loader["default"]) : m("section.p-y-6.fade", m("article.bg-light", m("section.row.container", m("hgroup.col", m("h2.bold", state.blog.title), m("h3"), m("h4", "Added On ", state.blog.createdAt, state.blog.updatedAt !== state.blog.createdAt && [" and updated on: ", state.blog.updatedAt], " by ", state.blog.author)), m("figure.col-3.is-horizontal-align", m("img", {
      src: state.blog.thumb || "images/main.webp"
    }))), m("hgroup.col.card", m.trust(HtmlSanitizer.SanitizeHtml((0, _Utils.parseMarkdown)(state.blog.text)))), state.blog.author == mdl.user.name && m("footer.grouped", m(m.route.Link, {
      selector: "button.button.primary.icon",
      href: "/social/blog-editor:".concat(state.blog.objectId)
    }, "Edit", m(_clarity.NoteEditLine, {
      fill: "white"
    })), m("button.button.error", {
      onclick: function onclick() {
        return deleteBlog(mdl);
      }
    }, "Delete"))), m(m.route.Link, {
      selector: "button.button.primary.outline.icon",
      href: "/social/blog",
      "class": "primary"
    }, m(_clarity.ArrowLine, {
      style: {
        transform: "rotate(270deg)"
      }
    }), "Back To Blogs"));
  }
};
var _default = BlogPost;
exports["default"] = _default;
});

;require.register("Pages/Blog/blog-preview.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var BlogPreview = {
  view: function view(_ref) {
    var _ref$attrs = _ref.attrs,
        mdl = _ref$attrs.mdl,
        _ref$attrs$post = _ref$attrs.post,
        title = _ref$attrs$post.title,
        text = _ref$attrs$post.text,
        thumb = _ref$attrs$post.thumb,
        createdAt = _ref$attrs$post.createdAt,
        updatedAt = _ref$attrs$post.updatedAt,
        author = _ref$attrs$post.author,
        objectId = _ref$attrs$post.objectId;
    return m("article.card.col-6", m(".row", m("hgroup.col-8", m("h2.bold", title), m("h3"), m("p", "Added On ", createdAt, updatedAt !== createdAt && [" updated on ", updatedAt], " by ", author)), m("figure.col.is-horizontal-align", m("img", {
      src: thumb || "images/main.webp"
    }))), m("hgroup.col", m.trust(HtmlSanitizer.SanitizeHtml(text.slice(0, 100))), "...", m(m.route.Link, // "a.pointer",
    {
      href: "/social/blog-post:".concat(objectId)
    }, "continue reading")), (author == mdl.user.name || ["admin", "mod"].includes(mdl.user.role)) && m("footer", m(m.route.Link, {
      selector: "button",
      href: "/social/blog-editor:".concat(objectId)
    }, "Edit")));
  }
};
var _default = BlogPreview;
exports["default"] = _default;
});

;require.register("Pages/Blog/blog.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.toViewModel = exports.formatLensDate = void 0;

var _loader = _interopRequireDefault(require("Components/loader.js"));

var _Utils = require("Utils");

var _ramda = require("ramda");

var _blogPreview = _interopRequireDefault(require("./blog-preview.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var state = {
  errors: {},
  blogs: []
};

var formatLensDate = function formatLensDate(prpty) {
  return (0, _ramda.over)((0, _ramda.lensProp)(prpty), _Utils.formatDate);
};

exports.formatLensDate = formatLensDate;
var toViewModel = (0, _ramda.compose)(_ramda.reverse, (0, _ramda.sortBy)((0, _ramda.propEq)("createdAt")), (0, _ramda.map)((0, _ramda.compose)(formatLensDate("updatedAt"), formatLensDate("createdAt"))));
exports.toViewModel = toViewModel;

var loadBlogs = function loadBlogs(_ref) {
  var mdl = _ref.attrs.mdl;

  var onError = function onError(error) {
    return state.errors = error;
  };

  var onSuccess = function onSuccess(results) {
    return state.blogs = results;
  };

  mdl.http.back4App.getTask(mdl)("Classes/Blogs").map((0, _ramda.prop)("results")).map(toViewModel).fork(onError, onSuccess);
};

var Blog = function Blog() {
  return {
    oninit: loadBlogs,
    onremove: function onremove() {
      state.errors = {};
      state.data = [];
    },
    view: function view(_ref2) {
      var mdl = _ref2.attrs.mdl;
      return mdl.state.isLoading() ? m(_loader["default"]) : m("article.grid.p-y-6.fade.bg-light", m("section.container", mdl.state.isAuth() && m("nav.nav.m-y-6", m(".nav-center", m(m.route.Link, {
        selector: "button.button.primary",
        href: "/social/blog-editor:",
        "class": mdl.settings.screenSize == "phone" ? "col-12" : ""
      }, "Add A Blog Post"))), m(".row", state.blogs.any() ? state.blogs.map(function (post) {
        return m(_blogPreview["default"], {
          mdl: mdl,
          post: post
        });
      }) : m("article.card", mdl.state.isAuth() ? m(m.route.Link, {
        href: "/social/blog-editor:",
        "class": "button primary"
      }, "Add The First Post !") : m("h1", "Log in to add the First Post!")))));
    }
  };
};

var _default = Blog;
exports["default"] = _default;
});

;require.register("Pages/Dashboard/index.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Utils = require("Utils");

var _ramda = require("ramda");

var _table = require("Components/table.js");

var _cjs = require("@mithril-icons/clarity/cjs");

var _clarity = require("@mithril-icons/clarity");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var nav = function nav(role) {
  var tabs = ["blogs", "events", "images"];
  if (role == "admin") tabs.push("users");
  return tabs;
};

var state = {
  tab: "blogs"
};

var userViewmodel = function userViewmodel(_ref) {
  var objectId = _ref.objectId,
      email = _ref.email,
      emailVerified = _ref.emailVerified,
      name = _ref.name,
      role = _ref.role,
      username = _ref.username;
  return {
    name: name,
    username: username,
    email: email,
    emailVerified: emailVerified,
    role: role,
    action: [m(_cjs.EditLine, {
      onclick: function onclick() {
        return console.log("edit", objectId);
      }
    }), m(_clarity.RemoveLine, {
      onclick: function onclick() {
        return console.log(objectId, "delete");
      }
    })]
  };
};

var eventsViewmodel = function eventsViewmodel(_ref2) {
  var objectId = _ref2.objectId,
      title = _ref2.title,
      image = _ref2.image,
      startDate = _ref2.startDate,
      startTime = _ref2.startTime;
  return {
    title: title,
    image: m("img", {
      src: image
    }),
    startDate: startDate,
    startTime: startTime,
    action: [m(_cjs.EditLine, {
      onclick: function onclick() {
        return console.log("edit", objectId);
      }
    }), m(_clarity.RemoveLine, {
      onclick: function onclick() {
        return console.log(objectId, "delete");
      }
    })]
  };
};

var blogsViewmodel = function blogsViewmodel(_ref3) {
  var objectId = _ref3.objectId,
      title = _ref3.title,
      img = _ref3.img,
      text = _ref3.text,
      author = _ref3.author;
  return {
    title: title,
    img: m("img", {
      src: img
    }),
    text: text.slice(0, 300),
    author: author,
    action: [m(_cjs.EditLine, {
      onclick: function onclick() {
        return console.log("edit", objectId);
      }
    }), m(_clarity.RemoveLine, {
      onclick: function onclick() {
        return console.log(objectId, "delete");
      }
    })]
  };
};

var imagesViewmodel = function imagesViewmodel(_ref4) {
  var objectId = _ref4.objectId,
      album = _ref4.album,
      image = _ref4.image;
  return {
    album: album,
    image: m("img", {
      src: image
    }),
    action: [m(_cjs.EditLine, {
      onclick: function onclick() {
        return console.log("edit", objectId);
      }
    }), m(_clarity.RemoveLine, {
      onclick: function onclick() {
        return console.log(objectId, "delete");
      }
    })]
  };
};

var displayType = {
  users: userViewmodel,
  events: eventsViewmodel,
  blogs: blogsViewmodel,
  images: imagesViewmodel
};

var handleType = function handleType(tab) {
  return function (data) {
    return displayType[tab](data);
  };
};

var toViewmodel = function toViewmodel(state, mdl) {
  var data = mdl.data[state.tab].map(handleType(state.tab));
  return (0, _table.formatDataForTable)(data);
};

var getUsers = function getUsers(mdl) {
  return mdl.http.back4App.getTask(mdl)("Users").map((0, _ramda.prop)("results")).map((0, _ramda.filter)((0, _ramda.prop)("name"))).fork((0, _Utils.log)("error"), function (u) {
    return mdl.data.users = u;
  });
};

var Dashboard = function Dashboard() {
  return {
    oninit: function oninit(_ref5) {
      var mdl = _ref5.attrs.mdl;
      return mdl.user.role == "admin" && getUsers(mdl);
    },
    view: function view(_ref6) {
      var mdl = _ref6.attrs.mdl;
      return m("section", m("nav.tabs", nav(mdl.user.role).map(function (tab) {
        return m("a.tab.pointer", {
          "class": state.tab == tab ? "active" : "",
          onclick: function onclick() {
            return state.tab = tab;
          }
        }, tab.toUpperCase());
      })), m("section.container", m(_table.Table, _objectSpread({
        mdl: mdl
      }, toViewmodel(state, mdl)))));
    }
  };
};

var _default = Dashboard;
exports["default"] = _default;
});

;require.register("Pages/Dashboard/users.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Users = void 0;

var _ramda = require("ramda");

var _Utils = require("Utils");

var Users = function Users() {
  var state = {
    users: [],
    errors: null
  };

  var getUsers = function getUsers(_ref) {
    var mdl = _ref.attrs.mdl;
    return mdl.http.back4App.getTask(mdl)("Users").map((0, _ramda.prop)("results")).map((0, _ramda.filter)((0, _ramda.prop)("name"))).fork((0, _Utils.log)("error"), function (u) {
      return state.users = u;
    });
  };

  var updateUserRole = function updateUserRole(mdl) {
    return function (user) {
      (0, _Utils.log)("user")(user);
      mdl.http.back4App.putTask(mdl)("Users/".concat(user.objectId))({
        role: user.role
      }).fork((0, _Utils.log)("error"), (0, _Utils.log)("succes"));
    };
  };

  return {
    oninit: getUsers,
    view: function view(_ref2) {
      var mdl = _ref2.attrs.mdl;
      return m("table.dash-table", m("thead", m("th"), m("th", "is Admin")), state.users.map(function (user) {
        return m("tr.mt-5", m("td", m("label", user.name)), m("td.frow.text-center", m("input", {
          type: "checkbox",
          checked: user.isAdmin,
          onclick: function onclick() {
            user.isAdmin = !user.isAdmin;
            updateUserRole(mdl)(user);
          }
        })));
      }));
    }
  };
};

exports.Users = Users;
});

;require.register("Pages/Events/calendar.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ramda = require("ramda");

var getCellDate = function getCellDate(target) {
  if (["MAIN", "BUTTON"].includes(target.tagName)) return null;
  return target.tagName == "TD" ? target.dataset.date : getCellDate(target.parentNode);
};

var onEventClick = function onEventClick(state) {
  return function (info) {
    info.jsEvent.preventDefault();
    var id = info.event.extendedProps.objectId;
    state.event = state.events.find((0, _ramda.propEq)("objectId", id));
    var start = state.event.start.split("T");
    var end = state.event.end.split("T");
    state.event.startDate = (0, _ramda.head)(start);
    state.event.startTime = (0, _ramda.head)((0, _ramda.tail)(start));
    state.event.endDate = (0, _ramda.head)(end);
    state.event.endTime = (0, _ramda.head)((0, _ramda.tail)(end));
    state.event.id = id;
    state.previewEvent(true);

    if (info.event.url) {
      window.open(info.event.url);
    }
  };
};

var initCal = function initCal(dom, state) {
  return new FullCalendar.Calendar(dom, {
    events: state.events,
    eventClick: onEventClick(state),
    initialView: "dayGridMonth",
    initialDate: new Date(),
    selectable: true,
    editable: true,
    droppable: true,
    headerToolbar: {
      left: "today",
      center: "title",
      right: "prev next" // right: "dayGridMonth,timeGridWeek,timeGridDay",

    } // eventDidMount: function (info) {
    // var tooltip = new Tooltip(info.el, {
    // title: info.event.extendedProps.description,
    // placement: "top",
    // trigger: "hover",
    // container: "body",
    // })
    // },

  });
};

var Calendar = {
  view: function view(_ref) {
    var _ref$attrs = _ref.attrs,
        mdl = _ref$attrs.mdl,
        state = _ref$attrs.state;
    return m("section#calendar", {
      oncreate: function oncreate(_ref2) {
        var dom = _ref2.dom;
        state.calendar = initCal(dom, state);
        state.calendar.render();
      },
      onclick: function onclick(e) {
        if (mdl.state.isAuth() && !state.previewEvent() && getCellDate(e.target)) {
          state.selectedDate(getCellDate(e.target));
          state.event.startDate = state.selectedDate();
          state.selectedDate() && state.showEditor(true);
        }
      }
    });
  }
};
var _default = Calendar;
exports["default"] = _default;
});

;require.register("Pages/Events/editor.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Utils = require("Utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var onInput = function onInput(event) {
  return (0, _Utils.handlers)(["oninput"], function (e) {
    if (e.target.type == "checkbox") {
      return event[e.target.id] = JSON.parse(e.target.checked);
    }

    if (e.target.id == "file") {
      return event[e.target.id] = e.target.files[0];
    } else {
      return event[e.target.id] = e.target.value;
    }
  });
};

var Editor = {
  view: function view(_ref) {
    var _ref$attrs = _ref.attrs,
        mdl = _ref$attrs.mdl,
        showEditor = _ref$attrs.showEditor,
        deleteEvent = _ref$attrs.deleteEvent,
        submitEvent = _ref$attrs.submitEvent,
        resetState = _ref$attrs.resetState,
        state = _ref$attrs.state,
        uploadImage = _ref$attrs.uploadImage;
    return m("aside.modal-container", m("article.modal", m("section.modal-content.container", m("form.grid", _objectSpread({}, onInput(state.event)), m("formgroup.grouped", m("label", "Start Date", m("input", {
      type: "date",
      id: "startDate",
      value: state.event.startDate
    })), m("label", "Start Time", m("input", {
      type: "time",
      id: "startTime",
      value: state.event.startTime,
      pattern: "(?:[01]|2(?![5-9])){1}d{1}:[0-5]{1}d{1}"
    }))), m("formgroup", m("label", "All Day Event?", m("input", {
      type: "checkbox",
      id: "allDay",
      value: state.event.allDay,
      checked: state.event.allDay
    }))), m("formgroup.grouped", m("label", "End Date", m("input", {
      type: "date",
      id: "endDate",
      value: state.event.endDate
    })), m("label", "End Time", m("input", {
      type: "time",
      id: "endTime",
      value: state.event.endTime
    }))), m("formgroup", m("label", "Title", m("input", {
      type: "text",
      id: "title",
      value: state.event.title
    }))), state.status() == "uploading-image" ? m("h2.tag.is-center", "Attaching Image - please be patient") : m("formgroup.grouped", m("label", "Upload an Image", m("input", {
      type: "file",
      id: "file",
      value: state.files,
      onchange: function onchange() {
        return uploadImage(state.event.file);
      }
    }), state.event.image && m("img", {
      src: state.event.image
    }))), m("formgroup", m("label", "Description", m("textarea", {
      id: "description",
      value: state.event.description
    }))))), m("footer.modal-footer", m(".tabs.grouped.is-center", m("button.button", {
      onclick: function onclick() {
        resetState(state);
        showEditor(false);
      }
    }, "Cancel"), state.event.id && m("button.button.error", {
      onclick: function onclick(e) {
        deleteEvent(mdl, state.event.id);
      },
      role: "button"
    }, "Delete"), m("button.button.primary", {
      onclick: function onclick(e) {
        submitEvent(mdl, state.event);
      },
      role: "button"
    }, "Submit")))));
  }
};
var _default = Editor;
exports["default"] = _default;
});

;require.register("Pages/Events/event.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var Event = {
  view: function view(_ref) {
    var _ref$attrs = _ref.attrs,
        mdl = _ref$attrs.mdl,
        event = _ref$attrs.event,
        previewEvent = _ref$attrs.previewEvent,
        editEvent = _ref$attrs.editEvent,
        resetState = _ref$attrs.resetState,
        state = _ref$attrs.state;
    return m(".modal-container", m(".modal", m("header.modal-header", m("h2.tag", event.title), m(".grouped", m("label", event.startDate), m("label", event.endDate)), m(".grouped", m("label", event.startTime), m("label", event.endTime)), event.allDay && m(".grouped", m("label.tag.primary", "All Day Event")), m(".grouped", m("img", {
      src: event.image
    }))), m("section.modal-content container card", m(".grouped", m("label", event.description))), m("footer.modal-footer", m(".tabs grouped", (event.createdBy == mdl.user.name || ["admin", "mod"].includes(mdl.user.role)) && m("button.button.secondary.is-full-width", {
      onclick: function onclick(e) {
        editEvent(true);
        previewEvent(false);
        e.preventDefault();
      },
      role: "button",
      disabled: false
    }, "Edit"), m("button.button.primary.is-full-width", {
      onclick: function onclick() {
        resetState(state);
        mdl.state.selectedPreviewEvent(null);
        previewEvent(false);
      }
    }, "Done")))));
  }
};
var _default = Event;
exports["default"] = _default;
});

;require.register("Pages/Events/index.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _calendar = _interopRequireDefault(require("./calendar"));

var _editor = _interopRequireDefault(require("./editor"));

var _event = _interopRequireDefault(require("./event"));

var _ramda = require("ramda");

var _loader = _interopRequireDefault(require("Components/loader.js"));

var _data = _interopRequireDefault(require("data.task"));

var _moment = _interopRequireDefault(require("moment"));

var _Utils = require("Utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var state = {
  status: Stream("loading"),
  calendar: null,
  showEditor: Stream(false),
  selectedDate: Stream(null),
  events: [],
  previewEvent: Stream(false),
  files: [],
  event: {
    image: null,
    id: "",
    startDate: "",
    start: "",
    startTime: "00:00:00",
    end: "",
    endDate: "",
    endTime: "00:00:00",
    title: "",
    description: "",
    allDay: false
  }
};

var resetState = function resetState(state) {
  return state.event = {
    image: "",
    id: "",
    startDate: "",
    start: "",
    startTime: "00:00:00",
    end: "",
    endDate: "",
    endTime: "00:00:00",
    title: "",
    description: "",
    allDay: false
  };
};

var toViewModel = function toViewModel(event) {
  var start = event.start.split("T");
  var end = event.end.split("T");
  event.startDate = (0, _ramda.head)(start);
  event.startTime = (0, _ramda.head)((0, _ramda.tail)(start));
  event.endDate = (0, _ramda.head)(end);
  event.endTime = (0, _ramda.head)((0, _ramda.tail)(end));
  event.id = event.objectId;
  return event;
};

var fetchEvents = function fetchEvents(_ref) {
  var mdl = _ref.attrs.mdl;
  state.status("loading");

  var onError = function onError(e) {
    state.status("error");
    console.error(e);
  };

  var onSuccess = function onSuccess(events) {
    state.events = events;

    if (mdl.state.selectedPreviewEvent()) {
      state.event = (0, _ramda.head)(events.filter((0, _ramda.propEq)("objectId", mdl.state.selectedPreviewEvent())).map(_ramda.clone).map(toViewModel));
      state.previewEvent(true);
    }

    state.status("loaded");
  };

  mdl.http.back4App.getTask(mdl)("Classes/Events").map((0, _ramda.prop)("results")).fork(onError, onSuccess);
};

var deleteEvent = function deleteEvent(mdl, id) {
  state.status("loading");

  var onError = function onError(e) {
    console.error(e);
  };

  var onSuccess = function onSuccess(evt) {
    fetchEvents({
      attrs: {
        mdl: mdl
      }
    });
    state.showEditor(false);
  };

  mdl.http.back4App.deleteTask(mdl)("Classes/Events/".concat(id)).fork(onError, onSuccess);
};

var formatDate = function formatDate(date, time) {
  // clean time
  var t = time.replaceAll("am", "").replaceAll("pm", "").replaceAll("AM", "").replaceAll("PM", "").trim();
  return "".concat(date, "T").concat(t);
};

var onSubmitError = function onSubmitError(e) {
  state.errors = e;
  state.status("error");
};

var onImgSuccess = function onImgSuccess(img) {
  console.log(img);
  state.event.image = img.thumb;
  state.status("loaded");
};

var saveImgToGalleryTask = function saveImgToGalleryTask(mdl) {
  return function (_ref2) {
    var _ref2$data = _ref2.data,
        image = _ref2$data.image,
        thumb = _ref2$data.thumb;
    return mdl.http.back4App.postTask(mdl)("Classes/Gallery")({
      album: "events",
      image: image.url,
      thumb: thumb.url
    }).chain(function (_) {
      return _data["default"].of({
        image: image.url,
        thumb: thumb.url
      });
    });
  };
};

var uploadImage = function uploadImage(mdl) {
  return function (file) {
    state.status("uploading-image");
    var image = new FormData();
    image.append("image", file);
    mdl.http.imgBB.postTask(mdl)(image).chain(saveImgToGalleryTask(mdl)).fork(onSubmitError, onImgSuccess);
  };
};

var submitEvent = function submitEvent(mdl, _ref3) {
  var id = _ref3.id,
      startDate = _ref3.startDate,
      startTime = _ref3.startTime,
      endDate = _ref3.endDate,
      endTime = _ref3.endTime,
      title = _ref3.title,
      allDay = _ref3.allDay,
      description = _ref3.description,
      image = _ref3.image;
  var start = formatDate(startDate, startTime);
  var end = formatDate(endDate, endTime);
  var event = {
    start: start,
    end: end,
    title: title,
    allDay: JSON.parse(allDay),
    description: description,
    createdBy: mdl.user.name,
    image: image
  };
  console.log(startTime, endTime, start, end);

  var onError = function onError(e) {
    console.error(e);
  };

  var onSuccess = function onSuccess(evt) {
    fetchEvents({
      attrs: {
        mdl: mdl
      }
    });
    state.showEditor(false);
  };

  state.previewEvent(true);

  var submitOrUpdate = function submitOrUpdate(id) {
    return id ? mdl.http.back4App.putTask(mdl)("Classes/Events/".concat(id))(event) : mdl.http.back4App.postTask(mdl)("Classes/Events")(event);
  };

  submitOrUpdate(id).fork(onError, onSuccess);
};

var Events = {
  oninit: fetchEvents,
  view: function view(_ref4) {
    var mdl = _ref4.attrs.mdl;
    return m("article", state.showEditor() && m(_editor["default"], {
      mdl: mdl,
      state: state,
      showEditor: state.showEditor,
      submitEvent: submitEvent,
      deleteEvent: deleteEvent,
      resetState: resetState,
      uploadImage: uploadImage(mdl)
    }), state.previewEvent() && m(_event["default"], {
      mdl: mdl,
      state: state,
      editEvent: state.showEditor,
      previewEvent: state.previewEvent,
      event: state.event,
      resetState: resetState
    }), state.status() == "loaded" && m("section", m(_calendar["default"], {
      mdl: mdl,
      state: state
    })), state.status() == "loading" && m("section", m(_loader["default"])), state.status() == "error" && m("section", "is error"));
  }
};
var _default = Events;
exports["default"] = _default;
});

;require.register("Pages/Gallery/album.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _loader = _interopRequireDefault(require("Components/loader.js"));

var _ramda = require("ramda");

var _Utils = require("Utils");

var _data = _interopRequireDefault(require("data.task"));

var _clarity = require("@mithril-icons/clarity");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var state = {
  album: [],
  title: "",
  showModal: Stream(false),
  isUpLoading: Stream(false),
  modalState: {
    imgFiles: [],
    selectedImgs: [],
    previewImgs: []
  }
};

var resetModalState = function resetModalState(state) {
  state.modalState = {
    imgFiles: [],
    selectedImgs: [],
    previewImgs: []
  };
};

var deleteImageTask = function deleteImageTask(mdl) {
  return function (_ref) {
    var objectId = _ref.objectId;
    return mdl.http.back4App.deleteTask(mdl)("Classes/Gallery/".concat(objectId));
  };
};

var deleteAlbum = function deleteAlbum(mdl) {
  // let album = m.route.get().split(":")[1].replaceAll("%20", " ")
  // let byAlbumName = encodeURI(`where={"album":"${album}"}`)
  // mdl.http.back4App
  //   .deleteTask(mdl)(`Classes/Gallery?${byAlbumName}`)
  var onError = function onError(e) {
    return console.error(e);
  };

  var onSuccess = function onSuccess() {
    return m.route.set("/social/gallery");
  };

  (0, _ramda.traverse)(_data["default"].of, deleteImageTask(mdl), state.album).fork(onError, onSuccess);
};

var deleteImg = function deleteImg(mdl, pic) {
  // console.log(pic)
  var onError = function onError(e) {
    return console.log(e);
  };

  var onSuccess = function onSuccess() {
    return fetchAlbum({
      attrs: {
        mdl: mdl
      }
    });
  };

  deleteImageTask(mdl)(pic).fork(onError, onSuccess);
};

var fetchAlbum = function fetchAlbum(_ref2) {
  var mdl = _ref2.attrs.mdl;
  var album = m.route.get().split(":")[1].replaceAll("%20", " ");
  var byAlbumName = encodeURI("where={\"album\":\"".concat(album, "\"}"));

  var onError = function onError(e) {
    return console.log(e);
  };

  var onSuccess = function onSuccess(_ref3) {
    var results = _ref3.results;
    state.album = results;
    state.title = album;
  };

  mdl.http.back4App.getTask(mdl)("Classes/Gallery?".concat(byAlbumName)).fork(onError, onSuccess);
};

var saveImgToGalleryTask = function saveImgToGalleryTask(mdl) {
  return function (_ref4) {
    var _ref4$data = _ref4.data,
        image = _ref4$data.image,
        thumb = _ref4$data.thumb;
    return mdl.http.back4App.postTask(mdl)("Classes/Gallery")({
      album: state.title,
      image: image.url,
      thumb: thumb.url
    });
  };
};

var uploadImage = function uploadImage(mdl) {
  return function (file) {
    var image = new FormData();
    image.append("image", file);
    return mdl.http.imgBB.postTask(mdl)(image).chain(saveImgToGalleryTask(mdl));
  };
};

var submitImages = function submitImages(mdl, images) {
  state.isUpLoading(true);

  var onSuccess = function onSuccess(d) {
    fetchAlbum({
      attrs: {
        mdl: mdl
      }
    });
    state.isUpLoading(false);
    state.showModal(false);
  };

  var onError = function onError(e) {
    return console.error("e", e);
  };

  (0, _ramda.traverse)(_data["default"].of, uploadImage(mdl), Object.values(images)).fork(onError, onSuccess);
};

var selectImg = function selectImg(src, file) {
  state.modalState.selectedImgs[src] ? state.modalState.selectedImgs[src] = null : state.modalState.selectedImgs[src] = file;
};

var handleUploadedImages = function handleUploadedImages() {
  var createObUrl = function createObUrl(file) {
    return {
      file: file,
      src: URL.createObjectURL(file)
    };
  };

  state.modalState.previewImgs = Array.from(state.modalState.imgFiles).filter(function (file) {
    return (0, _ramda.startsWith)("image/", (0, _ramda.prop)("type", file));
  }).map(createObUrl);
};

var Modal = function Modal() {
  return {
    onremove: function onremove() {
      return resetModalState(state);
    },
    view: function view(_ref5) {
      var mdl = _ref5.attrs.mdl;
      return m("section.modal-container", m("article.modal.card.grid", m("header.modal-header", m("h2", "Drag and drop or add using the button")), m("section.modal-content", state.isUpLoading() ? m("p", "PROCESSING IMAGES... PLEASE BE PATIENT") : m("form.grid", m("input", {
        oninput: function oninput(e) {
          return state.modalState.imgFiles = e.target.files;
        },
        onchange: function onchange(e) {
          return handleUploadedImages();
        },
        type: "file",
        id: "files",
        multiple: true
      }), m(".row", state.modalState.previewImgs.map(function (_ref6) {
        var src = _ref6.src,
            file = _ref6.file;
        return m("figure.button.col-4.".concat(state.modalState.selectedImgs[src] ? "primary" : "outline"), {
          onclick: function onclick(e) {
            return selectImg(src, file);
          }
        }, m("img", {
          src: src
        }));
      })))), m("section.modal-footer.grouped", m("button", {
        onclick: function onclick() {
          return state.showModal(false);
        }
      }, "Cancel"), m("button", {
        onclick: function onclick(e) {
          return submitImages(mdl, state.modalState.selectedImgs);
        },
        role: "button",
        type: "submit",
        disabled: !(0, _Utils.exists)(Object.values(state.modalState.selectedImgs))
      }, "Upload"))));
    }
  };
};

var Album = {
  oninit: fetchAlbum,
  view: function view(_ref7) {
    var mdl = _ref7.attrs.mdl;
    return mdl.state.isLoading() && !state.isUpLoading() ? m(_loader["default"]) : m("article.grid.p-y-6.fade.bg-light", m("nav.grouped.m-y-6", m(m.route.Link, {
      selector: "button.button.primary.outline.icon",
      href: "/social/gallery",
      "class": "primary"
    }, m(_clarity.ArrowLine, {
      style: {
        transform: "rotate(270deg)"
      }
    }), "Back To Gallery"), mdl.state.isAuth() && [m("button.button.primary", {
      onclick: function onclick(e) {
        return state.showModal(true);
      }
    }, "Add more Images to Album"), m("button.button error", {
      onclick: function onclick(e) {
        deleteAlbum(mdl);
      }
    }, "Delete Album")], state.showModal() && m(Modal, {
      mdl: mdl
    })), m("section.container", m("h2", state.title.toLocaleUpperCase()), m(".row", state.album.map(function (pic) {
      return m("figure.is-center.col-4.pos-rel", mdl.state.isAuth() && m(_clarity.TimesCircleLine, {
        "class": "pointer bg-white pos-abs",
        style: {
          borderRadius: "50%",
          top: 0,
          right: "20%"
        },
        fill: "red",
        onclick: function onclick(e) {
          return deleteImg(mdl, pic);
        }
      }), m("img", {
        src: pic.thumb
      }));
    }))));
  }
};
var _default = Album;
exports["default"] = _default;
});

;require.register("Pages/Gallery/gallery.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _loader = _interopRequireDefault(require("Components/loader.js"));

var _ramda = require("ramda");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var state = {
  albums: [],
  showModal: Stream(false),
  newAlbum: {
    title: "",
    img: null
  }
};
var groupByAlbum = (0, _ramda.compose)((0, _ramda.groupBy)((0, _ramda.prop)("album")), (0, _ramda.prop)("results"));

var fetchAllAlbums = function fetchAllAlbums(_ref) {
  var mdl = _ref.attrs.mdl;

  var onError = function onError(e) {
    return console.log(e);
  };

  var onSuccess = function onSuccess(albums) {
    return state.albums = albums;
  };

  mdl.http.back4App.getTask(mdl)("Classes/Gallery").map(groupByAlbum).fork(onError, onSuccess);
};

var saveImgToGalleryTask = function saveImgToGalleryTask(mdl) {
  return function (_ref2) {
    var _ref2$data = _ref2.data,
        image = _ref2$data.image,
        medium = _ref2$data.medium,
        thumb = _ref2$data.thumb;
    return mdl.http.back4App.postTask(mdl)("Classes/Gallery")({
      album: state.newAlbum.title,
      image: image.url,
      // medium: medium.url,
      thumb: thumb.url
    });
  };
};

var createtNewAlbum = function createtNewAlbum(mdl) {
  var onError = function onError(e) {
    return console.log(e);
  };

  var onSuccess = function onSuccess() {
    state.newAlbum = {
      title: "",
      img: ""
    };
    state.showModal(false);
    fetchAllAlbums({
      attrs: {
        mdl: mdl
      }
    });
  };

  var image = new FormData();
  image.append("image", state.newAlbum.img);
  mdl.http.imgBB.postTask(mdl)(image).chain(saveImgToGalleryTask(mdl)).fork(onError, onSuccess);
};

var AlbumCover = {
  view: function view(_ref3) {
    var _ref3$attrs$album = _ref3.attrs.album,
        thumb = _ref3$attrs$album.thumb,
        album = _ref3$attrs$album.album;
    return m(m.route.Link, {
      selector: "figure",
      "class": "button card col-4 bg-white",
      href: "social/gallery/album:".concat(album)
    }, m("img", {
      src: thumb
    }), m("figcaption", album));
  }
};
var NewAlbumModal = {
  view: function view(_ref4) {
    var mdl = _ref4.attrs.mdl;
    return m(".modal-container", m("form.modal.card", m("section.modal-content", m("label", "Album Title", m("input", {
      oninput: function oninput(e) {
        state.newAlbum.title = e.target.value;
      }
    })), m("label", "Add A Photo", m("input", {
      oninput: function oninput(e) {
        return state.newAlbum.img = e.target.files[0];
      },
      type: "file",
      id: "files"
    }))), m(".modal-footer.is-right grouped", m("button.button.secondary", {
      onclick: function onclick(e) {
        e.preventDefault();
        state.showModal(false);
      }
    }, "cancel"), m("button.button.primary", {
      disabled: !state.newAlbum.img,
      onclick: function onclick(e) {
        e.preventDefault();
        createtNewAlbum(mdl);
      }
    }, "Create Album"))));
  }
};
var Gallery = {
  oninit: fetchAllAlbums,
  view: function view(_ref5) {
    var mdl = _ref5.attrs.mdl;
    return mdl.state.isLoading() ? m(_loader["default"]) : m("article.bg-light.grid.p-y-6.fade", mdl.state.isAuth() && m("nav.nav", m(".nav-center", m("button.button.primary", {
      onclick: function onclick(e) {
        return state.showModal(true);
      },
      "class": mdl.settings.screenSize == "phone" ? "col-12" : ""
    }, "Add A New Album"), state.showModal() && m(NewAlbumModal, {
      mdl: mdl
    }))), m("section.row.container", Object.keys(state.albums).map(function (album) {
      return m(AlbumCover, {
        mdl: mdl,
        album: state.albums[album][0]
      });
    })));
  }
};
var _default = Gallery;
exports["default"] = _default;
});

;require.register("Pages/about.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var About = function About(mdl) {
  return {
    view: function view(_ref) {
      var mdl = _ref.attrs.mdl;
      return m("section", {
        "class": mdl.settings.screenSize == "desktop" ? "p-50" : ""
      }, m("section.is-marginless.bd-primary.p-x-50.p-y-6.bg-light", m("hgroup.grid", m("h2", "About Us"), m(".row", m("p.col", "The Bonham Acres Civic Association (BACA) is a registered 501(c)4 organization that was established to work for the common good of the community, providing a single voice for our neighborhood to area municipalities. The BACA operates with an all-volunteer staff, voluntary membership dues, and the donated time and energy of its neighbors."), m("figure.col", m("img.height-auto", {
        src: "images/IMG_3216.webp"
      }))))), m("section.is-marginless.bd-primary.p-x-50.p-y-6.bg-primary.text-white", m("hgroup.grid", m("h2", "Bonham Acres Sub Division"), m(".row", m("figure.col", m("img.height-auto", {
        src: "images/baca-map.webp"
      })), m("p.col", "A small jewell of a neighborhood located in Southwest Houston. Subdivision bounded by Bissonnet to the north, Braes Bayou to the south, Fondren to the east and Bonhomme Re to the west. There are 5 streets within, Bonhomme Rd, Cadawac Rd, Lugary Ln, Wanda Ln and Tree Frog. Bonham Acres Houston neighborhood is located in 77074 zip code in Harris county. Bonham Acres has 152 single family properties with a median build year of 1958 and a median size of 1,807 Sqft.")))), m("section.is-marginless.bd-primary.p-x-50.p-y-6.bg-light", m("h2", "Community Support"), m(".grid", m(".row", m(".col-3", m("hgroup", m("p.strong", "Historical Accounts"), m("p", "Dr. Bonham’s home became Bonham Family Nature Park."))), m(".col-3", m("hgroup", m("p.strong", "Improvements"), m("p", "Streets lights paid for by residents of Bonham Acres."))), m(".col-3", m("hgroup", m("p.strong", "Working Together"), m("p", "Residents worked together to get speed bumps installed."))), m(".col-3", m("hgroup", m("p.strong", "Legacy of Impact"), m("p", "Residents funded the 5 entry monuments into Bonham Acres.")))))));
    }
  };
};

var _default = About;
exports["default"] = _default;
});

;require.register("Pages/city-ordinances.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _report = _interopRequireDefault(require("Components/report"));

var _clarity = require("@mithril-icons/clarity");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var state = {
  showOrdinanceViolation: Stream(false)
};

var CityOrd = function CityOrd(mdl) {
  return {
    view: function view(_ref) {
      var mdl = _ref.attrs.mdl;
      return m("section.bd-light", {
        "class": mdl.settings.screenSize == "desktop" && "p-50"
      }, m("section.is-marginless.bd-primary.p-x-50.p-y-6.bg-primary.text-white", m("p", "Bonham Acres is a deed restricted community in which deed restrictions are actively enforced. ", m(m.route.Link, {
        selector: "a.underline",
        "class": "text-white",
        href: "/legal/deed-restrictions"
      }, m("em", "The Deed Restrictions")), " are intended to preserve and enhance property values as well as to promote safety in our community. "), m("p", "Many of these deed restrictions are enforced with the assistance of the City of Houston, whose legal department and our council representative have supported and whom have been valuable partners to Bonham Acres when enforcing deed restrictions."), m("p", "Violations to any of these deed restrictions should be reported directly to the Bonham Acres Civic Association.", m(".p-y-6.is-center", mdl.state.isAuth() ? m("button.button.icon.bd-error", {
        onclick: function onclick(e) {
          return state.showOrdinanceViolation(true);
        }
      }, "Report City Ordinance Violation", m(_clarity.ExclamationTriangleLine, {
        fill: "red"
      })) : m(m.route.Link, {
        selector: "button",
        "class": "button.bd-error",
        href: "/login"
      }, "Login To Report City Ordinance Violation"), state.showOrdinanceViolation() && m(_report["default"], {
        mdl: mdl,
        showModal: state.showOrdinanceViolation
      })), m("p", m("em", "All reports will be treated as anonymous and your name kept private.")), m("p.strong", "Your assistance in reporting violations will go a very long way to protect and enhance our property values."))), m("section.is-marginless.bd-primary.p-x-50.p-y-6.bg-light", m("hgroup", m("h2", "Car Parking in Residential Area"), m("em", "Parking of Vehicles on Residential Property Chapter 28, Article X"), m("p", "To read the complete ordinance, go to ", m("a.nav-link", {
        target: "__blank",
        href: "www.Municode.com"
      }, "www.Municode.com"), " on the internet and search for City of Houston, Chapter 28, Article X, or enter Parking of Vehicles on Residential Property in the search block."), m("p", m("a.nav-link", {
        target: "__blank",
        href: "https://www.houstontx.gov/police/pdfs/brochures/english/Parking_of_vehicles_on_residential_propert.pdf"
      }, "https://www.houstontx.gov/police/pdfs/brochures/english/Parking_of_vehicles_on_residential_propert.pdf")), m("p", "You can find out if a residence is covered by the ordinance by calling 311 or going to the city map viewer on the internet at ", m("a.nav-link", {
        target: "__blank",
        href: "http://mycity.houstontx.gov/public/"
      }, " http://mycity.houstontx.gov/public/ "), "and activating ", m("em", "the Prohibited Yard Parking application: ")), m("p", m("a.nav-link", {
        target: "__blank",
        href: "https://www.houstontx.gov/planning/Prohibited-Yard-Parking-Ordinance.html"
      }, "https://www.houstontx.gov/planning/Prohibited-Yard-Parking-Ordinance.html")))), m("section.is-marginless.bd-primary.p-x-50.p-y-6.bg-light", m("hgroup", m("h2", "Nuisance Ordinances"), m("p", m("a.nav-link", {
        target: "__blank",
        href: "https://statutes.capitol.texas.gov/Docs/HS/htm/HS.342.htm#342.004"
      }, "Section 342.004 of the Texas Health and Safety Code")), m("p", "State law giving authority to municipalities to require landowners to keep their property free of weeds, brush and conditions constituting a public nuisance."), m("p", m("a.nav-link", {
        target: "__blank",
        href: "https://statutes.capitol.texas.gov/Docs/TN/htm/TN.311.htm#311.003"
      }, "Sections 311.003 - 311.004 of the Texas Transportation Code")), m("p", "State laws giving authority to type-A municipalities to require a person to keep the front of their premise free of weeds and trash. It also gives them the authority to require a landowner to improve their sidewalk and allows home-rule municipalities to declare a defective sidewalk a public nuisance."), m("p", m("a.nav-link", {
        target: "__blank",
        href: "https://statutes.capitol.texas.gov/Docs/TN/htm/TN.683.htm#E"
      }, "Texas Transportation Code, Chapter 683, Subchapter E")), m("p", "State law governing junked vehicles; declaring them a public nuisance."))), m("section.is-marginless.bd-primary.p-x-50.p-y-6.bg-light", m("hgroup", m("h2", "Noise Ordinances"), m("p", "According to the ", ("a.nav-link", {
        target: "__blank",
        href: "#"
      }, " Houston Sound Ordinance, "), " sound ", m("span.strong", " cannot exceed 65 decibels during the day "), "and", m("span.strong", " 58 decibels at night in residential areas."), " Permits must be obtained for sound up to 75 decibels until 10pm on Sundays through Thursdays and until 11pm on Fridays and Saturdays. ", " The Houston ordinance penalizes up to ", m("span.strong", " $1, 000 per offense or per hour.")), m("p", "Noise or Barking dogs contact information: The LAPD suggests that noise complaints, from loud TVs to awful parties, are best dealt with by your local police station. Call them at (877) ASK-LAPD (275-5273). Do not call 911. If your neighbor complaint is more of the barking dog variety, try the city's Animal Care and Control Department."), m("p", m("a.nav-link", {
        target: "__blank",
        href: "https://library.municode.com/tx/houston/codes/code_of_ordinances?nodeId=COOR_CH30NOSOLERE"
      }, "https://library.municode.com/tx/houston/codes/code_of_ordinances?nodeId=COOR_CH30NOSOLERE")))), m("section.is-marginless.bd-primary.p-x-50.p-y-6.bg-light", m("hgroup", m("h2", "Trash & Dumpster Ordinances"), m("p", m("a.nav-link", {
        target: "__blank",
        href: "https://www.houstontx.gov/solidwaste/trashfacts.pdf"
      }, "https://www.houstontx.gov/solidwaste/trashfacts.pdf")))));
    }
  };
};

var _default = CityOrd;
exports["default"] = _default;
});

;require.register("Pages/contact.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var BoardMembers = [{
  title: "President",
  name: "Tim Hatton",
  phones: ["713-480-8020", "713-208-8756"],
  emails: ["timhatton202@yahoo.com", "kimyhatton@gmail.com"]
}, {
  title: "Vice President",
  name: "Cortney Meza",
  phones: ["832-491-9705"],
  emails: ["mezacort@yahoo.com"]
}, {
  title: "Secretary",
  name: "Alan Hernandez",
  phones: ["832-798-2568"],
  emails: ["Alan@teamwpr.com"]
}, {
  title: "Treasurer",
  name: "David Gessing",
  phones: ["281-733-8959"],
  emails: ["Dgessing@gmail.com"]
}, {
  title: "Deed Restrictions ",
  name: "Henrietta Nixon",
  phones: ["713-773-9291"],
  emails: ["nixkh@comcast.net"]
}];

var calcSize = function calcSize(mdl) {
  switch (mdl.settings.screenSize) {
    case "phone":
      return "12";

    case "wide":
      return "12";

    case "tablet":
      return "6";

    default:
    case "desktop":
      return "4";
  }
};

var Contact = function Contact(mdl) {
  return {
    view: function view(_ref) {
      var mdl = _ref.attrs.mdl;
      return m("article.bg-light", m("section.container", m("h2.is-center.is-marginless.m-b-15", "Bonham Acres Civic Association Board Members April 13, 2021"), m(".row.container", BoardMembers.map(function (_ref2) {
        var title = _ref2.title,
            name = _ref2.name,
            phones = _ref2.phones,
            emails = _ref2.emails;
        return m(".card.col-".concat(calcSize(mdl)), m("h4.text-primary", title), m("p", name), phones.map(function (phone) {
          return m("p", phone);
        }), emails.map(function (email) {
          return m("p.pointer.underline", {
            href: "mailto:".concat(email)
          }, email);
        }));
      }))));
    }
  };
};

var _default = Contact;
exports["default"] = _default;
});

;require.register("Pages/default.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var Default = function Default(mdl) {
  return {
    view: function view(_ref) {
      var mdl = _ref.attrs.mdl;
      return m(".container", m(".", m("section", m("p", "sec1")), m("section", m("p", "sec2")), m("section", m("p", "sec3")), m("section", m("p", "sec1")), m("section", m("p", "sec2")), m("section", m("p", "sec3")), m("section", m("p", "sec2")), m("section", m("p", "sec3")), m("section", m("p", "sec1")), m("section", m("p", "sec2")), m("section", m("p", "sec3")), m("section", m("p", "sec1")), m("section", m("p", "sec2")), m("section", m("p", "sec3")), m("section", m("p", "sec1")), m("section", m("p", "sec2")), m("section", m("p", "sec3")), m("section", m("p", "sec2")), m("section", m("p", "sec3")), m("section", m("p", "sec1")), m("section", m("p", "sec2")), m("section", m("p", "sec3")), m("section", m("p", "sec1")), m("section", m("p", "sec2")), m("section", m("p", "sec3")), m("section", m("p", "sec1")), m("section", m("p", "sec2")), m("section", m("p", "sec3")), m("section", m("p", "sec2")), m("section", m("p", "sec3")), m("section", m("p", "sec1")), m("section", m("p", "sec2")), m("section", m("p", "sec3")), m("section", m("p", "sec1")), m("section", m("p", "sec2")), m("section", m("p", "sec3")), m("section", m("p", "sec1")), m("section", m("p", "sec2")), m("section", m("p", "sec3")), m("section", m("p", "sec2")), m("section", m("p", "sec3")), m("section", m("p", "sec1")), m("section", m("p", "sec2")), m("section", m("p", "sec3"))));
    }
  };
};

var _default = Default;
exports["default"] = _default;
});

;require.register("Pages/faq.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var Faq = function Faq(mdl) {
  return {
    view: function view(_ref) {
      var mdl = _ref.attrs.mdl;
      return m(".frow-container frow-center", "");
    }
  };
};

var _default = Faq;
exports["default"] = _default;
});

;require.register("Pages/home.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Layouts = require("../Layouts");

var State = {
  events: null,
  blogs: null,
  images: null
};

var createCarousel = function createCarousel(dom) {
  var slider = tns({
    container: dom,
    controls: true,
    nav: false,
    sessionStorage: sessionStorage,
    preventScrollOnTouch: "auto",
    slideBy: "page",
    responsive: {
      200: {
        items: 2
      },
      640: {
        items: 2
      },
      1000: {
        items: 3
      },
      1400: {
        items: 4
      }
    }
  });
  State[dom.id] = slider;
};

var SliderController = function SliderController(mdl) {
  return {
    oncreate: function oncreate(_ref) {
      var dom = _ref.dom;
      return createCarousel(dom);
    },
    onremove: function onremove(_ref2) {
      var dom = _ref2.dom;
      return State[dom.id].destroy();
    }
  };
};

var Home = function Home() {
  return {
    oninit: _Layouts.fetchAll,
    view: function view(_ref3) {
      var mdl = _ref3.attrs.mdl;
      return m("article.grid", m("section.row.p-b-25.bg-light", mdl.data.events.any() && m(".container", m("h2.is-center", "Upcoming Events!"), m(".grouped.#events", SliderController(mdl), mdl.data.events.map(function (event) {
        return m(".card.is-vertical-align row", {
          style: {
            backgroundImage: event.image,
            height: "40% !important"
          }
        }, event.allDay && m(".tag", "All Day Event!"), m("h3", event.startDate), m("h3", event.startTime), m("img", {
          src: event.image
        }), m("h4", event.title), m(m.route.Link, {
          selector: "label",
          "class": "button primary outline is-full-width",
          href: "/social/calendar",
          onclick: function onclick(e) {
            return mdl.state.selectedPreviewEvent(event.objectId);
          }
        }, "...Read More"));
      })))), m("section.row.p-b-25.bg-primary.text-white", mdl.data.images.any() && m(".container", m("h2.is-center", "Recent Photos"), m(".grouped.#images", SliderController(mdl), mdl.data.images.map(function (img) {
        return m("img.card.auto", {
          src: img.thumb,
          style: {}
        });
      })))), m("section.row.p-b-25.bg-light", mdl.data.blogs.any() && m(".container", m("h2.is-center", "Recent Blogs"), m(".grouped.#blogs", SliderController(mdl), mdl.data.blogs.map(function (blog) {
        return m(".card.opacity-overlay.is-vertical-align row", m("figure", m("img", {
          src: blog.img || "images/main.webp"
        })), m("h2", blog.title), m(m.route.Link, {
          selector: "label",
          "class": "button primary outline is-full-width",
          href: "/social/blog-post:".concat(blog.objectId)
        }, "...Read More"));
      })))), m("section.row.bg-primary.text-white", m(".container", "Some more info...")));
    }
  };
};

var _default = Home;
exports["default"] = _default;
});

;require.register("Pages/join-baca.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var JoinBACA = function JoinBACA(mdl) {
  return {
    view: function view(_ref) {
      var mdl = _ref.attrs.mdl;
      return m("", m("section.bg-light.card", m("hgroup", m("p", "BACA operates as a non-profit organization for community and civic improvement and protection and other non-profit purposes."), m("p", "Any income received shall be applied only to the non-profit purposes and objectives of the organization, and no part of the income shall inure to the benefit of any officer or member."), m("p", "We will use the ", m("span.text-primary", "annual $50 membership"), " to maintain ", m(m.route.Link, {
        selector: "a",
        "class": "underline",
        href: "/"
      }, "bonhamacres.org"), ", Bonham Acre monuments, BACA work & communication uphold deed restriction and city ordinances, mailers & signage, social events, other items as voted on by BACA members."), m("h3", "We are not a HOA", m("a", {
        target: "__blank",
        href: "https://independentamericancommunities.com/2017/06/18/civic-and-neighborhood-associations-very-different-from-modern-hoas/"
      }, " we are a voluntary civic association "), "with the goal of helping one another!!"))), m("section.bg-primary.text-white.card", m("h2", "Why Join?"), m("hgroup", m("h4", "Safety & Peace for You & YOUR Family and everyone else in the neighborhood."), m("p", "If you want to protect YOU & YOUR family, you can either rely on yourself alone or else with neighbors working together—by reporting crimes and violations that disturb peace, tranquility and joy.  When you", m("span.strong", " become involved "), "in BACA, you are on the team that will be looking out for each other! ")), m("hgroup", m("h4", "Safeguard YOUR property value."), m("p", "If you want to protect your property value, you can either rely on someone else to do it or do it yourself by joining other residents to work for the betterment of our community. When you", m("span.strong", " join "), "BACA, you have better control over community rules and maintenance, which can affect the value of your property.As a ", m("span.strong", " homeowner "), " it's only normal to have an interest in your investment.")), m("hgroup", m("h4", "Work with the City of Houston and Precinct 3 for the benefit of BACA."), m("p", "If you want to leverage many voices, namely the many members of Bonham Acres, to work with organizations, commercial entities, governments to improvement our neighborhood you need to join."))));
    }
  };
};

var _default = JoinBACA;
exports["default"] = _default;
});

;require.register("Routes/authenticated-routes.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _default2 = _interopRequireDefault(require("Pages/default.js"));

var _index = _interopRequireDefault(require("Pages/Account/index.js"));

var _Dashboard = _interopRequireDefault(require("Pages/Dashboard"));

var _index2 = _interopRequireDefault(require("Layouts/index.js"));

var _Utils = require("Utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var AuthenticatedRoutes = [{
  id: "account",
  name: "Account",
  // icon: Icons.logo,
  route: "/account/:name",
  position: ["toolbar"],
  group: ["authenticated"],
  children: [],
  options: [],
  onmatch: function onmatch(mdl, args, path, fullroute, isAnchor) {
    isAnchor ? (0, _Utils.scrollToAnchor)(mdl.state.anchor) : (0, _Utils.PageTitle)().scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "start"
    });
  },
  component: function component(mdl) {
    return m(_index2["default"], {
      mdl: mdl
    }, m(_index["default"], {
      mdl: mdl
    }));
  }
}, {
  id: "dashboard",
  name: "Dashboard",
  // icon: Icons.logo,
  route: "/dashboard/:name",
  position: ["toolbar"],
  group: ["authenticated"],
  children: [],
  options: [],
  onmatch: function onmatch(mdl, args, path, fullroute, isAnchor) {
    isAnchor ? (0, _Utils.scrollToAnchor)(mdl.state.anchor) : (0, _Utils.PageTitle)().scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "start"
    });
  },
  component: function component(mdl) {
    return m(_index2["default"], {
      mdl: mdl
    }, m(_Dashboard["default"], {
      mdl: mdl
    }));
  }
}, {
  id: "profile-page",
  name: "Profile Page",
  // icon: Icons.home,
  route: "/account/:name/profile",
  position: ["settings-nav"],
  group: ["authenticated"],
  children: [],
  options: [],
  onmatch: function onmatch(mdl, args, path, fullroute, isAnchor) {
    console.log("profile page login on match", mdl, args, path, fullroute, isAnchor, !mdl.state.isAuth());
    isAnchor ? (0, _Utils.scrollToAnchor)(mdl.state.anchor) : (0, _Utils.PageTitle)().scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "start"
    });
  },
  component: function component(mdl) {
    return m(_index2["default"], {
      mdl: mdl
    }, m(_default2["default"], {
      mdl: mdl
    }));
  }
}, {
  id: "manage-users",
  name: "Manage Users",
  // icon: Icons.users,
  route: "/account/:name/user-management",
  position: ["settings-nav"],
  group: ["authenticated", "admin"],
  children: [],
  options: [],
  onmatch: function onmatch(mdl, args, path, fullroute, isAnchor) {
    // console.log(
    //   "manage users on match",
    //   mdl,
    //   args,
    //   path,
    //   fullroute,
    //   isAnchor,
    //   mdl.state.isAuth(),
    // )
    mdl.user.role != "admin" && m.route.set(m.route.get());
    isAnchor ? (0, _Utils.scrollToAnchor)(mdl.state.anchor) : (0, _Utils.PageTitle)().scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "start"
    });
  },
  component: function component(mdl) {
    return m(_index2["default"], {
      mdl: mdl
    }, m(_default2["default"], {
      mdl: mdl
    }));
  }
}, {
  id: "logout",
  name: "",
  // icon: Icons.users,
  route: "/logout",
  position: [],
  group: ["authenticated", "admin"],
  children: [],
  options: [],
  onmatch: function onmatch(mdl, args, path, fullroute, isAnchor) {
    (0, _Utils.PageTitle)().scroll({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
    localStorage.clear();
    sessionStorage.clear();
    mdl.state.isAuth(false);
    mdl.user = {};
    console.log("loggout", mdl);
    var routes = ["account"];
    var currentRoute = m.route.get();
    routes.map(function (r) {
      return currentRoute.includes(r);
    }).map(log("???")).contains(true) ? m.route.set("/") : m.route.set(currentRoute);
  },
  component: function component(mdl) {
    return m(_index2["default"], {
      mdl: mdl
    }, m(_default2["default"], {
      mdl: mdl
    }));
  }
}];
var _default = AuthenticatedRoutes;
exports["default"] = _default;
});

;require.register("Routes/index.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _authenticatedRoutes = _interopRequireDefault(require("./authenticated-routes.js"));

var _mainRoutes = _interopRequireDefault(require("./main-routes.js"));

var _legalRoutes = _interopRequireDefault(require("./legal-routes.js"));

var _safetyRoutes = _interopRequireDefault(require("./safety-routes.js"));

var _memberRoutes = _interopRequireDefault(require("./member-routes.js"));

var _socialRoutes = _interopRequireDefault(require("./social-routes.js"));

var _ramda = require("ramda");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Routes = (0, _ramda.flatten)([_authenticatedRoutes["default"], _mainRoutes["default"], _socialRoutes["default"], _memberRoutes["default"], _legalRoutes["default"], _safetyRoutes["default"]]);
var _default = Routes;
exports["default"] = _default;
});

;require.register("Routes/legal-routes.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _index = _interopRequireDefault(require("Layouts/index.js"));

var _default2 = _interopRequireDefault(require("Pages/default.js"));

var _cityOrdinances = _interopRequireDefault(require("Pages/city-ordinances.js"));

var _index2 = require("Utils/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var LegalRoutes = [{
  id: "legal",
  name: "Legal",
  // icon: Icons.home,
  route: "/legal",
  isNav: true,
  group: ["navmenu"],
  children: ["deed-restrictions", "city-ordinances"],
  options: [],
  onmatch: function onmatch(mdl, args, path, fullroute, isAnchor) {
    isAnchor ? (0, _index2.scrollToAnchor)(mdl.state.anchor) : (0, _index2.PageTitle)().scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "start"
    });
  },
  component: function component(mdl) {
    return m(_index["default"], {
      mdl: mdl
    }, m(_default2["default"], {
      mdl: mdl
    }));
  }
}, {
  id: "deed-restrictions",
  name: "Deed Restrictions",
  // icon: Icons.home,
  route: "/legal/deed-restrictions",
  isNav: true,
  group: ["nav", "legal"],
  children: [],
  options: [],
  onmatch: function onmatch(mdl, args, path, fullroute, isAnchor) {
    isAnchor ? (0, _index2.scrollToAnchor)(mdl.state.anchor) : (0, _index2.PageTitle)().scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "start"
    });
  },
  component: function component(mdl) {
    return m(_index["default"], {
      mdl: mdl
    }, m(_default2["default"], {
      mdl: mdl
    }));
  }
}, {
  id: "city-ordinances",
  name: "City Ordinances",
  // icon: Icons.home,
  route: "/legal/city-ordinances",
  isNav: true,
  group: ["nav", "legal"],
  children: [],
  options: [],
  onmatch: function onmatch(mdl, args, path, fullroute, isAnchor) {
    isAnchor ? (0, _index2.scrollToAnchor)(mdl.state.anchor) : (0, _index2.PageTitle)().scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "start"
    });
  },
  component: function component(mdl) {
    return m(_index["default"], {
      mdl: mdl
    }, m(_cityOrdinances["default"], {
      mdl: mdl
    }));
  }
}];
var _default = LegalRoutes;
exports["default"] = _default;
});

;require.register("Routes/main-routes.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _index = _interopRequireDefault(require("Layouts/index.js"));

var _contact = _interopRequireDefault(require("Pages/contact.js"));

var _home = _interopRequireDefault(require("Pages/home.js"));

var _about = _interopRequireDefault(require("Pages/about.js"));

var _joinBaca = _interopRequireDefault(require("Pages/join-baca.js"));

var _index2 = require("Utils/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Logo = m("img", {
  src: "images/logo.webp"
});
var Routes = [{
  id: "home",
  name: "Welcome to Bonham Acres Civic Association (BACA)",
  // icon: Icons.home,
  route: "/",
  isNav: true,
  group: ["toolbar"],
  children: [],
  options: [],
  onmatch: function onmatch(mdl, args, path, fullroute, isAnchor) {
    isAnchor ? (0, _index2.scrollToAnchor)(mdl.state.anchor) : window.scroll({
      top: 160,
      left: 0,
      behavior: "smooth"
    });
  },
  component: function component(mdl) {
    return m(_index["default"], {
      mdl: mdl
    }, m(_home["default"], {
      mdl: mdl
    }));
  }
}, {
  id: "about",
  name: "About Bonham Acres",
  // icon: Icons.home,
  route: "/about",
  isNav: true,
  group: ["navmenu"],
  children: [],
  options: [],
  onmatch: function onmatch(mdl, args, path, fullroute, isAnchor) {
    isAnchor ? (0, _index2.scrollToAnchor)(mdl.state.anchor) : window.scroll({
      top: 160,
      left: 0,
      behavior: "smooth"
    });
  },
  component: function component(mdl) {
    return m(_index["default"], {
      mdl: mdl
    }, m(_about["default"], {
      mdl: mdl
    }));
  }
}, {
  id: "contact",
  name: "Contact BACA",
  // icon: Icons.search,
  route: "/contact",
  isNav: false,
  group: ["navmenu"],
  children: [],
  options: [],
  onmatch: function onmatch(mdl, args, path, fullroute, isAnchor) {
    isAnchor ? (0, _index2.scrollToAnchor)(mdl.state.anchor) : (0, _index2.PageTitle)().scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "start"
    });
  },
  component: function component(mdl) {
    return m(_index["default"], {
      mdl: mdl
    }, m(_contact["default"], {
      mdl: mdl
    }));
  }
}, {
  id: "join-BACA",
  name: "Join Bonham Acres Civic Association",
  // icon: Icons.search,
  route: "/join-BACA",
  isNav: false,
  group: ["navmenu"],
  children: [],
  options: [],
  onmatch: function onmatch(mdl, args, path, fullroute, isAnchor) {
    isAnchor ? (0, _index2.scrollToAnchor)(mdl.state.anchor) : (0, _index2.PageTitle)().scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "start"
    });
  },
  component: function component(mdl) {
    return m(_index["default"], {
      mdl: mdl
    }, m(_joinBaca["default"], {
      mdl: mdl
    }));
  }
}];
var _default = Routes;
exports["default"] = _default;
});

;require.register("Routes/member-routes.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _index = _interopRequireDefault(require("Layouts/index.js"));

var _default2 = _interopRequireDefault(require("Pages/default.js"));

var _loginUser = _interopRequireDefault(require("Pages/Auth/login-user.js"));

var _registerUser = _interopRequireDefault(require("Pages/Auth/register-user.js"));

var _Utils = require("Utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var MemberRoutes = [{
  id: "members",
  name: "Members",
  // icon: Icons.search,
  route: "/members",
  isNav: false,
  group: ["navbar", "members"],
  children: [],
  options: [],
  onmatch: function onmatch(mdl, args, path, fullroute, isAnchor) {
    isAnchor ? (0, _Utils.scrollToAnchor)(mdl.state.anchor) : (0, _Utils.PageTitle)().scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "start"
    });
  },
  component: function component(mdl) {
    return m(_index["default"], {
      mdl: mdl
    }, m(_default2["default"], {
      mdl: mdl
    }));
  }
}, {
  id: "login",
  name: "Account Login",
  // icon: Icons.search,
  route: "/login",
  isNav: false,
  group: ["nav", "members"],
  children: [],
  options: [],
  onmatch: function onmatch(mdl, args, path, fullroute, isAnchor) {
    isAnchor ? (0, _Utils.scrollToAnchor)(mdl.state.anchor) : (0, _Utils.PageTitle)().scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "start"
    });
  },
  component: function component(mdl) {
    return m(_index["default"], {
      mdl: mdl
    }, m(_loginUser["default"], {
      mdl: mdl
    }));
  }
}, {
  id: "register",
  name: "Register Account",
  // icon: Icons.search,
  route: "/register",
  isNav: false,
  group: ["nav", "members"],
  children: [],
  options: [],
  onmatch: function onmatch(mdl, args, path, fullroute, isAnchor) {
    isAnchor ? (0, _Utils.scrollToAnchor)(mdl.state.anchor) : (0, _Utils.PageTitle)().scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "start"
    });
  },
  component: function component(mdl) {
    return m(_index["default"], {
      mdl: mdl
    }, m(_registerUser["default"], {
      mdl: mdl
    }));
  }
}, {
  id: "volunteer",
  name: "Volunteer",
  // icon: Icons.search,
  route: "/members/volunteer",
  isNav: false,
  group: ["nav", "members"],
  children: [],
  options: [],
  onmatch: function onmatch(mdl, args, path, fullroute, isAnchor) {
    isAnchor ? (0, _Utils.scrollToAnchor)(mdl.state.anchor) : (0, _Utils.PageTitle)().scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "start"
    });
  },
  component: function component(mdl) {
    return m(_index["default"], {
      mdl: mdl
    }, m(_default2["default"], {
      mdl: mdl
    }));
  }
}, {
  id: "join",
  name: "Become a Member",
  // icon: Icons.search,
  route: "/members/join",
  isNav: true,
  group: ["nav", "members"],
  children: [],
  options: [],
  onmatch: function onmatch(mdl, args, path, fullroute, isAnchor) {
    isAnchor ? (0, _Utils.scrollToAnchor)(mdl.state.anchor) : (0, _Utils.PageTitle)().scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "start"
    });
  },
  component: function component(mdl) {
    return m(_index["default"], {
      mdl: mdl
    }, m(_default2["default"], {
      mdl: mdl
    }));
  }
}];
var _default = MemberRoutes;
exports["default"] = _default;
});

;require.register("Routes/safety-routes.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _index = _interopRequireDefault(require("Layouts/index.js"));

var _default2 = _interopRequireDefault(require("Pages/default.js"));

var _Utils = require("Utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var MemberRoutes = [{
  id: "safety",
  name: "Safety",
  // icon: Icons.search,
  route: "/safety",
  isNav: true,
  group: ["navmenu"],
  children: ["report", "district-J", "SeeClickFix", "Harrison-County-Public-Health", "Houston-311-Service-Request/Report"],
  options: [],
  onmatch: function onmatch(mdl, args, path, fullroute, isAnchor) {
    isAnchor ? (0, _Utils.scrollToAnchor)(mdl.state.anchor) : (0, _Utils.PageTitle)().scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "start"
    });
  },
  component: function component(mdl) {
    return m(_index["default"], {
      mdl: mdl
    }, m(_default2["default"], {
      mdl: mdl
    }));
  }
}, {
  id: "report",
  name: "File An Internal Report With BACA",
  // icon: Icons.search,
  route: "/safety/report",
  isNav: true,
  group: ["nav", "safety"],
  children: [],
  options: [],
  onmatch: function onmatch(mdl, args, path, fullroute, isAnchor) {
    isAnchor ? (0, _Utils.scrollToAnchor)(mdl.state.anchor) : (0, _Utils.PageTitle)().scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "start"
    });
  },
  component: function component(mdl) {
    return m(_index["default"], {
      mdl: mdl
    }, m(_default2["default"], {
      mdl: mdl
    }));
  }
}, {
  id: "district-J",
  name: "District J",
  // icon: Icons.search,
  route: "/external",
  external: "https://www.houstontx.gov/council/j/request.html",
  isNav: true,
  group: ["external", "safety"],
  children: [],
  options: []
}, {
  id: "Houston-311-Citizen-Portal",
  name: "Houston 311 Citizen Portal",
  // icon: Icons.search,
  route: "/external",
  external: "https://apps.apple.com/us/app/id1556529541",
  isNav: true,
  group: ["external", "safety"],
  children: [],
  options: []
}, {
  id: "Harrison-County-Public-Health",
  name: "Harrison County Public Health",
  // icon: Icons.search,
  route: "/external",
  external: "https://publichealth.harriscountytx.gov/Services-Programs/Services/NeighborhoodNuisance",
  isNav: true,
  group: ["external", "safety"],
  children: [],
  options: []
}, {
  id: "Houston-311-Service-Request/Report",
  name: "Houston 311 Service Request/Report",
  // icon: Icons.search,
  route: "/external",
  external: "https://www.houstontx.gov/311/ServiceRequestDirectoryWebpage.htm",
  isNav: true,
  group: ["external", "safety"],
  children: [],
  options: []
}];
var _default = MemberRoutes;
exports["default"] = _default;
});

;require.register("Routes/social-routes.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _index = _interopRequireDefault(require("Layouts/index.js"));

var _default2 = _interopRequireDefault(require("Pages/default.js"));

var _blog = _interopRequireDefault(require("Pages/Blog/blog.js"));

var _blogEditor = _interopRequireDefault(require("Pages/Blog/blog-editor"));

var _blogPost = _interopRequireDefault(require("Pages/Blog/blog-post"));

var _gallery = _interopRequireDefault(require("Pages/Gallery/gallery.js"));

var _album = _interopRequireDefault(require("Pages/Gallery/album.js"));

var _index2 = _interopRequireDefault(require("Pages/Events/index.js"));

var _Utils = require("Utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var SocialRoutes = [{
  id: "social",
  name: "Social",
  // icon: Icons.home,
  route: "/social",
  isNav: true,
  group: ["navbar", "navmenu"],
  children: ["map-of-bonham-acres", "blog", "explore", "gallery", "calendar", "bfn-park"],
  options: [],
  onmatch: function onmatch(mdl, args, path, fullroute, isAnchor) {
    isAnchor ? (0, _Utils.scrollToAnchor)(mdl.state.anchor) : (0, _Utils.PageTitle)().scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "start"
    });
  },
  component: function component(mdl) {
    return m(_index["default"], {
      mdl: mdl
    }, m(_default2["default"], {
      mdl: mdl
    }));
  }
}, {
  id: "events",
  name: "Events",
  // icon: Icons.home,
  route: "/social/events",
  isNav: true,
  group: ["nav", "social"],
  children: [],
  options: [],
  onmatch: function onmatch(mdl, args, path, fullroute, isAnchor) {
    isAnchor ? (0, _Utils.scrollToAnchor)(mdl.state.anchor) : (0, _Utils.PageTitle)().scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "start"
    });
  },
  component: function component(mdl) {
    return m(_index["default"], {
      mdl: mdl
    }, m(_index2["default"], {
      mdl: mdl
    }));
  }
}, {
  id: "gallery",
  name: "Photo Gallery",
  // icon: Icons.home,
  route: "/social/gallery",
  isNav: true,
  group: ["nav", "social"],
  children: [],
  options: [],
  onmatch: function onmatch(mdl, args, path, fullroute, isAnchor) {
    isAnchor ? (0, _Utils.scrollToAnchor)(mdl.state.anchor) : (0, _Utils.PageTitle)().scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "start"
    });
  },
  component: function component(mdl) {
    return m(_index["default"], {
      mdl: mdl
    }, m(_gallery["default"], {
      mdl: mdl
    }));
  }
}, {
  id: "album",
  name: "Photo Gallery Album",
  // icon: Icons.home,
  route: "/social/gallery/album:album",
  isNav: false,
  group: ["nav", "social"],
  children: [],
  options: [],
  onmatch: function onmatch(mdl, args, path, fullroute, isAnchor) {
    isAnchor ? (0, _Utils.scrollToAnchor)(mdl.state.anchor) : (0, _Utils.PageTitle)().scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "start"
    });
  },
  component: function component(mdl) {
    return m(_index["default"], {
      mdl: mdl
    }, m(_album["default"], {
      mdl: mdl
    }));
  }
}, {
  id: "blog",
  name: "Blog",
  // icon: Icons.home,
  route: "/social/blog",
  isNav: true,
  group: ["nav", "social"],
  children: [],
  options: [],
  onmatch: function onmatch(mdl, args, path, fullroute, isAnchor) {
    isAnchor ? (0, _Utils.scrollToAnchor)(mdl.state.anchor) : (0, _Utils.PageTitle)().scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "start"
    });
  },
  component: function component(mdl) {
    return m(_index["default"], {
      mdl: mdl
    }, m(_blog["default"], {
      mdl: mdl
    }));
  }
}, {
  id: "blog-editor",
  name: "Blog Editor",
  // icon: Icons.home,
  route: "/social/blog-editor:objectId",
  isNav: false,
  group: ["social"],
  children: [],
  options: [],
  onmatch: function onmatch(mdl, args, path, fullroute, isAnchor) {
    isAnchor ? (0, _Utils.scrollToAnchor)(mdl.state.anchor) : (0, _Utils.PageTitle)().scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "start"
    });
  },
  component: function component(mdl) {
    return m(_index["default"], {
      mdl: mdl
    }, m(_blogEditor["default"], {
      mdl: mdl
    }));
  }
}, {
  id: "blog-post",
  name: "",
  // icon: Icons.home,
  route: "/social/blog-post:objectId",
  isNav: false,
  group: ["social"],
  children: [],
  options: [],
  onmatch: function onmatch(mdl, args, path, fullroute, isAnchor) {
    isAnchor ? (0, _Utils.scrollToAnchor)(mdl.state.anchor) : (0, _Utils.PageTitle)().scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "start"
    });
  },
  component: function component(mdl) {
    return m(_index["default"], {
      mdl: mdl
    }, m(_blogPost["default"], {
      mdl: mdl
    }));
  }
}, {
  id: "map-of-bonham-acres",
  name: "Explore Bonham Acres",
  // icon: Icons.home,
  route: "/social/map",
  isNav: true,
  group: ["nav", "social"],
  children: [],
  options: [],
  onmatch: function onmatch(mdl, args, path, fullroute, isAnchor) {
    isAnchor ? (0, _Utils.scrollToAnchor)(mdl.state.anchor) : (0, _Utils.PageTitle)().scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "start"
    });
  },
  component: function component(mdl) {
    return m(_index["default"], {
      mdl: mdl
    }, m(_default2["default"], {
      mdl: mdl
    }));
  }
}, {
  id: "bfn-park",
  name: "Bonham Family Nature Park",
  // icon: Icons.home,
  route: "/external",
  external: "https://www.pct3.com/Parks/Bonham-Family-Nature-Park",
  isNav: true,
  group: ["nav", "social", "external"],
  children: [],
  options: []
}];
var _default = SocialRoutes;
exports["default"] = _default;
});

;require.register("Styles/animations.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RemoveChildrenOut = exports.animate = exports.SlideChildrenInDown = exports.StretchInLeft = exports.SlideChildrenInRight = exports.SlideUp = exports.FadeIn = exports.FadeOut = exports.FadeBack = exports.SlideDown = exports.SlideOutLeft = exports.SlideOutRight = exports.replaceCSS = exports.AddToCartOut = exports.ToggleFadeOut = exports.AddToCart = exports.SlideInRight = exports.SlideInLeft = exports.SlideInUp = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var SlideInUp = function SlideInUp(_ref) {
  var dom = _ref.dom;
  return dom.classList.toggle("slideInUp");
};

exports.SlideInUp = SlideInUp;

var SlideInLeft = function SlideInLeft(_ref2) {
  var dom = _ref2.dom;
  return dom.classList.toggle("slideInLeft");
};

exports.SlideInLeft = SlideInLeft;

var SlideInRight = function SlideInRight(_ref3) {
  var dom = _ref3.dom;
  return dom.classList.toggle("slideInRight");
};

exports.SlideInRight = SlideInRight;

var AddToCart = function AddToCart(_ref4) {
  var dom = _ref4.dom;
  return dom.classList.toggle("slide-out-tr");
};

exports.AddToCart = AddToCart;

var ToggleFadeOut = function ToggleFadeOut(_ref5) {
  var dom = _ref5.dom;
  return dom.classList.toggle("fade");
};

exports.ToggleFadeOut = ToggleFadeOut;

var AddToCartOut = function AddToCartOut(_ref6) {
  var dom = _ref6.dom;
  AddToCart({
    dom: dom
  });
  return new Promise(function (resolve) {
    return setTimeout(function () {
      resolve();
    }, 500);
  });
};

exports.AddToCartOut = AddToCartOut;

var replaceCSS = function replaceCSS(a, b) {
  return function (_ref7) {
    var dom = _ref7.dom;
    dom.classList.replace(a, b);
    return new Promise(function (resolve) {
      return setTimeout(function () {
        resolve();
      }, 300);
    });
  };
};

exports.replaceCSS = replaceCSS;

var SlideOutRight = function SlideOutRight(_ref8) {
  var dom = _ref8.dom;
  dom.classList.replace("slideInLeft", "slideOutLeft");
  return new Promise(function (resolve) {
    return setTimeout(function () {
      resolve();
    }, 300);
  });
};

exports.SlideOutRight = SlideOutRight;

var SlideOutLeft = function SlideOutLeft(_ref9) {
  var dom = _ref9.dom;
  dom.classList.replace("slideInRight", "slideOutRight");
  return new Promise(function (resolve) {
    return setTimeout(function () {
      resolve();
    }, 300);
  });
};

exports.SlideOutLeft = SlideOutLeft;

var SlideDown = function SlideDown(_ref10) {
  var dom = _ref10.dom;
  dom.style.opacity = 0;
  dom.classList.toggle("slideInDown");
  dom.style.opacity = 1;
};

exports.SlideDown = SlideDown;

var FadeBack = function FadeBack(_ref11) {
  var dom = _ref11.dom;
  dom.classList.replace("fade", "fadeback");
  return new Promise(function (resolve) {
    return setTimeout(function () {
      dom.classList.replace("fadeback", "fade");
      dom.addEventListener("animationend", resolve);
    });
  });
};

exports.FadeBack = FadeBack;

var FadeOut = function FadeOut(_ref12) {
  var dom = _ref12.dom;
  dom.classList.replace("fade", "fadeOut");
  return new Promise(function (resolve) {
    return setTimeout(function () {
      dom.classList.replace("fadeOut", "fade");
      dom.addEventListener("animationend", resolve);
    });
  });
};

exports.FadeOut = FadeOut;

var FadeIn = function FadeIn(_ref13) {
  var dom = _ref13.dom;
  console.log(dom.classList);
  dom.classList.replace("fadeOut", "fade");
  console.log(dom.classList);
  return new Promise(function (resolve) {
    return setTimeout(function () {
      dom.addEventListener("animationend", resolve);
    }, 3000);
  });
};

exports.FadeIn = FadeIn;

var SlideUp = function SlideUp(_ref14) {
  var dom = _ref14.dom;
  dom.classList.replace("slideInDown", "slideOutUp");
  return new Promise(function (resolve) {
    return setTimeout(function () {
      resolve();
    }, 300);
  });
};

exports.SlideUp = SlideUp;

var SlideChildrenInRight = function SlideChildrenInRight(_ref15) {
  var dom = _ref15.dom;

  var children = _toConsumableArray(dom.children);

  return children.map(function (child, idx) {
    child.style.opacity = 0;
    setTimeout(function () {
      child.classList.toggle("slideInLeft");
      child.style.opacity = 1;
    }, (idx + 1) * 10);
  });
};

exports.SlideChildrenInRight = SlideChildrenInRight;

var StretchInLeft = function StretchInLeft(idx) {
  return function (_ref16) {
    var dom = _ref16.dom;
    dom.style.opacity = 0;
    return setTimeout(function () {
      dom.classList.toggle("stretchRight");
      dom.style.opacity = 1;
    }, idx * 100 + 20);
  };
};

exports.StretchInLeft = StretchInLeft;

var SlideChildrenInDown = function SlideChildrenInDown(idx) {
  return function (_ref17) {
    var dom = _ref17.dom;
    dom.style.opacity = 0;
    setTimeout(function () {
      dom.classList.toggle("slideDown");
      dom.style.opacity = 1;
    }, (idx + 1) * 200);
  };
};

exports.SlideChildrenInDown = SlideChildrenInDown;

var animate = function animate(dir) {
  return function (_ref18) {
    var dom = _ref18.dom;
    dom.style.opacity = 0;
    setTimeout(function () {
      dom.classList.toggle(dir);
      dom.style.opacity = 1;
    }, 200);
  };
};

exports.animate = animate;

var RemoveChildrenOut = function RemoveChildrenOut(_ref19) {
  var dom = _ref19.dom;
  return new Promise(function () {
    ;

    _toConsumableArray(dom.children).reverse().map(function (child, idx) {
      return setTimeout(function () {
        child.style.display = "none";
      }, idx * 100);
    });
  });
};

exports.RemoveChildrenOut = RemoveChildrenOut;
});

;require.register("Utils/helpers.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PageTitle = exports.oneExists = exports.exists = exports.handlers = exports.formatDate = exports.parsePrices = exports.getTotal = exports.getQuantity = exports.getPrice = exports.toProducts = exports.listOf = exports.uuid = exports.isActiveRoute = exports.jsonCopy = exports.randomEl = exports.scrollToAnchor = exports.getRoute = exports.debounce = exports.filterTask = exports._paginate = exports._direction = exports._sort = exports._search = exports.addTerms = exports.infiniteScroll = exports.isEmpty = exports.log = exports.makeRoute = void 0;

var _ramda = require("ramda");

var _data = _interopRequireDefault(require("data.task"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var makeRoute = (0, _ramda.compose)((0, _ramda.join)("-"), (0, _ramda.split)(" "), (0, _ramda.trim)(), (0, _ramda.toLower)());
exports.makeRoute = makeRoute;

var log = function log(m) {
  return function (v) {
    console.log(m, v);
    return v;
  };
};

exports.log = log;

var isEmpty = function isEmpty(data) {
  return data.length == 0;
};

exports.isEmpty = isEmpty;

var infiniteScroll = function infiniteScroll(mdl) {
  return function (e) {
    var route = mdl.state.route;
    var length = mdl.data[route].data.length;
    var setpoint = 10 * length * mdl.state.scrollPos;

    if (e.target.scrollTop - mdl.state.scrollPos >= setpoint) {
      mdl.state.scrollPos++ + e.target.scrollTop;
    }
  };
};

exports.infiniteScroll = infiniteScroll;

var addTerms = function addTerms(item) {
  var terms = (0, _ramda.compose)((0, _ramda.join)(" "), _ramda.values, (0, _ramda.props)(["uuid", "id", "name"]))(item);
  return (0, _ramda.assoc)("_terms", terms, item);
};

exports.addTerms = addTerms;

var byTerms = function byTerms(query) {
  return (0, _ramda.compose)((0, _ramda.test)(new RegExp(query, "i")), (0, _ramda.prop)("name"));
};

var _search = function _search(query) {
  return (0, _ramda.compose)((0, _ramda.filter)(byTerms(query)));
};

exports._search = _search;

var _sort = function _sort(p) {
  return (0, _ramda.sortBy)((0, _ramda.compose)(_ramda.toLower, toString, (0, _ramda.prop)(p)));
};

exports._sort = _sort;

var _direction = function _direction(dir) {
  return dir == "asc" ? _ramda.identity : _ramda.reverse;
};

exports._direction = _direction;

var _paginate = function _paginate(offset) {
  return function (limit) {
    return function (data) {
      return (0, _ramda.slice)((0, _ramda.max)(0, (0, _ramda.min)(offset, data.length)), (0, _ramda.min)(offset + limit, data.length), data);
    };
  };
};

exports._paginate = _paginate;

var filterTask = function filterTask(query) {
  return function (prop) {
    return function (direction) {
      return function (offset) {
        return function (limit) {
          return (0, _ramda.compose)(_data["default"].of, (0, _ramda.map)(_paginate(offset)(limit)), (0, _ramda.map)(_direction(direction)), (0, _ramda.map)(_sort(prop)), _search(query));
        };
      };
    };
  };
};

exports.filterTask = filterTask;

var debounce = function debounce(wait, now) {
  return function (fn) {
    var timeout = undefined;
    return function () {
      var context = this;
      var args = arguments;

      var later = function later() {
        timeout = undefined;
        if (!now) fn.apply(context, args);
      };

      var callNow = now && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      console.log(fn);
      if (callNow) fn.apply(context, args);
    };
  };
};

exports.debounce = debounce;

var getRoute = function getRoute() {
  return (0, _ramda.last)(m.route.get().split("/"));
};

exports.getRoute = getRoute;

var scrollToAnchor = function scrollToAnchor(anchor) {
  var is = function is(el) {
    return el !== undefined && el !== null;
  }; //if you pass an undefined anchor it will scroll to the top of the body


  var targetEl = is(anchor) ? document.getElementById(anchor) : document.body;
  var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  var target = is(targetEl) ? targetEl.getBoundingClientRect().top : 0;
  return window.scroll({
    top: target + scrollTop - 150,
    left: 0,
    behavior: "smooth"
  });
};

exports.scrollToAnchor = scrollToAnchor;

var randomEl = function randomEl(list) {
  return list[Math.floor(Math.random() * list.length)];
};

exports.randomEl = randomEl;

var jsonCopy = function jsonCopy(src) {
  return JSON.parse(JSON.stringify(src));
};

exports.jsonCopy = jsonCopy;

var isActiveRoute = function isActiveRoute(route) {
  return m.route.get() == route ? "is-active" : "";
};

exports.isActiveRoute = isActiveRoute;

var uuid = function uuid() {
  return "xxxxxxxx".replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
        v = c == "x" ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
};

exports.uuid = uuid;

var listOf = function listOf(x) {
  return function (y) {
    return Array(x).fill(y);
  };
};

exports.listOf = listOf;

var toProducts = function toProducts(cart) {
  return (0, _ramda.toPairs)(cart).map(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        product = _ref2[0],
        genders = _ref2[1];

    return [product, (0, _ramda.toPairs)(genders)];
  });
};

exports.toProducts = toProducts;

var getPrice = function getPrice(mdl, title, genders) {
  return mdl.state.prices[title] * getQuantity(genders);
};

exports.getPrice = getPrice;

var getQuantity = function getQuantity(xs) {
  return (0, _ramda.reduce)(_ramda.add, 0, (0, _ramda.filter)((0, _ramda.compose)((0, _ramda.equals)("Number"), _ramda.type), (0, _ramda.flatten)(xs)));
};

exports.getQuantity = getQuantity;

var getTotal = function getTotal(mdl, products) {
  return getQuantity(products.map(function (p) {
    return getPrice(mdl, p[0], p[1]);
  }));
};

exports.getTotal = getTotal;

var toPriceModel = function toPriceModel(_ref3) {
  var Burpies = _ref3.Burpies,
      Wraps = _ref3.Wraps,
      Blankets = _ref3.Blankets,
      Collections = _ref3.Collections;
  return {
    Burpies: Burpies,
    Wraps: Wraps,
    Blankets: Blankets,
    Collections: Collections
  };
};

var parsePrices = (0, _ramda.compose)(toPriceModel, _ramda.last, (0, _ramda.prop)("results"));
exports.parsePrices = parsePrices;

var formatDate = function formatDate(date) {
  return date.split("T")[0];
};

exports.formatDate = formatDate;

var handlers = function handlers(types, fn) {
  return types.reduce(function (acc, type) {
    return Object.assign(acc, _defineProperty({}, type, fn));
  }, {});
};

exports.handlers = handlers;

var exists = function exists(xs) {
  return xs.length >= 1;
};

exports.exists = exists;

var oneExists = function oneExists(xs, ys) {
  return exists(xs) || exists(ys);
};

exports.oneExists = oneExists;

var PageTitle = function PageTitle() {
  return document.getElementById("page-title");
};

exports.PageTitle = PageTitle;
});

;require.register("Utils/http.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.parseHttpSuccess = exports.parseHttpError = void 0;

var _data = _interopRequireDefault(require("data.task"));

var _secrets = require("../../.secrets.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var updatePayPalAuth = function updatePayPalAuth(mdl) {
  return function (paypal) {
    return mdl.state.paypal = paypal;
  };
};

var onProgress = function onProgress(mdl) {
  return function (e) {
    if (e.lengthComputable) {
      mdl.state.loadingProgress.max = e.total;
      mdl.state.loadingProgress.value = e.loaded;
      m.redraw();
    }
  };
};

function onLoad() {
  return false;
}

var onLoadStart = function onLoadStart(mdl) {
  return function (e) {
    mdl.state.isLoading(true);
    return false;
  };
};

var onLoadEnd = function onLoadEnd(mdl) {
  return function (e) {
    mdl.state.isLoading(false);
    mdl.state.loadingProgress.max = 0;
    mdl.state.loadingProgress.value = 0;
    return false;
  };
};

var xhrProgress = function xhrProgress(mdl) {
  return {
    config: function config(xhr) {
      xhr.onprogress = onProgress(mdl);
      xhr.onload = onLoad;
      xhr.onloadstart = onLoadStart(mdl);
      xhr.onloadend = onLoadEnd(mdl);
    }
  };
};

var parseHttpError = function parseHttpError(mdl) {
  return function (rej) {
    return function (e) {
      mdl.state.isLoading(false);
      return rej(e.response);
    };
  };
};

exports.parseHttpError = parseHttpError;

var parseHttpSuccess = function parseHttpSuccess(mdl) {
  return function (res) {
    return function (data) {
      mdl.state.isLoading(false);
      return res(data);
    };
  };
};

exports.parseHttpSuccess = parseHttpSuccess;

var HttpTask = function HttpTask(_headers) {
  return function (method) {
    return function (mdl) {
      return function (url) {
        return function (body) {
          mdl.state.isLoading(true);
          return new _data["default"](function (rej, res) {
            return m.request(_objectSpread({
              method: method,
              url: url,
              headers: _objectSpread({}, _headers),
              body: body,
              withCredentials: false
            }, xhrProgress(mdl))).then(parseHttpSuccess(mdl)(res), parseHttpError(mdl)(rej));
          });
        };
      };
    };
  };
};

var lookupLocationTask = function lookupLocationTask(query) {
  return new _data["default"](function (rej, res) {
    return m.request({
      method: "GET",
      url: "https://nominatim.openstreetmap.org/search?q=".concat(query, "&format=json")
    }).then(res, rej);
  });
};

var getTask = function getTask(mdl) {
  return function (url) {
    return HttpTask({})("GET")(mdl)(url)(null);
  };
};

var paypalUrl = "".concat(_secrets.PAYPAL.sandbox.baseUrl, "/");
var paypal = {
  getTokenTask: function getTokenTask(mdl) {
    return HttpTask(_secrets.PAYPAL.sandbox.headers())("POST")(mdl)(paypalUrl + "v1/oauth2/token/")("grant_type=client_credentials").map(updatePayPalAuth(mdl));
  },
  getTask: function getTask(mdl) {
    return function (url) {
      return HttpTask(_secrets.PAYPAL.sandbox.headers(mdl))("GET")(mdl)(paypalUrl + url)(null);
    };
  },
  postTask: function postTask(mdl) {
    return function (url) {
      return function (dto) {
        return HttpTask(_secrets.PAYPAL.sandbox.headers(mdl))("POST")(mdl)(paypalUrl + url)(dto);
      };
    };
  },
  putTask: function putTask(mdl) {
    return function (url) {
      return function (dto) {
        return HttpTask(_secrets.PAYPAL.sandbox.headers(mdl))("PUT")(mdl)(paypalUrl + url)(dto);
      };
    };
  }
};
var back4App = {
  getTask: function getTask(mdl) {
    return function (url) {
      return HttpTask(_secrets.BACK4APP.headers(mdl, _secrets.BACK4APP))("GET")(mdl)("".concat(_secrets.BACK4APP.baseUrl, "/").concat(url))(null);
    };
  },
  postTask: function postTask(mdl) {
    return function (url) {
      return function (dto) {
        return HttpTask(_secrets.BACK4APP.headers(mdl, _secrets.BACK4APP))("POST")(mdl)("".concat(_secrets.BACK4APP.baseUrl, "/").concat(url))(dto);
      };
    };
  },
  putTask: function putTask(mdl) {
    return function (url) {
      return function (dto) {
        return HttpTask(_secrets.BACK4APP.headers(mdl, _secrets.BACK4APP))("PUT")(mdl)("".concat(_secrets.BACK4APP.baseUrl, "/").concat(url))(dto);
      };
    };
  },
  deleteTask: function deleteTask(mdl) {
    return function (url) {
      return HttpTask(_secrets.BACK4APP.headers(mdl, _secrets.BACK4APP))("DELETE")(mdl)("".concat(_secrets.BACK4APP.baseUrl, "/").concat(url))();
    };
  }
};
var imgBB = {
  postTask: function postTask(mdl) {
    return function (dto) {
      dto.set("key", _secrets.IMGBB.apiKey);
      return HttpTask()("POST")(mdl)("".concat(_secrets.IMGBB.url, "?key=").concat(_secrets.IMGBB.apiKey))(dto);
    };
  }
};
var http = {
  imgBB: imgBB,
  back4App: back4App,
  paypal: paypal,
  HttpTask: HttpTask,
  getTask: getTask,
  lookupLocationTask: lookupLocationTask
};
var _default = http;
exports["default"] = _default;
});

;require.register("Utils/index.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _helpers = require("./helpers.js");

Object.keys(_helpers).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _helpers[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _helpers[key];
    }
  });
});

var _http = require("./http.js");

Object.keys(_http).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _http[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _http[key];
    }
  });
});

var _validation = require("./validation.js");

Object.keys(_validation).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _validation[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _validation[key];
    }
  });
});

var _storage = require("./storage.js");

Object.keys(_storage).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _storage[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _storage[key];
    }
  });
});

var _markdown = require("./markdown.js");

Object.keys(_markdown).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _markdown[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _markdown[key];
    }
  });
});
});

;require.register("Utils/markdown.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseMarkdown = void 0;

/***   Regex Markdown Parser by chalarangelo   ***/
// Replaces 'regex' with 'replacement' in 'str'
// Curry function, usage: replaceRegex(regexVar, replacementVar) (strVar)
var replaceRegex = function replaceRegex(regex, replacement) {
  return function (str) {
    return str.replace(regex, replacement);
  };
}; // Regular expressions for Markdown (a bit strict, but they work)


var codeBlockRegex = /((\n\t)(.*))+/g;
var inlineCodeRegex = /(`)(.*?)\1/g;
var imageRegex = /!\[([^\[]+)\]\(([^\)]+)\)/g;
var linkRegex = /\[([^\[]+)\]\(([^\)]+)\)/g;
var headingRegex = /\n(#+\s*)(.*)/g;
var boldItalicsRegex = /(\*{1,2})(.*?)\1/g;
var strikethroughRegex = /(\~\~)(.*?)\1/g;
var blockquoteRegex = /\n(&gt;|\>)(.*)/g;
var horizontalRuleRegex = /\n((\-{3,})|(={3,}))/g;
var unorderedListRegex = /(\n\s*(\-|\+)\s.*)+/g;
var orderedListRegex = /(\n\s*([0-9]+\.)\s.*)+/g;
var paragraphRegex = /\n+(?!<pre>)(?!<h)(?!<ul>)(?!<blockquote)(?!<hr)(?!\t)([^\n]+)\n/g; // Replacer functions for Markdown

var codeBlockReplacer = function codeBlockReplacer(fullMatch) {
  return "\n<pre>" + fullMatch + "</pre>";
};

var inlineCodeReplacer = function inlineCodeReplacer(fullMatch, tagStart, tagContents) {
  return "<code>" + tagContents + "</code>";
};

var imageReplacer = function imageReplacer(fullMatch, tagTitle, tagURL) {
  return '<img src="' + tagURL + '" alt="' + tagTitle + '" />';
};

var linkReplacer = function linkReplacer(fullMatch, tagTitle, tagURL) {
  return '<a href="' + tagURL + '">' + tagTitle + "</a>";
};

var headingReplacer = function headingReplacer(fullMatch, tagStart, tagContents) {
  return "\n<h" + tagStart.trim().length + ">" + tagContents + "</h" + tagStart.trim().length + ">";
};

var boldItalicsReplacer = function boldItalicsReplacer(fullMatch, tagStart, tagContents) {
  return "<" + (tagStart.trim().length == 1 ? "em" : "strong") + ">" + tagContents + "</" + (tagStart.trim().length == 1 ? "em" : "strong") + ">";
};

var strikethroughReplacer = function strikethroughReplacer(fullMatch, tagStart, tagContents) {
  return "<del>" + tagContents + "</del>";
};

var blockquoteReplacer = function blockquoteReplacer(fullMatch, tagStart, tagContents) {
  return "\n<blockquote>" + tagContents + "</blockquote>";
};

var horizontalRuleReplacer = function horizontalRuleReplacer(fullMatch) {
  return "\n<hr />";
};

var unorderedListReplacer = function unorderedListReplacer(fullMatch) {
  var items = "";
  fullMatch.trim().split("\n").forEach(function (item) {
    items += "<li>" + item.substring(2) + "</li>";
  });
  return "\n<ul>" + items + "</ul>";
};

var orderedListReplacer = function orderedListReplacer(fullMatch) {
  var items = "";
  fullMatch.trim().split("\n").forEach(function (item) {
    items += "<li>" + item.substring(item.indexOf(".") + 2) + "</li>";
  });
  return "\n<ol>" + items + "</ol>";
};

var paragraphReplacer = function paragraphReplacer(fullMatch, tagContents) {
  return "<p>" + tagContents + "</p>";
}; // Rules for Markdown parsing (use in order of appearance for best results)


var replaceCodeBlocks = replaceRegex(codeBlockRegex, codeBlockReplacer);
var replaceInlineCodes = replaceRegex(inlineCodeRegex, inlineCodeReplacer);
var replaceImages = replaceRegex(imageRegex, imageReplacer);
var replaceLinks = replaceRegex(linkRegex, linkReplacer);
var replaceHeadings = replaceRegex(headingRegex, headingReplacer);
var replaceBoldItalics = replaceRegex(boldItalicsRegex, boldItalicsReplacer);
var replaceceStrikethrough = replaceRegex(strikethroughRegex, strikethroughReplacer);
var replaceBlockquotes = replaceRegex(blockquoteRegex, blockquoteReplacer);
var replaceHorizontalRules = replaceRegex(horizontalRuleRegex, horizontalRuleReplacer);
var replaceUnorderedLists = replaceRegex(unorderedListRegex, unorderedListReplacer);
var replaceOrderedLists = replaceRegex(orderedListRegex, orderedListReplacer);
var replaceParagraphs = replaceRegex(paragraphRegex, paragraphReplacer); // Fix for tab-indexed code blocks

var codeBlockFixRegex = /\n(<pre>)((\n|.)*)(<\/pre>)/g;

var codeBlockFixer = function codeBlockFixer(fullMatch, tagStart, tagContents, lastMatch, tagEnd) {
  var lines = "";
  tagContents.split("\n").forEach(function (line) {
    lines += line.substring(1) + "\n";
  });
  return tagStart + lines + tagEnd;
};

var fixCodeBlocks = replaceRegex(codeBlockFixRegex, codeBlockFixer); // Replacement rule order function for Markdown
// Do not use as-is, prefer parseMarkdown as seen below

var replaceMarkdown = function replaceMarkdown(str) {
  return replaceParagraphs(replaceOrderedLists(replaceUnorderedLists(replaceHorizontalRules(replaceBlockquotes(replaceceStrikethrough(replaceBoldItalics(replaceHeadings(replaceLinks(replaceImages(replaceInlineCodes(replaceCodeBlocks(str))))))))))));
}; // Parser for Markdown (fixes code, adds empty lines around for parsing)
// Usage: parseMarkdown(strVar)


var parseMarkdown = function parseMarkdown(str) {
  return fixCodeBlocks(replaceMarkdown("\n" + str + "\n")).trim();
};

exports.parseMarkdown = parseMarkdown;
});

;require.register("Utils/slider.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSlider = createSlider;

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
/* jshint esversion:6 */

/**
 * slider class
 */


var VanillaSlider =
/**
 * @param {any} containerId element or id of element which shall be the container for the slider;
 * @param {{images: Array<any>, transitionTime: number, transitionDirectionX: string, transitionDirectionY: string, transitionZoom: string, swipe: boolean, auto: boolean, autoTime: number}} options options object for slider:
 * options.images: array of images, either strings (URLs) or objects with imageUrl, linkUrl, linkNewTab, textTitle, textBody, textPosition
 * options.transitionTime: time in ms until transition is finished;
 * options.transitionDirectionX: x direction for fading out element to move - 'left', 'right', or 'random'
 * options.transitionDirectionY: y direction for fading out element to move - 'up', 'down', or 'random'
 * options.transitionZoom: direction for zooming the fading out element - 'in', 'out', or 'random'
 * options.bullets: whether to show bullets
 * options.bulletColor: color for active bullet
 * options.bulletsHide: whether to hide bullets on mouse out
 * options.arrows: whether to show arrows
 * options.arrowsHide: whether to hide arrows on mouse out
 * options.swipe: whether to allow swipe support
 * options.auto: whether to automatically move slides
 * options.autoTime: time in ms for slides to automatically move
 * options.autoPauseOnHover: whether to pause auto on mouse hover
 */
function VanillaSlider(containerId) {
  var _this = this;

  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  _classCallCheck(this, VanillaSlider);

  this.containerId = containerId;
  this.images = options.images;
  this.transitionTime = options.transitionTime;
  this.transitionDirectionX = options.transitionDirectionX;
  this.transitionDirectionY = options.transitionDirectionY;
  this.transitionZoom = options.transitionZoom;
  this.bullets = options.bullets;
  this.bulletColor = options.bulletColor;
  this.bulletsHide = options.bulletsHide;
  this.arrows = options.arrows;
  this.arrowsHide = options.arrowsHide;
  this.swipe = options.swipe;
  this.auto = options.auto;
  this.autoTime = options.autoTime;
  this.autoPauseOnHover = options.autoPauseOnHover;
  this.webp = options.webp;
  this.currentIndex = 0; // index of currently shown image

  this.sliderLock = false; // slider is locked and can't transition

  this.imageElements = []; // image elements

  this.hover = false; // true on mouse in, false on mouse out

  this.autoPaused = false;
  this.touch = "ontouchstart" in document.documentElement; // true if browser supports touch
  // adjusting values

  this.transitionTime = this.transitionTime ? this.transitionTime : 250;
  this.bullets = typeof this.bullets === "boolean" ? this.bullets : false;
  this.bulletsHide = typeof this.bulletsHide === "boolean" && this.bullets ? this.bulletsHide : false;
  this.arrows = typeof this.arrows === "boolean" ? this.arrows : true;
  this.arrowsHide = typeof this.arrowsHide === "boolean" && this.arrows ? this.arrowsHide : true;
  this.swipe = typeof this.swipe === "boolean" ? this.swipe : true;
  this.auto = typeof this.auto === "boolean" ? this.auto : false;
  this.autoTime = typeof this.autoTime === "number" ? this.autoTime : 10000;
  this.autoPauseOnHover = typeof this.autoPauseOnHover === "boolean" ? this.autoPauseOnHover : true;
  this.webp = typeof this.webp === "boolean" ? this.webp : false;

  if (this.webp) {
    var ff = window.navigator.userAgent.match(/Firefox\/([0-9]+)\./);
    var ffVer = ff ? parseInt(ff[1]) : 0;
    var ffSupport = ffVer > 64;
    var ua = window.navigator.userAgent;
    var edge = ua.indexOf("Edge/");
    var ieSupport = parseInt(ua.substring(edge + 5, ua.indexOf(".", edge)), 10) > 17;
    var webpTest;
    var elem = document.createElement("canvas");

    if (!!(elem.getContext && elem.getContext("2d"))) {
      // was able or not to get WebP representation
      webpTest = elem.toDataURL("image/webp").indexOf("data:image/webp") == 0;
    }

    this.webp = webpTest || ffSupport || ieSupport;
  } // check color


  if (this.bulletColor) {
    var isColor = function isColor(strColor) {
      var s = new Option().style;
      s.color = strColor;
      return s.color !== "";
    };

    this.bulletColor = isColor(this.bulletColor) ? this.bulletColor : "red";
  } else {
    this.bulletColor = "red"; // default bulletColor
  }

  if (!Array.isArray(this.images)) {
    this.images = null;
  }

  if (typeof this.containerId !== "string") {
    if (this.containerId.id) {
      this.containerId = this.containerId.id;
    }
  }

  if (!document.getElementById(this.containerId)) {
    throw "Slider error: conatinerId must be a valid element or id";
  } // place images in container


  var imageElement;
  var imageAnchor;
  var imagesIndex = 0;
  this.container = document.getElementById(this.containerId);

  if (!this.images) {
    this.images = [];
    var containerChildren = this.container.children;
    [].forEach.call(containerChildren, function (containerChild) {
      imageAnchor = null;

      if (containerChild.tagName === "A") {
        imageAnchor = containerChild;
        containerChild = containerChild.firstElementChild;
      }

      if (containerChild.tagName === "IMG") {
        _this.images[imagesIndex] = {};
        _this.images[imagesIndex].imageUrl = containerChild.src;

        if (imageAnchor) {
          _this.images[imagesIndex].linkUrl = imageAnchor.href;
          _this.images[imagesIndex].linkNewTab = imageAnchor.target === "_blank";
        }

        if (containerChild.hasAttribute("text-title")) {
          _this.images[imagesIndex].textTitle = containerChild.getAttribute("text-title");
        }

        if (containerChild.hasAttribute("text-body")) {
          _this.images[imagesIndex].textBody = containerChild.getAttribute("text-body");
        }

        if (containerChild.hasAttribute("text-position")) {
          _this.images[imagesIndex].textPosition = containerChild.getAttribute("text-position");
        }

        if (containerChild.hasAttribute("webp-url")) {
          _this.images[imagesIndex].webpUrl = containerChild.getAttribute("webp-url");
        }

        if (containerChild.hasAttribute("alt")) {
          _this.images[imagesIndex].alt = containerChild.getAttribute("alt");
        }

        if (containerChild.hasAttribute("title")) {
          _this.images[imagesIndex].title = containerChild.getAttribute("title");
        }

        imagesIndex++;
      } else {
        console.log("Slider error: invalid container child tag name: " + containerChild.tagName);
      }
    });
  }

  this.container.innerHTML = "";
  this.images.forEach(function (image, index) {
    if (typeof image === "string") {
      image = {
        imageUrl: image,
        linkUrl: null,
        linkNewTab: null
      };
    }

    imageElement = document.createElement("IMG");
    imageElement.id = _this.containerId + "-slide-" + index;

    if (_this.webp && image.webpUrl) {
      imageElement.src = image.webpUrl;
    } else {
      imageElement.src = image.imageUrl;
    }

    imageElement.classList.add("vanilla-slider-image");
    imageElement.style.margin = "auto";
    imageElement.style.width = "100%";
    imageElement.style.maxWidth = "100%";
    imageElement.style.position = "absolute";
    imageElement.style.top = 0;
    imageElement.style.left = 0;

    if (image.alt) {
      imageElement.alt = image.alt;
    }

    if (image.title) {
      imageElement.title = image.title;
    }

    if (index > 0) {
      imageElement.style.visibility = "hidden";
      imageElement.style.zIndex = 0;
    } else {
      imageElement.style.zIndex = 2;
    }

    _this.container.appendChild(imageElement);

    _this.imageElements[index] = imageElement;
  });

  if (this.images.length < 1) {
    throw "Slider error: no images found for slides.";
  }

  var isIE = function isIE() {
    return navigator.userAgent.indexOf("MSIE ") > -1 || navigator.userAgent.indexOf("Trident/") > -1;
  }; // style container


  this.container.classList.add("vanilla-slider-container");
  this.container.style.marginLeft = "auto";
  this.container.style.marginRight = "auto";
  this.container.style.maxWidth = "100%";
  this.container.style.display = "flex";
  this.container.style.overflow = "hidden";
  this.container.style.position = "relative";

  if (isIE()) {
    this.container.style.alignItems = "flex-end";
  }

  var addArrowStyles = function addArrowStyles(arrow) {
    arrow.style.zIndex = 6;
    arrow.style.color = "#fff";
    arrow.style.fontSize = "2.5em";
    arrow.style.fontWeight = "bold";
    arrow.style.cursor = "pointer";
    arrow.style.transition = "all 0.3s linear";
    arrow.style.textShadow = "0px 0px 10px rgba(0,0,0,0.5)";
    return arrow;
  };

  if (this.arrows) {
    // create left arrow
    this.leftArrow = document.createElement("SPAN");
    this.leftArrow.id = this.containerId + "-arrow-left";
    this.leftArrow.classList.add("vanilla-slider-arrow");
    this.leftArrow.classList.add("vanilla-slider-arrow-left");
    this.leftArrow = addArrowStyles(this.leftArrow);
    this.leftArrow.style.margin = "auto auto auto 10px";
    this.leftArrow.innerHTML = "&#10094;";
    this.leftArrow.addEventListener("click", function (event) {
      _this.prevSlide();

      event.stopPropagation();
    });

    if (isIE()) {
      this.leftArrow.style.marginTop = "45%";
      this.leftArrow.style.transform = "translateY(-55%)";
    } // this.leftArrow.addEventListener('mouseover', () => {
    //     this.leftArrow.style.transform = 'scale(1.2)';
    // });
    // this.leftArrow.addEventListener('mouseout', () => {
    //     this.leftArrow.style.transform = 'scale(1.0)';
    // });


    this.container.appendChild(this.leftArrow);
  }

  if (this.bullets) {
    // create bullet container
    this.bulletContainer = document.createElement("DIV");
    this.bulletContainer.id = this.containerId + "-bullet-container";
    this.bulletContainer.classList.add("vanilla-slider-bullet-container");
    this.bulletContainer.style.zIndex = 6;
    this.bulletContainer.style.position = "relative";
    this.bulletContainer.style.margin = "auto auto 0";
    this.bulletContainer.style.textAlign = "center";

    if (isIE()) {
      this.bulletContainer.style.marginTop = "65%";
    }

    this.container.appendChild(this.bulletContainer); // create bullets

    this.bullets = [];
    var bullet;
    this.imageElements.forEach(function (element, index) {
      bullet = document.createElement("SPAN");
      bullet.id = _this.containerId + "-bullet-" + index;
      bullet.classList.add("vanilla-slider-bullet");
      bullet.style.color = "#fff";
      bullet.style.zIndex = 10;
      bullet.style.fontSize = "2em";
      bullet.style.margin = "0 5px";
      bullet.style.cursor = "pointer";
      bullet.style.transition = "all " + _this.transitionTime / 1000 + "s linear";
      bullet.style.textShadow = "0px 0px 5px rgba(0,0,0,0.5)";
      bullet.innerHTML = "&bull;";
      bullet.addEventListener("click", function (event) {
        _this.goToSlide(index);

        event.stopPropagation();
      });

      if (index === 0) {
        bullet.style.color = _this.bulletColor;
      }

      _this.bullets[index] = bullet;

      _this.bulletContainer.appendChild(bullet);
    }); // hide bullets

    if (this.bulletsHide) {
      this.bulletContainer.style.visibility = "hidden";
      this.bulletContainer.style.opacity = 0;
      this.bulletContainer.style.transition = "visibility 0.3s linear,opacity 0.3s linear";
      this.container.addEventListener("mouseenter", function () {
        _this.bulletContainer.style.visibility = "visible";
        _this.bulletContainer.style.opacity = 1;
      });
      this.container.addEventListener("mouseleave", function () {
        _this.bulletContainer.style.visibility = "hidden";
        _this.bulletContainer.style.opacity = 0;
      });
    }
  }

  if (this.arrows) {
    // create right arrow
    this.rightArrow = document.createElement("SPAN");
    this.rightArrow.id = this.containerId + "-arrow-right";
    this.rightArrow.classList.add("vanilla-slider-arrow");
    this.rightArrow.classList.add("vanilla-slider-arrow-right");
    this.rightArrow = addArrowStyles(this.rightArrow);
    this.rightArrow.style.margin = "auto 10px auto auto";
    this.rightArrow.innerHTML = "&#10095;";
    this.rightArrow.addEventListener("click", function (event) {
      _this.nextSlide();

      event.stopPropagation();
    });

    if (isIE()) {
      this.rightArrow.style.marginTop = "45%";
      this.rightArrow.style.transform = "translateY(-55%)";
    } // this.rightArrow.addEventListener('mouseover', () => {
    //     this.rightArrow.style.transform = 'scale(1.2)';
    // });
    // this.rightArrow.addEventListener('mouseout', () => {
    //     this.rightArrow.style.transform = 'scale(1.0)';
    // });


    this.container.appendChild(this.rightArrow); // hide arrows

    if (this.arrowsHide) {
      this.leftArrow.style.visibility = "hidden";
      this.leftArrow.style.opacity = 0;
      this.rightArrow.style.visibility = "hidden";
      this.rightArrow.style.opacity = 0;
      this.container.addEventListener("mouseenter", function () {
        _this.leftArrow.style.visibility = "visible";
        _this.leftArrow.style.opacity = 1;
        _this.rightArrow.style.visibility = "visible";
        _this.rightArrow.style.opacity = 1;
      });
      this.container.addEventListener("mouseleave", function () {
        _this.leftArrow.style.visibility = "hidden";
        _this.leftArrow.style.opacity = 0;
        _this.rightArrow.style.visibility = "hidden";
        _this.rightArrow.style.opacity = 0;
      });
    }
  }
  /**
   * resize container, called on resizing browser window
   */


  this.resizeContainer = function () {
    _this.container.style.width = _this.container.parentNode.clientWidth + "px";
    var imageXYRatio = _this.imageElements[0].naturalWidth / _this.imageElements[0].naturalHeight;
    _this.container.style.height = parseFloat(_this.container.style.width.replace("px", "")) / imageXYRatio + "px";
  };

  window.addEventListener("resize", this.resizeContainer);
  /**
   * fades the target out
   * @param {element||string} fadeOutTarget element to fade out, or its id
   * @param {function} callback function executed when fade is finished
   * @param {{waitTime: any, fadeTime: number, direction: string, zoom: string}} options options object for fade:
   * options.waitTime: wait before executing - true for 2 sec, false for 0 sec, num for other (ms);
   * options.fadeTime: time for the fadeIn/fadeOut effects, defaults to 250;
   * options.direction: direction for the fading out element to fly away if position:aboslute (left, right, up, down) - null to stay still;
   * options.zoom: direction for the fading element to zoom if position:absolute (in, out) - null to stay same size
   */

  this.slideFadeOut = function (fadeOutTarget) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : []; // check cb

    if (typeof callback !== "function") {
      callback = function callback() {};
    } // check target


    if (typeof fadeOutTarget === "string") {
      fadeOutTarget = document.getElementById(fadeOutTarget);
    } // static values


    var defaultWaitTime = 2000;
    var defaultFadeTime = 500;
    var intervalTime = 20;
    var xDirections = ["left", "right", "random"];
    var yDirections = ["up", "down", "random"];
    var zooms = ["in", "out", "random"]; // default options

    options.waitTime = options.waitTime ? options.waitTime : false;
    options.fadeTime = options.fadeTime ? options.fadeTime : defaultFadeTime;
    options.directionX = options.directionX ? options.directionX : null;
    options.directionY = options.directionY ? options.directionY : null;
    options.zoom = options.zoom ? options.zoom : null;

    var isVisible = function isVisible(element) {
      return element.style.visibility !== "hidden";
    };

    var makeInvisible = function makeInvisible(element) {
      element.style.visibility = "hidden";
    };

    if (fadeOutTarget) {
      if (isVisible(fadeOutTarget)) {
        // set zoom/direction
        if (options.directionX) {
          options.directionX = xDirections.includes(options.directionX) ? options.directionX : null;

          if (options.directionX === "random") {
            options.directionX = ["right", "left", null][Math.floor(Math.random() * 3)];
          }

          var xDirectionInterval;

          switch (options.directionX) {
            case "right":
              xDirectionInterval = 1;
              break;

            case "left":
              xDirectionInterval = -1;
              break;
          }
        }

        if (options.directionY) {
          options.directionY = yDirections.includes(options.directionY) ? options.directionY : null;

          if (options.directionY === "random") {
            options.directionY = ["up", "down", null][Math.floor(Math.random() * 3)];
          }

          var yDirectionInterval;

          switch (options.directionY) {
            case "up":
              yDirectionInterval = -1;
              break;

            case "down":
              yDirectionInterval = 1;
              break;
          }
        }

        if (options.zoom) {
          options.zoom = zooms.includes(options.zoom) ? options.zoom : null;

          if (options.zoom === "random") {
            options.zoom = ["in", "out", null][Math.floor(Math.random() * 3)];
          }

          var zoomInterval;

          switch (options.zoom) {
            case "in":
              zoomInterval = 0.005;
              break;

            case "out":
              zoomInterval = -0.005;
              break;
          }
        }

        if (options.waitTime) {
          options.waitTime = options.waitTime === true ? defaultWaitTime : options.waitTime;
          options.waitTime = typeof options.waitTime === "number" ? options.waitTime : defaultWaitTime;
          setTimeout(function () {
            options.waitTime = false;

            _this.slideFadeOut(fadeOutTarget, callback, options);
          }, options.waitTime);
        } else {
          options.fadeTime = typeof options.fadeTime === "number" ? options.fadeTime : defaultFadeTime;
          var opacityInterval = intervalTime / options.fadeTime;
          fadeOutTarget.style.opacity = 1;
          var fadeOutEffect = setInterval(function () {
            if (fadeOutTarget.style.opacity > 0) {
              // fade out a little bit
              fadeOutTarget.style.opacity -= opacityInterval; // move a little bit in directions

              if (options.directionX) {
                fadeOutTarget.style.left = parseFloat(fadeOutTarget.style.left.replace("px", "")) + xDirectionInterval + "px";
              }

              if (options.directionY) {
                fadeOutTarget.style.top = parseFloat(fadeOutTarget.style.top.replace("px", "")) + yDirectionInterval + "px";
              } // zoom a little bit


              if (options.zoom) {
                if (!fadeOutTarget.style.transform) {
                  fadeOutTarget.style.transform = "scale(1)";
                }

                fadeOutTarget.style.transform = "scale(" + (parseFloat(fadeOutTarget.style.transform.replace("scale(", "").replace(")", "")) + zoomInterval) + ")";
              }
            } else {
              clearInterval(fadeOutEffect);
              makeInvisible(fadeOutTarget); // console.log('top: ' + fadeOutTarget.style.top);
              // console.log('left: ' + fadeOutTarget.style.left);

              fadeOutTarget.style.top = 0;
              fadeOutTarget.style.left = 0;
              fadeOutTarget.style.transform = "scale(1)";
              callback();
            }
          }, intervalTime);
        }
      } else {
        callback(); // setTimeout(callback, options.fadeTime);
      }
    } else {
      console.log("fadeOut error: no such element exists.");
    }
  };
  /**
   * get the index of the next slide
   */


  this.getNextIndex = function () {
    return (_this.currentIndex + 1) % _this.imageElements.length;
  };
  /**
   * get the index of the previous slide
   */


  this.getPrevIndex = function () {
    return _this.currentIndex < 1 ? _this.imageElements.length - 1 : _this.currentIndex - 1;
  };
  /**
   * go to the next slide, then execute the callback
   */


  this.nextSlide = function () {
    var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    _this.goToSlide(_this.getNextIndex(), callback);
  };
  /**
   * go to the previous slide, then execute the callback
   */


  this.prevSlide = function () {
    var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    _this.goToSlide(_this.getPrevIndex(), callback);
  };
  /**
   * go to the slide at index (if possible), then execute the callback
   */


  this.goToSlide = function (newIndex) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    if (typeof newIndex !== "number" || newIndex < 0 || newIndex + 1 > _this.imageElements.length) {
      console.log("Slider error: invalid index in goToSlide: " + newIndex);

      if (typeof callback === "function") {
        callback();
      }
    } else if (newIndex === _this.currentIndex) {
      console.log("Slider error: current index in goToSlide: " + newIndex);

      if (typeof callback === "function") {
        callback();
      }
    } else if (!_this.sliderLock) {
      _this.pauseAuto();

      if (_this.bullets) {
        _this.bullets[_this.currentIndex].style.color = "#fff";
        _this.bullets[newIndex].style.color = _this.bulletColor;
      }

      var finishSlide = function finishSlide() {
        _this.currentIndex = newIndex;

        _this.setSlideLink(newIndex);

        _this.setSlideText(newIndex);

        _this.sliderLock = false;

        if (typeof callback === "function") {
          callback();
        }

        if (!_this.autoPauseOnHover || !_this.hover || _this.touch) {
          _this.resumeAuto();
        }
      };

      _this.sliderLock = true;

      _this.transitionSlide(newIndex, finishSlide);
    } else {
      console.log("Slider error: slider is locked.");
    }
  };
  /**
   * start automatic slide movement
   */


  this.startAuto = function () {
    _this.auto = true;
    _this.autoInterval = setInterval(_this.nextSlide, _this.autoTime);
  };
  /**
   * pause automatic slide movement until slides move
   */


  this.pauseAuto = function () {
    if (_this.auto && !_this.autoPaused) {
      clearInterval(_this.autoInterval);
      _this.autoPaused = true;
    }
  };
  /**
   * pause automatic slide movement until slides move
   */


  this.resumeAuto = function () {
    if (_this.auto && _this.autoPaused) {
      _this.autoInterval = setInterval(_this.nextSlide, _this.autoTime);
      _this.autoPaused = false;
    }
  };
  /**
   * stop automatic slide movement
   */


  this.stopAuto = function () {
    clearInterval(_this.autoInterval);
    _this.auto = false;
  };
  /**
   * clear the link div for the slide, and if the next slide has a link, create the link div
   */


  this.setSlideLink = function (index) {
    if (_this.linkOverlay) {
      _this.container.removeChild(_this.linkOverlay);

      _this.linkOverlay = null;
    }

    if (_this.images[index].linkUrl) {
      _this.linkOverlay = document.createElement("DIV");
      _this.linkOverlay.id = _this.containerId + "-link-overlay";

      _this.linkOverlay.classList.add("vanilla-slider-link-overlay");

      _this.linkOverlay.style.zIndex = 5;
      _this.linkOverlay.style.position = "absolute";
      _this.linkOverlay.style.top = 0;
      _this.linkOverlay.style.left = 0;
      _this.linkOverlay.style.width = "100%";
      _this.linkOverlay.style.height = "100%";
      _this.linkOverlay.style.cursor = "pointer";

      if (_this.images[index].linkNewTab) {
        _this.linkOverlay.addEventListener("click", function () {
          window.open(_this.images[index].linkUrl, "_blank");
        });
      } else {
        _this.linkOverlay.addEventListener("click", function () {
          window.location.href = _this.images[index].linkUrl;
        });
      }

      _this.container.appendChild(_this.linkOverlay);
    }
  };
  /**
   * clear the link div for the slide, and if the next slide has a link, create the link div
   */


  this.setSlideText = function (index) {
    if (_this.textOverlay) {
      _this.container.removeChild(_this.textOverlay);

      _this.textOverlay = null;
    }

    if (_this.images[index].textTitle || _this.images[index].textBody) {
      _this.textOverlay = document.createElement("DIV");
      _this.textOverlay.id = _this.containerId + "-text-overlay";

      _this.textOverlay.classList.add("vanilla-slider-text-overlay");

      _this.textOverlay.style.zIndex = 6;
      _this.textOverlay.style.position = "absolute";
      _this.textOverlay.style.padding = "0 20px";
      _this.textOverlay.style.textAlign = "left";
      _this.textOverlay.style.color = "#fff";
      _this.textOverlay.style.textShadow = "0 0 20px black";
      _this.textOverlay.style.backgroundColor = "rgba(0,0,0,0.3)";
      _this.textOverlay.style.opacity = 0;
      _this.textOverlay.style.transition = "all 0.5s linear";
      var textOverlayContent = "";

      if (_this.images[index].textTitle) {
        textOverlayContent += "<h1>" + _this.images[index].textTitle + "</h1>";
      }

      if (_this.images[index].textBody) {
        textOverlayContent += "<h3>" + _this.images[index].textBody + "</h3>";
      }

      _this.images[index].textPosition = typeof _this.images[index].textPosition === "string" ? _this.images[index].textPosition : "SW";

      switch (_this.images[index].textPosition) {
        case "NW":
          _this.textOverlay.style.top = "20px";
          _this.textOverlay.style.left = "20px";
          break;

        case "NE":
          _this.textOverlay.style.top = "20px";
          _this.textOverlay.style.right = "20px";
          break;

        case "SE":
          _this.textOverlay.style.bottom = "20px";
          _this.textOverlay.style.right = "20px";
          break;

        default:
          // SW
          _this.textOverlay.style.bottom = "20px";
          _this.textOverlay.style.left = "20px";
          break;
      }

      _this.textOverlay.innerHTML = textOverlayContent;

      if (_this.images[index].linkUrl) {
        _this.textOverlay.style.cursor = "pointer";

        if (_this.images[index].linkNewTab) {
          _this.textOverlay.addEventListener("click", function () {
            window.open(_this.images[index].linkUrl, "_blank");
          });
        } else {
          _this.textOverlay.addEventListener("click", function () {
            window.location.href = _this.images[index].linkUrl;
          });
        }
      }

      _this.container.appendChild(_this.textOverlay);
    }
  };

  this.revealSlideText = function (index) {
    if ((_this.images[index].textTitle || _this.images[index].textBody) && _this.textOverlay) {
      var revealEffect = setInterval(function () {
        _this.textOverlay.style.opacity = parseFloat(_this.textOverlay.style.opacity) + parseFloat(0.1);

        if (_this.textOverlay.style.opacity >= 1) {
          clearInterval(revealEffect);
        }
      }, 5);
    }
  };
  /**
   * transition from one slide to another
   */


  this.transitionSlide = function (newIndex, callback) {
    _this.imageElements[newIndex].style.zIndex = 1;
    _this.imageElements[newIndex].style.opacity = 1;
    _this.imageElements[newIndex].style.visibility = "visible";

    _this.setSlideText(newIndex);

    _this.slideFadeOut(_this.imageElements[_this.currentIndex], function () {
      _this.imageElements[_this.currentIndex].style.zIndex = 0;
      _this.imageElements[newIndex].style.zIndex = 2;
      callback();

      _this.revealSlideText(newIndex);
    }, {
      fadeTime: _this.transitionTime,
      directionX: _this.transitionDirectionX,
      directionY: _this.transitionDirectionY,
      zoom: _this.transitionZoom
    });
  }; // set link of 1st slide


  this.setSlideLink(this.currentIndex); // set text of 1st slide

  this.setSlideText(this.currentIndex);
  this.revealSlideText(this.currentIndex); // set swipe listener

  if (this.swipe) {
    this.swiper = {};
    this.swiper.xDown = null;
    this.swiper.yDown = null;
    this.container.addEventListener("touchstart", function (evt) {
      _this.swiper.xDown = evt.touches[0].clientX;
      _this.swiper.yDown = evt.touches[0].clientY;
    }, false);

    var handleTouchMove = function handleTouchMove(evt) {
      if (!_this.swiper.xDown || !_this.swiper.yDown) {
        return;
      }

      var xUp = evt.touches[0].clientX;
      var yUp = evt.touches[0].clientY;
      _this.swiper.xDiff = _this.swiper.xDown - xUp;
      _this.swiper.yDiff = _this.swiper.yDown - yUp;

      if (Math.abs(_this.swiper.xDiff) > Math.abs(_this.swiper.yDiff)) {
        // Most significant.
        var transition = {};

        if (_this.swiper.xDiff > 0) {
          transition = {
            x: _this.transitionDirectionX,
            y: _this.transitionDirectionY,
            z: _this.transitionZoom
          };
          _this.transitionDirectionX = "left";
          _this.transitionDirectionY = false;
          _this.transitionZoom = false;

          _this.nextSlide(function () {
            _this.transitionDirectionX = transition.x;
            _this.transitionDirectionY = transition.y;
            _this.transitionZoom = transition.z;
          });
        } else {
          transition = {
            x: _this.transitionDirectionX,
            y: _this.transitionDirectionY,
            z: _this.transitionZoom
          };
          _this.transitionDirectionX = "right";
          _this.transitionDirectionY = false;
          _this.transitionZoom = false;

          _this.prevSlide(function () {
            _this.transitionDirectionX = transition.x;
            _this.transitionDirectionY = transition.y;
            _this.transitionZoom = transition.z;
          });
        }
      } // Reset values.


      _this.swiper.xDown = null;
      _this.swiper.yDown = null;
    };

    this.container.addEventListener("touchmove", function (evt) {
      handleTouchMove(evt);
    }, false);
  } // start automatic slide movement


  if (this.auto) {
    this.startAuto(); // place mouse listeners for auto pause/resume

    if (this.autoPauseOnHover) {
      this.container.addEventListener("mouseenter", function () {
        _this.pauseAuto();
      });
      this.container.addEventListener("mouseleave", function () {
        _this.resumeAuto();
      });
    }
  }

  if (!this.touch) {
    // set listeners for hover property
    this.container.addEventListener("mouseenter", function () {
      _this.hover = true;
    });
    this.container.addEventListener("mouseleave", function () {
      _this.hover = false;
    });
  } // resize once first image is loaded


  if (this.imageElements[0]) {
    this.imageElements[0].addEventListener("load", this.resizeContainer);
  }
};
/**
 * Returns a VanillaSlider created from containerId and options
 * @param {string|Node} containerId element or id of element to be the slider container
 * @param {object} options slider options object for slider configuration
 */


function createSlider(containerId, options) {
  return new VanillaSlider(containerId, options);
}

/**
 * includes polyfill
 */
if (!Array.prototype.includes) {
  Object.defineProperty(Array.prototype, "includes", {
    enumerable: false,
    value: function value(obj) {
      var newArr = this.filter(function (el) {
        return el == obj;
      });
      return newArr.length > 0;
    }
  });
}
});

;require.register("Utils/storage.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.saveStorageTask = exports.getDbStorageTask = exports.saveDbStorageTask = exports.saveLocalStorageTask = exports.getSessionStorageTask = exports.getLocalStorageTask = void 0;

var _data = _interopRequireDefault(require("data.task"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var getLocalStorageTask = function getLocalStorageTask(key) {
  return new _data["default"](function (rej, res) {
    return localStorage.getItem(key) ? rej("nothing here") : res(localStorage.getItem(key));
  });
};

exports.getLocalStorageTask = getLocalStorageTask;

var getSessionStorageTask = function getSessionStorageTask(key) {
  return new _data["default"](function (rej, res) {
    return sessionStorage.getItem(key) ? rej("nothing here") : res(sessionStorage.getItem(key));
  });
};

exports.getSessionStorageTask = getSessionStorageTask;

var saveLocalStorageTask = function saveLocalStorageTask(key) {
  return function (value) {
    localStorage.setItem(key, JSON.stringify(value));
    return _data["default"].of(localStorage.getItem(key));
  };
};

exports.saveLocalStorageTask = saveLocalStorageTask;

var saveDbStorageTask = function saveDbStorageTask(mdl) {
  return function (cart) {
    return mdl.http.back4App.putTask(mdl)("classes/Accounts/".concat(mdl.user.account.objectId))({
      cart: JSON.parse(cart)
    });
  };
};

exports.saveDbStorageTask = saveDbStorageTask;

var getDbStorageTask = function getDbStorageTask(mdl) {
  return mdl.http.back4App.gettTask(mdl)("classes/Accounts/".concat(mdl.user.account.objectId));
};

exports.getDbStorageTask = getDbStorageTask;

var saveStorageTask = function saveStorageTask(mdl) {
  return function (key) {
    return function (value) {
      return mdl.state.isAuth() ? saveLocalStorageTask(key)(value).chain(saveDbStorageTask(mdl)) : saveLocalStorageTask(key)(value);
    };
  };
};

exports.saveStorageTask = saveStorageTask;
});

;require.register("Utils/validation.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isNilOrEmptyOrAtom = exports.allCaps = exports.inDateRange = exports.unique = exports.maxLengthNullable = exports.onlyNumeric = exports.urlFormat = exports.phoneFormat = exports.onlyAlphaNumericSpaceSpecial = exports.onlyAlphaNumericSpaceUnderscore = exports.onlyAlphaNumericSpace = exports.onlyAlphaNumericUnderscore = exports.onlyAlphaNumeric = exports.onlyAlpha = exports.emailFormat = exports.maxSize = exports.maxLength = exports.isNullOrEmpty = exports.isNotNullOrEmpty = exports.IsNotNil = exports.isRequired = exports.validate = exports.getOrElse = void 0;

var _ramda = require("ramda");

var _data = require("data.validation");

var _data2 = _interopRequireDefault(require("data.maybe"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var getOrElse = function getOrElse(val) {
  return function (x) {
    return x.getOrElse(val);
  };
};

exports.getOrElse = getOrElse;
var validate = (0, _ramda.curry)(function (rule, lens, msg, data) {
  return rule((0, _ramda.view)(lens, data)) ? (0, _data.Success)(data) : (0, _data.Failure)([(0, _ramda.set)(lens, msg, {})]);
});
exports.validate = validate;
var isRequired = (0, _ramda.compose)(_ramda.not, _ramda.isEmpty);
exports.isRequired = isRequired;
var IsNotNil = (0, _ramda.compose)(_ramda.not, _ramda.isNil);
exports.IsNotNil = IsNotNil;

var isNotNullOrEmpty = function isNotNullOrEmpty(data) {
  return !isNullOrEmpty(data);
};

exports.isNotNullOrEmpty = isNotNullOrEmpty;

var isNullOrEmpty = function isNullOrEmpty(data) {
  return (0, _ramda.isNil)(data) || (0, _ramda.isEmpty)(data);
};

exports.isNullOrEmpty = isNullOrEmpty;

var maxLength = function maxLength(max) {
  return (0, _ramda.compose)((0, _ramda.gte)(max), _ramda.length);
};

exports.maxLength = maxLength;
var maxSize = (0, _ramda.curry)(function (max, value) {
  return (0, _ramda.gte)(max, value);
});
exports.maxSize = maxSize;
var emailFormat = (0, _ramda.test)(/@/);
exports.emailFormat = emailFormat;
var onlyAlpha = (0, _ramda.test)(/^[a-zA-Z]*$/);
exports.onlyAlpha = onlyAlpha;
var onlyAlphaNumeric = (0, _ramda.test)(/^[a-zA-Z0-9]*$/);
exports.onlyAlphaNumeric = onlyAlphaNumeric;
var onlyAlphaNumericUnderscore = (0, _ramda.test)(/^[a-zA-Z0-9_]*$/);
exports.onlyAlphaNumericUnderscore = onlyAlphaNumericUnderscore;
var onlyAlphaNumericSpace = (0, _ramda.test)(/^[a-zA-Z0-9\s]*$/);
exports.onlyAlphaNumericSpace = onlyAlphaNumericSpace;
var onlyAlphaNumericSpaceUnderscore = (0, _ramda.test)(/^[a-zA-Z0-9_\s]*$/);
exports.onlyAlphaNumericSpaceUnderscore = onlyAlphaNumericSpaceUnderscore;
var onlyAlphaNumericSpaceSpecial = (0, _ramda.test)(/^[a-zA-Z0-9_.~!*''();:@&=+$,/?#[%-\]+\s]*$/);
exports.onlyAlphaNumericSpaceSpecial = onlyAlphaNumericSpaceSpecial;
var phoneFormat = (0, _ramda.test)(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/);
exports.phoneFormat = phoneFormat;
var urlFormat = (0, _ramda.test)(/^[a-zA-Z0-9_.~!*''();:@&=+$,/?#[%-\]+]*$/);
exports.urlFormat = urlFormat;
var onlyNumeric = (0, _ramda.test)(/^[0-9]*$/);
exports.onlyNumeric = onlyNumeric;

var maxLengthNullable = function maxLengthNullable(max) {
  return (0, _ramda.compose)(getOrElse(false), (0, _ramda.map)((0, _ramda.gte)(max)), (0, _ramda.map)(_ramda.length), _data2["default"].fromNullable);
};

exports.maxLengthNullable = maxLengthNullable;
var unique = (0, _ramda.curry)(function (keys, value) {
  var lookup = _data2["default"].fromNullable(keys);

  return !(0, _ramda.contains)((0, _ramda.toUpper)(value.toString()), (0, _ramda.map)(function (y) {
    return (0, _ramda.toUpper)(y.toString());
  }, lookup.getOrElse([])));
});
exports.unique = unique;
var inDateRange = (0, _ramda.curry)(function (start, end, value) {
  if (value == null || value === '') {
    return true;
  }

  return new Date(start) <= new Date(value) && new Date(value) < new Date(end);
});
exports.inDateRange = inDateRange;

var allCaps = function allCaps(str) {
  return str.toUpperCase() === str;
};

exports.allCaps = allCaps;

var isNilOrEmptyOrAtom = function isNilOrEmptyOrAtom(item) {
  return (0, _ramda.isNil)(item) || (0, _ramda.isEmpty)(item) || item === '{$type:atom}';
};

exports.isNilOrEmptyOrAtom = isNilOrEmptyOrAtom;
});

;require.register("app.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var toRoutes = function toRoutes(mdl) {
  return function (acc, route) {
    acc[route.route] = {
      onmatch: function onmatch(args, path, fullroute) {
        mdl.state.showNavModal(false);

        if (route.group.includes("authenticated") && !mdl.state.isAuth()) {
          mdl.route.set(m.route.get());
        }

        mdl.state.route = route;
        mdl.state.anchor = path.split("#")[1];
        mdl.state.navState(route.id);

        if (route.route.split("/")[2]) {
          mdl.state.subnavState(route.route);
          mdl.state.navState(route.route.split("/")[1]);
        } else {
          mdl.state.subnavState(null);
          mdl.state.navState(route.id);
        }

        var isAnchor = Boolean(mdl.state.anchor);
        route.onmatch(mdl, args, path, fullroute, isAnchor);
      },
      render: function render() {
        return route.component(mdl);
      }
    };
    return acc;
  };
};

var App = function App(mdl) {
  return mdl.Routes.reduce(toRoutes(mdl), {});
};

var _default = App;
exports["default"] = _default;
});

;require.register("images.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var Images = ["images/IMG_4029.webp", "images/IMG_3989.webp", "images/IMG_3990.webp", "images/IMG_3991.webp", "images/IMG_3992.webp", "images/IMG_3993.webp", "images/IMG_3995.webp", "images/IMG_3996.webp", "images/IMG_3997.webp", "images/IMG_3998.webp", "images/IMG_3999.webp", "images/IMG_4001.webp", "images/IMG_4002.webp", "images/IMG_4003.webp", "images/IMG_4004.webp", "images/IMG_4005.webp", "images/IMG_4006.webp", "images/IMG_4007.webp", "images/IMG_4008.webp", "images/IMG_4009.webp", "images/IMG_4010.webp", "images/IMG_4011.webp", "images/IMG_4012.webp", "images/IMG_4013.webp", "images/IMG_4014.webp", "images/IMG_4015.webp", "images/IMG_4016.webp", "images/IMG_4017.webp", "images/IMG_4018.webp", "images/IMG_4019.webp", "images/IMG_4020.webp", "images/IMG_4021.webp", "images/IMG_4022.webp", "images/IMG_4023.webp", "images/IMG_4024.webp", "images/IMG_4025.webp", "images/IMG_4026.webp", "images/IMG_4027.webp", "images/IMG_4028.webp"];
var _default = Images;
exports["default"] = _default;
});

;require.register("index.js", function(exports, require, module) {
"use strict";

var _funConfig = require("@boazblake/fun-config");

var _app = _interopRequireDefault(require("./app.js"));

var _index = _interopRequireDefault(require("Models/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_funConfig.FunConfig.configure();

_index["default"].navState = _index["default"].Routes.reduce(function (acc, r) {
  if (r.children.any()) acc[r.id] = Stream(false);
  return acc;
}, {});
var root = document.body;
var winW = window.innerWidth;

if (module.hot) {
  module.hot.accept();
}

if ('development' !== "production") {
  console.log("Looks like we are in development mode!");
} else {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("./sw.js").then(function (registration) {
        console.log("⚙️ SW registered: ", registration);
      })["catch"](function (registrationError) {
        console.log("🧟 SW registration failed: ", registrationError);
      });
    });
  }
} // set display profiles


var getProfile = function getProfile(w) {
  if (w < 424) return "phone";
  if (w < 624) return "wide";
  if (w < 1000) return "tablet";
  return "desktop";
};

var checkWidth = function checkWidth(winW) {
  var w = window.innerWidth;

  if (winW !== w) {
    winW = w;
    var lastProfile = _index["default"].settings.screenSize;
    _index["default"].settings.screenSize = getProfile(w);
    if (lastProfile != _index["default"].settings.screenSize) m.redraw();
  }

  return requestAnimationFrame(checkWidth);
};

_index["default"].settings.screenSize = getProfile(winW);
checkWidth(winW);

if (sessionStorage.getItem("baca-session-token")) {
  var onError = function onError(e) {
    sessionStorage.clear();
    console.error("shit", e);
  };

  var onSuccess = function onSuccess(user) {
    _index["default"].user = user;
    user.emailVerified ? _index["default"].state.isAuth(true) : sessionStorage.clear();
  };

  _index["default"].http.back4App.getTask(_index["default"])("users/me").fork(onError, onSuccess);
}

m.route(root, "/", (0, _app["default"])(_index["default"]));
m.route.set("/about");
});

;require.register("initialize.js", function(exports, require, module) {
"use strict";

document.addEventListener("DOMContentLoaded", function () {
  return require("./index.js");
});
});

;require.alias("process/browser.js", "process");process = require('process');require.register("___globals___", function(exports, require, module) {
  

// Auto-loaded modules from config.npm.globals.
window.m = require("mithril");
window.Stream = require("mithril-stream");


});})();require('___globals___');


//# sourceMappingURL=app.js.map