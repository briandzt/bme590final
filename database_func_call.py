#!/usr/bin/env python
# -*- coding:utf-8 -*-
# Author: Jason L

import sys
from pymodm import connect, MongoModel, fields
from datetime import datetime

# connect to mongodb database
connect("mongodb://void001:goduke18@ds129484.mlab.com:29484/bme590final")


# database module


class Imageset(MongoModel):
    """Data Class used by MongoDB

    """
    user_email = fields.EmailField(primary_key=True)
    image_data = fields.CharField()
    brew_image_data = fields.CharField()
    actions = fields.ListField()
    timestamps = fields.ListField()


def save_new_record(r):
    """save a new record using email as key and image_path
    add actions and timestamps field automatically

    Parameters
    ----------
    r: dictionary contains 'user_email' and 'image_data' field

    Returns
    -------
    True
    """
    q = Imageset(
        r['user_email'],
        image_data=r['image_data'],
        brew_image_data=r['brew_image_data'],
        actions=['upload'],
        timestamps=[datetime.now()])
    q.save()
    return True


def query_a_record(key, field):
    """query the value of a field

    Parameters
    ----------
    key: string
    field: string

    Returns
    -------
    query value
    """
    q = Imageset.objects.raw({"_id": key}).first()
    assert (q is not None)
    return getattr(q, field)


def update_a_record(key, field, value):
    """update a record

    Parameters
    ----------
    key: string
    field: string
    value: according to the filed

    Returns
    -------

    """
    q = Imageset.objects.raw({"_id": key}).first()
    assert (q is not None)
    old_value = getattr(q, field)
    if isinstance(old_value, list):
        old_value.append(value)
    else:
        setattr(q, field, value)
    q.save()
