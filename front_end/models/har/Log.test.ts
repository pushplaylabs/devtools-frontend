// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import * as Platform from '../../core/platform/platform.js';
import * as SDK from '../../core/sdk/sdk.js';
import * as Protocol from '../../generated/protocol.js';
import * as HAR from '../har/har.js';

describe('HAR.Log', () => {
  it('blocked time when no response received is returned in milliseconds (crbug.com/1145177)', async () => {
    const requestId = 'r0' as Protocol.Network.RequestId;
    const request = SDK.NetworkRequest.NetworkRequest.create(
        requestId, 'p0.com' as Platform.DevToolsPath.UrlString, Platform.DevToolsPath.EmptyUrlString, null, null, null);
    const issueTime = new Date(2020, 1, 3).getTime() / 1000;
    request.setIssueTime(issueTime, issueTime);
    request.endTime = issueTime + 5;
    const entry = await HAR.Log.Entry.build(request);

    assert.strictEqual(entry.timings.blocked, 5000, 'HARLog entry\'s blocked time is incorrect');
  });

  it('_initiator.requestId is exported', async () => {
    const requestId = 'r0' as Protocol.Network.RequestId;
    const request = SDK.NetworkRequest.NetworkRequest.create(
        requestId, 'p0.com' as Platform.DevToolsPath.UrlString, Platform.DevToolsPath.EmptyUrlString, null, null,
        {requestId, type: Protocol.Network.InitiatorType.Script});
    const entry = await HAR.Log.Entry.build(request);

    assert.strictEqual(entry._initiator?.requestId, requestId);
  });

  it('Exports Service worker info', async () => {
    const requestId = 'r0' as Protocol.Network.RequestId;
    const request = SDK.NetworkRequest.NetworkRequest.create(
        requestId, 'p0.com' as Platform.DevToolsPath.UrlString, Platform.DevToolsPath.EmptyUrlString, null, null,
        {requestId, type: Protocol.Network.InitiatorType.Script});

    const cacheName = 'v1';
    request.fetchedViaServiceWorker = true;
    request.setResponseCacheStorageCacheName(cacheName);
    request.setServiceWorkerResponseSource(Protocol.Network.ServiceWorkerResponseSource.CacheStorage);

    const entry = await HAR.Log.Entry.build(request);

    assert.strictEqual(entry.response._fetchedViaServiceWorker, true);
    assert.strictEqual(entry.response._responseCacheStorageCacheName, cacheName);
    assert.strictEqual(
        entry.response._serviceWorkerResponseSource, Protocol.Network.ServiceWorkerResponseSource.CacheStorage);
  });
});
