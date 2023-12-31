require("dotenv").config();
const util = require('util');
const execAsync = util.promisify(require('child_process').exec);
const { exec } = require('child_process');
const { Neurosity } = require("@neurosity/sdk");

//Custom Configurations 
const deviceId = process.env.DEVICE_ID || "";
const email = process.env.EMAIL || "";
const password = process.env.PASSWORD || "";
const kasaHost = '192.168.0.108';
const kinesis_name= "leftMiddleFinger";

const verifyEnvs = (email, password, deviceId) => {
    const invalidEnv = (env) => {
      return env === "" || env === 0;
    };
    if (invalidEnv(email) || invalidEnv(password) || invalidEnv(deviceId)) {
      console.error(
        "Please verify deviceId, email and password are in .env file, quitting..."
      );
      process.exit(0);
    }
  };
  verifyEnvs(email, password, deviceId);
  
  console.log(`${email} attempting to authenticate to ${deviceId}`);

  const neurosity = new Neurosity({
    deviceId
  });

  const main = async () => {
    await neurosity
      .login({
        email,
        password
      })
      .catch((error) => {
        console.log(error);
        throw new Error(error);
      });
    console.log("Logged in device:");
  };
  executeCommand(kasaHost,1);
  
  main();

neurosity.kinesis(kinesis_name).subscribe(async (intent) => {
  const probabilityValues = await Promise.all(intent.predictions.map(prediction => prediction.probability));
  probabilityValues.forEach(async (probabilityValue) => {
    brightness=convertToPercentage(probabilityValue);
      brightnessQuartile_=brightnessQuartile(brightness);
      console.log("Probability Value: "+probabilityValue);
      console.log("Brightness Quartile: "+brightnessQuartile_);
      console.log("Brightness Percentage: "+brightness);
      executeCommand(kasaHost,brightnessQuartile_);
    // }
    // else {
    //   console.log("Limit reached");
    //   commandCounter = 0;
    // }
  });

});

function brightnessQuartile(brightness) {
  let brightnessQuartileValue;

  if (brightness > 25) {
    brightnessQuartileValue = 100;
  } else if (brightness <= 25) {
    brightnessQuartileValue = 1;
  }

  return brightnessQuartileValue;
}



//Utility functions
function convertToPercentage(decimalValue) {
  // Multiply by 100 to convert to percentage
  var percentageValue = decimalValue * 100;
  
  // Round to zero decimal places
  percentageValue = Math.round(percentageValue);
  
  // Append the "%" symbol
  return percentageValue;
}


function executeCommand(host, brightness) {
    const commandToExecute = `kasa --host ${host} --type "bulb" brightness ${brightness}`;

    try {
        // Assuming executeCommandWithTimeout returns a Promise
        const result = execAsync(commandToExecute);
        // console.log(`Successfully toggled to ${newState}`);
    } catch (error) {
        console.error('Error executing command state:', error);
        // Handle the error as needed
    }
}