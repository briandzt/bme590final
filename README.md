# bme590final

The goal of this project is to generate an online 
website to perform simple image processing tasks
This Image Processor Final Project is totally running on cloud. 
The program is constructed by two main part: GUI and Processing Server.
User can use a given url to access our JSReact GUI and then GUI will
communicate with our processing server by POST/GET requests. 

In practice, user need to provide a valid email to start to use the program 
as an identical key. Each time user need to upload one or a set of image using 
the GUI, and then choose a image processing action to brew the uploaded 
image(s). The brewed image will be send back to the GUI, and user can view the 
images on GUI, compare the different, and finally download the images. 
What's more,
the program provides a function for user to see the meta data. 

Attention:
re-input email and re-upload image(s) will replace the images related to
the user, if he/her has already uploaded images. The detailed work flow
of this program is showed in the **sequence diagram** section. 

## sequence diagram
![Image](I'm%20a%20good%20Image%20Processor.png "sequence diagrams")

## Setup and deployment

It should be not hard If you want to run the program on your local 
or virtual machine. the program is constructed by the main part: GUI
and Server. Each part need to run before the program is working. 
The internal server can be run by executing `server.py`. 
The current setting allows the server to operate locally. To 
operate via internet, the last line in the `server.py`
need to be changed.

After download and setup the environment

`git clone https://github.com/briandzt/bme590final.git`

`pip3 install -r requirements.txt`

To run the GUI part, simply use [...]

` `

To run the Server part, simply use 

`gunicorn --bind 127.0.0.1:5000 server:app`

Then, all set and all is well LOL!!! Have a sit and enjoy it :p

