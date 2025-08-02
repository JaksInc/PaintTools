function combineColors(colorA, colorB) {
    //colorA and colorB are "dictionaries"
    //colorA = {"KXL":[1,192], "LL":[0,192]}
    var newColor = {};
    for (var color in colorA) { //color is the key, colorA[color] is the value
        let totalDropsDivideHalf = ((colorA[color][0] * 384) + colorA[color][1]) / 2;
        let newOunces = Math.floor(totalDropsDivideHalf / 384);
        let newDrops = Math.round((totalDropsDivideHalf % 384) * 2) / 2;
        newColor[color] = [newOunces, newDrops];
    }
    for (var color in colorB) {
        let totalDropsDivideHalf = ((colorB[color][0] * 384) + colorB[color][1]) / 2;
        let newOunces = Math.floor(totalDropsDivideHalf / 384);
        let newDrops = Math.round((totalDropsDivideHalf % 384) * 2) / 2;
        if (color in newColor) { //check if color already exists, if so add to it
            newColor[color][0] += newOunces;
            newColor[color][1] += newDrops;
            if (newColor[color][1] > 383) { // if adding colorB's drops caused it to go over an ounce, add the ounce and remove the drops
                newColor[color][0] += 1;
                newColor[color][1] -= 384;
            }
        } else { //Or make a new endivy
            newColor[color] = [newOunces, newDrops];
        }
    }
    return newColor;
}

if (typeof window !== 'undefined') {
    window.combineColors = combineColors;
}
if (typeof module !== 'undefined') {
    module.exports = { combineColors };
}
