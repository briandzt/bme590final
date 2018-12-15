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
    """
    Data Class used by MongoDB
    """
    user_email = fields.EmailField(primary_key=True)
    image_data = fields.CharField()
    actions = fields.ListField()
    timestamps = fields.ListField()


def save_new_record(r):
    """

    """
    q = Imageset(
        r['user_email'],
        image_data=r['image_data'],
        actions=['upload'],
        timestamps=[datetime.now()])
    q.save()
    return True


def query_a_record(key, field):
    """

    """
    q = Imageset.objects.raw({"_id": key}).first()
    assert(q is not None)
    return getattr(q, field)


def update_a_record(key, field, value):
    """

    """
    q = Imageset.objects.raw({"_id": key}).first()
    assert(q is not None)
    old_value = getattr(q, field)
    if isinstance(old_value, list):
        old_value.append(value)
    else:
        setattr(q, field, value)
    q.save()


def main():
    """
    """
    # r = {'user_email': '111@duke.edu', 'image_data': '200dfjalejroiwqjf300'}
    # save_new_record(r)

    # update_a_record('111@duke.edu', 'image_data', '200dfjalejroiwqjf200')
    # update_a_record('111@duke.edu', 'actions', 'hist')
    # q = query_a_record('111@duke.edu', 'actions')
    # print(q)
    r = {'user_email': '111@duke.edu', 'image_path': '200dfjalejroiwqjf300'}
    q = Imageset(
        r['user_email'],
        image_data=r['image_path'],
        actions=['upload'],
        timestamps=[datetime.now()])
    getattr(q, 'email')


if __name__ == '__main__':
    sys.exit(main())
