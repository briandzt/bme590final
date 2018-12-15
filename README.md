# bme590final
Image Processor Final Project

The goal of this project is to generate an online 
website to perform simple image processing tasks on
JPG or PNG images. The program can be splitted into
two servers. One is a ReactJS GUI the users
will interact with, and the other one is the main server
that handles requests from ReactJS, process images, store
them into database, and return to GUI in user desired format
for the user to download.

* Instructions on setting up
The internal server can be run by executing 
"server.py". The current setting allows the server to operate locally. To 
operate via internet, the last line in the server.py
need to be changed.
