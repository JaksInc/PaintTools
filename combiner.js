function combineColors(colorA, colorB) {
    //colorA and colorB are "dictionaries"
    //colorA = {"KXL":[1,192], "LL":[0,192]}
    var newColor = {}
    for (var color in colorA) { //color is the key, colorA[color] is the value
        newColor[color] = [] //make new entries for each color in colorA
        let totalDropsDivideHalf = ((colorA[color][0] * 384) + colorA[color][1]) / 2
        let newOunces = Math.floor(totalDropsDivideHalf / 384);
        let newDrops = Math.round((totalDropsDivideHalf % 384) * 2) / 2;
        newColor[color][0] = newOunces
        newColor[color][1] = newDrops
    }
    for (var color in colorB) {
        let totalDropsDivideHalf = ((colorB[color][0] * 384) + colorB[color][1]) / 2
        let newOunces = Math.floor(totalDropsDivideHalf / 384);
        let newDrops = Math.round((totalDropsDivideHalf % 384) * 2) / 2;
        if (color in newColor) { //check if color already exists, if so add to it
            newColor[color][0] += newOunces
            newColor[color][1] += newDrops
        }
        else { //Or make a new entry
            newColor[color] = []
            newColor[color][0] = newOunces
            newColor[color][1] = newDrops
        }
    }
    return newColor
}