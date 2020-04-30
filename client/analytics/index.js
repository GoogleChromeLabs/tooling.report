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

// Based on https://minimalanalytics.com/
const trackingId = 'UA-164226855-1';
const options = {
  anonymizeIp: true,
  colorDepth: true,
  characterSet: true,
  screenSize: true,
  language: true,
};
const getId = () => {
  if (!localStorage.cid) {
    localStorage.cid = Math.random().toString(36);
  }
  return localStorage.cid;
};
const track = (
  type,
  eventCategory,
  eventAction,
  eventLabel,
  eventValue,
  exceptionDescription,
  exceptionFatal,
) => {
  navigator.sendBeacon(
    'https://www.google-analytics.com/collect',
    new URLSearchParams({
      v: '1',
      ds: 'web',
      aip: options.anonymizeIp ? 1 : undefined,
      tid: trackingId,
      cid: getId(),
      t: type || 'pageview',
      sd:
        options.colorDepth && screen.colorDepth
          ? `${screen.colorDepth}-bits`
          : undefined,
      dr: document.referrer || undefined,
      dt: document.title,
      dl:
        document.location.origin +
        document.location.pathname +
        document.location.search,
      ul: options.language
        ? (navigator.language || '').toLowerCase()
        : undefined,
      de: options.characterSet ? document.characterSet : undefined,
      sr: options.screenSize
        ? `${(self.screen || {}).width}x${(self.screen || {}).height}`
        : undefined,
      vp:
        options.screenSize && self.visualViewport
          ? `${(self.visualViewport || {}).width}x${
              (self.visualViewport || {}).height
            }`
          : undefined,
      ec: eventCategory || undefined,
      ea: eventAction || undefined,
      el: eventLabel || undefined,
      ev: eventValue || undefined,
      exd: exceptionDescription || undefined,
      exf:
        typeof exceptionFatal !== 'undefined' && !!exceptionFatal === false
          ? 0
          : undefined,
    }),
  );
};
const trackEvent = (category, action, label, value) =>
  track('event', category, action, label, value);
const trackException = (description, fatal) =>
  track('exception', null, null, null, null, description, fatal);
const originalPushState = history.pushState;
history.pushState = function(state) {
  history.onpushstate({ state });
  setTimeout(track, options.delay || 10);
  return originalPushState.apply(history, arguments);
};
track();
self.ma = {
  trackEvent,
  trackException,
};
