// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const fs = require('fs');
const tinify = require('tinify');
tinify.key = process.env.TINIFY_API_KEY;

let compressionsThisMonth = tinify.compressionCount;

console.log(compressionsThisMonth);
window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector);
        if (element) element.innerText = text;
    };

    for (const type of ['chrome', 'node', 'electron']) {
        replaceText(`${type}-version`, process.versions[type]);
    }

    var holder = document.getElementById('drag-file');

    holder.ondragover = (e) => {
        e.target.classList.add('hover');
        return false;
    };

    holder.ondragleave = (e) => {
        e.target.classList.remove('hover');
        return false;
    };

    holder.ondragend = (e) => {
        e.target.classList.remove('hover');

        return false;
    };

    holder.ondrop = (e) => {
        e.target.classList.remove('hover');
        e.target.classList.add('working');

        e.preventDefault();

        for (let f of e.dataTransfer.files) {
            console.log('File(s) you dragged here: ', f.path);
            const copyNameArr = f.path.split('.');
            copyNameArr[copyNameArr.length - 2] =
                copyNameArr[copyNameArr.length - 2] + '_copy';
            const copyName = copyNameArr.join('.');
            console.log(copyName);

            const source = tinify.fromFile(f.path);
            source.toFile(copyName, (err) => {
                if (err) {
                    console.log('The error message is: ' + err.message);
                }
                e.target.classList.remove('working');
            });
            // const x = fs.readFileSync(f.path);
            // fs.writeFileSync(copyName, x);
            // console.log(x);
        }
        return false;
    };
});
