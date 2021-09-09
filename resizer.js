function resize(originalFormula, originalSize, newSize) {
    //color = {"KXL":[1,28]}
    let scaleFactor = newSize/originalSize //In ounces
    let resizedFormula = {}
    for (colorant in originalFormula) {
        let resizedOunces = originalFormula[colorant][0] * scaleFactor
        let resizedDrops = originalFormula[colorant][1] * scaleFactor
        resizedFormula[colorant] = [resizedOunces, resizedDrops]
    }
    return resizedFormula
}

function createColor() { //TODO change this to the new list of colorants
    var color = {}; //start up the dictionary
    const table = document.querySelector("#table");
    for (i = 0; i < 5; i++) { //This doesn't go through the divs, just selects which element in each div to get
        let color = table.children[0].children[i].value;
        let ounces = + table.children[1].children[i].value;
        let drops = + table.children[2].children[i].value;
        color[color] = [ounces, drops];
    }
    return color
}