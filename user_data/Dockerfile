FROM python:3.13-alpine

WORKDIR /app
COPY . /app/user_data
RUN pip install --no-cache-dir -r ./user_data/requirements.txt
EXPOSE 8002
CMD ["fastapi", "run", "user_data", "--port", "8002"]
