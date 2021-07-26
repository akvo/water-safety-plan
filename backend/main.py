from fastapi import FastAPI

app = FastAPI(root_path="/api")


@app.get("/")
def read_main():
    return {"message": "Hello World"}
