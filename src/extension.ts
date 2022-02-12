// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as ncp from "copy-paste";

function getProjectIncludeDirective(fileUri: vscode.Uri): string | null {
class Config {
	config: vscode.WorkspaceConfiguration;
	constructor() {
		this.config = vscode.workspace.getConfiguration('copyInclude');
	}

	get isShowStatusBar(): boolean {
		return this.config.get('accessPoint.statusBar') as boolean;
	}

	get headerSearchPath(): Array<string> {
		return [];
	}
}

	let relativePath = vscode.workspace.asRelativePath(fileUri);
  let includeDirective: string = `#include "${relativePath}"`;
  return includeDirective;
}

function copySelectedFileIncludeDirective(selected: vscode.Uri): void {
	console.log(selected);
	let includeDirective = getProjectIncludeDirective(selected);
	console.log(includeDirective);
	if (includeDirective) {
		ncp.copy<string>(includeDirective);
	}
}

function copyCurrentFileIncludeDirective(): void {	
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		return;
	}

	let fileUri = editor.document.uri;
	let includeDirective = getProjectIncludeDirective(fileUri);
	if (includeDirective) {
		ncp.copy<string>(includeDirective);
	}
}

let statusBarItem: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
	console.log('activated!');

	const cmdIDCurrentFile = 'copy--include.currentFile';
	const cmdIDSelectedFileInExplorer = 'copy--include.selectedFileInExplorer';
	context.subscriptions.push(
		// copy the #include directive of the current file in the editor
		vscode.commands.registerCommand(cmdIDCurrentFile, copyCurrentFileIncludeDirective),
		
		// copy the #include directive of the selected file in the explorer
		vscode.commands.registerCommand(cmdIDSelectedFileInExplorer, copySelectedFileIncludeDirective)
	);

	if (new Config().isShowStatusBar) {
		statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
		statusBarItem.command = cmdIDCurrentFile;
		statusBarItem.text = 'Copy #include';
		statusBarItem.show();
		context.subscriptions.push(statusBarItem);
	}
}

export function deactivate() {}
