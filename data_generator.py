
import os
import json
from multiprocessing.sharedctypes import Value
import requests
import datetime
from dateutil import parser
from typing import * # type: ignore
import copy
import hashlib
import math




# 💊 Configuration
days_to_export  : int  = 2
url_buckets     : str  = "http://localhost:5600/api/0/buckets"
labels          : dict = {
    "gaming":{
        "titles": ["Red Dead Redemption 2"],
        "apps"  : ["CivilizationVI.exe", "Deathloop.exe", "eldenring.exe"],
        "color" : "#262626",
    },
    "video":{
        "titles": [],
        "apps"  : ["vlc.exe"],
        "color" : "#262626",
    },
    "drawing":{
        "titles": [],
        "apps"  : ["krita.exe"],
        "color" : "#262626",
    },
}





def is_alive(url:str) -> bool:
    """Pings the provided url"""

    try:
        r = requests.get(url)
        r.raise_for_status()  # Raises a HTTPError if the status is 4xx, 5xxx
    except (requests.exceptions.ConnectionError, requests.exceptions.Timeout):
        return False
    except requests.exceptions.HTTPError:
        return False
    
    return True

def get_bucket_window(url_base:str="http://localhost:5600") -> List[dict]:
    """Extracts a particular type of bucket"""

    out = requests.get(f"{url_base}/api/0/buckets",)

    if out.status_code == 200:
        content = out.json()
        return list(filter(lambda x:x["client"] == "aw-watcher-window", content.values()))
    else:
        raise Exception("The connection had a problem!")

def get_events_of_bucket_and_day(day:datetime.datetime, bucket_id:str, url_base:str="http://localhost:5600") -> List[dict]:
    """Gets the events of a bucket"""
    out = requests.get(
        f"{url_base}/api/0/buckets/{bucket_id}/events",
        params={
            "start":day.replace(hour=0 , minute=0 , second=0 ).isoformat(),
            "end"  :day.replace(hour=23, minute=59, second=59).isoformat(),
        }
    )

    if out.status_code == 200:
        return out.json()
    else:
        raise Exception("The connection had a problem!")

def get_segments_from_list_of_events(in_labels:dict, events:list, time_to_glue_in_mins:float=15.0, time_minimum_to_save_in_mins:float=3.0) -> List[dict]:

        all_segments : List[dict] = []
        current_segment           = None

        def split_event_in_day_events(event) -> List[dict]:
            """An event that starts on the 1st of january and ends on the 3rd should
            be splitted into three different segments for the display to render"""

            if (event["end"] - event["start"]).total_seconds() > (60  * 60 * 24):
                
                to_return : List[dict] = []

                to_return.append({
                    "start"  : event["start"],
                    "end"    : event["start"].replace(hour=23, minute=59, second=59),
                    "tooltip": event["tooltip"],
                    "color"  : event["color"],
                })
                if "label" in event: to_return[-1]["label"] = event["label"]

                for i in range(max(0, math.ceil((event["end"] - event["start"]).total_seconds() / (60  * 60 * 24)) - 2)):
                    x = event["start"].replace(hour=0, minute=0, second=0)
                    x = x + datetime.timedelta(days=i + 1)
                    to_return.append({
                        "start"  : x,
                        "end"    : x.replace(hour=23, minute=59, second=59),
                        "tooltip": event["tooltip"],
                        "color"  : event["color"],
                    })
                    if "label" in event: to_return[-1]["label"] = event["label"]

                to_return.append({
                    "start"  : event["end"].replace(hour=0, minute=0, second=0),
                    "end"    : event["end"],
                    "tooltip": event["tooltip"],
                    "color"  : event["color"],
                })
                if "label" in event: to_return[-1]["label"] = event["label"]

                return to_return
                
            else:
                return [event]

        for label_k, label_v in in_labels.items():
            for n, event in enumerate(events):
                if (event["data"]["title"] in label_v["titles"]) or (event["data"]["app"] in label_v["apps"]):
                    
                    if current_segment == None:
                        current_segment = {
                            "start"  : parser.parse(event["timestamp"]),
                            "end"    : parser.parse(event["timestamp"]) + datetime.timedelta(minutes=event["duration"]/60.0),
                            "tooltip": f"{event['data']['title']}",
                            "color"  : label_v["color"],
                        }

                        p = 0

                    else:
                        
                        if current_segment["tooltip"] != event['data']['title']:

                            if (current_segment["end"] - current_segment["start"]).total_seconds() > time_minimum_to_save_in_mins:
                                # all_segments.append(copy.copy(current_segment))
                                all_segments.extend(split_event_in_day_events(current_segment))
                            
                            current_segment = {
                                "start"  : parser.parse(event["timestamp"]),
                                "end"    : parser.parse(event["timestamp"]) + datetime.timedelta(minutes=event["duration"]/60.0),
                                "tooltip": f"{event['data']['title']}",
                                "color"  : label_v["color"],
                            }

                        elif abs((parser.parse(event["timestamp"]) - current_segment["start"]).total_seconds())/60 > time_to_glue_in_mins:

                            if (current_segment["end"] - current_segment["start"]).total_seconds() > time_minimum_to_save_in_mins:
                                # all_segments.append(copy.copy(current_segment))
                                all_segments.extend(split_event_in_day_events(current_segment))

                            current_segment = {
                                "start"  : parser.parse(event["timestamp"]),
                                "end"    : parser.parse(event["timestamp"]) + datetime.timedelta(minutes=event["duration"]/60.0),
                                "tooltip": f"{event['data']['title']}",
                                "color"  : label_v["color"],
                            }

                        else:
                            current_segment["end"] = parser.parse(event["timestamp"]) + datetime.timedelta(minutes=event["duration"]/60.0)

        if current_segment != None:
            if (current_segment["end"] - current_segment["start"]).total_seconds() > time_minimum_to_save_in_mins:
                # all_segments.append(copy.copy(current_segment))
                all_segments.extend(split_event_in_day_events(current_segment))

        return all_segments

