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
        return jsonify({'response': "Cannot find valid key"}), 400
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
    data:application/zip;base64,
    :return:
    """
    import cv2
    import os
    import numpy as np
    from ImageProcess import gethist
    from ImageProcess import getsize
    import base64
    r = request.get_json()
    try:
        email = r['email']
        image_data = r['imageset']
        image_data = image_data[28:]
    except KeyError as err:
        return jsonify({'response': "Cannot find valid key"}), 400
    else:
        local_path = jtb.string_from_email(email)
        if jtb.is_dir_exist('tmp/' + local_path):
            # Define original and brew image save path
            unzip_path = 'tmp/' + local_path + '/original'
            brew_path = 'tmp/' + local_path + '/brew'
            # Check if directory already exist
            if jtb.is_dir_exist(unzip_path):
                jtb.delete_directory(unzip_path)
            if jtb.is_dir_exist(brew_path):
                jtb.delete_directory(brew_path)
            jtb.unzip_buffer(jtb.decode_base64(image_data.encode('utf8')),
                             unzip_path)
            jtb.unzip_buffer(jtb.decode_base64(image_data.encode('utf8')),
                             brew_path)
            db_func.save_new_record({'user_email': email,
                                     'image_data': unzip_path,
                                     'brew_image_data': brew_path})
            # get original image, its size and its hist
            imageset = jtb.getimage(unzip_path)
            imageset = [x.astype(np.uint8) for x in imageset]
            togui = {}
            originhist = []
            originsize = []
            count = 0
            for i in imageset:
                retval, buffer = cv2.imencode('.jpg', i)
                jpg_as_text = str(base64.b64encode(buffer))
                jpg_as_text = jpg_as_text[2:-1]
                togui[str(count)] = jpg_as_text
                count += 1
                originhist.append(gethist(i, 'rgb'))
                originsize.append(getsize(i, 'rgb'))
            return jsonify({'response': 'ok', 'image': togui,
                            'hist': originhist, 'imgsize': originsize}), 200
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
        return jsonify({'response': "Input Key Invalid"}), 400
    else:
        try:
            image_path = db_func.query_a_record(email, field)
        except AttributeError as err:
            return jsonify({'response': "User don't have stored image"}), 400
        else:
            data = jtb.zip_dir_to_buffer(image_path)
            return send_file(
                data,
                mimetype='application/zip',
                as_attachment=True,
                attachment_filename='data.zip'
            ), 200


@app.route("/api/image-processing/action", methods=["POST"])
def action_on_imageset():
    """

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
            for i in imageset:
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
