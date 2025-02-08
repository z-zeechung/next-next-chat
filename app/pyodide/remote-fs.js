var memory = new Map()

export const remoteFS = (pyodide, root, base_url)=>{
    var FS = pyodide.FS
    var PATH = {
        isAbs: path => path.charAt(0) === "/",
        // splitPath: filename => {
        //     var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
        //     return splitPathRe.exec(filename).slice(1)
        // }
        // ,
        normalizeArray: (parts, allowAboveRoot) => {
            var up = 0;
            for (var i = parts.length - 1; i >= 0; i--) {
                var last = parts[i];
                if (last === ".") {
                    parts.splice(i, 1)
                } else if (last === "..") {
                    parts.splice(i, 1);
                    up++
                } else if (up) {
                    parts.splice(i, 1);
                    up--
                }
            }
            if (allowAboveRoot) {
                for (; up; up--) {
                    parts.unshift("..")
                }
            }
            return parts
        }
        ,
        normalize: path => {
            var isAbsolute = PATH.isAbs(path)
              , trailingSlash = path.substr(-1) === "/";
            path = PATH.normalizeArray(path.split("/").filter(p => !!p), !isAbsolute).join("/");
            if (!path && !isAbsolute) {
                path = "."
            }
            if (path && trailingSlash) {
                path += "/"
            }
            return (isAbsolute ? "/" : "") + path
        }
        ,
        // dirname: path => {
        //     var result = PATH.splitPath(path)
        //       , root = result[0]
        //       , dir = result[1];
        //     if (!root && !dir) {
        //         return "."
        //     }
        //     if (dir) {
        //         dir = dir.substr(0, dir.length - 1)
        //     }
        //     return root + dir
        // }
        // ,
        basename: path => {
            if (path === "/")
                return "/";
            path = PATH.normalize(path);
            path = path.replace(/\/$/, "");
            var lastSlash = path.lastIndexOf("/");
            if (lastSlash === -1)
                return path;
            return path.substr(lastSlash + 1)
        }
        ,
        join: function() {
            var paths = Array.prototype.slice.call(arguments);
            return PATH.normalize(paths.join("/"))
        },
        join2: (l, r) => PATH.normalize(l + "/" + r)
    };
    var fs = {
        lstatSync: path => {
            return {
                mode: 33279,
                atime: new Date(),
                mtime: new Date(),
                ctime: new Date()
            }
        },
        openSync: path => {
            var url = base_url+"/"+path
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, false);
            xhr.responseType = "arraybuffer";
            xhr.send()
            var id = memory.size
            memory.set(id, xhr.response)
            return id
        },
        closeSync: path => {
            
        },
        readSync(stream, buffer, position){
            const arrbfr = memory.get(stream)
            buffer.set(arrbfr, position)
        },
        fstatSync(stream){

        }
    }
    var REMOTEFS = {
        mount(mount) {
            return REMOTEFS.createNode(null, "/", REMOTEFS.getMode(mount.opts.root), 0)
        },
        createNode(parent, name, mode, dev) {
            if (!FS.isDir(mode) && !FS.isFile(mode) && !FS.isLink(mode)) {
                throw new FS.ErrnoError(28)
            }
            var node = FS.createNode(parent, name, mode);
            node.node_ops = REMOTEFS.node_ops;
            node.stream_ops = REMOTEFS.stream_ops;
            return node
        },
        getMode(path) {
            var stat = fs.lstatSync(path);
            return stat.mode
        },
        realPath(node) {
            var parts = [];
            while (node.parent !== node) {
                parts.push(node.name);
                node = node.parent
            }
            parts.push(node.mount.opts.root);
            parts.reverse();
            return PATH.join.apply(null, parts)
        },
        node_ops:{
            getattr(node) {
                var path = REMOTEFS.realPath(node);
                var stat = fs.lstatSync(path)
                return {
                    dev: stat.dev,
                    ino: stat.ino,
                    mode: stat.mode,
                    nlink: stat.nlink,
                    uid: stat.uid,
                    gid: stat.gid,
                    rdev: stat.rdev,
                    size: stat.size,
                    atime: stat.atime,
                    mtime: stat.mtime,
                    ctime: stat.ctime,
                    blksize: stat.blksize,
                    blocks: stat.blocks
                }
            },
            setattr(node, attr) {
                // unimplemented
            },
            lookup(parent, name) {
                var path = PATH.join2(REMOTEFS.realPath(parent), name);
                var mode = REMOTEFS.getMode(path);
                return REMOTEFS.createNode(parent, name, mode)
            },
            mknod(parent, name, mode, dev) {
                // unimplemented
            },
            rename(oldNode, newDir, newName) {
                // unimplemented
            },
            unlink(parent, name) {
                // unimplemented
            },
            rmdir(parent, name) {
                // unimplemented
            },
            readdir(node) {
                // unimplemented
                // var path = REMOTEFS.realPath(node);
                // return fs.readdirSync(path)
            },
            symlink(parent, newName, oldPath) {
                // unimplemented
            },
            readlink(node) {
                // unimplemented
                // var path = REMOTEFS.realPath(node);
                // path = fs.readlinkSync(path);
                // path = nodePath.relative(nodePath.resolve(node.mount.opts.root), path);
                // return path
            }
        },
        stream_ops: {
            open(stream) {
                var path = REMOTEFS.realPath(stream.node);
                if (FS.isFile(stream.node.mode)) {
                    stream.nfd = fs.openSync(path)
                }
            },
            close(stream) {
                if (FS.isFile(stream.node.mode) && stream.nfd) {
                    fs.closeSync(stream.nfd)
                }
            },
            read(stream, buffer, offset, length, position) {
                if (length === 0)
                    return 0;
                return fs.readSync(stream.nfd, new Int8Array(buffer.buffer,offset,length), {
                    position: position
                })
            },
            write(stream, buffer, offset, length, position) {
                // unimplemented
            },
            llseek(stream, offset, whence) {
                var position = offset;
                if (whence === 1) {
                    position += stream.position
                } else if (whence === 2) {
                    if (FS.isFile(stream.node.mode)) {
                        var stat = fs.fstatSync(stream.nfd);
                        position += stat.size
                    }
                }
                if (position < 0) {
                    throw new FS.ErrnoError(28)
                }
                return position
            },
            mmap(stream, length, position, prot, flags) {
                // unimplemented
                // if (!FS.isFile(stream.node.mode)) {
                //     throw new FS.ErrnoError(43)
                // }
                // var ptr = mmapAlloc(length);
                // REMOTEFS.stream_ops.read(stream, HEAP8, ptr, length, position);
                // return {
                //     ptr: ptr,
                //     allocated: true
                // }
            },
            msync(stream, buffer, offset, length, mmapFlags) {
                // unimplemented
                // REMOTEFS.stream_ops.write(stream, buffer, 0, length, offset, false);
                // return 0
            }
        }
    }
    return REMOTEFS
}