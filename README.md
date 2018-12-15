# bme590final
This Image Processor Final Project is totally running on cloud. 
User can use a given url to access our JSReact GUI and the GUI will
communicate with our server by POST/GET requests. In practice, user
need to provide a valid email to start to use the program as an identical 
key. Everytime user need to upload one or a set of image using the GUI, 
and then choose a image processing action to brew the uploaded image(s).
The brewed image will be send back to the GUI, and user can view the images
on GUI, compare the different, and finally download the images. What's more,
the program provides a function for user to see the meta data. Attention:
re-input email and re-upload image(s) will replace the images related to
the user, if he/her has already uploaded images. The detailed work flow
of this program is showed in the **sequence diagram** section. 

## sequence diagram
![Image](I'm%20a%20good%20Image%20Processor.png "sequence diagrams")

## Setup and deployment
It should be not hard If you want to run the program on your local 
or virtual machine. the program is constructed by the main part: GUI
and Server. Each part need to run before the program is working.

After download and setup the environment

`git clone https://github.com/briandzt/bme590final.git`

`pip3 install -r requirements.txt`

To run the GUI part, simply use [...]

` `

To run the Server part, simply use 

`gunicorn --bind 127.0.0.1:5000 server:app`

Then, all set and all is well LOL!!! Have a sit and enjoy it :p

