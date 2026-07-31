import fs from "fs";
import readline from "readline";

// Load personality
const personality = JSON.parse(
    fs.readFileSync(new URL("./personality/kara.json", import.meta.url), "utf8")
);

// Convert JSON personality into system prompt
function createSystemPrompt(p) {
    const traits = Object.entries(p.personality || {})
        .map(([k, v]) => `- ${k.charAt(0).toUpperCase() + k.slice(1)}: ${Math.round(v * 100)}%`)
        .join("\n");

    const commStyle = p.communication?.style
        ? Object.entries(p.communication.style)
            .map(([k, v]) => `- ${k}: ${Math.round(v * 100)}%`)
            .join("\n")
        : "";

    const humorTypes = p.humorProfile?.type
        ? p.humorProfile.type.map(x => `- ${x}`).join("\n")
        : "";

    const codingBehaviors = p.codingStyle?.behavior
        ? Object.entries(p.codingStyle.behavior)
            .map(([k, v]) => `- ${k}: ${v}`)
            .join("\n")
        : "";

    const favoriteTopics = p.codingStyle?.favoriteTopics
        ? p.codingStyle.favoriteTopics.map(x => `- ${x}`).join("\n")
        : "";

    const assistantBehaviors = p.assistantBehavior
        ? Object.entries(p.assistantBehavior)
            .map(([k, v]) => `- ${k}: ${Math.round(v * 100)}%`)
            .join("\n")
        : "";

    const quirks = p.quirks ? p.quirks.map(x => `- ${x}`).join("\n") : "";
    const rules = p.rules ? p.rules.map(x => `- ${x}`).join("\n") : "";

    const catchphrases = p.catchphrases
        ? Object.entries(p.catchphrases)
            .map(([cat, phrases]) => `${cat.toUpperCase()}:\n` + phrases.map(ph => `  - "${ph}"`).join("\n"))
            .join("\n")
        : "";

    return `You are ${p.name}, a ${p.identity?.role || "AI Assistant"}.

IDENTITY & ROLE:
${p.identity?.description || ""}

PERSONALITY TRAITS:
${traits}

COMMUNICATION STYLE:
- Primary Tone: ${p.communication?.tone || "friendly"}
- Formality Level: ${Math.round((p.communication?.formality || 0) * 100)}%
- Verbosity Level: ${Math.round((p.communication?.verbosity || 0) * 100)}%
${commStyle}

HUMOR PROFILE:
${humorTypes}

ASSISTANT BEHAVIOR:
${assistantBehaviors}

CODING ASSISTANT STYLE:
- Skill Level: ${p.codingStyle?.skillLevel || "advanced"}
Behaviors:
${codingBehaviors}

Favorite Topics:
${favoriteTopics}

QUIRKS:
${quirks}

CATCHPHRASES & EXPRESSIONS:
${catchphrases}

CORE RULES:
${rules}

Stay in character at all times. Respond naturally according to these traits and guidelines.`;
}

// Initialize conversation history with system prompt
const messages = [
    {
        role: "system",
        content: createSystemPrompt(personality)
    }
];

// Ask Qwen
async function askKara(message) {
    messages.push({
        role: "user",
        content: message
    });

    const response = await fetch("http://localhost:11434/api/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "qwen3:8b",
            messages: messages,
            stream: true
        })
    });

    if (!response.ok) {
        throw new Error(`Ollama API returned status ${response.status}: ${response.statusText}`);
    }

    let fullReply = "";
    process.stdout.write("\nKara: ");

    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    for await (const chunk of response.body) {
        buffer += decoder.decode(chunk, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop(); // Keep trailing incomplete chunk

        for (const line of lines) {
            if (!line.trim()) continue;
            try {
                const parsed = JSON.parse(line);
                if (parsed.message?.content) {
                    const content = parsed.message.content;
                    process.stdout.write(content);
                    fullReply += content;
                }
            } catch (e) {
                // Ignore parse errors on partial stream lines
            }
        }
    }

    if (buffer.trim()) {
        try {
            const parsed = JSON.parse(buffer);
            if (parsed.message?.content) {
                const content = parsed.message.content;
                process.stdout.write(content);
                fullReply += content;
            }
        } catch (e) {}
    }

    console.log(); // Extra newline after response finishes

    messages.push({
        role: "assistant",
        content: fullReply
    });

    return fullReply;
}

// Terminal interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log(`
========================
     Kara AI Online
========================

Personality: ${personality.name} (${personality.identity?.role || "AI Companion"})

Type exit to quit.
`);

function chat() {
    rl.question("\nYou: ", async (input) => {
        if (input.trim().toLowerCase() === "exit") {
            console.log("Kara: See you later 👋");
            process.exit(0);
        }

        if (!input.trim()) {
            chat();
            return;
        }

        try {
            await askKara(input);
        } catch (err) {
            console.log("\nError:", err.message);
        }

        chat();
    });
}

chat();