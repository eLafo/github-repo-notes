// Credits go to Liam's Periodic Notes Plugin: https://github.com/liamcain/obsidian-periodic-notes

import { TAbstractFile, TFile, Vault } from "obsidian";
import { TextInputSuggest } from "./suggest";

export enum FileSuggestMode {
    TemplateFiles,
    ScriptFiles,
}

export function errorWrapperSync<T>(fn: () => T, msg: string): T {
    try {
        return fn();
    } catch (e) {
        return null as T;
    }
}

export function get_all_files_with_path(): Array<TFile> {
    const files: Array<TFile> = [];
    Vault.recurseChildren(app.vault.getRoot(), (file: TAbstractFile) => {
        if (file instanceof TFile) {
            files.push(file);
        }
    });

    files.sort((a, b) => {
        return a.path.localeCompare(b.path);
    });

    return files;
}

export class FileSuggest extends TextInputSuggest<TFile> {
    constructor(
        public inputEl: HTMLInputElement,
    ) {
        super(inputEl);
    }

    // get_folder(mode: FileSuggestMode): string {
    //     switch (mode) {
    //         case FileSuggestMode.TemplateFiles:
    //             return this.plugin.settings.;
    //         case FileSuggestMode.ScriptFiles:
    //             return this.plugin.settings.user_scripts_folder;
    //     }
    // }

    // get_error_msg(mode: FileSuggestMode): string {
    //     switch (mode) {
    //         case FileSuggestMode.TemplateFiles:
    //             return `Templates folder doesn't exist`;
    //         case FileSuggestMode.ScriptFiles:
    //             return `User Scripts folder doesn't exist`;
    //     }
    // }

    getSuggestions(input_str: string): TFile[] {
        const all_files = get_all_files_with_path()

        if (!all_files) {
            return [];
        }

        const files: TFile[] = [];
        const lower_input_str = input_str.toLowerCase();

        all_files.forEach((file: TAbstractFile) => {
            if (
                file instanceof TFile &&
                file.extension === "md" &&
                file.path.toLowerCase().contains(lower_input_str)
            ) {
                files.push(file);
            }
        });

        return files.slice(0, 1000);
    }

    renderSuggestion(file: TFile, el: HTMLElement): void {
        el.setText(file.path);
    }

    selectSuggestion(file: TFile): void {
        this.inputEl.value = file.path;
        this.inputEl.trigger("input");
        this.close();
    }
}