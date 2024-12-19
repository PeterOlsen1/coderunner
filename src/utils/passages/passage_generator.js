/**
 * Create a data object representing a passage's text
 * @param text
 */
export function createPassageDataObject(text) {
    let out = [];
    let idx = 0;
    for (let line of text.split('\n')) {
        let obj = { line: idx, plaintext: line };
        const words = line.split(' ');
        obj.wordLength = words.length;
        obj.words = words;
        out.push(obj);
    }

    return out;
}

export function createDisplayFromPassageObject(object) {
    let out = "";
    for (let line of object) {
        let lineOut = "";
        for (let word of line.words) {
            if (word == '') {
                if (line.wordLength > 1) {
                    lineOut += '&nbsp;';
                }
            }
            else {
                word = word.split("").map((char) => {
                    if (char == '<') {
                        return "&lt;";
                    }
                    else if (char == '>') {
                        return "&gt;";
                    }
                    else {
                        return char;
                    }
                }).join('');
                lineOut += word +  ' ';
            }
        }
        lineOut = lineOut.slice(0, -1);
        lineOut += '<br>';
        out += lineOut;
    }

    return out;
}

export async function getText(language) {
    const data = await fetch(`/passages/${language}/1.txt`);
    return await data.text();
}