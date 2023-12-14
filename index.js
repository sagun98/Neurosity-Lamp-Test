const { exec } = require('child_process');
const { Neurosity } = require("@neurosity/sdk");
require("dotenv").config();

const deviceId = process.env.DEVICE_ID || "";
const email = process.env.EMAIL || "";
const password = process.env.PASSWORD || "";

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
    console.log("Logged in");
  };
  
  main();

const util = require('util');
const execAsync = util.promisify(require('child_process').exec);

async function executeCommandWithTimeout(commandToExecute, timeoutMilliseconds) {
    try {
        const { stdout, stderr } = await execAsync(commandToExecute);
        console.log(`stdout:\n${stdout}`);
        console.error(`stderr: ${stderr}`);
      }
      catch (error) {
        console.error(`Error: ${error.message}`);
      }

  
    // Set a timeout for the command execution
    // const timeoutId = setTimeout(() => {
    //   console.error('Command execution timed out');
    //   childProcess.kill(); // Kill the child process if it's still running after the timeout
    // }, timeoutMilliseconds);
  
    // // Listen for the 'exit' event of the child process
    // childProcess.on('exit', () => {
    //   clearTimeout(timeoutId); // Clear the timeout when the child process exits
    // });
}
async function toggleKasaState(host, currentState, timeoutMilliseconds) {
    let newState=currentState;
    if (newState === 'on') {
        newState = 'off';
    } else {
        newState = 'on';
    }

    const commandToExecute = `kasa --host ${host} ${newState}`;
    console.log(newState);

    try {
        // Assuming executeCommandWithTimeout returns a Promise
        await executeCommandWithTimeout(commandToExecute, timeoutMilliseconds);
        console.log(`Successfully toggled to ${newState}`);
    } catch (error) {
        console.error('Error toggling state:', error);
        // Handle the error as needed
    }
}

// Example usage with a timeout
const timeoutMilliseconds = 2000; // 2 seconds
 // Example usage
const kasaHost = '192.168.0.140';
let threshold=0.97; 


// leftMiddleFinger
neurosity.kinesis("leftMiddleFinger").subscribe((intent) => {
    const probabilityValues = intent.predictions.map(prediction => prediction.probability);
    probabilityValues.forEach(probabilityValue => {
        if(probabilityValue >= threshold){
            // console.log(intent);
            // Toggle the state
            toggleKasaState(kasaHost, 'on', timeoutMilliseconds);
        }
    });

});
