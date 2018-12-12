import pytest
from database_func_call import save_new_record, query_a_record, update_a_record, Imageset

from pymodm import connect

# connect to mongodb database
connect("mongodb://void001:goduke18@ds129484.mlab.com:29484/bme590final")


@pytest.mark.parametrize("test_input, expected", [
    ({'user_email': '111@duke.edu', 'image_data': '200dfjalejroiwqjf300'}, '111@duke.edu'),
    ({'user_email': '222@duke.edu', 'image_data': '200dfjalejroiwqjf300'}, '222@duke.edu'),
    ({'user_email': '333@duke.edu', 'image_data': '200dfjalejroiwqjf300'}, '333@duke.edu'),
    ({'user_email': '444@duke.edu', 'image_data': '200dfjalejroiwqjf300'}, '444@duke.edu'),
    ({'user_email': '555@duke.edu', 'image_data': '200dfjalejroiwqjf300'}, '555@duke.edu'),
    ({'user_email': '666@duke.edu', 'image_data': '200dfjalejroiwqjf300'}, '666@duke.edu'),
    ({'user_email': '777@duke.edu', 'image_data': '200dfjalejroiwqjf300'}, '777@duke.edu'),
    ({'user_email': '888@duke.edu', 'image_data': '200dfjalejroiwqjf300'}, '888@duke.edu'),
    ({'user_email': '999@duke.edu', 'image_data': '200dfjalejroiwqjf300'}, '999@duke.edu')
])
def test_save_new_record(test_input, expected):
    save_new_record(test_input)
    q = Imageset.objects.raw({"_id": test_input['user_email']}).first()
    assert(q.user_email == expected)


@pytest.mark.parametrize("test_input, expected", [
    ({'user_email': '111@duke.edu', 'image_data': '200dfjalejroiwqjf300'}, '111@duke.edu'),
    ({'user_email': '222@duke.edu', 'image_data': '200dfjalejroiwqjf300'}, '222@duke.edu'),
    ({'user_email': '333@duke.edu', 'image_data': '200dfjalejroiwqjf300'}, '333@duke.edu'),
    ({'user_email': '444@duke.edu', 'image_data': '200dfjalejroiwqjf300'}, '444@duke.edu'),
    ({'user_email': '555@duke.edu', 'image_data': '200dfjalejroiwqjf300'}, '555@duke.edu'),
    ({'user_email': '666@duke.edu', 'image_data': '200dfjalejroiwqjf300'}, '666@duke.edu'),
    ({'user_email': '777@duke.edu', 'image_data': '200dfjalejroiwqjf300'}, '777@duke.edu'),
    ({'user_email': '888@duke.edu', 'image_data': '200dfjalejroiwqjf300'}, '888@duke.edu'),
    ({'user_email': '999@duke.edu', 'image_data': '200dfjalejroiwqjf300'}, '999@duke.edu')
])
def test_query_a_record(test_input, expected):
    q = query_a_record(test_input['user_email'], 'user_email')
    assert(q == expected)


@pytest.mark.parametrize("test_input, test_field, expected", [
    ({'user_email': '111@duke.edu', 'image_data': '200dfjalejroiwqjf300'}, 'image_data', '200dfjalejroiwqjf200'),
    ({'user_email': '222@duke.edu', 'image_data': '200dfjalejroiwqjf300'}, 'image_data', '200dfjalejroiwqjf200'),
    ({'user_email': '333@duke.edu', 'image_data': '200dfjalejroiwqjf300'}, 'image_data', '200dfjalejroiwqjf200'),
    ({'user_email': '444@duke.edu', 'image_data': '200dfjalejroiwqjf300'}, 'image_data', '200dfjalejroiwqjf200'),
    ({'user_email': '555@duke.edu', 'image_data': '200dfjalejroiwqjf300'}, 'image_data', '200dfjalejroiwqjf200'),
    ({'user_email': '666@duke.edu', 'image_data': '200dfjalejroiwqjf300'}, 'image_data', '200dfjalejroiwqjf200'),
    ({'user_email': '777@duke.edu', 'image_data': '200dfjalejroiwqjf300'}, 'image_data', '200dfjalejroiwqjf200'),
    ({'user_email': '888@duke.edu', 'image_data': '200dfjalejroiwqjf300'}, 'image_data', '200dfjalejroiwqjf200'),
    ({'user_email': '999@duke.edu', 'image_data': '200dfjalejroiwqjf300'}, 'image_data', '200dfjalejroiwqjf200'),
    ({'user_email': '111@duke.edu', 'image_data': '200dfjalejroiwqjf300'}, 'actions', 'hist1'),
    ({'user_email': '111@duke.edu', 'image_data': '200dfjalejroiwqjf300'}, 'actions', 'hist2'),
    ({'user_email': '111@duke.edu', 'image_data': '200dfjalejroiwqjf300'}, 'actions', 'hist3'),
    ({'user_email': '111@duke.edu', 'image_data': '200dfjalejroiwqjf300'}, 'actions', 'hist4'),
    ({'user_email': '111@duke.edu', 'image_data': '200dfjalejroiwqjf300'}, 'actions', 'hist5'),
    ({'user_email': '111@duke.edu', 'image_data': '200dfjalejroiwqjf300'}, 'actions', 'hist6'),
    ({'user_email': '111@duke.edu', 'image_data': '200dfjalejroiwqjf300'}, 'actions', 'hist7'),
    ({'user_email': '111@duke.edu', 'image_data': '200dfjalejroiwqjf300'}, 'actions', 'hist8'),
    ({'user_email': '111@duke.edu', 'image_data': '200dfjalejroiwqjf300'}, 'actions', 'hist9')
])
def test_update_a_record(test_input, test_field, expected):
    update_a_record(test_input['user_email'], test_field, expected)
    value = query_a_record(test_input['user_email'], test_field)
    if isinstance(value, list):
        assert(value[-1] == expected)
    else:
        assert(value == expected)


