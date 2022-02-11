// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as ncp from "copy-paste";

function getProjectIncludeDirective(fileUri: vscode.Uri): string | null {
	let relativePath = vscode.workspace.asRelativePath(fileUri);
  let includeDirective: string = `#include "${relativePath}"`;
  return includeDirective;
}

function copyIncludeDirective(selected: vscode.Uri): void {	
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

export function activate(context: vscode.ExtensionContext) {
	// current opened file in the opened editor
	let disposable = vscode.commands.registerCommand(
		'copy--include.currentFile', copyIncludeDirective);

	context.subscriptions.push(disposable);
}

export function deactivate() {}
