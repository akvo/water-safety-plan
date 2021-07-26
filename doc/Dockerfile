FROM amancevice/pandas:0.24.2-slim

WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY transform.py .

ENTRYPOINT ["python", "transform.py"]
