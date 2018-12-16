# bme590final

Front End Walkthrough
[Front End Walkthrough]: https://drive.google.com/drive/folders/15radViWQW0fC2GxgFO_NSzIB0-7BMIaW?usp=sharing

The goal of this project is to generate an online 
website to perform simple image processing tasks. This Image Processor Final Project is totally running on cloud. 
The program is constructed by two main parts: the GUI and the Processing Server. User can use a given url to access our ReactJS GUI and then the GUI will communicate with our processing server by POST/GET requests. 

In practice, user needs to provide a valid email to start to use the program. Each time the user needs to upload one image or a set of images in a zip file using the GUI. The user then chooses an image processing method to brew the uploaded 
image(s). The brewed image(s) will then be sent back to the GUI, and user can view the image(s) on the GUI, compare them with the original, and finally download the images. The program also allows the user to view the meta data of the function (timestamp, processing time, and file size. 

Attention:
Re-inputting the same email or re-uploading image(s) will replace the images currently stored in the database for that  user if he/her has already uploaded images. The detailed work flow
of this program is showed in the **sequence diagram** section. 

## sequence diagram
![Image](I'm%20a%20good%20Image%20Processor.png "sequence diagrams")

## Setup and deployment

The program is not difficult to run on your local 
or virtual machine. the program is constructed by the main parts: the GUI and the Server. Each part needs to run before the program will work.  The internal server can be run by executing `python server.py` from a python environment. The current setting allows the server to operate locally. To 
operate via internet, the last line in the `server.py`
need to be updated with the proper host url.

After download and setup the environment

`git clone https://github.com/briandzt/bme590final.git`

`pip3 install -r requirements.txt`

To run the GUI part, simply use [...]

`npm run start`
Run this command from the base directory of the react app (final_retry)

To run the Server part, simply use 

`gunicorn --bind 127.0.0.1:5000 server:app`

Then, all set and all is well LOL!!! Have a sit and enjoy it :p
