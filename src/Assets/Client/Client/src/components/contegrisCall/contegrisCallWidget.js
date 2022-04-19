import React, { useState, useEffect } from 'react';
import classNames from "classnames";
import "./contegrisCallWidget.css";

const ContegrisCallWidget = ({ visible, onClose, intelliconUser }) => {

  const [menuOpen, setMenuOpen] = useState(true);
  let intelliconUserInfo = intelliconUser.intelliconAgent && intelliconUser.intelliconAgent;
  let username = intelliconUserInfo.username === undefined || intelliconUserInfo.username === null ? "intellicon" : intelliconUserInfo.username;
  function toggleMenu() {
    setMenuOpen(!menuOpen);
  }

  function handleOnClose() {
    setMenuOpen(true);
    onClose();
  }

  return (
    <div className={classNames(
      "callContainer",
      { open: menuOpen },
      { visible: visible }

    )} >
      <div className={classNames(
        "overlap-header",
        { open: menuOpen }
      )}
      >
        <p>IYLUS Dialer</p>
        <img src="/assets/icons/chevron-down-white-panel.png" onClick={toggleMenu} alt="v" />
        <i className="sf-icon i-modal-close" onClick={handleOnClose} />
      </div>
      <div id="openBox" data-foo-id="1"></div>
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
      <script>
        {(function (global) {
          //comnment these lines for now just for a  maintaince purpose from devops
          var serverHost = "https://contact.iylus.com:54200";
          var partyId = "112233455";
          var useIframe = "true";
          //var agentIntellicon = `SIP/${username}`;
          var agentIntellicon = `SIP/Intellicon`;

          var httpType = "https";
          var intelliconBASEURL = "https://contact.iylus.com/intellicon/";
          var intelliconSOCKURL = "https://contact.iylus.com:4443/";

          // var username = JSON.stringify(intelliconUserInfo.username);
          //  var password = JSON.stringify(intelliconUserInfo.password);

          init();
          //injectStyles();
          //injectJs();

          function init() {
            var fooWidgets = document.querySelectorAll("#openBox");
            for (var i = 0; i < fooWidgets.length; ++i) {
              var fooWidget = fooWidgets[i];
              processFooWidget(fooWidget);
            }
          }

          function processFooWidget(fooWidget) {
            var id = fooWidget.getAttribute("data-foo-id");
            var processed = fooWidget.getAttribute("data-foo-processed");
            if (!id || processed === "done") {
              //skip this one as it has either already been processed, or lacks an ID
              //This is done to ensure logic is not executed twice in the event that the
              //user erroneously embeds the script tag more than once on a single page
              //console.log("skipping element:", fooWidget);
              return;
            }
            createFooWidget(fooWidget, id);
          }

          function createFooWidget(fooWidget, id) {
            var iframe = document.createElement("iframe");
            iframe.setAttribute(
              "src",
              serverHost +
              "/api/3rd/intellicon/widget/" +
              id +
              "/init?iframe=true&partyId=" +
              partyId +
              "&agentIntellicon=" +
              agentIntellicon +
              "&intelliconBASEURL=" +
              intelliconBASEURL +
              "&intelliconSOCKURL=" +
              intelliconSOCKURL
            );
            iframe.setAttribute("class", "foo-widget-iframe");
            iframe.setAttribute("data-foo-id", id);
            iframe.setAttribute("frameborder", "0");
            iframe.setAttribute("scrolling", "no");
            iframe.style.height = "100%";
            iframe.style.width = "100%";
            iframe.style.overflow = "hidden";
            iframe.style.bottom = "0";
            iframe.style.right = '-1px'
            iframe.style.position = "absolute";
            iframe.style.zIndex = "9999";
            iframe.allow = "microphone; autoplay";
            iframe.style.background = "#232323";

            fooWidget.appendChild(iframe);

            fooWidget.setAttribute("data-foo-processed", "done");
          }

          //See http://css-tricks.com/snippets/javascript/inject-new-css-rules
          // function injectStyles() {
          //   var css =
          //     " .foo-widget {position: fixed;     right: 0;     bottom: 0px;     z-index: 999999999999999999999999999;     display: none;     width:400px; 	border: 1px solid #dfdfdf;     background-color: #f9f9f9;     -webkit-box-shadow: 0 0 50px 10px rgba(0,0,0,.15);     -moz-box-shadow: 0 0 50px 10px rgba(0,0,0,.15);     box-shadow: 0 0 50px 10px rgba(0,0,0,.15);     -webkit-border-radius: 2px;     -moz-border-radius: 2px;     border-radius: 2px; 	margin: 0;     padding: 0;     vertical-align: baseline;     font-size: 100%;	  }  .openBox{ 	padding: 10px;  	height: auto;  	display:none; 	position: fixed;  	bottom: 0;  	right: 20px;  	z-index: 9999;  	background-color: rgba(255, 255, 255, 0.97);  	color: #00579b; 	direction: ltr; 	font-weight: bold; 	font-family: Arial, Helvetica, sans-serif;  	font-size: 12px;  	line-height: 140%;  	box-shadow: #00579b 0px 0px 5px;  	border-top: 2px solid rgb(255, 255, 255);  	border-right: 2px solid rgb(255, 255, 255);  	border-left: 2px solid rgb(255, 255, 255);  	border-top-left-radius: 10px;  	border-top-right-radius: 10px;  	border-bottom: none;  	cursor: pointer;  	max-width: 250px;  	display: block;  	opacity: 1; }  .closeBox{ 	padding: 5px 10px;     height: auto;     position: absolute;     bottom: 506px;     right: 1px;     display:none;     z-index: 9995;     background-color: black;     color: #00579b;     direction: ltr;     font-weight: bold;     font-family: Arial, Helvetica, sans-serif;     font-size: 12px;     line-height: 140%;     cursor: pointer;     max-width: 250px;     display: block;     opacity: 1;     background-color: #c1c1c1; }  .closeBox a{     font-size: 14px;	 }  #lo_mail_icon{ 	width:20px;  	height:25px;   	padding-top:2px;  	border:none;  	margin-top: -8px;  	margin-left: 5px; } ";
          //   var style = document.createElement("style");
          //   style.type = "text/css";
          //   if (style.styleSheet) {
          //     style.styleSheet.cssText = css;
          //   } else {
          //     style.appendChild(document.createTextNode(css));
          //   }
          //   var head = document.head || document.querySelector("head");
          //   head.appendChild(style);
          // }

          // function injectJs() {
          //   // console.log(
          //   //   "going to inject js",
          //   //   intelliconBASEURL + "assets/js/jquery.js"
          //   // );

          //   var jsappUrl = intelliconBASEURL + "assets/js/jquery.js";
          //   var appjs = document.createElement("script");
          //   appjs.async = false;
          //   appjs.src = jsappUrl;
          //   var head = document.head || document.querySelector("head");
          //   document.body.appendChild(appjs);

          //   var appUrl = intelliconBASEURL + "assets/widget/inject.js";
          //   var app = document.createElement("script");
          //   app.async = false;
          //   app.src = appUrl;
          //   var head = document.head || document.querySelector("head");
          //   document.body.appendChild(app);
          // }
        })()
        }

      </script>



    </div>

  );
}
export default ContegrisCallWidget;