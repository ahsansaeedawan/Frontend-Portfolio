import React, { Component } from "react";
import ReactDOM from "react-dom";

var videoTmb =
  "data:image/svg+xml,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22iso-8859-1%22%3F%3E%3Csvg%20version%3D%221.1%22%20id%3D%22Capa_1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20x%3D%220px%22%20y%3D%220px%22%20%20viewBox%3D%220%200%2060%2060%22%20style%3D%22enable-background%3Anew%200%200%2060%2060%3B%22%20xml%3Aspace%3D%22preserve%22%3E%3Cg%3E%20%3Cpath%20d%3D%22M45.563%2C29.174l-22-15c-0.307-0.208-0.703-0.231-1.031-0.058C22.205%2C14.289%2C22%2C14.629%2C22%2C15v30%20%20c0%2C0.371%2C0.205%2C0.711%2C0.533%2C0.884C22.679%2C45.962%2C22.84%2C46%2C23%2C46c0.197%2C0%2C0.394-0.059%2C0.563-0.174l22-15%20%20C45.836%2C30.64%2C46%2C30.331%2C46%2C30S45.836%2C29.36%2C45.563%2C29.174z%20M24%2C43.107V16.893L43.225%2C30L24%2C43.107z%22%2F%3E%20%3Cpath%20d%3D%22M30%2C0C13.458%2C0%2C0%2C13.458%2C0%2C30s13.458%2C30%2C30%2C30s30-13.458%2C30-30S46.542%2C0%2C30%2C0z%20M30%2C58C14.561%2C58%2C2%2C45.439%2C2%2C30%20%20S14.561%2C2%2C30%2C2s28%2C12.561%2C28%2C28S45.439%2C58%2C30%2C58z%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E";

var galleryTmb =
  "data:image/svg+xml,%3C%3Fxml%20version%3D%221.0%22%20%3F%3E%3Csvg%20id%3D%22Layer_1%22%20style%3D%22enable-background%3Anew%200%200%20512%20512%3B%22%20version%3D%221.1%22%20viewBox%3D%220%200%20512%20512%22%20xml%3Aspace%3D%22preserve%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%20.st0%7Bfill%3Anone%3Bstroke%3A%23000000%3Bstroke-width%3A14%3Bstroke-linecap%3Around%3Bstroke-linejoin%3Around%3Bstroke-miterlimit%3A10%3B%7D%3C%2Fstyle%3E%3Cg%3E%3Cpath%20class%3D%22st0%22%20d%3D%22M247.9%2C109c0.2%2C0%2C0.5%2C0%2C0.7%2C0%22%2F%3E%3Cpath%20class%3D%22st0%22%20d%3D%22M276.9%2C108.6c39.6-0.4%2C79.3-0.8%2C120.1-0.8c22.1%2C0%2C40%2C12.2%2C46.6%2C32.1c1.7%2C5%2C2.5%2C10.6%2C2.5%2C15.9%20%20%20c0.2%2C66.1%2C0.2%2C132.1%2C0.1%2C198.2c0%2C27.4-20.8%2C48-48.5%2C48c-45.2%2C0.1-84.3%2C2.1-129.5%2C2.1c-51.2%2C0-102.4%2C0-153.6%2C0%20%20%20c-23.8%2C0-42.5-14.6-47.8-37.2c-0.3-1.4-0.8-2.9-1.1-4.3c0-3.6%2C0-7.2%2C0-10.9%22%2F%3E%3Cpath%20class%3D%22st0%22%20d%3D%22M65.7%2C321.9c0-56.9%2C0-113.7%2C0-170.6c1.4-4.4%2C2.2-9%2C4.2-13.2c8-17.2%2C21.7-26.5%2C40.6-28.1c1.5-0.1%2C3-0.1%2C4.5-0.1%20%20%20c35%2C0%2C69.3-0.3%2C103.3-0.6%22%2F%3E%3Cpath%20class%3D%22st0%22%20d%3D%22M130.7%2C358.7c12.4-11.5%2C23.4-24.1%2C34.1-36.9%22%2F%3E%3Cpath%20class%3D%22st0%22%20d%3D%22M179%2C304.8c10.7-12.7%2C21.6-25.3%2C33.9-36.9c1.4-1.3%2C2.9-2.7%2C4.4-4c8.3%2C7.4%2C24.8%2C20.5%2C32.8%2C27.7%20%20%20c6.5%2C5.9%2C14.4%2C8%2C18.2%2C0c5-10.3%2C19-54%2C25.1-74.6c1.2%2C1.1%2C2.2%2C2%2C3.2%2C3c27.9%2C36%2C68%2C103.7%2C89.8%2C137.4%22%2F%3E%3Ccircle%20cx%3D%22370.9%22%20cy%3D%22181.9%22%20r%3D%2220%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E";

