Hooks.on('diceSoNiceRollStart', (nulo, doc) => {
  var faces = 0; // Dice number of faces
  var group_score = 0; // Score for the die grouped by faces
  var group_text = ""; // List of individual rolls for a group

  // Iterate and parse individual rolls
  function parseTerms(term) {
    if (term.faces) {
      faces = term.faces;
      if (term.values.length > 1) {
        term.values.forEach(parseIndividualRoll);
      };
    };
  };

  // Iterate and parse the full roll
  function parseRolls(roll) {
    roll.terms.forEach(parseTerms);
    var total = "Total: " + roll.total;
    var msg = new SpeechSynthesisUtterance(total);
    msg.lang = "es";
    msg.rate = 1.5;
    window.speechSynthesis.speak(msg);
    // console.log(total);
  };

  // Parse each dice roll and process grouped output
  function parseIndividualRoll(item, index, arr) {
    group_score += item;
    group_text += item;
    if ((index + 1) == arr.length) {
      var tirada = "Tirada individual: " + group_text + "."
      var msg = new SpeechSynthesisUtterance(tirada);
      msg.lang = "es";
      msg.rate = 1.5;
      window.speechSynthesis.speak(msg);
      // console.log(tirada);
      group_score = 0;
      group_text = "";
    } else {
      group_text += ", ";
    };
  };

  // Start the calls
  // console.log(doc);
  // console.log(doc.roll);
  // console.log(doc.roll.terms);
  parseRolls(doc.roll);

});