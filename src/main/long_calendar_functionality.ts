
const fs      = require('fs')
const moment  = require('moment');
const winston = require('winston');
const _       = require('lodash');
import path from 'path';

const logger  = winston.createLogger({
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'combined.log' })
    ]
});

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

export function get_config_default() {
    return {
        "data"  : {},
        "window": {
            "fullscreen"     : true,
            "reload_interval": 2000,
            "shortcut"       : "Alt+E",
        },
    }
}

export function directory_setup(path_directory:string)
{
    // We create the directory for the data
    let path_directory_folder : string = path.join(path_directory, "data");
    if (!fs.existsSync(path_directory_folder))
    {
        logger.info("Creating missing directory...", path_directory)
        fs.mkdirSync(path_directory_folder);
    }

    // We create the config file
    let path_file_config : string = path.join(path_directory, "data", "config.json");
    if (!fs.existsSync(path_file_config))
    {
        logger.info("Creating missing file...", path_file_config)
        fs.writeFileSync(
            path_file_config,
            JSON.stringify(get_config_default(), null, 4)
        );
    }
}

export function get_config(path_directory:string)
{
    let path_file_config : string = path.join(path_directory, "data", "config.json");

    // Autocreate file if doesn't exist!
    if (!fs.existsSync(path_file_config)) {
        logger.info("Creating missing file...", path_file_config)
        fs.writeFileSync(
            path_file_config,
            JSON.stringify(get_config_default(), null, 4)
        );
    }

    let config = get_config_default()
    try
    {
        config = JSON.parse(fs.readFileSync(path_file_config, 'utf8'));
    }
    catch { }

    return config
}

// export function set_config_prop(path_directory, title, content)
export function set_config_prop(path_directory:string, content)
{
    let path_file_config : string = path.join(path_directory, "data", "config.json");

    for (let key in content)
    {
        if (key.split(".")[0] == "data")
        {
            if (!(key.split(".")[1] in global.config["data"]))
            {
                global.config["data"][key.split(".")[1]] = {}
            }
        }

        _.set(global.config, key, content[key]);
    }

    fs.writeFileSync(
        path_file_config,
        JSON.stringify(global.config, null, 4)
    );
}

export function get_config_prop(content)
{   

    console.log("content:")
    console.log(content)
    // let to_return = _.get(global.config, path_config)

    // console.log(to_return)
    // return to_return

    let to_return = {}

    for (let key of content)
    {
        to_return[key] = _.get(global.config, key)
    }

    return to_return

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

        let just_filename : string = x.slice(0, -5)

        if (just_filename in global.config["data"]) {
            for (let key in global.config["data"][just_filename]) {
                sub_dict[key] = global.config["data"][just_filename][key]
            }
        }

        return sub_dict
    })

    logger.info("Creating getting sources...")

    return to_return
}