function styleInject(css, ref) {
  if (ref === void 0) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === "undefined") {
    return;
  }

  var head = document.head || document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  style.type = "text/css";

  if (insertAt === "top") {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css =
  ".modal-lightbox>div>.counter,\n.modal-lightbox>div>.x {\n    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif\n}\n\na.alex-box:focus {\n    outline: 0\n}\n\na.alex-box {\n    text-decoration: none;\n display: block;\n position: relative;\n}\n\n.modal-lightbox {\n    position: fixed;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n    background: rgba(0, 0, 0, .938);\n    z-index: 10;\n    overflow: hidden\n}\n\n.modal-lightbox>div>.x::before {\n    content: \"𝗑\"\n}\n\n.modal-lightbox>div>.x {\n    position: absolute;\n    text-align: center;\n    font-size: 2em;\n    color: #fff;\n    cursor: pointer;\n    width: 30px;\n    height: 30px;\n    border-radius: 50%;\n    top: 10px;\n    right: 10px;\n    line-height: 30px;\n    z-index: 11\n}\n\n.modal-lightbox>.foto,\n.modal-lightbox>.video {\n    position: absolute;\n    top: 50%;\n    left: 50%;\n    transform: translate(-50%, -50%);\n    max-width: 75%;\n    max-height: 75%;\n    z-index: 10\n}\n\n.lBtn,\n.modal-lightbox>div>.counter,\n.rBtn {\n    position: absolute;\n    text-align: center;\n    font-size: 1.2em;\n    color: #fff;\n    cursor: pointer;\n    z-index: 11\n}\n\n@keyframes enter {\n    0% {\n        max-width: 30%;\n        max-height: 30%\n    }\n    100% {\n        max-width: 90%;\n        max-height: 90%\n    }\n}\n\n.enterEffect {\n    animation: enter .25s cubic-bezier(.39, .575, .565, 1)\n}\n\n.lBtn,\n.rBtn {\n    top: 50%;\n    width: 40px;\n    height: 76.31px;\n    border-radius: 3px;\n    font-weight: 500;\n    transform: translate(0, -50%);\n    text-shadow: 0 0 10px #000;\n    line-height: 76.31px;\n }\n\n.lBtn {\n    left: 2%\n}\n\n.rBtn {\n    right: 2%\n}\n\n.lBtn::before,\n.rBtn::before {\n    content: '';\n}\n\n.rBtn>.svg {\n}\n\n.lBtn>.svg {\n    transform: rotateZ(180deg);\n}\n\n.modal-lightbox>div>.counter {\n    width: 30px;\n    height: 30px;\n    border-radius: 50%;\n    top: 10px;\n    left: 10px;\n    line-height: 30px\n}\n\n.alex-box .tmb {\n    max-width: 100%;\n    max-height: 350px;\n    object-fit: scale-down;\n    background: rgba(255, 255, 255, .5);\n    margin: 13px 0px 0px 0px;\n    border-radius: 10px;\n }\n\n@media all and (max-height:993px) {\n    @keyframes enter {\n        0% {\n            max-width: 30%;\n            max-height: 30%\n        }\n        100% {\n            max-width: 100%;\n            max-height: 100%\n        }\n    }\n    .modal-lightbox>.foto,\n    .modal-lightbox>.video {\n        max-width: 75%;\n        max-height: 75%;\n    }\n}";
styleInject(css);

var arrow =
  "data:image/svg+xml,%3Csvg%20data-name%3D%22Layer%201%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20218.03%20416.03%22%3E%3Cpath%20d%3D%22M2.94%2017.08l67.07%2067.07%20106.45%20106.46%2024.48%2024.48c9.11%209.11%2023.26-5%2014.14-14.14l-67.07-67.08L41.56%2027.41%2017.08%202.94c-9.11-9.11-23.26%205-14.14%2014.14z%22%20fill%3D%22%23fff%22%2F%3E%3Cpath%20d%3D%22M17.08%20413.08l67.07-67.07%20106.46-106.45%2024.48-24.48c9.11-9.11-5-23.26-14.14-14.14l-67.08%2067.07L27.41%20374.46%202.93%20398.94c-9.11%209.11%205%2023.26%2014.14%2014.14z%22%20fill%3D%22%23fff%22%2F%3E%3C%2Fsvg%3E";

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError(
      "Super expression must either be null or a function, not " +
      typeof superClass
    );
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass)
    Object.setPrototypeOf
      ? Object.setPrototypeOf(subClass, superClass)
      : (subClass.__proto__ = superClass);
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  }

  return call && (typeof call === "object" || typeof call === "function")
    ? call
    : self;
};

