import fs from "fs";
import { exec } from "child_process";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load playlist registry
const spotifyData = JSON.parse(
    fs.readFileSync(path.join(__dirname, "spotify.json"), "utf8")
);

const playlists = spotifyData.playlists;

// Build a readable list of available playlist names for the tool description
const playlistNames = Object.keys(playlists).join(", ");

// --- Tool Definitions (sent to Ollama) ---

export const toolDefinitions = [
    {
        type: "function",
        function: {
            name: "play_spotify_playlist",
            description: `Play a Spotify playlist by name. Available playlists: ${playlistNames}`,
            parameters: {
                type: "object",
                properties: {
                    playlist_name: {
                        type: "string",
                        description: "The name of the playlist to play (case-insensitive)"
                    }
                },
                required: ["playlist_name"]
            }
        }
    }
];

// --- Tool Executor ---

/**
 * Execute a tool call returned by the model.
 * @param {string} name - The function name from tool_calls
 * @param {object} args - The arguments object from tool_calls
 * @returns {Promise<string>} - Result message to send back to the model
 */
export async function executeTool(name, args) {
    if (name === "play_spotify_playlist") {
        return await playSpotifyPlaylist(args.playlist_name);
    }

    return `Unknown tool: ${name}`;
}

/**
 * Find and play a Spotify playlist by name.
 */
async function playSpotifyPlaylist(playlistName) {
    if (!playlistName) {
        return "Error: No playlist name provided.";
    }

    // Case-insensitive lookup
    const match = Object.entries(playlists).find(
        ([name]) => name.toLowerCase() === playlistName.toLowerCase()
    );

    if (!match) {
        // Try fuzzy partial match as fallback
        const partialMatch = Object.entries(playlists).find(
            ([name]) => name.toLowerCase().includes(playlistName.toLowerCase()) ||
                        playlistName.toLowerCase().includes(name.toLowerCase())
        );

        if (partialMatch) {
            return await openSpotifyPlaylist(partialMatch[0], partialMatch[1]);
        }

        return `Playlist "${playlistName}" not found. Available playlists: ${playlistNames}`;
    }

    return await openSpotifyPlaylist(match[0], match[1]);
}

/**
 * Open and play a Spotify playlist using the Python script (with pyautogui play button click).
 */
function openSpotifyPlaylist(name, id) {
    return new Promise((resolve) => {
        const scriptPath = path.join(__dirname, "openApp.py");

        exec(`python "${scriptPath}" ${id}`, { timeout: 20000 }, (error, stdout, stderr) => {
            if (error) {
                console.error(`Spotify exec error: ${error.message}`);
                if (stderr) console.error(`stderr: ${stderr}`);
                resolve(`Failed to play Spotify: ${error.message}`);
                return;
            }

            if (stdout) console.log(stdout.trim());

            if (stdout.includes("Playing playlist")) {
                resolve(`Now playing playlist: ${name}`);
            } else if (stdout.includes("Play button not found")) {
                resolve(`Opened playlist "${name}" in Spotify, but couldn't auto-press play. The play button wasn't found on screen.`);
            } else {
                resolve(`Opened playlist: ${name}`);
            }
        });
    });
}
