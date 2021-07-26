from fastapi import FastAPI
import pandas as pd
import json

app = FastAPI(root_path="/api")


@app.get("/")
def read_main():
    return {"message": "Hello World"}


@app.get('/config')
def get_config():
    with open('./data/config.json', 'r') as cfg:
        return json.load(cfg)


@app.get('/data')
def get_data():
    return pd.read_csv('./data/data.csv').to_dict('records')


@app.get('/data/raw')
async def get_data_raw(page: int = 1, limit: int = 0):
    with open('./data/config.json', 'r') as cfg:
        cfg = json.load(cfg)
    columns = {}
    for col in cfg:
        columns.update({col["alias"]: col["original"]})
    data = pd.read_csv('./data/data.csv')
    if limit:
        end = limit * page
        if page == 1:
            limit = 0
        count = data.shape[1]
        data = data.iloc[limit:end]
        data = data.rename(columns=columns)
        next = page + 1
        prev = None
        if page > 1:
            prev = 'api/data/raw?page={}&limit={}'.format(page - 1, limit)
        return {
            'prev_page': prev,
            'count': count,
            'next_page': f'api/data/raw?page={next}&limit={limit}',
            'data': data.to_dict('records')
        }
    data = data.rename(columns=columns)
    return data.to_dict('records')
