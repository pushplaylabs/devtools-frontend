// Copyright 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import * as Root from '../root/root.js';  // eslint-disable-line no-unused-vars

import {Action, getRegisteredActionExtensions} from './ActionRegistration.js';  // eslint-disable-line no-unused-vars
import {Context} from './Context.js';  // eslint-disable-line no-unused-vars

/** @type {!ActionRegistry|undefined} */
let actionRegistryInstance;

export class ActionRegistry {
  /**
   * @private
   */
  constructor() {
    /** @type {!Map.<string, !Action>} */
    this._actionsById = new Map();
    this._registerActions();
  }

  /**
   * @param {{forceNew: ?boolean}} opts
   */
  static instance(opts = {forceNew: null}) {
    const {forceNew} = opts;
    if (!actionRegistryInstance || forceNew) {
      actionRegistryInstance = new ActionRegistry();
    }

    return actionRegistryInstance;
  }

  static removeInstance() {
    actionRegistryInstance = undefined;
  }

  _registerActions() {
    for (const action of getRegisteredActionExtensions()) {
      this._actionsById.set(action.id(), action);
      if (!action.canInstantiate()) {
        action.setEnabled(false);
      }
    }
  }

  /**
   * @return {!Array.<!Action>}
   */
  availableActions() {
    return this.applicableActions([...this._actionsById.keys()], Context.instance());
  }

  /**
   * @return {!Array.<!Action>}
   */
  actions() {
    return [...this._actionsById.values()];
  }

  /**
   * @param {!Array.<string>} actionIds
   * @param {!Context} context
   * @return {!Array.<!Action>}
   */
  applicableActions(actionIds, context) {
    /** @type {!Array<!Action>} */
    const applicableActions = [];
    for (const actionId of actionIds) {
      const action = this._actionsById.get(actionId);
      if (action && action.enabled()) {
        if (isActionApplicableToContextTypes(
                /** @type {!Action} */ (action), context.flavors())) {
          applicableActions.push(/** @type {!Action} */ (action));
        }
      }
    }
    return applicableActions;

    /**
     * @param {!Action} action
     * @param {!Set.<?>} currentContextTypes
     * @return {boolean}
     */
    function isActionApplicableToContextTypes(action, currentContextTypes) {
      const contextTypes = action.contextTypes();
      if (!contextTypes) {
        return true;
      }
      for (let i = 0; i < contextTypes.length; ++i) {
        const contextType = contextTypes[i];
        const isMatching = Boolean(contextType) && currentContextTypes.has(contextType);
        if (isMatching) {
          return true;
        }
      }
      return false;
    }
  }

  /**
   * @param {string} actionId
   * @return {?Action}
   */
  action(actionId) {
    return this._actionsById.get(actionId) || null;
  }
}
