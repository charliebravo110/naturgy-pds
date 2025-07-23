# Code formatting (reflecting the codebase choices with Prettier) 
We are using prettier to format the code on each file save.

We have created the `.prettierrc.yml` file with the configuration reflecting the existing codebase choices (e.g. 2 spaces for indentation, single quotes, no semicolons, etc.)

And the following workspace settings `.vscode/settings.json` file:

```json
    "editor.formatOnSave": true,
    "editor.formatOnSaveMode": "modifications",
    "editor.defaultFormatter": "esbenp.prettier-vscode",
```
This way, when we save changes to an existing file, only the modified lines will be formatted, avoiding noise in the git history.

(I pasted the contents because the `.vscode` folder is gitignored)

When the code from this project is merged it is up to to the maintainers to decide if they want to keep using this configuration or not, we highly recommend to have a consistent code formatting across the whole project.