export interface GitHubRepoNotesSettings {
    githubToken: string;
    newFileLocation: string;
    newFileName: string;
    templateFile: string;
    openNewNote: boolean;
  }
  
  export const DEFAULT_SETTINGS: GitHubRepoNotesSettings = {
    githubToken: '',
    newFileLocation: '',
    newFileName: '{{repo_name}}.md',
    templateFile: 'repo-template.md',
    openNewNote: true,
  };
  