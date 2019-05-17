// code referenced from 6.835 mini-project 3: battleship

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
      // backgroundColor: "rgb(34, 34, 34)",
      // backgroundColor: "white",
      background: "linear-gradient(to right, #ff6e7f, #bfe9ff)",
      color: "black"
    }
  });
  var otherModifier = new StateModifier({
    origin: [0.0, 0.5],
    align: [0.0, 1.0]
  });
  mainContext.add(otherModifier).add(otherFeedback);
};
