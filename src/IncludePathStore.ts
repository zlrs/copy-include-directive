import * as vscode from 'vscode';
import * as fs from 'fs';
import { join } from "path";
import { Preference } from './Preference';

export class IncludePathStore implements vscode.Disposable {
  private static _shared: IncludePathStore;
  private workspaceToIncludePath: Map<vscode.WorkspaceFolder, Array<string> | undefined> = new Map();
  private watcher: vscode.FileSystemWatcher | undefined = undefined;
  private pref = new Preference();

  public static get shared() {
    return this._shared || (this._shared = new this());
  }

  private constructor() {
    if (this.pref.isReferToCCppPropertiesJSON) {
      this.watcher = vscode.workspace.createFileSystemWatcher(".vscode/c_cpp_properties.json");
      const listener = (e: vscode.Uri) => {
        const workspaceFolder = vscode.workspace.getWorkspaceFolder(e);
        if (workspaceFolder) { this.updateIncludePath(workspaceFolder); }
      };
      this.watcher.onDidCreate(listener);
      this.watcher.onDidChange(listener);
      this.watcher.onDidDelete(listener);
    }
    this.initialize();
  }

  public dispose() {
    if (this.watcher) {
      this.watcher.dispose();
    }
  }

  public async initialize() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders) {
      for (const workspaceFolder of workspaceFolders) {
        await this.updateIncludePath(workspaceFolder);
      }
    }
  }

  public getIncludePathFor(workspaceFolder: vscode.WorkspaceFolder) {
    return this.workspaceToIncludePath.get(workspaceFolder);
  }

  //Reads the C++ properties and updates the include dirs to search.
  private async updateIncludePath(workspaceFolder: vscode.WorkspaceFolder) {
    let includePath: Array<string> | undefined = undefined;
    if (!this.pref.isReferToCCppPropertiesJSON) {
      includePath = replaceVariable(this.pref.headerSearchPath, workspaceFolder);
    }
    else {
      const filename = join(workspaceFolder.uri.path, ".vscode/c_cpp_properties.json");
      let properties: any = undefined;

      if (await exists(filename)) {
        try {
          properties = JSON.parse(await readFile(filename, "utf-8"));
        } catch (err) { }
      }
      if (typeof properties !== "object") {
        return;
      }

      const platform = getPlatform();
      let config = properties.configurations.find((c: { name: string; }) => c.name === platform);
      if (typeof config === "undefined") {
        config = properties.configurations;
      }
      if (typeof config === "undefined") {
        return;
      }

      includePath = config.includePath;
      if (includePath) {
        includePath = replaceVariable(includePath, workspaceFolder);
      }
    }
    
    this.workspaceToIncludePath.set(workspaceFolder, includePath);
  }
}

function getPlatform(): string {
  switch (process.platform) {
    case "linux": return "Linux";
    case "darwin": return "Mac";
    case "win32": return "Win32";
    default: return process.platform;
  }
}

function exists(path: string): Promise<boolean> {
  return new Promise(c => fs.exists(path, c));
}

function readFile(filename: string, encoding: BufferEncoding = "utf-8"): Promise<string> {
  return new Promise((c, e) => fs.readFile(filename, encoding, (err, data) => err ? e(err) : c(data)));
}

// Support ${workspaceRoot}.
function replaceVariable(dirs: Array<string>, workspaceFolder: vscode.WorkspaceFolder): Array<string> {
  if (!workspaceFolder) {
    return dirs;
  }

  return dirs.map(dir => {
    return dir.replace("${workspaceRoot}", workspaceFolder.uri.path)
      .replace("${workspaceFolder}", workspaceFolder.uri.path)
      .replace("/**", "")
      .replace("\\**", "");
  });
}
