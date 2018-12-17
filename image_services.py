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
    return [cv2.imread(file) for file in glob.glob(directory + "/*")]


def extra_meta(image_dir):
    """extra meta data from images

    Parameters
    ----------
    image_dir

    Returns
    -------

    """
    import cv2
    import numpy as np
    from ImageProcess import gethist
    from ImageProcess import getsize
    import toolbox_jason as jtb
    import base64
    # get original image, its size and its hist
    imageset = getimage(image_dir)
    imageset = [x.astype(np.uint8) for x in imageset]
    togui = {}
    originhist = []
    originsize = []
    count = 0
    for i in imageset:
        retval, buffer = cv2.imencode('.jpg', i)
        jpg_as_text = str(base64.b64encode(buffer))
        jpg_as_text = jpg_as_text[2:-1]
        togui[str(count)] = jpg_as_text
        count += 1
        originhist.append(gethist(i, 'rgb'))
        originsize.append(getsize(i, 'rgb'))
    return togui, originhist, originsize


def format_conversion(dest_dir, img_file, new_format):
    """convert a single image format

    Parameters
    ----------
    dest_dir : string
    basename : string
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
