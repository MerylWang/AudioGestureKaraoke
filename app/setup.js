// Import Famo.us dependencies
var Engine = famous.core.Engine;
var Surface = famous.core.Surface;
var StateModifier = famous.modifiers.StateModifier;


var otherFeedback;

// USER INTERFACE SETUP
var setupUserInterface = function() {
  var mainContext = Engine.createContext();

  otherFeedback = new Surface({
    content: "",
    size: [undefined, 50],
    properties: {
      backgroundColor: "rgb(34, 34, 34)",
      color: "white"
    }
  });
  var otherModifier = new StateModifier({
    origin: [0.0, 1.0],
    align: [0.0, 1.0]
  });
  mainContext.add(otherModifier).add(otherFeedback);
};
