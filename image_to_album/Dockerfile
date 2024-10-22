FROM python:3.13-alpine

WORKDIR /app
COPY . /app/image_to_album
RUN pip install --no-cache-dir -r ./image_to_album/requirements.txt
EXPOSE 8001
CMD ["fastapi", "run", "image_to_album", "--port", "8001"]
