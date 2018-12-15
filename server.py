#!/usr/bin/env python
# -*- coding:utf-8 -*-
# Author: Jason L

from flask import Flask, jsonify, request, send_file
import toolbox_jason as jtb
import database_func_call as db_func
from flask_cors import CORS

app = Flask(__name__)


@app.route("/api/toolbox/validate_email", methods=["POST"])
def is_a_validate_email():
    r = request.get_json()
    try:
        email = r['email']
    except KeyError as err:
        return jsonify({'response': err}), 400
    else:
        if jtb.is_a_validate_email(email):
            local_path = jtb.string_from_email(email)
            jtb.create_directory('tmp/', local_path)
            return jsonify({'response': 'ok'}), 200
        else:
            return jsonify({'response': 'invalid email'}), 200


@app.route("/api/upload", methods=["POST"])
def new_imageset():
    """

    expected request data:
    {
        "user_email": "suyash.kumar@duke.edu",
        "imageset": b'adfaawerwer123'
    }

    :return:
    """
    r = request.get_json()
    try:
        email = r['email']
        image_data = r['imageset']
    except KeyError as err:
        return jsonify({'response': err}), 400
    else:
        local_path = jtb.string_from_email(email)
        if jtb.is_dir_exist('tmp/', local_path):
            # Define original and brew image save path
            unzip_path = 'tmp/'+local_path+'/original'
            brew_path = 'tmp/'+local_path+'/brew'
            # Check if directory already exist
            jtb.unzip_buffer(jtb.decode_base64(image_data.encode('utf8')),
                             unzip_path)
            db_func.save_new_record({'user_email': email,
                                     'image_data': unzip_path})
            return jsonify({'response': 'ok'}), 200
        else:
            return jsonify({'response': 'the user does not exist'}), 200


@app.route("/api/download_zip", methods=["POST"])
def download():
    """

    :return:
    """
    r = request.get_json()
    try:
        email = r['email']
        field = r['imageset']
    except KeyError as err:
        return jsonify({'response': err}), 400
    else:
        try:
            image_path = db_func.query_a_record(email, field)
        except AttributeError as err:
            return jsonify({'response': err}), 400
        else:
            data = jtb.zip_dir_to_buffer(image_path)
            return send_file(
                data,
                mimetype='application/zip',
                as_attachment=True,
                attachment_filename='data.zip'
            )


@app.route("/api/image-processing/action", methods=["POST"])
def action_on_imageset():
    """

    """
    # check json fields
    # query image_data from database
    # send image_date to DIP_alg and receive the brewed data
    # update the brewed image_data to database
    from toolbox_jason import getimage
    from ImageProcess import *
    from datetime import datetime
    r = request.get_json()
    try:
        email = r['email']
        action = r['action']
    except KeyError as err:
        return jsonify({'response': err}), 400
    else:
        try:
            brew_path = db_func.query_a_record(email, 'brew_image_data')
        except AssertionError as err:
            return jsonify({'response': err}), 400
        else:
            imageset = getimage(brew_path)
            outimg = []
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
            # Update record in database
            db_func.update_a_record(email, 'timestamps', datetime.now())
            db_func.update_a_record(email, 'actions', action)
            jtb.delete_directory(brew_path)

            original_path = db_func.query_a_record(email, 'image_data')
            original_imageset = getimage(original_path)

            historiginal = []

if __name__ == '__main__':
    CORS(app)
    app.run()
