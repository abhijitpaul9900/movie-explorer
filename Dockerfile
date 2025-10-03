FROM node:22.20.0 AS build

WORKDIR /frontend

COPY frontend/package.json frontend/package-lock.json ./

RUN npm install

COPY frontend/ .

RUN npm run build

RUN npm run test

FROM python:3.13.7-slim

WORKDIR /app

RUN apt-get update && apt-get install -y libpq-dev gcc g++ && apt-get clean

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY app/ /app/

COPY --from=build /frontend/build /app/static

RUN PYTHONPATH=. pytest -vvv

EXPOSE 8000

ENV BACKEND_URL=http://0.0.0.0:8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
