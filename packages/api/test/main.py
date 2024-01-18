import requests
import json

url = "http://localhost:3000"

def test_create_team_and_timer():
    requests.post(url + "/reset")

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

    response = requests.get(url + "/team/" + team_id + "/timer/list")
    assert response.status_code == 200
    assert len(response.json()["data"]) == 1
    assert response.json()["data"][0]["id"] == timer_id


test_create_team_and_timer()
print("PASS test_create_team_and_timer")

def test_create_team_id_counter():
    requests.post(url + "/reset")
    
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