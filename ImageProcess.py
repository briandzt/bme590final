def togray(img):
    import cv2
    gray_image = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    return gray_image


def torgb(img):
    import cv2
    rgb_img = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)


def histequ(img, cmd):
    # before real doc added:
    # This will read in grayscale image in numpy array
    # and return an grayscale numpy array
    from ImageProcess import togray
    import cv2
    w, h, ch = img.shape
    if w > 8 and h > 8:
        clahe = cv2.createCLAHE(clipLimit=2.0,
                                tileGridSize=(8, 8))
    else:
        clahe = cv2.createCLAHE(clipLimit=2.0,
                                tileGridSize=(1, 1))
    if cmd == 'gray':
        img = togray(img)
        outimg = clahe.apply(img)
    if cmd == 'rgb':
        outimg = img
        outimg[:, :, 0] = clahe.apply(img[:, :, 0])
        outimg[:, :, 1] = clahe.apply(img[:, :, 1])
        outimg[:, :, 2] = clahe.apply(img[:, :, 2])
    return outimg


def constrech(img, cmd, perc):
    from ImageProcess import togray
    import numpy as np
    omax = 255
    omin = 0
    if cmd == 'gray':
        img = togray(img)
        immax = np.percentile(img, 100 - perc)
        immin = np.percentile(img, perc)
        img = np.clip(img, immin, immax)
        outimg = (img - immin) * (omax * 1.0 / (immax - immin))
        outimg = outimg.astype(np.uint8)
        print(outimg)
    if cmd == 'rgb':
        outimg = img
        print(img.shape)
        for i in range(3):
            immax = np.percentile(img[:, :, i], 100 - perc)
            immin = np.percentile(img[:, :, i], perc)
            img[:, :, i] = np.clip(img[:, :, i], immin, immax)
            print(img.shape)
            outimg[:, :, i] = (img[:, :, i] - immin) * \
                              (omax * 1.0 / (immax - immin))
            outimg[:, :, i].astype(np.uint8)
    return outimg


def logcomp(img, cmd):
    from ImageProcess import togray
    import numpy as np
    if cmd == 'gray':
        img = togray(img)
        immax = img.max()
        c = 255.0 / np.log(1 + immax)
        outimg = c * np.log(1 + img)
        outimg = outimg.astype(np.uint8)
    if cmd == 'rgb':
        outimg = img
        for i in range(3):
            immax = img[:, :, i].max()
            c = 255.0 / np.log(1 + immax)
            outimg[:, :, i] = c * np.log(1 + img[:, :, i])
        outimg = outimg.astype(np.uint8)
    return outimg


def revimg(img, cmd, mode=0):
    import cv2
    from ImageProcess import togray
    if cmd == 'gray':
        img = togray(img)
    if mode == 0:
        outimg = cv2.flip(img, 0)
    if mode == 1:
        outimg = cv2.flip(img, 1)
    if mode == 2:
        outimg = cv2.flip(img, 0)
        outimg = cv2.flip(img, 1)
    return outimg
