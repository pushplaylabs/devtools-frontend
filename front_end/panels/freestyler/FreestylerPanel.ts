// Copyright 2024 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as Host from '../../core/host/host.js';
import * as i18n from '../../core/i18n/i18n.js';
import * as SDK from '../../core/sdk/sdk.js';
import * as UI from '../../ui/legacy/legacy.js';
import * as LitHtml from '../../ui/lit-html/lit-html.js';

import {
  type ChatMessage,
  ChatMessageEntity,
  FreestylerChatUi,
  type Props as FreestylerChatUiProps,
  State as FreestylerChatUiState,
} from './components/FreestylerChatUi.js';
import {FreestylerAgent, type StepData} from './FreestylerAgent.js';
import freestylerPanelStyles from './freestylerPanel.css.js';

/*
  * TODO(nvitkov): b/346933425
  * Temporary string that should not be translated
  * as they may change often during development.
  */
const TempUIStrings = {
  /**
   *@description Freestyler UI text for clearing messages.
   */
  clearMessages: 'Clear messages',
  /**
   *@description Freestyler UI text for sending feedback.
   */
  sendFeedback: 'Send feedback',
};

// TODO(nvitkov): b/346933425
// const str_ = i18n.i18n.registerUIStrings('panels/freestyler/FreestylerPanel.ts', UIStrings);
// const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
/* eslint-disable  rulesdir/l10n_i18nString_call_only_with_uistrings */
const i18nString = i18n.i18n.lockedString;

type ViewOutput = {
  freestylerChatUi?: FreestylerChatUi,
};
type View = (input: FreestylerChatUiProps, output: ViewOutput, target: HTMLElement) => void;

// TODO(ergunsh): Use the WidgetElement instead of separately creating the toolbar.
function createToolbar(target: HTMLElement, {onClearClick}: {onClearClick: () => void}): void {
  const toolbarContainer = target.createChild('div', 'freestyler-toolbar-container');
  const leftToolbar = new UI.Toolbar.Toolbar('', toolbarContainer);
  const rightToolbar = new UI.Toolbar.Toolbar('freestyler-right-toolbar', toolbarContainer);

  const clearButton =
      new UI.Toolbar.ToolbarButton(i18nString(TempUIStrings.clearMessages), 'clear', undefined, 'freestyler.clear');
  clearButton.addEventListener(UI.Toolbar.ToolbarButton.Events.Click, onClearClick);
  leftToolbar.appendToolbarItem(clearButton);

  rightToolbar.appendSeparator();
  const feedbackButton =
      new UI.Toolbar.ToolbarButton(i18nString(TempUIStrings.sendFeedback), 'bug', undefined, 'freestyler.feedback');
  const helpButton =
      new UI.Toolbar.ToolbarButton(i18nString(TempUIStrings.sendFeedback), 'help', undefined, 'freestyler.help');
  rightToolbar.appendToolbarItem(feedbackButton);
  rightToolbar.appendToolbarItem(helpButton);
}

function defaultView(input: FreestylerChatUiProps, output: ViewOutput, target: HTMLElement): void {
  // clang-format off
  LitHtml.render(LitHtml.html`
    <${FreestylerChatUi.litTagName} .props=${input} ${LitHtml.Directives.ref((el: Element|undefined) => {
      if (!el || !(el instanceof FreestylerChatUi)) {
        return;
      }

      output.freestylerChatUi = el;
    })}></${FreestylerChatUi.litTagName}>
  `, target, {host: input}); // eslint-disable-line rulesdir/lit_html_host_this
  // clang-format on
}

let freestylerPanelInstance: FreestylerPanel;
export class FreestylerPanel extends UI.Panel.Panel {
  static panelName = 'freestyler';

