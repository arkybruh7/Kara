import speech_recognition as sr
import keyboard
import time
import sys

def voice_typing():
    recognizer = sr.Recognizer()

    # Improve recognition
    recognizer.dynamic_energy_threshold = True
    recognizer.energy_threshold = 300
    recognizer.pause_threshold = 0.8
    recognizer.non_speaking_duration = 0.5

    with sr.Microphone() as source:
        print("=" * 50)
        print("🎤 Kara Voice Typing")
        print("Click in the window where you want to type.")
        print("Speak naturally.")
        print("Say 'exit program' to quit.")
        print("=" * 50)

        print("\nCalibrating microphone...")
        recognizer.adjust_for_ambient_noise(source, duration=2)
        print("Ready!\n")

        while True:
            try:
                print("🎙️ Listening...")

                audio = recognizer.listen(
                    source,
                    timeout=5,
                    phrase_time_limit=8
                )

                print("🧠 Recognizing...")

                text = recognizer.recognize_google(audio).strip()

                if not text:
                    continue

                print(f"Recognized: {text}")

                if "exit program" in text.lower():
                    print("Goodbye!")
                    sys.exit()

                # Capitalize first letter
                text = text[0].upper() + text[1:]

                # Add punctuation if missing
                if text[-1] not in ".!?":
                    text += "."

                # Give yourself time to click another window if needed
                time.sleep(0.2)

                keyboard.write(text + " ", delay=0.01)

            except sr.WaitTimeoutError:
                # Nobody spoke
                continue

            except sr.UnknownValueError:
                print("🤔 Didn't catch that.")

            except sr.RequestError as e:
                print(f"Speech API Error: {e}")

            except KeyboardInterrupt:
                print("\nStopped.")
                break

            except Exception as e:
                print(f"Unexpected error: {e}")

if __name__ == "__main__":
    voice_typing()