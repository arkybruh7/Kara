import json
from openApp import play_playlist


def load_data():

    with open("spotify.json", "r") as file:
        return json.load(file)


def handle_command(command):

    data = load_data()

    playlists = data["playlists"]

    command = command.lower()

    for name, playlist_id in playlists.items():

        if name.lower() in command:

            play_playlist(playlist_id)
            return


    print("Playlist not found")


while True:

    user = input("Kara > ")

    if user.lower() == "exit":
        break

    handle_command(user)