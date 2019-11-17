const fs = require('fs');
const Path = require('path');

let Field = (path) => {
    let o = {};

    if(fs.existsSync(path) ? fs.lstatSync(path).isFile() : false) {
        let d = fs.readFileSync(path, 'UTF-8');

        if (d) {
            try {
                o = JSON.parse(d);
            } catch (e) {
                console.error(e.message);
            }
        }
    }

    return new Proxy(o, {
        field: (target, p, value) => {
            target[p] = value;

            if(!fs.existsSync(path) ? true : !fs.lstatSync(path).isFile()) {
                fs.writeFileSync(path, '{}');
            }

            fs.writeFileSync(path, JSON.stringify(target));
        }
    })
};

let Set = (path) => {
    if(!fs.existsSync(path) ? true : !fs.lstatSync(path).isDirectory()) {
        fs.mkdirSync(path);
    }

    return walk(path);
};

let walk = path => {
    return {
        field: (name) => {
            return Field(Path.resolve(`${path}/${name}.bsmnt`));
        },

        set: (name) => {
            return Set(Path.resolve(`${path}/${name}/`));
        }
    };
};

module.exports = {
    BasementClient: path => {
        return {
            on: onceupon.on,
            once: onceupon.once,
            _: walk(path)
        };
    },
};