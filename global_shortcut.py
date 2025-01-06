# This needs sudo to run

import contextlib

import keyboard
import requests


def foo():
    with contextlib.suppress(Exception):
        print("Requesting...")
        requests.get("http://localhost:18233/toggle_display")

keyboard.add_hotkey("alt+e", foo)
keyboard.wait()