var path = require("path");

var Modal = (function (_Component) {
  inherits(Modal, _Component);

  function Modal(props) {
    classCallCheck(this, Modal);

    var _this = possibleConstructorReturn(
      this,
      (Modal.__proto__ || Object.getPrototypeOf(Modal)).call(this, props)
    );

    _this.modalClose = function (e) {
      if (e) e.preventDefault();
      ReactDOM.render(
        React.createElement("div", null),
        document.querySelector("#modal-alex-box")
      );
    };

    _this.next = function (e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      var _this$state = _this.state,
        current = _this$state.current,
        total = _this$state.total;
      var pictures = _this.props.pictures;
      var nextPic = (current + 1) % total;
      var ext = pictures[nextPic].exe;
      _this.setState({
        current: nextPic,
        currentRef: pictures[nextPic].url,
        video: ext === "mp4",
        xMove: ""
      });
    };

    _this.prev = function (e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      var _this$state2 = _this.state,
        current = _this$state2.current,
        total = _this$state2.total;
      var pictures = _this.props.pictures;

      var prevPic = current === 0 ? total - 1 : (current - 1) % total;
      var ext = pictures[prevPic].exe;
      _this.setState({
        current: prevPic,
        currentRef: pictures[prevPic].url,
        video: ext === "mp4",
        xMove: ""
      });
    };

    _this.clickedPic = function (e) {
      if (e) e.stopPropagation();
      _this.setState(function (_ref) {
        var toggle = _ref.toggle;
        return { toggle: !toggle };
      });
    };

    _this.keypressed = function (e) {
      if (e) {
        e.preventDefault();
        var x = e.charCode || e.keyCode;
      }
      if (x === 37 || x === 40) _this.prev();
      else if (x === 39 || x === 38) _this.next();
      else if (x === 27) _this.modalClose();
    };

    _this.handlestart = function (e) {
      if (e.touches.length > 1) e.preventDefault();
      _this.setState({
        tStartX: e.touches[0].clientX,
        fingers: e.touches.length
      });
    };

    _this.handlemove = function (e) {
      e.persist();
      if (e.touches.length > 1) e.preventDefault();
      if (_this.state.fingers === 1) {
        var x = e.changedTouches[0].clientX - _this.state.tStartX;
        _this.setState({
          xMove: "translate(calc(" + x / 3 + "px - 50%),-50%)"
        });
      }
    };

    _this.handleend = function (e) {
      e.persist();
      if (e.touches.length > 1) e.preventDefault();
      _this.setState(
        function (_ref2) {
          var tStartX = _ref2.tStartX;
          return { tEndX: e.changedTouches[0].clientX - tStartX };
        },
        function () {
          var _this$state3 = _this.state,
            fingers = _this$state3.fingers,
            tEndX = _this$state3.tEndX;

          if (fingers === 1) {
            if (tEndX < 0) _this.next();
            else if (tEndX > 0) _this.prev();
          }
        }
      );
    };

    _this.state = {
      total: props.pictures.length,
      current: Number(props.startIndex) % props.pictures.length,
      currentRef: props.modalRef,
      toggle: true,
      video: false,
      tStartX: 0,
      tEndX: 0,
      xMove: "",
      fingers: 0
    };
    return _this;
  }

  createClass(Modal, [
    {
      key: "componentDidMount",
      value: function componentDidMount() {
        document.addEventListener("keydown", this.keypressed);
      }
    },
    {
      key: "componentWillMount",
      value: function componentWillMount() {
        var ext = path.extname(this.state.currentRef);
        if (ext === "mp4") this.setState({ video: true });
        else this.setState({ video: false });
      }
    },
    {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        document.removeEventListener("keydown", this.keypressed);
      }
    },
    {
      key: "render",
      value: function render() {
        var _state = this.state,
          toggle = _state.toggle,
          current = _state.current,
          currentRef = _state.currentRef,
          total = _state.total,
          video = _state.video,
          xMove = _state.xMove;

        var style = { transform: xMove };
        return React.createElement(
          "div",
          { className: "modal-lightbox", onClick: this.modalClose },
          toggle
            ? React.createElement(
              "div",
              null,
              React.createElement("div", {
                className: "x",
                onClick: this.modalClose
              }),
              React.createElement(
                "div",
                { className: "lBtn", onClick: this.prev },
                React.createElement("img", { src: arrow, className: "svg" })
              ),
              React.createElement(
                "div",
                { className: "rBtn", onClick: this.next },
                React.createElement("img", { src: arrow, className: "svg" })
              ),
              React.createElement(
                "div",
                { className: "counter" },
                current + 1,
                "/",
                total
              )
            )
            : null,
          video
            ? React.createElement(
              "video",
              {
                controls: true,
                className: "video enterEffect",
                style: style,
                onClick: this.clickedPic,
                onTouchStart: this.handlestart,
                onTouchMove: this.handlemove,
                onTouchEnd: this.handleend
              },
              React.createElement("source", {
                src: currentRef,
                type: "video/mp4"
              })
            )
            : React.createElement("img", {
              className: "video enterEffect",
              src: currentRef,
              style: style,
              onClick: this.clickedPic,
              onTouchStart: this.handlestart,
              onTouchMove: this.handlemove,
              onTouchEnd: this.handleend
            })
        );
      }
    }
  ]);
  return Modal;
})(Component);

