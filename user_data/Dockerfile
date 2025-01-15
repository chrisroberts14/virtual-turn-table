FROM python:3.13-alpine

WORKDIR /app
COPY . /app/user_data

# Install poetry
RUN pip install poetry
RUN poetry install --directory=user_data --no-root --without dev
EXPOSE 8002
CMD ["fastapi", "run", "user_data", "--port", "8002"]
