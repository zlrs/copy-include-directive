
export class ComparablePath {
	private path: string;
	private components: Array<string>;

	constructor(_path: string) {
		_path.replace('\\', '/');
		this.path = _path;
		this.components = _path.split('/');
	}

	// from: the base path. 
	// to: the target path which the return value points to.
	// Example:
	//   from = CamparablePath("/c:/Users/user/Project/include")
	//   to   = CamparablePath("/c:/Users/user/Project/include/abc/edf/code.h")
	//   return value = "abc/edf/code.h"
	static relative(from: ComparablePath, to: ComparablePath) : string | null {
		let i = 0;
		while (i !== from.components.length && i !== to.components.length) {
			if (from.components[i] !== to.components[i]) {
				break;
			}
      i++;
		}

		if (i !== from.components.length) {
			return null;
		}
		
		let resultPathComponents = to.components.slice(i);
		return resultPathComponents.join('/');
	}
}
