import fs from "fs";

const file = fs.readFileSync("YOUR_FILE_HERE.js").toString();
const classes = {};

let attempt = !1;

let objects = [];

!function(inputFile) {
    inputFile = inputFile.replace(/\r/g, "").split(/\n/);

    for (var t in inputFile) {
        if (objects.length > 0) {
            if (!!objects[objects.length - 1]) {
                classes[objects[objects.length - 1]].push(inputFile[t]);
            }
        }
        if (inputFile[t].includes("class")) {
            let tempFile = inputFile[t].replace(/\s{4,}/g, "");
            tempFile = tempFile.split(/class ([^\s{]+)/)[1];
            classes[tempFile] = [];
            objects.push(tempFile);
            attempt = !0;
            continue;
        } else if (attempt) {
            if (inputFile[t].includes("{")) {
                objects.push(objects[objects.length - 1]);
            }
            if (inputFile[t].includes("}") && objects.length > 0) {
                objects.pop();
            }
        }
    }
    for (var t in classes) {
        let inputFile = classes[t];
        let dependencies = [];
        for (var e in inputFile) {
            if (inputFile[e].includes("new ")) {
                let tempFile = inputFile[e].split(/new ([^\s(]+)/);
                let files = fs.readdirSync('data/').filter(file => file.endsWith('.js'));
                if (files.includes(tempFile[1] + ".js")) {
                    dependencies.push(tempFile[1]);
                }
            }
        }
        for (var e in dependencies) {
            dependencies[e] = "import " + dependencies[e] + " from \"" + dependencies[e] + ".js\";\n";
        }
        dependencies = dependencies.filter((t, e) => dependencies.indexOf(t) == e);
        fs.writeFileSync("data/" + t + ".js", dependencies.join("\n") + "\nexport default class {\n" + inputFile.join("\n"), err => { if (err) { throw err }})
    }
    for (var t in classes) {
        let inputFile = classes[t];
        let dependencies = [];
        for (var e in inputFile) {
            if (inputFile[e].includes("new ")) {
                let tempFile = inputFile[e].split(/new ([^\s(]+)/);
                let files = fs.readdirSync('data/').filter(file => file.endsWith('.js'));
                if (files.includes(tempFile[1] + ".js")) {
                    dependencies.push(tempFile[1]);
                }
            }
        }
        for (var e in dependencies) {
            dependencies[e] = "import " + dependencies[e] + " from \"" + dependencies[e] + ".js\";\n";
        }
        dependencies = dependencies.filter((t, e) => dependencies.indexOf(t) == e);
        fs.writeFileSync("data/" + t + ".js", dependencies.join("\n") + "\nexport default class {\n" + inputFile.join("\n"), err => { if (err) { throw err }})
    }
}(file)
