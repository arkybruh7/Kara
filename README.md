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


### Guide

- Install Ollama and Qwen 3:8B model
- Clone the repo
- run this in cmd

 ~~~ bash
ollama serve
 ~~~
it should be listening at a port in your local network

- run 
~~~ bash
node app.js
~~~

and then itll run you can give prompts just ask play this (indie and sangeet playlist by default)  
and let it run and trust the process it should open and play the playlist.


if you didnt understand js paste this to chatgpt

~~~ prompt
i wanna install this project from github, that runs listens to locally ran qwen3:8b using node.js and uses python to run inbuilt skills typa shi.
main running in app.js that lsitens to locally hosted model and uses python system cmd to open spotify and uses comp vision to click the play
button in spotify, tell me how to install, this is the repo link "https://github.com/arkybruh7/Kara"
~~~
