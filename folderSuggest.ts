// folderSuggest.ts

import { App, TFolder } from 'obsidian';
import { TextInputSuggest } from './textInputSuggest';

export class FolderSuggest extends TextInputSuggest<TFolder> {
  constructor(app: App, inputEl: HTMLInputElement) {
    super(app, inputEl);
  }

  getSuggestions(inputStr: string): TFolder[] {
    const folders: TFolder[] = [];
    const lowerCaseInputStr = inputStr.toLowerCase();

    this.app.vault.getAllLoadedFiles().forEach((file) => {
      if (
        file instanceof TFolder &&
        file.path.toLowerCase().includes(lowerCaseInputStr)
      ) {
        folders.push(file);
      }
    });

    return folders;
  }

  renderSuggestion(folder: TFolder, el: HTMLElement): void {
    el.setText(folder.path);
  }

  selectSuggestion(folder: TFolder): void {
    this.inputEl.value = folder.path;
    this.inputEl.trigger('input');
    this.close(); // Now accessible due to protected visibility
  }
}
