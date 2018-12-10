#!/usr/bin/env python
# -*- coding:utf-8 -*-
# Author: Jason L

import sys
from pymodm import connect, MongoModel, fields
import datetime

# connect to mongodb database
connect("mongodb://void001:goduke18@ds129484.mlab.com:29484/bme590final")

# database module


class Imageset(MongoModel):
    """
    Data Class used by MongoDB
    """
    user_email = fields.EmailField(primary_key=True)
    imageset = fields.ImageField()
    actions = fields.ListField()
    timestamps = fields.ListField()


def save_new_record(new_record):
    """

    """
    new_imageset = Imageset(
        new_record['user_email'],
        imageset=new_record['image_data'],
        actions=['new_record'],
        timestamps=[datetime.now()])
    new_imageset.save()
    return True


def query_a_record(key, field):
    """

    """
    q = Imageset.objects.raw({"_id": key}).first()
    assert(q is not None)
    return q[field]


def update_a_record(key, field, value):
    """

    """
    q = Imageset.objects.raw({"_id": key}).first()
    assert(q is not None)
    q[field] = value
    q.save()
    return True


def main():
    return 0


if __name__ == '__main__':
    sys.exit(main())
