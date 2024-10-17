// main.ts

import { App, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { GitHubRepoNotesSettings, DEFAULT_SETTINGS } from './settings';
import { RepoUrlModal } from './modal';
import { FolderSuggest } from 'FolderSuggester';
import { FileSuggest } from 'FileSuggester'

export default class GitHubRepoNotesPlugin extends Plugin {
  settings: GitHubRepoNotesSettings;

  async onload() {
    await this.loadSettings();

    // **Add a Ribbon Icon**
    const ribbonIconEl = this.addRibbonIcon(
      'git-pull-request',
      'Create GitHub Repository Note',
      (evt: MouseEvent) => {
        // Called when the user clicks the icon.
        new RepoUrlModal(this.app, this.settings, this).open();
      }
    );

    // Add command to activate the plugin
    this.addCommand({
      id: 'create-github-repo-notes',
      name: 'Create GitHub Repository Note',
      callback: () => {
        new RepoUrlModal(this.app, this.settings, this).open();
      },
    });

    // Add settings tab
    this.addSettingTab(new GitHubRepoNotesSettingTab(this.app, this));
  }

  onunload() {
    console.log('Unloading GitHub Repo Notes Plugin');
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

class GitHubRepoNotesSettingTab extends PluginSettingTab {
  plugin: GitHubRepoNotesPlugin;

  constructor(app: App, plugin: GitHubRepoNotesPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    containerEl.createEl('h2', { text: 'GitHub Repo Notes Plugin Settings' });

    new Setting(containerEl)
      .setName('GitHub Personal Access Token')
      .setDesc(
        'Enter your GitHub token to access private repos and increase rate limits.'
      )
      .addText((text) =>
        text
          .setPlaceholder('Enter your token')
          .setValue(this.plugin.settings.githubToken)
          .onChange(async (value) => {
            this.plugin.settings.githubToken = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName('New File Location')
      .setDesc('Directory where new notes will be created.')
      .addSearch((cb) => {
        new FolderSuggest(cb.inputEl);
        cb.setPlaceholder("Example: folder1/folder2")
            .setValue(this.plugin.settings.newFileLocation)
            .onChange((new_folder) => {
                this.plugin.settings.newFileLocation = new_folder;
                this.plugin.saveSettings();
            });
        // @ts-ignore
        cb.containerEl.addClass("templater_search");
    });

    new Setting(containerEl)
      .setName('New File Name')
      .setDesc(
        'File name for the new note. Use placeholders like {{repo_name}}.'
      )
      .addText((text) =>
        text
          .setPlaceholder('Enter file name')
          .setValue(this.plugin.settings.newFileName)
          .onChange(async (value) => {
            this.plugin.settings.newFileName = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName('Template File')
      .setDesc('Select the template file to use for new notes.')
      .addSearch((cb) => {
        new FileSuggest(cb.inputEl);
        cb.setPlaceholder("Example: templates/template1.md")
          .setValue(this.plugin.settings.templateFile)
          .onChange((new_template) => {
            this.plugin.settings.templateFile = new_template;
            this.plugin.saveSettings();
          });
        // @ts-ignore
        cb.containerEl.addClass("templater_search");
      });

    new Setting(containerEl)
      .setName('Open New Repo Note')
      .setDesc('Automatically open the new note after creation.')
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.openNewNote)
          .onChange(async (value) => {
            this.plugin.settings.openNewNote = value;
            await this.plugin.saveSettings();
          })
      );
  }
}
