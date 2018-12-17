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
            print(data_path)
            imageset = ss.getimage(data_path)
            originhist, originsize = img_serv.extra_meta(imageset)
            img_dict = img_serv.convert_image_to_dict(imageset)
            return jsonify({'response': 'ok', 'image': img_dict,
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
            print("request json is {}".format(r))
            print("email is {}, kind is {}, path is {}".format(email, kind, image_path))
        except AttributeError as err:
            return jsonify({'response': "User don't have stored image"}), 400
        else:
            path = ss.download_preparation(email)
            ss.format_conversion_batch(path, image_path, fmt)
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
    r = request.get_json()
    try:
        email = r['email']
        action_j = r['action']
    except KeyError as err:
        return jsonify({'response': "Invalid Key"}), 400
    else:
        try:
            brew_path = db_func.query_a_record(email, 'brew_image_data')
        except AssertionError as err:
            return jsonify({'response': "No process image stored"}), 400
        else:
            action = []
            for element in action_j['action']:
                action.append(element)
            import image_services as img_serv
            if not img_serv.validate_action(action[0]):
                return jsonify({'response': 'invalid action name'}), 200
            else:
                # Update record in database and setup dict to send back to gui
                from datetime import datetime
                db_func.update_a_record(email,
                                        'timestamps',
                                        str(datetime.now().timestamp()))
                db_func.update_a_record(email,
                                        'actions',
                                        action)
                # process the image
                imageset = ss.getimage(brew_path)
                outimg = img_serv.image_processing(action, imageset)
                # replace the image in brew_path
                ss.update_brew_image(outimg, brew_path)
                #
                outhist = img_serv.get_hists(action[1], outimg)
                outsize = img_serv.get_sizes(action[1], outimg)
                actionstat = ss.action_stat(email)
                togui = img_serv.ret_data_wrapper(outimg,
                                                  outhist,
                                                  outsize,
                                                  actionstat)
                return jsonify(togui), 200


if __name__ == '__main__':
    CORS(app)
    app.run()
