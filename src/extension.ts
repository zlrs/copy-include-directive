// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as ncp from "copy-paste";
import { ComparablePath } from './ComparablePath';
import { Preference } from './Preference';
import { IncludePathStore } from './IncludePathStore';

function calculateIncludeDirective(fileUri: vscode.Uri): string | null {
	const workspaceFolder = vscode.workspace.getWorkspaceFolder(fileUri);
	console.log('calculating #include: file: ', fileUri.path);
	if (!workspaceFolder) {
		return null;
	} 

	let searchPaths: Array<string> | undefined = 
	  IncludePathStore.shared.getIncludePathFor(workspaceFolder);
	console.log('calculating #include: searchPaths:', searchPaths);
	if (!searchPaths) {
		return null;
	}

	let includePath: string | null = null;
	for (const path of searchPaths) {
		let from = new ComparablePath(path);
		let to = new ComparablePath(fileUri.path);
		includePath = ComparablePath.relative(from, to);
		if (includePath) {
			break;
		}
	}

	const includeDirective = includePath ? `#include "${includePath}"` : null;
	console.log('#include calculated: includeDirective: ', includeDirective);
	return includeDirective;
}

function copySelectedFileIncludeDirective(selected: vscode.Uri): void {
	if (!selected) {
		return;
	}
	
	let includeDirective = calculateIncludeDirective(selected);
	copyString(includeDirective);
}

function copyCurrentFileIncludeDirective(): void {	
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		return;
	}

	let currentFileUri = editor.document.uri;
	let includeDirective = calculateIncludeDirective(currentFileUri);
	copyString(includeDirective);
}

function copyString(str: string | null) {
	if (str) {
		ncp.copy<string>(str);
	}
	console.log('copied: ', str);
}

let statusBarItem: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
	console.log('activated!');
	IncludePathStore.shared;

	const cmdIDCurrentFile = 'copy--include.currentFile';
	const cmdIDSelectedFileInExplorer = 'copy--include.selectedFileInExplorer';
	context.subscriptions.push(
		// copy the #include directive of the current file in the editor
		vscode.commands.registerCommand(cmdIDCurrentFile, copyCurrentFileIncludeDirective),
		
		// copy the #include directive of the selected file in the explorer
		vscode.commands.registerCommand(cmdIDSelectedFileInExplorer, copySelectedFileIncludeDirective)
	);

	if (new Preference().isShowStatusBar) {
		statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
		statusBarItem.command = cmdIDCurrentFile;
		statusBarItem.text = 'Copy #include';
		statusBarItem.show();
		context.subscriptions.push(statusBarItem);
	}
}

export function deactivate() {}
