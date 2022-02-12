import * as vscode from 'vscode';

export class Preference {
	config: vscode.WorkspaceConfiguration;
	constructor() {
		this.config = vscode.workspace.getConfiguration('copyInclude');
	}

	get isShowStatusBar(): boolean {
		return this.config.get<boolean>('accessPoint.statusBar') as boolean;
	}

	get isReferToCCppPropertiesJSON(): boolean {
		return this.config.get<boolean>('headerSearchPath.useCCppPropertiesJSON') as boolean;
	}

	get headerSearchPath(): Array<string> {
		let searchPath = this.config.get<string>('headerSearchPath.path') as string;
		return searchPath.length === 0 ? [] : searchPath.split(':');
	}
}
