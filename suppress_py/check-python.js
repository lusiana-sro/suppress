const { exec } = require('child_process');

const EXPECTED_PYTHON_VERSION = "3.10.9";

exec('python -c "import platform; print(platform.python_version())"',
    function(err, stdout, stderr) {
        if (err) {
            console.log("Python is not installed");
            return;
        }
        const currentPythonVersion = stdout.toString();
        if(currentPythonVersion < EXPECTED_PYTHON_VERSION) {
            throw new Error(`Expected Python version '${EXPECTED_PYTHON_VERSION}' but found '${currentPythonVersion}'. Please fix your Python installation.`);
        }
        else {
            exec('pip install -r requirements.txt', function(err, stdout, stderr) {
                if(err) {
                    throw new Error(`Failed to install requirements.txt: ${err}`);
                }
                else {
                    console.log("Successfully installed requirements.txt");
                }
            });
        }
    }
);
