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
    image_data = fields.CharField(blank=True)
    brew_image_data = fields.CharField(blank=True)
    actions = fields.ListField(blank=True)
    timestamps = fields.ListField(blank=True)


def save_new_record(r):
    """save a new record
    user_email  and image_data must be given
    actions and timestamps field will be set automatically

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
    """get the value of a field

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
    """set a new value for a field

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
        setattr(q, field, old_value)
    else:
        setattr(q, field, value)
    q.save()


def clear_a_field(key, field):
    """set value of a field to None

    Parameters
    ----------
    key
    field

    Returns
    -------

    """
    q = Imageset.objects.raw({"_id": key}).first()
    assert (q is not None)
    setattr(q, field, None)
    q.save()


def clear_fields(key, field_list):
    """set values of multiple fields to None
    not exist fields given by field_list will be ignored

    Parameters
    ----------
    key
    field_list

    Returns
    -------

    """
    for field in field_list:
        try:
            clear_a_field(key, field)
        except AttributeError:
            None
