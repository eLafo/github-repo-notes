// modal.ts

import { App, Modal, Notice } from 'obsidian';
import axios from 'axios';
import GitHubRepoNotesPlugin from './main';
import { GitHubRepoNotesSettings } from './settings';

export class RepoUrlModal extends Modal {
  settings: GitHubRepoNotesSettings;
  plugin: GitHubRepoNotesPlugin;

  constructor(app: App, settings: GitHubRepoNotesSettings, plugin: GitHubRepoNotesPlugin) {
    super(app);
    this.settings = settings;
    this.plugin = plugin;
  }

  onOpen() {
    const { contentEl } = this;

    contentEl.createEl('h2', { text: 'Enter GitHub Repository URL' });

    const inputEl = contentEl.createEl('input', { type: 'text' });
    inputEl.style.width = '100%';

    // Add an event listener for the Enter key
    inputEl.addEventListener('keydown', async (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault(); // Prevent the default action
        await this.handleSubmit(inputEl.value.trim());
      }
    });

    const submitBtn = contentEl.createEl('button', { text: 'Create Note' });
    submitBtn.style.marginTop = '10px';

    submitBtn.addEventListener('click', async () => {
      await this.handleSubmit(inputEl.value.trim());
    });
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }

  // Refactored submission logic
  async handleSubmit(repoUrl: string) {
    if (!repoUrl) {
      new Notice('Please enter a GitHub repository URL.');
      return;
    }

    try {
      const repoData = await this.fetchRepoData(repoUrl);
      const noteContent = await this.generateNoteContent(repoData);
      await this.createNote(repoData, noteContent);
      if (this.settings.openNewNote) {
        const filePath = this.getNoteFilePath(repoData);
        const file = this.app.vault.getAbstractFileByPath(filePath);
        if (file) {
          this.app.workspace.openLinkText(filePath, '', true);
        }
      }
      new Notice('GitHub repository note created successfully.');
      this.close();
    } catch (error) {
      new Notice(`Error: ${error.message}`);
    }
  }

  async fetchRepoData(repoUrl: string): Promise<any> {
    const repoMatch = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!repoMatch) {
      throw new Error('Invalid GitHub repository URL.');
    }

    const owner = repoMatch[1];
    const repo = repoMatch[2];

    const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;

    const headers: any = {};
    if (this.settings.githubToken) {
      headers['Authorization'] = `token ${this.settings.githubToken}`;
    }

    try {
      const response = await axios.get(apiUrl, { headers });
      const repoData = response.data;

      // Fetch the README content
      const readmeContent = await this.fetchReadmeContent(owner, repo, headers);
      repoData.readme_content = readmeContent;

      return repoData;
    } catch (error) {
      throw new Error('Failed to fetch repository data from GitHub.');
    }
  }

  async fetchReadmeContent(owner: string, repo: string, headers: any): Promise<string> {
    const readmeApiUrl = `https://api.github.com/repos/${owner}/${repo}/readme`;

    try {
      const response = await axios.get(readmeApiUrl, { headers });
      const content = response.data.content;
      const encoding = response.data.encoding;

      if (encoding === 'base64' && content) {
        // Decode the Base64 content using atob
        const decodedContent = atob(content);
        return decodedContent;
      } else {
        return '';
      }
    } catch (error) {
      // If the README is not found, return an empty string
      return '';
    }
  }

  async generateNoteContent(repoData: any): Promise<string> {
    const templatePath = this.settings.templateFile;

    const templateFile = this.app.vault.getAbstractFileByPath(templatePath);
    if (!templateFile) {
      throw new Error('Template file not found.');
    }

    const templateContent = await this.app.vault.read(templateFile);

    const placeholders = {
      '{{repo_name}}': repoData.name || '',
      '{{owner}}': repoData.owner.login || '',
      '{{description}}': repoData.description || '',
      '{{language}}': repoData.language || '',
      '{{license}}': repoData.license ? repoData.license.name : 'None',
      '{{repo_url}}': repoData.html_url || '',
      '{{created_at}}': repoData.created_at ? repoData.created_at.substring(0, 10) : '',
      '{{default_branch}}': repoData.default_branch || '',
      '{{readme_content}}': repoData.readme_content || '',
      // Additional placeholders can be added here
    };

    let noteContent = templateContent;
    for (const placeholder in placeholders) {
      const value = placeholders[placeholder];
      noteContent = noteContent.replace(new RegExp(placeholder, 'g'), value);
    }

    return noteContent;
  }

  async createNote(repoData: any, content: string) {
    const filePath = this.getNoteFilePath(repoData);

    const existingFile = this.app.vault.getAbstractFileByPath(filePath);
    if (existingFile) {
      const shouldOverwrite = await this.confirmOverwrite();
      if (!shouldOverwrite) {
        throw new Error('Note creation canceled by the user.');
      }
    }

    await this.app.vault.adapter.write(filePath, content);
  }

  getNoteFilePath(repoData: any): string {
    const fileNameTemplate = this.settings.newFileName || '{{repo_name}}.md';
    const fileName = fileNameTemplate
      .replace('{{repo_name}}', repoData.name)
      .replace('{{owner}}', repoData.owner.login);

    const folderPath = this.settings.newFileLocation || '/';
    const normalizedFolderPath = folderPath.endsWith('/') ? folderPath : folderPath + '/';

    return normalizedFolderPath + fileName;
  }

  async confirmOverwrite(): Promise<boolean> {
    return new Promise((resolve) => {
      const modal = new Modal(this.app);
      modal.titleEl.setText('File Already Exists');
      modal.contentEl.createEl('p', {
        text: 'A note with the same name already exists. Do you want to overwrite it?',
      });

      const buttonContainer = modal.contentEl.createDiv({ cls: 'modal-button-container' });
      const overwriteButton = buttonContainer.createEl('button', { text: 'Overwrite' });
      const cancelButton = buttonContainer.createEl('button', { text: 'Cancel' });

      overwriteButton.addEventListener('click', () => {
        resolve(true);
        modal.close();
      });

      cancelButton.addEventListener('click', () => {
        resolve(false);
        modal.close();
      });

      modal.open();
    });
  }
}
