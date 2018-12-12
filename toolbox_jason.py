def validate_json_data_entry(request_json, entry_dict):
    """
    check if the request json data has the expected entry and the expected type
    :param request_json: json data to check
    :param entry_dict: dictionary has the format {entry:example_data}
    :return:
    """
    for entry_name, data in entry_dict.items():
        if entry_name not in request_json:
            raise ValueError("No entry in the request json data")
        if isinstance(type(entry_dict[entry_name]), type(data)):
            raise TypeError("Data Type is not as expected")
    return True


def is_a_validate_email(email):
    from validate_email import validate_email
    return validate_email(email)


def string_from_email(email):
    path_elems = []
    split_elems = email.split('@')  # say '111@duke.edu' -> '111', 'duke.edu'
    print(split_elems)
    for elem in split_elems:
        path_elems.append(elem.split('.')[0])
    print(path_elems)
    return '_'.join(path_elems)


def delete_directory(path):
    import shutil
    try:
        shutil.rmtree(path)
    except OSError as e:
        print("Error: %s - %s." % (e.filename, e.strerror))


def create_directory(prefix, path):
        import os
        if os.path.exists(prefix + path):
            delete_directory(prefix+path)
        os.makedirs(prefix+path)


def main():
    email = '111@duke.edu'
    if is_a_validate_email(email):
        path = string_from_email(email)
        create_directory('tmp/', path)

    # buffer = zip_a_diretory_into_buffer('/Users/zl190/Downloads/DRIVE/test/images')
    # create_directory('', 'tmp')
    # upzip_buffer_into_directory(buffer, 'tmp')


if __name__ == '__main__':
    import sys
    sys.exit(main())