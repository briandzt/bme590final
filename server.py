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
    """validate if a string has an email format

    the post json data should contains a `email` field

    Returns
    -------
    json
        {'response': "Cannot find valid key"} if request contains no `email`
        {'response': 'ok'} if the string has an email form
        {'response': 'invalid email'} if the string doesn't have an email form
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

    the post json data should contain `user_email` and `imageset` fields
    `user_email` and `imageset` will be validate and used to setup resource.
        - create a user owned directory
        - create a user owned database record
        - stored the images
        - extra and return meta data of image

    Returns
    -------
    json
        {'response': "Cannot find valid key"}
        {'response': 'invalid email or corrupted data'}
        {'response': 'ok', 'image': img_dict,
                            'hist': hist,
                            'imgsize': size}

    Notes
        img_dict is a dictionary, each elem has a key from 0 to n-1,
        and a value as a str, which encoded by cv2.imencode('.jpg')
        and then b64encode

        hist is a list, each elem of which represents an image, which
        contains three list elems for rgb or one list elem for gray

        imgsize is a list, each elem of which represents an image, which
        contains [h, w]
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
            hist, size = img_serv.extra_meta(imageset)
            img_dict = img_serv.convert_image_to_dict(imageset)
            return jsonify({'response': 'ok', 'image': img_dict,
                            'hist': hist, 'imgsize': size}), 200
        else:
            return jsonify({'response': 'invalid email or corrupted data'}), \
                   200


@app.route("/api/download_zip", methods=["POST"])
def download():
    """provide a download function for original and brewed images

    the post request should contains 'email`, `which` and `format` fields.
    `which` is 'image_data' for original image download,
        or 'brew_image_data' for brewed images
    `format` is a common format like `jpg`

    Returns
    -------
    json or binary data
        {'response': "Input Key Invalid"}
        {'response': "User don't have stored image"}
        binary data
            it can be get by requests.content and should be write to a file
            with a `.zip` suffix
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
    """apply image processing methods on the stored images

    the post request should contains `email` and `action` field
    `action` should be one action in the list:
        ['HistEq', 'ContStretch', 'RevVid', 'LogComp']

    Returns
    -------
    json
        {'response': "Invalid Key"}
        {'response': "No process image stored"}
        {'response': 'invalid action name'}
        {'response': ok, "image":dict, "brew_hist":list,
                "imgsize":list, "actions":dict}

    Notes
        image is a dictionary, each elem has a key from 0 to n-1,
        and a value as a str, which encoded by cv2.imencode('.jpg')
        and then b64encode

        brew_hist is a list, each elem of which represents an image, which
        contains three list elems for rgb or one list elem for gray

        imgsize is a list, each elem of which represents an image, which
        contains [h, w]

        actions has the form like
            {'ContStretch': 0, 'HistEq': 0, 'LogComp': 0, 'RevVid': 1}
    """
    r = request.get_json()
    try:
        email = r['email']
        action_j = r['action']
        print(action_j)
    except KeyError as err:
        return jsonify({'response': "Invalid Key"}), 400
    else:
        try:
            brew_path = db_func.query_a_record(email, 'brew_image_data')
        except AssertionError as err:
            return jsonify({'response': "No process image stored"}), 400
        else:
            action = []
            if isinstance(action_j, dict):
                action_list = action_j['action']
                for element in action_list:
                    action.append(element)
            if isinstance(action_j, list):
                action = action_j
            print(action)
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
