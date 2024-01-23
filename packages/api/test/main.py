import requests
import json

url = "http://localhost:3000"


def _reset():
    requests.post(url + "/_test/reset")

def _clock_pause():
    requests.post(url + "/_test/clock/pause")

def _clock_resume():
    requests.post(url + "/_test/clock/resume")

def _clock_tick(ms):
    requests.post(url + "/_test/clock/tick", json={"ms": ms})


def test_create_team_and_timer():
    _reset()
    _clock_pause()

    team = {
        "name": "test team",
    }
    response = requests.post(url + "/team/create", json=team)
    assert response.status_code == 200

    team_id = response.json()["data"]["id"]

    # get team by id
    response = requests.get(url + "/team/" + team_id)
    assert response.status_code == 200
    assert response.json()["data"]["name"] == "test team"

    timer = {
        "title": "test timer",
        "duration": 60,
    }

    response = requests.post(url + "/team/" + team_id + "/timer/create", json=timer)
    assert response.status_code == 200

    timer_id = response.json()["data"]["id"]

    response = requests.get(url + "/team/" + team_id + "/timer/list")
    assert response.status_code == 200
    assert len(response.json()["data"]) == 1
    assert response.json()["data"][0]["id"] == timer_id


test_create_team_and_timer()
print("PASS test_create_team_and_timer")

def test_create_team_id_counter():
    _reset()
    _clock_pause()

    team = {
        "name": "test team",
    }
    response = requests.post(url + "/team/create", json=team)
    assert response.status_code == 200

    team_id = response.json()["data"]["id"]

    response = requests.post(url + "/team/create", json=team)
    assert response.status_code == 200

    team_id2 = response.json()["data"]["id"]

    assert team_id != team_id2


test_create_team_id_counter()
print("PASS test_create_team_id_counter")


def test_create_team_and_timer_id_counter():
    _reset()
    _clock_pause()

    team = {
        "name": "test team",
    }
    response = requests.post(url + "/team/create", json=team)
    assert response.status_code == 200

    team_id = response.json()["data"]["id"]

    timer = {
        "title": "test timer",
        "duration": 60,
    }

    response = requests.post(url + "/team/" + team_id + "/timer/create", json=timer)
    assert response.status_code == 200

    timer_id = response.json()["data"]["id"]

    response = requests.post(url + "/team/" + team_id + "/timer/create", json=timer)
    assert response.status_code == 200

    timer_id2 = response.json()["data"]["id"]

    assert timer_id != timer_id2


test_create_team_and_timer_id_counter()
print("PASS test_create_team_and_timer_id_counter")


def test_create_team_and_timer_and_start_timer():
    _reset()
    _clock_pause()

    team = {
        "name": "test team",
    }
    response = requests.post(url + "/team/create", json=team)
    assert response.status_code == 200

    team_id = response.json()["data"]["id"]

    timer = {
        "title": "test timer",
        "duration": 60,
    }

    response = requests.post(url + "/team/" + team_id + "/timer/create", json=timer)
    assert response.status_code == 200

    timer_id = response.json()["data"]["id"]

    response = requests.post(url + "/team/" + team_id + "/timer/" + timer_id + "/start")
    assert response.status_code == 200

    response = requests.get(url + "/team/" + team_id + "/timer/" + timer_id)
    assert response.status_code == 200
    assert response.json()["data"]["status"] == "RUNNING"


test_create_team_and_timer_and_start_timer()
print("PASS test_create_team_and_timer_and_start_timer")


def test_create_team_and_timer_and_start_timer_and_pause_timer():
    _reset()
    _clock_pause()

    team = {
        "name": "test team",
    }
    response = requests.post(url + "/team/create", json=team)
    assert response.status_code == 200

    team_id = response.json()["data"]["id"]

    timer = {
        "title": "test timer",
        "duration": 60,
    }

    response = requests.post(url + "/team/" + team_id + "/timer/create", json=timer)
    assert response.status_code == 200

    timer_id = response.json()["data"]["id"]

    response = requests.post(url + "/team/" + team_id + "/timer/" + timer_id + "/start")
    assert response.status_code == 200

    response = requests.post(url + "/team/" + team_id + "/timer/" + timer_id + "/pause")
    assert response.status_code == 200

    response = requests.get(url + "/team/" + team_id + "/timer/" + timer_id)
    assert response.status_code == 200
    assert response.json()["data"]["status"] == "PAUSED"


