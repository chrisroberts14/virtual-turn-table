FROM python:3.13-alpine

WORKDIR /app
COPY . /app/bff
RUN pip install poetry
RUN poetry install --directory=bff --no-root --without dev
EXPOSE 8000
CMD ["fastapi", "run", "bff", "--port", "8000"]
