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
const staticCache = `static-${CACHE_VERSION}`;
const preserveCaches = [staticCache];

addEventListener('install', event => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(staticCache);
      await cache.addAll(ASSETS_TO_CACHE);
    })(),
  );
});

addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter(key => preserveCaches.includes(key))
          .map(key => caches.delete(key)),
      );
    })(),
  );
});
