// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import '../shell/shell.js';
import '../inspector_main/inspector_main-meta.js';

import * as Root from '../../core/root/root.js';
import * as Main from '../main/main.js';

// @ts-ignore Exposed for legacy layout tests
self.runtime = Root.Runtime.Runtime.instance({forceNew: true});
new Main.MainImpl.MainImpl();
