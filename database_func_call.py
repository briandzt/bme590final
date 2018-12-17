#!/usr/bin/env python
# -*- coding:utf-8 -*-
# Author: Jason L
"""wrapper of mongoDB database operations

This module provides an database module and basic database operations of it


Module Attributes
----------
user_email: EmailField(key)
    expect a unique and valid email_format string

image_data: CharField
    expect a path_string where the original data stored

brew_image_data: CharField
    expect a path_string where the brewed data stored

actions: ListField
    expect as ['upload', 'action1', 'action2', ...]

timestamps: ListField
    expect as [timestamp0, timestamp1, timestamp2, ...]


Database Operations
-----------
operation on record
    save_new_record(r): create a new record

    # Todo:
    query a record
    delete a record

operation on field
    query_a_record(key, field): get the value of a field

    update_a_record(key, field): update the value of a field

    clear_a_field(key, field): clear the value of a field

    clear_fields(key, field_list): clear the value of multiply field


.. _PyMODM https://pymodm.readthedocs.io/en/latest/
.. _MongoDB https://docs.mongodb.com

"""


from pymodm import connect, MongoModel, fields
from datetime import datetime

# connect to mongodb database
connect("mongodb://void001:goduke18@ds129484.mlab.com:29484/bme590final")


# database module
class Imageset(MongoModel):
    """Data Module used by MongoDB

    """
    user_email = fields.EmailField(primary_key=True)
    image_data = fields.CharField(blank=True)
    brew_image_data = fields.CharField(blank=True)
    actions = fields.ListField(blank=True)
    timestamps = fields.ListField(blank=True)


def save_new_record(r):
    """create a new record

    Fields `user_email` and `image_data` must be given, while
    `actions` and `timestamps` field will be set automatically

    Parameters
    ----------
    r : dict
        must contains `user_email` and `image_data` field

    Returns
    -------

    """
    q = Imageset(
        r['user_email'],
        image_data=r['image_data'],
        brew_image_data=r['brew_image_data'],
        actions=['upload'],
        timestamps=[datetime.now()])
    q.save()


def query_a_record(key, field):
    """get the value of a field

    Parameters
    ----------
    key : string
    field : string

    Returns
    -------
    None, string or list
        None is not exist,
        else string or list depends on the query field
    """
    q = Imageset.objects.raw({"_id": key}).first()
    assert (q is not None)
    return getattr(q, field)


def update_a_record(key, field, value):
    """set a new value for a field

    update a new value for CharField
    append the new value for ListField

    Parameters
    ----------
    key : string
    field : string
    value : string

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
    """clear the value of a field

    set value of a field to None

    Parameters
    ----------
    key : string
    field : string

    Returns
    -------

    """
    q = Imageset.objects.raw({"_id": key}).first()
    assert (q is not None)
    setattr(q, field, None)
    q.save()


def clear_fields(key, field_list):
    """clear the value of multiply field

    set values of multiple fields to None,
    not exist fields given by field_list will be ignored

    Parameters
    ----------
    key : string
    field_list : list

    Returns
    -------

    """
    for field in field_list:
        try:
            clear_a_field(key, field)
        except AttributeError:
            pass
