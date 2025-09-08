(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorValues(e) { if (null != e) { var t = e["function" == typeof Symbol && Symbol.iterator || "@@iterator"], r = 0; if (t) return t.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) return { next: function next() { return e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e }; } }; } throw new TypeError(_typeof(e) + " is not iterable"); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
// Import Web3 - using v1.x for better compatibility
var Web3 = window.Web3;

// Contract ABI and networks will be loaded dynamically
var VotingSysJSON = null;
var App = {
  web3: null,
  account: null,
  contract: null,
  selectedCandidate: null,
  networkConfig: {
    ganache: {
      chainId: 1337,
      rpcUrl: 'http://127.0.0.1:7545',
      networkName: 'Ganache Local'
    }
  },
  // Helper function to manage page states
  showPage: function showPage(pageToShow) {
    var pages = ['signIn', 'page', 'noWallet', 'accessDenied'];
    pages.forEach(function (pageId) {
      var element = document.getElementById(pageId);
      if (element) {
        element.style.display = pageId === pageToShow ? 'block' : 'none';
      }
    });
  },
  // Load contract JSON
  loadContractJSON: function () {
    var _loadContractJSON = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
      var response, _t;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.p = _context.n) {
          case 0:
            _context.p = 0;
            _context.n = 1;
            return fetch('/build/contracts/VotingSys.json');
          case 1:
            response = _context.v;
            if (response.ok) {
              _context.n = 2;
              break;
            }
            throw new Error('Contract JSON not found. Please compile and deploy the contracts first.');
          case 2:
            _context.n = 3;
            return response.json();
          case 3:
            VotingSysJSON = _context.v;
            console.log('Contract JSON loaded:', VotingSysJSON);
            _context.n = 5;
            break;
          case 4:
            _context.p = 4;
            _t = _context.v;
            console.error('Error loading contract JSON:', _t);
            throw new Error('Failed to load contract. Please ensure contracts are compiled and deployed.');
          case 5:
            return _context.a(2);
        }
      }, _callee, null, [[0, 4]]);
    }));
    function loadContractJSON() {
      return _loadContractJSON.apply(this, arguments);
    }
    return loadContractJSON;
  }(),
  // Create and inject sign-in HTML
  createSignInHTML: function createSignInHTML() {
    // Check if sign-in element already exists
    var signInElement = document.getElementById('signIn');
    if (!signInElement) {
      // Create the sign-in aside element
      signInElement = document.createElement('aside');
      signInElement.id = 'signIn';
      signInElement.innerHTML = "\n        <h1>Welcome!</h1>\n        <button id=\"signInBtn\">Sign In with MetaMask</button>\n        <div id=\"networkHelp\" style=\"display: none; margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;\">\n            <h3>Network Setup Required</h3>\n            <p>Please add the Ganache network to MetaMask:</p>\n            <ul style=\"text-align: left; margin: 10px 0;\">\n                <li><strong>Network Name:</strong> Ganache Local</li>\n                <li><strong>RPC URL:</strong> http://127.0.0.1:7545</li>\n                <li><strong>Chain ID:</strong> 1337</li>\n                <li><strong>Currency:</strong> ETH</li>\n            </ul>\n            <button id=\"retryConnection\">Retry Connection</button>\n        </div>\n      ";

      // Insert at the beginning of the body or after a specific element
      var targetElement = document.getElementById("page");
      if (targetElement) {
        targetElement.parentNode.insertBefore(signInElement, targetElement.nextSibling);
      }
    }

    // Ensure it's initially hidden
    signInElement.style.display = 'none';
  },
  init: function () {
    var _init = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
      var accounts, signInBtn, _t2;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.p = _context2.n) {
          case 0:
            if (!window.ethereum) {
              _context2.n = 8;
              break;
            }
            // Don't automatically request accounts - just initialize Web3
            App.web3 = new Web3(window.ethereum);

            // Create and inject sign-in HTML
            App.createSignInHTML();

            // Check if user is already connected
            _context2.p = 1;
            _context2.n = 2;
            return window.ethereum.request({
              method: "eth_accounts"
            });
          case 2:
            accounts = _context2.v;
            if (!(accounts && accounts.length > 0)) {
              _context2.n = 4;
              break;
            }
            // User is already connected, proceed with connection setup
            console.log("User already connected:", accounts[0]);
            _context2.n = 3;
            return App.setupConnection(accounts[0]);
          case 3:
            _context2.n = 5;
            break;
          case 4:
            // No connected accounts, show sign-in
            App.showPage('signIn');
          case 5:
            _context2.n = 7;
            break;
          case 6:
            _context2.p = 6;
            _t2 = _context2.v;
            console.log("Error checking existing connection:", _t2);
            // If there's an error checking, show sign-in
            App.showPage('signIn');
          case 7:
            // Set up the sign-in button event listener
            signInBtn = document.getElementById("signInBtn");
            if (signInBtn) {
              signInBtn.addEventListener("click", App.connectWallet);
            }

            // Handle network changes
            window.ethereum.on('chainChanged', function () {
              Alert.show("info", "wifi", "Network Changed!", "You switched networks. Reloading page to reconnect BLOCKELECT Voting System contract...");
              setTimeout(function () {
                return window.location.reload();
              }, 2000);
            });

            // Handle account changes
            window.ethereum.on('accountsChanged', function (accounts) {
              if (accounts.length === 0) {
                // User disconnected - reset to sign-in state
                App.account = null;
                App.contract = null;
                App.selectedCandidate = null;
                Alert.show("warning", "box-arrow-right", "Citizen Signed Out!", "You signed out of BLOCKELECT. Reconnect to MetaMask wallet to sign in again.");

                // Show sign-in page
                App.createSignInHTML(); // Ensure sign-in HTML exists
                App.showPage('signIn');

                // Reset sign-in button state
                var _signInBtn = document.getElementById("signInBtn");
                if (_signInBtn) {
                  _signInBtn.disabled = false;
                  _signInBtn.textContent = "Sign In with MetaMask";
                }
              } else if (accounts[0] !== App.account) {
                // Account changed - reload to reconnect with new account
                Alert.show("info", "arrow-repeat", "Account Changed!", "You're now interacting with the blockchain as: ".concat(accounts[0], ". Reloading to reconnect..."));
                setTimeout(function () {
                  return window.location.reload();
                }, 2000);
              }
            });
            _context2.n = 9;
            break;
          case 8:
            App.showPage('noWallet');
          case 9:
            return _context2.a(2);
        }
      }, _callee2, null, [[1, 6]]);
    }));
    function init() {
      return _init.apply(this, arguments);
    }
    return init;
  }(),
  connectWallet: function () {
    var _connectWallet = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
      var signInBtn, accounts, _signInBtn2, _t3;
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.p = _context3.n) {
          case 0:
            _context3.p = 0;
            // Show loading state
            signInBtn = document.getElementById("signInBtn");
            if (signInBtn) {
              signInBtn.disabled = true;
              signInBtn.textContent = "Connecting...";
            }

            // Request accounts from MetaMask
            _context3.n = 1;
            return window.ethereum.request({
              method: "eth_requestAccounts"
            });
          case 1:
            accounts = _context3.v;
            if (!(accounts.length === 0)) {
              _context3.n = 2;
              break;
            }
            throw new Error("No accounts found. Please connect MetaMask.");
          case 2:
            _context3.n = 3;
            return App.setupConnection(accounts[0]);
          case 3:
            _context3.n = 5;
            break;
          case 4:
            _context3.p = 4;
            _t3 = _context3.v;
            // Reset application state on error
            App.account = null;
            App.contract = null;
            App.selectedCandidate = null;

            // Reset sign-in button
            _signInBtn2 = document.getElementById("signInBtn");
            if (_signInBtn2) {
              _signInBtn2.disabled = false;
              _signInBtn2.textContent = "Sign In with MetaMask";
            }

            // Show sign-in page again
            App.createSignInHTML(); // Ensure sign-in HTML exists
            App.showPage('signIn');
            Alert.show("error", "arrows-angle-contract", "Sign In Error!", "Failed to authenticate to MetaMask. ".concat(_t3.message));
          case 5:
            return _context3.a(2);
        }
      }, _callee3, null, [[0, 4]]);
    }));
    function connectWallet() {
      return _connectWallet.apply(this, arguments);
    }
    return connectWallet;
  }(),
  // Separate function to handle the connection setup logic
  setupConnection: function () {
    var _setupConnection = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(account) {
      var acctAddressElement, networkId, chainId, networkHelp, retryBtn, deployedNetwork, isOfficial, acctTypeElement, _acctTypeElement;
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.n) {
          case 0:
            App.account = account;

            // Update account display
            acctAddressElement = document.getElementById("acctAddress");
            if (acctAddressElement) {
              acctAddressElement.innerText = App.account;
            }

            // Load contract JSON if not already loaded
            if (VotingSysJSON) {
              _context4.n = 1;
              break;
            }
            _context4.n = 1;
            return App.loadContractJSON();
          case 1:
            _context4.n = 2;
            return App.web3.eth.net.getId();
          case 2:
            networkId = _context4.v;
            _context4.n = 3;
            return App.web3.eth.getChainId();
          case 3:
            chainId = _context4.v;
            console.log("NetworkId:", networkId);
            console.log("chainId:", chainId);
            console.log("VotingSysJSON networks:", VotingSysJSON ? VotingSysJSON.networks : null);

            // Check if we're on the correct network
            if (!(Number(chainId) !== 1337)) {
              _context4.n = 4;
              break;
            }
            // Show network help
            networkHelp = document.getElementById("networkHelp");
            if (networkHelp) {
              networkHelp.style.display = "block";
            }

            // Setup retry button
            retryBtn = document.getElementById("retryConnection");
            if (retryBtn) {
              retryBtn.onclick = function () {
                window.location.reload();
              };
            }
            throw new Error("Wrong network detected. Please switch to Ganache (Chain ID 1337).");
          case 4:
            deployedNetwork = VotingSysJSON.networks[networkId];
            if (deployedNetwork) {
              _context4.n = 5;
              break;
            }
            throw new Error("Contract not deployed on this network (ID: ".concat(networkId, "). Please deploy the contract first."));
          case 5:
            App.contract = new App.web3.eth.Contract(VotingSysJSON.abi, deployedNetwork.address);
            console.log("Contract initialized:", App.contract.options.address);
            console.log("Contract methods available:", Object.keys(App.contract.methods));

            // Check role first before showing any page
            _context4.n = 6;
            return App.contract.methods.officials(App.account).call();
          case 6:
            isOfficial = _context4.v;
            if (!isOfficial) {
              _context4.n = 9;
              break;
            }
            acctTypeElement = document.getElementById("acctType");
            if (acctTypeElement) {
              acctTypeElement.innerText = 'Official';
            }
            if (window.location.href.includes("official.html")) {
              _context4.n = 7;
              break;
            }
            // Official trying to access voter page - redirect
            App.showPage('accessDenied');
            setTimeout(function () {
              window.location.href = "/official.html";
            }, 5000);
            return _context4.a(2);
          case 7:
            // Official on correct page
            App.showPage('page');
            App.setupOfficialEventListeners();
            _context4.n = 8;
            return App.loadOfficialData();
          case 8:
            _context4.n = 12;
            break;
          case 9:
            _acctTypeElement = document.getElementById("acctType");
            if (_acctTypeElement) {
              _acctTypeElement.innerText = 'Voter';
            }
            if (!window.location.href.includes("official.html")) {
              _context4.n = 10;
              break;
            }
            // Voter trying to access official page - redirect
            App.showPage('accessDenied');
            setTimeout(function () {
              window.location.href = "/";
            }, 5000);
            return _context4.a(2);
          case 10:
            // Voter on correct page
            App.showPage('page');
            _context4.n = 11;
            return App.loadCandidates();
          case 11:
            _context4.n = 12;
            return App.loadElectionDates();
          case 12:
            Alert.show("success", "check-circle-fill", "Welcome!", "You signed in successfully!");
          case 13:
            return _context4.a(2);
        }
      }, _callee4);
    }));
    function setupConnection(_x) {
      return _setupConnection.apply(this, arguments);
    }
    return setupConnection;
  }(),
  // Load data for official dashboard
  loadOfficialData: function () {
    var _loadOfficialData = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
      var result, names, parties, votes, statsContainer, totalVotes, candidatesContainer, candidatesHTML, i, _t4;
      return _regenerator().w(function (_context5) {
        while (1) switch (_context5.p = _context5.n) {
          case 0:
            if (App.contract) {
              _context5.n = 1;
              break;
            }
            return _context5.a(2);
          case 1:
            _context5.p = 1;
            _context5.n = 2;
            return App.contract.methods.getCandidates().call();
          case 2:
            result = _context5.v;
            if (result.names && result.parties && result.votes) {
              names = result.names;
              parties = result.parties;
              votes = result.votes;
            } else if (result[0] && result[1] && result[2]) {
              names = result[0];
              parties = result[1];
              votes = result[2];
            } else {
              names = [];
              parties = [];
              votes = [];
            }

            // Display current election statistics
            statsContainer = document.getElementById("electionStats");
            if (statsContainer) {
              totalVotes = votes.reduce(function (sum, vote) {
                return sum + Number(vote);
              }, 0);
              statsContainer.innerHTML = "<p class=\"info\"><b>Election Status |</b> ".concat(names.length, " candidates declared, ").concat(totalVotes, " votes casted</p>");
            }

            // Display current candidates
            candidatesContainer = document.getElementById("currentCandidates");
            if (candidatesContainer) {
              if (names.length === 0) {
                candidatesContainer.innerHTML = "<p>No candidates registered yet!</p>";
              } else {
                candidatesHTML = "<ul style='margin-bottom: 56px'>";
                for (i = 0; i < names.length; i++) {
                  candidatesHTML += "\n              <li>\n                ".concat(names[i], " (").concat(parties[i], ", ").concat(votes[i], " votes)\n                <button class=\"btn-sm\" onclick=\"App.removeCandidate(").concat(i, ")\"><i class=\"bi bi-trash3-fill\"></i></button>\n              </li>\n            ");
                }
                candidatesHTML += "</ul>";
                candidatesContainer.innerHTML = candidatesHTML;
              }
            }
            _context5.n = 4;
            break;
          case 3:
            _context5.p = 3;
            _t4 = _context5.v;
            console.error("Error loading official data:", _t4);
          case 4:
            return _context5.a(2);
        }
      }, _callee5, null, [[1, 3]]);
    }));
    function loadOfficialData() {
      return _loadOfficialData.apply(this, arguments);
    }
    return loadOfficialData;
  }(),
  // Setup event listeners for official page
  setupOfficialEventListeners: function setupOfficialEventListeners() {
    // Candidate registration
    var addCandidateBtn = document.getElementById("addCandidate");
    if (addCandidateBtn) {
      addCandidateBtn.addEventListener("click", /*#__PURE__*/function () {
        var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(e) {
          var name, party;
          return _regenerator().w(function (_context6) {
            while (1) switch (_context6.n) {
              case 0:
                e.preventDefault();
                name = document.getElementById("name").value.trim();
                party = document.getElementById("party").value.trim();
                if (!(!name || !party)) {
                  _context6.n = 1;
                  break;
                }
                Alert.show("warning", "question-circle-fill", "Missing Information", "Please enter both candidate name and party.");
                return _context6.a(2);
              case 1:
                _context6.n = 2;
                return App.registerCandidate(name, party);
              case 2:
                // Clear form and reload official data
                document.getElementById("name").value = "";
                document.getElementById("party").value = "";
                _context6.n = 3;
                return App.loadOfficialData();
              case 3:
                return _context6.a(2);
            }
          }, _callee6);
        }));
        return function (_x2) {
          return _ref.apply(this, arguments);
        };
      }());
    }

    // Election date setting
    var addDateBtn = document.getElementById("addDate");
    if (addDateBtn) {
      addDateBtn.addEventListener("click", /*#__PURE__*/function () {
        var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(e) {
          var startDate, endDate, start, end, today;
          return _regenerator().w(function (_context7) {
            while (1) switch (_context7.n) {
              case 0:
                e.preventDefault();
                startDate = document.getElementById("startDate").value;
                endDate = document.getElementById("endDate").value;
                if (!(!startDate || !endDate)) {
                  _context7.n = 1;
                  break;
                }
                Alert.show("warning", "calendar-minus-fill", "Missing Dates!", "Please select both start and end dates.");
                return _context7.a(2);
              case 1:
                start = new Date(startDate);
                end = new Date(endDate);
                if (!(start >= end)) {
                  _context7.n = 2;
                  break;
                }
                Alert.show("warning", "slash-circle-fill", "Invalid Dates!", "Start date must be before end date.");
                return _context7.a(2);
              case 2:
                // Allow today's date - only reject dates that are clearly in the past
                today = new Date();
                today.setHours(0, 0, 0, 0); // Set to start of day for comparison
                if (!(start < today)) {
                  _context7.n = 3;
                  break;
                }
                Alert.show("warning", "hourglass-bottom", "Past Date!", "Start date cannot be in the past. You can select today's date or future dates.");
                return _context7.a(2);
              case 3:
                _context7.n = 4;
                return App.setElectionDates(startDate, endDate);
              case 4:
                // Clear form after successful setting
                document.getElementById("startDate").value = "";
                document.getElementById("endDate").value = "";
              case 5:
                return _context7.a(2);
            }
          }, _callee7);
        }));
        return function (_x3) {
          return _ref2.apply(this, arguments);
        };
      }());
    }

    // Reset Election button - now calls resetElection directly
    var resetElectionBtn = document.getElementById("resetElection");
    if (resetElectionBtn) {
      resetElectionBtn.addEventListener("click", /*#__PURE__*/function () {
        var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(e) {
          return _regenerator().w(function (_context8) {
            while (1) switch (_context8.n) {
              case 0:
                e.preventDefault();
                _context8.n = 1;
                return App.resetElection();
              case 1:
                return _context8.a(2);
            }
          }, _callee8);
        }));
        return function (_x4) {
          return _ref3.apply(this, arguments);
        };
      }());
    }
  },
  // Check if connected wallet is official or voter (legacy function - now integrated into connectWallet)
  checkRole: function () {
    var _checkRole = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9() {
      var isOfficial, _t5;
      return _regenerator().w(function (_context9) {
        while (1) switch (_context9.p = _context9.n) {
          case 0:
            if (!(!App.contract || !App.account)) {
              _context9.n = 1;
              break;
            }
            return _context9.a(2);
          case 1:
            _context9.p = 1;
            _context9.n = 2;
            return App.contract.methods.officials(App.account).call();
          case 2:
            isOfficial = _context9.v;
            if (isOfficial) {
              document.getElementById("acctType").innerText = 'Official';
              if (!window.location.href.includes("official.html")) {
                App.showPage('accessDenied');
                setTimeout(function () {
                  window.location.href = "/official.html";
                }, 5000);
              }
            } else {
              document.getElementById("acctType").innerText = 'Voter';
              // If they're on the official page but not an official, redirect to voting page
              if (window.location.href.includes("official.html")) {
                App.showPage('accessDenied');
                setTimeout(function () {
                  window.location.href = "/";
                }, 5000);
              }
            }
            _context9.n = 4;
            break;
          case 3:
            _context9.p = 3;
            _t5 = _context9.v;
            Alert.show("error", "exclamation-triangle-fill", "Role Check Error!", _t5.message);
          case 4:
            return _context9.a(2);
        }
      }, _callee9, null, [[1, 3]]);
    }));
    function checkRole() {
      return _checkRole.apply(this, arguments);
    }
    return checkRole;
  }(),
  // Load election dates for display
  loadElectionDates: function () {
    var _loadElectionDates = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0() {
      var startDate, endDate, datesElement, startDateObj, endDateObj, formatDate, formattedDates, _datesElement, _t6;
      return _regenerator().w(function (_context0) {
        while (1) switch (_context0.p = _context0.n) {
          case 0:
            console.log("Loading election dates...");
            if (App.contract) {
              _context0.n = 1;
              break;
            }
            console.error("Contract not initialized for loading dates");
            return _context0.a(2);
          case 1:
            _context0.p = 1;
            console.log("Calling startDate and endDate from contract...");
            _context0.n = 2;
            return App.contract.methods.startDate().call();
          case 2:
            startDate = _context0.v;
            _context0.n = 3;
            return App.contract.methods.endDate().call();
          case 3:
            endDate = _context0.v;
            console.log("Raw dates from contract:", {
              startDate: startDate,
              endDate: endDate
            });
            datesElement = document.getElementById("dates");
            if (datesElement) {
              _context0.n = 4;
              break;
            }
            console.log("Dates element not found, probably not on voting page");
            return _context0.a(2);
          case 4:
            // Check if dates are set (not 0)
            if (startDate && endDate && startDate != '0' && endDate != '0') {
              startDateObj = new Date(parseInt(startDate) * 1000);
              endDateObj = new Date(parseInt(endDate) * 1000);
              console.log("Parsed dates:", {
                startDateObj: startDateObj,
                endDateObj: endDateObj
              });
              formatDate = function formatDate(date) {
                var day = String(date.getDate()).padStart(2, '0');
                var month = String(date.getMonth() + 1).padStart(2, '0');
                var year = date.getFullYear();
                return "".concat(day, "/").concat(month, "/").concat(year);
              };
              formattedDates = "".concat(formatDate(startDateObj), " - ").concat(formatDate(endDateObj));
              datesElement.textContent = formattedDates;
              console.log("Election dates set to:", formattedDates);
            } else {
              datesElement.textContent = "Not set yet!";
              console.log("Not set yet!");
            }
            _context0.n = 6;
            break;
          case 5:
            _context0.p = 5;
            _t6 = _context0.v;
            console.error("Error loading election dates:", _t6);
            _datesElement = document.getElementById("dates");
            if (_datesElement) {
              _datesElement.textContent = "Unable to load election dates";
            }
          case 6:
            return _context0.a(2);
        }
      }, _callee0, null, [[1, 5]]);
    }));
    function loadElectionDates() {
      return _loadElectionDates.apply(this, arguments);
    }
    return loadElectionDates;
  }(),
  // Load candidates for voters
  loadCandidates: function () {
    var _loadCandidates = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1() {
      var box, result, names, parties, votes, _result, row, voteSection, _cantVoteSection, voteButton, cantVoteSection, _loop, i, _box, _voteSection, _cantVoteSection2, _voteButton, _t7;
      return _regenerator().w(function (_context10) {
        while (1) switch (_context10.p = _context10.n) {
          case 0:
            console.log("Loading candidates...");
            if (App.contract) {
              _context10.n = 1;
              break;
            }
            console.error("Contract not initialized");
            return _context10.a(2);
          case 1:
            box = document.getElementById("boxCandidate");
            if (box) {
              _context10.n = 2;
              break;
            }
            console.log("Not on voting page, skipping candidate load");
            return _context10.a(2);
          case 2:
            _context10.p = 2;
            console.log("Calling getCandidates() from contract...");
            _context10.n = 3;
            return App.contract.methods.getCandidates().call();
          case 3:
            result = _context10.v;
            console.log("Contract call result:", result);

            // Handle the result properly - it might be an object with named properties
            if (!(result.names && result.parties && result.votes)) {
              _context10.n = 4;
              break;
            }
            // If result has named properties
            names = result.names;
            parties = result.parties;
            votes = result.votes;
            _context10.n = 7;
            break;
          case 4:
            if (!(Array.isArray(result) && result.length >= 3)) {
              _context10.n = 5;
              break;
            }
            // If result is an array
            _result = _slicedToArray(result, 3);
            names = _result[0];
            parties = _result[1];
            votes = _result[2];
            _context10.n = 7;
            break;
          case 5:
            if (!(result[0] && result[1] && result[2])) {
              _context10.n = 6;
              break;
            }
            // If result is object with numeric indices
            names = result[0];
            parties = result[1];
            votes = result[2];
            _context10.n = 7;
            break;
          case 6:
            throw new Error("Unexpected result format from getCandidates()");
          case 7:
            console.log("Parsed candidates:", {
              names: names,
              parties: parties,
              votes: votes
            });
            box.innerHTML = "";
            if (!(!names || names.length === 0)) {
              _context10.n = 8;
              break;
            }
            console.log("No candidates found");
            row = document.createElement("tr");
            row.innerHTML = "<td colspan=\"3\" style=\"text-align: center;\">No candidates registered yet</td>";
            box.appendChild(row);

            // Hide vote section if no candidates
            voteSection = document.getElementById("vote");
            _cantVoteSection = document.getElementById("cantVote");
            voteButton = document.getElementById("voteButton");
            if (voteSection) voteSection.style.display = "none";
            if (_cantVoteSection) _cantVoteSection.style.display = "block";
            if (voteButton) voteButton.disabled = true;
            return _context10.a(2);
          case 8:
            console.log("Found ".concat(names.length, " candidates"));

            // Show vote section if candidates exist
            cantVoteSection = document.getElementById("cantVote");
            if (cantVoteSection) cantVoteSection.style.display = "none";
            _loop = /*#__PURE__*/_regenerator().m(function _loop(i) {
              var row;
              return _regenerator().w(function (_context1) {
                while (1) switch (_context1.n) {
                  case 0:
                    console.log("Adding candidate ".concat(i, ": ").concat(names[i], " (").concat(parties[i], ") - ").concat(votes[i], " votes"));
                    row = document.createElement("tr");
                    row.innerHTML = "\n          <td>".concat(names[i], "</td>\n          <td>").concat(parties[i], "</td>\n          <td>").concat(votes[i], "</td>\n        ");
                    row.onclick = function () {
                      App.selectCandidate(i, names[i], parties[i]);
                    };
                    row.style.cursor = "pointer";
                    row.classList.add("candidate-row");
                    box.appendChild(row);
                  case 1:
                    return _context1.a(2);
                }
              }, _loop);
            });
            i = 0;
          case 9:
            if (!(i < names.length)) {
              _context10.n = 11;
              break;
            }
            return _context10.d(_regeneratorValues(_loop(i)), 10);
          case 10:
            i++;
            _context10.n = 9;
            break;
          case 11:
            console.log("Candidates loaded successfully");
            _context10.n = 13;
            break;
          case 12:
            _context10.p = 12;
            _t7 = _context10.v;
            console.error("Error loading candidates:", _t7);
            console.error("Error details:", _t7.message);
            console.error("Error stack:", _t7.stack);

            // Show error message to user
            _box = document.getElementById("boxCandidate");
            if (_box) {
              _box.innerHTML = "<tr><td colspan=\"3\" style=\"text-align: center; color: red;\">Error loading candidates: ".concat(_t7.message, "</td></tr>");
            }
            _voteSection = document.getElementById("vote");
            _cantVoteSection2 = document.getElementById("cantVote");
            _voteButton = document.getElementById("voteButton");
            if (_voteSection) _voteSection.style.display = "none";
            if (_cantVoteSection2) _cantVoteSection2.style.display = "block";
            if (_voteButton) _voteButton.disabled = true;

            // Also show an alert to the user
            Alert.show("error", "exclamation-triangle-fill", "Error Loading Candidates", "Failed to load candidates: ".concat(_t7.message));
          case 13:
            return _context10.a(2);
        }
      }, _callee1, null, [[2, 12]]);
    }));
    function loadCandidates() {
      return _loadCandidates.apply(this, arguments);
    }
    return loadCandidates;
  }(),
  selectCandidate: function selectCandidate(index, name, party) {
    console.log("[CANDIDATE] Selecting candidate ".concat(index, ": ").concat(name, " (").concat(party, ")"));
    App.selectedCandidate = index;

    // Remove previous selections
    var rows = document.querySelectorAll("#boxCandidate tr");
    rows.forEach(function (row, i) {
      row.classList.remove("selected");
      if (i === index) {
        console.log("[CANDIDATE] Highlighting row ".concat(i));
      }
    });

    // Highlight selected row
    if (rows[index]) {
      rows[index].classList.add("selected");
      console.log("[CANDIDATE] Selected row class added");
    }

    // Show vote section and enable button
    var voteSection = document.getElementById("vote");
    var cantVoteSection = document.getElementById("cantVote");
    var voteButton = document.getElementById("voteButton");
    if (voteSection) {
      voteSection.style.display = "block";
      console.log("[CANDIDATE] Vote section displayed");
    }
    if (cantVoteSection) {
      cantVoteSection.style.display = "none";
    }
    if (voteButton) {
      voteButton.disabled = false;
      console.log("[CANDIDATE] Vote button enabled");
    }
    Alert.show("info", "hand-index-fill", "Candidate Selected!", "You selected ".concat(name, " of the ").concat(party, " political party. Click 'Cast Vote' to submit your vote."));
    console.log("[CANDIDATE] Selection complete. selectedCandidate = ".concat(App.selectedCandidate));
  },
  vote: function () {
    var _vote = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10() {
      var hasVoted, startDate, endDate, currentTime, timingInfo, startDateObj, endDateObj, result, names, voteButton, receipt, voteSection, errorMessage, errorTitle, _voteButton2, _t8, _t9;
      return _regenerator().w(function (_context11) {
        while (1) switch (_context11.p = _context11.n) {
          case 0:
            console.log("[VOTE] Starting vote process...");
            console.log("[VOTE] Contract:", App.contract ? "✅ Available" : "❌ Missing");
            console.log("[VOTE] Account:", App.account || "❌ Missing");
            console.log("[VOTE] Selected Candidate:", App.selectedCandidate);
            if (!(!App.contract || !App.account)) {
              _context11.n = 1;
              break;
            }
            console.error("[VOTE] Contract or account missing");
            Alert.show("warning", "box-arrow-right", "Citizen Signed Out!", "You signed out of BLOCKELECT. Reconnect to MetaMask wallet to sign in again.");
            return _context11.a(2);
          case 1:
            if (!(App.selectedCandidate === null || App.selectedCandidate === undefined)) {
              _context11.n = 2;
              break;
            }
            console.error("[VOTE] No candidate selected");
            Alert.show("warning", "person-fill-x", "No Candidate Selected!", "Please select a candidate before voting.");
            return _context11.a(2);
          case 2:
            _context11.p = 2;
            console.log("[VOTE] Performing comprehensive pre-flight checks...");

            // Check if already voted
            console.log("[VOTE] Checking if user has already voted...");
            _context11.n = 3;
            return App.contract.methods.hasVoted(App.account).call();
          case 3:
            hasVoted = _context11.v;
            console.log("[VOTE] Has already voted: ".concat(hasVoted));
            if (!hasVoted) {
              _context11.n = 4;
              break;
            }
            console.error("[VOTE] User has already voted - aborting");
            Alert.show("warning", "check-circle-fill", "Already Voted!", "You have already cast your vote in this election.");
            return _context11.a(2);
          case 4:
            // Check election dates
            console.log("[VOTE] Checking election timing...");
            _context11.n = 5;
            return App.contract.methods.startDate().call();
          case 5:
            startDate = _context11.v;
            _context11.n = 6;
            return App.contract.methods.endDate().call();
          case 6:
            endDate = _context11.v;
            currentTime = Math.floor(Date.now() / 1000);
            timingInfo = {
              startDate: Number(startDate),
              endDate: Number(endDate),
              currentTime: currentTime,
              startDateReadable: new Date(Number(startDate) * 1000).toString(),
              endDateReadable: new Date(Number(endDate) * 1000).toString(),
              electionStarted: currentTime >= Number(startDate),
              electionEnded: currentTime > Number(endDate),
              datesSet: Number(startDate) > 0 && Number(endDate) > 0
            };
            console.log("[VOTE] Election timing:", timingInfo);
            if (timingInfo.datesSet) {
              _context11.n = 7;
              break;
            }
            console.error("[VOTE] Election dates not set - aborting");
            Alert.show("warning", "calendar-x", "Election Not Configured!", "The election dates have not been set yet. Please contact an official to configure the election.");
            return _context11.a(2);
          case 7:
            if (!(currentTime < Number(startDate))) {
              _context11.n = 8;
              break;
            }
            console.error("[VOTE] Election not started yet - aborting");
            startDateObj = new Date(Number(startDate) * 1000);
            Alert.show("warning", "calendar-x", "Election Not Started!", "The election has not started yet. It begins on ".concat(startDateObj.toLocaleDateString(), " at ").concat(startDateObj.toLocaleTimeString(), "."));
            return _context11.a(2);
          case 8:
            if (!(currentTime > Number(endDate))) {
              _context11.n = 9;
              break;
            }
            console.error("[VOTE] Election has ended - aborting");
            endDateObj = new Date(Number(endDate) * 1000);
            Alert.show("warning", "calendar-x-fill", "Election Ended!", "The election has ended. It ended on ".concat(endDateObj.toLocaleDateString(), " at ").concat(endDateObj.toLocaleTimeString(), "."));
            return _context11.a(2);
          case 9:
            _context11.n = 10;
            return App.contract.methods.getCandidates().call();
          case 10:
            result = _context11.v;
            if (!result.names) {
              _context11.n = 11;
              break;
            }
            names = result.names;
            _context11.n = 13;
            break;
          case 11:
            if (!result[0]) {
              _context11.n = 12;
              break;
            }
            names = result[0];
            _context11.n = 13;
            break;
          case 12:
            throw new Error("Unable to get candidates list");
          case 13:
            if (!(App.selectedCandidate >= names.length)) {
              _context11.n = 14;
              break;
            }
            Alert.show("warning", "person-fill-x", "Invalid Candidate!", "Selected candidate is invalid. Please refresh and try again.");
            return _context11.a(2);
          case 14:
            console.log("[VOTE] All pre-flight checks passed. Proceeding with vote...");
            _context11.n = 16;
            break;
          case 15:
            _context11.p = 15;
            _t8 = _context11.v;
            console.error("[VOTE] Pre-flight check error:", _t8);
            Alert.show("error", "exclamation-triangle-fill", "Pre-flight Check Failed!", "Error checking voting eligibility: ".concat(_t8.message));
            return _context11.a(2);
          case 16:
            // Disable vote button to prevent double voting
            voteButton = document.getElementById("voteButton");
            if (voteButton) {
              voteButton.disabled = true;
              voteButton.textContent = "Voting...";
            }
            Alert.show("info", "clock-history", "Voting...", "Submitting your vote to the blockchain. Please confirm the transaction in MetaMask.");
            _context11.p = 17;
            console.log("[VOTE] Initiating vote transaction for candidate index: ".concat(App.selectedCandidate));

            // Send the transaction
            _context11.n = 18;
            return App.contract.methods.vote(App.selectedCandidate).send({
              from: App.account
              // Let MetaMask/Web3 handle gas estimation automatically
            });
          case 18:
            receipt = _context11.v;
            console.log("[VOTE] Vote transaction successful! Receipt:", receipt);
            console.log("[VOTE] Transaction hash: ".concat(receipt.transactionHash));
            console.log("[VOTE] Gas used: ".concat(receipt.gasUsed));
            Alert.show("success", "check-circle-fill", "Vote Cast Successfully!", "Your vote has been recorded on the blockchain. Transaction: ".concat(receipt.transactionHash.substring(0, 10), "..."));

            // Reload candidates to show updated vote counts
            console.log("[VOTE] Reloading candidates to show updated vote counts...");
            _context11.n = 19;
            return App.loadCandidates();
          case 19:
            // Reset selection after voting
            App.selectedCandidate = null;
            voteSection = document.getElementById("vote");
            if (voteSection) voteSection.style.display = "none";
            console.log("[VOTE] Vote process completed successfully!");
            _context11.n = 21;
            break;
          case 20:
            _context11.p = 20;
            _t9 = _context11.v;
            console.error("[VOTE] Voting transaction failed:", _t9);
            console.error("[VOTE] Error details:", _t9.message);
            console.error("[VOTE] Error data:", _t9.data);
            errorMessage = _t9.message;
            errorTitle = "Voting Error!"; // Try to decode common error reasons
            if (_t9.message.includes("revert")) {
              if (_t9.message.includes("Already voted")) {
                errorMessage = "You have already voted in this election.";
                errorTitle = "Already Voted!";
              } else if (_t9.message.includes("Election not active")) {
                errorMessage = "The election is not currently active. Please check the election dates.";
                errorTitle = "Election Inactive!";
              } else if (_t9.message.includes("Invalid candidate")) {
                errorMessage = "The selected candidate is invalid. Please refresh and try again.";
                errorTitle = "Invalid Candidate!";
              } else {
                errorMessage = "Transaction was reverted by the smart contract. Please check the election status.";
                errorTitle = "Transaction Reverted!";
              }
            } else if (_t9.message.includes("User denied")) {
              errorMessage = "You rejected the transaction in MetaMask. Your vote was not submitted.";
              errorTitle = "Transaction Rejected!";
            } else if (_t9.message.includes("insufficient funds")) {
              errorMessage = "Insufficient ETH to pay for gas fees. Please get more ETH from Ganache.";
              errorTitle = "Insufficient Funds!";
            }

            // Reset vote button
            _voteButton2 = document.getElementById("voteButton");
            if (_voteButton2) {
              _voteButton2.disabled = false;
              _voteButton2.textContent = "Cast Vote";
            }
            Alert.show("error", "exclamation-triangle-fill", errorTitle, errorMessage);
          case 21:
            return _context11.a(2);
        }
      }, _callee10, null, [[17, 20], [2, 15]]);
    }));
    function vote() {
      return _vote.apply(this, arguments);
    }
    return vote;
  }(),
  registerCandidate: function () {
    var _registerCandidate = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee11(name, party) {
      var _t0;
      return _regenerator().w(function (_context12) {
        while (1) switch (_context12.p = _context12.n) {
          case 0:
            if (!(!App.contract || !App.account)) {
              _context12.n = 1;
              break;
            }
            Alert.show("warning", "box-arrow-right", "Citizen Signed Out!", "You signed out of BLOCKELECT. Reconnect to MetaMask wallet to sign in again.");
            return _context12.a(2);
          case 1:
            Alert.show("info", "clock-history", "Registering Candidate", "".concat(name, " (").concat(party, ") is being registered..."));
            _context12.p = 2;
            _context12.n = 3;
            return App.contract.methods.registerCandidate(name, party).send({
              from: App.account
            });
          case 3:
            Alert.show("success", "check-circle-fill", "Candidate Registered!", "".concat(name, " (").concat(party, ") successfully registered."));
            _context12.n = 5;
            break;
          case 4:
            _context12.p = 4;
            _t0 = _context12.v;
            Alert.show("error", "exclamation-triangle-fill", "Registration Error!", _t0.message);
          case 5:
            return _context12.a(2);
        }
      }, _callee11, null, [[2, 4]]);
    }));
    function registerCandidate(_x5, _x6) {
      return _registerCandidate.apply(this, arguments);
    }
    return registerCandidate;
  }(),
  setElectionDates: function () {
    var _setElectionDates = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee12(start, end) {
      var startTS, endTS, _t1;
      return _regenerator().w(function (_context13) {
        while (1) switch (_context13.p = _context13.n) {
          case 0:
            if (!(!App.contract || !App.account)) {
              _context13.n = 1;
              break;
            }
            Alert.show("warning", "box-arrow-right", "Citizen Signed Out!", "You signed out of BLOCKELECT. Reconnect to MetaMask wallet to sign in again.");
            return _context13.a(2);
          case 1:
            startTS = Math.floor(new Date(start).getTime() / 1000);
            endTS = Math.floor(new Date(end).getTime() / 1000);
            Alert.show("info", "clock-history", "Setting Dates", "Election starts ".concat(start, " and ends ").concat(end, "..."));
            _context13.p = 2;
            _context13.n = 3;
            return App.contract.methods.setElectionDates(startTS, endTS).send({
              from: App.account
            });
          case 3:
            Alert.show("success", "calendar-check-fill", "Dates Set!", "Election dates set successfully.");
            _context13.n = 5;
            break;
          case 4:
            _context13.p = 4;
            _t1 = _context13.v;
            Alert.show("error", "calendar-x-fill", "Date Error!", _t1.message);
          case 5:
            return _context13.a(2);
        }
      }, _callee12, null, [[2, 4]]);
    }));
    function setElectionDates(_x7, _x8) {
      return _setElectionDates.apply(this, arguments);
    }
    return setElectionDates;
  }(),
  resetElection: function () {
    var _resetElection = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee13() {
      var _t10;
      return _regenerator().w(function (_context14) {
        while (1) switch (_context14.p = _context14.n) {
          case 0:
            if (!(!App.contract || !App.account)) {
              _context14.n = 1;
              break;
            }
            Alert.show("warning", "box-arrow-right", "Citizen Signed Out!", "Please reconnect your MetaMask wallet.");
            return _context14.a(2);
          case 1:
            if (confirm("Are you sure you want to cancel the entire election? This will clear all candidates, votes, and voting records.")) {
              _context14.n = 2;
              break;
            }
            return _context14.a(2);
          case 2:
            Alert.show("info", "clock-history", "Resetting Election", "Resetting election... Please wait.");
            _context14.p = 3;
            _context14.n = 4;
            return App.contract.methods.resetElection().send({
              from: App.account
            });
          case 4:
            Alert.show("success", "check-circle-fill", "Election Cancelled!", "The election has been cancelled successfully.");
            _context14.n = 5;
            return App.loadOfficialData();
          case 5:
            _context14.n = 7;
            break;
          case 6:
            _context14.p = 6;
            _t10 = _context14.v;
            Alert.show("error", "exclamation-triangle-fill", "Error Resetting Election", _t10.message);
          case 7:
            return _context14.a(2);
        }
      }, _callee13, null, [[3, 6]]);
    }));
    function resetElection() {
      return _resetElection.apply(this, arguments);
    }
    return resetElection;
  }(),
  removeCandidate: function () {
    var _removeCandidate = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee14(candidateIndex) {
      var _t11;
      return _regenerator().w(function (_context15) {
        while (1) switch (_context15.p = _context15.n) {
          case 0:
            if (!(!App.contract || !App.account)) {
              _context15.n = 1;
              break;
            }
            Alert.show("warning", "box-arrow-right", "Citizen Signed Out!", "Please reconnect your MetaMask wallet.");
            return _context15.a(2);
          case 1:
            if (confirm("Are you sure you want to remove this candidate? This action cannot be undone.")) {
              _context15.n = 2;
              break;
            }
            return _context15.a(2);
          case 2:
            Alert.show("info", "clock-history", "Removing Candidate", "Removing candidate... Please wait.");
            _context15.p = 3;
            _context15.n = 4;
            return App.contract.methods.removeCandidate(candidateIndex).send({
              from: App.account
            });
          case 4:
            Alert.show("success", "check-circle-fill", "Candidate Removed!", "Candidate removed successfully.");
            _context15.n = 5;
            return App.loadOfficialData();
          case 5:
            _context15.n = 7;
            break;
          case 6:
            _context15.p = 6;
            _t11 = _context15.v;
            Alert.show("error", "exclamation-triangle-fill", "Error Removing Candidate", _t11.message);
          case 7:
            return _context15.a(2);
        }
      }, _callee14, null, [[3, 6]]);
    }));
    function removeCandidate(_x9) {
      return _removeCandidate.apply(this, arguments);
    }
    return removeCandidate;
  }()
};
window.App = App;
App.init();

},{}]},{},[1]);