var path$1 = require("path");

var Gallery = (function (_Component) {
  inherits(Gallery, _Component);

  function Gallery(props) {
    classCallCheck(this, Gallery);

    var _this = possibleConstructorReturn(
      this,
      (Gallery.__proto__ || Object.getPrototypeOf(Gallery)).call(this, props)
    );

    _this.handleClick = function (e) {
      e.preventDefault();
      _this.setState(
        {
          index: e.target.parentNode.id,
          stateRef: e.target.parentNode.href || e.target.parentNode.dataset.href
        },
        function () {
          return _this.openModal();
        }
      );
    };

    _this.openModal = function () {
      var _this$state = _this.state,
        stateRef = _this$state.stateRef,
        index = _this$state.index;

      ReactDOM.render(
        React.createElement(Modal, {
          modalRef: stateRef,
          pictures: _this.props.files,
          startIndex: index
        }),
        document.querySelector("#modal-alex-box")
      );
    };

    _this.renderThumbnails = function () {
      var _this$props = _this.props,
        files = _this$props.files,
        thumbnails = _this$props.thumbnails,
        tmbClass = _this$props.tmbClass;

      return files.map(function (file, index) {
        var ext = file.exe;
        return React.createElement(
          "a",
          {
            onClick: _this.handleClick,
            href: file.url,
            className: "alex-box",
            key: index,
            id: index
          },

          file.exe === "mp4"
            ? React.createElement(
              "div",
              { className: "video-thumbnail", "data-href": file.url, id: index },
              React.createElement(
                "video",
                {
                  controls: false,
                  autoPlay: false,
                  className: "video"
                },
                React.createElement("source", {
                  src: file.url,
                  type: "video/mp4"
                })
              ),
              React.createElement(
                "div",
                {
                  className: "video-play-thumbnail",
                  onClick: _this.handleClick
                },
                null
              )
            )
            : React.createElement(
              "div",
              { "data-href": file.url, id: index },
              React.createElement("img", {
                src: _this.state.default
                  ? file.exe === "mp4"
                    ? videoTmb
                    : galleryTmb
                  : thumbnails[index].url,
                className: tmbClass ? tmbClass : "tmb"
              }),
              React.createElement(
                "span",
                { className: "image-caption" },
                React.createElement("i", { className: "sf-icon i-camera" }),
                React.createElement("i", { className: "sf-icon i-expand" })
              )
            )
        );
      });
    };

    _this.state = {
      index: null,
      stateRef: "",
      default: props.thumbnails
        ? props.files.length === props.thumbnails.length
          ? false
          : true
        : true
    };
    return _this;
  }

  createClass(Gallery, [
    {
      key: "UNSAFE_componentWillMount",
      value: function UNSAFE_componentWillMount() {
        var body = document.querySelector("body");
        var divexst = document.querySelector("#modal-alex-box");
        if (!divexst) {
          var modalDiv = document.createElement("div");
          modalDiv.setAttribute("id", "modal-alex-box");
          body.appendChild(modalDiv);
        }
      }
    },
    {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        var modalDiv = document.querySelector("#modal-alex-box");
        modalDiv && document.querySelector("body").removeChild(modalDiv);
      }
    },
    {
      key: "render",
      value: function render() {
        var galleryClasses = this.props.galleryClasses;

        return React.createElement(
          "div",
          { className: galleryClasses ? galleryClasses : "demoGallery" },
          this.renderThumbnails()
        );
      }
    }
  ]);
  return Gallery;
})(Component);

export default Gallery;
//# sourceMappingURL=index.es.js.map
