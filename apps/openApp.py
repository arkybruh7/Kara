import os
import sys
import time
import pyautogui

# Resolve resource paths relative to this script's directory
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PLAY_BUTTON_IMG = os.path.join(SCRIPT_DIR, "resources", "play_button.png")


def focus_spotify():
    """Maximize the Spotify desktop app so it's fully visible on screen."""
    for w in pyautogui.getAllWindows():
        title = w.title.lower()
        if "spotify" in title and "chrome" not in title and "edge" not in title and "visual studio" not in title:
            try:
                w.maximize()
                w.activate()
                print(f"Maximized: {w.title}")
                return True
            except Exception as e:
                print(f"Focus error: {e}")
    return False


def play_playlist(playlist_id):
    uri = f"spotify:playlist:{playlist_id}"

    print(f"Opening {uri}")
    os.startfile(uri)

    # Wait for Spotify to fully load the playlist page
    time.sleep(8)

    # CRITICAL: bring Spotify to the front — without this pyautogui
    # scans whatever window is in front (terminal/Chrome) and fails
    focus_spotify()
    time.sleep(3)  # Wait for UI to fully render after maximize

    # Try screenshot match with decreasing confidence
    box = None
    for conf in [0.7, 0.6, 0.5, 0.4]:
        try:
            box = pyautogui.locateOnScreen(PLAY_BUTTON_IMG, confidence=conf, grayscale=True)
            if box:
                print(f"Play button found (confidence={conf}): {box}")
                break
        except Exception:
            continue

    if box:
        # play_button.png is a wide strip — the green play button is at the LEFT edge
        # Click ~30px from the left, vertically centered on the box
        click_x = box.left + 30
        click_y = box.top + (box.height // 2)
        print(f"Clicking play button at ({click_x}, {click_y})")
        pyautogui.click(click_x, click_y)
        print("Playing playlist")
    else:
        print("Play button not found")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python openApp.py <playlist_id>")
        sys.exit(1)

    play_playlist(sys.argv[1])