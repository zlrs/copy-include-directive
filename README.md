# copy #include

C/C++ developers mannuly write `#include` a lot. Although language server can help on auto-completion, it's still both boring and error-prone to typing the `#include "..."` again and agin.

This extension helps you get `#include` directive of the current open file. 

## Features

Describe specific features of your extension including screenshots of your extension in action. Image paths are relative to this README file.

For example if there is an image subfolder under your extension project workspace:

![get-include-from-command-palette](docs/call-from-command-palette-current-file.png)

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow.

## Extension Settings

```json
{
  // show status bar item for active header file
  "copyInclude.accessPoint.statusBar": true,
  // include search path
  "copyInclude.headerSearchPath.path": "",
  // whether to refer to .vscode/c_cpp_properties.json for the include search path. 
  // If it's on, `copyInclude.headerSearchPath.path` will be ignored.
  "copyInclude.headerSearchPath.useCCppPropertiesJSON": false
}
```

## Release Notes

### 0.0.3

1. Add a status bar item to copy #include of the current file. It's enabled by default for convenience and can be disabled in the preferences. 
2. You can now specify project include directories in the preferences. Or, you can set the extension to refer to the `.vscode/c_cpp_properties.json` file. 

### 0.0.2

Add a context entry in the file explorer to copy #include of the selected file.

### 0.0.1

Initial release. Support getting #include from current open file.

## Known issues

For now, the extension doesn't support replacing env varibales defined in `.vscode/c_cpp_properties.json`. But it's promising to come in next big version.
