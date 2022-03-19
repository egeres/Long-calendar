
const fs = require('fs')
import path from 'path';

function isFile(path:String) {
    try {
        var stat = fs.lstatSync(path);
        return stat.isFile();
    } catch (e) {
        // lstatSync throws an error if path doesn't exist
        return false;
    }
}

export function directory_setup(path_directory:string)
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
            JSON.stringify({
            }, null, 4)
        );
    }
}

export function get_sources_in_data_folder(path_directory:string)
{
    let filenames = fs.readdirSync(path_directory)
    .filter(filename => isFile(path.join(path_directory, filename)))
    .filter(filename => filename !== "config.json")

    return {
        names:filenames
        // WIP, a list with the configuration of each one of these elements
    }
}
