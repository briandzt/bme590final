# create a unique directory according to an email
# --------------------------------------------
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
    if is_dir_exist(prefix + path):
        delete_directory(prefix+path)
    os.makedirs(prefix+path)


def is_dir_exist(prefix, path):
    import os
    return os.path.isdir(prefix + path)


# read & write file from/into buffer in bytes
# --------------------------------------------
def write_bytes_to_file(buffer, filename):
    with open(filename, mode='wb') as file:
        file.write(buffer)


def read_file_in_bytes(filename):
    from io import BytesIO
    buffer_io = BytesIO()
    with open(filename, mode='rb') as file:
        buffer_io.write(file.read())
    buffer_io.seek(0)
    return buffer_io.read()


# zip & unzip from/to a directory
# ---------------------------------------
def zip_dir_to_file(name_of_zipfile, source_dir):
    """

    """
    import shutil
    shutil.make_archive(name_of_zipfile, 'zip', source_dir)


def upzip_file(name_zipfile, dest_dir):
    import zipfile
    with zipfile.ZipFile(name_zipfile) as zf:
        zf.extractall(dest_dir)


def unzip_buffer(buffer, dest_dir):
    import zipfile
    from io import BytesIO
    z = zipfile.ZipFile(BytesIO(buffer))
    z.extractall(dest_dir)


def zip_dir_to_buffer(dir):
    from io import BytesIO
    import zipfile
    data = BytesIO()
    with zipfile.ZipFile(data, mode='w') as z:
        for f_name in dir.iterdir():
            z.write(f_name)
    data.seek(0)
    return data


# encode & decode
# ---------------------------------------
def encode_base64(buffer):
    import base64
    return base64.encodebytes(buffer)


def decode_base64(buffer):
    import base64
    return base64.decodebytes(buffer)


# test
# ----------------------------------------
def main():
    email = '111@duke.edu'
    if is_a_validate_email(email):
        path = string_from_email(email)
        create_directory('tmp/', path)


if __name__ == '__main__':
    import sys
    sys.exit(main())
