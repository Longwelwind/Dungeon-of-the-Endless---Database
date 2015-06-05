function grep(arr, callback) {

    var greppedElements = [];

    for (var i = 0;i < arr.length;i++) {

        var element = arr[i];
        if (callback(element)) {
            greppedElements.push(element);
        }

    }

    return greppedElements;

}

function grepOnlyOne(arr, callback) {

    var selectedElements = grep(arr, callback);

    if (selectedElements.length > 0)
        return selectedElements[0];
    else
        return undefined;

}

function contains(haystack, needle) {

    return haystack.indexOf(needle) > -1;

}
