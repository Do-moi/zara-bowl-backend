var mongoose = require("mongoose");

var options = {
  connectTimeoutMS: 5000,
  useNewUrlParser: true,
};

mongoose.connect(
  "mongodb+srv://marc:***************************?retryWrites=true&w=majority",
  options,
  function (error) {
    if (error) {
      console.log(error);
    } else {
      console.log("++++++++++++++ connection ok +++++++++++++++++");
    }
  }
);
