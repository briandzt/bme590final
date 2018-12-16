import requests
import toolbox_jason as jtb


host_address = 'http://127.0.0.1:5000/'
image_dir = '/Users/zl190/Downloads/DRIVE/test/images/'


def test_api_toolbox_validate_email():
    r_status = requests.post(host_address + 'api/toolbox/validate_email',
                             json={'email': '111@duke.edu'})
    # status = r_status.json()
    print(r_status)


def test_api_upload():
    buffer = jtb.zip_dir_to_buffer(image_dir)
    encoded_buf = jtb.encode_base64(buffer.read())

    print(type(encoded_buf))
    r_status = requests.post(host_address + "api/upload",
                             json={'email': '111@duke.edu',
                                   'imageset': encoded_buf.decode('utf8')})

    status = r_status.json()
    print(status)


def test_api_download():
    r_status = requests.post(host_address + "api/download_zip",
                             json={'email': '111@duke.edu',
                                   'imageset': 'image_data'})
    print(r_status.content)
    jtb.unzip_buffer(r_status.content, 'tmp/unzip')


def main():
    test_api_toolbox_validate_email()
    test_api_upload
    test_api_download


if __name__ == '__main__':
    import sys
    sys.exit(main())