  #toggleSearchElementAction: UI.ActionRegistration.Action;
  #selectedNode: SDK.DOMModel.DOMNode|null;
  #contentContainer: HTMLElement;
  #aidaClient: Host.AidaClient.AidaClient;
  #agent: FreestylerAgent;
  #viewProps: FreestylerChatUiProps;
  #viewOutput: ViewOutput = {};
  private constructor(private view: View = defaultView) {
    super(FreestylerPanel.panelName);

    createToolbar(this.contentElement, {onClearClick: this.#clearMessages.bind(this)});
    this.#toggleSearchElementAction =
        UI.ActionRegistry.ActionRegistry.instance().getAction('elements.toggle-element-search');
    this.#aidaClient = new Host.AidaClient.AidaClient();
    this.#contentContainer = this.contentElement.createChild('div', 'freestyler-chat-ui-container');
    this.#agent = new FreestylerAgent({aidaClient: this.#aidaClient});
    this.#selectedNode = UI.Context.Context.instance().flavor(SDK.DOMModel.DOMNode);
    this.#viewProps = {
      state: FreestylerChatUiState.CHAT_VIEW,
      messages: [],
      inspectElementToggled: this.#toggleSearchElementAction.toggled(),
      selectedNode: this.#selectedNode,
      onTextSubmit: this.#handleTextSubmit.bind(this),
      onInspectElementClick: this.#handleSelectElementClick.bind(this),
    };

    this.#toggleSearchElementAction.addEventListener(UI.ActionRegistration.Events.Toggled, ev => {
      this.#viewProps.inspectElementToggled = ev.data;
      this.doUpdate();
    });

    UI.Context.Context.instance().addFlavorChangeListener(SDK.DOMModel.DOMNode, ev => {
      if (this.#viewProps.selectedNode === ev.data) {
        return;
      }

      this.#viewProps.selectedNode = ev.data;
      this.#agent.resetHistory();
      this.#clearMessages();
      this.doUpdate();
    });
    this.doUpdate();
  }

  static instance(opts: {
    forceNew: boolean|null,
  }|undefined = {forceNew: null}): FreestylerPanel {
    const {forceNew} = opts;
    if (!freestylerPanelInstance || forceNew) {
      freestylerPanelInstance = new FreestylerPanel();
    }

    return freestylerPanelInstance;
  }

  override wasShown(): void {
    this.registerCSSFiles([freestylerPanelStyles]);
    this.#viewOutput.freestylerChatUi?.focusTextInput();
  }

  doUpdate(): void {
    this.view(this.#viewProps, this.#viewOutput, this.#contentContainer);
  }

  #handleSelectElementClick(): void {
    void this.#toggleSearchElementAction.execute();
  }

  handleAction(actionId: string): void {
    switch (actionId) {
      case 'freestyler.element-panel-context': {
        Host.userMetrics.actionTaken(Host.UserMetrics.Action.FreestylerOpenedFromElementsPanel);
        this.#clearMessages();
        break;
      }
      case 'freestyler.style-tab-context': {
        Host.userMetrics.actionTaken(Host.UserMetrics.Action.FreestylerOpenedFromStylesTab);
        this.#clearMessages();
        break;
      }
    }
  }

  // TODO(ergunsh): Handle cancelling agent run.
  #clearMessages(): void {
    this.#viewProps.messages = [];
    this.#viewProps.state = FreestylerChatUiState.CHAT_VIEW;
    this.#agent.resetHistory();
    this.doUpdate();
  }

  async #handleTextSubmit(text: string): Promise<void> {
    this.#viewProps.messages.push({
      entity: ChatMessageEntity.USER,
      text,
    });
    this.#viewProps.state = FreestylerChatUiState.CHAT_VIEW_LOADING;
    this.doUpdate();

    const systemMessage: ChatMessage = {
      entity: ChatMessageEntity.MODEL,
      steps: [],
    };

    this.#viewProps.messages.push(systemMessage);
    await this.#agent.run(text, (data: StepData) => {
      if (this.#viewProps.state === FreestylerChatUiState.CHAT_VIEW_LOADING) {
        this.#viewProps.state = FreestylerChatUiState.CHAT_VIEW;
      }

      systemMessage.steps.push(data);
      this.doUpdate();
    });
  }
}

export class ActionDelegate implements UI.ActionRegistration.ActionDelegate {
  handleAction(
      _context: UI.Context.Context,
      actionId: string,
      ): boolean {
    switch (actionId) {
      case 'freestyler.element-panel-context':
      case 'freestyler.style-tab-context': {
        void (async () => {
          const view = UI.ViewManager.ViewManager.instance().view(
              FreestylerPanel.panelName,
          );

          if (view) {
            await UI.ViewManager.ViewManager.instance().showView(
                FreestylerPanel.panelName,
            );
            const widget = (await view.widget()) as FreestylerPanel;
            widget.handleAction(actionId);
          }
        })();
        return true;
      }
    }

    return false;
  }
}
