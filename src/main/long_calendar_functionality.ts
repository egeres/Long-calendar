
const fs     = require('fs')
const moment = require('moment');
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

function stringToColour(str:String) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colour = '#';
    for (var i = 0; i < 3; i++) {
        var value = (hash >> (i * 8)) & 0xFF;
        colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
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

export function get_config(path_directory:string)
{
    return JSON.parse(fs.readFileSync(path.join(path_directory, "data", "config.json"), 'utf8'));
}

export function override_config(path_directory, title, content)
{
    let path_file_config : string = path.join(path_directory, "data", "config.json");

    // console.log(title)
    // console.log(content)
    // console.log(global.config)

    for (let key in content)
    {
        if (!(title in global.config))
        {
            global.config[title] = {}
        }

        global.config[title][key] = content[key]
    }

    // console.log("...")
    // console.log(global.config)

    fs.writeFileSync(
        path_file_config,
        JSON.stringify(global.config, null, 4)
    );

}

export function override_config_singleprop(path_directory, key, value)
{
    let path_file_config : string = path.join(path_directory, "data", "config.json");

    global.config[key] = value;

    fs.writeFileSync(
        path_file_config,
        JSON.stringify(global.config, null, 4)
    );
}

export function get_sources_in_data_folder(path_directory:string)
{
    let filenames = fs.readdirSync(path_directory)
    .filter(filename => isFile(path.join(path_directory, filename)))
    .filter(filename => filename !== "config.json")
    .filter(filename => filename.endsWith(".json"))

    let to_return = filenames.map((x, i) => {
        
        let sub_dict = {
            id       : i,
            title    : x,
            path_file: path.join(path_directory, x),
            visible  : true,
            color    : stringToColour(x), // "#0FF",
            data     : [],
        }

        // console.log(x)

        if (x in global.config)
        {
            for (let key in global.config[x])
            {
                console.log("overwritting...", key, x, global.config[x][key])
                sub_dict[key] = global.config[x][key]
            }
        }

        return sub_dict
    })

    return to_return
}
