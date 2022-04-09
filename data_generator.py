
import os
import json
from multiprocessing.sharedctypes import Value
import requests
import datetime
from dateutil import parser
from typing import * # type: ignore
import copy




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
                                all_segments.append(copy.copy(current_segment))
                            
                            current_segment = {
                                "start"  : parser.parse(event["timestamp"]),
                                "end"    : parser.parse(event["timestamp"]) + datetime.timedelta(minutes=event["duration"]/60.0),
                                "tooltip": f"{event['data']['title']}",
                                "color"  : label_v["color"],
                            }

                        elif abs((parser.parse(event["timestamp"]) - current_segment["start"]).total_seconds())/60 > time_to_glue_in_mins:

                            if (current_segment["end"] - current_segment["start"]).total_seconds() > time_minimum_to_save_in_mins:
                                all_segments.append(copy.copy(current_segment))

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
                all_segments.append(copy.copy(current_segment))

        return all_segments

if __name__ == "__main__":

    # 💊 Configuration
    days_to_export  : int  = 5
    path_dir_target : str  = os.path.abspath(os.path.join(os.path.abspath(__file__), ".."))
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

    # 💊 Is alive
    if not is_alive(url_buckets):
        raise Exception(f"Activity watch server coudln't be loaded. Check if the server is running or if the url '{url_buckets}' is correct")

    # 💊 We get the buckets
    buckets = get_bucket_window()
    if len(buckets) == 0:
        raise Exception("There are no 'aw-watcher-window' buckets in your activity watch!")

    # 💊 Information extraction itself
    all_segments = []
    for bucket in buckets:
        if not "BISH" in bucket["id"]: continue
        for day_ago in range(days_to_export):
            day      = datetime.datetime.now() - datetime.timedelta(days=day_ago)
            l        = get_events_of_bucket_and_day(day, bucket["id"])
            l        = list(reversed(l))
            segments = get_segments_from_list_of_events(labels, l)
            all_segments.extend(segments)
    
    for i in all_segments:
        i["start"] = i["start"].isoformat()
        i["end"]   = i["end"  ].isoformat()

    # 💊 We save it!
    with open(f"{path_dir_target}/data/activity_watch.json", "w", encoding="utf-8") as f:
        json.dump(all_segments, f, indent=4)

