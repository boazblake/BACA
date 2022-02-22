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
require.register("Components/DateTime.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _dayjs = _interopRequireDefault(require("dayjs"));

var _advancedFormat = _interopRequireDefault(require("dayjs/plugin/advancedFormat"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dayjs["default"].extend(_advancedFormat["default"]);

var DateTime = function DateTime(_ref) {
  var event = _ref.attrs.event;

  var formatDate = function formatDate(x) {
    return (0, _dayjs["default"])(x).format("dddd, MMMM Do YYYY");
  };

  var formatTime = function formatTime(x) {
    return (0, _dayjs["default"])(x).format("h:mm a");
  };

  return {
    view: function view() {
      return event.startDate == event.endDate ? m(".", m("h3", m("label.strong", formatDate(event.startDate))), m("h4.grouped", m("label", formatTime(event.start)), m("label", " - "), m("label", formatTime(event.end)))) : m("h4.grouped", m("label.strong", formatDate(event.startDate)), m("label", " - "), m("label.strong", formatDate(event.endDate)));
    }
  };
};

var _default = DateTime;
exports["default"] = _default;
});

;require.register("Components/Hamburger.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _cjs = require("@mithril-icons/clarity/cjs");

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
      }, [mdl.state.isAuth() && m("label", "Welcome ".concat(mdl.user.name && mdl.user.name.split(" ")[0])), mdl.state.showNavModal() ? m(_cjs.WindowCloseLine, filledGreen) : m(_cjs.MenuLine, filledGreen)]);
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
    console.log("close", close);
    console.log("title", title);
    console.log("content", content);
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
    }, [m("header.modal-header", [m("a.btn btn-clear float-right", {
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
      log("saveToStorage - error")(e);
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

// const getOverFlow = (mdl, overflow) => {
//   console.log(
//     mdl.settings.screenSize,
//     mdl.settings.screenSize == "phone" ? "none" : overflow
//   )
//   return mdl.settings.screenSize == "phone" ? "none" : overflow
// }
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

;require.register("Components/orders.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Orders = void 0;

var _Utils = require("Utils");

var _cjs = require("@mithril-icons/clarity/cjs");

var _ramda = require("ramda");

var STATE = function STATE() {
  return {
    invoices: []
  };
};

var state = STATE();

var calcProductPrice = function calcProductPrice(_ref, product) {
  var prices = _ref.prices,
      cart = _ref.cart;
  return parseInt(prices[product]) * Object.values(cart[product]).reduce(_ramda.add, 0);
};

var calcTotalPrice = function calcTotalPrice(invoice) {
  return Object.keys(invoice.cart).map(function (product) {
    return calcProductPrice(invoice, product);
  }).reduce(_ramda.add, 0);
};

var invoiceUrl = function invoiceUrl(mdl) {
  var userInvoices = "{\"userId\":\"".concat(mdl.user.objectId, "\"}");
  return mdl.state.route.id == "dashboard" ? "classes/Invoices" : "classes/Invoices?where=".concat(encodeURI(userInvoices));
};

var fetchInvoicesTask = function fetchInvoicesTask(mdl) {
  return mdl.http.back4App.getTask(mdl)(invoiceUrl(mdl)).map((0, _ramda.prop)("results")).map((0, _ramda.map)((0, _ramda.assoc)("isSelected", false)));
};

var onFetchInvoiceError = function onFetchInvoiceError(mdl) {
  return function (e) {
    return log("e")([e, mdl]);
  };
};

var onFetchInvoiceSuccess = function onFetchInvoiceSuccess(_) {
  return function (invoices) {
    return state.invoices = invoices;
  };
};

var fetchInvoices = function fetchInvoices(_ref2) {
  var mdl = _ref2.attrs.mdl;
  return fetchInvoicesTask(mdl).fork(onFetchInvoiceError(mdl), onFetchInvoiceSuccess(mdl));
};

var InvoiceCell = function InvoiceCell() {
  return {
    view: function view(_ref3) {
      var screenSize = _ref3.attrs.mdl.settings.screenSize,
          children = _ref3.children;
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

var Invoice = function Invoice(_ref4) {
  var mdl = _ref4.attrs.mdl;
  return {
    view: function view(_ref5) {
      var invoice = _ref5.attrs.invoice;
      return [m("tr", m(InvoiceCell, {
        mdl: mdl
      }, m("", {
        key: "Date"
      }, (0, _Utils.formatDate)(invoice.purchaseTime))), m(InvoiceCell, {
        mdl: mdl
      }, m("", {
        key: "Order Id"
      }, invoice.orderID)), m(InvoiceCell, {
        mdl: mdl
      }, m("", {
        key: "Name"
      }, "".concat(invoice.shippingDestination.name.full_name, " "))), m(InvoiceCell, {
        mdl: mdl
      }, m("", {
        key: "Payment Status"
      }, invoice.status)), m(InvoiceCell, {
        mdl: mdl
      }, m("", {
        key: "Shipping Status",
        style: {
          width: "100%",
          borderBottom: "1px solid gold"
        }
      }, invoice.shippingStatus ? m("a", {
        href: invoice.shippingStatus
      }, "Shipping Status") : m("p", "Prepparing your order"))), m("td", m(_cjs.AngleLine, {
        "class": "clickable ".concat(!invoice.isSelected && "point-down"),
        onclick: function onclick() {
          return invoice.isSelected = !invoice.isSelected;
        },
        width: "16px"
      }))), invoice.isSelected && m("td", {
        colspan: 5,
        style: {
          width: "100%"
        }
      }, m("tr", m("td", m("label", "Shipping Destination"), "".concat(invoice.shippingDestination.address.address_line_1, " ").concat(invoice.shippingDestination.address.admin_area_2, " ").concat(invoice.shippingDestination.address.admin_area_1, " ").concat(invoice.shippingDestination.address.postal_code)), mdl.state.route.id == "dashboard" && m("td", m("button", "Update Shipping Status"))), m("table", {
        style: {
          width: "100%",
          borderBottom: "1px solid gold"
        }
      }, [m("thead", m("tr", [m("th", "Product"), m("th", "Quantities"), m("th", "Unit Price"), m("th", "Unit Total")])), m("tbody", Object.keys(invoice.cart).map(function (product) {
        return m("tr", [m("td", product), m("td", JSON.stringify(invoice.cart[product])), m("td", invoice.prices[product]), m("td", calcProductPrice(invoice, product))]);
      }), m("tr", m("th", "Order Total"), m("th", calcTotalPrice(invoice))))]))];
    }
  };
};

var Orders = function Orders() {
  return {
    onremove: state = STATE(),
    oninit: fetchInvoices,
    view: function view(_ref6) {
      var mdl = _ref6.attrs.mdl;
      return m("section.overflow-auto", {
        style: {
          minWidth: "100%",
          height: "75vh"
        }
      }, state.invoices.any() ? m("table.dash-table", mdl.settings.screenSize != "phone" && m("thead.dash-nav", m("tr.mb-5", [m("th", "Date"), m("th", "Order Id"), m("th", "Name"), m("th", "Payment Status"), m("th", "Shipping Status"), m("th")])), m("tbody", state.invoices.map(function (invoice) {
        return m(Invoice, {
          mdl: mdl,
          invoice: invoice
        });
      }))) : m("h2", "No Orders"));
    }
  };
};

exports.Orders = Orders;
});

;require.register("Components/paypal.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PayPal = void 0;

var _data = _interopRequireDefault(require("data.task"));

var _Utils = require("Utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var makePaymentTask = function makePaymentTask(actions) {
  log("makePaymentTask")(actions);
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
      log("formatInvoice")(user);
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
    log("addInvoiceTask")(invoice);
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
    log("state")(state);
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
              log("onapprove")(JSON.stringify(state));
              return makePaymentTask(actions).map(formatInvoice(mdl)(data)).chain(addInvoiceTask(mdl)).fork(onError(state), onSuccess(mdl, state));
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

var _cjs = require("@mithril-icons/clarity/cjs");

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
    return log("submitReport - error")(e);
  }; // save imgBB then
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var state = {
  image: Stream(0),
  start: Stream(null),
  timestamp: undefined
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

var updateBackground = function updateBackground(timestamp) {
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
      requestAnimationFrame(updateBackground);
    },
    view: function view(_ref4) {
      var mdl = _ref4.attrs.mdl;
      return m(".hero", {
        style: {
          marginTop: calcMargin(mdl)
        }
      }, _images["default"].map(function (image, idx) {
        return m("img.hero-img.animated.fadeout", {
          src: image,
          key: idx,
          "class": state.image() == idx ? "fadeInRight" : "fadeOutLeft",
          onload: function onload(e) {
            return e.target.classList.replace("fadeout", "fadeInRight");
          },
          style: {
            height: calcHeight(mdl)
          }
        });
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

var _loader = _interopRequireDefault(require("Components/loader"));

var _data = _interopRequireDefault(require("data.task"));

var _ramda = require("ramda");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var state = {
  status: "loading"
};

var showNavMenu = function showNavMenu(mdl) {
  return mdl.settings.screenSize !== "desktop" && mdl.state.showNavModal();
};

var vertAlign = function vertAlign(mdl) {
  return !mdl.Routes.find(function (r) {
    return mdl.state.navState() == r.id;
  }).children.any() ? "is-vertical-align" : "";
};

var onLayout = function onLayout(mdl) {
  return function (_ref) {
    var dom = _ref.dom;
    log("mdl")(mdl);
    mdl.settings.screenSize == "desktop" && dom.parentNode.addEventListener("scroll", function (e) {
      return onBodyScroll(mdl)(e);
    });
  };
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

var fetchAll = function fetchAll(_ref2) {
  var mdl = _ref2.attrs.mdl;

  var onError = function onError(e) {
    log("fetchAll - layout - error")(e);
    e.code == 504 && fetchAll({
      attrs: {
        mdl: mdl
      }
    });
    state.status = "error";
  };

  var onSuccess = function onSuccess(_ref3) {
    var events = _ref3.events,
        images = _ref3.images,
        blogs = _ref3.blogs;
    mdl.data.events = events;
    mdl.data.images = images;
    mdl.data.blogs = blogs;
    state.status = "loaded";
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

var onBodyScroll = function onBodyScroll(mdl) {
  return function (e) {
    log("event")(e.target.scrollTop);
  };
};

var Layout = {
  oninit: fetchAll,
  view: function view(_ref4) {
    var children = _ref4.children,
        mdl = _ref4.attrs.mdl;
    return m("#layout", {
      oncreate: onLayout(mdl),
      "data-theme": "light",
      id: "layout",
      role: "main"
    }, m(_toolbar["default"], {
      mdl: mdl
    }), mdl.settings.screenSize == "desktop" && m("nav.navigation", {
      "class": vertAlign(mdl)
    }, m(_navbar["default"], {
      mdl: mdl
    }), m(_subnavbar["default"], {
      mdl: mdl
    })), m(_hero["default"], {
      mdl: mdl
    }), state.status == "error" && m("p", "ERROR"), state.status == "loading" && m(_loader["default"]), state.status == "loaded" && m("section.animated.zoomIn", m(_main["default"], {
      mdl: mdl,
      children: children
    })), showNavMenu(mdl) && m(_navModal["default"], {
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
      return m("main", m("#page-title.is-marginless.bg-primary.text-white.is-vertical-align.is-horizontal-align.is-center", m("p.text-center.p-t-25", mdl.state.route.name)), children);
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

var _cjs = require("@mithril-icons/clarity/cjs");

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
      }, m("summary.nav-link", route.name), m("nav.row.fade.p-x-l-50", childRoutes.map(function (r) {
        return r.group.includes("external") ? m("a.col-12 icon nav-link", {
          target: "_blank",
          href: r.external
        }, r.name, m(_cjs.PopOutLine, {
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

var _cjs = require("@mithril-icons/clarity/cjs");

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
        }, r.name, m(_cjs.PopOutLine, {
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
      return m("nav#toolbar.sticky-nav.is-horizontal-align", {
        style: {
          "background-color": mdl.state.showNavModal() ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0.9)"
        }
      }, m(".nav-left.is-left", m("figure.pointer", m(m.route.Link, {
        selector: "img",
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
var Map = {
  locale: Stream(null),
  bounds: Stream(encodeURIComponent("-125.5957, 24.36711, -65.39063, 48.944")),
  defaultBounds: encodeURIComponent("-125.5957, 24.36711, -65.39063, 48.944")
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
  navState: Stream("/"),
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
  Map: Map,
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
  return ["profile" // "dues", "messages"
  ];
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
    console.log(mdl);
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

var _ramda = require("ramda");

var _cjs = require("@mithril-icons/clarity/cjs");

var _data = _interopRequireDefault(require("data.task"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var toProfileVM = function toProfileVM(_ref) {
  var emailVerified = _ref.emailVerified,
      email = _ref.email,
      name = _ref.name;
  return function (_ref2) {
    var objectId = _ref2.objectId,
        avatar = _ref2.avatar,
        address = _ref2.address;
    return {
      objectId: objectId,
      address: address,
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

var _Utils = require("Utils");

var _ramda = require("ramda");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var state = {
  files: [],
  locations: [],
  address: "",
  status: ""
};

var onError = function onError(e) {
  console.log("error", e);
};

var onSuccess = function onSuccess(s) {
  console.log("success", s);
};

var updateProfile = function updateProfile(mdl) {
  return function (data) {
    return mdl.http.back4App.putTask(mdl)("Classes/Accounts/".concat(mdl.data.profile.objectId))(data);
  };
};

var updateProfileMeta = function updateProfileMeta(mdl) {
  return function (_ref) {
    var name = _ref.name,
        email = _ref.email,
        address = _ref.address;
    return updateProfile(mdl)({
      name: name,
      email: email,
      address: address
    }).fork(onError, onSuccess);
  };
};

var uploadImage = function uploadImage(mdl) {
  return function (file) {
    var image = new FormData();
    image.append("image", file);
    mdl.http.imgBB.postTask(mdl)(image).map((0, _ramda.path)(["data", "thumb", "url"])).map(function (avatar) {
      state.avatar = avatar;
      return {
        avatar: avatar
      };
    }).chain(updateProfile(mdl)).map(function () {
      return mdl.data.profile.avatar = state.avatar;
    }).fork(onError, onSuccess);
  };
};

var onInput = function onInput(profile) {
  return (0, _Utils.handlers)(["oninput"], function (e) {
    if (e.target.type == "checkbox") {
      return profile[e.target.id] = JSON.parse(e.target.checked);
    }

    if (e.target.id == "file") {
      return profile[e.target.id] = e.target.files[0];
    } else {
      return profile[e.target.id] = e.target.value;
    }
  });
};

var Profile = function Profile() {
  return {
    view: function view(_ref2) {
      var _ref2$attrs = _ref2.attrs,
          mdl = _ref2$attrs.mdl,
          data = _ref2$attrs.data;
      return m("section.p-y-50", m("article.row", _objectSpread({}, onInput(data)), m("figure.col", m("img.avatar", {
        src: data.avatar ? data.avatar : _Utils.AVATAR_URL
      }), m("figcaption", {
        style: {
          width: "180px"
        }
      }, m("label.button", {
        label: "profile-pic"
      }, "update profile picture", m("input", {
        style: {
          display: "none"
        },
        type: "file",
        id: "profile-pic",
        value: state.files,
        onchange: function onchange(e) {
          return uploadImage(mdl)(e.target.files);
        }
      })), "")), m("form.col", !data.emailVerified && m("label.warning", "email not verified"), m("label", "name", m("input", {
        id: "name",
        value: data.name
      })), m("label", "email", m("input", {
        id: "email",
        value: data.email
      })), m("label.icon", "Address", m("input", {
        oninput: function oninput(e) {
          if (e.target.value.length > 3) {
            state.status = "isloading";
            mdl.http.openCage.getLocationTask(mdl)(e.target.value.trim()).fork(function (e) {
              state.status = "error";
              log("error fetching locations")(e);
            }, function (_ref3) {
              var results = _ref3.results;
              state.status = "loaded";
              state.locations = results;
            });
          }
        },
        id: "address",
        value: data.address
      })), state.locations.any() && m("details.dropdown", m("summary.button.outline", "options"), m(".card", m("ul", state.locations.map(function (_ref4) {
        var formatted = _ref4.formatted;
        return m("li.pointer", {
          onclick: function onclick(e) {
            data.address = formatted;
            state.locations = [];
          }
        }, formatted);
      })))))), m(".nav", m(".nav-left", m("button.button.primary", {
        onclick: function onclick() {
          return updateProfileMeta(mdl)(data);
        }
      }, "Update")) // m(".nav-right", m("button.button.error", "Delete Account"))
      ));
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
exports.createMessagesTask = exports.createDuesTask = exports.createAccountTask = exports.registerUserTask = exports.resetPasswordTask = exports.loginTask = exports.loginUserTask = void 0;

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
    var login = encodeURI("username=".concat(email, "&password=").concat(password));
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
    return mdl.http.back4App.getTask(mdl)("classes/Dues?".concat(encodeId)).map((0, _ramda.prop)("results")).chain(function (dues) {
      return dues.any() ? _data["default"].of(dues) : createDuesTask(mdl);
    });
  };
};

var getUserMessagesTask = function getUserMessagesTask(mdl) {
  return function (encodeId) {
    return mdl.http.back4App.getTask(mdl)("classes/Messages?".concat(encodeId)).map((0, _ramda.prop)("results")).chain(function (messages) {
      return messages.any() ? _data["default"].of(messages) : createMessagesTask(mdl);
    });
  };
};

var getUserInfoTask = function getUserInfoTask(mdl) {
  var encodeId = encodeURI("where={\"userId\":\"".concat(mdl.user.objectId, "\"}"));
  return _data["default"].of(function (account) // (dues) => (messages) =>
  {
    mdl.data.account = account; // mdl.data.dues = dues
    // mdl.data.messages = messages
  }).ap(getUserAccountTask(mdl)(encodeId)); // .ap(getUserDuesTask(mdl)(encodeId))
  // .ap(getUserMessagesTask(mdl)(encodeId))
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

var resetPasswordTask = function resetPasswordTask(mdl, email) {
  return mdl.http.back4App.postTask(mdl)("requestPasswordReset")({
    email: email
  });
};

exports.resetPasswordTask = resetPasswordTask;

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
      password: password,
      role: role
    });
  };
};

exports.registerUserTask = registerUserTask;

var createAccountTask = function createAccountTask(mdl) {
  mdl.user.account = {
    address: "",
    avatar: ""
  };
  return mdl.http.back4App.postTask(mdl)("classes/Accounts")({
    userId: mdl.user.objectId,
    avatar: "",
    address: ""
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
    address: ""
  }).map(function (_ref5) {
    var objectId = _ref5.objectId;
    mdl.user.dues.objectId = objectId;
    return mdl;
  });
};

exports.createDuesTask = createDuesTask;

var createMessagesTask = function createMessagesTask(mdl) {
  mdl.user.conversations = {};
  return mdl.http.back4App.postTask(mdl)("classes/Conversations")({
    userId: mdl.user.objectId
  }).map(function (_ref6) {
    var objectId = _ref6.objectId;
    mdl.user.conversations.objectId = objectId;
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

var _cjs = require("@mithril-icons/clarity/cjs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// import LogoLoader from "Components/LogoLoader"
var validateForm = function validateForm(mdl) {
  return function (data) {
    var onError = function onError(errs) {
      if (errs.code != 209) {
        state.errors = errs;
        state.msg(errs.error);
        state.showMsg(errs.error);
      } else {
        state.msg("There seems to be an issue with logging in. Have you registered or verified your email?");
        state.showMsg(true);
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

var resetPassword = function resetPassword(mdl, email) {
  var onError = function onError(_ref) {
    var message = _ref.message;
    state.msg(message);
    state.showMsg(true);
    state.showResetModal(false);
  };

  var onSuccess = function onSuccess() {
    state.showResetModal(false);
    state.msg("A password reset request was sent to the email provided, please check your email to reset your password.");
    state.showMsg(true);
  };

  (0, _fns.resetPasswordTask)(mdl, email).fork(onError, onSuccess);
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
  showMsg: Stream(false),
  msg: Stream(""),
  showResetModal: Stream(false)
};

var resetState = function resetState() {
  state.data = (0, _Utils.jsonCopy)(dataModel);
  state.errors = {};
  state.httpError = undefined;
  state.isSubmitted = false;
  state.showMsg(false);
  state.msg("");
  state.showResetModal(false);
};

var Login = function Login() {
  return {
    onremove: function onremove() {
      return resetState();
    },
    view: function view(_ref2) {
      var mdl = _ref2.attrs.mdl;
      return mdl.state.isLoading() ? "" //m(LogoLoader, { mdl })
      : m("section.container.p-y-50", state.showMsg() && m("p.text-error", state.msg()), m("article.card", mdl.settings.screenSize != "phone" && {
        style: {
          maxWidth: "80%",
          margin: "0 auto"
        }
      }, m("form.row", {
        role: "form",
        id: "login-form",
        onsubmit: function onsubmit(e) {
          return e.preventDefault();
        }
      }, m("formgroup.col-12", // {
      //   class: mdl.settings.screenSize == "desktop" && "grouped",
      // },
      m("input", {
        "class": state.isSubmitted ? state.errors.email ? "error" : "success" : "",
        id: "reg-email",
        type: "email",
        autocomplete: "username",
        placeholder: "Email",
        onkeyup: function onkeyup(e) {
          // state.isSubmitted && validateForm(mdl)(state.data)
          state.data.userModel.email = e.target.value;
        },
        value: state.data.userModel.email
      }), state.errors.email && m("p.text-error", state.errors.email)), m("formgroup.col-12", m("input", {
        "class": state.isSubmitted ? state.errors.password ? "error" : "success" : "",
        id: "reg-pass",
        type: "password",
        autocomplete: "current-password",
        placeholder: "Password",
        onkeyup: function onkeyup(e) {
          // state.isSubmitted && validateForm(mdl)(state.data)
          state.data.userModel.password = e.target.value;
        },
        value: state.data.userModel.password
      }), state.errors.password && m("p.text-error", state.errors.password))), m("button.button.primary.is-center", {
        role: "button",
        form: "login-form",
        onclick: function onclick() {
          return validateForm(mdl)(state.data);
        },
        "class": mdl.state.isLoading() && "loading"
      }, "LOGIN"), m("p.pointer.text-primary", {
        onclick: function onclick() {
          return state.showResetModal(true);
        }
      }, "Need to reset password ?"), state.showResetModal() && m("section.modal-container#modal", m("article.modal.card.grid", m("header.modal-header", "Reset Password", m("button.button.icon-only", {
        id: "modal-close",
        "aria-label": "Close",
        onclick: function onclick() {
          return state.showResetModal(false);
        }
      }, "X")), m("section.modal-content", m("input", {
        type: "email",
        autocomplete: "username",
        placeholder: "Enter Email",
        value: state.data.userModel.email,
        oninput: function oninput(e) {
          return state.data.userModel.email = e.target.value;
        }
      })), m("section.modal-footer", m("button", {
        onclick: function onclick() {
          return resetPassword(mdl, state.data.userModel.email);
        }
      }, "Reset Password")))), state.httpError && m(".toast toast-error", state.httpError)), m(".auth-link", "Need to ", m("u", m(_navLink["default"], {
        mdl: mdl,
        href: "/register",
        link: "register",
        classList: ""
      })), " ?"));
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

      state.errorMsg("Successfully registered - please check the email you used to register with for the verification link. After you have verified you may login, you will be redirected to the login page now.");
      state.showErrorMsg(true);
      setTimeout(function () {
        return m.route.set("/login");
      }, 3000);
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
      return m("section.container.p-y-50", state.showErrorMsg() && m("p.warning", state.errorMsg()), m("article.card", mdl.settings.screenSize != "phone" && {
        style: {
          maxWidth: "80%",
          margin: "0 auto"
        }
      }, m("form.row", {
        role: "form",
        id: "register-form",
        onsubmit: function onsubmit(e) {
          return e.preventDefault();
        }
      }, m("formgroup.col-12", m("", {
        "class": mdl.settings.screenSize == "phone" && "col-5"
      }, m("input", {
        "class": state.isSubmitted ? state.errors.name ? "error" : "success" : "",
        id: "reg-name",
        type: "text",
        placeholder: "Full Name",
        onkeyup: function onkeyup(e) {
          return state.data.userModel.name = e.target.value;
        },
        value: state.data.userModel.name
      })), state.errors.name && m("p.text-error", state.errors.name)), m("formgroup.row.col-12", // { class: mdl.settings.screenSize == "desktop" && "grouped" },
      m(".col-6", m("input", {
        "class": state.isSubmitted ? state.errors.email ? "error" : "success" : "",
        id: "reg-email",
        type: "email",
        autocomplete: "username",
        placeholder: "Email",
        onkeyup: function onkeyup(e) {
          return state.data.userModel.email = e.target.value;
        },
        value: state.data.userModel.email
      }), state.errors.email && m("p.text-error", state.errors.email)), m(".col-6", m("input", {
        id: "confirmEmail",
        "class": state.isSubmitted ? state.errors.confirmEmail ? "error" : "success" : "",
        type: "email",
        autocomplete: "username",
        placeholder: "Confirm Email",
        onkeyup: function onkeyup(e) {
          return state.data.userModel.confirmEmail = e.target.value;
        },
        value: state.data.userModel.confirmEmail
      }), state.errors.confirmEmail && m("p.text-error", state.errors.confirmEmail))), m("formgroup.row.col-12", // { class: mdl.settings.screenSize == "desktop" && "grouped" },
      m(".col-6", m("input", {
        "class": state.isSubmitted ? state.errors.password ? "error" : "success" : "",
        id: "reg-pass",
        type: "password",
        autocomplete: "new-password",
        placeholder: "Password",
        onkeyup: function onkeyup(e) {
          return state.data.userModel.password = e.target.value;
        },
        value: state.data.userModel.password
      }), state.errors.password && m("p.text-error", state.errors.password)), m(".col-6", m("input", {
        "class": state.isSubmitted ? state.errors.confirmPassword ? "error" : "success" : "",
        id: "pass-confirm",
        type: "password",
        autocomplete: "new-password",
        placeholder: "Confirm Password",
        onkeyup: function onkeyup(e) {
          return state.data.userModel.confirmPassword = e.target.value;
        },
        value: state.data.userModel.confirmPassword
      }), state.errors.confirmPassword && m("p.text-error", state.errors.confirmPassword))), m("button.button.primary.col-12", {
        form: "register-form",
        onclick: function onclick() {
          return validateForm(mdl)(state.data.userModel);
        },
        "class": mdl.state.isLoading() && "loading"
      }, "Register"))), m(".auth-link", "Need to ", m(_navLink["default"], {
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

var _fns = require("./fns");

var _loader = _interopRequireDefault(require("Components/loader.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var state = {
  status: "loading",
  objectId: null,
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

var fetchBlogImages = function fetchBlogImages(_ref) {
  var _ref$attrs = _ref.attrs,
      mdl = _ref$attrs.mdl,
      state = _ref$attrs.state;

  var onError = function onError(e) {
    return log("fetchBlogImages - error")(e);
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
    log("setupEditor error")(e);
    state.status = "error";
    e.code == 404 && m.route.set("/social/blog");
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
    state.editor.then(function (e) {
      return e.setData(text);
    });
    state.status = "loaded";
  };

  var id = m.route.get().split(":")[1];

  if ((0, _Utils.exists)(id)) {
    state.isEditing(true);
    mdl.http.back4App.getTask(mdl)("Classes/Blogs/".concat(id)).fork(onError, onSuccess);
  }
};

var initEditor = function initEditor(state) {
  return function (_ref5) {
    var dom = _ref5.dom;
    state.editor = ClassicEditor.create(dom, {
      toolbar: ["heading", "selectAll", "undo", "redo", "bold", "italic", "blockQuote", "link", "indent", "outdent", "numberedList", "bulletedList", "mediaEmbed", "insertTable", "tableColumn", "tableRow", "mergeTableCells"],
      heading: {
        options: [{
          model: "paragraph",
          title: "Paragraph",
          "class": "ck-heading_paragraph"
        }, {
          model: "heading1",
          view: "h1",
          title: "Heading 1",
          "class": "ck-heading_heading1"
        }, {
          model: "heading2",
          view: "h2",
          title: "Heading 2",
          "class": "ck-heading_heading2"
        }]
      }
    });
    state.editor.then(function (e) {
      return e.setData(state.text);
    });
  };
};

var handleImage = function handleImage(mdl) {
  return function (state) {
    return state.file ? uploadImage(mdl)(state.file) : state.showModal(false);
  };
};

var uploadImage = function uploadImage(mdl) {
  return function (file) {
    var onError = function onError(e) {
      return state.errors.img = e;
    };

    var onSuccess = function onSuccess(_ref6) {
      var image = _ref6.image,
          thumb = _ref6.thumb;
      state.img = image;
      state.thumb = thumb;
      state.showModal(false);
    };

    var image = new FormData();
    image.append("image", file);
    mdl.http.imgBB.postTask(mdl)(image).chain((0, _fns.saveImgToGalleryTask)(mdl)).fork(onError, onSuccess);
  };
};

var submitBlog = function submitBlog(mdl) {
  return function (_ref7) {
    var title = _ref7.title,
        img = _ref7.img,
        text = _ref7.text,
        thumb = _ref7.thumb,
        objectId = _ref7.objectId;

    var onError = function onError(e) {
      return console.log("e", e);
    };

    var onSuccess = function onSuccess(data) {
      return m.route.set("/social/blog-post:".concat(objectId ? objectId : data.objectId));
    };

    var dto = {
      title: title,
      img: img,
      text: text,
      author: mdl.user.name,
      thumb: thumb
    };
    var updateOrSubmitBlog = objectId ? mdl.http.back4App.putTask(mdl)("Classes/Blogs/".concat(objectId))(dto) : mdl.http.back4App.postTask(mdl)("Classes/Blogs")(dto);
    updateOrSubmitBlog.fork(onError, onSuccess);
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

var Modal = function Modal() {
  return {
    onremove: function onremove() {
      return (0, _fns.resetModalState)(state);
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
          handleImage(mdl)(state);
        },
        role: "button",
        disabled: !state.file && !(0, _Utils.exists)(state.img)
      }, state.modalState() == "select" ? "Use" : "Upload")))));
    }
  };
};

var BlogEditor = function BlogEditor() {
  return {
    onremove: function onremove() {
      return (0, _fns.resetEditorState)(state);
    },
    oninit: setupEditor,
    view: function view(_ref10) {
      var mdl = _ref10.attrs.mdl;
      return m(".grid", state.status == "loading" && m(_loader["default"]), state.status == "error" && m("p", "Error - redirecting"), state.status = "loaded" && m("form.container", _objectSpread({}, (0, _fns.onInput)(state)), m("section", m("label", "Title", m("input", {
        id: "title",
        value: state.title
      }))), m("section", state.thumb && m("aside.col-6", m("img.col-12", {
        src: state.thumb
      }), m("button.primary.col-12", {
        onclick: function onclick(e) {
          e.preventDefault();
          state.thumb = "";
          state.img = "";
        }
      }, "Remove image")), m(".col-12", m("button.primary.col-6", {
        onclick: function onclick(e) {
          e.preventDefault();
          state.showModal(!state.showModal());
        }
      }, state.thumb ? "Update Image" : "Add An Image"))), state.showModal() && m(Modal, {
        state: state,
        mdl: mdl
      }), m("section", m("#editor.fr-view", {
        onupdate: function onupdate(e) {
          return state.editor.then(function (e) {
            return state.text = e.getData();
          });
        },
        oncreate: initEditor(state)
      })), m("nav.container.grouped.is-center", m(m.route.Link, {
        selector: "button.button.secondary",
        href: state.objectId ? "/social/blog-post:".concat(state.objectId) : "/social/blog"
      }, "Cancel"), m("button.button.primary", {
        disabled: (0, _fns.isInvalid)(state),
        onclick: function onclick(e) {
          e.preventDefault();
          submitBlog(mdl)(state);
        }
      }, state.objectId ? "Update" : "Submit"), state.isEditing() && m("button.button.error", {
        onclick: function onclick(e) {
          e.preventDefault();
          (0, _fns.deleteBlog)(mdl)(state.objectId);
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

var _cjs = require("@mithril-icons/clarity/cjs");

var _Utils = require("Utils");

var _htmlSanitize = _interopRequireDefault(require("Utils/html-sanitize"));

var _blog = require("./blog");

var _loader = _interopRequireDefault(require("Components/loader.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var state = {
  status: "loading",
  blog: null,
  comments: null,
  "new": {
    comment: ""
  }
};
var Post = {
  view: function view(_ref) {
    var _ref$attrs = _ref.attrs,
        blog = _ref$attrs.blog,
        mdl = _ref$attrs.mdl;
    return m("section.card", m(".row", m("hgroup.col", m("h2.bold", blog.title), m("h4", m("i", "Added On ", blog.createdAt, blog.updatedAt !== blog.createdAt && [" and updated on: ", blog.updatedAt], " by ", blog.author))), m("figure.col-3.is-horizontal-align", m("img", {
      src: blog.thumb || "images/main.webp"
    }))), m("hgroup.col", m.trust(_htmlSanitize["default"].SanitizeHtml((0, _Utils.parseMarkdown)(blog.text)))), blog.author == mdl.user.name && m("footer.grouped", m(m.route.Link, {
      selector: "button.button.primary.icon",
      href: "/social/blog-editor:".concat(blog.objectId)
    }, "Edit", m(_cjs.NoteEditLine, {
      fill: "white"
    })), m("button.button.error", {
      onclick: function onclick() {
        return deleteBlog(mdl);
      }
    }, "Delete")));
  }
}; // const Comments = {
//   view: ({ attrs: { blog, comments, mdl } }) =>
//     m(
//       "section.container.p-y-25",
//       mdl.state.isAuth() &&
//         m(
//           "aside.card",
//           m(
//             "header.row",
//             m(
//               "figure.col-2",
//               m("img.avatar", {
//                 style: { maxWidth: "100px" },
//                 src: mdl.user.avatar || AVATAR_URL,
//               }),
//               m("caption", mdl.user.name)
//             ),
//             m(
//               ".col-10",
//               m(
//                 "textarea.w100",
//                 {
//                   // style: { width: "80%" },
//                   rows: 3,
//                   onchange: (e) => (state.new.comment = e.target.value),
//                 },
//                 state.new.comment
//               )
//             )
//           ),
//           m("footer.is-right", m("button.is-right", "Submit"))
//         ),
//       comments &&
//         comments.map((comment) =>
//           m(
//             "aside.row.card",
//             m(
//               "figure.col",
//               m("img.avatar", {
//                 style: { maxWidth: "100px" },
//                 src: mdl.user.avatar || AVATAR_URL,
//               }),
//               m("label.row", "comment.user"),
//               m("label.row", "comment.date")
//             ),
//             m("p.col", comment)
//           )
//         )
//     ),
// }

var toBlogs = function toBlogs() {
  return m.route.set("/social/blog");
};

var deleteBlog = function deleteBlog(mdl) {
  return mdl.http.back4App.deleteTask(mdl)("Classes/Blogs/".concat(state.blog.objectId)).fork(toBlogs, toBlogs);
};

var fetchBlogPost = function fetchBlogPost(_ref2) {
  var _ref2$attrs = _ref2.attrs,
      mdl = _ref2$attrs.mdl,
      id = _ref2$attrs.id;

  var onError = function onError(e) {
    log("fetchBlogPost")(e);
    e.code == 404 && m.route.set("/social/blog");
    state.status = "error";
  };

  var onSuccess = function onSuccess(_ref3) {
    var _ref4 = _slicedToArray(_ref3, 1),
        blog = _ref4[0];

    state.blog = blog;
    state.status = "loaded";
  };

  mdl.http.back4App.getTask(mdl)("Classes/Blogs/".concat(id)).map(Array.of).map(_blog.toViewModel).fork(onError, onSuccess);
};

var BlogPost = {
  oninit: fetchBlogPost,
  view: function view(_ref5) {
    var mdl = _ref5.attrs.mdl;
    return m("section.fade.p-y-6.container", state.status == "error" && m("p", "error redirecting"), state.status == "loading" && m(_loader["default"]), state.status == "loaded" && [m(m.route.Link, {
      selector: "button.button.primary.outline.icon",
      href: "/social/blog",
      "class": "primary"
    }, m(_cjs.ArrowLine, {
      style: {
        transform: "rotate(270deg)"
      }
    }), "Back To Blogs"), m(Post, {
      blog: state.blog,
      mdl: mdl
    }), // m(Comments, { blog: state.blog, comments: state.comments, mdl }),
    m(m.route.Link, {
      selector: "button.button.primary.outline.icon",
      href: "/social/blog",
      "class": "primary"
    }, m(_cjs.ArrowLine, {
      style: {
        transform: "rotate(270deg)"
      }
    }), "Back To Blogs")]);
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

var _htmlSanitize = _interopRequireDefault(require("Utils/html-sanitize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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
    }))), m("hgroup.col", m.trust(_htmlSanitize["default"].SanitizeHtml(text.replace(/<[^>]*>/g, "").slice(0, 100))), "...", m(m.route.Link, // "a.pointer",
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
      return mdl.state.isLoading() ? m(_loader["default"]) : m("article.grid.p-y-6.fade", m("section.container", mdl.state.isAuth() && m("nav.nav.m-y-6", m(".nav-center", m(m.route.Link, {
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

;require.register("Pages/Blog/fns.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onInput = exports.deleteBlog = exports.toBlogs = exports.saveImgToGalleryTask = exports.isInvalid = exports.resetEditorState = exports.resetModalState = void 0;

var _Utils = require("Utils");

var _data = _interopRequireDefault(require("data.task"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var resetModalState = function resetModalState(state) {
  state.images = [];
  state.modalState("upload");
};

exports.resetModalState = resetModalState;

var resetEditorState = function resetEditorState(state) {
  state.title = "";
  state.author = "";
  state.text = "";
  state.img = "";
  state.thumb = "";
  state.file = null;
  state.showPreview(false);
  state.isEditing(false);
  state.showModal(false);
  state.showHelp(false);
  state.objectId = null;
};

exports.resetEditorState = resetEditorState;

var isInvalid = function isInvalid(s) {
  return !(0, _Utils.exists)(s.title) || !(0, _Utils.exists)(s.text);
};

exports.isInvalid = isInvalid;

var saveImgToGalleryTask = function saveImgToGalleryTask(mdl) {
  return function (_ref) {
    var _ref$data = _ref.data,
        image = _ref$data.image,
        thumb = _ref$data.thumb;
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

exports.saveImgToGalleryTask = saveImgToGalleryTask;

var toBlogs = function toBlogs() {
  return m.route.set("/social/blog");
};

exports.toBlogs = toBlogs;

var deleteBlog = function deleteBlog(mdl) {
  return function (id) {
    return mdl.http.back4App.deleteTask(mdl)("Classes/Blogs/".concat(id)).fork(toBlogs, toBlogs);
  };
};

exports.deleteBlog = deleteBlog;

var onInput = function onInput(state) {
  return (0, _Utils.handlers)(["oninput"], function (e) {
    if (e.target.id == "file") {
      state[e.target.id] = e.target.files[0];
    } else {
      state[e.target.id] = e.target.value;
    }
  });
};

exports.onInput = onInput;
});

;require.register("Pages/Dashboard/index.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ramda = require("ramda");

var _table = require("Components/table.js");

var _cjs = require("@mithril-icons/clarity/cjs");

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
    }), m(_cjs.RemoveLine, {
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
    }), m(_cjs.RemoveLine, {
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
      style: {
        maxWidth: "150px"
      },
      src: img
    }),
    text: text.slice(0, 300),
    author: author,
    action: [m(_cjs.EditLine, {
      onclick: function onclick() {
        return console.log("edit", objectId);
      }
    }), m(_cjs.RemoveLine, {
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
      style: {
        maxWidth: "150px"
      },
      src: image
    }),
    action: [m(_cjs.EditLine, {
      onclick: function onclick() {
        return console.log("edit", objectId);
      }
    }), m(_cjs.RemoveLine, {
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
  return mdl.http.back4App.getTask(mdl)("Users").map((0, _ramda.prop)("results")).map((0, _ramda.filter)((0, _ramda.prop)("name"))).fork(log("error"), function (u) {
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

var Users = function Users() {
  var state = {
    users: [],
    errors: null
  };

  var getUsers = function getUsers(_ref) {
    var mdl = _ref.attrs.mdl;
    return mdl.http.back4App.getTask(mdl)("Users").map((0, _ramda.prop)("results")).map((0, _ramda.filter)((0, _ramda.prop)("name"))).fork(log("error"), function (u) {
      return state.users = u;
    });
  };

  var updateUserRole = function updateUserRole(mdl) {
    return function (user) {
      log("user")(user);
      mdl.http.back4App.putTask(mdl)("Users/".concat(user.objectId))({
        role: user.role
      }).fork(log("error"), log("succes"));
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

var data = {
  status: null,
  locations: []
};
var Editor = {
  onremove: function onremove(_ref) {
    var _ref$attrs = _ref.attrs,
        resetState = _ref$attrs.resetState,
        state = _ref$attrs.state;
    return resetState(state);
  },
  view: function view(_ref2) {
    var _ref2$attrs = _ref2.attrs,
        mdl = _ref2$attrs.mdl,
        showEditor = _ref2$attrs.showEditor,
        deleteEvent = _ref2$attrs.deleteEvent,
        submitEvent = _ref2$attrs.submitEvent,
        resetState = _ref2$attrs.resetState,
        state = _ref2$attrs.state,
        uploadImage = _ref2$attrs.uploadImage;
    return m("aside.modal-container", m("article.modal", m("header.modal-header", m("h1.title.text-primary.is-center", state.event.objectId ? "Edit Event" : "Add Event")), m("section.modal-content.container", m("form.grid", _objectSpread({}, onInput(state.event)), m("h2.text-primary", "Date", m("span.text-error", "*")), m("formgroup.grouped", m("label", "Start Date", m("input", {
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
    }))), m("formgroup", m("label", m("h2.text-primary", "Title", m("span.text-error", "*")), state.errors.title && m("h2.text-error", state.errors.title), m("input", {
      type: "text",
      id: "title",
      value: state.event.title
    }))), m("h2.text-primary", "Image", m("span.text-error", "*")), state.status() == "uploading-image" ? m("h2.tag.is-center", "Attaching Image - please be patient") : m("formgroup.grouped", m("label", "Upload an Image", m("input", {
      type: "file",
      id: "file",
      value: state.files,
      onchange: function onchange() {
        return uploadImage(state.event.file);
      }
    }), state.event.image && m("img", {
      src: state.event.image
    }))), m("label.icon", m("h2.text-primary", "Location", m("span.text-error", "*")), state.errors.location && m("h2.text-error", state.errors.location), m("input", {
      oninput: function oninput(e) {
        if (e.target.value.length > 3) {
          data.status = "isloading";
          mdl.http.openCage.getLocationTask(mdl)(e.target.value.trim()).fork(function (e) {
            data.status = "error";
            log("error fetching locations")(e);
          }, function (_ref3) {
            var results = _ref3.results;
            data.status = "loaded";
            data.locations = results;
          });
        }
      },
      id: "location",
      value: state.event.location
    })), data.locations.any() && m("details.dropdown", m("summary.button.outline", "options"), m(".card", m("ul", data.locations.map(function (_ref4) {
      var formatted = _ref4.formatted;
      return m("li.pointer", {
        onclick: function onclick(e) {
          state.event.location = formatted;
        }
      }, formatted);
    })))), m("formgroup", m("label", m("h2.text-primary", "Details", m("span.text-error", "*")), state.errors.description && m("h2.text-error", state.errors.description), m("textarea", {
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

var _cjs = require("@mithril-icons/clarity/cjs");

var _DateTime = _interopRequireDefault(require("Components/DateTime"));

var _ramda = require("ramda");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var updateEventTask = function updateEventTask(mdl) {
  return function (id) {
    return function (event) {
      return mdl.http.back4App.putTask(mdl)("Classes/Events/".concat(id))(event);
    };
  };
};

var onError = function onError(e) {
  return console.log("e", e);
};

var onSuccess = function onSuccess(event, field, value) {
  return function () {
    return event[field] = value;
  };
};

var updateEvent = function updateEvent(xs) {
  return function (x) {
    return xs.includes(x) ? (0, _ramda.without)([x], xs) : xs.concat([x]);
  };
};

var updateAttendees = function updateAttendees(mdl, event) {
  var attendees = updateEvent(event.attendees)(mdl.user.objectId);
  updateEventTask(mdl)(event.id)({
    attendees: attendees
  }).fork(onError, onSuccess(event, "attendees", attendees));
};

var updateLikes = function updateLikes(mdl, event) {
  var likes = updateEvent(event.likes)(mdl.user.objectId);
  updateEventTask(mdl)(event.id)({
    likes: likes
  }).fork(onError, onSuccess(event, "likes", likes));
};

var EventPreview = {
  view: function view(_ref) {
    var _ref$attrs = _ref.attrs,
        mdl = _ref$attrs.mdl,
        event = _ref$attrs.event,
        previewEvent = _ref$attrs.previewEvent,
        editEvent = _ref$attrs.editEvent,
        resetState = _ref$attrs.resetState,
        state = _ref$attrs.state;
    return m(".modal-container", m(".modal", m("header.modal-header", m("h2.text-primary strong is-center", event.title.toUpperCase())), m("section.modal-content ", m(".row", m(".col", m(".grouped", m(_cjs.CalendarLine, {
      fill: "#14854f"
    }), m(_DateTime["default"], {
      event: event
    })), event.location && m(".grouped", m(_cjs.HomeSolid, {
      fill: "#14854f",
      height: 60,
      width: 60
    }), m("label", event.location)), event.allDay && m(".grouped", m("label.tag.primary", "All Day Event"))), m(".col", m(".grouped clear icon", m(_cjs.UserLine, {
      fill: "#14854f"
    }), m("label", "Attendees: ", event.attendees.length)), mdl.state.isAuth() && m(".tag grouped", m(".button.clear icon", {
      onclick: function onclick() {
        return updateAttendees(mdl, event);
      }
    }, (0, _ramda.includes)(mdl.user.objectId, event.attendees) ? m("", m(_cjs.HappyFaceLine, {
      fill: "green"
    }), m("", "I'm Attending!")) : m("", m(_cjs.SadFaceLine), m("", "Not Attending"))), m(".button.clear icon-only", {
      onclick: function onclick() {
        return updateLikes(mdl, event);
      }
    }, m(_cjs.HeartLine, {
      fill: (0, _ramda.includes)(mdl.user.objectId, event.likes) && "red"
    }))))), m(".grouped", m("img", {
      src: event.image
    })), m("hr.bd-primary"), m(".grouped.container", m("p.p-t-25", event.description))), m("footer.modal-footer", m(".tabs grouped", (event.createdBy == mdl.user.name || ["admin", "mod"].includes(mdl.user.role)) && m("button.button.secondary.is-full-width", {
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
    }, "Close")))));
  }
};
var _default = EventPreview;
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

var _validations = require("./validations.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var state = {
  errors: {},
  status: Stream("loading"),
  calendar: null,
  showEditor: Stream(false),
  selectedDate: Stream(null),
  events: [],
  previewEvent: Stream(false),
  files: [],
  event: {
    attendees: [],
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
    allDay: false,
    location: ""
  }
};

var resetState = function resetState(s) {
  state.event = {
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
    location: "",
    allDay: false
  };
  state.files = [];
  state.errors = {};
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

var onImgError = function onImgError(e) {
  state.errors.img = e;
  state.status("error");
};

var onImgSuccess = function onImgSuccess(img) {
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
    mdl.http.imgBB.postTask(mdl)(image).chain(saveImgToGalleryTask(mdl)).fork(onImgError, onImgSuccess);
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
      image = _ref3.image,
      location = _ref3.location;
  var start = formatDate(startDate, startTime);
  var end = formatDate(endDate, endTime);
  var event = {
    start: start,
    end: end,
    title: title,
    allDay: JSON.parse(allDay),
    description: description,
    createdBy: mdl.user.name,
    image: image,
    location: location
  };

  var onError = function onError(errors) {
    state.errors = errors;
    console.error(errors);
  };

  var onSuccess = function onSuccess(evt) {
    fetchEvents({
      attrs: {
        mdl: mdl
      }
    });
    state.showEditor(false);
  };

  var submitOrUpdateTask = function submitOrUpdateTask(id) {
    return function (data) {
      return id ? mdl.http.back4App.putTask(mdl)("Classes/Events/".concat(id))(data) : mdl.http.back4App.postTask(mdl)("Classes/Events")(_objectSpread(_objectSpread({}, data), {}, {
        attendees: [],
        likes: []
      }));
    };
  };

  return (0, _validations.validateEventTask)(event).chain(submitOrUpdateTask(id)).fork(onError, onSuccess);
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
    }), state.status() == "loaded" && m("section.container", m(_calendar["default"], {
      mdl: mdl,
      state: state
    })), state.status() == "loading" && m("section", m(_loader["default"])), state.status() == "error" && m("section", "is error"));
  }
};
var _default = Events;
exports["default"] = _default;
});

;require.register("Pages/Events/validations.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateEventTask = void 0;

var _ramda = require("ramda");

var _data = require("data.validation");

var _Utils = require("Utils");

var ValidateEvent = (0, _data.Success)((0, _ramda.curryN)(3, _ramda.identity));
var titleLens = (0, _ramda.lensProp)("title");
var detailsLens = (0, _ramda.lensProp)("description");
var locationLens = (0, _ramda.lensProp)("location");

var validateTitle = function validateTitle(data) {
  return (0, _data.Success)(data).apLeft((0, _Utils.validate)(_Utils.isRequired, titleLens, "Your event needs a title.", data));
};

var validateDescription = function validateDescription(data) {
  return (0, _data.Success)(data).apLeft((0, _Utils.validate)(_Utils.isRequired, detailsLens, "Your event needs some information.", data));
};

var validateLocation = function validateLocation(data) {
  return (0, _data.Success)(data).apLeft((0, _Utils.validate)(_Utils.isRequired, locationLens, "Your event needs a location.", data));
};

var validateEventTask = function validateEventTask(data) {
  console.log(data);
  return ValidateEvent.ap(validateTitle(data)).ap(validateDescription(data)).ap(validateLocation(data)).failureMap(_ramda.mergeAll).toTask();
};

exports.validateEventTask = validateEventTask;
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

var _cjs = require("@mithril-icons/clarity/cjs");

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
    return log("deleteImg - error")(e);
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
    log("fetchAlbum - error")(e);
  };

  var onSuccess = function onSuccess(_ref3) {
    var results = _ref3.results;
    results.any() ? (state.album = results, state.title = album) : m.route.set("/social/gallery");
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
    return mdl.state.isLoading() && !state.isUpLoading() ? m(_loader["default"]) : m("article.grid.p-y-6.fade.", m("nav.grouped.m-y-6", m(m.route.Link, {
      selector: "button.button.primary.outline.icon",
      href: "/social/gallery",
      "class": "primary"
    }, m(_cjs.ArrowLine, {
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
      return m("figure.is-center.col-4.pos-rel", mdl.state.isAuth() && m(_cjs.TimesCircleLine, {
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
    return log("fetchAllAlbums- error")(e);
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
    return log("createtNewAlbum- error")(e);
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
    return mdl.state.isLoading() ? m(_loader["default"]) : m("article.grid.p-y-6.fade", mdl.state.isAuth() && m("nav.nav", m(".nav-center", m("button.button.primary", {
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
      }, m("section.is-marginless.bd-primary.p-x-50.p-y-6", m("hgroup.grid", m("h2.strong", "About Us"), m(".row", m("p.col", "The Bonham Acres Civic Association (BACA) is a registered 501(c)4 organization that was established to work for the common good of the community, providing a single voice for our neighborhood to area municipalities. The BACA operates with an all-volunteer staff, voluntary membership dues, and the donated time and energy of its neighbors."), m("figure.col", m("img.height-auto", {
        src: "images/IMG_3216.webp"
      }))))), m("section.is-marginless.bd-primary.p-x-50.p-y-6.bg-primary.text-white", m("hgroup.grid", m("h2.strong", "Bonham Acres Sub Division"), m(".row", m("figure.col", m("img.height-auto", {
        src: "images/baca-map.webp"
      })), m("p.col", "A small jewell of a neighborhood located in Southwest Houston. Subdivision bounded by Bissonnet to the north, Braes Bayou to the south, Fondren to the east and Bonhomme Re to the west. There are 5 streets within, Bonhomme Rd, Cadawac Rd, Lugary Ln, Wanda Ln and Tree Frog. Bonham Acres Houston neighborhood is located in 77074 zip code in Harris county. Bonham Acres has 152 single family properties with a median build year of 1958 and a median size of 1,807 Sqft.")))), m("section.is-marginless.p-x-50.p-y-6", m("h2.strong", "Community Support"), m(".grid", m(".row", m(".col-3", m("hgroup", m("p.strong", "Historical Accounts"), m("p", "Dr. Bonham’s home became Bonham Family Nature Park."))), m(".col-3", m("hgroup", m("p.strong", "Improvements"), m("p", "Streets lights paid for by residents of Bonham Acres."))), m(".col-3", m("hgroup", m("p.strong", "Working Together"), m("p", "Residents worked together to get speed bumps installed."))), m(".col-3", m("hgroup", m("p.strong", "Legacy of Impact"), m("p", "Residents funded the 5 entry monuments into Bonham Acres.")))))));
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

// import Modal from "Components/Modal"
var state = {
  showOrdinanceViolation: Stream(false),
  showModal: Stream(false),
  title: null,
  contents: null
};
var contents = {
  car: {
    icons: {
      "default": _clarity.CarLine
    },
    title: "Car Parking in Residential Area",
    contents: [m(".card", m("em", "Parking of Vehicles on Residential Property Chapter 28, Article X"), m("p", "To read the complete ordinance, go to ", m("a.nav-link", {
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
    }, "https://www.houstontx.gov/planning/Prohibited-Yard-Parking-Ordinance.html")))]
  },
  trash: {
    icons: {
      "default": _clarity.TrashLine
    },
    title: "Trash & Dumpster Ordinances",
    contents: [m("p", m("a.nav-link", {
      target: "__blank",
      href: "https://www.rollouthouston.com/"
    }, ["Roll Out Houston!", m(_clarity.PopOutLine)])), m("p", m("a.nav-link", {
      target: "__blank",
      href: "https://www.houstontx.gov/solidwaste/trashfacts.pdf"
    }, ["Houston Trash Facts PDF", m(_clarity.PopOutLine)]))]
  },
  noise: {
    icons: {
      "default": _clarity.MusicNoteLine
    },
    title: "Noise Ordinances",
    contents: [m("p", "According to the ", ("a.nav-link", {
      target: "__blank",
      href: "#"
    }, " Houston Sound Ordinance, "), " sound ", m("span.strong", " cannot exceed 65 decibels during the day "), "and", m("span.strong", " 58 decibels at night in residential areas."), " Permits must be obtained for sound up to 75 decibels until 10pm on Sundays through Thursdays and until 11pm on Fridays and Saturdays. ", " The Houston ordinance penalizes up to ", m("span.strong", " $1, 000 per offense or per hour.")), m("p", m("a.nav-link", {
      target: "__blank",
      href: "https://library.municode.com/tx/houston/codes/code_of_ordinances?nodeId=COOR_CH30NOSOLERE"
    }, "https://library.municode.com/tx/houston/codes/code_of_ordinances?nodeId=COOR_CH30NOSOLERE"))]
  },
  nuisance: {
    icons: {
      "default": _clarity.HomeLine
    },
    title: "Nuisance Ordinances",
    contents: [m("p", m("a.nav-link", {
      target: "__blank",
      href: "https://statutes.capitol.texas.gov/Docs/HS/htm/HS.342.htm#342.004"
    }, "Section 342.004 of the Texas Health and Safety Code")), m("p", "State law giving authority to municipalities to require landowners to keep their property free of weeds, brush and conditions constituting a public nuisance."), m("p", m("a.nav-link", {
      target: "__blank",
      href: "https://statutes.capitol.texas.gov/Docs/TN/htm/TN.311.htm#311.003"
    }, "Sections 311.003 - 311.004 of the Texas Transportation Code")), m("p", "State laws giving authority to type-A municipalities to require a person to keep the front of their premise free of weeds and trash. It also gives them the authority to require a landowner to improve their sidewalk and allows home-rule municipalities to declare a defective sidewalk a public nuisance."), m("p", m("a.nav-link", {
      target: "__blank",
      href: "https://statutes.capitol.texas.gov/Docs/TN/htm/TN.683.htm#E"
    }, "Texas Transportation Code, Chapter 683, Subchapter E")), m("p", "State law governing junked vehicles; declaring them a public nuisance.")]
  }
};

var Modal = function Modal() {
  return {
    view: function view(_ref) {
      var _ref$attrs = _ref.attrs,
          mdl = _ref$attrs.mdl,
          title = _ref$attrs.title,
          contents = _ref$attrs.contents;
      return m("article.modal-container", {
        onclick: function onclick() {
          state.contents = null;
          state.showModal(false);
        }
      }, m("article.modal.container.card", m("header.model-header", m("h2", title)), m("section.modal-content", contents)));
    }
  };
};

var CardOrd = function CardOrd() {
  var isSelected = false;
  return {
    view: function view(_ref2) {
      var _ref2$attrs = _ref2.attrs,
          id = _ref2$attrs.id,
          title = _ref2$attrs.title,
          icons = _ref2$attrs.icons,
          contents = _ref2$attrs.contents;
      return m("article.card.col-6.bd-primary.p-x-50.p-y-6.pointer", {
        id: id,
        "class": isSelected && "text-success",
        onmouseover: function onmouseover() {
          return isSelected = true;
        },
        onmouseout: function onmouseout() {
          return isSelected = false;
        },
        onclick: function onclick() {
          state.title = title;
          state.contents = contents;
          state.showModal(true);
        }
      }, m("hgroup.row", m(icons["default"], {
        "class": "col.is-center",
        fill: isSelected && "#14854f",
        style: {
          margin: "0 auto",
          width: "30%",
          height: "250px"
        }
      }), m("h2.col.is-center", title)));
    }
  };
};

var CityOrd = {
  view: function view(_ref3) {
    var mdl = _ref3.attrs.mdl;
    return m("section.container", {
      "class": mdl.settings.screenSize == "desktop" && "p-50"
    }, m("section.is-marginless", m("p", "Bonham Acres is a deed restricted community in which deed restrictions are actively enforced. ", m(m.route.Link, {
      selector: "a.underline",
      "class": "strong",
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
    })), m("p", m("em", "All reports will be treated as anonymous and your name kept private.")), m("p.strong", "Your assistance in reporting violations will go a very long way to protect and enhance our property values."))), m("section.row", Object.keys(contents).map(function (ord) {
      return m(CardOrd, {
        mdl: mdl,
        id: ord,
        title: contents[ord].title,
        icons: contents[ord].icons,
        contents: contents[ord].contents
      });
    })), state.showModal() && m(Modal, {
      mdl: mdl,
      title: state.title,
      contents: state.contents,
      close: function close() {
        state.contents = null;
        state.title = null;
        state.showModal(false);
      }
    }));
  }
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
      return m("article", m("section.container", m("h2.is-center.is-marginless.m-b-15.strong", "Bonham Acres Civic Association Board Members April 13, 2021"), m(".row.container", BoardMembers.map(function (_ref2) {
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

;require.register("Pages/deed-restrictions.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var DeedRes = function DeedRes() {
  var Lugary = [m("h3", {
    style: {
      "text-align": "center",
      "white-space": "pre-wrap"
    }
  }, m("strong", "# 1341013")), m("h3", {
    style: {
      "text-align": "center",
      "white-space": "pre-wrap"
    }
  }, "Bonham Acres Subdivision Section 3 - Lugary"), m("p", {
    style: {
      "text-align": "center",
      "white-space": "pre-wrap"
    }
  }, ["Volume 2853 Page 466 of the Records of Maps and Plats of Harris County, Texas", m.trust("&nbsp;")]), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "THE STATE OF TEXAS"), m("p", {
    style: {
      "text-align": "right",
      "margin-left": "40px",
      "white-space": "pre-wrap"
    }
  }, "KNOW ALL MEN BY THESE PRESENTS:"), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "COUNTY OF HARRIS"), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, ["That M. G. Rosenthal, being the owner of Bonham Acres ", m("strong", "Section 3,"), " a subdivision of 20.92 acres of land out of the ", m("em", "J. "), "R. Black Survey, Abstract 134, Harris County, Texas, according", m.trust("&nbsp;")]), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "to map of said subdivision, filed for record October 4, 1952, in the office of the County Clerk of Harris County, Texas, File No. 1323250 to which reference is here made for all purposes, does hereby declare that the lots and tracks in said subdivision shall from and after the date of this instrument be held and conveyed subject to the covenants, conditions, easements, restrictions and reservations hereinafter set out."), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, ["M.G. Rosenthal does hereby dedicate the streets, drives, and lanes for use by the public as such reserving the right unto himself, his heirs, successors, and assigns to, at any time, use the same for the installation, maintenance, repairs, and renewal of any and all public utilities.", m("br")]), m("p", {
    style: {
      "text-align": "center",
      "white-space": "pre-wrap"
    }
  }, m("span", {
    style: {
      "text-decoration": "underline"
    }
  }, m("strong", "DEFINITIONS"))), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "The word “street” as used herein shall include any street, drive. Boulevard, road, lane, avenue, or place as shown on the recorded plat as a thoroughfare."), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, ["A “corner lot” is one that abuts on more than one street.", m.trust("&nbsp;"), " Any lot, except a corner, is deemed to front on the street upon which it abuts.", m.trust("&nbsp;"), " A corner lot shall be deemed to front on the street on which it has smallest frontage."]), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }), m("p", {
    style: {
      "text-align": "center",
      "white-space": "pre-wrap"
    }
  }, m("span", {
    style: {
      "text-decoration": "underline"
    }
  }, m("strong", "RESTRICTIONS"))), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, ["For the purpose of creating and carrying out uniform plan for improvement and sale of property in said addition as a restricted addition, the following restrictions upon the use of said property are hereby established and adopted, subject to the provisions hereof, and shall be made part of each and every contract and deed executed by or on behalf of M. G. Rosenthal, his heirs, successors, and assigns, by appropriate reference to this dedication and same shall be considered a part of each contract and deed as though incorporated fully therein.", m.trust("&nbsp;"), " And these restrictions as hereinafter set forth shall be and are, hereby imposed upon each lot or parcel of land in said additions shown by said plat and referred to herein, and same shall constitute", m.trust("&nbsp;"), " covenants remaining with land and shall be binding upon, and shall insure to the benefit of M. G. Rosenthal, his heirs, successors, and assignee, and all subsequent purchases for said property, and each purchaser, by virtue of accepting a contract or deed of said property, shall be subject to and bound by such restrictions, covenants and conditions and for terms of this instrument as hereinafter set forth."]), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }), m("p", {
    style: {
      "text-align": "center",
      "white-space": "pre-wrap"
    }
  }, m("span", {
    style: {
      "text-decoration": "underline"
    }
  }, m("strong", "USE OF LAND"))), m("ol", {
    "data-rte-list": "default"
  }, [m("li", m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "No lots shall be used for anything other than residential purposes except Commercial Reserve Lots in Blocks 1 and 5, as shown by the Plat of Bonham Acres Section 3, which plots and areas have been set aside for community center and business purpose, such as retail stores, offices, shops, and utility facilities as may be hereinafter determined by M.G. Rosenthal, his heirs, successors, and assigns.")), m("li", m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "No sign of any kind shall be displayed to the public view on any residential lot except one sign of not more than five square feet advertising the property for sale or rent, or signs used by builders to advertise the property during the construction and sales period.")), m("li", m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "No animals, livestock, or poultry of any kind shall be raised, bred, or kept on any lot, except that dogs, cats, or other household pets may be kept, provided that they are not kept, bred, or maintained for any commercial purposes.")), m("li", m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "No noxious or offensive trade or activity shall be carried on o or upon any lot, nor shall anything be done thereon which may be, or become any annoyance or nuisance to the neighborhood.")), m("li", m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "No spiritous, vinous, or malt or medicated bitters capable of producing intoxication shall ever be sold, or offered for sale on said premises, or any part thereof, except on commercial reserve lots in blocks 1 and 5, nor shall said premises, or any part thereof except on commercial reserve lots in blocks 1 and 5 be used for private or public professional purposes, nor shall any part thereof be used for illegal or immoral purposes."))]), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }), m("p", {
    style: {
      "text-align": "center",
      "white-space": "pre-wrap"
    }
  }, m("span", {
    style: {
      "text-decoration": "underline"
    }
  }, m("strong", "ARCHITECTURAL RESTRICTIONS"))), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, ["No improvements of any character shall be erected, or the erection thereof", m.trust("&nbsp;"), " begun, of changes made in the exterior design thereof after original construction on any lot or home site in Bonham Acres Section 3, until plans and specifications have been submitted to and approved by the Architectural Committee hereinafter constituted. Such approval is to include exterior design, the type of material to be used, and the colors to be applied on the exterior of the structure, and such approval is to be based on the following general requirements, stipulations, and restrictions:"]), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }), m("ol", {
    "data-rte-list": "default"
  }, [m("li", [m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "No dwelling shall be erected or placed on any lot having a width of less than 70 feet at the minimum building setback line, nor shall any dwelling be erected or placed on any lot having an area of less than 7000 square feet. Lots 37 through 41 inclusive, in Block 3, may have widths at minimum set back lines as shown on Plat."), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  })]), m("li", [m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "All lots in the tract, except Commercial Reserve Lots block 1 and 5, shall be used for residential purposes."), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  })]), m("li", [m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "No structure shall be erected on any residential plot other than one single family dwelling not to exceed two stories in height and one or two car garage."), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  })]), m("li", [m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "No structure shall be moved onto any lot."), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  })]), m("li", [m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "No trailer, basement, tent, shack, garage or barn or other out building erected in the tract shall at any time be used as a residence either temporarily or permanently, except as provided (f) below, nor shall any residence of a temporary character be permitted. No temporary building shall be erected or maintained on any lot except during actual construction of a home being erected thereon. That such temporary building must be on the lot on which construction is in progress and not on adjoining lots, streets, or easements. At completion the temporary building must be removed immediately. No such temporary building or structure shall be used for residential purposes during construction."), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  })]), m("li", [m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "No garage apartment for rental purposes shall be permitted. However, this does not prevent occupancy of servants quarters by domestic servants domiciled with an owner occupant."), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  })]), m("li", [m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "All improvements shall be constructed on the lot so as to front on the street upon which such lot faces."), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  })]), m("li", [m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "Dwelling on corner lots shall have a presentable frontage on all streets which that particular lot fronts."), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  })]), m("li", [m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "No residence shall be constructed on any lot or building site in the addition costing less than Nine Thousand Dollars ($9,000.00). These restrictions as to the value of improvements are to be given consideration based upon labor and material costs as of September 1, 1954. And all future values of improvements is to be given consideration based upon comparable costs of labor and material at the time of construction, using the basic value hereinabove given."), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  })]), m("li", [m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "No residence shall be constructed on any lot or building or building lot in this addition with less than one thousand (1,000) square feet of ground floor area exclusive of porches and garage."), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  })]), m("li", [m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "The building lines of any residence to be erected in Bonham Acres Section 3 shall be as follows: Not less than twenty five (25) feet from the front property line, except Lots 37 through 41 in block 3, which may be erected 20 feet thereafter, and not less than five (5) feet from the side property line, except that on all corner lots no structure shall be erected nearer than ten (10) feet from side property line abutting a tract no swelling shall be located on any lot nearer than twenty five (25) feet to the rear lot line."), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  })]), m("li", [m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "No fence , wall, hedge, pergola, or other detached structures for ornamental purposes shall be erected, grown, or maintained on any part of any lot forward of the front building of said lot without a written consent of the Architectural Committee."), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  })]), m("li", [m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "No radio aerial wires shall be maintained on any portion of ant lot forward of the front building line of said lot."), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  })]), m("li", [m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "No detached garage, servants’ house or other out building of any kind shall be erected on any lot nearer than seventy (70) feet to the front property line, nearer than five (5) feet to either side property line, or nearer than the easement on the rear or side property line of said lot. This does not apply to garage and servants’ quarters when attached to the main residents but any servant quarters attached to the main residence must be in the rear of same. No outside toilets will be permitted. No outbuilding shall exceed in height the dwelling to which they are appurtenant, without the written consent of the Architectural Committee. Every outbuilding, except a greenhouse, shall correspond in style and architecture to the dwelling which it is appurtenant. The right is reserved by the Architectural Committee to change these restrictions in the case of unusual and irregular shaped lots 37 through 41 in Block 3, where same is required for the best appearance of the immediate community."), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  })]), m("li", [m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "No building of frame construction on the exterior of any kind or character shall be erected on any lot unless same, at the time of construction, shall receive at least two coats of paint."), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  })]), m("li", [m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "No building material of any kind shall be placed or stored upon the property until the owner is ready to commence improvements and then such material shall be placed within the property lines of the lot, or parcel of land, upon which the improvements are to be erected and shall not be placed in the street or between the pavement and property line."), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  })]), m("li", [m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "No stumps, tree, underbrush, or any refuse of any kind, or scrap material from the improvements being erected on any lot, shall be placed on any adjoining lots, streets, or easements. All such material, if not disposed of immediately, must remain on the property on which construction work is in progress and at the completion of such improvements such material must be immediately removed from the property."), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  })]), m("li", [m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "No oil drilling, oil development operations, oil refining, quarrying or mining of any kind shall be permitted upon or in any lots, nor shall oil wells, tanks, terminals, mineral excavations or shafts be permitted upon or in any lot. No derrick or other structures designed for use in boring for oil or natural gas shall be erected, maintained or permitted upon any lot."), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  })])]), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, ["The Architectural Committee shall be composed of Harold Hill, Ray Wilson, and Dr. Russell Bonham, all of Harris County, Texas.", m.trust("&nbsp;"), " This Committee and its successors are hereby vested with the full right and authority to act as such under the provisions of these restrictions. The majority of such committee shall have the right to designate a representative to act for it in all matters arising hereunder.", m.trust("&nbsp;"), " In the event of the death or resignation of any member of the Committee, the remaining members shall have full right and authority to act herein and to designate a representative to assist."]), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "In the event said committee or its designated representative fails to approve or disapprove any design or location within 30 days after plans and specifications have been submitted to it, or in any event, if no suit to enjoin the erection of such building or the making of such alterations has been commenced prior to completion thereof, such approval will not be required and the covenants contained in these restrictions shall be deemed to have been fully complied with."), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "Neither the members of such Committee, nor any designated representatives, shall be entitled to any compensation for services preformed pursuant to these restrictions."), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, ["At any time a vacancy exists on said committee M.G. Rosenthal shall have the right to fill vacancies and should he fail to do so within 30 days after receiving notice of such vacancy the remaining members of the committee shall have the right to fill any vacancy.", m.trust("&nbsp;"), " All appointments and designations of persons as successors to the Committee shall be made in writing by a recordable instrument, which shall be filed for record in Harris County Texas.", m.trust("&nbsp;"), " The powers and duties of the Committee, as from time to time constituted, shall continue in force during the effective period of the restrictions hereby created."]), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, ["Thereafter, the owners of fifty one percent (51%) of the lots in Bonham Acres Section 3 (one lot or home site constituting one ownership) becoming dissatisfied with any members as then constituted, shall have the right to remove any member or members of said committee, and may designate and appoint a new member or members by written petition bearing, the signatures of the property owners so acting.", m.trust("&nbsp;"), " The petition shall show the property owned by each petitioner.", m.trust("&nbsp;"), " In case property is owned by man and wife as community property, the signature of the husband alone shall be sufficient, except that in cases where the husband resides elsewhere, or has abandoned his wife, her signature shall be sufficient alone.", m("br")]), m("p", {
    style: {
      "text-align": "center",
      "white-space": "pre-wrap"
    }
  }, m("span", {
    style: {
      "text-decoration": "underline"
    }
  }, m("strong", "DURATION OF RESTRICTIONS"))), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, m("br")), m("p", {
    style: {
      "text-align": "center",
      "white-space": "pre-wrap"
    }
  }, m("span", {
    style: {
      "text-decoration": "underline"
    }
  }, m("strong", "RIGHT TO ENFORCE"))), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }), m("p", {
    style: {
      "text-align": "center",
      "white-space": "pre-wrap"
    }
  }, m("span", {
    style: {
      "text-decoration": "underline"
    }
  }, m("strong", "EASEMENTS"))), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, m("br")), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, m("br")), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }), m("p", {
    style: {
      "text-align": "center",
      "white-space": "pre-wrap"
    }
  }, "EXECUTED at Houston, Texas, as of the 1st of September, A, D. 1954."), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "ATTEST:"), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "___________________"), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, ["*W Goldston - Cashier", m("br"), m("em", "*The signatures and the Seal of University State Bank appear on original and filed copy"), m("br")]), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "THE STATE OF TEXAS"), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "COUNTY OF HARRIS"), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, ["BEFORE ME, the undersigned authority, a Notary Public in and for said County and State, on this day personally appeared, M. G. Rosenthal known to me to be the person whose name is subscribed to the fore going instrument, and acknowledge to me that he executed the same for the purpose and consideration therein expressed.", m.trust("&nbsp;")]), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "GIVEN under my hand and seal of office, this 26th day of October, A.D., 1954."), m("p", {
    style: {
      "text-align": "right",
      "white-space": "pre-wrap"
    }
  }, "___________________________________"), m("p", {
    style: {
      "text-align": "right",
      "white-space": "pre-wrap"
    }
  }, "*Elaine L. Oates"), m("p", {
    style: {
      "text-align": "right",
      "white-space": "pre-wrap"
    }
  }, "Notary Public in and for Harris County Texas"), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, m("em", "*Elaine L. Oates’ signature and Seal appear on original and filed copy"))];
  var Cadawac = [m("h3", {
    style: {
      "text-align": "center",
      "white-space": "pre-wrap"
    }
  }, m("strong", "# 1052372")), m("h3", {
    style: {
      "text-align": "center",
      "white-space": "pre-wrap"
    }
  }, [m.trust("&nbsp;"), "Bonham Acres Subdivision Section 2 - Cadawac Rd"]), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "THE STATE OF TEXAS"), m("p", {
    style: {
      "text-align": "right",
      "margin-left": "40px",
      "white-space": "pre-wrap"
    }
  }, "KNOW ALL MEN BY THESE PRESENTS:"), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "COUNTY OF HARRIS"), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, ["That we, Dr. Russell F. Bonham and wife Dora Bonham; the owners of Bonham Acres ", m("strong", "Second Section,"), " a Sub-division out of the ", m("em", "J. "), "R. Black Survey, Abstract 134, Harris County, Texas, a plat of which was filed with the County Clerk of Harris County, Texas, on September 5, 1952, under File No. 1037211, and which instrument is of record. ", m("em", "in "), "Volume ____", m("span", {
    style: {
      "text-decoration": "underline"
    }
  }, m("strong", m("em", ","))), m("strong", m("em")), "Page ____of the Records of Maps and Plats of Harris County, Texas, do hereby establish the following minimum restrictions and covenants upon the use ", m("strong", ["of Lots A ", m.trust("&amp;"), " B ", m.trust("&amp;"), " lots 1 to 32,"]), " inclusive, in said Addition, and hereby declare that all conveyances of said lots or tracts in said Addition shall be subject to the following minimum restrictions, covenants, easements and conditions, which shall be, continue and remain in effect until January 1, 1972, at which time, said covenants and restrictions shall be automatically extended for successive periods of ten years unless by a vote of the majority of the then owners of the lots in said Addition, it is agreed to change the said covenants or restrictions it whole or in part. Such vote shall be evidenced by written declaration, signed and acknowledged by such owners wad recorded in the Deed Records of ", m("em", "Harris "), "County, Texas.", m("br")]), m("ol", {
    "data-rte-list": "default"
  }, [m("li", [m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "No business or professional house, sanitarium, hospital, saloon, place of public amusement or entertainment, livery stable, factory, warehouse, duplex, apartment house, rooming house, boarding house, or place of business of any kind, shall be constructed, built, kept or maintained on the said lots, nor shall any house on said premises be used for any such purpose or purposes, but said premises shall be used for one family residence only. No trailer, tent, or other outbuilding placed or erected on said lots shall at any tine be used as a residence, either temporarily or permanently, nor shall any structure of a temporary character be used as a residence."), m("p", {
    "data-rte-preserve-empty": "true",
    style: {
      "white-space": "pre-wrap"
    }
  })]), m("li", [m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "No building shall be erected, placed or altered on any of said lots until the building plans, specifications and plot plan showing the location of such building shall have been submitted to end approved in writing by Dr. Russell F, Bonham or wife, Dora Bonham, or their authorized representatives., for conformity and harmony of external design with existing structures in the subdivision; and as to location of the building with respect to property and building setback lines. If the aforesaid individuals or their authorized representatives fail to approve or disapprove such design or location within fifteen days after plans have been submitted to it, or if no suit to enjoin the erection of such building, or the making of such alterations has been commenced prior to the completion thereof, such approval will not be required. Said individuals or their authorized representative shall without compensation. Said individuals shall act and serve until all tracts are sold, and until their successors have been chosen thereafter by the then recorded owners of a majority of said lots who may designate in writing duly recorded in the Deed Records of said County their authorized representative who thereafter have all of the powers, subject to the same limitations as were previously designated to the aforesaid individuals. None of the following restrictions shall be modified without the written approval of a majority of said lot owners."), m("p", {
    "data-rte-preserve-empty": "true",
    style: {
      "white-space": "pre-wrap"
    }
  })]), m("li", [m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "No residence shall be constructed or located nearer to the front line than twenty five (25) feet, or nearer to the side street line than the building setback lines shown on the recorded plat of this Addition, or close to the nearest point either side property line of same than (10) feet. These restrictions, establishing building line, apply to galleries, porches, porte-cocheres, steps, projections and every other permanent part of the improvements where there is a roof or other covering, except detached garages may appear as close ne five (5) feet to the property line on the side."), m("p", {
    "data-rte-preserve-empty": "true",
    style: {
      "white-space": "pre-wrap"
    }
  })]), m("li", [m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "Only one residence may be contracted on any lot or lot and a fractional part of a lot"), m("p", {
    "data-rte-preserve-empty": "true",
    style: {
      "white-space": "pre-wrap"
    }
  })]), m("li", [m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, ["No servant quarters shall be occupied as a residence, either before or during the erection of ", m("strong", m("em", "the ")), "main residence building, snit after the erection of such main residence building, such servant quarters shall be occupied only ", m("strong", m("em", "by ")), "domestic servants."]), m("p", {
    "data-rte-preserve-empty": "true",
    style: {
      "white-space": "pre-wrap"
    }
  })]), m("li", [m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "No spirituous, vinous or malt liquors, or medicated bitters capable of producing intoxication shall ever be sold or offered for sale on any of said lots"), m("p", {
    "data-rte-preserve-empty": "true",
    style: {
      "white-space": "pre-wrap"
    }
  })]), m("li", [m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, ["No trash, ashes or other refuse may be thrown ", m("em", "on "), m("strong", m("em", "any vacant ")), "lot, avenue, boulevard, drive or street."]), m("p", {
    "data-rte-preserve-empty": "true",
    style: {
      "white-space": "pre-wrap"
    }
  })]), m("li", [m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, ["No nuisance or advertising sign, billboard or other advertising device shall be placed on or suffered to ", m("strong", m("em", "remain ")), "upon any of said lots, except that the developers may place thereon such advertising signs or devices as they may deem appropriate, helping to do with ", m("strong", m("em", "the ")), "sale ", m("strong", m("em", "of the ")), "property, and except that any lot owner may place a lot owned by him for re-sale, a sign so indicating having an area of not more than five square feet and a height of not more than four feet from the surface of the ground."]), m("p", {
    "data-rte-preserve-empty": "true",
    style: {
      "white-space": "pre-wrap"
    }
  })]), m("li", [m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "No livestock of any kind shall be kept or harbored on said premises."), m("p", {
    "data-rte-preserve-empty": "true",
    style: {
      "white-space": "pre-wrap"
    }
  })]), m("li", [m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "No building material of any kind or character shall be placed in the streets, boulevards, drives, avenues, or between the curb and property line, it being required that all building material to be used in the construction of buildings on any of said premises shall be placed within the property line of said premises upon delivery. Furthermore, no building material of any kind shall be placed or stored upon any such premises until the owner is ready to commence construction of such improvements and it is required that upon completion of said improvements, all surplus materials shall be promptly removed from said premises."), m("p", {
    "data-rte-preserve-empty": "true",
    style: {
      "white-space": "pre-wrap"
    }
  })]), m("li", [m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "No fence or wall of any kind or character or for any purpose which is over six feet in height, except a hedge, shall be erected or permitted on any of said lots, and no fence or wall or hedge of any character shall be erected or permitted between the street and the projection of the residence building lines, except for the East and West lines of said addition."), m("p", {
    "data-rte-preserve-empty": "true",
    style: {
      "white-space": "pre-wrap"
    }
  })]), m("li", [m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, ["It is understood and agreed that ", m("em", "the "), "easements shown on said plat and those referred to in this and the section immediately preceding are to be reserved as perpetual easements for the purposes indicated."]), m("p", {
    "data-rte-preserve-empty": "true",
    style: {
      "white-space": "pre-wrap"
    }
  })]), m("li", [m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "No drilling, developing, or exploring for oil, gas, sulfur or other minerals shall ever be permitted on any of said lots."), m("p", {
    "data-rte-preserve-empty": "true",
    style: {
      "white-space": "pre-wrap"
    }
  })]), m("li", [m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, ["The type and minimum cost of any residence which may be erected or constructed on said lots ", m("em", "stall "), "be an follows;"]), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "No residence shall be erected on any tract that contains less than 1,150 square feet of floor space, exclusive Of the garage and servant's quarters, porches or breezeways."), m("p", {
    "data-rte-preserve-empty": "true",
    style: {
      "white-space": "pre-wrap"
    }
  })]), m("li", [m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "All residences shall be constructed of brick, brick veneer, concrete and stucco, hollow tile, rock, rock veneer, frame, or some other form of building material, but no residence or residences shall be constructed of materials unacceptable to the said individuals for approval of design."), m("p", {
    "data-rte-preserve-empty": "true",
    style: {
      "white-space": "pre-wrap"
    }
  })])]), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, ["It is understood and agreed that the foregoing restrictions, easements, covenants and conditions shall be ", m("em", "deemed. "), "to be covenants running with the land and shall be binding upon all grantees who may purchase any of said lots in said Addition; their ", m("em", "heirs "), "or assigns, ", m("em", "or any "), "other person claiming under them; and should they, or any of them at any time violate, or attempt to violate, or shall omit to perform or observe any of the foregoing restrictions or conditions, it shall be lawful for any person owning land, which is subject to the same restrictions or conditions in respect to which default is made, or for the said owners, their heirs, representatives, successors and assigns, to institute and prosecute appropriate proceedings at law or in equity for the wrong done or attempted"]), m("p", {
    "data-rte-preserve-empty": "true",
    style: {
      "white-space": "pre-wrap"
    }
  }), m("p", {
    style: {
      "text-align": "center",
      "white-space": "pre-wrap"
    }
  }, "EXECUTED this the 14th of October, A, D. 1952."), m("p", {
    style: {
      "text-align": "right",
      "white-space": "pre-wrap"
    }
  }, "____________________________"), m("p", {
    style: {
      "text-align": "right",
      "white-space": "pre-wrap"
    }
  }, "*Dr. Russell F. Bonham"), m("p", {
    style: {
      "text-align": "right",
      "white-space": "pre-wrap"
    }
  }, "____________________________"), m("p", {
    style: {
      "text-align": "right",
      "white-space": "pre-wrap"
    }
  }, "*Dora Bonham"), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, [m("em", "*Original Recorded Copies were signed"), m("br")]), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "THE STATE OF TEXAS"), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "COUNTY OF HARRIS"), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, ["BEFORE ME, the undersigned authority, on this day personally appeared, DR. RUSSELL F. BONHAM and wife DORA BONHAM, known to me to be the persons whose names are subscribed to the foregoing instrument, and acknowledged to me that they executed the same for the purpose and considerations therein expressed; and the said DORA BONHAM, wife of the said DR. RUSSELL F. BONHAM, having been examined by me privately and apart from her husband , and having the same fully explained to her, she, the said DORA BONHAM, acknowledged said instrument to be her act and deed and declared that she had willingly signed the same for the purpose and consideration therein expressed, and that she did not wish to retract it.", m("br")]), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "GIVEN UNDER MY HAND AND SEAL OF OFFICE this the 14th day of October, A.D., 1952."), m("p", {
    style: {
      "text-align": "right",
      "white-space": "pre-wrap"
    }
  }, "___________________________________"), m("p", {
    style: {
      "text-align": "right",
      "white-space": "pre-wrap"
    }
  }, "W.H. COLBERT"), m("p", {
    style: {
      "text-align": "right",
      "white-space": "pre-wrap"
    }
  }, "Notary Public in and for Harris County Texas"), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, [m("em", "W.H. COLBERT signature and Seal appear on original and filed copy"), m("br"), m("em", "Filed for Record "), m("span", {
    style: {
      "text-decoration": "underline"
    }
  }, m("strong", m("em", "Oct 16, 1952, "))), m("strong", m("em", "at 1:00 o’clock PM"))])];
  var Bonhomme = [m("h3", {
    style: {
      "text-align": "center",
      "white-space": "pre-wrap"
    }
  }, m("strong", "# 521224 ")), m("h3", {
    style: {
      "text-align": "center",
      "white-space": "pre-wrap"
    }
  }, "Bonham Acres Subdivision Section 1 - Bonhomme Rd"), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "THE STATE OF TEXAS"), m("p", {
    style: {
      "text-align": "right",
      "margin-left": "40px",
      "white-space": "pre-wrap"
    }
  }, "KNOW ALL MEN BY THESE PRESENTS:"), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "COUNTY OF HARRIS"), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, ["That we, Dr. Russell F. Bonham and wife Dora Bonham; the owners of Bonham Acres,a Sub-division out of the ", m("em", "J. "), "R. Black Surveys, a plat of which is recorded. ", m("em", "in "), "Volume 24", m("span", {
    style: {
      "text-decoration": "underline"
    }
  }, m("strong", m("em", ","))), m("strong", m("em")), "Page 26 of the Records of Maps and Plats of Harris County, Texas, and joined herein by Richard I Anderson and wife Doris Anderson", m("strong", [", do hereby establish the following minimum restrictions and covenants upon the use", m.trust("&nbsp;"), " of lots Nos. 2 to 20 "]), "inclusive, in said Addition, and hereby declare that all conveyances of said lots or tracts in said Addition shall be subject to the following minimum restrictions, covenants, easements and conditions, which shall be, continue and remain in effect until January 1, 1970, at which time, said covenants and restrictions shall be automatically extended for successive periods of ten years unless by a vote of the majority of the then owners of the lots in said Addition, it is agreed to change the said covenants or restrictions it whole or in part. Such vote shall be evidenced by written declaration, signed and acknowledged by such owners wad recorded in the Deed Records of ", m("em", "Harris "), "County, Texas."]), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, m("br")), m("ol", {
    "data-rte-list": "default"
  }, [m("li", [m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "No business or professional house, sanitarium, hospital, saloon, place of public amusement or entertainment, livery stable, factory, warehouse, duplex, apartment house, rooming house, boarding house, or place of business of any kind, shall be constructed, built, kept or maintained on the said lots, nor shall any house on said premises be used for any such purpose or purposes, but said premises shall be used for one family residence only. No trailer, tent, or other outbuilding placed or erected on said lots shall at any tine be used as a residence, either temporarily or permanently, nor shall any structure of a temporary character be used as a residence."), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, m("br"))]), m("li", [m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "No building shall be erected, placed or altered on any of said lots until the building plans, specifications and plot plan showing the location of such building shall have been submitted to end approved in writing by Dr. Russell F, Bonham or wife, Dora Bonham, or their authorized representatives., for conformity and harmony of external design with existing structures in the subdivision; and as to location of the building with respect to property and building setback lines. If the aforesaid individuals or their authorized representatives fail to approve or disapprove such design or location within fifteen days after plans have been submitted to it, or if no suit to enjoin the erection of such building, or the making of such alterations has been commenced prior to the completion thereof, such approval will not be required. Said individuals or their authorized representative shall act without compensation. Said individuals shall act and serve until all tracts are sold, and until their successors have been chosen thereafter by the then recorded owners of a majority of said lots who may designate in writing duly recorded in the Deed Records of said County their authorized representative who thereafter have all of the powers, subject to the same limitations as were previously designated to the aforesaid individuals. None of the following restrictions shall be modified without the written approval of a majority of said lot owners."), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, m("br"))]), m("li", [m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "No residence shall be constructed or located nearer to the front line than twenty five (50) feet, or nearer to the side street line than the building setback lines shown on the recorded plat of this Addition, or close to the nearest point either side property line of same than (10) feet. These restrictions, establishing building line, apply to galleries, porches, porte-cocheres, steps, projections and every other permanent part of the improvements where there is a roof or other covering."), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, m("br"))]), m("li", [m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "Only one residence may be contracted on any lot or lot and a fractional part of a lot"), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, m("br"))]), m("li", [m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, ["No servant quarters shall be occupied as a residence, either before or during the erection of ", m("strong", m("em", "the ")), "main residence building, and after the erection of such main residence building, such servant quarters shall be occupied only ", m("strong", m("em", "by ")), "domestic servants."]), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, m("br"))]), m("li", [m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "No spirituous, vinous or malt liquors, or medicated bitters capable of producing intoxication shall ever be sold or offered for sale on any of said lots"), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, m("br"))]), m("li", [m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, ["No trash, ashes or other refuse may be thrown ", m("em", "on "), m("strong", m("em", "any vacant ")), "lot, avenue, boulevard, drive or street."]), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, m("br"))]), m("li", [m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, ["No nuisance or advertising sign, billboard or other advertising device shall be placed on or suffered to ", m("strong", m("em", "remain ")), "upon any of said lots, except that the developers may place thereon such advertising signs or devices as they may deem appropriate, helping to do with ", m("strong", m("em", "the ")), "sale ", m("strong", m("em", "of the ")), "property, and except that any lot owner may place a lot owned by him for re-sale, a sign so indicating having an area of not more than five square feet and a height of not more than four feet from the surface of the ground."]), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, m("br"))]), m("li", [m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "No livestock of any kind shall be kept or harbored on said premises."), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, m("br"))]), m("li", [m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "No building material of any kind or character shall be placed in the streets, boulevards, drives, avenues, or between the curb and property line, it being required that all building material to be used in the construction of buildings on any of said premises shall be placed within the property line of said premises upon delivery. Furthermore, no building material of any kind shall be placed or stored upon any such premises until the owner is ready to commence construction of such improvements and it is required that upon completion of said improvements, all surplus materials shall be promptly removed from said premises."), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, m("br"))]), m("li", [m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "No fence or wall of any kind or character or for any purpose which is over six feet in height, except a hedge, shall be erected or permitted on any of said lots, and no fence or wall or hedge of any character shall be erected or permitted between the street and the projection of the residence building lines, except for the East and West lines of said addition."), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, m("br"))]), m("li", [m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, ["It is understood and agreed that ", m("em", "the "), "easements shown on said plat and those referred to in this and the section immediately preceding are to be reserved as perpetual easements for the purposes indicated."]), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, m("br"))]), m("li", [m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "No drilling, developing, or exploring for oil, gas, sulfur or other minerals shall ever be permitted on any of said lots."), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, m("br"))]), m("li", [m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, ["The type and minimum cost of any residence which may be erected or constructed on said lots ", m("em", "stall "), "be an follows;"]), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "No residence shall be erected on any tract that contains less than 1,500 square feet of floor space, exclusive of the garage and servant's quarters, porches or breezeways."), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, m("br"))]), m("li", m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "All residences shall be constructed of brick, brick veneer, concrete and stucco, hollow tile, rock, rock veneer, frame, or some other form of building material, but no residence or residences shall be constructed of materials unacceptable to the said individuals for approval of design."))]), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, [m("br"), "It is understood and agreed that the foregoing restrictions, easements, covenants and conditions shall be ", m("em", "deemed. "), "to be covenants running with the land and shall be binding upon all grantees who may purchase any of said lots in said Addition; their ", m("em", "heirs "), "or assigns, ", m("em", "or any "), "other person claiming under them; and should they, or any of them at any time violate, or attempt to violate, or shall omit to perform or observe any of the foregoing restrictions or conditions, it shall be lawful for any person owning land, which is subject to the same restrictions or conditions in respect to which default is made, or for the said owners, their heirs, representatives, successors and assigns, to institute and prosecute appropriate proceedings at law or in equity for the wrong done or attempted", m("br"), m("br")]), m("p", {
    style: {
      "text-align": "center",
      "white-space": "pre-wrap"
    }
  }, "EXECUTED this the 19th of April, A, D. 1948."), m("p", {
    style: {
      "text-align": "right",
      "white-space": "pre-wrap"
    }
  }, "____________________________"), m("p", {
    style: {
      "text-align": "right",
      "white-space": "pre-wrap"
    }
  }, "*Dr. Russell F. Bonham"), m("p", {
    style: {
      "text-align": "right",
      "white-space": "pre-wrap"
    }
  }, "____________________________"), m("p", {
    style: {
      "text-align": "right",
      "white-space": "pre-wrap"
    }
  }, "*Dora Bonham"), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, m("em", "*Original Recorded Copies were signed")), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "THE STATE OF TEXAS"), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "COUNTY OF HARRIS"), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, [m("br"), "BEFORE ME, the undersigned authority, on this day personally appeared, DR. RUSSELL F. BONHAM and wife DORA BONHAM, known to me to be the persons whose names are subscribed to the foregoing instrument, and acknowledged to me that they executed the same for the purpose and considerations therein expressed; and the said DORA BONHAM, wife of the said DR. RUSSELL F. BONHAM, having been examined by me privately and apart from her husband , and having the same fully explained to her, she, the said DORA BONHAM, acknowledged said instrument to be her act and deed and declared that she had willingly signed the same for the purpose and consideration therein expressed, and that she did not wish to retract it."]), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, m("br")), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "GIVEN UNDER MY HAND AND SEAL OF OFFICE this the 19th day of April, A.D., 1948."), m("p", {
    style: {
      "text-align": "right",
      "white-space": "pre-wrap"
    }
  }, "___________________________________"), m("p", {
    style: {
      "text-align": "right",
      "white-space": "pre-wrap"
    }
  }, "W.H. COLBERT"), m("p", {
    style: {
      "text-align": "right",
      "white-space": "pre-wrap"
    }
  }, ["Notary Public in and for Harris County Texas", m("br"), m("br")]), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, ["THE STATE OF TEXAS", m("br"), "COUNTY OF HARRIS"]), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "BEFORE ME, the undersigned authority, on this day personally appeared, RICHARD I. ANDERSON and wife DORIS ANDERSON, known to me to be the persons whose names are subscribed to the foregoing instrument, and acknowledged to me that they executed the same for the purpose and considerations therein expressed; and the said DORIS ANDERSON, wife of the said RICHARD I. ANDERSON, having been examined by me privately and apart from her husband , and having the same fully explained to her, she, the said DORA BONHAM, acknowledged said instrument to be her act and deed and declared that she had willingly signed the same for the purpose and consideration therein expressed, and that she did not wish to retract it."), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, "GIVEN UNDER MY HAND AND SEAL OF OFFICE this the 19th day of April, A.D., 1948."), m("p", {
    style: {
      "text-align": "right",
      "white-space": "pre-wrap"
    }
  }, "___________________________________"), m("p", {
    style: {
      "text-align": "right",
      "white-space": "pre-wrap"
    }
  }, "W.H. COLBERT"), m("p", {
    style: {
      "text-align": "right",
      "white-space": "pre-wrap"
    }
  }, "Notary Public in and for Harris County Texas"), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, m("em", "W.H. COLBERT signature and Seal appear on original and filed copy")), m("p", {
    style: {
      "white-space": "pre-wrap"
    }
  }, [m("em", "Filed for Record "), m("span", {
    style: {
      "text-decoration": "underline"
    }
  }, [m("em", "April 21, 1952, at 3:00 o’clock PM")])])];
  var pages = {
    Bonhomme: Bonhomme,
    Cadawac: Cadawac,
    Lugary: Lugary
  };
  var state = {
    page: "Bonhomme"
  };
  return {
    view: function view() {
      return m("section", m("nav.tabs", Object.keys(pages).map(function (tab) {
        return m("a.tab.pointer", {
          "class": state.page == tab ? "active" : "",
          onclick: function onclick() {
            return state.page = tab;
          }
        }, tab.toUpperCase());
      })), m("section.card.container", {
        style: {
          height: "100vh",
          overflow: "scroll"
        }
      }, pages[state.page]));
    }
  };
};

var _default = DeedRes;
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
      return m(".container", m(".hero", "COMING SOON"));
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

var _DateTime = _interopRequireDefault(require("Components/DateTime"));

var _cjs = require("@mithril-icons/clarity/cjs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var State = {
  events: null,
  blogs: null,
  images: null
};

var createCarousel = function createCarousel(dom) {
  var slides = dom.children[1];
  var prev = dom.children[2].children[0];
  var next = dom.children[2].children[1];
  var slider = new Glider(slides, {
    // `auto` allows automatic responsive
    // width calculations
    // slidesToShow: "auto",
    // slidesToScroll: "auto",
    // should have been named `itemMinWidth`
    // slides grow to fit the container viewport
    // ignored unless `slidesToShow` is set to `auto`
    // itemWidth: "350px",
    // if true, slides wont be resized to fit viewport
    // requires `itemWidth` to be set
    // * this may cause fractional slides
    // exactWidth: false,
    // speed aggravator - higher is slower
    duration: 0.5,
    // dot container element or selector
    // dots: "CSS Selector",
    // arrow container elements or selector
    arrows: {
      prev: prev,
      next: next
    },
    // allow mouse dragging
    draggable: true,
    // how much to scroll with each mouse delta
    dragVelocity: 3.3,
    // use any custom easing function
    // compatible with most easing plugins
    easing: function easing(x, t, b, c, d) {
      return c * (t /= d) * t + b;
    },
    // event control
    scrollPropagate: false,
    rewind: true,
    eventPropagate: true,
    // Force centering slide after scroll event
    scrollLock: true,
    // how long to wait after scroll event before locking
    // if too low, it might interrupt normal scrolling
    scrollLockDelay: 150,
    // Force centering slide after resize event
    resizeLock: true,
    // Glider.js breakpoints are mobile-first
    responsive: [{
      breakpoint: 1200,
      settings: {
        slidesToShow: 4,
        itemWidth: "100%",
        slidesToScroll: 2
      }
    }, {
      breakpoint: 1000,
      settings: {
        slidesToShow: 3,
        itemWidth: "100%",
        slidesToScroll: 1
      }
    }, {
      breakpoint: 624,
      settings: {
        slidesToShow: 2,
        itemWidth: "100%",
        slidesToScroll: 1
      }
    }, {
      breakpoint: 300,
      settings: {
        slidesToShow: 1,
        itemWidth: "100%",
        slidesToScroll: 1
      }
    }]
  });
  State[dom.id] = slider;
};

var Blog = {
  view: function view(_ref) {
    var _ref$attrs = _ref.attrs,
        mdl = _ref$attrs.mdl,
        idx = _ref$attrs.idx,
        blog = _ref$attrs.blog;
    return m(".card.opacity-overlay.is-vertical-align m6 row", {
      key: idx,
      style: {
        height: "200px",
        alignContent: "stretch",
        overflow: "auto"
      }
    }, m("img", {
      src: blog.img || "images/main.webp",
      style: {
        objectFit: "contain",
        maxHeight: "150px"
      }
    }), m("h2.text-primary text-wrap", blog.title), m(m.route.Link, {
      selector: "button",
      "class": "button primary outline is-full-width",
      href: "/social/blog-post:".concat(blog.objectId)
    }, "...Read More"));
  }
};
var Img = {
  view: function view(_ref2) {
    var _ref2$attrs = _ref2.attrs,
        idx = _ref2$attrs.idx,
        img = _ref2$attrs.img;
    return m(".card.m6", {
      style: {
        width: "250px"
      }
    }, m("img.is-center", {
      style: {
        height: "100%",
        margin: "0 auto"
      },
      key: idx,
      src: img.thumb
    }));
  }
};
var Event = {
  view: function view(_ref3) {
    var _ref3$attrs = _ref3.attrs,
        mdl = _ref3$attrs.mdl,
        idx = _ref3$attrs.idx,
        event = _ref3$attrs.event;
    return m(".card.is-vertical-align m6 row", {
      key: idx,
      style: {
        height: "200px",
        backgroundImage: event.image,
        alignContent: "stretch",
        overflow: "auto"
      }
    }, event.allDay && m("p.tag", "All Day Event!"), m(".row.grouped", m("h2.is-left.text-primary text-wrap", event.title), m("img.is-right", {
      style: {
        maxHeight: "100px"
      },
      src: event.image
    })), m(_DateTime["default"], {
      event: event
    }), m(m.route.Link, {
      selector: "",
      "class": "button primary outline is-full-width",
      onclick: function onclick() {
        return mdl.state.selectedPreviewEvent(event.objectId);
      },
      href: "/social/events"
    }, m("p", "...Read More")));
  }
};
var Slider = {
  view: function view(_ref4) {
    var _ref4$attrs = _ref4.attrs,
        mdl = _ref4$attrs.mdl,
        data = _ref4$attrs.data,
        type = _ref4$attrs.type;
    return m(".grouped.glider", {
      style: {
        maxHeight: "350px"
      }
    }, data.map(function (item, idx) {
      if (type == "event") return m(Event, {
        mdl: mdl,
        event: item,
        idx: idx
      });
      if (type == "img") return m(Img, {
        mdl: mdl,
        img: item,
        idx: idx
      });
      if (type == "blog") return m(Blog, {
        mdl: mdl,
        blog: item,
        idx: idx
      });
    }));
  }
};
var Nav = {
  view: function view() {
    return m("nav.p-t-25.row", m(".nav-left", m("button.button.m-auto.outline.dark", {
      style: {
        width: "80%"
      }
    }, m(_cjs.AngleDoubleLine, {
      style: {
        transform: "rotate(270deg)",
        transition: "transform .3s ease-out"
      }
    }))), m(".nav-right", m("button.button.m-auto.outline.dark", {
      style: {
        width: "80%"
      }
    }, m(_cjs.AngleDoubleLine, {
      style: {
        transform: "rotate(90deg)",
        transition: "transform .3s ease-out"
      }
    }))));
  }
};
var Section = {
  view: function view(_ref5) {
    var _ref5$attrs = _ref5.attrs,
        mdl = _ref5$attrs.mdl,
        title = _ref5$attrs.title,
        type = _ref5$attrs.type,
        data = _ref5$attrs.data;
    return m("section.row.p-b-25", data.any() && m(".glider-contain", {
      onbeforeremove: function onbeforeremove(_ref6) {
        var dom = _ref6.dom;
        return State[dom.id].destroy();
      },
      oncreate: function oncreate(_ref7) {
        var dom = _ref7.dom;
        return createCarousel(dom);
      }
    }, m("h2.is-center.strong", title), m(Slider, {
      mdl: mdl,
      data: data,
      type: type
    }), m(Nav)));
  }
};

var Home = function Home() {
  return {
    oninit: _Layouts.fetchAll,
    view: function view(_ref8) {
      var mdl = _ref8.attrs.mdl;
      return m("article.grid", m(Section, {
        mdl: mdl,
        title: "Upcoming Events!",
        type: "event",
        data: mdl.data.events
      }), m(Section, {
        mdl: mdl,
        title: "Recent Photos",
        type: "img",
        data: mdl.data.images
      }), m(Section, {
        mdl: mdl,
        title: "Latest Blog Posts!",
        type: "blog",
        data: mdl.data.blogs
      }));
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
      return m("", m("section.card", m("hgroup", m("p", "BACA operates as a non-profit organization for community and civic improvement and protection and other non-profit purposes."), m("p", "Any income received shall be applied only to the non-profit purposes and objectives of the organization, and no part of the income shall inure to the benefit of any officer or member."), m("p", "We will use the ", m("span.text-primary", "annual $50 membership"), " to maintain ", m(m.route.Link, {
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
    isAnchor ? (0, _Utils.scrollToAnchor)(mdl.state.anchor) : (0, _Utils.ScrollToPageTitle)();
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
    isAnchor ? (0, _Utils.scrollToAnchor)(mdl.state.anchor) : (0, _Utils.ScrollToPageTitle)();
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
    isAnchor ? (0, _Utils.scrollToAnchor)(mdl.state.anchor) : (0, _Utils.ScrollToPageTitle)();
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
    isAnchor ? (0, _Utils.scrollToAnchor)(mdl.state.anchor) : (0, _Utils.ScrollToPageTitle)();
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
    // PageTitle().scroll({
    //   top: 0,
    //   left: 0,
    //   behavior: "smooth",
    // })
    localStorage.clear();
    sessionStorage.clear();
    mdl.state.isAuth(false);
    mdl.user = {};
    console.log("loggout", mdl);
    var routes = ["/account"];
    var currentRoute = m.route.get();
    routes.map(function (r) {
      return currentRoute.includes(r);
    }) ? m.route.set("/") : m.route.set(currentRoute);
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

var _deedRestrictions = _interopRequireDefault(require("Pages/deed-restrictions.js"));

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
    return isAnchor ? (0, _index2.scrollToAnchor)(mdl.state.anchor) : (0, _index2.ScrollToPageTitle)();
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
    return isAnchor ? (0, _index2.scrollToAnchor)(mdl.state.anchor) : (0, _index2.ScrollToPageTitle)();
  },
  component: function component(mdl) {
    return m(_index["default"], {
      mdl: mdl
    }, m(_deedRestrictions["default"], {
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
    return isAnchor ? (0, _index2.scrollToAnchor)(mdl.state.anchor) : (0, _index2.ScrollToPageTitle)();
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
    return isAnchor ? (0, _index2.scrollToAnchor)(mdl.state.anchor) : (0, _index2.ScrollToPageTitle)();
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
    return isAnchor ? (0, _index2.scrollToAnchor)(mdl.state.anchor) : (0, _index2.ScrollToPageTitle)();
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
  isNav: true,
  group: ["navmenu"],
  children: [],
  options: [],
  onmatch: function onmatch(mdl, args, path, fullroute, isAnchor) {
    return isAnchor ? (0, _index2.scrollToAnchor)(mdl.state.anchor) : (0, _index2.ScrollToPageTitle)();
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
    return isAnchor ? (0, _index2.scrollToAnchor)(mdl.state.anchor) : (0, _index2.ScrollToPageTitle)();
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
    return isAnchor ? (0, _Utils.scrollToAnchor)(mdl.state.anchor) : (0, _Utils.ScrollToPageTitle)();
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
    return isAnchor ? (0, _Utils.scrollToAnchor)(mdl.state.anchor) : (0, _Utils.ScrollToPageTitle)();
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
    return isAnchor ? (0, _Utils.scrollToAnchor)(mdl.state.anchor) : (0, _Utils.ScrollToPageTitle)();
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
    return isAnchor ? (0, _Utils.scrollToAnchor)(mdl.state.anchor) : (0, _Utils.ScrollToPageTitle)();
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
    return isAnchor ? (0, _Utils.scrollToAnchor)(mdl.state.anchor) : (0, _Utils.ScrollToPageTitle)();
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
    return isAnchor ? (0, _Utils.scrollToAnchor)(mdl.state.anchor) : (0, _Utils.ScrollToPageTitle)();
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
    return isAnchor ? (0, _Utils.scrollToAnchor)(mdl.state.anchor) : (0, _Utils.ScrollToPageTitle)();
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
  external: "https://houston311.powerappsportals.us/en-US/",
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

var _mithril = require("mithril");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var SocialRoutes = [{
  id: "social",
  name: "Social",
  // icon: Icons.home,
  route: "/social",
  isNav: true,
  group: ["navbar", "navmenu"],
  children: ["map-of-bonham-acres", "blog", "explore", "gallery", "events", "bfn-park"],
  options: [],
  onmatch: function onmatch(mdl, args, path, fullroute, isAnchor) {
    return isAnchor ? (0, _Utils.scrollToAnchor)(mdl.state.anchor) : (0, _Utils.ScrollToPageTitle)();
  },
  component: function component(mdl) {
    return (0, _mithril.m)(_index["default"], {
      mdl: mdl
    }, (0, _mithril.m)(_default2["default"], {
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
    return isAnchor ? (0, _Utils.scrollToAnchor)(mdl.state.anchor) : (0, _Utils.ScrollToPageTitle)();
  },
  component: function component(mdl) {
    return (0, _mithril.m)(_index["default"], {
      mdl: mdl
    }, (0, _mithril.m)(_index2["default"], {
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
    return isAnchor ? (0, _Utils.scrollToAnchor)(mdl.state.anchor) : (0, _Utils.ScrollToPageTitle)();
  },
  component: function component(mdl) {
    return (0, _mithril.m)(_index["default"], {
      mdl: mdl
    }, (0, _mithril.m)(_gallery["default"], {
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
    return isAnchor ? (0, _Utils.scrollToAnchor)(mdl.state.anchor) : (0, _Utils.ScrollToPageTitle)();
  },
  component: function component(mdl) {
    return (0, _mithril.m)(_index["default"], {
      mdl: mdl
    }, (0, _mithril.m)(_album["default"], {
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
    return isAnchor ? (0, _Utils.scrollToAnchor)(mdl.state.anchor) : (0, _Utils.ScrollToPageTitle)();
  },
  component: function component(mdl) {
    return (0, _mithril.m)(_index["default"], {
      mdl: mdl
    }, (0, _mithril.m)(_blog["default"], {
      mdl: mdl
    }));
  }
}, {
  id: "blog-editor",
  name: "Blog Editor",
  // icon: Icons.home,
  route: "/social/blog-editor:objectId",
  isNav: false,
  group: ["social", "authenticated"],
  children: [],
  options: [],
  onmatch: function onmatch(mdl, args, path, fullroute, isAnchor) {
    return isAnchor ? (0, _Utils.scrollToAnchor)(mdl.state.anchor) : (0, _Utils.ScrollToPageTitle)();
  },
  component: function component(mdl) {
    return (0, _mithril.m)(_index["default"], {
      mdl: mdl
    }, (0, _mithril.m)(_blogEditor["default"], {
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
    isAnchor ? (0, _Utils.scrollToAnchor)(mdl.state.anchor) : (0, _Utils.ScrollToPageTitle)();
    mdl.blogpost = args.objectId.slice(1);
    mdl.blogpost.length > 1 ? (0, _mithril.m)(_index["default"], {
      mdl: mdl
    }, (0, _mithril.m)(_blogPost["default"], {
      mdl: mdl,
      id: mdl.blogpost
    })) : _mithril.m.route.SKIP;
  },
  component: function component(mdl) {
    return (0, _mithril.m)(_index["default"], {
      mdl: mdl
    }, (0, _mithril.m)(_blogPost["default"], {
      mdl: mdl,
      id: mdl.blogpost
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
    return isAnchor ? (0, _Utils.scrollToAnchor)(mdl.state.anchor) : (0, _Utils.ScrollToPageTitle)();
  },
  component: function component(mdl) {
    return (0, _mithril.m)(_index["default"], {
      mdl: mdl
    }, (0, _mithril.m)(_default2["default"], {
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
  dom.classList.replace("fadeInRight", "fadeback");
  return new Promise(function (resolve) {
    return setTimeout(function () {
      dom.classList.replace("fadeback", "fadeInRight");
      dom.addEventListener("animationend", resolve);
    }, 300);
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

;require.register("Utils/fullcalendar.min.js", function(exports, require, module) {
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/*!
FullCalendar v5.8.0
Docs & License: https://fullcalendar.io/
(c) 2021 Adam Shaw
*/
var FullCalendar = function (e) {
  "use strict";

  var _t2 = function t(e, n) {
    return (_t2 = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (e, t) {
      e.__proto__ = t;
    } || function (e, t) {
      for (var n in t) {
        Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
      }
    })(e, n);
  };

  function n(e, n) {
    if ("function" != typeof n && null !== n) throw new TypeError("Class extends value " + String(n) + " is not a constructor or null");

    function r() {
      this.constructor = e;
    }

    _t2(e, n), e.prototype = null === n ? Object.create(n) : (r.prototype = n.prototype, new r());
  }

  var _r2 = function r() {
    return (_r2 = Object.assign || function (e) {
      for (var t, n = 1, r = arguments.length; n < r; n++) {
        for (var o in t = arguments[n]) {
          Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
        }
      }

      return e;
    }).apply(this, arguments);
  };

  function o(e, t) {
    for (var n = 0, r = t.length, o = e.length; n < r; n++, o++) {
      e[o] = t[n];
    }

    return e;
  }

  var i,
      a,
      s,
      l,
      u,
      c = {},
      d = [],
      p = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;

  function f(e, t) {
    for (var n in t) {
      e[n] = t[n];
    }

    return e;
  }

  function h(e) {
    var t = e.parentNode;
    t && t.removeChild(e);
  }

  function v(e, t, n) {
    var r,
        o,
        i,
        a = arguments,
        s = {};

    for (i in t) {
      "key" == i ? r = t[i] : "ref" == i ? o = t[i] : s[i] = t[i];
    }

    if (arguments.length > 3) for (n = [n], i = 3; i < arguments.length; i++) {
      n.push(a[i]);
    }
    if (null != n && (s.children = n), "function" == typeof e && null != e.defaultProps) for (i in e.defaultProps) {
      void 0 === s[i] && (s[i] = e.defaultProps[i]);
    }
    return g(e, s, r, o, null);
  }

  function g(e, t, n, r, o) {
    var a = {
      type: e,
      props: t,
      key: n,
      ref: r,
      __k: null,
      __: null,
      __b: 0,
      __e: null,
      __d: void 0,
      __c: null,
      __h: null,
      constructor: void 0,
      __v: null == o ? ++i.__v : o
    };
    return null != i.vnode && i.vnode(a), a;
  }

  function m(e) {
    return e.children;
  }

  function y(e, t) {
    ;
    this.props = e, this.context = t;
  }

  function E(e, t) {
    if (null == t) return e.__ ? E(e.__, e.__.__k.indexOf(e) + 1) : null;

    for (var n; t < e.__k.length; t++) {
      if (null != (n = e.__k[t]) && null != n.__e) return n.__e;
    }

    return "function" == typeof e.type ? E(e) : null;
  }

  function S(e) {
    var t, n;

    if (null != (e = e.__) && null != e.__c) {
      for (e.__e = e.__c.base = null, t = 0; t < e.__k.length; t++) {
        if (null != (n = e.__k[t]) && null != n.__e) {
          e.__e = e.__c.base = n.__e;
          break;
        }
      }

      return S(e);
    }
  }

  function D(e) {
    ;
    (!e.__d && (e.__d = !0) && a.push(e) && !b.__r++ || l !== i.debounceRendering) && ((l = i.debounceRendering) || s)(b);
  }

  function b() {
    for (var e; b.__r = a.length;) {
      e = a.sort(function (e, t) {
        return e.__v.__b - t.__v.__b;
      }), a = [], e.some(function (e) {
        var t, n, r, o, i, a;
        e.__d && (i = (o = (t = e).__v).__e, (a = t.__P) && (n = [], (r = f({}, o)).__v = o.__v + 1, P(a, o, r, t.__n, void 0 !== a.ownerSVGElement, null != o.__h ? [i] : null, n, null == i ? E(o) : i, o.__h), I(n, o), o.__e != i && S(o)));
      });
    }
  }

  function C(e, t, n, r, o, i, a, s, l, u) {
    var p,
        f,
        h,
        v,
        y,
        S,
        D,
        b = r && r.__k || d,
        C = b.length;

    for (n.__k = [], p = 0; p < t.length; p++) {
      if (null != (v = n.__k[p] = null == (v = t[p]) || "boolean" == typeof v ? null : "string" == typeof v || "number" == typeof v || "bigint" == typeof v ? g(null, v, null, null, v) : Array.isArray(v) ? g(m, {
        children: v
      }, null, null, null) : v.__b > 0 ? g(v.type, v.props, v.key, null, v.__v) : v)) {
        if (v.__ = n, v.__b = n.__b + 1, null === (h = b[p]) || h && v.key == h.key && v.type === h.type) b[p] = void 0;else for (f = 0; f < C; f++) {
          if ((h = b[f]) && v.key == h.key && v.type === h.type) {
            b[f] = void 0;
            break;
          }

          h = null;
        }
        P(e, v, h = h || c, o, i, a, s, l, u), y = v.__e, (f = v.ref) && h.ref != f && (D || (D = []), h.ref && D.push(h.ref, null, v), D.push(f, v.__c || y, v)), null != y ? (null == S && (S = y), "function" == typeof v.type && null != v.__k && v.__k === h.__k ? v.__d = l = w(v, l, e) : l = _(e, v, h, b, y, l), u || "option" !== n.type ? "function" == typeof n.type && (n.__d = l) : e.value = "") : l && h.__e == l && l.parentNode != e && (l = E(h));
      }
    }

    for (n.__e = S, p = C; p--;) {
      null != b[p] && ("function" == typeof n.type && null != b[p].__e && b[p].__e == n.__d && (n.__d = E(r, p + 1)), O(b[p], b[p]));
    }

    if (D) for (p = 0; p < D.length; p++) {
      H(D[p], D[++p], D[++p]);
    }
  }

  function w(e, t, n) {
    var r, o;

    for (r = 0; r < e.__k.length; r++) {
      (o = e.__k[r]) && (o.__ = e, t = "function" == typeof o.type ? w(o, t, n) : _(n, o, o, e.__k, o.__e, t));
    }

    return t;
  }

  function R(e, t) {
    return t = t || [], null == e || "boolean" == typeof e || (Array.isArray(e) ? e.some(function (e) {
      R(e, t);
    }) : t.push(e)), t;
  }

  function _(e, t, n, r, o, i) {
    var a, s, l;
    if (void 0 !== t.__d) a = t.__d, t.__d = void 0;else if (null == n || o != i || null == o.parentNode) e: if (null == i || i.parentNode !== e) e.appendChild(o), a = null;else {
      for (s = i, l = 0; (s = s.nextSibling) && l < r.length; l += 2) {
        if (s == o) break e;
      }

      e.insertBefore(o, i), a = i;
    }
    return void 0 !== a ? a : o.nextSibling;
  }

  function T(e, t, n) {
    "-" === t[0] ? e.setProperty(t, n) : e[t] = null == n ? "" : "number" != typeof n || p.test(t) ? n : n + "px";
  }

  function k(e, t, n, r, o) {
    var i;

    e: if ("style" === t) {
      if ("string" == typeof n) e.style.cssText = n;else {
        if ("string" == typeof r && (e.style.cssText = r = ""), r) for (t in r) {
          n && t in n || T(e.style, t, "");
        }
        if (n) for (t in n) {
          r && n[t] === r[t] || T(e.style, t, n[t]);
        }
      }
    } else if ("o" === t[0] && "n" === t[1]) i = t !== (t = t.replace(/Capture$/, "")), t = t.toLowerCase() in e ? t.toLowerCase().slice(2) : t.slice(2), e.l || (e.l = {}), e.l[t + i] = n, n ? r || e.addEventListener(t, i ? M : x, i) : e.removeEventListener(t, i ? M : x, i);else if ("dangerouslySetInnerHTML" !== t) {
      if (o) t = t.replace(/xlink[H:h]/, "h").replace(/sName$/, "s");else if ("href" !== t && "list" !== t && "form" !== t && "tabIndex" !== t && "download" !== t && t in e) try {
        e[t] = null == n ? "" : n;
        break e;
      } catch (e) {}
      "function" == typeof n || (null != n && (!1 !== n || "a" === t[0] && "r" === t[1]) ? e.setAttribute(t, n) : e.removeAttribute(t));
    }
  }

  function x(e) {
    this.l[e.type + !1](i.event ? i.event(e) : e);
  }

  function M(e) {
    this.l[e.type + !0](i.event ? i.event(e) : e);
  }

  function P(e, t, n, r, o, a, s, l, u) {
    var c,
        d,
        p,
        h,
        v,
        g,
        E,
        S,
        D,
        b,
        w,
        R = t.type;
    if (void 0 !== t.constructor) return null;
    null != n.__h && (u = n.__h, l = t.__e = n.__e, t.__h = null, a = [l]), (c = i.__b) && c(t);

    try {
      e: if ("function" == typeof R) {
        if (S = t.props, D = (c = R.contextType) && r[c.__c], b = c ? D ? D.props.value : c.__ : r, n.__c ? E = (d = t.__c = n.__c).__ = d.__E : ("prototype" in R && R.prototype.render ? t.__c = d = new R(S, b) : (t.__c = d = new y(S, b), d.constructor = R, d.render = A), D && D.sub(d), d.props = S, d.state || (d.state = {}), d.context = b, d.__n = r, p = d.__d = !0, d.__h = []), null == d.__s && (d.__s = d.state), null != R.getDerivedStateFromProps && (d.__s == d.state && (d.__s = f({}, d.__s)), f(d.__s, R.getDerivedStateFromProps(S, d.__s))), h = d.props, v = d.state, p) null == R.getDerivedStateFromProps && null != d.componentWillMount && d.componentWillMount(), null != d.componentDidMount && d.__h.push(d.componentDidMount);else {
          if (null == R.getDerivedStateFromProps && S !== h && null != d.componentWillReceiveProps && d.componentWillReceiveProps(S, b), !d.__e && null != d.shouldComponentUpdate && !1 === d.shouldComponentUpdate(S, d.__s, b) || t.__v === n.__v) {
            ;
            d.props = S, d.state = d.__s, t.__v !== n.__v && (d.__d = !1), d.__v = t, t.__e = n.__e, t.__k = n.__k, t.__k.forEach(function (e) {
              e && (e.__ = t);
            }), d.__h.length && s.push(d);
            break e;
          }

          null != d.componentWillUpdate && d.componentWillUpdate(S, d.__s, b), null != d.componentDidUpdate && d.__h.push(function () {
            d.componentDidUpdate(h, v, g);
          });
        }
        ;
        d.context = b, d.props = S, d.state = d.__s, (c = i.__r) && c(t), d.__d = !1, d.__v = t, d.__P = e, c = d.render(d.props, d.state, d.context), d.state = d.__s, null != d.getChildContext && (r = f(f({}, r), d.getChildContext())), p || null == d.getSnapshotBeforeUpdate || (g = d.getSnapshotBeforeUpdate(h, v)), w = null != c && c.type === m && null == c.key ? c.props.children : c, C(e, Array.isArray(w) ? w : [w], t, n, r, o, a, s, l, u), d.base = t.__e, t.__h = null, d.__h.length && s.push(d), E && (d.__E = d.__ = null), d.__e = !1;
      } else null == a && t.__v === n.__v ? (t.__k = n.__k, t.__e = n.__e) : t.__e = N(n.__e, t, n, r, o, a, s, u);

      (c = i.diffed) && c(t);
    } catch (e) {
      ;
      t.__v = null, (u || null != a) && (t.__e = l, t.__h = !!u, a[a.indexOf(l)] = null), i.__e(e, t, n);
    }
  }

  function I(e, t) {
    i.__c && i.__c(t, e), e.some(function (t) {
      try {
        ;
        e = t.__h, t.__h = [], e.some(function (e) {
          e.call(t);
        });
      } catch (e) {
        i.__e(e, t.__v);
      }
    });
  }

  function N(e, t, n, r, o, i, a, s) {
    var l,
        u,
        p,
        f,
        v = n.props,
        g = t.props,
        m = t.type,
        y = 0;
    if ("svg" === m && (o = !0), null != i) for (; y < i.length; y++) {
      if ((l = i[y]) && (l === e || (m ? l.localName == m : 3 == l.nodeType))) {
        ;
        e = l, i[y] = null;
        break;
      }
    }

    if (null == e) {
      if (null === m) return document.createTextNode(g);
      e = o ? document.createElementNS("http://www.w3.org/2000/svg", m) : document.createElement(m, g.is && g), i = null, s = !1;
    }

    if (null === m) v === g || s && e.data === g || (e.data = g);else {
      if (i = i && d.slice.call(e.childNodes), u = (v = n.props || c).dangerouslySetInnerHTML, p = g.dangerouslySetInnerHTML, !s) {
        if (null != i) for (v = {}, f = 0; f < e.attributes.length; f++) {
          v[e.attributes[f].name] = e.attributes[f].value;
        }
        (p || u) && (p && (u && p.__html == u.__html || p.__html === e.innerHTML) || (e.innerHTML = p && p.__html || ""));
      }

      if (function (e, t, n, r, o) {
        var i;

        for (i in n) {
          "children" === i || "key" === i || i in t || k(e, i, null, n[i], r);
        }

        for (i in t) {
          o && "function" != typeof t[i] || "children" === i || "key" === i || "value" === i || "checked" === i || n[i] === t[i] || k(e, i, t[i], n[i], r);
        }
      }(e, g, v, o, s), p) t.__k = [];else if (y = t.props.children, C(e, Array.isArray(y) ? y : [y], t, n, r, o && "foreignObject" !== m, i, a, e.firstChild, s), null != i) for (y = i.length; y--;) {
        null != i[y] && h(i[y]);
      }
      s || ("value" in g && void 0 !== (y = g.value) && (y !== e.value || "progress" === m && !y) && k(e, "value", y, v.value, !1), "checked" in g && void 0 !== (y = g.checked) && y !== e.checked && k(e, "checked", y, v.checked, !1));
    }
    return e;
  }

  function H(e, t, n) {
    try {
      "function" == typeof e ? e(t) : e.current = t;
    } catch (e) {
      i.__e(e, n);
    }
  }

  function O(e, t, n) {
    var r, o, a;

    if (i.unmount && i.unmount(e), (r = e.ref) && (r.current && r.current !== e.__e || H(r, null, t)), n || "function" == typeof e.type || (n = null != (o = e.__e)), e.__e = e.__d = void 0, null != (r = e.__c)) {
      if (r.componentWillUnmount) try {
        r.componentWillUnmount();
      } catch (e) {
        i.__e(e, t);
      }
      r.base = r.__P = null;
    }

    if (r = e.__k) for (a = 0; a < r.length; a++) {
      r[a] && O(r[a], t, n);
    }
    null != o && h(o);
  }

  function A(e, t, n) {
    return this.constructor(e, n);
  }

  function U(e, t, n) {
    var r, o, a;
    i.__ && i.__(e, t), o = (r = "function" == typeof n) ? null : n && n.__k || t.__k, a = [], P(t, e = (!r && n || t).__k = v(m, null, [e]), o || c, c, void 0 !== t.ownerSVGElement, !r && n ? [n] : o ? null : t.firstChild ? d.slice.call(t.childNodes) : null, a, !r && n ? n : o ? o.__e : t.firstChild, r), I(a, e);
  }

  ;
  i = {
    __e: function __e(e, t) {
      for (var n, r, o; t = t.__;) {
        if ((n = t.__c) && !n.__) try {
          if ((r = n.constructor) && null != r.getDerivedStateFromError && (n.setState(r.getDerivedStateFromError(e)), o = n.__d), null != n.componentDidCatch && (n.componentDidCatch(e), o = n.__d), o) return n.__E = n;
        } catch (t) {
          e = t;
        }
      }

      throw e;
    },
    __v: 0
  }, y.prototype.setState = function (e, t) {
    var n;
    n = null != this.__s && this.__s !== this.state ? this.__s : this.__s = f({}, this.state), "function" == typeof e && (e = e(f({}, n), this.props)), e && f(n, e), null != e && this.__v && (t && this.__h.push(t), D(this));
  }, y.prototype.forceUpdate = function (e) {
    this.__v && (this.__e = !0, e && this.__h.push(e), D(this));
  }, y.prototype.render = m, a = [], s = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, b.__r = 0, u = 0;
  var L,
      W = [],
      V = i.__b,
      F = i.__r,
      z = i.diffed,
      B = i.__c,
      j = i.unmount;

  function G() {
    W.forEach(function (e) {
      if (e.__P) try {
        e.__H.__h.forEach(Y), e.__H.__h.forEach(Z), e.__H.__h = [];
      } catch (t) {
        ;
        e.__H.__h = [], i.__e(t, e.__v);
      }
    }), W = [];
  }

  ;
  i.__b = function (e) {
    V && V(e);
  }, i.__r = function (e) {
    F && F(e);
    var t = e.__c.__H;
    t && (t.__h.forEach(Y), t.__h.forEach(Z), t.__h = []);
  }, i.diffed = function (e) {
    z && z(e);
    var t = e.__c;
    t && t.__H && t.__H.__h.length && (1 !== W.push(t) && L === i.requestAnimationFrame || ((L = i.requestAnimationFrame) || function (e) {
      var t,
          n = function n() {
        clearTimeout(r), q && cancelAnimationFrame(t), setTimeout(e);
      },
          r = setTimeout(n, 100);

      q && (t = requestAnimationFrame(n));
    })(G));
  }, i.__c = function (e, t) {
    t.some(function (e) {
      try {
        e.__h.forEach(Y), e.__h = e.__h.filter(function (e) {
          return !e.__ || Z(e);
        });
      } catch (n) {
        t.some(function (e) {
          e.__h && (e.__h = []);
        }), t = [], i.__e(n, e.__v);
      }
    }), B && B(e, t);
  }, i.unmount = function (e) {
    j && j(e);
    var t = e.__c;
    if (t && t.__H) try {
      t.__H.__.forEach(Y);
    } catch (e) {
      i.__e(e, t.__v);
    }
  };
  var q = "function" == typeof requestAnimationFrame;

  function Y(e) {
    "function" == typeof e.__c && e.__c();
  }

  function Z(e) {
    e.__c = e.__();
  }

  function X(e, t) {
    for (var n in e) {
      if ("__source" !== n && !(n in t)) return !0;
    }

    for (var r in t) {
      if ("__source" !== r && e[r] !== t[r]) return !0;
    }

    return !1;
  }

  function K(e) {
    this.props = e;
  }

  ;
  (K.prototype = new y()).isPureReactComponent = !0, K.prototype.shouldComponentUpdate = function (e, t) {
    return X(this.props, e) || X(this.state, t);
  };
  var $ = i.__b;

  i.__b = function (e) {
    e.type && e.type.__f && e.ref && (e.props.ref = e.ref, e.ref = null), $ && $(e);
  };

  var J = i.__e;

  i.__e = function (e, t, n) {
    if (e.then) for (var r, o = t; o = o.__;) {
      if ((r = o.__c) && r.__c) return null == t.__e && (t.__e = n.__e, t.__k = n.__k), r.__c(e, t);
    }
    J(e, t, n);
  };

  var Q = i.unmount;

  function ee() {
    ;
    this.__u = 0, this.t = null, this.__b = null;
  }

  function te(e) {
    var t = e.__.__c;
    return t && t.__e && t.__e(e);
  }

  function ne() {
    ;
    this.u = null, this.o = null;
  }

  ;
  i.unmount = function (e) {
    var t = e.__c;
    t && t.__R && t.__R(), t && !0 === e.__h && (e.type = null), Q && Q(e);
  }, (ee.prototype = new y()).__c = function (e, t) {
    var n = t.__c,
        r = this;
    null == r.t && (r.t = []), r.t.push(n);

    var o = te(r.__v),
        i = !1,
        a = function a() {
      i || (i = !0, n.__R = null, o ? o(s) : s());
    };

    n.__R = a;

    var s = function s() {
      if (! --r.__u) {
        if (r.state.__e) {
          var e = r.state.__e;

          r.__v.__k[0] = function e(t, n, r) {
            return t && (t.__v = null, t.__k = t.__k && t.__k.map(function (t) {
              return e(t, n, r);
            }), t.__c && t.__c.__P === n && (t.__e && r.insertBefore(t.__e, t.__d), t.__c.__e = !0, t.__c.__P = r)), t;
          }(e, e.__c.__P, e.__c.__O);
        }

        var t;

        for (r.setState({
          __e: r.__b = null
        }); t = r.t.pop();) {
          t.forceUpdate();
        }
      }
    },
        l = !0 === t.__h;

    r.__u++ || l || r.setState({
      __e: r.__b = r.__v.__k[0]
    }), e.then(a, a);
  }, ee.prototype.componentWillUnmount = function () {
    this.t = [];
  }, ee.prototype.render = function (e, t) {
    if (this.__b) {
      if (this.__v.__k) {
        var n = document.createElement("div"),
            r = this.__v.__k[0].__c;

        this.__v.__k[0] = function e(t, n, r) {
          return t && (t.__c && t.__c.__H && (t.__c.__H.__.forEach(function (e) {
            "function" == typeof e.__c && e.__c();
          }), t.__c.__H = null), null != (t = function (e, t) {
            for (var n in t) {
              e[n] = t[n];
            }

            return e;
          }({}, t)).__c && (t.__c.__P === r && (t.__c.__P = n), t.__c = null), t.__k = t.__k && t.__k.map(function (t) {
            return e(t, n, r);
          })), t;
        }(this.__b, n, r.__O = r.__P);
      }

      this.__b = null;
    }

    var o = t.__e && v(m, null, e.fallback);
    return o && (o.__h = null), [v(m, null, t.__e ? null : e.children), o];
  };

  var re = function re(e, t, n) {
    if (++n[1] === n[0] && e.o["delete"](t), e.props.revealOrder && ("t" !== e.props.revealOrder[0] || !e.o.size)) for (n = e.u; n;) {
      for (; n.length > 3;) {
        n.pop()();
      }

      if (n[1] < n[0]) break;
      e.u = n = n[2];
    }
  };

  function oe(e) {
    return this.getChildContext = function () {
      return e.context;
    }, e.children;
  }

  function ie(e) {
    var t = this,
        n = e.i;
    t.componentWillUnmount = function () {
      U(null, t.l), t.l = null, t.i = null;
    }, t.i && t.i !== n && t.componentWillUnmount(), e.__v ? (t.l || (t.i = n, t.l = {
      nodeType: 1,
      parentNode: n,
      childNodes: [],
      appendChild: function appendChild(e) {
        this.childNodes.push(e), t.i.appendChild(e);
      },
      insertBefore: function insertBefore(e, n) {
        this.childNodes.push(e), t.i.appendChild(e);
      },
      removeChild: function removeChild(e) {
        this.childNodes.splice(this.childNodes.indexOf(e) >>> 1, 1), t.i.removeChild(e);
      }
    }), U(v(oe, {
      context: t.context
    }, e.__v), t.l)) : t.l && t.componentWillUnmount();
  }

  ;
  (ne.prototype = new y()).__e = function (e) {
    var t = this,
        n = te(t.__v),
        r = t.o.get(e);
    return r[0]++, function (o) {
      var i = function i() {
        t.props.revealOrder ? (r.push(o), re(t, e, r)) : o();
      };

      n ? n(i) : i();
    };
  }, ne.prototype.render = function (e) {
    ;
    this.u = null, this.o = new Map();
    var t = R(e.children);
    e.revealOrder && "b" === e.revealOrder[0] && t.reverse();

    for (var n = t.length; n--;) {
      this.o.set(t[n], this.u = [1, 0, this.u]);
    }

    return e.children;
  }, ne.prototype.componentDidUpdate = ne.prototype.componentDidMount = function () {
    var e = this;
    this.o.forEach(function (t, n) {
      re(e, n, t);
    });
  };

  var ae = "undefined" != typeof Symbol && Symbol["for"] && Symbol["for"]("react.element") || 60103,
      se = /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|fill|flood|font|glyph(?!R)|horiz|marker(?!H|W|U)|overline|paint|stop|strikethrough|stroke|text(?!L)|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/,
      le = function le(e) {
    return ("undefined" != typeof Symbol && "symbol" == _typeof(Symbol()) ? /fil|che|rad/i : /fil|che|ra/i).test(e);
  };

  y.prototype.isReactComponent = {}, ["componentWillMount", "componentWillReceiveProps", "componentWillUpdate"].forEach(function (e) {
    Object.defineProperty(y.prototype, e, {
      configurable: !0,
      get: function get() {
        return this["UNSAFE_" + e];
      },
      set: function set(t) {
        Object.defineProperty(this, e, {
          configurable: !0,
          writable: !0,
          value: t
        });
      }
    });
  });
  var ue = i.event;

  function ce() {}

  function de() {
    return this.cancelBubble;
  }

  function pe() {
    return this.defaultPrevented;
  }

  i.event = function (e) {
    return ue && (e = ue(e)), e.persist = ce, e.isPropagationStopped = de, e.isDefaultPrevented = pe, e.nativeEvent = e;
  };

  var fe = {
    configurable: !0,
    get: function get() {
      return this["class"];
    }
  },
      he = i.vnode;

  i.vnode = function (e) {
    var t = e.type,
        n = e.props,
        r = n;

    if ("string" == typeof t) {
      for (var o in r = {}, n) {
        var i = n[o];
        "value" === o && "defaultValue" in n && null == i || ("defaultValue" === o && "value" in n && null == n.value ? o = "value" : "download" === o && !0 === i ? i = "" : /ondoubleclick/i.test(o) ? o = "ondblclick" : /^onchange(textarea|input)/i.test(o + t) && !le(n.type) ? o = "oninput" : /^on(Ani|Tra|Tou|BeforeInp)/.test(o) ? o = o.toLowerCase() : se.test(o) ? o = o.replace(/[A-Z0-9]/, "-$&").toLowerCase() : null === i && (i = void 0), r[o] = i);
      }

      "select" == t && r.multiple && Array.isArray(r.value) && (r.value = R(n.children).forEach(function (e) {
        e.props.selected = -1 != r.value.indexOf(e.props.value);
      })), "select" == t && null != r.defaultValue && (r.value = R(n.children).forEach(function (e) {
        e.props.selected = r.multiple ? -1 != r.defaultValue.indexOf(e.props.value) : r.defaultValue == e.props.value;
      })), e.props = r;
    }

    t && n["class"] != n.className && (fe.enumerable = "className" in n, null != n.className && (r["class"] = n.className), Object.defineProperty(r, "className", fe)), e.$$typeof = ae, he && he(e);
  };

  var ve = i.__r;
  i.__r = function (e) {
    ve && ve(e);
  }, "object" == (typeof performance === "undefined" ? "undefined" : _typeof(performance)) && "function" == typeof performance.now && performance.now.bind(performance);
  var ge = "undefined" != typeof globalThis ? globalThis : window;
  ge.FullCalendarVDom ? console.warn("FullCalendar VDOM already loaded") : ge.FullCalendarVDom = {
    Component: y,
    createElement: v,
    render: U,
    createRef: function createRef() {
      return {
        current: null
      };
    },
    Fragment: m,
    createContext: function createContext(e) {
      var t = function (e, t) {
        var n = {
          __c: t = "__cC" + u++,
          __: e,
          Consumer: function Consumer(e, t) {
            return e.children(t);
          },
          Provider: function Provider(e) {
            var n, r;
            return this.getChildContext || (n = [], (r = {})[t] = this, this.getChildContext = function () {
              return r;
            }, this.shouldComponentUpdate = function (e) {
              this.props.value !== e.value && n.some(D);
            }, this.sub = function (e) {
              n.push(e);
              var t = e.componentWillUnmount;

              e.componentWillUnmount = function () {
                n.splice(n.indexOf(e), 1), t && t.call(e);
              };
            }), e.children;
          }
        };
        return n.Provider.__ = n.Consumer.contextType = n;
      }(e),
          n = t.Provider;

      return t.Provider = function () {
        var e = this,
            t = !this.getChildContext,
            r = n.apply(this, arguments);

        if (t) {
          var o = [];
          this.shouldComponentUpdate = function (t) {
            e.props.value !== t.value && o.forEach(function (e) {
              ;
              e.context = t.value, e.forceUpdate();
            });
          }, this.sub = function (e) {
            o.push(e);
            var t = e.componentWillUnmount;

            e.componentWillUnmount = function () {
              o.splice(o.indexOf(e), 1), t && t.call(e);
            };
          };
        }

        return r;
      }, t;
    },
    createPortal: function createPortal(e, t) {
      return v(ie, {
        __v: e,
        i: t
      });
    },
    flushToDom: function flushToDom() {
      var e = i.debounceRendering,
          t = [];

      function n(e) {
        t.push(e);
      }

      ;
      i.debounceRendering = n, U(v(me, {}), document.createElement("div"));

      for (; t.length;) {
        t.shift()();
      }

      i.debounceRendering = e;
    },
    unmountComponentAtNode: function unmountComponentAtNode(e) {
      U(null, e);
    }
  };

  var me = function (e) {
    function t() {
      return null !== e && e.apply(this, arguments) || this;
    }

    return n(t, e), t.prototype.render = function () {
      return v("div", {});
    }, t.prototype.componentDidMount = function () {
      this.setState({});
    }, t;
  }(y);

  var ye = function () {
    function e(e, t) {
      ;
      this.context = e, this.internalEventSource = t;
    }

    return e.prototype.remove = function () {
      this.context.dispatch({
        type: "REMOVE_EVENT_SOURCE",
        sourceId: this.internalEventSource.sourceId
      });
    }, e.prototype.refetch = function () {
      this.context.dispatch({
        type: "FETCH_EVENT_SOURCES",
        sourceIds: [this.internalEventSource.sourceId],
        isRefetch: !0
      });
    }, Object.defineProperty(e.prototype, "id", {
      get: function get() {
        return this.internalEventSource.publicId;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "url", {
      get: function get() {
        return this.internalEventSource.meta.url;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "format", {
      get: function get() {
        return this.internalEventSource.meta.format;
      },
      enumerable: !1,
      configurable: !0
    }), e;
  }();

  function Ee(e) {
    e.parentNode && e.parentNode.removeChild(e);
  }

  function Se(e, t) {
    if (e.closest) return e.closest(t);
    if (!document.documentElement.contains(e)) return null;

    do {
      if (De(e, t)) return e;
      e = e.parentElement || e.parentNode;
    } while (null !== e && 1 === e.nodeType);

    return null;
  }

  function De(e, t) {
    return (e.matches || e.matchesSelector || e.msMatchesSelector).call(e, t);
  }

  function be(e, t) {
    for (var n = e instanceof HTMLElement ? [e] : e, r = [], o = 0; o < n.length; o += 1) {
      for (var i = n[o].querySelectorAll(t), a = 0; a < i.length; a += 1) {
        r.push(i[a]);
      }
    }

    return r;
  }

  var Ce = /(top|left|right|bottom|width|height)$/i;

  function we(e, t) {
    for (var n in t) {
      Re(e, n, t[n]);
    }
  }

  function Re(e, t, n) {
    null == n ? e.style[t] = "" : "number" == typeof n && Ce.test(t) ? e.style[t] = n + "px" : e.style[t] = n;
  }

  function _e(e) {
    var t, n;
    return null !== (n = null === (t = e.composedPath) || void 0 === t ? void 0 : t.call(e)[0]) && void 0 !== n ? n : e.target;
  }

  function Te(e) {
    e.preventDefault();
  }

  function ke(e, t) {
    return function (n) {
      var r = Se(n.target, e);
      r && t.call(r, n, r);
    };
  }

  function xe(e, t, n, r) {
    var o = ke(n, r);
    return e.addEventListener(t, o), function () {
      e.removeEventListener(t, o);
    };
  }

  var Me = ["webkitTransitionEnd", "otransitionend", "oTransitionEnd", "msTransitionEnd", "transitionend"];

  function Pe(e, t) {
    var n = function n(r) {
      t(r), Me.forEach(function (t) {
        e.removeEventListener(t, n);
      });
    };

    Me.forEach(function (t) {
      e.addEventListener(t, n);
    });
  }

  var Ie = 0;

  function Ne() {
    return String(Ie += 1);
  }

  function He() {
    document.body.classList.add("fc-not-allowed");
  }

  function Oe() {
    document.body.classList.remove("fc-not-allowed");
  }

  function Ae(e) {
    e.classList.add("fc-unselectable"), e.addEventListener("selectstart", Te);
  }

  function Ue(e) {
    e.classList.remove("fc-unselectable"), e.removeEventListener("selectstart", Te);
  }

  function Le(e) {
    e.addEventListener("contextmenu", Te);
  }

  function We(e) {
    e.removeEventListener("contextmenu", Te);
  }

  function Ve(e) {
    var t,
        n,
        r = [],
        o = [];

    for ("string" == typeof e ? o = e.split(/\s*,\s*/) : "function" == typeof e ? o = [e] : Array.isArray(e) && (o = e), t = 0; t < o.length; t += 1) {
      "string" == typeof (n = o[t]) ? r.push("-" === n.charAt(0) ? {
        field: n.substring(1),
        order: -1
      } : {
        field: n,
        order: 1
      }) : "function" == typeof n && r.push({
        func: n
      });
    }

    return r;
  }

  function Fe(e, t, n) {
    var r, o;

    for (r = 0; r < n.length; r += 1) {
      if (o = ze(e, t, n[r])) return o;
    }

    return 0;
  }

  function ze(e, t, n) {
    return n.func ? n.func(e, t) : Be(e[n.field], t[n.field]) * (n.order || 1);
  }

  function Be(e, t) {
    return e || t ? null == t ? -1 : null == e ? 1 : "string" == typeof e || "string" == typeof t ? String(e).localeCompare(String(t)) : e - t : 0;
  }

  function je(e, t) {
    var n = String(e);
    return "000".substr(0, t - n.length) + n;
  }

  function Ge(e, t) {
    return e - t;
  }

  function qe(e) {
    return e % 1 == 0;
  }

  function Ye(e) {
    var t = e.querySelector(".fc-scrollgrid-shrink-frame"),
        n = e.querySelector(".fc-scrollgrid-shrink-cushion");
    if (!t) throw new Error("needs fc-scrollgrid-shrink-frame className");
    if (!n) throw new Error("needs fc-scrollgrid-shrink-cushion className");
    return e.getBoundingClientRect().width - t.getBoundingClientRect().width + n.getBoundingClientRect().width;
  }

  var Ze = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

  function Xe(e, t) {
    var n = lt(e);
    return n[2] += 7 * t, ut(n);
  }

  function Ke(e, t) {
    var n = lt(e);
    return n[2] += t, ut(n);
  }

  function $e(e, t) {
    var n = lt(e);
    return n[6] += t, ut(n);
  }

  function Je(e, t) {
    return Qe(e, t) / 7;
  }

  function Qe(e, t) {
    return (t.valueOf() - e.valueOf()) / 864e5;
  }

  function et(e, t) {
    var n = rt(e),
        r = rt(t);
    return {
      years: 0,
      months: 0,
      days: Math.round(Qe(n, r)),
      milliseconds: t.valueOf() - r.valueOf() - (e.valueOf() - n.valueOf())
    };
  }

  function tt(e, t) {
    var n = nt(e, t);
    return null !== n && n % 7 == 0 ? n / 7 : null;
  }

  function nt(e, t) {
    return dt(e) === dt(t) ? Math.round(Qe(e, t)) : null;
  }

  function rt(e) {
    return ut([e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate()]);
  }

  function ot(e, t, n, r) {
    var o = ut([t, 0, 1 + it(t, n, r)]),
        i = rt(e),
        a = Math.round(Qe(o, i));
    return Math.floor(a / 7) + 1;
  }

  function it(e, t, n) {
    var r = 7 + t - n;
    return -((7 + ut([e, 0, r]).getUTCDay() - t) % 7) + r - 1;
  }

  function at(e) {
    return [e.getFullYear(), e.getMonth(), e.getDate(), e.getHours(), e.getMinutes(), e.getSeconds(), e.getMilliseconds()];
  }

  function st(e) {
    return new Date(e[0], e[1] || 0, null == e[2] ? 1 : e[2], e[3] || 0, e[4] || 0, e[5] || 0);
  }

  function lt(e) {
    return [e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate(), e.getUTCHours(), e.getUTCMinutes(), e.getUTCSeconds(), e.getUTCMilliseconds()];
  }

  function ut(e) {
    return 1 === e.length && (e = e.concat([0])), new Date(Date.UTC.apply(Date, e));
  }

  function ct(e) {
    return !isNaN(e.valueOf());
  }

  function dt(e) {
    return 1e3 * e.getUTCHours() * 60 * 60 + 1e3 * e.getUTCMinutes() * 60 + 1e3 * e.getUTCSeconds() + e.getUTCMilliseconds();
  }

  function pt(e, t, n, r) {
    return {
      instanceId: Ne(),
      defId: e,
      range: t,
      forcedStartTzo: null == n ? null : n,
      forcedEndTzo: null == r ? null : r
    };
  }

  var ft = Object.prototype.hasOwnProperty;

  function ht(e, t) {
    var n = {};
    if (t) for (var r in t) {
      for (var o = [], i = e.length - 1; i >= 0; i -= 1) {
        var a = e[i][r];
        if ("object" == _typeof(a) && a) o.unshift(a);else if (void 0 !== a) {
          n[r] = a;
          break;
        }
      }

      o.length && (n[r] = ht(o));
    }

    for (i = e.length - 1; i >= 0; i -= 1) {
      var s = e[i];

      for (var l in s) {
        l in n || (n[l] = s[l]);
      }
    }

    return n;
  }

  function vt(e, t) {
    var n = {};

    for (var r in e) {
      t(e[r], r) && (n[r] = e[r]);
    }

    return n;
  }

  function gt(e, t) {
    var n = {};

    for (var r in e) {
      n[r] = t(e[r], r);
    }

    return n;
  }

  function mt(e) {
    for (var t = {}, n = 0, r = e; n < r.length; n++) {
      t[r[n]] = !0;
    }

    return t;
  }

  function yt(e) {
    var t = [];

    for (var n in e) {
      t.push(e[n]);
    }

    return t;
  }

  function Et(e, t) {
    if (e === t) return !0;

    for (var n in e) {
      if (ft.call(e, n) && !(n in t)) return !1;
    }

    for (var n in t) {
      if (ft.call(t, n) && e[n] !== t[n]) return !1;
    }

    return !0;
  }

  function St(e, t) {
    var n = [];

    for (var r in e) {
      ft.call(e, r) && (r in t || n.push(r));
    }

    for (var r in t) {
      ft.call(t, r) && e[r] !== t[r] && n.push(r);
    }

    return n;
  }

  function Dt(e, t, n) {
    if (void 0 === n && (n = {}), e === t) return !0;

    for (var r in t) {
      if (!(r in e) || !bt(e[r], t[r], n[r])) return !1;
    }

    for (var r in e) {
      if (!(r in t)) return !1;
    }

    return !0;
  }

  function bt(e, t, n) {
    return e === t || !0 === n || !!n && n(e, t);
  }

  function Ct(e, t, n, r) {
    void 0 === t && (t = 0), void 0 === r && (r = 1);
    var o = [];
    null == n && (n = Object.keys(e).length);

    for (var i = t; i < n; i += r) {
      var a = e[i];
      void 0 !== a && o.push(a);
    }

    return o;
  }

  function wt(e, t, n) {
    var r = n.dateEnv,
        o = n.pluginHooks,
        i = n.options,
        a = e.defs,
        s = e.instances;

    for (var l in s = vt(s, function (e) {
      return !a[e.defId].recurringDef;
    }), a) {
      var u = a[l];

      if (u.recurringDef) {
        var c = u.recurringDef.duration;
        c || (c = u.allDay ? i.defaultAllDayEventDuration : i.defaultTimedEventDuration);

        for (var d = 0, p = Rt(u, c, t, r, o.recurringTypes); d < p.length; d++) {
          var f = p[d],
              h = pt(l, {
            start: f,
            end: r.add(f, c)
          });
          s[h.instanceId] = h;
        }
      }
    }

    return {
      defs: a,
      instances: s
    };
  }

  function Rt(e, t, n, r, o) {
    var i = o[e.recurringDef.typeId].expand(e.recurringDef.typeData, {
      start: r.subtract(n.start, t),
      end: n.end
    }, r);
    return e.allDay && (i = i.map(rt)), i;
  }

  var _t = ["years", "months", "days", "milliseconds"],
      Tt = /^(-?)(?:(\d+)\.)?(\d+):(\d\d)(?::(\d\d)(?:\.(\d\d\d))?)?/;

  function kt(e, t) {
    var n;
    return "string" == typeof e ? function (e) {
      var t = Tt.exec(e);

      if (t) {
        var n = t[1] ? -1 : 1;
        return {
          years: 0,
          months: 0,
          days: n * (t[2] ? parseInt(t[2], 10) : 0),
          milliseconds: n * (60 * (t[3] ? parseInt(t[3], 10) : 0) * 60 * 1e3 + 60 * (t[4] ? parseInt(t[4], 10) : 0) * 1e3 + 1e3 * (t[5] ? parseInt(t[5], 10) : 0) + (t[6] ? parseInt(t[6], 10) : 0))
        };
      }

      return null;
    }(e) : "object" == _typeof(e) && e ? xt(e) : "number" == typeof e ? xt(((n = {})[t || "milliseconds"] = e, n)) : null;
  }

  function xt(e) {
    var t = {
      years: e.years || e.year || 0,
      months: e.months || e.month || 0,
      days: e.days || e.day || 0,
      milliseconds: 60 * (e.hours || e.hour || 0) * 60 * 1e3 + 60 * (e.minutes || e.minute || 0) * 1e3 + 1e3 * (e.seconds || e.second || 0) + (e.milliseconds || e.millisecond || e.ms || 0)
    },
        n = e.weeks || e.week;
    return n && (t.days += 7 * n, t.specifiedWeeks = !0), t;
  }

  function Mt(e, t) {
    return {
      years: e.years + t.years,
      months: e.months + t.months,
      days: e.days + t.days,
      milliseconds: e.milliseconds + t.milliseconds
    };
  }

  function Pt(e, t) {
    return {
      years: e.years * t,
      months: e.months * t,
      days: e.days * t,
      milliseconds: e.milliseconds * t
    };
  }

  function It(e) {
    return Nt(e) / 864e5;
  }

  function Nt(e) {
    return 31536e6 * e.years + 2592e6 * e.months + 864e5 * e.days + e.milliseconds;
  }

  function Ht(e, t) {
    for (var n = null, r = 0; r < _t.length; r += 1) {
      var o = _t[r];

      if (t[o]) {
        var i = e[o] / t[o];
        if (!qe(i) || null !== n && n !== i) return null;
        n = i;
      } else if (e[o]) return null;
    }

    return n;
  }

  function Ot(e) {
    var t = e.milliseconds;

    if (t) {
      if (t % 1e3 != 0) return {
        unit: "millisecond",
        value: t
      };
      if (t % 6e4 != 0) return {
        unit: "second",
        value: t / 1e3
      };
      if (t % 36e5 != 0) return {
        unit: "minute",
        value: t / 6e4
      };
      if (t) return {
        unit: "hour",
        value: t / 36e5
      };
    }

    return e.days ? e.specifiedWeeks && e.days % 7 == 0 ? {
      unit: "week",
      value: e.days / 7
    } : {
      unit: "day",
      value: e.days
    } : e.months ? {
      unit: "month",
      value: e.months
    } : e.years ? {
      unit: "year",
      value: e.years
    } : {
      unit: "millisecond",
      value: 0
    };
  }

  function At(e, t, n) {
    void 0 === n && (n = !1);
    var r = e.toISOString();
    return r = r.replace(".000", ""), n && (r = r.replace("T00:00:00Z", "")), r.length > 10 && (null == t ? r = r.replace("Z", "") : 0 !== t && (r = r.replace("Z", Wt(t, !0)))), r;
  }

  function Ut(e) {
    return e.toISOString().replace(/T.*$/, "");
  }

  function Lt(e) {
    return je(e.getUTCHours(), 2) + ":" + je(e.getUTCMinutes(), 2) + ":" + je(e.getUTCSeconds(), 2);
  }

  function Wt(e, t) {
    void 0 === t && (t = !1);
    var n = e < 0 ? "-" : "+",
        r = Math.abs(e),
        o = Math.floor(r / 60),
        i = Math.round(r % 60);
    return t ? n + je(o, 2) + ":" + je(i, 2) : "GMT" + n + o + (i ? ":" + je(i, 2) : "");
  }

  function Vt(e, t, n) {
    if (e === t) return !0;
    var r,
        o = e.length;
    if (o !== t.length) return !1;

    for (r = 0; r < o; r += 1) {
      if (!(n ? n(e[r], t[r]) : e[r] === t[r])) return !1;
    }

    return !0;
  }

  function Ft(e, t, n) {
    var r, o;
    return function () {
      for (var i = [], a = 0; a < arguments.length; a++) {
        i[a] = arguments[a];
      }

      if (r) {
        if (!Vt(r, i)) {
          n && n(o);
          var s = e.apply(this, i);
          t && t(s, o) || (o = s);
        }
      } else o = e.apply(this, i);

      return r = i, o;
    };
  }

  function zt(e, t, n) {
    var r,
        o,
        i = this;
    return function (a) {
      if (r) {
        if (!Et(r, a)) {
          n && n(o);
          var s = e.call(i, a);
          t && t(s, o) || (o = s);
        }
      } else o = e.call(i, a);

      return r = a, o;
    };
  }

  var Bt = {
    week: 3,
    separator: 0,
    omitZeroMinute: 0,
    meridiem: 0,
    omitCommas: 0
  },
      jt = {
    timeZoneName: 7,
    era: 6,
    year: 5,
    month: 4,
    day: 2,
    weekday: 2,
    hour: 1,
    minute: 1,
    second: 1
  },
      Gt = /\s*([ap])\.?m\.?/i,
      qt = /,/g,
      Yt = /\s+/g,
      Zt = /\u200e/g,
      Xt = /UTC|GMT/,
      Kt = function () {
    function e(e) {
      var t = {},
          n = {},
          r = 0;

      for (var o in e) {
        o in Bt ? (n[o] = e[o], r = Math.max(Bt[o], r)) : (t[o] = e[o], o in jt && (r = Math.max(jt[o], r)));
      }

      this.standardDateProps = t, this.extendedSettings = n, this.severity = r, this.buildFormattingFunc = Ft($t);
    }

    return e.prototype.format = function (e, t) {
      return this.buildFormattingFunc(this.standardDateProps, this.extendedSettings, t)(e);
    }, e.prototype.formatRange = function (e, t, n, r) {
      var o = this.standardDateProps,
          i = this.extendedSettings,
          a = function (e, t, n) {
        if (n.getMarkerYear(e) !== n.getMarkerYear(t)) return 5;
        if (n.getMarkerMonth(e) !== n.getMarkerMonth(t)) return 4;
        if (n.getMarkerDay(e) !== n.getMarkerDay(t)) return 2;
        if (dt(e) !== dt(t)) return 1;
        return 0;
      }(e.marker, t.marker, n.calendarSystem);

      if (!a) return this.format(e, n);
      var s = a;
      !(s > 1) || "numeric" !== o.year && "2-digit" !== o.year || "numeric" !== o.month && "2-digit" !== o.month || "numeric" !== o.day && "2-digit" !== o.day || (s = 1);
      var l = this.format(e, n),
          u = this.format(t, n);
      if (l === u) return l;

      var c = $t(function (e, t) {
        var n = {};

        for (var r in e) {
          (!(r in jt) || jt[r] <= t) && (n[r] = e[r]);
        }

        return n;
      }(o, s), i, n),
          d = c(e),
          p = c(t),
          f = function (e, t, n, r) {
        var o = 0;

        for (; o < e.length;) {
          var i = e.indexOf(t, o);
          if (-1 === i) break;
          var a = e.substr(0, i);
          o = i + t.length;

          for (var s = e.substr(o), l = 0; l < n.length;) {
            var u = n.indexOf(r, l);
            if (-1 === u) break;
            var c = n.substr(0, u);
            l = u + r.length;
            var d = n.substr(l);
            if (a === c && s === d) return {
              before: a,
              after: s
            };
          }
        }

        return null;
      }(l, d, u, p),
          h = i.separator || r || n.defaultSeparator || "";

      return f ? f.before + d + h + p + f.after : l + h + u;
    }, e.prototype.getLargestUnit = function () {
      switch (this.severity) {
        case 7:
        case 6:
        case 5:
          return "year";

        case 4:
          return "month";

        case 3:
          return "week";

        case 2:
          return "day";

        default:
          return "time";
      }
    }, e;
  }();

  function $t(e, t, n) {
    var o = Object.keys(e).length;
    return 1 === o && "short" === e.timeZoneName ? function (e) {
      return Wt(e.timeZoneOffset);
    } : 0 === o && t.week ? function (e) {
      return function (e, t, n, r) {
        var o = [];
        "narrow" === r ? o.push(t) : "short" === r && o.push(t, " ");
        o.push(n.simpleNumberFormat.format(e)), "rtl" === n.options.direction && o.reverse();
        return o.join("");
      }(n.computeWeekNumber(e.marker), n.weekText, n.locale, t.week);
    } : function (e, t, n) {
      ;
      e = _r2({}, e), t = _r2({}, t), function (e, t) {
        e.timeZoneName && (e.hour || (e.hour = "2-digit"), e.minute || (e.minute = "2-digit"));
        "long" === e.timeZoneName && (e.timeZoneName = "short");
        t.omitZeroMinute && (e.second || e.millisecond) && delete t.omitZeroMinute;
      }(e, t), e.timeZone = "UTC";
      var o,
          i = new Intl.DateTimeFormat(n.locale.codes, e);

      if (t.omitZeroMinute) {
        var a = _r2({}, e);

        delete a.minute, o = new Intl.DateTimeFormat(n.locale.codes, a);
      }

      return function (r) {
        var a = r.marker;
        return function (e, t, n, r, o) {
          ;
          e = e.replace(Zt, ""), "short" === n.timeZoneName && (e = function (e, t) {
            var n = !1;
            e = e.replace(Xt, function () {
              return n = !0, t;
            }), n || (e += " " + t);
            return e;
          }(e, "UTC" === o.timeZone || null == t.timeZoneOffset ? "UTC" : Wt(t.timeZoneOffset)));
          r.omitCommas && (e = e.replace(qt, "").trim());
          r.omitZeroMinute && (e = e.replace(":00", ""));
          !1 === r.meridiem ? e = e.replace(Gt, "").trim() : "narrow" === r.meridiem ? e = e.replace(Gt, function (e, t) {
            return t.toLocaleLowerCase();
          }) : "short" === r.meridiem ? e = e.replace(Gt, function (e, t) {
            return t.toLocaleLowerCase() + "m";
          }) : "lowercase" === r.meridiem && (e = e.replace(Gt, function (e) {
            return e.toLocaleLowerCase();
          }));
          return e = (e = e.replace(Yt, " ")).trim();
        }((o && !a.getUTCMinutes() ? o : i).format(a), r, e, t, n);
      };
    }(e, t, n);
  }

  function Jt(e, t) {
    var n = t.markerToArray(e.marker);
    return {
      marker: e.marker,
      timeZoneOffset: e.timeZoneOffset,
      array: n,
      year: n[0],
      month: n[1],
      day: n[2],
      hour: n[3],
      minute: n[4],
      second: n[5],
      millisecond: n[6]
    };
  }

  function Qt(e, t, n, r) {
    var o = Jt(e, n.calendarSystem);
    return {
      date: o,
      start: o,
      end: t ? Jt(t, n.calendarSystem) : null,
      timeZone: n.timeZone,
      localeCodes: n.locale.codes,
      defaultSeparator: r || n.defaultSeparator
    };
  }

  var en = function () {
    function e(e) {
      this.cmdStr = e;
    }

    return e.prototype.format = function (e, t, n) {
      return t.cmdFormatter(this.cmdStr, Qt(e, null, t, n));
    }, e.prototype.formatRange = function (e, t, n, r) {
      return n.cmdFormatter(this.cmdStr, Qt(e, t, n, r));
    }, e;
  }(),
      tn = function () {
    function e(e) {
      this.func = e;
    }

    return e.prototype.format = function (e, t, n) {
      return this.func(Qt(e, null, t, n));
    }, e.prototype.formatRange = function (e, t, n, r) {
      return this.func(Qt(e, t, n, r));
    }, e;
  }();

  function nn(e) {
    return "object" == _typeof(e) && e ? new Kt(e) : "string" == typeof e ? new en(e) : "function" == typeof e ? new tn(e) : null;
  }

  var rn = {
    navLinkDayClick: fn,
    navLinkWeekClick: fn,
    duration: kt,
    bootstrapFontAwesome: fn,
    buttonIcons: fn,
    customButtons: fn,
    defaultAllDayEventDuration: kt,
    defaultTimedEventDuration: kt,
    nextDayThreshold: kt,
    scrollTime: kt,
    scrollTimeReset: Boolean,
    slotMinTime: kt,
    slotMaxTime: kt,
    dayPopoverFormat: nn,
    slotDuration: kt,
    snapDuration: kt,
    headerToolbar: fn,
    footerToolbar: fn,
    defaultRangeSeparator: String,
    titleRangeSeparator: String,
    forceEventDuration: Boolean,
    dayHeaders: Boolean,
    dayHeaderFormat: nn,
    dayHeaderClassNames: fn,
    dayHeaderContent: fn,
    dayHeaderDidMount: fn,
    dayHeaderWillUnmount: fn,
    dayCellClassNames: fn,
    dayCellContent: fn,
    dayCellDidMount: fn,
    dayCellWillUnmount: fn,
    initialView: String,
    aspectRatio: Number,
    weekends: Boolean,
    weekNumberCalculation: fn,
    weekNumbers: Boolean,
    weekNumberClassNames: fn,
    weekNumberContent: fn,
    weekNumberDidMount: fn,
    weekNumberWillUnmount: fn,
    editable: Boolean,
    viewClassNames: fn,
    viewDidMount: fn,
    viewWillUnmount: fn,
    nowIndicator: Boolean,
    nowIndicatorClassNames: fn,
    nowIndicatorContent: fn,
    nowIndicatorDidMount: fn,
    nowIndicatorWillUnmount: fn,
    showNonCurrentDates: Boolean,
    lazyFetching: Boolean,
    startParam: String,
    endParam: String,
    timeZoneParam: String,
    timeZone: String,
    locales: fn,
    locale: fn,
    themeSystem: String,
    dragRevertDuration: Number,
    dragScroll: Boolean,
    allDayMaintainDuration: Boolean,
    unselectAuto: Boolean,
    dropAccept: fn,
    eventOrder: Ve,
    eventOrderStrict: Boolean,
    handleWindowResize: Boolean,
    windowResizeDelay: Number,
    longPressDelay: Number,
    eventDragMinDistance: Number,
    expandRows: Boolean,
    height: fn,
    contentHeight: fn,
    direction: String,
    weekNumberFormat: nn,
    eventResizableFromStart: Boolean,
    displayEventTime: Boolean,
    displayEventEnd: Boolean,
    weekText: String,
    progressiveEventRendering: Boolean,
    businessHours: fn,
    initialDate: fn,
    now: fn,
    eventDataTransform: fn,
    stickyHeaderDates: fn,
    stickyFooterScrollbar: fn,
    viewHeight: fn,
    defaultAllDay: Boolean,
    eventSourceFailure: fn,
    eventSourceSuccess: fn,
    eventDisplay: String,
    eventStartEditable: Boolean,
    eventDurationEditable: Boolean,
    eventOverlap: fn,
    eventConstraint: fn,
    eventAllow: fn,
    eventBackgroundColor: String,
    eventBorderColor: String,
    eventTextColor: String,
    eventColor: String,
    eventClassNames: fn,
    eventContent: fn,
    eventDidMount: fn,
    eventWillUnmount: fn,
    selectConstraint: fn,
    selectOverlap: fn,
    selectAllow: fn,
    droppable: Boolean,
    unselectCancel: String,
    slotLabelFormat: fn,
    slotLaneClassNames: fn,
    slotLaneContent: fn,
    slotLaneDidMount: fn,
    slotLaneWillUnmount: fn,
    slotLabelClassNames: fn,
    slotLabelContent: fn,
    slotLabelDidMount: fn,
    slotLabelWillUnmount: fn,
    dayMaxEvents: fn,
    dayMaxEventRows: fn,
    dayMinWidth: Number,
    slotLabelInterval: kt,
    allDayText: String,
    allDayClassNames: fn,
    allDayContent: fn,
    allDayDidMount: fn,
    allDayWillUnmount: fn,
    slotMinWidth: Number,
    navLinks: Boolean,
    eventTimeFormat: nn,
    rerenderDelay: Number,
    moreLinkText: fn,
    selectMinDistance: Number,
    selectable: Boolean,
    selectLongPressDelay: Number,
    eventLongPressDelay: Number,
    selectMirror: Boolean,
    eventMaxStack: Number,
    eventMinHeight: Number,
    eventMinWidth: Number,
    eventShortHeight: Number,
    slotEventOverlap: Boolean,
    plugins: fn,
    firstDay: Number,
    dayCount: Number,
    dateAlignment: String,
    dateIncrement: kt,
    hiddenDays: fn,
    monthMode: Boolean,
    fixedWeekCount: Boolean,
    validRange: fn,
    visibleRange: fn,
    titleFormat: fn,
    noEventsText: String,
    moreLinkClick: fn,
    moreLinkClassNames: fn,
    moreLinkContent: fn,
    moreLinkDidMount: fn,
    moreLinkWillUnmount: fn
  },
      on = {
    eventDisplay: "auto",
    defaultRangeSeparator: " - ",
    titleRangeSeparator: " – ",
    defaultTimedEventDuration: "01:00:00",
    defaultAllDayEventDuration: {
      day: 1
    },
    forceEventDuration: !1,
    nextDayThreshold: "00:00:00",
    dayHeaders: !0,
    initialView: "",
    aspectRatio: 1.35,
    headerToolbar: {
      start: "title",
      center: "",
      end: "today prev,next"
    },
    weekends: !0,
    weekNumbers: !1,
    weekNumberCalculation: "local",
    editable: !1,
    nowIndicator: !1,
    scrollTime: "06:00:00",
    scrollTimeReset: !0,
    slotMinTime: "00:00:00",
    slotMaxTime: "24:00:00",
    showNonCurrentDates: !0,
    lazyFetching: !0,
    startParam: "start",
    endParam: "end",
    timeZoneParam: "timeZone",
    timeZone: "local",
    locales: [],
    locale: "",
    themeSystem: "standard",
    dragRevertDuration: 500,
    dragScroll: !0,
    allDayMaintainDuration: !1,
    unselectAuto: !0,
    dropAccept: "*",
    eventOrder: "start,-duration,allDay,title",
    dayPopoverFormat: {
      month: "long",
      day: "numeric",
      year: "numeric"
    },
    handleWindowResize: !0,
    windowResizeDelay: 100,
    longPressDelay: 1e3,
    eventDragMinDistance: 5,
    expandRows: !1,
    navLinks: !1,
    selectable: !1,
    eventMinHeight: 15,
    eventMinWidth: 30,
    eventShortHeight: 30
  },
      an = {
    datesSet: fn,
    eventsSet: fn,
    eventAdd: fn,
    eventChange: fn,
    eventRemove: fn,
    windowResize: fn,
    eventClick: fn,
    eventMouseEnter: fn,
    eventMouseLeave: fn,
    select: fn,
    unselect: fn,
    loading: fn,
    _unmount: fn,
    _beforeprint: fn,
    _afterprint: fn,
    _noEventDrop: fn,
    _noEventResize: fn,
    _resize: fn,
    _scrollRequest: fn
  },
      sn = {
    buttonText: fn,
    views: fn,
    plugins: fn,
    initialEvents: fn,
    events: fn,
    eventSources: fn
  },
      ln = {
    headerToolbar: un,
    footerToolbar: un,
    buttonText: un,
    buttonIcons: un
  };

  function un(e, t) {
    return "object" == _typeof(e) && "object" == _typeof(t) && e && t ? Et(e, t) : e === t;
  }

  var cn = {
    type: String,
    component: fn,
    buttonText: String,
    buttonTextKey: String,
    dateProfileGeneratorClass: fn,
    usesMinMaxTime: Boolean,
    classNames: fn,
    content: fn,
    didMount: fn,
    willUnmount: fn
  };

  function dn(e) {
    return ht(e, ln);
  }

  function pn(e, t) {
    var n = {},
        r = {};

    for (var o in t) {
      o in e && (n[o] = t[o](e[o]));
    }

    for (var o in e) {
      o in t || (r[o] = e[o]);
    }

    return {
      refined: n,
      extra: r
    };
  }

  function fn(e) {
    return e;
  }

  function hn(e, t, n, r) {
    for (var o = {
      defs: {},
      instances: {}
    }, i = Pn(n), a = 0, s = e; a < s.length; a++) {
      var l = xn(s[a], t, n, r, i);
      l && vn(l, o);
    }

    return o;
  }

  function vn(e, t) {
    return void 0 === t && (t = {
      defs: {},
      instances: {}
    }), t.defs[e.def.defId] = e.def, e.instance && (t.instances[e.instance.instanceId] = e.instance), t;
  }

  function gn(e, t) {
    var n = e.instances[t];

    if (n) {
      var r = e.defs[n.defId],
          o = En(e, function (e) {
        return t = r, n = e, Boolean(t.groupId && t.groupId === n.groupId);
        var t, n;
      });
      return o.defs[r.defId] = r, o.instances[n.instanceId] = n, o;
    }

    return {
      defs: {},
      instances: {}
    };
  }

  function mn() {
    return {
      defs: {},
      instances: {}
    };
  }

  function yn(e, t) {
    return {
      defs: _r2(_r2({}, e.defs), t.defs),
      instances: _r2(_r2({}, e.instances), t.instances)
    };
  }

  function En(e, t) {
    var n = vt(e.defs, t),
        r = vt(e.instances, function (e) {
      return n[e.defId];
    });
    return {
      defs: n,
      instances: r
    };
  }

  function Sn(e) {
    return Array.isArray(e) ? e : "string" == typeof e ? e.split(/\s+/) : [];
  }

  var Dn = {
    display: String,
    editable: Boolean,
    startEditable: Boolean,
    durationEditable: Boolean,
    constraint: fn,
    overlap: fn,
    allow: fn,
    className: Sn,
    classNames: Sn,
    color: String,
    backgroundColor: String,
    borderColor: String,
    textColor: String
  },
      bn = {
    display: null,
    startEditable: null,
    durationEditable: null,
    constraints: [],
    overlap: null,
    allows: [],
    backgroundColor: "",
    borderColor: "",
    textColor: "",
    classNames: []
  };

  function Cn(e, t) {
    var n = function (e, t) {
      return Array.isArray(e) ? hn(e, null, t, !0) : "object" == _typeof(e) && e ? hn([e], null, t, !0) : null != e ? String(e) : null;
    }(e.constraint, t);

    return {
      display: e.display || null,
      startEditable: null != e.startEditable ? e.startEditable : e.editable,
      durationEditable: null != e.durationEditable ? e.durationEditable : e.editable,
      constraints: null != n ? [n] : [],
      overlap: null != e.overlap ? e.overlap : null,
      allows: null != e.allow ? [e.allow] : [],
      backgroundColor: e.backgroundColor || e.color || "",
      borderColor: e.borderColor || e.color || "",
      textColor: e.textColor || "",
      classNames: (e.className || []).concat(e.classNames || [])
    };
  }

  function wn(e) {
    return e.reduce(Rn, bn);
  }

  function Rn(e, t) {
    return {
      display: null != t.display ? t.display : e.display,
      startEditable: null != t.startEditable ? t.startEditable : e.startEditable,
      durationEditable: null != t.durationEditable ? t.durationEditable : e.durationEditable,
      constraints: e.constraints.concat(t.constraints),
      overlap: "boolean" == typeof t.overlap ? t.overlap : e.overlap,
      allows: e.allows.concat(t.allows),
      backgroundColor: t.backgroundColor || e.backgroundColor,
      borderColor: t.borderColor || e.borderColor,
      textColor: t.textColor || e.textColor,
      classNames: e.classNames.concat(t.classNames)
    };
  }

  var _n = {
    id: String,
    groupId: String,
    title: String,
    url: String
  },
      Tn = {
    start: fn,
    end: fn,
    date: fn,
    allDay: Boolean
  },
      kn = _r2(_r2(_r2({}, _n), Tn), {
    extendedProps: fn
  });

  function xn(e, t, n, r, o) {
    void 0 === o && (o = Pn(n));

    var i = Mn(e, n, o),
        a = i.refined,
        s = i.extra,
        l = function (e, t) {
      var n = null;
      e && (n = e.defaultAllDay);
      null == n && (n = t.options.defaultAllDay);
      return n;
    }(t, n),
        u = function (e, t, n, r) {
      for (var o = 0; o < r.length; o += 1) {
        var i = r[o].parse(e, n);

        if (i) {
          var a = e.allDay;
          return null == a && null == (a = t) && null == (a = i.allDayGuess) && (a = !1), {
            allDay: a,
            duration: i.duration,
            typeData: i.typeData,
            typeId: o
          };
        }
      }

      return null;
    }(a, l, n.dateEnv, n.pluginHooks.recurringTypes);

    if (u) return (c = In(a, s, t ? t.sourceId : "", u.allDay, Boolean(u.duration), n)).recurringDef = {
      typeId: u.typeId,
      typeData: u.typeData,
      duration: u.duration
    }, {
      def: c,
      instance: null
    };

    var c,
        d = function (e, t, n, r) {
      var o,
          i,
          a = e.allDay,
          s = null,
          l = !1,
          u = null,
          c = null != e.start ? e.start : e.date;
      if (o = n.dateEnv.createMarkerMeta(c)) s = o.marker;else if (!r) return null;
      null != e.end && (i = n.dateEnv.createMarkerMeta(e.end));
      null == a && (a = null != t ? t : (!o || o.isTimeUnspecified) && (!i || i.isTimeUnspecified));
      a && s && (s = rt(s));
      i && (u = i.marker, a && (u = rt(u)), s && u <= s && (u = null));
      u ? l = !0 : r || (l = n.options.forceEventDuration || !1, u = n.dateEnv.add(s, a ? n.options.defaultAllDayEventDuration : n.options.defaultTimedEventDuration));
      return {
        allDay: a,
        hasEnd: l,
        range: {
          start: s,
          end: u
        },
        forcedStartTzo: o ? o.forcedTzo : null,
        forcedEndTzo: i ? i.forcedTzo : null
      };
    }(a, l, n, r);

    return d ? {
      def: c = In(a, s, t ? t.sourceId : "", d.allDay, d.hasEnd, n),
      instance: pt(c.defId, d.range, d.forcedStartTzo, d.forcedEndTzo)
    } : null;
  }

  function Mn(e, t, n) {
    return void 0 === n && (n = Pn(t)), pn(e, n);
  }

  function Pn(e) {
    return _r2(_r2(_r2({}, Dn), kn), e.pluginHooks.eventRefiners);
  }

  function In(e, t, n, o, i, a) {
    for (var s = {
      title: e.title || "",
      groupId: e.groupId || "",
      publicId: e.id || "",
      url: e.url || "",
      recurringDef: null,
      defId: Ne(),
      sourceId: n,
      allDay: o,
      hasEnd: i,
      ui: Cn(e, a),
      extendedProps: _r2(_r2({}, e.extendedProps || {}), t)
    }, l = 0, u = a.pluginHooks.eventDefMemberAdders; l < u.length; l++) {
      var c = u[l];

      _r2(s, c(e));
    }

    return Object.freeze(s.ui.classNames), Object.freeze(s.extendedProps), s;
  }

  function Nn(e) {
    var t = Math.floor(Qe(e.start, e.end)) || 1,
        n = rt(e.start);
    return {
      start: n,
      end: Ke(n, t)
    };
  }

  function Hn(e, t) {
    void 0 === t && (t = kt(0));
    var n = null,
        r = null;

    if (e.end) {
      r = rt(e.end);
      var o = e.end.valueOf() - r.valueOf();
      o && o >= Nt(t) && (r = Ke(r, 1));
    }

    return e.start && (n = rt(e.start), r && r <= n && (r = Ke(n, 1))), {
      start: n,
      end: r
    };
  }

  function On(e) {
    var t = Hn(e);
    return Qe(t.start, t.end) > 1;
  }

  function An(e, t, n, r) {
    return "year" === r ? kt(n.diffWholeYears(e, t), "year") : "month" === r ? kt(n.diffWholeMonths(e, t), "month") : et(e, t);
  }

  function Un(e, t) {
    var n,
        r,
        o = [],
        i = t.start;

    for (e.sort(Ln), n = 0; n < e.length; n += 1) {
      (r = e[n]).start > i && o.push({
        start: i,
        end: r.start
      }), r.end > i && (i = r.end);
    }

    return i < t.end && o.push({
      start: i,
      end: t.end
    }), o;
  }

  function Ln(e, t) {
    return e.start.valueOf() - t.start.valueOf();
  }

  function Wn(e, t) {
    var n = e.start,
        r = e.end,
        o = null;
    return null !== t.start && (n = null === n ? t.start : new Date(Math.max(n.valueOf(), t.start.valueOf()))), null != t.end && (r = null === r ? t.end : new Date(Math.min(r.valueOf(), t.end.valueOf()))), (null === n || null === r || n < r) && (o = {
      start: n,
      end: r
    }), o;
  }

  function Vn(e, t) {
    return (null === e.start ? null : e.start.valueOf()) === (null === t.start ? null : t.start.valueOf()) && (null === e.end ? null : e.end.valueOf()) === (null === t.end ? null : t.end.valueOf());
  }

  function Fn(e, t) {
    return (null === e.end || null === t.start || e.end > t.start) && (null === e.start || null === t.end || e.start < t.end);
  }

  function zn(e, t) {
    return (null === e.start || null !== t.start && t.start >= e.start) && (null === e.end || null !== t.end && t.end <= e.end);
  }

  function Bn(e, t) {
    return (null === e.start || t >= e.start) && (null === e.end || t < e.end);
  }

  function jn(e, t, n, r) {
    var o = {},
        i = {},
        a = {},
        s = [],
        l = [],
        u = Zn(e.defs, t);

    for (var c in e.defs) {
      "inverse-background" === (f = u[(S = e.defs[c]).defId]).display && (S.groupId ? (o[S.groupId] = [], a[S.groupId] || (a[S.groupId] = S)) : i[c] = []);
    }

    for (var d in e.instances) {
      var p = e.instances[d],
          f = u[(S = e.defs[p.defId]).defId],
          h = p.range,
          v = !S.allDay && r ? Hn(h, r) : h,
          g = Wn(v, n);
      g && ("inverse-background" === f.display ? S.groupId ? o[S.groupId].push(g) : i[p.defId].push(g) : "none" !== f.display && ("background" === f.display ? s : l).push({
        def: S,
        ui: f,
        instance: p,
        range: g,
        isStart: v.start && v.start.valueOf() === g.start.valueOf(),
        isEnd: v.end && v.end.valueOf() === g.end.valueOf()
      }));
    }

    for (var m in o) {
      for (var y = 0, E = Un(o[m], n); y < E.length; y++) {
        var S,
            D = E[y];
        f = u[(S = a[m]).defId];
        s.push({
          def: S,
          ui: f,
          instance: null,
          range: D,
          isStart: !1,
          isEnd: !1
        });
      }
    }

    for (var c in i) {
      for (var b = 0, C = Un(i[c], n); b < C.length; b++) {
        D = C[b];
        s.push({
          def: e.defs[c],
          ui: u[c],
          instance: null,
          range: D,
          isStart: !1,
          isEnd: !1
        });
      }
    }

    return {
      bg: s,
      fg: l
    };
  }

  function Gn(e) {
    return "background" === e.ui.display || "inverse-background" === e.ui.display;
  }

  function qn(e, t) {
    e.fcSeg = t;
  }

  function Yn(e) {
    return e.fcSeg || e.parentNode.fcSeg || null;
  }

  function Zn(e, t) {
    return gt(e, function (e) {
      return Xn(e, t);
    });
  }

  function Xn(e, t) {
    var n = [];
    return t[""] && n.push(t[""]), t[e.defId] && n.push(t[e.defId]), n.push(e.ui), wn(n);
  }

  function Kn(e, t) {
    var n = e.map($n);
    return n.sort(function (e, n) {
      return Fe(e, n, t);
    }), n.map(function (e) {
      return e._seg;
    });
  }

  function $n(e) {
    var t = e.eventRange,
        n = t.def,
        o = t.instance ? t.instance.range : t.range,
        i = o.start ? o.start.valueOf() : 0,
        a = o.end ? o.end.valueOf() : 0;
    return _r2(_r2(_r2({}, n.extendedProps), n), {
      id: n.publicId,
      start: i,
      end: a,
      duration: a - i,
      allDay: Number(n.allDay),
      _seg: e
    });
  }

  function Jn(e, t) {
    for (var n = t.pluginHooks.isDraggableTransformers, r = e.eventRange, o = r.def, i = r.ui, a = i.startEditable, s = 0, l = n; s < l.length; s++) {
      a = (0, l[s])(a, o, i, t);
    }

    return a;
  }

  function Qn(e, t) {
    return e.isStart && e.eventRange.ui.durationEditable && t.options.eventResizableFromStart;
  }

  function er(e, t) {
    return e.isEnd && e.eventRange.ui.durationEditable;
  }

  function tr(e, t, n, r, o, i, a) {
    var s = n.dateEnv,
        l = n.options,
        u = l.displayEventTime,
        c = l.displayEventEnd,
        d = e.eventRange.def,
        p = e.eventRange.instance;
    null == u && (u = !1 !== r), null == c && (c = !1 !== o);
    var f = p.range.start,
        h = p.range.end,
        v = i || e.start || e.eventRange.range.start,
        g = a || e.end || e.eventRange.range.end,
        m = rt(f).valueOf() === rt(v).valueOf(),
        y = rt($e(h, -1)).valueOf() === rt($e(g, -1)).valueOf();
    return u && !d.allDay && (m || y) ? (v = m ? f : v, g = y ? h : g, c && d.hasEnd ? s.formatRange(v, g, t, {
      forcedStartTzo: i ? null : p.forcedStartTzo,
      forcedEndTzo: a ? null : p.forcedEndTzo
    }) : s.format(v, t, {
      forcedTzo: i ? null : p.forcedStartTzo
    })) : "";
  }

  function nr(e, t, n) {
    var r = e.eventRange.range;
    return {
      isPast: r.end < (n || t.start),
      isFuture: r.start >= (n || t.end),
      isToday: t && Bn(t, r.start)
    };
  }

  function rr(e) {
    var t = ["fc-event"];
    return e.isMirror && t.push("fc-event-mirror"), e.isDraggable && t.push("fc-event-draggable"), (e.isStartResizable || e.isEndResizable) && t.push("fc-event-resizable"), e.isDragging && t.push("fc-event-dragging"), e.isResizing && t.push("fc-event-resizing"), e.isSelected && t.push("fc-event-selected"), e.isStart && t.push("fc-event-start"), e.isEnd && t.push("fc-event-end"), e.isPast && t.push("fc-event-past"), e.isToday && t.push("fc-event-today"), e.isFuture && t.push("fc-event-future"), t;
  }

  function or(e) {
    return e.instance ? e.instance.instanceId : e.def.defId + ":" + e.range.start.toISOString();
  }

  var ir = {
    start: fn,
    end: fn,
    allDay: Boolean
  };

  function ar(e, t, n) {
    var o = function (e, t) {
      var n = pn(e, ir),
          o = n.refined,
          i = n.extra,
          a = o.start ? t.createMarkerMeta(o.start) : null,
          s = o.end ? t.createMarkerMeta(o.end) : null,
          l = o.allDay;
      null == l && (l = a && a.isTimeUnspecified && (!s || s.isTimeUnspecified));
      return _r2({
        range: {
          start: a ? a.marker : null,
          end: s ? s.marker : null
        },
        allDay: l
      }, i);
    }(e, t),
        i = o.range;

    if (!i.start) return null;

    if (!i.end) {
      if (null == n) return null;
      i.end = t.add(i.start, n);
    }

    return o;
  }

  function sr(e, t) {
    return Vn(e.range, t.range) && e.allDay === t.allDay && function (e, t) {
      for (var n in t) {
        if ("range" !== n && "allDay" !== n && e[n] !== t[n]) return !1;
      }

      for (var n in e) {
        if (!(n in t)) return !1;
      }

      return !0;
    }(e, t);
  }

  function lr(e, t, n) {
    return _r2(_r2({}, ur(e, t, n)), {
      timeZone: t.timeZone
    });
  }

  function ur(e, t, n) {
    return {
      start: t.toDate(e.start),
      end: t.toDate(e.end),
      startStr: t.formatIso(e.start, {
        omitTime: n
      }),
      endStr: t.formatIso(e.end, {
        omitTime: n
      })
    };
  }

  function cr(e, t, n) {
    var r = Mn({
      editable: !1
    }, n),
        o = In(r.refined, r.extra, "", e.allDay, !0, n);
    return {
      def: o,
      ui: Xn(o, t),
      instance: pt(o.defId, e.range),
      range: e.range,
      isStart: !0,
      isEnd: !0
    };
  }

  function dr(e, t, n) {
    n.emitter.trigger("select", _r2(_r2({}, pr(e, n)), {
      jsEvent: t ? t.origEvent : null,
      view: n.viewApi || n.calendarApi.view
    }));
  }

  function pr(e, t) {
    for (var n, o, i = {}, a = 0, s = t.pluginHooks.dateSpanTransforms; a < s.length; a++) {
      var l = s[a];

      _r2(i, l(e, t));
    }

    return _r2(i, (n = e, o = t.dateEnv, _r2(_r2({}, ur(n.range, o, n.allDay)), {
      allDay: n.allDay
    }))), i;
  }

  function fr(e, t, n) {
    var r = n.dateEnv,
        o = n.options,
        i = t;
    return e ? (i = rt(i), i = r.add(i, o.defaultAllDayEventDuration)) : i = r.add(i, o.defaultTimedEventDuration), i;
  }

  function hr(e, t, n, r) {
    var o = Zn(e.defs, t),
        i = {
      defs: {},
      instances: {}
    };

    for (var a in e.defs) {
      var s = e.defs[a];
      i.defs[a] = vr(s, o[a], n, r);
    }

    for (var l in e.instances) {
      var u = e.instances[l];
      s = i.defs[u.defId];
      i.instances[l] = gr(u, s, o[u.defId], n, r);
    }

    return i;
  }

  function vr(e, t, n, o) {
    var i = n.standardProps || {};
    null == i.hasEnd && t.durationEditable && (n.startDelta || n.endDelta) && (i.hasEnd = !0);

    var a = _r2(_r2(_r2({}, e), i), {
      ui: _r2(_r2({}, e.ui), i.ui)
    });

    n.extendedProps && (a.extendedProps = _r2(_r2({}, a.extendedProps), n.extendedProps));

    for (var s = 0, l = o.pluginHooks.eventDefMutationAppliers; s < l.length; s++) {
      ;
      (0, l[s])(a, n, o);
    }

    return !a.hasEnd && o.options.forceEventDuration && (a.hasEnd = !0), a;
  }

  function gr(e, t, n, o, i) {
    var a = i.dateEnv,
        s = o.standardProps && !0 === o.standardProps.allDay,
        l = o.standardProps && !1 === o.standardProps.hasEnd,
        u = _r2({}, e);

    return s && (u.range = Nn(u.range)), o.datesDelta && n.startEditable && (u.range = {
      start: a.add(u.range.start, o.datesDelta),
      end: a.add(u.range.end, o.datesDelta)
    }), o.startDelta && n.durationEditable && (u.range = {
      start: a.add(u.range.start, o.startDelta),
      end: u.range.end
    }), o.endDelta && n.durationEditable && (u.range = {
      start: u.range.start,
      end: a.add(u.range.end, o.endDelta)
    }), l && (u.range = {
      start: u.range.start,
      end: fr(t.allDay, u.range.start, i)
    }), t.allDay && (u.range = {
      start: rt(u.range.start),
      end: rt(u.range.end)
    }), u.range.end < u.range.start && (u.range.end = fr(t.allDay, u.range.start, i)), u;
  }

  var mr = function () {
    function e(e, t, n) {
      ;
      this.type = e, this.getCurrentData = t, this.dateEnv = n;
    }

    return Object.defineProperty(e.prototype, "calendar", {
      get: function get() {
        return this.getCurrentData().calendarApi;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "title", {
      get: function get() {
        return this.getCurrentData().viewTitle;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "activeStart", {
      get: function get() {
        return this.dateEnv.toDate(this.getCurrentData().dateProfile.activeRange.start);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "activeEnd", {
      get: function get() {
        return this.dateEnv.toDate(this.getCurrentData().dateProfile.activeRange.end);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "currentStart", {
      get: function get() {
        return this.dateEnv.toDate(this.getCurrentData().dateProfile.currentRange.start);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "currentEnd", {
      get: function get() {
        return this.dateEnv.toDate(this.getCurrentData().dateProfile.currentRange.end);
      },
      enumerable: !1,
      configurable: !0
    }), e.prototype.getOption = function (e) {
      return this.getCurrentData().options[e];
    }, e;
  }(),
      yr = {
    id: String,
    defaultAllDay: Boolean,
    url: String,
    format: String,
    events: fn,
    eventDataTransform: fn,
    success: fn,
    failure: fn
  };

  function Er(e, t, n) {
    var r;

    if (void 0 === n && (n = Sr(t)), "string" == typeof e ? r = {
      url: e
    } : "function" == typeof e || Array.isArray(e) ? r = {
      events: e
    } : "object" == _typeof(e) && e && (r = e), r) {
      var o = pn(r, n),
          i = o.refined,
          a = o.extra,
          s = function (e, t) {
        for (var n = t.pluginHooks.eventSourceDefs, r = n.length - 1; r >= 0; r -= 1) {
          var o = n[r].parseMeta(e);
          if (o) return {
            sourceDefId: r,
            meta: o
          };
        }

        return null;
      }(i, t);

      if (s) return {
        _raw: e,
        isFetching: !1,
        latestFetchId: "",
        fetchRange: null,
        defaultAllDay: i.defaultAllDay,
        eventDataTransform: i.eventDataTransform,
        success: i.success,
        failure: i.failure,
        publicId: i.id || "",
        sourceId: Ne(),
        sourceDefId: s.sourceDefId,
        meta: s.meta,
        ui: Cn(i, t),
        extendedProps: a
      };
    }

    return null;
  }

  function Sr(e) {
    return _r2(_r2(_r2({}, Dn), yr), e.pluginHooks.eventSourceRefiners);
  }

  function Dr(e, t) {
    return "function" == typeof e && (e = e()), null == e ? t.createNowMarker() : t.createMarker(e);
  }

  var br = function () {
    function e() {}

    return e.prototype.getCurrentData = function () {
      return this.currentDataManager.getCurrentData();
    }, e.prototype.dispatch = function (e) {
      return this.currentDataManager.dispatch(e);
    }, Object.defineProperty(e.prototype, "view", {
      get: function get() {
        return this.getCurrentData().viewApi;
      },
      enumerable: !1,
      configurable: !0
    }), e.prototype.batchRendering = function (e) {
      e();
    }, e.prototype.updateSize = function () {
      this.trigger("_resize", !0);
    }, e.prototype.setOption = function (e, t) {
      this.dispatch({
        type: "SET_OPTION",
        optionName: e,
        rawOptionValue: t
      });
    }, e.prototype.getOption = function (e) {
      return this.currentDataManager.currentCalendarOptionsInput[e];
    }, e.prototype.getAvailableLocaleCodes = function () {
      return Object.keys(this.getCurrentData().availableRawLocales);
    }, e.prototype.on = function (e, t) {
      var n = this.currentDataManager;
      n.currentCalendarOptionsRefiners[e] ? n.emitter.on(e, t) : console.warn("Unknown listener name '" + e + "'");
    }, e.prototype.off = function (e, t) {
      this.currentDataManager.emitter.off(e, t);
    }, e.prototype.trigger = function (e) {
      for (var t, n = [], r = 1; r < arguments.length; r++) {
        n[r - 1] = arguments[r];
      }

      (t = this.currentDataManager.emitter).trigger.apply(t, o([e], n));
    }, e.prototype.changeView = function (e, t) {
      var n = this;
      this.batchRendering(function () {
        if (n.unselect(), t) {
          if (t.start && t.end) n.dispatch({
            type: "CHANGE_VIEW_TYPE",
            viewType: e
          }), n.dispatch({
            type: "SET_OPTION",
            optionName: "visibleRange",
            rawOptionValue: t
          });else {
            var r = n.getCurrentData().dateEnv;
            n.dispatch({
              type: "CHANGE_VIEW_TYPE",
              viewType: e,
              dateMarker: r.createMarker(t)
            });
          }
        } else n.dispatch({
          type: "CHANGE_VIEW_TYPE",
          viewType: e
        });
      });
    }, e.prototype.zoomTo = function (e, t) {
      var n;
      t = t || "day", n = this.getCurrentData().viewSpecs[t] || this.getUnitViewSpec(t), this.unselect(), n ? this.dispatch({
        type: "CHANGE_VIEW_TYPE",
        viewType: n.type,
        dateMarker: e
      }) : this.dispatch({
        type: "CHANGE_DATE",
        dateMarker: e
      });
    }, e.prototype.getUnitViewSpec = function (e) {
      var t,
          n,
          r = this.getCurrentData(),
          o = r.viewSpecs,
          i = r.toolbarConfig,
          a = [].concat(i.viewsWithButtons);

      for (var s in o) {
        a.push(s);
      }

      for (t = 0; t < a.length; t += 1) {
        if ((n = o[a[t]]) && n.singleUnit === e) return n;
      }

      return null;
    }, e.prototype.prev = function () {
      this.unselect(), this.dispatch({
        type: "PREV"
      });
    }, e.prototype.next = function () {
      this.unselect(), this.dispatch({
        type: "NEXT"
      });
    }, e.prototype.prevYear = function () {
      var e = this.getCurrentData();
      this.unselect(), this.dispatch({
        type: "CHANGE_DATE",
        dateMarker: e.dateEnv.addYears(e.currentDate, -1)
      });
    }, e.prototype.nextYear = function () {
      var e = this.getCurrentData();
      this.unselect(), this.dispatch({
        type: "CHANGE_DATE",
        dateMarker: e.dateEnv.addYears(e.currentDate, 1)
      });
    }, e.prototype.today = function () {
      var e = this.getCurrentData();
      this.unselect(), this.dispatch({
        type: "CHANGE_DATE",
        dateMarker: Dr(e.calendarOptions.now, e.dateEnv)
      });
    }, e.prototype.gotoDate = function (e) {
      var t = this.getCurrentData();
      this.unselect(), this.dispatch({
        type: "CHANGE_DATE",
        dateMarker: t.dateEnv.createMarker(e)
      });
    }, e.prototype.incrementDate = function (e) {
      var t = this.getCurrentData(),
          n = kt(e);
      n && (this.unselect(), this.dispatch({
        type: "CHANGE_DATE",
        dateMarker: t.dateEnv.add(t.currentDate, n)
      }));
    }, e.prototype.getDate = function () {
      var e = this.getCurrentData();
      return e.dateEnv.toDate(e.currentDate);
    }, e.prototype.formatDate = function (e, t) {
      var n = this.getCurrentData().dateEnv;
      return n.format(n.createMarker(e), nn(t));
    }, e.prototype.formatRange = function (e, t, n) {
      var r = this.getCurrentData().dateEnv;
      return r.formatRange(r.createMarker(e), r.createMarker(t), nn(n), n);
    }, e.prototype.formatIso = function (e, t) {
      var n = this.getCurrentData().dateEnv;
      return n.formatIso(n.createMarker(e), {
        omitTime: t
      });
    }, e.prototype.select = function (e, t) {
      var n;
      n = null == t ? null != e.start ? e : {
        start: e,
        end: null
      } : {
        start: e,
        end: t
      };
      var r = this.getCurrentData(),
          o = ar(n, r.dateEnv, kt({
        days: 1
      }));
      o && (this.dispatch({
        type: "SELECT_DATES",
        selection: o
      }), dr(o, null, r));
    }, e.prototype.unselect = function (e) {
      var t = this.getCurrentData();
      t.dateSelection && (this.dispatch({
        type: "UNSELECT_DATES"
      }), function (e, t) {
        t.emitter.trigger("unselect", {
          jsEvent: e ? e.origEvent : null,
          view: t.viewApi || t.calendarApi.view
        });
      }(e, t));
    }, e.prototype.addEvent = function (e, t) {
      if (e instanceof Cr) {
        var n = e._def,
            r = e._instance;
        return this.getCurrentData().eventStore.defs[n.defId] || (this.dispatch({
          type: "ADD_EVENTS",
          eventStore: vn({
            def: n,
            instance: r
          })
        }), this.triggerEventAdd(e)), e;
      }

      var o,
          i = this.getCurrentData();
      if (t instanceof ye) o = t.internalEventSource;else if ("boolean" == typeof t) t && (o = yt(i.eventSources)[0]);else if (null != t) {
        var a = this.getEventSourceById(t);
        if (!a) return console.warn('Could not find an event source with ID "' + t + '"'), null;
        o = a.internalEventSource;
      }
      var s = xn(e, o, i, !1);

      if (s) {
        var l = new Cr(i, s.def, s.def.recurringDef ? null : s.instance);
        return this.dispatch({
          type: "ADD_EVENTS",
          eventStore: vn(s)
        }), this.triggerEventAdd(l), l;
      }

      return null;
    }, e.prototype.triggerEventAdd = function (e) {
      var t = this;
      this.getCurrentData().emitter.trigger("eventAdd", {
        event: e,
        relatedEvents: [],
        revert: function revert() {
          t.dispatch({
            type: "REMOVE_EVENTS",
            eventStore: wr(e)
          });
        }
      });
    }, e.prototype.getEventById = function (e) {
      var t = this.getCurrentData(),
          n = t.eventStore,
          r = n.defs,
          o = n.instances;

      for (var i in e = String(e), r) {
        var a = r[i];

        if (a.publicId === e) {
          if (a.recurringDef) return new Cr(t, a, null);

          for (var s in o) {
            var l = o[s];
            if (l.defId === a.defId) return new Cr(t, a, l);
          }
        }
      }

      return null;
    }, e.prototype.getEvents = function () {
      var e = this.getCurrentData();
      return Rr(e.eventStore, e);
    }, e.prototype.removeAllEvents = function () {
      this.dispatch({
        type: "REMOVE_ALL_EVENTS"
      });
    }, e.prototype.getEventSources = function () {
      var e = this.getCurrentData(),
          t = e.eventSources,
          n = [];

      for (var r in t) {
        n.push(new ye(e, t[r]));
      }

      return n;
    }, e.prototype.getEventSourceById = function (e) {
      var t = this.getCurrentData(),
          n = t.eventSources;

      for (var r in e = String(e), n) {
        if (n[r].publicId === e) return new ye(t, n[r]);
      }

      return null;
    }, e.prototype.addEventSource = function (e) {
      var t = this.getCurrentData();
      if (e instanceof ye) return t.eventSources[e.internalEventSource.sourceId] || this.dispatch({
        type: "ADD_EVENT_SOURCES",
        sources: [e.internalEventSource]
      }), e;
      var n = Er(e, t);
      return n ? (this.dispatch({
        type: "ADD_EVENT_SOURCES",
        sources: [n]
      }), new ye(t, n)) : null;
    }, e.prototype.removeAllEventSources = function () {
      this.dispatch({
        type: "REMOVE_ALL_EVENT_SOURCES"
      });
    }, e.prototype.refetchEvents = function () {
      this.dispatch({
        type: "FETCH_EVENT_SOURCES",
        isRefetch: !0
      });
    }, e.prototype.scrollToTime = function (e) {
      var t = kt(e);
      t && this.trigger("_scrollRequest", {
        time: t
      });
    }, e;
  }(),
      Cr = function () {
    function e(e, t, n) {
      ;
      this._context = e, this._def = t, this._instance = n || null;
    }

    return e.prototype.setProp = function (e, t) {
      var n, r;
      if (e in Tn) console.warn("Could not set date-related prop 'name'. Use one of the date-related methods instead.");else if ("id" === e) t = _n[e](t), this.mutate({
        standardProps: {
          publicId: t
        }
      });else if (e in _n) t = _n[e](t), this.mutate({
        standardProps: (n = {}, n[e] = t, n)
      });else if (e in Dn) {
        var o = Dn[e](t);
        "color" === e ? o = {
          backgroundColor: t,
          borderColor: t
        } : "editable" === e ? o = {
          startEditable: t,
          durationEditable: t
        } : ((r = {})[e] = t, o = r), this.mutate({
          standardProps: {
            ui: o
          }
        });
      } else console.warn("Could not set prop '" + e + "'. Use setExtendedProp instead.");
    }, e.prototype.setExtendedProp = function (e, t) {
      var n;
      this.mutate({
        extendedProps: (n = {}, n[e] = t, n)
      });
    }, e.prototype.setStart = function (e, t) {
      void 0 === t && (t = {});
      var n = this._context.dateEnv,
          r = n.createMarker(e);

      if (r && this._instance) {
        var o = An(this._instance.range.start, r, n, t.granularity);
        t.maintainDuration ? this.mutate({
          datesDelta: o
        }) : this.mutate({
          startDelta: o
        });
      }
    }, e.prototype.setEnd = function (e, t) {
      void 0 === t && (t = {});
      var n,
          r = this._context.dateEnv;
      if ((null == e || (n = r.createMarker(e))) && this._instance) if (n) {
        var o = An(this._instance.range.end, n, r, t.granularity);
        this.mutate({
          endDelta: o
        });
      } else this.mutate({
        standardProps: {
          hasEnd: !1
        }
      });
    }, e.prototype.setDates = function (e, t, n) {
      void 0 === n && (n = {});
      var r,
          o,
          i,
          a = this._context.dateEnv,
          s = {
        allDay: n.allDay
      },
          l = a.createMarker(e);

      if (l && (null == t || (r = a.createMarker(t))) && this._instance) {
        var u = this._instance.range;
        !0 === n.allDay && (u = Nn(u));
        var c = An(u.start, l, a, n.granularity);

        if (r) {
          var d = An(u.end, r, a, n.granularity);
          i = d, (o = c).years === i.years && o.months === i.months && o.days === i.days && o.milliseconds === i.milliseconds ? this.mutate({
            datesDelta: c,
            standardProps: s
          }) : this.mutate({
            startDelta: c,
            endDelta: d,
            standardProps: s
          });
        } else s.hasEnd = !1, this.mutate({
          datesDelta: c,
          standardProps: s
        });
      }
    }, e.prototype.moveStart = function (e) {
      var t = kt(e);
      t && this.mutate({
        startDelta: t
      });
    }, e.prototype.moveEnd = function (e) {
      var t = kt(e);
      t && this.mutate({
        endDelta: t
      });
    }, e.prototype.moveDates = function (e) {
      var t = kt(e);
      t && this.mutate({
        datesDelta: t
      });
    }, e.prototype.setAllDay = function (e, t) {
      void 0 === t && (t = {});
      var n = {
        allDay: e
      },
          r = t.maintainDuration;
      null == r && (r = this._context.options.allDayMaintainDuration), this._def.allDay !== e && (n.hasEnd = r), this.mutate({
        standardProps: n
      });
    }, e.prototype.formatRange = function (e) {
      var t = this._context.dateEnv,
          n = this._instance,
          r = nn(e);
      return this._def.hasEnd ? t.formatRange(n.range.start, n.range.end, r, {
        forcedStartTzo: n.forcedStartTzo,
        forcedEndTzo: n.forcedEndTzo
      }) : t.format(n.range.start, r, {
        forcedTzo: n.forcedStartTzo
      });
    }, e.prototype.mutate = function (t) {
      var n = this._instance;

      if (n) {
        var r = this._def,
            o = this._context,
            i = o.getCurrentData().eventStore,
            a = gn(i, n.instanceId);
        a = hr(a, {
          "": {
            display: "",
            startEditable: !0,
            durationEditable: !0,
            constraints: [],
            overlap: null,
            allows: [],
            backgroundColor: "",
            borderColor: "",
            textColor: "",
            classNames: []
          }
        }, t, o);
        var s = new e(o, r, n);
        this._def = a.defs[r.defId], this._instance = a.instances[n.instanceId], o.dispatch({
          type: "MERGE_EVENTS",
          eventStore: a
        }), o.emitter.trigger("eventChange", {
          oldEvent: s,
          event: this,
          relatedEvents: Rr(a, o, n),
          revert: function revert() {
            o.dispatch({
              type: "RESET_EVENTS",
              eventStore: i
            });
          }
        });
      }
    }, e.prototype.remove = function () {
      var e = this._context,
          t = wr(this);
      e.dispatch({
        type: "REMOVE_EVENTS",
        eventStore: t
      }), e.emitter.trigger("eventRemove", {
        event: this,
        relatedEvents: [],
        revert: function revert() {
          e.dispatch({
            type: "MERGE_EVENTS",
            eventStore: t
          });
        }
      });
    }, Object.defineProperty(e.prototype, "source", {
      get: function get() {
        var e = this._def.sourceId;
        return e ? new ye(this._context, this._context.getCurrentData().eventSources[e]) : null;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "start", {
      get: function get() {
        return this._instance ? this._context.dateEnv.toDate(this._instance.range.start) : null;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "end", {
      get: function get() {
        return this._instance && this._def.hasEnd ? this._context.dateEnv.toDate(this._instance.range.end) : null;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "startStr", {
      get: function get() {
        var e = this._instance;
        return e ? this._context.dateEnv.formatIso(e.range.start, {
          omitTime: this._def.allDay,
          forcedTzo: e.forcedStartTzo
        }) : "";
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "endStr", {
      get: function get() {
        var e = this._instance;
        return e && this._def.hasEnd ? this._context.dateEnv.formatIso(e.range.end, {
          omitTime: this._def.allDay,
          forcedTzo: e.forcedEndTzo
        }) : "";
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "id", {
      get: function get() {
        return this._def.publicId;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "groupId", {
      get: function get() {
        return this._def.groupId;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "allDay", {
      get: function get() {
        return this._def.allDay;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "title", {
      get: function get() {
        return this._def.title;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "url", {
      get: function get() {
        return this._def.url;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "display", {
      get: function get() {
        return this._def.ui.display || "auto";
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "startEditable", {
      get: function get() {
        return this._def.ui.startEditable;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "durationEditable", {
      get: function get() {
        return this._def.ui.durationEditable;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "constraint", {
      get: function get() {
        return this._def.ui.constraints[0] || null;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "overlap", {
      get: function get() {
        return this._def.ui.overlap;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "allow", {
      get: function get() {
        return this._def.ui.allows[0] || null;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "backgroundColor", {
      get: function get() {
        return this._def.ui.backgroundColor;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "borderColor", {
      get: function get() {
        return this._def.ui.borderColor;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "textColor", {
      get: function get() {
        return this._def.ui.textColor;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "classNames", {
      get: function get() {
        return this._def.ui.classNames;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "extendedProps", {
      get: function get() {
        return this._def.extendedProps;
      },
      enumerable: !1,
      configurable: !0
    }), e.prototype.toPlainObject = function (e) {
      void 0 === e && (e = {});
      var t = this._def,
          n = t.ui,
          o = this.startStr,
          i = this.endStr,
          a = {};
      return t.title && (a.title = t.title), o && (a.start = o), i && (a.end = i), t.publicId && (a.id = t.publicId), t.groupId && (a.groupId = t.groupId), t.url && (a.url = t.url), n.display && "auto" !== n.display && (a.display = n.display), e.collapseColor && n.backgroundColor && n.backgroundColor === n.borderColor ? a.color = n.backgroundColor : (n.backgroundColor && (a.backgroundColor = n.backgroundColor), n.borderColor && (a.borderColor = n.borderColor)), n.textColor && (a.textColor = n.textColor), n.classNames.length && (a.classNames = n.classNames), Object.keys(t.extendedProps).length && (e.collapseExtendedProps ? _r2(a, t.extendedProps) : a.extendedProps = t.extendedProps), a;
    }, e.prototype.toJSON = function () {
      return this.toPlainObject();
    }, e;
  }();

  function wr(e) {
    var t,
        n,
        r = e._def,
        o = e._instance;
    return {
      defs: (t = {}, t[r.defId] = r, t),
      instances: o ? (n = {}, n[o.instanceId] = o, n) : {}
    };
  }

  function Rr(e, t, n) {
    var r = e.defs,
        o = e.instances,
        i = [],
        a = n ? n.instanceId : "";

    for (var s in o) {
      var l = o[s],
          u = r[l.defId];
      l.instanceId !== a && i.push(new Cr(t, u, l));
    }

    return i;
  }

  var _r = {};

  var Tr,
      kr = function () {
    function e() {}

    return e.prototype.getMarkerYear = function (e) {
      return e.getUTCFullYear();
    }, e.prototype.getMarkerMonth = function (e) {
      return e.getUTCMonth();
    }, e.prototype.getMarkerDay = function (e) {
      return e.getUTCDate();
    }, e.prototype.arrayToMarker = function (e) {
      return ut(e);
    }, e.prototype.markerToArray = function (e) {
      return lt(e);
    }, e;
  }();

  Tr = kr, _r["gregory"] = Tr;
  var xr = /^\s*(\d{4})(-?(\d{2})(-?(\d{2})([T ](\d{2}):?(\d{2})(:?(\d{2})(\.(\d+))?)?(Z|(([-+])(\d{2})(:?(\d{2}))?))?)?)?)?$/;

  function Mr(e) {
    var t = xr.exec(e);

    if (t) {
      var n = new Date(Date.UTC(Number(t[1]), t[3] ? Number(t[3]) - 1 : 0, Number(t[5] || 1), Number(t[7] || 0), Number(t[8] || 0), Number(t[10] || 0), t[12] ? 1e3 * Number("0." + t[12]) : 0));

      if (ct(n)) {
        var r = null;
        return t[13] && (r = ("-" === t[15] ? -1 : 1) * (60 * Number(t[16] || 0) + Number(t[18] || 0))), {
          marker: n,
          isTimeUnspecified: !t[6],
          timeZoneOffset: r
        };
      }
    }

    return null;
  }

  var Pr = function () {
    function e(e) {
      var t = this.timeZone = e.timeZone,
          n = "local" !== t && "UTC" !== t;
      e.namedTimeZoneImpl && n && (this.namedTimeZoneImpl = new e.namedTimeZoneImpl(t)), this.canComputeOffset = Boolean(!n || this.namedTimeZoneImpl), this.calendarSystem = function (e) {
        return new _r[e]();
      }(e.calendarSystem), this.locale = e.locale, this.weekDow = e.locale.week.dow, this.weekDoy = e.locale.week.doy, "ISO" === e.weekNumberCalculation && (this.weekDow = 1, this.weekDoy = 4), "number" == typeof e.firstDay && (this.weekDow = e.firstDay), "function" == typeof e.weekNumberCalculation && (this.weekNumberFunc = e.weekNumberCalculation), this.weekText = null != e.weekText ? e.weekText : e.locale.options.weekText, this.cmdFormatter = e.cmdFormatter, this.defaultSeparator = e.defaultSeparator;
    }

    return e.prototype.createMarker = function (e) {
      var t = this.createMarkerMeta(e);
      return null === t ? null : t.marker;
    }, e.prototype.createNowMarker = function () {
      return this.canComputeOffset ? this.timestampToMarker(new Date().valueOf()) : ut(at(new Date()));
    }, e.prototype.createMarkerMeta = function (e) {
      if ("string" == typeof e) return this.parse(e);
      var t = null;
      return "number" == typeof e ? t = this.timestampToMarker(e) : e instanceof Date ? (e = e.valueOf(), isNaN(e) || (t = this.timestampToMarker(e))) : Array.isArray(e) && (t = ut(e)), null !== t && ct(t) ? {
        marker: t,
        isTimeUnspecified: !1,
        forcedTzo: null
      } : null;
    }, e.prototype.parse = function (e) {
      var t = Mr(e);
      if (null === t) return null;
      var n = t.marker,
          r = null;
      return null !== t.timeZoneOffset && (this.canComputeOffset ? n = this.timestampToMarker(n.valueOf() - 60 * t.timeZoneOffset * 1e3) : r = t.timeZoneOffset), {
        marker: n,
        isTimeUnspecified: t.isTimeUnspecified,
        forcedTzo: r
      };
    }, e.prototype.getYear = function (e) {
      return this.calendarSystem.getMarkerYear(e);
    }, e.prototype.getMonth = function (e) {
      return this.calendarSystem.getMarkerMonth(e);
    }, e.prototype.add = function (e, t) {
      var n = this.calendarSystem.markerToArray(e);
      return n[0] += t.years, n[1] += t.months, n[2] += t.days, n[6] += t.milliseconds, this.calendarSystem.arrayToMarker(n);
    }, e.prototype.subtract = function (e, t) {
      var n = this.calendarSystem.markerToArray(e);
      return n[0] -= t.years, n[1] -= t.months, n[2] -= t.days, n[6] -= t.milliseconds, this.calendarSystem.arrayToMarker(n);
    }, e.prototype.addYears = function (e, t) {
      var n = this.calendarSystem.markerToArray(e);
      return n[0] += t, this.calendarSystem.arrayToMarker(n);
    }, e.prototype.addMonths = function (e, t) {
      var n = this.calendarSystem.markerToArray(e);
      return n[1] += t, this.calendarSystem.arrayToMarker(n);
    }, e.prototype.diffWholeYears = function (e, t) {
      var n = this.calendarSystem;
      return dt(e) === dt(t) && n.getMarkerDay(e) === n.getMarkerDay(t) && n.getMarkerMonth(e) === n.getMarkerMonth(t) ? n.getMarkerYear(t) - n.getMarkerYear(e) : null;
    }, e.prototype.diffWholeMonths = function (e, t) {
      var n = this.calendarSystem;
      return dt(e) === dt(t) && n.getMarkerDay(e) === n.getMarkerDay(t) ? n.getMarkerMonth(t) - n.getMarkerMonth(e) + 12 * (n.getMarkerYear(t) - n.getMarkerYear(e)) : null;
    }, e.prototype.greatestWholeUnit = function (e, t) {
      var n = this.diffWholeYears(e, t);
      return null !== n ? {
        unit: "year",
        value: n
      } : null !== (n = this.diffWholeMonths(e, t)) ? {
        unit: "month",
        value: n
      } : null !== (n = tt(e, t)) ? {
        unit: "week",
        value: n
      } : null !== (n = nt(e, t)) ? {
        unit: "day",
        value: n
      } : qe(n = function (e, t) {
        return (t.valueOf() - e.valueOf()) / 36e5;
      }(e, t)) ? {
        unit: "hour",
        value: n
      } : qe(n = function (e, t) {
        return (t.valueOf() - e.valueOf()) / 6e4;
      }(e, t)) ? {
        unit: "minute",
        value: n
      } : qe(n = function (e, t) {
        return (t.valueOf() - e.valueOf()) / 1e3;
      }(e, t)) ? {
        unit: "second",
        value: n
      } : {
        unit: "millisecond",
        value: t.valueOf() - e.valueOf()
      };
    }, e.prototype.countDurationsBetween = function (e, t, n) {
      var r;
      return n.years && null !== (r = this.diffWholeYears(e, t)) ? r / (It(n) / 365) : n.months && null !== (r = this.diffWholeMonths(e, t)) ? r / function (e) {
        return It(e) / 30;
      }(n) : n.days && null !== (r = nt(e, t)) ? r / It(n) : (t.valueOf() - e.valueOf()) / Nt(n);
    }, e.prototype.startOf = function (e, t) {
      return "year" === t ? this.startOfYear(e) : "month" === t ? this.startOfMonth(e) : "week" === t ? this.startOfWeek(e) : "day" === t ? rt(e) : "hour" === t ? function (e) {
        return ut([e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate(), e.getUTCHours()]);
      }(e) : "minute" === t ? function (e) {
        return ut([e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate(), e.getUTCHours(), e.getUTCMinutes()]);
      }(e) : "second" === t ? function (e) {
        return ut([e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate(), e.getUTCHours(), e.getUTCMinutes(), e.getUTCSeconds()]);
      }(e) : null;
    }, e.prototype.startOfYear = function (e) {
      return this.calendarSystem.arrayToMarker([this.calendarSystem.getMarkerYear(e)]);
    }, e.prototype.startOfMonth = function (e) {
      return this.calendarSystem.arrayToMarker([this.calendarSystem.getMarkerYear(e), this.calendarSystem.getMarkerMonth(e)]);
    }, e.prototype.startOfWeek = function (e) {
      return this.calendarSystem.arrayToMarker([this.calendarSystem.getMarkerYear(e), this.calendarSystem.getMarkerMonth(e), e.getUTCDate() - (e.getUTCDay() - this.weekDow + 7) % 7]);
    }, e.prototype.computeWeekNumber = function (e) {
      return this.weekNumberFunc ? this.weekNumberFunc(this.toDate(e)) : function (e, t, n) {
        var r = e.getUTCFullYear(),
            o = ot(e, r, t, n);
        if (o < 1) return ot(e, r - 1, t, n);
        var i = ot(e, r + 1, t, n);
        return i >= 1 ? Math.min(o, i) : o;
      }(e, this.weekDow, this.weekDoy);
    }, e.prototype.format = function (e, t, n) {
      return void 0 === n && (n = {}), t.format({
        marker: e,
        timeZoneOffset: null != n.forcedTzo ? n.forcedTzo : this.offsetForMarker(e)
      }, this);
    }, e.prototype.formatRange = function (e, t, n, r) {
      return void 0 === r && (r = {}), r.isEndExclusive && (t = $e(t, -1)), n.formatRange({
        marker: e,
        timeZoneOffset: null != r.forcedStartTzo ? r.forcedStartTzo : this.offsetForMarker(e)
      }, {
        marker: t,
        timeZoneOffset: null != r.forcedEndTzo ? r.forcedEndTzo : this.offsetForMarker(t)
      }, this, r.defaultSeparator);
    }, e.prototype.formatIso = function (e, t) {
      void 0 === t && (t = {});
      var n = null;
      return t.omitTimeZoneOffset || (n = null != t.forcedTzo ? t.forcedTzo : this.offsetForMarker(e)), At(e, n, t.omitTime);
    }, e.prototype.timestampToMarker = function (e) {
      return "local" === this.timeZone ? ut(at(new Date(e))) : "UTC" !== this.timeZone && this.namedTimeZoneImpl ? ut(this.namedTimeZoneImpl.timestampToArray(e)) : new Date(e);
    }, e.prototype.offsetForMarker = function (e) {
      return "local" === this.timeZone ? -st(lt(e)).getTimezoneOffset() : "UTC" === this.timeZone ? 0 : this.namedTimeZoneImpl ? this.namedTimeZoneImpl.offsetForArray(lt(e)) : null;
    }, e.prototype.toDate = function (e, t) {
      return "local" === this.timeZone ? st(lt(e)) : "UTC" === this.timeZone ? new Date(e.valueOf()) : this.namedTimeZoneImpl ? new Date(e.valueOf() - 1e3 * this.namedTimeZoneImpl.offsetForArray(lt(e)) * 60) : new Date(e.valueOf() - (t || 0));
    }, e;
  }(),
      Ir = [],
      Nr = {
    code: "en",
    week: {
      dow: 0,
      doy: 4
    },
    direction: "ltr",
    buttonText: {
      prev: "prev",
      next: "next",
      prevYear: "prev year",
      nextYear: "next year",
      year: "year",
      today: "today",
      month: "month",
      week: "week",
      day: "day",
      list: "list"
    },
    weekText: "W",
    allDayText: "all-day",
    moreLinkText: "more",
    noEventsText: "No events to display"
  };

  function Hr(e) {
    for (var t = e.length > 0 ? e[0].code : "en", n = Ir.concat(e), r = {
      en: Nr
    }, o = 0, i = n; o < i.length; o++) {
      var a = i[o];
      r[a.code] = a;
    }

    return {
      map: r,
      defaultCode: t
    };
  }

  function Or(e, t) {
    return "object" != _typeof(e) || Array.isArray(e) ? function (e, t) {
      var n = [].concat(e || []),
          r = function (e, t) {
        for (var n = 0; n < e.length; n += 1) {
          for (var r = e[n].toLocaleLowerCase().split("-"), o = r.length; o > 0; o -= 1) {
            var i = r.slice(0, o).join("-");
            if (t[i]) return t[i];
          }
        }

        return null;
      }(n, t) || Nr;

      return Ar(e, n, r);
    }(e, t) : Ar(e.code, [e.code], e);
  }

  function Ar(e, t, n) {
    var r = ht([Nr, n], ["buttonText"]);
    delete r.code;
    var o = r.week;
    return delete r.week, {
      codeArg: e,
      codes: t,
      week: o,
      simpleNumberFormat: new Intl.NumberFormat(e),
      options: r
    };
  }

  function Ur(e) {
    var t = Or(e.locale || "en", Hr([]).map);
    return new Pr(_r2(_r2({
      timeZone: on.timeZone,
      calendarSystem: "gregory"
    }, e), {
      locale: t
    }));
  }

  var Lr,
      Wr = {
    startTime: "09:00",
    endTime: "17:00",
    daysOfWeek: [1, 2, 3, 4, 5],
    display: "inverse-background",
    classNames: "fc-non-business",
    groupId: "_businessHours"
  };

  function Vr(e, t) {
    return hn(function (e) {
      var t;
      t = !0 === e ? [{}] : Array.isArray(e) ? e.filter(function (e) {
        return e.daysOfWeek;
      }) : "object" == _typeof(e) && e ? [e] : [];
      return t = t.map(function (e) {
        return _r2(_r2({}, Wr), e);
      });
    }(e), null, t);
  }

  function Fr(e, t) {
    return e.left >= t.left && e.left < t.right && e.top >= t.top && e.top < t.bottom;
  }

  function zr(e, t) {
    var n = {
      left: Math.max(e.left, t.left),
      right: Math.min(e.right, t.right),
      top: Math.max(e.top, t.top),
      bottom: Math.min(e.bottom, t.bottom)
    };
    return n.left < n.right && n.top < n.bottom && n;
  }

  function Br(e, t) {
    return {
      left: Math.min(Math.max(e.left, t.left), t.right),
      top: Math.min(Math.max(e.top, t.top), t.bottom)
    };
  }

  function jr(e) {
    return {
      left: (e.left + e.right) / 2,
      top: (e.top + e.bottom) / 2
    };
  }

  function Gr(e, t) {
    return {
      left: e.left - t.left,
      top: e.top - t.top
    };
  }

  function qr() {
    return null == Lr && (Lr = function () {
      if ("undefined" == typeof document) return !0;
      var e = document.createElement("div");
      e.style.position = "absolute", e.style.top = "0px", e.style.left = "0px", e.innerHTML = "<table><tr><td><div></div></td></tr></table>", e.querySelector("table").style.height = "100px", e.querySelector("div").style.height = "100%", document.body.appendChild(e);
      var t = e.querySelector("div").offsetHeight > 0;
      return document.body.removeChild(e), t;
    }()), Lr;
  }

  var Yr = {
    defs: {},
    instances: {}
  },
      Zr = function () {
    function e() {
      ;
      this.getKeysForEventDefs = Ft(this._getKeysForEventDefs), this.splitDateSelection = Ft(this._splitDateSpan), this.splitEventStore = Ft(this._splitEventStore), this.splitIndividualUi = Ft(this._splitIndividualUi), this.splitEventDrag = Ft(this._splitInteraction), this.splitEventResize = Ft(this._splitInteraction), this.eventUiBuilders = {};
    }

    return e.prototype.splitProps = function (e) {
      var t = this,
          n = this.getKeyInfo(e),
          r = this.getKeysForEventDefs(e.eventStore),
          o = this.splitDateSelection(e.dateSelection),
          i = this.splitIndividualUi(e.eventUiBases, r),
          a = this.splitEventStore(e.eventStore, r),
          s = this.splitEventDrag(e.eventDrag),
          l = this.splitEventResize(e.eventResize),
          u = {};

      for (var c in this.eventUiBuilders = gt(n, function (e, n) {
        return t.eventUiBuilders[n] || Ft(Xr);
      }), n) {
        var d = n[c],
            p = a[c] || Yr,
            f = this.eventUiBuilders[c];
        u[c] = {
          businessHours: d.businessHours || e.businessHours,
          dateSelection: o[c] || null,
          eventStore: p,
          eventUiBases: f(e.eventUiBases[""], d.ui, i[c]),
          eventSelection: p.instances[e.eventSelection] ? e.eventSelection : "",
          eventDrag: s[c] || null,
          eventResize: l[c] || null
        };
      }

      return u;
    }, e.prototype._splitDateSpan = function (e) {
      var t = {};
      if (e) for (var n = 0, r = this.getKeysForDateSpan(e); n < r.length; n++) {
        t[r[n]] = e;
      }
      return t;
    }, e.prototype._getKeysForEventDefs = function (e) {
      var t = this;
      return gt(e.defs, function (e) {
        return t.getKeysForEventDef(e);
      });
    }, e.prototype._splitEventStore = function (e, t) {
      var n = e.defs,
          r = e.instances,
          o = {};

      for (var i in n) {
        for (var a = 0, s = t[i]; a < s.length; a++) {
          o[p = s[a]] || (o[p] = {
            defs: {},
            instances: {}
          }), o[p].defs[i] = n[i];
        }
      }

      for (var l in r) {
        for (var u = r[l], c = 0, d = t[u.defId]; c < d.length; c++) {
          var p;
          o[p = d[c]] && (o[p].instances[l] = u);
        }
      }

      return o;
    }, e.prototype._splitIndividualUi = function (e, t) {
      var n = {};

      for (var r in e) {
        if (r) for (var o = 0, i = t[r]; o < i.length; o++) {
          var a = i[o];
          n[a] || (n[a] = {}), n[a][r] = e[r];
        }
      }

      return n;
    }, e.prototype._splitInteraction = function (e) {
      var t = {};

      if (e) {
        var n = this._splitEventStore(e.affectedEvents, this._getKeysForEventDefs(e.affectedEvents)),
            r = this._getKeysForEventDefs(e.mutatedEvents),
            o = this._splitEventStore(e.mutatedEvents, r),
            i = function i(r) {
          t[r] || (t[r] = {
            affectedEvents: n[r] || Yr,
            mutatedEvents: o[r] || Yr,
            isEvent: e.isEvent
          });
        };

        for (var a in n) {
          i(a);
        }

        for (var a in o) {
          i(a);
        }
      }

      return t;
    }, e;
  }();

  function Xr(e, t, n) {
    var o = [];
    e && o.push(e), t && o.push(t);
    var i = {
      "": wn(o)
    };
    return n && _r2(i, n), i;
  }

  function Kr(e, t, n, r) {
    return {
      dow: e.getUTCDay(),
      isDisabled: Boolean(r && !Bn(r.activeRange, e)),
      isOther: Boolean(r && !Bn(r.currentRange, e)),
      isToday: Boolean(t && Bn(t, e)),
      isPast: Boolean(n ? e < n : !!t && e < t.start),
      isFuture: Boolean(n ? e > n : !!t && e >= t.end)
    };
  }

  function $r(e, t) {
    var n = ["fc-day", "fc-day-" + Ze[e.dow]];
    return e.isDisabled ? n.push("fc-day-disabled") : (e.isToday && (n.push("fc-day-today"), n.push(t.getClass("today"))), e.isPast && n.push("fc-day-past"), e.isFuture && n.push("fc-day-future"), e.isOther && n.push("fc-day-other")), n;
  }

  function Jr(e, t) {
    return void 0 === t && (t = "day"), JSON.stringify({
      date: Ut(e),
      type: t
    });
  }

  var Qr,
      eo = null;

  function to() {
    return null === eo && (eo = function () {
      var e = document.createElement("div");
      we(e, {
        position: "absolute",
        top: -1e3,
        left: 0,
        border: 0,
        padding: 0,
        overflow: "scroll",
        direction: "rtl"
      }), e.innerHTML = "<div></div>", document.body.appendChild(e);
      var t = e.firstChild.getBoundingClientRect().left > e.getBoundingClientRect().left;
      return Ee(e), t;
    }()), eo;
  }

  function no() {
    return Qr || (Qr = function () {
      var e = document.createElement("div");
      e.style.overflow = "scroll", e.style.position = "absolute", e.style.top = "-9999px", e.style.left = "-9999px", document.body.appendChild(e);
      var t = ro(e);
      return document.body.removeChild(e), t;
    }()), Qr;
  }

  function ro(e) {
    return {
      x: e.offsetHeight - e.clientHeight,
      y: e.offsetWidth - e.clientWidth
    };
  }

  function oo(e, t) {
    void 0 === t && (t = !1);
    var n = window.getComputedStyle(e),
        r = parseInt(n.borderLeftWidth, 10) || 0,
        o = parseInt(n.borderRightWidth, 10) || 0,
        i = parseInt(n.borderTopWidth, 10) || 0,
        a = parseInt(n.borderBottomWidth, 10) || 0,
        s = ro(e),
        l = s.y - r - o,
        u = {
      borderLeft: r,
      borderRight: o,
      borderTop: i,
      borderBottom: a,
      scrollbarBottom: s.x - i - a,
      scrollbarLeft: 0,
      scrollbarRight: 0
    };
    return to() && "rtl" === n.direction ? u.scrollbarLeft = l : u.scrollbarRight = l, t && (u.paddingLeft = parseInt(n.paddingLeft, 10) || 0, u.paddingRight = parseInt(n.paddingRight, 10) || 0, u.paddingTop = parseInt(n.paddingTop, 10) || 0, u.paddingBottom = parseInt(n.paddingBottom, 10) || 0), u;
  }

  function io(e, t, n) {
    void 0 === t && (t = !1);
    var r = n ? e.getBoundingClientRect() : ao(e),
        o = oo(e, t),
        i = {
      left: r.left + o.borderLeft + o.scrollbarLeft,
      right: r.right - o.borderRight - o.scrollbarRight,
      top: r.top + o.borderTop,
      bottom: r.bottom - o.borderBottom - o.scrollbarBottom
    };
    return t && (i.left += o.paddingLeft, i.right -= o.paddingRight, i.top += o.paddingTop, i.bottom -= o.paddingBottom), i;
  }

  function ao(e) {
    var t = e.getBoundingClientRect();
    return {
      left: t.left + window.pageXOffset,
      top: t.top + window.pageYOffset,
      right: t.right + window.pageXOffset,
      bottom: t.bottom + window.pageYOffset
    };
  }

  function so(e) {
    for (var t = []; e instanceof HTMLElement;) {
      var n = window.getComputedStyle(e);
      if ("fixed" === n.position) break;
      /(auto|scroll)/.test(n.overflow + n.overflowY + n.overflowX) && t.push(e), e = e.parentNode;
    }

    return t;
  }

  function lo(e, t, n) {
    var r = !1,
        o = function o() {
      r || (r = !0, t.apply(this, arguments));
    },
        i = function i() {
      r || (r = !0, n && n.apply(this, arguments));
    },
        a = e(o, i);

    a && "function" == typeof a.then && a.then(o, i);
  }

  var uo = function () {
    function e() {
      ;
      this.handlers = {}, this.thisContext = null;
    }

    return e.prototype.setThisContext = function (e) {
      this.thisContext = e;
    }, e.prototype.setOptions = function (e) {
      this.options = e;
    }, e.prototype.on = function (e, t) {
      !function (e, t, n) {
        ;
        (e[t] || (e[t] = [])).push(n);
      }(this.handlers, e, t);
    }, e.prototype.off = function (e, t) {
      !function (e, t, n) {
        n ? e[t] && (e[t] = e[t].filter(function (e) {
          return e !== n;
        })) : delete e[t];
      }(this.handlers, e, t);
    }, e.prototype.trigger = function (e) {
      for (var t = [], n = 1; n < arguments.length; n++) {
        t[n - 1] = arguments[n];
      }

      for (var r = this.handlers[e] || [], o = this.options && this.options[e], i = [].concat(o || [], r), a = 0, s = i; a < s.length; a++) {
        var l = s[a];
        l.apply(this.thisContext, t);
      }
    }, e.prototype.hasHandlers = function (e) {
      return this.handlers[e] && this.handlers[e].length || this.options && this.options[e];
    }, e;
  }();

  var co = function () {
    function e(e, t, n, r) {
      this.els = t;
      var o = this.originClientRect = e.getBoundingClientRect();
      n && this.buildElHorizontals(o.left), r && this.buildElVerticals(o.top);
    }

    return e.prototype.buildElHorizontals = function (e) {
      for (var t = [], n = [], r = 0, o = this.els; r < o.length; r++) {
        var i = o[r].getBoundingClientRect();
        t.push(i.left - e), n.push(i.right - e);
      }

      ;
      this.lefts = t, this.rights = n;
    }, e.prototype.buildElVerticals = function (e) {
      for (var t = [], n = [], r = 0, o = this.els; r < o.length; r++) {
        var i = o[r].getBoundingClientRect();
        t.push(i.top - e), n.push(i.bottom - e);
      }

      ;
      this.tops = t, this.bottoms = n;
    }, e.prototype.leftToIndex = function (e) {
      var t,
          n = this.lefts,
          r = this.rights,
          o = n.length;

      for (t = 0; t < o; t += 1) {
        if (e >= n[t] && e < r[t]) return t;
      }
    }, e.prototype.topToIndex = function (e) {
      var t,
          n = this.tops,
          r = this.bottoms,
          o = n.length;

      for (t = 0; t < o; t += 1) {
        if (e >= n[t] && e < r[t]) return t;
      }
    }, e.prototype.getWidth = function (e) {
      return this.rights[e] - this.lefts[e];
    }, e.prototype.getHeight = function (e) {
      return this.bottoms[e] - this.tops[e];
    }, e;
  }(),
      po = function () {
    function e() {}

    return e.prototype.getMaxScrollTop = function () {
      return this.getScrollHeight() - this.getClientHeight();
    }, e.prototype.getMaxScrollLeft = function () {
      return this.getScrollWidth() - this.getClientWidth();
    }, e.prototype.canScrollVertically = function () {
      return this.getMaxScrollTop() > 0;
    }, e.prototype.canScrollHorizontally = function () {
      return this.getMaxScrollLeft() > 0;
    }, e.prototype.canScrollUp = function () {
      return this.getScrollTop() > 0;
    }, e.prototype.canScrollDown = function () {
      return this.getScrollTop() < this.getMaxScrollTop();
    }, e.prototype.canScrollLeft = function () {
      return this.getScrollLeft() > 0;
    }, e.prototype.canScrollRight = function () {
      return this.getScrollLeft() < this.getMaxScrollLeft();
    }, e;
  }(),
      fo = function (e) {
    function t(t) {
      var n = e.call(this) || this;
      return n.el = t, n;
    }

    return n(t, e), t.prototype.getScrollTop = function () {
      return this.el.scrollTop;
    }, t.prototype.getScrollLeft = function () {
      return this.el.scrollLeft;
    }, t.prototype.setScrollTop = function (e) {
      this.el.scrollTop = e;
    }, t.prototype.setScrollLeft = function (e) {
      this.el.scrollLeft = e;
    }, t.prototype.getScrollWidth = function () {
      return this.el.scrollWidth;
    }, t.prototype.getScrollHeight = function () {
      return this.el.scrollHeight;
    }, t.prototype.getClientHeight = function () {
      return this.el.clientHeight;
    }, t.prototype.getClientWidth = function () {
      return this.el.clientWidth;
    }, t;
  }(po),
      ho = function (e) {
    function t() {
      return null !== e && e.apply(this, arguments) || this;
    }

    return n(t, e), t.prototype.getScrollTop = function () {
      return window.pageYOffset;
    }, t.prototype.getScrollLeft = function () {
      return window.pageXOffset;
    }, t.prototype.setScrollTop = function (e) {
      window.scroll(window.pageXOffset, e);
    }, t.prototype.setScrollLeft = function (e) {
      window.scroll(e, window.pageYOffset);
    }, t.prototype.getScrollWidth = function () {
      return document.documentElement.scrollWidth;
    }, t.prototype.getScrollHeight = function () {
      return document.documentElement.scrollHeight;
    }, t.prototype.getClientHeight = function () {
      return document.documentElement.clientHeight;
    }, t.prototype.getClientWidth = function () {
      return document.documentElement.clientWidth;
    }, t;
  }(po),
      vo = function () {
    function e(e) {
      this.iconOverrideOption && this.setIconOverride(e[this.iconOverrideOption]);
    }

    return e.prototype.setIconOverride = function (e) {
      var t, n;

      if ("object" == _typeof(e) && e) {
        for (n in t = _r2({}, this.iconClasses), e) {
          t[n] = this.applyIconOverridePrefix(e[n]);
        }

        this.iconClasses = t;
      } else !1 === e && (this.iconClasses = {});
    }, e.prototype.applyIconOverridePrefix = function (e) {
      var t = this.iconOverridePrefix;
      return t && 0 !== e.indexOf(t) && (e = t + e), e;
    }, e.prototype.getClass = function (e) {
      return this.classes[e] || "";
    }, e.prototype.getIconClass = function (e, t) {
      var n;
      return (n = t && this.rtlIconClasses && this.rtlIconClasses[e] || this.iconClasses[e]) ? this.baseIconClass + " " + n : "";
    }, e.prototype.getCustomButtonIconClass = function (e) {
      var t;
      return this.iconOverrideCustomButtonOption && (t = e[this.iconOverrideCustomButtonOption]) ? this.baseIconClass + " " + this.applyIconOverridePrefix(t) : "";
    }, e;
  }();

  if (vo.prototype.classes = {}, vo.prototype.iconClasses = {}, vo.prototype.baseIconClass = "", vo.prototype.iconOverridePrefix = "", "undefined" == typeof FullCalendarVDom) throw new Error("Please import the top-level fullcalendar lib before attempting to import a plugin.");

  var go = FullCalendarVDom.Component,
      mo = FullCalendarVDom.createElement,
      yo = FullCalendarVDom.render,
      Eo = FullCalendarVDom.createRef,
      So = FullCalendarVDom.Fragment,
      Do = FullCalendarVDom.createContext,
      bo = FullCalendarVDom.createPortal,
      Co = FullCalendarVDom.flushToDom,
      wo = FullCalendarVDom.unmountComponentAtNode,
      Ro = function () {
    function e(e, t, n, o) {
      var i = this;
      this.execFunc = e, this.emitter = t, this.scrollTime = n, this.scrollTimeReset = o, this.handleScrollRequest = function (e) {
        ;
        i.queuedRequest = _r2({}, i.queuedRequest || {}, e), i.drain();
      }, t.on("_scrollRequest", this.handleScrollRequest), this.fireInitialScroll();
    }

    return e.prototype.detach = function () {
      this.emitter.off("_scrollRequest", this.handleScrollRequest);
    }, e.prototype.update = function (e) {
      e && this.scrollTimeReset ? this.fireInitialScroll() : this.drain();
    }, e.prototype.fireInitialScroll = function () {
      this.handleScrollRequest({
        time: this.scrollTime
      });
    }, e.prototype.drain = function () {
      this.queuedRequest && this.execFunc(this.queuedRequest) && (this.queuedRequest = null);
    }, e;
  }(),
      _o = Do({});

  function To(e, t, n, r, o, i, a, s, l, u, c, d, p) {
    return {
      dateEnv: o,
      options: n,
      pluginHooks: a,
      emitter: u,
      dispatch: s,
      getCurrentData: l,
      calendarApi: c,
      viewSpec: e,
      viewApi: t,
      dateProfileGenerator: r,
      theme: i,
      isRtl: "rtl" === n.direction,
      addResizeHandler: function addResizeHandler(e) {
        u.on("_resize", e);
      },
      removeResizeHandler: function removeResizeHandler(e) {
        u.off("_resize", e);
      },
      createScrollResponder: function createScrollResponder(e) {
        return new Ro(e, u, kt(n.scrollTime), n.scrollTimeReset);
      },
      registerInteractiveComponent: d,
      unregisterInteractiveComponent: p
    };
  }

  var ko = function (e) {
    function t() {
      return null !== e && e.apply(this, arguments) || this;
    }

    return n(t, e), t.prototype.shouldComponentUpdate = function (e, t) {
      return this.debug && console.log(St(e, this.props), St(t, this.state)), !Dt(this.props, e, this.propEquality) || !Dt(this.state, t, this.stateEquality);
    }, t.addPropsEquality = Mo, t.addStateEquality = Po, t.contextType = _o, t;
  }(go);

  ko.prototype.propEquality = {}, ko.prototype.stateEquality = {};

  var xo = function (e) {
    function t() {
      return null !== e && e.apply(this, arguments) || this;
    }

    return n(t, e), t.contextType = _o, t;
  }(ko);

  function Mo(e) {
    var t = Object.create(this.prototype.propEquality);
    _r2(t, e), this.prototype.propEquality = t;
  }

  function Po(e) {
    var t = Object.create(this.prototype.stateEquality);
    _r2(t, e), this.prototype.stateEquality = t;
  }

  function Io(e, t) {
    "function" == typeof e ? e(t) : e && (e.current = t);
  }

  var No = function (e) {
    function t() {
      var t = null !== e && e.apply(this, arguments) || this;
      return t.uid = Ne(), t;
    }

    return n(t, e), t.prototype.prepareHits = function () {}, t.prototype.queryHit = function (e, t, n, r) {
      return null;
    }, t.prototype.isValidSegDownEl = function (e) {
      return !this.props.eventDrag && !this.props.eventResize && !Se(e, ".fc-event-mirror");
    }, t.prototype.isValidDateDownEl = function (e) {
      return !(Se(e, ".fc-event:not(.fc-bg-event)") || Se(e, ".fc-more-link") || Se(e, "a[data-navlink]") || Se(e, ".fc-popover"));
    }, t;
  }(xo);

  function Ho(e) {
    return {
      id: Ne(),
      deps: e.deps || [],
      reducers: e.reducers || [],
      isLoadingFuncs: e.isLoadingFuncs || [],
      contextInit: [].concat(e.contextInit || []),
      eventRefiners: e.eventRefiners || {},
      eventDefMemberAdders: e.eventDefMemberAdders || [],
      eventSourceRefiners: e.eventSourceRefiners || {},
      isDraggableTransformers: e.isDraggableTransformers || [],
      eventDragMutationMassagers: e.eventDragMutationMassagers || [],
      eventDefMutationAppliers: e.eventDefMutationAppliers || [],
      dateSelectionTransformers: e.dateSelectionTransformers || [],
      datePointTransforms: e.datePointTransforms || [],
      dateSpanTransforms: e.dateSpanTransforms || [],
      views: e.views || {},
      viewPropsTransformers: e.viewPropsTransformers || [],
      isPropsValid: e.isPropsValid || null,
      externalDefTransforms: e.externalDefTransforms || [],
      viewContainerAppends: e.viewContainerAppends || [],
      eventDropTransformers: e.eventDropTransformers || [],
      componentInteractions: e.componentInteractions || [],
      calendarInteractions: e.calendarInteractions || [],
      themeClasses: e.themeClasses || {},
      eventSourceDefs: e.eventSourceDefs || [],
      cmdFormatter: e.cmdFormatter,
      recurringTypes: e.recurringTypes || [],
      namedTimeZonedImpl: e.namedTimeZonedImpl,
      initialView: e.initialView || "",
      elementDraggingImpl: e.elementDraggingImpl,
      optionChangeHandlers: e.optionChangeHandlers || {},
      scrollGridImpl: e.scrollGridImpl || null,
      contentTypeHandlers: e.contentTypeHandlers || {},
      listenerRefiners: e.listenerRefiners || {},
      optionRefiners: e.optionRefiners || {},
      propSetHandlers: e.propSetHandlers || {}
    };
  }

  function Oo() {
    var e,
        t = [],
        n = [];
    return function (o, i) {
      return e && Vt(o, t) && Vt(i, n) || (e = function (e, t) {
        var n = {},
            o = {
          reducers: [],
          isLoadingFuncs: [],
          contextInit: [],
          eventRefiners: {},
          eventDefMemberAdders: [],
          eventSourceRefiners: {},
          isDraggableTransformers: [],
          eventDragMutationMassagers: [],
          eventDefMutationAppliers: [],
          dateSelectionTransformers: [],
          datePointTransforms: [],
          dateSpanTransforms: [],
          views: {},
          viewPropsTransformers: [],
          isPropsValid: null,
          externalDefTransforms: [],
          viewContainerAppends: [],
          eventDropTransformers: [],
          componentInteractions: [],
          calendarInteractions: [],
          themeClasses: {},
          eventSourceDefs: [],
          cmdFormatter: null,
          recurringTypes: [],
          namedTimeZonedImpl: null,
          initialView: "",
          elementDraggingImpl: null,
          optionChangeHandlers: {},
          scrollGridImpl: null,
          contentTypeHandlers: {},
          listenerRefiners: {},
          optionRefiners: {},
          propSetHandlers: {}
        };

        function i(e) {
          for (var t = 0, a = e; t < a.length; t++) {
            var s = a[t];
            n[s.id] || (n[s.id] = !0, i(s.deps), u = s, o = {
              reducers: (l = o).reducers.concat(u.reducers),
              isLoadingFuncs: l.isLoadingFuncs.concat(u.isLoadingFuncs),
              contextInit: l.contextInit.concat(u.contextInit),
              eventRefiners: _r2(_r2({}, l.eventRefiners), u.eventRefiners),
              eventDefMemberAdders: l.eventDefMemberAdders.concat(u.eventDefMemberAdders),
              eventSourceRefiners: _r2(_r2({}, l.eventSourceRefiners), u.eventSourceRefiners),
              isDraggableTransformers: l.isDraggableTransformers.concat(u.isDraggableTransformers),
              eventDragMutationMassagers: l.eventDragMutationMassagers.concat(u.eventDragMutationMassagers),
              eventDefMutationAppliers: l.eventDefMutationAppliers.concat(u.eventDefMutationAppliers),
              dateSelectionTransformers: l.dateSelectionTransformers.concat(u.dateSelectionTransformers),
              datePointTransforms: l.datePointTransforms.concat(u.datePointTransforms),
              dateSpanTransforms: l.dateSpanTransforms.concat(u.dateSpanTransforms),
              views: _r2(_r2({}, l.views), u.views),
              viewPropsTransformers: l.viewPropsTransformers.concat(u.viewPropsTransformers),
              isPropsValid: u.isPropsValid || l.isPropsValid,
              externalDefTransforms: l.externalDefTransforms.concat(u.externalDefTransforms),
              viewContainerAppends: l.viewContainerAppends.concat(u.viewContainerAppends),
              eventDropTransformers: l.eventDropTransformers.concat(u.eventDropTransformers),
              calendarInteractions: l.calendarInteractions.concat(u.calendarInteractions),
              componentInteractions: l.componentInteractions.concat(u.componentInteractions),
              themeClasses: _r2(_r2({}, l.themeClasses), u.themeClasses),
              eventSourceDefs: l.eventSourceDefs.concat(u.eventSourceDefs),
              cmdFormatter: u.cmdFormatter || l.cmdFormatter,
              recurringTypes: l.recurringTypes.concat(u.recurringTypes),
              namedTimeZonedImpl: u.namedTimeZonedImpl || l.namedTimeZonedImpl,
              initialView: l.initialView || u.initialView,
              elementDraggingImpl: l.elementDraggingImpl || u.elementDraggingImpl,
              optionChangeHandlers: _r2(_r2({}, l.optionChangeHandlers), u.optionChangeHandlers),
              scrollGridImpl: u.scrollGridImpl || l.scrollGridImpl,
              contentTypeHandlers: _r2(_r2({}, l.contentTypeHandlers), u.contentTypeHandlers),
              listenerRefiners: _r2(_r2({}, l.listenerRefiners), u.listenerRefiners),
              optionRefiners: _r2(_r2({}, l.optionRefiners), u.optionRefiners),
              propSetHandlers: _r2(_r2({}, l.propSetHandlers), u.propSetHandlers)
            });
          }

          var l, u;
        }

        return e && i(e), i(t), o;
      }(o, i)), t = o, n = i, e;
    };
  }

  var Ao = function (e) {
    function t() {
      return null !== e && e.apply(this, arguments) || this;
    }

    return n(t, e), t;
  }(vo);

  function Uo(e, t, n, o) {
    if (t[e]) return t[e];

    var i = function (e, t, n, o) {
      var i = n[e],
          a = o[e],
          s = function s(e) {
        return i && null !== i[e] ? i[e] : a && null !== a[e] ? a[e] : null;
      },
          l = s("component"),
          u = s("superType"),
          c = null;

      if (u) {
        if (u === e) throw new Error("Can't have a custom view type that references itself");
        c = Uo(u, t, n, o);
      }

      !l && c && (l = c.component);
      if (!l) return null;
      return {
        type: e,
        component: l,
        defaults: _r2(_r2({}, c ? c.defaults : {}), i ? i.rawOptions : {}),
        overrides: _r2(_r2({}, c ? c.overrides : {}), a ? a.rawOptions : {})
      };
    }(e, t, n, o);

    return i && (t[e] = i), i;
  }

  ;
  Ao.prototype.classes = {
    root: "fc-theme-standard",
    tableCellShaded: "fc-cell-shaded",
    buttonGroup: "fc-button-group",
    button: "fc-button fc-button-primary",
    buttonActive: "fc-button-active"
  }, Ao.prototype.baseIconClass = "fc-icon", Ao.prototype.iconClasses = {
    close: "fc-icon-x",
    prev: "fc-icon-chevron-left",
    next: "fc-icon-chevron-right",
    prevYear: "fc-icon-chevrons-left",
    nextYear: "fc-icon-chevrons-right"
  }, Ao.prototype.rtlIconClasses = {
    prev: "fc-icon-chevron-right",
    next: "fc-icon-chevron-left",
    prevYear: "fc-icon-chevrons-right",
    nextYear: "fc-icon-chevrons-left"
  }, Ao.prototype.iconOverrideOption = "buttonIcons", Ao.prototype.iconOverrideCustomButtonOption = "icon", Ao.prototype.iconOverridePrefix = "fc-icon-";

  var Lo = function (e) {
    function t() {
      var t = null !== e && e.apply(this, arguments) || this;
      return t.rootElRef = Eo(), t.handleRootEl = function (e) {
        Io(t.rootElRef, e), t.props.elRef && Io(t.props.elRef, e);
      }, t;
    }

    return n(t, e), t.prototype.render = function () {
      var e = this,
          t = this.props,
          n = t.hookProps;
      return mo(zo, {
        hookProps: n,
        didMount: t.didMount,
        willUnmount: t.willUnmount,
        elRef: this.handleRootEl
      }, function (r) {
        return mo(Vo, {
          hookProps: n,
          content: t.content,
          defaultContent: t.defaultContent,
          backupElRef: e.rootElRef
        }, function (e, o) {
          return t.children(r, jo(t.classNames, n), e, o);
        });
      });
    }, t;
  }(xo),
      Wo = Do(0);

  function Vo(e) {
    return mo(Wo.Consumer, null, function (t) {
      return mo(Fo, _r2({
        renderId: t
      }, e));
    });
  }

  var Fo = function (e) {
    function t() {
      var t = null !== e && e.apply(this, arguments) || this;
      return t.innerElRef = Eo(), t;
    }

    return n(t, e), t.prototype.render = function () {
      return this.props.children(this.innerElRef, this.renderInnerContent());
    }, t.prototype.componentDidMount = function () {
      this.updateCustomContent();
    }, t.prototype.componentDidUpdate = function () {
      this.updateCustomContent();
    }, t.prototype.componentWillUnmount = function () {
      this.customContentInfo && this.customContentInfo.destroy && this.customContentInfo.destroy();
    }, t.prototype.renderInnerContent = function () {
      var e = this.context.pluginHooks.contentTypeHandlers,
          t = this.props,
          n = this.customContentInfo,
          o = Go(t.content, t.hookProps),
          i = null;

      if (void 0 === o && (o = Go(t.defaultContent, t.hookProps)), void 0 !== o) {
        if (n) n.contentVal = o[n.contentKey];else if ("object" == _typeof(o)) for (var a in e) {
          if (void 0 !== o[a]) {
            var s = e[a]();
            n = this.customContentInfo = _r2({
              contentKey: a,
              contentVal: o[a]
            }, s);
            break;
          }
        }
        i = n ? [] : o;
      }

      return i;
    }, t.prototype.updateCustomContent = function () {
      this.customContentInfo && this.customContentInfo.render(this.innerElRef.current || this.props.backupElRef.current, this.customContentInfo.contentVal);
    }, t;
  }(xo),
      zo = function (e) {
    function t() {
      var t = null !== e && e.apply(this, arguments) || this;
      return t.handleRootEl = function (e) {
        ;
        t.rootEl = e, t.props.elRef && Io(t.props.elRef, e);
      }, t;
    }

    return n(t, e), t.prototype.render = function () {
      return this.props.children(this.handleRootEl);
    }, t.prototype.componentDidMount = function () {
      var e = this.props.didMount;
      e && e(_r2(_r2({}, this.props.hookProps), {
        el: this.rootEl
      }));
    }, t.prototype.componentWillUnmount = function () {
      var e = this.props.willUnmount;
      e && e(_r2(_r2({}, this.props.hookProps), {
        el: this.rootEl
      }));
    }, t;
  }(xo);

  function Bo() {
    var e,
        t,
        n = [];
    return function (r, o) {
      return t && Et(t, o) && r === e || (e = r, t = o, n = jo(r, o)), n;
    };
  }

  function jo(e, t) {
    return "function" == typeof e && (e = e(t)), Sn(e);
  }

  function Go(e, t) {
    return "function" == typeof e ? e(t, mo) : e;
  }

  var qo = function (e) {
    function t() {
      var t = null !== e && e.apply(this, arguments) || this;
      return t.normalizeClassNames = Bo(), t;
    }

    return n(t, e), t.prototype.render = function () {
      var e = this.props,
          t = this.context,
          n = t.options,
          r = {
        view: t.viewApi
      },
          o = this.normalizeClassNames(n.viewClassNames, r);
      return mo(zo, {
        hookProps: r,
        didMount: n.viewDidMount,
        willUnmount: n.viewWillUnmount,
        elRef: e.elRef
      }, function (t) {
        return e.children(t, ["fc-" + e.viewSpec.type + "-view", "fc-view"].concat(o));
      });
    }, t;
  }(xo);

  function Yo(e) {
    return gt(e, Zo);
  }

  function Zo(e) {
    var t,
        n = "function" == typeof e ? {
      component: e
    } : e,
        o = n.component;
    return n.content && (t = n, o = function o(e) {
      return mo(_o.Consumer, null, function (n) {
        return mo(qo, {
          viewSpec: n.viewSpec
        }, function (o, i) {
          var a = _r2(_r2({}, e), {
            nextDayThreshold: n.options.nextDayThreshold
          });

          return mo(Lo, {
            hookProps: a,
            classNames: t.classNames,
            content: t.content,
            didMount: t.didMount,
            willUnmount: t.willUnmount,
            elRef: o
          }, function (e, t, n, r) {
            return mo("div", {
              className: i.concat(t).join(" "),
              ref: e
            }, r);
          });
        });
      });
    }), {
      superType: n.type,
      component: o,
      rawOptions: n
    };
  }

  function Xo(e, t, n, o) {
    var i = Yo(e),
        a = Yo(t.views);
    return gt(function (e, t) {
      var n,
          r = {};

      for (n in e) {
        Uo(n, r, e, t);
      }

      for (n in t) {
        Uo(n, r, e, t);
      }

      return r;
    }(i, a), function (e) {
      return function (e, t, n, o, i) {
        var a = e.overrides.duration || e.defaults.duration || o.duration || n.duration,
            s = null,
            l = "",
            u = "",
            c = {};

        if (a && (s = function (e) {
          var t = JSON.stringify(e),
              n = Ko[t];
          void 0 === n && (n = kt(e), Ko[t] = n);
          return n;
        }(a))) {
          var d = Ot(s);
          l = d.unit, 1 === d.value && (u = l, c = t[l] ? t[l].rawOptions : {});
        }

        var p = function p(t) {
          var n = t.buttonText || {},
              r = e.defaults.buttonTextKey;
          return null != r && null != n[r] ? n[r] : null != n[e.type] ? n[e.type] : null != n[u] ? n[u] : null;
        };

        return {
          type: e.type,
          component: e.component,
          duration: s,
          durationUnit: l,
          singleUnit: u,
          optionDefaults: e.defaults,
          optionOverrides: _r2(_r2({}, c), e.overrides),
          buttonTextOverride: p(o) || p(n) || e.overrides.buttonText,
          buttonTextDefault: p(i) || e.defaults.buttonText || p(on) || e.type
        };
      }(e, a, t, n, o);
    });
  }

  var Ko = {};

  var $o = function () {
    function e(e) {
      ;
      this.props = e, this.nowDate = Dr(e.nowInput, e.dateEnv), this.initHiddenDays();
    }

    return e.prototype.buildPrev = function (e, t, n) {
      var r = this.props.dateEnv,
          o = r.subtract(r.startOf(t, e.currentRangeUnit), e.dateIncrement);
      return this.build(o, -1, n);
    }, e.prototype.buildNext = function (e, t, n) {
      var r = this.props.dateEnv,
          o = r.add(r.startOf(t, e.currentRangeUnit), e.dateIncrement);
      return this.build(o, 1, n);
    }, e.prototype.build = function (e, t, n) {
      void 0 === n && (n = !0);
      var r,
          o,
          i,
          a,
          s,
          l,
          u,
          c,
          d = this.props;
      return r = this.buildValidRange(), r = this.trimHiddenDays(r), n && (u = e, e = null != (c = r).start && u < c.start ? c.start : null != c.end && u >= c.end ? new Date(c.end.valueOf() - 1) : u), o = this.buildCurrentRangeInfo(e, t), i = /^(year|month|week|day)$/.test(o.unit), a = this.buildRenderRange(this.trimHiddenDays(o.range), o.unit, i), s = a = this.trimHiddenDays(a), d.showNonCurrentDates || (s = Wn(s, o.range)), s = Wn(s = this.adjustActiveRange(s), r), l = Fn(o.range, r), {
        validRange: r,
        currentRange: o.range,
        currentRangeUnit: o.unit,
        isRangeAllDay: i,
        activeRange: s,
        renderRange: a,
        slotMinTime: d.slotMinTime,
        slotMaxTime: d.slotMaxTime,
        isValid: l,
        dateIncrement: this.buildDateIncrement(o.duration)
      };
    }, e.prototype.buildValidRange = function () {
      var e = this.props.validRangeInput,
          t = "function" == typeof e ? e.call(this.props.calendarApi, this.nowDate) : e;
      return this.refineRange(t) || {
        start: null,
        end: null
      };
    }, e.prototype.buildCurrentRangeInfo = function (e, t) {
      var n,
          r = this.props,
          o = null,
          i = null,
          a = null;
      return r.duration ? (o = r.duration, i = r.durationUnit, a = this.buildRangeFromDuration(e, t, o, i)) : (n = this.props.dayCount) ? (i = "day", a = this.buildRangeFromDayCount(e, t, n)) : (a = this.buildCustomVisibleRange(e)) ? i = r.dateEnv.greatestWholeUnit(a.start, a.end).unit : (i = Ot(o = this.getFallbackDuration()).unit, a = this.buildRangeFromDuration(e, t, o, i)), {
        duration: o,
        unit: i,
        range: a
      };
    }, e.prototype.getFallbackDuration = function () {
      return kt({
        day: 1
      });
    }, e.prototype.adjustActiveRange = function (e) {
      var t = this.props,
          n = t.dateEnv,
          r = t.usesMinMaxTime,
          o = t.slotMinTime,
          i = t.slotMaxTime,
          a = e.start,
          s = e.end;
      return r && (It(o) < 0 && (a = rt(a), a = n.add(a, o)), It(i) > 1 && (s = Ke(s = rt(s), -1), s = n.add(s, i))), {
        start: a,
        end: s
      };
    }, e.prototype.buildRangeFromDuration = function (e, t, n, r) {
      var o,
          i,
          a,
          s = this.props,
          l = s.dateEnv,
          u = s.dateAlignment;

      if (!u) {
        var c = this.props.dateIncrement;
        u = c && Nt(c) < Nt(n) ? Ot(c).unit : r;
      }

      function d() {
        ;
        o = l.startOf(e, u), i = l.add(o, n), a = {
          start: o,
          end: i
        };
      }

      return It(n) <= 1 && this.isHiddenDay(o) && (o = rt(o = this.skipHiddenDays(o, t))), d(), this.trimHiddenDays(a) || (e = this.skipHiddenDays(e, t), d()), a;
    }, e.prototype.buildRangeFromDayCount = function (e, t, n) {
      var r,
          o = this.props,
          i = o.dateEnv,
          a = o.dateAlignment,
          s = 0,
          l = e;
      a && (l = i.startOf(l, a)), l = rt(l), r = l = this.skipHiddenDays(l, t);

      do {
        ;
        r = Ke(r, 1), this.isHiddenDay(r) || (s += 1);
      } while (s < n);

      return {
        start: l,
        end: r
      };
    }, e.prototype.buildCustomVisibleRange = function (e) {
      var t = this.props,
          n = t.visibleRangeInput,
          r = "function" == typeof n ? n.call(t.calendarApi, t.dateEnv.toDate(e)) : n,
          o = this.refineRange(r);
      return !o || null != o.start && null != o.end ? o : null;
    }, e.prototype.buildRenderRange = function (e, t, n) {
      return e;
    }, e.prototype.buildDateIncrement = function (e) {
      var t,
          n = this.props.dateIncrement;
      return n || ((t = this.props.dateAlignment) ? kt(1, t) : e || kt({
        days: 1
      }));
    }, e.prototype.refineRange = function (e) {
      if (e) {
        var t = (n = e, r = this.props.dateEnv, o = null, i = null, n.start && (o = r.createMarker(n.start)), n.end && (i = r.createMarker(n.end)), o || i ? o && i && i < o ? null : {
          start: o,
          end: i
        } : null);
        return t && (t = Hn(t)), t;
      }

      var n, r, o, i;
      return null;
    }, e.prototype.initHiddenDays = function () {
      var e,
          t = this.props.hiddenDays || [],
          n = [],
          r = 0;

      for (!1 === this.props.weekends && t.push(0, 6), e = 0; e < 7; e += 1) {
        (n[e] = -1 !== t.indexOf(e)) || (r += 1);
      }

      if (!r) throw new Error("invalid hiddenDays");
      this.isHiddenDayHash = n;
    }, e.prototype.trimHiddenDays = function (e) {
      var t = e.start,
          n = e.end;
      return t && (t = this.skipHiddenDays(t)), n && (n = this.skipHiddenDays(n, -1, !0)), null == t || null == n || t < n ? {
        start: t,
        end: n
      } : null;
    }, e.prototype.isHiddenDay = function (e) {
      return e instanceof Date && (e = e.getUTCDay()), this.isHiddenDayHash[e];
    }, e.prototype.skipHiddenDays = function (e, t, n) {
      for (void 0 === t && (t = 1), void 0 === n && (n = !1); this.isHiddenDayHash[(e.getUTCDay() + (n ? t : 0) + 7) % 7];) {
        e = Ke(e, t);
      }

      return e;
    }, e;
  }();

  function Jo(e, t, n) {
    var r = t ? t.activeRange : null;
    return ti({}, function (e, t) {
      var n = Sr(t),
          r = [].concat(e.eventSources || []),
          o = [];
      e.initialEvents && r.unshift(e.initialEvents);
      e.events && r.unshift(e.events);

      for (var i = 0, a = r; i < a.length; i++) {
        var s = Er(a[i], t, n);
        s && o.push(s);
      }

      return o;
    }(e, n), r, n);
  }

  function Qo(e, t, n, o) {
    var i,
        a,
        s = n ? n.activeRange : null;

    switch (t.type) {
      case "ADD_EVENT_SOURCES":
        return ti(e, t.sources, s, o);

      case "REMOVE_EVENT_SOURCE":
        return i = e, a = t.sourceId, vt(i, function (e) {
          return e.sourceId !== a;
        });

      case "PREV":
      case "NEXT":
      case "CHANGE_DATE":
      case "CHANGE_VIEW_TYPE":
        return n ? ni(e, s, o) : e;

      case "FETCH_EVENT_SOURCES":
        return ri(e, t.sourceIds ? mt(t.sourceIds) : ii(e, o), s, t.isRefetch || !1, o);

      case "RECEIVE_EVENTS":
      case "RECEIVE_EVENT_ERROR":
        return function (e, t, n, o) {
          var i,
              a = e[t];
          if (a && n === a.latestFetchId) return _r2(_r2({}, e), ((i = {})[t] = _r2(_r2({}, a), {
            isFetching: !1,
            fetchRange: o
          }), i));
          return e;
        }(e, t.sourceId, t.fetchId, t.fetchRange);

      case "REMOVE_ALL_EVENT_SOURCES":
        return {};

      default:
        return e;
    }
  }

  function ei(e) {
    for (var t in e) {
      if (e[t].isFetching) return !0;
    }

    return !1;
  }

  function ti(e, t, n, o) {
    for (var i = {}, a = 0, s = t; a < s.length; a++) {
      var l = s[a];
      i[l.sourceId] = l;
    }

    return n && (i = ni(i, n, o)), _r2(_r2({}, e), i);
  }

  function ni(e, t, n) {
    return ri(e, vt(e, function (e) {
      return function (e, t, n) {
        if (!ai(e, n)) return !e.latestFetchId;
        return !n.options.lazyFetching || !e.fetchRange || e.isFetching || t.start < e.fetchRange.start || t.end > e.fetchRange.end;
      }(e, t, n);
    }), t, !1, n);
  }

  function ri(e, t, n, r, o) {
    var i = {};

    for (var a in e) {
      var s = e[a];
      t[a] ? i[a] = oi(s, n, r, o) : i[a] = s;
    }

    return i;
  }

  function oi(e, t, n, o) {
    var i = o.options,
        a = o.calendarApi,
        s = o.pluginHooks.eventSourceDefs[e.sourceDefId],
        l = Ne();
    return s.fetch({
      eventSource: e,
      range: t,
      isRefetch: n,
      context: o
    }, function (n) {
      var r = n.rawEvents;
      i.eventSourceSuccess && (r = i.eventSourceSuccess.call(a, r, n.xhr) || r), e.success && (r = e.success.call(a, r, n.xhr) || r), o.dispatch({
        type: "RECEIVE_EVENTS",
        sourceId: e.sourceId,
        fetchId: l,
        fetchRange: t,
        rawEvents: r
      });
    }, function (n) {
      console.warn(n.message, n), i.eventSourceFailure && i.eventSourceFailure.call(a, n), e.failure && e.failure(n), o.dispatch({
        type: "RECEIVE_EVENT_ERROR",
        sourceId: e.sourceId,
        fetchId: l,
        fetchRange: t,
        error: n
      });
    }), _r2(_r2({}, e), {
      isFetching: !0,
      latestFetchId: l
    });
  }

  function ii(e, t) {
    return vt(e, function (e) {
      return ai(e, t);
    });
  }

  function ai(e, t) {
    return !t.pluginHooks.eventSourceDefs[e.sourceDefId].ignoreRange;
  }

  function si(e, t, n, r, o) {
    switch (t.type) {
      case "RECEIVE_EVENTS":
        return function (e, t, n, r, o, i) {
          if (t && n === t.latestFetchId) {
            var a = hn(function (e, t, n) {
              var r = n.options.eventDataTransform,
                  o = t ? t.eventDataTransform : null;
              o && (e = li(e, o));
              r && (e = li(e, r));
              return e;
            }(o, t, i), t, i);
            return r && (a = wt(a, r, i)), yn(ui(e, t.sourceId), a);
          }

          return e;
        }(e, n[t.sourceId], t.fetchId, t.fetchRange, t.rawEvents, o);

      case "ADD_EVENTS":
        return function (e, t, n, r) {
          n && (t = wt(t, n, r));
          return yn(e, t);
        }(e, t.eventStore, r ? r.activeRange : null, o);

      case "RESET_EVENTS":
        return t.eventStore;

      case "MERGE_EVENTS":
        return yn(e, t.eventStore);

      case "PREV":
      case "NEXT":
      case "CHANGE_DATE":
      case "CHANGE_VIEW_TYPE":
        return r ? wt(e, r.activeRange, o) : e;

      case "REMOVE_EVENTS":
        return function (e, t) {
          var n = e.defs,
              r = e.instances,
              o = {},
              i = {};

          for (var a in n) {
            t.defs[a] || (o[a] = n[a]);
          }

          for (var s in r) {
            !t.instances[s] && o[r[s].defId] && (i[s] = r[s]);
          }

          return {
            defs: o,
            instances: i
          };
        }(e, t.eventStore);

      case "REMOVE_EVENT_SOURCE":
        return ui(e, t.sourceId);

      case "REMOVE_ALL_EVENT_SOURCES":
        return En(e, function (e) {
          return !e.sourceId;
        });

      case "REMOVE_ALL_EVENTS":
        return {
          defs: {},
          instances: {}
        };

      default:
        return e;
    }
  }

  function li(e, t) {
    var n;

    if (t) {
      n = [];

      for (var r = 0, o = e; r < o.length; r++) {
        var i = o[r],
            a = t(i);
        a ? n.push(a) : null == a && n.push(i);
      }
    } else n = e;

    return n;
  }

  function ui(e, t) {
    return En(e, function (e) {
      return e.sourceId !== t;
    });
  }

  function ci(e, t) {
    switch (t.type) {
      case "UNSELECT_DATES":
        return null;

      case "SELECT_DATES":
        return t.selection;

      default:
        return e;
    }
  }

  function di(e, t) {
    switch (t.type) {
      case "UNSELECT_EVENT":
        return "";

      case "SELECT_EVENT":
        return t.eventInstanceId;

      default:
        return e;
    }
  }

  function pi(e, t) {
    var n;

    switch (t.type) {
      case "UNSET_EVENT_DRAG":
        return null;

      case "SET_EVENT_DRAG":
        return {
          affectedEvents: (n = t.state).affectedEvents,
          mutatedEvents: n.mutatedEvents,
          isEvent: n.isEvent
        };

      default:
        return e;
    }
  }

  function fi(e, t) {
    var n;

    switch (t.type) {
      case "UNSET_EVENT_RESIZE":
        return null;

      case "SET_EVENT_RESIZE":
        return {
          affectedEvents: (n = t.state).affectedEvents,
          mutatedEvents: n.mutatedEvents,
          isEvent: n.isEvent
        };

      default:
        return e;
    }
  }

  function hi(e, t, n, r, o) {
    var i = [];
    return {
      headerToolbar: e.headerToolbar ? vi(e.headerToolbar, e, t, n, r, o, i) : null,
      footerToolbar: e.footerToolbar ? vi(e.footerToolbar, e, t, n, r, o, i) : null,
      viewsWithButtons: i
    };
  }

  function vi(e, t, n, r, o, i, a) {
    return gt(e, function (e) {
      return function (e, t, n, r, o, i, a) {
        var s = "rtl" === t.direction,
            l = t.customButtons || {},
            u = n.buttonText || {},
            c = t.buttonText || {};
        return (e ? e.split(" ") : []).map(function (e) {
          return e.split(",").map(function (e) {
            return "title" === e ? {
              buttonName: e
            } : ((t = l[e]) ? (d = function d(e) {
              t.click && t.click.call(e.target, e, e.target);
            }, (p = r.getCustomButtonIconClass(t)) || (p = r.getIconClass(e, s)) || (f = t.text)) : (n = o[e]) ? (a.push(e), d = function d() {
              i.changeView(e);
            }, (f = n.buttonTextOverride) || (p = r.getIconClass(e, s)) || (f = n.buttonTextDefault)) : i[e] && (d = function d() {
              i[e]();
            }, (f = u[e]) || (p = r.getIconClass(e, s)) || (f = c[e])), {
              buttonName: e,
              buttonClick: d,
              buttonIcon: p,
              buttonText: f
            });
            var t, n, d, p, f;
          });
        });
      }(e, t, n, r, o, i, a);
    });
  }

  function gi(e, t, n, r, o) {
    var i = null;
    "GET" === (e = e.toUpperCase()) ? t = function (e, t) {
      return e + (-1 === e.indexOf("?") ? "?" : "&") + mi(t);
    }(t, n) : i = mi(n);
    var a = new XMLHttpRequest();
    a.open(e, t, !0), "GET" !== e && a.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"), a.onload = function () {
      if (a.status >= 200 && a.status < 400) {
        var e = !1,
            t = void 0;

        try {
          ;
          t = JSON.parse(a.responseText), e = !0;
        } catch (e) {}

        e ? r(t, a) : o("Failure parsing JSON", a);
      } else o("Request failed", a);
    }, a.onerror = function () {
      o("Request failed", a);
    }, a.send(i);
  }

  function mi(e) {
    var t = [];

    for (var n in e) {
      t.push(encodeURIComponent(n) + "=" + encodeURIComponent(e[n]));
    }

    return t.join("&");
  }

  function yi(e, t) {
    for (var n = yt(t.getCurrentData().eventSources), r = [], o = 0, i = e; o < i.length; o++) {
      for (var a = i[o], s = !1, l = 0; l < n.length; l += 1) {
        if (n[l]._raw === a) {
          n.splice(l, 1), s = !0;
          break;
        }
      }

      s || r.push(a);
    }

    for (var u = 0, c = n; u < c.length; u++) {
      var d = c[u];
      t.dispatch({
        type: "REMOVE_EVENT_SOURCE",
        sourceId: d.sourceId
      });
    }

    for (var p = 0, f = r; p < f.length; p++) {
      var h = f[p];
      t.calendarApi.addEventSource(h);
    }
  }

  var Ei = [Ho({
    eventSourceDefs: [{
      ignoreRange: !0,
      parseMeta: function parseMeta(e) {
        return Array.isArray(e.events) ? e.events : null;
      },
      fetch: function fetch(e, t) {
        t({
          rawEvents: e.eventSource.meta
        });
      }
    }]
  }), Ho({
    eventSourceDefs: [{
      parseMeta: function parseMeta(e) {
        return "function" == typeof e.events ? e.events : null;
      },
      fetch: function fetch(e, t, n) {
        var r = e.context.dateEnv;
        lo(e.eventSource.meta.bind(null, lr(e.range, r)), function (e) {
          t({
            rawEvents: e
          });
        }, n);
      }
    }]
  }), Ho({
    eventSourceRefiners: {
      method: String,
      extraParams: fn,
      startParam: String,
      endParam: String,
      timeZoneParam: String
    },
    eventSourceDefs: [{
      parseMeta: function parseMeta(e) {
        return !e.url || "json" !== e.format && e.format ? null : {
          url: e.url,
          format: "json",
          method: (e.method || "GET").toUpperCase(),
          extraParams: e.extraParams,
          startParam: e.startParam,
          endParam: e.endParam,
          timeZoneParam: e.timeZoneParam
        };
      },
      fetch: function fetch(e, t, n) {
        var o = e.eventSource.meta,
            i = function (e, t, n) {
          var o,
              i,
              a,
              s,
              l = n.dateEnv,
              u = n.options,
              c = {};
          null == (o = e.startParam) && (o = u.startParam);
          null == (i = e.endParam) && (i = u.endParam);
          null == (a = e.timeZoneParam) && (a = u.timeZoneParam);
          s = "function" == typeof e.extraParams ? e.extraParams() : e.extraParams || {};
          _r2(c, s), c[o] = l.formatIso(t.start), c[i] = l.formatIso(t.end), "local" !== l.timeZone && (c[a] = l.timeZone);
          return c;
        }(o, e.range, e.context);

        gi(o.method, o.url, i, function (e, n) {
          t({
            rawEvents: e,
            xhr: n
          });
        }, function (e, t) {
          n({
            message: e,
            xhr: t
          });
        });
      }
    }]
  }), Ho({
    recurringTypes: [{
      parse: function parse(e, t) {
        if (e.daysOfWeek || e.startTime || e.endTime || e.startRecur || e.endRecur) {
          var n = {
            daysOfWeek: e.daysOfWeek || null,
            startTime: e.startTime || null,
            endTime: e.endTime || null,
            startRecur: e.startRecur ? t.createMarker(e.startRecur) : null,
            endRecur: e.endRecur ? t.createMarker(e.endRecur) : null
          },
              r = void 0;
          return e.duration && (r = e.duration), !r && e.startTime && e.endTime && (o = e.endTime, i = e.startTime, r = {
            years: o.years - i.years,
            months: o.months - i.months,
            days: o.days - i.days,
            milliseconds: o.milliseconds - i.milliseconds
          }), {
            allDayGuess: Boolean(!e.startTime && !e.endTime),
            duration: r,
            typeData: n
          };
        }

        var o, i;
        return null;
      },
      expand: function expand(e, t, n) {
        var r = Wn(t, {
          start: e.startRecur,
          end: e.endRecur
        });
        return r ? function (e, t, n, r) {
          var o = e ? mt(e) : null,
              i = rt(n.start),
              a = n.end,
              s = [];

          for (; i < a;) {
            var l = void 0;
            o && !o[i.getUTCDay()] || (l = t ? r.add(i, t) : i, s.push(l)), i = Ke(i, 1);
          }

          return s;
        }(e.daysOfWeek, e.startTime, r, n) : [];
      }
    }],
    eventRefiners: {
      daysOfWeek: fn,
      startTime: kt,
      endTime: kt,
      duration: kt,
      startRecur: fn,
      endRecur: fn
    }
  }), Ho({
    optionChangeHandlers: {
      events: function events(e, t) {
        yi([e], t);
      },
      eventSources: yi
    }
  }), Ho({
    isLoadingFuncs: [function (e) {
      return ei(e.eventSources);
    }],
    contentTypeHandlers: {
      html: function html() {
        return {
          render: Si
        };
      },
      domNodes: function domNodes() {
        return {
          render: Di
        };
      }
    },
    propSetHandlers: {
      dateProfile: function dateProfile(e, t) {
        t.emitter.trigger("datesSet", _r2(_r2({}, lr(e.activeRange, t.dateEnv)), {
          view: t.viewApi
        }));
      },
      eventStore: function eventStore(e, t) {
        var n = t.emitter;
        n.hasHandlers("eventsSet") && n.trigger("eventsSet", Rr(e, t));
      }
    }
  })];

  function Si(e, t) {
    e.innerHTML = t;
  }

  function Di(e, t) {
    var n = Array.prototype.slice.call(e.childNodes),
        r = Array.prototype.slice.call(t);

    if (!Vt(n, r)) {
      for (var o = 0, i = r; o < i.length; o++) {
        var a = i[o];
        e.appendChild(a);
      }

      n.forEach(Ee);
    }
  }

  var bi = function () {
    function e(e) {
      ;
      this.drainedOption = e, this.isRunning = !1, this.isDirty = !1, this.pauseDepths = {}, this.timeoutId = 0;
    }

    return e.prototype.request = function (e) {
      ;
      this.isDirty = !0, this.isPaused() || (this.clearTimeout(), null == e ? this.tryDrain() : this.timeoutId = setTimeout(this.tryDrain.bind(this), e));
    }, e.prototype.pause = function (e) {
      void 0 === e && (e = "");
      var t = this.pauseDepths;
      t[e] = (t[e] || 0) + 1, this.clearTimeout();
    }, e.prototype.resume = function (e, t) {
      void 0 === e && (e = "");
      var n = this.pauseDepths;

      if (e in n) {
        if (t) delete n[e];else n[e] -= 1, n[e] <= 0 && delete n[e];
        this.tryDrain();
      }
    }, e.prototype.isPaused = function () {
      return Object.keys(this.pauseDepths).length;
    }, e.prototype.tryDrain = function () {
      if (!this.isRunning && !this.isPaused()) {
        for (this.isRunning = !0; this.isDirty;) {
          this.isDirty = !1, this.drained();
        }

        this.isRunning = !1;
      }
    }, e.prototype.clear = function () {
      this.clearTimeout(), this.isDirty = !1, this.pauseDepths = {};
    }, e.prototype.clearTimeout = function () {
      this.timeoutId && (clearTimeout(this.timeoutId), this.timeoutId = 0);
    }, e.prototype.drained = function () {
      this.drainedOption && this.drainedOption();
    }, e;
  }(),
      Ci = function () {
    function e(e, t) {
      ;
      this.runTaskOption = e, this.drainedOption = t, this.queue = [], this.delayedRunner = new bi(this.drain.bind(this));
    }

    return e.prototype.request = function (e, t) {
      this.queue.push(e), this.delayedRunner.request(t);
    }, e.prototype.pause = function (e) {
      this.delayedRunner.pause(e);
    }, e.prototype.resume = function (e, t) {
      this.delayedRunner.resume(e, t);
    }, e.prototype.drain = function () {
      for (var e = this.queue; e.length;) {
        for (var t = [], n = void 0; n = e.shift();) {
          this.runTask(n), t.push(n);
        }

        this.drained(t);
      }
    }, e.prototype.runTask = function (e) {
      this.runTaskOption && this.runTaskOption(e);
    }, e.prototype.drained = function (e) {
      this.drainedOption && this.drainedOption(e);
    }, e;
  }();

  function wi(e, t, n) {
    var r;
    return r = /^(year|month)$/.test(e.currentRangeUnit) ? e.currentRange : e.activeRange, n.formatRange(r.start, r.end, nn(t.titleFormat || function (e) {
      var t = e.currentRangeUnit;
      if ("year" === t) return {
        year: "numeric"
      };
      if ("month" === t) return {
        year: "numeric",
        month: "long"
      };
      var n = nt(e.currentRange.start, e.currentRange.end);
      if (null !== n && n > 1) return {
        year: "numeric",
        month: "short",
        day: "numeric"
      };
      return {
        year: "numeric",
        month: "long",
        day: "numeric"
      };
    }(e)), {
      isEndExclusive: e.isRangeAllDay,
      defaultSeparator: t.titleRangeSeparator
    });
  }

  var Ri = function () {
    function e(e) {
      var t = this;
      this.computeOptionsData = Ft(this._computeOptionsData), this.computeCurrentViewData = Ft(this._computeCurrentViewData), this.organizeRawLocales = Ft(Hr), this.buildLocale = Ft(Or), this.buildPluginHooks = Oo(), this.buildDateEnv = Ft(_i), this.buildTheme = Ft(Ti), this.parseToolbars = Ft(hi), this.buildViewSpecs = Ft(Xo), this.buildDateProfileGenerator = zt(ki), this.buildViewApi = Ft(xi), this.buildViewUiProps = zt(Ii), this.buildEventUiBySource = Ft(Mi, Et), this.buildEventUiBases = Ft(Pi), this.parseContextBusinessHours = zt(Hi), this.buildTitle = Ft(wi), this.emitter = new uo(), this.actionRunner = new Ci(this._handleAction.bind(this), this.updateData.bind(this)), this.currentCalendarOptionsInput = {}, this.currentCalendarOptionsRefined = {}, this.currentViewOptionsInput = {}, this.currentViewOptionsRefined = {}, this.currentCalendarOptionsRefiners = {}, this.getCurrentData = function () {
        return t.data;
      }, this.dispatch = function (e) {
        t.actionRunner.request(e);
      }, this.props = e, this.actionRunner.pause();
      var n = {},
          o = this.computeOptionsData(e.optionOverrides, n, e.calendarApi),
          i = o.calendarOptions.initialView || o.pluginHooks.initialView,
          a = this.computeCurrentViewData(i, o, e.optionOverrides, n);
      e.calendarApi.currentDataManager = this, this.emitter.setThisContext(e.calendarApi), this.emitter.setOptions(a.options);
      var s,
          l,
          u,
          c = (s = o.calendarOptions, l = o.dateEnv, null != (u = s.initialDate) ? l.createMarker(u) : Dr(s.now, l)),
          d = a.dateProfileGenerator.build(c);
      Bn(d.activeRange, c) || (c = d.currentRange.start);

      for (var p = {
        dateEnv: o.dateEnv,
        options: o.calendarOptions,
        pluginHooks: o.pluginHooks,
        calendarApi: e.calendarApi,
        dispatch: this.dispatch,
        emitter: this.emitter,
        getCurrentData: this.getCurrentData
      }, f = 0, h = o.pluginHooks.contextInit; f < h.length; f++) {
        ;
        (0, h[f])(p);
      }

      for (var v = Jo(o.calendarOptions, d, p), g = {
        dynamicOptionOverrides: n,
        currentViewType: i,
        currentDate: c,
        dateProfile: d,
        businessHours: this.parseContextBusinessHours(p),
        eventSources: v,
        eventUiBases: {},
        eventStore: {
          defs: {},
          instances: {}
        },
        renderableEventStore: {
          defs: {},
          instances: {}
        },
        dateSelection: null,
        eventSelection: "",
        eventDrag: null,
        eventResize: null,
        selectionConfig: this.buildViewUiProps(p).selectionConfig
      }, m = _r2(_r2({}, p), g), y = 0, E = o.pluginHooks.reducers; y < E.length; y++) {
        var S = E[y];

        _r2(g, S(null, null, m));
      }

      Ni(g, p) && this.emitter.trigger("loading", !0), this.state = g, this.updateData(), this.actionRunner.resume();
    }

    return e.prototype.resetOptions = function (e, t) {
      var n = this.props;
      n.optionOverrides = t ? _r2(_r2({}, n.optionOverrides), e) : e, this.actionRunner.request({
        type: "NOTHING"
      });
    }, e.prototype._handleAction = function (e) {
      var t = this,
          n = t.props,
          o = t.state,
          i = t.emitter,
          a = function (e, t) {
        var n;

        switch (t.type) {
          case "SET_OPTION":
            return _r2(_r2({}, e), ((n = {})[t.optionName] = t.rawOptionValue, n));

          default:
            return e;
        }
      }(o.dynamicOptionOverrides, e),
          s = this.computeOptionsData(n.optionOverrides, a, n.calendarApi),
          l = function (e, t) {
        switch (t.type) {
          case "CHANGE_VIEW_TYPE":
            e = t.viewType;
        }

        return e;
      }(o.currentViewType, e),
          u = this.computeCurrentViewData(l, s, n.optionOverrides, a);

      n.calendarApi.currentDataManager = this, i.setThisContext(n.calendarApi), i.setOptions(u.options);
      var c = {
        dateEnv: s.dateEnv,
        options: s.calendarOptions,
        pluginHooks: s.pluginHooks,
        calendarApi: n.calendarApi,
        dispatch: this.dispatch,
        emitter: i,
        getCurrentData: this.getCurrentData
      },
          d = o.currentDate,
          p = o.dateProfile;
      this.data && this.data.dateProfileGenerator !== u.dateProfileGenerator && (p = u.dateProfileGenerator.build(d)), p = function (e, t, n, r) {
        var o;

        switch (t.type) {
          case "CHANGE_VIEW_TYPE":
            return r.build(t.dateMarker || n);

          case "CHANGE_DATE":
            return r.build(t.dateMarker);

          case "PREV":
            if ((o = r.buildPrev(e, n)).isValid) return o;
            break;

          case "NEXT":
            if ((o = r.buildNext(e, n)).isValid) return o;
        }

        return e;
      }(p, e, d = function (e, t) {
        switch (t.type) {
          case "CHANGE_DATE":
            return t.dateMarker;

          default:
            return e;
        }
      }(d, e), u.dateProfileGenerator), "PREV" !== e.type && "NEXT" !== e.type && Bn(p.currentRange, d) || (d = p.currentRange.start);

      for (var f = Qo(o.eventSources, e, p, c), h = si(o.eventStore, e, f, p, c), v = ei(f) && !u.options.progressiveEventRendering && o.renderableEventStore || h, g = this.buildViewUiProps(c), m = g.eventUiSingleBase, y = g.selectionConfig, E = this.buildEventUiBySource(f), S = {
        dynamicOptionOverrides: a,
        currentViewType: l,
        currentDate: d,
        dateProfile: p,
        eventSources: f,
        eventStore: h,
        renderableEventStore: v,
        selectionConfig: y,
        eventUiBases: this.buildEventUiBases(v.defs, m, E),
        businessHours: this.parseContextBusinessHours(c),
        dateSelection: ci(o.dateSelection, e),
        eventSelection: di(o.eventSelection, e),
        eventDrag: pi(o.eventDrag, e),
        eventResize: fi(o.eventResize, e)
      }, D = _r2(_r2({}, c), S), b = 0, C = s.pluginHooks.reducers; b < C.length; b++) {
        var w = C[b];

        _r2(S, w(o, e, D));
      }

      var R = Ni(o, c),
          _ = Ni(S, c);

      !R && _ ? i.trigger("loading", !0) : R && !_ && i.trigger("loading", !1), this.state = S, n.onAction && n.onAction(e);
    }, e.prototype.updateData = function () {
      var e,
          t,
          n,
          o,
          i,
          a,
          s,
          l,
          u,
          c = this.props,
          d = this.state,
          p = this.data,
          f = this.computeOptionsData(c.optionOverrides, d.dynamicOptionOverrides, c.calendarApi),
          h = this.computeCurrentViewData(d.currentViewType, f, c.optionOverrides, d.dynamicOptionOverrides),
          v = this.data = _r2(_r2(_r2({
        viewTitle: this.buildTitle(d.dateProfile, h.options, f.dateEnv),
        calendarApi: c.calendarApi,
        dispatch: this.dispatch,
        emitter: this.emitter,
        getCurrentData: this.getCurrentData
      }, f), h), d),
          g = f.pluginHooks.optionChangeHandlers,
          m = p && p.calendarOptions,
          y = f.calendarOptions;

      if (m && m !== y) for (var E in m.timeZone !== y.timeZone && (d.eventSources = v.eventSources = (a = v.eventSources, s = d.dateProfile, l = v, u = s ? s.activeRange : null, ri(a, ii(a, l), u, !0, l)), d.eventStore = v.eventStore = (e = v.eventStore, t = p.dateEnv, n = v.dateEnv, o = e.defs, i = gt(e.instances, function (e) {
        var i = o[e.defId];
        return i.allDay || i.recurringDef ? e : _r2(_r2({}, e), {
          range: {
            start: n.createMarker(t.toDate(e.range.start, e.forcedStartTzo)),
            end: n.createMarker(t.toDate(e.range.end, e.forcedEndTzo))
          },
          forcedStartTzo: n.canComputeOffset ? null : e.forcedStartTzo,
          forcedEndTzo: n.canComputeOffset ? null : e.forcedEndTzo
        });
      }), {
        defs: o,
        instances: i
      })), g) {
        m[E] !== y[E] && g[E](y[E], v);
      }
      c.onData && c.onData(v);
    }, e.prototype._computeOptionsData = function (e, t, n) {
      var r = this.processRawCalendarOptions(e, t),
          o = r.refinedOptions,
          i = r.pluginHooks,
          a = r.localeDefaults,
          s = r.availableLocaleData;
      Oi(r.extra);
      var l = this.buildDateEnv(o.timeZone, o.locale, o.weekNumberCalculation, o.firstDay, o.weekText, i, s, o.defaultRangeSeparator),
          u = this.buildViewSpecs(i.views, e, t, a),
          c = this.buildTheme(o, i);
      return {
        calendarOptions: o,
        pluginHooks: i,
        dateEnv: l,
        viewSpecs: u,
        theme: c,
        toolbarConfig: this.parseToolbars(o, e, c, u, n),
        localeDefaults: a,
        availableRawLocales: s.map
      };
    }, e.prototype.processRawCalendarOptions = function (e, t) {
      var n = dn([on, e, t]),
          o = n.locales,
          i = n.locale,
          a = this.organizeRawLocales(o),
          s = a.map,
          l = this.buildLocale(i || a.defaultCode, s).options,
          u = this.buildPluginHooks(e.plugins || [], Ei),
          c = this.currentCalendarOptionsRefiners = _r2(_r2(_r2(_r2(_r2({}, rn), an), sn), u.listenerRefiners), u.optionRefiners),
          d = {},
          p = dn([on, l, e, t]),
          f = {},
          h = this.currentCalendarOptionsInput,
          v = this.currentCalendarOptionsRefined,
          g = !1;

      for (var m in p) {
        "plugins" !== m && (p[m] === h[m] || ln[m] && m in h && ln[m](h[m], p[m]) ? f[m] = v[m] : c[m] ? (f[m] = c[m](p[m]), g = !0) : d[m] = h[m]);
      }

      return g && (this.currentCalendarOptionsInput = p, this.currentCalendarOptionsRefined = f), {
        rawOptions: this.currentCalendarOptionsInput,
        refinedOptions: this.currentCalendarOptionsRefined,
        pluginHooks: u,
        availableLocaleData: a,
        localeDefaults: l,
        extra: d
      };
    }, e.prototype._computeCurrentViewData = function (e, t, n, r) {
      var o = t.viewSpecs[e];
      if (!o) throw new Error('viewType "' + e + "\" is not available. Please make sure you've loaded all neccessary plugins");
      var i = this.processRawViewOptions(o, t.pluginHooks, t.localeDefaults, n, r),
          a = i.refinedOptions;
      return Oi(i.extra), {
        viewSpec: o,
        options: a,
        dateProfileGenerator: this.buildDateProfileGenerator({
          dateProfileGeneratorClass: o.optionDefaults.dateProfileGeneratorClass,
          duration: o.duration,
          durationUnit: o.durationUnit,
          usesMinMaxTime: o.optionDefaults.usesMinMaxTime,
          dateEnv: t.dateEnv,
          calendarApi: this.props.calendarApi,
          slotMinTime: a.slotMinTime,
          slotMaxTime: a.slotMaxTime,
          showNonCurrentDates: a.showNonCurrentDates,
          dayCount: a.dayCount,
          dateAlignment: a.dateAlignment,
          dateIncrement: a.dateIncrement,
          hiddenDays: a.hiddenDays,
          weekends: a.weekends,
          nowInput: a.now,
          validRangeInput: a.validRange,
          visibleRangeInput: a.visibleRange,
          monthMode: a.monthMode,
          fixedWeekCount: a.fixedWeekCount
        }),
        viewApi: this.buildViewApi(e, this.getCurrentData, t.dateEnv)
      };
    }, e.prototype.processRawViewOptions = function (e, t, n, o, i) {
      var a = dn([on, e.optionDefaults, n, o, e.optionOverrides, i]),
          s = _r2(_r2(_r2(_r2(_r2(_r2({}, rn), an), sn), cn), t.listenerRefiners), t.optionRefiners),
          l = {},
          u = this.currentViewOptionsInput,
          c = this.currentViewOptionsRefined,
          d = !1,
          p = {};

      for (var f in a) {
        a[f] === u[f] ? l[f] = c[f] : (a[f] === this.currentCalendarOptionsInput[f] ? f in this.currentCalendarOptionsRefined && (l[f] = this.currentCalendarOptionsRefined[f]) : s[f] ? l[f] = s[f](a[f]) : p[f] = a[f], d = !0);
      }

      return d && (this.currentViewOptionsInput = a, this.currentViewOptionsRefined = l), {
        rawOptions: this.currentViewOptionsInput,
        refinedOptions: this.currentViewOptionsRefined,
        extra: p
      };
    }, e;
  }();

  function _i(e, t, n, r, o, i, a, s) {
    var l = Or(t || a.defaultCode, a.map);
    return new Pr({
      calendarSystem: "gregory",
      timeZone: e,
      namedTimeZoneImpl: i.namedTimeZonedImpl,
      locale: l,
      weekNumberCalculation: n,
      firstDay: r,
      weekText: o,
      cmdFormatter: i.cmdFormatter,
      defaultSeparator: s
    });
  }

  function Ti(e, t) {
    return new (t.themeClasses[e.themeSystem] || Ao)(e);
  }

  function ki(e) {
    return new (e.dateProfileGeneratorClass || $o)(e);
  }

  function xi(e, t, n) {
    return new mr(e, t, n);
  }

  function Mi(e) {
    return gt(e, function (e) {
      return e.ui;
    });
  }

  function Pi(e, t, n) {
    var r = {
      "": t
    };

    for (var o in e) {
      var i = e[o];
      i.sourceId && n[i.sourceId] && (r[o] = n[i.sourceId]);
    }

    return r;
  }

  function Ii(e) {
    var t = e.options;
    return {
      eventUiSingleBase: Cn({
        display: t.eventDisplay,
        editable: t.editable,
        startEditable: t.eventStartEditable,
        durationEditable: t.eventDurationEditable,
        constraint: t.eventConstraint,
        overlap: "boolean" == typeof t.eventOverlap ? t.eventOverlap : void 0,
        allow: t.eventAllow,
        backgroundColor: t.eventBackgroundColor,
        borderColor: t.eventBorderColor,
        textColor: t.eventTextColor,
        color: t.eventColor
      }, e),
      selectionConfig: Cn({
        constraint: t.selectConstraint,
        overlap: "boolean" == typeof t.selectOverlap ? t.selectOverlap : void 0,
        allow: t.selectAllow
      }, e)
    };
  }

  function Ni(e, t) {
    for (var n = 0, r = t.pluginHooks.isLoadingFuncs; n < r.length; n++) {
      if ((0, r[n])(e)) return !0;
    }

    return !1;
  }

  function Hi(e) {
    return Vr(e.options.businessHours, e);
  }

  function Oi(e, t) {
    for (var n in e) {
      console.warn("Unknown option '" + n + "'" + (t ? " for view '" + t + "'" : ""));
    }
  }

  var Ai = function (e) {
    function t(t) {
      var n = e.call(this, t) || this;
      return n.handleData = function (e) {
        n.dataManager ? n.setState(e) : n.state = e;
      }, n.dataManager = new Ri({
        optionOverrides: t.optionOverrides,
        calendarApi: t.calendarApi,
        onData: n.handleData
      }), n;
    }

    return n(t, e), t.prototype.render = function () {
      return this.props.children(this.state);
    }, t.prototype.componentDidUpdate = function (e) {
      var t = this.props.optionOverrides;
      t !== e.optionOverrides && this.dataManager.resetOptions(t);
    }, t;
  }(go);

  var Ui = function Ui(e) {
    this.timeZoneName = e;
  },
      Li = function () {
    function e() {
      ;
      this.strictOrder = !1, this.allowReslicing = !1, this.maxCoord = -1, this.maxStackCnt = -1, this.levelCoords = [], this.entriesByLevel = [], this.stackCnts = {};
    }

    return e.prototype.addSegs = function (e) {
      for (var t = [], n = 0, r = e; n < r.length; n++) {
        var o = r[n];
        this.insertEntry(o, t);
      }

      return t;
    }, e.prototype.insertEntry = function (e, t) {
      var n = this.findInsertion(e);
      return this.isInsertionValid(n, e) ? (this.insertEntryAt(e, n), 1) : this.handleInvalidInsertion(n, e, t);
    }, e.prototype.isInsertionValid = function (e, t) {
      return (-1 === this.maxCoord || e.levelCoord + t.thickness <= this.maxCoord) && (-1 === this.maxStackCnt || e.stackCnt < this.maxStackCnt);
    }, e.prototype.handleInvalidInsertion = function (e, t, n) {
      return this.allowReslicing && e.touchingEntry ? this.splitEntry(t, e.touchingEntry, n) : (n.push(t), 0);
    }, e.prototype.splitEntry = function (e, t, n) {
      var r = 0,
          i = [],
          a = e.span,
          s = t.span;
      return a.start < s.start && (r += this.insertEntry({
        index: e.index,
        thickness: e.thickness,
        span: {
          start: a.start,
          end: s.start
        }
      }, i)), a.end > s.end && (r += this.insertEntry({
        index: e.index,
        thickness: e.thickness,
        span: {
          start: s.end,
          end: a.end
        }
      }, i)), r ? (n.push.apply(n, o([{
        index: e.index,
        thickness: e.thickness,
        span: Bi(s, a)
      }], i)), r) : (n.push(e), 0);
    }, e.prototype.insertEntryAt = function (e, t) {
      var n = this.entriesByLevel,
          r = this.levelCoords,
          o = t.level;
      o >= r.length || r[o] > t.levelCoord ? (ji(r, o, t.levelCoord), ji(n, o, [e])) : ji(n[o], t.lateralEnd, e), this.stackCnts[Vi(e)] = t.stackCnt;
    }, e.prototype.findInsertion = function (e) {
      for (var t = this, n = t.levelCoords, r = t.entriesByLevel, o = t.stackCnts, i = t.strictOrder, a = n.length, s = 0, l = 0, u = 0, c = 0, d = -1, p = null, f = 0; f < a; f += 1) {
        var h = n[f];
        if (!i && h >= s + e.thickness) break;
        var v = r[f],
            g = void 0,
            m = Gi(v, e.span.start, Wi);

        for (c = u = m[0] + m[1]; (g = v[c]) && g.span.start < e.span.end;) {
          (i || s < h + g.thickness && s + e.thickness > h) && (s = h + g.thickness, d = f, p = g), c += 1;
        }

        h < s && (l = f + 1);
      }

      return {
        level: l,
        levelCoord: s,
        lateralStart: u,
        lateralEnd: c,
        touchingLevel: d,
        touchingEntry: p,
        stackCnt: p ? o[Vi(p)] + 1 : 0
      };
    }, e.prototype.toRects = function () {
      for (var e = this.entriesByLevel, t = this.levelCoords, n = e.length, o = [], i = 0; i < n; i += 1) {
        for (var a = e[i], s = t[i], l = 0, u = a; l < u.length; l++) {
          var c = u[l];
          o.push(_r2(_r2({}, c), {
            levelCoord: s
          }));
        }
      }

      return o;
    }, e;
  }();

  function Wi(e) {
    return e.span.end;
  }

  function Vi(e) {
    return e.index + ":" + e.span.start;
  }

  function Fi(e) {
    for (var t = [], n = 0, r = e; n < r.length; n++) {
      for (var o = r[n], i = [], a = {
        span: o.span,
        entries: [o]
      }, s = 0, l = t; s < l.length; s++) {
        var u = l[s];
        Bi(u.span, a.span) ? a = {
          entries: u.entries.concat(a.entries),
          span: zi(u.span, a.span)
        } : i.push(u);
      }

      i.push(a), t = i;
    }

    return t;
  }

  function zi(e, t) {
    return {
      start: Math.min(e.start, t.start),
      end: Math.max(e.end, t.end)
    };
  }

  function Bi(e, t) {
    var n = Math.max(e.start, t.start),
        r = Math.min(e.end, t.end);
    return n < r ? {
      start: n,
      end: r
    } : null;
  }

  function ji(e, t, n) {
    e.splice(t, 0, n);
  }

  function Gi(e, t, n) {
    var r = 0,
        o = e.length;
    if (!o || t < n(e[r])) return [0, 0];
    if (t > n(e[o - 1])) return [o, 0];

    for (; r < o;) {
      var i = Math.floor(r + (o - r) / 2),
          a = n(e[i]);
      if (t < a) o = i;else {
        if (!(t > a)) return [i, 1];
        r = i + 1;
      }
    }

    return [r, 0];
  }

  var qi = function () {
    function e(e) {
      ;
      this.component = e.component, this.isHitComboAllowed = e.isHitComboAllowed || null;
    }

    return e.prototype.destroy = function () {}, e;
  }();

  function Yi(e, t) {
    return {
      component: e,
      el: t.el,
      useEventCenter: null == t.useEventCenter || t.useEventCenter,
      isHitComboAllowed: t.isHitComboAllowed || null
    };
  }

  function Zi(e) {
    var t;
    return (t = {})[e.component.uid] = e, t;
  }

  var Xi = {},
      Ki = function () {
    function e(e, t) {
      this.emitter = new uo();
    }

    return e.prototype.destroy = function () {}, e.prototype.setMirrorIsVisible = function (e) {}, e.prototype.setMirrorNeedsRevert = function (e) {}, e.prototype.setAutoScrollEnabled = function (e) {}, e;
  }(),
      $i = {},
      Ji = {
    startTime: kt,
    duration: kt,
    create: Boolean,
    sourceId: String
  };

  function Qi(e) {
    var t = pn(e, Ji),
        n = t.refined,
        r = t.extra;
    return {
      startTime: n.startTime || null,
      duration: n.duration || null,
      create: null == n.create || n.create,
      sourceId: n.sourceId,
      leftoverProps: r
    };
  }

  var ea = function (e) {
    function t() {
      return null !== e && e.apply(this, arguments) || this;
    }

    return n(t, e), t.prototype.render = function () {
      var e = this,
          t = this.props.widgetGroups.map(function (t) {
        return e.renderWidgetGroup(t);
      });
      return mo.apply(void 0, o(["div", {
        className: "fc-toolbar-chunk"
      }], t));
    }, t.prototype.renderWidgetGroup = function (e) {
      for (var t = this.props, n = this.context.theme, i = [], a = !0, s = 0, l = e; s < l.length; s++) {
        var u = l[s],
            c = u.buttonName,
            d = u.buttonClick,
            p = u.buttonText,
            f = u.buttonIcon;
        if ("title" === c) a = !1, i.push(mo("h2", {
          className: "fc-toolbar-title"
        }, t.title));else {
          var h = f ? {
            "aria-label": c
          } : {},
              v = ["fc-" + c + "-button", n.getClass("button")];
          c === t.activeButton && v.push(n.getClass("buttonActive"));
          var g = !t.isTodayEnabled && "today" === c || !t.isPrevEnabled && "prev" === c || !t.isNextEnabled && "next" === c;
          i.push(mo("button", _r2({
            disabled: g,
            className: v.join(" "),
            onClick: d,
            type: "button"
          }, h), p || (f ? mo("span", {
            className: f
          }) : "")));
        }
      }

      if (i.length > 1) {
        var m = a && n.getClass("buttonGroup") || "";
        return mo.apply(void 0, o(["div", {
          className: m
        }], i));
      }

      return i[0];
    }, t;
  }(xo),
      ta = function (e) {
    function t() {
      return null !== e && e.apply(this, arguments) || this;
    }

    return n(t, e), t.prototype.render = function () {
      var e,
          t,
          n = this.props,
          r = n.model,
          o = n.extraClassName,
          i = !1,
          a = r.center;
      return r.left ? (i = !0, e = r.left) : e = r.start, r.right ? (i = !0, t = r.right) : t = r.end, mo("div", {
        className: [o || "", "fc-toolbar", i ? "fc-toolbar-ltr" : ""].join(" ")
      }, this.renderSection("start", e || []), this.renderSection("center", a || []), this.renderSection("end", t || []));
    }, t.prototype.renderSection = function (e, t) {
      var n = this.props;
      return mo(ea, {
        key: e,
        widgetGroups: t,
        title: n.title,
        activeButton: n.activeButton,
        isTodayEnabled: n.isTodayEnabled,
        isPrevEnabled: n.isPrevEnabled,
        isNextEnabled: n.isNextEnabled
      });
    }, t;
  }(xo),
      na = function (e) {
    function t() {
      var t = null !== e && e.apply(this, arguments) || this;
      return t.state = {
        availableWidth: null
      }, t.handleEl = function (e) {
        ;
        t.el = e, Io(t.props.elRef, e), t.updateAvailableWidth();
      }, t.handleResize = function () {
        t.updateAvailableWidth();
      }, t;
    }

    return n(t, e), t.prototype.render = function () {
      var e = this.props,
          t = this.state,
          n = e.aspectRatio,
          r = ["fc-view-harness", n || e.liquid || e.height ? "fc-view-harness-active" : "fc-view-harness-passive"],
          o = "",
          i = "";
      return n ? null !== t.availableWidth ? o = t.availableWidth / n : i = 1 / n * 100 + "%" : o = e.height || "", mo("div", {
        ref: this.handleEl,
        onClick: e.onClick,
        className: r.join(" "),
        style: {
          height: o,
          paddingBottom: i
        }
      }, e.children);
    }, t.prototype.componentDidMount = function () {
      this.context.addResizeHandler(this.handleResize);
    }, t.prototype.componentWillUnmount = function () {
      this.context.removeResizeHandler(this.handleResize);
    }, t.prototype.updateAvailableWidth = function () {
      this.el && this.props.aspectRatio && this.setState({
        availableWidth: this.el.offsetWidth
      });
    }, t;
  }(xo),
      ra = function (e) {
    function t(t) {
      var n = e.call(this, t) || this;
      return n.handleSegClick = function (e, t) {
        var r = n.component,
            o = r.context,
            i = Yn(t);

        if (i && r.isValidSegDownEl(e.target)) {
          var a = Se(e.target, ".fc-event-forced-url"),
              s = a ? a.querySelector("a[href]").href : "";
          o.emitter.trigger("eventClick", {
            el: t,
            event: new Cr(r.context, i.eventRange.def, i.eventRange.instance),
            jsEvent: e,
            view: o.viewApi
          }), s && !e.defaultPrevented && (window.location.href = s);
        }
      }, n.destroy = xe(t.el, "click", ".fc-event", n.handleSegClick), n;
    }

    return n(t, e), t;
  }(qi),
      oa = function (e) {
    function t(t) {
      var n,
          r,
          o,
          i,
          a,
          s = e.call(this, t) || this;
      return s.handleEventElRemove = function (e) {
        e === s.currentSegEl && s.handleSegLeave(null, s.currentSegEl);
      }, s.handleSegEnter = function (e, t) {
        Yn(t) && (s.currentSegEl = t, s.triggerEvent("eventMouseEnter", e, t));
      }, s.handleSegLeave = function (e, t) {
        s.currentSegEl && (s.currentSegEl = null, s.triggerEvent("eventMouseLeave", e, t));
      }, s.removeHoverListeners = (n = t.el, r = ".fc-event", o = s.handleSegEnter, i = s.handleSegLeave, xe(n, "mouseover", r, function (e, t) {
        if (t !== a) {
          ;
          a = t, o(e, t);

          var n = function n(e) {
            ;
            a = null, i(e, t), t.removeEventListener("mouseleave", n);
          };

          t.addEventListener("mouseleave", n);
        }
      })), s;
    }

    return n(t, e), t.prototype.destroy = function () {
      this.removeHoverListeners();
    }, t.prototype.triggerEvent = function (e, t, n) {
      var r = this.component,
          o = r.context,
          i = Yn(n);
      t && !r.isValidSegDownEl(t.target) || o.emitter.trigger(e, {
        el: n,
        event: new Cr(o, i.eventRange.def, i.eventRange.instance),
        jsEvent: t,
        view: o.viewApi
      });
    }, t;
  }(qi),
      ia = function (e) {
    function t() {
      var t = null !== e && e.apply(this, arguments) || this;
      return t.buildViewContext = Ft(To), t.buildViewPropTransformers = Ft(sa), t.buildToolbarProps = Ft(aa), t.handleNavLinkClick = ke("a[data-navlink]", t._handleNavLinkClick.bind(t)), t.headerRef = Eo(), t.footerRef = Eo(), t.interactionsStore = {}, t.registerInteractiveComponent = function (e, n) {
        var r = Yi(e, n),
            o = [ra, oa].concat(t.props.pluginHooks.componentInteractions).map(function (e) {
          return new e(r);
        });
        t.interactionsStore[e.uid] = o, Xi[e.uid] = r;
      }, t.unregisterInteractiveComponent = function (e) {
        for (var n = 0, r = t.interactionsStore[e.uid]; n < r.length; n++) {
          r[n].destroy();
        }

        delete t.interactionsStore[e.uid], delete Xi[e.uid];
      }, t.resizeRunner = new bi(function () {
        t.props.emitter.trigger("_resize", !0), t.props.emitter.trigger("windowResize", {
          view: t.props.viewApi
        });
      }), t.handleWindowResize = function (e) {
        var n = t.props.options;
        n.handleWindowResize && e.target === window && t.resizeRunner.request(n.windowResizeDelay);
      }, t;
    }

    return n(t, e), t.prototype.render = function () {
      var e,
          t = this.props,
          n = t.toolbarConfig,
          o = t.options,
          i = this.buildToolbarProps(t.viewSpec, t.dateProfile, t.dateProfileGenerator, t.currentDate, Dr(t.options.now, t.dateEnv), t.viewTitle),
          a = !1,
          s = "";
      t.isHeightAuto || t.forPrint ? s = "" : null != o.height ? a = !0 : null != o.contentHeight ? s = o.contentHeight : e = Math.max(o.aspectRatio, 0.5);
      var l = this.buildViewContext(t.viewSpec, t.viewApi, t.options, t.dateProfileGenerator, t.dateEnv, t.theme, t.pluginHooks, t.dispatch, t.getCurrentData, t.emitter, t.calendarApi, this.registerInteractiveComponent, this.unregisterInteractiveComponent);
      return mo(_o.Provider, {
        value: l
      }, n.headerToolbar && mo(ta, _r2({
        ref: this.headerRef,
        extraClassName: "fc-header-toolbar",
        model: n.headerToolbar
      }, i)), mo(na, {
        liquid: a,
        height: s,
        aspectRatio: e,
        onClick: this.handleNavLinkClick
      }, this.renderView(t), this.buildAppendContent()), n.footerToolbar && mo(ta, _r2({
        ref: this.footerRef,
        extraClassName: "fc-footer-toolbar",
        model: n.footerToolbar
      }, i)));
    }, t.prototype.componentDidMount = function () {
      var e = this.props;
      this.calendarInteractions = e.pluginHooks.calendarInteractions.map(function (t) {
        return new t(e);
      }), window.addEventListener("resize", this.handleWindowResize);
      var t = e.pluginHooks.propSetHandlers;

      for (var n in t) {
        t[n](e[n], e);
      }
    }, t.prototype.componentDidUpdate = function (e) {
      var t = this.props,
          n = t.pluginHooks.propSetHandlers;

      for (var r in n) {
        t[r] !== e[r] && n[r](t[r], t);
      }
    }, t.prototype.componentWillUnmount = function () {
      window.removeEventListener("resize", this.handleWindowResize), this.resizeRunner.clear();

      for (var e = 0, t = this.calendarInteractions; e < t.length; e++) {
        t[e].destroy();
      }

      this.props.emitter.trigger("_unmount");
    }, t.prototype._handleNavLinkClick = function (e, t) {
      var n = this.props,
          r = n.dateEnv,
          o = n.options,
          i = n.calendarApi,
          a = t.getAttribute("data-navlink");
      a = a ? JSON.parse(a) : {};
      var s = r.createMarker(a.date),
          l = a.type,
          u = "day" === l ? o.navLinkDayClick : "week" === l ? o.navLinkWeekClick : null;
      "function" == typeof u ? u.call(i, r.toDate(s), e) : ("string" == typeof u && (l = u), i.zoomTo(s, l));
    }, t.prototype.buildAppendContent = function () {
      var e = this.props,
          t = e.pluginHooks.viewContainerAppends.map(function (t) {
        return t(e);
      });
      return mo.apply(void 0, o([So, {}], t));
    }, t.prototype.renderView = function (e) {
      for (var t = e.pluginHooks, n = e.viewSpec, o = {
        dateProfile: e.dateProfile,
        businessHours: e.businessHours,
        eventStore: e.renderableEventStore,
        eventUiBases: e.eventUiBases,
        dateSelection: e.dateSelection,
        eventSelection: e.eventSelection,
        eventDrag: e.eventDrag,
        eventResize: e.eventResize,
        isHeightAuto: e.isHeightAuto,
        forPrint: e.forPrint
      }, i = 0, a = this.buildViewPropTransformers(t.viewPropsTransformers); i < a.length; i++) {
        var s = a[i];

        _r2(o, s.transform(o, e));
      }

      var l = n.component;
      return mo(l, _r2({}, o));
    }, t;
  }(ko);

  function aa(e, t, n, r, o, i) {
    var a = n.build(o, void 0, !1),
        s = n.buildPrev(t, r, !1),
        l = n.buildNext(t, r, !1);
    return {
      title: i,
      activeButton: e.type,
      isTodayEnabled: a.isValid && !Bn(t.currentRange, o),
      isPrevEnabled: s.isValid,
      isNextEnabled: l.isValid
    };
  }

  function sa(e) {
    return e.map(function (e) {
      return new e();
    });
  }

  var la = function (e) {
    function t() {
      var t = null !== e && e.apply(this, arguments) || this;
      return t.state = {
        forPrint: !1
      }, t.handleBeforePrint = function () {
        t.setState({
          forPrint: !0
        });
      }, t.handleAfterPrint = function () {
        t.setState({
          forPrint: !1
        });
      }, t;
    }

    return n(t, e), t.prototype.render = function () {
      var e = this.props,
          t = e.options,
          n = this.state.forPrint,
          r = n || "auto" === t.height || "auto" === t.contentHeight,
          o = r || null == t.height ? "" : t.height,
          i = ["fc", n ? "fc-media-print" : "fc-media-screen", "fc-direction-" + t.direction, e.theme.getClass("root")];
      return qr() || i.push("fc-liquid-hack"), e.children(i, o, r, n);
    }, t.prototype.componentDidMount = function () {
      var e = this.props.emitter;
      e.on("_beforeprint", this.handleBeforePrint), e.on("_afterprint", this.handleAfterPrint);
    }, t.prototype.componentWillUnmount = function () {
      var e = this.props.emitter;
      e.off("_beforeprint", this.handleBeforePrint), e.off("_afterprint", this.handleAfterPrint);
    }, t;
  }(xo);

  function ua(e, t) {
    return nn(!e || t > 10 ? {
      weekday: "short"
    } : t > 1 ? {
      weekday: "short",
      month: "numeric",
      day: "numeric",
      omitCommas: !0
    } : {
      weekday: "long"
    });
  }

  var ca = "fc-col-header-cell";

  function da(e) {
    return e.text;
  }

  var pa = function (e) {
    function t() {
      return null !== e && e.apply(this, arguments) || this;
    }

    return n(t, e), t.prototype.render = function () {
      var e = this.context,
          t = e.dateEnv,
          n = e.options,
          o = e.theme,
          i = e.viewApi,
          a = this.props,
          s = a.date,
          l = a.dateProfile,
          u = Kr(s, a.todayRange, null, l),
          c = [ca].concat($r(u, o)),
          d = t.format(s, a.dayHeaderFormat),
          p = n.navLinks && !u.isDisabled && a.colCnt > 1 ? {
        "data-navlink": Jr(s),
        tabIndex: 0
      } : {},
          f = _r2(_r2(_r2({
        date: t.toDate(s),
        view: i
      }, a.extraHookProps), {
        text: d
      }), u);

      return mo(Lo, {
        hookProps: f,
        classNames: n.dayHeaderClassNames,
        content: n.dayHeaderContent,
        defaultContent: da,
        didMount: n.dayHeaderDidMount,
        willUnmount: n.dayHeaderWillUnmount
      }, function (e, t, n, o) {
        return mo("th", _r2({
          ref: e,
          className: c.concat(t).join(" "),
          "data-date": u.isDisabled ? void 0 : Ut(s),
          colSpan: a.colSpan
        }, a.extraDataAttrs), mo("div", {
          className: "fc-scrollgrid-sync-inner"
        }, !u.isDisabled && mo("a", _r2({
          ref: n,
          className: ["fc-col-header-cell-cushion", a.isSticky ? "fc-sticky" : ""].join(" ")
        }, p), o)));
      });
    }, t;
  }(xo),
      fa = function (e) {
    function t() {
      return null !== e && e.apply(this, arguments) || this;
    }

    return n(t, e), t.prototype.render = function () {
      var e = this.props,
          t = this.context,
          n = t.dateEnv,
          o = t.theme,
          i = t.viewApi,
          a = t.options,
          s = Ke(new Date(2592e5), e.dow),
          l = {
        dow: e.dow,
        isDisabled: !1,
        isFuture: !1,
        isPast: !1,
        isToday: !1,
        isOther: !1
      },
          u = [ca].concat($r(l, o), e.extraClassNames || []),
          c = n.format(s, e.dayHeaderFormat),
          d = _r2(_r2(_r2(_r2({
        date: s
      }, l), {
        view: i
      }), e.extraHookProps), {
        text: c
      });

      return mo(Lo, {
        hookProps: d,
        classNames: a.dayHeaderClassNames,
        content: a.dayHeaderContent,
        defaultContent: da,
        didMount: a.dayHeaderDidMount,
        willUnmount: a.dayHeaderWillUnmount
      }, function (t, n, o, i) {
        return mo("th", _r2({
          ref: t,
          className: u.concat(n).join(" "),
          colSpan: e.colSpan
        }, e.extraDataAttrs), mo("div", {
          className: "fc-scrollgrid-sync-inner"
        }, mo("a", {
          className: ["fc-col-header-cell-cushion", e.isSticky ? "fc-sticky" : ""].join(" "),
          ref: o
        }, i)));
      });
    }, t;
  }(xo),
      ha = function (e) {
    function t(t, n) {
      var r = e.call(this, t, n) || this;
      return r.initialNowDate = Dr(n.options.now, n.dateEnv), r.initialNowQueriedMs = new Date().valueOf(), r.state = r.computeTiming().currentState, r;
    }

    return n(t, e), t.prototype.render = function () {
      var e = this.props,
          t = this.state;
      return e.children(t.nowDate, t.todayRange);
    }, t.prototype.componentDidMount = function () {
      this.setTimeout();
    }, t.prototype.componentDidUpdate = function (e) {
      e.unit !== this.props.unit && (this.clearTimeout(), this.setTimeout());
    }, t.prototype.componentWillUnmount = function () {
      this.clearTimeout();
    }, t.prototype.computeTiming = function () {
      var e = this.props,
          t = this.context,
          n = $e(this.initialNowDate, new Date().valueOf() - this.initialNowQueriedMs),
          r = t.dateEnv.startOf(n, e.unit),
          o = t.dateEnv.add(r, kt(1, e.unit)),
          i = o.valueOf() - n.valueOf();
      return i = Math.min(864e5, i), {
        currentState: {
          nowDate: r,
          todayRange: va(r)
        },
        nextState: {
          nowDate: o,
          todayRange: va(o)
        },
        waitMs: i
      };
    }, t.prototype.setTimeout = function () {
      var e = this,
          t = this.computeTiming(),
          n = t.nextState,
          r = t.waitMs;
      this.timeoutId = setTimeout(function () {
        e.setState(n, function () {
          e.setTimeout();
        });
      }, r);
    }, t.prototype.clearTimeout = function () {
      this.timeoutId && clearTimeout(this.timeoutId);
    }, t.contextType = _o, t;
  }(go);

  function va(e) {
    var t = rt(e);
    return {
      start: t,
      end: Ke(t, 1)
    };
  }

  var ga = function (e) {
    function t() {
      var t = null !== e && e.apply(this, arguments) || this;
      return t.createDayHeaderFormatter = Ft(ma), t;
    }

    return n(t, e), t.prototype.render = function () {
      var e = this.context,
          t = this.props,
          n = t.dates,
          r = t.dateProfile,
          o = t.datesRepDistinctDays,
          i = t.renderIntro,
          a = this.createDayHeaderFormatter(e.options.dayHeaderFormat, o, n.length);
      return mo(ha, {
        unit: "day"
      }, function (e, t) {
        return mo("tr", null, i && i("day"), n.map(function (e) {
          return o ? mo(pa, {
            key: e.toISOString(),
            date: e,
            dateProfile: r,
            todayRange: t,
            colCnt: n.length,
            dayHeaderFormat: a
          }) : mo(fa, {
            key: e.getUTCDay(),
            dow: e.getUTCDay(),
            dayHeaderFormat: a
          });
        }));
      });
    }, t;
  }(xo);

  function ma(e, t, n) {
    return e || ua(t, n);
  }

  var ya = function () {
    function e(e, t) {
      for (var n = e.start, r = e.end, o = [], i = [], a = -1; n < r;) {
        t.isHiddenDay(n) ? o.push(a + 0.5) : (a += 1, o.push(a), i.push(n)), n = Ke(n, 1);
      }

      this.dates = i, this.indices = o, this.cnt = i.length;
    }

    return e.prototype.sliceRange = function (e) {
      var t = this.getDateDayIndex(e.start),
          n = this.getDateDayIndex(Ke(e.end, -1)),
          r = Math.max(0, t),
          o = Math.min(this.cnt - 1, n);
      return (r = Math.ceil(r)) <= (o = Math.floor(o)) ? {
        firstIndex: r,
        lastIndex: o,
        isStart: t === r,
        isEnd: n === o
      } : null;
    }, e.prototype.getDateDayIndex = function (e) {
      var t = this.indices,
          n = Math.floor(Qe(this.dates[0], e));
      return n < 0 ? t[0] - 1 : n >= t.length ? t[t.length - 1] + 1 : t[n];
    }, e;
  }(),
      Ea = function () {
    function e(e, t) {
      var n,
          r,
          o,
          i = e.dates;

      if (t) {
        for (r = i[0].getUTCDay(), n = 1; n < i.length && i[n].getUTCDay() !== r; n += 1) {
          ;
        }

        o = Math.ceil(i.length / n);
      } else o = 1, n = i.length;

      this.rowCnt = o, this.colCnt = n, this.daySeries = e, this.cells = this.buildCells(), this.headerDates = this.buildHeaderDates();
    }

    return e.prototype.buildCells = function () {
      for (var e = [], t = 0; t < this.rowCnt; t += 1) {
        for (var n = [], r = 0; r < this.colCnt; r += 1) {
          n.push(this.buildCell(t, r));
        }

        e.push(n);
      }

      return e;
    }, e.prototype.buildCell = function (e, t) {
      var n = this.daySeries.dates[e * this.colCnt + t];
      return {
        key: n.toISOString(),
        date: n
      };
    }, e.prototype.buildHeaderDates = function () {
      for (var e = [], t = 0; t < this.colCnt; t += 1) {
        e.push(this.cells[0][t].date);
      }

      return e;
    }, e.prototype.sliceRange = function (e) {
      var t = this.colCnt,
          n = this.daySeries.sliceRange(e),
          r = [];
      if (n) for (var o = n.firstIndex, i = n.lastIndex, a = o; a <= i;) {
        var s = Math.floor(a / t),
            l = Math.min((s + 1) * t, i + 1);
        r.push({
          row: s,
          firstCol: a % t,
          lastCol: (l - 1) % t,
          isStart: n.isStart && a === o,
          isEnd: n.isEnd && l - 1 === i
        }), a = l;
      }
      return r;
    }, e;
  }(),
      Sa = function () {
    function e() {
      ;
      this.sliceBusinessHours = Ft(this._sliceBusinessHours), this.sliceDateSelection = Ft(this._sliceDateSpan), this.sliceEventStore = Ft(this._sliceEventStore), this.sliceEventDrag = Ft(this._sliceInteraction), this.sliceEventResize = Ft(this._sliceInteraction), this.forceDayIfListItem = !1;
    }

    return e.prototype.sliceProps = function (e, t, n, r) {
      for (var i = [], a = 4; a < arguments.length; a++) {
        i[a - 4] = arguments[a];
      }

      var s = e.eventUiBases,
          l = this.sliceEventStore.apply(this, o([e.eventStore, s, t, n], i));
      return {
        dateSelectionSegs: this.sliceDateSelection.apply(this, o([e.dateSelection, s, r], i)),
        businessHourSegs: this.sliceBusinessHours.apply(this, o([e.businessHours, t, n, r], i)),
        fgEventSegs: l.fg,
        bgEventSegs: l.bg,
        eventDrag: this.sliceEventDrag.apply(this, o([e.eventDrag, s, t, n], i)),
        eventResize: this.sliceEventResize.apply(this, o([e.eventResize, s, t, n], i)),
        eventSelection: e.eventSelection
      };
    }, e.prototype.sliceNowDate = function (e, t) {
      for (var n = [], r = 2; r < arguments.length; r++) {
        n[r - 2] = arguments[r];
      }

      return this._sliceDateSpan.apply(this, o([{
        range: {
          start: e,
          end: $e(e, 1)
        },
        allDay: !1
      }, {}, t], n));
    }, e.prototype._sliceBusinessHours = function (e, t, n, r) {
      for (var i = [], a = 4; a < arguments.length; a++) {
        i[a - 4] = arguments[a];
      }

      return e ? this._sliceEventStore.apply(this, o([wt(e, Da(t, Boolean(n)), r), {}, t, n], i)).bg : [];
    }, e.prototype._sliceEventStore = function (e, t, n, r) {
      for (var o = [], i = 4; i < arguments.length; i++) {
        o[i - 4] = arguments[i];
      }

      if (e) {
        var a = jn(e, t, Da(n, Boolean(r)), r);
        return {
          bg: this.sliceEventRanges(a.bg, o),
          fg: this.sliceEventRanges(a.fg, o)
        };
      }

      return {
        bg: [],
        fg: []
      };
    }, e.prototype._sliceInteraction = function (e, t, n, r) {
      for (var o = [], i = 4; i < arguments.length; i++) {
        o[i - 4] = arguments[i];
      }

      if (!e) return null;
      var a = jn(e.mutatedEvents, t, Da(n, Boolean(r)), r);
      return {
        segs: this.sliceEventRanges(a.fg, o),
        affectedInstances: e.affectedEvents.instances,
        isEvent: e.isEvent
      };
    }, e.prototype._sliceDateSpan = function (e, t, n) {
      for (var r = [], i = 3; i < arguments.length; i++) {
        r[i - 3] = arguments[i];
      }

      if (!e) return [];

      for (var a = cr(e, t, n), s = this.sliceRange.apply(this, o([e.range], r)), l = 0, u = s; l < u.length; l++) {
        var c = u[l];
        c.eventRange = a;
      }

      return s;
    }, e.prototype.sliceEventRanges = function (e, t) {
      for (var n = [], r = 0, o = e; r < o.length; r++) {
        var i = o[r];
        n.push.apply(n, this.sliceEventRange(i, t));
      }

      return n;
    }, e.prototype.sliceEventRange = function (e, t) {
      var n = e.range;
      this.forceDayIfListItem && "list-item" === e.ui.display && (n = {
        start: n.start,
        end: Ke(n.start, 1)
      });

      for (var r = this.sliceRange.apply(this, o([n], t)), i = 0, a = r; i < a.length; i++) {
        var s = a[i];
        s.eventRange = e, s.isStart = e.isStart && s.isStart, s.isEnd = e.isEnd && s.isEnd;
      }

      return r;
    }, e;
  }();

  function Da(e, t) {
    var n = e.activeRange;
    return t ? n : {
      start: $e(n.start, e.slotMinTime.milliseconds),
      end: $e(n.end, e.slotMaxTime.milliseconds - 864e5)
    };
  }

  function ba(e, t, n) {
    var r = e.mutatedEvents.instances;

    for (var o in r) {
      if (!zn(t.validRange, r[o].range)) return !1;
    }

    return wa({
      eventDrag: e
    }, n);
  }

  function Ca(e, t, n) {
    return !!zn(t.validRange, e.range) && wa({
      dateSelection: e
    }, n);
  }

  function wa(e, t) {
    var n = t.getCurrentData(),
        o = _r2({
      businessHours: n.businessHours,
      dateSelection: "",
      eventStore: n.eventStore,
      eventUiBases: n.eventUiBases,
      eventSelection: "",
      eventDrag: null,
      eventResize: null
    }, e);

    return (t.pluginHooks.isPropsValid || Ra)(o, t);
  }

  function Ra(e, t, n, o) {
    return void 0 === n && (n = {}), !(e.eventDrag && !function (e, t, n, o) {
      var i = t.getCurrentData(),
          a = e.eventDrag,
          s = a.mutatedEvents,
          l = s.defs,
          u = s.instances,
          c = Zn(l, a.isEvent ? e.eventUiBases : {
        "": i.selectionConfig
      });
      o && (c = gt(c, o));
      var d = (v = e.eventStore, g = a.affectedEvents.instances, {
        defs: v.defs,
        instances: vt(v.instances, function (e) {
          return !g[e.instanceId];
        })
      }),
          p = d.defs,
          f = d.instances,
          h = Zn(p, e.eventUiBases);
      var v, g;

      for (var m in u) {
        var y = u[m],
            E = y.range,
            S = c[y.defId],
            D = l[y.defId];
        if (!_a(S.constraints, E, d, e.businessHours, t)) return !1;
        var b = t.options.eventOverlap,
            C = "function" == typeof b ? b : null;

        for (var w in f) {
          var R = f[w];

          if (Fn(E, R.range)) {
            if (!1 === h[R.defId].overlap && a.isEvent) return !1;
            if (!1 === S.overlap) return !1;
            if (C && !C(new Cr(t, p[R.defId], R), new Cr(t, D, y))) return !1;
          }
        }

        for (var _ = i.eventStore, T = 0, k = S.allows; T < k.length; T++) {
          var x = k[T],
              M = _r2(_r2({}, n), {
            range: y.range,
            allDay: D.allDay
          }),
              P = _.defs[D.defId],
              I = _.instances[m],
              N = void 0;

          if (N = P ? new Cr(t, P, I) : new Cr(t, D), !x(pr(M, t), N)) return !1;
        }
      }

      return !0;
    }(e, t, n, o)) && !(e.dateSelection && !function (e, t, n, o) {
      var i = e.eventStore,
          a = i.defs,
          s = i.instances,
          l = e.dateSelection,
          u = l.range,
          c = t.getCurrentData().selectionConfig;
      o && (c = o(c));
      if (!_a(c.constraints, u, i, e.businessHours, t)) return !1;
      var d = t.options.selectOverlap,
          p = "function" == typeof d ? d : null;

      for (var f in s) {
        var h = s[f];

        if (Fn(u, h.range)) {
          if (!1 === c.overlap) return !1;
          if (p && !p(new Cr(t, a[h.defId], h), null)) return !1;
        }
      }

      for (var v = 0, g = c.allows; v < g.length; v++) {
        if (!(0, g[v])(pr(_r2(_r2({}, n), l), t), null)) return !1;
      }

      return !0;
    }(e, t, n, o));
  }

  function _a(e, t, n, r, o) {
    for (var i = 0, a = e; i < a.length; i++) {
      if (!xa(Ta(a[i], t, n, r, o), t)) return !1;
    }

    return !0;
  }

  function Ta(e, t, n, r, o) {
    return "businessHours" === e ? ka(wt(r, t, o)) : "string" == typeof e ? ka(En(n, function (t) {
      return t.groupId === e;
    })) : "object" == _typeof(e) && e ? ka(wt(e, t, o)) : [];
  }

  function ka(e) {
    var t = e.instances,
        n = [];

    for (var r in t) {
      n.push(t[r].range);
    }

    return n;
  }

  function xa(e, t) {
    for (var n = 0, r = e; n < r.length; n++) {
      if (zn(r[n], t)) return !0;
    }

    return !1;
  }

  var Ma = /^(visible|hidden)$/,
      Pa = function (e) {
    function t() {
      var t = null !== e && e.apply(this, arguments) || this;
      return t.handleEl = function (e) {
        ;
        t.el = e, Io(t.props.elRef, e);
      }, t;
    }

    return n(t, e), t.prototype.render = function () {
      var e = this.props,
          t = e.liquid,
          n = e.liquidIsAbsolute,
          r = t && n,
          o = ["fc-scroller"];
      return t && (n ? o.push("fc-scroller-liquid-absolute") : o.push("fc-scroller-liquid")), mo("div", {
        ref: this.handleEl,
        className: o.join(" "),
        style: {
          overflowX: e.overflowX,
          overflowY: e.overflowY,
          left: r && -(e.overcomeLeft || 0) || "",
          right: r && -(e.overcomeRight || 0) || "",
          bottom: r && -(e.overcomeBottom || 0) || "",
          marginLeft: !r && -(e.overcomeLeft || 0) || "",
          marginRight: !r && -(e.overcomeRight || 0) || "",
          marginBottom: !r && -(e.overcomeBottom || 0) || "",
          maxHeight: e.maxHeight || ""
        }
      }, e.children);
    }, t.prototype.needsXScrolling = function () {
      if (Ma.test(this.props.overflowX)) return !1;

      for (var e = this.el, t = this.el.getBoundingClientRect().width - this.getYScrollbarWidth(), n = e.children, r = 0; r < n.length; r += 1) {
        if (n[r].getBoundingClientRect().width > t) return !0;
      }

      return !1;
    }, t.prototype.needsYScrolling = function () {
      if (Ma.test(this.props.overflowY)) return !1;

      for (var e = this.el, t = this.el.getBoundingClientRect().height - this.getXScrollbarWidth(), n = e.children, r = 0; r < n.length; r += 1) {
        if (n[r].getBoundingClientRect().height > t) return !0;
      }

      return !1;
    }, t.prototype.getXScrollbarWidth = function () {
      return Ma.test(this.props.overflowX) ? 0 : this.el.offsetHeight - this.el.clientHeight;
    }, t.prototype.getYScrollbarWidth = function () {
      return Ma.test(this.props.overflowY) ? 0 : this.el.offsetWidth - this.el.clientWidth;
    }, t;
  }(xo),
      Ia = function () {
    function e(e) {
      var t = this;
      this.masterCallback = e, this.currentMap = {}, this.depths = {}, this.callbackMap = {}, this.handleValue = function (e, n) {
        var r = t,
            o = r.depths,
            i = r.currentMap,
            a = !1,
            s = !1;
        null !== e ? (a = n in i, i[n] = e, o[n] = (o[n] || 0) + 1, s = !0) : (o[n] -= 1, o[n] || (delete i[n], delete t.callbackMap[n], a = !0)), t.masterCallback && (a && t.masterCallback(null, String(n)), s && t.masterCallback(e, String(n)));
      };
    }

    return e.prototype.createRef = function (e) {
      var t = this,
          n = this.callbackMap[e];
      return n || (n = this.callbackMap[e] = function (n) {
        t.handleValue(n, String(e));
      }), n;
    }, e.prototype.collect = function (e, t, n) {
      return Ct(this.currentMap, e, t, n);
    }, e.prototype.getAll = function () {
      return yt(this.currentMap);
    }, e;
  }();

  function Na(e) {
    for (var t = 0, n = 0, r = be(e, ".fc-scrollgrid-shrink"); n < r.length; n++) {
      var o = r[n];
      t = Math.max(t, Ye(o));
    }

    return Math.ceil(t);
  }

  function Ha(e, t) {
    return e.liquid && t.liquid;
  }

  function Oa(e, t) {
    return null != t.maxHeight || Ha(e, t);
  }

  function Aa(e, t, n) {
    var r = n.expandRows;
    return "function" == typeof t.content ? t.content(n) : mo("table", {
      className: [t.tableClassName, e.syncRowHeights ? "fc-scrollgrid-sync-table" : ""].join(" "),
      style: {
        minWidth: n.tableMinWidth,
        width: n.clientWidth,
        height: r ? n.clientHeight : ""
      }
    }, n.tableColGroupNode, mo("tbody", {}, "function" == typeof t.rowContent ? t.rowContent(n) : t.rowContent));
  }

  function Ua(e, t) {
    return Vt(e, t, Et);
  }

  function La(e, t) {
    for (var n = [], r = 0, i = e; r < i.length; r++) {
      for (var a = i[r], s = a.span || 1, l = 0; l < s; l += 1) {
        n.push(mo("col", {
          style: {
            width: "shrink" === a.width ? Wa(t) : a.width || "",
            minWidth: a.minWidth || ""
          }
        }));
      }
    }

    return mo.apply(void 0, o(["colgroup", {}], n));
  }

  function Wa(e) {
    return null == e ? 4 : e;
  }

  function Va(e) {
    for (var t = 0, n = e; t < n.length; t++) {
      if ("shrink" === n[t].width) return !0;
    }

    return !1;
  }

  function Fa(e, t) {
    var n = ["fc-scrollgrid", t.theme.getClass("table")];
    return e && n.push("fc-scrollgrid-liquid"), n;
  }

  function za(e, t) {
    var n = ["fc-scrollgrid-section", "fc-scrollgrid-section-" + e.type, e.className];
    return t && e.liquid && null == e.maxHeight && n.push("fc-scrollgrid-section-liquid"), e.isSticky && n.push("fc-scrollgrid-section-sticky"), n;
  }

  function Ba(e) {
    return mo("div", {
      className: "fc-scrollgrid-sticky-shim",
      style: {
        width: e.clientWidth,
        minWidth: e.tableMinWidth
      }
    });
  }

  function ja(e) {
    var t = e.stickyHeaderDates;
    return null != t && "auto" !== t || (t = "auto" === e.height || "auto" === e.viewHeight), t;
  }

  function Ga(e) {
    var t = e.stickyFooterScrollbar;
    return null != t && "auto" !== t || (t = "auto" === e.height || "auto" === e.viewHeight), t;
  }

  var qa = function (e) {
    function t() {
      var t = null !== e && e.apply(this, arguments) || this;
      return t.processCols = Ft(function (e) {
        return e;
      }, Ua), t.renderMicroColGroup = Ft(La), t.scrollerRefs = new Ia(), t.scrollerElRefs = new Ia(t._handleScrollerEl.bind(t)), t.state = {
        shrinkWidth: null,
        forceYScrollbars: !1,
        scrollerClientWidths: {},
        scrollerClientHeights: {}
      }, t.handleSizing = function () {
        t.setState(_r2({
          shrinkWidth: t.computeShrinkWidth()
        }, t.computeScrollerDims()));
      }, t;
    }

    return n(t, e), t.prototype.render = function () {
      var e = this,
          t = e.props,
          n = e.state,
          r = e.context,
          i = t.sections || [],
          a = this.processCols(t.cols),
          s = this.renderMicroColGroup(a, n.shrinkWidth),
          l = Fa(t.liquid, r);
      t.collapsibleWidth && l.push("fc-scrollgrid-collapsible");

      for (var u, c = i.length, d = 0, p = [], f = [], h = []; d < c && "header" === (u = i[d]).type;) {
        p.push(this.renderSection(u, s)), d += 1;
      }

      for (; d < c && "body" === (u = i[d]).type;) {
        f.push(this.renderSection(u, s)), d += 1;
      }

      for (; d < c && "footer" === (u = i[d]).type;) {
        h.push(this.renderSection(u, s)), d += 1;
      }

      var v = !qr();
      return mo("table", {
        className: l.join(" "),
        style: {
          height: t.height
        }
      }, Boolean(!v && p.length) && mo.apply(void 0, o(["thead", {}], p)), Boolean(!v && f.length) && mo.apply(void 0, o(["tbody", {}], f)), Boolean(!v && h.length) && mo.apply(void 0, o(["tfoot", {}], h)), v && mo.apply(void 0, o(o(o(["tbody", {}], p), f), h)));
    }, t.prototype.renderSection = function (e, t) {
      return "outerContent" in e ? mo(So, {
        key: e.key
      }, e.outerContent) : mo("tr", {
        key: e.key,
        className: za(e, this.props.liquid).join(" ")
      }, this.renderChunkTd(e, t, e.chunk));
    }, t.prototype.renderChunkTd = function (e, t, n) {
      if ("outerContent" in n) return n.outerContent;
      var r = this.props,
          o = this.state,
          i = o.forceYScrollbars,
          a = o.scrollerClientWidths,
          s = o.scrollerClientHeights,
          l = Oa(r, e),
          u = Ha(r, e),
          c = r.liquid ? i ? "scroll" : l ? "auto" : "hidden" : "visible",
          d = e.key,
          p = Aa(e, n, {
        tableColGroupNode: t,
        tableMinWidth: "",
        clientWidth: r.collapsibleWidth || void 0 === a[d] ? null : a[d],
        clientHeight: void 0 !== s[d] ? s[d] : null,
        expandRows: e.expandRows,
        syncRowHeights: !1,
        rowSyncHeights: [],
        reportRowHeightChange: function reportRowHeightChange() {}
      });
      return mo("td", {
        ref: n.elRef
      }, mo("div", {
        className: "fc-scroller-harness" + (u ? " fc-scroller-harness-liquid" : "")
      }, mo(Pa, {
        ref: this.scrollerRefs.createRef(d),
        elRef: this.scrollerElRefs.createRef(d),
        overflowY: c,
        overflowX: r.liquid ? "hidden" : "visible",
        maxHeight: e.maxHeight,
        liquid: u,
        liquidIsAbsolute: !0
      }, p)));
    }, t.prototype._handleScrollerEl = function (e, t) {
      var n = function (e, t) {
        for (var n = 0, r = e; n < r.length; n++) {
          var o = r[n];
          if (o.key === t) return o;
        }

        return null;
      }(this.props.sections, t);

      n && Io(n.chunk.scrollerElRef, e);
    }, t.prototype.componentDidMount = function () {
      this.handleSizing(), this.context.addResizeHandler(this.handleSizing);
    }, t.prototype.componentDidUpdate = function () {
      this.handleSizing();
    }, t.prototype.componentWillUnmount = function () {
      this.context.removeResizeHandler(this.handleSizing);
    }, t.prototype.computeShrinkWidth = function () {
      return Va(this.props.cols) ? Na(this.scrollerElRefs.getAll()) : 0;
    }, t.prototype.computeScrollerDims = function () {
      var e = no(),
          t = this.scrollerRefs,
          n = this.scrollerElRefs,
          r = !1,
          o = {},
          i = {};

      for (var a in t.currentMap) {
        var s = t.currentMap[a];

        if (s && s.needsYScrolling()) {
          r = !0;
          break;
        }
      }

      for (var l = 0, u = this.props.sections; l < u.length; l++) {
        a = u[l].key;
        var c = n.currentMap[a];

        if (c) {
          var d = c.parentNode;
          o[a] = Math.floor(d.getBoundingClientRect().width - (r ? e.y : 0)), i[a] = Math.floor(d.getBoundingClientRect().height);
        }
      }

      return {
        forceYScrollbars: r,
        scrollerClientWidths: o,
        scrollerClientHeights: i
      };
    }, t;
  }(xo);

  qa.addStateEquality({
    scrollerClientWidths: Et,
    scrollerClientHeights: Et
  });

  var Ya = function (e) {
    function t() {
      var t = null !== e && e.apply(this, arguments) || this;
      return t.elRef = Eo(), t;
    }

    return n(t, e), t.prototype.render = function () {
      var e = this.props,
          t = this.context,
          n = t.options,
          r = e.seg,
          o = r.eventRange,
          i = o.ui,
          a = {
        event: new Cr(t, o.def, o.instance),
        view: t.viewApi,
        timeText: e.timeText,
        textColor: i.textColor,
        backgroundColor: i.backgroundColor,
        borderColor: i.borderColor,
        isDraggable: !e.disableDragging && Jn(r, t),
        isStartResizable: !e.disableResizing && Qn(r, t),
        isEndResizable: !e.disableResizing && er(r),
        isMirror: Boolean(e.isDragging || e.isResizing || e.isDateSelecting),
        isStart: Boolean(r.isStart),
        isEnd: Boolean(r.isEnd),
        isPast: Boolean(e.isPast),
        isFuture: Boolean(e.isFuture),
        isToday: Boolean(e.isToday),
        isSelected: Boolean(e.isSelected),
        isDragging: Boolean(e.isDragging),
        isResizing: Boolean(e.isResizing)
      },
          s = rr(a).concat(i.classNames);
      return mo(Lo, {
        hookProps: a,
        classNames: n.eventClassNames,
        content: n.eventContent,
        defaultContent: e.defaultContent,
        didMount: n.eventDidMount,
        willUnmount: n.eventWillUnmount,
        elRef: this.elRef
      }, function (t, n, r, o) {
        return e.children(t, s.concat(n), r, o, a);
      });
    }, t.prototype.componentDidMount = function () {
      qn(this.elRef.current, this.props.seg);
    }, t.prototype.componentDidUpdate = function (e) {
      var t = this.props.seg;
      t !== e.seg && qn(this.elRef.current, t);
    }, t;
  }(xo),
      Za = function (e) {
    function t() {
      return null !== e && e.apply(this, arguments) || this;
    }

    return n(t, e), t.prototype.render = function () {
      var e = this.props,
          t = this.context,
          n = e.seg,
          o = t.options.eventTimeFormat || e.defaultTimeFormat,
          i = tr(n, o, t, e.defaultDisplayEventTime, e.defaultDisplayEventEnd);
      return mo(Ya, {
        seg: n,
        timeText: i,
        disableDragging: e.disableDragging,
        disableResizing: e.disableResizing,
        defaultContent: e.defaultContent || Xa,
        isDragging: e.isDragging,
        isResizing: e.isResizing,
        isDateSelecting: e.isDateSelecting,
        isSelected: e.isSelected,
        isPast: e.isPast,
        isFuture: e.isFuture,
        isToday: e.isToday
      }, function (t, o, i, a, s) {
        return mo("a", _r2({
          className: e.extraClassNames.concat(o).join(" "),
          style: {
            borderColor: s.borderColor,
            backgroundColor: s.backgroundColor
          },
          ref: t
        }, function (e) {
          var t = e.eventRange.def.url;
          return t ? {
            href: t
          } : {};
        }(n)), mo("div", {
          className: "fc-event-main",
          ref: i,
          style: {
            color: s.textColor
          }
        }, a), s.isStartResizable && mo("div", {
          className: "fc-event-resizer fc-event-resizer-start"
        }), s.isEndResizable && mo("div", {
          className: "fc-event-resizer fc-event-resizer-end"
        }));
      });
    }, t;
  }(xo);

  function Xa(e) {
    return mo("div", {
      className: "fc-event-main-frame"
    }, e.timeText && mo("div", {
      className: "fc-event-time"
    }, e.timeText), mo("div", {
      className: "fc-event-title-container"
    }, mo("div", {
      className: "fc-event-title fc-sticky"
    }, e.event.title || mo(So, null, " "))));
  }

  var Ka = function Ka(e) {
    return mo(_o.Consumer, null, function (t) {
      var n = t.options,
          r = {
        isAxis: e.isAxis,
        date: t.dateEnv.toDate(e.date),
        view: t.viewApi
      };
      return mo(Lo, {
        hookProps: r,
        classNames: n.nowIndicatorClassNames,
        content: n.nowIndicatorContent,
        didMount: n.nowIndicatorDidMount,
        willUnmount: n.nowIndicatorWillUnmount
      }, e.children);
    });
  },
      $a = nn({
    day: "numeric"
  }),
      Ja = function (e) {
    function t() {
      return null !== e && e.apply(this, arguments) || this;
    }

    return n(t, e), t.prototype.render = function () {
      var e = this.props,
          t = this.context,
          n = t.options,
          r = Qa({
        date: e.date,
        dateProfile: e.dateProfile,
        todayRange: e.todayRange,
        showDayNumber: e.showDayNumber,
        extraProps: e.extraHookProps,
        viewApi: t.viewApi,
        dateEnv: t.dateEnv
      });
      return mo(Vo, {
        hookProps: r,
        content: n.dayCellContent,
        defaultContent: e.defaultContent
      }, e.children);
    }, t;
  }(xo);

  function Qa(e) {
    var t = e.date,
        n = e.dateEnv,
        o = Kr(t, e.todayRange, null, e.dateProfile);
    return _r2(_r2(_r2({
      date: n.toDate(t),
      view: e.viewApi
    }, o), {
      dayNumberText: e.showDayNumber ? n.format(t, $a) : ""
    }), e.extraProps);
  }

  var es = function (e) {
    function t() {
      var t = null !== e && e.apply(this, arguments) || this;
      return t.refineHookProps = zt(Qa), t.normalizeClassNames = Bo(), t;
    }

    return n(t, e), t.prototype.render = function () {
      var e = this.props,
          t = this.context,
          n = t.options,
          r = this.refineHookProps({
        date: e.date,
        dateProfile: e.dateProfile,
        todayRange: e.todayRange,
        showDayNumber: e.showDayNumber,
        extraProps: e.extraHookProps,
        viewApi: t.viewApi,
        dateEnv: t.dateEnv
      }),
          o = $r(r, t.theme).concat(r.isDisabled ? [] : this.normalizeClassNames(n.dayCellClassNames, r)),
          i = r.isDisabled ? {} : {
        "data-date": Ut(e.date)
      };
      return mo(zo, {
        hookProps: r,
        didMount: n.dayCellDidMount,
        willUnmount: n.dayCellWillUnmount,
        elRef: e.elRef
      }, function (t) {
        return e.children(t, o, i, r.isDisabled);
      });
    }, t;
  }(xo);

  function ts(e) {
    return mo("div", {
      className: "fc-" + e
    });
  }

  var ns = function ns(e) {
    return mo(Ya, {
      defaultContent: rs,
      seg: e.seg,
      timeText: "",
      disableDragging: !0,
      disableResizing: !0,
      isDragging: !1,
      isResizing: !1,
      isDateSelecting: !1,
      isSelected: !1,
      isPast: e.isPast,
      isFuture: e.isFuture,
      isToday: e.isToday
    }, function (e, t, n, r, o) {
      return mo("div", {
        ref: e,
        className: ["fc-bg-event"].concat(t).join(" "),
        style: {
          backgroundColor: o.backgroundColor
        }
      }, r);
    });
  };

  function rs(e) {
    return e.event.title && mo("div", {
      className: "fc-event-title"
    }, e.event.title);
  }

  var os = function os(e) {
    return mo(_o.Consumer, null, function (t) {
      var n = t.dateEnv,
          r = t.options,
          o = e.date,
          i = r.weekNumberFormat || e.defaultFormat,
          a = n.computeWeekNumber(o),
          s = n.format(o, i);
      return mo(Lo, {
        hookProps: {
          num: a,
          text: s,
          date: o
        },
        classNames: r.weekNumberClassNames,
        content: r.weekNumberContent,
        defaultContent: is,
        didMount: r.weekNumberDidMount,
        willUnmount: r.weekNumberWillUnmount
      }, e.children);
    });
  };

  function is(e) {
    return e.text;
  }

  var as = function (e) {
    function t() {
      var t = null !== e && e.apply(this, arguments) || this;
      return t.handleRootEl = function (e) {
        ;
        t.rootEl = e, t.props.elRef && Io(t.props.elRef, e);
      }, t.handleDocumentMousedown = function (e) {
        var n = _e(e);

        t.rootEl.contains(n) || t.handleCloseClick();
      }, t.handleCloseClick = function () {
        var e = t.props.onClose;
        e && e();
      }, t;
    }

    return n(t, e), t.prototype.render = function () {
      var e = this.context.theme,
          t = this.props,
          n = ["fc-popover", e.getClass("popover")].concat(t.extraClassNames || []);
      return bo(mo("div", _r2({
        className: n.join(" ")
      }, t.extraAttrs, {
        ref: this.handleRootEl
      }), mo("div", {
        className: "fc-popover-header " + e.getClass("popoverHeader")
      }, mo("span", {
        className: "fc-popover-title"
      }, t.title), mo("span", {
        className: "fc-popover-close " + e.getIconClass("close"),
        onClick: this.handleCloseClick
      })), mo("div", {
        className: "fc-popover-body " + e.getClass("popoverContent")
      }, t.children)), t.parentEl);
    }, t.prototype.componentDidMount = function () {
      document.addEventListener("mousedown", this.handleDocumentMousedown), this.updateSize();
    }, t.prototype.componentWillUnmount = function () {
      document.removeEventListener("mousedown", this.handleDocumentMousedown);
    }, t.prototype.updateSize = function () {
      var e = this.context.isRtl,
          t = this.props,
          n = t.alignmentEl,
          r = t.alignGridTop,
          o = this.rootEl,
          i = function (e) {
        for (var t = so(e), n = e.getBoundingClientRect(), r = 0, o = t; r < o.length; r++) {
          var i = zr(n, o[r].getBoundingClientRect());
          if (!i) return null;
          n = i;
        }

        return n;
      }(n);

      if (i) {
        var a = o.getBoundingClientRect(),
            s = r ? Se(n, ".fc-scrollgrid").getBoundingClientRect().top : i.top,
            l = e ? i.right - a.width : i.left;
        s = Math.max(s, 10), l = Math.min(l, document.documentElement.clientWidth - 10 - a.width), l = Math.max(l, 10);
        var u = o.offsetParent.getBoundingClientRect();
        we(o, {
          top: s - u.top,
          left: l - u.left
        });
      }
    }, t;
  }(xo),
      ss = function (e) {
    function t() {
      var t = null !== e && e.apply(this, arguments) || this;
      return t.handleRootEl = function (e) {
        ;
        t.rootEl = e, e ? t.context.registerInteractiveComponent(t, {
          el: e,
          useEventCenter: !1
        }) : t.context.unregisterInteractiveComponent(t);
      }, t;
    }

    return n(t, e), t.prototype.render = function () {
      var e = this.context,
          t = e.options,
          n = e.dateEnv,
          r = this.props,
          o = r.startDate,
          i = r.todayRange,
          a = r.dateProfile,
          s = n.format(o, t.dayPopoverFormat);
      return mo(es, {
        date: o,
        dateProfile: a,
        todayRange: i,
        elRef: this.handleRootEl
      }, function (e, t, n) {
        return mo(as, {
          elRef: e,
          title: s,
          extraClassNames: ["fc-more-popover"].concat(t),
          extraAttrs: n,
          parentEl: r.parentEl,
          alignmentEl: r.alignmentEl,
          alignGridTop: r.alignGridTop,
          onClose: r.onClose
        }, mo(Ja, {
          date: o,
          dateProfile: a,
          todayRange: i
        }, function (e, t) {
          return t && mo("div", {
            className: "fc-more-popover-misc",
            ref: e
          }, t);
        }), r.children);
      });
    }, t.prototype.queryHit = function (e, t, n, o) {
      var i = this.rootEl,
          a = this.props;
      return e >= 0 && e < n && t >= 0 && t < o ? {
        dateProfile: a.dateProfile,
        dateSpan: _r2({
          allDay: !0,
          range: {
            start: a.startDate,
            end: a.endDate
          }
        }, a.extraDateSpan),
        dayEl: i,
        rect: {
          left: 0,
          top: 0,
          right: n,
          bottom: o
        },
        layer: 1
      } : null;
    }, t;
  }(No),
      ls = function (e) {
    function t() {
      var t = null !== e && e.apply(this, arguments) || this;
      return t.linkElRef = Eo(), t.state = {
        isPopoverOpen: !1
      }, t.handleClick = function (e) {
        var n = t,
            r = n.props,
            o = n.context,
            i = o.options.moreLinkClick,
            a = cs(r).start;

        function s(e) {
          var t = e.eventRange,
              n = t.def,
              r = t.instance,
              i = t.range;
          return {
            event: new Cr(o, n, r),
            start: o.dateEnv.toDate(i.start),
            end: o.dateEnv.toDate(i.end),
            isStart: e.isStart,
            isEnd: e.isEnd
          };
        }

        "function" == typeof i && (i = i({
          date: a,
          allDay: Boolean(r.allDayDate),
          allSegs: r.allSegs.map(s),
          hiddenSegs: r.hiddenSegs.map(s),
          jsEvent: e,
          view: o.viewApi
        })), i && "popover" !== i ? "string" == typeof i && o.calendarApi.zoomTo(a, i) : t.setState({
          isPopoverOpen: !0
        });
      }, t.handlePopoverClose = function () {
        t.setState({
          isPopoverOpen: !1
        });
      }, t;
    }

    return n(t, e), t.prototype.render = function () {
      var e = this,
          t = this.props;
      return mo(_o.Consumer, null, function (n) {
        var r = n.viewApi,
            o = n.options,
            i = n.calendarApi,
            a = o.moreLinkText,
            s = t.moreCnt,
            l = cs(t),
            u = {
          num: s,
          shortText: "+" + s,
          text: "function" == typeof a ? a.call(i, s) : "+" + s + " " + a,
          view: r
        };
        return mo(So, null, Boolean(t.moreCnt) && mo(Lo, {
          elRef: e.linkElRef,
          hookProps: u,
          classNames: o.moreLinkClassNames,
          content: o.moreLinkContent,
          defaultContent: t.defaultContent || us,
          didMount: o.moreLinkDidMount,
          willUnmount: o.moreLinkWillUnmount
        }, function (n, r, o, i) {
          return t.children(n, ["fc-more-link"].concat(r), o, i, e.handleClick);
        }), e.state.isPopoverOpen && mo(ss, {
          startDate: l.start,
          endDate: l.end,
          dateProfile: t.dateProfile,
          todayRange: t.todayRange,
          extraDateSpan: t.extraDateSpan,
          parentEl: e.parentEl,
          alignmentEl: t.alignmentElRef.current,
          alignGridTop: t.alignGridTop,
          onClose: e.handlePopoverClose
        }, t.popoverContent()));
      });
    }, t.prototype.componentDidMount = function () {
      this.updateParentEl();
    }, t.prototype.componentDidUpdate = function () {
      this.updateParentEl();
    }, t.prototype.updateParentEl = function () {
      this.linkElRef.current && (this.parentEl = Se(this.linkElRef.current, ".fc-view-harness"));
    }, t;
  }(xo);

  function us(e) {
    return e.text;
  }

  function cs(e) {
    if (e.allDayDate) return {
      start: e.allDayDate,
      end: Ke(e.allDayDate, 1)
    };
    var t,
        n = e.hiddenSegs;
    return {
      start: ds(n),
      end: (t = n, t.reduce(fs).eventRange.range.end)
    };
  }

  function ds(e) {
    return e.reduce(ps).eventRange.range.start;
  }

  function ps(e, t) {
    return e.eventRange.range.start < t.eventRange.range.start ? e : t;
  }

  function fs(e, t) {
    return e.eventRange.range.end > t.eventRange.range.end ? e : t;
  }

  var hs = function (e) {
    function t(t, n) {
      void 0 === n && (n = {});
      var o = e.call(this) || this;
      return o.isRendering = !1, o.isRendered = !1, o.currentClassNames = [], o.customContentRenderId = 0, o.handleAction = function (e) {
        switch (e.type) {
          case "SET_EVENT_DRAG":
          case "SET_EVENT_RESIZE":
            o.renderRunner.tryDrain();
        }
      }, o.handleData = function (e) {
        ;
        o.currentData = e, o.renderRunner.request(e.calendarOptions.rerenderDelay);
      }, o.handleRenderRequest = function () {
        if (o.isRendering) {
          o.isRendered = !0;
          var e = o.currentData;
          yo(mo(la, {
            options: e.calendarOptions,
            theme: e.theme,
            emitter: e.emitter
          }, function (t, n, i, a) {
            return o.setClassNames(t), o.setHeight(n), mo(Wo.Provider, {
              value: o.customContentRenderId
            }, mo(ia, _r2({
              isHeightAuto: i,
              forPrint: a
            }, e)));
          }), o.el);
        } else o.isRendered && (o.isRendered = !1, wo(o.el), o.setClassNames([]), o.setHeight(""));

        Co();
      }, o.el = t, o.renderRunner = new bi(o.handleRenderRequest), new Ri({
        optionOverrides: n,
        calendarApi: o,
        onAction: o.handleAction,
        onData: o.handleData
      }), o;
    }

    return n(t, e), Object.defineProperty(t.prototype, "view", {
      get: function get() {
        return this.currentData.viewApi;
      },
      enumerable: !1,
      configurable: !0
    }), t.prototype.render = function () {
      var e = this.isRendering;
      e ? this.customContentRenderId += 1 : this.isRendering = !0, this.renderRunner.request(), e && this.updateSize();
    }, t.prototype.destroy = function () {
      this.isRendering && (this.isRendering = !1, this.renderRunner.request());
    }, t.prototype.updateSize = function () {
      e.prototype.updateSize.call(this), Co();
    }, t.prototype.batchRendering = function (e) {
      this.renderRunner.pause("batchRendering"), e(), this.renderRunner.resume("batchRendering");
    }, t.prototype.pauseRendering = function () {
      this.renderRunner.pause("pauseRendering");
    }, t.prototype.resumeRendering = function () {
      this.renderRunner.resume("pauseRendering", !0);
    }, t.prototype.resetOptions = function (e, t) {
      this.currentDataManager.resetOptions(e, t);
    }, t.prototype.setClassNames = function (e) {
      if (!Vt(e, this.currentClassNames)) {
        for (var t = this.el.classList, n = 0, r = this.currentClassNames; n < r.length; n++) {
          var o = r[n];
          t.remove(o);
        }

        for (var i = 0, a = e; i < a.length; i++) {
          o = a[i];
          t.add(o);
        }

        this.currentClassNames = e;
      }
    }, t.prototype.setHeight = function (e) {
      Re(this.el, "height", e);
    }, t;
  }(br);

  $i.touchMouseIgnoreWait = 500;

  var vs = 0,
      gs = 0,
      ms = !1,
      ys = function () {
    function e(e) {
      var t = this;
      this.subjectEl = null, this.selector = "", this.handleSelector = "", this.shouldIgnoreMove = !1, this.shouldWatchScroll = !0, this.isDragging = !1, this.isTouchDragging = !1, this.wasTouchScroll = !1, this.handleMouseDown = function (e) {
        if (!t.shouldIgnoreMouse() && function (e) {
          return 0 === e.button && !e.ctrlKey;
        }(e) && t.tryStart(e)) {
          var n = t.createEventFromMouse(e, !0);
          t.emitter.trigger("pointerdown", n), t.initScrollWatch(n), t.shouldIgnoreMove || document.addEventListener("mousemove", t.handleMouseMove), document.addEventListener("mouseup", t.handleMouseUp);
        }
      }, this.handleMouseMove = function (e) {
        var n = t.createEventFromMouse(e);
        t.recordCoords(n), t.emitter.trigger("pointermove", n);
      }, this.handleMouseUp = function (e) {
        document.removeEventListener("mousemove", t.handleMouseMove), document.removeEventListener("mouseup", t.handleMouseUp), t.emitter.trigger("pointerup", t.createEventFromMouse(e)), t.cleanup();
      }, this.handleTouchStart = function (e) {
        if (t.tryStart(e)) {
          t.isTouchDragging = !0;
          var n = t.createEventFromTouch(e, !0);
          t.emitter.trigger("pointerdown", n), t.initScrollWatch(n);
          var r = e.target;
          t.shouldIgnoreMove || r.addEventListener("touchmove", t.handleTouchMove), r.addEventListener("touchend", t.handleTouchEnd), r.addEventListener("touchcancel", t.handleTouchEnd), window.addEventListener("scroll", t.handleTouchScroll, !0);
        }
      }, this.handleTouchMove = function (e) {
        var n = t.createEventFromTouch(e);
        t.recordCoords(n), t.emitter.trigger("pointermove", n);
      }, this.handleTouchEnd = function (e) {
        if (t.isDragging) {
          var n = e.target;
          n.removeEventListener("touchmove", t.handleTouchMove), n.removeEventListener("touchend", t.handleTouchEnd), n.removeEventListener("touchcancel", t.handleTouchEnd), window.removeEventListener("scroll", t.handleTouchScroll, !0), t.emitter.trigger("pointerup", t.createEventFromTouch(e)), t.cleanup(), t.isTouchDragging = !1, vs += 1, setTimeout(function () {
            vs -= 1;
          }, $i.touchMouseIgnoreWait);
        }
      }, this.handleTouchScroll = function () {
        t.wasTouchScroll = !0;
      }, this.handleScroll = function (e) {
        if (!t.shouldIgnoreMove) {
          var n = window.pageXOffset - t.prevScrollX + t.prevPageX,
              r = window.pageYOffset - t.prevScrollY + t.prevPageY;
          t.emitter.trigger("pointermove", {
            origEvent: e,
            isTouch: t.isTouchDragging,
            subjectEl: t.subjectEl,
            pageX: n,
            pageY: r,
            deltaX: n - t.origPageX,
            deltaY: r - t.origPageY
          });
        }
      }, this.containerEl = e, this.emitter = new uo(), e.addEventListener("mousedown", this.handleMouseDown), e.addEventListener("touchstart", this.handleTouchStart, {
        passive: !0
      }), 1 === (gs += 1) && window.addEventListener("touchmove", Es, {
        passive: !1
      });
    }

    return e.prototype.destroy = function () {
      this.containerEl.removeEventListener("mousedown", this.handleMouseDown), this.containerEl.removeEventListener("touchstart", this.handleTouchStart, {
        passive: !0
      }), (gs -= 1) || window.removeEventListener("touchmove", Es, {
        passive: !1
      });
    }, e.prototype.tryStart = function (e) {
      var t = this.querySubjectEl(e),
          n = e.target;
      return !(!t || this.handleSelector && !Se(n, this.handleSelector)) && (this.subjectEl = t, this.isDragging = !0, this.wasTouchScroll = !1, !0);
    }, e.prototype.cleanup = function () {
      ;
      ms = !1, this.isDragging = !1, this.subjectEl = null, this.destroyScrollWatch();
    }, e.prototype.querySubjectEl = function (e) {
      return this.selector ? Se(e.target, this.selector) : this.containerEl;
    }, e.prototype.shouldIgnoreMouse = function () {
      return vs || this.isTouchDragging;
    }, e.prototype.cancelTouchScroll = function () {
      this.isDragging && (ms = !0);
    }, e.prototype.initScrollWatch = function (e) {
      this.shouldWatchScroll && (this.recordCoords(e), window.addEventListener("scroll", this.handleScroll, !0));
    }, e.prototype.recordCoords = function (e) {
      this.shouldWatchScroll && (this.prevPageX = e.pageX, this.prevPageY = e.pageY, this.prevScrollX = window.pageXOffset, this.prevScrollY = window.pageYOffset);
    }, e.prototype.destroyScrollWatch = function () {
      this.shouldWatchScroll && window.removeEventListener("scroll", this.handleScroll, !0);
    }, e.prototype.createEventFromMouse = function (e, t) {
      var n = 0,
          r = 0;
      return t ? (this.origPageX = e.pageX, this.origPageY = e.pageY) : (n = e.pageX - this.origPageX, r = e.pageY - this.origPageY), {
        origEvent: e,
        isTouch: !1,
        subjectEl: this.subjectEl,
        pageX: e.pageX,
        pageY: e.pageY,
        deltaX: n,
        deltaY: r
      };
    }, e.prototype.createEventFromTouch = function (e, t) {
      var n,
          r,
          o = e.touches,
          i = 0,
          a = 0;
      return o && o.length ? (n = o[0].pageX, r = o[0].pageY) : (n = e.pageX, r = e.pageY), t ? (this.origPageX = n, this.origPageY = r) : (i = n - this.origPageX, a = r - this.origPageY), {
        origEvent: e,
        isTouch: !0,
        subjectEl: this.subjectEl,
        pageX: n,
        pageY: r,
        deltaX: i,
        deltaY: a
      };
    }, e;
  }();

  function Es(e) {
    ms && e.preventDefault();
  }

  var Ss = function () {
    function e() {
      ;
      this.isVisible = !1, this.sourceEl = null, this.mirrorEl = null, this.sourceElRect = null, this.parentNode = document.body, this.zIndex = 9999, this.revertDuration = 0;
    }

    return e.prototype.start = function (e, t, n) {
      ;
      this.sourceEl = e, this.sourceElRect = this.sourceEl.getBoundingClientRect(), this.origScreenX = t - window.pageXOffset, this.origScreenY = n - window.pageYOffset, this.deltaX = 0, this.deltaY = 0, this.updateElPosition();
    }, e.prototype.handleMove = function (e, t) {
      ;
      this.deltaX = e - window.pageXOffset - this.origScreenX, this.deltaY = t - window.pageYOffset - this.origScreenY, this.updateElPosition();
    }, e.prototype.setIsVisible = function (e) {
      e ? this.isVisible || (this.mirrorEl && (this.mirrorEl.style.display = ""), this.isVisible = e, this.updateElPosition()) : this.isVisible && (this.mirrorEl && (this.mirrorEl.style.display = "none"), this.isVisible = e);
    }, e.prototype.stop = function (e, t) {
      var n = this,
          r = function r() {
        n.cleanup(), t();
      };

      e && this.mirrorEl && this.isVisible && this.revertDuration && (this.deltaX || this.deltaY) ? this.doRevertAnimation(r, this.revertDuration) : setTimeout(r, 0);
    }, e.prototype.doRevertAnimation = function (e, t) {
      var n = this.mirrorEl,
          r = this.sourceEl.getBoundingClientRect();
      n.style.transition = "top " + t + "ms,left " + t + "ms", we(n, {
        left: r.left,
        top: r.top
      }), Pe(n, function () {
        ;
        n.style.transition = "", e();
      });
    }, e.prototype.cleanup = function () {
      this.mirrorEl && (Ee(this.mirrorEl), this.mirrorEl = null), this.sourceEl = null;
    }, e.prototype.updateElPosition = function () {
      this.sourceEl && this.isVisible && we(this.getMirrorEl(), {
        left: this.sourceElRect.left + this.deltaX,
        top: this.sourceElRect.top + this.deltaY
      });
    }, e.prototype.getMirrorEl = function () {
      var e = this.sourceElRect,
          t = this.mirrorEl;
      return t || ((t = this.mirrorEl = this.sourceEl.cloneNode(!0)).classList.add("fc-unselectable"), t.classList.add("fc-event-dragging"), we(t, {
        position: "fixed",
        zIndex: this.zIndex,
        visibility: "",
        boxSizing: "border-box",
        width: e.right - e.left,
        height: e.bottom - e.top,
        right: "auto",
        bottom: "auto",
        margin: 0
      }), this.parentNode.appendChild(t)), t;
    }, e;
  }(),
      Ds = function (e) {
    function t(t, n) {
      var r = e.call(this) || this;
      return r.handleScroll = function () {
        ;
        r.scrollTop = r.scrollController.getScrollTop(), r.scrollLeft = r.scrollController.getScrollLeft(), r.handleScrollChange();
      }, r.scrollController = t, r.doesListening = n, r.scrollTop = r.origScrollTop = t.getScrollTop(), r.scrollLeft = r.origScrollLeft = t.getScrollLeft(), r.scrollWidth = t.getScrollWidth(), r.scrollHeight = t.getScrollHeight(), r.clientWidth = t.getClientWidth(), r.clientHeight = t.getClientHeight(), r.clientRect = r.computeClientRect(), r.doesListening && r.getEventTarget().addEventListener("scroll", r.handleScroll), r;
    }

    return n(t, e), t.prototype.destroy = function () {
      this.doesListening && this.getEventTarget().removeEventListener("scroll", this.handleScroll);
    }, t.prototype.getScrollTop = function () {
      return this.scrollTop;
    }, t.prototype.getScrollLeft = function () {
      return this.scrollLeft;
    }, t.prototype.setScrollTop = function (e) {
      this.scrollController.setScrollTop(e), this.doesListening || (this.scrollTop = Math.max(Math.min(e, this.getMaxScrollTop()), 0), this.handleScrollChange());
    }, t.prototype.setScrollLeft = function (e) {
      this.scrollController.setScrollLeft(e), this.doesListening || (this.scrollLeft = Math.max(Math.min(e, this.getMaxScrollLeft()), 0), this.handleScrollChange());
    }, t.prototype.getClientWidth = function () {
      return this.clientWidth;
    }, t.prototype.getClientHeight = function () {
      return this.clientHeight;
    }, t.prototype.getScrollWidth = function () {
      return this.scrollWidth;
    }, t.prototype.getScrollHeight = function () {
      return this.scrollHeight;
    }, t.prototype.handleScrollChange = function () {}, t;
  }(po),
      bs = function (e) {
    function t(t, n) {
      return e.call(this, new fo(t), n) || this;
    }

    return n(t, e), t.prototype.getEventTarget = function () {
      return this.scrollController.el;
    }, t.prototype.computeClientRect = function () {
      return io(this.scrollController.el);
    }, t;
  }(Ds),
      Cs = function (e) {
    function t(t) {
      return e.call(this, new ho(), t) || this;
    }

    return n(t, e), t.prototype.getEventTarget = function () {
      return window;
    }, t.prototype.computeClientRect = function () {
      return {
        left: this.scrollLeft,
        right: this.scrollLeft + this.clientWidth,
        top: this.scrollTop,
        bottom: this.scrollTop + this.clientHeight
      };
    }, t.prototype.handleScrollChange = function () {
      this.clientRect = this.computeClientRect();
    }, t;
  }(Ds),
      ws = "function" == typeof performance ? performance.now : Date.now,
      Rs = function () {
    function e() {
      var e = this;
      this.isEnabled = !0, this.scrollQuery = [window, ".fc-scroller"], this.edgeThreshold = 50, this.maxVelocity = 300, this.pointerScreenX = null, this.pointerScreenY = null, this.isAnimating = !1, this.scrollCaches = null, this.everMovedUp = !1, this.everMovedDown = !1, this.everMovedLeft = !1, this.everMovedRight = !1, this.animate = function () {
        if (e.isAnimating) {
          var t = e.computeBestEdge(e.pointerScreenX + window.pageXOffset, e.pointerScreenY + window.pageYOffset);

          if (t) {
            var n = ws();
            e.handleSide(t, (n - e.msSinceRequest) / 1e3), e.requestAnimation(n);
          } else e.isAnimating = !1;
        }
      };
    }

    return e.prototype.start = function (e, t) {
      this.isEnabled && (this.scrollCaches = this.buildCaches(), this.pointerScreenX = null, this.pointerScreenY = null, this.everMovedUp = !1, this.everMovedDown = !1, this.everMovedLeft = !1, this.everMovedRight = !1, this.handleMove(e, t));
    }, e.prototype.handleMove = function (e, t) {
      if (this.isEnabled) {
        var n = e - window.pageXOffset,
            r = t - window.pageYOffset,
            o = null === this.pointerScreenY ? 0 : r - this.pointerScreenY,
            i = null === this.pointerScreenX ? 0 : n - this.pointerScreenX;
        o < 0 ? this.everMovedUp = !0 : o > 0 && (this.everMovedDown = !0), i < 0 ? this.everMovedLeft = !0 : i > 0 && (this.everMovedRight = !0), this.pointerScreenX = n, this.pointerScreenY = r, this.isAnimating || (this.isAnimating = !0, this.requestAnimation(ws()));
      }
    }, e.prototype.stop = function () {
      if (this.isEnabled) {
        this.isAnimating = !1;

        for (var e = 0, t = this.scrollCaches; e < t.length; e++) {
          t[e].destroy();
        }

        this.scrollCaches = null;
      }
    }, e.prototype.requestAnimation = function (e) {
      ;
      this.msSinceRequest = e, requestAnimationFrame(this.animate);
    }, e.prototype.handleSide = function (e, t) {
      var n = e.scrollCache,
          r = this.edgeThreshold,
          o = r - e.distance,
          i = o * o / (r * r) * this.maxVelocity * t,
          a = 1;

      switch (e.name) {
        case "left":
          a = -1;

        case "right":
          n.setScrollLeft(n.getScrollLeft() + i * a);
          break;

        case "top":
          a = -1;

        case "bottom":
          n.setScrollTop(n.getScrollTop() + i * a);
      }
    }, e.prototype.computeBestEdge = function (e, t) {
      for (var n = this.edgeThreshold, r = null, o = 0, i = this.scrollCaches; o < i.length; o++) {
        var a = i[o],
            s = a.clientRect,
            l = e - s.left,
            u = s.right - e,
            c = t - s.top,
            d = s.bottom - t;
        l >= 0 && u >= 0 && c >= 0 && d >= 0 && (c <= n && this.everMovedUp && a.canScrollUp() && (!r || r.distance > c) && (r = {
          scrollCache: a,
          name: "top",
          distance: c
        }), d <= n && this.everMovedDown && a.canScrollDown() && (!r || r.distance > d) && (r = {
          scrollCache: a,
          name: "bottom",
          distance: d
        }), l <= n && this.everMovedLeft && a.canScrollLeft() && (!r || r.distance > l) && (r = {
          scrollCache: a,
          name: "left",
          distance: l
        }), u <= n && this.everMovedRight && a.canScrollRight() && (!r || r.distance > u) && (r = {
          scrollCache: a,
          name: "right",
          distance: u
        }));
      }

      return r;
    }, e.prototype.buildCaches = function () {
      return this.queryScrollEls().map(function (e) {
        return e === window ? new Cs(!1) : new bs(e, !1);
      });
    }, e.prototype.queryScrollEls = function () {
      for (var e = [], t = 0, n = this.scrollQuery; t < n.length; t++) {
        var r = n[t];
        "object" == _typeof(r) ? e.push(r) : e.push.apply(e, Array.prototype.slice.call(document.querySelectorAll(r)));
      }

      return e;
    }, e;
  }(),
      _s = function (e) {
    function t(t, n) {
      var r = e.call(this, t) || this;
      r.delay = null, r.minDistance = 0, r.touchScrollAllowed = !0, r.mirrorNeedsRevert = !1, r.isInteracting = !1, r.isDragging = !1, r.isDelayEnded = !1, r.isDistanceSurpassed = !1, r.delayTimeoutId = null, r.onPointerDown = function (e) {
        r.isDragging || (r.isInteracting = !0, r.isDelayEnded = !1, r.isDistanceSurpassed = !1, Ae(document.body), Le(document.body), e.isTouch || e.origEvent.preventDefault(), r.emitter.trigger("pointerdown", e), r.isInteracting && !r.pointer.shouldIgnoreMove && (r.mirror.setIsVisible(!1), r.mirror.start(e.subjectEl, e.pageX, e.pageY), r.startDelay(e), r.minDistance || r.handleDistanceSurpassed(e)));
      }, r.onPointerMove = function (e) {
        if (r.isInteracting) {
          if (r.emitter.trigger("pointermove", e), !r.isDistanceSurpassed) {
            var t = r.minDistance,
                n = e.deltaX,
                o = e.deltaY;
            n * n + o * o >= t * t && r.handleDistanceSurpassed(e);
          }

          r.isDragging && ("scroll" !== e.origEvent.type && (r.mirror.handleMove(e.pageX, e.pageY), r.autoScroller.handleMove(e.pageX, e.pageY)), r.emitter.trigger("dragmove", e));
        }
      }, r.onPointerUp = function (e) {
        r.isInteracting && (r.isInteracting = !1, Ue(document.body), We(document.body), r.emitter.trigger("pointerup", e), r.isDragging && (r.autoScroller.stop(), r.tryStopDrag(e)), r.delayTimeoutId && (clearTimeout(r.delayTimeoutId), r.delayTimeoutId = null));
      };
      var o = r.pointer = new ys(t);
      return o.emitter.on("pointerdown", r.onPointerDown), o.emitter.on("pointermove", r.onPointerMove), o.emitter.on("pointerup", r.onPointerUp), n && (o.selector = n), r.mirror = new Ss(), r.autoScroller = new Rs(), r;
    }

    return n(t, e), t.prototype.destroy = function () {
      this.pointer.destroy(), this.onPointerUp({});
    }, t.prototype.startDelay = function (e) {
      var t = this;
      "number" == typeof this.delay ? this.delayTimeoutId = setTimeout(function () {
        ;
        t.delayTimeoutId = null, t.handleDelayEnd(e);
      }, this.delay) : this.handleDelayEnd(e);
    }, t.prototype.handleDelayEnd = function (e) {
      ;
      this.isDelayEnded = !0, this.tryStartDrag(e);
    }, t.prototype.handleDistanceSurpassed = function (e) {
      ;
      this.isDistanceSurpassed = !0, this.tryStartDrag(e);
    }, t.prototype.tryStartDrag = function (e) {
      this.isDelayEnded && this.isDistanceSurpassed && (this.pointer.wasTouchScroll && !this.touchScrollAllowed || (this.isDragging = !0, this.mirrorNeedsRevert = !1, this.autoScroller.start(e.pageX, e.pageY), this.emitter.trigger("dragstart", e), !1 === this.touchScrollAllowed && this.pointer.cancelTouchScroll()));
    }, t.prototype.tryStopDrag = function (e) {
      this.mirror.stop(this.mirrorNeedsRevert, this.stopDrag.bind(this, e));
    }, t.prototype.stopDrag = function (e) {
      ;
      this.isDragging = !1, this.emitter.trigger("dragend", e);
    }, t.prototype.setIgnoreMove = function (e) {
      this.pointer.shouldIgnoreMove = e;
    }, t.prototype.setMirrorIsVisible = function (e) {
      this.mirror.setIsVisible(e);
    }, t.prototype.setMirrorNeedsRevert = function (e) {
      this.mirrorNeedsRevert = e;
    }, t.prototype.setAutoScrollEnabled = function (e) {
      this.autoScroller.isEnabled = e;
    }, t;
  }(Ki),
      Ts = function () {
    function e(e) {
      ;
      this.origRect = ao(e), this.scrollCaches = so(e).map(function (e) {
        return new bs(e, !0);
      });
    }

    return e.prototype.destroy = function () {
      for (var e = 0, t = this.scrollCaches; e < t.length; e++) {
        t[e].destroy();
      }
    }, e.prototype.computeLeft = function () {
      for (var e = this.origRect.left, t = 0, n = this.scrollCaches; t < n.length; t++) {
        var r = n[t];
        e += r.origScrollLeft - r.getScrollLeft();
      }

      return e;
    }, e.prototype.computeTop = function () {
      for (var e = this.origRect.top, t = 0, n = this.scrollCaches; t < n.length; t++) {
        var r = n[t];
        e += r.origScrollTop - r.getScrollTop();
      }

      return e;
    }, e.prototype.isWithinClipping = function (e, t) {
      for (var n, r, o = {
        left: e,
        top: t
      }, i = 0, a = this.scrollCaches; i < a.length; i++) {
        var s = a[i];
        if (n = s.getEventTarget(), r = void 0, "HTML" !== (r = n.tagName) && "BODY" !== r && !Fr(o, s.clientRect)) return !1;
      }

      return !0;
    }, e;
  }();

  var ks = function () {
    function e(e, t) {
      var n = this;
      this.useSubjectCenter = !1, this.requireInitial = !0, this.initialHit = null, this.movingHit = null, this.finalHit = null, this.handlePointerDown = function (e) {
        var t = n.dragging;
        n.initialHit = null, n.movingHit = null, n.finalHit = null, n.prepareHits(), n.processFirstCoord(e), n.initialHit || !n.requireInitial ? (t.setIgnoreMove(!1), n.emitter.trigger("pointerdown", e)) : t.setIgnoreMove(!0);
      }, this.handleDragStart = function (e) {
        n.emitter.trigger("dragstart", e), n.handleMove(e, !0);
      }, this.handleDragMove = function (e) {
        n.emitter.trigger("dragmove", e), n.handleMove(e);
      }, this.handlePointerUp = function (e) {
        n.releaseHits(), n.emitter.trigger("pointerup", e);
      }, this.handleDragEnd = function (e) {
        n.movingHit && n.emitter.trigger("hitupdate", null, !0, e), n.finalHit = n.movingHit, n.movingHit = null, n.emitter.trigger("dragend", e);
      }, this.droppableStore = t, e.emitter.on("pointerdown", this.handlePointerDown), e.emitter.on("dragstart", this.handleDragStart), e.emitter.on("dragmove", this.handleDragMove), e.emitter.on("pointerup", this.handlePointerUp), e.emitter.on("dragend", this.handleDragEnd), this.dragging = e, this.emitter = new uo();
    }

    return e.prototype.processFirstCoord = function (e) {
      var t,
          n = {
        left: e.pageX,
        top: e.pageY
      },
          r = n,
          o = e.subjectEl;
      o !== document && (r = Br(r, t = ao(o)));
      var i = this.initialHit = this.queryHitForOffset(r.left, r.top);

      if (i) {
        if (this.useSubjectCenter && t) {
          var a = zr(t, i.rect);
          a && (r = jr(a));
        }

        this.coordAdjust = Gr(r, n);
      } else this.coordAdjust = {
        left: 0,
        top: 0
      };
    }, e.prototype.handleMove = function (e, t) {
      var n = this.queryHitForOffset(e.pageX + this.coordAdjust.left, e.pageY + this.coordAdjust.top);
      !t && xs(this.movingHit, n) || (this.movingHit = n, this.emitter.trigger("hitupdate", n, !1, e));
    }, e.prototype.prepareHits = function () {
      this.offsetTrackers = gt(this.droppableStore, function (e) {
        return e.component.prepareHits(), new Ts(e.el);
      });
    }, e.prototype.releaseHits = function () {
      var e = this.offsetTrackers;

      for (var t in e) {
        e[t].destroy();
      }

      this.offsetTrackers = {};
    }, e.prototype.queryHitForOffset = function (e, t) {
      var n = this.droppableStore,
          r = this.offsetTrackers,
          o = null;

      for (var i in n) {
        var a = n[i].component,
            s = r[i];

        if (s && s.isWithinClipping(e, t)) {
          var l = s.computeLeft(),
              u = s.computeTop(),
              c = e - l,
              d = t - u,
              p = s.origRect,
              f = p.right - p.left,
              h = p.bottom - p.top;

          if (c >= 0 && c < f && d >= 0 && d < h) {
            var v = a.queryHit(c, d, f, h);
            v && zn(v.dateProfile.activeRange, v.dateSpan.range) && (!o || v.layer > o.layer) && (v.componentId = i, v.context = a.context, v.rect.left += l, v.rect.right += l, v.rect.top += u, v.rect.bottom += u, o = v);
          }
        }
      }

      return o;
    }, e;
  }();

  function xs(e, t) {
    return !e && !t || Boolean(e) === Boolean(t) && sr(e.dateSpan, t.dateSpan);
  }

  function Ms(e, t) {
    for (var n, o, i = {}, a = 0, s = t.pluginHooks.datePointTransforms; a < s.length; a++) {
      var l = s[a];

      _r2(i, l(e, t));
    }

    return _r2(i, (n = e, {
      date: (o = t.dateEnv).toDate(n.range.start),
      dateStr: o.formatIso(n.range.start, {
        omitTime: n.allDay
      }),
      allDay: n.allDay
    })), i;
  }

  var Ps = function (e) {
    function t(t) {
      var n = e.call(this, t) || this;
      n.handlePointerDown = function (e) {
        var t = n.dragging,
            r = e.origEvent.target;
        t.setIgnoreMove(!n.component.isValidDateDownEl(r));
      }, n.handleDragEnd = function (e) {
        var t = n.component;

        if (!n.dragging.pointer.wasTouchScroll) {
          var o = n.hitDragging,
              i = o.initialHit,
              a = o.finalHit;

          if (i && a && xs(i, a)) {
            var s = t.context,
                l = _r2(_r2({}, Ms(i.dateSpan, s)), {
              dayEl: i.dayEl,
              jsEvent: e.origEvent,
              view: s.viewApi || s.calendarApi.view
            });

            s.emitter.trigger("dateClick", l);
          }
        }
      }, n.dragging = new _s(t.el), n.dragging.autoScroller.isEnabled = !1;
      var o = n.hitDragging = new ks(n.dragging, Zi(t));
      return o.emitter.on("pointerdown", n.handlePointerDown), o.emitter.on("dragend", n.handleDragEnd), n;
    }

    return n(t, e), t.prototype.destroy = function () {
      this.dragging.destroy();
    }, t;
  }(qi),
      Is = function (e) {
    function t(t) {
      var n = e.call(this, t) || this;
      n.dragSelection = null, n.handlePointerDown = function (e) {
        var t = n,
            r = t.component,
            o = t.dragging,
            i = r.context.options.selectable && r.isValidDateDownEl(e.origEvent.target);
        o.setIgnoreMove(!i), o.delay = e.isTouch ? function (e) {
          var t = e.context.options,
              n = t.selectLongPressDelay;
          null == n && (n = t.longPressDelay);
          return n;
        }(r) : null;
      }, n.handleDragStart = function (e) {
        n.component.context.calendarApi.unselect(e);
      }, n.handleHitUpdate = function (e, t) {
        var o = n.component.context,
            i = null,
            a = !1;

        if (e) {
          var s = n.hitDragging.initialHit;
          e.componentId === s.componentId && n.isHitComboAllowed && !n.isHitComboAllowed(s, e) || (i = function (e, t, n) {
            var o = e.dateSpan,
                i = t.dateSpan,
                a = [o.range.start, o.range.end, i.range.start, i.range.end];
            a.sort(Ge);

            for (var s = {}, l = 0, u = n; l < u.length; l++) {
              var c = (0, u[l])(e, t);
              if (!1 === c) return null;
              c && _r2(s, c);
            }

            return s.range = {
              start: a[0],
              end: a[3]
            }, s.allDay = o.allDay, s;
          }(s, e, o.pluginHooks.dateSelectionTransformers)), i && Ca(i, e.dateProfile, o) || (a = !0, i = null);
        }

        i ? o.dispatch({
          type: "SELECT_DATES",
          selection: i
        }) : t || o.dispatch({
          type: "UNSELECT_DATES"
        }), a ? He() : Oe(), t || (n.dragSelection = i);
      }, n.handlePointerUp = function (e) {
        n.dragSelection && (dr(n.dragSelection, e, n.component.context), n.dragSelection = null);
      };
      var o = t.component.context.options,
          i = n.dragging = new _s(t.el);
      i.touchScrollAllowed = !1, i.minDistance = o.selectMinDistance || 0, i.autoScroller.isEnabled = o.dragScroll;
      var a = n.hitDragging = new ks(n.dragging, Zi(t));
      return a.emitter.on("pointerdown", n.handlePointerDown), a.emitter.on("dragstart", n.handleDragStart), a.emitter.on("hitupdate", n.handleHitUpdate), a.emitter.on("pointerup", n.handlePointerUp), n;
    }

    return n(t, e), t.prototype.destroy = function () {
      this.dragging.destroy();
    }, t;
  }(qi);

  var Ns = function (e) {
    function t(n) {
      var o = e.call(this, n) || this;
      o.subjectEl = null, o.subjectSeg = null, o.isDragging = !1, o.eventRange = null, o.relevantEvents = null, o.receivingContext = null, o.validMutation = null, o.mutatedRelevantEvents = null, o.handlePointerDown = function (e) {
        var t = e.origEvent.target,
            n = o,
            r = n.component,
            i = n.dragging,
            a = i.mirror,
            s = r.context.options,
            l = r.context;
        o.subjectEl = e.subjectEl;
        var u = o.subjectSeg = Yn(e.subjectEl),
            c = (o.eventRange = u.eventRange).instance.instanceId;
        o.relevantEvents = gn(l.getCurrentData().eventStore, c), i.minDistance = e.isTouch ? 0 : s.eventDragMinDistance, i.delay = e.isTouch && c !== r.props.eventSelection ? function (e) {
          var t = e.context.options,
              n = t.eventLongPressDelay;
          null == n && (n = t.longPressDelay);
          return n;
        }(r) : null, s.fixedMirrorParent ? a.parentNode = s.fixedMirrorParent : a.parentNode = Se(t, ".fc"), a.revertDuration = s.dragRevertDuration;
        var d = r.isValidSegDownEl(t) && !Se(t, ".fc-event-resizer");
        i.setIgnoreMove(!d), o.isDragging = d && e.subjectEl.classList.contains("fc-event-draggable");
      }, o.handleDragStart = function (e) {
        var t = o.component.context,
            n = o.eventRange,
            r = n.instance.instanceId;
        e.isTouch ? r !== o.component.props.eventSelection && t.dispatch({
          type: "SELECT_EVENT",
          eventInstanceId: r
        }) : t.dispatch({
          type: "UNSELECT_EVENT"
        }), o.isDragging && (t.calendarApi.unselect(e), t.emitter.trigger("eventDragStart", {
          el: o.subjectEl,
          event: new Cr(t, n.def, n.instance),
          jsEvent: e.origEvent,
          view: t.viewApi
        }));
      }, o.handleHitUpdate = function (e, t) {
        if (o.isDragging) {
          var n = o.relevantEvents,
              r = o.hitDragging.initialHit,
              i = o.component.context,
              a = null,
              s = null,
              l = null,
              u = !1,
              c = {
            affectedEvents: n,
            mutatedEvents: {
              defs: {},
              instances: {}
            },
            isEvent: !0
          };

          if (e) {
            var d = (a = e.context).options;
            i === a || d.editable && d.droppable ? (s = function (e, t, n) {
              var r = e.dateSpan,
                  o = t.dateSpan,
                  i = r.range.start,
                  a = o.range.start,
                  s = {};
              r.allDay !== o.allDay && (s.allDay = o.allDay, s.hasEnd = t.context.options.allDayMaintainDuration, o.allDay && (i = rt(i)));
              var l = An(i, a, e.context.dateEnv, e.componentId === t.componentId ? e.largeUnit : null);
              l.milliseconds && (s.allDay = !1);

              for (var u = {
                datesDelta: l,
                standardProps: s
              }, c = 0, d = n; c < d.length; c++) {
                ;
                (0, d[c])(u, e, t);
              }

              return u;
            }(r, e, a.getCurrentData().pluginHooks.eventDragMutationMassagers)) && (l = hr(n, a.getCurrentData().eventUiBases, s, a), c.mutatedEvents = l, ba(c, e.dateProfile, a) || (u = !0, s = null, l = null, c.mutatedEvents = {
              defs: {},
              instances: {}
            })) : a = null;
          }

          o.displayDrag(a, c), u ? He() : Oe(), t || (i === a && xs(r, e) && (s = null), o.dragging.setMirrorNeedsRevert(!s), o.dragging.setMirrorIsVisible(!e || !document.querySelector(".fc-event-mirror")), o.receivingContext = a, o.validMutation = s, o.mutatedRelevantEvents = l);
        }
      }, o.handlePointerUp = function () {
        o.isDragging || o.cleanup();
      }, o.handleDragEnd = function (e) {
        if (o.isDragging) {
          var t = o.component.context,
              n = t.viewApi,
              i = o,
              a = i.receivingContext,
              s = i.validMutation,
              l = o.eventRange.def,
              u = o.eventRange.instance,
              c = new Cr(t, l, u),
              d = o.relevantEvents,
              p = o.mutatedRelevantEvents,
              f = o.hitDragging.finalHit;

          if (o.clearDrag(), t.emitter.trigger("eventDragStop", {
            el: o.subjectEl,
            event: c,
            jsEvent: e.origEvent,
            view: n
          }), s) {
            if (a === t) {
              var h = new Cr(t, p.defs[l.defId], u ? p.instances[u.instanceId] : null);
              t.dispatch({
                type: "MERGE_EVENTS",
                eventStore: p
              });

              for (var v = {
                oldEvent: c,
                event: h,
                relatedEvents: Rr(p, t, u),
                revert: function revert() {
                  t.dispatch({
                    type: "MERGE_EVENTS",
                    eventStore: d
                  });
                }
              }, g = {}, m = 0, y = t.getCurrentData().pluginHooks.eventDropTransformers; m < y.length; m++) {
                var E = y[m];

                _r2(g, E(s, t));
              }

              t.emitter.trigger("eventDrop", _r2(_r2(_r2({}, v), g), {
                el: e.subjectEl,
                delta: s.datesDelta,
                jsEvent: e.origEvent,
                view: n
              })), t.emitter.trigger("eventChange", v);
            } else if (a) {
              var S = {
                event: c,
                relatedEvents: Rr(d, t, u),
                revert: function revert() {
                  t.dispatch({
                    type: "MERGE_EVENTS",
                    eventStore: d
                  });
                }
              };
              t.emitter.trigger("eventLeave", _r2(_r2({}, S), {
                draggedEl: e.subjectEl,
                view: n
              })), t.dispatch({
                type: "REMOVE_EVENTS",
                eventStore: d
              }), t.emitter.trigger("eventRemove", S);
              var D = p.defs[l.defId],
                  b = p.instances[u.instanceId],
                  C = new Cr(a, D, b);
              a.dispatch({
                type: "MERGE_EVENTS",
                eventStore: p
              });
              var w = {
                event: C,
                relatedEvents: Rr(p, a, b),
                revert: function revert() {
                  a.dispatch({
                    type: "REMOVE_EVENTS",
                    eventStore: p
                  });
                }
              };
              a.emitter.trigger("eventAdd", w), e.isTouch && a.dispatch({
                type: "SELECT_EVENT",
                eventInstanceId: u.instanceId
              }), a.emitter.trigger("drop", _r2(_r2({}, Ms(f.dateSpan, a)), {
                draggedEl: e.subjectEl,
                jsEvent: e.origEvent,
                view: f.context.viewApi
              })), a.emitter.trigger("eventReceive", _r2(_r2({}, w), {
                draggedEl: e.subjectEl,
                view: f.context.viewApi
              }));
            }
          } else t.emitter.trigger("_noEventDrop");
        }

        o.cleanup();
      };
      var i = o.component.context.options,
          a = o.dragging = new _s(n.el);
      a.pointer.selector = t.SELECTOR, a.touchScrollAllowed = !1, a.autoScroller.isEnabled = i.dragScroll;
      var s = o.hitDragging = new ks(o.dragging, Xi);
      return s.useSubjectCenter = n.useEventCenter, s.emitter.on("pointerdown", o.handlePointerDown), s.emitter.on("dragstart", o.handleDragStart), s.emitter.on("hitupdate", o.handleHitUpdate), s.emitter.on("pointerup", o.handlePointerUp), s.emitter.on("dragend", o.handleDragEnd), o;
    }

    return n(t, e), t.prototype.destroy = function () {
      this.dragging.destroy();
    }, t.prototype.displayDrag = function (e, t) {
      var n = this.component.context,
          r = this.receivingContext;
      r && r !== e && (r === n ? r.dispatch({
        type: "SET_EVENT_DRAG",
        state: {
          affectedEvents: t.affectedEvents,
          mutatedEvents: {
            defs: {},
            instances: {}
          },
          isEvent: !0
        }
      }) : r.dispatch({
        type: "UNSET_EVENT_DRAG"
      })), e && e.dispatch({
        type: "SET_EVENT_DRAG",
        state: t
      });
    }, t.prototype.clearDrag = function () {
      var e = this.component.context,
          t = this.receivingContext;
      t && t.dispatch({
        type: "UNSET_EVENT_DRAG"
      }), e !== t && e.dispatch({
        type: "UNSET_EVENT_DRAG"
      });
    }, t.prototype.cleanup = function () {
      ;
      this.subjectSeg = null, this.isDragging = !1, this.eventRange = null, this.relevantEvents = null, this.receivingContext = null, this.validMutation = null, this.mutatedRelevantEvents = null;
    }, t.SELECTOR = ".fc-event-draggable, .fc-event-resizable", t;
  }(qi);

  var Hs = function (e) {
    function t(t) {
      var n = e.call(this, t) || this;
      n.draggingSegEl = null, n.draggingSeg = null, n.eventRange = null, n.relevantEvents = null, n.validMutation = null, n.mutatedRelevantEvents = null, n.handlePointerDown = function (e) {
        var t = n.component,
            r = Yn(n.querySegEl(e)),
            o = n.eventRange = r.eventRange;
        n.dragging.minDistance = t.context.options.eventDragMinDistance, n.dragging.setIgnoreMove(!n.component.isValidSegDownEl(e.origEvent.target) || e.isTouch && n.component.props.eventSelection !== o.instance.instanceId);
      }, n.handleDragStart = function (e) {
        var t = n.component.context,
            r = n.eventRange;
        n.relevantEvents = gn(t.getCurrentData().eventStore, n.eventRange.instance.instanceId);
        var o = n.querySegEl(e);
        n.draggingSegEl = o, n.draggingSeg = Yn(o), t.calendarApi.unselect(), t.emitter.trigger("eventResizeStart", {
          el: o,
          event: new Cr(t, r.def, r.instance),
          jsEvent: e.origEvent,
          view: t.viewApi
        });
      }, n.handleHitUpdate = function (e, t, r) {
        var o = n.component.context,
            i = n.relevantEvents,
            a = n.hitDragging.initialHit,
            s = n.eventRange.instance,
            l = null,
            u = null,
            c = !1,
            d = {
          affectedEvents: i,
          mutatedEvents: {
            defs: {},
            instances: {}
          },
          isEvent: !0
        };
        e && (e.componentId === a.componentId && n.isHitComboAllowed && !n.isHitComboAllowed(a, e) || (l = function (e, t, n, r) {
          var o = e.context.dateEnv,
              i = e.dateSpan.range.start,
              a = t.dateSpan.range.start,
              s = An(i, a, o, e.largeUnit);

          if (n) {
            if (o.add(r.start, s) < r.end) return {
              startDelta: s
            };
          } else if (o.add(r.end, s) > r.start) return {
            endDelta: s
          };

          return null;
        }(a, e, r.subjectEl.classList.contains("fc-event-resizer-start"), s.range)));
        l && (u = hr(i, o.getCurrentData().eventUiBases, l, o), d.mutatedEvents = u, ba(d, e.dateProfile, o) || (c = !0, l = null, u = null, d.mutatedEvents = null)), u ? o.dispatch({
          type: "SET_EVENT_RESIZE",
          state: d
        }) : o.dispatch({
          type: "UNSET_EVENT_RESIZE"
        }), c ? He() : Oe(), t || (l && xs(a, e) && (l = null), n.validMutation = l, n.mutatedRelevantEvents = u);
      }, n.handleDragEnd = function (e) {
        var t = n.component.context,
            o = n.eventRange.def,
            i = n.eventRange.instance,
            a = new Cr(t, o, i),
            s = n.relevantEvents,
            l = n.mutatedRelevantEvents;

        if (t.emitter.trigger("eventResizeStop", {
          el: n.draggingSegEl,
          event: a,
          jsEvent: e.origEvent,
          view: t.viewApi
        }), n.validMutation) {
          var u = new Cr(t, l.defs[o.defId], i ? l.instances[i.instanceId] : null);
          t.dispatch({
            type: "MERGE_EVENTS",
            eventStore: l
          });
          var c = {
            oldEvent: a,
            event: u,
            relatedEvents: Rr(l, t, i),
            revert: function revert() {
              t.dispatch({
                type: "MERGE_EVENTS",
                eventStore: s
              });
            }
          };
          t.emitter.trigger("eventResize", _r2(_r2({}, c), {
            el: n.draggingSegEl,
            startDelta: n.validMutation.startDelta || kt(0),
            endDelta: n.validMutation.endDelta || kt(0),
            jsEvent: e.origEvent,
            view: t.viewApi
          })), t.emitter.trigger("eventChange", c);
        } else t.emitter.trigger("_noEventResize");

        n.draggingSeg = null, n.relevantEvents = null, n.validMutation = null;
      };
      var o = t.component,
          i = n.dragging = new _s(t.el);
      i.pointer.selector = ".fc-event-resizer", i.touchScrollAllowed = !1, i.autoScroller.isEnabled = o.context.options.dragScroll;
      var a = n.hitDragging = new ks(n.dragging, Zi(t));
      return a.emitter.on("pointerdown", n.handlePointerDown), a.emitter.on("dragstart", n.handleDragStart), a.emitter.on("hitupdate", n.handleHitUpdate), a.emitter.on("dragend", n.handleDragEnd), n;
    }

    return n(t, e), t.prototype.destroy = function () {
      this.dragging.destroy();
    }, t.prototype.querySegEl = function (e) {
      return Se(e.subjectEl, ".fc-event");
    }, t;
  }(qi);

  var Os = function () {
    function e(e) {
      var t = this;
      this.context = e, this.isRecentPointerDateSelect = !1, this.matchesCancel = !1, this.matchesEvent = !1, this.onSelect = function (e) {
        e.jsEvent && (t.isRecentPointerDateSelect = !0);
      }, this.onDocumentPointerDown = function (e) {
        var n = t.context.options.unselectCancel,
            r = e.origEvent.target;
        t.matchesCancel = !!Se(r, n), t.matchesEvent = !!Se(r, Ns.SELECTOR);
      }, this.onDocumentPointerUp = function (e) {
        var n = t.context,
            r = t.documentPointer,
            o = n.getCurrentData();

        if (!r.wasTouchScroll) {
          if (o.dateSelection && !t.isRecentPointerDateSelect) {
            var i = n.options.unselectAuto;
            !i || i && t.matchesCancel || n.calendarApi.unselect(e);
          }

          o.eventSelection && !t.matchesEvent && n.dispatch({
            type: "UNSELECT_EVENT"
          });
        }

        t.isRecentPointerDateSelect = !1;
      };
      var n = this.documentPointer = new ys(document);
      n.shouldIgnoreMove = !0, n.shouldWatchScroll = !1, n.emitter.on("pointerdown", this.onDocumentPointerDown), n.emitter.on("pointerup", this.onDocumentPointerUp), e.emitter.on("select", this.onSelect);
    }

    return e.prototype.destroy = function () {
      this.context.emitter.off("select", this.onSelect), this.documentPointer.destroy();
    }, e;
  }(),
      As = {
    fixedMirrorParent: fn
  },
      Us = {
    dateClick: fn,
    eventDragStart: fn,
    eventDragStop: fn,
    eventDrop: fn,
    eventResizeStart: fn,
    eventResizeStop: fn,
    eventResize: fn,
    drop: fn,
    eventReceive: fn,
    eventLeave: fn
  },
      Ls = function () {
    function e(e, t) {
      var n = this;
      this.receivingContext = null, this.droppableEvent = null, this.suppliedDragMeta = null, this.dragMeta = null, this.handleDragStart = function (e) {
        n.dragMeta = n.buildDragMeta(e.subjectEl);
      }, this.handleHitUpdate = function (e, t, o) {
        var i = n.hitDragging.dragging,
            a = null,
            s = null,
            l = !1,
            u = {
          affectedEvents: {
            defs: {},
            instances: {}
          },
          mutatedEvents: {
            defs: {},
            instances: {}
          },
          isEvent: n.dragMeta.create
        };
        e && (a = e.context, n.canDropElOnCalendar(o.subjectEl, a) && (s = function (e, t, n) {
          for (var o = _r2({}, t.leftoverProps), i = 0, a = n.pluginHooks.externalDefTransforms; i < a.length; i++) {
            var s = a[i];

            _r2(o, s(e, t));
          }

          var l = Mn(o, n),
              u = l.refined,
              c = l.extra,
              d = In(u, c, t.sourceId, e.allDay, n.options.forceEventDuration || Boolean(t.duration), n),
              p = e.range.start;
          e.allDay && t.startTime && (p = n.dateEnv.add(p, t.startTime));
          var f = t.duration ? n.dateEnv.add(p, t.duration) : fr(e.allDay, p, n),
              h = pt(d.defId, {
            start: p,
            end: f
          });
          return {
            def: d,
            instance: h
          };
        }(e.dateSpan, n.dragMeta, a), u.mutatedEvents = vn(s), (l = !ba(u, e.dateProfile, a)) && (u.mutatedEvents = {
          defs: {},
          instances: {}
        }, s = null))), n.displayDrag(a, u), i.setMirrorIsVisible(t || !s || !document.querySelector(".fc-event-mirror")), l ? He() : Oe(), t || (i.setMirrorNeedsRevert(!s), n.receivingContext = a, n.droppableEvent = s);
      }, this.handleDragEnd = function (e) {
        var t = n,
            o = t.receivingContext,
            i = t.droppableEvent;

        if (n.clearDrag(), o && i) {
          var a = n.hitDragging.finalHit,
              s = a.context.viewApi,
              l = n.dragMeta;

          if (o.emitter.trigger("drop", _r2(_r2({}, Ms(a.dateSpan, o)), {
            draggedEl: e.subjectEl,
            jsEvent: e.origEvent,
            view: s
          })), l.create) {
            var u = vn(i);
            o.dispatch({
              type: "MERGE_EVENTS",
              eventStore: u
            }), e.isTouch && o.dispatch({
              type: "SELECT_EVENT",
              eventInstanceId: i.instance.instanceId
            }), o.emitter.trigger("eventReceive", {
              event: new Cr(o, i.def, i.instance),
              relatedEvents: [],
              revert: function revert() {
                o.dispatch({
                  type: "REMOVE_EVENTS",
                  eventStore: u
                });
              },
              draggedEl: e.subjectEl,
              view: s
            });
          }
        }

        ;
        n.receivingContext = null, n.droppableEvent = null;
      };
      var o = this.hitDragging = new ks(e, Xi);
      o.requireInitial = !1, o.emitter.on("dragstart", this.handleDragStart), o.emitter.on("hitupdate", this.handleHitUpdate), o.emitter.on("dragend", this.handleDragEnd), this.suppliedDragMeta = t;
    }

    return e.prototype.buildDragMeta = function (e) {
      return "object" == _typeof(this.suppliedDragMeta) ? Qi(this.suppliedDragMeta) : "function" == typeof this.suppliedDragMeta ? Qi(this.suppliedDragMeta(e)) : Qi((t = function (e, t) {
        var n = $i.dataAttrPrefix,
            r = (n ? n + "-" : "") + t;
        return e.getAttribute("data-" + r) || "";
      }(e, "event")) ? JSON.parse(t) : {
        create: !1
      });
      var t;
    }, e.prototype.displayDrag = function (e, t) {
      var n = this.receivingContext;
      n && n !== e && n.dispatch({
        type: "UNSET_EVENT_DRAG"
      }), e && e.dispatch({
        type: "SET_EVENT_DRAG",
        state: t
      });
    }, e.prototype.clearDrag = function () {
      this.receivingContext && this.receivingContext.dispatch({
        type: "UNSET_EVENT_DRAG"
      });
    }, e.prototype.canDropElOnCalendar = function (e, t) {
      var n = t.options.dropAccept;
      return "function" == typeof n ? n.call(t.calendarApi, e) : "string" != typeof n || !n || Boolean(De(e, n));
    }, e;
  }();

  $i.dataAttrPrefix = "";

  var Ws = function () {
    function e(e, t) {
      var n = this;
      void 0 === t && (t = {}), this.handlePointerDown = function (e) {
        var t = n.dragging,
            r = n.settings,
            o = r.minDistance,
            i = r.longPressDelay;
        t.minDistance = null != o ? o : e.isTouch ? 0 : on.eventDragMinDistance, t.delay = e.isTouch ? null != i ? i : on.longPressDelay : 0;
      }, this.handleDragStart = function (e) {
        e.isTouch && n.dragging.delay && e.subjectEl.classList.contains("fc-event") && n.dragging.mirror.getMirrorEl().classList.add("fc-event-selected");
      }, this.settings = t;
      var r = this.dragging = new _s(e);
      r.touchScrollAllowed = !1, null != t.itemSelector && (r.pointer.selector = t.itemSelector), null != t.appendTo && (r.mirror.parentNode = t.appendTo), r.emitter.on("pointerdown", this.handlePointerDown), r.emitter.on("dragstart", this.handleDragStart), new Ls(r, t.eventData);
    }

    return e.prototype.destroy = function () {
      this.dragging.destroy();
    }, e;
  }(),
      Vs = function (e) {
    function t(t) {
      var n = e.call(this, t) || this;
      n.shouldIgnoreMove = !1, n.mirrorSelector = "", n.currentMirrorEl = null, n.handlePointerDown = function (e) {
        n.emitter.trigger("pointerdown", e), n.shouldIgnoreMove || n.emitter.trigger("dragstart", e);
      }, n.handlePointerMove = function (e) {
        n.shouldIgnoreMove || n.emitter.trigger("dragmove", e);
      }, n.handlePointerUp = function (e) {
        n.emitter.trigger("pointerup", e), n.shouldIgnoreMove || n.emitter.trigger("dragend", e);
      };
      var r = n.pointer = new ys(t);
      return r.emitter.on("pointerdown", n.handlePointerDown), r.emitter.on("pointermove", n.handlePointerMove), r.emitter.on("pointerup", n.handlePointerUp), n;
    }

    return n(t, e), t.prototype.destroy = function () {
      this.pointer.destroy();
    }, t.prototype.setIgnoreMove = function (e) {
      this.shouldIgnoreMove = e;
    }, t.prototype.setMirrorIsVisible = function (e) {
      if (e) this.currentMirrorEl && (this.currentMirrorEl.style.visibility = "", this.currentMirrorEl = null);else {
        var t = this.mirrorSelector ? document.querySelector(this.mirrorSelector) : null;
        t && (this.currentMirrorEl = t, t.style.visibility = "hidden");
      }
    }, t;
  }(Ki),
      Fs = function () {
    function e(e, t) {
      var n = document;
      e === document || e instanceof Element ? (n = e, t = t || {}) : t = e || {};
      var r = this.dragging = new Vs(n);
      "string" == typeof t.itemSelector ? r.pointer.selector = t.itemSelector : n === document && (r.pointer.selector = "[data-event]"), "string" == typeof t.mirrorSelector && (r.mirrorSelector = t.mirrorSelector), new Ls(r, t.eventData);
    }

    return e.prototype.destroy = function () {
      this.dragging.destroy();
    }, e;
  }(),
      zs = Ho({
    componentInteractions: [Ps, Is, Ns, Hs],
    calendarInteractions: [Os],
    elementDraggingImpl: _s,
    optionRefiners: As,
    listenerRefiners: Us
  }),
      Bs = function (e) {
    function t() {
      var t = null !== e && e.apply(this, arguments) || this;
      return t.headerElRef = Eo(), t;
    }

    return n(t, e), t.prototype.renderSimpleLayout = function (e, t) {
      var n = this.props,
          r = this.context,
          o = [],
          i = ja(r.options);
      return e && o.push({
        type: "header",
        key: "header",
        isSticky: i,
        chunk: {
          elRef: this.headerElRef,
          tableClassName: "fc-col-header",
          rowContent: e
        }
      }), o.push({
        type: "body",
        key: "body",
        liquid: !0,
        chunk: {
          content: t
        }
      }), mo(qo, {
        viewSpec: r.viewSpec
      }, function (e, t) {
        return mo("div", {
          ref: e,
          className: ["fc-daygrid"].concat(t).join(" ")
        }, mo(qa, {
          liquid: !n.isHeightAuto && !n.forPrint,
          collapsibleWidth: n.forPrint,
          cols: [],
          sections: o
        }));
      });
    }, t.prototype.renderHScrollLayout = function (e, t, n, r) {
      var o = this.context.pluginHooks.scrollGridImpl;
      if (!o) throw new Error("No ScrollGrid implementation");
      var i = this.props,
          a = this.context,
          s = !i.forPrint && ja(a.options),
          l = !i.forPrint && Ga(a.options),
          u = [];
      return e && u.push({
        type: "header",
        key: "header",
        isSticky: s,
        chunks: [{
          key: "main",
          elRef: this.headerElRef,
          tableClassName: "fc-col-header",
          rowContent: e
        }]
      }), u.push({
        type: "body",
        key: "body",
        liquid: !0,
        chunks: [{
          key: "main",
          content: t
        }]
      }), l && u.push({
        type: "footer",
        key: "footer",
        isSticky: !0,
        chunks: [{
          key: "main",
          content: Ba
        }]
      }), mo(qo, {
        viewSpec: a.viewSpec
      }, function (e, t) {
        return mo("div", {
          ref: e,
          className: ["fc-daygrid"].concat(t).join(" ")
        }, mo(o, {
          liquid: !i.isHeightAuto && !i.forPrint,
          collapsibleWidth: i.forPrint,
          colGroups: [{
            cols: [{
              span: n,
              minWidth: r
            }]
          }],
          sections: u
        }));
      });
    }, t;
  }(No);

  function js(e, t) {
    for (var n = [], r = 0; r < t; r += 1) {
      n[r] = [];
    }

    for (var o = 0, i = e; o < i.length; o++) {
      var a = i[o];
      n[a.row].push(a);
    }

    return n;
  }

  function Gs(e, t) {
    for (var n = [], r = 0; r < t; r += 1) {
      n[r] = [];
    }

    for (var o = 0, i = e; o < i.length; o++) {
      var a = i[o];
      n[a.firstCol].push(a);
    }

    return n;
  }

  function qs(e, t) {
    var n = [];

    if (e) {
      for (a = 0; a < t; a += 1) {
        n[a] = {
          affectedInstances: e.affectedInstances,
          isEvent: e.isEvent,
          segs: []
        };
      }

      for (var r = 0, o = e.segs; r < o.length; r++) {
        var i = o[r];
        n[i.row].segs.push(i);
      }
    } else for (var a = 0; a < t; a += 1) {
      n[a] = null;
    }

    return n;
  }

  var Ys = function (e) {
    function t() {
      return null !== e && e.apply(this, arguments) || this;
    }

    return n(t, e), t.prototype.render = function () {
      var e = this.props,
          t = this.context.options.navLinks ? {
        "data-navlink": Jr(e.date),
        tabIndex: 0
      } : {};
      return mo(Ja, {
        date: e.date,
        dateProfile: e.dateProfile,
        todayRange: e.todayRange,
        showDayNumber: e.showDayNumber,
        extraHookProps: e.extraHookProps,
        defaultContent: Zs
      }, function (n, o) {
        return (o || e.forceDayTop) && mo("div", {
          className: "fc-daygrid-day-top",
          ref: n
        }, mo("a", _r2({
          className: "fc-daygrid-day-number"
        }, t), o || mo(So, null, " ")));
      });
    }, t;
  }(xo);

  function Zs(e) {
    return e.dayNumberText;
  }

  var Xs = nn({
    hour: "numeric",
    minute: "2-digit",
    omitZeroMinute: !0,
    meridiem: "narrow"
  });

  function Ks(e) {
    var t = e.eventRange.ui.display;
    return "list-item" === t || "auto" === t && !e.eventRange.def.allDay && e.firstCol === e.lastCol && e.isStart && e.isEnd;
  }

  var $s = function (e) {
    function t() {
      return null !== e && e.apply(this, arguments) || this;
    }

    return n(t, e), t.prototype.render = function () {
      var e = this.props;
      return mo(Za, _r2({}, e, {
        extraClassNames: ["fc-daygrid-event", "fc-daygrid-block-event", "fc-h-event"],
        defaultTimeFormat: Xs,
        defaultDisplayEventEnd: e.defaultDisplayEventEnd,
        disableResizing: !e.seg.eventRange.def.allDay
      }));
    }, t;
  }(xo),
      Js = function (e) {
    function t() {
      return null !== e && e.apply(this, arguments) || this;
    }

    return n(t, e), t.prototype.render = function () {
      var e = this.props,
          t = this.context,
          n = t.options.eventTimeFormat || Xs,
          o = tr(e.seg, n, t, !0, e.defaultDisplayEventEnd);
      return mo(Ya, {
        seg: e.seg,
        timeText: o,
        defaultContent: Qs,
        isDragging: e.isDragging,
        isResizing: !1,
        isDateSelecting: !1,
        isSelected: e.isSelected,
        isPast: e.isPast,
        isFuture: e.isFuture,
        isToday: e.isToday
      }, function (t, n, o, i) {
        return mo("a", _r2({
          className: ["fc-daygrid-event", "fc-daygrid-dot-event"].concat(n).join(" "),
          ref: t
        }, (a = e.seg, (s = a.eventRange.def.url) ? {
          href: s
        } : {})), i);
        var a, s;
      });
    }, t;
  }(xo);

  function Qs(e) {
    return mo(So, null, mo("div", {
      className: "fc-daygrid-event-dot",
      style: {
        borderColor: e.borderColor || e.backgroundColor
      }
    }), e.timeText && mo("div", {
      className: "fc-event-time"
    }, e.timeText), mo("div", {
      className: "fc-event-title"
    }, e.event.title || mo(So, null, " ")));
  }

  var el = function (e) {
    function t() {
      var t = null !== e && e.apply(this, arguments) || this;
      return t.compileSegs = Ft(tl), t;
    }

    return n(t, e), t.prototype.render = function () {
      var e = this.props,
          t = this.compileSegs(e.singlePlacements),
          n = t.allSegs,
          o = t.invisibleSegs;
      return mo(ls, {
        dateProfile: e.dateProfile,
        todayRange: e.todayRange,
        allDayDate: e.allDayDate,
        moreCnt: e.moreCnt,
        allSegs: n,
        hiddenSegs: o,
        alignmentElRef: e.alignmentElRef,
        alignGridTop: e.alignGridTop,
        extraDateSpan: e.extraDateSpan,
        popoverContent: function popoverContent() {
          var t = (e.eventDrag ? e.eventDrag.affectedInstances : null) || (e.eventResize ? e.eventResize.affectedInstances : null) || {};
          return mo(So, null, n.map(function (n) {
            var o = n.eventRange.instance.instanceId;
            return mo("div", {
              className: "fc-daygrid-event-harness",
              key: o,
              style: {
                visibility: t[o] ? "hidden" : ""
              }
            }, Ks(n) ? mo(Js, _r2({
              seg: n,
              isDragging: !1,
              isSelected: o === e.eventSelection,
              defaultDisplayEventEnd: !1
            }, nr(n, e.todayRange))) : mo($s, _r2({
              seg: n,
              isDragging: !1,
              isResizing: !1,
              isDateSelecting: !1,
              isSelected: o === e.eventSelection,
              defaultDisplayEventEnd: !1
            }, nr(n, e.todayRange))));
          }));
        }
      }, function (e, t, n, r, o) {
        return mo("a", {
          ref: e,
          className: ["fc-daygrid-more-link"].concat(t).join(" "),
          onClick: o
        }, r);
      });
    }, t;
  }(xo);

  function tl(e) {
    for (var t = [], n = [], r = 0, o = e; r < o.length; r++) {
      var i = o[r];
      t.push(i.seg), i.isVisible || n.push(i.seg);
    }

    return {
      allSegs: t,
      invisibleSegs: n
    };
  }

  var nl = nn({
    week: "narrow"
  }),
      rl = function (e) {
    function t() {
      var t = null !== e && e.apply(this, arguments) || this;
      return t.rootElRef = Eo(), t.handleRootEl = function (e) {
        Io(t.rootElRef, e), Io(t.props.elRef, e);
      }, t;
    }

    return n(t, e), t.prototype.render = function () {
      var e = this,
          t = e.props,
          n = e.context,
          o = e.rootElRef,
          i = n.options,
          a = t.date,
          s = t.dateProfile,
          l = i.navLinks ? {
        "data-navlink": Jr(a, "week"),
        tabIndex: 0
      } : {};
      return mo(es, {
        date: a,
        dateProfile: s,
        todayRange: t.todayRange,
        showDayNumber: t.showDayNumber,
        extraHookProps: t.extraHookProps,
        elRef: this.handleRootEl
      }, function (e, n, i, u) {
        return mo("td", _r2({
          ref: e,
          className: ["fc-daygrid-day"].concat(n, t.extraClassNames || []).join(" ")
        }, i, t.extraDataAttrs), mo("div", {
          className: "fc-daygrid-day-frame fc-scrollgrid-sync-inner",
          ref: t.innerElRef
        }, t.showWeekNumber && mo(os, {
          date: a,
          defaultFormat: nl
        }, function (e, t, n, o) {
          return mo("a", _r2({
            ref: e,
            className: ["fc-daygrid-week-number"].concat(t).join(" ")
          }, l), o);
        }), !u && mo(Ys, {
          date: a,
          dateProfile: s,
          showDayNumber: t.showDayNumber,
          forceDayTop: t.forceDayTop,
          todayRange: t.todayRange,
          extraHookProps: t.extraHookProps
        }), mo("div", {
          className: "fc-daygrid-day-events",
          ref: t.fgContentElRef
        }, t.fgContent, mo("div", {
          className: "fc-daygrid-day-bottom",
          style: {
            marginTop: t.moreMarginTop
          }
        }, mo(el, {
          allDayDate: a,
          singlePlacements: t.singlePlacements,
          moreCnt: t.moreCnt,
          alignmentElRef: o,
          alignGridTop: !t.showDayNumber,
          extraDateSpan: t.extraDateSpan,
          dateProfile: t.dateProfile,
          eventSelection: t.eventSelection,
          eventDrag: t.eventDrag,
          eventResize: t.eventResize,
          todayRange: t.todayRange
        }))), mo("div", {
          className: "fc-daygrid-day-bg"
        }, t.bgContent)));
      });
    }, t;
  }(No);

  function ol(e, t, n, r, o, i, a) {
    var s = new al();
    s.allowReslicing = !0, s.strictOrder = r, !0 === t || !0 === n ? (s.maxCoord = i, s.hiddenConsumes = !0) : "number" == typeof t ? s.maxStackCnt = t : "number" == typeof n && (s.maxStackCnt = n, s.hiddenConsumes = !0);

    for (var l = [], u = [], c = 0; c < e.length; c += 1) {
      var d = o[(R = e[c]).eventRange.instance.instanceId];
      null != d ? l.push({
        index: c,
        thickness: d,
        span: {
          start: R.firstCol,
          end: R.lastCol + 1
        }
      }) : u.push(R);
    }

    for (var p = s.addSegs(l), f = function (e, t, n) {
      for (var r = function (e, t) {
        for (var n = [], r = 0; r < t; r += 1) {
          n.push([]);
        }

        for (var o = 0, i = e; o < i.length; o++) {
          var a = i[o];

          for (r = a.span.start; r < a.span.end; r += 1) {
            n[r].push(a);
          }
        }

        return n;
      }(e, n.length), o = [], i = [], a = [], s = 0; s < n.length; s += 1) {
        for (var l = r[s], u = [], c = 0, d = 0, p = 0, f = l; p < f.length; p++) {
          var h = t[(y = f[p]).index];
          u.push({
            seg: il(h, s, s + 1, n),
            isVisible: !0,
            isAbsolute: !1,
            absoluteTop: 0,
            marginTop: y.levelCoord - c
          }), c = y.levelCoord + y.thickness;
        }

        var v = [];
        c = 0, d = 0;

        for (var g = 0, m = l; g < m.length; g++) {
          h = t[(y = m[g]).index];
          var y,
              E = y.span.end - y.span.start > 1,
              S = y.span.start === s;
          d += y.levelCoord - c, c = y.levelCoord + y.thickness, E ? (d += y.thickness, S && v.push({
            seg: il(h, y.span.start, y.span.end, n),
            isVisible: !0,
            isAbsolute: !0,
            absoluteTop: y.levelCoord,
            marginTop: 0
          })) : S && (v.push({
            seg: il(h, y.span.start, y.span.end, n),
            isVisible: !0,
            isAbsolute: !1,
            absoluteTop: 0,
            marginTop: d
          }), d = 0);
        }

        o.push(u), i.push(v), a.push(d);
      }

      return {
        singleColPlacements: o,
        multiColPlacements: i,
        leftoverMargins: a
      };
    }(s.toRects(), e, a), h = f.singleColPlacements, v = f.multiColPlacements, g = f.leftoverMargins, m = [], y = [], E = 0, S = u; E < S.length; E++) {
      v[(R = S[E]).firstCol].push({
        seg: R,
        isVisible: !1,
        isAbsolute: !0,
        absoluteTop: 0,
        marginTop: 0
      });

      for (var D = R.firstCol; D <= R.lastCol; D += 1) {
        h[D].push({
          seg: il(R, D, D + 1, a),
          isVisible: !1,
          isAbsolute: !1,
          absoluteTop: 0,
          marginTop: 0
        });
      }
    }

    for (D = 0; D < a.length; D += 1) {
      m.push(0);
    }

    for (var b = 0, C = p; b < C.length; b++) {
      var w = C[b],
          R = e[w.index],
          _ = w.span;

      v[_.start].push({
        seg: il(R, _.start, _.end, a),
        isVisible: !1,
        isAbsolute: !0,
        absoluteTop: 0,
        marginTop: 0
      });

      for (D = _.start; D < _.end; D += 1) {
        m[D] += 1, h[D].push({
          seg: il(R, D, D + 1, a),
          isVisible: !1,
          isAbsolute: !1,
          absoluteTop: 0,
          marginTop: 0
        });
      }
    }

    for (D = 0; D < a.length; D += 1) {
      y.push(g[D]);
    }

    return {
      singleColPlacements: h,
      multiColPlacements: v,
      moreCnts: m,
      moreMarginTops: y
    };
  }

  function il(e, t, n, o) {
    if (e.firstCol === t && e.lastCol === n - 1) return e;
    var i = e.eventRange,
        a = i.range,
        s = Wn(a, {
      start: o[t].date,
      end: Ke(o[n - 1].date, 1)
    });
    return _r2(_r2({}, e), {
      firstCol: t,
      lastCol: n - 1,
      eventRange: {
        def: i.def,
        ui: _r2(_r2({}, i.ui), {
          durationEditable: !1
        }),
        instance: i.instance,
        range: s
      },
      isStart: e.isStart && s.start.valueOf() === a.start.valueOf(),
      isEnd: e.isEnd && s.end.valueOf() === a.end.valueOf()
    });
  }

  var al = function (e) {
    function t() {
      var t = null !== e && e.apply(this, arguments) || this;
      return t.hiddenConsumes = !1, t.forceHidden = {}, t;
    }

    return n(t, e), t.prototype.addSegs = function (t) {
      for (var n = this, r = e.prototype.addSegs.call(this, t), o = this.entriesByLevel, i = function i(e) {
        return !n.forceHidden[Vi(e)];
      }, a = 0; a < o.length; a += 1) {
        o[a] = o[a].filter(i);
      }

      return r;
    }, t.prototype.handleInvalidInsertion = function (t, n, o) {
      var i = this.entriesByLevel,
          a = this.forceHidden,
          s = t.touchingLevel;
      if (this.hiddenConsumes && s >= 0) for (var l = t.lateralStart; l < t.lateralEnd; l += 1) {
        var u = i[s][l];

        if (this.allowReslicing) {
          var c = _r2(_r2({}, u), {
            span: Bi(u.span, n.span)
          });

          a[d = Vi(c)] || (a[d] = !0, i[s][l] = c, this.splitEntry(u, n, o));
        } else {
          var d;
          a[d = Vi(u)] || (a[d] = !0, o.push(u));
        }
      }
      return e.prototype.handleInvalidInsertion.call(this, t, n, o);
    }, t;
  }(Li),
      sl = function (e) {
    function t() {
      var t = null !== e && e.apply(this, arguments) || this;
      return t.cellElRefs = new Ia(), t.frameElRefs = new Ia(), t.fgElRefs = new Ia(), t.segHarnessRefs = new Ia(), t.rootElRef = Eo(), t.state = {
        framePositions: null,
        maxContentHeight: null,
        eventInstanceHeights: {}
      }, t;
    }

    return n(t, e), t.prototype.render = function () {
      var e = this,
          t = this,
          n = t.props,
          r = t.state,
          o = t.context.options,
          i = n.cells.length,
          a = Gs(n.businessHourSegs, i),
          s = Gs(n.bgEventSegs, i),
          l = Gs(this.getHighlightSegs(), i),
          u = Gs(this.getMirrorSegs(), i),
          c = ol(Kn(n.fgEventSegs, o.eventOrder), n.dayMaxEvents, n.dayMaxEventRows, o.eventOrderStrict, r.eventInstanceHeights, r.maxContentHeight, n.cells),
          d = c.singleColPlacements,
          p = c.multiColPlacements,
          f = c.moreCnts,
          h = c.moreMarginTops,
          v = n.eventDrag && n.eventDrag.affectedInstances || n.eventResize && n.eventResize.affectedInstances || {};
      return mo("tr", {
        ref: this.rootElRef
      }, n.renderIntro && n.renderIntro(), n.cells.map(function (t, r) {
        var o = e.renderFgSegs(r, n.forPrint ? d[r] : p[r], n.todayRange, v),
            i = e.renderFgSegs(r, function (e, t) {
          if (!e.length) return [];

          var n = function (e) {
            for (var t = {}, n = 0, r = e; n < r.length; n++) {
              for (var o = 0, i = r[n]; o < i.length; o++) {
                var a = i[o];
                t[a.seg.eventRange.instance.instanceId] = a.absoluteTop;
              }
            }

            return e;
          }(t);

          return e.map(function (e) {
            return {
              seg: e,
              isVisible: !0,
              isAbsolute: !0,
              absoluteTop: n[e.eventRange.instance.instanceId],
              marginTop: 0
            };
          });
        }(u[r], p), n.todayRange, {}, Boolean(n.eventDrag), Boolean(n.eventResize), !1);
        return mo(rl, {
          key: t.key,
          elRef: e.cellElRefs.createRef(t.key),
          innerElRef: e.frameElRefs.createRef(t.key),
          dateProfile: n.dateProfile,
          date: t.date,
          showDayNumber: n.showDayNumbers,
          showWeekNumber: n.showWeekNumbers && 0 === r,
          forceDayTop: n.showWeekNumbers,
          todayRange: n.todayRange,
          eventSelection: n.eventSelection,
          eventDrag: n.eventDrag,
          eventResize: n.eventResize,
          extraHookProps: t.extraHookProps,
          extraDataAttrs: t.extraDataAttrs,
          extraClassNames: t.extraClassNames,
          extraDateSpan: t.extraDateSpan,
          moreCnt: f[r],
          moreMarginTop: h[r],
          singlePlacements: d[r],
          fgContentElRef: e.fgElRefs.createRef(t.key),
          fgContent: mo(So, null, mo(So, null, o), mo(So, null, i)),
          bgContent: mo(So, null, e.renderFillSegs(l[r], "highlight"), e.renderFillSegs(a[r], "non-business"), e.renderFillSegs(s[r], "bg-event"))
        });
      }));
    }, t.prototype.componentDidMount = function () {
      this.updateSizing(!0);
    }, t.prototype.componentDidUpdate = function (e, t) {
      var n = this.props;
      this.updateSizing(!Et(e, n));
    }, t.prototype.getHighlightSegs = function () {
      var e = this.props;
      return e.eventDrag && e.eventDrag.segs.length ? e.eventDrag.segs : e.eventResize && e.eventResize.segs.length ? e.eventResize.segs : e.dateSelectionSegs;
    }, t.prototype.getMirrorSegs = function () {
      var e = this.props;
      return e.eventResize && e.eventResize.segs.length ? e.eventResize.segs : [];
    }, t.prototype.renderFgSegs = function (e, t, n, o, i, a, s) {
      var l = this.context,
          u = this.props.eventSelection,
          c = this.state.framePositions,
          d = 1 === this.props.cells.length,
          p = i || a || s,
          f = [];
      if (c) for (var h = 0, v = t; h < v.length; h++) {
        var g = v[h],
            m = g.seg,
            y = m.eventRange.instance.instanceId,
            E = y + ":" + e,
            S = g.isVisible && !o[y],
            D = g.isAbsolute,
            b = "",
            C = "";
        D && (l.isRtl ? (C = 0, b = c.lefts[m.lastCol] - c.lefts[m.firstCol]) : (b = 0, C = c.rights[m.firstCol] - c.rights[m.lastCol])), f.push(mo("div", {
          className: "fc-daygrid-event-harness" + (D ? " fc-daygrid-event-harness-abs" : ""),
          key: E,
          ref: p ? null : this.segHarnessRefs.createRef(E),
          style: {
            visibility: S ? "" : "hidden",
            marginTop: D ? "" : g.marginTop,
            top: D ? g.absoluteTop : "",
            left: b,
            right: C
          }
        }, Ks(m) ? mo(Js, _r2({
          seg: m,
          isDragging: i,
          isSelected: y === u,
          defaultDisplayEventEnd: d
        }, nr(m, n))) : mo($s, _r2({
          seg: m,
          isDragging: i,
          isResizing: a,
          isDateSelecting: s,
          isSelected: y === u,
          defaultDisplayEventEnd: d
        }, nr(m, n)))));
      }
      return f;
    }, t.prototype.renderFillSegs = function (e, t) {
      var n = this.context.isRtl,
          i = this.props.todayRange,
          a = this.state.framePositions,
          s = [];
      if (a) for (var l = 0, u = e; l < u.length; l++) {
        var c = u[l],
            d = n ? {
          right: 0,
          left: a.lefts[c.lastCol] - a.lefts[c.firstCol]
        } : {
          left: 0,
          right: a.rights[c.firstCol] - a.rights[c.lastCol]
        };
        s.push(mo("div", {
          key: or(c.eventRange),
          className: "fc-daygrid-bg-harness",
          style: d
        }, "bg-event" === t ? mo(ns, _r2({
          seg: c
        }, nr(c, i))) : ts(t)));
      }
      return mo.apply(void 0, o([So, {}], s));
    }, t.prototype.updateSizing = function (e) {
      var t = this.props,
          n = this.frameElRefs;

      if (!t.forPrint && null !== t.clientWidth) {
        if (e) {
          var r = t.cells.map(function (e) {
            return n.currentMap[e.key];
          });

          if (r.length) {
            var o = this.rootElRef.current;
            this.setState({
              framePositions: new co(o, r, !0, !1)
            });
          }
        }

        var i = !0 === t.dayMaxEvents || !0 === t.dayMaxEventRows;
        this.setState({
          eventInstanceHeights: this.queryEventInstanceHeights(),
          maxContentHeight: i ? this.computeMaxContentHeight() : null
        });
      }
    }, t.prototype.queryEventInstanceHeights = function () {
      var e = this.segHarnessRefs.currentMap,
          t = {};

      for (var n in e) {
        var r = Math.round(e[n].getBoundingClientRect().height),
            o = n.split(":")[0];
        t[o] = Math.max(t[o] || 0, r);
      }

      return t;
    }, t.prototype.computeMaxContentHeight = function () {
      var e = this.props.cells[0].key,
          t = this.cellElRefs.currentMap[e],
          n = this.fgElRefs.currentMap[e];
      return t.getBoundingClientRect().bottom - n.getBoundingClientRect().top;
    }, t.prototype.getCellEls = function () {
      var e = this.cellElRefs.currentMap;
      return this.props.cells.map(function (t) {
        return e[t.key];
      });
    }, t;
  }(No);

  sl.addStateEquality({
    eventInstanceHeights: Et
  });

  var ll = function (e) {
    function t() {
      var t = null !== e && e.apply(this, arguments) || this;
      return t.splitBusinessHourSegs = Ft(js), t.splitBgEventSegs = Ft(js), t.splitFgEventSegs = Ft(js), t.splitDateSelectionSegs = Ft(js), t.splitEventDrag = Ft(qs), t.splitEventResize = Ft(qs), t.rowRefs = new Ia(), t.handleRootEl = function (e) {
        ;
        t.rootEl = e, e ? t.context.registerInteractiveComponent(t, {
          el: e,
          isHitComboAllowed: t.props.isHitComboAllowed
        }) : t.context.unregisterInteractiveComponent(t);
      }, t;
    }

    return n(t, e), t.prototype.render = function () {
      var e = this,
          t = this.props,
          n = t.dateProfile,
          r = t.dayMaxEventRows,
          o = t.dayMaxEvents,
          i = t.expandRows,
          a = t.cells.length,
          s = this.splitBusinessHourSegs(t.businessHourSegs, a),
          l = this.splitBgEventSegs(t.bgEventSegs, a),
          u = this.splitFgEventSegs(t.fgEventSegs, a),
          c = this.splitDateSelectionSegs(t.dateSelectionSegs, a),
          d = this.splitEventDrag(t.eventDrag, a),
          p = this.splitEventResize(t.eventResize, a),
          f = !0 === o || !0 === r;
      return f && !i && (f = !1, r = null, o = null), mo("div", {
        className: ["fc-daygrid-body", f ? "fc-daygrid-body-balanced" : "fc-daygrid-body-unbalanced", i ? "" : "fc-daygrid-body-natural"].join(" "),
        ref: this.handleRootEl,
        style: {
          width: t.clientWidth,
          minWidth: t.tableMinWidth
        }
      }, mo(ha, {
        unit: "day"
      }, function (f, h) {
        return mo(So, null, mo("table", {
          className: "fc-scrollgrid-sync-table",
          style: {
            width: t.clientWidth,
            minWidth: t.tableMinWidth,
            height: i ? t.clientHeight : ""
          }
        }, t.colGroupNode, mo("tbody", null, t.cells.map(function (i, f) {
          return mo(sl, {
            ref: e.rowRefs.createRef(f),
            key: i.length ? i[0].date.toISOString() : f,
            showDayNumbers: a > 1,
            showWeekNumbers: t.showWeekNumbers,
            todayRange: h,
            dateProfile: n,
            cells: i,
            renderIntro: t.renderRowIntro,
            businessHourSegs: s[f],
            eventSelection: t.eventSelection,
            bgEventSegs: l[f].filter(ul),
            fgEventSegs: u[f],
            dateSelectionSegs: c[f],
            eventDrag: d[f],
            eventResize: p[f],
            dayMaxEvents: o,
            dayMaxEventRows: r,
            clientWidth: t.clientWidth,
            clientHeight: t.clientHeight,
            forPrint: t.forPrint
          });
        }))));
      }));
    }, t.prototype.prepareHits = function () {
      ;
      this.rowPositions = new co(this.rootEl, this.rowRefs.collect().map(function (e) {
        return e.getCellEls()[0];
      }), !1, !0), this.colPositions = new co(this.rootEl, this.rowRefs.currentMap[0].getCellEls(), !0, !1);
    }, t.prototype.queryHit = function (e, t) {
      var n = this.colPositions,
          o = this.rowPositions,
          i = n.leftToIndex(e),
          a = o.topToIndex(t);

      if (null != a && null != i) {
        var s = this.props.cells[a][i];
        return {
          dateProfile: this.props.dateProfile,
          dateSpan: _r2({
            range: this.getCellRange(a, i),
            allDay: !0
          }, s.extraDateSpan),
          dayEl: this.getCellEl(a, i),
          rect: {
            left: n.lefts[i],
            right: n.rights[i],
            top: o.tops[a],
            bottom: o.bottoms[a]
          },
          layer: 0
        };
      }

      return null;
    }, t.prototype.getCellEl = function (e, t) {
      return this.rowRefs.currentMap[e].getCellEls()[t];
    }, t.prototype.getCellRange = function (e, t) {
      var n = this.props.cells[e][t].date;
      return {
        start: n,
        end: Ke(n, 1)
      };
    }, t;
  }(No);

  function ul(e) {
    return e.eventRange.def.allDay;
  }

  var cl = function (e) {
    function t() {
      var t = null !== e && e.apply(this, arguments) || this;
      return t.forceDayIfListItem = !0, t;
    }

    return n(t, e), t.prototype.sliceRange = function (e, t) {
      return t.sliceRange(e);
    }, t;
  }(Sa),
      dl = function (e) {
    function t() {
      var t = null !== e && e.apply(this, arguments) || this;
      return t.slicer = new cl(), t.tableRef = Eo(), t;
    }

    return n(t, e), t.prototype.render = function () {
      var e = this.props,
          t = this.context;
      return mo(ll, _r2({
        ref: this.tableRef
      }, this.slicer.sliceProps(e, e.dateProfile, e.nextDayThreshold, t, e.dayTableModel), {
        dateProfile: e.dateProfile,
        cells: e.dayTableModel.cells,
        colGroupNode: e.colGroupNode,
        tableMinWidth: e.tableMinWidth,
        renderRowIntro: e.renderRowIntro,
        dayMaxEvents: e.dayMaxEvents,
        dayMaxEventRows: e.dayMaxEventRows,
        showWeekNumbers: e.showWeekNumbers,
        expandRows: e.expandRows,
        headerAlignElRef: e.headerAlignElRef,
        clientWidth: e.clientWidth,
        clientHeight: e.clientHeight,
        forPrint: e.forPrint
      }));
    }, t;
  }(No),
      pl = function (e) {
    function t() {
      var t = null !== e && e.apply(this, arguments) || this;
      return t.buildDayTableModel = Ft(fl), t.headerRef = Eo(), t.tableRef = Eo(), t;
    }

    return n(t, e), t.prototype.render = function () {
      var e = this,
          t = this.context,
          n = t.options,
          r = t.dateProfileGenerator,
          o = this.props,
          i = this.buildDayTableModel(o.dateProfile, r),
          a = n.dayHeaders && mo(ga, {
        ref: this.headerRef,
        dateProfile: o.dateProfile,
        dates: i.headerDates,
        datesRepDistinctDays: 1 === i.rowCnt
      }),
          s = function s(t) {
        return mo(dl, {
          ref: e.tableRef,
          dateProfile: o.dateProfile,
          dayTableModel: i,
          businessHours: o.businessHours,
          dateSelection: o.dateSelection,
          eventStore: o.eventStore,
          eventUiBases: o.eventUiBases,
          eventSelection: o.eventSelection,
          eventDrag: o.eventDrag,
          eventResize: o.eventResize,
          nextDayThreshold: n.nextDayThreshold,
          colGroupNode: t.tableColGroupNode,
          tableMinWidth: t.tableMinWidth,
          dayMaxEvents: n.dayMaxEvents,
          dayMaxEventRows: n.dayMaxEventRows,
          showWeekNumbers: n.weekNumbers,
          expandRows: !o.isHeightAuto,
          headerAlignElRef: e.headerElRef,
          clientWidth: t.clientWidth,
          clientHeight: t.clientHeight,
          forPrint: o.forPrint
        });
      };

      return n.dayMinWidth ? this.renderHScrollLayout(a, s, i.colCnt, n.dayMinWidth) : this.renderSimpleLayout(a, s);
    }, t;
  }(Bs);

  function fl(e, t) {
    var n = new ya(e.renderRange, t);
    return new Ea(n, /year|month|week/.test(e.currentRangeUnit));
  }

  var hl = Ho({
    initialView: "dayGridMonth",
    views: {
      dayGrid: {
        component: pl,
        dateProfileGeneratorClass: function (e) {
          function t() {
            return null !== e && e.apply(this, arguments) || this;
          }

          return n(t, e), t.prototype.buildRenderRange = function (t, n, r) {
            var o,
                i = this.props.dateEnv,
                a = e.prototype.buildRenderRange.call(this, t, n, r),
                s = a.start,
                l = a.end;
            (/^(year|month)$/.test(n) && (s = i.startOfWeek(s), (o = i.startOfWeek(l)).valueOf() !== l.valueOf() && (l = Xe(o, 1))), this.props.monthMode && this.props.fixedWeekCount) && (l = Xe(l, 6 - Math.ceil(Je(s, l))));
            return {
              start: s,
              end: l
            };
          }, t;
        }($o)
      },
      dayGridDay: {
        type: "dayGrid",
        duration: {
          days: 1
        }
      },
      dayGridWeek: {
        type: "dayGrid",
        duration: {
          weeks: 1
        }
      },
      dayGridMonth: {
        type: "dayGrid",
        duration: {
          months: 1
        },
        monthMode: !0,
        fixedWeekCount: !0
      }
    }
  }),
      vl = function (e) {
    function t() {
      return null !== e && e.apply(this, arguments) || this;
    }

    return n(t, e), t.prototype.getKeyInfo = function () {
      return {
        allDay: {},
        timed: {}
      };
    }, t.prototype.getKeysForDateSpan = function (e) {
      return e.allDay ? ["allDay"] : ["timed"];
    }, t.prototype.getKeysForEventDef = function (e) {
      return e.allDay ? Gn(e) ? ["timed", "allDay"] : ["allDay"] : ["timed"];
    }, t;
  }(Zr),
      gl = nn({
    hour: "numeric",
    minute: "2-digit",
    omitZeroMinute: !0,
    meridiem: "short"
  });

  function ml(e) {
    var t = ["fc-timegrid-slot", "fc-timegrid-slot-label", e.isLabeled ? "fc-scrollgrid-shrink" : "fc-timegrid-slot-minor"];
    return mo(_o.Consumer, null, function (n) {
      if (!e.isLabeled) return mo("td", {
        className: t.join(" "),
        "data-time": e.isoTimeStr
      });
      var r = n.dateEnv,
          o = n.options,
          i = n.viewApi,
          a = null == o.slotLabelFormat ? gl : Array.isArray(o.slotLabelFormat) ? nn(o.slotLabelFormat[0]) : nn(o.slotLabelFormat),
          s = {
        level: 0,
        time: e.time,
        date: r.toDate(e.date),
        view: i,
        text: r.format(e.date, a)
      };
      return mo(Lo, {
        hookProps: s,
        classNames: o.slotLabelClassNames,
        content: o.slotLabelContent,
        defaultContent: yl,
        didMount: o.slotLabelDidMount,
        willUnmount: o.slotLabelWillUnmount
      }, function (n, r, o, i) {
        return mo("td", {
          ref: n,
          className: t.concat(r).join(" "),
          "data-time": e.isoTimeStr
        }, mo("div", {
          className: "fc-timegrid-slot-label-frame fc-scrollgrid-shrink-frame"
        }, mo("div", {
          className: "fc-timegrid-slot-label-cushion fc-scrollgrid-shrink-cushion",
          ref: o
        }, i)));
      });
    });
  }

  function yl(e) {
    return e.text;
  }

  var El = function (e) {
    function t() {
      return null !== e && e.apply(this, arguments) || this;
    }

    return n(t, e), t.prototype.render = function () {
      return this.props.slatMetas.map(function (e) {
        return mo("tr", {
          key: e.key
        }, mo(ml, _r2({}, e)));
      });
    }, t;
  }(xo),
      Sl = nn({
    week: "short"
  }),
      Dl = function (e) {
    function t() {
      var t = null !== e && e.apply(this, arguments) || this;
      return t.allDaySplitter = new vl(), t.headerElRef = Eo(), t.rootElRef = Eo(), t.scrollerElRef = Eo(), t.state = {
        slatCoords: null
      }, t.handleScrollTopRequest = function (e) {
        var n = t.scrollerElRef.current;
        n && (n.scrollTop = e);
      }, t.renderHeadAxis = function (e, n) {
        void 0 === n && (n = "");
        var o = t.context.options,
            i = t.props.dateProfile.renderRange,
            a = Qe(i.start, i.end),
            s = o.navLinks && 1 === a ? {
          "data-navlink": Jr(i.start, "week"),
          tabIndex: 0
        } : {};
        return o.weekNumbers && "day" === e ? mo(os, {
          date: i.start,
          defaultFormat: Sl
        }, function (e, t, o, i) {
          return mo("th", {
            ref: e,
            className: ["fc-timegrid-axis", "fc-scrollgrid-shrink"].concat(t).join(" ")
          }, mo("div", {
            className: "fc-timegrid-axis-frame fc-scrollgrid-shrink-frame fc-timegrid-axis-frame-liquid",
            style: {
              height: n
            }
          }, mo("a", _r2({
            ref: o,
            className: "fc-timegrid-axis-cushion fc-scrollgrid-shrink-cushion fc-scrollgrid-sync-inner"
          }, s), i)));
        }) : mo("th", {
          className: "fc-timegrid-axis"
        }, mo("div", {
          className: "fc-timegrid-axis-frame",
          style: {
            height: n
          }
        }));
      }, t.renderTableRowAxis = function (e) {
        var n = t.context,
            r = n.options,
            o = n.viewApi,
            i = {
          text: r.allDayText,
          view: o
        };
        return mo(Lo, {
          hookProps: i,
          classNames: r.allDayClassNames,
          content: r.allDayContent,
          defaultContent: bl,
          didMount: r.allDayDidMount,
          willUnmount: r.allDayWillUnmount
        }, function (t, n, r, o) {
          return mo("td", {
            ref: t,
            className: ["fc-timegrid-axis", "fc-scrollgrid-shrink"].concat(n).join(" ")
          }, mo("div", {
            className: "fc-timegrid-axis-frame fc-scrollgrid-shrink-frame" + (null == e ? " fc-timegrid-axis-frame-liquid" : ""),
            style: {
              height: e
            }
          }, mo("span", {
            className: "fc-timegrid-axis-cushion fc-scrollgrid-shrink-cushion fc-scrollgrid-sync-inner",
            ref: r
          }, o)));
        });
      }, t.handleSlatCoords = function (e) {
        t.setState({
          slatCoords: e
        });
      }, t;
    }

    return n(t, e), t.prototype.renderSimpleLayout = function (e, t, n) {
      var r = this.context,
          o = this.props,
          i = [],
          a = ja(r.options);
      return e && i.push({
        type: "header",
        key: "header",
        isSticky: a,
        chunk: {
          elRef: this.headerElRef,
          tableClassName: "fc-col-header",
          rowContent: e
        }
      }), t && (i.push({
        type: "body",
        key: "all-day",
        chunk: {
          content: t
        }
      }), i.push({
        type: "body",
        key: "all-day-divider",
        outerContent: mo("tr", {
          className: "fc-scrollgrid-section"
        }, mo("td", {
          className: "fc-timegrid-divider " + r.theme.getClass("tableCellShaded")
        }))
      })), i.push({
        type: "body",
        key: "body",
        liquid: !0,
        expandRows: Boolean(r.options.expandRows),
        chunk: {
          scrollerElRef: this.scrollerElRef,
          content: n
        }
      }), mo(qo, {
        viewSpec: r.viewSpec,
        elRef: this.rootElRef
      }, function (e, t) {
        return mo("div", {
          className: ["fc-timegrid"].concat(t).join(" "),
          ref: e
        }, mo(qa, {
          liquid: !o.isHeightAuto && !o.forPrint,
          collapsibleWidth: o.forPrint,
          cols: [{
            width: "shrink"
          }],
          sections: i
        }));
      });
    }, t.prototype.renderHScrollLayout = function (e, t, n, r, o, i, a) {
      var s = this,
          l = this.context.pluginHooks.scrollGridImpl;
      if (!l) throw new Error("No ScrollGrid implementation");
      var u = this.context,
          c = this.props,
          d = !c.forPrint && ja(u.options),
          p = !c.forPrint && Ga(u.options),
          f = [];
      e && f.push({
        type: "header",
        key: "header",
        isSticky: d,
        syncRowHeights: !0,
        chunks: [{
          key: "axis",
          rowContent: function rowContent(e) {
            return mo("tr", null, s.renderHeadAxis("day", e.rowSyncHeights[0]));
          }
        }, {
          key: "cols",
          elRef: this.headerElRef,
          tableClassName: "fc-col-header",
          rowContent: e
        }]
      }), t && (f.push({
        type: "body",
        key: "all-day",
        syncRowHeights: !0,
        chunks: [{
          key: "axis",
          rowContent: function rowContent(e) {
            return mo("tr", null, s.renderTableRowAxis(e.rowSyncHeights[0]));
          }
        }, {
          key: "cols",
          content: t
        }]
      }), f.push({
        key: "all-day-divider",
        type: "body",
        outerContent: mo("tr", {
          className: "fc-scrollgrid-section"
        }, mo("td", {
          colSpan: 2,
          className: "fc-timegrid-divider " + u.theme.getClass("tableCellShaded")
        }))
      }));
      var h = u.options.nowIndicator;
      return f.push({
        type: "body",
        key: "body",
        liquid: !0,
        expandRows: Boolean(u.options.expandRows),
        chunks: [{
          key: "axis",
          content: function content(e) {
            return mo("div", {
              className: "fc-timegrid-axis-chunk"
            }, mo("table", {
              style: {
                height: e.expandRows ? e.clientHeight : ""
              }
            }, e.tableColGroupNode, mo("tbody", null, mo(El, {
              slatMetas: i
            }))), mo("div", {
              className: "fc-timegrid-now-indicator-container"
            }, mo(ha, {
              unit: h ? "minute" : "day"
            }, function (e) {
              var t = h && a && a.safeComputeTop(e);
              return "number" == typeof t ? mo(Ka, {
                isAxis: !0,
                date: e
              }, function (e, n, r, o) {
                return mo("div", {
                  ref: e,
                  className: ["fc-timegrid-now-indicator-arrow"].concat(n).join(" "),
                  style: {
                    top: t
                  }
                }, o);
              }) : null;
            })));
          }
        }, {
          key: "cols",
          scrollerElRef: this.scrollerElRef,
          content: n
        }]
      }), p && f.push({
        key: "footer",
        type: "footer",
        isSticky: !0,
        chunks: [{
          key: "axis",
          content: Ba
        }, {
          key: "cols",
          content: Ba
        }]
      }), mo(qo, {
        viewSpec: u.viewSpec,
        elRef: this.rootElRef
      }, function (e, t) {
        return mo("div", {
          className: ["fc-timegrid"].concat(t).join(" "),
          ref: e
        }, mo(l, {
          liquid: !c.isHeightAuto && !c.forPrint,
          collapsibleWidth: !1,
          colGroups: [{
            width: "shrink",
            cols: [{
              width: "shrink"
            }]
          }, {
            cols: [{
              span: r,
              minWidth: o
            }]
          }],
          sections: f
        }));
      });
    }, t.prototype.getAllDayMaxEventProps = function () {
      var e = this.context.options,
          t = e.dayMaxEvents,
          n = e.dayMaxEventRows;
      return !0 !== t && !0 !== n || (t = void 0, n = 5), {
        dayMaxEvents: t,
        dayMaxEventRows: n
      };
    }, t;
  }(No);

  function bl(e) {
    return e.text;
  }

  var Cl = function () {
    function e(e, t, n) {
      ;
      this.positions = e, this.dateProfile = t, this.slotDuration = n;
    }

    return e.prototype.safeComputeTop = function (e) {
      var t = this.dateProfile;

      if (Bn(t.currentRange, e)) {
        var n = rt(e),
            r = e.valueOf() - n.valueOf();
        if (r >= Nt(t.slotMinTime) && r < Nt(t.slotMaxTime)) return this.computeTimeTop(kt(r));
      }

      return null;
    }, e.prototype.computeDateTop = function (e, t) {
      return t || (t = rt(e)), this.computeTimeTop(kt(e.valueOf() - t.valueOf()));
    }, e.prototype.computeTimeTop = function (e) {
      var t,
          n,
          r = this.positions,
          o = this.dateProfile,
          i = r.els.length,
          a = (e.milliseconds - Nt(o.slotMinTime)) / Nt(this.slotDuration);
      return a = Math.max(0, a), a = Math.min(i, a), t = Math.floor(a), n = a - (t = Math.min(t, i - 1)), r.tops[t] + r.getHeight(t) * n;
    }, e;
  }(),
      wl = function (e) {
    function t() {
      return null !== e && e.apply(this, arguments) || this;
    }

    return n(t, e), t.prototype.render = function () {
      var e = this.props,
          t = this.context,
          n = t.options,
          o = e.slatElRefs;
      return mo("tbody", null, e.slatMetas.map(function (i, a) {
        var s = {
          time: i.time,
          date: t.dateEnv.toDate(i.date),
          view: t.viewApi
        },
            l = ["fc-timegrid-slot", "fc-timegrid-slot-lane", i.isLabeled ? "" : "fc-timegrid-slot-minor"];
        return mo("tr", {
          key: i.key,
          ref: o.createRef(i.key)
        }, e.axis && mo(ml, _r2({}, i)), mo(Lo, {
          hookProps: s,
          classNames: n.slotLaneClassNames,
          content: n.slotLaneContent,
          didMount: n.slotLaneDidMount,
          willUnmount: n.slotLaneWillUnmount
        }, function (e, t, n, r) {
          return mo("td", {
            ref: e,
            className: l.concat(t).join(" "),
            "data-time": i.isoTimeStr
          }, r);
        }));
      }));
    }, t;
  }(xo),
      Rl = function (e) {
    function t() {
      var t = null !== e && e.apply(this, arguments) || this;
      return t.rootElRef = Eo(), t.slatElRefs = new Ia(), t;
    }

    return n(t, e), t.prototype.render = function () {
      var e = this.props,
          t = this.context;
      return mo("div", {
        className: "fc-timegrid-slots",
        ref: this.rootElRef
      }, mo("table", {
        className: t.theme.getClass("table"),
        style: {
          minWidth: e.tableMinWidth,
          width: e.clientWidth,
          height: e.minHeight
        }
      }, e.tableColGroupNode, mo(wl, {
        slatElRefs: this.slatElRefs,
        axis: e.axis,
        slatMetas: e.slatMetas
      })));
    }, t.prototype.componentDidMount = function () {
      this.updateSizing();
    }, t.prototype.componentDidUpdate = function () {
      this.updateSizing();
    }, t.prototype.componentWillUnmount = function () {
      this.props.onCoords && this.props.onCoords(null);
    }, t.prototype.updateSizing = function () {
      var e,
          t = this.context,
          n = this.props;
      n.onCoords && null !== n.clientWidth && this.rootElRef.current.offsetHeight && n.onCoords(new Cl(new co(this.rootElRef.current, (e = this.slatElRefs.currentMap, n.slatMetas.map(function (t) {
        return e[t.key];
      })), !1, !0), this.props.dateProfile, t.options.slotDuration));
    }, t;
  }(xo);

  function _l(e, t) {
    var n,
        r = [];

    for (n = 0; n < t; n += 1) {
      r.push([]);
    }

    if (e) for (n = 0; n < e.length; n += 1) {
      r[e[n].col].push(e[n]);
    }
    return r;
  }

  function Tl(e, t) {
    var n = [];

    if (e) {
      for (a = 0; a < t; a += 1) {
        n[a] = {
          affectedInstances: e.affectedInstances,
          isEvent: e.isEvent,
          segs: []
        };
      }

      for (var r = 0, o = e.segs; r < o.length; r++) {
        var i = o[r];
        n[i.col].segs.push(i);
      }
    } else for (var a = 0; a < t; a += 1) {
      n[a] = null;
    }

    return n;
  }

  var kl = function (e) {
    function t() {
      var t = null !== e && e.apply(this, arguments) || this;
      return t.rootElRef = Eo(), t;
    }

    return n(t, e), t.prototype.render = function () {
      var e = this,
          t = this.props;
      return mo(ls, {
        allDayDate: null,
        moreCnt: t.hiddenSegs.length,
        allSegs: t.hiddenSegs,
        hiddenSegs: t.hiddenSegs,
        alignmentElRef: this.rootElRef,
        defaultContent: xl,
        extraDateSpan: t.extraDateSpan,
        dateProfile: t.dateProfile,
        todayRange: t.todayRange,
        popoverContent: function popoverContent() {
          return Vl(t.hiddenSegs, t);
        }
      }, function (n, r, o, i, a) {
        return mo("a", {
          ref: function ref(t) {
            Io(n, t), Io(e.rootElRef, t);
          },
          className: ["fc-timegrid-more-link"].concat(r).join(" "),
          style: {
            top: t.top,
            bottom: t.bottom
          },
          onClick: a
        }, mo("div", {
          ref: o,
          className: "fc-timegrid-more-link-inner fc-sticky"
        }, i));
      });
    }, t;
  }(xo);

  function xl(e) {
    return e.shortText;
  }

  function Ml(e, t, n) {
    var o = new Li();
    null != t && (o.strictOrder = t), null != n && (o.maxStackCnt = n);

    var i,
        a,
        s,
        l = Fi(o.addSegs(e)),
        u = function (e) {
      var t = e.entriesByLevel,
          n = Hl(function (e, t) {
        return e + ":" + t;
      }, function (o, i) {
        var a = Pl(function (e, t, n) {
          for (var r = e.levelCoords, o = e.entriesByLevel, i = o[t][n], a = r[t] + i.thickness, s = r.length, l = t; l < s && r[l] < a; l += 1) {
            ;
          }

          for (; l < s; l += 1) {
            for (var u = o[l], c = void 0, d = Gi(u, i.span.start, Wi), p = d[0] + d[1], f = p; (c = u[f]) && c.span.start < i.span.end;) {
              f += 1;
            }

            if (p < f) return {
              level: l,
              lateralStart: p,
              lateralEnd: f
            };
          }

          return null;
        }(e, o, i), n),
            s = t[o][i];
        return [_r2(_r2({}, s), {
          nextLevelNodes: a[0]
        }), s.thickness + a[1]];
      });
      return Pl(t.length ? {
        level: 0,
        lateralStart: 0,
        lateralEnd: t[0].length
      } : null, n)[0];
    }(o);

    return i = u, a = 1, s = Hl(function (e, t, n) {
      return Vi(e);
    }, function (e, t, n) {
      var o,
          i = e.nextLevelNodes,
          l = e.thickness,
          u = l + n,
          c = l / u,
          d = [];
      if (i.length) for (var p = 0, f = i; p < f.length; p++) {
        var h = f[p];
        if (void 0 === o) o = (v = s(h, t, u))[0], d.push(v[1]);else {
          var v = s(h, o, 0);
          d.push(v[1]);
        }
      } else o = a;
      var g = (o - t) * c;
      return [o - g, _r2(_r2({}, e), {
        thickness: g,
        nextLevelNodes: d
      })];
    }), {
      segRects: function (e) {
        var t = [],
            n = Hl(function (e, t, n) {
          return Vi(e);
        }, function (e, n, i) {
          var a = _r2(_r2({}, e), {
            levelCoord: n,
            stackDepth: i,
            stackForward: 0
          });

          return t.push(a), a.stackForward = o(e.nextLevelNodes, n + e.thickness, i + 1) + 1;
        });

        function o(e, t, r) {
          for (var o = 0, i = 0, a = e; i < a.length; i++) {
            var s = a[i];
            o = Math.max(n(s, t, r), o);
          }

          return o;
        }

        return o(e, 0, 0), t;
      }(u = i.map(function (e) {
        return s(e, 0, 0)[1];
      })),
      hiddenGroups: l
    };
  }

  function Pl(e, t) {
    if (!e) return [[], 0];

    for (var n = e.level, r = e.lateralStart, o = e.lateralEnd, i = r, a = []; i < o;) {
      a.push(t(n, i)), i += 1;
    }

    return a.sort(Il), [a.map(Nl), a[0][1]];
  }

  function Il(e, t) {
    return t[1] - e[1];
  }

  function Nl(e) {
    return e[0];
  }

  function Hl(e, t) {
    var n = {};
    return function () {
      for (var r = [], o = 0; o < arguments.length; o++) {
        r[o] = arguments[o];
      }

      var i = e.apply(void 0, r);
      return i in n ? n[i] : n[i] = t.apply(void 0, r);
    };
  }

  function Ol(e, t, n, r) {
    void 0 === n && (n = null), void 0 === r && (r = 0);
    var o = [];
    if (n) for (var i = 0; i < e.length; i += 1) {
      var a = e[i],
          s = n.computeDateTop(a.start, t),
          l = Math.max(s + (r || 0), n.computeDateTop(a.end, t));
      o.push({
        start: Math.round(s),
        end: Math.round(l)
      });
    }
    return o;
  }

  var Al = nn({
    hour: "numeric",
    minute: "2-digit",
    meridiem: !1
  }),
      Ul = function (e) {
    function t() {
      return null !== e && e.apply(this, arguments) || this;
    }

    return n(t, e), t.prototype.render = function () {
      var e = ["fc-timegrid-event", "fc-v-event"];
      return this.props.isShort && e.push("fc-timegrid-event-short"), mo(Za, _r2({}, this.props, {
        defaultTimeFormat: Al,
        extraClassNames: e
      }));
    }, t;
  }(xo),
      Ll = function (e) {
    function t() {
      return null !== e && e.apply(this, arguments) || this;
    }

    return n(t, e), t.prototype.render = function () {
      var e = this.props;
      return mo(Ja, {
        date: e.date,
        dateProfile: e.dateProfile,
        todayRange: e.todayRange,
        extraHookProps: e.extraHookProps
      }, function (e, t) {
        return t && mo("div", {
          className: "fc-timegrid-col-misc",
          ref: e
        }, t);
      });
    }, t;
  }(xo),
      Wl = function (e) {
    function t() {
      var t = null !== e && e.apply(this, arguments) || this;
      return t.sortEventSegs = Ft(Kn), t;
    }

    return n(t, e), t.prototype.render = function () {
      var e = this,
          t = this.props,
          n = this.context,
          o = n.options.selectMirror,
          i = t.eventDrag && t.eventDrag.segs || t.eventResize && t.eventResize.segs || o && t.dateSelectionSegs || [],
          a = t.eventDrag && t.eventDrag.affectedInstances || t.eventResize && t.eventResize.affectedInstances || {},
          s = this.sortEventSegs(t.fgEventSegs, n.options.eventOrder);
      return mo(es, {
        elRef: t.elRef,
        date: t.date,
        dateProfile: t.dateProfile,
        todayRange: t.todayRange,
        extraHookProps: t.extraHookProps
      }, function (n, l, u) {
        return mo("td", _r2({
          ref: n,
          className: ["fc-timegrid-col"].concat(l, t.extraClassNames || []).join(" ")
        }, u, t.extraDataAttrs), mo("div", {
          className: "fc-timegrid-col-frame"
        }, mo("div", {
          className: "fc-timegrid-col-bg"
        }, e.renderFillSegs(t.businessHourSegs, "non-business"), e.renderFillSegs(t.bgEventSegs, "bg-event"), e.renderFillSegs(t.dateSelectionSegs, "highlight")), mo("div", {
          className: "fc-timegrid-col-events"
        }, e.renderFgSegs(s, a, !1, !1, !1)), mo("div", {
          className: "fc-timegrid-col-events"
        }, e.renderFgSegs(i, {}, Boolean(t.eventDrag), Boolean(t.eventResize), Boolean(o))), mo("div", {
          className: "fc-timegrid-now-indicator-container"
        }, e.renderNowIndicator(t.nowIndicatorSegs)), mo(Ll, {
          date: t.date,
          dateProfile: t.dateProfile,
          todayRange: t.todayRange,
          extraHookProps: t.extraHookProps
        })));
      });
    }, t.prototype.renderFgSegs = function (e, t, n, r, o) {
      var i = this.props;
      return i.forPrint ? Vl(e, i) : this.renderPositionedFgSegs(e, t, n, r, o);
    }, t.prototype.renderPositionedFgSegs = function (e, t, n, o, i) {
      var a = this,
          s = this.context.options,
          l = s.eventMaxStack,
          u = s.eventShortHeight,
          c = s.eventOrderStrict,
          d = s.eventMinHeight,
          p = this.props,
          f = p.date,
          h = p.slatCoords,
          v = p.eventSelection,
          g = p.todayRange,
          m = p.nowDate,
          y = n || o || i,
          E = function (e, t, n, r) {
        for (var o = [], i = [], a = 0; a < e.length; a += 1) {
          var s = t[a];
          s ? o.push({
            index: a,
            thickness: 1,
            span: s
          }) : i.push(e[a]);
        }

        for (var l = Ml(o, n, r), u = l.segRects, c = l.hiddenGroups, d = [], p = 0, f = u; p < f.length; p++) {
          var h = f[p];
          d.push({
            seg: e[h.index],
            rect: h
          });
        }

        for (var v = 0, g = i; v < g.length; v++) {
          var m = g[v];
          d.push({
            seg: m,
            rect: null
          });
        }

        return {
          segPlacements: d,
          hiddenGroups: c
        };
      }(e, Ol(e, f, h, d), c, l),
          S = E.segPlacements,
          D = E.hiddenGroups;

      return mo(So, null, this.renderHiddenGroups(D, e), S.map(function (e) {
        var s = e.seg,
            l = e.rect,
            c = s.eventRange.instance.instanceId,
            d = y || Boolean(!t[c] && l),
            p = Fl(l && l.span),
            f = !y && l ? a.computeSegHStyle(l) : {
          left: 0,
          right: 0
        },
            h = Boolean(l) && l.stackForward > 0,
            E = Boolean(l) && l.span.end - l.span.start < u;
        return mo("div", {
          className: "fc-timegrid-event-harness" + (h ? " fc-timegrid-event-harness-inset" : ""),
          key: c,
          style: _r2(_r2({
            visibility: d ? "" : "hidden"
          }, p), f)
        }, mo(Ul, _r2({
          seg: s,
          isDragging: n,
          isResizing: o,
          isDateSelecting: i,
          isSelected: c === v,
          isShort: E
        }, nr(s, g, m))));
      }));
    }, t.prototype.renderHiddenGroups = function (e, t) {
      var n = this.props,
          r = n.extraDateSpan,
          o = n.dateProfile,
          i = n.todayRange,
          a = n.nowDate,
          s = n.eventSelection,
          l = n.eventDrag,
          u = n.eventResize;
      return mo(So, null, e.map(function (e) {
        var n,
            c,
            d = Fl(e.span),
            p = (n = e.entries, c = t, n.map(function (e) {
          return c[e.index];
        }));
        return mo(kl, {
          key: At(ds(p)),
          hiddenSegs: p,
          top: d.top,
          bottom: d.bottom,
          extraDateSpan: r,
          dateProfile: o,
          todayRange: i,
          nowDate: a,
          eventSelection: s,
          eventDrag: l,
          eventResize: u
        });
      }));
    }, t.prototype.renderFillSegs = function (e, t) {
      var n = this.props,
          o = this.context,
          i = Ol(e, n.date, n.slatCoords, o.options.eventMinHeight).map(function (o, i) {
        var a = e[i];
        return mo("div", {
          key: or(a.eventRange),
          className: "fc-timegrid-bg-harness",
          style: Fl(o)
        }, "bg-event" === t ? mo(ns, _r2({
          seg: a
        }, nr(a, n.todayRange, n.nowDate))) : ts(t));
      });
      return mo(So, null, i);
    }, t.prototype.renderNowIndicator = function (e) {
      var t = this.props,
          n = t.slatCoords,
          r = t.date;
      return n ? e.map(function (e, t) {
        return mo(Ka, {
          isAxis: !1,
          date: r,
          key: t
        }, function (t, o, i, a) {
          return mo("div", {
            ref: t,
            className: ["fc-timegrid-now-indicator-line"].concat(o).join(" "),
            style: {
              top: n.computeDateTop(e.start, r)
            }
          }, a);
        });
      }) : null;
    }, t.prototype.computeSegHStyle = function (e) {
      var t,
          n,
          r = this.context,
          o = r.isRtl,
          i = r.options.slotEventOverlap,
          a = e.levelCoord,
          s = e.levelCoord + e.thickness;
      i && (s = Math.min(1, a + 2 * (s - a))), o ? (t = 1 - s, n = a) : (t = a, n = 1 - s);
      var l = {
        zIndex: e.stackDepth + 1,
        left: 100 * t + "%",
        right: 100 * n + "%"
      };
      return i && !e.stackForward && (l[o ? "marginLeft" : "marginRight"] = 20), l;
    }, t;
  }(xo);

  function Vl(e, t) {
    var n = t.todayRange,
        o = t.nowDate,
        i = t.eventSelection,
        a = t.eventDrag,
        s = t.eventResize,
        l = (a ? a.affectedInstances : null) || (s ? s.affectedInstances : null) || {};
    return mo(So, null, e.map(function (e) {
      var t = e.eventRange.instance.instanceId;
      return mo("div", {
        key: t,
        style: {
          visibility: l[t] ? "hidden" : ""
        }
      }, mo(Ul, _r2({
        seg: e,
        isDragging: !1,
        isResizing: !1,
        isDateSelecting: !1,
        isSelected: t === i,
        isShort: !1
      }, nr(e, n, o))));
    }));
  }

  function Fl(e) {
    return e ? {
      top: e.start,
      bottom: -e.end
    } : {
      top: "",
      bottom: ""
    };
  }

  var zl = function (e) {
    function t() {
      var t = null !== e && e.apply(this, arguments) || this;
      return t.splitFgEventSegs = Ft(_l), t.splitBgEventSegs = Ft(_l), t.splitBusinessHourSegs = Ft(_l), t.splitNowIndicatorSegs = Ft(_l), t.splitDateSelectionSegs = Ft(_l), t.splitEventDrag = Ft(Tl), t.splitEventResize = Ft(Tl), t.rootElRef = Eo(), t.cellElRefs = new Ia(), t;
    }

    return n(t, e), t.prototype.render = function () {
      var e = this,
          t = this.props,
          n = this.context.options.nowIndicator && t.slatCoords && t.slatCoords.safeComputeTop(t.nowDate),
          r = t.cells.length,
          o = this.splitFgEventSegs(t.fgEventSegs, r),
          i = this.splitBgEventSegs(t.bgEventSegs, r),
          a = this.splitBusinessHourSegs(t.businessHourSegs, r),
          s = this.splitNowIndicatorSegs(t.nowIndicatorSegs, r),
          l = this.splitDateSelectionSegs(t.dateSelectionSegs, r),
          u = this.splitEventDrag(t.eventDrag, r),
          c = this.splitEventResize(t.eventResize, r);
      return mo("div", {
        className: "fc-timegrid-cols",
        ref: this.rootElRef
      }, mo("table", {
        style: {
          minWidth: t.tableMinWidth,
          width: t.clientWidth
        }
      }, t.tableColGroupNode, mo("tbody", null, mo("tr", null, t.axis && mo("td", {
        className: "fc-timegrid-col fc-timegrid-axis"
      }, mo("div", {
        className: "fc-timegrid-col-frame"
      }, mo("div", {
        className: "fc-timegrid-now-indicator-container"
      }, "number" == typeof n && mo(Ka, {
        isAxis: !0,
        date: t.nowDate
      }, function (e, t, r, o) {
        return mo("div", {
          ref: e,
          className: ["fc-timegrid-now-indicator-arrow"].concat(t).join(" "),
          style: {
            top: n
          }
        }, o);
      })))), t.cells.map(function (n, r) {
        return mo(Wl, {
          key: n.key,
          elRef: e.cellElRefs.createRef(n.key),
          dateProfile: t.dateProfile,
          date: n.date,
          nowDate: t.nowDate,
          todayRange: t.todayRange,
          extraHookProps: n.extraHookProps,
          extraDataAttrs: n.extraDataAttrs,
          extraClassNames: n.extraClassNames,
          extraDateSpan: n.extraDateSpan,
          fgEventSegs: o[r],
          bgEventSegs: i[r],
          businessHourSegs: a[r],
          nowIndicatorSegs: s[r],
          dateSelectionSegs: l[r],
          eventDrag: u[r],
          eventResize: c[r],
          slatCoords: t.slatCoords,
          eventSelection: t.eventSelection,
          forPrint: t.forPrint
        });
      })))));
    }, t.prototype.componentDidMount = function () {
      this.updateCoords();
    }, t.prototype.componentDidUpdate = function () {
      this.updateCoords();
    }, t.prototype.updateCoords = function () {
      var e,
          t = this.props;
      t.onColCoords && null !== t.clientWidth && t.onColCoords(new co(this.rootElRef.current, (e = this.cellElRefs.currentMap, t.cells.map(function (t) {
        return e[t.key];
      })), !0, !1));
    }, t;
  }(xo);

  var Bl = function (e) {
    function t() {
      var t = null !== e && e.apply(this, arguments) || this;
      return t.processSlotOptions = Ft(jl), t.state = {
        slatCoords: null
      }, t.handleRootEl = function (e) {
        e ? t.context.registerInteractiveComponent(t, {
          el: e,
          isHitComboAllowed: t.props.isHitComboAllowed
        }) : t.context.unregisterInteractiveComponent(t);
      }, t.handleScrollRequest = function (e) {
        var n = t.props.onScrollTopRequest,
            r = t.state.slatCoords;

        if (n && r) {
          if (e.time) {
            var o = r.computeTimeTop(e.time);
            (o = Math.ceil(o)) && (o += 1), n(o);
          }

          return !0;
        }

        return !1;
      }, t.handleColCoords = function (e) {
        t.colCoords = e;
      }, t.handleSlatCoords = function (e) {
        t.setState({
          slatCoords: e
        }), t.props.onSlatCoords && t.props.onSlatCoords(e);
      }, t;
    }

    return n(t, e), t.prototype.render = function () {
      var e = this.props,
          t = this.state;
      return mo("div", {
        className: "fc-timegrid-body",
        ref: this.handleRootEl,
        style: {
          width: e.clientWidth,
          minWidth: e.tableMinWidth
        }
      }, mo(Rl, {
        axis: e.axis,
        dateProfile: e.dateProfile,
        slatMetas: e.slatMetas,
        clientWidth: e.clientWidth,
        minHeight: e.expandRows ? e.clientHeight : "",
        tableMinWidth: e.tableMinWidth,
        tableColGroupNode: e.axis ? e.tableColGroupNode : null,
        onCoords: this.handleSlatCoords
      }), mo(zl, {
        cells: e.cells,
        axis: e.axis,
        dateProfile: e.dateProfile,
        businessHourSegs: e.businessHourSegs,
        bgEventSegs: e.bgEventSegs,
        fgEventSegs: e.fgEventSegs,
        dateSelectionSegs: e.dateSelectionSegs,
        eventSelection: e.eventSelection,
        eventDrag: e.eventDrag,
        eventResize: e.eventResize,
        todayRange: e.todayRange,
        nowDate: e.nowDate,
        nowIndicatorSegs: e.nowIndicatorSegs,
        clientWidth: e.clientWidth,
        tableMinWidth: e.tableMinWidth,
        tableColGroupNode: e.tableColGroupNode,
        slatCoords: t.slatCoords,
        onColCoords: this.handleColCoords,
        forPrint: e.forPrint
      }));
    }, t.prototype.componentDidMount = function () {
      this.scrollResponder = this.context.createScrollResponder(this.handleScrollRequest);
    }, t.prototype.componentDidUpdate = function (e) {
      this.scrollResponder.update(e.dateProfile !== this.props.dateProfile);
    }, t.prototype.componentWillUnmount = function () {
      this.scrollResponder.detach();
    }, t.prototype.queryHit = function (e, t) {
      var n = this.context,
          o = n.dateEnv,
          i = n.options,
          a = this.colCoords,
          s = this.props.dateProfile,
          l = this.state.slatCoords,
          u = this.processSlotOptions(this.props.slotDuration, i.snapDuration),
          c = u.snapDuration,
          d = u.snapsPerSlot,
          p = a.leftToIndex(e),
          f = l.positions.topToIndex(t);

      if (null != p && null != f) {
        var h = this.props.cells[p],
            v = l.positions.tops[f],
            g = l.positions.getHeight(f),
            m = (t - v) / g,
            y = f * d + Math.floor(m * d),
            E = this.props.cells[p].date,
            S = Mt(s.slotMinTime, Pt(c, y)),
            D = o.add(E, S),
            b = o.add(D, c);
        return {
          dateProfile: s,
          dateSpan: _r2({
            range: {
              start: D,
              end: b
            },
            allDay: !1
          }, h.extraDateSpan),
          dayEl: a.els[p],
          rect: {
            left: a.lefts[p],
            right: a.rights[p],
            top: v,
            bottom: v + g
          },
          layer: 0
        };
      }

      return null;
    }, t;
  }(No);

  function jl(e, t) {
    var n = t || e,
        r = Ht(e, n);
    return null === r && (n = e, r = 1), {
      snapDuration: n,
      snapsPerSlot: r
    };
  }

  var Gl = function (e) {
    function t() {
      return null !== e && e.apply(this, arguments) || this;
    }

    return n(t, e), t.prototype.sliceRange = function (e, t) {
      for (var n = [], r = 0; r < t.length; r += 1) {
        var o = Wn(e, t[r]);
        o && n.push({
          start: o.start,
          end: o.end,
          isStart: o.start.valueOf() === e.start.valueOf(),
          isEnd: o.end.valueOf() === e.end.valueOf(),
          col: r
        });
      }

      return n;
    }, t;
  }(Sa),
      ql = function (e) {
    function t() {
      var t = null !== e && e.apply(this, arguments) || this;
      return t.buildDayRanges = Ft(Yl), t.slicer = new Gl(), t.timeColsRef = Eo(), t;
    }

    return n(t, e), t.prototype.render = function () {
      var e = this,
          t = this.props,
          n = this.context,
          o = t.dateProfile,
          i = t.dayTableModel,
          a = n.options.nowIndicator,
          s = this.buildDayRanges(i, o, n.dateEnv);
      return mo(ha, {
        unit: a ? "minute" : "day"
      }, function (l, u) {
        return mo(Bl, _r2({
          ref: e.timeColsRef
        }, e.slicer.sliceProps(t, o, null, n, s), {
          forPrint: t.forPrint,
          axis: t.axis,
          dateProfile: o,
          slatMetas: t.slatMetas,
          slotDuration: t.slotDuration,
          cells: i.cells[0],
          tableColGroupNode: t.tableColGroupNode,
          tableMinWidth: t.tableMinWidth,
          clientWidth: t.clientWidth,
          clientHeight: t.clientHeight,
          expandRows: t.expandRows,
          nowDate: l,
          nowIndicatorSegs: a && e.slicer.sliceNowDate(l, n, s),
          todayRange: u,
          onScrollTopRequest: t.onScrollTopRequest,
          onSlatCoords: t.onSlatCoords
        }));
      });
    }, t;
  }(No);

  function Yl(e, t, n) {
    for (var r = [], o = 0, i = e.headerDates; o < i.length; o++) {
      var a = i[o];
      r.push({
        start: n.add(a, t.slotMinTime),
        end: n.add(a, t.slotMaxTime)
      });
    }

    return r;
  }

  var Zl = [{
    hours: 1
  }, {
    minutes: 30
  }, {
    minutes: 15
  }, {
    seconds: 30
  }, {
    seconds: 15
  }];

  function Xl(e, t, n, r, o) {
    for (var i = new Date(0), a = e, s = kt(0), l = n || function (e) {
      var t, n, r;

      for (t = Zl.length - 1; t >= 0; t -= 1) {
        if (null !== (r = Ht(n = kt(Zl[t]), e)) && r > 1) return n;
      }

      return e;
    }(r), u = []; Nt(a) < Nt(t);) {
      var c = o.add(i, a),
          d = null !== Ht(s, l);
      u.push({
        date: c,
        time: a,
        key: c.toISOString(),
        isoTimeStr: Lt(c),
        isLabeled: d
      }), a = Mt(a, r), s = Mt(s, r);
    }

    return u;
  }

  var Kl = function (e) {
    function t() {
      var t = null !== e && e.apply(this, arguments) || this;
      return t.buildTimeColsModel = Ft($l), t.buildSlatMetas = Ft(Xl), t;
    }

    return n(t, e), t.prototype.render = function () {
      var e = this,
          t = this.context,
          n = t.options,
          o = t.dateEnv,
          i = t.dateProfileGenerator,
          a = this.props,
          s = a.dateProfile,
          l = this.buildTimeColsModel(s, i),
          u = this.allDaySplitter.splitProps(a),
          c = this.buildSlatMetas(s.slotMinTime, s.slotMaxTime, n.slotLabelInterval, n.slotDuration, o),
          d = n.dayMinWidth,
          p = !d,
          f = d,
          h = n.dayHeaders && mo(ga, {
        dates: l.headerDates,
        dateProfile: s,
        datesRepDistinctDays: !0,
        renderIntro: p ? this.renderHeadAxis : null
      }),
          v = !1 !== n.allDaySlot && function (t) {
        return mo(dl, _r2({}, u.allDay, {
          dateProfile: s,
          dayTableModel: l,
          nextDayThreshold: n.nextDayThreshold,
          tableMinWidth: t.tableMinWidth,
          colGroupNode: t.tableColGroupNode,
          renderRowIntro: p ? e.renderTableRowAxis : null,
          showWeekNumbers: !1,
          expandRows: !1,
          headerAlignElRef: e.headerElRef,
          clientWidth: t.clientWidth,
          clientHeight: t.clientHeight,
          forPrint: a.forPrint
        }, e.getAllDayMaxEventProps()));
      },
          g = function g(t) {
        return mo(ql, _r2({}, u.timed, {
          dayTableModel: l,
          dateProfile: s,
          axis: p,
          slotDuration: n.slotDuration,
          slatMetas: c,
          forPrint: a.forPrint,
          tableColGroupNode: t.tableColGroupNode,
          tableMinWidth: t.tableMinWidth,
          clientWidth: t.clientWidth,
          clientHeight: t.clientHeight,
          onSlatCoords: e.handleSlatCoords,
          expandRows: t.expandRows,
          onScrollTopRequest: e.handleScrollTopRequest
        }));
      };

      return f ? this.renderHScrollLayout(h, v, g, l.colCnt, d, c, this.state.slatCoords) : this.renderSimpleLayout(h, v, g);
    }, t;
  }(Dl);

  function $l(e, t) {
    var n = new ya(e.renderRange, t);
    return new Ea(n, !1);
  }

  var Jl = Ho({
    initialView: "timeGridWeek",
    optionRefiners: {
      allDaySlot: Boolean
    },
    views: {
      timeGrid: {
        component: Kl,
        usesMinMaxTime: !0,
        allDaySlot: !0,
        slotDuration: "00:30:00",
        slotEventOverlap: !0
      },
      timeGridDay: {
        type: "timeGrid",
        duration: {
          days: 1
        }
      },
      timeGridWeek: {
        type: "timeGrid",
        duration: {
          weeks: 1
        }
      }
    }
  }),
      Ql = function (e) {
    function t() {
      return null !== e && e.apply(this, arguments) || this;
    }

    return n(t, e), t.prototype.render = function () {
      var e = this.props,
          t = e.dayDate,
          n = e.todayRange,
          o = this.context,
          i = o.theme,
          a = o.dateEnv,
          s = o.options,
          l = o.viewApi,
          u = Kr(t, n),
          c = s.listDayFormat ? a.format(t, s.listDayFormat) : "",
          d = s.listDaySideFormat ? a.format(t, s.listDaySideFormat) : "",
          p = s.navLinks ? Jr(t) : null,
          f = _r2({
        date: a.toDate(t),
        view: l,
        text: c,
        sideText: d,
        navLinkData: p
      }, u),
          h = ["fc-list-day"].concat($r(u, i));

      return mo(Lo, {
        hookProps: f,
        classNames: s.dayHeaderClassNames,
        content: s.dayHeaderContent,
        defaultContent: eu,
        didMount: s.dayHeaderDidMount,
        willUnmount: s.dayHeaderWillUnmount
      }, function (e, n, r, o) {
        return mo("tr", {
          ref: e,
          className: h.concat(n).join(" "),
          "data-date": Ut(t)
        }, mo("th", {
          colSpan: 3
        }, mo("div", {
          className: "fc-list-day-cushion " + i.getClass("tableCellShaded"),
          ref: r
        }, o)));
      });
    }, t;
  }(xo);

  function eu(e) {
    var t = e.navLinkData ? {
      "data-navlink": e.navLinkData,
      tabIndex: 0
    } : {};
    return mo(So, null, e.text && mo("a", _r2({
      className: "fc-list-day-text"
    }, t), e.text), e.sideText && mo("a", _r2({
      className: "fc-list-day-side-text"
    }, t), e.sideText));
  }

  var tu = nn({
    hour: "numeric",
    minute: "2-digit",
    meridiem: "short"
  }),
      nu = function (e) {
    function t() {
      return null !== e && e.apply(this, arguments) || this;
    }

    return n(t, e), t.prototype.render = function () {
      var e = this.props,
          t = this.context,
          n = e.seg,
          r = t.options.eventTimeFormat || tu;
      return mo(Ya, {
        seg: n,
        timeText: "",
        disableDragging: !0,
        disableResizing: !0,
        defaultContent: ru,
        isPast: e.isPast,
        isFuture: e.isFuture,
        isToday: e.isToday,
        isSelected: e.isSelected,
        isDragging: e.isDragging,
        isResizing: e.isResizing,
        isDateSelecting: e.isDateSelecting
      }, function (e, o, i, a, s) {
        return mo("tr", {
          className: ["fc-list-event", s.event.url ? "fc-event-forced-url" : ""].concat(o).join(" "),
          ref: e
        }, function (e, t, n) {
          var r = n.options;

          if (!1 !== r.displayEventTime) {
            var o = e.eventRange.def,
                i = e.eventRange.instance,
                a = !1,
                s = void 0;

            if (o.allDay ? a = !0 : On(e.eventRange.range) ? e.isStart ? s = tr(e, t, n, null, null, i.range.start, e.end) : e.isEnd ? s = tr(e, t, n, null, null, e.start, i.range.end) : a = !0 : s = tr(e, t, n), a) {
              var l = {
                text: n.options.allDayText,
                view: n.viewApi
              };
              return mo(Lo, {
                hookProps: l,
                classNames: r.allDayClassNames,
                content: r.allDayContent,
                defaultContent: ou,
                didMount: r.allDayDidMount,
                willUnmount: r.allDayWillUnmount
              }, function (e, t, n, r) {
                return mo("td", {
                  className: ["fc-list-event-time"].concat(t).join(" "),
                  ref: e
                }, r);
              });
            }

            return mo("td", {
              className: "fc-list-event-time"
            }, s);
          }

          return null;
        }(n, r, t), mo("td", {
          className: "fc-list-event-graphic"
        }, mo("span", {
          className: "fc-list-event-dot",
          style: {
            borderColor: s.borderColor || s.backgroundColor
          }
        })), mo("td", {
          className: "fc-list-event-title",
          ref: i
        }, a));
      });
    }, t;
  }(xo);

  function ru(e) {
    var t = e.event,
        n = t.url;
    return mo("a", _r2({}, n ? {
      href: n
    } : {}), t.title);
  }

  function ou(e) {
    return e.text;
  }

  var iu = function (e) {
    function t() {
      var t = null !== e && e.apply(this, arguments) || this;
      return t.computeDateVars = Ft(su), t.eventStoreToSegs = Ft(t._eventStoreToSegs), t.setRootEl = function (e) {
        e ? t.context.registerInteractiveComponent(t, {
          el: e
        }) : t.context.unregisterInteractiveComponent(t);
      }, t;
    }

    return n(t, e), t.prototype.render = function () {
      var e = this,
          t = this.props,
          n = this.context,
          r = ["fc-list", n.theme.getClass("table"), !1 !== n.options.stickyHeaderDates ? "fc-list-sticky" : ""],
          o = this.computeDateVars(t.dateProfile),
          i = o.dayDates,
          a = o.dayRanges,
          s = this.eventStoreToSegs(t.eventStore, t.eventUiBases, a);
      return mo(qo, {
        viewSpec: n.viewSpec,
        elRef: this.setRootEl
      }, function (n, o) {
        return mo("div", {
          ref: n,
          className: r.concat(o).join(" ")
        }, mo(Pa, {
          liquid: !t.isHeightAuto,
          overflowX: t.isHeightAuto ? "visible" : "hidden",
          overflowY: t.isHeightAuto ? "visible" : "auto"
        }, s.length > 0 ? e.renderSegList(s, i) : e.renderEmptyMessage()));
      });
    }, t.prototype.renderEmptyMessage = function () {
      var e = this.context,
          t = e.options,
          n = e.viewApi,
          r = {
        text: t.noEventsText,
        view: n
      };
      return mo(Lo, {
        hookProps: r,
        classNames: t.noEventsClassNames,
        content: t.noEventsContent,
        defaultContent: au,
        didMount: t.noEventsDidMount,
        willUnmount: t.noEventsWillUnmount
      }, function (e, t, n, r) {
        return mo("div", {
          className: ["fc-list-empty"].concat(t).join(" "),
          ref: e
        }, mo("div", {
          className: "fc-list-empty-cushion",
          ref: n
        }, r));
      });
    }, t.prototype.renderSegList = function (e, t) {
      var n = this.context,
          o = n.theme,
          i = n.options,
          a = function (e) {
        var t,
            n,
            r = [];

        for (t = 0; t < e.length; t += 1) {
          (r[(n = e[t]).dayIndex] || (r[n.dayIndex] = [])).push(n);
        }

        return r;
      }(e);

      return mo(ha, {
        unit: "day"
      }, function (e, n) {
        for (var s = [], l = 0; l < a.length; l += 1) {
          var u = a[l];

          if (u) {
            var c = t[l].toISOString();
            s.push(mo(Ql, {
              key: c,
              dayDate: t[l],
              todayRange: n
            }));

            for (var d = 0, p = u = Kn(u, i.eventOrder); d < p.length; d++) {
              var f = p[d];
              s.push(mo(nu, _r2({
                key: c + ":" + f.eventRange.instance.instanceId,
                seg: f,
                isDragging: !1,
                isResizing: !1,
                isDateSelecting: !1,
                isSelected: !1
              }, nr(f, n, e))));
            }
          }
        }

        return mo("table", {
          className: "fc-list-table " + o.getClass("table")
        }, mo("tbody", null, s));
      });
    }, t.prototype._eventStoreToSegs = function (e, t, n) {
      return this.eventRangesToSegs(jn(e, t, this.props.dateProfile.activeRange, this.context.options.nextDayThreshold).fg, n);
    }, t.prototype.eventRangesToSegs = function (e, t) {
      for (var n = [], r = 0, o = e; r < o.length; r++) {
        var i = o[r];
        n.push.apply(n, this.eventRangeToSegs(i, t));
      }

      return n;
    }, t.prototype.eventRangeToSegs = function (e, t) {
      var n,
          r,
          o,
          i = this.context.dateEnv,
          a = this.context.options.nextDayThreshold,
          s = e.range,
          l = e.def.allDay,
          u = [];

      for (n = 0; n < t.length; n += 1) {
        if ((r = Wn(s, t[n])) && (o = {
          component: this,
          eventRange: e,
          start: r.start,
          end: r.end,
          isStart: e.isStart && r.start.valueOf() === s.start.valueOf(),
          isEnd: e.isEnd && r.end.valueOf() === s.end.valueOf(),
          dayIndex: n
        }, u.push(o), !o.isEnd && !l && n + 1 < t.length && s.end < i.add(t[n + 1].start, a))) {
          ;
          o.end = s.end, o.isEnd = !0;
          break;
        }
      }

      return u;
    }, t;
  }(No);

  function au(e) {
    return e.text;
  }

  function su(e) {
    for (var t = rt(e.renderRange.start), n = e.renderRange.end, r = [], o = []; t < n;) {
      r.push(t), o.push({
        start: t,
        end: Ke(t, 1)
      }), t = Ke(t, 1);
    }

    return {
      dayDates: r,
      dayRanges: o
    };
  }

  function lu(e) {
    return !1 === e ? null : nn(e);
  }

  var uu = Ho({
    optionRefiners: {
      listDayFormat: lu,
      listDaySideFormat: lu,
      noEventsClassNames: fn,
      noEventsContent: fn,
      noEventsDidMount: fn,
      noEventsWillUnmount: fn
    },
    views: {
      list: {
        component: iu,
        buttonTextKey: "list",
        listDayFormat: {
          month: "long",
          day: "numeric",
          year: "numeric"
        }
      },
      listDay: {
        type: "list",
        duration: {
          days: 1
        },
        listDayFormat: {
          weekday: "long"
        }
      },
      listWeek: {
        type: "list",
        duration: {
          weeks: 1
        },
        listDayFormat: {
          weekday: "long"
        },
        listDaySideFormat: {
          month: "long",
          day: "numeric",
          year: "numeric"
        }
      },
      listMonth: {
        type: "list",
        duration: {
          month: 1
        },
        listDaySideFormat: {
          weekday: "long"
        }
      },
      listYear: {
        type: "list",
        duration: {
          year: 1
        },
        listDaySideFormat: {
          weekday: "long"
        }
      }
    }
  }),
      cu = function (e) {
    function t() {
      return null !== e && e.apply(this, arguments) || this;
    }

    return n(t, e), t;
  }(vo);

  cu.prototype.classes = {
    root: "fc-theme-bootstrap",
    table: "table-bordered",
    tableCellShaded: "table-active",
    buttonGroup: "btn-group",
    button: "btn btn-primary",
    buttonActive: "active",
    popover: "popover",
    popoverHeader: "popover-header",
    popoverContent: "popover-body"
  }, cu.prototype.baseIconClass = "fa", cu.prototype.iconClasses = {
    close: "fa-times",
    prev: "fa-chevron-left",
    next: "fa-chevron-right",
    prevYear: "fa-angle-double-left",
    nextYear: "fa-angle-double-right"
  }, cu.prototype.rtlIconClasses = {
    prev: "fa-chevron-right",
    next: "fa-chevron-left",
    prevYear: "fa-angle-double-right",
    nextYear: "fa-angle-double-left"
  }, cu.prototype.iconOverrideOption = "bootstrapFontAwesome", cu.prototype.iconOverrideCustomButtonOption = "bootstrapFontAwesome", cu.prototype.iconOverridePrefix = "fa-";
  var du = Ho({
    themeClasses: {
      bootstrap: cu
    }
  }),
      pu = "https://www.googleapis.com/calendar/v3/calendars";
  var fu = Ho({
    eventSourceDefs: [{
      parseMeta: function parseMeta(e) {
        var t = e.googleCalendarId;
        return !t && e.url && (t = function (e) {
          var t;
          if (/^[^/]+@([^/.]+\.)*(google|googlemail|gmail)\.com$/.test(e)) return e;
          if ((t = /^https:\/\/www.googleapis.com\/calendar\/v3\/calendars\/([^/]*)/.exec(e)) || (t = /^https?:\/\/www.google.com\/calendar\/feeds\/([^/]*)/.exec(e))) return decodeURIComponent(t[1]);
          return null;
        }(e.url)), t ? {
          googleCalendarId: t,
          googleCalendarApiKey: e.googleCalendarApiKey,
          googleCalendarApiBase: e.googleCalendarApiBase,
          extraParams: e.extraParams
        } : null;
      },
      fetch: function fetch(e, t, n) {
        var o = e.context,
            i = o.dateEnv,
            a = o.options,
            s = e.eventSource.meta,
            l = s.googleCalendarApiKey || a.googleCalendarApiKey;

        if (l) {
          var u = function (e) {
            var t = e.googleCalendarApiBase;
            t || (t = pu);
            return t + "/" + encodeURIComponent(e.googleCalendarId) + "/events";
          }(s),
              c = s.extraParams,
              d = "function" == typeof c ? c() : c,
              p = function (e, t, n, o) {
            var i, a, s;
            o.canComputeOffset ? (a = o.formatIso(e.start), s = o.formatIso(e.end)) : (a = Ke(e.start, -1).toISOString(), s = Ke(e.end, 1).toISOString());
            i = _r2(_r2({}, n || {}), {
              key: t,
              timeMin: a,
              timeMax: s,
              singleEvents: !0,
              maxResults: 9999
            }), "local" !== o.timeZone && (i.timeZone = o.timeZone);
            return i;
          }(e.range, l, d, i);

          gi("GET", u, p, function (e, r) {
            var o, i;
            e.error ? n({
              message: "Google Calendar API: " + e.error.message,
              errors: e.error.errors,
              xhr: r
            }) : t({
              rawEvents: (o = e.items, i = p.timeZone, o.map(function (e) {
                return function (e, t) {
                  var n = e.htmlLink || null;
                  n && t && (n = function (e, t) {
                    return e.replace(/(\?.*?)?(#|$)/, function (e, n, r) {
                      return (n ? n + "&" : "?") + t + r;
                    });
                  }(n, "ctz=" + t));
                  return {
                    id: e.id,
                    title: e.summary,
                    start: e.start.dateTime || e.start.date,
                    end: e.end.dateTime || e.end.date,
                    url: n,
                    location: e.location,
                    description: e.description,
                    attachments: e.attachments || [],
                    extendedProps: (e.extendedProperties || {}).shared || {}
                  };
                }(e, i);
              })),
              xhr: r
            });
          }, function (e, t) {
            n({
              message: e,
              xhr: t
            });
          });
        } else n({
          message: "Specify a googleCalendarApiKey. See http://fullcalendar.io/docs/google_calendar/"
        });
      }
    }],
    optionRefiners: {
      googleCalendarApiKey: String
    },
    eventSourceRefiners: {
      googleCalendarApiKey: String,
      googleCalendarId: String,
      googleCalendarApiBase: String,
      extraParams: fn
    }
  });
  return Ei.push(zs, hl, Jl, uu, du, fu), e.BASE_OPTION_DEFAULTS = on, e.BASE_OPTION_REFINERS = rn, e.BaseComponent = xo, e.BgEvent = ns, e.BootstrapTheme = cu, e.Calendar = hs, e.CalendarApi = br, e.CalendarContent = ia, e.CalendarDataManager = Ri, e.CalendarDataProvider = Ai, e.CalendarRoot = la, e.Component = go, e.ContentHook = Vo, e.CustomContentRenderContext = Wo, e.DateComponent = No, e.DateEnv = Pr, e.DateProfileGenerator = $o, e.DayCellContent = Ja, e.DayCellRoot = es, e.DayGridView = pl, e.DayHeader = ga, e.DaySeriesModel = ya, e.DayTable = dl, e.DayTableModel = Ea, e.DayTableSlicer = cl, e.DayTimeCols = ql, e.DayTimeColsSlicer = Gl, e.DayTimeColsView = Kl, e.DelayedRunner = bi, e.Draggable = Ws, e.ElementDragging = Ki, e.ElementScrollController = fo, e.Emitter = uo, e.EventApi = Cr, e.EventRoot = Ya, e.EventSourceApi = ye, e.FeaturefulElementDragging = _s, e.Fragment = So, e.Interaction = qi, e.ListView = iu, e.MoreLinkRoot = ls, e.MountHook = zo, e.NamedTimeZoneImpl = Ui, e.NowIndicatorRoot = Ka, e.NowTimer = ha, e.PointerDragging = ys, e.PositionCache = co, e.RefMap = Ia, e.RenderHook = Lo, e.ScrollController = po, e.ScrollResponder = Ro, e.Scroller = Pa, e.SegHierarchy = Li, e.SimpleScrollGrid = qa, e.Slicer = Sa, e.Splitter = Zr, e.StandardEvent = Za, e.Table = ll, e.TableDateCell = pa, e.TableDowCell = fa, e.TableView = Bs, e.Theme = vo, e.ThirdPartyDraggable = Fs, e.TimeCols = Bl, e.TimeColsSlatsCoords = Cl, e.TimeColsView = Dl, e.ViewApi = mr, e.ViewContextType = _o, e.ViewRoot = qo, e.WeekNumberRoot = os, e.WindowScrollController = ho, e.addDays = Ke, e.addDurations = Mt, e.addMs = $e, e.addWeeks = Xe, e.allowContextMenu = We, e.allowSelection = Ue, e.applyMutationToEventStore = hr, e.applyStyle = we, e.applyStyleProp = Re, e.asCleanDays = function (e) {
    return e.years || e.months || e.milliseconds ? 0 : e.days;
  }, e.asRoughMinutes = function (e) {
    return Nt(e) / 6e4;
  }, e.asRoughMs = Nt, e.asRoughSeconds = function (e) {
    return Nt(e) / 1e3;
  }, e.binarySearch = Gi, e.buildClassNameNormalizer = Bo, e.buildDayRanges = Yl, e.buildDayTableModel = fl, e.buildEntryKey = Vi, e.buildEventApis = Rr, e.buildEventRangeKey = or, e.buildHashFromArray = function (e, t) {
    for (var n = {}, r = 0; r < e.length; r += 1) {
      var o = t(e[r], r);
      n[o[0]] = o[1];
    }

    return n;
  }, e.buildIsoString = At, e.buildNavLinkData = Jr, e.buildSegCompareObj = $n, e.buildSegTimeText = tr, e.buildSlatMetas = Xl, e.buildTimeColsModel = $l, e.collectFromHash = Ct, e.combineEventUis = wn, e.compareByFieldSpec = ze, e.compareByFieldSpecs = Fe, e.compareNumbers = Ge, e.compareObjs = Dt, e.computeEarliestSegStart = ds, e.computeEdges = oo, e.computeFallbackHeaderFormat = ua, e.computeHeightAndMargins = function (e) {
    return e.getBoundingClientRect().height + function (e) {
      var t = window.getComputedStyle(e);
      return parseInt(t.marginTop, 10) + parseInt(t.marginBottom, 10);
    }(e);
  }, e.computeInnerRect = io, e.computeRect = ao, e.computeSegDraggable = Jn, e.computeSegEndResizable = er, e.computeSegStartResizable = Qn, e.computeShrinkWidth = Na, e.computeSmallestCellWidth = Ye, e.computeVisibleDayRange = Hn, e.config = $i, e.constrainPoint = Br, e.createContext = Do, e.createDuration = kt, e.createElement = mo, e.createEmptyEventStore = mn, e.createEventInstance = pt, e.createEventUi = Cn, e.createFormatter = nn, e.createPlugin = Ho, e.createPortal = bo, e.createRef = Eo, e.diffDates = An, e.diffDayAndTime = et, e.diffDays = Qe, e.diffPoints = Gr, e.diffWeeks = Je, e.diffWholeDays = nt, e.diffWholeWeeks = tt, e.disableCursor = He, e.elementClosest = Se, e.elementMatches = De, e.enableCursor = Oe, e.eventTupleToStore = vn, e.filterEventStoreDefs = En, e.filterHash = vt, e.findDirectChildren = function (e, t) {
    for (var n = e instanceof HTMLElement ? [e] : e, r = [], o = 0; o < n.length; o += 1) {
      for (var i = n[o].children, a = 0; a < i.length; a += 1) {
        var s = i[a];
        t && !De(s, t) || r.push(s);
      }
    }

    return r;
  }, e.findElements = be, e.flexibleCompare = Be, e.flushToDom = Co, e.formatDate = function (e, t) {
    void 0 === t && (t = {});
    var n = Ur(t),
        r = nn(t),
        o = n.createMarkerMeta(e);
    return o ? n.format(o.marker, r, {
      forcedTzo: o.forcedTzo
    }) : "";
  }, e.formatDayString = Ut, e.formatIsoTimeString = Lt, e.formatRange = function (e, t, n) {
    var r = Ur("object" == _typeof(n) && n ? n : {}),
        o = nn(n),
        i = r.createMarkerMeta(e),
        a = r.createMarkerMeta(t);
    return i && a ? r.formatRange(i.marker, a.marker, o, {
      forcedStartTzo: i.forcedTzo,
      forcedEndTzo: a.forcedTzo,
      isEndExclusive: n.isEndExclusive,
      defaultSeparator: on.defaultRangeSeparator
    }) : "";
  }, e.getAllowYScrolling = Oa, e.getCanVGrowWithinCell = qr, e.getClippingParents = so, e.getDateMeta = Kr, e.getDayClassNames = $r, e.getDefaultEventEnd = fr, e.getElSeg = Yn, e.getEntrySpanEnd = Wi, e.getEventClassNames = rr, e.getIsRtlScrollbarOnLeft = to, e.getRectCenter = jr, e.getRelevantEvents = gn, e.getScrollGridClassNames = Fa, e.getScrollbarWidths = no, e.getSectionClassNames = za, e.getSectionHasLiquidHeight = Ha, e.getSegMeta = nr, e.getSlotClassNames = function (e, t) {
    var n = ["fc-slot", "fc-slot-" + Ze[e.dow]];
    return e.isDisabled ? n.push("fc-slot-disabled") : (e.isToday && (n.push("fc-slot-today"), n.push(t.getClass("today"))), e.isPast && n.push("fc-slot-past"), e.isFuture && n.push("fc-slot-future")), n;
  }, e.getStickyFooterScrollbar = Ga, e.getStickyHeaderDates = ja, e.getUnequalProps = St, e.globalLocales = Ir, e.globalPlugins = Ei, e.greatestDurationDenominator = Ot, e.groupIntersectingEntries = Fi, e.guid = Ne, e.hasBgRendering = Gn, e.hasShrinkWidth = Va, e.identity = fn, e.interactionSettingsStore = Xi, e.interactionSettingsToStore = Zi, e.intersectRanges = Wn, e.intersectRects = zr, e.intersectSpans = Bi, e.isArraysEqual = Vt, e.isColPropsEqual = Ua, e.isDateSelectionValid = Ca, e.isDateSpansEqual = sr, e.isInt = qe, e.isInteractionValid = ba, e.isMultiDayRange = On, e.isPropsEqual = Et, e.isPropsValid = Ra, e.isValidDate = ct, e.joinSpans = zi, e.listenBySelector = xe, e.mapHash = gt, e.memoize = Ft, e.memoizeArraylike = function (e, t, n) {
    var r = this,
        o = [],
        i = [];
    return function (a) {
      for (var s = o.length, l = a.length, u = 0; u < s; u += 1) {
        if (a[u]) {
          if (!Vt(o[u], a[u])) {
            n && n(i[u]);
            var c = e.apply(r, a[u]);
            t && t(c, i[u]) || (i[u] = c);
          }
        } else n && n(i[u]);
      }

      for (; u < l; u += 1) {
        i[u] = e.apply(r, a[u]);
      }

      return o = a, i.splice(l), i;
    };
  }, e.memoizeHashlike = function (e, t, n) {
    var r = this,
        o = {},
        i = {};
    return function (a) {
      var s = {};

      for (var l in a) {
        if (i[l]) {
          if (Vt(o[l], a[l])) s[l] = i[l];else {
            n && n(i[l]);
            var u = e.apply(r, a[l]);
            s[l] = t && t(u, i[l]) ? i[l] : u;
          }
        } else s[l] = e.apply(r, a[l]);
      }

      return o = a, i = s, s;
    };
  }, e.memoizeObjArg = zt, e.mergeEventStores = yn, e.multiplyDuration = Pt, e.padStart = je, e.parseBusinessHours = Vr, e.parseClassNames = Sn, e.parseDragMeta = Qi, e.parseEventDef = In, e.parseFieldSpecs = Ve, e.parseMarker = Mr, e.pointInsideRect = Fr, e.preventContextMenu = Le, e.preventDefault = Te, e.preventSelection = Ae, e.rangeContainsMarker = Bn, e.rangeContainsRange = zn, e.rangesEqual = Vn, e.rangesIntersect = Fn, e.refineEventDef = Mn, e.refineProps = pn, e.removeElement = Ee, e.removeExact = function (e, t) {
    for (var n = 0, r = 0; r < e.length;) {
      e[r] === t ? (e.splice(r, 1), n += 1) : r += 1;
    }

    return n;
  }, e.render = yo, e.renderChunkContent = Aa, e.renderFill = ts, e.renderMicroColGroup = La, e.renderScrollShim = Ba, e.requestJson = gi, e.sanitizeShrinkWidth = Wa, e.setElSeg = qn, e.setRef = Io, e.sliceEventStore = jn, e.sliceEvents = function (e, t) {
    return jn(e.eventStore, e.eventUiBases, e.dateProfile.activeRange, t ? e.nextDayThreshold : null).fg;
  }, e.sortEventSegs = Kn, e.startOfDay = rt, e.translateRect = function (e, t, n) {
    return {
      left: e.left + t,
      right: e.right + t,
      top: e.top + n,
      bottom: e.bottom + n
    };
  }, e.triggerDateSelect = dr, e.unmountComponentAtNode = wo, e.unpromisify = lo, e.version = "5.8.0", e.whenTransitionDone = Pe, e.wholeDivideDurations = Ht, Object.defineProperty(e, "__esModule", {
    value: !0
  }), e;
}({});
});

;require.register("Utils/glider.min.js", function(exports, require, module) {
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/* @preserve
    _____ __ _     __                _
   / ___// /(_)___/ /___  ____      (_)___
  / (_ // // // _  // -_)/ __/_    / /(_-<
  \___//_//_/ \_,_/ \__//_/  (_)__/ //___/
                              |___/

  Version: 1.7.4
  Author: Nick Piscitelli (pickykneee)
  Website: https://nickpiscitelli.com
  Documentation: http://nickpiscitelli.github.io/Glider.js
  License: MIT License
  Release Date: October 25th, 2018

*/
!function (e) {
  "function" == typeof define && define.amd ? define(e) : "object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) ? module.exports = e() : e();
}(function () {
  var a = "undefined" != typeof window ? window : this,
      e = a.Glider = function (e, t) {
    var o = this;
    if (e._glider) return e._glider;
    if (o.ele = e, o.ele.classList.add("glider"), (o.ele._glider = o).opt = Object.assign({}, {
      slidesToScroll: 1,
      slidesToShow: 1,
      resizeLock: !0,
      duration: .5,
      easing: function easing(e, t, o, i, r) {
        return i * (t /= r) * t + o;
      }
    }, t), o.animate_id = o.page = o.slide = o.scrollLeft = 0, o.arrows = {}, o._opt = o.opt, o.opt.skipTrack) o.track = o.ele.children[0];else for (o.track = document.createElement("div"), o.ele.appendChild(o.track); 1 !== o.ele.children.length;) {
      o.track.appendChild(o.ele.children[0]);
    }
    o.track.classList.add("glider-track"), o.init(), o.resize = o.init.bind(o, !0), o.event(o.ele, "add", {
      scroll: o.updateControls.bind(o)
    }), o.event(a, "add", {
      resize: o.resize
    });
  },
      t = e.prototype;

  return t.init = function (e, t) {
    var o = this,
        i = 0,
        r = 0;
    o.slides = o.track.children, [].forEach.call(o.slides, function (e, t) {
      e.classList.add("glider-slide"), e.setAttribute("data-gslide", t);
    }), o.containerWidth = o.ele.clientWidth;
    var s = o.settingsBreakpoint();

    if (t = t || s, "auto" === o.opt.slidesToShow || void 0 !== o.opt._autoSlide) {
      var l = o.containerWidth / o.opt.itemWidth;
      o.opt._autoSlide = o.opt.slidesToShow = o.opt.exactWidth ? l : Math.floor(l);
    }

    "auto" === o.opt.slidesToScroll && (o.opt.slidesToScroll = Math.floor(o.opt.slidesToShow)), o.itemWidth = o.opt.exactWidth ? o.opt.itemWidth : o.containerWidth / o.opt.slidesToShow, [].forEach.call(o.slides, function (e) {
      e.style.height = "auto", e.style.width = o.itemWidth + "px", i += o.itemWidth, r = Math.max(e.offsetHeight, r);
    }), o.track.style.width = i + "px", o.trackWidth = i, o.isDrag = !1, o.preventClick = !1, o.opt.resizeLock && o.scrollTo(o.slide * o.itemWidth, 0), (s || t) && (o.bindArrows(), o.buildDots(), o.bindDrag()), o.updateControls(), o.emit(e ? "refresh" : "loaded");
  }, t.bindDrag = function () {
    var t = this;
    t.mouse = t.mouse || t.handleMouse.bind(t);

    function e() {
      t.mouseDown = void 0, t.ele.classList.remove("drag"), t.isDrag && (t.preventClick = !0), t.isDrag = !1;
    }

    var o = {
      mouseup: e,
      mouseleave: e,
      mousedown: function mousedown(e) {
        e.preventDefault(), e.stopPropagation(), t.mouseDown = e.clientX, t.ele.classList.add("drag");
      },
      mousemove: t.mouse,
      click: function click(e) {
        t.preventClick && (e.preventDefault(), e.stopPropagation()), t.preventClick = !1;
      }
    };
    t.ele.classList.toggle("draggable", !0 === t.opt.draggable), t.event(t.ele, "remove", o), t.opt.draggable && t.event(t.ele, "add", o);
  }, t.buildDots = function () {
    var e = this;

    if (e.opt.dots) {
      if ("string" == typeof e.opt.dots ? e.dots = document.querySelector(e.opt.dots) : e.dots = e.opt.dots, e.dots) {
        e.dots.innerHTML = "", e.dots.classList.add("glider-dots");

        for (var t = 0; t < Math.ceil(e.slides.length / e.opt.slidesToShow); ++t) {
          var o = document.createElement("button");
          o.dataset.index = t, o.setAttribute("aria-label", "Page " + (t + 1)), o.className = "glider-dot " + (t ? "" : "active"), e.event(o, "add", {
            click: e.scrollItem.bind(e, t, !0)
          }), e.dots.appendChild(o);
        }
      }
    } else e.dots && (e.dots.innerHTML = "");
  }, t.bindArrows = function () {
    var o = this;
    o.opt.arrows ? ["prev", "next"].forEach(function (e) {
      var t = o.opt.arrows[e];
      t && ("string" == typeof t && (t = document.querySelector(t)), t && (t._func = t._func || o.scrollItem.bind(o, e), o.event(t, "remove", {
        click: t._func
      }), o.event(t, "add", {
        click: t._func
      }), o.arrows[e] = t));
    }) : Object.keys(o.arrows).forEach(function (e) {
      var t = o.arrows[e];
      o.event(t, "remove", {
        click: t._func
      });
    });
  }, t.updateControls = function (e) {
    var d = this;
    e && !d.opt.scrollPropagate && e.stopPropagation();
    var t = d.containerWidth >= d.trackWidth;
    d.opt.rewind || (d.arrows.prev && (d.arrows.prev.classList.toggle("disabled", d.ele.scrollLeft <= 0 || t), d.arrows.prev.classList.contains("disabled") ? d.arrows.prev.setAttribute("aria-disabled", !0) : d.arrows.prev.setAttribute("aria-disabled", !1)), d.arrows.next && (d.arrows.next.classList.toggle("disabled", Math.ceil(d.scrollLeft + d.containerWidth) >= Math.floor(d.trackWidth) || t), d.arrows.next.classList.contains("disabled") ? d.arrows.next.setAttribute("aria-disabled", !0) : d.arrows.next.setAttribute("aria-disabled", !1))), d.slide = Math.round(d.scrollLeft / d.itemWidth), d.page = Math.round(d.scrollLeft / d.containerWidth);
    var c = d.slide + Math.floor(Math.floor(d.opt.slidesToShow) / 2),
        h = Math.floor(d.opt.slidesToShow) % 2 ? 0 : c + 1;
    1 === Math.floor(d.opt.slidesToShow) && (h = 0), d.scrollLeft + d.containerWidth >= Math.floor(d.trackWidth) && (d.page = d.dots ? d.dots.children.length - 1 : 0), [].forEach.call(d.slides, function (e, t) {
      var o = e.classList,
          i = o.contains("visible"),
          r = d.scrollLeft,
          s = d.scrollLeft + d.containerWidth,
          l = d.itemWidth * t,
          n = l + d.itemWidth;
      [].forEach.call(o, function (e) {
        /^left|right/.test(e) && o.remove(e);
      }), o.toggle("active", d.slide === t), c === t || h && h === t ? o.add("center") : (o.remove("center"), o.add([t < c ? "left" : "right", Math.abs(t - (t < c ? c : h || c))].join("-")));
      var a = Math.ceil(l) >= Math.floor(r) && Math.floor(n) <= Math.ceil(s);
      o.toggle("visible", a), a !== i && d.emit("slide-" + (a ? "visible" : "hidden"), {
        slide: t
      });
    }), d.dots && [].forEach.call(d.dots.children, function (e, t) {
      e.classList.toggle("active", d.page === t);
    }), e && d.opt.scrollLock && (clearTimeout(d.scrollLock), d.scrollLock = setTimeout(function () {
      clearTimeout(d.scrollLock), .02 < Math.abs(d.ele.scrollLeft / d.itemWidth - d.slide) && (d.mouseDown || d.trackWidth > d.containerWidth + d.ele.scrollLeft && d.scrollItem(d.getCurrentSlide()));
    }, d.opt.scrollLockDelay || 250));
  }, t.getCurrentSlide = function () {
    var e = this;
    return e.round(e.ele.scrollLeft / e.itemWidth);
  }, t.scrollItem = function (e, t, o) {
    o && o.preventDefault();
    var i = this,
        r = e;
    if (++i.animate_id, !0 === t) e *= i.containerWidth, e = Math.round(e / i.itemWidth) * i.itemWidth;else {
      if ("string" == typeof e) {
        var s = "prev" === e;

        if (e = i.opt.slidesToScroll % 1 || i.opt.slidesToShow % 1 ? i.getCurrentSlide() : i.slide, s ? e -= i.opt.slidesToScroll : e += i.opt.slidesToScroll, i.opt.rewind) {
          var l = i.ele.scrollLeft;
          e = s && !l ? i.slides.length : !s && l + i.containerWidth >= Math.floor(i.trackWidth) ? 0 : e;
        }
      }

      e = Math.max(Math.min(e, i.slides.length), 0), i.slide = e, e = i.itemWidth * e;
    }
    return i.scrollTo(e, i.opt.duration * Math.abs(i.ele.scrollLeft - e), function () {
      i.updateControls(), i.emit("animated", {
        value: r,
        type: "string" == typeof r ? "arrow" : t ? "dot" : "slide"
      });
    }), !1;
  }, t.settingsBreakpoint = function () {
    var e = this,
        t = e._opt.responsive;

    if (t) {
      t.sort(function (e, t) {
        return t.breakpoint - e.breakpoint;
      });

      for (var o = 0; o < t.length; ++o) {
        var i = t[o];
        if (a.innerWidth >= i.breakpoint) return e.breakpoint !== i.breakpoint && (e.opt = Object.assign({}, e._opt, i.settings), e.breakpoint = i.breakpoint, !0);
      }
    }

    var r = 0 !== e.breakpoint;
    return e.opt = Object.assign({}, e._opt), e.breakpoint = 0, r;
  }, t.scrollTo = function (t, o, i) {
    var r = this,
        s = new Date().getTime(),
        l = r.animate_id,
        n = function n() {
      var e = new Date().getTime() - s;
      r.scrollLeft = r.scrollLeft + (t - r.scrollLeft) * r.opt.easing(0, e, 0, 1, o), r.ele.scrollLeft = r.scrollLeft, e < o && l === r.animate_id ? a.requestAnimationFrame(n) : (r.ele.scrollLeft = r.scrollLeft = t, i && i.call(r));
    };

    a.requestAnimationFrame(n);
  }, t.removeItem = function (e) {
    var t = this;
    t.slides.length && (t.track.removeChild(t.slides[e]), t.refresh(!0), t.emit("remove"));
  }, t.addItem = function (e) {
    this.track.appendChild(e), this.refresh(!0), this.emit("add");
  }, t.handleMouse = function (e) {
    var t = this;
    t.mouseDown && (t.isDrag = !0, t.scrollLeft += (t.mouseDown - e.clientX) * (t.opt.dragVelocity || 3.3), t.mouseDown = e.clientX, t.ele.scrollLeft = t.scrollLeft);
  }, t.round = function (e) {
    var t = 1 / (this.opt.slidesToScroll % 1 || 1);
    return Math.round(e * t) / t;
  }, t.refresh = function (e) {
    this.init(!0, e);
  }, t.setOption = function (t, e) {
    var o = this;
    o.breakpoint && !e ? o._opt.responsive.forEach(function (e) {
      e.breakpoint === o.breakpoint && (e.settings = Object.assign({}, e.settings, t));
    }) : o._opt = Object.assign({}, o._opt, t), o.breakpoint = 0, o.settingsBreakpoint();
  }, t.destroy = function () {
    function e(t) {
      t.removeAttribute("style"), [].forEach.call(t.classList, function (e) {
        /^glider/.test(e) && t.classList.remove(e);
      });
    }

    var t = this,
        o = t.ele.cloneNode(!0);
    o.children[0].outerHTML = o.children[0].innerHTML, e(o), [].forEach.call(o.getElementsByTagName("*"), e), t.ele.parentNode.replaceChild(o, t.ele), t.event(a, "remove", {
      resize: t.resize
    }), t.emit("destroy");
  }, t.emit = function (e, t) {
    var o = new a.CustomEvent("glider-" + e, {
      bubbles: !this.opt.eventPropagate,
      detail: t
    });
    this.ele.dispatchEvent(o);
  }, t.event = function (e, t, o) {
    var i = e[t + "EventListener"].bind(e);
    Object.keys(o).forEach(function (e) {
      i(e, o[e]);
    });
  }, e;
});
});

require.register("Utils/helpers.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AVATAR_URL = exports.ScrollToPageTitle = exports.oneExists = exports.exists = exports.handlers = exports.formatDate = exports.parsePrices = exports.getTotal = exports.getQuantity = exports.getPrice = exports.toProducts = exports.listOf = exports.uuid = exports.isActiveRoute = exports.jsonCopy = exports.randomEl = exports.scrollToAnchor = exports.getRoute = exports.debounce = exports.filterTask = exports._paginate = exports._direction = exports._sort = exports._search = exports.addTerms = exports.infiniteScroll = exports.isEmpty = exports.makeRoute = void 0;

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

var ScrollToPageTitle = function ScrollToPageTitle() {
  return document.getElementById("page-title") ? document.getElementById("page-title").scrollIntoView({
    behavior: "smooth",
    block: "center",
    inline: "start"
  }) : window.scroll({
    top: 160,
    left: 0,
    behavior: "smooth"
  });
};

exports.ScrollToPageTitle = ScrollToPageTitle;
var AVATAR_URL = "https://i.ibb.co/6W0zsZH/avatar.webp";
exports.AVATAR_URL = AVATAR_URL;
});

;require.register("Utils/html-sanitize.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//https://raw.githubusercontent.com/jitbit/HtmlSanitizer/master/HtmlSanitizer.js
//JavaScript HTML Sanitizer, (c) Alexander Yumashev, Jitbit Software.
//homepage https://github.com/jitbit/HtmlSanitizer
//License: MIT https://github.com/jitbit/HtmlSanitizer/blob/master/LICENSE
var HtmlSanitizer = new function () {
  var _contentTagWhiteList_;

  var tagWhitelist_ = {
    A: true,
    ABBR: true,
    B: true,
    BLOCKQUOTE: true,
    BODY: true,
    BR: true,
    CENTER: true,
    CODE: true,
    DIV: true,
    EM: true,
    FONT: true,
    H1: true,
    H2: true,
    H3: true,
    H4: true,
    H5: true,
    H6: true,
    HR: true,
    I: true,
    IMG: true,
    LABEL: true,
    LI: true,
    OL: true,
    P: true,
    PRE: true,
    SMALL: true,
    SOURCE: true,
    SPAN: true,
    STRONG: true,
    TABLE: true,
    TBODY: true,
    TR: true,
    TD: true,
    TH: true,
    THEAD: true,
    UL: true,
    U: true,
    VIDEO: true
  };
  var contentTagWhiteList_ = (_contentTagWhiteList_ = {
    FORM: true,
    TABLE: true,
    FIGURE: true
  }, _defineProperty(_contentTagWhiteList_, "TABLE", true), _defineProperty(_contentTagWhiteList_, "TBODY", true), _defineProperty(_contentTagWhiteList_, "TR", true), _defineProperty(_contentTagWhiteList_, "TD", true), _defineProperty(_contentTagWhiteList_, "TH", true), _defineProperty(_contentTagWhiteList_, "THEAD", true), _contentTagWhiteList_); //tags that will be converted to DIVs

  var attributeWhitelist_ = {
    align: true,
    color: true,
    "class": true,
    controls: true,
    height: true,
    href: true,
    src: true,
    style: true,
    target: true,
    title: true,
    type: true,
    width: true
  };
  var cssWhitelist_ = {
    color: true,
    "background-color": true,
    "font-size": true,
    "text-align": true,
    "text-decoration": true,
    "font-weight": true
  };
  var schemaWhiteList_ = ["http:", "https:", "data:", "m-files:", "file:", "ftp:"]; //which "protocols" are allowed in "href", "src" etc

  var uriAttributes_ = {
    href: true,
    action: true
  };

  this.SanitizeHtml = function (input) {
    input = input.trim();
    if (input == "") return ""; //to save performance and not create iframe
    //firefox "bogus node" workaround

    if (input == "<br>") return "";
    var iframe = document.createElement("iframe");

    if (iframe["sandbox"] === undefined) {
      alert("Your browser does not support sandboxed iframes. Please upgrade to a modern browser.");
      return "";
    }

    iframe["sandbox"] = "allow-same-origin allow-scripts allow-popups allow-forms";
    iframe.style.display = "none"; // console.log(iframe)

    document.body.appendChild(iframe); // necessary so the iframe contains a document

    var iframedoc = iframe.contentDocument || iframe.contentWindow.document;
    if (iframedoc.body == null) iframedoc.write("<body></body>"); // null in IE

    iframedoc.body.innerHTML = input;

    function makeSanitizedCopy(node) {
      if (node.nodeType == Node.TEXT_NODE) {
        var newNode = node.cloneNode(true);
      } else if (node.nodeType == Node.ELEMENT_NODE && (tagWhitelist_[node.tagName] || contentTagWhiteList_[node.tagName])) {
        //remove useless empty spans (lots of those when pasting from MS Outlook)
        if ((node.tagName == "SPAN" || node.tagName == "B" || node.tagName == "I" || node.tagName == "U") && node.innerHTML.trim() == "") {
          return document.createDocumentFragment();
        }

        if (contentTagWhiteList_[node.tagName]) newNode = iframedoc.createElement("DIV"); //convert to DIV
        else newNode = iframedoc.createElement(node.tagName);

        for (var i = 0; i < node.attributes.length; i++) {
          var attr = node.attributes[i];

          if (attributeWhitelist_[attr.name]) {
            if (attr.name == "style") {
              for (var s = 0; s < node.style.length; s++) {
                var styleName = node.style[s];
                if (cssWhitelist_[styleName]) newNode.style.setProperty(styleName, node.style.getPropertyValue(styleName));
              }
            } else {
              if (uriAttributes_[attr.name]) {
                //if this is a "uri" attribute, that can have "javascript:" or something
                if (attr.value.indexOf(":") > -1 && !startsWithAny(attr.value, schemaWhiteList_)) continue;
              }

              newNode.setAttribute(attr.name, attr.value);
            }
          }
        }

        for (i = 0; i < node.childNodes.length; i++) {
          var subCopy = makeSanitizedCopy(node.childNodes[i]);
          newNode.appendChild(subCopy, false);
        }
      } else {
        newNode = document.createDocumentFragment();
      }

      return newNode;
    }

    var resultElement = makeSanitizedCopy(iframedoc.body);
    document.body.removeChild(iframe);
    return resultElement.innerHTML.replace(/<br[^>]*>(\S)/g, "<br>\n$1").replace(/div><div/g, "div>\n<div"); //replace is just for cleaner code
  };

  function startsWithAny(str, substrings) {
    for (var i = 0; i < substrings.length; i++) {
      if (str.indexOf(substrings[i]) == 0) {
        return true;
      }
    }

    return false;
  }

  this.AllowedTags = tagWhitelist_;
  this.AllowedAttributes = attributeWhitelist_;
  this.AllowedCssStyles = cssWhitelist_;
  this.AllowedSchemas = schemaWhiteList_;
}();
var _default = HtmlSanitizer;
exports["default"] = _default;
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
      return rej(JSON.parse(JSON.stringify(e)));
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
var OpenCageUrl = "".concat(_secrets.OpenCage.baseUrl, "?key=").concat(_secrets.OpenCage.key, "&q=");
var openCage = {
  getLocationTask: function getLocationTask(mdl) {
    return function (query) {
      return HttpTask(_secrets.OpenCage.headers())("GET")(mdl)(OpenCageUrl + query + "&pretty=1&json&bounds=".concat(mdl.Map.bounds()))(null);
    };
  }
};
var http = {
  imgBB: imgBB,
  openCage: openCage,
  back4App: back4App,
  // paypal,
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

var _htmlSanitize = require("./html-sanitize");

Object.keys(_htmlSanitize).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _htmlSanitize[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _htmlSanitize[key];
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

;require.register("Utils/openCage.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBoundsTask = exports.locateQueryTask = void 0;

var _ramda = require("ramda");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var toOpenCageFormat = function toOpenCageFormat(q) {
  return typeof q == "string" ? encodeURIComponent(q) : encodeURIComponent("".concat(q[0], ",").concat(q[1]));
};

var toLocationViewModel = function toLocationViewModel(_ref) {
  var _ref2 = _slicedToArray(_ref, 2),
      address = _ref2[0],
      ll = _ref2[1];

  return {
    address: address,
    latlong: JSON.stringify(ll)
  };
};

var locateQueryTask = function locateQueryTask(http) {
  return function (mdl) {
    return function (query) {
      return http.openCage.getLocationTask(mdl)(toOpenCageFormat(query)).map((0, _ramda.prop)("results")).map((0, _ramda.map)((0, _ramda.paths)([["formatted"], ["geometry"]]))).map((0, _ramda.map)(toLocationViewModel));
    };
  };
};

exports.locateQueryTask = locateQueryTask;

var getBoundsTask = function getBoundsTask(http) {
  return function (mdl) {
    return function (coords) {
      return http.openCage.getLocationTask(mdl)(toOpenCageFormat(coords)).map((0, _ramda.path)(["results", 0, "bounds"])).map(function (_ref3) {
        var southwest = _ref3.southwest,
            northeast = _ref3.northeast;
        return encodeURIComponent("".concat(southwest.lng, ",").concat(southwest.lat, ",").concat(northeast.lng, ",").concat(northeast.lat));
      });
    };
  };
};

exports.getBoundsTask = getBoundsTask;
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

window.perf = function (fn) {
  var startTime = performance.now(); // Do the normal stuff for this function

  var duration = performance.now() - startTime;
  console.log("".concat(fn, " took ").concat(duration, "ms"));
};

_funConfig.FunConfig.configure();

_index["default"].navState = _index["default"].Routes.reduce(function (acc, r) {
  if (r.children.any()) acc[r.id] = Stream(false);
  return acc;
}, {});
var root = document.body;
var winW = window.innerWidth;

window.log = function (m) {
  return function (v) {
    console.log(m, v);
    return v;
  };
};

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
    console.error("problem fetching user", e);
  };

  var onSuccess = function onSuccess(user) {
    _index["default"].user = user;
    user.emailVerified ? _index["default"].state.isAuth(true) : sessionStorage.clear();
  };

  _index["default"].http.back4App.getTask(_index["default"])("users/me").fork(onError, onSuccess);
}

m.route(root, "/", (0, _app["default"])(_index["default"]));
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