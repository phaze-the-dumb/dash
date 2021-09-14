exports.run = () => {}

let getDomain = fulldomain => {
    fulldomain = fulldomain.split('.');
    fulldomain = fulldomain.slice(fulldomain.length - 2);

    return fulldomain.join('.');
}

let getSubDomain = fulldomain => {
    fulldomain = fulldomain.split('.');
    fulldomain = fulldomain.slice(0, fulldomain.length - 2);

    return fulldomain.join('.');
}

exports.getDomain = getDomain;
exports.getSubDomain = getSubDomain;