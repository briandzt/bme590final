# directory
path_prefix = 'tmp/'
original_data_path = '/original/'
brewed_data_path = '/brewed/'
download_path = '/download/'
base_path = {'original': original_data_path,
             'brew': brewed_data_path,
             'download': download_path}

# database
field_list = ['image_data', 'brew_image_data', 'actions', 'timestampss']

# data
valid_data_prefix = 'data:application/zip;base64,'


def validate_data(encoded_string):
    return encoded_string[:len(valid_data_prefix)] == valid_data_prefix


def get_data_path(email, which):
    import toolbox_jason as jtb
    return path_prefix + jtb.string_from_email(email) + base_path[which]


def init_resource(user_id):
    """setup resource for user

        create a user owned directory
        create a user owned database record

    Returns
    -------

    """
    import toolbox_jason as jtb
    import database_func_call as db_func
    user_path = jtb.string_from_email(user_id)
    jtb.create_directory(path_prefix, user_path)
    try:
        db_func.clear_fields(user_id, field_list)
    except db_func.Imageset.DoesNotExist as err:
        pass


def store_data(email, data):
    import toolbox_jason as jtb
    import database_func_call as db_func
    image_data = data[28:]
    local_path = jtb.string_from_email(email)
    usr_path = path_prefix + local_path
    jtb.unzip_buffer(jtb.decode_base64(image_data.encode('utf8')),
                     usr_path + '/original/')
    jtb.unzip_buffer(jtb.decode_base64(image_data.encode('utf8')),
                     usr_path + '/brew/')
    db_func.save_new_record({'user_email': email,
                             'image_data': usr_path + '/original/',
                             'brew_image_data': usr_path + '/brew/'})


def getimage(directory):
    """read images into numpy array

    Parameters
    ----------
    directory

    Returns
    -------

    """
    import glob
    import cv2
    import numpy as np
    imageset = [cv2.imread(file) for file in glob.glob(directory + "/*")]
    return [x.astype(np.uint8) for x in imageset]


def action_stat(email):
    import toolbox_jason as jtb
    import database_func_call as db_func
    actionlist = db_func.query_a_record(email, "actions")
    actionstat = jtb.calcaction(actionlist)
    return actionstat


def update_brew_image(outimg, brew_path):
    import cv2
    import os
    count = 0
    import toolbox_jason as jtb
    jtb.create_directory(brew_path, "")
    for i in outimg:
        filename = str(count) + ".jpg"
        cv2.imwrite(os.path.join(brew_path, filename), i)
        count += 1


def download_preparation(email):
    import toolbox_jason as jtb
    usr_path = jtb.string_from_email(email)
    path = usr_path + '/download/'
    jtb.create_directory(path_prefix, path)
    return path_prefix + path


def format_conversion(dest_dir, img_file, new_format):
    """convert a single image format

    Parameters
    ----------
    dest_dir : string
    img_file : file-like
    new_format: string

    Returns
    -------

    """
    from PIL import Image
    from os.path import basename
    img = Image.open(img_file)
    img.save(dest_dir + basename(img_file).split('.')[0] + '.' + new_format)


def format_conversion_batch(dest_dir, source_dir, new_format):
    """convert multiply image format

    Parameters
    ----------
    dest_dir
    source_dir

    Returns
    -------

    """
    from pathlib import Path
    directory = Path(source_dir)
    for f_name in directory.iterdir():
        format_conversion(dest_dir, f_name, new_format)