test_create_team_and_timer_and_start_timer_and_pause_timer()
print("PASS test_create_team_and_timer_and_start_timer_and_pause_timer")


def test_create_team_and_timer_and_start_timer_and_pause_timer_and_resume_timer():
    _reset()
    _clock_pause()

    team = {
        "name": "test team",
    }
    response = requests.post(url + "/team/create", json=team)
    assert response.status_code == 200

    team_id = response.json()["data"]["id"]

    timer = {
        "title": "test timer",
        "duration": 60,
    }

    response = requests.post(url + "/team/" + team_id + "/timer/create", json=timer)
    assert response.status_code == 200

    timer_id = response.json()["data"]["id"]

    response = requests.post(url + "/team/" + team_id + "/timer/" + timer_id + "/start")
    assert response.status_code == 200

    # get team
    response = requests.get(url + "/team/" + team_id)
    assert response.status_code == 200

    response = requests.post(url + "/team/" + team_id + "/timer/" + timer_id + "/pause")
    assert response.status_code == 200

    response = requests.post(url + "/team/" + team_id + "/timer/" + timer_id + "/start")
    assert response.status_code == 200

    response = requests.get(url + "/team/" + team_id + "/timer/" + timer_id)
    assert response.status_code == 200
    assert response.json()["data"]["status"] == "RUNNING"


test_create_team_and_timer_and_start_timer_and_pause_timer_and_resume_timer()
print("PASS test_create_team_and_timer_and_start_timer_and_pause_timer_and_resume_timer")


def test_create_team_and_timer_and_start_timer_and_pause_timer_and_check_time_left():
    _reset()
    _clock_pause()

    team = {
        "name": "test team",
    }
    response = requests.post(url + "/team/create", json=team)
    assert response.status_code == 200

    team_id = response.json()["data"]["id"]

    timer = {
        "title": "test timer",
        "duration": 60,
    }

    response = requests.post(url + "/team/" + team_id + "/timer/create", json=timer)
    assert response.status_code == 200

    timer_id = response.json()["data"]["id"]

    response = requests.post(url + "/team/" + team_id + "/timer/" + timer_id + "/start")
    assert response.status_code == 200

    _clock_tick(2000)

    response = requests.post(url + "/team/" + team_id + "/timer/" + timer_id + "/pause")
    assert response.status_code == 200

    response = requests.get(url + "/team/" + team_id + "/timer/" + timer_id)
    assert response.status_code == 200
    assert response.json()["data"]["timeLeft"] == 58


test_create_team_and_timer_and_start_timer_and_pause_timer_and_check_time_left()
print("PASS test_create_team_and_timer_and_start_timer_and_pause_timer_and_check_time_left")


def test_actual_timer():
    _reset()
    _clock_resume()

    team = {
        "name": "test team",
    }
    response = requests.post(url + "/team/create", json=team)
    assert response.status_code == 200

    team_id = response.json()["data"]["id"]

    timer = {
        "title": "test timer",
        "duration": 60,
    }

    response = requests.post(url + "/team/" + team_id + "/timer/create", json=timer)
    assert response.status_code == 200

    timer_id = response.json()["data"]["id"]

    response = requests.post(url + "/team/" + team_id + "/timer/" + timer_id + "/start")
    assert response.status_code == 200

    import time
    time.sleep(2)

    response = requests.post(url + "/team/" + team_id + "/timer/" + timer_id + "/pause")
    assert response.status_code == 200

    response = requests.get(url + "/team/" + team_id + "/timer/" + timer_id)
    assert response.status_code == 200
    assert response.json()["data"]["timeLeft"] < 59


test_actual_timer()
print("PASS actual_timer")
