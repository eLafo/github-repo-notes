// textInputSuggest.ts
import { App } from 'obsidian';

export abstract class TextInputSuggest<T> {
  protected app: App;
  protected inputEl: HTMLInputElement;
  private containerEl: HTMLElement;
  private suggestEl: HTMLElement;
  private suggestionItems: HTMLElement[];
  private suggestions: T[];
  private selectedItem: number = -1;

  constructor(app: App, inputEl: HTMLInputElement) {
    this.app = app;
    this.inputEl = inputEl;
    this.suggestionItems = [];

    // Create a container element
    this.containerEl = createDiv('text-input-suggestion-container');

    // Replace the input element's parent with the container
    if (this.inputEl.parentNode) {
      this.inputEl.parentNode.replaceChild(this.containerEl, this.inputEl);
    }

    // Append the input element and suggestion element to the container
    this.containerEl.appendChild(this.inputEl);

    this.suggestEl = createDiv('suggestion-container');
    this.containerEl.appendChild(this.suggestEl);

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

    // Clear previous suggestions
    this.suggestEl.innerHTML = '';
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

    // Show the suggestion container
    this.suggestEl.addClass('is-visible');

    this.selectedItem = -1;
  }

  private close(): void {
    // Hide the suggestion container
    this.suggestEl.removeClass('is-visible');
    this.suggestionItems = [];
    this.selectedItem = -1;
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
