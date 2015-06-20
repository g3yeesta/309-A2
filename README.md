# Tap Bug Game

by Stanley Yee (g3yeesta) and Chia-Hung Haiao (c3hsiaod)

Overview:

There are 5 pieces of food on the table. Every 1-3 seconds a bug will come in from the top and try to eat your food. Click to crush the bugs. The game ends when either all your food has been eaten or when 60 seconds passes.  

Challenges:

Handling the rotation of bugs which involves a great deal of trigometry to keep track of them, which was further complicated by the need for collision detection with food. Fading out bugs on death required learning new debugging tools to understand what was wrong.

Core Features:

2 difficulty levels, 3 different bugs with varying speeds and 5 pieces of food. Smooth graphics and intuitive gameplay. Tap the bugs.

Design Documentation:

2 classes were used: a food class with x and y coordinates and a bug class that contained multiple attributes. The bug class had to keep track of the position of it's rear (x,y), speed (x,y), colour, the closest food, the distance to the closest food, whether the bug is alive or dead, and how long since it died and the position of its head (x,y).

3 seperate timer functions were used to keep track of the animation frames, countdown time and bug spawning. A recursive SetTimeout was used over SetInterval because it was easier to use SetTimeout to create a effective pause that was able to resume where it left of instead resetting the timer. Canvas scripting was used to create unique bug images that were then imported in the game. EventListeners waiting for a "mousedown" were used to handles taps and clicks.

3 functions were used to handle the buttons required (start,pause,quit). 

The 3 helper functions were used to handle specifice events. Game over, moving bugs and calculating the speed and direction of bugs.The Pythagorean theorem to calculate diagonal speed and distance as well as the area of a circle for a click event. 
