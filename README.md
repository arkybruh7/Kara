# Installation

Prerequisites: node, python, Ollama

Youre gonna have to have Qwen installed locally in your device through Ollama

- make sure you have the model installation setup properly configured or else youre gonna have to run some cmd to set it up (i dont rem the cmd but yeah)
- also if you havent installed in default location you can setup that manually installed location in enviroment variables so you wont have to configure everytime

~~~ bash
ollama serve
~~~

Youre Gonna need Node v 22 installed and Python 3.13

~~~ bash
node app.js
~~~

then send msgs and get reply,

also if you wanna allow it to open your playlist add the playlist id at "apps/spotify.json"
this is because spotify no longer takes api request from free accounts,
also to play spotify it uses Open CV to recognize the playbutton so if youre version is modded and doesnt look like default change the image at "apps/resources/play_button.png" with ss of similar size.


