import pandas as pd
from openpyxl import load_workbook
import re
import itertools
import string
import uuid
import json

source = './dummy.xlsx'
metadata = ['Submission Date', 'uuid', '#lat_deg', '#lon_deg', '#photo']
ignore = ['#geocoded_column']


def excel_cols():
    n = 1
    while True:
        repeater = itertools.product(string.ascii_uppercase, repeat=n)
        yield from (''.join(group) for group in repeater)
        n += 1


def find_unit(c):
    u = re.search(r'\((.*?)\)', c)
    if u:
        return u.group(1)
    return False


def fill_with(c):
    if c in 'biufc':
        return 0
    return False


sheets = load_workbook(source, read_only=True).sheetnames
df = pd.read_excel(source, sheets[0])
df = df.drop(columns=ignore, axis=1)
df['uuid'] = [uuid.uuid4() for _ in range(len(df.index))]
strings = list(itertools.islice(excel_cols(), df.shape[1]))
col_rename = {}
config = []
for idx, col in enumerate(list(df.columns)):
    name = col.replace('#', '')
    dtype = str(df[col].dtypes.type)
    dtype = re.search(r'\'(.*?)\'', dtype)
    dtype = dtype.group(0)
    dtype = dtype.replace("'", "").replace('numpy.', '')
    unit = find_unit(name)
    name = name.split(' (')[0]
    name = name.strip().replace('_', ' ').title()
    meta = False
    if col in metadata:
        meta = True
    config.append({
        'name': name,
        'alias': strings[idx],
        'original': col,
        'unit': unit,
        'meta': meta,
        'dtype': dtype
        })
    col_rename.update({col: strings[idx]})

df = df.rename(columns=col_rename)
df = df.apply(lambda x: x.fillna(fill_with(x.dtype.kind)))
df.to_csv('./results/data.csv', index=False)
with open('./results/config.json', 'w') as f:
    json.dump(config, f)
