/*

TO-DO:

- Define correct format for the output strings [Done]
- Test google speech library [WIP]
- Feed the speech library with the output string
- Include the speech library inside foundry

*/

Hooks.on('renderChatMessage', (doc) => {
  var faces = 0; // Dice number of faces
  var group_score = 0; // Score for the die grouped by faces
  var group_text = ""; // List of individual rolls for a group


  // Replace operators for the string to be read by text to speech (spanish hardcode)
  function replaceOperators(text) {
    text = text.replace("*","por");
    text = text.replace("/","entre");
    text = text.replace("+","más");
    text = text.replace("-","menos");
    return text;
  };

  // Iterate and parse individual rolls
  function parseTerms(term) {
    if (term.faces) {
      faces = term.faces;
      term.values.forEach(parseIndividualRoll);
    };
  };

  // Iterate and parse the full roll
  function parseRolls(roll) {
    var formula = "La tirada realizada es:" + replaceOperators(roll.formula);
    var msg = new SpeechSynthesisUtterance(formula);
    msg.lang = "es";
    window.speechSynthesis.speak(msg);
    console.log(formula);
    roll.terms.forEach(parseTerms);
    var result = "El resultado de la tirada es:" + replaceOperators(roll.result);
    var msg = new SpeechSynthesisUtterance(result);
    msg.lang = "es";
    window.speechSynthesis.speak(msg);
    console.log(result);
    var total = "El total de la tirada es: " + roll.total;
    var msg = new SpeechSynthesisUtterance(total);
    msg.lang = "es";
    window.speechSynthesis.speak(msg);
    console.log(total);
  };

  // Parse each dice roll and process grouped output
  function parseIndividualRoll(item, index, arr) {
    group_score += item;
    group_text += item;
    if ((index + 1) == arr.length) {
      var tirada = "Los dados D" + faces + " suman: " + group_score + ". La puntuación individual es: " + group_text + "."
      var msg = new SpeechSynthesisUtterance(tirada);
      msg.lang = "es";
      window.speechSynthesis.speak(msg);
      console.log(tirada);
      group_score = 0;
      group_text = "";
    } else {
      group_text += ", ";
    };
  };

  // Start the calls
  doc.rolls.forEach(parseRolls);

});