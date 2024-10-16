// textInputSuggest.ts
import { App } from 'obsidian';

export abstract class TextInputSuggest<T> {
  protected app: App;
  protected inputEl: HTMLInputElement;
  private suggestEl: HTMLElement;
  private suggestionItems: HTMLElement[];
  private suggestions: T[];
  private selectedItem: number = -1;

  constructor(app: App, inputEl: HTMLInputElement) {
    this.app = app;
    this.inputEl = inputEl;
    this.suggestEl = createDiv('suggestion-container');
    this.suggestionItems = [];

    this.inputEl.addEventListener('input', () => this.onInputChanged());
    this.inputEl.addEventListener('blur', () => this.close());
    this.inputEl.addEventListener('focus', () => this.onInputChanged());
    this.inputEl.addEventListener('keydown', (event: KeyboardEvent) => this.onKeyDown(event));
  }

  abstract getSuggestions(inputStr: string): T[];
  abstract renderSuggestion(item: T, el: HTMLElement): void;
  abstract selectSuggestion(item: T): void;

  private onInputChanged(): void {
    const inputStr = this.inputEl.value;
    this.suggestions = this.getSuggestions(inputStr);
    this.showSuggestions(this.suggestions);
  }

  private showSuggestions(suggestions: T[]): void {
    this.close();

    if (suggestions.length === 0) {
      return;
    }

    this.suggestEl = createDiv('suggestion-container');
    this.suggestionItems = [];

    suggestions.forEach((suggestion, index) => {
      const itemEl = createDiv('suggestion-item');
      this.renderSuggestion(suggestion, itemEl);

      itemEl.addEventListener('mousedown', (event: MouseEvent) => {
        event.preventDefault();
        this.selectSuggestion(suggestion);
        this.close();
      });

      this.suggestEl.appendChild(itemEl);
      this.suggestionItems.push(itemEl);
    });

    document.body.appendChild(this.suggestEl);
    const { left, bottom } = this.inputEl.getBoundingClientRect();
    this.suggestEl.style.position = 'absolute';
    this.suggestEl.style.left = `${left}px`;
    this.suggestEl.style.top = `${bottom}px`;
    this.suggestEl.style.width = `${this.inputEl.offsetWidth}px`;

    this.selectedItem = -1;
  }

  private close(): void {
    if (this.suggestEl && this.suggestEl.parentNode) {
      this.suggestEl.parentNode.removeChild(this.suggestEl);
      this.suggestionItems = [];
      this.selectedItem = -1;
    }
  }

  private onKeyDown(event: KeyboardEvent): void {
    if (!this.suggestions || this.suggestions.length === 0) {
      return;
    }

    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        this.changeSelection(-1);
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.changeSelection(1);
        break;
      case 'Enter':
        event.preventDefault();
        if (this.selectedItem >= 0 && this.selectedItem < this.suggestions.length) {
          this.selectSuggestion(this.suggestions[this.selectedItem]);
          this.close();
        }
        break;
      case 'Escape':
        event.preventDefault();
        this.close();
        break;
    }
  }

  private changeSelection(direction: number): void {
    if (this.selectedItem >= 0 && this.selectedItem < this.suggestionItems.length) {
      this.suggestionItems[this.selectedItem].removeClass('is-selected');
    }

    this.selectedItem += direction;

    if (this.selectedItem < 0) {
      this.selectedItem = this.suggestionItems.length - 1;
    } else if (this.selectedItem >= this.suggestionItems.length) {
      this.selectedItem = 0;
    }

    if (this.selectedItem >= 0 && this.selectedItem < this.suggestionItems.length) {
      this.suggestionItems[this.selectedItem].addClass('is-selected');
    }
  }
}
