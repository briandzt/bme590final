import requests
import toolbox_jason as jtb
import pytest

host_address = 'http://127.0.0.1:5005/'
image_dir = '/Users/zl190/Downloads/DRIVE/test/images/'
image_dir2 = '/Users/zl190/Downloads/drive-download-20181215T193509Z-001/60'


@pytest.mark.parametrize("test_input, expected", {
    ('111@duke.edu', 'ok'),
    ('qwer@dule.edu', 'ok'),
    ('sdfds@sdee.com', 'ok'),
    ('111.com', 'invalid email'),
    ('111@aaa', 'ok'),
    ('111111', 'invalid email'),
    ('@sdfasfsdf', 'invalid email'),
    ('1111@', 'invalid email'),
    ('111@@111', 'invalid email'),
    ('111@111-sdf9sdaf0,dfe', 'invalid email')
})
def test_api_toolbox_validate_email(test_input, expected):
    r_status = requests.post(host_address + 'api/toolbox/validate_email',
                             json={'email': test_input})
    status = r_status.json()
    print(status)
    assert(status['response'] == expected)


@pytest.mark.parametrize("email, images, expected", {
    ('222@duke.edu', image_dir, 'ok'),
    ('qwer@dule.edu', image_dir2, 'ok')
})
def test_api_upload(email, images, expected):
    buffer = jtb.zip_dir_to_buffer(images)
    encoded_buf = jtb.encode_base64(buffer.read())

    valid_data_prefix = 'data:application/zip;base64,'
    image_string = valid_data_prefix + encoded_buf.decode('utf8')
    r_status = requests.post(host_address + "api/upload",
                             json={'email': email,
                                   'imageset': image_string})

    status = r_status.json()
    print(status['response'])
    togui = status['image']
    hist = status['hist']
    size = status['imgsize']
    print(size[0])
    with open(email + 'hist.txt', 'w') as f:
        for item in hist:
            f.write("%s\n" % item)

    assert (status['response'] == expected)


@pytest.mark.parametrize("email, action, expected", {
    ('222@duke.edu', '{"action": ["HistEq", "rgb"]}', 'ok'),
    ('qwer@dule.edu', '{"action": ["RevVid", "rgb"]}', 'ok'),
    ('222@duke.edu', '{"action": ["LogComp", "rgb"]}', 'ok')
})
def test_api_action(email, action, expected):
    import json

    data = json.loads(action)
    r_status = requests.post(host_address + "api/image-processing/action",
                             json={'email': email,
                                   'action': data})

    status = r_status.json()
    print(status['response'])
    image = status['image']
    brew_hist = status['brew_hist']
    size = status['imgsize']
    stat = status['actions']
    print(size[0])
    print(stat)
    print(brew_hist[0])
    print(image['1'])

    assert (status['response'] == expected)


def test_api_download():
    r_status = requests.post(host_address + "api/download_zip",
                             json={'email': '222@duke.edu',
                                   'which': 'image_data',
                                   'format': 'jpg'})
    print(r_status.content)
    jtb.unzip_buffer(r_status.content, 'tmp/unzip')


def main():
    test_api_toolbox_validate_email()
    test_api_upload()
    test_api_download()


if __name__ == '__main__':
    import sys
    sys.exit(main())
