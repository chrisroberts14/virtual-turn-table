FROM python:3.12-alpine

WORKDIR /app
COPY . /app/bff
RUN pip install --no-cache-dir -r ./bff/requirements.txt
EXPOSE 8001
CMD ["fastapi", "run", "bff"]
