#!/usr/bin/env python
# -*- coding:utf-8 -*-
# Author: Jason L

from flask import Flask, jsonify, request
import toolbox_jason as jtb
import database_func_call as db_func

app = Flask(__name__)


@app.route("/api/new_imageset", methods=["POST"])
def new_imageset():
    """

    expected request data: POST /api/new_imageset with
    {
        "user_email": "suyash.kumar@duke.edu",
        "imageset": 'adfaawerwer123', # in base64 format
    }

    :return: 400 if data entry is not valid, 200 if data is successfully saved
    """
    r = request.get_json()
    entry_to_check = {'user_email': "suyash.kumar@duke.edu",
                      'image_data': '\sdfafeafafe'}
    try:
        jtb.validate_json_data_entry(r, entry_to_check)
    except ValueError or TypeError as err:
        print("bad json, saving interupt".format(err))
    else:
        db_func.save_new_record(r)
        return str(200)


@app.route("/api/query_imageset", methods=["POST"])
def query_imageset():
    """

    Expected request data: POST /api/query_imageset with
    {
        "user_email": "suyash.kumar@duke.edu"
        "field": "original"
    }

    :return: 400 if data entry is not valid, 200 if data is successfully saved
    """
    r = request.get_json()
    entry_to_check = {
        "user_email": "suyash.kumar@duke.edu",
        "field": "original"
    }
    try:
        jtb.validate_json_data_entry(r, entry_to_check)
    except ValueError or TypeError as err:
        print("bad json, query interupt".format(err))
    else:
        return jsonify(db_func.query_a_record(r.key, r.field))


@app.route("/api/actions/<action>", methods=["POST"])
def action_on_imageset():
    """

    """
    # check json fields
    # query image_data from database
    # send image_date to DIP_alg and receive the brewed data
    # update the brewed image_data to database


if __name__ == '__main__':
    app.run()
