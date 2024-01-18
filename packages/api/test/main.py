import requests
import json

url = "http://localhost:3000"

def test_create_team_and_timer():
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