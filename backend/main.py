from enum import Enum
import uvicorn
from fastapi import FastAPI
import pandas as pd
import json
import os

app = FastAPI(root_path="/api")

with open('./data/configs.json', 'r') as cfg:
    api_config = json.load(cfg)

registration_config = [d for d in api_config if d['type'] == "registration"]

uuid_config = {}
for ac in api_config:
    ac_name = ac['file']
    if "registration" in ac_name:
        ac_name = "registration"
    for dfn in ac['definition']:
        if dfn['original'] == "uuid":
            uuid_config.update(
                {ac_name: {
                    "alias": dfn["alias"],
                    "type": ac["type"]
                }})

metadata = [
    "Submission Date", "Lat", "Lon", "Uuid", "Photo", "Status", "Location"
]


def get_csv_files(name, path=False):
    csv_files = {}
    for root, dirs, files in os.walk("./data"):
        for file in files:
            if name in file:
                if not path:
                    file = file.replace('.csv', '')
                    csv_files.update({file: file})
                else:
                    return os.path.join(root, file)
    return csv_files


def replace_alias(x):
    x = x.replace("#", "")
    x = x.replace(" ", "_")
    return x.lower()


def get_uuid():
    df = pd.read_csv("./data/registration.csv")
    alias = uuid_config["registration"]["alias"]
    df = df[[alias]]
    uuid = {}
    for d in df.to_dict("records"):
        uuid.update({d[alias]: d[alias]})
    return uuid


FileName = Enum('FileName', get_csv_files("csv"))
Instance = Enum('Instance', get_uuid())


class DataType(str, Enum):
    registration = "registration"
    monitoring = "monitoring"
    non_compliance = "non-compliance"


@app.get("/health-check")
def health_check():
    return "OK"


@app.get("/")
def read_main():
    return {"message": "Hello World"}


@app.get('/config')
def get_all_config():
    data = [d for d in api_config]
    for d in data:
        d.update({'data_url': "/api/data/{}".format(d['file'])})
    return data


@app.get('/config/{data_type:path}')
def get_config(data_type: DataType):
    if data_type == "registration":
        return registration_config
    data = [d for d in api_config if d['type'] == data_type]
    for d in data:
        d.update({'data_url': "/api/data/{}".format(d['file'])})
    return data


@app.get('/datapoints')
def get_data_point():
    data = pd.read_csv("./data/registration.csv")
    definition = registration_config[0]['definition']
    for d in definition:
        if d['name'] in metadata:
            data = data.rename(
                columns={d["alias"]: replace_alias(d["original"])})
    data["coordinates"] = data.apply(lambda x: [x["lon"], x["lat"]], axis=1)
    meta = [d for d in list(data) if len(d) > 1]
    return data[meta].to_dict('records')


@app.get("/datapoints/{instance:path}")
def get_instance(instance: Instance):
    data = []
    i = str(instance).replace("Instance.", "")
    for ucf in uuid_config:
        curr = uuid_config[ucf]
        file = [get_csv_files(ucf, True)][0]
        df = pd.read_csv(file)
        df = df[df[curr["alias"]] == i]
        data.append({
            "data": df.to_dict("records"),
            "name": "registration" if "registration" in ucf else ucf
        })
    return data


@app.get('/data/{file_name:path}')
def get_data(file_name: FileName):
    file = str(file_name).replace("FileName.", "")
    file = get_csv_files(file, True)
    return pd.read_csv(file).to_dict('records')


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)
