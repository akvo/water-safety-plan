import pandas as pd
from openpyxl import load_workbook
import re
import itertools
import string
import uuid
import json
from pathlib import Path

source = './dummy.xlsx'
metadata = ['Submission Date']
metadata_prefix = ["#"]
ignore = ["datapoint"]
Path("./data").mkdir(parents=True, exist_ok=True)


def excel_cols():
    n = 1
    while True:
        azstring = itertools.product(string.ascii_uppercase, repeat=n)
        azstring = (''.join(group) for group in azstring)
        yield from azstring
        n += 1


def findUnit(c):
    u = re.search(r'\((.*?)\)', c)
    if u:
        return u.group(1)
    return False


sheets = load_workbook(source, read_only=True).sheetnames
sheets = list(filter(lambda x: '|' in x, sheets))
registration = list(filter(lambda x: 'registration' in x, sheets))[0]
regdf = pd.read_excel(source, registration)
uuid_list = [uuid.uuid4() for _ in range(len(regdf.index))]

configs = []
for tab in sheets:
    definitions = []
    col_rename = {}
    sheet = tab.split('|')
    sheet = {
        'type': sheet[0],
        'name': sheet[1],
        'file': sheet[1].lower().replace(' ', '_')
    }
    df = pd.read_excel(source, tab)
    df['uuid'] = df['datapoint'].apply(lambda x: uuid_list[int(x) - 1])
    df = df.drop(columns=ignore, axis=1)
    strings = list(itertools.islice(excel_cols(), df.shape[1]))
    for idx, col in enumerate(list(df.columns)):
        name = col.replace('#', '')
        dtype = str(df[col].dtypes.type)
        dtype = re.search(r'\'(.*?)\'', dtype).group(0)
        dtype = dtype.replace("'", "").replace('numpy.', '')
        unit = findUnit(name)
        name = name.split(' (')[0]
        name = name.strip().replace('_', ' ').title()
        meta = False
        if col in metadata:
            meta = True
        definitions.append({
            'name': name,
            'alias': strings[idx],
            'original': col,
            'unit': unit,
            'meta': meta,
            'dtype': dtype
        })
        col_rename.update({col: strings[idx]})
    df = df.rename(columns=col_rename)
    df = df.apply(lambda x: x.fillna(0)
                  if x.dtype.kind in 'biufc' else x.fillna(False))
    result = './data/{}.csv'.format(sheet['type'])
    if tab != registration:
        Path("./data/{}".format(sheet['type'])).mkdir(parents=True,
                                                      exist_ok=True)
        result = "./data/{}/{}.csv".format(sheet['type'], sheet['file'])
    df.to_csv(result, index=False)
    sheet.update({'definition': definitions})
    configs.append(sheet)
with open('./data/configs.json', 'w') as f:
    json.dump(configs, f)
