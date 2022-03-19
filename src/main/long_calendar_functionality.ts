
const fs = require('fs')
import path from 'path';

function directory_setup(path_directory:string)
{

    // We create the directory for the data
    let path_directory_folder : string = path.join(path_directory, "data");
    if (!fs.existsSync(path_directory_folder))
    {
        console.log("Creating missing directory...", path_directory)
        fs.mkdirSync(path_directory_folder);
    }

    // We create the config file
    let path_file_config : string = path.join(path_directory, "data", "config.json");
    if (!fs.existsSync(path_file_config))
    {
        console.log("Creating missing file...", path_file_config)
        fs.writeFileSync(
            path_file_config,
            JSON.stringify({}, null, 4)
        );
    }
}

module.exports = {
    directory_setup,
};
