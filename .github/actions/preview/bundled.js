function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var os = _interopDefault(require('os'));
var events = _interopDefault(require('events'));
var child_process = _interopDefault(require('child_process'));
var path = _interopDefault(require('path'));
var util = _interopDefault(require('util'));
var assert = _interopDefault(require('assert'));
var fs = _interopDefault(require('fs'));
var Stream = _interopDefault(require('stream'));
var http = _interopDefault(require('http'));
var Url = _interopDefault(require('url'));
var https = _interopDefault(require('https'));
var zlib = _interopDefault(require('zlib'));
require('net');
var tls = _interopDefault(require('tls'));

// A type of promise-like that resolves synchronously and supports only one observer

const _iteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator"))) : "@@iterator";

const _asyncIteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.asyncIterator || (Symbol.asyncIterator = Symbol("Symbol.asyncIterator"))) : "@@asyncIterator";

// Asynchronously call a function and send errors to recovery continuation
function _catch(body, recover) {
	try {
		var result = body();
	} catch(e) {
		return recover(e);
	}
	if (result && result.then) {
		return result.then(void 0, recover);
	}
	return result;
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

function getCjsExportFromNamespace (n) {
	return n && n['default'] || n;
}

var ioUtil = createCommonjsModule(function (module, exports) {
var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });



_a = fs.promises, exports.chmod = _a.chmod, exports.copyFile = _a.copyFile, exports.lstat = _a.lstat, exports.mkdir = _a.mkdir, exports.readdir = _a.readdir, exports.readlink = _a.readlink, exports.rename = _a.rename, exports.rmdir = _a.rmdir, exports.stat = _a.stat, exports.symlink = _a.symlink, exports.unlink = _a.unlink;
exports.IS_WINDOWS = process.platform === 'win32';
function exists(fsPath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield exports.stat(fsPath);
        }
        catch (err) {
            if (err.code === 'ENOENT') {
                return false;
            }
            throw err;
        }
        return true;
    });
}
exports.exists = exists;
function isDirectory(fsPath, useStat = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const stats = useStat ? yield exports.stat(fsPath) : yield exports.lstat(fsPath);
        return stats.isDirectory();
    });
}
exports.isDirectory = isDirectory;
/**
 * On OSX/Linux, true if path starts with '/'. On Windows, true for paths like:
 * \, \hello, \\hello\share, C:, and C:\hello (and corresponding alternate separator cases).
 */
function isRooted(p) {
    p = normalizeSeparators(p);
    if (!p) {
        throw new Error('isRooted() parameter "p" cannot be empty');
    }
    if (exports.IS_WINDOWS) {
        return (p.startsWith('\\') || /^[A-Z]:/i.test(p) // e.g. \ or \hello or \\hello
        ); // e.g. C: or C:\hello
    }
    return p.startsWith('/');
}
exports.isRooted = isRooted;
/**
 * Recursively create a directory at `fsPath`.
 *
 * This implementation is optimistic, meaning it attempts to create the full
 * path first, and backs up the path stack from there.
 *
 * @param fsPath The path to create
 * @param maxDepth The maximum recursion depth
 * @param depth The current recursion depth
 */
function mkdirP(fsPath, maxDepth = 1000, depth = 1) {
    return __awaiter(this, void 0, void 0, function* () {
        assert.ok(fsPath, 'a path argument must be provided');
        fsPath = path.resolve(fsPath);
        if (depth >= maxDepth)
            return exports.mkdir(fsPath);
        try {
            yield exports.mkdir(fsPath);
            return;
        }
        catch (err) {
            switch (err.code) {
                case 'ENOENT': {
                    yield mkdirP(path.dirname(fsPath), maxDepth, depth + 1);
                    yield exports.mkdir(fsPath);
                    return;
                }
                default: {
                    let stats;
                    try {
                        stats = yield exports.stat(fsPath);
                    }
                    catch (err2) {
                        throw err;
                    }
                    if (!stats.isDirectory())
                        throw err;
                }
            }
        }
    });
}
exports.mkdirP = mkdirP;
/**
 * Best effort attempt to determine whether a file exists and is executable.
 * @param filePath    file path to check
 * @param extensions  additional file extensions to try
 * @return if file exists and is executable, returns the file path. otherwise empty string.
 */
function tryGetExecutablePath(filePath, extensions) {
    return __awaiter(this, void 0, void 0, function* () {
        let stats = undefined;
        try {
            // test file exists
            stats = yield exports.stat(filePath);
        }
        catch (err) {
            if (err.code !== 'ENOENT') {
                // eslint-disable-next-line no-console
                console.log(`Unexpected error attempting to determine if executable file exists '${filePath}': ${err}`);
            }
        }
        if (stats && stats.isFile()) {
            if (exports.IS_WINDOWS) {
                // on Windows, test for valid extension
                const upperExt = path.extname(filePath).toUpperCase();
                if (extensions.some(validExt => validExt.toUpperCase() === upperExt)) {
                    return filePath;
                }
            }
            else {
                if (isUnixExecutable(stats)) {
                    return filePath;
                }
            }
        }
        // try each extension
        const originalFilePath = filePath;
        for (const extension of extensions) {
            filePath = originalFilePath + extension;
            stats = undefined;
            try {
                stats = yield exports.stat(filePath);
            }
            catch (err) {
                if (err.code !== 'ENOENT') {
                    // eslint-disable-next-line no-console
                    console.log(`Unexpected error attempting to determine if executable file exists '${filePath}': ${err}`);
                }
            }
            if (stats && stats.isFile()) {
                if (exports.IS_WINDOWS) {
                    // preserve the case of the actual file (since an extension was appended)
                    try {
                        const directory = path.dirname(filePath);
                        const upperName = path.basename(filePath).toUpperCase();
                        for (const actualName of yield exports.readdir(directory)) {
                            if (upperName === actualName.toUpperCase()) {
                                filePath = path.join(directory, actualName);
                                break;
                            }
                        }
                    }
                    catch (err) {
                        // eslint-disable-next-line no-console
                        console.log(`Unexpected error attempting to determine the actual case of the file '${filePath}': ${err}`);
                    }
                    return filePath;
                }
                else {
                    if (isUnixExecutable(stats)) {
                        return filePath;
                    }
                }
            }
        }
        return '';
    });
}
exports.tryGetExecutablePath = tryGetExecutablePath;
function normalizeSeparators(p) {
    p = p || '';
    if (exports.IS_WINDOWS) {
        // convert slashes on Windows
        p = p.replace(/\//g, '\\');
        // remove redundant slashes
        return p.replace(/\\\\+/g, '\\');
    }
    // remove redundant slashes
    return p.replace(/\/\/+/g, '/');
}
// on Mac/Linux, test the execute bit
//     R   W  X  R  W X R W X
//   256 128 64 32 16 8 4 2 1
function isUnixExecutable(stats) {
    return ((stats.mode & 1) > 0 ||
        ((stats.mode & 8) > 0 && stats.gid === process.getgid()) ||
        ((stats.mode & 64) > 0 && stats.uid === process.getuid()));
}

});

unwrapExports(ioUtil);

var io = createCommonjsModule(function (module, exports) {
var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });




const exec = util.promisify(child_process.exec);
/**
 * Copies a file or folder.
 * Based off of shelljs - https://github.com/shelljs/shelljs/blob/9237f66c52e5daa40458f94f9565e18e8132f5a6/src/cp.js
 *
 * @param     source    source path
 * @param     dest      destination path
 * @param     options   optional. See CopyOptions.
 */
function cp(source, dest, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const { force, recursive } = readCopyOptions(options);
        const destStat = (yield ioUtil.exists(dest)) ? yield ioUtil.stat(dest) : null;
        // Dest is an existing file, but not forcing
        if (destStat && destStat.isFile() && !force) {
            return;
        }
        // If dest is an existing directory, should copy inside.
        const newDest = destStat && destStat.isDirectory()
            ? path.join(dest, path.basename(source))
            : dest;
        if (!(yield ioUtil.exists(source))) {
            throw new Error(`no such file or directory: ${source}`);
        }
        const sourceStat = yield ioUtil.stat(source);
        if (sourceStat.isDirectory()) {
            if (!recursive) {
                throw new Error(`Failed to copy. ${source} is a directory, but tried to copy without recursive flag.`);
            }
            else {
                yield cpDirRecursive(source, newDest, 0, force);
            }
        }
        else {
            if (path.relative(source, newDest) === '') {
                // a file cannot be copied to itself
                throw new Error(`'${newDest}' and '${source}' are the same file`);
            }
            yield copyFile(source, newDest, force);
        }
    });
}
exports.cp = cp;
/**
 * Moves a path.
 *
 * @param     source    source path
 * @param     dest      destination path
 * @param     options   optional. See MoveOptions.
 */
function mv(source, dest, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield ioUtil.exists(dest)) {
            let destExists = true;
            if (yield ioUtil.isDirectory(dest)) {
                // If dest is directory copy src into dest
                dest = path.join(dest, path.basename(source));
                destExists = yield ioUtil.exists(dest);
            }
            if (destExists) {
                if (options.force == null || options.force) {
                    yield rmRF(dest);
                }
                else {
                    throw new Error('Destination already exists');
                }
            }
        }
        yield mkdirP(path.dirname(dest));
        yield ioUtil.rename(source, dest);
    });
}
exports.mv = mv;
/**
 * Remove a path recursively with force
 *
 * @param inputPath path to remove
 */
function rmRF(inputPath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (ioUtil.IS_WINDOWS) {
            // Node doesn't provide a delete operation, only an unlink function. This means that if the file is being used by another
            // program (e.g. antivirus), it won't be deleted. To address this, we shell out the work to rd/del.
            try {
                if (yield ioUtil.isDirectory(inputPath, true)) {
                    yield exec(`rd /s /q "${inputPath}"`);
                }
                else {
                    yield exec(`del /f /a "${inputPath}"`);
                }
            }
            catch (err) {
                // if you try to delete a file that doesn't exist, desired result is achieved
                // other errors are valid
                if (err.code !== 'ENOENT')
                    throw err;
            }
            // Shelling out fails to remove a symlink folder with missing source, this unlink catches that
            try {
                yield ioUtil.unlink(inputPath);
            }
            catch (err) {
                // if you try to delete a file that doesn't exist, desired result is achieved
                // other errors are valid
                if (err.code !== 'ENOENT')
                    throw err;
            }
        }
        else {
            let isDir = false;
            try {
                isDir = yield ioUtil.isDirectory(inputPath);
            }
            catch (err) {
                // if you try to delete a file that doesn't exist, desired result is achieved
                // other errors are valid
                if (err.code !== 'ENOENT')
                    throw err;
                return;
            }
            if (isDir) {
                yield exec(`rm -rf "${inputPath}"`);
            }
            else {
                yield ioUtil.unlink(inputPath);
            }
        }
    });
}
exports.rmRF = rmRF;
/**
 * Make a directory.  Creates the full path with folders in between
 * Will throw if it fails
 *
 * @param   fsPath        path to create
 * @returns Promise<void>
 */
function mkdirP(fsPath) {
    return __awaiter(this, void 0, void 0, function* () {
        yield ioUtil.mkdirP(fsPath);
    });
}
exports.mkdirP = mkdirP;
/**
 * Returns path of a tool had the tool actually been invoked.  Resolves via paths.
 * If you check and the tool does not exist, it will throw.
 *
 * @param     tool              name of the tool
 * @param     check             whether to check if tool exists
 * @returns   Promise<string>   path to tool
 */
function which(tool, check) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!tool) {
            throw new Error("parameter 'tool' is required");
        }
        // recursive when check=true
        if (check) {
            const result = yield which(tool, false);
            if (!result) {
                if (ioUtil.IS_WINDOWS) {
                    throw new Error(`Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also verify the file has a valid extension for an executable file.`);
                }
                else {
                    throw new Error(`Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also check the file mode to verify the file is executable.`);
                }
            }
        }
        try {
            // build the list of extensions to try
            const extensions = [];
            if (ioUtil.IS_WINDOWS && process.env.PATHEXT) {
                for (const extension of process.env.PATHEXT.split(path.delimiter)) {
                    if (extension) {
                        extensions.push(extension);
                    }
                }
            }
            // if it's rooted, return it if exists. otherwise return empty.
            if (ioUtil.isRooted(tool)) {
                const filePath = yield ioUtil.tryGetExecutablePath(tool, extensions);
                if (filePath) {
                    return filePath;
                }
                return '';
            }
            // if any path separators, return empty
            if (tool.includes('/') || (ioUtil.IS_WINDOWS && tool.includes('\\'))) {
                return '';
            }
            // build the list of directories
            //
            // Note, technically "where" checks the current directory on Windows. From a toolkit perspective,
            // it feels like we should not do this. Checking the current directory seems like more of a use
            // case of a shell, and the which() function exposed by the toolkit should strive for consistency
            // across platforms.
            const directories = [];
            if (process.env.PATH) {
                for (const p of process.env.PATH.split(path.delimiter)) {
                    if (p) {
                        directories.push(p);
                    }
                }
            }
            // return the first match
            for (const directory of directories) {
                const filePath = yield ioUtil.tryGetExecutablePath(directory + path.sep + tool, extensions);
                if (filePath) {
                    return filePath;
                }
            }
            return '';
        }
        catch (err) {
            throw new Error(`which failed with message ${err.message}`);
        }
    });
}
exports.which = which;
function readCopyOptions(options) {
    const force = options.force == null ? true : options.force;
    const recursive = Boolean(options.recursive);
    return { force, recursive };
}
function cpDirRecursive(sourceDir, destDir, currentDepth, force) {
    return __awaiter(this, void 0, void 0, function* () {
        // Ensure there is not a run away recursive copy
        if (currentDepth >= 255)
            return;
        currentDepth++;
        yield mkdirP(destDir);
        const files = yield ioUtil.readdir(sourceDir);
        for (const fileName of files) {
            const srcFile = `${sourceDir}/${fileName}`;
            const destFile = `${destDir}/${fileName}`;
            const srcFileStat = yield ioUtil.lstat(srcFile);
            if (srcFileStat.isDirectory()) {
                // Recurse
                yield cpDirRecursive(srcFile, destFile, currentDepth, force);
            }
            else {
                yield copyFile(srcFile, destFile, force);
            }
        }
        // Change the mode for the newly created directory
        yield ioUtil.chmod(destDir, (yield ioUtil.stat(sourceDir)).mode);
    });
}
// Buffered file copy
function copyFile(srcFile, destFile, force) {
    return __awaiter(this, void 0, void 0, function* () {
        if ((yield ioUtil.lstat(srcFile)).isSymbolicLink()) {
            // unlink/re-link it
            try {
                yield ioUtil.lstat(destFile);
                yield ioUtil.unlink(destFile);
            }
            catch (e) {
                // Try to override file permission
                if (e.code === 'EPERM') {
                    yield ioUtil.chmod(destFile, '0666');
                    yield ioUtil.unlink(destFile);
                }
                // other errors = it doesn't exist, no work to do
            }
            // Copy over symlink
            const symlinkFull = yield ioUtil.readlink(srcFile);
            yield ioUtil.symlink(symlinkFull, destFile, ioUtil.IS_WINDOWS ? 'junction' : null);
        }
        else if (!(yield ioUtil.exists(destFile)) || force) {
            yield ioUtil.copyFile(srcFile, destFile);
        }
    });
}

});

unwrapExports(io);

var toolrunner = createCommonjsModule(function (module, exports) {
var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });






/* eslint-disable @typescript-eslint/unbound-method */
const IS_WINDOWS = process.platform === 'win32';
/*
 * Class for running command line tools. Handles quoting and arg parsing in a platform agnostic way.
 */
class ToolRunner extends events.EventEmitter {
    constructor(toolPath, args, options) {
        super();
        if (!toolPath) {
            throw new Error("Parameter 'toolPath' cannot be null or empty.");
        }
        this.toolPath = toolPath;
        this.args = args || [];
        this.options = options || {};
    }
    _debug(message) {
        if (this.options.listeners && this.options.listeners.debug) {
            this.options.listeners.debug(message);
        }
    }
    _getCommandString(options, noPrefix) {
        const toolPath = this._getSpawnFileName();
        const args = this._getSpawnArgs(options);
        let cmd = noPrefix ? '' : '[command]'; // omit prefix when piped to a second tool
        if (IS_WINDOWS) {
            // Windows + cmd file
            if (this._isCmdFile()) {
                cmd += toolPath;
                for (const a of args) {
                    cmd += ` ${a}`;
                }
            }
            // Windows + verbatim
            else if (options.windowsVerbatimArguments) {
                cmd += `"${toolPath}"`;
                for (const a of args) {
                    cmd += ` ${a}`;
                }
            }
            // Windows (regular)
            else {
                cmd += this._windowsQuoteCmdArg(toolPath);
                for (const a of args) {
                    cmd += ` ${this._windowsQuoteCmdArg(a)}`;
                }
            }
        }
        else {
            // OSX/Linux - this can likely be improved with some form of quoting.
            // creating processes on Unix is fundamentally different than Windows.
            // on Unix, execvp() takes an arg array.
            cmd += toolPath;
            for (const a of args) {
                cmd += ` ${a}`;
            }
        }
        return cmd;
    }
    _processLineBuffer(data, strBuffer, onLine) {
        try {
            let s = strBuffer + data.toString();
            let n = s.indexOf(os.EOL);
            while (n > -1) {
                const line = s.substring(0, n);
                onLine(line);
                // the rest of the string ...
                s = s.substring(n + os.EOL.length);
                n = s.indexOf(os.EOL);
            }
            strBuffer = s;
        }
        catch (err) {
            // streaming lines to console is best effort.  Don't fail a build.
            this._debug(`error processing line. Failed with error ${err}`);
        }
    }
    _getSpawnFileName() {
        if (IS_WINDOWS) {
            if (this._isCmdFile()) {
                return process.env['COMSPEC'] || 'cmd.exe';
            }
        }
        return this.toolPath;
    }
    _getSpawnArgs(options) {
        if (IS_WINDOWS) {
            if (this._isCmdFile()) {
                let argline = `/D /S /C "${this._windowsQuoteCmdArg(this.toolPath)}`;
                for (const a of this.args) {
                    argline += ' ';
                    argline += options.windowsVerbatimArguments
                        ? a
                        : this._windowsQuoteCmdArg(a);
                }
                argline += '"';
                return [argline];
            }
        }
        return this.args;
    }
    _endsWith(str, end) {
        return str.endsWith(end);
    }
    _isCmdFile() {
        const upperToolPath = this.toolPath.toUpperCase();
        return (this._endsWith(upperToolPath, '.CMD') ||
            this._endsWith(upperToolPath, '.BAT'));
    }
    _windowsQuoteCmdArg(arg) {
        // for .exe, apply the normal quoting rules that libuv applies
        if (!this._isCmdFile()) {
            return this._uvQuoteCmdArg(arg);
        }
        // otherwise apply quoting rules specific to the cmd.exe command line parser.
        // the libuv rules are generic and are not designed specifically for cmd.exe
        // command line parser.
        //
        // for a detailed description of the cmd.exe command line parser, refer to
        // http://stackoverflow.com/questions/4094699/how-does-the-windows-command-interpreter-cmd-exe-parse-scripts/7970912#7970912
        // need quotes for empty arg
        if (!arg) {
            return '""';
        }
        // determine whether the arg needs to be quoted
        const cmdSpecialChars = [
            ' ',
            '\t',
            '&',
            '(',
            ')',
            '[',
            ']',
            '{',
            '}',
            '^',
            '=',
            ';',
            '!',
            "'",
            '+',
            ',',
            '`',
            '~',
            '|',
            '<',
            '>',
            '"'
        ];
        let needsQuotes = false;
        for (const char of arg) {
            if (cmdSpecialChars.some(x => x === char)) {
                needsQuotes = true;
                break;
            }
        }
        // short-circuit if quotes not needed
        if (!needsQuotes) {
            return arg;
        }
        // the following quoting rules are very similar to the rules that by libuv applies.
        //
        // 1) wrap the string in quotes
        //
        // 2) double-up quotes - i.e. " => ""
        //
        //    this is different from the libuv quoting rules. libuv replaces " with \", which unfortunately
        //    doesn't work well with a cmd.exe command line.
        //
        //    note, replacing " with "" also works well if the arg is passed to a downstream .NET console app.
        //    for example, the command line:
        //          foo.exe "myarg:""my val"""
        //    is parsed by a .NET console app into an arg array:
        //          [ "myarg:\"my val\"" ]
        //    which is the same end result when applying libuv quoting rules. although the actual
        //    command line from libuv quoting rules would look like:
        //          foo.exe "myarg:\"my val\""
        //
        // 3) double-up slashes that precede a quote,
        //    e.g.  hello \world    => "hello \world"
        //          hello\"world    => "hello\\""world"
        //          hello\\"world   => "hello\\\\""world"
        //          hello world\    => "hello world\\"
        //
        //    technically this is not required for a cmd.exe command line, or the batch argument parser.
        //    the reasons for including this as a .cmd quoting rule are:
        //
        //    a) this is optimized for the scenario where the argument is passed from the .cmd file to an
        //       external program. many programs (e.g. .NET console apps) rely on the slash-doubling rule.
        //
        //    b) it's what we've been doing previously (by deferring to node default behavior) and we
        //       haven't heard any complaints about that aspect.
        //
        // note, a weakness of the quoting rules chosen here, is that % is not escaped. in fact, % cannot be
        // escaped when used on the command line directly - even though within a .cmd file % can be escaped
        // by using %%.
        //
        // the saving grace is, on the command line, %var% is left as-is if var is not defined. this contrasts
        // the line parsing rules within a .cmd file, where if var is not defined it is replaced with nothing.
        //
        // one option that was explored was replacing % with ^% - i.e. %var% => ^%var^%. this hack would
        // often work, since it is unlikely that var^ would exist, and the ^ character is removed when the
        // variable is used. the problem, however, is that ^ is not removed when %* is used to pass the args
        // to an external program.
        //
        // an unexplored potential solution for the % escaping problem, is to create a wrapper .cmd file.
        // % can be escaped within a .cmd file.
        let reverse = '"';
        let quoteHit = true;
        for (let i = arg.length; i > 0; i--) {
            // walk the string in reverse
            reverse += arg[i - 1];
            if (quoteHit && arg[i - 1] === '\\') {
                reverse += '\\'; // double the slash
            }
            else if (arg[i - 1] === '"') {
                quoteHit = true;
                reverse += '"'; // double the quote
            }
            else {
                quoteHit = false;
            }
        }
        reverse += '"';
        return reverse
            .split('')
            .reverse()
            .join('');
    }
    _uvQuoteCmdArg(arg) {
        // Tool runner wraps child_process.spawn() and needs to apply the same quoting as
        // Node in certain cases where the undocumented spawn option windowsVerbatimArguments
        // is used.
        //
        // Since this function is a port of quote_cmd_arg from Node 4.x (technically, lib UV,
        // see https://github.com/nodejs/node/blob/v4.x/deps/uv/src/win/process.c for details),
        // pasting copyright notice from Node within this function:
        //
        //      Copyright Joyent, Inc. and other Node contributors. All rights reserved.
        //
        //      Permission is hereby granted, free of charge, to any person obtaining a copy
        //      of this software and associated documentation files (the "Software"), to
        //      deal in the Software without restriction, including without limitation the
        //      rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
        //      sell copies of the Software, and to permit persons to whom the Software is
        //      furnished to do so, subject to the following conditions:
        //
        //      The above copyright notice and this permission notice shall be included in
        //      all copies or substantial portions of the Software.
        //
        //      THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
        //      IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
        //      FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
        //      AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
        //      LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
        //      FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
        //      IN THE SOFTWARE.
        if (!arg) {
            // Need double quotation for empty argument
            return '""';
        }
        if (!arg.includes(' ') && !arg.includes('\t') && !arg.includes('"')) {
            // No quotation needed
            return arg;
        }
        if (!arg.includes('"') && !arg.includes('\\')) {
            // No embedded double quotes or backslashes, so I can just wrap
            // quote marks around the whole thing.
            return `"${arg}"`;
        }
        // Expected input/output:
        //   input : hello"world
        //   output: "hello\"world"
        //   input : hello""world
        //   output: "hello\"\"world"
        //   input : hello\world
        //   output: hello\world
        //   input : hello\\world
        //   output: hello\\world
        //   input : hello\"world
        //   output: "hello\\\"world"
        //   input : hello\\"world
        //   output: "hello\\\\\"world"
        //   input : hello world\
        //   output: "hello world\\" - note the comment in libuv actually reads "hello world\"
        //                             but it appears the comment is wrong, it should be "hello world\\"
        let reverse = '"';
        let quoteHit = true;
        for (let i = arg.length; i > 0; i--) {
            // walk the string in reverse
            reverse += arg[i - 1];
            if (quoteHit && arg[i - 1] === '\\') {
                reverse += '\\';
            }
            else if (arg[i - 1] === '"') {
                quoteHit = true;
                reverse += '\\';
            }
            else {
                quoteHit = false;
            }
        }
        reverse += '"';
        return reverse
            .split('')
            .reverse()
            .join('');
    }
    _cloneExecOptions(options) {
        options = options || {};
        const result = {
            cwd: options.cwd || process.cwd(),
            env: options.env || process.env,
            silent: options.silent || false,
            windowsVerbatimArguments: options.windowsVerbatimArguments || false,
            failOnStdErr: options.failOnStdErr || false,
            ignoreReturnCode: options.ignoreReturnCode || false,
            delay: options.delay || 10000
        };
        result.outStream = options.outStream || process.stdout;
        result.errStream = options.errStream || process.stderr;
        return result;
    }
    _getSpawnOptions(options, toolPath) {
        options = options || {};
        const result = {};
        result.cwd = options.cwd;
        result.env = options.env;
        result['windowsVerbatimArguments'] =
            options.windowsVerbatimArguments || this._isCmdFile();
        if (options.windowsVerbatimArguments) {
            result.argv0 = `"${toolPath}"`;
        }
        return result;
    }
    /**
     * Exec a tool.
     * Output will be streamed to the live console.
     * Returns promise with return code
     *
     * @param     tool     path to tool to exec
     * @param     options  optional exec options.  See ExecOptions
     * @returns   number
     */
    exec() {
        return __awaiter(this, void 0, void 0, function* () {
            // root the tool path if it is unrooted and contains relative pathing
            if (!ioUtil.isRooted(this.toolPath) &&
                (this.toolPath.includes('/') ||
                    (IS_WINDOWS && this.toolPath.includes('\\')))) {
                // prefer options.cwd if it is specified, however options.cwd may also need to be rooted
                this.toolPath = path.resolve(process.cwd(), this.options.cwd || process.cwd(), this.toolPath);
            }
            // if the tool is only a file name, then resolve it from the PATH
            // otherwise verify it exists (add extension on Windows if necessary)
            this.toolPath = yield io.which(this.toolPath, true);
            return new Promise((resolve, reject) => {
                this._debug(`exec tool: ${this.toolPath}`);
                this._debug('arguments:');
                for (const arg of this.args) {
                    this._debug(`   ${arg}`);
                }
                const optionsNonNull = this._cloneExecOptions(this.options);
                if (!optionsNonNull.silent && optionsNonNull.outStream) {
                    optionsNonNull.outStream.write(this._getCommandString(optionsNonNull) + os.EOL);
                }
                const state = new ExecState(optionsNonNull, this.toolPath);
                state.on('debug', (message) => {
                    this._debug(message);
                });
                const fileName = this._getSpawnFileName();
                const cp = child_process.spawn(fileName, this._getSpawnArgs(optionsNonNull), this._getSpawnOptions(this.options, fileName));
                const stdbuffer = '';
                if (cp.stdout) {
                    cp.stdout.on('data', (data) => {
                        if (this.options.listeners && this.options.listeners.stdout) {
                            this.options.listeners.stdout(data);
                        }
                        if (!optionsNonNull.silent && optionsNonNull.outStream) {
                            optionsNonNull.outStream.write(data);
                        }
                        this._processLineBuffer(data, stdbuffer, (line) => {
                            if (this.options.listeners && this.options.listeners.stdline) {
                                this.options.listeners.stdline(line);
                            }
                        });
                    });
                }
                const errbuffer = '';
                if (cp.stderr) {
                    cp.stderr.on('data', (data) => {
                        state.processStderr = true;
                        if (this.options.listeners && this.options.listeners.stderr) {
                            this.options.listeners.stderr(data);
                        }
                        if (!optionsNonNull.silent &&
                            optionsNonNull.errStream &&
                            optionsNonNull.outStream) {
                            const s = optionsNonNull.failOnStdErr
                                ? optionsNonNull.errStream
                                : optionsNonNull.outStream;
                            s.write(data);
                        }
                        this._processLineBuffer(data, errbuffer, (line) => {
                            if (this.options.listeners && this.options.listeners.errline) {
                                this.options.listeners.errline(line);
                            }
                        });
                    });
                }
                cp.on('error', (err) => {
                    state.processError = err.message;
                    state.processExited = true;
                    state.processClosed = true;
                    state.CheckComplete();
                });
                cp.on('exit', (code) => {
                    state.processExitCode = code;
                    state.processExited = true;
                    this._debug(`Exit code ${code} received from tool '${this.toolPath}'`);
                    state.CheckComplete();
                });
                cp.on('close', (code) => {
                    state.processExitCode = code;
                    state.processExited = true;
                    state.processClosed = true;
                    this._debug(`STDIO streams have closed for tool '${this.toolPath}'`);
                    state.CheckComplete();
                });
                state.on('done', (error, exitCode) => {
                    if (stdbuffer.length > 0) {
                        this.emit('stdline', stdbuffer);
                    }
                    if (errbuffer.length > 0) {
                        this.emit('errline', errbuffer);
                    }
                    cp.removeAllListeners();
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(exitCode);
                    }
                });
            });
        });
    }
}
exports.ToolRunner = ToolRunner;
/**
 * Convert an arg string to an array of args. Handles escaping
 *
 * @param    argString   string of arguments
 * @returns  string[]    array of arguments
 */
function argStringToArray(argString) {
    const args = [];
    let inQuotes = false;
    let escaped = false;
    let arg = '';
    function append(c) {
        // we only escape double quotes.
        if (escaped && c !== '"') {
            arg += '\\';
        }
        arg += c;
        escaped = false;
    }
    for (let i = 0; i < argString.length; i++) {
        const c = argString.charAt(i);
        if (c === '"') {
            if (!escaped) {
                inQuotes = !inQuotes;
            }
            else {
                append(c);
            }
            continue;
        }
        if (c === '\\' && escaped) {
            append(c);
            continue;
        }
        if (c === '\\' && inQuotes) {
            escaped = true;
            continue;
        }
        if (c === ' ' && !inQuotes) {
            if (arg.length > 0) {
                args.push(arg);
                arg = '';
            }
            continue;
        }
        append(c);
    }
    if (arg.length > 0) {
        args.push(arg.trim());
    }
    return args;
}
exports.argStringToArray = argStringToArray;
class ExecState extends events.EventEmitter {
    constructor(options, toolPath) {
        super();
        this.processClosed = false; // tracks whether the process has exited and stdio is closed
        this.processError = '';
        this.processExitCode = 0;
        this.processExited = false; // tracks whether the process has exited
        this.processStderr = false; // tracks whether stderr was written to
        this.delay = 10000; // 10 seconds
        this.done = false;
        this.timeout = null;
        if (!toolPath) {
            throw new Error('toolPath must not be empty');
        }
        this.options = options;
        this.toolPath = toolPath;
        if (options.delay) {
            this.delay = options.delay;
        }
    }
    CheckComplete() {
        if (this.done) {
            return;
        }
        if (this.processClosed) {
            this._setResult();
        }
        else if (this.processExited) {
            this.timeout = setTimeout(ExecState.HandleTimeout, this.delay, this);
        }
    }
    _debug(message) {
        this.emit('debug', message);
    }
    _setResult() {
        // determine whether there is an error
        let error;
        if (this.processExited) {
            if (this.processError) {
                error = new Error(`There was an error when attempting to execute the process '${this.toolPath}'. This may indicate the process failed to start. Error: ${this.processError}`);
            }
            else if (this.processExitCode !== 0 && !this.options.ignoreReturnCode) {
                error = new Error(`The process '${this.toolPath}' failed with exit code ${this.processExitCode}`);
            }
            else if (this.processStderr && this.options.failOnStdErr) {
                error = new Error(`The process '${this.toolPath}' failed because one or more lines were written to the STDERR stream`);
            }
        }
        // clear the timeout
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
        this.done = true;
        this.emit('done', error, this.processExitCode);
    }
    static HandleTimeout(state) {
        if (state.done) {
            return;
        }
        if (!state.processClosed && state.processExited) {
            const message = `The STDIO streams did not close within ${state.delay /
                1000} seconds of the exit event from process '${state.toolPath}'. This may indicate a child process inherited the STDIO streams and has not yet exited.`;
            state._debug(message);
        }
        state._setResult();
    }
}

});

unwrapExports(toolrunner);

var exec_1 = createCommonjsModule(function (module, exports) {
var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });

/**
 * Exec a command.
 * Output will be streamed to the live console.
 * Returns promise with return code
 *
 * @param     commandLine        command to execute (can include additional args). Must be correctly escaped.
 * @param     args               optional arguments for tool. Escaping is handled by the lib.
 * @param     options            optional exec options.  See ExecOptions
 * @returns   Promise<number>    exit code
 */
function exec(commandLine, args, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const commandArgs = toolrunner.argStringToArray(commandLine);
        if (commandArgs.length === 0) {
            throw new Error(`Parameter 'commandLine' cannot be null or empty.`);
        }
        // Path to tool to execute should be first arg
        const toolPath = commandArgs[0];
        args = commandArgs.slice(1).concat(args || []);
        const runner = new toolrunner.ToolRunner(toolPath, args, options);
        return runner.exec();
    });
}
exports.exec = exec;

});

unwrapExports(exec_1);
var exec_2 = exec_1.exec;

var command = createCommonjsModule(function (module, exports) {
var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const os$1 = __importStar(os);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os$1.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return (s || '')
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return (s || '')
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}

});

unwrapExports(command);

var core = createCommonjsModule(function (module, exports) {
var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });

const os$1 = __importStar(os);
const path$1 = __importStar(path);
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable
 */
function exportVariable(name, val) {
    process.env[name] = val;
    command.issueCommand('set-env', { name }, val);
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    command.issueCommand('add-path', {}, inputPath);
    process.env['PATH'] = `${inputPath}${path$1.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.  The value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store
 */
function setOutput(name, value) {
    command.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message
 */
function error(message) {
    command.issue('error', message);
}
exports.error = error;
/**
 * Adds an warning issue
 * @param message warning issue message
 */
function warning(message) {
    command.issue('warning', message);
}
exports.warning = warning;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os$1.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store
 */
function saveState(name, value) {
    command.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;

});

unwrapExports(core);
var core_5 = core.getInput;
var core_7 = core.setFailed;
var core_12 = core.startGroup;
var core_13 = core.endGroup;

/*!
 * isobject <https://github.com/jonschlinkert/isobject>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

function isObject(val) {
  return val != null && typeof val === 'object' && Array.isArray(val) === false;
}

/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

function isObjectObject(o) {
  return isObject(o) === true
    && Object.prototype.toString.call(o) === '[object Object]';
}

function isPlainObject(o) {
  var ctor,prot;

  if (isObjectObject(o) === false) return false;

  // If has modified constructor
  ctor = o.constructor;
  if (typeof ctor !== 'function') return false;

  // If has modified prototype
  prot = ctor.prototype;
  if (isObjectObject(prot) === false) return false;

  // If constructor does not have an Object-specific method
  if (prot.hasOwnProperty('isPrototypeOf') === false) {
    return false;
  }

  // Most likely a plain Object
  return true;
}

function getUserAgent() {
    try {
        return navigator.userAgent;
    }
    catch (e) {
        return "<environment undetectable>";
    }
}

function lowercaseKeys(object) {
    if (!object) {
        return {};
    }
    return Object.keys(object).reduce((newObj, key) => {
        newObj[key.toLowerCase()] = object[key];
        return newObj;
    }, {});
}

function mergeDeep(defaults, options) {
    const result = Object.assign({}, defaults);
    Object.keys(options).forEach(key => {
        if (isPlainObject(options[key])) {
            if (!(key in defaults))
                Object.assign(result, { [key]: options[key] });
            else
                result[key] = mergeDeep(defaults[key], options[key]);
        }
        else {
            Object.assign(result, { [key]: options[key] });
        }
    });
    return result;
}

function merge(defaults, route, options) {
    if (typeof route === "string") {
        let [method, url] = route.split(" ");
        options = Object.assign(url ? { method, url } : { url: method }, options);
    }
    else {
        options = Object.assign({}, route);
    }
    // lowercase header names before merging with defaults to avoid duplicates
    options.headers = lowercaseKeys(options.headers);
    const mergedOptions = mergeDeep(defaults || {}, options);
    // mediaType.previews arrays are merged, instead of overwritten
    if (defaults && defaults.mediaType.previews.length) {
        mergedOptions.mediaType.previews = defaults.mediaType.previews
            .filter(preview => !mergedOptions.mediaType.previews.includes(preview))
            .concat(mergedOptions.mediaType.previews);
    }
    mergedOptions.mediaType.previews = mergedOptions.mediaType.previews.map((preview) => preview.replace(/-preview/, ""));
    return mergedOptions;
}

function addQueryParameters(url, parameters) {
    const separator = /\?/.test(url) ? "&" : "?";
    const names = Object.keys(parameters);
    if (names.length === 0) {
        return url;
    }
    return (url +
        separator +
        names
            .map(name => {
            if (name === "q") {
                return ("q=" +
                    parameters
                        .q.split("+")
                        .map(encodeURIComponent)
                        .join("+"));
            }
            return `${name}=${encodeURIComponent(parameters[name])}`;
        })
            .join("&"));
}

const urlVariableRegex = /\{[^}]+\}/g;
function removeNonChars(variableName) {
    return variableName.replace(/^\W+|\W+$/g, "").split(/,/);
}
function extractUrlVariableNames(url) {
    const matches = url.match(urlVariableRegex);
    if (!matches) {
        return [];
    }
    return matches.map(removeNonChars).reduce((a, b) => a.concat(b), []);
}

function omit(object, keysToOmit) {
    return Object.keys(object)
        .filter(option => !keysToOmit.includes(option))
        .reduce((obj, key) => {
        obj[key] = object[key];
        return obj;
    }, {});
}

// Based on https://github.com/bramstein/url-template, licensed under BSD
// TODO: create separate package.
//
// Copyright (c) 2012-2014, Bram Stein
// All rights reserved.
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions
// are met:
//  1. Redistributions of source code must retain the above copyright
//     notice, this list of conditions and the following disclaimer.
//  2. Redistributions in binary form must reproduce the above copyright
//     notice, this list of conditions and the following disclaimer in the
//     documentation and/or other materials provided with the distribution.
//  3. The name of the author may not be used to endorse or promote products
//     derived from this software without specific prior written permission.
// THIS SOFTWARE IS PROVIDED BY THE AUTHOR "AS IS" AND ANY EXPRESS OR IMPLIED
// WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO
// EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
// INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
// BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
// OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
// NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
// EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
/* istanbul ignore file */
function encodeReserved(str) {
    return str
        .split(/(%[0-9A-Fa-f]{2})/g)
        .map(function (part) {
        if (!/%[0-9A-Fa-f]/.test(part)) {
            part = encodeURI(part)
                .replace(/%5B/g, "[")
                .replace(/%5D/g, "]");
        }
        return part;
    })
        .join("");
}
function encodeUnreserved(str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
        return ("%" +
            c
                .charCodeAt(0)
                .toString(16)
                .toUpperCase());
    });
}
function encodeValue(operator, value, key) {
    value =
        operator === "+" || operator === "#"
            ? encodeReserved(value)
            : encodeUnreserved(value);
    if (key) {
        return encodeUnreserved(key) + "=" + value;
    }
    else {
        return value;
    }
}
function isDefined(value) {
    return value !== undefined && value !== null;
}
function isKeyOperator(operator) {
    return operator === ";" || operator === "&" || operator === "?";
}
function getValues(context, operator, key, modifier) {
    var value = context[key], result = [];
    if (isDefined(value) && value !== "") {
        if (typeof value === "string" ||
            typeof value === "number" ||
            typeof value === "boolean") {
            value = value.toString();
            if (modifier && modifier !== "*") {
                value = value.substring(0, parseInt(modifier, 10));
            }
            result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : ""));
        }
        else {
            if (modifier === "*") {
                if (Array.isArray(value)) {
                    value.filter(isDefined).forEach(function (value) {
                        result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : ""));
                    });
                }
                else {
                    Object.keys(value).forEach(function (k) {
                        if (isDefined(value[k])) {
                            result.push(encodeValue(operator, value[k], k));
                        }
                    });
                }
            }
            else {
                const tmp = [];
                if (Array.isArray(value)) {
                    value.filter(isDefined).forEach(function (value) {
                        tmp.push(encodeValue(operator, value));
                    });
                }
                else {
                    Object.keys(value).forEach(function (k) {
                        if (isDefined(value[k])) {
                            tmp.push(encodeUnreserved(k));
                            tmp.push(encodeValue(operator, value[k].toString()));
                        }
                    });
                }
                if (isKeyOperator(operator)) {
                    result.push(encodeUnreserved(key) + "=" + tmp.join(","));
                }
                else if (tmp.length !== 0) {
                    result.push(tmp.join(","));
                }
            }
        }
    }
    else {
        if (operator === ";") {
            if (isDefined(value)) {
                result.push(encodeUnreserved(key));
            }
        }
        else if (value === "" && (operator === "&" || operator === "?")) {
            result.push(encodeUnreserved(key) + "=");
        }
        else if (value === "") {
            result.push("");
        }
    }
    return result;
}
function parseUrl(template) {
    return {
        expand: expand.bind(null, template)
    };
}
function expand(template, context) {
    var operators = ["+", "#", ".", "/", ";", "?", "&"];
    return template.replace(/\{([^\{\}]+)\}|([^\{\}]+)/g, function (_, expression, literal) {
        if (expression) {
            let operator = "";
            const values = [];
            if (operators.indexOf(expression.charAt(0)) !== -1) {
                operator = expression.charAt(0);
                expression = expression.substr(1);
            }
            expression.split(/,/g).forEach(function (variable) {
                var tmp = /([^:\*]*)(?::(\d+)|(\*))?/.exec(variable);
                values.push(getValues(context, operator, tmp[1], tmp[2] || tmp[3]));
            });
            if (operator && operator !== "+") {
                var separator = ",";
                if (operator === "?") {
                    separator = "&";
                }
                else if (operator !== "#") {
                    separator = operator;
                }
                return (values.length !== 0 ? operator : "") + values.join(separator);
            }
            else {
                return values.join(",");
            }
        }
        else {
            return encodeReserved(literal);
        }
    });
}

function parse(options) {
    // https://fetch.spec.whatwg.org/#methods
    let method = options.method.toUpperCase();
    // replace :varname with {varname} to make it RFC 6570 compatible
    let url = (options.url || "/").replace(/:([a-z]\w+)/g, "{+$1}");
    let headers = Object.assign({}, options.headers);
    let body;
    let parameters = omit(options, [
        "method",
        "baseUrl",
        "url",
        "headers",
        "request",
        "mediaType"
    ]);
    // extract variable names from URL to calculate remaining variables later
    const urlVariableNames = extractUrlVariableNames(url);
    url = parseUrl(url).expand(parameters);
    if (!/^http/.test(url)) {
        url = options.baseUrl + url;
    }
    const omittedParameters = Object.keys(options)
        .filter(option => urlVariableNames.includes(option))
        .concat("baseUrl");
    const remainingParameters = omit(parameters, omittedParameters);
    const isBinaryRequset = /application\/octet-stream/i.test(headers.accept);
    if (!isBinaryRequset) {
        if (options.mediaType.format) {
            // e.g. application/vnd.github.v3+json => application/vnd.github.v3.raw
            headers.accept = headers.accept
                .split(/,/)
                .map(preview => preview.replace(/application\/vnd(\.\w+)(\.v3)?(\.\w+)?(\+json)?$/, `application/vnd$1$2.${options.mediaType.format}`))
                .join(",");
        }
        if (options.mediaType.previews.length) {
            const previewsFromAcceptHeader = headers.accept.match(/[\w-]+(?=-preview)/g) || [];
            headers.accept = previewsFromAcceptHeader
                .concat(options.mediaType.previews)
                .map(preview => {
                const format = options.mediaType.format
                    ? `.${options.mediaType.format}`
                    : "+json";
                return `application/vnd.github.${preview}-preview${format}`;
            })
                .join(",");
        }
    }
    // for GET/HEAD requests, set URL query parameters from remaining parameters
    // for PATCH/POST/PUT/DELETE requests, set request body from remaining parameters
    if (["GET", "HEAD"].includes(method)) {
        url = addQueryParameters(url, remainingParameters);
    }
    else {
        if ("data" in remainingParameters) {
            body = remainingParameters.data;
        }
        else {
            if (Object.keys(remainingParameters).length) {
                body = remainingParameters;
            }
            else {
                headers["content-length"] = 0;
            }
        }
    }
    // default content-type for JSON if body is set
    if (!headers["content-type"] && typeof body !== "undefined") {
        headers["content-type"] = "application/json; charset=utf-8";
    }
    // GitHub expects 'content-length: 0' header for PUT/PATCH requests without body.
    // fetch does not allow to set `content-length` header, but we can set body to an empty string
    if (["PATCH", "PUT"].includes(method) && typeof body === "undefined") {
        body = "";
    }
    // Only return body/request keys if present
    return Object.assign({ method, url, headers }, typeof body !== "undefined" ? { body } : null, options.request ? { request: options.request } : null);
}

function endpointWithDefaults(defaults, route, options) {
    return parse(merge(defaults, route, options));
}

function withDefaults(oldDefaults, newDefaults) {
    const DEFAULTS = merge(oldDefaults, newDefaults);
    const endpoint = endpointWithDefaults.bind(null, DEFAULTS);
    return Object.assign(endpoint, {
        DEFAULTS,
        defaults: withDefaults.bind(null, DEFAULTS),
        merge: merge.bind(null, DEFAULTS),
        parse
    });
}

const VERSION = "5.5.3";

const userAgent = `octokit-endpoint.js/${VERSION} ${getUserAgent()}`;
// DEFAULTS has all properties set that EndpointOptions has, except url.
// So we use RequestParameters and add method as additional required property.
const DEFAULTS = {
    method: "GET",
    baseUrl: "https://api.github.com",
    headers: {
        accept: "application/vnd.github.v3+json",
        "user-agent": userAgent
    },
    mediaType: {
        format: "",
        previews: []
    }
};

const endpoint = withDefaults(null, DEFAULTS);

function getUserAgent$1() {
    try {
        return navigator.userAgent;
    }
    catch (e) {
        return "<environment undetectable>";
    }
}

// Based on https://github.com/tmpvar/jsdom/blob/aa85b2abf07766ff7bf5c1f6daafb3726f2f2db5/lib/jsdom/living/blob.js

// fix for "Readable" isn't a named export issue
const Readable = Stream.Readable;

const BUFFER = Symbol('buffer');
const TYPE = Symbol('type');

class Blob {
	constructor() {
		this[TYPE] = '';

		const blobParts = arguments[0];
		const options = arguments[1];

		const buffers = [];

		if (blobParts) {
			const a = blobParts;
			const length = Number(a.length);
			for (let i = 0; i < length; i++) {
				const element = a[i];
				let buffer;
				if (element instanceof Buffer) {
					buffer = element;
				} else if (ArrayBuffer.isView(element)) {
					buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
				} else if (element instanceof ArrayBuffer) {
					buffer = Buffer.from(element);
				} else if (element instanceof Blob) {
					buffer = element[BUFFER];
				} else {
					buffer = Buffer.from(typeof element === 'string' ? element : String(element));
				}
				buffers.push(buffer);
			}
		}

		this[BUFFER] = Buffer.concat(buffers);

		let type = options && options.type !== undefined && String(options.type).toLowerCase();
		if (type && !/[^\u0020-\u007E]/.test(type)) {
			this[TYPE] = type;
		}
	}
	get size() {
		return this[BUFFER].length;
	}
	get type() {
		return this[TYPE];
	}
	text() {
		return Promise.resolve(this[BUFFER].toString());
	}
	arrayBuffer() {
		const buf = this[BUFFER];
		const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		return Promise.resolve(ab);
	}
	stream() {
		const readable = new Readable();
		readable._read = function () {};
		readable.push(this[BUFFER]);
		readable.push(null);
		return readable;
	}
	toString() {
		return '[object Blob]';
	}
	slice() {
		const size = this.size;

		const start = arguments[0];
		const end = arguments[1];
		let relativeStart, relativeEnd;
		if (start === undefined) {
			relativeStart = 0;
		} else if (start < 0) {
			relativeStart = Math.max(size + start, 0);
		} else {
			relativeStart = Math.min(start, size);
		}
		if (end === undefined) {
			relativeEnd = size;
		} else if (end < 0) {
			relativeEnd = Math.max(size + end, 0);
		} else {
			relativeEnd = Math.min(end, size);
		}
		const span = Math.max(relativeEnd - relativeStart, 0);

		const buffer = this[BUFFER];
		const slicedBuffer = buffer.slice(relativeStart, relativeStart + span);
		const blob = new Blob([], { type: arguments[2] });
		blob[BUFFER] = slicedBuffer;
		return blob;
	}
}

Object.defineProperties(Blob.prototype, {
	size: { enumerable: true },
	type: { enumerable: true },
	slice: { enumerable: true }
});

Object.defineProperty(Blob.prototype, Symbol.toStringTag, {
	value: 'Blob',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * fetch-error.js
 *
 * FetchError interface for operational errors
 */

/**
 * Create FetchError instance
 *
 * @param   String      message      Error message for human
 * @param   String      type         Error type for machine
 * @param   String      systemError  For Node.js system error
 * @return  FetchError
 */
function FetchError(message, type, systemError) {
  Error.call(this, message);

  this.message = message;
  this.type = type;

  // when err.type is `system`, err.code contains system error code
  if (systemError) {
    this.code = this.errno = systemError.code;
  }

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

FetchError.prototype = Object.create(Error.prototype);
FetchError.prototype.constructor = FetchError;
FetchError.prototype.name = 'FetchError';

let convert;
try {
	convert = require('encoding').convert;
} catch (e) {}

const INTERNALS = Symbol('Body internals');

// fix an issue where "PassThrough" isn't a named export for node <10
const PassThrough = Stream.PassThrough;

/**
 * Body mixin
 *
 * Ref: https://fetch.spec.whatwg.org/#body
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
function Body(body) {
	var _this = this;

	var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
	    _ref$size = _ref.size;

	let size = _ref$size === undefined ? 0 : _ref$size;
	var _ref$timeout = _ref.timeout;
	let timeout = _ref$timeout === undefined ? 0 : _ref$timeout;

	if (body == null) {
		// body is undefined or null
		body = null;
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		body = Buffer.from(body.toString());
	} else if (isBlob(body)) ; else if (Buffer.isBuffer(body)) ; else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		body = Buffer.from(body);
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
	} else if (body instanceof Stream) ; else {
		// none of the above
		// coerce to string then buffer
		body = Buffer.from(String(body));
	}
	this[INTERNALS] = {
		body,
		disturbed: false,
		error: null
	};
	this.size = size;
	this.timeout = timeout;

	if (body instanceof Stream) {
		body.on('error', function (err) {
			const error = err.name === 'AbortError' ? err : new FetchError(`Invalid response body while trying to fetch ${_this.url}: ${err.message}`, 'system', err);
			_this[INTERNALS].error = error;
		});
	}
}

Body.prototype = {
	get body() {
		return this[INTERNALS].body;
	},

	get bodyUsed() {
		return this[INTERNALS].disturbed;
	},

	/**
  * Decode response as ArrayBuffer
  *
  * @return  Promise
  */
	arrayBuffer() {
		return consumeBody.call(this).then(function (buf) {
			return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		});
	},

	/**
  * Return raw response as Blob
  *
  * @return Promise
  */
	blob() {
		let ct = this.headers && this.headers.get('content-type') || '';
		return consumeBody.call(this).then(function (buf) {
			return Object.assign(
			// Prevent copying
			new Blob([], {
				type: ct.toLowerCase()
			}), {
				[BUFFER]: buf
			});
		});
	},

	/**
  * Decode response as json
  *
  * @return  Promise
  */
	json() {
		var _this2 = this;

		return consumeBody.call(this).then(function (buffer) {
			try {
				return JSON.parse(buffer.toString());
			} catch (err) {
				return Body.Promise.reject(new FetchError(`invalid json response body at ${_this2.url} reason: ${err.message}`, 'invalid-json'));
			}
		});
	},

	/**
  * Decode response as text
  *
  * @return  Promise
  */
	text() {
		return consumeBody.call(this).then(function (buffer) {
			return buffer.toString();
		});
	},

	/**
  * Decode response as buffer (non-spec api)
  *
  * @return  Promise
  */
	buffer() {
		return consumeBody.call(this);
	},

	/**
  * Decode response as text, while automatically detecting the encoding and
  * trying to decode to UTF-8 (non-spec api)
  *
  * @return  Promise
  */
	textConverted() {
		var _this3 = this;

		return consumeBody.call(this).then(function (buffer) {
			return convertBody(buffer, _this3.headers);
		});
	}
};

// In browsers, all properties are enumerable.
Object.defineProperties(Body.prototype, {
	body: { enumerable: true },
	bodyUsed: { enumerable: true },
	arrayBuffer: { enumerable: true },
	blob: { enumerable: true },
	json: { enumerable: true },
	text: { enumerable: true }
});

Body.mixIn = function (proto) {
	for (const name of Object.getOwnPropertyNames(Body.prototype)) {
		// istanbul ignore else: future proof
		if (!(name in proto)) {
			const desc = Object.getOwnPropertyDescriptor(Body.prototype, name);
			Object.defineProperty(proto, name, desc);
		}
	}
};

/**
 * Consume and convert an entire Body to a Buffer.
 *
 * Ref: https://fetch.spec.whatwg.org/#concept-body-consume-body
 *
 * @return  Promise
 */
function consumeBody() {
	var _this4 = this;

	if (this[INTERNALS].disturbed) {
		return Body.Promise.reject(new TypeError(`body used already for: ${this.url}`));
	}

	this[INTERNALS].disturbed = true;

	if (this[INTERNALS].error) {
		return Body.Promise.reject(this[INTERNALS].error);
	}

	let body = this.body;

	// body is null
	if (body === null) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is blob
	if (isBlob(body)) {
		body = body.stream();
	}

	// body is buffer
	if (Buffer.isBuffer(body)) {
		return Body.Promise.resolve(body);
	}

	// istanbul ignore if: should never happen
	if (!(body instanceof Stream)) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is stream
	// get ready to actually consume the body
	let accum = [];
	let accumBytes = 0;
	let abort = false;

	return new Body.Promise(function (resolve, reject) {
		let resTimeout;

		// allow timeout on slow response body
		if (_this4.timeout) {
			resTimeout = setTimeout(function () {
				abort = true;
				reject(new FetchError(`Response timeout while trying to fetch ${_this4.url} (over ${_this4.timeout}ms)`, 'body-timeout'));
			}, _this4.timeout);
		}

		// handle stream errors
		body.on('error', function (err) {
			if (err.name === 'AbortError') {
				// if the request was aborted, reject with this Error
				abort = true;
				reject(err);
			} else {
				// other errors, such as incorrect content-encoding
				reject(new FetchError(`Invalid response body while trying to fetch ${_this4.url}: ${err.message}`, 'system', err));
			}
		});

		body.on('data', function (chunk) {
			if (abort || chunk === null) {
				return;
			}

			if (_this4.size && accumBytes + chunk.length > _this4.size) {
				abort = true;
				reject(new FetchError(`content size at ${_this4.url} over limit: ${_this4.size}`, 'max-size'));
				return;
			}

			accumBytes += chunk.length;
			accum.push(chunk);
		});

		body.on('end', function () {
			if (abort) {
				return;
			}

			clearTimeout(resTimeout);

			try {
				resolve(Buffer.concat(accum, accumBytes));
			} catch (err) {
				// handle streams that have accumulated too much data (issue #414)
				reject(new FetchError(`Could not create Buffer from response body for ${_this4.url}: ${err.message}`, 'system', err));
			}
		});
	});
}

/**
 * Detect buffer encoding and convert to target encoding
 * ref: http://www.w3.org/TR/2011/WD-html5-20110113/parsing.html#determining-the-character-encoding
 *
 * @param   Buffer  buffer    Incoming buffer
 * @param   String  encoding  Target encoding
 * @return  String
 */
function convertBody(buffer, headers) {
	if (typeof convert !== 'function') {
		throw new Error('The package `encoding` must be installed to use the textConverted() function');
	}

	const ct = headers.get('content-type');
	let charset = 'utf-8';
	let res, str;

	// header
	if (ct) {
		res = /charset=([^;]*)/i.exec(ct);
	}

	// no charset in content type, peek at response body for at most 1024 bytes
	str = buffer.slice(0, 1024).toString();

	// html5
	if (!res && str) {
		res = /<meta.+?charset=(['"])(.+?)\1/i.exec(str);
	}

	// html4
	if (!res && str) {
		res = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(str);

		if (res) {
			res = /charset=(.*)/i.exec(res.pop());
		}
	}

	// xml
	if (!res && str) {
		res = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(str);
	}

	// found charset
	if (res) {
		charset = res.pop();

		// prevent decode issues when sites use incorrect encoding
		// ref: https://hsivonen.fi/encoding-menu/
		if (charset === 'gb2312' || charset === 'gbk') {
			charset = 'gb18030';
		}
	}

	// turn raw buffers into a single utf-8 buffer
	return convert(buffer, 'UTF-8', charset).toString();
}

/**
 * Detect a URLSearchParams object
 * ref: https://github.com/bitinn/node-fetch/issues/296#issuecomment-307598143
 *
 * @param   Object  obj     Object to detect by type or brand
 * @return  String
 */
function isURLSearchParams(obj) {
	// Duck-typing as a necessary condition.
	if (typeof obj !== 'object' || typeof obj.append !== 'function' || typeof obj.delete !== 'function' || typeof obj.get !== 'function' || typeof obj.getAll !== 'function' || typeof obj.has !== 'function' || typeof obj.set !== 'function') {
		return false;
	}

	// Brand-checking and more duck-typing as optional condition.
	return obj.constructor.name === 'URLSearchParams' || Object.prototype.toString.call(obj) === '[object URLSearchParams]' || typeof obj.sort === 'function';
}

/**
 * Check if `obj` is a W3C `Blob` object (which `File` inherits from)
 * @param  {*} obj
 * @return {boolean}
 */
function isBlob(obj) {
	return typeof obj === 'object' && typeof obj.arrayBuffer === 'function' && typeof obj.type === 'string' && typeof obj.stream === 'function' && typeof obj.constructor === 'function' && typeof obj.constructor.name === 'string' && /^(Blob|File)$/.test(obj.constructor.name) && /^(Blob|File)$/.test(obj[Symbol.toStringTag]);
}

/**
 * Clone body given Res/Req instance
 *
 * @param   Mixed  instance  Response or Request instance
 * @return  Mixed
 */
function clone(instance) {
	let p1, p2;
	let body = instance.body;

	// don't allow cloning a used body
	if (instance.bodyUsed) {
		throw new Error('cannot clone body after it is used');
	}

	// check that body is a stream and not form-data object
	// note: we can't clone the form-data object without having it as a dependency
	if (body instanceof Stream && typeof body.getBoundary !== 'function') {
		// tee instance body
		p1 = new PassThrough();
		p2 = new PassThrough();
		body.pipe(p1);
		body.pipe(p2);
		// set instance body to teed body and return the other teed body
		instance[INTERNALS].body = p1;
		body = p2;
	}

	return body;
}

/**
 * Performs the operation "extract a `Content-Type` value from |object|" as
 * specified in the specification:
 * https://fetch.spec.whatwg.org/#concept-bodyinit-extract
 *
 * This function assumes that instance.body is present.
 *
 * @param   Mixed  instance  Any options.body input
 */
function extractContentType(body) {
	if (body === null) {
		// body is null
		return null;
	} else if (typeof body === 'string') {
		// body is string
		return 'text/plain;charset=UTF-8';
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		return 'application/x-www-form-urlencoded;charset=UTF-8';
	} else if (isBlob(body)) {
		// body is blob
		return body.type || null;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return null;
	} else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		return null;
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		return null;
	} else if (typeof body.getBoundary === 'function') {
		// detect form data input from form-data module
		return `multipart/form-data;boundary=${body.getBoundary()}`;
	} else if (body instanceof Stream) {
		// body is stream
		// can't really do much about this
		return null;
	} else {
		// Body constructor defaults other things to string
		return 'text/plain;charset=UTF-8';
	}
}

/**
 * The Fetch Standard treats this as if "total bytes" is a property on the body.
 * For us, we have to explicitly get it with a function.
 *
 * ref: https://fetch.spec.whatwg.org/#concept-body-total-bytes
 *
 * @param   Body    instance   Instance of Body
 * @return  Number?            Number of bytes, or null if not possible
 */
function getTotalBytes(instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		return 0;
	} else if (isBlob(body)) {
		return body.size;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return body.length;
	} else if (body && typeof body.getLengthSync === 'function') {
		// detect form data input from form-data module
		if (body._lengthRetrievers && body._lengthRetrievers.length == 0 || // 1.x
		body.hasKnownLength && body.hasKnownLength()) {
			// 2.x
			return body.getLengthSync();
		}
		return null;
	} else {
		// body is stream
		return null;
	}
}

/**
 * Write a Body to a Node.js WritableStream (e.g. http.Request) object.
 *
 * @param   Body    instance   Instance of Body
 * @return  Void
 */
function writeToStream(dest, instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		dest.end();
	} else if (isBlob(body)) {
		body.stream().pipe(dest);
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		dest.write(body);
		dest.end();
	} else {
		// body is stream
		body.pipe(dest);
	}
}

// expose Promise
Body.Promise = global.Promise;

/**
 * headers.js
 *
 * Headers class offers convenient helpers
 */

const invalidTokenRegex = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/;
const invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/;

function validateName(name) {
	name = `${name}`;
	if (invalidTokenRegex.test(name) || name === '') {
		throw new TypeError(`${name} is not a legal HTTP header name`);
	}
}

function validateValue(value) {
	value = `${value}`;
	if (invalidHeaderCharRegex.test(value)) {
		throw new TypeError(`${value} is not a legal HTTP header value`);
	}
}

/**
 * Find the key in the map object given a header name.
 *
 * Returns undefined if not found.
 *
 * @param   String  name  Header name
 * @return  String|Undefined
 */
function find(map, name) {
	name = name.toLowerCase();
	for (const key in map) {
		if (key.toLowerCase() === name) {
			return key;
		}
	}
	return undefined;
}

const MAP = Symbol('map');
class Headers {
	/**
  * Headers class
  *
  * @param   Object  headers  Response headers
  * @return  Void
  */
	constructor() {
		let init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

		this[MAP] = Object.create(null);

		if (init instanceof Headers) {
			const rawHeaders = init.raw();
			const headerNames = Object.keys(rawHeaders);

			for (const headerName of headerNames) {
				for (const value of rawHeaders[headerName]) {
					this.append(headerName, value);
				}
			}

			return;
		}

		// We don't worry about converting prop to ByteString here as append()
		// will handle it.
		if (init == null) ; else if (typeof init === 'object') {
			const method = init[Symbol.iterator];
			if (method != null) {
				if (typeof method !== 'function') {
					throw new TypeError('Header pairs must be iterable');
				}

				// sequence<sequence<ByteString>>
				// Note: per spec we have to first exhaust the lists then process them
				const pairs = [];
				for (const pair of init) {
					if (typeof pair !== 'object' || typeof pair[Symbol.iterator] !== 'function') {
						throw new TypeError('Each header pair must be iterable');
					}
					pairs.push(Array.from(pair));
				}

				for (const pair of pairs) {
					if (pair.length !== 2) {
						throw new TypeError('Each header pair must be a name/value tuple');
					}
					this.append(pair[0], pair[1]);
				}
			} else {
				// record<ByteString, ByteString>
				for (const key of Object.keys(init)) {
					const value = init[key];
					this.append(key, value);
				}
			}
		} else {
			throw new TypeError('Provided initializer must be an object');
		}
	}

	/**
  * Return combined header value given name
  *
  * @param   String  name  Header name
  * @return  Mixed
  */
	get(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key === undefined) {
			return null;
		}

		return this[MAP][key].join(', ');
	}

	/**
  * Iterate over all headers
  *
  * @param   Function  callback  Executed for each item with parameters (value, name, thisArg)
  * @param   Boolean   thisArg   `this` context for callback function
  * @return  Void
  */
	forEach(callback) {
		let thisArg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

		let pairs = getHeaders(this);
		let i = 0;
		while (i < pairs.length) {
			var _pairs$i = pairs[i];
			const name = _pairs$i[0],
			      value = _pairs$i[1];

			callback.call(thisArg, value, name, this);
			pairs = getHeaders(this);
			i++;
		}
	}

	/**
  * Overwrite header values given name
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	set(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		this[MAP][key !== undefined ? key : name] = [value];
	}

	/**
  * Append a value onto existing header
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	append(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			this[MAP][key].push(value);
		} else {
			this[MAP][name] = [value];
		}
	}

	/**
  * Check for header name existence
  *
  * @param   String   name  Header name
  * @return  Boolean
  */
	has(name) {
		name = `${name}`;
		validateName(name);
		return find(this[MAP], name) !== undefined;
	}

	/**
  * Delete all header values given name
  *
  * @param   String  name  Header name
  * @return  Void
  */
	delete(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			delete this[MAP][key];
		}
	}

	/**
  * Return raw headers (non-spec api)
  *
  * @return  Object
  */
	raw() {
		return this[MAP];
	}

	/**
  * Get an iterator on keys.
  *
  * @return  Iterator
  */
	keys() {
		return createHeadersIterator(this, 'key');
	}

	/**
  * Get an iterator on values.
  *
  * @return  Iterator
  */
	values() {
		return createHeadersIterator(this, 'value');
	}

	/**
  * Get an iterator on entries.
  *
  * This is the default iterator of the Headers object.
  *
  * @return  Iterator
  */
	[Symbol.iterator]() {
		return createHeadersIterator(this, 'key+value');
	}
}
Headers.prototype.entries = Headers.prototype[Symbol.iterator];

Object.defineProperty(Headers.prototype, Symbol.toStringTag, {
	value: 'Headers',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Headers.prototype, {
	get: { enumerable: true },
	forEach: { enumerable: true },
	set: { enumerable: true },
	append: { enumerable: true },
	has: { enumerable: true },
	delete: { enumerable: true },
	keys: { enumerable: true },
	values: { enumerable: true },
	entries: { enumerable: true }
});

function getHeaders(headers) {
	let kind = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'key+value';

	const keys = Object.keys(headers[MAP]).sort();
	return keys.map(kind === 'key' ? function (k) {
		return k.toLowerCase();
	} : kind === 'value' ? function (k) {
		return headers[MAP][k].join(', ');
	} : function (k) {
		return [k.toLowerCase(), headers[MAP][k].join(', ')];
	});
}

const INTERNAL = Symbol('internal');

function createHeadersIterator(target, kind) {
	const iterator = Object.create(HeadersIteratorPrototype);
	iterator[INTERNAL] = {
		target,
		kind,
		index: 0
	};
	return iterator;
}

const HeadersIteratorPrototype = Object.setPrototypeOf({
	next() {
		// istanbul ignore if
		if (!this || Object.getPrototypeOf(this) !== HeadersIteratorPrototype) {
			throw new TypeError('Value of `this` is not a HeadersIterator');
		}

		var _INTERNAL = this[INTERNAL];
		const target = _INTERNAL.target,
		      kind = _INTERNAL.kind,
		      index = _INTERNAL.index;

		const values = getHeaders(target, kind);
		const len = values.length;
		if (index >= len) {
			return {
				value: undefined,
				done: true
			};
		}

		this[INTERNAL].index = index + 1;

		return {
			value: values[index],
			done: false
		};
	}
}, Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));

Object.defineProperty(HeadersIteratorPrototype, Symbol.toStringTag, {
	value: 'HeadersIterator',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * Export the Headers object in a form that Node.js can consume.
 *
 * @param   Headers  headers
 * @return  Object
 */
function exportNodeCompatibleHeaders(headers) {
	const obj = Object.assign({ __proto__: null }, headers[MAP]);

	// http.request() only supports string as Host header. This hack makes
	// specifying custom Host header possible.
	const hostHeaderKey = find(headers[MAP], 'Host');
	if (hostHeaderKey !== undefined) {
		obj[hostHeaderKey] = obj[hostHeaderKey][0];
	}

	return obj;
}

/**
 * Create a Headers object from an object of headers, ignoring those that do
 * not conform to HTTP grammar productions.
 *
 * @param   Object  obj  Object of headers
 * @return  Headers
 */
function createHeadersLenient(obj) {
	const headers = new Headers();
	for (const name of Object.keys(obj)) {
		if (invalidTokenRegex.test(name)) {
			continue;
		}
		if (Array.isArray(obj[name])) {
			for (const val of obj[name]) {
				if (invalidHeaderCharRegex.test(val)) {
					continue;
				}
				if (headers[MAP][name] === undefined) {
					headers[MAP][name] = [val];
				} else {
					headers[MAP][name].push(val);
				}
			}
		} else if (!invalidHeaderCharRegex.test(obj[name])) {
			headers[MAP][name] = [obj[name]];
		}
	}
	return headers;
}

const INTERNALS$1 = Symbol('Response internals');

// fix an issue where "STATUS_CODES" aren't a named export for node <10
const STATUS_CODES = http.STATUS_CODES;

/**
 * Response class
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
class Response {
	constructor() {
		let body = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
		let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		Body.call(this, body, opts);

		const status = opts.status || 200;
		const headers = new Headers(opts.headers);

		if (body != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(body);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		this[INTERNALS$1] = {
			url: opts.url,
			status,
			statusText: opts.statusText || STATUS_CODES[status],
			headers,
			counter: opts.counter
		};
	}

	get url() {
		return this[INTERNALS$1].url || '';
	}

	get status() {
		return this[INTERNALS$1].status;
	}

	/**
  * Convenience property representing if the request ended normally
  */
	get ok() {
		return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
	}

	get redirected() {
		return this[INTERNALS$1].counter > 0;
	}

	get statusText() {
		return this[INTERNALS$1].statusText;
	}

	get headers() {
		return this[INTERNALS$1].headers;
	}

	/**
  * Clone this response
  *
  * @return  Response
  */
	clone() {
		return new Response(clone(this), {
			url: this.url,
			status: this.status,
			statusText: this.statusText,
			headers: this.headers,
			ok: this.ok,
			redirected: this.redirected
		});
	}
}

Body.mixIn(Response.prototype);

Object.defineProperties(Response.prototype, {
	url: { enumerable: true },
	status: { enumerable: true },
	ok: { enumerable: true },
	redirected: { enumerable: true },
	statusText: { enumerable: true },
	headers: { enumerable: true },
	clone: { enumerable: true }
});

Object.defineProperty(Response.prototype, Symbol.toStringTag, {
	value: 'Response',
	writable: false,
	enumerable: false,
	configurable: true
});

const INTERNALS$2 = Symbol('Request internals');

// fix an issue where "format", "parse" aren't a named export for node <10
const parse_url = Url.parse;
const format_url = Url.format;

const streamDestructionSupported = 'destroy' in Stream.Readable.prototype;

/**
 * Check if a value is an instance of Request.
 *
 * @param   Mixed   input
 * @return  Boolean
 */
function isRequest(input) {
	return typeof input === 'object' && typeof input[INTERNALS$2] === 'object';
}

function isAbortSignal(signal) {
	const proto = signal && typeof signal === 'object' && Object.getPrototypeOf(signal);
	return !!(proto && proto.constructor.name === 'AbortSignal');
}

/**
 * Request class
 *
 * @param   Mixed   input  Url or Request instance
 * @param   Object  init   Custom options
 * @return  Void
 */
class Request {
	constructor(input) {
		let init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		let parsedURL;

		// normalize input
		if (!isRequest(input)) {
			if (input && input.href) {
				// in order to support Node.js' Url objects; though WHATWG's URL objects
				// will fall into this branch also (since their `toString()` will return
				// `href` property anyway)
				parsedURL = parse_url(input.href);
			} else {
				// coerce input to a string before attempting to parse
				parsedURL = parse_url(`${input}`);
			}
			input = {};
		} else {
			parsedURL = parse_url(input.url);
		}

		let method = init.method || input.method || 'GET';
		method = method.toUpperCase();

		if ((init.body != null || isRequest(input) && input.body !== null) && (method === 'GET' || method === 'HEAD')) {
			throw new TypeError('Request with GET/HEAD method cannot have body');
		}

		let inputBody = init.body != null ? init.body : isRequest(input) && input.body !== null ? clone(input) : null;

		Body.call(this, inputBody, {
			timeout: init.timeout || input.timeout || 0,
			size: init.size || input.size || 0
		});

		const headers = new Headers(init.headers || input.headers || {});

		if (inputBody != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(inputBody);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		let signal = isRequest(input) ? input.signal : null;
		if ('signal' in init) signal = init.signal;

		if (signal != null && !isAbortSignal(signal)) {
			throw new TypeError('Expected signal to be an instanceof AbortSignal');
		}

		this[INTERNALS$2] = {
			method,
			redirect: init.redirect || input.redirect || 'follow',
			headers,
			parsedURL,
			signal
		};

		// node-fetch-only options
		this.follow = init.follow !== undefined ? init.follow : input.follow !== undefined ? input.follow : 20;
		this.compress = init.compress !== undefined ? init.compress : input.compress !== undefined ? input.compress : true;
		this.counter = init.counter || input.counter || 0;
		this.agent = init.agent || input.agent;
	}

	get method() {
		return this[INTERNALS$2].method;
	}

	get url() {
		return format_url(this[INTERNALS$2].parsedURL);
	}

	get headers() {
		return this[INTERNALS$2].headers;
	}

	get redirect() {
		return this[INTERNALS$2].redirect;
	}

	get signal() {
		return this[INTERNALS$2].signal;
	}

	/**
  * Clone this request
  *
  * @return  Request
  */
	clone() {
		return new Request(this);
	}
}

Body.mixIn(Request.prototype);

Object.defineProperty(Request.prototype, Symbol.toStringTag, {
	value: 'Request',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Request.prototype, {
	method: { enumerable: true },
	url: { enumerable: true },
	headers: { enumerable: true },
	redirect: { enumerable: true },
	clone: { enumerable: true },
	signal: { enumerable: true }
});

/**
 * Convert a Request to Node.js http request options.
 *
 * @param   Request  A Request instance
 * @return  Object   The options object to be passed to http.request
 */
function getNodeRequestOptions(request) {
	const parsedURL = request[INTERNALS$2].parsedURL;
	const headers = new Headers(request[INTERNALS$2].headers);

	// fetch step 1.3
	if (!headers.has('Accept')) {
		headers.set('Accept', '*/*');
	}

	// Basic fetch
	if (!parsedURL.protocol || !parsedURL.hostname) {
		throw new TypeError('Only absolute URLs are supported');
	}

	if (!/^https?:$/.test(parsedURL.protocol)) {
		throw new TypeError('Only HTTP(S) protocols are supported');
	}

	if (request.signal && request.body instanceof Stream.Readable && !streamDestructionSupported) {
		throw new Error('Cancellation of streamed requests with AbortSignal is not supported in node < 8');
	}

	// HTTP-network-or-cache fetch steps 2.4-2.7
	let contentLengthValue = null;
	if (request.body == null && /^(POST|PUT)$/i.test(request.method)) {
		contentLengthValue = '0';
	}
	if (request.body != null) {
		const totalBytes = getTotalBytes(request);
		if (typeof totalBytes === 'number') {
			contentLengthValue = String(totalBytes);
		}
	}
	if (contentLengthValue) {
		headers.set('Content-Length', contentLengthValue);
	}

	// HTTP-network-or-cache fetch step 2.11
	if (!headers.has('User-Agent')) {
		headers.set('User-Agent', 'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)');
	}

	// HTTP-network-or-cache fetch step 2.15
	if (request.compress && !headers.has('Accept-Encoding')) {
		headers.set('Accept-Encoding', 'gzip,deflate');
	}

	let agent = request.agent;
	if (typeof agent === 'function') {
		agent = agent(parsedURL);
	}

	if (!headers.has('Connection') && !agent) {
		headers.set('Connection', 'close');
	}

	// HTTP-network fetch step 4.2
	// chunked encoding is handled by Node.js

	return Object.assign({}, parsedURL, {
		method: request.method,
		headers: exportNodeCompatibleHeaders(headers),
		agent
	});
}

/**
 * abort-error.js
 *
 * AbortError interface for cancelled requests
 */

/**
 * Create AbortError instance
 *
 * @param   String      message      Error message for human
 * @return  AbortError
 */
function AbortError(message) {
  Error.call(this, message);

  this.type = 'aborted';
  this.message = message;

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

AbortError.prototype = Object.create(Error.prototype);
AbortError.prototype.constructor = AbortError;
AbortError.prototype.name = 'AbortError';

// fix an issue where "PassThrough", "resolve" aren't a named export for node <10
const PassThrough$1 = Stream.PassThrough;
const resolve_url = Url.resolve;

/**
 * Fetch function
 *
 * @param   Mixed    url   Absolute url or Request instance
 * @param   Object   opts  Fetch options
 * @return  Promise
 */
function fetch(url, opts) {

	// allow custom promise
	if (!fetch.Promise) {
		throw new Error('native promise missing, set fetch.Promise to your favorite alternative');
	}

	Body.Promise = fetch.Promise;

	// wrap http.request into fetch
	return new fetch.Promise(function (resolve, reject) {
		// build request object
		const request = new Request(url, opts);
		const options = getNodeRequestOptions(request);

		const send = (options.protocol === 'https:' ? https : http).request;
		const signal = request.signal;

		let response = null;

		const abort = function abort() {
			let error = new AbortError('The user aborted a request.');
			reject(error);
			if (request.body && request.body instanceof Stream.Readable) {
				request.body.destroy(error);
			}
			if (!response || !response.body) return;
			response.body.emit('error', error);
		};

		if (signal && signal.aborted) {
			abort();
			return;
		}

		const abortAndFinalize = function abortAndFinalize() {
			abort();
			finalize();
		};

		// send request
		const req = send(options);
		let reqTimeout;

		if (signal) {
			signal.addEventListener('abort', abortAndFinalize);
		}

		function finalize() {
			req.abort();
			if (signal) signal.removeEventListener('abort', abortAndFinalize);
			clearTimeout(reqTimeout);
		}

		if (request.timeout) {
			req.once('socket', function (socket) {
				reqTimeout = setTimeout(function () {
					reject(new FetchError(`network timeout at: ${request.url}`, 'request-timeout'));
					finalize();
				}, request.timeout);
			});
		}

		req.on('error', function (err) {
			reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, 'system', err));
			finalize();
		});

		req.on('response', function (res) {
			clearTimeout(reqTimeout);

			const headers = createHeadersLenient(res.headers);

			// HTTP fetch step 5
			if (fetch.isRedirect(res.statusCode)) {
				// HTTP fetch step 5.2
				const location = headers.get('Location');

				// HTTP fetch step 5.3
				const locationURL = location === null ? null : resolve_url(request.url, location);

				// HTTP fetch step 5.5
				switch (request.redirect) {
					case 'error':
						reject(new FetchError(`redirect mode is set to error: ${request.url}`, 'no-redirect'));
						finalize();
						return;
					case 'manual':
						// node-fetch-specific step: make manual redirect a bit easier to use by setting the Location header value to the resolved URL.
						if (locationURL !== null) {
							// handle corrupted header
							try {
								headers.set('Location', locationURL);
							} catch (err) {
								// istanbul ignore next: nodejs server prevent invalid response headers, we can't test this through normal request
								reject(err);
							}
						}
						break;
					case 'follow':
						// HTTP-redirect fetch step 2
						if (locationURL === null) {
							break;
						}

						// HTTP-redirect fetch step 5
						if (request.counter >= request.follow) {
							reject(new FetchError(`maximum redirect reached at: ${request.url}`, 'max-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 6 (counter increment)
						// Create a new Request object.
						const requestOpts = {
							headers: new Headers(request.headers),
							follow: request.follow,
							counter: request.counter + 1,
							agent: request.agent,
							compress: request.compress,
							method: request.method,
							body: request.body,
							signal: request.signal,
							timeout: request.timeout
						};

						// HTTP-redirect fetch step 9
						if (res.statusCode !== 303 && request.body && getTotalBytes(request) === null) {
							reject(new FetchError('Cannot follow redirect with body being a readable stream', 'unsupported-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 11
						if (res.statusCode === 303 || (res.statusCode === 301 || res.statusCode === 302) && request.method === 'POST') {
							requestOpts.method = 'GET';
							requestOpts.body = undefined;
							requestOpts.headers.delete('content-length');
						}

						// HTTP-redirect fetch step 15
						resolve(fetch(new Request(locationURL, requestOpts)));
						finalize();
						return;
				}
			}

			// prepare response
			res.once('end', function () {
				if (signal) signal.removeEventListener('abort', abortAndFinalize);
			});
			let body = res.pipe(new PassThrough$1());

			const response_options = {
				url: request.url,
				status: res.statusCode,
				statusText: res.statusMessage,
				headers: headers,
				size: request.size,
				timeout: request.timeout,
				counter: request.counter
			};

			// HTTP-network fetch step 12.1.1.3
			const codings = headers.get('Content-Encoding');

			// HTTP-network fetch step 12.1.1.4: handle content codings

			// in following scenarios we ignore compression support
			// 1. compression support is disabled
			// 2. HEAD request
			// 3. no Content-Encoding header
			// 4. no content response (204)
			// 5. content not modified response (304)
			if (!request.compress || request.method === 'HEAD' || codings === null || res.statusCode === 204 || res.statusCode === 304) {
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// For Node v6+
			// Be less strict when decoding compressed responses, since sometimes
			// servers send slightly invalid responses that are still accepted
			// by common browsers.
			// Always using Z_SYNC_FLUSH is what cURL does.
			const zlibOptions = {
				flush: zlib.Z_SYNC_FLUSH,
				finishFlush: zlib.Z_SYNC_FLUSH
			};

			// for gzip
			if (codings == 'gzip' || codings == 'x-gzip') {
				body = body.pipe(zlib.createGunzip(zlibOptions));
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// for deflate
			if (codings == 'deflate' || codings == 'x-deflate') {
				// handle the infamous raw deflate response from old servers
				// a hack for old IIS and Apache servers
				const raw = res.pipe(new PassThrough$1());
				raw.once('data', function (chunk) {
					// see http://stackoverflow.com/questions/37519828
					if ((chunk[0] & 0x0F) === 0x08) {
						body = body.pipe(zlib.createInflate());
					} else {
						body = body.pipe(zlib.createInflateRaw());
					}
					response = new Response(body, response_options);
					resolve(response);
				});
				return;
			}

			// for br
			if (codings == 'br' && typeof zlib.createBrotliDecompress === 'function') {
				body = body.pipe(zlib.createBrotliDecompress());
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// otherwise, use response as-is
			response = new Response(body, response_options);
			resolve(response);
		});

		writeToStream(req, request);
	});
}
/**
 * Redirect code matching
 *
 * @param   Number   code  Status code
 * @return  Boolean
 */
fetch.isRedirect = function (code) {
	return code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
};

// expose Promise
fetch.Promise = global.Promise;

class Deprecation extends Error {
  constructor(message) {
    super(message); // Maintains proper stack trace (only available on V8)

    /* istanbul ignore next */

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = 'Deprecation';
  }

}

var distWeb = {
	__proto__: null,
	Deprecation: Deprecation
};

// Returns a wrapper function that returns a wrapped callback
// The wrapper function should do some stuff, and return a
// presumably different callback function.
// This makes sure that own properties are retained, so that
// decorations and such are not lost along the way.
var wrappy_1 = wrappy;
function wrappy (fn, cb) {
  if (fn && cb) return wrappy(fn)(cb)

  if (typeof fn !== 'function')
    throw new TypeError('need wrapper function')

  Object.keys(fn).forEach(function (k) {
    wrapper[k] = fn[k];
  });

  return wrapper

  function wrapper() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    var ret = fn.apply(this, args);
    var cb = args[args.length-1];
    if (typeof ret === 'function' && ret !== cb) {
      Object.keys(cb).forEach(function (k) {
        ret[k] = cb[k];
      });
    }
    return ret
  }
}

var once_1 = wrappy_1(once);
var strict = wrappy_1(onceStrict);

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  });

  Object.defineProperty(Function.prototype, 'onceStrict', {
    value: function () {
      return onceStrict(this)
    },
    configurable: true
  });
});

function once (fn) {
  var f = function () {
    if (f.called) return f.value
    f.called = true;
    return f.value = fn.apply(this, arguments)
  };
  f.called = false;
  return f
}

function onceStrict (fn) {
  var f = function () {
    if (f.called)
      throw new Error(f.onceError)
    f.called = true;
    return f.value = fn.apply(this, arguments)
  };
  var name = fn.name || 'Function wrapped with `once`';
  f.onceError = name + " shouldn't be called more than once";
  f.called = false;
  return f
}
once_1.strict = strict;

const logOnce = once_1((deprecation) => console.warn(deprecation));
/**
 * Error with extra properties to help with debugging
 */
class RequestError extends Error {
    constructor(message, statusCode, options) {
        super(message);
        // Maintains proper stack trace (only available on V8)
        /* istanbul ignore next */
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
        this.name = "HttpError";
        this.status = statusCode;
        Object.defineProperty(this, "code", {
            get() {
                logOnce(new Deprecation("[@octokit/request-error] `error.code` is deprecated, use `error.status`."));
                return statusCode;
            }
        });
        this.headers = options.headers || {};
        // redact request credentials without mutating original request options
        const requestCopy = Object.assign({}, options.request);
        if (options.request.headers.authorization) {
            requestCopy.headers = Object.assign({}, options.request.headers, {
                authorization: options.request.headers.authorization.replace(/ .*$/, " [REDACTED]")
            });
        }
        requestCopy.url = requestCopy.url
            // client_id & client_secret can be passed as URL query parameters to increase rate limit
            // see https://developer.github.com/v3/#increasing-the-unauthenticated-rate-limit-for-oauth-applications
            .replace(/\bclient_secret=\w+/g, "client_secret=[REDACTED]")
            // OAuth tokens can be passed as URL query parameters, although it is not recommended
            // see https://developer.github.com/v3/#oauth2-token-sent-in-a-header
            .replace(/\baccess_token=\w+/g, "access_token=[REDACTED]");
        this.request = requestCopy;
    }
}

var distWeb$1 = {
	__proto__: null,
	RequestError: RequestError
};

const VERSION$1 = "5.3.2";

function getBufferResponse(response) {
    return response.arrayBuffer();
}

function fetchWrapper(requestOptions) {
    if (isPlainObject(requestOptions.body) ||
        Array.isArray(requestOptions.body)) {
        requestOptions.body = JSON.stringify(requestOptions.body);
    }
    let headers = {};
    let status;
    let url;
    const fetch$1 = (requestOptions.request && requestOptions.request.fetch) || fetch;
    return fetch$1(requestOptions.url, Object.assign({
        method: requestOptions.method,
        body: requestOptions.body,
        headers: requestOptions.headers,
        redirect: requestOptions.redirect
    }, requestOptions.request))
        .then(response => {
        url = response.url;
        status = response.status;
        for (const keyAndValue of response.headers) {
            headers[keyAndValue[0]] = keyAndValue[1];
        }
        if (status === 204 || status === 205) {
            return;
        }
        // GitHub API returns 200 for HEAD requests
        if (requestOptions.method === "HEAD") {
            if (status < 400) {
                return;
            }
            throw new RequestError(response.statusText, status, {
                headers,
                request: requestOptions
            });
        }
        if (status === 304) {
            throw new RequestError("Not modified", status, {
                headers,
                request: requestOptions
            });
        }
        if (status >= 400) {
            return response
                .text()
                .then(message => {
                const error = new RequestError(message, status, {
                    headers,
                    request: requestOptions
                });
                try {
                    let responseBody = JSON.parse(error.message);
                    Object.assign(error, responseBody);
                    let errors = responseBody.errors;
                    // Assumption `errors` would always be in Array format
                    error.message =
                        error.message + ": " + errors.map(JSON.stringify).join(", ");
                }
                catch (e) {
                    // ignore, see octokit/rest.js#684
                }
                throw error;
            });
        }
        const contentType = response.headers.get("content-type");
        if (/application\/json/.test(contentType)) {
            return response.json();
        }
        if (!contentType || /^text\/|charset=utf-8$/.test(contentType)) {
            return response.text();
        }
        return getBufferResponse(response);
    })
        .then(data => {
        return {
            status,
            url,
            headers,
            data
        };
    })
        .catch(error => {
        if (error instanceof RequestError) {
            throw error;
        }
        throw new RequestError(error.message, 500, {
            headers,
            request: requestOptions
        });
    });
}

function withDefaults$1(oldEndpoint, newDefaults) {
    const endpoint = oldEndpoint.defaults(newDefaults);
    const newApi = function (route, parameters) {
        const endpointOptions = endpoint.merge(route, parameters);
        if (!endpointOptions.request || !endpointOptions.request.hook) {
            return fetchWrapper(endpoint.parse(endpointOptions));
        }
        const request = (route, parameters) => {
            return fetchWrapper(endpoint.parse(endpoint.merge(route, parameters)));
        };
        Object.assign(request, {
            endpoint,
            defaults: withDefaults$1.bind(null, endpoint)
        });
        return endpointOptions.request.hook(request, endpointOptions);
    };
    return Object.assign(newApi, {
        endpoint,
        defaults: withDefaults$1.bind(null, endpoint)
    });
}

const request = withDefaults$1(endpoint, {
    headers: {
        "user-agent": `octokit-request.js/${VERSION$1} ${getUserAgent$1()}`
    }
});

var distWeb$2 = {
	__proto__: null,
	request: request
};

function getUserAgent$2() {
    try {
        return navigator.userAgent;
    }
    catch (e) {
        return "<environment unknown>";
    }
}

var distWeb$3 = {
	__proto__: null,
	getUserAgent: getUserAgent$2
};

var distNode = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, '__esModule', { value: true });




const VERSION = "4.3.1";

class GraphqlError extends Error {
  constructor(request, response) {
    const message = response.data.errors[0].message;
    super(message);
    Object.assign(this, response.data);
    this.name = "GraphqlError";
    this.request = request; // Maintains proper stack trace (only available on V8)

    /* istanbul ignore next */

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

}

const NON_VARIABLE_OPTIONS = ["method", "baseUrl", "url", "headers", "request", "query"];
function graphql(request, query, options) {
  options = typeof query === "string" ? options = Object.assign({
    query
  }, options) : options = query;
  const requestOptions = Object.keys(options).reduce((result, key) => {
    if (NON_VARIABLE_OPTIONS.includes(key)) {
      result[key] = options[key];
      return result;
    }

    if (!result.variables) {
      result.variables = {};
    }

    result.variables[key] = options[key];
    return result;
  }, {});
  return request(requestOptions).then(response => {
    if (response.data.errors) {
      throw new GraphqlError(requestOptions, {
        data: response.data
      });
    }

    return response.data.data;
  });
}

function withDefaults(request$1, newDefaults) {
  const newRequest = request$1.defaults(newDefaults);

  const newApi = (query, options) => {
    return graphql(newRequest, query, options);
  };

  return Object.assign(newApi, {
    defaults: withDefaults.bind(null, newRequest),
    endpoint: distWeb$2.request.endpoint
  });
}

const graphql$1 = withDefaults(distWeb$2.request, {
  headers: {
    "user-agent": `octokit-graphql.js/${VERSION} ${distWeb$3.getUserAgent()}`
  },
  method: "POST",
  url: "/graphql"
});
function withCustomRequest(customRequest) {
  return withDefaults(customRequest, {
    method: "POST",
    url: "/graphql"
  });
}

exports.graphql = graphql$1;
exports.withCustomRequest = withCustomRequest;

});

unwrapExports(distNode);

const VERSION$2 = "1.0.0";

/**
 * @param octokit Octokit instance
 * @param options Options passed to Octokit constructor
 */
function requestLog(octokit) {
    octokit.hook.wrap("request", (request, options) => {
        octokit.log.debug("request", options);
        const start = Date.now();
        const requestOptions = octokit.request.endpoint.parse(options);
        const path = requestOptions.url.replace(options.baseUrl, "");
        return request(options)
            .then(response => {
            octokit.log.info(`${requestOptions.method} ${path} - ${response.status} in ${Date.now() - start}ms`);
            return response;
        })
            .catch(error => {
            octokit.log.info(`${requestOptions.method} ${path} - ${error.status} in ${Date.now() -
                start}ms`);
            throw error;
        });
    });
}
requestLog.VERSION = VERSION$2;

var distWeb$4 = {
	__proto__: null,
	requestLog: requestLog
};

var endpointsByScope = {
    actions: {
        cancelWorkflowRun: {
            method: "POST",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                run_id: { required: true, type: "integer" }
            },
            url: "/repos/:owner/:repo/actions/runs/:run_id/cancel"
        },
        createOrUpdateSecretForRepo: {
            method: "PUT",
            params: {
                encrypted_value: { type: "string" },
                key_id: { type: "string" },
                name: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/actions/secrets/:name"
        },
        createRegistrationToken: {
            method: "POST",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/actions/runners/registration-token"
        },
        createRemoveToken: {
            method: "POST",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/actions/runners/remove-token"
        },
        deleteArtifact: {
            method: "DELETE",
            params: {
                artifact_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/actions/artifacts/:artifact_id"
        },
        deleteSecretFromRepo: {
            method: "DELETE",
            params: {
                name: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/actions/secrets/:name"
        },
        downloadArtifact: {
            method: "GET",
            params: {
                archive_format: { required: true, type: "string" },
                artifact_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/actions/artifacts/:artifact_id/:archive_format"
        },
        getArtifact: {
            method: "GET",
            params: {
                artifact_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/actions/artifacts/:artifact_id"
        },
        getPublicKey: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/actions/secrets/public-key"
        },
        getSecret: {
            method: "GET",
            params: {
                name: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/actions/secrets/:name"
        },
        getSelfHostedRunner: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                runner_id: { required: true, type: "integer" }
            },
            url: "/repos/:owner/:repo/actions/runners/:runner_id"
        },
        getWorkflow: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                workflow_id: { required: true, type: "integer" }
            },
            url: "/repos/:owner/:repo/actions/workflows/:workflow_id"
        },
        getWorkflowJob: {
            method: "GET",
            params: {
                job_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/actions/jobs/:job_id"
        },
        getWorkflowRun: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                run_id: { required: true, type: "integer" }
            },
            url: "/repos/:owner/:repo/actions/runs/:run_id"
        },
        listDownloadsForSelfHostedRunnerApplication: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/actions/runners/downloads"
        },
        listJobsForWorkflowRun: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" },
                run_id: { required: true, type: "integer" }
            },
            url: "/repos/:owner/:repo/actions/runs/:run_id/jobs"
        },
        listRepoWorkflowRuns: {
            method: "GET",
            params: {
                actor: { type: "string" },
                branch: { type: "string" },
                event: { type: "string" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" },
                status: { enum: ["completed", "status", "conclusion"], type: "string" }
            },
            url: "/repos/:owner/:repo/actions/runs"
        },
        listRepoWorkflows: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/actions/workflows"
        },
        listSecretsForRepo: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/actions/secrets"
        },
        listSelfHostedRunnersForRepo: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/actions/runners"
        },
        listWorkflowJobLogs: {
            method: "GET",
            params: {
                job_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/actions/jobs/:job_id/logs"
        },
        listWorkflowRunArtifacts: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" },
                run_id: { required: true, type: "integer" }
            },
            url: "/repos/:owner/:repo/actions/runs/:run_id/artifacts"
        },
        listWorkflowRunLogs: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" },
                run_id: { required: true, type: "integer" }
            },
            url: "/repos/:owner/:repo/actions/runs/:run_id/logs"
        },
        listWorkflowRuns: {
            method: "GET",
            params: {
                actor: { type: "string" },
                branch: { type: "string" },
                event: { type: "string" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" },
                status: { enum: ["completed", "status", "conclusion"], type: "string" },
                workflow_id: { required: true, type: "integer" }
            },
            url: "/repos/:owner/:repo/actions/workflows/:workflow_id/runs"
        },
        reRunWorkflow: {
            method: "POST",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                run_id: { required: true, type: "integer" }
            },
            url: "/repos/:owner/:repo/actions/runs/:run_id/rerun"
        },
        removeSelfHostedRunner: {
            method: "DELETE",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                runner_id: { required: true, type: "integer" }
            },
            url: "/repos/:owner/:repo/actions/runners/:runner_id"
        }
    },
    activity: {
        checkStarringRepo: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/user/starred/:owner/:repo"
        },
        deleteRepoSubscription: {
            method: "DELETE",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/subscription"
        },
        deleteThreadSubscription: {
            method: "DELETE",
            params: { thread_id: { required: true, type: "integer" } },
            url: "/notifications/threads/:thread_id/subscription"
        },
        getRepoSubscription: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/subscription"
        },
        getThread: {
            method: "GET",
            params: { thread_id: { required: true, type: "integer" } },
            url: "/notifications/threads/:thread_id"
        },
        getThreadSubscription: {
            method: "GET",
            params: { thread_id: { required: true, type: "integer" } },
            url: "/notifications/threads/:thread_id/subscription"
        },
        listEventsForOrg: {
            method: "GET",
            params: {
                org: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                username: { required: true, type: "string" }
            },
            url: "/users/:username/events/orgs/:org"
        },
        listEventsForUser: {
            method: "GET",
            params: {
                page: { type: "integer" },
                per_page: { type: "integer" },
                username: { required: true, type: "string" }
            },
            url: "/users/:username/events"
        },
        listFeeds: { method: "GET", params: {}, url: "/feeds" },
        listNotifications: {
            method: "GET",
            params: {
                all: { type: "boolean" },
                before: { type: "string" },
                page: { type: "integer" },
                participating: { type: "boolean" },
                per_page: { type: "integer" },
                since: { type: "string" }
            },
            url: "/notifications"
        },
        listNotificationsForRepo: {
            method: "GET",
            params: {
                all: { type: "boolean" },
                before: { type: "string" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                participating: { type: "boolean" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" },
                since: { type: "string" }
            },
            url: "/repos/:owner/:repo/notifications"
        },
        listPublicEvents: {
            method: "GET",
            params: { page: { type: "integer" }, per_page: { type: "integer" } },
            url: "/events"
        },
        listPublicEventsForOrg: {
            method: "GET",
            params: {
                org: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" }
            },
            url: "/orgs/:org/events"
        },
        listPublicEventsForRepoNetwork: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/networks/:owner/:repo/events"
        },
        listPublicEventsForUser: {
            method: "GET",
            params: {
                page: { type: "integer" },
                per_page: { type: "integer" },
                username: { required: true, type: "string" }
            },
            url: "/users/:username/events/public"
        },
        listReceivedEventsForUser: {
            method: "GET",
            params: {
                page: { type: "integer" },
                per_page: { type: "integer" },
                username: { required: true, type: "string" }
            },
            url: "/users/:username/received_events"
        },
        listReceivedPublicEventsForUser: {
            method: "GET",
            params: {
                page: { type: "integer" },
                per_page: { type: "integer" },
                username: { required: true, type: "string" }
            },
            url: "/users/:username/received_events/public"
        },
        listRepoEvents: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/events"
        },
        listReposStarredByAuthenticatedUser: {
            method: "GET",
            params: {
                direction: { enum: ["asc", "desc"], type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                sort: { enum: ["created", "updated"], type: "string" }
            },
            url: "/user/starred"
        },
        listReposStarredByUser: {
            method: "GET",
            params: {
                direction: { enum: ["asc", "desc"], type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                sort: { enum: ["created", "updated"], type: "string" },
                username: { required: true, type: "string" }
            },
            url: "/users/:username/starred"
        },
        listReposWatchedByUser: {
            method: "GET",
            params: {
                page: { type: "integer" },
                per_page: { type: "integer" },
                username: { required: true, type: "string" }
            },
            url: "/users/:username/subscriptions"
        },
        listStargazersForRepo: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/stargazers"
        },
        listWatchedReposForAuthenticatedUser: {
            method: "GET",
            params: { page: { type: "integer" }, per_page: { type: "integer" } },
            url: "/user/subscriptions"
        },
        listWatchersForRepo: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/subscribers"
        },
        markAsRead: {
            method: "PUT",
            params: { last_read_at: { type: "string" } },
            url: "/notifications"
        },
        markNotificationsAsReadForRepo: {
            method: "PUT",
            params: {
                last_read_at: { type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/notifications"
        },
        markThreadAsRead: {
            method: "PATCH",
            params: { thread_id: { required: true, type: "integer" } },
            url: "/notifications/threads/:thread_id"
        },
        setRepoSubscription: {
            method: "PUT",
            params: {
                ignored: { type: "boolean" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                subscribed: { type: "boolean" }
            },
            url: "/repos/:owner/:repo/subscription"
        },
        setThreadSubscription: {
            method: "PUT",
            params: {
                ignored: { type: "boolean" },
                thread_id: { required: true, type: "integer" }
            },
            url: "/notifications/threads/:thread_id/subscription"
        },
        starRepo: {
            method: "PUT",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/user/starred/:owner/:repo"
        },
        unstarRepo: {
            method: "DELETE",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/user/starred/:owner/:repo"
        }
    },
    apps: {
        addRepoToInstallation: {
            headers: { accept: "application/vnd.github.machine-man-preview+json" },
            method: "PUT",
            params: {
                installation_id: { required: true, type: "integer" },
                repository_id: { required: true, type: "integer" }
            },
            url: "/user/installations/:installation_id/repositories/:repository_id"
        },
        checkAccountIsAssociatedWithAny: {
            method: "GET",
            params: { account_id: { required: true, type: "integer" } },
            url: "/marketplace_listing/accounts/:account_id"
        },
        checkAccountIsAssociatedWithAnyStubbed: {
            method: "GET",
            params: { account_id: { required: true, type: "integer" } },
            url: "/marketplace_listing/stubbed/accounts/:account_id"
        },
        checkAuthorization: {
            deprecated: "octokit.apps.checkAuthorization() is deprecated, see https://developer.github.com/v3/apps/oauth_applications/#check-an-authorization",
            method: "GET",
            params: {
                access_token: { required: true, type: "string" },
                client_id: { required: true, type: "string" }
            },
            url: "/applications/:client_id/tokens/:access_token"
        },
        checkToken: {
            headers: { accept: "application/vnd.github.doctor-strange-preview+json" },
            method: "POST",
            params: {
                access_token: { type: "string" },
                client_id: { required: true, type: "string" }
            },
            url: "/applications/:client_id/token"
        },
        createContentAttachment: {
            headers: { accept: "application/vnd.github.corsair-preview+json" },
            method: "POST",
            params: {
                body: { required: true, type: "string" },
                content_reference_id: { required: true, type: "integer" },
                title: { required: true, type: "string" }
            },
            url: "/content_references/:content_reference_id/attachments"
        },
        createFromManifest: {
            headers: { accept: "application/vnd.github.fury-preview+json" },
            method: "POST",
            params: { code: { required: true, type: "string" } },
            url: "/app-manifests/:code/conversions"
        },
        createInstallationToken: {
            headers: { accept: "application/vnd.github.machine-man-preview+json" },
            method: "POST",
            params: {
                installation_id: { required: true, type: "integer" },
                permissions: { type: "object" },
                repository_ids: { type: "integer[]" }
            },
            url: "/app/installations/:installation_id/access_tokens"
        },
        deleteAuthorization: {
            headers: { accept: "application/vnd.github.doctor-strange-preview+json" },
            method: "DELETE",
            params: {
                access_token: { type: "string" },
                client_id: { required: true, type: "string" }
            },
            url: "/applications/:client_id/grant"
        },
        deleteInstallation: {
            headers: {
                accept: "application/vnd.github.gambit-preview+json,application/vnd.github.machine-man-preview+json"
            },
            method: "DELETE",
            params: { installation_id: { required: true, type: "integer" } },
            url: "/app/installations/:installation_id"
        },
        deleteToken: {
            headers: { accept: "application/vnd.github.doctor-strange-preview+json" },
            method: "DELETE",
            params: {
                access_token: { type: "string" },
                client_id: { required: true, type: "string" }
            },
            url: "/applications/:client_id/token"
        },
        findOrgInstallation: {
            deprecated: "octokit.apps.findOrgInstallation() has been renamed to octokit.apps.getOrgInstallation() (2019-04-10)",
            headers: { accept: "application/vnd.github.machine-man-preview+json" },
            method: "GET",
            params: { org: { required: true, type: "string" } },
            url: "/orgs/:org/installation"
        },
        findRepoInstallation: {
            deprecated: "octokit.apps.findRepoInstallation() has been renamed to octokit.apps.getRepoInstallation() (2019-04-10)",
            headers: { accept: "application/vnd.github.machine-man-preview+json" },
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/installation"
        },
        findUserInstallation: {
            deprecated: "octokit.apps.findUserInstallation() has been renamed to octokit.apps.getUserInstallation() (2019-04-10)",
            headers: { accept: "application/vnd.github.machine-man-preview+json" },
            method: "GET",
            params: { username: { required: true, type: "string" } },
            url: "/users/:username/installation"
        },
        getAuthenticated: {
            headers: { accept: "application/vnd.github.machine-man-preview+json" },
            method: "GET",
            params: {},
            url: "/app"
        },
        getBySlug: {
            headers: { accept: "application/vnd.github.machine-man-preview+json" },
            method: "GET",
            params: { app_slug: { required: true, type: "string" } },
            url: "/apps/:app_slug"
        },
        getInstallation: {
            headers: { accept: "application/vnd.github.machine-man-preview+json" },
            method: "GET",
            params: { installation_id: { required: true, type: "integer" } },
            url: "/app/installations/:installation_id"
        },
        getOrgInstallation: {
            headers: { accept: "application/vnd.github.machine-man-preview+json" },
            method: "GET",
            params: { org: { required: true, type: "string" } },
            url: "/orgs/:org/installation"
        },
        getRepoInstallation: {
            headers: { accept: "application/vnd.github.machine-man-preview+json" },
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/installation"
        },
        getUserInstallation: {
            headers: { accept: "application/vnd.github.machine-man-preview+json" },
            method: "GET",
            params: { username: { required: true, type: "string" } },
            url: "/users/:username/installation"
        },
        listAccountsUserOrOrgOnPlan: {
            method: "GET",
            params: {
                direction: { enum: ["asc", "desc"], type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                plan_id: { required: true, type: "integer" },
                sort: { enum: ["created", "updated"], type: "string" }
            },
            url: "/marketplace_listing/plans/:plan_id/accounts"
        },
        listAccountsUserOrOrgOnPlanStubbed: {
            method: "GET",
            params: {
                direction: { enum: ["asc", "desc"], type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                plan_id: { required: true, type: "integer" },
                sort: { enum: ["created", "updated"], type: "string" }
            },
            url: "/marketplace_listing/stubbed/plans/:plan_id/accounts"
        },
        listInstallationReposForAuthenticatedUser: {
            headers: { accept: "application/vnd.github.machine-man-preview+json" },
            method: "GET",
            params: {
                installation_id: { required: true, type: "integer" },
                page: { type: "integer" },
                per_page: { type: "integer" }
            },
            url: "/user/installations/:installation_id/repositories"
        },
        listInstallations: {
            headers: { accept: "application/vnd.github.machine-man-preview+json" },
            method: "GET",
            params: { page: { type: "integer" }, per_page: { type: "integer" } },
            url: "/app/installations"
        },
        listInstallationsForAuthenticatedUser: {
            headers: { accept: "application/vnd.github.machine-man-preview+json" },
            method: "GET",
            params: { page: { type: "integer" }, per_page: { type: "integer" } },
            url: "/user/installations"
        },
        listMarketplacePurchasesForAuthenticatedUser: {
            method: "GET",
            params: { page: { type: "integer" }, per_page: { type: "integer" } },
            url: "/user/marketplace_purchases"
        },
        listMarketplacePurchasesForAuthenticatedUserStubbed: {
            method: "GET",
            params: { page: { type: "integer" }, per_page: { type: "integer" } },
            url: "/user/marketplace_purchases/stubbed"
        },
        listPlans: {
            method: "GET",
            params: { page: { type: "integer" }, per_page: { type: "integer" } },
            url: "/marketplace_listing/plans"
        },
        listPlansStubbed: {
            method: "GET",
            params: { page: { type: "integer" }, per_page: { type: "integer" } },
            url: "/marketplace_listing/stubbed/plans"
        },
        listRepos: {
            headers: { accept: "application/vnd.github.machine-man-preview+json" },
            method: "GET",
            params: { page: { type: "integer" }, per_page: { type: "integer" } },
            url: "/installation/repositories"
        },
        removeRepoFromInstallation: {
            headers: { accept: "application/vnd.github.machine-man-preview+json" },
            method: "DELETE",
            params: {
                installation_id: { required: true, type: "integer" },
                repository_id: { required: true, type: "integer" }
            },
            url: "/user/installations/:installation_id/repositories/:repository_id"
        },
        resetAuthorization: {
            deprecated: "octokit.apps.resetAuthorization() is deprecated, see https://developer.github.com/v3/apps/oauth_applications/#reset-an-authorization",
            method: "POST",
            params: {
                access_token: { required: true, type: "string" },
                client_id: { required: true, type: "string" }
            },
            url: "/applications/:client_id/tokens/:access_token"
        },
        resetToken: {
            headers: { accept: "application/vnd.github.doctor-strange-preview+json" },
            method: "PATCH",
            params: {
                access_token: { type: "string" },
                client_id: { required: true, type: "string" }
            },
            url: "/applications/:client_id/token"
        },
        revokeAuthorizationForApplication: {
            deprecated: "octokit.apps.revokeAuthorizationForApplication() is deprecated, see https://developer.github.com/v3/apps/oauth_applications/#revoke-an-authorization-for-an-application",
            method: "DELETE",
            params: {
                access_token: { required: true, type: "string" },
                client_id: { required: true, type: "string" }
            },
            url: "/applications/:client_id/tokens/:access_token"
        },
        revokeGrantForApplication: {
            deprecated: "octokit.apps.revokeGrantForApplication() is deprecated, see https://developer.github.com/v3/apps/oauth_applications/#revoke-a-grant-for-an-application",
            method: "DELETE",
            params: {
                access_token: { required: true, type: "string" },
                client_id: { required: true, type: "string" }
            },
            url: "/applications/:client_id/grants/:access_token"
        },
        revokeInstallationToken: {
            headers: { accept: "application/vnd.github.gambit-preview+json" },
            method: "DELETE",
            params: {},
            url: "/installation/token"
        }
    },
    checks: {
        create: {
            headers: { accept: "application/vnd.github.antiope-preview+json" },
            method: "POST",
            params: {
                actions: { type: "object[]" },
                "actions[].description": { required: true, type: "string" },
                "actions[].identifier": { required: true, type: "string" },
                "actions[].label": { required: true, type: "string" },
                completed_at: { type: "string" },
                conclusion: {
                    enum: [
                        "success",
                        "failure",
                        "neutral",
                        "cancelled",
                        "timed_out",
                        "action_required"
                    ],
                    type: "string"
                },
                details_url: { type: "string" },
                external_id: { type: "string" },
                head_sha: { required: true, type: "string" },
                name: { required: true, type: "string" },
                output: { type: "object" },
                "output.annotations": { type: "object[]" },
                "output.annotations[].annotation_level": {
                    enum: ["notice", "warning", "failure"],
                    required: true,
                    type: "string"
                },
                "output.annotations[].end_column": { type: "integer" },
                "output.annotations[].end_line": { required: true, type: "integer" },
                "output.annotations[].message": { required: true, type: "string" },
                "output.annotations[].path": { required: true, type: "string" },
                "output.annotations[].raw_details": { type: "string" },
                "output.annotations[].start_column": { type: "integer" },
                "output.annotations[].start_line": { required: true, type: "integer" },
                "output.annotations[].title": { type: "string" },
                "output.images": { type: "object[]" },
                "output.images[].alt": { required: true, type: "string" },
                "output.images[].caption": { type: "string" },
                "output.images[].image_url": { required: true, type: "string" },
                "output.summary": { required: true, type: "string" },
                "output.text": { type: "string" },
                "output.title": { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                started_at: { type: "string" },
                status: { enum: ["queued", "in_progress", "completed"], type: "string" }
            },
            url: "/repos/:owner/:repo/check-runs"
        },
        createSuite: {
            headers: { accept: "application/vnd.github.antiope-preview+json" },
            method: "POST",
            params: {
                head_sha: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/check-suites"
        },
        get: {
            headers: { accept: "application/vnd.github.antiope-preview+json" },
            method: "GET",
            params: {
                check_run_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/check-runs/:check_run_id"
        },
        getSuite: {
            headers: { accept: "application/vnd.github.antiope-preview+json" },
            method: "GET",
            params: {
                check_suite_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/check-suites/:check_suite_id"
        },
        listAnnotations: {
            headers: { accept: "application/vnd.github.antiope-preview+json" },
            method: "GET",
            params: {
                check_run_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/check-runs/:check_run_id/annotations"
        },
        listForRef: {
            headers: { accept: "application/vnd.github.antiope-preview+json" },
            method: "GET",
            params: {
                check_name: { type: "string" },
                filter: { enum: ["latest", "all"], type: "string" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                ref: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                status: { enum: ["queued", "in_progress", "completed"], type: "string" }
            },
            url: "/repos/:owner/:repo/commits/:ref/check-runs"
        },
        listForSuite: {
            headers: { accept: "application/vnd.github.antiope-preview+json" },
            method: "GET",
            params: {
                check_name: { type: "string" },
                check_suite_id: { required: true, type: "integer" },
                filter: { enum: ["latest", "all"], type: "string" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" },
                status: { enum: ["queued", "in_progress", "completed"], type: "string" }
            },
            url: "/repos/:owner/:repo/check-suites/:check_suite_id/check-runs"
        },
        listSuitesForRef: {
            headers: { accept: "application/vnd.github.antiope-preview+json" },
            method: "GET",
            params: {
                app_id: { type: "integer" },
                check_name: { type: "string" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                ref: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/commits/:ref/check-suites"
        },
        rerequestSuite: {
            headers: { accept: "application/vnd.github.antiope-preview+json" },
            method: "POST",
            params: {
                check_suite_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/check-suites/:check_suite_id/rerequest"
        },
        setSuitesPreferences: {
            headers: { accept: "application/vnd.github.antiope-preview+json" },
            method: "PATCH",
            params: {
                auto_trigger_checks: { type: "object[]" },
                "auto_trigger_checks[].app_id": { required: true, type: "integer" },
                "auto_trigger_checks[].setting": { required: true, type: "boolean" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/check-suites/preferences"
        },
        update: {
            headers: { accept: "application/vnd.github.antiope-preview+json" },
            method: "PATCH",
            params: {
                actions: { type: "object[]" },
                "actions[].description": { required: true, type: "string" },
                "actions[].identifier": { required: true, type: "string" },
                "actions[].label": { required: true, type: "string" },
                check_run_id: { required: true, type: "integer" },
                completed_at: { type: "string" },
                conclusion: {
                    enum: [
                        "success",
                        "failure",
                        "neutral",
                        "cancelled",
                        "timed_out",
                        "action_required"
                    ],
                    type: "string"
                },
                details_url: { type: "string" },
                external_id: { type: "string" },
                name: { type: "string" },
                output: { type: "object" },
                "output.annotations": { type: "object[]" },
                "output.annotations[].annotation_level": {
                    enum: ["notice", "warning", "failure"],
                    required: true,
                    type: "string"
                },
                "output.annotations[].end_column": { type: "integer" },
                "output.annotations[].end_line": { required: true, type: "integer" },
                "output.annotations[].message": { required: true, type: "string" },
                "output.annotations[].path": { required: true, type: "string" },
                "output.annotations[].raw_details": { type: "string" },
                "output.annotations[].start_column": { type: "integer" },
                "output.annotations[].start_line": { required: true, type: "integer" },
                "output.annotations[].title": { type: "string" },
                "output.images": { type: "object[]" },
                "output.images[].alt": { required: true, type: "string" },
                "output.images[].caption": { type: "string" },
                "output.images[].image_url": { required: true, type: "string" },
                "output.summary": { required: true, type: "string" },
                "output.text": { type: "string" },
                "output.title": { type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                started_at: { type: "string" },
                status: { enum: ["queued", "in_progress", "completed"], type: "string" }
            },
            url: "/repos/:owner/:repo/check-runs/:check_run_id"
        }
    },
    codesOfConduct: {
        getConductCode: {
            headers: { accept: "application/vnd.github.scarlet-witch-preview+json" },
            method: "GET",
            params: { key: { required: true, type: "string" } },
            url: "/codes_of_conduct/:key"
        },
        getForRepo: {
            headers: { accept: "application/vnd.github.scarlet-witch-preview+json" },
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/community/code_of_conduct"
        },
        listConductCodes: {
            headers: { accept: "application/vnd.github.scarlet-witch-preview+json" },
            method: "GET",
            params: {},
            url: "/codes_of_conduct"
        }
    },
    emojis: { get: { method: "GET", params: {}, url: "/emojis" } },
    gists: {
        checkIsStarred: {
            method: "GET",
            params: { gist_id: { required: true, type: "string" } },
            url: "/gists/:gist_id/star"
        },
        create: {
            method: "POST",
            params: {
                description: { type: "string" },
                files: { required: true, type: "object" },
                "files.content": { type: "string" },
                public: { type: "boolean" }
            },
            url: "/gists"
        },
        createComment: {
            method: "POST",
            params: {
                body: { required: true, type: "string" },
                gist_id: { required: true, type: "string" }
            },
            url: "/gists/:gist_id/comments"
        },
        delete: {
            method: "DELETE",
            params: { gist_id: { required: true, type: "string" } },
            url: "/gists/:gist_id"
        },
        deleteComment: {
            method: "DELETE",
            params: {
                comment_id: { required: true, type: "integer" },
                gist_id: { required: true, type: "string" }
            },
            url: "/gists/:gist_id/comments/:comment_id"
        },
        fork: {
            method: "POST",
            params: { gist_id: { required: true, type: "string" } },
            url: "/gists/:gist_id/forks"
        },
        get: {
            method: "GET",
            params: { gist_id: { required: true, type: "string" } },
            url: "/gists/:gist_id"
        },
        getComment: {
            method: "GET",
            params: {
                comment_id: { required: true, type: "integer" },
                gist_id: { required: true, type: "string" }
            },
            url: "/gists/:gist_id/comments/:comment_id"
        },
        getRevision: {
            method: "GET",
            params: {
                gist_id: { required: true, type: "string" },
                sha: { required: true, type: "string" }
            },
            url: "/gists/:gist_id/:sha"
        },
        list: {
            method: "GET",
            params: {
                page: { type: "integer" },
                per_page: { type: "integer" },
                since: { type: "string" }
            },
            url: "/gists"
        },
        listComments: {
            method: "GET",
            params: {
                gist_id: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" }
            },
            url: "/gists/:gist_id/comments"
        },
        listCommits: {
            method: "GET",
            params: {
                gist_id: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" }
            },
            url: "/gists/:gist_id/commits"
        },
        listForks: {
            method: "GET",
            params: {
                gist_id: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" }
            },
            url: "/gists/:gist_id/forks"
        },
        listPublic: {
            method: "GET",
            params: {
                page: { type: "integer" },
                per_page: { type: "integer" },
                since: { type: "string" }
            },
            url: "/gists/public"
        },
        listPublicForUser: {
            method: "GET",
            params: {
                page: { type: "integer" },
                per_page: { type: "integer" },
                since: { type: "string" },
                username: { required: true, type: "string" }
            },
            url: "/users/:username/gists"
        },
        listStarred: {
            method: "GET",
            params: {
                page: { type: "integer" },
                per_page: { type: "integer" },
                since: { type: "string" }
            },
            url: "/gists/starred"
        },
        star: {
            method: "PUT",
            params: { gist_id: { required: true, type: "string" } },
            url: "/gists/:gist_id/star"
        },
        unstar: {
            method: "DELETE",
            params: { gist_id: { required: true, type: "string" } },
            url: "/gists/:gist_id/star"
        },
        update: {
            method: "PATCH",
            params: {
                description: { type: "string" },
                files: { type: "object" },
                "files.content": { type: "string" },
                "files.filename": { type: "string" },
                gist_id: { required: true, type: "string" }
            },
            url: "/gists/:gist_id"
        },
        updateComment: {
            method: "PATCH",
            params: {
                body: { required: true, type: "string" },
                comment_id: { required: true, type: "integer" },
                gist_id: { required: true, type: "string" }
            },
            url: "/gists/:gist_id/comments/:comment_id"
        }
    },
    git: {
        createBlob: {
            method: "POST",
            params: {
                content: { required: true, type: "string" },
                encoding: { type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/git/blobs"
        },
        createCommit: {
            method: "POST",
            params: {
                author: { type: "object" },
                "author.date": { type: "string" },
                "author.email": { type: "string" },
                "author.name": { type: "string" },
                committer: { type: "object" },
                "committer.date": { type: "string" },
                "committer.email": { type: "string" },
                "committer.name": { type: "string" },
                message: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                parents: { required: true, type: "string[]" },
                repo: { required: true, type: "string" },
                signature: { type: "string" },
                tree: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/git/commits"
        },
        createRef: {
            method: "POST",
            params: {
                owner: { required: true, type: "string" },
                ref: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                sha: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/git/refs"
        },
        createTag: {
            method: "POST",
            params: {
                message: { required: true, type: "string" },
                object: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                tag: { required: true, type: "string" },
                tagger: { type: "object" },
                "tagger.date": { type: "string" },
                "tagger.email": { type: "string" },
                "tagger.name": { type: "string" },
                type: {
                    enum: ["commit", "tree", "blob"],
                    required: true,
                    type: "string"
                }
            },
            url: "/repos/:owner/:repo/git/tags"
        },
        createTree: {
            method: "POST",
            params: {
                base_tree: { type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                tree: { required: true, type: "object[]" },
                "tree[].content": { type: "string" },
                "tree[].mode": {
                    enum: ["100644", "100755", "040000", "160000", "120000"],
                    type: "string"
                },
                "tree[].path": { type: "string" },
                "tree[].sha": { allowNull: true, type: "string" },
                "tree[].type": { enum: ["blob", "tree", "commit"], type: "string" }
            },
            url: "/repos/:owner/:repo/git/trees"
        },
        deleteRef: {
            method: "DELETE",
            params: {
                owner: { required: true, type: "string" },
                ref: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/git/refs/:ref"
        },
        getBlob: {
            method: "GET",
            params: {
                file_sha: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/git/blobs/:file_sha"
        },
        getCommit: {
            method: "GET",
            params: {
                commit_sha: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/git/commits/:commit_sha"
        },
        getRef: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                ref: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/git/ref/:ref"
        },
        getTag: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                tag_sha: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/git/tags/:tag_sha"
        },
        getTree: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                recursive: { enum: ["1"], type: "integer" },
                repo: { required: true, type: "string" },
                tree_sha: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/git/trees/:tree_sha"
        },
        listMatchingRefs: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                ref: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/git/matching-refs/:ref"
        },
        listRefs: {
            method: "GET",
            params: {
                namespace: { type: "string" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/git/refs/:namespace"
        },
        updateRef: {
            method: "PATCH",
            params: {
                force: { type: "boolean" },
                owner: { required: true, type: "string" },
                ref: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                sha: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/git/refs/:ref"
        }
    },
    gitignore: {
        getTemplate: {
            method: "GET",
            params: { name: { required: true, type: "string" } },
            url: "/gitignore/templates/:name"
        },
        listTemplates: { method: "GET", params: {}, url: "/gitignore/templates" }
    },
    interactions: {
        addOrUpdateRestrictionsForOrg: {
            headers: { accept: "application/vnd.github.sombra-preview+json" },
            method: "PUT",
            params: {
                limit: {
                    enum: ["existing_users", "contributors_only", "collaborators_only"],
                    required: true,
                    type: "string"
                },
                org: { required: true, type: "string" }
            },
            url: "/orgs/:org/interaction-limits"
        },
        addOrUpdateRestrictionsForRepo: {
            headers: { accept: "application/vnd.github.sombra-preview+json" },
            method: "PUT",
            params: {
                limit: {
                    enum: ["existing_users", "contributors_only", "collaborators_only"],
                    required: true,
                    type: "string"
                },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/interaction-limits"
        },
        getRestrictionsForOrg: {
            headers: { accept: "application/vnd.github.sombra-preview+json" },
            method: "GET",
            params: { org: { required: true, type: "string" } },
            url: "/orgs/:org/interaction-limits"
        },
        getRestrictionsForRepo: {
            headers: { accept: "application/vnd.github.sombra-preview+json" },
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/interaction-limits"
        },
        removeRestrictionsForOrg: {
            headers: { accept: "application/vnd.github.sombra-preview+json" },
            method: "DELETE",
            params: { org: { required: true, type: "string" } },
            url: "/orgs/:org/interaction-limits"
        },
        removeRestrictionsForRepo: {
            headers: { accept: "application/vnd.github.sombra-preview+json" },
            method: "DELETE",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/interaction-limits"
        }
    },
    issues: {
        addAssignees: {
            method: "POST",
            params: {
                assignees: { type: "string[]" },
                issue_number: { required: true, type: "integer" },
                number: { alias: "issue_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/issues/:issue_number/assignees"
        },
        addLabels: {
            method: "POST",
            params: {
                issue_number: { required: true, type: "integer" },
                labels: { required: true, type: "string[]" },
                number: { alias: "issue_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/issues/:issue_number/labels"
        },
        checkAssignee: {
            method: "GET",
            params: {
                assignee: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/assignees/:assignee"
        },
        create: {
            method: "POST",
            params: {
                assignee: { type: "string" },
                assignees: { type: "string[]" },
                body: { type: "string" },
                labels: { type: "string[]" },
                milestone: { type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                title: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/issues"
        },
        createComment: {
            method: "POST",
            params: {
                body: { required: true, type: "string" },
                issue_number: { required: true, type: "integer" },
                number: { alias: "issue_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/issues/:issue_number/comments"
        },
        createLabel: {
            method: "POST",
            params: {
                color: { required: true, type: "string" },
                description: { type: "string" },
                name: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/labels"
        },
        createMilestone: {
            method: "POST",
            params: {
                description: { type: "string" },
                due_on: { type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                state: { enum: ["open", "closed"], type: "string" },
                title: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/milestones"
        },
        deleteComment: {
            method: "DELETE",
            params: {
                comment_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/issues/comments/:comment_id"
        },
        deleteLabel: {
            method: "DELETE",
            params: {
                name: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/labels/:name"
        },
        deleteMilestone: {
            method: "DELETE",
            params: {
                milestone_number: { required: true, type: "integer" },
                number: {
                    alias: "milestone_number",
                    deprecated: true,
                    type: "integer"
                },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/milestones/:milestone_number"
        },
        get: {
            method: "GET",
            params: {
                issue_number: { required: true, type: "integer" },
                number: { alias: "issue_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/issues/:issue_number"
        },
        getComment: {
            method: "GET",
            params: {
                comment_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/issues/comments/:comment_id"
        },
        getEvent: {
            method: "GET",
            params: {
                event_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/issues/events/:event_id"
        },
        getLabel: {
            method: "GET",
            params: {
                name: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/labels/:name"
        },
        getMilestone: {
            method: "GET",
            params: {
                milestone_number: { required: true, type: "integer" },
                number: {
                    alias: "milestone_number",
                    deprecated: true,
                    type: "integer"
                },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/milestones/:milestone_number"
        },
        list: {
            method: "GET",
            params: {
                direction: { enum: ["asc", "desc"], type: "string" },
                filter: {
                    enum: ["assigned", "created", "mentioned", "subscribed", "all"],
                    type: "string"
                },
                labels: { type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                since: { type: "string" },
                sort: { enum: ["created", "updated", "comments"], type: "string" },
                state: { enum: ["open", "closed", "all"], type: "string" }
            },
            url: "/issues"
        },
        listAssignees: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/assignees"
        },
        listComments: {
            method: "GET",
            params: {
                issue_number: { required: true, type: "integer" },
                number: { alias: "issue_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" },
                since: { type: "string" }
            },
            url: "/repos/:owner/:repo/issues/:issue_number/comments"
        },
        listCommentsForRepo: {
            method: "GET",
            params: {
                direction: { enum: ["asc", "desc"], type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                since: { type: "string" },
                sort: { enum: ["created", "updated"], type: "string" }
            },
            url: "/repos/:owner/:repo/issues/comments"
        },
        listEvents: {
            method: "GET",
            params: {
                issue_number: { required: true, type: "integer" },
                number: { alias: "issue_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/issues/:issue_number/events"
        },
        listEventsForRepo: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/issues/events"
        },
        listEventsForTimeline: {
            headers: { accept: "application/vnd.github.mockingbird-preview+json" },
            method: "GET",
            params: {
                issue_number: { required: true, type: "integer" },
                number: { alias: "issue_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/issues/:issue_number/timeline"
        },
        listForAuthenticatedUser: {
            method: "GET",
            params: {
                direction: { enum: ["asc", "desc"], type: "string" },
                filter: {
                    enum: ["assigned", "created", "mentioned", "subscribed", "all"],
                    type: "string"
                },
                labels: { type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                since: { type: "string" },
                sort: { enum: ["created", "updated", "comments"], type: "string" },
                state: { enum: ["open", "closed", "all"], type: "string" }
            },
            url: "/user/issues"
        },
        listForOrg: {
            method: "GET",
            params: {
                direction: { enum: ["asc", "desc"], type: "string" },
                filter: {
                    enum: ["assigned", "created", "mentioned", "subscribed", "all"],
                    type: "string"
                },
                labels: { type: "string" },
                org: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                since: { type: "string" },
                sort: { enum: ["created", "updated", "comments"], type: "string" },
                state: { enum: ["open", "closed", "all"], type: "string" }
            },
            url: "/orgs/:org/issues"
        },
        listForRepo: {
            method: "GET",
            params: {
                assignee: { type: "string" },
                creator: { type: "string" },
                direction: { enum: ["asc", "desc"], type: "string" },
                labels: { type: "string" },
                mentioned: { type: "string" },
                milestone: { type: "string" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" },
                since: { type: "string" },
                sort: { enum: ["created", "updated", "comments"], type: "string" },
                state: { enum: ["open", "closed", "all"], type: "string" }
            },
            url: "/repos/:owner/:repo/issues"
        },
        listLabelsForMilestone: {
            method: "GET",
            params: {
                milestone_number: { required: true, type: "integer" },
                number: {
                    alias: "milestone_number",
                    deprecated: true,
                    type: "integer"
                },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/milestones/:milestone_number/labels"
        },
        listLabelsForRepo: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/labels"
        },
        listLabelsOnIssue: {
            method: "GET",
            params: {
                issue_number: { required: true, type: "integer" },
                number: { alias: "issue_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/issues/:issue_number/labels"
        },
        listMilestonesForRepo: {
            method: "GET",
            params: {
                direction: { enum: ["asc", "desc"], type: "string" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" },
                sort: { enum: ["due_on", "completeness"], type: "string" },
                state: { enum: ["open", "closed", "all"], type: "string" }
            },
            url: "/repos/:owner/:repo/milestones"
        },
        lock: {
            method: "PUT",
            params: {
                issue_number: { required: true, type: "integer" },
                lock_reason: {
                    enum: ["off-topic", "too heated", "resolved", "spam"],
                    type: "string"
                },
                number: { alias: "issue_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/issues/:issue_number/lock"
        },
        removeAssignees: {
            method: "DELETE",
            params: {
                assignees: { type: "string[]" },
                issue_number: { required: true, type: "integer" },
                number: { alias: "issue_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/issues/:issue_number/assignees"
        },
        removeLabel: {
            method: "DELETE",
            params: {
                issue_number: { required: true, type: "integer" },
                name: { required: true, type: "string" },
                number: { alias: "issue_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/issues/:issue_number/labels/:name"
        },
        removeLabels: {
            method: "DELETE",
            params: {
                issue_number: { required: true, type: "integer" },
                number: { alias: "issue_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/issues/:issue_number/labels"
        },
        replaceLabels: {
            method: "PUT",
            params: {
                issue_number: { required: true, type: "integer" },
                labels: { type: "string[]" },
                number: { alias: "issue_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/issues/:issue_number/labels"
        },
        unlock: {
            method: "DELETE",
            params: {
                issue_number: { required: true, type: "integer" },
                number: { alias: "issue_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/issues/:issue_number/lock"
        },
        update: {
            method: "PATCH",
            params: {
                assignee: { type: "string" },
                assignees: { type: "string[]" },
                body: { type: "string" },
                issue_number: { required: true, type: "integer" },
                labels: { type: "string[]" },
                milestone: { allowNull: true, type: "integer" },
                number: { alias: "issue_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                state: { enum: ["open", "closed"], type: "string" },
                title: { type: "string" }
            },
            url: "/repos/:owner/:repo/issues/:issue_number"
        },
        updateComment: {
            method: "PATCH",
            params: {
                body: { required: true, type: "string" },
                comment_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/issues/comments/:comment_id"
        },
        updateLabel: {
            method: "PATCH",
            params: {
                color: { type: "string" },
                current_name: { required: true, type: "string" },
                description: { type: "string" },
                name: { type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/labels/:current_name"
        },
        updateMilestone: {
            method: "PATCH",
            params: {
                description: { type: "string" },
                due_on: { type: "string" },
                milestone_number: { required: true, type: "integer" },
                number: {
                    alias: "milestone_number",
                    deprecated: true,
                    type: "integer"
                },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                state: { enum: ["open", "closed"], type: "string" },
                title: { type: "string" }
            },
            url: "/repos/:owner/:repo/milestones/:milestone_number"
        }
    },
    licenses: {
        get: {
            method: "GET",
            params: { license: { required: true, type: "string" } },
            url: "/licenses/:license"
        },
        getForRepo: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/license"
        },
        list: {
            deprecated: "octokit.licenses.list() has been renamed to octokit.licenses.listCommonlyUsed() (2019-03-05)",
            method: "GET",
            params: {},
            url: "/licenses"
        },
        listCommonlyUsed: { method: "GET", params: {}, url: "/licenses" }
    },
    markdown: {
        render: {
            method: "POST",
            params: {
                context: { type: "string" },
                mode: { enum: ["markdown", "gfm"], type: "string" },
                text: { required: true, type: "string" }
            },
            url: "/markdown"
        },
        renderRaw: {
            headers: { "content-type": "text/plain; charset=utf-8" },
            method: "POST",
            params: { data: { mapTo: "data", required: true, type: "string" } },
            url: "/markdown/raw"
        }
    },
    meta: { get: { method: "GET", params: {}, url: "/meta" } },
    migrations: {
        cancelImport: {
            method: "DELETE",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/import"
        },
        deleteArchiveForAuthenticatedUser: {
            headers: { accept: "application/vnd.github.wyandotte-preview+json" },
            method: "DELETE",
            params: { migration_id: { required: true, type: "integer" } },
            url: "/user/migrations/:migration_id/archive"
        },
        deleteArchiveForOrg: {
            headers: { accept: "application/vnd.github.wyandotte-preview+json" },
            method: "DELETE",
            params: {
                migration_id: { required: true, type: "integer" },
                org: { required: true, type: "string" }
            },
            url: "/orgs/:org/migrations/:migration_id/archive"
        },
        downloadArchiveForOrg: {
            headers: { accept: "application/vnd.github.wyandotte-preview+json" },
            method: "GET",
            params: {
                migration_id: { required: true, type: "integer" },
                org: { required: true, type: "string" }
            },
            url: "/orgs/:org/migrations/:migration_id/archive"
        },
        getArchiveForAuthenticatedUser: {
            headers: { accept: "application/vnd.github.wyandotte-preview+json" },
            method: "GET",
            params: { migration_id: { required: true, type: "integer" } },
            url: "/user/migrations/:migration_id/archive"
        },
        getArchiveForOrg: {
            deprecated: "octokit.migrations.getArchiveForOrg() has been renamed to octokit.migrations.downloadArchiveForOrg() (2020-01-27)",
            headers: { accept: "application/vnd.github.wyandotte-preview+json" },
            method: "GET",
            params: {
                migration_id: { required: true, type: "integer" },
                org: { required: true, type: "string" }
            },
            url: "/orgs/:org/migrations/:migration_id/archive"
        },
        getCommitAuthors: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                since: { type: "string" }
            },
            url: "/repos/:owner/:repo/import/authors"
        },
        getImportProgress: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/import"
        },
        getLargeFiles: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/import/large_files"
        },
        getStatusForAuthenticatedUser: {
            headers: { accept: "application/vnd.github.wyandotte-preview+json" },
            method: "GET",
            params: { migration_id: { required: true, type: "integer" } },
            url: "/user/migrations/:migration_id"
        },
        getStatusForOrg: {
            headers: { accept: "application/vnd.github.wyandotte-preview+json" },
            method: "GET",
            params: {
                migration_id: { required: true, type: "integer" },
                org: { required: true, type: "string" }
            },
            url: "/orgs/:org/migrations/:migration_id"
        },
        listForAuthenticatedUser: {
            headers: { accept: "application/vnd.github.wyandotte-preview+json" },
            method: "GET",
            params: { page: { type: "integer" }, per_page: { type: "integer" } },
            url: "/user/migrations"
        },
        listForOrg: {
            headers: { accept: "application/vnd.github.wyandotte-preview+json" },
            method: "GET",
            params: {
                org: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" }
            },
            url: "/orgs/:org/migrations"
        },
        listReposForOrg: {
            headers: { accept: "application/vnd.github.wyandotte-preview+json" },
            method: "GET",
            params: {
                migration_id: { required: true, type: "integer" },
                org: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" }
            },
            url: "/orgs/:org/migrations/:migration_id/repositories"
        },
        listReposForUser: {
            headers: { accept: "application/vnd.github.wyandotte-preview+json" },
            method: "GET",
            params: {
                migration_id: { required: true, type: "integer" },
                page: { type: "integer" },
                per_page: { type: "integer" }
            },
            url: "/user/:migration_id/repositories"
        },
        mapCommitAuthor: {
            method: "PATCH",
            params: {
                author_id: { required: true, type: "integer" },
                email: { type: "string" },
                name: { type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/import/authors/:author_id"
        },
        setLfsPreference: {
            method: "PATCH",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                use_lfs: { enum: ["opt_in", "opt_out"], required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/import/lfs"
        },
        startForAuthenticatedUser: {
            method: "POST",
            params: {
                exclude_attachments: { type: "boolean" },
                lock_repositories: { type: "boolean" },
                repositories: { required: true, type: "string[]" }
            },
            url: "/user/migrations"
        },
        startForOrg: {
            method: "POST",
            params: {
                exclude_attachments: { type: "boolean" },
                lock_repositories: { type: "boolean" },
                org: { required: true, type: "string" },
                repositories: { required: true, type: "string[]" }
            },
            url: "/orgs/:org/migrations"
        },
        startImport: {
            method: "PUT",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                tfvc_project: { type: "string" },
                vcs: {
                    enum: ["subversion", "git", "mercurial", "tfvc"],
                    type: "string"
                },
                vcs_password: { type: "string" },
                vcs_url: { required: true, type: "string" },
                vcs_username: { type: "string" }
            },
            url: "/repos/:owner/:repo/import"
        },
        unlockRepoForAuthenticatedUser: {
            headers: { accept: "application/vnd.github.wyandotte-preview+json" },
            method: "DELETE",
            params: {
                migration_id: { required: true, type: "integer" },
                repo_name: { required: true, type: "string" }
            },
            url: "/user/migrations/:migration_id/repos/:repo_name/lock"
        },
        unlockRepoForOrg: {
            headers: { accept: "application/vnd.github.wyandotte-preview+json" },
            method: "DELETE",
            params: {
                migration_id: { required: true, type: "integer" },
                org: { required: true, type: "string" },
                repo_name: { required: true, type: "string" }
            },
            url: "/orgs/:org/migrations/:migration_id/repos/:repo_name/lock"
        },
        updateImport: {
            method: "PATCH",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                vcs_password: { type: "string" },
                vcs_username: { type: "string" }
            },
            url: "/repos/:owner/:repo/import"
        }
    },
    oauthAuthorizations: {
        checkAuthorization: {
            deprecated: "octokit.oauthAuthorizations.checkAuthorization() has been renamed to octokit.apps.checkAuthorization() (2019-11-05)",
            method: "GET",
            params: {
                access_token: { required: true, type: "string" },
                client_id: { required: true, type: "string" }
            },
            url: "/applications/:client_id/tokens/:access_token"
        },
        createAuthorization: {
            deprecated: "octokit.oauthAuthorizations.createAuthorization() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#create-a-new-authorization",
            method: "POST",
            params: {
                client_id: { type: "string" },
                client_secret: { type: "string" },
                fingerprint: { type: "string" },
                note: { required: true, type: "string" },
                note_url: { type: "string" },
                scopes: { type: "string[]" }
            },
            url: "/authorizations"
        },
        deleteAuthorization: {
            deprecated: "octokit.oauthAuthorizations.deleteAuthorization() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#delete-an-authorization",
            method: "DELETE",
            params: { authorization_id: { required: true, type: "integer" } },
            url: "/authorizations/:authorization_id"
        },
        deleteGrant: {
            deprecated: "octokit.oauthAuthorizations.deleteGrant() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#delete-a-grant",
            method: "DELETE",
            params: { grant_id: { required: true, type: "integer" } },
            url: "/applications/grants/:grant_id"
        },
        getAuthorization: {
            deprecated: "octokit.oauthAuthorizations.getAuthorization() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#get-a-single-authorization",
            method: "GET",
            params: { authorization_id: { required: true, type: "integer" } },
            url: "/authorizations/:authorization_id"
        },
        getGrant: {
            deprecated: "octokit.oauthAuthorizations.getGrant() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#get-a-single-grant",
            method: "GET",
            params: { grant_id: { required: true, type: "integer" } },
            url: "/applications/grants/:grant_id"
        },
        getOrCreateAuthorizationForApp: {
            deprecated: "octokit.oauthAuthorizations.getOrCreateAuthorizationForApp() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#get-or-create-an-authorization-for-a-specific-app",
            method: "PUT",
            params: {
                client_id: { required: true, type: "string" },
                client_secret: { required: true, type: "string" },
                fingerprint: { type: "string" },
                note: { type: "string" },
                note_url: { type: "string" },
                scopes: { type: "string[]" }
            },
            url: "/authorizations/clients/:client_id"
        },
        getOrCreateAuthorizationForAppAndFingerprint: {
            deprecated: "octokit.oauthAuthorizations.getOrCreateAuthorizationForAppAndFingerprint() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#get-or-create-an-authorization-for-a-specific-app-and-fingerprint",
            method: "PUT",
            params: {
                client_id: { required: true, type: "string" },
                client_secret: { required: true, type: "string" },
                fingerprint: { required: true, type: "string" },
                note: { type: "string" },
                note_url: { type: "string" },
                scopes: { type: "string[]" }
            },
            url: "/authorizations/clients/:client_id/:fingerprint"
        },
        getOrCreateAuthorizationForAppFingerprint: {
            deprecated: "octokit.oauthAuthorizations.getOrCreateAuthorizationForAppFingerprint() has been renamed to octokit.oauthAuthorizations.getOrCreateAuthorizationForAppAndFingerprint() (2018-12-27)",
            method: "PUT",
            params: {
                client_id: { required: true, type: "string" },
                client_secret: { required: true, type: "string" },
                fingerprint: { required: true, type: "string" },
                note: { type: "string" },
                note_url: { type: "string" },
                scopes: { type: "string[]" }
            },
            url: "/authorizations/clients/:client_id/:fingerprint"
        },
        listAuthorizations: {
            deprecated: "octokit.oauthAuthorizations.listAuthorizations() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#list-your-authorizations",
            method: "GET",
            params: { page: { type: "integer" }, per_page: { type: "integer" } },
            url: "/authorizations"
        },
        listGrants: {
            deprecated: "octokit.oauthAuthorizations.listGrants() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#list-your-grants",
            method: "GET",
            params: { page: { type: "integer" }, per_page: { type: "integer" } },
            url: "/applications/grants"
        },
        resetAuthorization: {
            deprecated: "octokit.oauthAuthorizations.resetAuthorization() has been renamed to octokit.apps.resetAuthorization() (2019-11-05)",
            method: "POST",
            params: {
                access_token: { required: true, type: "string" },
                client_id: { required: true, type: "string" }
            },
            url: "/applications/:client_id/tokens/:access_token"
        },
        revokeAuthorizationForApplication: {
            deprecated: "octokit.oauthAuthorizations.revokeAuthorizationForApplication() has been renamed to octokit.apps.revokeAuthorizationForApplication() (2019-11-05)",
            method: "DELETE",
            params: {
                access_token: { required: true, type: "string" },
                client_id: { required: true, type: "string" }
            },
            url: "/applications/:client_id/tokens/:access_token"
        },
        revokeGrantForApplication: {
            deprecated: "octokit.oauthAuthorizations.revokeGrantForApplication() has been renamed to octokit.apps.revokeGrantForApplication() (2019-11-05)",
            method: "DELETE",
            params: {
                access_token: { required: true, type: "string" },
                client_id: { required: true, type: "string" }
            },
            url: "/applications/:client_id/grants/:access_token"
        },
        updateAuthorization: {
            deprecated: "octokit.oauthAuthorizations.updateAuthorization() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#update-an-existing-authorization",
            method: "PATCH",
            params: {
                add_scopes: { type: "string[]" },
                authorization_id: { required: true, type: "integer" },
                fingerprint: { type: "string" },
                note: { type: "string" },
                note_url: { type: "string" },
                remove_scopes: { type: "string[]" },
                scopes: { type: "string[]" }
            },
            url: "/authorizations/:authorization_id"
        }
    },
    orgs: {
        addOrUpdateMembership: {
            method: "PUT",
            params: {
                org: { required: true, type: "string" },
                role: { enum: ["admin", "member"], type: "string" },
                username: { required: true, type: "string" }
            },
            url: "/orgs/:org/memberships/:username"
        },
        blockUser: {
            method: "PUT",
            params: {
                org: { required: true, type: "string" },
                username: { required: true, type: "string" }
            },
            url: "/orgs/:org/blocks/:username"
        },
        checkBlockedUser: {
            method: "GET",
            params: {
                org: { required: true, type: "string" },
                username: { required: true, type: "string" }
            },
            url: "/orgs/:org/blocks/:username"
        },
        checkMembership: {
            method: "GET",
            params: {
                org: { required: true, type: "string" },
                username: { required: true, type: "string" }
            },
            url: "/orgs/:org/members/:username"
        },
        checkPublicMembership: {
            method: "GET",
            params: {
                org: { required: true, type: "string" },
                username: { required: true, type: "string" }
            },
            url: "/orgs/:org/public_members/:username"
        },
        concealMembership: {
            method: "DELETE",
            params: {
                org: { required: true, type: "string" },
                username: { required: true, type: "string" }
            },
            url: "/orgs/:org/public_members/:username"
        },
        convertMemberToOutsideCollaborator: {
            method: "PUT",
            params: {
                org: { required: true, type: "string" },
                username: { required: true, type: "string" }
            },
            url: "/orgs/:org/outside_collaborators/:username"
        },
        createHook: {
            method: "POST",
            params: {
                active: { type: "boolean" },
                config: { required: true, type: "object" },
                "config.content_type": { type: "string" },
                "config.insecure_ssl": { type: "string" },
                "config.secret": { type: "string" },
                "config.url": { required: true, type: "string" },
                events: { type: "string[]" },
                name: { required: true, type: "string" },
                org: { required: true, type: "string" }
            },
            url: "/orgs/:org/hooks"
        },
        createInvitation: {
            method: "POST",
            params: {
                email: { type: "string" },
                invitee_id: { type: "integer" },
                org: { required: true, type: "string" },
                role: {
                    enum: ["admin", "direct_member", "billing_manager"],
                    type: "string"
                },
                team_ids: { type: "integer[]" }
            },
            url: "/orgs/:org/invitations"
        },
        deleteHook: {
            method: "DELETE",
            params: {
                hook_id: { required: true, type: "integer" },
                org: { required: true, type: "string" }
            },
            url: "/orgs/:org/hooks/:hook_id"
        },
        get: {
            method: "GET",
            params: { org: { required: true, type: "string" } },
            url: "/orgs/:org"
        },
        getHook: {
            method: "GET",
            params: {
                hook_id: { required: true, type: "integer" },
                org: { required: true, type: "string" }
            },
            url: "/orgs/:org/hooks/:hook_id"
        },
        getMembership: {
            method: "GET",
            params: {
                org: { required: true, type: "string" },
                username: { required: true, type: "string" }
            },
            url: "/orgs/:org/memberships/:username"
        },
        getMembershipForAuthenticatedUser: {
            method: "GET",
            params: { org: { required: true, type: "string" } },
            url: "/user/memberships/orgs/:org"
        },
        list: {
            method: "GET",
            params: {
                page: { type: "integer" },
                per_page: { type: "integer" },
                since: { type: "integer" }
            },
            url: "/organizations"
        },
        listBlockedUsers: {
            method: "GET",
            params: { org: { required: true, type: "string" } },
            url: "/orgs/:org/blocks"
        },
        listForAuthenticatedUser: {
            method: "GET",
            params: { page: { type: "integer" }, per_page: { type: "integer" } },
            url: "/user/orgs"
        },
        listForUser: {
            method: "GET",
            params: {
                page: { type: "integer" },
                per_page: { type: "integer" },
                username: { required: true, type: "string" }
            },
            url: "/users/:username/orgs"
        },
        listHooks: {
            method: "GET",
            params: {
                org: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" }
            },
            url: "/orgs/:org/hooks"
        },
        listInstallations: {
            headers: { accept: "application/vnd.github.machine-man-preview+json" },
            method: "GET",
            params: {
                org: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" }
            },
            url: "/orgs/:org/installations"
        },
        listInvitationTeams: {
            method: "GET",
            params: {
                invitation_id: { required: true, type: "integer" },
                org: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" }
            },
            url: "/orgs/:org/invitations/:invitation_id/teams"
        },
        listMembers: {
            method: "GET",
            params: {
                filter: { enum: ["2fa_disabled", "all"], type: "string" },
                org: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                role: { enum: ["all", "admin", "member"], type: "string" }
            },
            url: "/orgs/:org/members"
        },
        listMemberships: {
            method: "GET",
            params: {
                page: { type: "integer" },
                per_page: { type: "integer" },
                state: { enum: ["active", "pending"], type: "string" }
            },
            url: "/user/memberships/orgs"
        },
        listOutsideCollaborators: {
            method: "GET",
            params: {
                filter: { enum: ["2fa_disabled", "all"], type: "string" },
                org: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" }
            },
            url: "/orgs/:org/outside_collaborators"
        },
        listPendingInvitations: {
            method: "GET",
            params: {
                org: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" }
            },
            url: "/orgs/:org/invitations"
        },
        listPublicMembers: {
            method: "GET",
            params: {
                org: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" }
            },
            url: "/orgs/:org/public_members"
        },
        pingHook: {
            method: "POST",
            params: {
                hook_id: { required: true, type: "integer" },
                org: { required: true, type: "string" }
            },
            url: "/orgs/:org/hooks/:hook_id/pings"
        },
        publicizeMembership: {
            method: "PUT",
            params: {
                org: { required: true, type: "string" },
                username: { required: true, type: "string" }
            },
            url: "/orgs/:org/public_members/:username"
        },
        removeMember: {
            method: "DELETE",
            params: {
                org: { required: true, type: "string" },
                username: { required: true, type: "string" }
            },
            url: "/orgs/:org/members/:username"
        },
        removeMembership: {
            method: "DELETE",
            params: {
                org: { required: true, type: "string" },
                username: { required: true, type: "string" }
            },
            url: "/orgs/:org/memberships/:username"
        },
        removeOutsideCollaborator: {
            method: "DELETE",
            params: {
                org: { required: true, type: "string" },
                username: { required: true, type: "string" }
            },
            url: "/orgs/:org/outside_collaborators/:username"
        },
        unblockUser: {
            method: "DELETE",
            params: {
                org: { required: true, type: "string" },
                username: { required: true, type: "string" }
            },
            url: "/orgs/:org/blocks/:username"
        },
        update: {
            method: "PATCH",
            params: {
                billing_email: { type: "string" },
                company: { type: "string" },
                default_repository_permission: {
                    enum: ["read", "write", "admin", "none"],
                    type: "string"
                },
                description: { type: "string" },
                email: { type: "string" },
                has_organization_projects: { type: "boolean" },
                has_repository_projects: { type: "boolean" },
                location: { type: "string" },
                members_allowed_repository_creation_type: {
                    enum: ["all", "private", "none"],
                    type: "string"
                },
                members_can_create_internal_repositories: { type: "boolean" },
                members_can_create_private_repositories: { type: "boolean" },
                members_can_create_public_repositories: { type: "boolean" },
                members_can_create_repositories: { type: "boolean" },
                name: { type: "string" },
                org: { required: true, type: "string" }
            },
            url: "/orgs/:org"
        },
        updateHook: {
            method: "PATCH",
            params: {
                active: { type: "boolean" },
                config: { type: "object" },
                "config.content_type": { type: "string" },
                "config.insecure_ssl": { type: "string" },
                "config.secret": { type: "string" },
                "config.url": { required: true, type: "string" },
                events: { type: "string[]" },
                hook_id: { required: true, type: "integer" },
                org: { required: true, type: "string" }
            },
            url: "/orgs/:org/hooks/:hook_id"
        },
        updateMembership: {
            method: "PATCH",
            params: {
                org: { required: true, type: "string" },
                state: { enum: ["active"], required: true, type: "string" }
            },
            url: "/user/memberships/orgs/:org"
        }
    },
    projects: {
        addCollaborator: {
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "PUT",
            params: {
                permission: { enum: ["read", "write", "admin"], type: "string" },
                project_id: { required: true, type: "integer" },
                username: { required: true, type: "string" }
            },
            url: "/projects/:project_id/collaborators/:username"
        },
        createCard: {
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "POST",
            params: {
                column_id: { required: true, type: "integer" },
                content_id: { type: "integer" },
                content_type: { type: "string" },
                note: { type: "string" }
            },
            url: "/projects/columns/:column_id/cards"
        },
        createColumn: {
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "POST",
            params: {
                name: { required: true, type: "string" },
                project_id: { required: true, type: "integer" }
            },
            url: "/projects/:project_id/columns"
        },
        createForAuthenticatedUser: {
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "POST",
            params: {
                body: { type: "string" },
                name: { required: true, type: "string" }
            },
            url: "/user/projects"
        },
        createForOrg: {
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "POST",
            params: {
                body: { type: "string" },
                name: { required: true, type: "string" },
                org: { required: true, type: "string" }
            },
            url: "/orgs/:org/projects"
        },
        createForRepo: {
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "POST",
            params: {
                body: { type: "string" },
                name: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/projects"
        },
        delete: {
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "DELETE",
            params: { project_id: { required: true, type: "integer" } },
            url: "/projects/:project_id"
        },
        deleteCard: {
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "DELETE",
            params: { card_id: { required: true, type: "integer" } },
            url: "/projects/columns/cards/:card_id"
        },
        deleteColumn: {
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "DELETE",
            params: { column_id: { required: true, type: "integer" } },
            url: "/projects/columns/:column_id"
        },
        get: {
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "GET",
            params: { project_id: { required: true, type: "integer" } },
            url: "/projects/:project_id"
        },
        getCard: {
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "GET",
            params: { card_id: { required: true, type: "integer" } },
            url: "/projects/columns/cards/:card_id"
        },
        getColumn: {
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "GET",
            params: { column_id: { required: true, type: "integer" } },
            url: "/projects/columns/:column_id"
        },
        listCards: {
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "GET",
            params: {
                archived_state: {
                    enum: ["all", "archived", "not_archived"],
                    type: "string"
                },
                column_id: { required: true, type: "integer" },
                page: { type: "integer" },
                per_page: { type: "integer" }
            },
            url: "/projects/columns/:column_id/cards"
        },
        listCollaborators: {
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "GET",
            params: {
                affiliation: { enum: ["outside", "direct", "all"], type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                project_id: { required: true, type: "integer" }
            },
            url: "/projects/:project_id/collaborators"
        },
        listColumns: {
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "GET",
            params: {
                page: { type: "integer" },
                per_page: { type: "integer" },
                project_id: { required: true, type: "integer" }
            },
            url: "/projects/:project_id/columns"
        },
        listForOrg: {
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "GET",
            params: {
                org: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                state: { enum: ["open", "closed", "all"], type: "string" }
            },
            url: "/orgs/:org/projects"
        },
        listForRepo: {
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" },
                state: { enum: ["open", "closed", "all"], type: "string" }
            },
            url: "/repos/:owner/:repo/projects"
        },
        listForUser: {
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "GET",
            params: {
                page: { type: "integer" },
                per_page: { type: "integer" },
                state: { enum: ["open", "closed", "all"], type: "string" },
                username: { required: true, type: "string" }
            },
            url: "/users/:username/projects"
        },
        moveCard: {
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "POST",
            params: {
                card_id: { required: true, type: "integer" },
                column_id: { type: "integer" },
                position: {
                    required: true,
                    type: "string",
                    validation: "^(top|bottom|after:\\d+)$"
                }
            },
            url: "/projects/columns/cards/:card_id/moves"
        },
        moveColumn: {
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "POST",
            params: {
                column_id: { required: true, type: "integer" },
                position: {
                    required: true,
                    type: "string",
                    validation: "^(first|last|after:\\d+)$"
                }
            },
            url: "/projects/columns/:column_id/moves"
        },
        removeCollaborator: {
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "DELETE",
            params: {
                project_id: { required: true, type: "integer" },
                username: { required: true, type: "string" }
            },
            url: "/projects/:project_id/collaborators/:username"
        },
        reviewUserPermissionLevel: {
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "GET",
            params: {
                project_id: { required: true, type: "integer" },
                username: { required: true, type: "string" }
            },
            url: "/projects/:project_id/collaborators/:username/permission"
        },
        update: {
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "PATCH",
            params: {
                body: { type: "string" },
                name: { type: "string" },
                organization_permission: { type: "string" },
                private: { type: "boolean" },
                project_id: { required: true, type: "integer" },
                state: { enum: ["open", "closed"], type: "string" }
            },
            url: "/projects/:project_id"
        },
        updateCard: {
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "PATCH",
            params: {
                archived: { type: "boolean" },
                card_id: { required: true, type: "integer" },
                note: { type: "string" }
            },
            url: "/projects/columns/cards/:card_id"
        },
        updateColumn: {
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "PATCH",
            params: {
                column_id: { required: true, type: "integer" },
                name: { required: true, type: "string" }
            },
            url: "/projects/columns/:column_id"
        }
    },
    pulls: {
        checkIfMerged: {
            method: "GET",
            params: {
                number: { alias: "pull_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                pull_number: { required: true, type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/pulls/:pull_number/merge"
        },
        create: {
            method: "POST",
            params: {
                base: { required: true, type: "string" },
                body: { type: "string" },
                draft: { type: "boolean" },
                head: { required: true, type: "string" },
                maintainer_can_modify: { type: "boolean" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                title: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/pulls"
        },
        createComment: {
            method: "POST",
            params: {
                body: { required: true, type: "string" },
                commit_id: { required: true, type: "string" },
                in_reply_to: {
                    deprecated: true,
                    description: "The comment ID to reply to. **Note**: This must be the ID of a top-level comment, not a reply to that comment. Replies to replies are not supported.",
                    type: "integer"
                },
                line: { type: "integer" },
                number: { alias: "pull_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                path: { required: true, type: "string" },
                position: { type: "integer" },
                pull_number: { required: true, type: "integer" },
                repo: { required: true, type: "string" },
                side: { enum: ["LEFT", "RIGHT"], type: "string" },
                start_line: { type: "integer" },
                start_side: { enum: ["LEFT", "RIGHT", "side"], type: "string" }
            },
            url: "/repos/:owner/:repo/pulls/:pull_number/comments"
        },
        createCommentReply: {
            deprecated: "octokit.pulls.createCommentReply() has been renamed to octokit.pulls.createComment() (2019-09-09)",
            method: "POST",
            params: {
                body: { required: true, type: "string" },
                commit_id: { required: true, type: "string" },
                in_reply_to: {
                    deprecated: true,
                    description: "The comment ID to reply to. **Note**: This must be the ID of a top-level comment, not a reply to that comment. Replies to replies are not supported.",
                    type: "integer"
                },
                line: { type: "integer" },
                number: { alias: "pull_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                path: { required: true, type: "string" },
                position: { type: "integer" },
                pull_number: { required: true, type: "integer" },
                repo: { required: true, type: "string" },
                side: { enum: ["LEFT", "RIGHT"], type: "string" },
                start_line: { type: "integer" },
                start_side: { enum: ["LEFT", "RIGHT", "side"], type: "string" }
            },
            url: "/repos/:owner/:repo/pulls/:pull_number/comments"
        },
        createFromIssue: {
            deprecated: "octokit.pulls.createFromIssue() is deprecated, see https://developer.github.com/v3/pulls/#create-a-pull-request",
            method: "POST",
            params: {
                base: { required: true, type: "string" },
                draft: { type: "boolean" },
                head: { required: true, type: "string" },
                issue: { required: true, type: "integer" },
                maintainer_can_modify: { type: "boolean" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/pulls"
        },
        createReview: {
            method: "POST",
            params: {
                body: { type: "string" },
                comments: { type: "object[]" },
                "comments[].body": { required: true, type: "string" },
                "comments[].path": { required: true, type: "string" },
                "comments[].position": { required: true, type: "integer" },
                commit_id: { type: "string" },
                event: {
                    enum: ["APPROVE", "REQUEST_CHANGES", "COMMENT"],
                    type: "string"
                },
                number: { alias: "pull_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                pull_number: { required: true, type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/pulls/:pull_number/reviews"
        },
        createReviewCommentReply: {
            method: "POST",
            params: {
                body: { required: true, type: "string" },
                comment_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                pull_number: { required: true, type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/pulls/:pull_number/comments/:comment_id/replies"
        },
        createReviewRequest: {
            method: "POST",
            params: {
                number: { alias: "pull_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                pull_number: { required: true, type: "integer" },
                repo: { required: true, type: "string" },
                reviewers: { type: "string[]" },
                team_reviewers: { type: "string[]" }
            },
            url: "/repos/:owner/:repo/pulls/:pull_number/requested_reviewers"
        },
        deleteComment: {
            method: "DELETE",
            params: {
                comment_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/pulls/comments/:comment_id"
        },
        deletePendingReview: {
            method: "DELETE",
            params: {
                number: { alias: "pull_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                pull_number: { required: true, type: "integer" },
                repo: { required: true, type: "string" },
                review_id: { required: true, type: "integer" }
            },
            url: "/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id"
        },
        deleteReviewRequest: {
            method: "DELETE",
            params: {
                number: { alias: "pull_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                pull_number: { required: true, type: "integer" },
                repo: { required: true, type: "string" },
                reviewers: { type: "string[]" },
                team_reviewers: { type: "string[]" }
            },
            url: "/repos/:owner/:repo/pulls/:pull_number/requested_reviewers"
        },
        dismissReview: {
            method: "PUT",
            params: {
                message: { required: true, type: "string" },
                number: { alias: "pull_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                pull_number: { required: true, type: "integer" },
                repo: { required: true, type: "string" },
                review_id: { required: true, type: "integer" }
            },
            url: "/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id/dismissals"
        },
        get: {
            method: "GET",
            params: {
                number: { alias: "pull_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                pull_number: { required: true, type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/pulls/:pull_number"
        },
        getComment: {
            method: "GET",
            params: {
                comment_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/pulls/comments/:comment_id"
        },
        getCommentsForReview: {
            method: "GET",
            params: {
                number: { alias: "pull_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                pull_number: { required: true, type: "integer" },
                repo: { required: true, type: "string" },
                review_id: { required: true, type: "integer" }
            },
            url: "/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id/comments"
        },
        getReview: {
            method: "GET",
            params: {
                number: { alias: "pull_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                pull_number: { required: true, type: "integer" },
                repo: { required: true, type: "string" },
                review_id: { required: true, type: "integer" }
            },
            url: "/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id"
        },
        list: {
            method: "GET",
            params: {
                base: { type: "string" },
                direction: { enum: ["asc", "desc"], type: "string" },
                head: { type: "string" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" },
                sort: {
                    enum: ["created", "updated", "popularity", "long-running"],
                    type: "string"
                },
                state: { enum: ["open", "closed", "all"], type: "string" }
            },
            url: "/repos/:owner/:repo/pulls"
        },
        listComments: {
            method: "GET",
            params: {
                direction: { enum: ["asc", "desc"], type: "string" },
                number: { alias: "pull_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                pull_number: { required: true, type: "integer" },
                repo: { required: true, type: "string" },
                since: { type: "string" },
                sort: { enum: ["created", "updated"], type: "string" }
            },
            url: "/repos/:owner/:repo/pulls/:pull_number/comments"
        },
        listCommentsForRepo: {
            method: "GET",
            params: {
                direction: { enum: ["asc", "desc"], type: "string" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" },
                since: { type: "string" },
                sort: { enum: ["created", "updated"], type: "string" }
            },
            url: "/repos/:owner/:repo/pulls/comments"
        },
        listCommits: {
            method: "GET",
            params: {
                number: { alias: "pull_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                pull_number: { required: true, type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/pulls/:pull_number/commits"
        },
        listFiles: {
            method: "GET",
            params: {
                number: { alias: "pull_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                pull_number: { required: true, type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/pulls/:pull_number/files"
        },
        listReviewRequests: {
            method: "GET",
            params: {
                number: { alias: "pull_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                pull_number: { required: true, type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/pulls/:pull_number/requested_reviewers"
        },
        listReviews: {
            method: "GET",
            params: {
                number: { alias: "pull_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                pull_number: { required: true, type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/pulls/:pull_number/reviews"
        },
        merge: {
            method: "PUT",
            params: {
                commit_message: { type: "string" },
                commit_title: { type: "string" },
                merge_method: { enum: ["merge", "squash", "rebase"], type: "string" },
                number: { alias: "pull_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                pull_number: { required: true, type: "integer" },
                repo: { required: true, type: "string" },
                sha: { type: "string" }
            },
            url: "/repos/:owner/:repo/pulls/:pull_number/merge"
        },
        submitReview: {
            method: "POST",
            params: {
                body: { type: "string" },
                event: {
                    enum: ["APPROVE", "REQUEST_CHANGES", "COMMENT"],
                    required: true,
                    type: "string"
                },
                number: { alias: "pull_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                pull_number: { required: true, type: "integer" },
                repo: { required: true, type: "string" },
                review_id: { required: true, type: "integer" }
            },
            url: "/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id/events"
        },
        update: {
            method: "PATCH",
            params: {
                base: { type: "string" },
                body: { type: "string" },
                maintainer_can_modify: { type: "boolean" },
                number: { alias: "pull_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                pull_number: { required: true, type: "integer" },
                repo: { required: true, type: "string" },
                state: { enum: ["open", "closed"], type: "string" },
                title: { type: "string" }
            },
            url: "/repos/:owner/:repo/pulls/:pull_number"
        },
        updateBranch: {
            headers: { accept: "application/vnd.github.lydian-preview+json" },
            method: "PUT",
            params: {
                expected_head_sha: { type: "string" },
                owner: { required: true, type: "string" },
                pull_number: { required: true, type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/pulls/:pull_number/update-branch"
        },
        updateComment: {
            method: "PATCH",
            params: {
                body: { required: true, type: "string" },
                comment_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/pulls/comments/:comment_id"
        },
        updateReview: {
            method: "PUT",
            params: {
                body: { required: true, type: "string" },
                number: { alias: "pull_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                pull_number: { required: true, type: "integer" },
                repo: { required: true, type: "string" },
                review_id: { required: true, type: "integer" }
            },
            url: "/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id"
        }
    },
    rateLimit: { get: { method: "GET", params: {}, url: "/rate_limit" } },
    reactions: {
        createForCommitComment: {
            headers: { accept: "application/vnd.github.squirrel-girl-preview+json" },
            method: "POST",
            params: {
                comment_id: { required: true, type: "integer" },
                content: {
                    enum: [
                        "+1",
                        "-1",
                        "laugh",
                        "confused",
                        "heart",
                        "hooray",
                        "rocket",
                        "eyes"
                    ],
                    required: true,
                    type: "string"
                },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/comments/:comment_id/reactions"
        },
        createForIssue: {
            headers: { accept: "application/vnd.github.squirrel-girl-preview+json" },
            method: "POST",
            params: {
                content: {
                    enum: [
                        "+1",
                        "-1",
                        "laugh",
                        "confused",
                        "heart",
                        "hooray",
                        "rocket",
                        "eyes"
                    ],
                    required: true,
                    type: "string"
                },
                issue_number: { required: true, type: "integer" },
                number: { alias: "issue_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/issues/:issue_number/reactions"
        },
        createForIssueComment: {
            headers: { accept: "application/vnd.github.squirrel-girl-preview+json" },
            method: "POST",
            params: {
                comment_id: { required: true, type: "integer" },
                content: {
                    enum: [
                        "+1",
                        "-1",
                        "laugh",
                        "confused",
                        "heart",
                        "hooray",
                        "rocket",
                        "eyes"
                    ],
                    required: true,
                    type: "string"
                },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/issues/comments/:comment_id/reactions"
        },
        createForPullRequestReviewComment: {
            headers: { accept: "application/vnd.github.squirrel-girl-preview+json" },
            method: "POST",
            params: {
                comment_id: { required: true, type: "integer" },
                content: {
                    enum: [
                        "+1",
                        "-1",
                        "laugh",
                        "confused",
                        "heart",
                        "hooray",
                        "rocket",
                        "eyes"
                    ],
                    required: true,
                    type: "string"
                },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/pulls/comments/:comment_id/reactions"
        },
        createForTeamDiscussion: {
            deprecated: "octokit.reactions.createForTeamDiscussion() has been renamed to octokit.reactions.createForTeamDiscussionLegacy() (2020-01-16)",
            headers: { accept: "application/vnd.github.squirrel-girl-preview+json" },
            method: "POST",
            params: {
                content: {
                    enum: [
                        "+1",
                        "-1",
                        "laugh",
                        "confused",
                        "heart",
                        "hooray",
                        "rocket",
                        "eyes"
                    ],
                    required: true,
                    type: "string"
                },
                discussion_number: { required: true, type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/discussions/:discussion_number/reactions"
        },
        createForTeamDiscussionComment: {
            deprecated: "octokit.reactions.createForTeamDiscussionComment() has been renamed to octokit.reactions.createForTeamDiscussionCommentLegacy() (2020-01-16)",
            headers: { accept: "application/vnd.github.squirrel-girl-preview+json" },
            method: "POST",
            params: {
                comment_number: { required: true, type: "integer" },
                content: {
                    enum: [
                        "+1",
                        "-1",
                        "laugh",
                        "confused",
                        "heart",
                        "hooray",
                        "rocket",
                        "eyes"
                    ],
                    required: true,
                    type: "string"
                },
                discussion_number: { required: true, type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number/reactions"
        },
        createForTeamDiscussionCommentInOrg: {
            headers: { accept: "application/vnd.github.squirrel-girl-preview+json" },
            method: "POST",
            params: {
                comment_number: { required: true, type: "integer" },
                content: {
                    enum: [
                        "+1",
                        "-1",
                        "laugh",
                        "confused",
                        "heart",
                        "hooray",
                        "rocket",
                        "eyes"
                    ],
                    required: true,
                    type: "string"
                },
                discussion_number: { required: true, type: "integer" },
                org: { required: true, type: "string" },
                team_slug: { required: true, type: "string" }
            },
            url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/comments/:comment_number/reactions"
        },
        createForTeamDiscussionCommentLegacy: {
            deprecated: "octokit.reactions.createForTeamDiscussionCommentLegacy() is deprecated, see https://developer.github.com/v3/reactions/#create-reaction-for-a-team-discussion-comment-legacy",
            headers: { accept: "application/vnd.github.squirrel-girl-preview+json" },
            method: "POST",
            params: {
                comment_number: { required: true, type: "integer" },
                content: {
                    enum: [
                        "+1",
                        "-1",
                        "laugh",
                        "confused",
                        "heart",
                        "hooray",
                        "rocket",
                        "eyes"
                    ],
                    required: true,
                    type: "string"
                },
                discussion_number: { required: true, type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number/reactions"
        },
        createForTeamDiscussionInOrg: {
            headers: { accept: "application/vnd.github.squirrel-girl-preview+json" },
            method: "POST",
            params: {
                content: {
                    enum: [
                        "+1",
                        "-1",
                        "laugh",
                        "confused",
                        "heart",
                        "hooray",
                        "rocket",
                        "eyes"
                    ],
                    required: true,
                    type: "string"
                },
                discussion_number: { required: true, type: "integer" },
                org: { required: true, type: "string" },
                team_slug: { required: true, type: "string" }
            },
            url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/reactions"
        },
        createForTeamDiscussionLegacy: {
            deprecated: "octokit.reactions.createForTeamDiscussionLegacy() is deprecated, see https://developer.github.com/v3/reactions/#create-reaction-for-a-team-discussion-legacy",
            headers: { accept: "application/vnd.github.squirrel-girl-preview+json" },
            method: "POST",
            params: {
                content: {
                    enum: [
                        "+1",
                        "-1",
                        "laugh",
                        "confused",
                        "heart",
                        "hooray",
                        "rocket",
                        "eyes"
                    ],
                    required: true,
                    type: "string"
                },
                discussion_number: { required: true, type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/discussions/:discussion_number/reactions"
        },
        delete: {
            headers: { accept: "application/vnd.github.squirrel-girl-preview+json" },
            method: "DELETE",
            params: { reaction_id: { required: true, type: "integer" } },
            url: "/reactions/:reaction_id"
        },
        listForCommitComment: {
            headers: { accept: "application/vnd.github.squirrel-girl-preview+json" },
            method: "GET",
            params: {
                comment_id: { required: true, type: "integer" },
                content: {
                    enum: [
                        "+1",
                        "-1",
                        "laugh",
                        "confused",
                        "heart",
                        "hooray",
                        "rocket",
                        "eyes"
                    ],
                    type: "string"
                },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/comments/:comment_id/reactions"
        },
        listForIssue: {
            headers: { accept: "application/vnd.github.squirrel-girl-preview+json" },
            method: "GET",
            params: {
                content: {
                    enum: [
                        "+1",
                        "-1",
                        "laugh",
                        "confused",
                        "heart",
                        "hooray",
                        "rocket",
                        "eyes"
                    ],
                    type: "string"
                },
                issue_number: { required: true, type: "integer" },
                number: { alias: "issue_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/issues/:issue_number/reactions"
        },
        listForIssueComment: {
            headers: { accept: "application/vnd.github.squirrel-girl-preview+json" },
            method: "GET",
            params: {
                comment_id: { required: true, type: "integer" },
                content: {
                    enum: [
                        "+1",
                        "-1",
                        "laugh",
                        "confused",
                        "heart",
                        "hooray",
                        "rocket",
                        "eyes"
                    ],
                    type: "string"
                },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/issues/comments/:comment_id/reactions"
        },
        listForPullRequestReviewComment: {
            headers: { accept: "application/vnd.github.squirrel-girl-preview+json" },
            method: "GET",
            params: {
                comment_id: { required: true, type: "integer" },
                content: {
                    enum: [
                        "+1",
                        "-1",
                        "laugh",
                        "confused",
                        "heart",
                        "hooray",
                        "rocket",
                        "eyes"
                    ],
                    type: "string"
                },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/pulls/comments/:comment_id/reactions"
        },
        listForTeamDiscussion: {
            deprecated: "octokit.reactions.listForTeamDiscussion() has been renamed to octokit.reactions.listForTeamDiscussionLegacy() (2020-01-16)",
            headers: { accept: "application/vnd.github.squirrel-girl-preview+json" },
            method: "GET",
            params: {
                content: {
                    enum: [
                        "+1",
                        "-1",
                        "laugh",
                        "confused",
                        "heart",
                        "hooray",
                        "rocket",
                        "eyes"
                    ],
                    type: "string"
                },
                discussion_number: { required: true, type: "integer" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/discussions/:discussion_number/reactions"
        },
        listForTeamDiscussionComment: {
            deprecated: "octokit.reactions.listForTeamDiscussionComment() has been renamed to octokit.reactions.listForTeamDiscussionCommentLegacy() (2020-01-16)",
            headers: { accept: "application/vnd.github.squirrel-girl-preview+json" },
            method: "GET",
            params: {
                comment_number: { required: true, type: "integer" },
                content: {
                    enum: [
                        "+1",
                        "-1",
                        "laugh",
                        "confused",
                        "heart",
                        "hooray",
                        "rocket",
                        "eyes"
                    ],
                    type: "string"
                },
                discussion_number: { required: true, type: "integer" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number/reactions"
        },
        listForTeamDiscussionCommentInOrg: {
            headers: { accept: "application/vnd.github.squirrel-girl-preview+json" },
            method: "GET",
            params: {
                comment_number: { required: true, type: "integer" },
                content: {
                    enum: [
                        "+1",
                        "-1",
                        "laugh",
                        "confused",
                        "heart",
                        "hooray",
                        "rocket",
                        "eyes"
                    ],
                    type: "string"
                },
                discussion_number: { required: true, type: "integer" },
                org: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                team_slug: { required: true, type: "string" }
            },
            url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/comments/:comment_number/reactions"
        },
        listForTeamDiscussionCommentLegacy: {
            deprecated: "octokit.reactions.listForTeamDiscussionCommentLegacy() is deprecated, see https://developer.github.com/v3/reactions/#list-reactions-for-a-team-discussion-comment-legacy",
            headers: { accept: "application/vnd.github.squirrel-girl-preview+json" },
            method: "GET",
            params: {
                comment_number: { required: true, type: "integer" },
                content: {
                    enum: [
                        "+1",
                        "-1",
                        "laugh",
                        "confused",
                        "heart",
                        "hooray",
                        "rocket",
                        "eyes"
                    ],
                    type: "string"
                },
                discussion_number: { required: true, type: "integer" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number/reactions"
        },
        listForTeamDiscussionInOrg: {
            headers: { accept: "application/vnd.github.squirrel-girl-preview+json" },
            method: "GET",
            params: {
                content: {
                    enum: [
                        "+1",
                        "-1",
                        "laugh",
                        "confused",
                        "heart",
                        "hooray",
                        "rocket",
                        "eyes"
                    ],
                    type: "string"
                },
                discussion_number: { required: true, type: "integer" },
                org: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                team_slug: { required: true, type: "string" }
            },
            url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/reactions"
        },
        listForTeamDiscussionLegacy: {
            deprecated: "octokit.reactions.listForTeamDiscussionLegacy() is deprecated, see https://developer.github.com/v3/reactions/#list-reactions-for-a-team-discussion-legacy",
            headers: { accept: "application/vnd.github.squirrel-girl-preview+json" },
            method: "GET",
            params: {
                content: {
                    enum: [
                        "+1",
                        "-1",
                        "laugh",
                        "confused",
                        "heart",
                        "hooray",
                        "rocket",
                        "eyes"
                    ],
                    type: "string"
                },
                discussion_number: { required: true, type: "integer" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/discussions/:discussion_number/reactions"
        }
    },
    repos: {
        acceptInvitation: {
            method: "PATCH",
            params: { invitation_id: { required: true, type: "integer" } },
            url: "/user/repository_invitations/:invitation_id"
        },
        addCollaborator: {
            method: "PUT",
            params: {
                owner: { required: true, type: "string" },
                permission: { enum: ["pull", "push", "admin"], type: "string" },
                repo: { required: true, type: "string" },
                username: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/collaborators/:username"
        },
        addDeployKey: {
            method: "POST",
            params: {
                key: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                read_only: { type: "boolean" },
                repo: { required: true, type: "string" },
                title: { type: "string" }
            },
            url: "/repos/:owner/:repo/keys"
        },
        addProtectedBranchAdminEnforcement: {
            method: "POST",
            params: {
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/enforce_admins"
        },
        addProtectedBranchAppRestrictions: {
            method: "POST",
            params: {
                apps: { mapTo: "data", required: true, type: "string[]" },
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/apps"
        },
        addProtectedBranchRequiredSignatures: {
            headers: { accept: "application/vnd.github.zzzax-preview+json" },
            method: "POST",
            params: {
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/required_signatures"
        },
        addProtectedBranchRequiredStatusChecksContexts: {
            method: "POST",
            params: {
                branch: { required: true, type: "string" },
                contexts: { mapTo: "data", required: true, type: "string[]" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/required_status_checks/contexts"
        },
        addProtectedBranchTeamRestrictions: {
            method: "POST",
            params: {
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                teams: { mapTo: "data", required: true, type: "string[]" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"
        },
        addProtectedBranchUserRestrictions: {
            method: "POST",
            params: {
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                users: { mapTo: "data", required: true, type: "string[]" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/users"
        },
        checkCollaborator: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                username: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/collaborators/:username"
        },
        checkVulnerabilityAlerts: {
            headers: { accept: "application/vnd.github.dorian-preview+json" },
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/vulnerability-alerts"
        },
        compareCommits: {
            method: "GET",
            params: {
                base: { required: true, type: "string" },
                head: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/compare/:base...:head"
        },
        createCommitComment: {
            method: "POST",
            params: {
                body: { required: true, type: "string" },
                commit_sha: { required: true, type: "string" },
                line: { type: "integer" },
                owner: { required: true, type: "string" },
                path: { type: "string" },
                position: { type: "integer" },
                repo: { required: true, type: "string" },
                sha: { alias: "commit_sha", deprecated: true, type: "string" }
            },
            url: "/repos/:owner/:repo/commits/:commit_sha/comments"
        },
        createDeployment: {
            method: "POST",
            params: {
                auto_merge: { type: "boolean" },
                description: { type: "string" },
                environment: { type: "string" },
                owner: { required: true, type: "string" },
                payload: { type: "string" },
                production_environment: { type: "boolean" },
                ref: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                required_contexts: { type: "string[]" },
                task: { type: "string" },
                transient_environment: { type: "boolean" }
            },
            url: "/repos/:owner/:repo/deployments"
        },
        createDeploymentStatus: {
            method: "POST",
            params: {
                auto_inactive: { type: "boolean" },
                deployment_id: { required: true, type: "integer" },
                description: { type: "string" },
                environment: { enum: ["production", "staging", "qa"], type: "string" },
                environment_url: { type: "string" },
                log_url: { type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                state: {
                    enum: [
                        "error",
                        "failure",
                        "inactive",
                        "in_progress",
                        "queued",
                        "pending",
                        "success"
                    ],
                    required: true,
                    type: "string"
                },
                target_url: { type: "string" }
            },
            url: "/repos/:owner/:repo/deployments/:deployment_id/statuses"
        },
        createDispatchEvent: {
            method: "POST",
            params: {
                client_payload: { type: "object" },
                event_type: { type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/dispatches"
        },
        createFile: {
            deprecated: "octokit.repos.createFile() has been renamed to octokit.repos.createOrUpdateFile() (2019-06-07)",
            method: "PUT",
            params: {
                author: { type: "object" },
                "author.email": { required: true, type: "string" },
                "author.name": { required: true, type: "string" },
                branch: { type: "string" },
                committer: { type: "object" },
                "committer.email": { required: true, type: "string" },
                "committer.name": { required: true, type: "string" },
                content: { required: true, type: "string" },
                message: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                path: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                sha: { type: "string" }
            },
            url: "/repos/:owner/:repo/contents/:path"
        },
        createForAuthenticatedUser: {
            method: "POST",
            params: {
                allow_merge_commit: { type: "boolean" },
                allow_rebase_merge: { type: "boolean" },
                allow_squash_merge: { type: "boolean" },
                auto_init: { type: "boolean" },
                delete_branch_on_merge: { type: "boolean" },
                description: { type: "string" },
                gitignore_template: { type: "string" },
                has_issues: { type: "boolean" },
                has_projects: { type: "boolean" },
                has_wiki: { type: "boolean" },
                homepage: { type: "string" },
                is_template: { type: "boolean" },
                license_template: { type: "string" },
                name: { required: true, type: "string" },
                private: { type: "boolean" },
                team_id: { type: "integer" },
                visibility: {
                    enum: ["public", "private", "visibility", "internal"],
                    type: "string"
                }
            },
            url: "/user/repos"
        },
        createFork: {
            method: "POST",
            params: {
                organization: { type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/forks"
        },
        createHook: {
            method: "POST",
            params: {
                active: { type: "boolean" },
                config: { required: true, type: "object" },
                "config.content_type": { type: "string" },
                "config.insecure_ssl": { type: "string" },
                "config.secret": { type: "string" },
                "config.url": { required: true, type: "string" },
                events: { type: "string[]" },
                name: { type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/hooks"
        },
        createInOrg: {
            method: "POST",
            params: {
                allow_merge_commit: { type: "boolean" },
                allow_rebase_merge: { type: "boolean" },
                allow_squash_merge: { type: "boolean" },
                auto_init: { type: "boolean" },
                delete_branch_on_merge: { type: "boolean" },
                description: { type: "string" },
                gitignore_template: { type: "string" },
                has_issues: { type: "boolean" },
                has_projects: { type: "boolean" },
                has_wiki: { type: "boolean" },
                homepage: { type: "string" },
                is_template: { type: "boolean" },
                license_template: { type: "string" },
                name: { required: true, type: "string" },
                org: { required: true, type: "string" },
                private: { type: "boolean" },
                team_id: { type: "integer" },
                visibility: {
                    enum: ["public", "private", "visibility", "internal"],
                    type: "string"
                }
            },
            url: "/orgs/:org/repos"
        },
        createOrUpdateFile: {
            method: "PUT",
            params: {
                author: { type: "object" },
                "author.email": { required: true, type: "string" },
                "author.name": { required: true, type: "string" },
                branch: { type: "string" },
                committer: { type: "object" },
                "committer.email": { required: true, type: "string" },
                "committer.name": { required: true, type: "string" },
                content: { required: true, type: "string" },
                message: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                path: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                sha: { type: "string" }
            },
            url: "/repos/:owner/:repo/contents/:path"
        },
        createRelease: {
            method: "POST",
            params: {
                body: { type: "string" },
                draft: { type: "boolean" },
                name: { type: "string" },
                owner: { required: true, type: "string" },
                prerelease: { type: "boolean" },
                repo: { required: true, type: "string" },
                tag_name: { required: true, type: "string" },
                target_commitish: { type: "string" }
            },
            url: "/repos/:owner/:repo/releases"
        },
        createStatus: {
            method: "POST",
            params: {
                context: { type: "string" },
                description: { type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                sha: { required: true, type: "string" },
                state: {
                    enum: ["error", "failure", "pending", "success"],
                    required: true,
                    type: "string"
                },
                target_url: { type: "string" }
            },
            url: "/repos/:owner/:repo/statuses/:sha"
        },
        createUsingTemplate: {
            headers: { accept: "application/vnd.github.baptiste-preview+json" },
            method: "POST",
            params: {
                description: { type: "string" },
                name: { required: true, type: "string" },
                owner: { type: "string" },
                private: { type: "boolean" },
                template_owner: { required: true, type: "string" },
                template_repo: { required: true, type: "string" }
            },
            url: "/repos/:template_owner/:template_repo/generate"
        },
        declineInvitation: {
            method: "DELETE",
            params: { invitation_id: { required: true, type: "integer" } },
            url: "/user/repository_invitations/:invitation_id"
        },
        delete: {
            method: "DELETE",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo"
        },
        deleteCommitComment: {
            method: "DELETE",
            params: {
                comment_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/comments/:comment_id"
        },
        deleteDownload: {
            method: "DELETE",
            params: {
                download_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/downloads/:download_id"
        },
        deleteFile: {
            method: "DELETE",
            params: {
                author: { type: "object" },
                "author.email": { type: "string" },
                "author.name": { type: "string" },
                branch: { type: "string" },
                committer: { type: "object" },
                "committer.email": { type: "string" },
                "committer.name": { type: "string" },
                message: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                path: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                sha: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/contents/:path"
        },
        deleteHook: {
            method: "DELETE",
            params: {
                hook_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/hooks/:hook_id"
        },
        deleteInvitation: {
            method: "DELETE",
            params: {
                invitation_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/invitations/:invitation_id"
        },
        deleteRelease: {
            method: "DELETE",
            params: {
                owner: { required: true, type: "string" },
                release_id: { required: true, type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/releases/:release_id"
        },
        deleteReleaseAsset: {
            method: "DELETE",
            params: {
                asset_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/releases/assets/:asset_id"
        },
        disableAutomatedSecurityFixes: {
            headers: { accept: "application/vnd.github.london-preview+json" },
            method: "DELETE",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/automated-security-fixes"
        },
        disablePagesSite: {
            headers: { accept: "application/vnd.github.switcheroo-preview+json" },
            method: "DELETE",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/pages"
        },
        disableVulnerabilityAlerts: {
            headers: { accept: "application/vnd.github.dorian-preview+json" },
            method: "DELETE",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/vulnerability-alerts"
        },
        enableAutomatedSecurityFixes: {
            headers: { accept: "application/vnd.github.london-preview+json" },
            method: "PUT",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/automated-security-fixes"
        },
        enablePagesSite: {
            headers: { accept: "application/vnd.github.switcheroo-preview+json" },
            method: "POST",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                source: { type: "object" },
                "source.branch": { enum: ["master", "gh-pages"], type: "string" },
                "source.path": { type: "string" }
            },
            url: "/repos/:owner/:repo/pages"
        },
        enableVulnerabilityAlerts: {
            headers: { accept: "application/vnd.github.dorian-preview+json" },
            method: "PUT",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/vulnerability-alerts"
        },
        get: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo"
        },
        getAppsWithAccessToProtectedBranch: {
            method: "GET",
            params: {
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/apps"
        },
        getArchiveLink: {
            method: "GET",
            params: {
                archive_format: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                ref: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/:archive_format/:ref"
        },
        getBranch: {
            method: "GET",
            params: {
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/branches/:branch"
        },
        getBranchProtection: {
            method: "GET",
            params: {
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection"
        },
        getClones: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                per: { enum: ["day", "week"], type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/traffic/clones"
        },
        getCodeFrequencyStats: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/stats/code_frequency"
        },
        getCollaboratorPermissionLevel: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                username: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/collaborators/:username/permission"
        },
        getCombinedStatusForRef: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                ref: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/commits/:ref/status"
        },
        getCommit: {
            method: "GET",
            params: {
                commit_sha: { alias: "ref", deprecated: true, type: "string" },
                owner: { required: true, type: "string" },
                ref: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                sha: { alias: "ref", deprecated: true, type: "string" }
            },
            url: "/repos/:owner/:repo/commits/:ref"
        },
        getCommitActivityStats: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/stats/commit_activity"
        },
        getCommitComment: {
            method: "GET",
            params: {
                comment_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/comments/:comment_id"
        },
        getCommitRefSha: {
            deprecated: "octokit.repos.getCommitRefSha() is deprecated, see https://developer.github.com/v3/repos/commits/#get-a-single-commit",
            headers: { accept: "application/vnd.github.v3.sha" },
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                ref: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/commits/:ref"
        },
        getContents: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                path: { required: true, type: "string" },
                ref: { type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/contents/:path"
        },
        getContributorsStats: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/stats/contributors"
        },
        getDeployKey: {
            method: "GET",
            params: {
                key_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/keys/:key_id"
        },
        getDeployment: {
            method: "GET",
            params: {
                deployment_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/deployments/:deployment_id"
        },
        getDeploymentStatus: {
            method: "GET",
            params: {
                deployment_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                status_id: { required: true, type: "integer" }
            },
            url: "/repos/:owner/:repo/deployments/:deployment_id/statuses/:status_id"
        },
        getDownload: {
            method: "GET",
            params: {
                download_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/downloads/:download_id"
        },
        getHook: {
            method: "GET",
            params: {
                hook_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/hooks/:hook_id"
        },
        getLatestPagesBuild: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/pages/builds/latest"
        },
        getLatestRelease: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/releases/latest"
        },
        getPages: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/pages"
        },
        getPagesBuild: {
            method: "GET",
            params: {
                build_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/pages/builds/:build_id"
        },
        getParticipationStats: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/stats/participation"
        },
        getProtectedBranchAdminEnforcement: {
            method: "GET",
            params: {
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/enforce_admins"
        },
        getProtectedBranchPullRequestReviewEnforcement: {
            method: "GET",
            params: {
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/required_pull_request_reviews"
        },
        getProtectedBranchRequiredSignatures: {
            headers: { accept: "application/vnd.github.zzzax-preview+json" },
            method: "GET",
            params: {
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/required_signatures"
        },
        getProtectedBranchRequiredStatusChecks: {
            method: "GET",
            params: {
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/required_status_checks"
        },
        getProtectedBranchRestrictions: {
            method: "GET",
            params: {
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/restrictions"
        },
        getPunchCardStats: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/stats/punch_card"
        },
        getReadme: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                ref: { type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/readme"
        },
        getRelease: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                release_id: { required: true, type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/releases/:release_id"
        },
        getReleaseAsset: {
            method: "GET",
            params: {
                asset_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/releases/assets/:asset_id"
        },
        getReleaseByTag: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                tag: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/releases/tags/:tag"
        },
        getTeamsWithAccessToProtectedBranch: {
            method: "GET",
            params: {
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"
        },
        getTopPaths: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/traffic/popular/paths"
        },
        getTopReferrers: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/traffic/popular/referrers"
        },
        getUsersWithAccessToProtectedBranch: {
            method: "GET",
            params: {
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/users"
        },
        getViews: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                per: { enum: ["day", "week"], type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/traffic/views"
        },
        list: {
            method: "GET",
            params: {
                affiliation: { type: "string" },
                direction: { enum: ["asc", "desc"], type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                sort: {
                    enum: ["created", "updated", "pushed", "full_name"],
                    type: "string"
                },
                type: {
                    enum: ["all", "owner", "public", "private", "member"],
                    type: "string"
                },
                visibility: { enum: ["all", "public", "private"], type: "string" }
            },
            url: "/user/repos"
        },
        listAppsWithAccessToProtectedBranch: {
            deprecated: "octokit.repos.listAppsWithAccessToProtectedBranch() has been renamed to octokit.repos.getAppsWithAccessToProtectedBranch() (2019-09-13)",
            method: "GET",
            params: {
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/apps"
        },
        listAssetsForRelease: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                release_id: { required: true, type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/releases/:release_id/assets"
        },
        listBranches: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                protected: { type: "boolean" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/branches"
        },
        listBranchesForHeadCommit: {
            headers: { accept: "application/vnd.github.groot-preview+json" },
            method: "GET",
            params: {
                commit_sha: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/commits/:commit_sha/branches-where-head"
        },
        listCollaborators: {
            method: "GET",
            params: {
                affiliation: { enum: ["outside", "direct", "all"], type: "string" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/collaborators"
        },
        listCommentsForCommit: {
            method: "GET",
            params: {
                commit_sha: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                ref: { alias: "commit_sha", deprecated: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/commits/:commit_sha/comments"
        },
        listCommitComments: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/comments"
        },
        listCommits: {
            method: "GET",
            params: {
                author: { type: "string" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                path: { type: "string" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" },
                sha: { type: "string" },
                since: { type: "string" },
                until: { type: "string" }
            },
            url: "/repos/:owner/:repo/commits"
        },
        listContributors: {
            method: "GET",
            params: {
                anon: { type: "string" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/contributors"
        },
        listDeployKeys: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/keys"
        },
        listDeploymentStatuses: {
            method: "GET",
            params: {
                deployment_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/deployments/:deployment_id/statuses"
        },
        listDeployments: {
            method: "GET",
            params: {
                environment: { type: "string" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                ref: { type: "string" },
                repo: { required: true, type: "string" },
                sha: { type: "string" },
                task: { type: "string" }
            },
            url: "/repos/:owner/:repo/deployments"
        },
        listDownloads: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/downloads"
        },
        listForOrg: {
            method: "GET",
            params: {
                direction: { enum: ["asc", "desc"], type: "string" },
                org: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                sort: {
                    enum: ["created", "updated", "pushed", "full_name"],
                    type: "string"
                },
                type: {
                    enum: [
                        "all",
                        "public",
                        "private",
                        "forks",
                        "sources",
                        "member",
                        "internal"
                    ],
                    type: "string"
                }
            },
            url: "/orgs/:org/repos"
        },
        listForUser: {
            method: "GET",
            params: {
                direction: { enum: ["asc", "desc"], type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                sort: {
                    enum: ["created", "updated", "pushed", "full_name"],
                    type: "string"
                },
                type: { enum: ["all", "owner", "member"], type: "string" },
                username: { required: true, type: "string" }
            },
            url: "/users/:username/repos"
        },
        listForks: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" },
                sort: { enum: ["newest", "oldest", "stargazers"], type: "string" }
            },
            url: "/repos/:owner/:repo/forks"
        },
        listHooks: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/hooks"
        },
        listInvitations: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/invitations"
        },
        listInvitationsForAuthenticatedUser: {
            method: "GET",
            params: { page: { type: "integer" }, per_page: { type: "integer" } },
            url: "/user/repository_invitations"
        },
        listLanguages: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/languages"
        },
        listPagesBuilds: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/pages/builds"
        },
        listProtectedBranchRequiredStatusChecksContexts: {
            method: "GET",
            params: {
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/required_status_checks/contexts"
        },
        listProtectedBranchTeamRestrictions: {
            deprecated: "octokit.repos.listProtectedBranchTeamRestrictions() has been renamed to octokit.repos.getTeamsWithAccessToProtectedBranch() (2019-09-09)",
            method: "GET",
            params: {
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"
        },
        listProtectedBranchUserRestrictions: {
            deprecated: "octokit.repos.listProtectedBranchUserRestrictions() has been renamed to octokit.repos.getUsersWithAccessToProtectedBranch() (2019-09-09)",
            method: "GET",
            params: {
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/users"
        },
        listPublic: {
            method: "GET",
            params: {
                page: { type: "integer" },
                per_page: { type: "integer" },
                since: { type: "integer" }
            },
            url: "/repositories"
        },
        listPullRequestsAssociatedWithCommit: {
            headers: { accept: "application/vnd.github.groot-preview+json" },
            method: "GET",
            params: {
                commit_sha: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/commits/:commit_sha/pulls"
        },
        listReleases: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/releases"
        },
        listStatusesForRef: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                ref: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/commits/:ref/statuses"
        },
        listTags: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/tags"
        },
        listTeams: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/teams"
        },
        listTeamsWithAccessToProtectedBranch: {
            deprecated: "octokit.repos.listTeamsWithAccessToProtectedBranch() has been renamed to octokit.repos.getTeamsWithAccessToProtectedBranch() (2019-09-13)",
            method: "GET",
            params: {
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"
        },
        listTopics: {
            headers: { accept: "application/vnd.github.mercy-preview+json" },
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/topics"
        },
        listUsersWithAccessToProtectedBranch: {
            deprecated: "octokit.repos.listUsersWithAccessToProtectedBranch() has been renamed to octokit.repos.getUsersWithAccessToProtectedBranch() (2019-09-13)",
            method: "GET",
            params: {
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/users"
        },
        merge: {
            method: "POST",
            params: {
                base: { required: true, type: "string" },
                commit_message: { type: "string" },
                head: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/merges"
        },
        pingHook: {
            method: "POST",
            params: {
                hook_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/hooks/:hook_id/pings"
        },
        removeBranchProtection: {
            method: "DELETE",
            params: {
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection"
        },
        removeCollaborator: {
            method: "DELETE",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                username: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/collaborators/:username"
        },
        removeDeployKey: {
            method: "DELETE",
            params: {
                key_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/keys/:key_id"
        },
        removeProtectedBranchAdminEnforcement: {
            method: "DELETE",
            params: {
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/enforce_admins"
        },
        removeProtectedBranchAppRestrictions: {
            method: "DELETE",
            params: {
                apps: { mapTo: "data", required: true, type: "string[]" },
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/apps"
        },
        removeProtectedBranchPullRequestReviewEnforcement: {
            method: "DELETE",
            params: {
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/required_pull_request_reviews"
        },
        removeProtectedBranchRequiredSignatures: {
            headers: { accept: "application/vnd.github.zzzax-preview+json" },
            method: "DELETE",
            params: {
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/required_signatures"
        },
        removeProtectedBranchRequiredStatusChecks: {
            method: "DELETE",
            params: {
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/required_status_checks"
        },
        removeProtectedBranchRequiredStatusChecksContexts: {
            method: "DELETE",
            params: {
                branch: { required: true, type: "string" },
                contexts: { mapTo: "data", required: true, type: "string[]" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/required_status_checks/contexts"
        },
        removeProtectedBranchRestrictions: {
            method: "DELETE",
            params: {
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/restrictions"
        },
        removeProtectedBranchTeamRestrictions: {
            method: "DELETE",
            params: {
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                teams: { mapTo: "data", required: true, type: "string[]" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"
        },
        removeProtectedBranchUserRestrictions: {
            method: "DELETE",
            params: {
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                users: { mapTo: "data", required: true, type: "string[]" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/users"
        },
        replaceProtectedBranchAppRestrictions: {
            method: "PUT",
            params: {
                apps: { mapTo: "data", required: true, type: "string[]" },
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/apps"
        },
        replaceProtectedBranchRequiredStatusChecksContexts: {
            method: "PUT",
            params: {
                branch: { required: true, type: "string" },
                contexts: { mapTo: "data", required: true, type: "string[]" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/required_status_checks/contexts"
        },
        replaceProtectedBranchTeamRestrictions: {
            method: "PUT",
            params: {
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                teams: { mapTo: "data", required: true, type: "string[]" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"
        },
        replaceProtectedBranchUserRestrictions: {
            method: "PUT",
            params: {
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                users: { mapTo: "data", required: true, type: "string[]" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/users"
        },
        replaceTopics: {
            headers: { accept: "application/vnd.github.mercy-preview+json" },
            method: "PUT",
            params: {
                names: { required: true, type: "string[]" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/topics"
        },
        requestPageBuild: {
            method: "POST",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/pages/builds"
        },
        retrieveCommunityProfileMetrics: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/community/profile"
        },
        testPushHook: {
            method: "POST",
            params: {
                hook_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/hooks/:hook_id/tests"
        },
        transfer: {
            method: "POST",
            params: {
                new_owner: { type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                team_ids: { type: "integer[]" }
            },
            url: "/repos/:owner/:repo/transfer"
        },
        update: {
            method: "PATCH",
            params: {
                allow_merge_commit: { type: "boolean" },
                allow_rebase_merge: { type: "boolean" },
                allow_squash_merge: { type: "boolean" },
                archived: { type: "boolean" },
                default_branch: { type: "string" },
                delete_branch_on_merge: { type: "boolean" },
                description: { type: "string" },
                has_issues: { type: "boolean" },
                has_projects: { type: "boolean" },
                has_wiki: { type: "boolean" },
                homepage: { type: "string" },
                is_template: { type: "boolean" },
                name: { type: "string" },
                owner: { required: true, type: "string" },
                private: { type: "boolean" },
                repo: { required: true, type: "string" },
                visibility: {
                    enum: ["public", "private", "visibility", "internal"],
                    type: "string"
                }
            },
            url: "/repos/:owner/:repo"
        },
        updateBranchProtection: {
            method: "PUT",
            params: {
                allow_deletions: { type: "boolean" },
                allow_force_pushes: { allowNull: true, type: "boolean" },
                branch: { required: true, type: "string" },
                enforce_admins: { allowNull: true, required: true, type: "boolean" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                required_linear_history: { type: "boolean" },
                required_pull_request_reviews: {
                    allowNull: true,
                    required: true,
                    type: "object"
                },
                "required_pull_request_reviews.dismiss_stale_reviews": {
                    type: "boolean"
                },
                "required_pull_request_reviews.dismissal_restrictions": {
                    type: "object"
                },
                "required_pull_request_reviews.dismissal_restrictions.teams": {
                    type: "string[]"
                },
                "required_pull_request_reviews.dismissal_restrictions.users": {
                    type: "string[]"
                },
                "required_pull_request_reviews.require_code_owner_reviews": {
                    type: "boolean"
                },
                "required_pull_request_reviews.required_approving_review_count": {
                    type: "integer"
                },
                required_status_checks: {
                    allowNull: true,
                    required: true,
                    type: "object"
                },
                "required_status_checks.contexts": { required: true, type: "string[]" },
                "required_status_checks.strict": { required: true, type: "boolean" },
                restrictions: { allowNull: true, required: true, type: "object" },
                "restrictions.apps": { type: "string[]" },
                "restrictions.teams": { required: true, type: "string[]" },
                "restrictions.users": { required: true, type: "string[]" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection"
        },
        updateCommitComment: {
            method: "PATCH",
            params: {
                body: { required: true, type: "string" },
                comment_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/comments/:comment_id"
        },
        updateFile: {
            deprecated: "octokit.repos.updateFile() has been renamed to octokit.repos.createOrUpdateFile() (2019-06-07)",
            method: "PUT",
            params: {
                author: { type: "object" },
                "author.email": { required: true, type: "string" },
                "author.name": { required: true, type: "string" },
                branch: { type: "string" },
                committer: { type: "object" },
                "committer.email": { required: true, type: "string" },
                "committer.name": { required: true, type: "string" },
                content: { required: true, type: "string" },
                message: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                path: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                sha: { type: "string" }
            },
            url: "/repos/:owner/:repo/contents/:path"
        },
        updateHook: {
            method: "PATCH",
            params: {
                active: { type: "boolean" },
                add_events: { type: "string[]" },
                config: { type: "object" },
                "config.content_type": { type: "string" },
                "config.insecure_ssl": { type: "string" },
                "config.secret": { type: "string" },
                "config.url": { required: true, type: "string" },
                events: { type: "string[]" },
                hook_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                remove_events: { type: "string[]" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/hooks/:hook_id"
        },
        updateInformationAboutPagesSite: {
            method: "PUT",
            params: {
                cname: { type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                source: {
                    enum: ['"gh-pages"', '"master"', '"master /docs"'],
                    type: "string"
                }
            },
            url: "/repos/:owner/:repo/pages"
        },
        updateInvitation: {
            method: "PATCH",
            params: {
                invitation_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                permissions: { enum: ["read", "write", "admin"], type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/invitations/:invitation_id"
        },
        updateProtectedBranchPullRequestReviewEnforcement: {
            method: "PATCH",
            params: {
                branch: { required: true, type: "string" },
                dismiss_stale_reviews: { type: "boolean" },
                dismissal_restrictions: { type: "object" },
                "dismissal_restrictions.teams": { type: "string[]" },
                "dismissal_restrictions.users": { type: "string[]" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                require_code_owner_reviews: { type: "boolean" },
                required_approving_review_count: { type: "integer" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/required_pull_request_reviews"
        },
        updateProtectedBranchRequiredStatusChecks: {
            method: "PATCH",
            params: {
                branch: { required: true, type: "string" },
                contexts: { type: "string[]" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                strict: { type: "boolean" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/required_status_checks"
        },
        updateRelease: {
            method: "PATCH",
            params: {
                body: { type: "string" },
                draft: { type: "boolean" },
                name: { type: "string" },
                owner: { required: true, type: "string" },
                prerelease: { type: "boolean" },
                release_id: { required: true, type: "integer" },
                repo: { required: true, type: "string" },
                tag_name: { type: "string" },
                target_commitish: { type: "string" }
            },
            url: "/repos/:owner/:repo/releases/:release_id"
        },
        updateReleaseAsset: {
            method: "PATCH",
            params: {
                asset_id: { required: true, type: "integer" },
                label: { type: "string" },
                name: { type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/releases/assets/:asset_id"
        },
        uploadReleaseAsset: {
            method: "POST",
            params: {
                data: { mapTo: "data", required: true, type: "string | object" },
                file: { alias: "data", deprecated: true, type: "string | object" },
                headers: { required: true, type: "object" },
                "headers.content-length": { required: true, type: "integer" },
                "headers.content-type": { required: true, type: "string" },
                label: { type: "string" },
                name: { required: true, type: "string" },
                url: { required: true, type: "string" }
            },
            url: ":url"
        }
    },
    search: {
        code: {
            method: "GET",
            params: {
                order: { enum: ["desc", "asc"], type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                q: { required: true, type: "string" },
                sort: { enum: ["indexed"], type: "string" }
            },
            url: "/search/code"
        },
        commits: {
            headers: { accept: "application/vnd.github.cloak-preview+json" },
            method: "GET",
            params: {
                order: { enum: ["desc", "asc"], type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                q: { required: true, type: "string" },
                sort: { enum: ["author-date", "committer-date"], type: "string" }
            },
            url: "/search/commits"
        },
        issues: {
            deprecated: "octokit.search.issues() has been renamed to octokit.search.issuesAndPullRequests() (2018-12-27)",
            method: "GET",
            params: {
                order: { enum: ["desc", "asc"], type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                q: { required: true, type: "string" },
                sort: {
                    enum: [
                        "comments",
                        "reactions",
                        "reactions-+1",
                        "reactions--1",
                        "reactions-smile",
                        "reactions-thinking_face",
                        "reactions-heart",
                        "reactions-tada",
                        "interactions",
                        "created",
                        "updated"
                    ],
                    type: "string"
                }
            },
            url: "/search/issues"
        },
        issuesAndPullRequests: {
            method: "GET",
            params: {
                order: { enum: ["desc", "asc"], type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                q: { required: true, type: "string" },
                sort: {
                    enum: [
                        "comments",
                        "reactions",
                        "reactions-+1",
                        "reactions--1",
                        "reactions-smile",
                        "reactions-thinking_face",
                        "reactions-heart",
                        "reactions-tada",
                        "interactions",
                        "created",
                        "updated"
                    ],
                    type: "string"
                }
            },
            url: "/search/issues"
        },
        labels: {
            method: "GET",
            params: {
                order: { enum: ["desc", "asc"], type: "string" },
                q: { required: true, type: "string" },
                repository_id: { required: true, type: "integer" },
                sort: { enum: ["created", "updated"], type: "string" }
            },
            url: "/search/labels"
        },
        repos: {
            method: "GET",
            params: {
                order: { enum: ["desc", "asc"], type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                q: { required: true, type: "string" },
                sort: {
                    enum: ["stars", "forks", "help-wanted-issues", "updated"],
                    type: "string"
                }
            },
            url: "/search/repositories"
        },
        topics: {
            method: "GET",
            params: { q: { required: true, type: "string" } },
            url: "/search/topics"
        },
        users: {
            method: "GET",
            params: {
                order: { enum: ["desc", "asc"], type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                q: { required: true, type: "string" },
                sort: { enum: ["followers", "repositories", "joined"], type: "string" }
            },
            url: "/search/users"
        }
    },
    teams: {
        addMember: {
            deprecated: "octokit.teams.addMember() has been renamed to octokit.teams.addMemberLegacy() (2020-01-16)",
            method: "PUT",
            params: {
                team_id: { required: true, type: "integer" },
                username: { required: true, type: "string" }
            },
            url: "/teams/:team_id/members/:username"
        },
        addMemberLegacy: {
            deprecated: "octokit.teams.addMemberLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#add-team-member-legacy",
            method: "PUT",
            params: {
                team_id: { required: true, type: "integer" },
                username: { required: true, type: "string" }
            },
            url: "/teams/:team_id/members/:username"
        },
        addOrUpdateMembership: {
            deprecated: "octokit.teams.addOrUpdateMembership() has been renamed to octokit.teams.addOrUpdateMembershipLegacy() (2020-01-16)",
            method: "PUT",
            params: {
                role: { enum: ["member", "maintainer"], type: "string" },
                team_id: { required: true, type: "integer" },
                username: { required: true, type: "string" }
            },
            url: "/teams/:team_id/memberships/:username"
        },
        addOrUpdateMembershipInOrg: {
            method: "PUT",
            params: {
                org: { required: true, type: "string" },
                role: { enum: ["member", "maintainer"], type: "string" },
                team_slug: { required: true, type: "string" },
                username: { required: true, type: "string" }
            },
            url: "/orgs/:org/teams/:team_slug/memberships/:username"
        },
        addOrUpdateMembershipLegacy: {
            deprecated: "octokit.teams.addOrUpdateMembershipLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#add-or-update-team-membership-legacy",
            method: "PUT",
            params: {
                role: { enum: ["member", "maintainer"], type: "string" },
                team_id: { required: true, type: "integer" },
                username: { required: true, type: "string" }
            },
            url: "/teams/:team_id/memberships/:username"
        },
        addOrUpdateProject: {
            deprecated: "octokit.teams.addOrUpdateProject() has been renamed to octokit.teams.addOrUpdateProjectLegacy() (2020-01-16)",
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "PUT",
            params: {
                permission: { enum: ["read", "write", "admin"], type: "string" },
                project_id: { required: true, type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/projects/:project_id"
        },
        addOrUpdateProjectInOrg: {
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "PUT",
            params: {
                org: { required: true, type: "string" },
                permission: { enum: ["read", "write", "admin"], type: "string" },
                project_id: { required: true, type: "integer" },
                team_slug: { required: true, type: "string" }
            },
            url: "/orgs/:org/teams/:team_slug/projects/:project_id"
        },
        addOrUpdateProjectLegacy: {
            deprecated: "octokit.teams.addOrUpdateProjectLegacy() is deprecated, see https://developer.github.com/v3/teams/#add-or-update-team-project-legacy",
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "PUT",
            params: {
                permission: { enum: ["read", "write", "admin"], type: "string" },
                project_id: { required: true, type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/projects/:project_id"
        },
        addOrUpdateRepo: {
            deprecated: "octokit.teams.addOrUpdateRepo() has been renamed to octokit.teams.addOrUpdateRepoLegacy() (2020-01-16)",
            method: "PUT",
            params: {
                owner: { required: true, type: "string" },
                permission: { enum: ["pull", "push", "admin"], type: "string" },
                repo: { required: true, type: "string" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/repos/:owner/:repo"
        },
        addOrUpdateRepoInOrg: {
            method: "PUT",
            params: {
                org: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                permission: { enum: ["pull", "push", "admin"], type: "string" },
                repo: { required: true, type: "string" },
                team_slug: { required: true, type: "string" }
            },
            url: "/orgs/:org/teams/:team_slug/repos/:owner/:repo"
        },
        addOrUpdateRepoLegacy: {
            deprecated: "octokit.teams.addOrUpdateRepoLegacy() is deprecated, see https://developer.github.com/v3/teams/#add-or-update-team-repository-legacy",
            method: "PUT",
            params: {
                owner: { required: true, type: "string" },
                permission: { enum: ["pull", "push", "admin"], type: "string" },
                repo: { required: true, type: "string" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/repos/:owner/:repo"
        },
        checkManagesRepo: {
            deprecated: "octokit.teams.checkManagesRepo() has been renamed to octokit.teams.checkManagesRepoLegacy() (2020-01-16)",
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/repos/:owner/:repo"
        },
        checkManagesRepoInOrg: {
            method: "GET",
            params: {
                org: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                team_slug: { required: true, type: "string" }
            },
            url: "/orgs/:org/teams/:team_slug/repos/:owner/:repo"
        },
        checkManagesRepoLegacy: {
            deprecated: "octokit.teams.checkManagesRepoLegacy() is deprecated, see https://developer.github.com/v3/teams/#check-if-a-team-manages-a-repository-legacy",
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/repos/:owner/:repo"
        },
        create: {
            method: "POST",
            params: {
                description: { type: "string" },
                maintainers: { type: "string[]" },
                name: { required: true, type: "string" },
                org: { required: true, type: "string" },
                parent_team_id: { type: "integer" },
                permission: { enum: ["pull", "push", "admin"], type: "string" },
                privacy: { enum: ["secret", "closed"], type: "string" },
                repo_names: { type: "string[]" }
            },
            url: "/orgs/:org/teams"
        },
        createDiscussion: {
            deprecated: "octokit.teams.createDiscussion() has been renamed to octokit.teams.createDiscussionLegacy() (2020-01-16)",
            method: "POST",
            params: {
                body: { required: true, type: "string" },
                private: { type: "boolean" },
                team_id: { required: true, type: "integer" },
                title: { required: true, type: "string" }
            },
            url: "/teams/:team_id/discussions"
        },
        createDiscussionComment: {
            deprecated: "octokit.teams.createDiscussionComment() has been renamed to octokit.teams.createDiscussionCommentLegacy() (2020-01-16)",
            method: "POST",
            params: {
                body: { required: true, type: "string" },
                discussion_number: { required: true, type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/discussions/:discussion_number/comments"
        },
        createDiscussionCommentInOrg: {
            method: "POST",
            params: {
                body: { required: true, type: "string" },
                discussion_number: { required: true, type: "integer" },
                org: { required: true, type: "string" },
                team_slug: { required: true, type: "string" }
            },
            url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/comments"
        },
        createDiscussionCommentLegacy: {
            deprecated: "octokit.teams.createDiscussionCommentLegacy() is deprecated, see https://developer.github.com/v3/teams/discussion_comments/#create-a-comment-legacy",
            method: "POST",
            params: {
                body: { required: true, type: "string" },
                discussion_number: { required: true, type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/discussions/:discussion_number/comments"
        },
        createDiscussionInOrg: {
            method: "POST",
            params: {
                body: { required: true, type: "string" },
                org: { required: true, type: "string" },
                private: { type: "boolean" },
                team_slug: { required: true, type: "string" },
                title: { required: true, type: "string" }
            },
            url: "/orgs/:org/teams/:team_slug/discussions"
        },
        createDiscussionLegacy: {
            deprecated: "octokit.teams.createDiscussionLegacy() is deprecated, see https://developer.github.com/v3/teams/discussions/#create-a-discussion-legacy",
            method: "POST",
            params: {
                body: { required: true, type: "string" },
                private: { type: "boolean" },
                team_id: { required: true, type: "integer" },
                title: { required: true, type: "string" }
            },
            url: "/teams/:team_id/discussions"
        },
        delete: {
            deprecated: "octokit.teams.delete() has been renamed to octokit.teams.deleteLegacy() (2020-01-16)",
            method: "DELETE",
            params: { team_id: { required: true, type: "integer" } },
            url: "/teams/:team_id"
        },
        deleteDiscussion: {
            deprecated: "octokit.teams.deleteDiscussion() has been renamed to octokit.teams.deleteDiscussionLegacy() (2020-01-16)",
            method: "DELETE",
            params: {
                discussion_number: { required: true, type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/discussions/:discussion_number"
        },
        deleteDiscussionComment: {
            deprecated: "octokit.teams.deleteDiscussionComment() has been renamed to octokit.teams.deleteDiscussionCommentLegacy() (2020-01-16)",
            method: "DELETE",
            params: {
                comment_number: { required: true, type: "integer" },
                discussion_number: { required: true, type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number"
        },
        deleteDiscussionCommentInOrg: {
            method: "DELETE",
            params: {
                comment_number: { required: true, type: "integer" },
                discussion_number: { required: true, type: "integer" },
                org: { required: true, type: "string" },
                team_slug: { required: true, type: "string" }
            },
            url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/comments/:comment_number"
        },
        deleteDiscussionCommentLegacy: {
            deprecated: "octokit.teams.deleteDiscussionCommentLegacy() is deprecated, see https://developer.github.com/v3/teams/discussion_comments/#delete-a-comment-legacy",
            method: "DELETE",
            params: {
                comment_number: { required: true, type: "integer" },
                discussion_number: { required: true, type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number"
        },
        deleteDiscussionInOrg: {
            method: "DELETE",
            params: {
                discussion_number: { required: true, type: "integer" },
                org: { required: true, type: "string" },
                team_slug: { required: true, type: "string" }
            },
            url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number"
        },
        deleteDiscussionLegacy: {
            deprecated: "octokit.teams.deleteDiscussionLegacy() is deprecated, see https://developer.github.com/v3/teams/discussions/#delete-a-discussion-legacy",
            method: "DELETE",
            params: {
                discussion_number: { required: true, type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/discussions/:discussion_number"
        },
        deleteInOrg: {
            method: "DELETE",
            params: {
                org: { required: true, type: "string" },
                team_slug: { required: true, type: "string" }
            },
            url: "/orgs/:org/teams/:team_slug"
        },
        deleteLegacy: {
            deprecated: "octokit.teams.deleteLegacy() is deprecated, see https://developer.github.com/v3/teams/#delete-team-legacy",
            method: "DELETE",
            params: { team_id: { required: true, type: "integer" } },
            url: "/teams/:team_id"
        },
        get: {
            deprecated: "octokit.teams.get() has been renamed to octokit.teams.getLegacy() (2020-01-16)",
            method: "GET",
            params: { team_id: { required: true, type: "integer" } },
            url: "/teams/:team_id"
        },
        getByName: {
            method: "GET",
            params: {
                org: { required: true, type: "string" },
                team_slug: { required: true, type: "string" }
            },
            url: "/orgs/:org/teams/:team_slug"
        },
        getDiscussion: {
            deprecated: "octokit.teams.getDiscussion() has been renamed to octokit.teams.getDiscussionLegacy() (2020-01-16)",
            method: "GET",
            params: {
                discussion_number: { required: true, type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/discussions/:discussion_number"
        },
        getDiscussionComment: {
            deprecated: "octokit.teams.getDiscussionComment() has been renamed to octokit.teams.getDiscussionCommentLegacy() (2020-01-16)",
            method: "GET",
            params: {
                comment_number: { required: true, type: "integer" },
                discussion_number: { required: true, type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number"
        },
        getDiscussionCommentInOrg: {
            method: "GET",
            params: {
                comment_number: { required: true, type: "integer" },
                discussion_number: { required: true, type: "integer" },
                org: { required: true, type: "string" },
                team_slug: { required: true, type: "string" }
            },
            url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/comments/:comment_number"
        },
        getDiscussionCommentLegacy: {
            deprecated: "octokit.teams.getDiscussionCommentLegacy() is deprecated, see https://developer.github.com/v3/teams/discussion_comments/#get-a-single-comment-legacy",
            method: "GET",
            params: {
                comment_number: { required: true, type: "integer" },
                discussion_number: { required: true, type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number"
        },
        getDiscussionInOrg: {
            method: "GET",
            params: {
                discussion_number: { required: true, type: "integer" },
                org: { required: true, type: "string" },
                team_slug: { required: true, type: "string" }
            },
            url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number"
        },
        getDiscussionLegacy: {
            deprecated: "octokit.teams.getDiscussionLegacy() is deprecated, see https://developer.github.com/v3/teams/discussions/#get-a-single-discussion-legacy",
            method: "GET",
            params: {
                discussion_number: { required: true, type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/discussions/:discussion_number"
        },
        getLegacy: {
            deprecated: "octokit.teams.getLegacy() is deprecated, see https://developer.github.com/v3/teams/#get-team-legacy",
            method: "GET",
            params: { team_id: { required: true, type: "integer" } },
            url: "/teams/:team_id"
        },
        getMember: {
            deprecated: "octokit.teams.getMember() has been renamed to octokit.teams.getMemberLegacy() (2020-01-16)",
            method: "GET",
            params: {
                team_id: { required: true, type: "integer" },
                username: { required: true, type: "string" }
            },
            url: "/teams/:team_id/members/:username"
        },
        getMemberLegacy: {
            deprecated: "octokit.teams.getMemberLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#get-team-member-legacy",
            method: "GET",
            params: {
                team_id: { required: true, type: "integer" },
                username: { required: true, type: "string" }
            },
            url: "/teams/:team_id/members/:username"
        },
        getMembership: {
            deprecated: "octokit.teams.getMembership() has been renamed to octokit.teams.getMembershipLegacy() (2020-01-16)",
            method: "GET",
            params: {
                team_id: { required: true, type: "integer" },
                username: { required: true, type: "string" }
            },
            url: "/teams/:team_id/memberships/:username"
        },
        getMembershipInOrg: {
            method: "GET",
            params: {
                org: { required: true, type: "string" },
                team_slug: { required: true, type: "string" },
                username: { required: true, type: "string" }
            },
            url: "/orgs/:org/teams/:team_slug/memberships/:username"
        },
        getMembershipLegacy: {
            deprecated: "octokit.teams.getMembershipLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#get-team-membership-legacy",
            method: "GET",
            params: {
                team_id: { required: true, type: "integer" },
                username: { required: true, type: "string" }
            },
            url: "/teams/:team_id/memberships/:username"
        },
        list: {
            method: "GET",
            params: {
                org: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" }
            },
            url: "/orgs/:org/teams"
        },
        listChild: {
            deprecated: "octokit.teams.listChild() has been renamed to octokit.teams.listChildLegacy() (2020-01-16)",
            method: "GET",
            params: {
                page: { type: "integer" },
                per_page: { type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/teams"
        },
        listChildInOrg: {
            method: "GET",
            params: {
                org: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                team_slug: { required: true, type: "string" }
            },
            url: "/orgs/:org/teams/:team_slug/teams"
        },
        listChildLegacy: {
            deprecated: "octokit.teams.listChildLegacy() is deprecated, see https://developer.github.com/v3/teams/#list-child-teams-legacy",
            method: "GET",
            params: {
                page: { type: "integer" },
                per_page: { type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/teams"
        },
        listDiscussionComments: {
            deprecated: "octokit.teams.listDiscussionComments() has been renamed to octokit.teams.listDiscussionCommentsLegacy() (2020-01-16)",
            method: "GET",
            params: {
                direction: { enum: ["asc", "desc"], type: "string" },
                discussion_number: { required: true, type: "integer" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/discussions/:discussion_number/comments"
        },
        listDiscussionCommentsInOrg: {
            method: "GET",
            params: {
                direction: { enum: ["asc", "desc"], type: "string" },
                discussion_number: { required: true, type: "integer" },
                org: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                team_slug: { required: true, type: "string" }
            },
            url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/comments"
        },
        listDiscussionCommentsLegacy: {
            deprecated: "octokit.teams.listDiscussionCommentsLegacy() is deprecated, see https://developer.github.com/v3/teams/discussion_comments/#list-comments-legacy",
            method: "GET",
            params: {
                direction: { enum: ["asc", "desc"], type: "string" },
                discussion_number: { required: true, type: "integer" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/discussions/:discussion_number/comments"
        },
        listDiscussions: {
            deprecated: "octokit.teams.listDiscussions() has been renamed to octokit.teams.listDiscussionsLegacy() (2020-01-16)",
            method: "GET",
            params: {
                direction: { enum: ["asc", "desc"], type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/discussions"
        },
        listDiscussionsInOrg: {
            method: "GET",
            params: {
                direction: { enum: ["asc", "desc"], type: "string" },
                org: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                team_slug: { required: true, type: "string" }
            },
            url: "/orgs/:org/teams/:team_slug/discussions"
        },
        listDiscussionsLegacy: {
            deprecated: "octokit.teams.listDiscussionsLegacy() is deprecated, see https://developer.github.com/v3/teams/discussions/#list-discussions-legacy",
            method: "GET",
            params: {
                direction: { enum: ["asc", "desc"], type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/discussions"
        },
        listForAuthenticatedUser: {
            method: "GET",
            params: { page: { type: "integer" }, per_page: { type: "integer" } },
            url: "/user/teams"
        },
        listMembers: {
            deprecated: "octokit.teams.listMembers() has been renamed to octokit.teams.listMembersLegacy() (2020-01-16)",
            method: "GET",
            params: {
                page: { type: "integer" },
                per_page: { type: "integer" },
                role: { enum: ["member", "maintainer", "all"], type: "string" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/members"
        },
        listMembersInOrg: {
            method: "GET",
            params: {
                org: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                role: { enum: ["member", "maintainer", "all"], type: "string" },
                team_slug: { required: true, type: "string" }
            },
            url: "/orgs/:org/teams/:team_slug/members"
        },
        listMembersLegacy: {
            deprecated: "octokit.teams.listMembersLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#list-team-members-legacy",
            method: "GET",
            params: {
                page: { type: "integer" },
                per_page: { type: "integer" },
                role: { enum: ["member", "maintainer", "all"], type: "string" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/members"
        },
        listPendingInvitations: {
            deprecated: "octokit.teams.listPendingInvitations() has been renamed to octokit.teams.listPendingInvitationsLegacy() (2020-01-16)",
            method: "GET",
            params: {
                page: { type: "integer" },
                per_page: { type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/invitations"
        },
        listPendingInvitationsInOrg: {
            method: "GET",
            params: {
                org: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                team_slug: { required: true, type: "string" }
            },
            url: "/orgs/:org/teams/:team_slug/invitations"
        },
        listPendingInvitationsLegacy: {
            deprecated: "octokit.teams.listPendingInvitationsLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#list-pending-team-invitations-legacy",
            method: "GET",
            params: {
                page: { type: "integer" },
                per_page: { type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/invitations"
        },
        listProjects: {
            deprecated: "octokit.teams.listProjects() has been renamed to octokit.teams.listProjectsLegacy() (2020-01-16)",
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "GET",
            params: {
                page: { type: "integer" },
                per_page: { type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/projects"
        },
        listProjectsInOrg: {
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "GET",
            params: {
                org: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                team_slug: { required: true, type: "string" }
            },
            url: "/orgs/:org/teams/:team_slug/projects"
        },
        listProjectsLegacy: {
            deprecated: "octokit.teams.listProjectsLegacy() is deprecated, see https://developer.github.com/v3/teams/#list-team-projects-legacy",
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "GET",
            params: {
                page: { type: "integer" },
                per_page: { type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/projects"
        },
        listRepos: {
            deprecated: "octokit.teams.listRepos() has been renamed to octokit.teams.listReposLegacy() (2020-01-16)",
            method: "GET",
            params: {
                page: { type: "integer" },
                per_page: { type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/repos"
        },
        listReposInOrg: {
            method: "GET",
            params: {
                org: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                team_slug: { required: true, type: "string" }
            },
            url: "/orgs/:org/teams/:team_slug/repos"
        },
        listReposLegacy: {
            deprecated: "octokit.teams.listReposLegacy() is deprecated, see https://developer.github.com/v3/teams/#list-team-repos-legacy",
            method: "GET",
            params: {
                page: { type: "integer" },
                per_page: { type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/repos"
        },
        removeMember: {
            deprecated: "octokit.teams.removeMember() has been renamed to octokit.teams.removeMemberLegacy() (2020-01-16)",
            method: "DELETE",
            params: {
                team_id: { required: true, type: "integer" },
                username: { required: true, type: "string" }
            },
            url: "/teams/:team_id/members/:username"
        },
        removeMemberLegacy: {
            deprecated: "octokit.teams.removeMemberLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#remove-team-member-legacy",
            method: "DELETE",
            params: {
                team_id: { required: true, type: "integer" },
                username: { required: true, type: "string" }
            },
            url: "/teams/:team_id/members/:username"
        },
        removeMembership: {
            deprecated: "octokit.teams.removeMembership() has been renamed to octokit.teams.removeMembershipLegacy() (2020-01-16)",
            method: "DELETE",
            params: {
                team_id: { required: true, type: "integer" },
                username: { required: true, type: "string" }
            },
            url: "/teams/:team_id/memberships/:username"
        },
        removeMembershipInOrg: {
            method: "DELETE",
            params: {
                org: { required: true, type: "string" },
                team_slug: { required: true, type: "string" },
                username: { required: true, type: "string" }
            },
            url: "/orgs/:org/teams/:team_slug/memberships/:username"
        },
        removeMembershipLegacy: {
            deprecated: "octokit.teams.removeMembershipLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#remove-team-membership-legacy",
            method: "DELETE",
            params: {
                team_id: { required: true, type: "integer" },
                username: { required: true, type: "string" }
            },
            url: "/teams/:team_id/memberships/:username"
        },
        removeProject: {
            deprecated: "octokit.teams.removeProject() has been renamed to octokit.teams.removeProjectLegacy() (2020-01-16)",
            method: "DELETE",
            params: {
                project_id: { required: true, type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/projects/:project_id"
        },
        removeProjectInOrg: {
            method: "DELETE",
            params: {
                org: { required: true, type: "string" },
                project_id: { required: true, type: "integer" },
                team_slug: { required: true, type: "string" }
            },
            url: "/orgs/:org/teams/:team_slug/projects/:project_id"
        },
        removeProjectLegacy: {
            deprecated: "octokit.teams.removeProjectLegacy() is deprecated, see https://developer.github.com/v3/teams/#remove-team-project-legacy",
            method: "DELETE",
            params: {
                project_id: { required: true, type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/projects/:project_id"
        },
        removeRepo: {
            deprecated: "octokit.teams.removeRepo() has been renamed to octokit.teams.removeRepoLegacy() (2020-01-16)",
            method: "DELETE",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/repos/:owner/:repo"
        },
        removeRepoInOrg: {
            method: "DELETE",
            params: {
                org: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                team_slug: { required: true, type: "string" }
            },
            url: "/orgs/:org/teams/:team_slug/repos/:owner/:repo"
        },
        removeRepoLegacy: {
            deprecated: "octokit.teams.removeRepoLegacy() is deprecated, see https://developer.github.com/v3/teams/#remove-team-repository-legacy",
            method: "DELETE",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/repos/:owner/:repo"
        },
        reviewProject: {
            deprecated: "octokit.teams.reviewProject() has been renamed to octokit.teams.reviewProjectLegacy() (2020-01-16)",
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "GET",
            params: {
                project_id: { required: true, type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/projects/:project_id"
        },
        reviewProjectInOrg: {
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "GET",
            params: {
                org: { required: true, type: "string" },
                project_id: { required: true, type: "integer" },
                team_slug: { required: true, type: "string" }
            },
            url: "/orgs/:org/teams/:team_slug/projects/:project_id"
        },
        reviewProjectLegacy: {
            deprecated: "octokit.teams.reviewProjectLegacy() is deprecated, see https://developer.github.com/v3/teams/#review-a-team-project-legacy",
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "GET",
            params: {
                project_id: { required: true, type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/projects/:project_id"
        },
        update: {
            deprecated: "octokit.teams.update() has been renamed to octokit.teams.updateLegacy() (2020-01-16)",
            method: "PATCH",
            params: {
                description: { type: "string" },
                name: { required: true, type: "string" },
                parent_team_id: { type: "integer" },
                permission: { enum: ["pull", "push", "admin"], type: "string" },
                privacy: { enum: ["secret", "closed"], type: "string" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id"
        },
        updateDiscussion: {
            deprecated: "octokit.teams.updateDiscussion() has been renamed to octokit.teams.updateDiscussionLegacy() (2020-01-16)",
            method: "PATCH",
            params: {
                body: { type: "string" },
                discussion_number: { required: true, type: "integer" },
                team_id: { required: true, type: "integer" },
                title: { type: "string" }
            },
            url: "/teams/:team_id/discussions/:discussion_number"
        },
        updateDiscussionComment: {
            deprecated: "octokit.teams.updateDiscussionComment() has been renamed to octokit.teams.updateDiscussionCommentLegacy() (2020-01-16)",
            method: "PATCH",
            params: {
                body: { required: true, type: "string" },
                comment_number: { required: true, type: "integer" },
                discussion_number: { required: true, type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number"
        },
        updateDiscussionCommentInOrg: {
            method: "PATCH",
            params: {
                body: { required: true, type: "string" },
                comment_number: { required: true, type: "integer" },
                discussion_number: { required: true, type: "integer" },
                org: { required: true, type: "string" },
                team_slug: { required: true, type: "string" }
            },
            url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/comments/:comment_number"
        },
        updateDiscussionCommentLegacy: {
            deprecated: "octokit.teams.updateDiscussionCommentLegacy() is deprecated, see https://developer.github.com/v3/teams/discussion_comments/#edit-a-comment-legacy",
            method: "PATCH",
            params: {
                body: { required: true, type: "string" },
                comment_number: { required: true, type: "integer" },
                discussion_number: { required: true, type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number"
        },
        updateDiscussionInOrg: {
            method: "PATCH",
            params: {
                body: { type: "string" },
                discussion_number: { required: true, type: "integer" },
                org: { required: true, type: "string" },
                team_slug: { required: true, type: "string" },
                title: { type: "string" }
            },
            url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number"
        },
        updateDiscussionLegacy: {
            deprecated: "octokit.teams.updateDiscussionLegacy() is deprecated, see https://developer.github.com/v3/teams/discussions/#edit-a-discussion-legacy",
            method: "PATCH",
            params: {
                body: { type: "string" },
                discussion_number: { required: true, type: "integer" },
                team_id: { required: true, type: "integer" },
                title: { type: "string" }
            },
            url: "/teams/:team_id/discussions/:discussion_number"
        },
        updateInOrg: {
            method: "PATCH",
            params: {
                description: { type: "string" },
                name: { required: true, type: "string" },
                org: { required: true, type: "string" },
                parent_team_id: { type: "integer" },
                permission: { enum: ["pull", "push", "admin"], type: "string" },
                privacy: { enum: ["secret", "closed"], type: "string" },
                team_slug: { required: true, type: "string" }
            },
            url: "/orgs/:org/teams/:team_slug"
        },
        updateLegacy: {
            deprecated: "octokit.teams.updateLegacy() is deprecated, see https://developer.github.com/v3/teams/#edit-team-legacy",
            method: "PATCH",
            params: {
                description: { type: "string" },
                name: { required: true, type: "string" },
                parent_team_id: { type: "integer" },
                permission: { enum: ["pull", "push", "admin"], type: "string" },
                privacy: { enum: ["secret", "closed"], type: "string" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id"
        }
    },
    users: {
        addEmails: {
            method: "POST",
            params: { emails: { required: true, type: "string[]" } },
            url: "/user/emails"
        },
        block: {
            method: "PUT",
            params: { username: { required: true, type: "string" } },
            url: "/user/blocks/:username"
        },
        checkBlocked: {
            method: "GET",
            params: { username: { required: true, type: "string" } },
            url: "/user/blocks/:username"
        },
        checkFollowing: {
            method: "GET",
            params: { username: { required: true, type: "string" } },
            url: "/user/following/:username"
        },
        checkFollowingForUser: {
            method: "GET",
            params: {
                target_user: { required: true, type: "string" },
                username: { required: true, type: "string" }
            },
            url: "/users/:username/following/:target_user"
        },
        createGpgKey: {
            method: "POST",
            params: { armored_public_key: { type: "string" } },
            url: "/user/gpg_keys"
        },
        createPublicKey: {
            method: "POST",
            params: { key: { type: "string" }, title: { type: "string" } },
            url: "/user/keys"
        },
        deleteEmails: {
            method: "DELETE",
            params: { emails: { required: true, type: "string[]" } },
            url: "/user/emails"
        },
        deleteGpgKey: {
            method: "DELETE",
            params: { gpg_key_id: { required: true, type: "integer" } },
            url: "/user/gpg_keys/:gpg_key_id"
        },
        deletePublicKey: {
            method: "DELETE",
            params: { key_id: { required: true, type: "integer" } },
            url: "/user/keys/:key_id"
        },
        follow: {
            method: "PUT",
            params: { username: { required: true, type: "string" } },
            url: "/user/following/:username"
        },
        getAuthenticated: { method: "GET", params: {}, url: "/user" },
        getByUsername: {
            method: "GET",
            params: { username: { required: true, type: "string" } },
            url: "/users/:username"
        },
        getContextForUser: {
            method: "GET",
            params: {
                subject_id: { type: "string" },
                subject_type: {
                    enum: ["organization", "repository", "issue", "pull_request"],
                    type: "string"
                },
                username: { required: true, type: "string" }
            },
            url: "/users/:username/hovercard"
        },
        getGpgKey: {
            method: "GET",
            params: { gpg_key_id: { required: true, type: "integer" } },
            url: "/user/gpg_keys/:gpg_key_id"
        },
        getPublicKey: {
            method: "GET",
            params: { key_id: { required: true, type: "integer" } },
            url: "/user/keys/:key_id"
        },
        list: {
            method: "GET",
            params: {
                page: { type: "integer" },
                per_page: { type: "integer" },
                since: { type: "string" }
            },
            url: "/users"
        },
        listBlocked: { method: "GET", params: {}, url: "/user/blocks" },
        listEmails: {
            method: "GET",
            params: { page: { type: "integer" }, per_page: { type: "integer" } },
            url: "/user/emails"
        },
        listFollowersForAuthenticatedUser: {
            method: "GET",
            params: { page: { type: "integer" }, per_page: { type: "integer" } },
            url: "/user/followers"
        },
        listFollowersForUser: {
            method: "GET",
            params: {
                page: { type: "integer" },
                per_page: { type: "integer" },
                username: { required: true, type: "string" }
            },
            url: "/users/:username/followers"
        },
        listFollowingForAuthenticatedUser: {
            method: "GET",
            params: { page: { type: "integer" }, per_page: { type: "integer" } },
            url: "/user/following"
        },
        listFollowingForUser: {
            method: "GET",
            params: {
                page: { type: "integer" },
                per_page: { type: "integer" },
                username: { required: true, type: "string" }
            },
            url: "/users/:username/following"
        },
        listGpgKeys: {
            method: "GET",
            params: { page: { type: "integer" }, per_page: { type: "integer" } },
            url: "/user/gpg_keys"
        },
        listGpgKeysForUser: {
            method: "GET",
            params: {
                page: { type: "integer" },
                per_page: { type: "integer" },
                username: { required: true, type: "string" }
            },
            url: "/users/:username/gpg_keys"
        },
        listPublicEmails: {
            method: "GET",
            params: { page: { type: "integer" }, per_page: { type: "integer" } },
            url: "/user/public_emails"
        },
        listPublicKeys: {
            method: "GET",
            params: { page: { type: "integer" }, per_page: { type: "integer" } },
            url: "/user/keys"
        },
        listPublicKeysForUser: {
            method: "GET",
            params: {
                page: { type: "integer" },
                per_page: { type: "integer" },
                username: { required: true, type: "string" }
            },
            url: "/users/:username/keys"
        },
        togglePrimaryEmailVisibility: {
            method: "PATCH",
            params: {
                email: { required: true, type: "string" },
                visibility: { required: true, type: "string" }
            },
            url: "/user/email/visibility"
        },
        unblock: {
            method: "DELETE",
            params: { username: { required: true, type: "string" } },
            url: "/user/blocks/:username"
        },
        unfollow: {
            method: "DELETE",
            params: { username: { required: true, type: "string" } },
            url: "/user/following/:username"
        },
        updateAuthenticated: {
            method: "PATCH",
            params: {
                bio: { type: "string" },
                blog: { type: "string" },
                company: { type: "string" },
                email: { type: "string" },
                hireable: { type: "boolean" },
                location: { type: "string" },
                name: { type: "string" }
            },
            url: "/user"
        }
    }
};

const VERSION$3 = "2.4.0";

function registerEndpoints(octokit, routes) {
    Object.keys(routes).forEach(namespaceName => {
        if (!octokit[namespaceName]) {
            octokit[namespaceName] = {};
        }
        Object.keys(routes[namespaceName]).forEach(apiName => {
            const apiOptions = routes[namespaceName][apiName];
            const endpointDefaults = ["method", "url", "headers"].reduce((map, key) => {
                if (typeof apiOptions[key] !== "undefined") {
                    map[key] = apiOptions[key];
                }
                return map;
            }, {});
            endpointDefaults.request = {
                validate: apiOptions.params
            };
            let request = octokit.request.defaults(endpointDefaults);
            // patch request & endpoint methods to support deprecated parameters.
            // Not the most elegant solution, but we don’t want to move deprecation
            // logic into octokit/endpoint.js as it’s out of scope
            const hasDeprecatedParam = Object.keys(apiOptions.params || {}).find(key => apiOptions.params[key].deprecated);
            if (hasDeprecatedParam) {
                const patch = patchForDeprecation.bind(null, octokit, apiOptions);
                request = patch(octokit.request.defaults(endpointDefaults), `.${namespaceName}.${apiName}()`);
                request.endpoint = patch(request.endpoint, `.${namespaceName}.${apiName}.endpoint()`);
                request.endpoint.merge = patch(request.endpoint.merge, `.${namespaceName}.${apiName}.endpoint.merge()`);
            }
            if (apiOptions.deprecated) {
                octokit[namespaceName][apiName] = Object.assign(function deprecatedEndpointMethod() {
                    octokit.log.warn(new Deprecation(`[@octokit/rest] ${apiOptions.deprecated}`));
                    octokit[namespaceName][apiName] = request;
                    return request.apply(null, arguments);
                }, request);
                return;
            }
            octokit[namespaceName][apiName] = request;
        });
    });
}
function patchForDeprecation(octokit, apiOptions, method, methodName) {
    const patchedMethod = (options) => {
        options = Object.assign({}, options);
        Object.keys(options).forEach(key => {
            if (apiOptions.params[key] && apiOptions.params[key].deprecated) {
                const aliasKey = apiOptions.params[key].alias;
                octokit.log.warn(new Deprecation(`[@octokit/rest] "${key}" parameter is deprecated for "${methodName}". Use "${aliasKey}" instead`));
                if (!(aliasKey in options)) {
                    options[aliasKey] = options[key];
                }
                delete options[key];
            }
        });
        return method(options);
    };
    Object.keys(method).forEach(key => {
        patchedMethod[key] = method[key];
    });
    return patchedMethod;
}

/**
 * This plugin is a 1:1 copy of internal @octokit/rest plugins. The primary
 * goal is to rebuild @octokit/rest on top of @octokit/core. Once that is
 * done, we will remove the registerEndpoints methods and return the methods
 * directly as with the other plugins. At that point we will also remove the
 * legacy workarounds and deprecations.
 *
 * See the plan at
 * https://github.com/octokit/plugin-rest-endpoint-methods.js/pull/1
 */
function restEndpointMethods(octokit) {
    // @ts-ignore
    octokit.registerEndpoints = registerEndpoints.bind(null, octokit);
    registerEndpoints(octokit, endpointsByScope);
    // Aliasing scopes for backward compatibility
    // See https://github.com/octokit/rest.js/pull/1134
    [
        ["gitdata", "git"],
        ["authorization", "oauthAuthorizations"],
        ["pullRequests", "pulls"]
    ].forEach(([deprecatedScope, scope]) => {
        Object.defineProperty(octokit, deprecatedScope, {
            get() {
                octokit.log.warn(
                // @ts-ignore
                new Deprecation(`[@octokit/plugin-rest-endpoint-methods] "octokit.${deprecatedScope}.*" methods are deprecated, use "octokit.${scope}.*" instead`));
                // @ts-ignore
                return octokit[scope];
            }
        });
    });
    return {};
}
restEndpointMethods.VERSION = VERSION$3;

var distWeb$5 = {
	__proto__: null,
	restEndpointMethods: restEndpointMethods
};

var register_1 = register;

function register (state, name, method, options) {
  if (typeof method !== 'function') {
    throw new Error('method for before hook must be a function')
  }

  if (!options) {
    options = {};
  }

  if (Array.isArray(name)) {
    return name.reverse().reduce(function (callback, name) {
      return register.bind(null, state, name, callback, options)
    }, method)()
  }

  return Promise.resolve()
    .then(function () {
      if (!state.registry[name]) {
        return method(options)
      }

      return (state.registry[name]).reduce(function (method, registered) {
        return registered.hook.bind(null, method, options)
      }, method)()
    })
}

var add = addHook;

function addHook (state, kind, name, hook) {
  var orig = hook;
  if (!state.registry[name]) {
    state.registry[name] = [];
  }

  if (kind === 'before') {
    hook = function (method, options) {
      return Promise.resolve()
        .then(orig.bind(null, options))
        .then(method.bind(null, options))
    };
  }

  if (kind === 'after') {
    hook = function (method, options) {
      var result;
      return Promise.resolve()
        .then(method.bind(null, options))
        .then(function (result_) {
          result = result_;
          return orig(result, options)
        })
        .then(function () {
          return result
        })
    };
  }

  if (kind === 'error') {
    hook = function (method, options) {
      return Promise.resolve()
        .then(method.bind(null, options))
        .catch(function (error) {
          return orig(error, options)
        })
    };
  }

  state.registry[name].push({
    hook: hook,
    orig: orig
  });
}

var remove = removeHook;

function removeHook (state, name, method) {
  if (!state.registry[name]) {
    return
  }

  var index = state.registry[name]
    .map(function (registered) { return registered.orig })
    .indexOf(method);

  if (index === -1) {
    return
  }

  state.registry[name].splice(index, 1);
}

// bind with array of arguments: https://stackoverflow.com/a/21792913
var bind = Function.bind;
var bindable = bind.bind(bind);

function bindApi (hook, state, name) {
  var removeHookRef = bindable(remove, null).apply(null, name ? [state, name] : [state]);
  hook.api = { remove: removeHookRef };
  hook.remove = removeHookRef

  ;['before', 'error', 'after', 'wrap'].forEach(function (kind) {
    var args = name ? [state, kind, name] : [state, kind];
    hook[kind] = hook.api[kind] = bindable(add, null).apply(null, args);
  });
}

function HookSingular () {
  var singularHookName = 'h';
  var singularHookState = {
    registry: {}
  };
  var singularHook = register_1.bind(null, singularHookState, singularHookName);
  bindApi(singularHook, singularHookState, singularHookName);
  return singularHook
}

function HookCollection () {
  var state = {
    registry: {}
  };

  var hook = register_1.bind(null, state);
  bindApi(hook, state);

  return hook
}

var collectionHookDeprecationMessageDisplayed = false;
function Hook () {
  if (!collectionHookDeprecationMessageDisplayed) {
    console.warn('[before-after-hook]: "Hook()" repurposing warning, use "Hook.Collection()". Read more: https://git.io/upgrade-before-after-hook-to-1.4');
    collectionHookDeprecationMessageDisplayed = true;
  }
  return HookCollection()
}

Hook.Singular = HookSingular.bind();
Hook.Collection = HookCollection.bind();

var beforeAfterHook = Hook;
// expose constructors as a named property for TypeScript
var Hook_1 = Hook;
var Singular = Hook.Singular;
var Collection = Hook.Collection;
beforeAfterHook.Hook = Hook_1;
beforeAfterHook.Singular = Singular;
beforeAfterHook.Collection = Collection;

var _from = "@octokit/rest@^16.43.1";
var _id = "@octokit/rest@16.43.1";
var _inBundle = false;
var _integrity = "sha512-gfFKwRT/wFxq5qlNjnW2dh+qh74XgTQ2B179UX5K1HYCluioWj8Ndbgqw2PVqa1NnVJkGHp2ovMpVn/DImlmkw==";
var _location = "/@octokit/rest";
var _phantomChildren = {
};
var _requested = {
	type: "range",
	registry: true,
	raw: "@octokit/rest@^16.43.1",
	name: "@octokit/rest",
	escapedName: "@octokit%2frest",
	scope: "@octokit",
	rawSpec: "^16.43.1",
	saveSpec: null,
	fetchSpec: "^16.43.1"
};
var _requiredBy = [
	"/@actions/github"
];
var _resolved = "https://registry.npmjs.org/@octokit/rest/-/rest-16.43.1.tgz";
var _shasum = "3b11e7d1b1ac2bbeeb23b08a17df0b20947eda6b";
var _spec = "@octokit/rest@^16.43.1";
var _where = "/home/jasonjmiller/projects/buildoff/.github/actions/preview/node_modules/@actions/github";
var author = {
	name: "Gregor Martynus",
	url: "https://github.com/gr2m"
};
var bugs = {
	url: "https://github.com/octokit/rest.js/issues"
};
var bundleDependencies = false;
var bundlesize = [
	{
		path: "./dist/octokit-rest.min.js.gz",
		maxSize: "33 kB"
	}
];
var contributors = [
	{
		name: "Mike de Boer",
		email: "info@mikedeboer.nl"
	},
	{
		name: "Fabian Jakobs",
		email: "fabian@c9.io"
	},
	{
		name: "Joe Gallo",
		email: "joe@brassafrax.com"
	},
	{
		name: "Gregor Martynus",
		url: "https://github.com/gr2m"
	}
];
var dependencies = {
	"@octokit/auth-token": "^2.4.0",
	"@octokit/plugin-paginate-rest": "^1.1.1",
	"@octokit/plugin-request-log": "^1.0.0",
	"@octokit/plugin-rest-endpoint-methods": "2.4.0",
	"@octokit/request": "^5.2.0",
	"@octokit/request-error": "^1.0.2",
	"atob-lite": "^2.0.0",
	"before-after-hook": "^2.0.0",
	"btoa-lite": "^1.0.0",
	deprecation: "^2.0.0",
	"lodash.get": "^4.4.2",
	"lodash.set": "^4.3.2",
	"lodash.uniq": "^4.5.0",
	"octokit-pagination-methods": "^1.1.0",
	once: "^1.4.0",
	"universal-user-agent": "^4.0.0"
};
var deprecated = false;
var description = "GitHub REST API client for Node.js";
var devDependencies = {
	"@gimenete/type-writer": "^0.1.3",
	"@octokit/auth": "^1.1.1",
	"@octokit/fixtures-server": "^5.0.6",
	"@octokit/graphql": "^4.2.0",
	"@types/node": "^13.1.0",
	bundlesize: "^0.18.0",
	chai: "^4.1.2",
	"compression-webpack-plugin": "^3.1.0",
	cypress: "^3.0.0",
	glob: "^7.1.2",
	"http-proxy-agent": "^4.0.0",
	"lodash.camelcase": "^4.3.0",
	"lodash.merge": "^4.6.1",
	"lodash.upperfirst": "^4.3.1",
	lolex: "^5.1.2",
	mkdirp: "^1.0.0",
	mocha: "^7.0.1",
	mustache: "^4.0.0",
	nock: "^11.3.3",
	"npm-run-all": "^4.1.2",
	nyc: "^15.0.0",
	prettier: "^1.14.2",
	proxy: "^1.0.0",
	"semantic-release": "^17.0.0",
	sinon: "^8.0.0",
	"sinon-chai": "^3.0.0",
	"sort-keys": "^4.0.0",
	"string-to-arraybuffer": "^1.0.0",
	"string-to-jsdoc-comment": "^1.0.0",
	typescript: "^3.3.1",
	webpack: "^4.0.0",
	"webpack-bundle-analyzer": "^3.0.0",
	"webpack-cli": "^3.0.0"
};
var files = [
	"index.js",
	"index.d.ts",
	"lib",
	"plugins"
];
var homepage = "https://github.com/octokit/rest.js#readme";
var keywords = [
	"octokit",
	"github",
	"rest",
	"api-client"
];
var license = "MIT";
var name = "@octokit/rest";
var nyc = {
	ignore: [
		"test"
	]
};
var publishConfig = {
	access: "public"
};
var release = {
	publish: [
		"@semantic-release/npm",
		{
			path: "@semantic-release/github",
			assets: [
				"dist/*",
				"!dist/*.map.gz"
			]
		}
	]
};
var repository = {
	type: "git",
	url: "git+https://github.com/octokit/rest.js.git"
};
var scripts = {
	build: "npm-run-all build:*",
	"build:browser": "npm-run-all build:browser:*",
	"build:browser:development": "webpack --mode development --entry . --output-library=Octokit --output=./dist/octokit-rest.js --profile --json > dist/bundle-stats.json",
	"build:browser:production": "webpack --mode production --entry . --plugin=compression-webpack-plugin --output-library=Octokit --output-path=./dist --output-filename=octokit-rest.min.js --devtool source-map",
	"build:ts": "npm run -s update-endpoints:typescript",
	coverage: "nyc report --reporter=html && open coverage/index.html",
	"generate-bundle-report": "webpack-bundle-analyzer dist/bundle-stats.json --mode=static --no-open --report dist/bundle-report.html",
	lint: "prettier --check '{lib,plugins,scripts,test}/**/*.{js,json,ts}' 'docs/*.{js,json}' 'docs/src/**/*' index.js README.md package.json",
	"lint:fix": "prettier --write '{lib,plugins,scripts,test}/**/*.{js,json,ts}' 'docs/*.{js,json}' 'docs/src/**/*' index.js README.md package.json",
	"postvalidate:ts": "tsc --noEmit --target es6 test/typescript-validate.ts",
	"prebuild:browser": "mkdirp dist/",
	pretest: "npm run -s lint",
	"prevalidate:ts": "npm run -s build:ts",
	"start-fixtures-server": "octokit-fixtures-server",
	test: "nyc mocha test/mocha-node-setup.js \"test/*/**/*-test.js\"",
	"test:browser": "cypress run --browser chrome",
	"update-endpoints": "npm-run-all update-endpoints:*",
	"update-endpoints:fetch-json": "node scripts/update-endpoints/fetch-json",
	"update-endpoints:typescript": "node scripts/update-endpoints/typescript",
	"validate:ts": "tsc --target es6 --noImplicitAny index.d.ts"
};
var types = "index.d.ts";
var version = "16.43.1";
var _package = {
	_from: _from,
	_id: _id,
	_inBundle: _inBundle,
	_integrity: _integrity,
	_location: _location,
	_phantomChildren: _phantomChildren,
	_requested: _requested,
	_requiredBy: _requiredBy,
	_resolved: _resolved,
	_shasum: _shasum,
	_spec: _spec,
	_where: _where,
	author: author,
	bugs: bugs,
	bundleDependencies: bundleDependencies,
	bundlesize: bundlesize,
	contributors: contributors,
	dependencies: dependencies,
	deprecated: deprecated,
	description: description,
	devDependencies: devDependencies,
	files: files,
	homepage: homepage,
	keywords: keywords,
	license: license,
	name: name,
	nyc: nyc,
	publishConfig: publishConfig,
	release: release,
	repository: repository,
	scripts: scripts,
	types: types,
	version: version
};

var _package$1 = {
	__proto__: null,
	_from: _from,
	_id: _id,
	_inBundle: _inBundle,
	_integrity: _integrity,
	_location: _location,
	_phantomChildren: _phantomChildren,
	_requested: _requested,
	_requiredBy: _requiredBy,
	_resolved: _resolved,
	_shasum: _shasum,
	_spec: _spec,
	_where: _where,
	author: author,
	bugs: bugs,
	bundleDependencies: bundleDependencies,
	bundlesize: bundlesize,
	contributors: contributors,
	dependencies: dependencies,
	deprecated: deprecated,
	description: description,
	devDependencies: devDependencies,
	files: files,
	homepage: homepage,
	keywords: keywords,
	license: license,
	name: name,
	nyc: nyc,
	publishConfig: publishConfig,
	release: release,
	repository: repository,
	scripts: scripts,
	types: types,
	version: version,
	'default': _package
};

var pkg = getCjsExportFromNamespace(_package$1);

var parseClientOptions = parseOptions;

const { Deprecation: Deprecation$1 } = distWeb;
const { getUserAgent: getUserAgent$3 } = distWeb$3;




const deprecateOptionsTimeout = once_1((log, deprecation) =>
  log.warn(deprecation)
);
const deprecateOptionsAgent = once_1((log, deprecation) => log.warn(deprecation));
const deprecateOptionsHeaders = once_1((log, deprecation) =>
  log.warn(deprecation)
);

function parseOptions(options, log, hook) {
  if (options.headers) {
    options.headers = Object.keys(options.headers).reduce((newObj, key) => {
      newObj[key.toLowerCase()] = options.headers[key];
      return newObj;
    }, {});
  }

  const clientDefaults = {
    headers: options.headers || {},
    request: options.request || {},
    mediaType: {
      previews: [],
      format: ""
    }
  };

  if (options.baseUrl) {
    clientDefaults.baseUrl = options.baseUrl;
  }

  if (options.userAgent) {
    clientDefaults.headers["user-agent"] = options.userAgent;
  }

  if (options.previews) {
    clientDefaults.mediaType.previews = options.previews;
  }

  if (options.timeZone) {
    clientDefaults.headers["time-zone"] = options.timeZone;
  }

  if (options.timeout) {
    deprecateOptionsTimeout(
      log,
      new Deprecation$1(
        "[@octokit/rest] new Octokit({timeout}) is deprecated. Use {request: {timeout}} instead. See https://github.com/octokit/request.js#request"
      )
    );
    clientDefaults.request.timeout = options.timeout;
  }

  if (options.agent) {
    deprecateOptionsAgent(
      log,
      new Deprecation$1(
        "[@octokit/rest] new Octokit({agent}) is deprecated. Use {request: {agent}} instead. See https://github.com/octokit/request.js#request"
      )
    );
    clientDefaults.request.agent = options.agent;
  }

  if (options.headers) {
    deprecateOptionsHeaders(
      log,
      new Deprecation$1(
        "[@octokit/rest] new Octokit({headers}) is deprecated. Use {userAgent, previews} instead. See https://github.com/octokit/request.js#request"
      )
    );
  }

  const userAgentOption = clientDefaults.headers["user-agent"];
  const defaultUserAgent = `octokit.js/${pkg.version} ${getUserAgent$3()}`;

  clientDefaults.headers["user-agent"] = [userAgentOption, defaultUserAgent]
    .filter(Boolean)
    .join(" ");

  clientDefaults.request.hook = hook.bind(null, "request");

  return clientDefaults;
}

var constructor_1 = Octokit;

const { request: request$1 } = distWeb$2;




function Octokit(plugins, options) {
  options = options || {};
  const hook = new beforeAfterHook.Collection();
  const log = Object.assign(
    {
      debug: () => {},
      info: () => {},
      warn: console.warn,
      error: console.error
    },
    options && options.log
  );
  const api = {
    hook,
    log,
    request: request$1.defaults(parseClientOptions(options, log, hook))
  };

  plugins.forEach(pluginFunction => pluginFunction(api, options));

  return api;
}

var registerPlugin_1 = registerPlugin;



function registerPlugin(plugins, pluginFunction) {
  return factory_1(
    plugins.includes(pluginFunction) ? plugins : plugins.concat(pluginFunction)
  );
}

var factory_1 = factory;




function factory(plugins) {
  const Api = constructor_1.bind(null, plugins || []);
  Api.plugin = registerPlugin_1.bind(null, plugins || []);
  return Api;
}

var core$1 = factory_1();

async function auth(token) {
    const tokenType = token.split(/\./).length === 3
        ? "app"
        : /^v\d+\./.test(token)
            ? "installation"
            : "oauth";
    return {
        type: "token",
        token: token,
        tokenType
    };
}

/**
 * Prefix token for usage in the Authorization header
 *
 * @param token OAuth token or JSON Web Token
 */
function withAuthorizationPrefix(token) {
    if (token.split(/\./).length === 3) {
        return `bearer ${token}`;
    }
    return `token ${token}`;
}

async function hook(token, request, route, parameters) {
    const endpoint = request.endpoint.merge(route, parameters);
    endpoint.headers.authorization = withAuthorizationPrefix(token);
    return request(endpoint);
}

const createTokenAuth = function createTokenAuth(token) {
    if (!token) {
        throw new Error("[@octokit/auth-token] No token passed to createTokenAuth");
    }
    if (typeof token !== "string") {
        throw new Error("[@octokit/auth-token] Token passed to createTokenAuth is not a string");
    }
    token = token.replace(/^(token|bearer) +/i, "");
    return Object.assign(auth.bind(null, token), {
        hook: hook.bind(null, token)
    });
};

var distWeb$6 = {
	__proto__: null,
	createTokenAuth: createTokenAuth
};

var btoaNode = function btoa(str) {
  return new Buffer(str).toString('base64')
};

var atobNode = function atob(str) {
  return Buffer.from(str, 'base64').toString('binary')
};

var withAuthorizationPrefix_1 = withAuthorizationPrefix$1;



const REGEX_IS_BASIC_AUTH = /^[\w-]+:/;

function withAuthorizationPrefix$1(authorization) {
  if (/^(basic|bearer|token) /i.test(authorization)) {
    return authorization;
  }

  try {
    if (REGEX_IS_BASIC_AUTH.test(atobNode(authorization))) {
      return `basic ${authorization}`;
    }
  } catch (error) {}

  if (authorization.split(/\./).length === 3) {
    return `bearer ${authorization}`;
  }

  return `token ${authorization}`;
}

var beforeRequest = authenticationBeforeRequest;





function authenticationBeforeRequest(state, options) {
  if (typeof state.auth === "string") {
    options.headers.authorization = withAuthorizationPrefix_1(state.auth);
    return;
  }

  if (state.auth.username) {
    const hash = btoaNode(`${state.auth.username}:${state.auth.password}`);
    options.headers.authorization = `Basic ${hash}`;
    if (state.otp) {
      options.headers["x-github-otp"] = state.otp;
    }
    return;
  }

  if (state.auth.clientId) {
    // There is a special case for OAuth applications, when `clientId` and `clientSecret` is passed as
    // Basic Authorization instead of query parameters. The only routes where that applies share the same
    // URL though: `/applications/:client_id/tokens/:access_token`.
    //
    //  1. [Check an authorization](https://developer.github.com/v3/oauth_authorizations/#check-an-authorization)
    //  2. [Reset an authorization](https://developer.github.com/v3/oauth_authorizations/#reset-an-authorization)
    //  3. [Revoke an authorization for an application](https://developer.github.com/v3/oauth_authorizations/#revoke-an-authorization-for-an-application)
    //
    // We identify by checking the URL. It must merge both "/applications/:client_id/tokens/:access_token"
    // as well as "/applications/123/tokens/token456"
    if (/\/applications\/:?[\w_]+\/tokens\/:?[\w_]+($|\?)/.test(options.url)) {
      const hash = btoaNode(`${state.auth.clientId}:${state.auth.clientSecret}`);
      options.headers.authorization = `Basic ${hash}`;
      return;
    }

    options.url += options.url.indexOf("?") === -1 ? "?" : "&";
    options.url += `client_id=${state.auth.clientId}&client_secret=${state.auth.clientSecret}`;
    return;
  }

  return Promise.resolve()

    .then(() => {
      return state.auth();
    })

    .then(authorization => {
      options.headers.authorization = withAuthorizationPrefix_1(authorization);
    });
}

var requestError = authenticationRequestError;

const { RequestError: RequestError$1 } = distWeb$1;

function authenticationRequestError(state, error, options) {
  if (!error.headers) throw error;

  const otpRequired = /required/.test(error.headers["x-github-otp"] || "");
  // handle "2FA required" error only
  if (error.status !== 401 || !otpRequired) {
    throw error;
  }

  if (
    error.status === 401 &&
    otpRequired &&
    error.request &&
    error.request.headers["x-github-otp"]
  ) {
    if (state.otp) {
      delete state.otp; // no longer valid, request again
    } else {
      throw new RequestError$1(
        "Invalid one-time password for two-factor authentication",
        401,
        {
          headers: error.headers,
          request: options
        }
      );
    }
  }

  if (typeof state.auth.on2fa !== "function") {
    throw new RequestError$1(
      "2FA required, but options.on2fa is not a function. See https://github.com/octokit/rest.js#authentication",
      401,
      {
        headers: error.headers,
        request: options
      }
    );
  }

  return Promise.resolve()
    .then(() => {
      return state.auth.on2fa();
    })
    .then(oneTimePassword => {
      const newOptions = Object.assign(options, {
        headers: Object.assign(options.headers, {
          "x-github-otp": oneTimePassword
        })
      });
      return state.octokit.request(newOptions).then(response => {
        // If OTP still valid, then persist it for following requests
        state.otp = oneTimePassword;
        return response;
      });
    });
}

var validate = validateAuth;

function validateAuth(auth) {
  if (typeof auth === "string") {
    return;
  }

  if (typeof auth === "function") {
    return;
  }

  if (auth.username && auth.password) {
    return;
  }

  if (auth.clientId && auth.clientSecret) {
    return;
  }

  throw new Error(`Invalid "auth" option: ${JSON.stringify(auth)}`);
}

var authentication = authenticationPlugin;

const { createTokenAuth: createTokenAuth$1 } = distWeb$6;
const { Deprecation: Deprecation$2 } = distWeb;







const deprecateAuthBasic = once_1((log, deprecation) => log.warn(deprecation));
const deprecateAuthObject = once_1((log, deprecation) => log.warn(deprecation));

function authenticationPlugin(octokit, options) {
  // If `options.authStrategy` is set then use it and pass in `options.auth`
  if (options.authStrategy) {
    const auth = options.authStrategy(options.auth);
    octokit.hook.wrap("request", auth.hook);
    octokit.auth = auth;
    return;
  }

  // If neither `options.authStrategy` nor `options.auth` are set, the `octokit` instance
  // is unauthenticated. The `octokit.auth()` method is a no-op and no request hook is registred.
  if (!options.auth) {
    octokit.auth = () =>
      Promise.resolve({
        type: "unauthenticated"
      });
    return;
  }

  const isBasicAuthString =
    typeof options.auth === "string" &&
    /^basic/.test(withAuthorizationPrefix_1(options.auth));

  // If only `options.auth` is set to a string, use the default token authentication strategy.
  if (typeof options.auth === "string" && !isBasicAuthString) {
    const auth = createTokenAuth$1(options.auth);
    octokit.hook.wrap("request", auth.hook);
    octokit.auth = auth;
    return;
  }

  // Otherwise log a deprecation message
  const [deprecationMethod, deprecationMessapge] = isBasicAuthString
    ? [
        deprecateAuthBasic,
        'Setting the "new Octokit({ auth })" option to a Basic Auth string is deprecated. Use https://github.com/octokit/auth-basic.js instead. See (https://octokit.github.io/rest.js/#authentication)'
      ]
    : [
        deprecateAuthObject,
        'Setting the "new Octokit({ auth })" option to an object without also setting the "authStrategy" option is deprecated and will be removed in v17. See (https://octokit.github.io/rest.js/#authentication)'
      ];
  deprecationMethod(
    octokit.log,
    new Deprecation$2("[@octokit/rest] " + deprecationMessapge)
  );

  octokit.auth = () =>
    Promise.resolve({
      type: "deprecated",
      message: deprecationMessapge
    });

  validate(options.auth);

  const state = {
    octokit,
    auth: options.auth
  };

  octokit.hook.before("request", beforeRequest.bind(null, state));
  octokit.hook.error("request", requestError.bind(null, state));
}

var authenticate_1 = authenticate;

const { Deprecation: Deprecation$3 } = distWeb;


const deprecateAuthenticate = once_1((log, deprecation) => log.warn(deprecation));

function authenticate(state, options) {
  deprecateAuthenticate(
    state.octokit.log,
    new Deprecation$3(
      '[@octokit/rest] octokit.authenticate() is deprecated. Use "auth" constructor option instead.'
    )
  );

  if (!options) {
    state.auth = false;
    return;
  }

  switch (options.type) {
    case "basic":
      if (!options.username || !options.password) {
        throw new Error(
          "Basic authentication requires both a username and password to be set"
        );
      }
      break;

    case "oauth":
      if (!options.token && !(options.key && options.secret)) {
        throw new Error(
          "OAuth2 authentication requires a token or key & secret to be set"
        );
      }
      break;

    case "token":
    case "app":
      if (!options.token) {
        throw new Error("Token authentication requires a token to be set");
      }
      break;

    default:
      throw new Error(
        "Invalid authentication type, must be 'basic', 'oauth', 'token' or 'app'"
      );
  }

  state.auth = options;
}

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/**
 * A specialized version of `_.includes` for arrays without support for
 * specifying an index to search from.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludes(array, value) {
  var length = array ? array.length : 0;
  return !!length && baseIndexOf(array, value, 0) > -1;
}

/**
 * This function is like `arrayIncludes` except that it accepts a comparator.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @param {Function} comparator The comparator invoked per element.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludesWith(array, value, comparator) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (comparator(value, array[index])) {
      return true;
    }
  }
  return false;
}

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  if (value !== value) {
    return baseFindIndex(array, baseIsNaN, fromIndex);
  }
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */
function baseIsNaN(value) {
  return value !== value;
}

/**
 * Checks if a cache value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var splice = arrayProto.splice;

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map'),
    Set = getNative(root, 'Set'),
    nativeCreate = getNative(Object, 'create');

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values ? values.length : 0;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject$1(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.uniqBy` without support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 */
function baseUniq(array, iteratee, comparator) {
  var index = -1,
      includes = arrayIncludes,
      length = array.length,
      isCommon = true,
      result = [],
      seen = result;

  if (comparator) {
    isCommon = false;
    includes = arrayIncludesWith;
  }
  else if (length >= LARGE_ARRAY_SIZE) {
    var set = iteratee ? null : createSet(array);
    if (set) {
      return setToArray(set);
    }
    isCommon = false;
    includes = cacheHas;
    seen = new SetCache;
  }
  else {
    seen = iteratee ? [] : result;
  }
  outer:
  while (++index < length) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    value = (comparator || value !== 0) ? value : 0;
    if (isCommon && computed === computed) {
      var seenIndex = seen.length;
      while (seenIndex--) {
        if (seen[seenIndex] === computed) {
          continue outer;
        }
      }
      if (iteratee) {
        seen.push(computed);
      }
      result.push(value);
    }
    else if (!includes(seen, computed, comparator)) {
      if (seen !== result) {
        seen.push(computed);
      }
      result.push(value);
    }
  }
  return result;
}

/**
 * Creates a set object of `values`.
 *
 * @private
 * @param {Array} values The values to add to the set.
 * @returns {Object} Returns the new set.
 */
var createSet = !(Set && (1 / setToArray(new Set([,-0]))[1]) == INFINITY) ? noop : function(values) {
  return new Set(values);
};

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Creates a duplicate-free version of an array, using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons, in which only the first occurrence of each
 * element is kept.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @returns {Array} Returns the new duplicate free array.
 * @example
 *
 * _.uniq([2, 1, 2]);
 * // => [2, 1]
 */
function uniq(array) {
  return (array && array.length)
    ? baseUniq(array)
    : [];
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject$1(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject$1(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * This method returns `undefined`.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Util
 * @example
 *
 * _.times(2, _.noop);
 * // => [undefined, undefined]
 */
function noop() {
  // No operation performed.
}

var lodash_uniq = uniq;

var beforeRequest$1 = authenticationBeforeRequest$1;




function authenticationBeforeRequest$1(state, options) {
  if (!state.auth.type) {
    return;
  }

  if (state.auth.type === "basic") {
    const hash = btoaNode(`${state.auth.username}:${state.auth.password}`);
    options.headers.authorization = `Basic ${hash}`;
    return;
  }

  if (state.auth.type === "token") {
    options.headers.authorization = `token ${state.auth.token}`;
    return;
  }

  if (state.auth.type === "app") {
    options.headers.authorization = `Bearer ${state.auth.token}`;
    const acceptHeaders = options.headers.accept
      .split(",")
      .concat("application/vnd.github.machine-man-preview+json");
    options.headers.accept = lodash_uniq(acceptHeaders)
      .filter(Boolean)
      .join(",");
    return;
  }

  options.url += options.url.indexOf("?") === -1 ? "?" : "&";

  if (state.auth.token) {
    options.url += `access_token=${encodeURIComponent(state.auth.token)}`;
    return;
  }

  const key = encodeURIComponent(state.auth.key);
  const secret = encodeURIComponent(state.auth.secret);
  options.url += `client_id=${key}&client_secret=${secret}`;
}

var requestError$1 = authenticationRequestError$1;

const { RequestError: RequestError$2 } = distWeb$1;

function authenticationRequestError$1(state, error, options) {
  /* istanbul ignore next */
  if (!error.headers) throw error;

  const otpRequired = /required/.test(error.headers["x-github-otp"] || "");
  // handle "2FA required" error only
  if (error.status !== 401 || !otpRequired) {
    throw error;
  }

  if (
    error.status === 401 &&
    otpRequired &&
    error.request &&
    error.request.headers["x-github-otp"]
  ) {
    throw new RequestError$2(
      "Invalid one-time password for two-factor authentication",
      401,
      {
        headers: error.headers,
        request: options
      }
    );
  }

  if (typeof state.auth.on2fa !== "function") {
    throw new RequestError$2(
      "2FA required, but options.on2fa is not a function. See https://github.com/octokit/rest.js#authentication",
      401,
      {
        headers: error.headers,
        request: options
      }
    );
  }

  return Promise.resolve()
    .then(() => {
      return state.auth.on2fa();
    })
    .then(oneTimePassword => {
      const newOptions = Object.assign(options, {
        headers: Object.assign(
          { "x-github-otp": oneTimePassword },
          options.headers
        )
      });
      return state.octokit.request(newOptions);
    });
}

var authenticationDeprecated = authenticationPlugin$1;

const { Deprecation: Deprecation$4 } = distWeb;


const deprecateAuthenticate$1 = once_1((log, deprecation) => log.warn(deprecation));





function authenticationPlugin$1(octokit, options) {
  if (options.auth) {
    octokit.authenticate = () => {
      deprecateAuthenticate$1(
        octokit.log,
        new Deprecation$4(
          '[@octokit/rest] octokit.authenticate() is deprecated and has no effect when "auth" option is set on Octokit constructor'
        )
      );
    };
    return;
  }
  const state = {
    octokit,
    auth: false
  };
  octokit.authenticate = authenticate_1.bind(null, state);
  octokit.hook.before("request", beforeRequest$1.bind(null, state));
  octokit.hook.error("request", requestError$1.bind(null, state));
}

const VERSION$4 = "1.1.2";

/**
 * Some “list” response that can be paginated have a different response structure
 *
 * They have a `total_count` key in the response (search also has `incomplete_results`,
 * /installation/repositories also has `repository_selection`), as well as a key with
 * the list of the items which name varies from endpoint to endpoint:
 *
 * - https://developer.github.com/v3/search/#example (key `items`)
 * - https://developer.github.com/v3/checks/runs/#response-3 (key: `check_runs`)
 * - https://developer.github.com/v3/checks/suites/#response-1 (key: `check_suites`)
 * - https://developer.github.com/v3/apps/installations/#list-repositories (key: `repositories`)
 * - https://developer.github.com/v3/apps/installations/#list-installations-for-a-user (key `installations`)
 *
 * Octokit normalizes these responses so that paginated results are always returned following
 * the same structure. One challenge is that if the list response has only one page, no Link
 * header is provided, so this header alone is not sufficient to check wether a response is
 * paginated or not. For the exceptions with the namespace, a fallback check for the route
 * paths has to be added in order to normalize the response. We cannot check for the total_count
 * property because it also exists in the response of Get the combined status for a specific ref.
 */
const REGEX = [
    /^\/search\//,
    /^\/repos\/[^/]+\/[^/]+\/commits\/[^/]+\/(check-runs|check-suites)([^/]|$)/,
    /^\/installation\/repositories([^/]|$)/,
    /^\/user\/installations([^/]|$)/,
    /^\/repos\/[^/]+\/[^/]+\/actions\/secrets([^/]|$)/,
    /^\/repos\/[^/]+\/[^/]+\/actions\/workflows(\/[^/]+\/runs)?([^/]|$)/,
    /^\/repos\/[^/]+\/[^/]+\/actions\/runs(\/[^/]+\/(artifacts|jobs))?([^/]|$)/
];
function normalizePaginatedListResponse(octokit, url, response) {
    const path = url.replace(octokit.request.endpoint.DEFAULTS.baseUrl, "");
    const responseNeedsNormalization = REGEX.find(regex => regex.test(path));
    if (!responseNeedsNormalization)
        return;
    // keep the additional properties intact as there is currently no other way
    // to retrieve the same information.
    const incompleteResults = response.data.incomplete_results;
    const repositorySelection = response.data.repository_selection;
    const totalCount = response.data.total_count;
    delete response.data.incomplete_results;
    delete response.data.repository_selection;
    delete response.data.total_count;
    const namespaceKey = Object.keys(response.data)[0];
    const data = response.data[namespaceKey];
    response.data = data;
    if (typeof incompleteResults !== "undefined") {
        response.data.incomplete_results = incompleteResults;
    }
    if (typeof repositorySelection !== "undefined") {
        response.data.repository_selection = repositorySelection;
    }
    response.data.total_count = totalCount;
    Object.defineProperty(response.data, namespaceKey, {
        get() {
            octokit.log.warn(`[@octokit/paginate-rest] "response.data.${namespaceKey}" is deprecated for "GET ${path}". Get the results directly from "response.data"`);
            return Array.from(data);
        }
    });
}

function iterator(octokit, route, parameters) {
    const options = octokit.request.endpoint(route, parameters);
    const method = options.method;
    const headers = options.headers;
    let url = options.url;
    return {
        [Symbol.asyncIterator]: () => ({
            next() {
                if (!url) {
                    return Promise.resolve({ done: true });
                }
                return octokit
                    .request({ method, url, headers })
                    .then((response) => {
                    normalizePaginatedListResponse(octokit, url, response);
                    // `response.headers.link` format:
                    // '<https://api.github.com/users/aseemk/followers?page=2>; rel="next", <https://api.github.com/users/aseemk/followers?page=2>; rel="last"'
                    // sets `url` to undefined if "next" URL is not present or `link` header is not set
                    url = ((response.headers.link || "").match(/<([^>]+)>;\s*rel="next"/) || [])[1];
                    return { value: response };
                });
            }
        })
    };
}

function paginate(octokit, route, parameters, mapFn) {
    if (typeof parameters === "function") {
        mapFn = parameters;
        parameters = undefined;
    }
    return gather(octokit, [], iterator(octokit, route, parameters)[Symbol.asyncIterator](), mapFn);
}
function gather(octokit, results, iterator, mapFn) {
    return iterator.next().then(result => {
        if (result.done) {
            return results;
        }
        let earlyExit = false;
        function done() {
            earlyExit = true;
        }
        results = results.concat(mapFn ? mapFn(result.value, done) : result.value.data);
        if (earlyExit) {
            return results;
        }
        return gather(octokit, results, iterator, mapFn);
    });
}

/**
 * @param octokit Octokit instance
 * @param options Options passed to Octokit constructor
 */
function paginateRest(octokit) {
    return {
        paginate: Object.assign(paginate.bind(null, octokit), {
            iterator: iterator.bind(null, octokit)
        })
    };
}
paginateRest.VERSION = VERSION$4;

var distWeb$7 = {
	__proto__: null,
	paginateRest: paginateRest
};

var pagination = paginatePlugin;

const { paginateRest: paginateRest$1 } = distWeb$7;

function paginatePlugin(octokit) {
  Object.assign(octokit, paginateRest$1(octokit));
}

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

/** Used as references for various `Number` constants. */
var INFINITY$1 = 1 / 0;

/** `Object#toString` result references. */
var funcTag$1 = '[object Function]',
    genTag$1 = '[object GeneratorFunction]',
    symbolTag = '[object Symbol]';

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/,
    reLeadingDot = /^\./,
    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar$1 = /[\\^$.*+?()[\]{}|]/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor$1 = /^\[object .+?Constructor\]$/;

/** Detect free variable `global` from Node.js. */
var freeGlobal$1 = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

/** Detect free variable `self`. */
var freeSelf$1 = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root$1 = freeGlobal$1 || freeSelf$1 || Function('return this')();

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue$1(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject$1(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/** Used for built-in method references. */
var arrayProto$1 = Array.prototype,
    funcProto$1 = Function.prototype,
    objectProto$1 = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData$1 = root$1['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey$1 = (function() {
  var uid = /[^.]+$/.exec(coreJsData$1 && coreJsData$1.keys && coreJsData$1.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString$1 = funcProto$1.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto$1.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString$1 = objectProto$1.toString;

/** Used to detect if a method is native. */
var reIsNative$1 = RegExp('^' +
  funcToString$1.call(hasOwnProperty$1).replace(reRegExpChar$1, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Symbol$1 = root$1.Symbol,
    splice$1 = arrayProto$1.splice;

/* Built-in method references that are verified to be native. */
var Map$1 = getNative$1(root$1, 'Map'),
    nativeCreate$1 = getNative$1(Object, 'create');

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol$1 ? Symbol$1.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash$1(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear$1() {
  this.__data__ = nativeCreate$1 ? nativeCreate$1(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete$1(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet$1(key) {
  var data = this.__data__;
  if (nativeCreate$1) {
    var result = data[key];
    return result === HASH_UNDEFINED$1 ? undefined : result;
  }
  return hasOwnProperty$1.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas$1(key) {
  var data = this.__data__;
  return nativeCreate$1 ? data[key] !== undefined : hasOwnProperty$1.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet$1(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate$1 && value === undefined) ? HASH_UNDEFINED$1 : value;
  return this;
}

// Add methods to `Hash`.
Hash$1.prototype.clear = hashClear$1;
Hash$1.prototype['delete'] = hashDelete$1;
Hash$1.prototype.get = hashGet$1;
Hash$1.prototype.has = hashHas$1;
Hash$1.prototype.set = hashSet$1;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache$1(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear$1() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete$1(key) {
  var data = this.__data__,
      index = assocIndexOf$1(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice$1.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet$1(key) {
  var data = this.__data__,
      index = assocIndexOf$1(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas$1(key) {
  return assocIndexOf$1(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet$1(key, value) {
  var data = this.__data__,
      index = assocIndexOf$1(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache$1.prototype.clear = listCacheClear$1;
ListCache$1.prototype['delete'] = listCacheDelete$1;
ListCache$1.prototype.get = listCacheGet$1;
ListCache$1.prototype.has = listCacheHas$1;
ListCache$1.prototype.set = listCacheSet$1;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache$1(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear$1() {
  this.__data__ = {
    'hash': new Hash$1,
    'map': new (Map$1 || ListCache$1),
    'string': new Hash$1
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete$1(key) {
  return getMapData$1(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet$1(key) {
  return getMapData$1(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas$1(key) {
  return getMapData$1(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet$1(key, value) {
  getMapData$1(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache$1.prototype.clear = mapCacheClear$1;
MapCache$1.prototype['delete'] = mapCacheDelete$1;
MapCache$1.prototype.get = mapCacheGet$1;
MapCache$1.prototype.has = mapCacheHas$1;
MapCache$1.prototype.set = mapCacheSet$1;

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf$1(array, key) {
  var length = array.length;
  while (length--) {
    if (eq$1(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = isKey(path, object) ? [path] : castPath(path);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative$1(value) {
  if (!isObject$2(value) || isMasked$1(value)) {
    return false;
  }
  var pattern = (isFunction$1(value) || isHostObject$1(value)) ? reIsNative$1 : reIsHostCtor$1;
  return pattern.test(toSource$1(value));
}

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY$1) ? '-0' : result;
}

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value) {
  return isArray(value) ? value : stringToPath(value);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData$1(map, key) {
  var data = map.__data__;
  return isKeyable$1(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative$1(object, key) {
  var value = getValue$1(object, key);
  return baseIsNative$1(value) ? value : undefined;
}

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable$1(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked$1(func) {
  return !!maskSrcKey$1 && (maskSrcKey$1 in func);
}

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoize(function(string) {
  string = toString(string);

  var result = [];
  if (reLeadingDot.test(string)) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY$1) ? '-0' : result;
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource$1(func) {
  if (func != null) {
    try {
      return funcToString$1.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result);
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache$1);
  return memoized;
}

// Assign cache to `_.memoize`.
memoize.Cache = MapCache$1;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq$1(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction$1(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject$2(value) ? objectToString$1.call(value) : '';
  return tag == funcTag$1 || tag == genTag$1;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject$2(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString$1.call(value) == symbolTag);
}

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

var lodash_get = get;

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT$1 = 'Expected a function';

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$2 = '__lodash_hash_undefined__';

/** Used as references for various `Number` constants. */
var INFINITY$2 = 1 / 0,
    MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var funcTag$2 = '[object Function]',
    genTag$2 = '[object GeneratorFunction]',
    symbolTag$1 = '[object Symbol]';

/** Used to match property names within property paths. */
var reIsDeepProp$1 = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp$1 = /^\w*$/,
    reLeadingDot$1 = /^\./,
    rePropName$1 = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar$2 = /[\\^$.*+?()[\]{}|]/g;

/** Used to match backslashes in property paths. */
var reEscapeChar$1 = /\\(\\)?/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor$2 = /^\[object .+?Constructor\]$/;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Detect free variable `global` from Node.js. */
var freeGlobal$2 = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

/** Detect free variable `self`. */
var freeSelf$2 = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root$2 = freeGlobal$2 || freeSelf$2 || Function('return this')();

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue$2(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject$2(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/** Used for built-in method references. */
var arrayProto$2 = Array.prototype,
    funcProto$2 = Function.prototype,
    objectProto$2 = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData$2 = root$2['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey$2 = (function() {
  var uid = /[^.]+$/.exec(coreJsData$2 && coreJsData$2.keys && coreJsData$2.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString$2 = funcProto$2.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$2 = objectProto$2.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString$2 = objectProto$2.toString;

/** Used to detect if a method is native. */
var reIsNative$2 = RegExp('^' +
  funcToString$2.call(hasOwnProperty$2).replace(reRegExpChar$2, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Symbol$2 = root$2.Symbol,
    splice$2 = arrayProto$2.splice;

/* Built-in method references that are verified to be native. */
var Map$2 = getNative$2(root$2, 'Map'),
    nativeCreate$2 = getNative$2(Object, 'create');

/** Used to convert symbols to primitives and strings. */
var symbolProto$1 = Symbol$2 ? Symbol$2.prototype : undefined,
    symbolToString$1 = symbolProto$1 ? symbolProto$1.toString : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash$2(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear$2() {
  this.__data__ = nativeCreate$2 ? nativeCreate$2(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete$2(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet$2(key) {
  var data = this.__data__;
  if (nativeCreate$2) {
    var result = data[key];
    return result === HASH_UNDEFINED$2 ? undefined : result;
  }
  return hasOwnProperty$2.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas$2(key) {
  var data = this.__data__;
  return nativeCreate$2 ? data[key] !== undefined : hasOwnProperty$2.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet$2(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate$2 && value === undefined) ? HASH_UNDEFINED$2 : value;
  return this;
}

// Add methods to `Hash`.
Hash$2.prototype.clear = hashClear$2;
Hash$2.prototype['delete'] = hashDelete$2;
Hash$2.prototype.get = hashGet$2;
Hash$2.prototype.has = hashHas$2;
Hash$2.prototype.set = hashSet$2;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache$2(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear$2() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete$2(key) {
  var data = this.__data__,
      index = assocIndexOf$2(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice$2.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet$2(key) {
  var data = this.__data__,
      index = assocIndexOf$2(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas$2(key) {
  return assocIndexOf$2(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet$2(key, value) {
  var data = this.__data__,
      index = assocIndexOf$2(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache$2.prototype.clear = listCacheClear$2;
ListCache$2.prototype['delete'] = listCacheDelete$2;
ListCache$2.prototype.get = listCacheGet$2;
ListCache$2.prototype.has = listCacheHas$2;
ListCache$2.prototype.set = listCacheSet$2;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache$2(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear$2() {
  this.__data__ = {
    'hash': new Hash$2,
    'map': new (Map$2 || ListCache$2),
    'string': new Hash$2
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete$2(key) {
  return getMapData$2(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet$2(key) {
  return getMapData$2(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas$2(key) {
  return getMapData$2(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet$2(key, value) {
  getMapData$2(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache$2.prototype.clear = mapCacheClear$2;
MapCache$2.prototype['delete'] = mapCacheDelete$2;
MapCache$2.prototype.get = mapCacheGet$2;
MapCache$2.prototype.has = mapCacheHas$2;
MapCache$2.prototype.set = mapCacheSet$2;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty$2.call(object, key) && eq$2(objValue, value)) ||
      (value === undefined && !(key in object))) {
    object[key] = value;
  }
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf$2(array, key) {
  var length = array.length;
  while (length--) {
    if (eq$2(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative$2(value) {
  if (!isObject$3(value) || isMasked$2(value)) {
    return false;
  }
  var pattern = (isFunction$2(value) || isHostObject$2(value)) ? reIsNative$2 : reIsHostCtor$2;
  return pattern.test(toSource$2(value));
}

/**
 * The base implementation of `_.set`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @param {Function} [customizer] The function to customize path creation.
 * @returns {Object} Returns `object`.
 */
function baseSet(object, path, value, customizer) {
  if (!isObject$3(object)) {
    return object;
  }
  path = isKey$1(path, object) ? [path] : castPath$1(path);

  var index = -1,
      length = path.length,
      lastIndex = length - 1,
      nested = object;

  while (nested != null && ++index < length) {
    var key = toKey$1(path[index]),
        newValue = value;

    if (index != lastIndex) {
      var objValue = nested[key];
      newValue = customizer ? customizer(objValue, key, nested) : undefined;
      if (newValue === undefined) {
        newValue = isObject$3(objValue)
          ? objValue
          : (isIndex(path[index + 1]) ? [] : {});
      }
    }
    assignValue(nested, key, newValue);
    nested = nested[key];
  }
  return object;
}

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString$1(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isSymbol$1(value)) {
    return symbolToString$1 ? symbolToString$1.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY$2) ? '-0' : result;
}

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array} Returns the cast property path array.
 */
function castPath$1(value) {
  return isArray$1(value) ? value : stringToPath$1(value);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData$2(map, key) {
  var data = map.__data__;
  return isKeyable$2(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative$2(object, key) {
  var value = getValue$2(object, key);
  return baseIsNative$2(value) ? value : undefined;
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey$1(value, object) {
  if (isArray$1(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol$1(value)) {
    return true;
  }
  return reIsPlainProp$1.test(value) || !reIsDeepProp$1.test(value) ||
    (object != null && value in Object(object));
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable$2(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked$2(func) {
  return !!maskSrcKey$2 && (maskSrcKey$2 in func);
}

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath$1 = memoize$1(function(string) {
  string = toString$1(string);

  var result = [];
  if (reLeadingDot$1.test(string)) {
    result.push('');
  }
  string.replace(rePropName$1, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar$1, '$1') : (number || match));
  });
  return result;
});

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey$1(value) {
  if (typeof value == 'string' || isSymbol$1(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY$2) ? '-0' : result;
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource$2(func) {
  if (func != null) {
    try {
      return funcToString$2.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize$1(func, resolver) {
  if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT$1);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result);
    return result;
  };
  memoized.cache = new (memoize$1.Cache || MapCache$2);
  return memoized;
}

// Assign cache to `_.memoize`.
memoize$1.Cache = MapCache$2;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq$2(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray$1 = Array.isArray;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction$2(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject$3(value) ? objectToString$2.call(value) : '';
  return tag == funcTag$2 || tag == genTag$2;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject$3(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike$1(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol$1(value) {
  return typeof value == 'symbol' ||
    (isObjectLike$1(value) && objectToString$2.call(value) == symbolTag$1);
}

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString$1(value) {
  return value == null ? '' : baseToString$1(value);
}

/**
 * Sets the value at `path` of `object`. If a portion of `path` doesn't exist,
 * it's created. Arrays are created for missing index properties while objects
 * are created for all other missing properties. Use `_.setWith` to customize
 * `path` creation.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.set(object, 'a[0].b.c', 4);
 * console.log(object.a[0].b.c);
 * // => 4
 *
 * _.set(object, ['x', '0', 'y', 'z'], 5);
 * console.log(object.x[0].y.z);
 * // => 5
 */
function set(object, path, value) {
  return object == null ? object : baseSet(object, path, value);
}

var lodash_set = set;

var validate_1 = validate$1;

const { RequestError: RequestError$3 } = distWeb$1;



function validate$1(octokit, options) {
  if (!options.request.validate) {
    return;
  }
  const { validate: params } = options.request;

  Object.keys(params).forEach(parameterName => {
    const parameter = lodash_get(params, parameterName);

    const expectedType = parameter.type;
    let parentParameterName;
    let parentValue;
    let parentParamIsPresent = true;
    let parentParameterIsArray = false;

    if (/\./.test(parameterName)) {
      parentParameterName = parameterName.replace(/\.[^.]+$/, "");
      parentParameterIsArray = parentParameterName.slice(-2) === "[]";
      if (parentParameterIsArray) {
        parentParameterName = parentParameterName.slice(0, -2);
      }
      parentValue = lodash_get(options, parentParameterName);
      parentParamIsPresent =
        parentParameterName === "headers" ||
        (typeof parentValue === "object" && parentValue !== null);
    }

    const values = parentParameterIsArray
      ? (lodash_get(options, parentParameterName) || []).map(
          value => value[parameterName.split(/\./).pop()]
        )
      : [lodash_get(options, parameterName)];

    values.forEach((value, i) => {
      const valueIsPresent = typeof value !== "undefined";
      const valueIsNull = value === null;
      const currentParameterName = parentParameterIsArray
        ? parameterName.replace(/\[\]/, `[${i}]`)
        : parameterName;

      if (!parameter.required && !valueIsPresent) {
        return;
      }

      // if the parent parameter is of type object but allows null
      // then the child parameters can be ignored
      if (!parentParamIsPresent) {
        return;
      }

      if (parameter.allowNull && valueIsNull) {
        return;
      }

      if (!parameter.allowNull && valueIsNull) {
        throw new RequestError$3(
          `'${currentParameterName}' cannot be null`,
          400,
          {
            request: options
          }
        );
      }

      if (parameter.required && !valueIsPresent) {
        throw new RequestError$3(
          `Empty value for parameter '${currentParameterName}': ${JSON.stringify(
            value
          )}`,
          400,
          {
            request: options
          }
        );
      }

      // parse to integer before checking for enum
      // so that string "1" will match enum with number 1
      if (expectedType === "integer") {
        const unparsedValue = value;
        value = parseInt(value, 10);
        if (isNaN(value)) {
          throw new RequestError$3(
            `Invalid value for parameter '${currentParameterName}': ${JSON.stringify(
              unparsedValue
            )} is NaN`,
            400,
            {
              request: options
            }
          );
        }
      }

      if (parameter.enum && parameter.enum.indexOf(String(value)) === -1) {
        throw new RequestError$3(
          `Invalid value for parameter '${currentParameterName}': ${JSON.stringify(
            value
          )}`,
          400,
          {
            request: options
          }
        );
      }

      if (parameter.validation) {
        const regex = new RegExp(parameter.validation);
        if (!regex.test(value)) {
          throw new RequestError$3(
            `Invalid value for parameter '${currentParameterName}': ${JSON.stringify(
              value
            )}`,
            400,
            {
              request: options
            }
          );
        }
      }

      if (expectedType === "object" && typeof value === "string") {
        try {
          value = JSON.parse(value);
        } catch (exception) {
          throw new RequestError$3(
            `JSON parse error of value for parameter '${currentParameterName}': ${JSON.stringify(
              value
            )}`,
            400,
            {
              request: options
            }
          );
        }
      }

      lodash_set(options, parameter.mapTo || currentParameterName, value);
    });
  });

  return options;
}

var validate_1$1 = octokitValidate;



function octokitValidate(octokit) {
  octokit.hook.before("request", validate_1.bind(null, octokit));
}

var deprecate_1 = deprecate;

const loggedMessages = {};

function deprecate (message) {
  if (loggedMessages[message]) {
    return
  }

  console.warn(`DEPRECATED (@octokit/rest): ${message}`);
  loggedMessages[message] = 1;
}

var getPageLinks_1 = getPageLinks;

function getPageLinks (link) {
  link = link.link || link.headers.link || '';

  const links = {};

  // link format:
  // '<https://api.github.com/users/aseemk/followers?page=2>; rel="next", <https://api.github.com/users/aseemk/followers?page=2>; rel="last"'
  link.replace(/<([^>]*)>;\s*rel="([\w]*)"/g, (m, uri, type) => {
    links[type] = uri;
  });

  return links
}

var httpError = class HttpError extends Error {
  constructor (message, code, headers) {
    super(message);

    // Maintains proper stack trace (only available on V8)
    /* istanbul ignore next */
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = 'HttpError';
    this.code = code;
    this.headers = headers;
  }
};

var getPage_1 = getPage;





function getPage (octokit, link, which, headers) {
  deprecate_1(`octokit.get${which.charAt(0).toUpperCase() + which.slice(1)}Page() – You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`);
  const url = getPageLinks_1(link)[which];

  if (!url) {
    const urlError = new httpError(`No ${which} page found`, 404);
    return Promise.reject(urlError)
  }

  const requestOptions = {
    url,
    headers: applyAcceptHeader(link, headers)
  };

  const promise = octokit.request(requestOptions);

  return promise
}

function applyAcceptHeader (res, headers) {
  const previous = res.headers && res.headers['x-github-media-type'];

  if (!previous || (headers && headers.accept)) {
    return headers
  }
  headers = headers || {};
  headers.accept = 'application/vnd.' + previous
    .replace('; param=', '.')
    .replace('; format=', '+');

  return headers
}

var getFirstPage_1 = getFirstPage;



function getFirstPage (octokit, link, headers) {
  return getPage_1(octokit, link, 'first', headers)
}

var getLastPage_1 = getLastPage;



function getLastPage (octokit, link, headers) {
  return getPage_1(octokit, link, 'last', headers)
}

var getNextPage_1 = getNextPage;



function getNextPage (octokit, link, headers) {
  return getPage_1(octokit, link, 'next', headers)
}

var getPreviousPage_1 = getPreviousPage;



function getPreviousPage (octokit, link, headers) {
  return getPage_1(octokit, link, 'prev', headers)
}

var hasFirstPage_1 = hasFirstPage;




function hasFirstPage (link) {
  deprecate_1(`octokit.hasFirstPage() – You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`);
  return getPageLinks_1(link).first
}

var hasLastPage_1 = hasLastPage;




function hasLastPage (link) {
  deprecate_1(`octokit.hasLastPage() – You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`);
  return getPageLinks_1(link).last
}

var hasNextPage_1 = hasNextPage;




function hasNextPage (link) {
  deprecate_1(`octokit.hasNextPage() – You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`);
  return getPageLinks_1(link).next
}

var hasPreviousPage_1 = hasPreviousPage;




function hasPreviousPage (link) {
  deprecate_1(`octokit.hasPreviousPage() – You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`);
  return getPageLinks_1(link).prev
}

var octokitPaginationMethods = paginationMethodsPlugin;

function paginationMethodsPlugin (octokit) {
  octokit.getFirstPage = getFirstPage_1.bind(null, octokit);
  octokit.getLastPage = getLastPage_1.bind(null, octokit);
  octokit.getNextPage = getNextPage_1.bind(null, octokit);
  octokit.getPreviousPage = getPreviousPage_1.bind(null, octokit);
  octokit.hasFirstPage = hasFirstPage_1;
  octokit.hasLastPage = hasLastPage_1;
  octokit.hasNextPage = hasNextPage_1;
  octokit.hasPreviousPage = hasPreviousPage_1;
}

const { requestLog: requestLog$1 } = distWeb$4;
const {
  restEndpointMethods: restEndpointMethods$1
} = distWeb$5;



const CORE_PLUGINS = [
  authentication,
  authenticationDeprecated, // deprecated: remove in v17
  requestLog$1,
  pagination,
  restEndpointMethods$1,
  validate_1$1,

  octokitPaginationMethods // deprecated: remove in v17
];

const OctokitRest = core$1.plugin(CORE_PLUGINS);

function DeprecatedOctokit(options) {
  const warn =
    options && options.log && options.log.warn
      ? options.log.warn
      : console.warn;
  warn(
    '[@octokit/rest] `const Octokit = require("@octokit/rest")` is deprecated. Use `const { Octokit } = require("@octokit/rest")` instead'
  );
  return new OctokitRest(options);
}

const Octokit$1 = Object.assign(DeprecatedOctokit, {
  Octokit: OctokitRest
});

Object.keys(OctokitRest).forEach(key => {
  /* istanbul ignore else */
  if (OctokitRest.hasOwnProperty(key)) {
    Octokit$1[key] = OctokitRest[key];
  }
});

var rest = Octokit$1;

var context = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });


class Context {
    /**
     * Hydrate the context from the environment
     */
    constructor() {
        this.payload = {};
        if (process.env.GITHUB_EVENT_PATH) {
            if (fs.existsSync(process.env.GITHUB_EVENT_PATH)) {
                this.payload = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, { encoding: 'utf8' }));
            }
            else {
                const path = process.env.GITHUB_EVENT_PATH;
                process.stdout.write(`GITHUB_EVENT_PATH ${path} does not exist${os.EOL}`);
            }
        }
        this.eventName = process.env.GITHUB_EVENT_NAME;
        this.sha = process.env.GITHUB_SHA;
        this.ref = process.env.GITHUB_REF;
        this.workflow = process.env.GITHUB_WORKFLOW;
        this.action = process.env.GITHUB_ACTION;
        this.actor = process.env.GITHUB_ACTOR;
    }
    get issue() {
        const payload = this.payload;
        return Object.assign(Object.assign({}, this.repo), { number: (payload.issue || payload.pull_request || payload).number });
    }
    get repo() {
        if (process.env.GITHUB_REPOSITORY) {
            const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
            return { owner, repo };
        }
        if (this.payload.repository) {
            return {
                owner: this.payload.repository.owner.login,
                repo: this.payload.repository.name
            };
        }
        throw new Error("context.repo requires a GITHUB_REPOSITORY environment variable like 'owner/repo'");
    }
}
exports.Context = Context;

});

unwrapExports(context);

var proxy = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

function getProxyUrl(reqUrl) {
    let usingSsl = reqUrl.protocol === 'https:';
    let proxyUrl;
    if (checkBypass(reqUrl)) {
        return proxyUrl;
    }
    let proxyVar;
    if (usingSsl) {
        proxyVar = process.env["https_proxy"] ||
            process.env["HTTPS_PROXY"];
    }
    else {
        proxyVar = process.env["http_proxy"] ||
            process.env["HTTP_PROXY"];
    }
    if (proxyVar) {
        proxyUrl = Url.parse(proxyVar);
    }
    return proxyUrl;
}
exports.getProxyUrl = getProxyUrl;
function checkBypass(reqUrl) {
    if (!reqUrl.hostname) {
        return false;
    }
    let noProxy = process.env["no_proxy"] || process.env["NO_PROXY"] || '';
    if (!noProxy) {
        return false;
    }
    // Determine the request port
    let reqPort;
    if (reqUrl.port) {
        reqPort = Number(reqUrl.port);
    }
    else if (reqUrl.protocol === 'http:') {
        reqPort = 80;
    }
    else if (reqUrl.protocol === 'https:') {
        reqPort = 443;
    }
    // Format the request hostname and hostname with port
    let upperReqHosts = [reqUrl.hostname.toUpperCase()];
    if (typeof reqPort === 'number') {
        upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
    }
    // Compare request host against noproxy
    for (let upperNoProxyItem of noProxy.split(',').map(x => x.trim().toUpperCase()).filter(x => x)) {
        if (upperReqHosts.some(x => x === upperNoProxyItem)) {
            return true;
        }
    }
    return false;
}
exports.checkBypass = checkBypass;
});

unwrapExports(proxy);

var httpOverHttp_1 = httpOverHttp;
var httpsOverHttp_1 = httpsOverHttp;
var httpOverHttps_1 = httpOverHttps;
var httpsOverHttps_1 = httpsOverHttps;


function httpOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  return agent;
}

function httpsOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}

function httpOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  return agent;
}

function httpsOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}


function TunnelingAgent(options) {
  var self = this;
  self.options = options || {};
  self.proxyOptions = self.options.proxy || {};
  self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets;
  self.requests = [];
  self.sockets = [];

  self.on('free', function onFree(socket, host, port, localAddress) {
    var options = toOptions(host, port, localAddress);
    for (var i = 0, len = self.requests.length; i < len; ++i) {
      var pending = self.requests[i];
      if (pending.host === options.host && pending.port === options.port) {
        // Detect the request to connect same origin server,
        // reuse the connection.
        self.requests.splice(i, 1);
        pending.request.onSocket(socket);
        return;
      }
    }
    socket.destroy();
    self.removeSocket(socket);
  });
}
util.inherits(TunnelingAgent, events.EventEmitter);

TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
  var self = this;
  var options = mergeOptions({request: req}, self.options, toOptions(host, port, localAddress));

  if (self.sockets.length >= this.maxSockets) {
    // We are over limit so we'll add it to the queue.
    self.requests.push(options);
    return;
  }

  // If we are under maxSockets create a new one.
  self.createSocket(options, function(socket) {
    socket.on('free', onFree);
    socket.on('close', onCloseOrRemove);
    socket.on('agentRemove', onCloseOrRemove);
    req.onSocket(socket);

    function onFree() {
      self.emit('free', socket, options);
    }

    function onCloseOrRemove(err) {
      self.removeSocket(socket);
      socket.removeListener('free', onFree);
      socket.removeListener('close', onCloseOrRemove);
      socket.removeListener('agentRemove', onCloseOrRemove);
    }
  });
};

TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
  var self = this;
  var placeholder = {};
  self.sockets.push(placeholder);

  var connectOptions = mergeOptions({}, self.proxyOptions, {
    method: 'CONNECT',
    path: options.host + ':' + options.port,
    agent: false,
    headers: {
      host: options.host + ':' + options.port
    }
  });
  if (options.localAddress) {
    connectOptions.localAddress = options.localAddress;
  }
  if (connectOptions.proxyAuth) {
    connectOptions.headers = connectOptions.headers || {};
    connectOptions.headers['Proxy-Authorization'] = 'Basic ' +
        new Buffer(connectOptions.proxyAuth).toString('base64');
  }

  debug('making CONNECT request');
  var connectReq = self.request(connectOptions);
  connectReq.useChunkedEncodingByDefault = false; // for v0.6
  connectReq.once('response', onResponse); // for v0.6
  connectReq.once('upgrade', onUpgrade);   // for v0.6
  connectReq.once('connect', onConnect);   // for v0.7 or later
  connectReq.once('error', onError);
  connectReq.end();

  function onResponse(res) {
    // Very hacky. This is necessary to avoid http-parser leaks.
    res.upgrade = true;
  }

  function onUpgrade(res, socket, head) {
    // Hacky.
    process.nextTick(function() {
      onConnect(res, socket, head);
    });
  }

  function onConnect(res, socket, head) {
    connectReq.removeAllListeners();
    socket.removeAllListeners();

    if (res.statusCode !== 200) {
      debug('tunneling socket could not be established, statusCode=%d',
        res.statusCode);
      socket.destroy();
      var error = new Error('tunneling socket could not be established, ' +
        'statusCode=' + res.statusCode);
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    if (head.length > 0) {
      debug('got illegal response body from proxy');
      socket.destroy();
      var error = new Error('got illegal response body from proxy');
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    debug('tunneling connection has established');
    self.sockets[self.sockets.indexOf(placeholder)] = socket;
    return cb(socket);
  }

  function onError(cause) {
    connectReq.removeAllListeners();

    debug('tunneling socket could not be established, cause=%s\n',
          cause.message, cause.stack);
    var error = new Error('tunneling socket could not be established, ' +
                          'cause=' + cause.message);
    error.code = 'ECONNRESET';
    options.request.emit('error', error);
    self.removeSocket(placeholder);
  }
};

TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
  var pos = this.sockets.indexOf(socket);
  if (pos === -1) {
    return;
  }
  this.sockets.splice(pos, 1);

  var pending = this.requests.shift();
  if (pending) {
    // If we have pending requests and a socket gets closed a new one
    // needs to be created to take over in the pool for the one that closed.
    this.createSocket(pending, function(socket) {
      pending.request.onSocket(socket);
    });
  }
};

function createSecureSocket(options, cb) {
  var self = this;
  TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
    var hostHeader = options.request.getHeader('host');
    var tlsOptions = mergeOptions({}, self.options, {
      socket: socket,
      servername: hostHeader ? hostHeader.replace(/:.*$/, '') : options.host
    });

    // 0 is dummy port for v0.6
    var secureSocket = tls.connect(0, tlsOptions);
    self.sockets[self.sockets.indexOf(socket)] = secureSocket;
    cb(secureSocket);
  });
}


function toOptions(host, port, localAddress) {
  if (typeof host === 'string') { // since v0.10
    return {
      host: host,
      port: port,
      localAddress: localAddress
    };
  }
  return host; // for v0.11 or later
}

function mergeOptions(target) {
  for (var i = 1, len = arguments.length; i < len; ++i) {
    var overrides = arguments[i];
    if (typeof overrides === 'object') {
      var keys = Object.keys(overrides);
      for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
        var k = keys[j];
        if (overrides[k] !== undefined) {
          target[k] = overrides[k];
        }
      }
    }
  }
  return target;
}


var debug;
if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
  debug = function() {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = 'TUNNEL: ' + args[0];
    } else {
      args.unshift('TUNNEL:');
    }
    console.error.apply(console, args);
  };
} else {
  debug = function() {};
}
var debug_1 = debug; // for test

var tunnel = {
	httpOverHttp: httpOverHttp_1,
	httpsOverHttp: httpsOverHttp_1,
	httpOverHttps: httpOverHttps_1,
	httpsOverHttps: httpsOverHttps_1,
	debug: debug_1
};

var tunnel$1 = tunnel;

var httpClient = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });




let tunnel;
var HttpCodes;
(function (HttpCodes) {
    HttpCodes[HttpCodes["OK"] = 200] = "OK";
    HttpCodes[HttpCodes["MultipleChoices"] = 300] = "MultipleChoices";
    HttpCodes[HttpCodes["MovedPermanently"] = 301] = "MovedPermanently";
    HttpCodes[HttpCodes["ResourceMoved"] = 302] = "ResourceMoved";
    HttpCodes[HttpCodes["SeeOther"] = 303] = "SeeOther";
    HttpCodes[HttpCodes["NotModified"] = 304] = "NotModified";
    HttpCodes[HttpCodes["UseProxy"] = 305] = "UseProxy";
    HttpCodes[HttpCodes["SwitchProxy"] = 306] = "SwitchProxy";
    HttpCodes[HttpCodes["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HttpCodes[HttpCodes["PermanentRedirect"] = 308] = "PermanentRedirect";
    HttpCodes[HttpCodes["BadRequest"] = 400] = "BadRequest";
    HttpCodes[HttpCodes["Unauthorized"] = 401] = "Unauthorized";
    HttpCodes[HttpCodes["PaymentRequired"] = 402] = "PaymentRequired";
    HttpCodes[HttpCodes["Forbidden"] = 403] = "Forbidden";
    HttpCodes[HttpCodes["NotFound"] = 404] = "NotFound";
    HttpCodes[HttpCodes["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpCodes[HttpCodes["NotAcceptable"] = 406] = "NotAcceptable";
    HttpCodes[HttpCodes["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HttpCodes[HttpCodes["RequestTimeout"] = 408] = "RequestTimeout";
    HttpCodes[HttpCodes["Conflict"] = 409] = "Conflict";
    HttpCodes[HttpCodes["Gone"] = 410] = "Gone";
    HttpCodes[HttpCodes["InternalServerError"] = 500] = "InternalServerError";
    HttpCodes[HttpCodes["NotImplemented"] = 501] = "NotImplemented";
    HttpCodes[HttpCodes["BadGateway"] = 502] = "BadGateway";
    HttpCodes[HttpCodes["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpCodes[HttpCodes["GatewayTimeout"] = 504] = "GatewayTimeout";
})(HttpCodes = exports.HttpCodes || (exports.HttpCodes = {}));
var Headers;
(function (Headers) {
    Headers["Accept"] = "accept";
    Headers["ContentType"] = "content-type";
})(Headers = exports.Headers || (exports.Headers = {}));
var MediaTypes;
(function (MediaTypes) {
    MediaTypes["ApplicationJson"] = "application/json";
})(MediaTypes = exports.MediaTypes || (exports.MediaTypes = {}));
/**
 * Returns the proxy URL, depending upon the supplied url and proxy environment variables.
 * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
 */
function getProxyUrl(serverUrl) {
    let proxyUrl = proxy.getProxyUrl(Url.parse(serverUrl));
    return proxyUrl ? proxyUrl.href : '';
}
exports.getProxyUrl = getProxyUrl;
const HttpRedirectCodes = [HttpCodes.MovedPermanently, HttpCodes.ResourceMoved, HttpCodes.SeeOther, HttpCodes.TemporaryRedirect, HttpCodes.PermanentRedirect];
const HttpResponseRetryCodes = [HttpCodes.BadGateway, HttpCodes.ServiceUnavailable, HttpCodes.GatewayTimeout];
const RetryableHttpVerbs = ['OPTIONS', 'GET', 'DELETE', 'HEAD'];
const ExponentialBackoffCeiling = 10;
const ExponentialBackoffTimeSlice = 5;
class HttpClientResponse {
    constructor(message) {
        this.message = message;
    }
    readBody() {
        return new Promise(async (resolve, reject) => {
            let output = Buffer.alloc(0);
            this.message.on('data', (chunk) => {
                output = Buffer.concat([output, chunk]);
            });
            this.message.on('end', () => {
                resolve(output.toString());
            });
        });
    }
}
exports.HttpClientResponse = HttpClientResponse;
function isHttps(requestUrl) {
    let parsedUrl = Url.parse(requestUrl);
    return parsedUrl.protocol === 'https:';
}
exports.isHttps = isHttps;
class HttpClient {
    constructor(userAgent, handlers, requestOptions) {
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._allowRedirectDowngrade = false;
        this._maxRedirects = 50;
        this._allowRetries = false;
        this._maxRetries = 1;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
            if (requestOptions.ignoreSslError != null) {
                this._ignoreSslError = requestOptions.ignoreSslError;
            }
            this._socketTimeout = requestOptions.socketTimeout;
            if (requestOptions.allowRedirects != null) {
                this._allowRedirects = requestOptions.allowRedirects;
            }
            if (requestOptions.allowRedirectDowngrade != null) {
                this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
            }
            if (requestOptions.maxRedirects != null) {
                this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
            }
            if (requestOptions.keepAlive != null) {
                this._keepAlive = requestOptions.keepAlive;
            }
            if (requestOptions.allowRetries != null) {
                this._allowRetries = requestOptions.allowRetries;
            }
            if (requestOptions.maxRetries != null) {
                this._maxRetries = requestOptions.maxRetries;
            }
        }
    }
    options(requestUrl, additionalHeaders) {
        return this.request('OPTIONS', requestUrl, null, additionalHeaders || {});
    }
    get(requestUrl, additionalHeaders) {
        return this.request('GET', requestUrl, null, additionalHeaders || {});
    }
    del(requestUrl, additionalHeaders) {
        return this.request('DELETE', requestUrl, null, additionalHeaders || {});
    }
    post(requestUrl, data, additionalHeaders) {
        return this.request('POST', requestUrl, data, additionalHeaders || {});
    }
    patch(requestUrl, data, additionalHeaders) {
        return this.request('PATCH', requestUrl, data, additionalHeaders || {});
    }
    put(requestUrl, data, additionalHeaders) {
        return this.request('PUT', requestUrl, data, additionalHeaders || {});
    }
    head(requestUrl, additionalHeaders) {
        return this.request('HEAD', requestUrl, null, additionalHeaders || {});
    }
    sendStream(verb, requestUrl, stream, additionalHeaders) {
        return this.request(verb, requestUrl, stream, additionalHeaders);
    }
    /**
     * Gets a typed object from an endpoint
     * Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
     */
    async getJson(requestUrl, additionalHeaders = {}) {
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        let res = await this.get(requestUrl, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async postJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.post(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async putJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.put(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async patchJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.patch(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    /**
     * Makes a raw http request.
     * All other methods such as get, post, patch, and request ultimately call this.
     * Prefer get, del, post and patch
     */
    async request(verb, requestUrl, data, headers) {
        if (this._disposed) {
            throw new Error("Client has already been disposed.");
        }
        let parsedUrl = Url.parse(requestUrl);
        let info = this._prepareRequest(verb, parsedUrl, headers);
        // Only perform retries on reads since writes may not be idempotent.
        let maxTries = (this._allowRetries && RetryableHttpVerbs.indexOf(verb) != -1) ? this._maxRetries + 1 : 1;
        let numTries = 0;
        let response;
        while (numTries < maxTries) {
            response = await this.requestRaw(info, data);
            // Check if it's an authentication challenge
            if (response && response.message && response.message.statusCode === HttpCodes.Unauthorized) {
                let authenticationHandler;
                for (let i = 0; i < this.handlers.length; i++) {
                    if (this.handlers[i].canHandleAuthentication(response)) {
                        authenticationHandler = this.handlers[i];
                        break;
                    }
                }
                if (authenticationHandler) {
                    return authenticationHandler.handleAuthentication(this, info, data);
                }
                else {
                    // We have received an unauthorized response but have no handlers to handle it.
                    // Let the response return to the caller.
                    return response;
                }
            }
            let redirectsRemaining = this._maxRedirects;
            while (HttpRedirectCodes.indexOf(response.message.statusCode) != -1
                && this._allowRedirects
                && redirectsRemaining > 0) {
                const redirectUrl = response.message.headers["location"];
                if (!redirectUrl) {
                    // if there's no location to redirect to, we won't
                    break;
                }
                let parsedRedirectUrl = Url.parse(redirectUrl);
                if (parsedUrl.protocol == 'https:' && parsedUrl.protocol != parsedRedirectUrl.protocol && !this._allowRedirectDowngrade) {
                    throw new Error("Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.");
                }
                // we need to finish reading the response before reassigning response
                // which will leak the open socket.
                await response.readBody();
                // let's make the request with the new redirectUrl
                info = this._prepareRequest(verb, parsedRedirectUrl, headers);
                response = await this.requestRaw(info, data);
                redirectsRemaining--;
            }
            if (HttpResponseRetryCodes.indexOf(response.message.statusCode) == -1) {
                // If not a retry code, return immediately instead of retrying
                return response;
            }
            numTries += 1;
            if (numTries < maxTries) {
                await response.readBody();
                await this._performExponentialBackoff(numTries);
            }
        }
        return response;
    }
    /**
     * Needs to be called if keepAlive is set to true in request options.
     */
    dispose() {
        if (this._agent) {
            this._agent.destroy();
        }
        this._disposed = true;
    }
    /**
     * Raw request.
     * @param info
     * @param data
     */
    requestRaw(info, data) {
        return new Promise((resolve, reject) => {
            let callbackForResult = function (err, res) {
                if (err) {
                    reject(err);
                }
                resolve(res);
            };
            this.requestRawWithCallback(info, data, callbackForResult);
        });
    }
    /**
     * Raw request with callback.
     * @param info
     * @param data
     * @param onResult
     */
    requestRawWithCallback(info, data, onResult) {
        let socket;
        if (typeof (data) === 'string') {
            info.options.headers["Content-Length"] = Buffer.byteLength(data, 'utf8');
        }
        let callbackCalled = false;
        let handleResult = (err, res) => {
            if (!callbackCalled) {
                callbackCalled = true;
                onResult(err, res);
            }
        };
        let req = info.httpModule.request(info.options, (msg) => {
            let res = new HttpClientResponse(msg);
            handleResult(null, res);
        });
        req.on('socket', (sock) => {
            socket = sock;
        });
        // If we ever get disconnected, we want the socket to timeout eventually
        req.setTimeout(this._socketTimeout || 3 * 60000, () => {
            if (socket) {
                socket.end();
            }
            handleResult(new Error('Request timeout: ' + info.options.path), null);
        });
        req.on('error', function (err) {
            // err has statusCode property
            // res should have headers
            handleResult(err, null);
        });
        if (data && typeof (data) === 'string') {
            req.write(data, 'utf8');
        }
        if (data && typeof (data) !== 'string') {
            data.on('close', function () {
                req.end();
            });
            data.pipe(req);
        }
        else {
            req.end();
        }
    }
    /**
     * Gets an http agent. This function is useful when you need an http agent that handles
     * routing through a proxy server - depending upon the url and proxy environment variables.
     * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
     */
    getAgent(serverUrl) {
        let parsedUrl = Url.parse(serverUrl);
        return this._getAgent(parsedUrl);
    }
    _prepareRequest(method, requestUrl, headers) {
        const info = {};
        info.parsedUrl = requestUrl;
        const usingSsl = info.parsedUrl.protocol === 'https:';
        info.httpModule = usingSsl ? https : http;
        const defaultPort = usingSsl ? 443 : 80;
        info.options = {};
        info.options.host = info.parsedUrl.hostname;
        info.options.port = info.parsedUrl.port ? parseInt(info.parsedUrl.port) : defaultPort;
        info.options.path = (info.parsedUrl.pathname || '') + (info.parsedUrl.search || '');
        info.options.method = method;
        info.options.headers = this._mergeHeaders(headers);
        if (this.userAgent != null) {
            info.options.headers["user-agent"] = this.userAgent;
        }
        info.options.agent = this._getAgent(info.parsedUrl);
        // gives handlers an opportunity to participate
        if (this.handlers) {
            this.handlers.forEach((handler) => {
                handler.prepareRequest(info.options);
            });
        }
        return info;
    }
    _mergeHeaders(headers) {
        const lowercaseKeys = obj => Object.keys(obj).reduce((c, k) => (c[k.toLowerCase()] = obj[k], c), {});
        if (this.requestOptions && this.requestOptions.headers) {
            return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers));
        }
        return lowercaseKeys(headers || {});
    }
    _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
        const lowercaseKeys = obj => Object.keys(obj).reduce((c, k) => (c[k.toLowerCase()] = obj[k], c), {});
        let clientHeader;
        if (this.requestOptions && this.requestOptions.headers) {
            clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
        }
        return additionalHeaders[header] || clientHeader || _default;
    }
    _getAgent(parsedUrl) {
        let agent;
        let proxyUrl = proxy.getProxyUrl(parsedUrl);
        let useProxy = proxyUrl && proxyUrl.hostname;
        if (this._keepAlive && useProxy) {
            agent = this._proxyAgent;
        }
        if (this._keepAlive && !useProxy) {
            agent = this._agent;
        }
        // if agent is already assigned use that agent.
        if (!!agent) {
            return agent;
        }
        const usingSsl = parsedUrl.protocol === 'https:';
        let maxSockets = 100;
        if (!!this.requestOptions) {
            maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
        }
        if (useProxy) {
            // If using proxy, need tunnel
            if (!tunnel) {
                tunnel = tunnel$1;
            }
            const agentOptions = {
                maxSockets: maxSockets,
                keepAlive: this._keepAlive,
                proxy: {
                    proxyAuth: proxyUrl.auth,
                    host: proxyUrl.hostname,
                    port: proxyUrl.port
                },
            };
            let tunnelAgent;
            const overHttps = proxyUrl.protocol === 'https:';
            if (usingSsl) {
                tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
            }
            else {
                tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
            }
            agent = tunnelAgent(agentOptions);
            this._proxyAgent = agent;
        }
        // if reusing agent across request and tunneling agent isn't assigned create a new agent
        if (this._keepAlive && !agent) {
            const options = { keepAlive: this._keepAlive, maxSockets: maxSockets };
            agent = usingSsl ? new https.Agent(options) : new http.Agent(options);
            this._agent = agent;
        }
        // if not using private agent and tunnel agent isn't setup then use global agent
        if (!agent) {
            agent = usingSsl ? https.globalAgent : http.globalAgent;
        }
        if (usingSsl && this._ignoreSslError) {
            // we don't want to set NODE_TLS_REJECT_UNAUTHORIZED=0 since that will affect request for entire process
            // http.RequestOptions doesn't expose a way to modify RequestOptions.agent.options
            // we have to cast it to any and change it directly
            agent.options = Object.assign(agent.options || {}, { rejectUnauthorized: false });
        }
        return agent;
    }
    _performExponentialBackoff(retryNumber) {
        retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
        const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
        return new Promise(resolve => setTimeout(() => resolve(), ms));
    }
    static dateTimeDeserializer(key, value) {
        if (typeof value === 'string') {
            let a = new Date(value);
            if (!isNaN(a.valueOf())) {
                return a;
            }
        }
        return value;
    }
    async _processResponse(res, options) {
        return new Promise(async (resolve, reject) => {
            const statusCode = res.message.statusCode;
            const response = {
                statusCode: statusCode,
                result: null,
                headers: {}
            };
            // not found leads to null obj returned
            if (statusCode == HttpCodes.NotFound) {
                resolve(response);
            }
            let obj;
            let contents;
            // get the result from the body
            try {
                contents = await res.readBody();
                if (contents && contents.length > 0) {
                    if (options && options.deserializeDates) {
                        obj = JSON.parse(contents, HttpClient.dateTimeDeserializer);
                    }
                    else {
                        obj = JSON.parse(contents);
                    }
                    response.result = obj;
                }
                response.headers = res.message.headers;
            }
            catch (err) {
                // Invalid resource (contents not json);  leaving result obj null
            }
            // note that 3xx redirects are handled by the http layer.
            if (statusCode > 299) {
                let msg;
                // if exception/error in body, attempt to get better error
                if (obj && obj.message) {
                    msg = obj.message;
                }
                else if (contents && contents.length > 0) {
                    // it may be the case that the exception is in the body message as string
                    msg = contents;
                }
                else {
                    msg = "Failed request: (" + statusCode + ")";
                }
                let err = new Error(msg);
                // attach statusCode and body obj (if available) to the error object
                err['statusCode'] = statusCode;
                if (response.result) {
                    err['result'] = response.result;
                }
                reject(err);
            }
            else {
                resolve(response);
            }
        });
    }
}
exports.HttpClient = HttpClient;
});

unwrapExports(httpClient);

var github = createCommonjsModule(function (module, exports) {
var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// Originally pulled from https://github.com/JasonEtco/actions-toolkit/blob/master/src/github.ts


const Context = __importStar(context);
const httpClient$1 = __importStar(httpClient);
// We need this in order to extend Octokit
rest.Octokit.prototype = new rest.Octokit();
exports.context = new Context.Context();
class GitHub extends rest.Octokit {
    constructor(token, opts) {
        super(GitHub.getOctokitOptions(GitHub.disambiguate(token, opts)));
        this.graphql = GitHub.getGraphQL(GitHub.disambiguate(token, opts));
    }
    /**
     * Disambiguates the constructor overload parameters
     */
    static disambiguate(token, opts) {
        return [
            typeof token === 'string' ? token : '',
            typeof token === 'object' ? token : opts || {}
        ];
    }
    static getOctokitOptions(args) {
        const token = args[0];
        const options = Object.assign({}, args[1]); // Shallow clone - don't mutate the object provided by the caller
        // Auth
        const auth = GitHub.getAuthString(token, options);
        if (auth) {
            options.auth = auth;
        }
        // Proxy
        const agent = GitHub.getProxyAgent(options);
        if (agent) {
            // Shallow clone - don't mutate the object provided by the caller
            options.request = options.request ? Object.assign({}, options.request) : {};
            // Set the agent
            options.request.agent = agent;
        }
        return options;
    }
    static getGraphQL(args) {
        const defaults = {};
        const token = args[0];
        const options = args[1];
        // Authorization
        const auth = this.getAuthString(token, options);
        if (auth) {
            defaults.headers = {
                authorization: auth
            };
        }
        // Proxy
        const agent = GitHub.getProxyAgent(options);
        if (agent) {
            defaults.request = { agent };
        }
        return distNode.graphql.defaults(defaults);
    }
    static getAuthString(token, options) {
        // Validate args
        if (!token && !options.auth) {
            throw new Error('Parameter token or opts.auth is required');
        }
        else if (token && options.auth) {
            throw new Error('Parameters token and opts.auth may not both be specified');
        }
        return typeof options.auth === 'string' ? options.auth : `token ${token}`;
    }
    static getProxyAgent(options) {
        var _a;
        if (!((_a = options.request) === null || _a === void 0 ? void 0 : _a.agent)) {
            const serverUrl = 'https://api.github.com';
            if (httpClient$1.getProxyUrl(serverUrl)) {
                const hc = new httpClient$1.HttpClient();
                return hc.getAgent(serverUrl);
            }
        }
        return undefined;
    }
}
exports.GitHub = GitHub;

});

unwrapExports(github);
var github_1 = github.context;
var github_2 = github.GitHub;

const run = function (github, context) {
  try {
    core_12(`Installing Firebase`);
    return Promise.resolve(exec_2(`npm i https://storage.googleapis.com/firebase-preview-drop/node/firebase-tools/firebase-tools-7.13.0-hostingpreviews.1.tgz`)).then(function () {
      function _temp2() {
        core_12(`Deploying`);
        return Promise.resolve(exec_2(`./node_modules/.bin/firebase hosting:preview --json`)).then(function (json) {
          core_13();
          console.log(json);
        });
      }

      core_13();
      const buildScript = core_5('build-script');

      const _temp = function () {
        if (buildScript) {
          core_12(`Building using "${buildScript}"`);
          return Promise.resolve(exec_2(buildScript)).then(function () {
            core_13();
          });
        }
      }();

      return _temp && _temp.then ? _temp.then(_temp2) : _temp2(_temp);
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

(function () {
  try {
    const _temp3 = _catch(function () {
      const token = core_5('repo-token');
      const octokit = new github_2(token);
      return Promise.resolve(run(octokit, github_1)).then(function () {});
    }, function (e) {
      core_7(e.message);
    });

    return _temp3 && _temp3.then ? _temp3.then(function () {}) : void 0;
  } catch (e) {
    Promise.reject(e);
  }
})();
