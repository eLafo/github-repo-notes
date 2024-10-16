# GitHub Repo Notes Plugin for Obsidian

![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/anpigon/obsidian-book-search-plugin/release.yml?logo=github)
![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/anpigon/obsidian-book-search-plugin?sort=semver)
![GitHub Downloads (all assets, all releases)](https://img.shields.io/github/downloads/anpigon/obsidian-book-search-plugin/total)

An Obsidian plugin that creates notes from GitHub repository URLs by fetching repository data and README content, then generating notes based on a customizable template.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
  - [Manual Installation](#manual-installation)
- [Configuration](#configuration)
  - [Plugin Settings](#plugin-settings)
  - [Template Customization](#template-customization)
- [Usage](#usage)
  - [Creating a GitHub Repository Note](#creating-a-github-repository-note)
- [Troubleshooting](#troubleshooting)
- [Development](#development)
  - [Building from Source](#building-from-source)
  - [Contributing](#contributing)
- [License](#license)

---

## Features

- **Create Notes from GitHub Repositories**: Generate comprehensive notes by entering a GitHub repository URL.
- **Fetch Repository Metadata**: Automatically includes repository name, owner, description, language, license, and more.
- **Include README Content**: Fetches and embeds the repository's README file into your note.
- **Customizable Templates**: Use placeholders in a template file to define the structure and content of your notes.
- **Auto-Complete in Settings**: Provides auto-completion for folder paths and template files in plugin settings.
- **Ribbon Icon and Command Palette Access**: Easily access the plugin via a sidebar icon or the command palette.
- **Automatic Note Opening**: Option to automatically open the newly created note.

## Installation

### Manual Installation

1. **Download or Clone the Repository**

   - Download the plugin files or clone the repository:

     ```bash
     git clone https://github.com/yourusername/github-repo-notes.git
     ```

2. **Install Dependencies**

   - Navigate to the plugin directory:

     ```bash
     cd github-repo-notes
     ```

   - Install the necessary dependencies:

     ```bash
     npm install
     ```

3. **Build the Plugin**

   - Build the plugin by running:

     ```bash
     npm run build
     ```

     This will generate the `main.js` and other necessary files.

4. **Copy Files to Obsidian Plugins Folder**

   - Locate your Obsidian vault directory.
   - Navigate to `.obsidian/plugins` within your vault.
   - Create a new folder named `github-repo-notes`.
   - Copy the following files into this folder:

     - `manifest.json`
     - `main.js`
     - `styles.css` (if available)

5. **Enable the Plugin in Obsidian**

   - Open Obsidian.
   - Go to `Settings` > `Community Plugins`.
   - Disable `Safe Mode` if it's enabled.
   - Click on `Installed Plugins` and enable **GitHub Repo Notes Plugin**.

## Configuration

### Plugin Settings

After enabling the plugin, configure it by navigating to `Settings` > `GitHub Repo Notes Plugin`.

- **GitHub Personal Access Token**

  - Enter your GitHub token to access private repositories and increase API rate limits.
  - [How to create a GitHub Personal Access Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)

- **New File Location**

  - Specify the folder where new notes will be created.
  - Use the auto-complete feature to select an existing folder.

- **New File Name**

  - Define the file name for new notes.
  - Use placeholders like `{{repo_name}}` and `{{owner}}`.

- **Template File**

  - Specify the path to your template file.
  - Use the auto-complete feature to select an existing file.

- **Open New Repo Note**

  - Toggle whether to automatically open the new note after creation.

### Template Customization

The plugin uses a template file to generate notes. You can customize this template to fit your needs. The following placeholders are available:

- `{{repo_name}}`
- `{{owner}}`
- `{{description}}`
- `{{language}}`
- `{{license}}`
- `{{repo_url}}`
- `{{created_at}}`
- `{{default_branch}}`
- `{{readme_content}}`

#### Example Template (`repo-template.md`)

Place this file in your vault at the path specified in the plugin settings.

```markdown
---
tags:
  - type/code-repository
title: "{{repo_name}}"
created_by: "[[{{owner}}]]"
license: "{{license}}"
repository_link: "{{repo_url}}"
language: "{{language}}"
default_branch: "{{default_branch}}"
created_at: "{{created_at}}"
template_type: Code Repository
template_version: "1.0"
---

# {{repo_name}}

by [[{{owner}}]]

## Summary

> [!summary]
{{description}}

## Features

- 

## Installation

- 

## Usage

- 

## Contributors

- 

## README

{{readme_content}}

## Known Issues

- 

## Future Development

- 

---

# Back Matter

**Source**

- [{{repo_url}}]({{repo_url}})

**References**

- 

**Tasks**

- 

**Questions**

- 
```

## Usage

### Creating a GitHub Repository Note

You can create a new note from a GitHub repository URL using either the ribbon icon or the command palette.

#### **Using the Ribbon Icon**

- Click the **GitHub Pull Request** icon in the Obsidian sidebar.
- A modal dialog will appear prompting you to enter a GitHub repository URL.

#### **Using the Command Palette**

- Press `Ctrl+P` (or `Cmd+P` on macOS) to open the command palette.
- Type `Create GitHub Repository Note` and select the command.

#### **Steps**

1. **Enter the Repository URL**

   - Example: `https://github.com/obsidianmd/obsidian-releases`

2. **Submit**

   - Press `Enter` or click the **Create Note** button.

3. **Note Generation**

   - The plugin fetches repository data and the README content.
   - A new note is created based on your template.
   - The note is saved in the specified folder with the defined file name.
   - If enabled, the new note opens automatically.

## Troubleshooting

- **Invalid GitHub Repository URL**

  - Ensure the URL is in the correct format: `https://github.com/owner/repository`

- **API Rate Limits Exceeded**

  - Without a GitHub token, you're limited to 60 requests per hour.
  - Generate and add a GitHub Personal Access Token in the plugin settings.

- **Template Placeholders Not Replaced**

  - Check that your template uses the correct placeholders.
  - Placeholders are case-sensitive and must match exactly.

- **README Content Not Displayed**

  - The repository may not have a README file.
  - The plugin will leave the `{{readme_content}}` placeholder empty if no README is found.

- **Auto-Complete Not Working in Settings**

  - Ensure you've updated the plugin to the latest version.
  - If issues persist, restart Obsidian.

## Development

### Building from Source

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/github-repo-notes.git
   ```

2. **Navigate to the Plugin Directory**

   ```bash
   cd github-repo-notes
   ```

3. **Install Dependencies**

   ```bash
   npm install
   ```

4. **Build the Plugin**

   ```bash
   npm run build
   ```

5. **Copy Files to Obsidian**

   - Follow the [Manual Installation](#manual-installation) steps.

### Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub.

## License

This project is licensed under the [MIT License](LICENSE).

---

**Note**: Replace `https://github.com/yourusername/github-repo-notes.git` with the actual URL of your plugin's repository.

**Optional Enhancements**:

- Add screenshots to demonstrate usage (place images in the repository and reference them in the README).
- Provide more detailed troubleshooting steps based on user feedback.
- Include a changelog or roadmap section if you plan to update the plugin regularly.

**Important**: Ensure that all placeholders in your template match those used in the plugin code. Test the plugin thoroughly to confirm that it functions as expected.