def get_cached_data_if_valid(path_dir_cache:str, labels_hash:int, filename) -> Optional[List[dict]]:

    if not os.path.exists(path_dir_cache): os.makedirs(path_dir_cache)

    if os.path.exists(f"{path_dir_cache}/{filename}.json"):
        with open(    f"{path_dir_cache}/{filename}.json", "r") as f:
            data = json.load(f)
            if data["hash"] == labels_hash:
                return data["content"]

def cache_events(path_dir_cache:str, labels_hash:int, list_of_events, filename:str) -> None:

    if not os.path.exists(path_dir_cache): os.makedirs(path_dir_cache)

    with open(f"{path_dir_cache}/{filename}.json", "w") as f:
        json.dump({
            "hash"   : str(labels_hash),
            "content": list_of_events,
        }, f, indent=4)





if __name__ == "__main__":

    # 💊 Other stuff
    hash_labels     : int = int(hashlib.sha256(json.dumps(labels).encode('utf-8')).hexdigest(), 16) % 10**8
    path_dir_target : str = os.path.abspath(os.path.join(os.path.abspath(__file__), ".."))
    if not os.path.exists(f"{path_dir_target}/data"      ): os.makedirs(f"{path_dir_target}/data"      )
    if not os.path.exists(f"{path_dir_target}/data_cache"): os.makedirs(f"{path_dir_target}/data_cache")


    # 💊 Check if activity watch server is alive
    if not is_alive(url_buckets):
        raise Exception(f"Activity watch server coudln't be loaded. Check if the server is running or if the url '{url_buckets}' is correct")


    # 💊 We get the buckets
    buckets = get_bucket_window()
    if len(buckets) == 0:
        raise Exception("There are no 'aw-watcher-window' buckets in your activity watch!")

    
    # 💊 Information extraction itself
    all_segments = []
    for bucket in buckets:

        for day_ago in range(days_to_export):
            day      = datetime.datetime.now() - datetime.timedelta(days=day_ago)
            filename = f"{day.strftime('%Y-%m-%d')}_{bucket['hostname']}"

            if day_ago > 0:
                l_cached = get_cached_data_if_valid(
                    f"{path_dir_target}/data_cache",
                    hash_labels,
                    filename,
                )
                if l_cached is None:
                    l = get_events_of_bucket_and_day(day, bucket["id"])
                    l = list(reversed(l))
                    cache_events(f"{path_dir_target}/data_cache", hash_labels, l, filename)

                else:
                    l = l_cached
            else:
                l = get_events_of_bucket_and_day(day, bucket["id"])
                l = list(reversed(l))

            segments = get_segments_from_list_of_events(labels, l)
            all_segments.extend(segments)
    
    for i in all_segments:
        i["start"] = i["start"].isoformat()
        i["end"]   = i["end"  ].isoformat()


    # 💊 We save it!
    with open(f"{path_dir_target}/data/activity_watch.json", "w", encoding="utf-8") as f:
        json.dump(all_segments, f, indent=4)

