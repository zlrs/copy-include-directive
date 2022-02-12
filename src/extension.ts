// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as ncp from "copy-paste";
import { ComparablePath } from './ComparablePath';

class Config {
	config: vscode.WorkspaceConfiguration;
	constructor() {
		this.config = vscode.workspace.getConfiguration('copyInclude');
	}

	get isShowStatusBar(): boolean {
		return this.config.get<boolean>('accessPoint.statusBar') as boolean;
	}

	get headerSearchPath(): Array<string> {
		let searchPath = this.config.get<string>('headerSearchPath.path') as string;
		return searchPath.length === 0 ? [] : searchPath.split(':');
	}
}

function calculateIncludeDirective(fileUri: vscode.Uri): string | null {
	let searchPaths: Array<string> = new Config().headerSearchPath;
	if (searchPaths.length === 0) {
		let workspaceFolder = vscode.workspace.getWorkspaceFolder(fileUri);
		if (workspaceFolder) {
			searchPaths.push(workspaceFolder.uri.path);
		}
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

	if (includePath) {
		return `#include "${includePath}"`;
	}
	return null;
}

function copySelectedFileIncludeDirective(selected: vscode.Uri): void {
	let includeDirective = calculateIncludeDirective(selected);
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

	let currentFileUri = editor.document.uri;
	let includeDirective = calculateIncludeDirective(currentFileUri);
	console.log(includeDirective);
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
