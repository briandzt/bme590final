action_list = ['HistEq', 'ContStretch', 'RevVid', 'LogComp']


def validate_action(action):
    if action in action_list:
        return True
    else:
        return False


def get_hists(para1, imgset):
    from ImageProcess import gethist
    outhist = []
    for i in imgset:
        outhist.append(gethist(i, para1))
    return outhist


def get_sizes(para1, imgset):
    from ImageProcess import getsize
    outsize = []
    for i in imgset:
        outsize.append(getsize(i, para1))
    return outsize


def extra_meta(imageset):
    """extra meta data from images

    get original image, its size and its hist

    Parameters
    ----------
    imageset : np array

    Returns
    -------

    """
    hist = get_hists('rgb', imageset)
    size = get_sizes('rgb', imageset)

    return hist, size


def convert_image_to_dict(imageset):
    """convert imageset from numpy array to a dict

    the dict contains each each image as base64 encoded string

    Parameters
    ----------
    imageset

    Returns
    -------

    """
    import cv2
    import base64
    image_dict = {}
    count = 0
    for i in imageset:
        retval, buffer = cv2.imencode('.jpg', i)
        jpg_as_text = str(base64.b64encode(buffer))
        jpg_as_text = jpg_as_text[2:-1]
        image_dict[str(count)] = jpg_as_text
        count += 1
    return image_dict


def hist_eq(para1, imgset):
    from ImageProcess import histequ
    outimg = []
    for i in imgset:
        outimg.append(histequ(i, para1))
    return outimg


def con_stretch(para1, para2, imgset):
    from ImageProcess import contraststretch
    outimg = []
    for i in imgset:
        outimg.append(contraststretch(i, para1, para2))
    return outimg


def rev_img(para1, imgset):
    from ImageProcess import revimg
    outimg = []
    for i in imgset:
        outimg.append(revimg(i, para1))
    return outimg


def log_comp(para1, imgset):
    from ImageProcess import logcomp
    outimg = []
    for i in imgset:
        outimg.append(logcomp(i, para1))
    return outimg


def apply_actions(action, img):
    if action[0] == 'HistEq':
        return hist_eq(action[1], img)
    elif action[0] == 'ContStretch':
        return con_stretch(action[1], action[2], img)
    elif action[0] == 'RevVid':
        return rev_img(action[1], img)
    elif action[0] == 'LogComp':
        return log_comp(action[1], img)


def image_processing(action, imageset):
    outimg = apply_actions(action, imageset)
    return outimg


def ret_data_wrapper(outimg, outhist, outsize, actionstat):
    togui = {}
    togui["image"] = convert_image_to_dict(outimg)
    togui["brew_hist"] = outhist
    togui["imgsize"] = outsize

    togui["actions"] = actionstat
    togui['response'] = 'ok'
    return togui
