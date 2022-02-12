// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as ncp from "copy-paste";

function getProjectIncludeDirective(fileUri: vscode.Uri): string | null {
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

export function activate(context: vscode.ExtensionContext) {
	// copy the #include directive of the current file in the editor
	let disposable = vscode.commands.registerCommand(
		'copy--include.currentFile', copyCurrentFileIncludeDirective);
	
	// copy the #include directive of the selected file in the explorer
	let disposable2 = vscode.commands.registerCommand(
		'copy--include.selectedFileInExplorer', copySelectedFileIncludeDirective);

	context.subscriptions.push(disposable);
	context.subscriptions.push(disposable2);
	}

export function deactivate() {}
