FROM python:3.13-alpine
RUN apk add --no-cache curl
WORKDIR /app
COPY . /app/bff
RUN pip install --no-cache-dir -r ./bff/requirements.txt
EXPOSE 8000
CMD ["fastapi", "run", "bff", "--port", "8000"]
