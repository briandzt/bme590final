def getimage(directory):
    import glob
    import cv2
    return [cv2.imread(file) for file in glob.glob(directory+"/*")]


def main():

    print(type(images))
    print(images)


if __name__ == '__main__':
    import sys
    sys.exit(main())
