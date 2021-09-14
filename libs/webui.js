exports.run = () => {}

let uis = []

exports.makeUI = options => {
    uis.push({
        name: options.name,
        file: options.file,
        html: options.html
    })
};

exports.alert = (text, icon, type) => {

}

exports.getUI = file => {
    return uis.find(x => x.file === file);
}