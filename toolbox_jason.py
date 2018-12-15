# create a unique directory according to an email
# --------------------------------------------


def is_a_validate_email(email):
    """check whether the input string has a email-style format

    Parameters
    ----------
    email: string

    Returns
    -------
    True or False
    """
    import validate_email
    return validate_email.validate_email(email)


def string_from_email(email):
    """generate a unique path_string from a valid email_address

    Parameters
    ----------
    email: string

    Returns
    -------
    a valid path_string
    """
    path_elems = []
    split_elems = email.split('@')  # say '111@duke.edu' -> '111', 'duke.edu'
    for elem in split_elems:
        path_elems.append(elem.split('.')[0])
    return '_'.join(path_elems)


def delete_directory(path):
    """delete a directory if it's exist, otherwise do nothing

    Parameters
    ----------
    path: string

    Returns
    -------

    """
    if is_dir_exist(path):
        import shutil
        try:
            shutil.rmtree(path)
        except OSError as e:
            print("Error: %s - %s." % (e.filename, e.strerror))


def create_directory(prefix, path):
    """Create a directory, if it's already exist, delete it then create it

    Parameters
    ----------
    prefix: string
    path: string

    Returns
    -------

    """
    import os
    if is_dir_exist(prefix + path):
        delete_directory(prefix + path)
    os.makedirs(prefix+path)


def is_dir_exist(path):
    """check whether a directory already exist

    Parameters
    ----------
    path: string

    Returns
    -------
    Bool: True or False
    """
    import os
    return os.path.isdir(path)


# read & write file from/into buffer in bytes
# --------------------------------------------
def write_bytes_to_file(buffer, filename):
    """write a buffer into file

    Parameters
    ----------
    buffer: bytes buffer
    filename: string

    Returns
    -------

    """
    with open(filename, mode='wb') as file:
        file.write(buffer)


def read_file_in_bytes(filename):
    """read file into file-like object

    Parameters
    ----------
    filename: string

    Returns
    -------
    buffer: bytes

    """
    from io import BytesIO
    buffer_io = BytesIO()
    with open(filename, mode='rb') as file:
        buffer_io.write(file.read())
    buffer_io.seek(0)
    return buffer_io.read()


# zip & unzip from/to a directory
# ---------------------------------------
def zip_dir_to_file(name_of_zipfile, source_dir):
    """zip an entire directory into a zip file

    Parameters
    ----------
    name_of_zipfile: string
    source_dir: string

    Returns
    -------

    """
    import shutil
    shutil.make_archive(name_of_zipfile, 'zip', source_dir)


def upzip_file(name_zipfile, dest_dir):
    """unzip a zip file into destination directory

    Parameters
    ----------
    name_zipfile: string
    dest_dir: string

    Returns
    -------

    """
    import zipfile
    with zipfile.ZipFile(name_zipfile) as zf:
        zf.extractall(dest_dir)


def unzip_buffer(buffer, dest_dir):
    """unzip a file-like object into a given directory

    Parameters
    ----------
    buffer: file-like object, like io.BytesIO
    dest_dir: string

    Returns
    -------

    """
    import zipfile
    from io import BytesIO
    z = zipfile.ZipFile(BytesIO(buffer))
    z.extractall(dest_dir)


def zip_dir_to_buffer(dir_string):
    """zip a directory into an file-like object

    Parameters
    ----------
    dir_string: directory to zip

    Returns
    -------

    """
    from io import BytesIO
    from pathlib import Path
    from os.path import basename
    import zipfile
    data = BytesIO()
    dir = Path(dir_string)
    with zipfile.ZipFile(data, mode='w') as z:
        for f_name in dir.iterdir():
            z.write(f_name, basename(f_name))
    data.seek(0)
    return data


# encode & decode
# ---------------------------------------
def encode_base64(buffer):
    """encode an binary-like object

    Parameters
    ----------
    buffer: binary-like object

    Returns
    -------
    encoded binary-like object
    """
    import base64
    return base64.encodebytes(buffer)


def decode_base64(buffer):
    """decode an encoded binary like object

    Parameters
    ----------
    buffer: encoded binary-like object

    Returns
    -------
    decoded binary-like object
    """
    import base64
    return base64.b64decode(buffer)
