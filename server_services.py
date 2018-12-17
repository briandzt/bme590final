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
    db_func.clear_fields(user_id, field_list)


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


def download_preparation(email):
    import toolbox_jason as jtb
    usr_path = jtb.string_from_email(email)
    jtb.create_directory(path_prefix, usr_path + '/download/')
