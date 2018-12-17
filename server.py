#!/usr/bin/env python
# -*- coding:utf-8 -*-
# Author: Jason L

"""An simple image processing server

This server provides the following basic functions:
    images uploading,
    meta data extraction
    image processing,
    download the brewed images

by the following four api:
    /api/toolbox/validate_email
    /api/upload
    /api/download_zip
    /api/image-processing/action


.. _Flask https://www.flaskapi.org

"""
from flask import Flask, jsonify, request, send_file
import toolbox_jason as jtb
import database_func_call as db_func
from flask_cors import CORS
import server_services as ss

app = Flask(__name__)


@app.route("/api/toolbox/validate_email", methods=["POST"])
def is_a_validate_email():
    """validate if a string has a email format

    check if the post json data contains a `email` field
    check if the `email` field contains a email format string

    Returns
    -------
    json, status code
        the `response` field inside json format contains detailed message
        status code 400 if the request can't be handled by the server
                    200 if the request can be handled by the server
    """
    r = request.get_json()
    try:
        email = r['email']
    except KeyError as err:
        return jsonify({'response': "Cannot find valid key"}), 400
    else:
        if jtb.is_a_validate_email(email):
            return jsonify({'response': 'ok'}), 200
        else:
            return jsonify({'response': 'invalid email'}), 200


@app.route("/api/upload", methods=["POST"])
def new_imageset():
    """handle new uploaded images

    the request should contain `user_email` and `imageset` fields
    `user_email` and `imageset` will be validate and used to setup resource
        create a user owned directory
        create a user owned database record
        stored the images
        extra and return meta data of image

    Returns
    -------
    json, status code
    """
    r = request.get_json()
    try:
        email = r['email']
        image_data = r['imageset']
    except KeyError as err:
        return jsonify({'response': "Cannot find valid key"}), 400
    else:
        if jtb.is_a_validate_email(email) and ss.validate_data(image_data):
            ss.init_resource(email)
            ss.store_data(email, image_data)
            import image_services as img_serv
            data_path = ss.get_data_path(email, 'original')
            togui, originhist, originsize = img_serv.extra_meta(data_path)
            return jsonify({'response': 'ok', 'image': togui,
                            'hist': originhist, 'imgsize': originsize}), 200
        else:
            return jsonify({'response': 'the user does not exist'}), 200


@app.route("/api/download_zip", methods=["POST"])
def download():
    """provide a download function for original and brewed images

    Returns
    -------

    """
    r = request.get_json()
    try:
        email = r['email']
        kind = r['which']
        fmt = r['format']
    except KeyError as err:
        return jsonify({'response': "Input Key Invalid"}), 400
    else:
        try:
            image_path = db_func.query_a_record(email, kind)
        except AttributeError as err:
            return jsonify({'response': "User don't have stored image"}), 400
        else:
            path = ss.get_data_path(email, 'download')
            import image_services as img_serv
            img_serv.format_conversion_batch(path, image_path, fmt)
            data = jtb.zip_dir_to_buffer(path)
            return send_file(
                data,
                mimetype='application/zip',
                as_attachment=True,
                attachment_filename='data.zip'
            ), 200


@app.route("/api/image-processing/action", methods=["POST"])
def action_on_imageset():
    """deal with image processing request

    """
    # check json fields
    # query image_data from database
    # send image_date to DIP_alg and receive the brewed data
    # update the brewed image_data to database
    from ImageProcess import histequ
    from ImageProcess import revimg
    from ImageProcess import contraststretch
    from ImageProcess import logcomp
    from ImageProcess import gethist
    from ImageProcess import getsize
    from datetime import datetime
    import numpy as np
    import cv2
    import base64
    import os
    r = request.get_json()
    try:
        email = r['email']
        action = r['action']
    except KeyError as err:
        return jsonify({'response': "Invalid Key"}), 400
    else:
        try:
            brew_path = db_func.query_a_record(email, 'brew_image_data')
        except AssertionError as err:
            return jsonify({'response': "No process image stored"}), 400
        else:
            imageset = jtb.getimage(brew_path)
            imageset = [x.astype(np.uint8) for x in imageset]
            outimg = []
            outhist = []
            outsize = []
            if action[0] == 'HistEq':
                for i in imageset:
                    outimg.append(histequ(i, action[1]))
            elif action[0] == 'ContStretch':
                for i in imageset:
                    outimg.append(contraststretch(i, action[1], action[2]))
            elif action[0] == 'RevVid':
                for i in imageset:
                    outimg.append(revimg(i, action[1]))
            elif action[0] == 'LogComp':
                for i in imageset:
                    outimg.append(logcomp(i, action[1]))
            else:
                return jsonify({'response': 'invalid action name'}), 200
            for i in outimg:
                outhist.append(gethist(i, action[1]))
                outsize.append(getsize(i, action[1]))
            # Update record in database and setup dict to send back to gui
            db_func.update_a_record(email, 'timestamps', datetime.now())
            db_func.update_a_record(email, 'actions', action)
            jtb.create_directory(brew_path, "")
            count = 0
            togui = {}
            togui["image"] = {}
            togui["brew_hist"] = outhist
            togui["imgsize"] = outsize
            for i in outimg:
                filename = str(count) + ".jpg"
                cv2.imwrite(os.path.join(brew_path, filename), i)
                retval, buffer = cv2.imencode('.jpg', i)
                jpg_as_text = str(base64.b64encode(buffer))
                jpg_as_text = jpg_as_text[2:-1]
                togui["image"][str(count)] = jpg_as_text
                count += 1
            actionlist = db_func.query_a_record(email, "actions")
            actionstat = jtb.calcaction(actionlist)
            togui["actions"] = actionstat
            togui['reponse'] = 'ok'
            return jsonify(togui), 200


if __name__ == '__main__':
    CORS(app)
    app.run()
