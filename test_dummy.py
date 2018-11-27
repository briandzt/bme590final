import pytest


@pytest.fixture
def data():
    assert 1 == 1
    return 1
