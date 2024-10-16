// folderSuggest.ts
import { TFolder } from 'obsidian';
import { TextInputSuggest } from './textInputSuggest';

export class FolderSuggest extends TextInputSuggest<TFolder> {
  getSuggestions(inputStr: string): TFolder[] {
    const folders: TFolder[] = [];
    const lowerInputStr = inputStr.toLowerCase();

    const traverseFolders = (folder: TFolder) => {
      if (folder.path.toLowerCase().includes(lowerInputStr)) {
        folders.push(folder);
      }
      for (const child of folder.children) {
        if (child instanceof TFolder) {
          traverseFolders(child);
        }
      }
    };

    traverseFolders(this.app.vault.getRoot());

    return folders;
  }

  renderSuggestion(folder: TFolder, el: HTMLElement): void {
    el.setText(folder.path);
  }

  selectSuggestion(folder: TFolder): void {
    this.inputEl.value = folder.path;
    this.inputEl.trigger('input');
  }
}
