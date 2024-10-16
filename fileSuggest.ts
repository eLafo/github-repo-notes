// fileSuggest.ts
import { TFile, TFolder } from 'obsidian';
import { TextInputSuggest } from './textInputSuggest';

export class FileSuggest extends TextInputSuggest<TFile> {
  getSuggestions(inputStr: string): TFile[] {
    const files: TFile[] = [];
    const lowerInputStr = inputStr.toLowerCase();

    const traverseFiles = (folder: TFolder) => {
      for (const child of folder.children) {
        if (child instanceof TFile && child.path.toLowerCase().includes(lowerInputStr)) {
          files.push(child);
        } else if (child instanceof TFolder) {
          traverseFiles(child);
        }
      }
    };

    traverseFiles(this.app.vault.getRoot());

    return files;
  }

  renderSuggestion(file: TFile, el: HTMLElement): void {
    el.setText(file.path);
  }

  selectSuggestion(file: TFile): void {
    this.inputEl.value = file.path;
    this.inputEl.trigger('input');
  }
}
