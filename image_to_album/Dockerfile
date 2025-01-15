FROM python:3.13-alpine

WORKDIR /app
COPY . /app/image_to_album

RUN pip install poetry
RUN poetry install --directory=image_to_album --no-root --without dev
EXPOSE 8001
CMD ["fastapi", "run", "image_to_album", "--port", "8001"]
