// textInputSuggest.ts

import { App, ISuggestOwner, Scope } from 'obsidian';
import { createPopper, Instance as PopperInstance } from '@popperjs/core';

export abstract class TextInputSuggest<T> implements ISuggestOwner<T> {
  protected app: App;
  protected inputEl: HTMLInputElement | HTMLTextAreaElement;

  private scope: Scope;
  private popper: PopperInstance | null = null;
  private suggestEl: HTMLElement;
  private suggestionItems: HTMLElement[];
  private suggestions: T[];
  private selectedItem: number = -1;

  constructor(app: App, inputEl: HTMLInputElement | HTMLTextAreaElement) {
    this.app = app;
    this.inputEl = inputEl;
    this.suggestionItems = [];
    this.scope = new Scope();

    this.suggestEl = createDiv('suggestion-container');
    this.suggestEl.on('mousedown', '.suggestion-item', this.onSuggestionClick.bind(this));
    this.suggestEl.on('mousemove', '.suggestion-item', this.onSuggestionMouseover.bind(this));

    this.inputEl.addEventListener('input', () => this.onInputChanged());
    this.inputEl.addEventListener('blur', () => this.close());
    this.inputEl.addEventListener('focus', () => this.onInputChanged());

    this.scope.register([], 'ArrowUp', (event) => {
      if (!event.isComposing) {
        this.changeSelection(-1);
        return false;
      }
    });

    this.scope.register([], 'ArrowDown', (event) => {
      if (!event.isComposing) {
        this.changeSelection(1);
        return false;
      }
    });

    this.scope.register([], 'Enter', (event) => {
      if (!event.isComposing) {
        this.useSelectedItem(event);
        return false;
      }
    });

    this.scope.register([], 'Escape', (event) => {
      if (!event.isComposing) {
        this.close();
        return false;
      }
    });
  }

  abstract getSuggestions(inputStr: string): T[];
  abstract renderSuggestion(item: T, el: HTMLElement): void;
  abstract selectSuggestion(item: T): void;

  protected onInputChanged(): void {
    const inputStr = this.inputEl.value;
    this.suggestions = this.getSuggestions(inputStr);
    if (this.suggestions.length > 0) {
      this.showSuggestions(this.suggestions);
    } else {
      this.close();
    }
  }

  private showSuggestions(suggestions: T[]): void {
    this.suggestEl.empty();
    this.suggestionItems = [];

    suggestions.forEach((suggestion, index) => {
      const itemEl = createDiv('suggestion-item');
      this.renderSuggestion(suggestion, itemEl);
      this.suggestEl.appendChild(itemEl);
      this.suggestionItems.push(itemEl);
    });

    if (!this.popper) {
      this.app.keymap.pushScope(this.scope);
      document.body.appendChild(this.suggestEl);

      this.popper = createPopper(this.inputEl, this.suggestEl, {
        placement: 'bottom-start',
        modifiers: [
          {
            name: 'sameWidth',
            enabled: true,
            fn: ({ state, instance }) => {
              const targetWidth = `${state.rects.reference.width}px`;
              if (state.styles.popper.width === targetWidth) {
                return;
              }
              state.styles.popper.width = targetWidth;
              instance.update();
            },
            phase: 'beforeWrite',
            requires: ['computeStyles'],
          },
        ],
      });
    } else {
      this.popper.update();
    }

    this.selectedItem = -1;
  }

  protected close(): void {
    if (this.popper) {
      this.app.keymap.popScope(this.scope);
      this.popper.destroy();
      this.popper = null;
    }
    this.suggestEl.detach();
    this.suggestionItems = [];
    this.selectedItem = -1;
  }

  private onSuggestionClick(event: MouseEvent, el: HTMLElement): void {
    event.preventDefault();
    const item = this.suggestionItems.indexOf(el);
    this.setSelectedItem(item);
    this.useSelectedItem(event);
  }

  private onSuggestionMouseover(event: MouseEvent, el: HTMLElement): void {
    const item = this.suggestionItems.indexOf(el);
    this.setSelectedItem(item);
  }

  private setSelectedItem(index: number): void {
    if (this.selectedItem >= 0 && this.selectedItem < this.suggestionItems.length) {
      this.suggestionItems[this.selectedItem].removeClass('is-selected');
    }
    this.selectedItem = index;
    if (this.selectedItem >= 0 && this.suggestionItems.length) {
      this.suggestionItems[this.selectedItem].addClass('is-selected');
      this.suggestionItems[this.selectedItem].scrollIntoView(false);
    }
  }

  private changeSelection(direction: number): void {
    let newIndex = this.selectedItem + direction;
    if (newIndex < 0) {
      newIndex = this.suggestionItems.length - 1;
    } else if (newIndex >= this.suggestionItems.length) {
      newIndex = 0;
    }
    this.setSelectedItem(newIndex);
  }

  private useSelectedItem(event: MouseEvent | KeyboardEvent): void {
    if (this.selectedItem >= 0 && this.selectedItem < this.suggestions.length) {
      this.selectSuggestion(this.suggestions[this.selectedItem]);
      this.close();
    }
  }
}
