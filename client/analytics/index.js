/**
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Taken from https://minimalanalytics.com/
var a = window,
  b = 'UA-164226855-1',
  c = {
    anonymizeIp: true,
    colorDepth: true,
    characterSet: true,
    screenSize: true,
    language: true,
  },
  d = a.history,
  e = document,
  f = navigator || {},
  g = localStorage,
  h = encodeURIComponent,
  i = d.pushState,
  k = function() {
    return Math.random().toString(36);
  },
  l = function() {
    return g.cid || (g.cid = k()), g.cid;
  },
  m = function(r) {
    var s = [];
    for (var t in r)
      r.hasOwnProperty(t) && void 0 !== r[t] && s.push(h(t) + '=' + h(r[t]));
    return s.join('&');
  },
  n = function(r, s, t, u, v, w, x) {
    var z = 'https://www.google-analytics.com/collect',
      A = m({
        v: '1',
        ds: 'web',
        aip: c.anonymizeIp ? 1 : void 0,
        tid: b,
        cid: l(),
        t: r || 'pageview',
        sd:
          c.colorDepth && screen.colorDepth
            ? screen.colorDepth + '-bits'
            : void 0,
        dr: e.referrer || void 0,
        dt: e.title,
        dl: e.location.origin + e.location.pathname + e.location.search,
        ul: c.language ? (f.language || '').toLowerCase() : void 0,
        de: c.characterSet ? e.characterSet : void 0,
        sr: c.screenSize
          ? (a.screen || {}).width + 'x' + (a.screen || {}).height
          : void 0,
        vp:
          c.screenSize && a.visualViewport
            ? (a.visualViewport || {}).width +
              'x' +
              (a.visualViewport || {}).height
            : void 0,
        ec: s || void 0,
        ea: t || void 0,
        el: u || void 0,
        ev: v || void 0,
        exd: w || void 0,
        exf: 'undefined' != typeof x && !1 == !!x ? 0 : void 0,
      });
    if (f.sendBeacon) f.sendBeacon(z, A);
    else {
      var y = new XMLHttpRequest();
      y.open('POST', z, !0), y.send(A);
    }
  };
(d.pushState = function(r) {
  return (
    'function' == typeof d.onpushstate && d.onpushstate({ state: r }),
    setTimeout(n, c.delay || 10),
    i.apply(d, arguments)
  );
}),
  n(),
  (a.ma = {
    trackEvent: function o(r, s, t, u) {
      return n('event', r, s, t, u);
    },
    trackException: function q(r, s) {
      return n('exception', null, null, null, null, r, s);
    },
  });
